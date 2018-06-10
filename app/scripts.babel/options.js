import {
  DEFAULT_INTERVAL,
  DEFAULT_START_TIME,
  DEFAULT_END_TIME,
  DEFAULT_WORKING_DAYS,
  INTERVAL,
  START_TIME,
  END_TIME,
  WORKING_DAYS,
} from './constants';

function saveOptions() {
  const interval = document.getElementById('interval').value;
  const startTime = document.getElementById('start-time').value;
  const endTime = document.getElementById('end-time').value;

  const workingDays = Array.from(document.querySelectorAll('.days'))
    .map(item => {
      return {
        day: item.value,
        checked: item.checked
      }
    });

  chrome.storage.sync.set({
    INTERVAL: interval,
    START_TIME: startTime,
    END_TIME: endTime,
    WORKING_DAYS: workingDays,
  }, function () {
    updateSetting(() => {
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 2000);
    });
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    INTERVAL: DEFAULT_INTERVAL,
    START_TIME: DEFAULT_START_TIME,
    END_TIME: DEFAULT_END_TIME,
    WORKING_DAYS: DEFAULT_WORKING_DAYS,
  }, function (response) {
    document.getElementById('interval').value = response[INTERVAL];
    document.getElementById('start-time').value = response[START_TIME];
    document.getElementById('end-time').value = response[END_TIME];

    Array.from(document.querySelectorAll('.days'))
      .forEach((el, index) => {
        el.checked = response[WORKING_DAYS][index].checked
      })
  });
}

function updateSetting(cb) {
  chrome.runtime.sendMessage({
    target: 'UPDATE_OPTIONS'
  }, (response) => {
    if (response) {
      if (response.status === 'done') {
        cb();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);