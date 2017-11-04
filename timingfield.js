(function ($) {

    var TimingField = function (element, options) {
        this.elem = $(element);
        this.disabled = false;
        this.settings = $.extend({}, $.fn.timingfield.defaults, options);
        this.tpl = $($.fn.timingfield.template);

        this.init();
    };

    TimingField.prototype = {
        init: function () {
            this.elem.after(this.tpl);
            this.elem.hide();
            var timeoutId = 0;

            if (this.elem.is(':disabled')) {
                this.disable();
            }

            if (this.elem.val().length <= 0) {
                this.elem.val(this.settings.defaultValue);
            }

            // If not using a timestamp (seconds), parse HH:mm:ss to a timestamp if possible
            if (!this.settings.useTimestamp) {
                if (this.elem.val().indexOf(':') > -1 && this.elem.val().length > 0) {
                    var a = this.elem.val().split(':');

                    var seconds = 0;
                    if (a.length === 2) {
                        // HH:mm
                        seconds = (+a[0] * 60 * 60) + (+a[1] * 60);
                    } else if (a.length === 3) {
                        // HH:mm:ss
                        seconds = (+a[0] * 60 * 60) + (+a[1] * 60) + (+a[2]);
                    } else if (a.length === 4) {
                        // DD:HH:mm:ss
                        seconds = (+a[0] * 24 * 60 * 60) + (+a[1] * 60 * 60) + (+a[2] * 60) + (+a[3]);
                    }
                    this.elem.val(seconds);
                }
            }

            this.getDays().value = this.tsToDays(this.elem.val());
            this.getHours().value = this.tsToHours(this.elem.val());
            this.getMinutes().value = this.tsToMinutes(this.elem.val());
            this.getSeconds().value = this.tsToSeconds(this.elem.val());

            this.tpl.width(this.settings.width);
            this.tpl.find('.timingfield_days   .input-group-addon').text(this.settings.daysText);
            this.tpl.find('.timingfield_hours   .input-group-addon').text(this.settings.hoursText);
            this.tpl.find('.timingfield_minutes .input-group-addon').text(this.settings.minutesText);
            this.tpl.find('.timingfield_seconds .input-group-addon').text(this.settings.secondsText);

            this.tpl.find('.timingfield_hours .timingfield_next')
                .on('mouseup', function () {
                    clearInterval(timeoutId);
                    return false;
                })
                .on('mousedown', function (e) {
                    timeoutId = setInterval($.proxy(this.upHour, this), 100);
                    return false;
                })
            ;

            // +/- triggers
            this.tpl.find('.timingfield_days   .timingfield_next').on('mousedown', $.proxy(this.upDay, this));
            this.tpl.find('.timingfield_days   .timingfield_prev').on('mousedown', $.proxy(this.downDay, this));
            this.tpl.find('.timingfield_hours   .timingfield_next').on('mousedown', $.proxy(this.upHour, this));
            this.tpl.find('.timingfield_hours   .timingfield_prev').on('mousedown', $.proxy(this.downHour, this));
            this.tpl.find('.timingfield_minutes .timingfield_next').on('mousedown', $.proxy(this.upMin, this));
            this.tpl.find('.timingfield_minutes .timingfield_prev').on('mousedown', $.proxy(this.downMin, this));
            this.tpl.find('.timingfield_seconds .timingfield_next').on('mousedown', $.proxy(this.upSec, this));
            this.tpl.find('.timingfield_seconds .timingfield_prev').on('mousedown', $.proxy(this.downSec, this));

            // input triggers
            this.tpl.find('.timingfield_days   input').on('keyup', $.proxy(this.inputDay, this));
            this.tpl.find('.timingfield_hours   input').on('keyup', $.proxy(this.inputHour, this));
            this.tpl.find('.timingfield_minutes input').on('keyup', $.proxy(this.inputMin, this));
            this.tpl.find('.timingfield_seconds input').on('keyup', $.proxy(this.inputSec, this));

            // Show/Hide certain boxes depending on settings
            var numVisible = 4;
            if (this.settings.daysVisible) {
                this.tpl.find('.timingfield_days').show();
            } else {
                this.tpl.find('.timingfield_days').hide();
                numVisible--;
            }
            if (this.settings.hoursVisible) {
                this.tpl.find('.timingfield_hours').show();
            } else {
                this.tpl.find('.timingfield_hours').hide();
                numVisible--;
            }
            if (this.settings.minutesVisible) {
                this.tpl.find('.timingfield_minutes').show();
            } else {
                this.tpl.find('.timingfield_minutes').hide();
                numVisible--;
            }
            if (this.settings.secondsVisible) {
                this.tpl.find('.timingfield_seconds').show();
            } else {
                this.tpl.find('.timingfield_seconds').hide();
                numVisible--;
            }

            // Work out how wide the boxes need to be to fill the space properly
            var width = '24%';
            switch (numVisible) {
                case 0:
                case 1:
                    width = '100%';
                    break;
                case 2:
                    width = '49%';
                    break;
                case 3:
                    width = '32%';
                    break;
                case 4:
                    width = '24%';
                    break;
            }
            this.tpl.find('.timingfield_days').css('width', width);
            this.tpl.find('.timingfield_hours').css('width', width);
            this.tpl.find('.timingfield_minutes').css('width', width);
            this.tpl.find('.timingfield_seconds').css('width', width);

            // change on elem
            this.elem.on('change', $.proxy(this.change, this));
        },
        getDays: function () {
            return this.tpl.find('.timingfield_days input')[0];
        },
        getHours: function () {
            return this.tpl.find('.timingfield_hours input')[0];
        },
        getMinutes: function () {
            return this.tpl.find('.timingfield_minutes input')[0];
        },
        getSeconds: function () {
            return this.tpl.find('.timingfield_seconds input')[0];
        },
        tsToDays: function (timestamp) {
            return parseInt(Math.floor(timestamp / 86400)).pad(2);
        },
        tsToHours: function (timestamp) {
            return parseInt(Math.floor((timestamp % 86400) / 3600)).pad(2);
        },
        tsToMinutes: function (timestamp) {
            return parseInt(Math.floor(((timestamp % 86400) % 3600) / 60)).pad(2);
        },
        tsToSeconds: function (timestamp) {
            return parseInt(((timestamp % 86400) % 3600) % 60).pad(2);
        },
        dhmsToTimestamp: function (d, h, m, s) {
            return (parseInt(d) * 3600 * 24) + (parseInt(h) * 3600) + (parseInt(m) * 60) + parseInt(s);
        },
        dhmsToHms: function (d, h, m, s) {
            return ((parseInt(d) * 24) + parseInt(h)).pad(2) + ":" + parseInt(m).pad(2) + ":" + parseInt(s).pad(2);
        },
        updateElem: function () {
            if (this.settings.useTimestamp) {
                var newTs = this.dhmsToTimestamp(
                    this.getDays().value,
                    this.getHours().value,
                    this.getMinutes().value,
                    this.getSeconds().value
                );
                this.elem.attr('value', newTs);
                this.elem.val(newTs).trigger("change");
            } else {
                var newTs = this.dhmsToHms(
                    this.getDays().value,
                    this.getHours().value,
                    this.getMinutes().value,
                    this.getSeconds().value
                );
                this.elem.attr('value', newTs);
                this.elem.val(newTs).trigger("change");
            }
        },
        upDay: function () {
            if (!this.disabled) {
                if (this.getDays().value < this.settings.maxHour) {
                    this.getDays().value = parseInt(this.getDays().value) + 1;
                    this.updateElem();
                    return true;
                }
            }
            return false;
        },
        downDay: function () {
            if (!this.disabled) {
                if (this.getDays().value > 0) {
                    this.getDays().value = parseInt(this.getDays().value) - 1;
                    this.updateElem();
                    return true;
                }
            }
            return false;
        },
        inputDay: function () {
            if (!this.disabled) {
                if (this.getDays().value < 0) {
                    this.getDays().value = 0;
                }
            }

            this.updateElem();
        },
        upHour: function () {
            if (!this.disabled) {
                if (this.getHours().value < this.settings.maxHour) {
                    this.getHours().value = parseInt(this.getHours().value) + 1;
                    this.updateElem();
                    return true;
                } else if (this.upDay()) {
                    this.getHours().value = 0;
                    this.updateElem();
                    return true;
                }
            }
            return false;
        },
        downHour: function () {
            if (!this.disabled) {
                if (this.getHours().value > 0) {
                    this.getHours().value = parseInt(this.getHours().value) - 1;
                    this.updateElem();
                    return true;
                } else if (this.downDay()) {
                    this.getHours().value = this.settings.maxHour;
                    this.updateElem();
                    return true;
                }
            }
            return false;
        },
        inputHour: function () {
            if (!this.disabled) {
                if (this.getHours().value < 0) {
                    this.getHours().value = 0;
                } else if (this.getHours().value > this.settings.maxHour) {
                    this.getHours().value = this.settings.maxHour;
                }
            }

            this.updateElem();
        },
        upMin: function () {
            if (!this.disabled) {
                if (this.getMinutes().value < 59) {
                    this.getMinutes().value = parseInt(this.getMinutes().value) + this.settings.minutesInterval;
                    if (this.getMinutes().value > 59 && this.upHour()) {
                        this.getMinutes().value = 0;
                        this.updateElem();
                        return true;
                    } else {
                        this.updateElem();
                        return true;
                    }
                } else if (this.upHour()) {
                    this.getMinutes().value = 0;
                    this.updateElem();
                    return true;
                }
            }

            return false;
        },
        downMin: function () {
            if (!this.disabled) {
                if (this.getMinutes().value > 0) {
                    this.getMinutes().value = parseInt(this.getMinutes().value) - this.settings.minutesInterval;
                    this.updateElem();
                    return true;
                } else if (this.downHour()) {
                    this.getMinutes().value = 60 - this.settings.minutesInterval;
                    this.updateElem();
                    return true;
                }
            }

            return false;
        },
        inputMin: function () {
            if (!this.disabled) {
                if (this.getMinutes().value < 0) {
                    this.getMinutes().value = 0;
                } else if (this.getMinutes().value > 59) {
                    this.getMinutes().value = 59;
                }

                this.updateElem();
            }
        },
        upSec: function () {
            if (!this.disabled) {
                if (this.getSeconds().value < 59) {
                    this.getSeconds().value = parseInt(this.getSeconds().value) + 1;
                    this.updateElem();
                    return true;
                } else if (this.upMin()) {
                    this.getSeconds().value = 0;
                    this.updateElem();
                    return true;
                }
            }

            return false;
        },
        downSec: function () {
            if (!this.disabled) {
                if (this.getSeconds().value > 0) {
                    this.getSeconds().value = parseInt(this.getSeconds().value) - 1;
                    this.updateElem();
                    return true;
                } else if (this.downMin()) {
                    this.getSeconds().value = 59;
                    this.updateElem();
                    return true;
                }
            }

            return false;
        },
        inputSec: function () {
            if (!this.disabled) {
                if (this.getSeconds().value < 0) {
                    this.getSeconds().value = 0;
                } else if (this.getSeconds().value > 59) {
                    this.getSeconds().value = 59;
                }

                this.updateElem();
            }
        },
        disable: function () {
            this.disabled = true;
            this.tpl.find('input:text').prop('disabled', true);
        },
        enable: function () {
            this.disabled = false;
            this.tpl.find('input:text').prop('disabled', false);
        },
        change: function () {
            if (this.elem.is(':disabled')) {
                this.disable();
            } else {
                this.enable();
            }
        },
    };

    $.fn.timingfield = function (options) {
        // Iterate and reformat each matched element.
        return this.each(function () {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('timingfield')) return;

            var timingfield = new TimingField(this, options);

            // Store plugin object in this element's data
            element.data('timingfield', timingfield);
        });
    };

    $.fn.timingfield.defaults = {
        maxHour: 23,
        minutesInterval: 5,
        width: '100%',
        daysText: 'D',
        hoursText: 'H',
        minutesText: 'M',
        secondsText: 'S',
        useTimestamp: true,
        daysVisible: true,
        hoursVisible: true,
        minutesVisible: true,
        secondsVisible: true,
        defaultValue: 300
    };

    $.fn.timingfield.template = '<div class="timingfield">\
        <div class="timingfield_days">\
            <button type="button" class="timingfield_next btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-plus"></span></button>\
            <div class="input-group">\
                <input type="text" class="form-control">\
                <span class="input-group-addon"></span>\
            </div>\
            <button type="button" class="timingfield_prev btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-minus"></span></button>\
        </div>\
        <div class="timingfield_hours">\
            <button type="button" class="timingfield_next btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-plus"></span></button>\
            <div class="input-group">\
                <input type="text" class="form-control">\
                <span class="input-group-addon"></span>\
            </div>\
            <button type="button" class="timingfield_prev btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-minus"></span></button>\
        </div>\
        <div class="timingfield_minutes">\
            <button type="button" class="timingfield_next btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-plus"></span></button>\
            <span class="input-group">\
                <input type="text" class="form-control">\
                <span class="input-group-addon"></span>\
            </span>\
            <button type="button" class="timingfield_prev btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-minus"></span></button>\
        </div>\
        <div class="timingfield_seconds">\
            <button type="button" class="timingfield_next btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-plus"></span></button>\
            <span class="input-group">\
                <input type="text" class="form-control">\
                <span class="input-group-addon"></span>\
            </span>\
            <button type="button" class="timingfield_prev btn btn-default btn-xs btn-block" tabindex="-1"><span class="glyphicon glyphicon-minus"></span></button>\
        </div>\
    </div>';

}(jQuery));

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}