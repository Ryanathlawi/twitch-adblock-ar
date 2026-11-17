const enabledSwitch = document.getElementById('enabled-switch');
const statusText = document.getElementById('status-text');
const protectedCount = document.getElementById('protected-count');
const reloadHint = document.getElementById('reload-hint');

function showEnabledState(enabled) {
  enabledSwitch.checked = enabled;
  statusText.textContent = enabled ? 'الحماية شغّالة' : 'الحماية موقّفة';
}

chrome.storage.local.get({ enabled: true, protectedCount: 0 }, (settings) => {
  showEnabledState(settings.enabled);
  protectedCount.textContent = settings.protectedCount.toLocaleString('ar');
});

enabledSwitch.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: enabledSwitch.checked });
  showEnabledState(enabledSwitch.checked);
  reloadHint.hidden = false;
});
