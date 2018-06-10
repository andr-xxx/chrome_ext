'use strict';
import Storage from './storage';
import * as helper from './helper';

import {
  SECOND,
  MINUTE,
  SETTINGS,
  SAVE_CURRENT_TASK,
  CONTINUE_PREVIOUS,
  GET_TICKETS_LIST,
  UPDATE_OPTIONS,
  FROM_OVERLAY,
  SHOW_OVERLAY,
  INTERVAL,
  START_TIME,
  END_TIME,
  WORKING_DAYS,
} from './constants';

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

          if (request.additionalInformation === FROM_OVERLAY) {
            helper.closeOverlayToAllTabs();
          }
        });
      break;
    case CONTINUE_PREVIOUS:
      console.log('save previouse');
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
      if (!Object.keys(response).length) {
        return storage.setDefaultOptions(prepareTimeWatching);
      }

      const interval = response[INTERVAL] * MINUTE;
      const workingTime = {
        startTime: response[START_TIME],
        endTime: response[END_TIME]
      };
      const workingDays = response[WORKING_DAYS];
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
  }, 5 * SECOND);
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
        chrome.tabs.query({currentWindow: true, active: true}, (response) => {
          if (response.length) {
            const activeTabId = response[0].id;
            chrome.tabs.sendMessage(activeTabId, {
              target: SHOW_OVERLAY,
            }, (response) => {
            });
          }
        })
      } else {
        helper.showNotification();
      }
    }
  }, 5 * SECOND)
}

function clearAllIntervals() {
  clearInterval(workingTimeInterval);
  clearInterval(notificationInterval);
}

prepareTimeWatching();