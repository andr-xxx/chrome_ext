const DEFAULT_INTERVAL = 60;
const DEFAULT_START_TIME = '09:00';
const DEFAULT_END_TIME = '19:00';
const DEFAULT_WORKING_DAYS = [
  {day: "Sunday", checked: false},
  {day: "Monday", checked: true},
  {day: "Tuesday", checked: true},
  {day: "Wednesday", checked: true},
  {day: "Thursday", checked: true},
  {day: "Friday", checked: true},
  {day: "Saturday", checked: false}
];

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

  console.log(workingDays)
  chrome.storage.sync.set({
    'rememberer-interval': interval,
    'rememberer-start-time': startTime,
    'rememberer-end-time': endTime,
    'rememberer-working-days': workingDays,
  }, function () {
    updateSetting(interval, () => {
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

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);