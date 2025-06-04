export function getLocaleFromUrl(url) {
  const regex = /https?:\/\/[^\/]+\/([a-z]{2})-[A-Z]{2}/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
