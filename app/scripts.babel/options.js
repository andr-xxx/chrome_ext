const DEFAULT_INTERVAL = 60;

function save_options() {
  const interval = document.getElementById('interval').value;
  chrome.storage.sync.set({
    'rememberer-interval': interval
  }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    'rememberer-interval': DEFAULT_INTERVAL,
  }, function(items) {
    document.getElementById('interval').value = items['rememberer-interval'];
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);