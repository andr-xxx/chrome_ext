import {MINUTE, HOUR, CLOSE_OVERLAY} from './constants';

export function getFormattedDayToday(dateNow = new Date()) {
  return `${dateNow.getDate()}-${dateNow.getMonth() + 1}-${dateNow.getFullYear()}`
}

export function checkIsWorkingDayAndTime(workingDays, workingTime) {
  const now = new Date();
  const dayOfWeekToday = now.getDay();
  if (workingDays[dayOfWeekToday].checked) {
    const timeNow = formatTime(new Date(), 'time');
    if (timeNow > workingTime.startTime && timeNow < workingTime.endTime) {
      return true
    }
  }
  return false
}

export function showNotification() {
  chrome.notifications.create('Hello', {
    type: 'basic',
    iconUrl: '../images/icon-16.png',
    title: 'REMEMBERER',
    message: 'PLEASE LOG YOUR TIME',
  }, () => {})
}

export function closeOverlayToAllTabs() {
  chrome.tabs.query({}, function(tabs) {
    for (let i = 0; i < tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, {target: CLOSE_OVERLAY});
    }
  });
}

export function formatTime(time, marker) {
  if (marker === 'time') {
    let hours = new Date(time).getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = new Date(time).getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes}`
  } else if (marker === 'duration') {
    let hours = parseInt(time / HOUR);
    let minutes = parseInt((time - hours * HOUR) / MINUTE);
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}-${minutes}`
  }
}