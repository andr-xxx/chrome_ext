'use strict';
import Storage from './storage';
import * as helper from './helper';

const SECONDS = 1000;
const MINUTES = SECONDS * 60;
const HOURS = MINUTES * 60;
const SETTINGS = ['rememberer-interval', 'rememberer-start-time', 'rememberer-end-time', 'rememberer-working-days'];

const storage = new Storage();
let notificationInterval;
let workingTimeInterval;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.target) {
    case 'SAVE_CURRENT_TASK':
      storage.saveCurrentTask(request.currentTask)
        .then(() => {
          sendResponse({status: 'done'});
          prepareTimeWatching();

          if (request.additionalInformation === 'FROM_OVERLAY') {
            helper.closeOverlayToAllTabs();
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
  clearInterval(notificationInterval);
  storage.getFromStorage(SETTINGS)
    .then((response) => {
      const interval = response['rememberer-interval'] * MINUTES;
      const workingTime = {
        startTime: response['rememberer-start-time'],
        endTime: response['rememberer-end-time']
      };
      const workingDays = response['rememberer-working-days'];
      const dateToday = helper.getFormattedDayToday();

      if (helper.checkIsWorkingDayAndTime(workingDays, workingTime)) {
        storage.getFromStorage(dateToday, [])
          .then((ticketsList) => {
            if (ticketsList.length) {
              const lastTaskTime = ticketsList[ticketsList.length - 1].timeStart;
              checkLoggedTimeInterval(interval, lastTaskTime, 5);
            } else {
              checkLoggedTimeInterval()
            }
          });
      } else {
        notWorkingTimeInterval(workingDays, workingTime)
      }
    });
}

function notWorkingTimeInterval(workingDays, workingTime) {
  workingTimeInterval = setInterval(() => {
    if (notWorkingTimeInterval(workingDays, workingTime)) {
      clearInterval(workingTimeInterval);
      prepareTimeWatching();
    }
  }, 5 * MINUTES);
}

function checkLoggedTimeInterval(interval, lastTaskTime, counterLimit) {
  let counter = 0;
  notificationInterval = setInterval(() => {
    const timePassed = Date.now() - lastTaskTime;
    if (!interval) {
      helper.showNotification();
    } else if (interval <= timePassed) {
      counter++;
      if (counter > counterLimit) {
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
      } else {
        helper.showNotification();
      }
    }
  }, 5 * SECONDS)
}

prepareTimeWatching();