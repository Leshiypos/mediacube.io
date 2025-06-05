export function getLocaleFromUrl(url) {
  const regex = /https?:\/\/[^\/]+\/([a-z]{2})-[A-Z]{2}/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function checkLocale(leng) {
  const languagesPos = ["ru", "pt", "es", "en"];
  return languagesPos.includes(leng);
}
export function getSerchIndexArray(arr, locale) {
  arr.map((el, idex) => {
    if (el.lang === locale) return index;
  });
  return 0;
}
