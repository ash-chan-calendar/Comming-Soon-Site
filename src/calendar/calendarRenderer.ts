import { holidays, month_str as monthStr } from './calendar.json';

class CalendarDate {
  year: number;
  month: number;
  date: number;

  get weekOfDay() {
    return this.toDate().getDay();
  }

  constructor(year: number, month: number, date: number) {
    this.year = year;
    this.month = month;
    this.date = date;
  }

  static fromDate(date: Date) {
    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  }

  toDate() {
    return new Date(this.year, this.month - 1, this.date);
  }

  normalized() {
    return CalendarDate.fromDate(this.toDate());
  }
}

class CalendarRenderer {
  elMonthNum: HTMLElement;
  elMonthStr: HTMLElement;
  elYear: HTMLElement;
  elDaysTbody: HTMLElement;
  dateShowing: CalendarDate;
  dateToday = CalendarDate.fromDate(new Date());
  onRenderEnded: (() => void) | undefined;

  constructor(
    elMonthNum: HTMLElement,
    elMonthStr: HTMLElement,
    elYear: HTMLElement,
    elDaysTbody: HTMLElement,
    dateShowing: CalendarDate,
    onRenderEnded?: () => void
  ) {
    this.elMonthNum = elMonthNum;
    this.elMonthStr = elMonthStr;
    this.elYear = elYear;
    this.elDaysTbody = elDaysTbody;
    this.dateShowing = dateShowing;
    this.onRenderEnded = onRenderEnded;
  }

  cellLinkClickListener = (e: MouseEvent) => {
    const cel = (e.target as HTMLElement)?.parentElement;
    if (!cel) {
      throw Error('Failed to get calendar table cel');
    }

    this.dateShowing = new CalendarDate(
      this.dateShowing.year,
      this.dateShowing.month,
      parseInt(cel.dataset.date ?? '1')
    );
    this.render();
  };

  render() {
    const monthKey = `${this.dateShowing.month}` as keyof typeof monthStr;

    this.elMonthNum.innerHTML = `${this.dateShowing.month}`;
    this.elMonthStr.innerHTML = monthStr[monthKey].long;
    this.elYear.innerHTML = `${this.dateShowing.year}`;
    this.elDaysTbody.innerHTML = '';

    // create Date with month=monthIndex + 1 and day=0 and get date
    // to get the last day of the month
    // (note that CalendarDate.month equals to monthIndex + 1)
    const monthEnd = new Date(
      this.dateShowing.year,
      this.dateShowing.month,
      0
    ).getDate();
    // day of the week on the first day of the month
    const weekOfDayFirstDay = new Date(
      this.dateShowing.year,
      this.dateShowing.month - 1,
      1
    ).getDay();

    const holidayNames = new Array(monthEnd).fill(undefined) as (
      | string
      | undefined
    )[];

    holidays
      .filter((holiday) => {
        return (
          holiday.year === this.dateShowing.year &&
          holiday.month === this.dateShowing.month
        );
      })
      .forEach((holiday) => {
        holidayNames[holiday.day] = holiday.name;
      });

    // Today's date if the displayed year and month match
    // the current ones, -1 otherwise
    const dateToday =
      this.dateToday.year === this.dateShowing.year &&
      this.dateToday.month === this.dateShowing.month
        ? this.dateToday.date
        : -1;
    // create calendar table (number[][])
    // [[-1,  0,  1,  2,  3,  4,  5],
    //    6,  7,  8,  9, 10, 11, 12],
    //   ...]
    const calendarWidth = 7;
    const calendarHeight = 5;
    const dateTable = new Array(calendarHeight)
      .fill(0)
      .map((_, row) =>
        new Array(calendarWidth)
          .fill(0)
          .map(
            (_, column) => row * calendarWidth + column - weekOfDayFirstDay + 1
          )
      );
    const elRows = dateTable.map((row) => {
      const elRow = document.createElement('tr');
      const elCells = row.map((date) => {
        const elCell = document.createElement('td');
        if (date <= 0) {
          return elCell;
        }

        const elLink = document.createElement('a');
        elLink.href = 'javascript:void(0);';
        elLink.textContent = `${date}`;
        elLink.addEventListener('click', this.cellLinkClickListener);
        elCell.appendChild(elLink);

        const holidayName = holidayNames[date];
        if (holidayName) {
          const elHoliday = document.createElement('span');
          elHoliday.textContent = holidayName;
          elHoliday.className = 'holiday';
          elCell.appendChild(elHoliday);

          elCell.classList.add('holiday');
        }
        if (date === dateToday) {
          elCell.classList.add('today');
        }
        if (date === this.dateShowing.date) {
          elCell.classList.add('showing');
        }

        elCell.dataset.date = date.toString();

        return elCell;
      });

      elCells.forEach((elCell) => {
        elRow.appendChild(elCell);
      });
      return elRow;
    });
    elRows.forEach((elRow) => {
      this.elDaysTbody.append(elRow);
    });

    if (this.onRenderEnded) {
      this.onRenderEnded();
    }
  }
}

export { CalendarDate, CalendarRenderer };
