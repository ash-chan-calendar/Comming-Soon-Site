import { holidays, month_str as monthStr } from "./calendar.json";
import { getElementByIdOrThrow } from "../common/util";

class CalendarRenderer {
  elMonthNum: HTMLElement;
  elMonthStr: HTMLElement;
  elYear: HTMLElement;
  elDaysTbody: HTMLElement;
  date: Date;
  onRenderEnded: (() => void) | undefined;

  constructor(
    elMonthNum: HTMLElement,
    elMonthStr: HTMLElement,
    elYear: HTMLElement,
    elDaysTbody: HTMLElement,
    date: Date,
    onRenderEnded?: () => void
  ) {
    this.elMonthNum = elMonthNum;
    this.elMonthStr = elMonthStr;
    this.elYear = elYear;
    this.elDaysTbody = elDaysTbody;
    this.date = date;
    this.onRenderEnded = onRenderEnded;
  }

  render() {
    const year = this.date.getFullYear();
    const monthNum = this.date.getMonth() + 1;
    const month = `${monthNum}` as keyof typeof monthStr;

    const dateToday = this.date.getDate();

    this.elMonthNum.innerHTML = month;
    this.elMonthStr.innerHTML = monthStr[month].long;
    this.elYear.innerHTML = `${year}`;
    this.elDaysTbody.innerHTML = '';

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

    const celClickListener = (cel: HTMLElement) => () => {
      this.date = new Date(
        year,
        monthNum - 1,
        parseInt(cel.dataset.date ?? '1')
      );
      this.render();
    }

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
        cel.dataset.date = date.toString();

        cel.addEventListener('click', celClickListener(cel));
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

    if(this.onRenderEnded) {
      this.onRenderEnded();
    }
  }
}

const getImageUrl = async function(year: number, month: number, day: number) {
  const yearStr = (`000${year}`).slice(-4);
  const monthStr = (`0${month}`).slice(-2);
  const dayStr = (`0${day}`).slice(-2);
  const urlBase = `https://raw.githubusercontent.com/ash-chan-calendar/image/master/${yearStr}${monthStr}${dayStr}`;

  const blobToURL = (blob: Blob) => URL.createObjectURL(blob);

  const url = Promise.any([
    fetch(urlBase + '.png').then((res) => {
      if (res.ok) {
        return res.blob().then(blobToURL);
      }
      throw Error();
    }),
    fetch(urlBase + '.jpg').then((res) => {
      if (res.ok) {
        return res.blob().then(blobToURL);
      }
      throw Error();
    }),
    fetch(urlBase + '.jpeg').then((res) => {
      if (res.ok) {
        return res.blob().then(blobToURL);
      }
      throw Error();
    })
  ]).catch(() => '/imgs/2022_ACP_logo1_v1.1_B.png');

  return url;
}

window.addEventListener('load', () => {
  const elMonthNum = getElementByIdOrThrow('calendar_month_number');
  const elMonthStr = getElementByIdOrThrow('calendar_month_string');
  const elYearNum = getElementByIdOrThrow('calendar_year_number');
  const elDaysTbody = getElementByIdOrThrow('calendar_days_tbody');
  const elMonthPrev = getElementByIdOrThrow('calendar_month_prev');
  const elMonthNext = getElementByIdOrThrow('calendar_month_next');
  const elYearPrev = getElementByIdOrThrow('calendar_year_prev');
  const elYearNext = getElementByIdOrThrow('calendar_year_next');

  const elImage = getElementByIdOrThrow('calendar_image') as HTMLImageElement;
  const renderImage = function () {
    getImageUrl(
      renderer.date.getFullYear(),
      renderer.date.getMonth() + 1,
      renderer.date.getDate()
    ).then((url) => {
      elImage.src = url;
    });
  }

  const renderer = new CalendarRenderer(
    elMonthNum,
    elMonthStr,
    elYearNum,
    elDaysTbody,
    new Date(),
    function() {
      renderImage();
    }
  );
  renderer.render();

  // set month and year switch button listener
  elMonthPrev.addEventListener('click', () => {
    const date = renderer.date;
    renderer.date = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
    renderer.render();
  });
  elMonthNext.addEventListener('click', () => {
    const date = renderer.date;
    renderer.date = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
    renderer.render();
  });
  elYearPrev.addEventListener('click', () => {
    const date = renderer.date;
    renderer.date = new Date(
      date.getFullYear() - 1,
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
    renderer.render();
  });
  elYearNext.addEventListener('click', () => {
    const date = renderer.date;
    renderer.date = new Date(
      date.getFullYear() + 1,
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
    renderer.render();
  });
});
