import * as helper from './helper';

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => new Popup(), 1000)
  // new Popup()
}, false);

class Popup {
  constructor() {
    this.taskDescription = document.querySelector('#task-description');
    this.submitButton = document.querySelector('#save-task');
    this.previousTaskWrapper = document.querySelector('.previous-tasks');

    this.datePicker = document.querySelector('#datepicker');
    this.showTasksButton = document.querySelector('#apply-date');

    this.initListeners();
    // this.getTicketsList();
    this.setDatepickerDate();
  }

  initListeners() {
    this.submitButton.addEventListener('click', () => this.sendCurrentTask());
    this.showTasksButton.addEventListener('click', () => {
      const selectedDate = helper.getFormattedDayToday(new Date(this.datePicker.value));
      this.getTicketsList(selectedDate)
    });
  }

  sendCurrentTask() {
    chrome.runtime.sendMessage({
      currentTask: this.taskDescription.value,
      target: 'SAVE_CURRENT_TASK'
    }, (response) => {
      if (response) {
        if (response.status === 'done') {
          this.taskDescription.value = '';
          this.getTicketsList();
        }
      }
    });
  }

  getTicketsList(date = helper.getFormattedDayToday()) {
    chrome.runtime.sendMessage({
      target: 'GET_TICKETS_LIST',
      date: date
    }, (response) => {
      if (response.status === 'done') {
        console.log(response);
        this.ticketsList = response.ticketsList;
        this.showTasks(this.ticketsList);
      }
    });
  }

  setDatepickerDate(date = new Date()) {
    this.datePicker.valueAsDate = date;
  }

  showTasks(taskList) {
    let list = '<ul>';
    taskList.forEach(item => {
      list += `<li class="list-item">
                 <time>${new Date(item.time).getHours()}:${new Date(item.time).getMinutes()}</time>
                 <a href="#">${item.ticket}</a>
               </li>`;
    });
    list += '</ul>';
    this.previousTaskWrapper.innerHTML = list;
  }
}