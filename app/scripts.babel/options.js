import {DEFAULT_INTERVAL, DEFAULT_START_TIME, DEFAULT_END_TIME, DEFAULT_WORKING_DAYS} from './constants';

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
    'rememberer-interval': interval,
    'rememberer-start-time': startTime,
    'rememberer-end-time': endTime,
    'rememberer-working-days': workingDays,
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
    'rememberer-interval': DEFAULT_INTERVAL,
    'rememberer-start-time': DEFAULT_START_TIME,
    'rememberer-end-time': DEFAULT_END_TIME,
    'rememberer-working-days': DEFAULT_WORKING_DAYS,
  }, function (response) {
    document.getElementById('interval').value = response['rememberer-interval'];
    document.getElementById('start-time').value = response['rememberer-start-time'];
    document.getElementById('end-time').value = response['rememberer-end-time'];

    Array.from(document.querySelectorAll('.days'))
      .forEach((el, index)=> {
        el.checked = response['rememberer-working-days'][index].checked
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