'use strict';
import Storage from './storage';

chrome.runtime.onInstalled.addListener(function (details) {
  // console.log('previousVersion', details.previousVersion);
});


const storage = new Storage();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.target) {
    case 'SAVE_CURRENT_TASK':
      storage.saveCurrentTask(request)
        .then(() => {
          sendResponse({status: 'done'})
        });
      break;
    case 'GET_TICKETS_LIST':
      storage.getFromStorage()
        .then((ticketsList) => {
          sendResponse({
            status: 'done',
            ticketsList: ticketsList
          });
        });
      break;
  }

  return true;
});

// setInterval(() => {
//   chrome.notifications.create('Hello', {
//     type: 'basic',
//     iconUrl: '../images/icon-16.png',
//     title: 'title',
//     message: 'HEELLLOOO',
//   }, () => {
//   });
// }, 5000);
