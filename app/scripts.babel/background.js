'use strict';
import Storage from './storage';
import * as helper from './helper';

const DEFAULT_INTERVAL = 60;

const storage = new Storage();
let latestInterval;


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.target) {
    case 'SAVE_CURRENT_TASK':
      storage.saveCurrentTask(request.currentTask)
        .then(() => {
          sendResponse({status: 'done'});
          prepareTimeWatching();

          if (request.additionalInformation === 'FROM_OVERLAY') {
            closeOverlayToAllTabs();
          }
        });
      break;
    case 'GET_TICKETS_LIST':
      storage.getFromStorage(request.date, [])
        .then((ticketsList) => {
          sendResponse({
            status: 'done',
            ticketsList: ticketsList
          });
        });
      break;
    case 'UPDATE_OPTIONS':
      prepareTimeWatching();
      sendResponse({status: 'done'});
      break;
  }

  return true;
});

function prepareTimeWatching() {
  clearInterval(latestInterval);
  storage.getFromStorage('rememberer-interval', DEFAULT_INTERVAL)
    .then((items) => {
      const interval = items * 60 * 1000;
      const dateToday = helper.getFormattedDayToday();

      storage.getFromStorage(dateToday, [])
        .then((ticketsList) => {
          if (ticketsList.length) {
            const lastTaskTime = ticketsList[ticketsList.length - 1].timeStart;
            watchForTime(interval, lastTaskTime);
          }
        });
    });
}
prepareTimeWatching();

function watchForTime(interval, lastTaskTime) {
  latestInterval = setInterval(() => {
    const timePassed = Date.now() - lastTaskTime;
    if (interval <= timePassed) {
      showNotification();

      chrome.tabs.query({currentWindow: true, active : true}, (response) => {
        if (response.length) {
          const activeTabId = response[0].id;
          chrome.tabs.sendMessage(activeTabId,{
            target: 'SHOW_OVERLAY'
          }, (response) => {
            console.log(response)
          });
        }
      })
    }
  }, 5000)
}

function closeOverlayToAllTabs() {
  chrome.tabs.query({}, function(tabs) {
    for (let i=0; i<tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, {target: 'CLOSE_OVERLAY'});
    }
  });
}

function showNotification() {
  chrome.notifications.create('Hello', {
    type: 'basic',
    iconUrl: '../images/icon-16.png',
    title: 'REMEMBERER',
    message: 'PLEASE LOG YOUR TIME',
  }, () => {})
}