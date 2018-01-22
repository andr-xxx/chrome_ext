import * as helper from './helper';

// chrome.storage.sync.clear();
export default class Storage {
  setInStorage(value, key) {
    return new Promise(((resolve, reject) => {
      chrome.storage.sync.set({
        [key]: value
      }, resolve);
    }));
  }

  getFromStorage(key, defaultValue) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get({
        [key]: defaultValue
      }, (items) => {
        resolve(items[key])
      });
    })
  }

  async saveCurrentTask(currentTask) {
    const dateToday = helper.getFormattedDayToday();

    const todayTickets = await this.getFromStorage(dateToday, [])
      .then((response) => {
        return response
      });

    await this.setInStorage([...todayTickets, {
      ticket: currentTask,
      time: Date.now()
    }])
  }
}

