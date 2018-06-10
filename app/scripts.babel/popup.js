import * as helper from './helper';
import {
  SAVE_CURRENT_TASK,
  CONTINUE_PREVIOUS,
  GET_TICKETS_LIST,
} from './constants';
const ERRORS = {
  emptyDescription: 'EMPTY_DESCRIPTION',
  emptyTable: 'EMPTY_TABLE',
};


document.addEventListener('DOMContentLoaded', () => {
  new Popup()
}, false);

class Popup {
  constructor() {
    this.taskDescription = document.querySelector('#task-description');
    this.submitButton = document.querySelector('#save-task');
    this.saveLikePrevious = document.querySelector('#save-like-previous-task');
    this.previousTaskWrapper = document.querySelector('.previous-tasks');

    this.datePicker = document.querySelector('#datepicker');
    this.showTasksButton = document.querySelector('#apply-date');
    this.navigation = document.querySelector('.js-navigation');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.taskTab = document.querySelector('.js-task-tab');
    this.resultsTab = document.querySelector('.js-results-tab');

    this.initListeners();
    this.setDatepickerDate();
  }

  initListeners() {
    this.submitButton.addEventListener('click', () => this.sendCurrentTask());
    this.saveLikePrevious.addEventListener('click', () => this.sendCurrentTask('save-previous'));
    this.showTasksButton.addEventListener('click', () => {
      const selectedDate = helper.getFormattedDayToday(new Date(this.datePicker.value));
      this.getTicketsList(selectedDate)
    });

    this.navigation.addEventListener('click', (e) => this.changeActiveTab(e))
  }

  sendCurrentTask(shouldSavePrevious) {
    const target = shouldSavePrevious ? CONTINUE_PREVIOUS : SAVE_CURRENT_TASK;
    const description = shouldSavePrevious ? null : this.taskDescription.value;
    if (description || shouldSavePrevious) {
      chrome.runtime.sendMessage({
        currentTask: description,
        target: target
      }, (response) => {
        if (response) {
          if (response.status === 'done') {
            this.taskDescription.value = '';
          }
        }
      });
    } else {
      this.showErrorMessage(ERRORS.emptyDescription)
    }
  }

  getTicketsList(date = helper.getFormattedDayToday()) {
    chrome.runtime.sendMessage({
      target: GET_TICKETS_LIST,
      date: date
    }, (response) => {
      if (response.status === 'done') {
        if (response.ticketsList.length) {
          this.ticketsList = response.ticketsList;
          this.showTasks(this.ticketsList);
        } else {
          this.showErrorMessage(ERRORS.emptyTable);
        }
      }
    });
  }

  changeActiveTab(e) {
    const target = e.target;
    if (target.nodeName.toLowerCase() !== 'a') return;
    if (Array.from(target.classList).indexOf('active') >= 0) return;

    const destination = target.attributes['data-value'].value;
    this.navLinks.forEach((item) => {
      item.className = 'nav-link'
    });
    target.className += ' active';

    if (destination === 'result') {
      this.resultsTab.style.display = 'block';
      this.taskTab.style.display = 'none';
    } else {
      this.resultsTab.style.display = 'none';
      this.taskTab.style.display = 'block';
      this.previousTaskWrapper.innerHTML = '';
    }
  }

  setDatepickerDate(date = new Date()) {
    this.datePicker.valueAsDate = date;
  }

  showTasks(taskList) {
    let table = `<table class='table table-inverse'>
                   <thead>
                     <tr>
                       <th>#</th>
                       <th>Start</th>
                       <th>End</th>
                       <th>Description</th>
                       <th>Duration</th>
                     </tr>
                   </thead>
                   <tbody>`;

    let previousTask;
    taskList.forEach((item, index) => {
      const timeStart = helper.formatTime(item.timeStart, 'time');
      const timeEnd = helper.formatTime(item.timeEnd, 'time');
      const duration = helper.formatTime(item.duration, 'duration');

      if (index !== taskList.length - 1) {
        table += `<tr>
                    <th scope='row'>${index + 1}</th>
                    <td>${timeStart}</td>
                    <td>${timeEnd}</td>
                    <td>${item.ticket}</td>
                    <td>${duration}</td>
                  </tr>`
      } else {
        table += `<tr>
                    <th scope='row'>${index + 1}</th>
                    <td>${timeStart}</td>
                    <td>In Progress</td>
                    <td>${item.ticket}</td>
                    <td>In Progress</td>
                  </tr>`
      }
    });
    table += '</tbody></table>';
    this.previousTaskWrapper.innerHTML = table;
    previousTask = item;
  }

  showErrorMessage(error) {
    const table = this.previousTaskWrapper.querySelector('table');
    if (table) {
      table.remove();
    }

    const errorBlock = document.createElement('div');
    switch (error) {
      case ERRORS.emptyDescription:
        errorBlock.className = 'error validation-error';
        errorBlock.innerHTML = 'Please, fill description field';
        this.taskDescription.parentElement.appendChild(errorBlock);
        setTimeout(() => {
          this.taskDescription.parentElement.removeChild(errorBlock);
        }, 2000);
        break;
      case ERRORS.emptyTable:
        errorBlock.className = 'error content-error';
        errorBlock.innerHTML = 'No tasks were specified';
        this.previousTaskWrapper.appendChild(errorBlock);
        setTimeout(() => {
          this.previousTaskWrapper.removeChild(errorBlock);
        }, 2000);
        break;
    }
  }
}