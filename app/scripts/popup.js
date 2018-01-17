document.addEventListener('DOMContentLoaded', () => {
  // setTimeout(() => new Popup(), 1000)
  new Popup()
}, false);

class Popup {
  constructor() {
    this.taskDescription = document.querySelector('#task-description');
    this.submitButton = document.querySelector('#save-task');
    this.previousTaskWrapper = document.querySelector('.previous-tasks');

    this.initListeners();
    this.getTicketsList();
  }

  initListeners() {
    this.submitButton.addEventListener('click', () => this.sendCurrentTask())
  }

  sendCurrentTask() {
    chrome.runtime.sendMessage({
      currentWork: this.taskDescription.value,
      target: 'SAVE_CURRENT_TASK'
    }, (response) => {
      if (response.status === 'done') {
        this.taskDescription.value = '';
        this.getTicketsList();
      }
    });
  }

  getTicketsList() {
    chrome.runtime.sendMessage({
      target: 'GET_TICKETS_LIST'
    }, (response) => {
      if (response.status === 'done') {
        this.ticketsList = response.ticketsList;
        this.showPreviousTasks(this.ticketsList);
      }
    });
  }

  showPreviousTasks(taskList) {
    let list = '';
    taskList.forEach(item => {
      list += `<li class="list-item"><a href="#">${item}</a></li>`;
    });

    this.previousTaskWrapper.innerHTML = list;
  }
}