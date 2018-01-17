document.addEventListener('DOMContentLoaded', () => {
  new Popup();
}, false);

class Popup {
  constructor() {
    this.taskDescription = document.querySelector('#task-description');
    this.submitButton = document.querySelector('#save-task');

    this.initListeners();
  }

  initListeners() {
    this.submitButton.addEventListener('click', this.sendCurrentTask)
  }

  sendCurrentTask() {
    chrome.runtime.sendMessage({
      currentWork: this.taskDescription.value,
      target: 'SAVE_CURRENT_TASK'
    }, (response) => {
      if (response.status === 'done') {
        this.workDescription.value = '';
      }
    });
  }

  getTicketsList() {
    chrome.runtime.sendMessage({
      target: 'GET_TICKETS_LIST'
    }, (response) => {
      if (response.status === 'done') {
        this.workDescription.value = '';
      }
    });
  }
}