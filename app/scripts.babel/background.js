'use strict';
import Storage from './storage';

const DEFAULT_INTERVAL = 60;

chrome.runtime.onInstalled.addListener(function (details) {
  // console.log('previousVersion', details.previousVersion);
});

const storage = new Storage();
let latestInterval;


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
    case 'UPDATE_OPTIONS':
      clearInterval(latestInterval);
      const interval = request.interval * 60 * 1000;
      watchForTime(interval);
      sendResponse({status: 'done'});
      break;
  }

  return true;
});

chrome.storage.sync.get({
  'rememberer-interval': DEFAULT_INTERVAL,
}, function (items) {
  const interval = items['rememberer-interval'] * 60 * 1000;
  watchForTime(interval)
  });

function watchForTime(interval) {
  latestInterval = setInterval(() => {
    storage.getFromStorage()
      .then((ticketsList) => {
        const lastTaskTime = ticketsList[ticketsList.length - 1].time;
        const timePassed = Date.now() - lastTaskTime;
        if (interval <= timePassed) {
          showNotification();
        }
      });
  }, 5000)
}

function showNotification() {
  chrome.notifications.create('Hello', {
    type: 'basic',
    iconUrl: '../images/icon-16.png',
    title: 'title',
    message: 'PLEASE LOG YOUR TIME',
  }, () => {})
}