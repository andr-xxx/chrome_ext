'use strict';
let ticketsList = [];

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.target) {
    case 'SAVE_CURRENT_TASK':
      ticketsList.push(request.currentWork);
      sendResponse({status: 'done'});
      break;
    case 'GET_TICKETS_LIST':
      sendResponse({
        status: 'done',
        ticketsList: ticketsList
      });
      break;
  }
});
