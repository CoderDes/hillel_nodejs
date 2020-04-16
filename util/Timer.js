const moment = require("moment");

class Timer {
  constructor() {
    this.start;
    this.end;
  }
  startTime() {
    this.start = moment();
  }
  endTime() {
    this.end = moment();
  }
  calcStartEndDiff() {
    return moment.duration(this.end.diff(this.start)).asSeconds();
  }
}

module.exports = Timer;
