import * as helper from './helper';
import {
  DEFAULT_INTERVAL,
  DEFAULT_START_TIME,
  DEFAULT_END_TIME,
  DEFAULT_WORKING_DAYS,
  INTERVAL,
  START_TIME,
  END_TIME,
  WORKING_DAYS,
} from './constants';

export default class Storage {
  setInStorage(key, value) {
    return new Promise(((resolve, reject) => {
      chrome.storage.sync.set({
        [key]: value
      }, resolve);
    }));
  }

  getFromStorage(key, defaultValue) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(key)) {
        chrome.storage.sync.get(key, (items) => {
          resolve(items)
        });
      } else {
        chrome.storage.sync.get({
          [key]: defaultValue
        }, (items) => {
          resolve(items[key])
        });
      }
    })
  }

  saveCurrentTask(currentTaskDescription) {
    const dateToday = helper.getFormattedDayToday();

    return this.getFromStorage(dateToday, [])
      .then((response) => {
        const prevTicket = response[response.length - 1];
        if (prevTicket) {
          prevTicket.timeEnd = Date.now();
          prevTicket.duration = prevTicket.timeEnd - prevTicket.timeStart;
        }
        const currentTask = {
          timeStart: Date.now(),
        };
        currentTask.ticket = currentTaskDescription ? currentTaskDescription : prevTicket.ticket;

        this.setInStorage(dateToday, [...response, currentTask])
      });
  }

  setDefaultOptions(cb) {
    chrome.storage.sync.set({
      [INTERVAL]: DEFAULT_INTERVAL,
      [START_TIME]: DEFAULT_START_TIME,
      [END_TIME]: DEFAULT_END_TIME,
      [WORKING_DAYS]: DEFAULT_WORKING_DAYS,
    }, () => {
      setTimeout(() => cb(), 3000)
    })
  }
}

