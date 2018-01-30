'use strict';
import Storage from './storage';
import * as helper from './helper';

import {SECONDS, MINUTES, SETTINGS, SAVE_CURRENT_TASK, GET_TICKETS_LIST, UPDATE_OPTIONS} from "./constants";

const storage = new Storage();
let notificationInterval;
let workingTimeInterval;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.target) {
    case SAVE_CURRENT_TASK:
      storage.saveCurrentTask(request.currentTask)
        .then(() => {
          sendResponse({status: 'done'});
          prepareTimeWatching();

          if (request.additionalInformation === 'FROM_OVERLAY') {
            helper.closeOverlayToAllTabs();
          }
        });
      break;
    case GET_TICKETS_LIST:
      storage.getFromStorage(request.date, [])
        .then((ticketsList) => {
          sendResponse({
            status: 'done',
            ticketsList: ticketsList
          });
        });
      break;
    case UPDATE_OPTIONS:
      prepareTimeWatching();
      sendResponse({status: 'done'});
      break;
  }

  return true;
});

function prepareTimeWatching() {
  clearAllIntervals();
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
    if (helper.checkIsWorkingDayAndTime(workingDays, workingTime)) {
      clearAllIntervals();
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

function clearAllIntervals() {
  clearInterval(workingTimeInterval);
  clearInterval(notificationInterval);
}

prepareTimeWatching();