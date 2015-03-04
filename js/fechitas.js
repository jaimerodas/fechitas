(function ( $ ) {
  $.fn.fechitas = function() {
      var elObjeto = this;
      elObjeto.parent().css('position', 'relative');
      tag = elObjeto.get(0).nodeName.toLowerCase();

      // Es un input?
      if (tag == 'input') {
        fecha = elObjeto.val();
      } else {
        fecha = elObjeto.html();
      }

      // Lo podemos convertir a fecha?
      if (fecha == '') {
        fecha = new Date();
      } else {
        fecha = Date.parse(fecha);
      }

      year = fecha.getUTCFullYear();
      month = fecha.getUTCMonth();
      day = fecha.getUTCDate();

      elObjeto.parent().append('<div class="fechitas-bg" style="display:none;"></div><div style="display:none;" class="fechitas-container"><div class="fechitas-decade fechitas-panel"><div class="fechitas-decade-years"></div></div><div class="fechitas-year fechitas-panel"><button type="button" class="fechitas-chooseDecade"></button><div class="fechitas-year-months"></div></div><div class="fechitas-month fechitas-panel"><button type="button" class="fechitas-chooseDecade"></button><button type="button" class="fechitas-chooseYear"></button><div class="fechitas-month-days"></div></div></div>');

      container = elObjeto.parent().find('.fechitas-container');
      bg = elObjeto.parent().find('.fechitas-bg');

      months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre','Octubre', 'Noviembre', 'Diciembre'];

      var buildDecade = function(y, isDecade) {
        isDecade = (typeof isDecade === "undefined") ? false : isDecade;

        decade = container.find('.fechitas-decade');
        years = decade.find('.fechitas-decade-years');

        years.html('');

        if (isDecade) {
          dec = y.toString();
        } else {
          dec = y.toString().substr(0,3);
        }

        for (var i = 0; i < 10; i++) {
          button = '<button type="button" class="fechitas-chooseYear';

          if (dec+i == year.toString()) {
            button += ' fechitas-active';
          }

          button += '" value="'+dec+i+'">'+dec+i+'</button>';

          years.append(button);
        }

        dec = parseInt(dec);
        years.prepend('<button type="button" class="fechitas-chooseDecade" value="'+(dec-1)+'">'+(dec-1)+'0\'s</button><button type="button" class="fechitas-chooseDecade" value="'+(dec+1)+'">'+(dec+1)+'0\'s</button>')
      };

      var buildYear = function(y, m) {
        annum = container.find('.fechitas-year');
        meses = annum.find('.fechitas-year-months').html('');

        dec = y.toString().substr(0,3)
        annum.find('.fechitas-chooseDecade').text(y).val(dec);

        for (var i = 0; i < 12; i++) {
          button = '<button class="fechitas-chooseMonth';

          if (i == month) {
            button += ' fechitas-active';
          }

          button += '" value="'+i+'" type="button">'+months[i]+'</button>';

          meses.append(button);
        }
      };

      var updateNav = function() {
        dec = year.toString().substr(0,3);
        container.find('.fechitas-year').find('.fechitas-chooseDecade').val(dec).text(year);
        container.find('.fechitas-month').find('.fechitas-chooseDecade').val(dec).text(year);
        container.find('.fechitas-month').find('.fechitas-chooseYear').val(year).text(months[month]);
        console.log(dec, year);
      }

      // http://stackoverflow.com/questions/1810984/number-of-days-in-any-month
      var daysInMonth = function(y, m) {
        if( /8|3|5|10/.test( m ) ) return 30;
        if( m != 1 ) return 31;
        if( ( y % 4 == 0 && y % 100 != 0 ) || y % 400 == 0 ) return 29;
        return 28;
      }

      var buildMonth = function(y, m) {
        d = daysInMonth(y, m);
        meses = container.find('.fechitas-month');
        dias = meses.find('.fechitas-month-days');

        dias.html('');

        for (var i = 1; i <= d; i++) {
          button = '<button type="button" class="fechitas-chooseDay';

          if (i == day) {
            button += ' fechitas-active';
          }

          button += '" value="'+i+'">'+i+'</button>';
          dias.append(button);
        }
      }

      var pad = function(n) {
        if (n<10) {
          return '0'+n;
        }
        return n;
      };

      var activa = function(o) {
        $(o).siblings().removeClass('fechitas-active')
        $(o).addClass('fechitas-active');
      };

      var showPanel = function(p) {
        panel = container.find(p);
        panel.siblings().hide();
        panel.show();
      };

      buildDecade(year);
      buildYear(year, month);
      buildMonth(year, month);
      updateNav();

      elObjeto.on('focus', function() {
        showPanel('.fechitas-month');
        container.fadeIn(500);
        bg.show();
      })

      bg.on('click', function() {
        container.fadeOut(300);
        bg.hide();
      });

      container.on('click', '.fechitas-chooseDecade', function() {
        dec = parseInt($(this).val());
        buildDecade(dec, true);
        showPanel('.fechitas-decade');
      });

      container.on('click', '.fechitas-chooseYear', function() {
        year = parseInt($(this).val());

        if ($(this).parent().hasClass('.fechitas-month')) {
          activa(this);
        }

        updateNav();
        showPanel('.fechitas-year');
      });

      container.on('click', '.fechitas-chooseMonth', function() {
        month = parseInt($(this).val());
        activa(this);
        buildMonth(year, month);
        updateNav();
        showPanel('.fechitas-month');
      });

      container.on('click', '.fechitas-chooseDay', function() {
        day = parseInt($(this).val());

        activa(this);

        if (tag == 'input') {
          fecha = new Date(year, month, day);
          elObjeto.val(fecha.getUTCFullYear()+'-'+pad(fecha.getUTCMonth()+1)+'-'+pad(fecha.getUTCDate()));
        }

        container.hide();
      });

      return this;
  };

}( jQuery ));
