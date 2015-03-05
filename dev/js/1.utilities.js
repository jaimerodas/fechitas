Date.prototype.fechitasFormat = function (options) {
  var months = 'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split(' '),
    monthsS = 'ene feb mar abr may jun jul ago sep oct nov dic'.split(' ');

  var settings = $.extend({
    type: 'day',
    format: 'normal',
    capitalized: false
  }, options);

  var m,
    r = 'invalid format',
    s = '-';

  if (settings.format == 'verbose') {
    m = monthsS[this.getMonth()];
  }

  if (settings.format == 'veryverbose') {
    m = months[this.getMonth()];
    s = ' ';
  }

  if ((settings.format == 'verbose' || settings.format == 'veryverbose') && settings.capitalized) {
    m = m.capitalize();
  }

  switch (settings.format) {
  case 'normal':
    r = this.getUTCFullYear() + s + pad(this.getUTCMonth() + 1);
    break;
  case 'inverse':
    r = pad(this.getUTCMonth() + 1) + s + this.getUTCFullYear();
    break;
  case 'verbose':
  case 'veryverbose':
    r = m + s + this.getUTCFullYear();
    break;
  }

  if (settings.type == 'day') {
    if (settings.format == 'normal') {
      r += s + pad(this.getUTCDate());
    } else {
      r = pad(this.getUTCDate()) + s + r;
    }
  }

  return r;
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

var pad = function (n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
};

// http://stackoverflow.com/questions/1810984/number-of-days-in-any-month
var daysInMonth = function (y, m) {
  if (/8|3|5|10/.test(m)) {return 30; }
  if (m != 1) {return 31; }
  if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {return 29; }
  return 28;
};
