const adBlockerScript = {
  id: 'ad-blocker',
  matches: ['https://*.twitch.tv/*'],
  js: ['inject.js'],
  runAt: 'document_start',
  world: 'MAIN',
  allFrames: true,
};

async function applyEnabledSetting() {
  const { enabled = true } = await chrome.storage.local.get('enabled');
  const registeredScripts = await chrome.scripting.getRegisteredContentScripts({ ids: [adBlockerScript.id] });
  const isRegistered = registeredScripts.length > 0;

  if (enabled && !isRegistered) await chrome.scripting.registerContentScripts([adBlockerScript]);
  if (!enabled && isRegistered) await chrome.scripting.unregisterContentScripts({ ids: [adBlockerScript.id] });

  await chrome.declarativeNetRequest.updateEnabledRulesets(
    enabled ? { enableRulesetIds: ['ad-servers'] } : { disableRulesetIds: ['ad-servers'] },
  );
}

chrome.runtime.onInstalled.addListener(applyEnabledSetting);
chrome.runtime.onStartup.addListener(applyEnabledSetting);
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) applyEnabledSetting();
});
