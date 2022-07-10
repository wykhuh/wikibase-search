import { empty, notEmpty, roundNumber } from '$lib/common/utils';
import spacetime from 'spacetime';

export let wikiTypes = ['wikibase-item', 'wikibase-property', 'wikibase-lexeme', 'geo-shape'];

export function formatTime(value) {
  // NOTE: wikidata api provides time as '+00000002000-01-01T10:10:10Z'

  if (empty(value)) return '';

  // get rid of '+' and '0' at the start of the string
  let newTime = value.replace(/^\+0+/, '');

  // if time is just a year, return year
  if (newTime.includes('-00-00T00:00:00Z')) {
    return newTime.split('-00-00T00:00:00Z')[0];

    // if time is year-month-day, return day month year
  } else if (newTime.includes('T00:00:00Z')) {
    return spacetime(newTime).format('{date} {month} {year}');

    // if time is year-month-day hour-minute-second, do ???
  } else {
    throw 'need to implement formatTime() for this time value';
  }
}

export function formatQuantity(value) {
  if (empty(value) || empty(value['amount'])) return;

  let amount = Number(value['amount']);

  let hasLowerBound = notEmpty(value['lowerBound']);
  let hasUpperBound = notEmpty(value['upperBound']);
  let decimalPlaces = 0;
  if (hasLowerBound && hasUpperBound) {
    if (value['upperBound'].includes('.')) {
      decimalPlaces = value['upperBound'].split('.')[1].length;
    }
  }
  // validate lowerBound and upperBound
  if ((hasLowerBound && !hasUpperBound) || (!hasLowerBound && hasUpperBound)) {
    throw 'need both lowerBound and upperBound';
  }
  if (hasLowerBound && hasUpperBound) {
    let lowerDiff = amount - Number(value['lowerBound']);
    let upperDiff = Number(value['upperBound']) - amount;
    if (roundNumber(lowerDiff, decimalPlaces) !== roundNumber(upperDiff, decimalPlaces)) {
      console.error(
        'diff of lowerBound and upperBound have different values',
        amount,
        lowerDiff,
        upperDiff
      );
    }
  }

  let displayQuantity = String(amount);
  if (hasLowerBound && hasUpperBound) {
    let diff = Number(value['upperBound']) - amount;
    displayQuantity += `±${roundNumber(diff, decimalPlaces)}`;
  }
  if (notEmpty(value['unit'])) {
    displayQuantity += ` ${value['unit']}`;
  }

  return displayQuantity;
}

export function formatClaimValue(value) {
  let nestedValue = value['data_value']['value'];

  if (wikiTypes.includes(value['data_type'])) {
    return nestedValue['label'];
  } else if (value['data_type'] == 'globe-coordinate') {
    throw new Error('globe-coordinate not implemented');
  } else if (value['data_type'] == 'commonsMedia') {
    throw new Error('commonsMedia not implemented');
  } else if (value['data_type'] == 'quantity') {
    return formatQuantity(nestedValue);
  } else if (value['data_type'] == 'url') {
    return nestedValue;
  } else if (value['data_type'] == 'time') {
    return formatTime(nestedValue);
  } else if (value['data_type'] == 'external-id') {
    return nestedValue['label'];
  } else {
    return nestedValue;
  }
}
