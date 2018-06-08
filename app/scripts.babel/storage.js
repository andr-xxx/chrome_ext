import * as helper from './helper';
import {
  DEFAULT_INTERVAL,
  DEFAULT_START_TIME,
  DEFAULT_END_TIME,
  DEFAULT_WORKING_DAYS,
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

  saveCurrentTask(currentTask) {
    const dateToday = helper.getFormattedDayToday();

    return this.getFromStorage(dateToday, [])
      .then((response) => {
        if (response.length >= 1) {
          const prevTicket = response[response.length - 1];
          prevTicket.timeEnd = Date.now();
          prevTicket.duration = prevTicket.timeEnd - prevTicket.timeStart;
        }

        this.setInStorage(dateToday, [...response, {
          ticket: currentTask,
          timeStart: Date.now()
        }])
      });
  }

  setDefaultOptions(cb) {
    debugger
    chrome.storage.sync.set({
      'rememberer-interval': DEFAULT_INTERVAL,
      'rememberer-start-time': DEFAULT_START_TIME,
      'rememberer-end-time': DEFAULT_END_TIME,
      'rememberer-working-days': DEFAULT_WORKING_DAYS,
    }, () => {
      cb();
    })
  }
}

