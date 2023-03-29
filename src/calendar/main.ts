import { getElementByIdOrThrow } from "../common/util";
import { CalendarDate, CalendarRenderer } from "./calendarRenderer";

const imageIndexUrl = new URL(
  "imageIndex.json",
  location.origin + location.pathname,
);
const defaultImageUrl = new URL(
  "imgs/calendar_default.png",
  location.origin + location.pathname,
);
let imageIndex: Record<string, string> | null = null;

const getImageIndex = async function () {
  const res = await fetch(imageIndexUrl);
  if (!res.ok) {
    imageIndex = {};
    return imageIndex;
  }

  const text = await res.text();
  imageIndex = JSON.parse(text);

  return imageIndex as Record<string, string>;
};

const getImageUrl = async function (year: number, month: number, day: number) {
  const yearStr = `000${year}`.slice(-4);
  const monthStr = `0${month}`.slice(-2);
  const dayStr = `0${day}`.slice(-2);

  const imageIndex = await getImageIndex();
  const imageUrl = imageIndex[`${yearStr}${monthStr}${dayStr}`];

  if (!imageUrl) {
    return defaultImageUrl.toString();
  }

  const url = await fetch(imageUrl)
    .then((res) => {
      if (res.ok) {
        return res.blob().then(URL.createObjectURL);
      }
      throw Error();
    })
    .catch(() => defaultImageUrl.toString());

  return url;
};

const createDateLinkUrl = function (date: CalendarDate) {
  const query = location.search;
  const baseUrl = location.href.slice(0, -query.length);

  // remove query of date=xxxx-xx-xx
  const params = query.slice(1).split("&")
    .filter((param) => !/^date=(\d{4}-\d{2}-\d{2})$/.test(param));
  params.unshift(`date=${date.toString()}`);

  return `${baseUrl}?${params.join("&")}`;
};

window.addEventListener("load", () => {
  const elMonthNum = getElementByIdOrThrow("calendar_month_number");
  const elMonthStr = getElementByIdOrThrow("calendar_month_string");
  const elYearNum = getElementByIdOrThrow("calendar_year_number");
  const elDaysTbody = getElementByIdOrThrow("calendar_days_tbody");
  const elMonthPrev = getElementByIdOrThrow("calendar_month_prev");
  const elMonthNext = getElementByIdOrThrow("calendar_month_next");
  const elYearPrev = getElementByIdOrThrow("calendar_year_prev");
  const elYearNext = getElementByIdOrThrow("calendar_year_next");
  const elImage = getElementByIdOrThrow("calendar_image") as HTMLImageElement;
  const elLoader = getElementByIdOrThrow("loader");

  const renderImage = function () {
    elLoader.classList.remove("hidden");
    getImageUrl(
      renderer.dateShowing.year,
      renderer.dateShowing.month,
      renderer.dateShowing.date,
    ).then((url) => {
      elImage.src = url;
      elLoader.classList.add("hidden");
    });
  };

  // process query
  let date = new Date();
  const query = location.search.slice(1).split("&");
  for (const param of query) {
    const dateMatch = /^date=(\d{4}-\d{2}-\d{2})$/.exec(param);
    if (dateMatch !== null) {
      date = new Date(dateMatch[1]);
      continue;
    }
  }

  const renderer = new CalendarRenderer(
    elMonthNum,
    elMonthStr,
    elYearNum,
    elDaysTbody,
    CalendarDate.fromDate(date),
    function () {
      window.history.replaceState(
        renderer.dateShowing,
        "",
        createDateLinkUrl(renderer.dateShowing),
      );
      renderImage();
    },
  );
  renderer.render();

  // set month and year switch button listener
  elMonthPrev.addEventListener("click", () => {
    renderer.dateShowing = new CalendarDate(
      renderer.dateShowing.year,
      renderer.dateShowing.month - 1,
      renderer.dateShowing.date,
    ).normalized();
    renderer.render();
  });
  elMonthNext.addEventListener("click", () => {
    renderer.dateShowing = new CalendarDate(
      renderer.dateShowing.year,
      renderer.dateShowing.month + 1,
      renderer.dateShowing.date,
    ).normalized();
    renderer.render();
  });
  elYearPrev.addEventListener("click", () => {
    renderer.dateShowing = new CalendarDate(
      renderer.dateShowing.year - 1,
      renderer.dateShowing.month,
      renderer.dateShowing.date,
    ).normalized();
    renderer.render();
  });
  elYearNext.addEventListener("click", () => {
    renderer.dateShowing = new CalendarDate(
      renderer.dateShowing.year + 1,
      renderer.dateShowing.month,
      renderer.dateShowing.date,
    ).normalized();
    renderer.render();
  });
});
