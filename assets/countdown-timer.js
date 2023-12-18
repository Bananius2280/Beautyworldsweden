if (!customElements.get('countdown-timer')) {
class CountdownTimer extends HTMLElement {
  constructor() {
    super();

    const { date, time, restart, repeatcycle } = this.dataset;
    const [day, month, year] = date.split('-').map(Number);
    const [tarhour, tarmin] = (time || '00:00').split(':').map(Number);

    this.shouldRestart = restart.toLowerCase() === 'true';
    this.repeatCycle = repeatcycle || '';

    this.initializeDates(year, month, day, tarhour, tarmin);

    // Cache DOM elements
    this.daysElement = this.querySelector('.days .countdown-timer__date-header');
    this.hoursElement = this.querySelector('.hours .countdown-timer__date-header');
    this.minutesElement = this.querySelector('.minutes .countdown-timer__date-header');
    this.secondsElement = this.querySelector('.seconds .countdown-timer__date-header');

    // Initialize the timer interval
    this.interval = setInterval(() => this.updateTime(), 1000);
  }

  initializeDates(year, month, day, tarhour, tarmin) {
    const now = new Date();
    let startDate = new Date(year, month - 1, day, tarhour, tarmin);
    if (this.shouldRestart && startDate < now) {
      startDate = this.getNextOccurrence(startDate);
    }

    this.year = startDate.getFullYear();
    this.month = startDate.getMonth();
    this.day = startDate.getDate();
    this.hour = startDate.getHours();
    this.min = startDate.getMinutes();

    this.countDownDate = startDate.getTime();
  }

  getNextOccurrence(startDate) {
    const now = new Date();
    if (startDate < now) {
      if (this.repeatCycle === 'Week') {
        startDate.setDate(startDate.getDate() + 7);
      } else if (this.repeatCycle === 'Month') {
        startDate.setMonth(startDate.getMonth() + 1);
      }
    }

    return startDate;
  }

  connectedCallback() {
    this.updateTime();
  }

  updateTime() {
    const now = new Date().getTime();
    const distance = this.countDownDate - now;
    if (distance < 0) {
      if (this.shouldRestart) {
        const { year, month, day, hour, min } = this.extractDateParts();
        this.initializeDates(year, month, day, hour, min);
        setTimeout(() => this.updateTime(), 1000);
      } else {
        this.displayZero();
        clearInterval(this.interval);
      }
    } else {
      this.updateDisplay(distance);
    }
  }

  extractDateParts() {
    const { year, month, day, hour, min } = this;
    return {
      year: year,
      month: month + 1,
      day: day,
      hour: hour,
      min: min,
    };
  }

  updateDisplay(distance) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.daysElement.textContent = CountdownTimer.addZero(days);
    this.hoursElement.textContent = CountdownTimer.addZero(hours);
    this.minutesElement.textContent = CountdownTimer.addZero(minutes);
    this.secondsElement.textContent = CountdownTimer.addZero(seconds);
  }

  displayZero() {
    this.daysElement.textContent = '0';
    this.hoursElement.textContent = '0';
    this.minutesElement.textContent = '0';
    this.secondsElement.textContent = '0';
  }

  static addZero(x) {
    return (x < 10 && x >= 0) ? `0${x}` : x;
  }
}

customElements.define('countdown-timer', CountdownTimer);
}
