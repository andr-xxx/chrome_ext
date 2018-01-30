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
    const description = this.taskDescription.value;
    if (description) {
      chrome.runtime.sendMessage({
        currentTask: description,
        target: 'SAVE_CURRENT_TASK'
      }, (response) => {
        if (response) {
          if (response.status === 'done') {
            this.taskDescription.value = '';
          }
        }
      });
    } else {
      this.showErrorMessage('EMPTY_DESCRIPTION')
    }
  }

  getTicketsList(date = helper.getFormattedDayToday()) {
    chrome.runtime.sendMessage({
      target: 'GET_TICKETS_LIST',
      date: date
    }, (response) => {
      if (response.status === 'done') {
        if (response.ticketsList.length) {
          this.ticketsList = response.ticketsList;
          this.showTasks(this.ticketsList);
        } else {
          this.showErrorMessage('EMPTY_TABLE');
        }
      }
    });
  }

  setDatepickerDate(date = new Date()) {
    this.datePicker.valueAsDate = date;
  }

  showTasks(taskList) {
    let table = `<table class='table table-inverse'>
                   <thead>
                     <tr>
                       <th>#</th>
                       <th>Time Start</th>
                       <th>Time End</th>
                       <th>Description</th>
                       <th>Duration</th>
                     </tr>
                   </thead>
                   <tbody>`;
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
  }


  showErrorMessage(error) {
    const table = this.previousTaskWrapper.querySelector('table');
    if (table) {
      table.remove();
    }

    const errorBlock = document.createElement('div');
    switch (error) {
      case 'EMPTY_DESCRIPTION':
        errorBlock.className = 'error validation-error';
        errorBlock.innerHTML = 'Please, fill description field';
        this.taskDescription.parentElement.appendChild(errorBlock);
        setTimeout(() => {
          this.taskDescription.parentElement.removeChild(errorBlock);
        }, 2000);
        break;
      case 'EMPTY_TABLE':
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