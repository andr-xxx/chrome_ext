export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const SETTINGS = ['rememberer-interval', 'rememberer-start-time', 'rememberer-end-time', 'rememberer-working-days'];

export const SAVE_CURRENT_TASK = 'SAVE_CURRENT_TASK';
export const GET_TICKETS_LIST = 'GET_TICKETS_LIST';
export const UPDATE_OPTIONS = 'UPDATE_OPTIONS';
export const CONTINUE_PREVIOUS = 'CONTINUE_PREVIOUS';
export const FROM_OVERLAY = 'FROM_OVERLAY';
export const SHOW_OVERLAY = 'SHOW_OVERLAY';
export const CLOSE_OVERLAY = 'CLOSE_OVERLAY';

export const DEFAULT_INTERVAL = 60;
export const DEFAULT_START_TIME = '09:00';
export const DEFAULT_END_TIME = '19:00';
export const DEFAULT_WORKING_DAYS = [
  {day: 'Sunday', checked: false},
  {day: 'Monday', checked: true},
  {day: 'Tuesday', checked: true},
  {day: 'Wednesday', checked: true},
  {day: 'Thursday', checked: true},
  {day: 'Friday', checked: true},
  {day: 'Saturday', checked: false}
];