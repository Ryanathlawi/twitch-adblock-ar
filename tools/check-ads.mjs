import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const extensionFolder = resolve(import.meta.dirname, '../extension');
const withExtension = process.argv[2] !== 'without-extension';
const secondsPerChannel = Number(process.argv[3] || 45);
const channelCount = Number(process.argv[4] || 6);

const chrome = spawn(chromePath, [
  '--headless=new',
  '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36',
  '--remote-debugging-pipe',
  '--enable-unsafe-extension-debugging',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'twitch-adblock-check-'))}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--autoplay-policy=no-user-gesture-required',
  '--mute-audio',
  'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });

let nextMessageId = 1;
const pendingReplies = new Map();
const eventHandlers = [];
let unreadText = '';

chrome.stdio[4].on('data', (chunk) => {
  unreadText += chunk.toString();
  let endOfMessage;
  while ((endOfMessage = unreadText.indexOf('\0')) >= 0) {
    const message = JSON.parse(unreadText.slice(0, endOfMessage));
    unreadText = unreadText.slice(endOfMessage + 1);
    if (message.id && pendingReplies.has(message.id)) {
      pendingReplies.get(message.id)(message);
      pendingReplies.delete(message.id);
    } else {
      eventHandlers.forEach((handler) => handler(message));
    }
  }
});

function send(method, params = {}, sessionId) {
  const id = nextMessageId++;
  chrome.stdio[3].write(JSON.stringify({ id, method, params, sessionId }) + '\0');
  return new Promise((reply) => pendingReplies.set(id, reply));
}

const wait = (seconds) => new Promise((done) => setTimeout(done, seconds * 1000));

async function liveChannels() {
  const response = await fetch('https://gql.twitch.tv/gql', {
    method: 'POST',
    headers: { 'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko' },
    body: JSON.stringify({ query: `{ streams(first: ${channelCount}) { edges { node { broadcaster { login } } } } }` }),
  });
  const { data } = await response.json();
  return data.streams.edges.map((edge) => edge.node.broadcaster.login);
}

let currentChannel = '';
const results = {};

eventHandlers.push(async ({ method, params, sessionId }) => {
  if (method === 'Target.attachedToTarget') {
    const childSession = params.sessionId;
    await send('Network.enable', {}, childSession);
    await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true }, childSession);
    await send('Runtime.runIfWaitingForDebugger', {}, childSession);
  }
  if (method === 'Network.requestWillBeSent' && params.request.postData?.includes('PlaybackAccessToken')) {
    const playerType = params.request.postData.match(/"playerType":"(\w+)"/)?.[1];
    const sendsDeviceId = Object.keys(params.request.headers).some((name) => /device-?id/i.test(name));
    results[currentChannel].playerTypes.add(`${playerType}${sendsDeviceId ? '+device-id' : ''}`);
  }
  if (method !== 'Network.responseReceived') return;
  if (!params.response.url.includes('.m3u8')) return;
  const { result } = await send('Network.getResponseBody', { requestId: params.requestId }, sessionId);
  if (!result?.body) return;
  const playlistText = result.base64Encoded ? Buffer.from(result.body, 'base64').toString() : result.body;
  results[currentChannel].playlists++;
  if (/stitched|Amazon/.test(playlistText)) results[currentChannel].playlistsWithAds++;
});

if (withExtension) {
  const loaded = await send('Extensions.loadUnpacked', { path: extensionFolder });
  if (loaded.error) throw new Error(loaded.error.message);
  await wait(3);
}
await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true });

for (const channel of await liveChannels()) {
  currentChannel = channel;
  results[channel] = { playlists: 0, playlistsWithAds: 0, playerTypes: new Set() };
  const { result } = await send('Target.createTarget', { url: `https://www.twitch.tv/${channel}` });
  await wait(secondsPerChannel);
  await send('Target.closeTarget', { targetId: result.targetId });
  const { playlists, playlistsWithAds, playerTypes } = results[channel];
  console.log(`${channel}: ${playlistsWithAds}/${playlists} playlists with ads, playerType=${[...playerTypes].join(',')}`);
}

chrome.kill();
