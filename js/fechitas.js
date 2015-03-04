(function ( $ ) {
  $.fn.fechitas = function() {
      var elObjeto = this;

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

      year = fecha.getFullYear();
      month = fecha.getMonth();
      day = fecha.getDay();

      elObjeto.parent().append('<div class="fechitas-container"><div class="fechitas-decade"><div class="fechitas-decade-years"></div></div><div class="fechitas-year"><button type="button" class="fechitas-chooseDecade"></button><div class="fechitas-year-months"></div></div><div class="fechitas-month"><button type="button" class="fechitas-chooseDecade"></button><button type="button" class="fechitas-chooseYear"></button><div class="fechitas-month-days"></div></div></div>');

      container = elObjeto.parent().find('.fechitas-container');

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
          button = '<button type="button" class="fechitas-chooseYear" value="'+dec+i+'"';

          if (!isDecade && (dec+i == y.toString())) {
            button += ' class="fechitas-active"';
          }

          button += '>'+dec+i+'</button>';

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
          meses.append('<button class="fechitas-chooseMonth" value="'+i+'" type="button">'+months[i]+'</button>');
        }
      };

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

        dec = y.toString().substr(0,3);
        meses.find('.fechitas-chooseDecade').text(y).val(dec);
        meses.find('.fechitas-chooseYear').text(months[m]);

        for (var i = 1; i <= d; i++) {
          dias.append('<button type="button" class="fechitas-chooseDay" value="'+i+'">'+i+'</button>')
        }
      }

      var pad = function(n) {
        if (n<10) {
          return '0'+n;
        }
        return n;
      };

      buildDecade(year);
      buildYear(year, month);
      buildMonth(year, month);

      container.on('click', '.fechitas-chooseDecade', function() {
        dec = parseInt($(this).val());
        buildDecade(dec, true);
      });

      container.on('click', '.fechitas-chooseYear', function() {
        year = parseInt($(this).val());
        dec = year.toString().substr(0,3);
        container.find('.fechitas-year').find('.fechitas-chooseDecade').val(dec).text(year);
        container.find('.fechitas-month').find('.fechitas-chooseDecade').val(dec).text(year);

      });

      container.on('click', '.fechitas-chooseMonth', function() {
        month = parseInt($(this).val());
        buildMonth(year, month);
      });

      container.on('click', '.fechitas-chooseDay', function() {
        day = parseInt($(this).val());

        if (tag == 'input') {
          fecha = new Date(year, month, day);
          elObjeto.val(fecha.getUTCFullYear()+'-'+pad(fecha.getUTCMonth()+1)+'-'+pad(fecha.getUTCDate()));
        }
      });

      return this;
  };

}( jQuery ));
