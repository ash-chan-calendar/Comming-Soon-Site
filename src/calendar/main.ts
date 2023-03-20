import { getElementByIdOrThrow } from "../common/util";
import { CalendarDate, CalendarRenderer } from "./calendarRenderer";

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
      renderer.dateShowing.year,
      renderer.dateShowing.month,
      renderer.dateShowing.date
    ).then((url) => {
      elImage.src = url;
    });
  }

  const renderer = new CalendarRenderer(
    elMonthNum,
    elMonthStr,
    elYearNum,
    elDaysTbody,
    CalendarDate.fromDate(new Date()),
    function() {
      renderImage();
    }
  );
  renderer.render();

  // set month and year switch button listener
  elMonthPrev.addEventListener('click', () => {
    renderer.dateShowing = new CalendarDate(
      renderer.dateShowing.year,
      renderer.dateShowing.month - 1,
      renderer.dateShowing.date,
    ).normalized();
    renderer.render();
  });
  elMonthNext.addEventListener('click', () => {
    renderer.dateShowing = new CalendarDate(
      renderer.dateShowing.year,
      renderer.dateShowing.month + 1,
      renderer.dateShowing.date,
    ).normalized();
    renderer.render();
  });
  elYearPrev.addEventListener('click', () => {
    renderer.dateShowing = new CalendarDate(
      renderer.dateShowing.year - 1,
      renderer.dateShowing.month,
      renderer.dateShowing.date,
    ).normalized();
    renderer.render();
  });
  elYearNext.addEventListener('click', () => {
    renderer.dateShowing = new CalendarDate(
      renderer.dateShowing.year + 1,
      renderer.dateShowing.month,
      renderer.dateShowing.date,
    ).normalized();
    renderer.render();
  });
});
