class Timer {
  #startTimeMs;
  #endTimeMs;
  #startTime;
  #endTime;
  #millisecInSec = 1000;
  #intervalId;

  startCount(currentTimeMs) {
    this.#startTimeMs = currentTimeMs;
    this.#startTime = currentTimeMs.toISOString();
  }
  endCount(currentTimeMs) {
    this.#endTimeMs = currentTimeMs;
    this.#endTime = currentTimeMs.toISOString();
  }
  generateInterval(params) {
    const { cb, delay } = params;
    this.#intervalId = setInterval(cb, delay);
  }
  get startTime() {
    return this.#startTime;
  }
  get endTime() {
    return this.#endTime;
  }
  eraseInterval() {
    clearInterval(this.#intervalId);
  }
  calcSpentTimeInSec() {
    return (this.#endTimeMs - this.#startTimeMs) / this.#millisecInSec;
  }
}

module.exports = Timer;
