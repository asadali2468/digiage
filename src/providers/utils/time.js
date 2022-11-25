// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { CoreConstants } from '@core/constants';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * "Utils" service with helper functions for date and time.
*/
var CoreTimeUtilsProvider = /** @class */ (function () {
    function CoreTimeUtilsProvider(translate) {
        this.translate = translate;
        this.FORMAT_REPLACEMENTS = {
            '%a': 'ddd',
            '%A': 'dddd',
            '%d': 'DD',
            '%e': 'D',
            '%j': 'DDDD',
            '%u': 'E',
            '%w': 'e',
            '%U': 'ww',
            '%V': 'WW',
            '%W': 'ww',
            '%b': 'MMM',
            '%B': 'MMMM',
            '%h': 'MMM',
            '%m': 'MM',
            '%C': '',
            '%g': 'GG',
            '%G': 'GGGG',
            '%y': 'YY',
            '%Y': 'YYYY',
            '%H': 'HH',
            '%k': 'H',
            '%I': 'hh',
            '%l': 'h',
            '%M': 'mm',
            '%p': 'A',
            '%P': 'a',
            '%r': 'hh:mm:ss A',
            '%R': 'HH:mm',
            '%S': 'ss',
            '%T': 'HH:mm:ss',
            '%X': 'LTS',
            '%z': 'ZZ',
            '%Z': 'ZZ',
            '%c': 'LLLL',
            '%D': 'MM/DD/YY',
            '%F': 'YYYY-MM-DD',
            '%s': 'X',
            '%x': 'L',
            '%n': '\n',
            '%t': '\t',
            '%%': '%'
        };
    }
    /**
     * Convert a PHP format to a Moment format.
     *
     * @param format PHP format.
     * @return Converted format.
     */
    CoreTimeUtilsProvider.prototype.convertPHPToMoment = function (format) {
        if (typeof format != 'string') {
            // Not valid.
            return '';
        }
        var converted = '', escaping = false;
        for (var i = 0; i < format.length; i++) {
            var char = format[i];
            if (char == '%') {
                // It's a PHP format, try to convert it.
                i++;
                char += format[i] || '';
                if (escaping) {
                    // We were escaping some characters, stop doing it now.
                    escaping = false;
                    converted += ']';
                }
                converted += typeof this.FORMAT_REPLACEMENTS[char] != 'undefined' ? this.FORMAT_REPLACEMENTS[char] : char;
            }
            else {
                // Not a PHP format. We need to escape them, otherwise the letters could be confused with Moment formats.
                if (!escaping) {
                    escaping = true;
                    converted += '[';
                }
                converted += char;
            }
        }
        if (escaping) {
            // Finish escaping.
            converted += ']';
        }
        return converted;
    };
    /**
     * Fix format to use in an ion-datetime.
     *
     * @param format Format to use.
     * @return Fixed format.
     */
    CoreTimeUtilsProvider.prototype.fixFormatForDatetime = function (format) {
        if (!format) {
            return '';
        }
        // The component ion-datetime doesn't support escaping characters ([]), so we remove them.
        var fixed = format.replace(/[\[\]]/g, '');
        if (fixed.indexOf('A') != -1) {
            // Do not use am/pm format because there is a bug in ion-datetime.
            fixed = fixed.replace(/ ?A/g, '');
            fixed = fixed.replace(/h/g, 'H');
        }
        return fixed;
    };
    /**
     * Returns hours, minutes and seconds in a human readable format
     *
     * @param seconds A number of seconds
     * @return Seconds in a human readable format.
     */
    CoreTimeUtilsProvider.prototype.formatTime = function (seconds) {
        var totalSecs, years, days, hours, mins, secs, remainder;
        totalSecs = Math.abs(seconds);
        years = Math.floor(totalSecs / CoreConstants.SECONDS_YEAR);
        remainder = totalSecs - (years * CoreConstants.SECONDS_YEAR);
        days = Math.floor(remainder / CoreConstants.SECONDS_DAY);
        remainder = totalSecs - (days * CoreConstants.SECONDS_DAY);
        hours = Math.floor(remainder / CoreConstants.SECONDS_HOUR);
        remainder = remainder - (hours * CoreConstants.SECONDS_HOUR);
        mins = Math.floor(remainder / CoreConstants.SECONDS_MINUTE);
        secs = remainder - (mins * CoreConstants.SECONDS_MINUTE);
        var ss = this.translate.instant('core.' + (secs == 1 ? 'sec' : 'secs')), sm = this.translate.instant('core.' + (mins == 1 ? 'min' : 'mins')), sh = this.translate.instant('core.' + (hours == 1 ? 'hour' : 'hours')), sd = this.translate.instant('core.' + (days == 1 ? 'day' : 'days')), sy = this.translate.instant('core.' + (years == 1 ? 'year' : 'years'));
        var oyears = '', odays = '', ohours = '', omins = '', osecs = '';
        if (years) {
            oyears = years + ' ' + sy;
        }
        if (days) {
            odays = days + ' ' + sd;
        }
        if (hours) {
            ohours = hours + ' ' + sh;
        }
        if (mins) {
            omins = mins + ' ' + sm;
        }
        if (secs) {
            osecs = secs + ' ' + ss;
        }
        if (years) {
            return oyears + ' ' + odays;
        }
        if (days) {
            return odays + ' ' + ohours;
        }
        if (hours) {
            return ohours + ' ' + omins;
        }
        if (mins) {
            return omins + ' ' + osecs;
        }
        if (secs) {
            return osecs;
        }
        return this.translate.instant('core.now');
    };
    /**
     * Returns hours, minutes and seconds in a human readable format.
     *
     * @param duration Duration in seconds
     * @param precision Number of elements to have in precision. 0 or undefined to full precission.
     * @return Duration in a human readable format.
     */
    CoreTimeUtilsProvider.prototype.formatDuration = function (duration, precision) {
        precision = precision || 5;
        var eventDuration = moment.duration(duration, 'seconds');
        var durationString = '';
        if (precision && eventDuration.years() > 0) {
            durationString += ' ' + moment.duration(eventDuration.years(), 'years').humanize();
            precision--;
        }
        if (precision && eventDuration.months() > 0) {
            durationString += ' ' + moment.duration(eventDuration.months(), 'months').humanize();
            precision--;
        }
        if (precision && eventDuration.days() > 0) {
            durationString += ' ' + moment.duration(eventDuration.days(), 'days').humanize();
            precision--;
        }
        if (precision && eventDuration.hours() > 0) {
            durationString += ' ' + moment.duration(eventDuration.hours(), 'hours').humanize();
            precision--;
        }
        if (precision && eventDuration.minutes() > 0) {
            durationString += ' ' + moment.duration(eventDuration.minutes(), 'minutes').humanize();
            precision--;
        }
        return durationString.trim();
    };
    /**
     * Returns duration in a short human readable format: minutes and seconds, in fromat: 3' 27''.
     *
     * @param duration Duration in seconds
     * @return Duration in a short human readable format.
     */
    CoreTimeUtilsProvider.prototype.formatDurationShort = function (duration) {
        var minutes = Math.floor(duration / 60);
        var seconds = duration - minutes * 60;
        var durations = [];
        if (minutes > 0) {
            durations.push(minutes + '\'');
        }
        if (seconds > 0 || minutes === 0) {
            durations.push(seconds + '\'\'');
        }
        return durations.join(' ');
    };
    /**
     * Return the current timestamp in a "readable" format: YYYYMMDDHHmmSS.
     *
     * @return The readable timestamp.
     */
    CoreTimeUtilsProvider.prototype.readableTimestamp = function () {
        return moment(Date.now()).format('YYYYMMDDHHmmSS');
    };
    /**
     * Return the current timestamp (UNIX format, seconds).
     *
     * @return The current timestamp in seconds.
     */
    CoreTimeUtilsProvider.prototype.timestamp = function () {
        return Math.round(Date.now() / 1000);
    };
    /**
     * Convert a timestamp into a readable date.
     *
     * @param timestamp Timestamp in milliseconds.
     * @param format The format to use (lang key). Defaults to core.strftimedaydatetime.
     * @param convert If true (default), convert the format from PHP to Moment. Set it to false for Moment formats.
     * @param fixDay If true (default) then the leading zero from %d is removed.
     * @param fixHour If true (default) then the leading zero from %I is removed.
     * @return Readable date.
     */
    CoreTimeUtilsProvider.prototype.userDate = function (timestamp, format, convert, fixDay, fixHour) {
        if (convert === void 0) { convert = true; }
        if (fixDay === void 0) { fixDay = true; }
        if (fixHour === void 0) { fixHour = true; }
        format = this.translate.instant(format ? format : 'core.strftimedaydatetime');
        if (fixDay) {
            format = format.replace(/%d/g, '%e');
        }
        if (fixHour) {
            format = format.replace('%I', '%l');
        }
        // Format could be in PHP format, convert it to moment.
        if (convert) {
            format = this.convertPHPToMoment(format);
        }
        return moment(timestamp).format(format);
    };
    /**
     * Convert a timestamp to the format to set to a datetime input.
     *
     * @param timestamp Timestamp to convert (in ms). If not provided, current time.
     * @return Formatted time.
     */
    CoreTimeUtilsProvider.prototype.toDatetimeFormat = function (timestamp) {
        timestamp = timestamp || Date.now();
        return this.userDate(timestamp, 'YYYY-MM-DDTHH:mm:ss.SSS', false) + 'Z';
    };
    /**
     * Convert a text into user timezone timestamp.
     *
     * @param date To convert to timestamp.
     * @return Converted timestamp.
     */
    CoreTimeUtilsProvider.prototype.convertToTimestamp = function (date) {
        if (typeof date == 'string' && date.slice(-1) == 'Z') {
            return moment(date).unix() - (moment().utcOffset() * 60);
        }
        return moment(date).unix();
    };
    /**
     * Return the localized ISO format (i.e DDMMYY) from the localized moment format. Useful for translations.
     * DO NOT USE this function for ion-datetime format. Moment escapes characters with [], but ion-datetime doesn't support it.
     *
     * @param localizedFormat Format to use.
     * @return Localized ISO format
     */
    CoreTimeUtilsProvider.prototype.getLocalizedDateFormat = function (localizedFormat) {
        return moment.localeData().longDateFormat(localizedFormat);
    };
    /**
     * For a given timestamp get the midnight value in the user's timezone.
     *
     * The calculation is performed relative to the user's midnight timestamp
     * for today to ensure that timezones are preserved.
     *
     * @param timestamp The timestamp to calculate from. If not defined, return today's midnight.
     * @return The midnight value of the user's timestamp.
     */
    CoreTimeUtilsProvider.prototype.getMidnightForTimestamp = function (timestamp) {
        if (timestamp) {
            return moment(timestamp * 1000).startOf('day').unix();
        }
        else {
            return moment().startOf('day').unix();
        }
    };
    CoreTimeUtilsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [TranslateService])
    ], CoreTimeUtilsProvider);
    return CoreTimeUtilsProvider;
}());
export { CoreTimeUtilsProvider };
var CoreTimeUtils = /** @class */ (function (_super) {
    __extends(CoreTimeUtils, _super);
    function CoreTimeUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreTimeUtils;
}(makeSingleton(CoreTimeUtilsProvider)));
export { CoreTimeUtils };
//# sourceMappingURL=time.js.map