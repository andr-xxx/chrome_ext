// chrome.storage.sync.clear();
export default class Storage {
  setInStorage(data) {
    const dateToday = getActualDate();
    return new Promise(((resolve, reject) => {
      chrome.storage.sync.set({
        [dateToday]: data
      }, resolve);
    }));
  }

  getFromStorage() {
    const dateToday = getActualDate();

    return new Promise((resolve, reject) => {
      chrome.storage.sync.get({
        [dateToday] : []
      }, (items) => {
        resolve(items[dateToday])
      });
    })
  }

  async saveCurrentTask(request) {
    const todayTickets = await this.getFromStorage()
      .then((response) => {
        return response
      });
    await this.setInStorage([...todayTickets, {
      ticket: request.currentWork,
      time: Date.now()
    }])
  }
}

function getActualDate() {
  const dateNow = new Date();
  return `${dateNow.getDate()}-${dateNow.getMonth() + 1}-${dateNow.getFullYear()}`
}