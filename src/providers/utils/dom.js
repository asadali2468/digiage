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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Injectable, SimpleChange } from '@angular/core';
import { LoadingController, ToastController, AlertController, PopoverController, ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { CoreTextUtilsProvider } from './text';
import { CoreApp } from '../app';
import { CoreConfigProvider } from '../config';
import { CoreEventsProvider } from '../events';
import { CoreLoggerProvider } from '../logger';
import { CoreUrlUtilsProvider } from './url';
import { CoreFileProvider } from '@providers/file';
import { CoreConstants } from '@core/constants';
import { CoreBSTooltipComponent } from '@components/bs-tooltip/bs-tooltip';
import { Md5 } from 'ts-md5/dist/md5';
import { Subject } from 'rxjs';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * "Utils" service with helper functions for UI, DOM elements and HTML code.
 */
var CoreDomUtilsProvider = /** @class */ (function () {
    function CoreDomUtilsProvider(translate, loadingCtrl, toastCtrl, alertCtrl, textUtils, configProvider, urlUtils, modalCtrl, sanitizer, popoverCtrl, fileProvider, loggerProvider, eventsProvider) {
        var _this = this;
        this.translate = translate;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.textUtils = textUtils;
        this.configProvider = configProvider;
        this.urlUtils = urlUtils;
        this.modalCtrl = modalCtrl;
        this.sanitizer = sanitizer;
        this.popoverCtrl = popoverCtrl;
        this.fileProvider = fileProvider;
        this.eventsProvider = eventsProvider;
        // List of input types that support keyboard.
        this.INPUT_SUPPORT_KEYBOARD = ['date', 'datetime', 'datetime-local', 'email', 'month', 'number', 'password',
            'search', 'tel', 'text', 'time', 'url', 'week'];
        this.INSTANCE_ID_ATTR_NAME = 'core-instance-id';
        this.template = document.createElement('template'); // A template element to convert HTML to element.
        this.instances = {}; // Store component/directive instances by id.
        this.lastInstanceId = 0;
        this.debugDisplay = false; // Whether to display debug messages. Store it in a variable to make it synchronous.
        this.displayedAlerts = {}; // To prevent duplicated alerts.
        this.logger = loggerProvider.getInstance('CoreDomUtilsProvider');
        // Check if debug messages should be displayed.
        configProvider.get(CoreConstants.SETTINGS_DEBUG_DISPLAY, false).then(function (debugDisplay) {
            _this.debugDisplay = !!debugDisplay;
        });
    }
    /**
     * Equivalent to element.closest(). If the browser doesn't support element.closest, it will
     * traverse the parents to achieve the same functionality.
     * Returns the closest ancestor of the current element (or the current element itself) which matches the selector.
     *
     * @param element DOM Element.
     * @param selector Selector to search.
     * @return Closest ancestor.
     */
    CoreDomUtilsProvider.prototype.closest = function (element, selector) {
        var _this = this;
        // Try to use closest if the browser supports it.
        if (typeof element.closest == 'function') {
            return element.closest(selector);
        }
        if (!this.matchesFn) {
            // Find the matches function supported by the browser.
            ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
                if (typeof document.body[fn] == 'function') {
                    _this.matchesFn = fn;
                    return true;
                }
                return false;
            });
            if (!this.matchesFn) {
                return;
            }
        }
        // Traverse parents.
        while (element) {
            if (element[this.matchesFn](selector)) {
                return element;
            }
            element = element.parentElement;
        }
    };
    /**
     * If the download size is higher than a certain threshold shows a confirm dialog.
     *
     * @param size Object containing size to download and a boolean to indicate if its totally or partialy calculated.
     * @param message Code of the message to show. Default: 'core.course.confirmdownload'.
     * @param unknownMessage ID of the message to show if size is unknown.
     * @param wifiThreshold Threshold to show confirm in WiFi connection. Default: CoreWifiDownloadThreshold.
     * @param limitedThreshold Threshold to show confirm in limited connection. Default: CoreDownloadThreshold.
     * @param alwaysConfirm True to show a confirm even if the size isn't high, false otherwise.
     * @return Promise resolved when the user confirms or if no confirm needed.
     */
    CoreDomUtilsProvider.prototype.confirmDownloadSize = function (size, message, unknownMessage, wifiThreshold, limitedThreshold, alwaysConfirm) {
        var _this = this;
        var readableSize = this.textUtils.bytesToSize(size.size, 2);
        var getAvailableBytes = new Promise(function (resolve) {
            if (CoreApp.instance.isDesktop()) {
                // Free space calculation is not supported on desktop.
                resolve(null);
            }
            else {
                _this.fileProvider.calculateFreeSpace().then(function (availableBytes) {
                    if (CoreApp.instance.isAndroid()) {
                        return availableBytes;
                    }
                    else {
                        // Space calculation is not accurate on iOS, but it gets more accurate when space is lower.
                        // We'll only use it when space is <500MB, or we're downloading more than twice the reported space.
                        if (availableBytes < CoreConstants.IOS_FREE_SPACE_THRESHOLD || size.size > availableBytes / 2) {
                            return availableBytes;
                        }
                        else {
                            return null;
                        }
                    }
                }).then(function (availableBytes) {
                    resolve(availableBytes);
                });
            }
        });
        var getAvailableSpace = getAvailableBytes.then(function (availableBytes) {
            if (availableBytes === null) {
                return '';
            }
            else {
                var availableSize = _this.textUtils.bytesToSize(availableBytes, 2);
                if (CoreApp.instance.isAndroid() && size.size > availableBytes - CoreConstants.MINIMUM_FREE_SPACE) {
                    return Promise.reject(_this.translate.instant('core.course.insufficientavailablespace', { size: readableSize }));
                }
                return _this.translate.instant('core.course.availablespace', { available: availableSize });
            }
        });
        return getAvailableSpace.then(function (availableSpace) {
            wifiThreshold = typeof wifiThreshold == 'undefined' ? CoreConstants.WIFI_DOWNLOAD_THRESHOLD : wifiThreshold;
            limitedThreshold = typeof limitedThreshold == 'undefined' ? CoreConstants.DOWNLOAD_THRESHOLD : limitedThreshold;
            var wifiPrefix = '';
            if (CoreApp.instance.isNetworkAccessLimited()) {
                wifiPrefix = _this.translate.instant('core.course.confirmlimiteddownload');
            }
            if (size.size < 0 || (size.size == 0 && !size.total)) {
                // Seems size was unable to be calculated. Show a warning.
                unknownMessage = unknownMessage || 'core.course.confirmdownloadunknownsize';
                return _this.showConfirm(wifiPrefix + _this.translate.instant(unknownMessage, { availableSpace: availableSpace }));
            }
            else if (!size.total) {
                // Filesize is only partial.
                return _this.showConfirm(wifiPrefix + _this.translate.instant('core.course.confirmpartialdownloadsize', { size: readableSize, availableSpace: availableSpace }));
            }
            else if (alwaysConfirm || size.size >= wifiThreshold ||
                (CoreApp.instance.isNetworkAccessLimited() && size.size >= limitedThreshold)) {
                message = message || (size.size === 0 ? 'core.course.confirmdownloadzerosize' : 'core.course.confirmdownload');
                return _this.showConfirm(wifiPrefix + _this.translate.instant(message, { size: readableSize, availableSpace: availableSpace }));
            }
            return Promise.resolve();
        });
    };
    /**
     * Convert some HTML as text into an HTMLElement. This HTML is put inside a div or a body.
     *
     * @param html Text to convert.
     * @return Element.
     */
    CoreDomUtilsProvider.prototype.convertToElement = function (html) {
        // Add a div to hold the content, that's the element that will be returned.
        this.template.innerHTML = '<div>' + html + '</div>';
        return this.template.content.children[0];
    };
    /**
     * Create a "cancelled" error. These errors won't display an error message in showErrorModal functions.
     *
     * @return The error object.
     */
    CoreDomUtilsProvider.prototype.createCanceledError = function () {
        return { coreCanceled: true };
    };
    /**
     * Given a list of changes for a component input detected by a KeyValueDiffers, create an object similar to the one
     * passed to the ngOnChanges functions.
     *
     * @param changes Changes detected by KeyValueDiffer.
     * @return Changes in a format like ngOnChanges.
     */
    CoreDomUtilsProvider.prototype.createChangesFromKeyValueDiff = function (changes) {
        var newChanges = {};
        // Added items are considered first change.
        changes.forEachAddedItem(function (item) {
            newChanges[item.key] = new SimpleChange(item.previousValue, item.currentValue, true);
        });
        // Changed or removed items aren't first change.
        changes.forEachChangedItem(function (item) {
            newChanges[item.key] = new SimpleChange(item.previousValue, item.currentValue, false);
        });
        changes.forEachRemovedItem(function (item) {
            newChanges[item.key] = new SimpleChange(item.previousValue, item.currentValue, true);
        });
        return newChanges;
    };
    /**
     * Extract the downloadable URLs from an HTML code.
     *
     * @param html HTML code.
     * @return List of file urls.
     * @deprecated since 3.8. Use CoreFilepoolProvider.extractDownloadableFilesFromHtml instead.
     */
    CoreDomUtilsProvider.prototype.extractDownloadableFilesFromHtml = function (html) {
        this.logger.error('The function extractDownloadableFilesFromHtml has been moved to CoreFilepoolProvider.' +
            ' Please use that function instead of this one.');
        var urls = [];
        var elements;
        var element = this.convertToElement(html);
        elements = element.querySelectorAll('a, img, audio, video, source, track');
        for (var i = 0; i < elements.length; i++) {
            var element_1 = elements[i];
            var url = element_1.tagName === 'A' ? element_1.href : element_1.src;
            if (url && this.urlUtils.isDownloadableUrl(url) && urls.indexOf(url) == -1) {
                urls.push(url);
            }
            // Treat video poster.
            if (element_1.tagName == 'VIDEO' && element_1.getAttribute('poster')) {
                url = element_1.getAttribute('poster');
                if (url && this.urlUtils.isDownloadableUrl(url) && urls.indexOf(url) == -1) {
                    urls.push(url);
                }
            }
        }
        return urls;
    };
    /**
     * Extract the downloadable URLs from an HTML code and returns them in fake file objects.
     *
     * @param html HTML code.
     * @return List of fake file objects with file URLs.
     * @deprecated since 3.8. Use CoreFilepoolProvider.extractDownloadableFilesFromHtmlAsFakeFileObjects instead.
     */
    CoreDomUtilsProvider.prototype.extractDownloadableFilesFromHtmlAsFakeFileObjects = function (html) {
        var urls = this.extractDownloadableFilesFromHtml(html);
        // Convert them to fake file objects.
        return urls.map(function (url) {
            return {
                fileurl: url
            };
        });
    };
    /**
     * Search all the URLs in a CSS file content.
     *
     * @param code CSS code.
     * @return List of URLs.
     */
    CoreDomUtilsProvider.prototype.extractUrlsFromCSS = function (code) {
        // First of all, search all the url(...) occurrences that don't include "data:".
        var urls = [], matches = code.match(/url\(\s*["']?(?!data:)([^)]+)\)/igm);
        if (!matches) {
            return urls;
        }
        // Extract the URL form each match.
        matches.forEach(function (match) {
            var submatches = match.match(/url\(\s*['"]?([^'"]*)['"]?\s*\)/im);
            if (submatches && submatches[1]) {
                urls.push(submatches[1]);
            }
        });
        return urls;
    };
    /**
     * Fix syntax errors in HTML.
     *
     * @param html HTML text.
     * @return Fixed HTML text.
     */
    CoreDomUtilsProvider.prototype.fixHtml = function (html) {
        this.template.innerHTML = html;
        var attrNameRegExp = /[^\x00-\x20\x7F-\x9F"'>\/=]+/;
        var fixElement = function (element) {
            // Remove attributes with an invalid name.
            Array.from(element.attributes).forEach(function (attr) {
                if (!attrNameRegExp.test(attr.name)) {
                    element.removeAttributeNode(attr);
                }
            });
            Array.from(element.children).forEach(fixElement);
        };
        Array.from(this.template.content.children).forEach(fixElement);
        return this.template.innerHTML;
    };
    /**
     * Focus an element and open keyboard.
     *
     * @param el HTML element to focus.
     */
    CoreDomUtilsProvider.prototype.focusElement = function (el) {
        if (el && el.focus) {
            el.focus();
            if (CoreApp.instance.isAndroid() && this.supportsInputKeyboard(el)) {
                // On some Android versions the keyboard doesn't open automatically.
                CoreApp.instance.openKeyboard();
            }
        }
    };
    /**
     * Formats a size to be used as width/height of an element.
     * If the size is already valid (like '500px' or '50%') it won't be modified.
     * Returned size will have a format like '500px'.
     *
     * @param size Size to format.
     * @return Formatted size. If size is not valid, returns an empty string.
     */
    CoreDomUtilsProvider.prototype.formatPixelsSize = function (size) {
        if (typeof size == 'string' && (size.indexOf('px') > -1 || size.indexOf('%') > -1 || size == 'auto' || size == 'initial')) {
            // It seems to be a valid size.
            return size;
        }
        size = parseInt(size, 10);
        if (!isNaN(size)) {
            return size + 'px';
        }
        return '';
    };
    /**
     * Returns the contents of a certain selection in a DOM element.
     *
     * @param element DOM element to search in.
     * @param selector Selector to search.
     * @return Selection contents. Undefined if not found.
     */
    CoreDomUtilsProvider.prototype.getContentsOfElement = function (element, selector) {
        if (element) {
            var selected = element.querySelector(selector);
            if (selected) {
                return selected.innerHTML;
            }
        }
    };
    /**
     * Get the data from a form. It will only collect elements that have a name.
     *
     * @param form The form to get the data from.
     * @return Object with the data. The keys are the names of the inputs.
     */
    CoreDomUtilsProvider.prototype.getDataFromForm = function (form) {
        if (!form || !form.elements) {
            return {};
        }
        var data = {};
        for (var i = 0; i < form.elements.length; i++) {
            var element = form.elements[i], name_1 = element.name || '';
            // Ignore submit inputs.
            if (!name_1 || element.type == 'submit' || element.tagName == 'BUTTON') {
                continue;
            }
            // Get the value.
            if (element.type == 'checkbox') {
                data[name_1] = !!element.checked;
            }
            else if (element.type == 'radio') {
                if (element.checked) {
                    data[name_1] = element.value;
                }
            }
            else {
                data[name_1] = element.value;
            }
        }
        return data;
    };
    /**
     * Returns the attribute value of a string element. Only the first element will be selected.
     *
     * @param html HTML element in string.
     * @param attribute Attribute to get.
     * @return Attribute value.
     */
    CoreDomUtilsProvider.prototype.getHTMLElementAttribute = function (html, attribute) {
        return this.convertToElement(html).children[0].getAttribute('src');
    };
    /**
     * Returns height of an element.
     *
     * @param element DOM element to measure.
     * @param usePadding Whether to use padding to calculate the measure.
     * @param useMargin Whether to use margin to calculate the measure.
     * @param useBorder Whether to use borders to calculate the measure.
     * @param innerMeasure If inner measure is needed: padding, margin or borders will be substracted.
     * @return Height in pixels.
     */
    CoreDomUtilsProvider.prototype.getElementHeight = function (element, usePadding, useMargin, useBorder, innerMeasure) {
        return this.getElementMeasure(element, false, usePadding, useMargin, useBorder, innerMeasure);
    };
    /**
     * Returns height or width of an element.
     *
     * @param element DOM element to measure.
     * @param getWidth Whether to get width or height.
     * @param usePadding Whether to use padding to calculate the measure.
     * @param useMargin Whether to use margin to calculate the measure.
     * @param useBorder Whether to use borders to calculate the measure.
     * @param innerMeasure If inner measure is needed: padding, margin or borders will be substracted.
     * @return Measure in pixels.
     */
    CoreDomUtilsProvider.prototype.getElementMeasure = function (element, getWidth, usePadding, useMargin, useBorder, innerMeasure) {
        var offsetMeasure = getWidth ? 'offsetWidth' : 'offsetHeight', measureName = getWidth ? 'width' : 'height', clientMeasure = getWidth ? 'clientWidth' : 'clientHeight', priorSide = getWidth ? 'Left' : 'Top', afterSide = getWidth ? 'Right' : 'Bottom';
        var measure = element[offsetMeasure] || element[measureName] || element[clientMeasure] || 0;
        // Measure not correctly taken.
        if (measure <= 0) {
            var style = getComputedStyle(element);
            if (style && style.display == '') {
                element.style.display = 'inline-block';
                measure = element[offsetMeasure] || element[measureName] || element[clientMeasure] || 0;
                element.style.display = '';
            }
        }
        if (usePadding || useMargin || useBorder) {
            var computedStyle = getComputedStyle(element);
            var surround = 0;
            if (usePadding) {
                surround += this.getComputedStyleMeasure(computedStyle, 'padding' + priorSide) +
                    this.getComputedStyleMeasure(computedStyle, 'padding' + afterSide);
            }
            if (useMargin) {
                surround += this.getComputedStyleMeasure(computedStyle, 'margin' + priorSide) +
                    this.getComputedStyleMeasure(computedStyle, 'margin' + afterSide);
            }
            if (useBorder) {
                surround += this.getComputedStyleMeasure(computedStyle, 'border' + priorSide + 'Width') +
                    this.getComputedStyleMeasure(computedStyle, 'border' + afterSide + 'Width');
            }
            if (innerMeasure) {
                measure = measure > surround ? measure - surround : 0;
            }
            else {
                measure += surround;
            }
        }
        return measure;
    };
    /**
     * Returns the computed style measure or 0 if not found or NaN.
     *
     * @param style Style from getComputedStyle.
     * @param measure Measure to get.
     * @return Result of the measure.
     */
    CoreDomUtilsProvider.prototype.getComputedStyleMeasure = function (style, measure) {
        return parseInt(style[measure], 10) || 0;
    };
    /**
     * Get the HTML code to render a connection warning icon.
     *
     * @return HTML Code.
     */
    CoreDomUtilsProvider.prototype.getConnectionWarningIconHtml = function () {
        return '<div text-center><span class="core-icon-with-badge">' +
            '<ion-icon role="img" class="icon fa fa-wifi" aria-label="wifi"></ion-icon>' +
            '<ion-icon class="icon fa fa-exclamation-triangle core-icon-badge"></ion-icon>' +
            '</span></div>';
    };
    /**
     * Returns width of an element.
     *
     * @param element DOM element to measure.
     * @param usePadding Whether to use padding to calculate the measure.
     * @param useMargin Whether to use margin to calculate the measure.
     * @param useBorder Whether to use borders to calculate the measure.
     * @param innerMeasure If inner measure is needed: padding, margin or borders will be substracted.
     * @return Width in pixels.
     */
    CoreDomUtilsProvider.prototype.getElementWidth = function (element, usePadding, useMargin, useBorder, innerMeasure) {
        return this.getElementMeasure(element, true, usePadding, useMargin, useBorder, innerMeasure);
    };
    /**
     * Retrieve the position of a element relative to another element.
     *
     * @param container Element to search in.
     * @param selector Selector to find the element to gets the position.
     * @param positionParentClass Parent Class where to stop calculating the position. Default scroll-content.
     * @return positionLeft, positionTop of the element relative to.
     */
    CoreDomUtilsProvider.prototype.getElementXY = function (container, selector, positionParentClass) {
        var element = (selector ? container.querySelector(selector) : container), offsetElement, positionTop = 0, positionLeft = 0;
        if (!positionParentClass) {
            positionParentClass = 'scroll-content';
        }
        if (!element) {
            return null;
        }
        while (element) {
            positionLeft += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            positionTop += (element.offsetTop - element.scrollTop + element.clientTop);
            offsetElement = element.offsetParent;
            element = element.parentElement;
            // Every parent class has to be checked but the position has to be got form offsetParent.
            while (offsetElement != element && element) {
                // If positionParentClass element is reached, stop adding tops.
                if (element.className.indexOf(positionParentClass) != -1) {
                    element = null;
                }
                else {
                    element = element.parentElement;
                }
            }
            // Finally, check again.
            if (element && element.className.indexOf(positionParentClass) != -1) {
                element = null;
            }
        }
        return [positionLeft, positionTop];
    };
    /**
     * Given an error message, return a suitable error title.
     *
     * @param message The error message.
     * @return Title.
     */
    CoreDomUtilsProvider.prototype.getErrorTitle = function (message) {
        if (message == this.translate.instant('core.networkerrormsg') ||
            message == this.translate.instant('core.fileuploader.errormustbeonlinetoupload')) {
            return this.sanitizer.bypassSecurityTrustHtml(this.getConnectionWarningIconHtml());
        }
        return this.textUtils.decodeHTML(this.translate.instant('core.error'));
    };
    /**
     * Get the error message from an error, including debug data if needed.
     *
     * @param error Message to show.
     * @param needsTranslate Whether the error needs to be translated.
     * @return Error message, null if no error should be displayed.
     */
    CoreDomUtilsProvider.prototype.getErrorMessage = function (error, needsTranslate) {
        var extraInfo = '';
        if (typeof error == 'object') {
            if (this.debugDisplay) {
                // Get the debug info. Escape the HTML so it is displayed as it is in the view.
                if (error.debuginfo) {
                    extraInfo = '<br><br>' + this.textUtils.escapeHTML(error.debuginfo, false);
                }
                if (error.backtrace) {
                    extraInfo += '<br><br>' + this.textUtils.replaceNewLines(this.textUtils.escapeHTML(error.backtrace, false), '<br>');
                }
                // tslint:disable-next-line
                console.error(error);
            }
            // We received an object instead of a string. Search for common properties.
            if (this.isCanceledError(error)) {
                // It's a canceled error, don't display an error.
                return null;
            }
            error = this.textUtils.getErrorMessageFromError(error);
            if (!error) {
                // No common properties found, just stringify it.
                error = JSON.stringify(error);
                extraInfo = ''; // No need to add extra info because it's already in the error.
            }
            // Try to remove tokens from the contents.
            var matches = error.match(/token"?[=|:]"?(\w*)/, '');
            if (matches && matches[1]) {
                error = error.replace(new RegExp(matches[1], 'g'), 'secret');
            }
        }
        if (error == CoreConstants.DONT_SHOW_ERROR) {
            // The error shouldn't be shown, stop.
            return null;
        }
        var message = this.textUtils.decodeHTML(needsTranslate ? this.translate.instant(error) : error);
        if (extraInfo) {
            message += extraInfo;
        }
        return message;
    };
    /**
     * Retrieve component/directive instance.
     * Please use this function only if you cannot retrieve the instance using parent/child methods: ViewChild (or similar)
     * or Angular's injection.
     *
     * @param element The root element of the component/directive.
     * @return The instance, undefined if not found.
     */
    CoreDomUtilsProvider.prototype.getInstanceByElement = function (element) {
        var id = element.getAttribute(this.INSTANCE_ID_ATTR_NAME);
        return this.instances[id];
    };
    /**
     * Check whether an error is an error caused because the user canceled a showConfirm.
     *
     * @param error Error to check.
     * @return Whether it's a canceled error.
     */
    CoreDomUtilsProvider.prototype.isCanceledError = function (error) {
        return error && error.coreCanceled;
    };
    /**
     * Wait an element to exists using the findFunction.
     *
     * @param findFunction The function used to find the element.
     * @return Resolved if found, rejected if too many tries.
     */
    CoreDomUtilsProvider.prototype.waitElementToExist = function (findFunction) {
        var promiseInterval = {
            promise: null,
            resolve: null,
            reject: null
        };
        var tries = 100;
        promiseInterval.promise = new Promise(function (resolve, reject) {
            promiseInterval.resolve = resolve;
            promiseInterval.reject = reject;
        });
        var clear = setInterval(function () {
            var element = findFunction();
            if (element) {
                clearInterval(clear);
                promiseInterval.resolve(element);
            }
            else {
                tries--;
                if (tries <= 0) {
                    clearInterval(clear);
                    promiseInterval.reject();
                }
            }
        }, 100);
        return promiseInterval.promise;
    };
    /**
     * Handle bootstrap tooltips in a certain element.
     *
     * @param element Element to check.
     */
    CoreDomUtilsProvider.prototype.handleBootstrapTooltips = function (element) {
        var _this = this;
        var els = Array.from(element.querySelectorAll('[data-toggle="tooltip"]'));
        els.forEach(function (el) {
            var content = el.getAttribute('title') || el.getAttribute('data-original-title'), trigger = el.getAttribute('data-trigger') || 'hover focus', treated = el.getAttribute('data-bstooltip-treated');
            if (!content || treated === 'true' ||
                (trigger.indexOf('hover') == -1 && trigger.indexOf('focus') == -1 && trigger.indexOf('click') == -1)) {
                return;
            }
            el.setAttribute('data-bstooltip-treated', 'true'); // Mark it as treated.
            // Store the title in data-original-title instead of title, like BS does.
            el.setAttribute('data-original-title', content);
            el.setAttribute('title', '');
            el.addEventListener('click', function (e) {
                var html = el.getAttribute('data-html');
                var popover = _this.popoverCtrl.create(CoreBSTooltipComponent, {
                    content: content,
                    html: html === 'true'
                });
                popover.present({
                    ev: e
                });
            });
        });
    };
    /**
     * Check if an element is outside of screen (viewport).
     *
     * @param scrollEl The element that must be scrolled.
     * @param element DOM element to check.
     * @return Whether the element is outside of the viewport.
     */
    CoreDomUtilsProvider.prototype.isElementOutsideOfScreen = function (scrollEl, element) {
        var elementRect = element.getBoundingClientRect();
        var elementMidPoint, scrollElRect, scrollTopPos = 0;
        if (!elementRect) {
            return false;
        }
        elementMidPoint = Math.round((elementRect.bottom + elementRect.top) / 2);
        scrollElRect = scrollEl.getBoundingClientRect();
        scrollTopPos = (scrollElRect && scrollElRect.top) || 0;
        return elementMidPoint > window.innerHeight || elementMidPoint < scrollTopPos;
    };
    /**
     * Check if rich text editor is enabled.
     *
     * @return Promise resolved with boolean: true if enabled, false otherwise.
     */
    CoreDomUtilsProvider.prototype.isRichTextEditorEnabled = function () {
        if (this.isRichTextEditorSupported()) {
            return this.configProvider.get(CoreConstants.SETTINGS_RICH_TEXT_EDITOR, true).then(function (enabled) {
                return !!enabled;
            });
        }
        return Promise.resolve(false);
    };
    /**
     * Check if rich text editor is supported in the platform.
     *
     * @return Whether it's supported.
     */
    CoreDomUtilsProvider.prototype.isRichTextEditorSupported = function () {
        return true;
    };
    /**
     * Move children from one HTMLElement to another.
     *
     * @param oldParent The old parent.
     * @param newParent The new parent.
     * @param prepend If true, adds the children to the beginning of the new parent.
     * @return List of moved children.
     */
    CoreDomUtilsProvider.prototype.moveChildren = function (oldParent, newParent, prepend) {
        var movedChildren = [];
        var referenceNode = prepend ? newParent.firstChild : null;
        while (oldParent.childNodes.length > 0) {
            var child = oldParent.childNodes[0];
            movedChildren.push(child);
            newParent.insertBefore(child, referenceNode);
        }
        return movedChildren;
    };
    /**
     * Search and remove a certain element from inside another element.
     *
     * @param element DOM element to search in.
     * @param selector Selector to search.
     */
    CoreDomUtilsProvider.prototype.removeElement = function (element, selector) {
        if (element) {
            var selected = element.querySelector(selector);
            if (selected) {
                selected.remove();
            }
        }
    };
    /**
     * Search and remove a certain element from an HTML code.
     *
     * @param html HTML code to change.
     * @param selector Selector to search.
     * @param removeAll True if it should remove all matches found, false if it should only remove the first one.
     * @return HTML without the element.
     */
    CoreDomUtilsProvider.prototype.removeElementFromHtml = function (html, selector, removeAll) {
        var selected;
        var element = this.convertToElement(html);
        if (removeAll) {
            selected = element.querySelectorAll(selector);
            for (var i = 0; i < selected.length; i++) {
                selected[i].remove();
            }
        }
        else {
            selected = element.querySelector(selector);
            if (selected) {
                selected.remove();
            }
        }
        return element.innerHTML;
    };
    /**
     * Remove a component/directive instance using the DOM Element.
     *
     * @param element The root element of the component/directive.
     */
    CoreDomUtilsProvider.prototype.removeInstanceByElement = function (element) {
        var id = element.getAttribute(this.INSTANCE_ID_ATTR_NAME);
        delete this.instances[id];
    };
    /**
     * Remove a component/directive instance using the ID.
     *
     * @param id The ID to remove.
     */
    CoreDomUtilsProvider.prototype.removeInstanceById = function (id) {
        delete this.instances[id];
    };
    /**
     * Search for certain classes in an element contents and replace them with the specified new values.
     *
     * @param element DOM element.
     * @param map Mapping of the classes to replace. Keys must be the value to replace, values must be
     *            the new class name. Example: {'correct': 'core-question-answer-correct'}.
     */
    CoreDomUtilsProvider.prototype.replaceClassesInElement = function (element, map) {
        for (var key in map) {
            var foundElements = element.querySelectorAll('.' + key);
            for (var i = 0; i < foundElements.length; i++) {
                var foundElement = foundElements[i];
                foundElement.className = foundElement.className.replace(key, map[key]);
            }
        }
    };
    /**
     * Given an HTML, search all links and media and tries to restore original sources using the paths object.
     *
     * @param html HTML code.
     * @param paths Object linking URLs in the html code with the real URLs to use.
     * @param anchorFn Function to call with each anchor. Optional.
     * @return Treated HTML code.
     */
    CoreDomUtilsProvider.prototype.restoreSourcesInHtml = function (html, paths, anchorFn) {
        var _this = this;
        var media, anchors;
        var element = this.convertToElement(html);
        // Treat elements with src (img, audio, video, ...).
        media = Array.from(element.querySelectorAll('img, video, audio, source, track'));
        media.forEach(function (media) {
            var newSrc = paths[_this.textUtils.decodeURIComponent(media.getAttribute('src'))];
            if (typeof newSrc != 'undefined') {
                media.setAttribute('src', newSrc);
            }
            // Treat video posters.
            if (media.tagName == 'VIDEO' && media.getAttribute('poster')) {
                newSrc = paths[_this.textUtils.decodeURIComponent(media.getAttribute('poster'))];
                if (typeof newSrc !== 'undefined') {
                    media.setAttribute('poster', newSrc);
                }
            }
        });
        // Now treat links.
        anchors = Array.from(element.querySelectorAll('a'));
        anchors.forEach(function (anchor) {
            var href = _this.textUtils.decodeURIComponent(anchor.getAttribute('href')), newUrl = paths[href];
            if (typeof newUrl != 'undefined') {
                anchor.setAttribute('href', newUrl);
                if (typeof anchorFn == 'function') {
                    anchorFn(anchor, href);
                }
            }
        });
        return element.innerHTML;
    };
    /**
     * Scroll to somehere in the content.
     * Checks hidden property _scroll to avoid errors if view is not active.
     *
     * @param content Content where to execute the function.
     * @param x The x-value to scroll to.
     * @param y The y-value to scroll to.
     * @param duration Duration of the scroll animation in milliseconds. Defaults to `300`.
     * @return Returns a promise which is resolved when the scroll has completed.
     */
    CoreDomUtilsProvider.prototype.scrollTo = function (content, x, y, duration, done) {
        return content && content._scroll && content.scrollTo(x, y, duration, done);
    };
    /**
     * Scroll to Bottom of the content.
     * Checks hidden property _scroll to avoid errors if view is not active.
     *
     * @param content Content where to execute the function.
     * @param duration Duration of the scroll animation in milliseconds. Defaults to `300`.
     * @return Returns a promise which is resolved when the scroll has completed.
     */
    CoreDomUtilsProvider.prototype.scrollToBottom = function (content, duration) {
        return content && content._scroll && content.scrollToBottom(duration);
    };
    /**
     * Scroll to Top of the content.
     * Checks hidden property _scroll to avoid errors if view is not active.
     *
     * @param content Content where to execute the function.
     * @param duration Duration of the scroll animation in milliseconds. Defaults to `300`.
     * @return Returns a promise which is resolved when the scroll has completed.
     */
    CoreDomUtilsProvider.prototype.scrollToTop = function (content, duration) {
        return content && content._scroll && content.scrollToTop(duration);
    };
    /**
     * Returns contentHeight of the content.
     * Checks hidden property _scroll to avoid errors if view is not active.
     *
     * @param content Content where to execute the function.
     * @return Content contentHeight or 0.
     */
    CoreDomUtilsProvider.prototype.getContentHeight = function (content) {
        return (content && content._scroll && content.contentHeight) || 0;
    };
    /**
     * Returns scrollHeight of the content.
     * Checks hidden property _scroll to avoid errors if view is not active.
     *
     * @param content Content where to execute the function.
     * @return Content scrollHeight or 0.
     */
    CoreDomUtilsProvider.prototype.getScrollHeight = function (content) {
        return (content && content._scroll && content.scrollHeight) || 0;
    };
    /**
     * Returns scrollTop of the content.
     * Checks hidden property _scrollContent to avoid errors if view is not active.
     * Using navite value of scroll to avoid having non updated values.
     *
     * @param content Content where to execute the function.
     * @return Content scrollTop or 0.
     */
    CoreDomUtilsProvider.prototype.getScrollTop = function (content) {
        return (content && content._scrollContent && content._scrollContent.nativeElement.scrollTop) || 0;
    };
    /**
     * Scroll to a certain element.
     *
     * @param content The content that must be scrolled.
     * @param element The element to scroll to.
     * @param scrollParentClass Parent class where to stop calculating the position. Default scroll-content.
     * @return True if the element is found, false otherwise.
     */
    CoreDomUtilsProvider.prototype.scrollToElement = function (content, element, scrollParentClass) {
        var position = this.getElementXY(element, undefined, scrollParentClass);
        if (!position) {
            return false;
        }
        this.scrollTo(content, position[0], position[1]);
        return true;
    };
    /**
     * Scroll to a certain element using a selector to find it.
     *
     * @param content The content that must be scrolled.
     * @param selector Selector to find the element to scroll to.
     * @param scrollParentClass Parent class where to stop calculating the position. Default scroll-content.
     * @return True if the element is found, false otherwise.
     */
    CoreDomUtilsProvider.prototype.scrollToElementBySelector = function (content, selector, scrollParentClass) {
        var position = this.getElementXY(content.getScrollElement(), selector, scrollParentClass);
        if (!position) {
            return false;
        }
        this.scrollTo(content, position[0], position[1]);
        return true;
    };
    /**
     * Search for an input with error (core-input-error directive) and scrolls to it if found.
     *
     * @param content The content that must be scrolled.
     * @param [scrollParentClass] Parent class where to stop calculating the position. Default scroll-content.
     * @return True if the element is found, false otherwise.
     */
    CoreDomUtilsProvider.prototype.scrollToInputError = function (content, scrollParentClass) {
        if (!content) {
            return false;
        }
        return this.scrollToElementBySelector(content, '.core-input-error', scrollParentClass);
    };
    /**
     * Set whether debug messages should be displayed.
     *
     * @param value Whether to display or not.
     */
    CoreDomUtilsProvider.prototype.setDebugDisplay = function (value) {
        this.debugDisplay = value;
    };
    /**
     * Show an alert modal with a button to close it.
     *
     * @param title Title to show.
     * @param message Message to show.
     * @param buttonText Text of the button.
     * @param autocloseTime Number of milliseconds to wait to close the modal. If not defined, modal won't be closed.
     * @return Promise resolved with the alert modal.
     */
    CoreDomUtilsProvider.prototype.showAlert = function (title, message, buttonText, autocloseTime) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.showAlertWithOptions({
                        title: title,
                        message: message,
                        buttons: [buttonText || this.translate.instant('core.ok')]
                    }, autocloseTime)];
            });
        });
    };
    /**
     * General show an alert modal.
     *
     * @param options Alert options to pass to the alert.
     * @param autocloseTime Number of milliseconds to wait to close the modal. If not defined, modal won't be closed.
     * @return Promise resolved with the alert modal.
     */
    CoreDomUtilsProvider.prototype.showAlertWithOptions = function (options, autocloseTime) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var hasHTMLTags, _a, alertId, alert;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        hasHTMLTags = this.textUtils.hasHTMLTags(options.message || '');
                        if (!hasHTMLTags) return [3 /*break*/, 2];
                        // Format the text.
                        _a = options;
                        return [4 /*yield*/, this.textUtils.formatText(options.message)];
                    case 1:
                        // Format the text.
                        _a.message = _b.sent();
                        _b.label = 2;
                    case 2:
                        alertId = Md5.hashAsciiStr((options.title || '') + '#' + (options.message || ''));
                        if (this.displayedAlerts[alertId]) {
                            // There's already an alert with the same message and title. Return it.
                            return [2 /*return*/, this.displayedAlerts[alertId]];
                        }
                        alert = this.alertCtrl.create(options);
                        alert.present().then(function () {
                            if (hasHTMLTags) {
                                // Treat all anchors so they don't override the app.
                                var alertMessageEl = alert.pageRef().nativeElement.querySelector('.alert-message');
                                _this.treatAnchors(alertMessageEl);
                            }
                        });
                        // Store the alert and remove it when dismissed.
                        this.displayedAlerts[alertId] = alert;
                        // Define the observables to extend the Alert class. This will allow several callbacks instead of just one.
                        alert.didDismiss = new Subject();
                        alert.willDismiss = new Subject();
                        // Set the callbacks to trigger an observable event.
                        alert.onDidDismiss(function (data, role) {
                            delete _this.displayedAlerts[alertId];
                            alert.didDismiss.next({ data: data, role: role });
                        });
                        alert.onWillDismiss(function (data, role) {
                            alert.willDismiss.next({ data: data, role: role });
                        });
                        if (autocloseTime > 0) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var cancelButton;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, alert.dismiss()];
                                        case 1:
                                            _a.sent();
                                            if (options.buttons) {
                                                cancelButton = options.buttons.find(function (button) {
                                                    return typeof button != 'string' && typeof button.role != 'undefined' &&
                                                        typeof button.handler != 'undefined' && button.role == 'cancel';
                                                });
                                                cancelButton && cancelButton.handler(null);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, autocloseTime);
                        }
                        return [2 /*return*/, alert];
                }
            });
        });
    };
    /**
     * Show an alert modal with a button to close it, translating the values supplied.
     *
     * @param title Title to show.
     * @param message Message to show.
     * @param buttonText Text of the button.
     * @param autocloseTime Number of milliseconds to wait to close the modal. If not defined, modal won't be closed.
     * @return Promise resolved with the alert modal.
     */
    CoreDomUtilsProvider.prototype.showAlertTranslated = function (title, message, buttonText, autocloseTime) {
        title = title ? this.translate.instant(title) : title;
        message = message ? this.translate.instant(message) : message;
        buttonText = buttonText ? this.translate.instant(buttonText) : buttonText;
        return this.showAlert(title, message, buttonText, autocloseTime);
    };
    /**
     * Shortcut for a delete confirmation modal.
     *
     * @param translateMessage String key to show in the modal body translated. Default: 'core.areyousure'.
     * @param translateArgs Arguments to pass to translate if necessary.
     * @param options More options. See https://ionicframework.com/docs/v3/api/components/alert/AlertController/
     * @return Promise resolved if the user confirms and rejected with a canceled error if he cancels.
     */
    CoreDomUtilsProvider.prototype.showDeleteConfirm = function (translateMessage, translateArgs, options) {
        if (translateMessage === void 0) { translateMessage = 'core.areyousure'; }
        if (translateArgs === void 0) { translateArgs = {}; }
        return this.showConfirm(this.translate.instant(translateMessage, translateArgs), undefined, this.translate.instant('core.delete'), undefined, options);
    };
    /**
     * Show a confirm modal.
     *
     * @param message Message to show in the modal body.
     * @param title Title of the modal.
     * @param okText Text of the OK button.
     * @param cancelText Text of the Cancel button.
     * @param options More options. See https://ionicframework.com/docs/v3/api/components/alert/AlertController/
     * @return Promise resolved if the user confirms and rejected with a canceled error if he cancels.
     */
    CoreDomUtilsProvider.prototype.showConfirm = function (message, title, okText, cancelText, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            options.title = title;
            options.message = message;
            options.buttons = [
                {
                    text: cancelText || _this.translate.instant('core.cancel'),
                    role: 'cancel',
                    handler: function () {
                        reject(_this.createCanceledError());
                    }
                },
                {
                    text: okText || _this.translate.instant('core.ok'),
                    handler: function (data) {
                        resolve(data);
                    }
                }
            ];
            if (!title) {
                options.cssClass = (options.cssClass || '') + ' core-nohead';
            }
            _this.showAlertWithOptions(options, 0);
        });
    };
    /**
     * Show an alert modal with an error message.
     *
     * @param error Message to show.
     * @param needsTranslate Whether the error needs to be translated.
     * @param autocloseTime Number of milliseconds to wait to close the modal. If not defined, modal won't be closed.
     * @return Promise resolved with the alert modal.
     */
    CoreDomUtilsProvider.prototype.showErrorModal = function (error, needsTranslate, autocloseTime) {
        var message = this.getErrorMessage(error, needsTranslate);
        if (message === null) {
            // Message doesn't need to be displayed, stop.
            return Promise.resolve(null);
        }
        return this.showAlert(this.getErrorTitle(message), message, undefined, autocloseTime);
    };
    /**
     * Show an alert modal with an error message. It uses a default message if error is not a string.
     *
     * @param error Message to show.
     * @param defaultError Message to show if the error is not a string.
     * @param needsTranslate Whether the error needs to be translated.
     * @param autocloseTime Number of milliseconds to wait to close the modal. If not defined, modal won't be closed.
     * @return Promise resolved with the alert modal.
     */
    CoreDomUtilsProvider.prototype.showErrorModalDefault = function (error, defaultError, needsTranslate, autocloseTime) {
        if (this.isCanceledError(error)) {
            // It's a canceled error, don't display an error.
            return;
        }
        var errorMessage = error;
        if (error && typeof error != 'string') {
            errorMessage = this.textUtils.getErrorMessageFromError(error);
        }
        return this.showErrorModal(typeof errorMessage == 'string' ? error : defaultError, needsTranslate, autocloseTime);
    };
    /**
     * Show an alert modal with the first warning error message. It uses a default message if error is not a string.
     *
     * @param warnings Warnings returned.
     * @param defaultError Message to show if the error is not a string.
     * @param needsTranslate Whether the error needs to be translated.
     * @param autocloseTime Number of milliseconds to wait to close the modal. If not defined, modal won't be closed.
     * @return Promise resolved with the alert modal.
     */
    CoreDomUtilsProvider.prototype.showErrorModalFirstWarning = function (warnings, defaultError, needsTranslate, autocloseTime) {
        var error = warnings && warnings.length && warnings[0].message;
        return this.showErrorModalDefault(error, defaultError, needsTranslate, autocloseTime);
    };
    /**
     * Displays a loading modal window.
     *
     * @param text The text of the modal window. Default: core.loading.
     * @param needsTranslate Whether the 'text' needs to be translated.
     * @return Loading modal instance.
     * @description
     * Usage:
     *     let modal = domUtils.showModalLoading(myText);
     *     ...
     *     modal.dismiss();
     */
    CoreDomUtilsProvider.prototype.showModalLoading = function (text, needsTranslate) {
        if (!text) {
            text = this.translate.instant('core.loading');
        }
        else if (needsTranslate) {
            text = this.translate.instant(text);
        }
        var loader = this.loadingCtrl.create({
            content: text
        }), dismiss = loader.dismiss.bind(loader);
        var isPresented = false, isDismissed = false;
        // Override dismiss to prevent dismissing a modal twice (it can throw an error and cause problems).
        loader.dismiss = function (data, role, navOptions) {
            if (!isPresented || isDismissed) {
                isDismissed = true;
                return Promise.resolve();
            }
            isDismissed = true;
            return dismiss(data, role, navOptions);
        };
        // Wait a bit before presenting the modal, to prevent it being displayed if dissmiss is called fast.
        setTimeout(function () {
            if (!isDismissed) {
                isPresented = true;
                loader.present();
            }
        }, 40);
        return loader;
    };
    /**
     * Show a modal warning the user that he should use a different app.
     *
     * @param message The warning message.
     * @param link Link to the app to download if any.
     */
    CoreDomUtilsProvider.prototype.showDownloadAppNoticeModal = function (message, link) {
        var _this = this;
        var buttons = [{
                text: this.translate.instant('core.ok'),
                role: 'cancel'
            }];
        if (link) {
            buttons.push({
                text: this.translate.instant('core.download'),
                handler: function () {
                    _this.openInBrowser(link);
                }
            });
        }
        var alert = this.alertCtrl.create({
            message: message,
            buttons: buttons
        });
        alert.present().then(function () {
            var isDevice = CoreApp.instance.isAndroid() || CoreApp.instance.isIOS();
            if (!isDevice) {
                // Treat all anchors so they don't override the app.
                var alertMessageEl = alert.pageRef().nativeElement.querySelector('.alert-message');
                _this.treatAnchors(alertMessageEl);
            }
        });
    };
    /**
     * Show a prompt modal to input some data.
     *
     * @param message Modal message.
     * @param title Modal title.
     * @param placeholder Placeholder of the input element. By default, "Password".
     * @param type Type of the input element. By default, password.
     * @param options More options to pass to the alert.
     * @return Promise resolved with the input data if the user clicks OK, rejected if cancels.
     */
    CoreDomUtilsProvider.prototype.showPrompt = function (message, title, placeholder, type) {
        var _this = this;
        if (type === void 0) { type = 'password'; }
        return new Promise(function (resolve, reject) {
            placeholder = typeof placeholder == 'undefined' || placeholder == null ?
                _this.translate.instant('core.login.password') : placeholder;
            var options = {
                title: title,
                message: message,
                inputs: [
                    {
                        name: 'promptinput',
                        placeholder: placeholder,
                        type: type
                    }
                ],
                buttons: [
                    {
                        text: _this.translate.instant('core.cancel'),
                        role: 'cancel',
                        handler: function () {
                            reject();
                        }
                    },
                    {
                        text: _this.translate.instant('core.ok'),
                        handler: function (data) {
                            resolve(data.promptinput);
                        }
                    }
                ],
            };
            _this.showAlertWithOptions(options);
        });
    };
    /**
     * Show a prompt modal to input a textarea.
     *
     * @param title Modal title.
     * @param message Modal message.
     * @param buttons Buttons to pass to the modal.
     * @param placeholder Placeholder of the input element if any.
     * @return Promise resolved when modal presented.
     */
    CoreDomUtilsProvider.prototype.showTextareaPrompt = function (title, message, buttons, placeholder) {
        var params = {
            title: title,
            message: message,
            placeholder: placeholder,
            buttons: buttons,
        };
        var modal = this.modalCtrl.create('CoreViewerTextAreaPage', params, { cssClass: 'core-modal-prompt' });
        return modal.present();
    };
    /**
     * Displays an autodimissable toast modal window.
     *
     * @param text The text of the toast.
     * @param needsTranslate Whether the 'text' needs to be translated.
     * @param duration Duration in ms of the dimissable toast.
     * @param cssClass Class to add to the toast.
     * @param dismissOnPageChange Dismiss the Toast on page change.
     * @return Toast instance.
     */
    CoreDomUtilsProvider.prototype.showToast = function (text, needsTranslate, duration, cssClass, dismissOnPageChange) {
        if (duration === void 0) { duration = 2000; }
        if (cssClass === void 0) { cssClass = ''; }
        if (dismissOnPageChange === void 0) { dismissOnPageChange = true; }
        if (needsTranslate) {
            text = this.translate.instant(text);
        }
        var loader = this.toastCtrl.create({
            message: text,
            duration: duration,
            position: 'bottom',
            cssClass: cssClass,
            dismissOnPageChange: dismissOnPageChange
        });
        loader.present();
        return loader;
    };
    /**
     * Stores a component/directive instance.
     *
     * @param element The root element of the component/directive.
     * @param instance The instance to store.
     * @return ID to identify the instance.
     */
    CoreDomUtilsProvider.prototype.storeInstanceByElement = function (element, instance) {
        var id = String(this.lastInstanceId++);
        element.setAttribute(this.INSTANCE_ID_ATTR_NAME, id);
        this.instances[id] = instance;
        return id;
    };
    /**
     * Check if an element supports input via keyboard.
     *
     * @param el HTML element to check.
     * @return Whether it supports input using keyboard.
     */
    CoreDomUtilsProvider.prototype.supportsInputKeyboard = function (el) {
        return el && !el.disabled && (el.tagName.toLowerCase() == 'textarea' ||
            (el.tagName.toLowerCase() == 'input' && this.INPUT_SUPPORT_KEYBOARD.indexOf(el.type) != -1));
    };
    /**
     * Converts HTML formatted text to DOM element(s).
     *
     * @param text HTML text.
     * @return Same text converted to HTMLCollection.
     */
    CoreDomUtilsProvider.prototype.toDom = function (text) {
        var element = this.convertToElement(text);
        return element.children;
    };
    /**
     * Treat anchors inside alert/modals.
     *
     * @param container The HTMLElement that can contain anchors.
     */
    CoreDomUtilsProvider.prototype.treatAnchors = function (container) {
        var _this = this;
        var anchors = Array.from(container.querySelectorAll('a'));
        anchors.forEach(function (anchor) {
            anchor.addEventListener('click', function (event) {
                if (event.defaultPrevented) {
                    // Stop.
                    return;
                }
                var href = anchor.getAttribute('href');
                if (href) {
                    event.preventDefault();
                    event.stopPropagation();
                    _this.openInBrowser(href);
                }
            });
        });
    };
    /**
     * View an image in a modal.
     *
     * @param image URL of the image.
     * @param title Title of the page or modal.
     * @param component Component to link the image to if needed.
     * @param componentId An ID to use in conjunction with the component.
     * @param fullScreen Whether the modal should be full screen.
     */
    CoreDomUtilsProvider.prototype.viewImage = function (image, title, component, componentId, fullScreen) {
        if (image) {
            var params = {
                title: title,
                image: image,
                component: component,
                componentId: componentId,
            };
            var options = fullScreen ? { cssClass: 'core-modal-fullscreen' } : {};
            var modal = this.modalCtrl.create('CoreViewerImagePage', params, options);
            modal.present();
        }
    };
    /**
     * Wait for images to load.
     *
     * @param element The element to search in.
     * @return Promise resolved with a boolean: whether there was any image to load.
     */
    CoreDomUtilsProvider.prototype.waitForImages = function (element) {
        var imgs = Array.from(element.querySelectorAll('img')), promises = [];
        var hasImgToLoad = false;
        imgs.forEach(function (img) {
            if (img && !img.complete) {
                hasImgToLoad = true;
                // Wait for image to load or fail.
                promises.push(new Promise(function (resolve, reject) {
                    var imgLoaded = function () {
                        resolve();
                        img.removeEventListener('load', imgLoaded);
                        img.removeEventListener('error', imgLoaded);
                    };
                    img.addEventListener('load', imgLoaded);
                    img.addEventListener('error', imgLoaded);
                }));
            }
        });
        return Promise.all(promises).then(function () {
            return hasImgToLoad;
        });
    };
    /**
     * Wrap an HTMLElement with another element.
     *
     * @param el The element to wrap.
     * @param wrapper Wrapper.
     */
    CoreDomUtilsProvider.prototype.wrapElement = function (el, wrapper) {
        // Insert the wrapper before the element.
        el.parentNode.insertBefore(wrapper, el);
        // Now move the element into the wrapper.
        wrapper.appendChild(el);
    };
    /**
     * Trigger form cancelled event.
     *
     * @param form Form element.
     * @param siteId The site affected. If not provided, no site affected.
     */
    CoreDomUtilsProvider.prototype.triggerFormCancelledEvent = function (formRef, siteId) {
        if (!formRef) {
            return;
        }
        this.eventsProvider.trigger(CoreEventsProvider.FORM_ACTION, {
            action: 'cancel',
            form: formRef.nativeElement,
        }, siteId);
    };
    /**
     * Trigger form submitted event.
     *
     * @param form Form element.
     * @param online Whether the action was done in offline or not.
     * @param siteId The site affected. If not provided, no site affected.
     */
    CoreDomUtilsProvider.prototype.triggerFormSubmittedEvent = function (formRef, online, siteId) {
        if (!formRef) {
            return;
        }
        this.eventsProvider.trigger(CoreEventsProvider.FORM_ACTION, {
            action: 'submit',
            form: formRef.nativeElement,
            online: !!online,
        }, siteId);
    };
    // We cannot use CoreUtilsProvider.openInBrowser due to circular dependencies.
    CoreDomUtilsProvider.prototype.openInBrowser = function (url) {
        if (CoreApp.instance.isDesktop()) {
            // It's a desktop app, use Electron shell library to open the browser.
            var shell = require('electron').shell;
            if (!shell.openExternal(url)) {
                // Open browser failed, open a new window in the app.
                window.open(url, '_system');
            }
        }
        else {
            window.open(url, '_system');
        }
    };
    CoreDomUtilsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [TranslateService,
            LoadingController,
            ToastController,
            AlertController,
            CoreTextUtilsProvider,
            CoreConfigProvider,
            CoreUrlUtilsProvider,
            ModalController,
            DomSanitizer,
            PopoverController,
            CoreFileProvider,
            CoreLoggerProvider,
            CoreEventsProvider])
    ], CoreDomUtilsProvider);
    return CoreDomUtilsProvider;
}());
export { CoreDomUtilsProvider };
var CoreDomUtils = /** @class */ (function (_super) {
    __extends(CoreDomUtils, _super);
    function CoreDomUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreDomUtils;
}(makeSingleton(CoreDomUtilsProvider)));
export { CoreDomUtils };
//# sourceMappingURL=dom.js.map