const moment = require("moment");

class Timer {
  constructor() {
    this.start;
    this.end;
    this.startFormatted;
    this.endFormatted;
  }
  startTime() {
    this.start = moment();
    this.startFormatted = this.start.toString();
  }
  endTime() {
    this.end = moment();
    this.endFormatted = this.end.toString();
  }
  calcStartEndDiff() {
    return moment.duration(this.end.diff(this.start)).asSeconds();
  }
}

module.exports = Timer;
