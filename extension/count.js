addEventListener('message', (event) => {
  const isFromThisPage = event.source === window;
  if (!isFromThisPage || !event.data?.twitchAdblockArProtectedStream) return;

  chrome.storage.local.get({ protectedCount: 0 }, ({ protectedCount }) => {
    chrome.storage.local.set({ protectedCount: protectedCount + 1 });
  });
});
