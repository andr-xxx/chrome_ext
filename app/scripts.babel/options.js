const DEFAULT_INTERVAL = 60;

function save_options() {
  const interval = document.getElementById('interval').value;
  chrome.storage.sync.set({
    'rememberer-interval': interval
  }, function() {
    updateSetting(interval, () => {
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });
  });
}

function restore_options() {
  chrome.storage.sync.get({
    'rememberer-interval': DEFAULT_INTERVAL,
  }, function(items) {
    document.getElementById('interval').value = items['rememberer-interval'];
  });
}

function updateSetting(newInterval, cb) {
  chrome.runtime.sendMessage({
    interval: newInterval,
    target: 'UPDATE_OPTIONS'
  }, (response) => {
    if (response) {
      if (response.status === 'done') {
        cb();
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);