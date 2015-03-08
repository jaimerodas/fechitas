/*! fechitas - v0.5.0 - 2015-03-08
* https://jaimerodas.github.io/fechitas
* Copyright (c) 2015 Jaime Rodas; Licensed MIT */
(function ($, window, document, undefined) {

    var $element,
        $settings,
        $date,
        $container,

        set = false,
        nombre = 'fechitas',
        n = nombre + '-',
        id = '#' + n,
        cl = '.' + n,
        defaults = {
            type: 'day',
            format: 'normal',
            capitalized: false,
            hideOnMobile: true
        },
        monthsLong = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthsShort = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        weekdays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

    function pad(n) {
        if (n < 10) {
            return '0' + n;
        }
        return n;
    }

    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    function daysInMonth(y,m) {
        if (/8|3|5|10/.test(m)) {return 30; }
        if (m != 1) {return 31; }
        if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {return 29; }
        return 28;
    }

    function tag(tag, id) {
        var element = document.createElement(tag);

		if (id) {
			element.id = n + id;
		}

        return $(element);
    }

    function addPanel(name) {
        var panel = tag('div', name).attr('class', n + 'panel').append(
            tag('div').attr('class', n + 'nav'));
        if (name == 'month') {
            var week = tag('div', 'week');
            weekdays.forEach(function (d) {
                week.append(tag('div').attr('class', n + 'weekday').text(d));
            });
            panel.append(week);
        }
        panel.append(tag('div').attr('class', n + 'els'));
        return panel;
    }

    function selectPanel(name) {
        $container.find(cl + 'panel').hide();
        $container.find(id + name).show();
    }

    function buildHTML() {
        var container = $('#' + n + 'container');

        if (!container.length) {
            container = tag('div', 'container').append(tag('div', 'box').append(
            addPanel('decade'),
            addPanel('year'),
            addPanel('month')));
            $(document.body).append(container);
        }
    }

    function buildDecade(y) {
        y = y.toString();
        var dec, i,
            decade = $container.find(id + 'decade'),
            years = decade.children(cl + 'els').html(''),
            nav = decade.children(cl + 'nav').html('');

        if (y.length == 3) {
            dec = y;
        } else {
            dec = y.substr(0, 3);
        }

        for (i = 0; i < 10; i++) {
            var button = tag('button').attr({
                class: n + 'chooseYear',
                value: dec + i,
                type: 'button'
            }).text(dec + i);

            if (dec + i == y) {
                button.addClass(n + 'active');
            }

            years.append(button);
        }

        dec = parseInt(dec, 10);

        nav.append(
            tag('button').attr({value: dec - 1, type: 'button'}).addClass(n + 'chooseDecade', n + 'choose').text((dec - 1) + '0\'s'),
            tag('button').attr({value: dec + 1, type: 'button'}).addClass(n + 'chooseDecade', n + 'choose').text((dec + 1) + '0\'s')
        );
    }

    function buildYear() {
        var y = $date.getFullYear().toString(),
            m = $date.getMonth(),
            year = $container.find(id + 'year'),
            meses = year.children(cl + 'els').html(''),
            nav = year.children(cl + 'nav').html(''),
            dec = y.toString().substr(0, 3);

        monthsLong.forEach(function (mes, i) {
            var button = tag('button').attr({
                    class: n + 'chooseMonth',
                    type: 'button',
                    value: i
                }).text(capitalize(mes));

            if (i == m) {
                button.addClass(n + 'active');
            }

            meses.append(button);
        });

        nav.append(tag('button').attr({
            class: n + 'chooseDecade',
            type: 'button',
            value: dec
        }).text(y));
    }

    function buildMonth() {
        var i, j, e,
            y = $date.getFullYear().toString(),
            m = $date.getMonth(),
            d = $date.getDate(),
            dec = y.substr(0,3),
            enMes = daysInMonth(y, m),
            meses = $container.find(id + 'month'),
            dias = meses.children(cl + 'els').html(''),
            nav = meses.children(cl + 'nav').html('');

        e = new Date(y, m, 1);
        e = e.getDay();

        if (e > 0) {
            for (k = 0; k < e; k++) {
                dias.append(tag('div').addClass('empty'));
            }
        }

        for (i = 1; i <= enMes; i++) {
            var button = tag('button').attr({
                type: 'button',
                class: n + 'chooseDay',
                value: i
            }).text(i);

            if (i == d) {
                button.addClass(n + 'active');
            }

            dias.append(button);
        }

        nav.append(
            tag('button').attr({
                type: 'button',
                class: n + 'chooseDecade',
                value: dec
            }).text(y),
            tag('button').attr({
                type: 'button',
                class: n + 'chooseYear',
                value: y
            }).text(capitalize(monthsLong[m]))
        );
    }

    function initDate() {
        var date = $element.data(n + 'date'),
            tag = $element.get(0).nodeName.toLowerCase();

        if (!date) {
            if (tag == 'input') {
                $element.attr('type', 'text');
                date = $element.val();
            } else {
                date = $element.html();
            }

            date = new Date(date);

            if (
                date === '' ||
                (Object.prototype.toString.call(date) !== "[object Date]" || isNaN(date.getTime()))
            ) {
                date = new Date();
            }
        }

        if (Object.prototype.toString.call(date) !== "[object Date]" || isNaN(date.getTime())) {
            date = new Date(date);
        }

        console.log(date);

        if (date.getTimezoneOffset() !== 0) {
            ldate = new Date();
            ldate.setTime(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
            date = ldate;
        }

        console.log(date);

        return date;
    }

    function setDate() {
        if (!set) {
            set = true;
            var tag = $element.get(0).nodeName.toLowerCase(),
                text = $.fn.fechitas.format($date, $settings);

            $element.data(n + 'date', $date);

            if (tag == 'input') {
                $element.val(text);
            } else {
                $element.text(text);
            }

            $element.trigger('fechitasDateChange');
        }
    }

    function bindActions() {
        $container.click(function () {
            $settings = $element = $date = null;
            $(this).removeClass(n + 'visible');
        });

        $container.on('click', cl + 'chooseDay', function (e) {
            var day = $(this).val();
            $date.setDate(day);
            setDate();
        });

        $container.on('click', cl + 'chooseMonth', function (e) {
            var month = $(this).val();
            $date.setMonth(month);

            if ($settings.type != 'month') {
                buildMonth();
                selectPanel('month');
                e.stopPropagation();
                return;
            }

            $date.setDate(1);
            setDate();
        });

        $container.on('click', cl + 'chooseYear', function (e) {
            var year = $(this).val();
            $date.setFullYear(year);

            buildYear();
            selectPanel('year');

            e.stopPropagation();
        });

        $container.on('click', cl + 'chooseDecade', function (e) {
            var decade = $(this).val();

            buildDecade(decade);
            selectPanel('decade');

            e.stopPropagation();
        });
    }

    function openFechitas(element) {
        set = false;
        $element = element;
        $settings = $element.data(n + 'settings');
        $date = $element.data(n + 'date');

        $container = $(id + 'container').addClass(n + 'visible');

        buildDecade($date.getFullYear());
        buildYear();

        if ($settings.type == 'month') {
            selectPanel('year');
        } else {
            buildMonth();
            selectPanel('month');
        }

        bindActions();
    }

    $(buildHTML);

    $.fn.fechitas = function (options) {
        return this.each(function () {
            $element = $(this);
            $settings = $.extend({}, defaults, options);

            if ($settings.hideOnMobile && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return this;
            }

            $date = initDate();

            $element
                .addClass('has' + capitalize(nombre))
                .data(n + 'settings', $settings)
                .data(n + 'date', $date);

            $element.click(function () {
                openFechitas($(this));
            });

            return $element;
        });
    };

    $.fn.fechitas.format = function (fecha, options) {
        var settings = $.extend({}, {
            type: 'day',
            format: 'normal',
            capitalized: false
        }, options);

        var m,
            r = 'invalid format',
            s = '-';

        if (settings.format == 'verbose') {
            m = monthsShort[fecha.getMonth()];
        }

        if (settings.format == 'veryverbose') {
            m = monthsLong[fecha.getMonth()];
            s = ' ';
        }

        if ((settings.format == 'verbose' || settings.format == 'veryverbose') && settings.capitalized) {
            m = capitalize(m);
        }

        switch (settings.format) {
        case 'normal':
            r = fecha.getFullYear() + s + pad(fecha.getMonth() + 1);
            break;
        case 'inverse':
            r = pad(fecha.getMonth() + 1) + s + fecha.getFullYear();
            break;
        case 'verbose':
        case 'veryverbose':
            r = m + s + fecha.getFullYear();
            break;
        }

        if (settings.type == 'day') {
            if (settings.format == 'normal') {
                r += s + pad(fecha.getDate());
            } else {
                r = pad(fecha.getDate()) + s + r;
            }
        }

        return r;
    };

})(jQuery, window, document);
