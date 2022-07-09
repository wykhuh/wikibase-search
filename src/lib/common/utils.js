export function empty(value) {
  return value === undefined || value === null;
}

export function notEmpty(value) {
  return !empty(value);
}

export function roundNumber(num, scale) {
  // round number to certain number of decimal places
  // https://stackoverflow.com/a/19722641
  return +(Math.round(+(num.toFixed(scale) + 'e+' + scale)) + 'e-' + scale);
}

export function secondsToHms(seconds) {
  //stackoverflow.com/a/37096512
  seconds = Number(seconds);
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor((seconds % 3600) % 60);

  var hDisplay = h > 0 ? h + ' hour ' : '';
  var mDisplay = m > 0 ? m + ' min ' : '';
  var sDisplay = s > 0 ? s + ' sec ' : '';
  return `${hDisplay}${mDisplay}${sDisplay}`;
}

export function truncateText(text, limit = 50) {
  return text.slice(0, limit) + '...';
}
