(() => {
  const originalFetch = window.fetch;
  const adPlayerType = '"playerType":"site"';
  const adFreePlayerType = '"playerType":"embed"';
  const deviceHeadersThatTriggerAds = ['X-Device-Id', 'Device-ID'];

  window.fetch = function (input, init) {
    const requestUrl = typeof input === 'string' ? input : input?.url || '';
    const isTwitchGqlRequest = requestUrl.includes('gql.twitch.tv');
    const isPlaybackTokenRequest = typeof init?.body === 'string' && init.body.includes('PlaybackAccessToken');

    if (isTwitchGqlRequest && isPlaybackTokenRequest) {
      const headers = new Headers(init.headers);
      deviceHeadersThatTriggerAds.forEach((name) => headers.delete(name));
      init = { ...init, headers, body: init.body.replaceAll(adPlayerType, adFreePlayerType) };
      window.postMessage({ twitchAdblockArProtectedStream: true }, '*');
    }
    return originalFetch.call(this, input, init);
  };
})();
