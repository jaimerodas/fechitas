/*! fechitas - v0.2.2 - 2015-03-04
* https://jaimerodas.github.io/fechitas
* Copyright (c) 2015 Jaime Rodas; Licensed MIT */
Date.prototype.formatFechitas=function(a){var b,c="enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split(" "),d="ene feb mar abr may jun jul ago sep oct nov dic".split(" "),e=$.extend({type:"day",format:"normal",capitalized:!1},a),f="invalid format",g="-";switch("verbose"==e.format&&(b=d[this.getMonth()]),"veryverbose"==e.format&&(b=c[this.getMonth()],g=" "),"verbose"!=e.format&&"veryverbose"!=e.format||!e.capitalized||(b=b.capitalize()),e.format){case"normal":f=this.getUTCFullYear()+g+pad(this.getUTCMonth()+1);break;case"inverse":f=pad(this.getUTCMonth()+1)+g+this.getUTCFullYear();break;case"verbose":case"veryverbose":f=b+g+this.getUTCFullYear()}return"day"==e.type&&("normal"==e.format?f+=g+pad(this.getUTCDate()):f=pad(this.getUTCDate())+g+f),f},String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1)};var pad=function(a){return 10>a?"0"+a:a};!function(a){a.fn.fechitas=function(b){var c=a.extend({type:"day",format:"normal",capitalized:!1},b);if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))return this;a("body").append('<div class="fechitas-container" style="display:none;"><div class="fechitas-box"><div class="fechitas-decade fechitas-panel"><div class="fechitas-decade-years"></div></div><div class="fechitas-year fechitas-panel"><button type="button" class="fechitas-chooseDecade fechitas-choose"></button><div class="fechitas-year-months"></div></div><div class="fechitas-month fechitas-panel"><button type="button" class="fechitas-chooseDecade fechitas-choose"></button><button type="button" class="fechitas-chooseYear fechitas-choose"></button><div class="fechitas-month-week" /><div class="fechitas-month-days"></div></div></div></div>');var d,e,f,g,h,i,j=a("body").find(".fechitas-container"),k="D L M M J V S".split(" "),l="enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split(" "),m=("ene feb mar abr may jun jul ago sep oct nov dic".split(" "),j.find(".fechitas-month-week"));k.forEach(function(a){m.append('<div class="fechitas-week-day">'+a+"</div>")});var n=function(){var a=g.toString().substr(0,3);j.find(".fechitas-year").find(".fechitas-chooseDecade").val(a).text(g),j.find(".fechitas-month").find(".fechitas-chooseDecade").val(a).text(g),j.find(".fechitas-month").find(".fechitas-chooseYear").val(g).text(l[h].capitalize())},o=function(a,b){return/8|3|5|10/.test(b)?30:1!=b?31:a%4===0&&a%100!==0||a%400===0?29:28},p=function(a,b){b=void 0===b?!1:b;var c,d,e,f=j.find(".fechitas-decade"),h=f.find(".fechitas-decade-years");for(h.html(""),c=b?a.toString():a.toString().substr(0,3),d=0;10>d;d++)e='<button type="button" class="fechitas-chooseYear',c+d==g.toString()&&(e+=" fechitas-active"),e+='" value="'+c+d+'">'+c+d+"</button>",h.append(e);c=parseInt(c,10),h.prepend('<button type="button" class="fechitas-chooseDecade fechitas-choose" value="'+(c-1)+'">'+(c-1)+'0\'s</button><button type="button" class="fechitas-chooseDecade fechitas-choose" value="'+(c+1)+'">'+(c+1)+"0's</button>")},q=function(a){var b,c,d=j.find(".fechitas-year"),e=d.find(".fechitas-year-months").html(""),f=a.toString().substr(0,3);for(d.find(".fechitas-chooseDecade").text(a).val(f),b=0;12>b;b++)c='<button class="fechitas-chooseMonth',b==h&&(c+=" fechitas-active"),c+='" value="'+b+'" type="button">'+l[b].capitalize()+"</button>",e.append(c)},r=function(a,b){var c,d,e,f,k=o(a,b),l=j.find(".fechitas-month"),m=l.find(".fechitas-month-days");if(m.html(""),d=new Date(g,h,1),d=d.getDay(),d>0)for(e=0;d>e;e++)m.append('<div class="empty">');for(console.log(d),c=1;k>=c;c++)f='<button type="button" class="fechitas-chooseDay',c==i&&(f+=" fechitas-active"),f+='" value="'+c+'">'+c+"</button>",m.append(f)},s=function(b){a(b).siblings().removeClass("fechitas-active"),a(b).addClass("fechitas-active")},t=function(a){var b=j.find(a);b.siblings().hide(),b.show()},u=function(b){d=a(b),e=d.get(0).nodeName.toLowerCase();var j=d.data("fecha");j?f=new Date(j):(f="input"==e?d.val():d.html(),f=""===f?new Date:new Date(f),("[object Date]"!==Object.prototype.toString.call(f)||isNaN(f.getTime()))&&(f=new Date)),g=f.getUTCFullYear(),h=f.getUTCMonth(),i=f.getUTCDate(),p(g),q(g),"day"==c.type&&(r(g,h),n())},v=function(){f=new Date(g,h,i);var a=f.formatFechitas(c);"input"==e?d.val(a):d.text(a),d.data("fecha",f.formatFechitas()),j.fadeOut(300),d.trigger("fechitasDateChange",[a,f.formatFechitas()])},w=function(){u(this),t("month"==c.type?".fechitas-year":".fechitas-month"),j.fadeIn(500)};return u(this),d.on("focus",w),d.on("click",w),j.on("click",function(){j.fadeOut(300)}),j.on("click",".fechitas-chooseDecade",function(b){var c=parseInt(a(this).val(),10);p(c,!0),t(".fechitas-decade"),b.stopPropagation()}),j.on("click",".fechitas-chooseYear",function(b){g=parseInt(a(this).val(),10),a(this).parent().hasClass(".fechitas-month")&&s(this),n(),t(".fechitas-year"),b.stopPropagation()}),j.on("click",".fechitas-chooseMonth",function(b){return h=parseInt(a(this).val(),10),s(this),"month"==c.type?(i=1,v(),this):(r(g,h),n(),t(".fechitas-month"),void b.stopPropagation())}),j.on("click",".fechitas-chooseDay",function(){i=parseInt(a(this).val(),10),s(this),v()}),this}}(jQuery);