export function getFormattedDayToday(dateNow = new Date()) {
  return `${dateNow.getDate()}-${dateNow.getMonth() + 1}-${dateNow.getFullYear()}`
}

export function checkIsWorkingDayAndTime(workingDays, workingTime) {
  const now = new Date();
  const dayOfWeekToday = now.getDay();
  if (workingDays[dayOfWeekToday].checked) {
    const timeNow = `${now.getHours()}:${now.getMinutes()}`;
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
    for (let i=0; i<tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, {target: 'CLOSE_OVERLAY'});
    }
  });
}