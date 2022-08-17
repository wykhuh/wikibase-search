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
  return `${hDisplay}${mDisplay}${sDisplay}`.trim();
}

export function truncateText(text, limit = 50) {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '...';
}

export function swapObjectKeysValues(obj) {
  // https://stackoverflow.com/a/56781239
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
}

export function printJson(obj) {
  return `<pre>${JSON.stringify(obj, null, 3)}</pre>`;
}

export function showAlerts(result, successMessage) {
  let tmpAlerts = [];
  if (result.changed == 1) {
    tmpAlerts.push({
      text: successMessage,
      type: 'is-success'
    });
  }
  if (result.warnings.length > 0) {
    let messages = [];
    result.warnings.forEach((warning) => {
      if (warning.message) {
        messages.push(warning.message);
      } else {
        messages.push(warning);
      }
    });
    tmpAlerts.push({ text: `Warning: ${messages.join('\n')}`, type: 'is-warning' });
  }
  if (result.errors.length > 0) {
    let messages = [];
    result.errors.forEach((error) => {
      if (error.message) {
        messages.push(error.message);
      } else {
        messages.push(error);
      }
    });
    tmpAlerts.push({ text: `Error: ${messages.join('\n')}`, type: 'is-danger' });
  }
  return tmpAlerts;
}
