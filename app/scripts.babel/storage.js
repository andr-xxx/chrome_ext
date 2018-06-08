import * as helper from './helper';

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

  // todo move into background script this method
  async saveCurrentTask(currentTask) {
    const dateToday = helper.getFormattedDayToday();

    const todayTickets = await this.getFromStorage(dateToday, [])
      .then((response) => {
        return response
      });

    if (todayTickets.length >= 1) {
      const prevTicket = todayTickets[todayTickets.length - 1];
      prevTicket.timeEnd = Date.now();
      prevTicket.duration = prevTicket.timeEnd - prevTicket.timeStart;
    }

    await this.setInStorage(dateToday, [...todayTickets, {
      ticket: currentTask,
      timeStart: Date.now()
    }])
  }
}

