'use strict';
import Storage from './storage';
chrome.runtime.onInstalled.addListener(function (details) {
  // console.log('previousVersion', details.previousVersion);
});


const storage = new Storage();
let dateToday = getActualDate();

storage.getFromStorage(dateToday, (response) => {
  if (!response[dateToday]) {
    storage.setInStorage(dateToday, []);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.target) {
    case 'SAVE_CURRENT_TASK':
      storage.saveCurrentTask(request)
        .then( () => {
          sendResponse({status: 'done'})
        });
      break;
    case 'GET_TICKETS_LIST':
      storage.getFromStorage(dateToday)
        .then((ticketsList) => {
          sendResponse({
            status: 'done',
            ticketsList: ticketsList[dateToday]
          });
        });
      break;
  }

  return true;
});

function getActualDate() {
  const dateNow = new Date();
  return `${dateNow.getDate()}-${dateNow.getMonth() + 1}-${dateNow.getFullYear()}`
}

chrome.notifications.create('Hello', {
  type: 'basic',
  iconUrl: '../images/icon-16.png',
  title: 'title',
  message: 'HEELLLOOO',
}, () => {
});
