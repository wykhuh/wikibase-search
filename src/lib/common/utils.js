export function empty(value) {
  return value === undefined || value === null;
}

export function notEmpty(value) {
  return !empty(value);
}
