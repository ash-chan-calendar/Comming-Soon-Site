import { holidays, month_str as monthStr } from "./calendar.json";
import { getElementByIdOrThrow } from "../common/util";

class CalendarRenderer {
  elMonthNum: HTMLElement;
  elMonthStr: HTMLElement;
  elYear: HTMLElement;
  elDaysTbody: HTMLElement;
  date: Date;

  constructor(
    elMonthNum: HTMLElement,
    elMonthStr: HTMLElement,
    elYear: HTMLElement,
    elDaysTbody: HTMLElement,
    date: Date
  ) {
    this.elMonthNum = elMonthNum;
    this.elMonthStr = elMonthStr;
    this.elYear = elYear;
    this.elDaysTbody = elDaysTbody;
    this.date = date;
  }

  render() {
    const year = this.date.getFullYear();
    const monthNum = this.date.getMonth() + 1;
    const month = `${monthNum}` as keyof typeof monthStr;
    const dateToday = this.date.getDate();

    this.elMonthNum.innerHTML = month;
    this.elMonthStr.innerHTML = monthStr[month].long;
    this.elYear.innerHTML = `${year}`;

    const monthEnd = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDate();
    const weekOfDayStart = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      1
    ).getDay();

    const holidayName: (string | undefined)[] = new Array(monthEnd).fill(undefined);
    holidays.filter((holiday) => {
      return holiday.year === year && holiday.month === monthNum;
    }).forEach((holiday) => {
      holidayName[holiday.day] = holiday.name;
    });

    let row = document.createElement('tr');
    let rowCount = 0;
    let date = 1 - weekOfDayStart;
    while(date <= monthEnd) {
      let cel = document.createElement('td');
      if(date > 0) {
        let innerHTML = `<span>${date}</span>`;

        if(date === dateToday) {
          cel.classList.add('today');
        }

        if(holidayName[date]) {
          cel.classList.add('holiday');
          innerHTML += `<span class="holiday">${holidayName[date]}</span>`
        }
        cel.innerHTML = innerHTML;
      }
      row.appendChild(cel);

      rowCount += 1;
      if(rowCount === 7) {
        rowCount = 0;

        this.elDaysTbody.appendChild(row);
        row = document.createElement('tr');
      }

      date += 1;
    }
    if(rowCount !== 0) {
      this.elDaysTbody.appendChild(row);
    }
  }
}

window.addEventListener('load', () => {
  const elMonthNum = getElementByIdOrThrow('calendar_month_number');
  const elMonthStr = getElementByIdOrThrow('calendar_month_string');
  const elYear = getElementByIdOrThrow('calendar_year');
  const elDaysTbody = getElementByIdOrThrow('calendar_days_tbody');

  const renderer = new CalendarRenderer(
    elMonthNum,
    elMonthStr,
    elYear,
    elDaysTbody,
    new Date()
  );

  renderer.render();
});
