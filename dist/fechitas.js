/*! fechitas - v0.4.0 - 2015-03-05
* https://jaimerodas.github.io/fechitas
* Copyright (c) 2015 Jaime Rodas; Licensed MIT */
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

(function ($) {

  $.fn.fechitas = function (options) {

    var settings = $.extend({
      // day or month; eventually year also
      type: 'day',
      // normal -> 2014-12-31
      // inverse -> 31-12-2014
      // verbose -> 31-dic-2014
      // veryverbose -> 31 diciembre 2014
      format: 'normal',
      capitalized: false
    }, options);

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return this;
    }

    var picker, tag, fecha, year, month, day, container,
      months = 'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split(' '),
      monthsS = 'ene feb mar abr may jun jul ago sep oct nov dic'.split(' ');

    var updateNav = function () {
      var dec = year.toString().substr(0, 3);
      container.find('.fechitas-year').find('.fechitas-chooseDecade').val(dec).text(year);
      container.find('.fechitas-month').find('.fechitas-chooseDecade').val(dec).text(year);
      container.find('.fechitas-month').find('.fechitas-chooseYear').val(year).text(months[month].capitalize());
    };

    var buildDecade = function (y, isDecade) {
      isDecade = (isDecade === undefined) ? false : isDecade;

      var dec, i, button,
        decade = container.find('.fechitas-decade'),
        years = decade.find('.fechitas-decade-years');

      years.html('');

      if (isDecade) {
        dec = y.toString();
      } else {
        dec = y.toString().substr(0, 3);
      }

      for (i = 0; i < 10; i++) {
        button = '<button type="button" class="fechitas-chooseYear';

        if (dec + i == year.toString()) {
          button += ' fechitas-active';
        }

        button += '" value="' + dec + i + '">' + dec + i + '</button>';

        years.append(button);
      }

      dec = parseInt(dec, 10);
      years.prepend('<button type="button" class="fechitas-chooseDecade fechitas-choose" value="' + (dec - 1) + '">' + (dec - 1) + '0\'s</button><button type="button" class="fechitas-chooseDecade fechitas-choose" value="' + (dec + 1) + '">' + (dec + 1) + '0\'s</button>');
    };

    var buildYear = function (y) {
      var i, button,
        annum = container.find('.fechitas-year'),
        meses = annum.find('.fechitas-year-months').html('');

      var dec = y.toString().substr(0, 3);
      annum.find('.fechitas-chooseDecade').text(y).val(dec);

      for (i = 0; i < 12; i++) {
        button = '<button class="fechitas-chooseMonth';

        if (i == month) {
          button += ' fechitas-active';
        }

        button += '" value="' + i + '" type="button">' + months[i].capitalize() + '</button>';

        meses.append(button);
      }
    };

    var buildMonth = function (y, m) {
      var i, j, k, button,
        d = daysInMonth(y, m),
        meses = container.find('.fechitas-month'),
        dias = meses.find('.fechitas-month-days');

      dias.html('');

      j = new Date(year, month, 1);
      j = j.getDay();

      if (j > 0) {
        for (k = 0; k < j; k++) {
          dias.append('<div class="empty">');
        }
      }

      for (i = 1; i <= d; i++) {
        button = '<button type="button" class="fechitas-chooseDay';

        if (i == day) {
          button += ' fechitas-active';
        }

        button += '" value="' + i + '">' + i + '</button>';
        dias.append(button);
      }
    };

    var activa = function (o) {
      $(o).siblings().removeClass('fechitas-active');
      $(o).addClass('fechitas-active');
    };

    var showPanel = function (p) {
      var panel = container.find(p);
      panel.siblings().hide();
      panel.show();
    };

    var updatePicker = function (p) {
      var fstring = picker.data('fecha');

      if (!fstring) {
        if (tag == 'input') {
          fecha = picker.val();
        } else {
          fecha = picker.html();
        }

        if (fecha === '') {
          fecha = new Date();
        } else {
          fecha = new Date(fecha);
        }

        if (Object.prototype.toString.call(fecha) !== "[object Date]" || isNaN(fecha.getTime())) {
          fecha = new Date();
        }
      } else {
        fecha = new Date(fstring);
      }

      year = fecha.getUTCFullYear();
      month = fecha.getUTCMonth();
      day = fecha.getUTCDate();

      buildDecade(year);
      buildYear(year);

      if (settings.type == 'day') {
        buildMonth(year, month);
        updateNav();
      }
    };

    var showFechitas = function () {
      picker = $(this);
      tag = picker.get(0).nodeName.toLowerCase();
      container = $('.fechitas-container');

      updatePicker(this);

      if (settings.type == 'month') {
        showPanel('.fechitas-year');
      } else {
        showPanel('.fechitas-month');
      }

      container.addClass('fechitas-visible');
    };

    var hideFechitas = function () {
      container.removeClass('fechitas-visible');
    };

    var colocaFecha = function () {
      fecha = new Date(year, month, day);
      var texto = fecha.fechitasFormat(settings);

      if (tag == 'input') {
        picker.val(texto);
      } else {
        picker.text(texto);
      }

      picker.data('fecha', fecha.fechitasFormat());
      picker.trigger('fechitasDateChange', [texto, fecha.fechitasFormat()]);

      hideFechitas();
    };

    var initFechitas = function (p) {
      var find, mes, semana = 'D L M M J V S'.split(' ');
      picker = $(p).data('hasFechitas', true);



      find = $('.fechitas-container');

      if (find.length > 0) {
        container = find;
      } else {
        mes = $('<div class="fechitas-month-week" />');
        semana.forEach(function (d) {
          var dia = $('<div class="fechitas-week-day" />').text(d);
          mes.append(dia);
        });

        container = $('<div class="fechitas-container" />').append('<div class="fechitas-box"><div class="fechitas-decade fechitas-panel"><div class="fechitas-decade-years"></div></div><div class="fechitas-year fechitas-panel"><button type="button" class="fechitas-chooseDecade fechitas-choose"></button><div class="fechitas-year-months"></div></div><div class="fechitas-month fechitas-panel"><button type="button" class="fechitas-chooseDecade fechitas-choose"></button><button type="button" class="fechitas-chooseYear fechitas-choose"></button><div class="fechitas-month-days"></div></div></div>');

        container.find('.fechitas-month-days').before(mes);
        $('body').append(container);
      }
    };

    initFechitas(this);

    picker.on('focus', showFechitas);
    picker.on('click', showFechitas);
    container.on('click', hideFechitas);

    container.on('click', '.fechitas-chooseDecade', function (event) {
      var dec = parseInt($(this).val(), 10);
      buildDecade(dec, true);
      showPanel('.fechitas-decade');
      event.stopPropagation();
    });

    container.on('click', '.fechitas-chooseYear', function (event) {
      year = parseInt($(this).val(), 10);

      if ($(this).parent().hasClass('.fechitas-month')) {
        activa(this);
      }

      updateNav();
      showPanel('.fechitas-year');
      event.stopPropagation();
    });

    container.on('click', '.fechitas-chooseMonth', function (event) {
      month = parseInt($(this).val(), 10);
      activa(this);

      if (settings.type == 'month') {
        day = 1;
        colocaFecha();
        return this;
      }

      buildMonth(year, month);
      updateNav();
      showPanel('.fechitas-month');
      event.stopPropagation();
    });

    container.on('click', '.fechitas-chooseDay', function () {
      day = parseInt($(this).val(), 10);
      activa(this);
      colocaFecha();
    });

    return this;
  };

}(jQuery));
