export function empty(value) {
  return value === undefined || value === null;
}

export function notEmpty(value) {
  return !empty(value);
}

export function roundNumber(num, scale) {
  // round number to certain number of decimal places
  // https://stackoverflow.com/a/12830454
  return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
}
