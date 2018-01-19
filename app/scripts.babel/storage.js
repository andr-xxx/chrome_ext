export default class Storage {
  setInStorage(label, data, cb) {
    return new Promise(((resolve, reject) => {
      const setting = {};
      setting[label] = data;

      chrome.storage.sync.set(setting, resolve);
    }));
  }

  getFromStorage(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, (items) => {
        resolve(items)
      });
    })
  }

  async saveCurrentTask(request) {
    dateToday = getActualDate();
    const todayTickets = await storage.getFromStorage(dateToday)
      .then((response) => {
        return response[dateToday]
      });
    await storage.setInStorage(dateToday, [...todayTickets, request.currentWork])
  }
}