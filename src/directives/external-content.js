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
import { Directive, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CoreApp } from '@providers/app';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreFile } from '@providers/file';
import { CoreFilepoolProvider } from '@providers/filepool';
import { CoreSitesProvider } from '@providers/sites';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreUrlUtilsProvider } from '@providers/utils/url';
import { CoreUtilsProvider } from '@providers/utils/utils';
/**
 * Directive to handle external content.
 *
 * This directive should be used with any element that links to external content
 * which we want to have available when the app is offline. Typically media and links.
 *
 * If a file is downloaded, its URL will be replaced by the local file URL.
 *
 * From v3.5.2 this directive will also download inline styles, so it can be used in any element as long as it has inline styles.
 */
var CoreExternalContentDirective = /** @class */ (function () {
    function CoreExternalContentDirective(element, logger, filepoolProvider, platform, sitesProvider, domUtils, urlUtils, utils) {
        this.filepoolProvider = filepoolProvider;
        this.platform = platform;
        this.sitesProvider = sitesProvider;
        this.domUtils = domUtils;
        this.urlUtils = urlUtils;
        this.utils = utils;
        this.onLoad = new EventEmitter(); // Emitted when content is loaded. Only for images.
        this.loaded = false;
        this.initialized = false;
        this.invalid = false;
        this.element = element.nativeElement;
        this.logger = logger.getInstance('CoreExternalContentDirective');
    }
    /**
     * View has been initialized
     */
    CoreExternalContentDirective.prototype.ngAfterViewInit = function () {
        this.checkAndHandleExternalContent();
        this.initialized = true;
    };
    /**
     * Listen to changes.
     *
     * * @param {{[name: string]: SimpleChange}} changes Changes.
     */
    CoreExternalContentDirective.prototype.ngOnChanges = function (changes) {
        if (changes && this.initialized) {
            // If any of the inputs changes, handle the content again.
            this.checkAndHandleExternalContent();
        }
    };
    /**
     * Add a new source with a certain URL as a sibling of the current element.
     *
     * @param url URL to use in the source.
     */
    CoreExternalContentDirective.prototype.addSource = function (url) {
        if (this.element.tagName !== 'SOURCE') {
            return;
        }
        var newSource = document.createElement('source'), type = this.element.getAttribute('type');
        newSource.setAttribute('src', url);
        if (type) {
            if (CoreApp.instance.isAndroid() && type == 'video/quicktime') {
                // Fix for VideoJS/Chrome bug https://github.com/videojs/video.js/issues/423 .
                newSource.setAttribute('type', 'video/mp4');
            }
            else {
                newSource.setAttribute('type', type);
            }
        }
        this.element.parentNode.insertBefore(newSource, this.element);
    };
    /**
     * Get the URL that should be handled and, if valid, handle it.
     */
    CoreExternalContentDirective.prototype.checkAndHandleExternalContent = function () {
        var _this = this;
        var currentSite = this.sitesProvider.getCurrentSite(), siteId = this.siteId || (currentSite && currentSite.getId()), tagName = this.element.tagName.toUpperCase();
        var targetAttr, url;
        // Always handle inline styles (if any).
        this.handleInlineStyles(siteId).catch(function (error) {
            _this.logger.error('Error treating inline styles.', _this.element);
        });
        if (tagName === 'A' || tagName == 'IMAGE') {
            targetAttr = 'href';
            url = this.href;
        }
        else if (tagName === 'IMG') {
            targetAttr = 'src';
            url = this.src;
        }
        else if (tagName === 'AUDIO' || tagName === 'VIDEO' || tagName === 'SOURCE' || tagName === 'TRACK') {
            targetAttr = 'src';
            url = this.targetSrc || this.src;
            if (tagName === 'VIDEO') {
                if (this.poster) {
                    // Handle poster.
                    this.handleExternalContent('poster', this.poster, siteId).catch(function () {
                        // Ignore errors.
                    });
                }
            }
        }
        else {
            this.invalid = true;
            return;
        }
        // Avoid handling data url's.
        if (url && url.indexOf('data:') === 0) {
            this.invalid = true;
            this.onLoad.emit();
            this.loaded = true;
            return;
        }
        this.handleExternalContent(targetAttr, url, siteId).catch(function () {
            // Error handling content. Make sure the loaded event is triggered for images.
            if (tagName === 'IMG') {
                if (url) {
                    _this.waitForLoad();
                }
                else {
                    _this.onLoad.emit();
                    _this.loaded = true;
                }
            }
        });
    };
    /**
     * Handle external content, setting the right URL.
     *
     * @param targetAttr Attribute to modify.
     * @param url Original URL to treat.
     * @param siteId Site ID.
     * @return Promise resolved if the element is successfully treated.
     */
    CoreExternalContentDirective.prototype.handleExternalContent = function (targetAttr, url, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var tagName, video, site, dwnUnknown, finalUrl, eventName, clickableEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tagName = this.element.tagName;
                        if (tagName == 'VIDEO' && targetAttr != 'poster') {
                            video = this.element;
                            if (video.textTracks) {
                                // It's a video with subtitles. In iOS, subtitles position is wrong so it needs to be fixed.
                                video.textTracks.onaddtrack = function (event) {
                                    var track = event.track;
                                    if (track) {
                                        track.oncuechange = function () {
                                            var line = _this.platform.is('tablet') || CoreApp.instance.isAndroid() ? 90 : 80;
                                            // Position all subtitles to a percentage of video height.
                                            Array.from(track.cues).forEach(function (cue) {
                                                cue.snapToLines = false;
                                                cue.line = line;
                                                cue.size = 100; // This solves some Android issue.
                                            });
                                            // Delete listener.
                                            track.oncuechange = null;
                                        };
                                    }
                                };
                            }
                        }
                        if (!url || !url.match(/^https?:\/\//i) || this.urlUtils.isLocalFileUrl(url) ||
                            (tagName === 'A' && !this.urlUtils.isDownloadableUrl(url))) {
                            this.logger.debug('Ignoring non-downloadable URL: ' + url);
                            if (tagName === 'SOURCE') {
                                // Restoring original src.
                                this.addSource(url);
                            }
                            throw 'Non-downloadable URL';
                        }
                        return [4 /*yield*/, this.sitesProvider.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        if (!site.canDownloadFiles() && this.urlUtils.isPluginFileUrl(url)) {
                            this.element.parentElement.removeChild(this.element); // Remove element since it'll be broken.
                            throw 'Site doesn\'t allow downloading files.';
                        }
                        dwnUnknown = tagName == 'IMG' || tagName == 'TRACK' || targetAttr == 'poster';
                        if (!(targetAttr === 'src' && tagName !== 'SOURCE' && tagName !== 'TRACK' && tagName !== 'VIDEO' && tagName !== 'AUDIO')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.filepoolProvider.getSrcByUrl(siteId, url, this.component, this.componentId, 0, true, dwnUnknown)];
                    case 2:
                        finalUrl = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.filepoolProvider.getUrlByUrl(siteId, url, this.component, this.componentId, 0, true, dwnUnknown)];
                    case 4:
                        finalUrl = _a.sent();
                        finalUrl = CoreFile.instance.convertFileSrc(finalUrl);
                        _a.label = 5;
                    case 5:
                        if (!this.urlUtils.isLocalFileUrl(finalUrl)) {
                            /* In iOS, if we use the same URL in embedded file and background download then the download only
                               downloads a few bytes (cached ones). Add a hash to the URL so both URLs are different. */
                            finalUrl = finalUrl + '#moodlemobile-embedded';
                        }
                        this.logger.debug('Using URL ' + finalUrl + ' for ' + url);
                        if (tagName === 'SOURCE') {
                            // The browser does not catch changes in SRC, we need to add a new source.
                            this.addSource(finalUrl);
                        }
                        else {
                            if (tagName === 'IMG') {
                                this.loaded = false;
                                this.waitForLoad();
                            }
                            this.element.setAttribute(targetAttr, finalUrl);
                            this.element.setAttribute('data-original-' + targetAttr, url);
                        }
                        // Set events to download big files (not downloaded automatically).
                        if (!this.urlUtils.isLocalFileUrl(finalUrl) && targetAttr != 'poster' &&
                            (tagName == 'VIDEO' || tagName == 'AUDIO' || tagName == 'A' || tagName == 'SOURCE')) {
                            eventName = tagName == 'A' ? 'click' : 'play';
                            clickableEl = this.element;
                            if (tagName == 'SOURCE') {
                                clickableEl = this.domUtils.closest(this.element, 'video,audio');
                                if (!clickableEl) {
                                    return [2 /*return*/];
                                }
                            }
                            clickableEl.addEventListener(eventName, function () {
                                // User played media or opened a downloadable link.
                                // Download the file if in wifi and it hasn't been downloaded already (for big files).
                                if (CoreApp.instance.isWifi()) {
                                    // We aren't using the result, so it doesn't matter which of the 2 functions we call.
                                    _this.filepoolProvider.getUrlByUrl(siteId, url, _this.component, _this.componentId, 0, false);
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle inline styles, trying to download referenced files.
     *
     * @param siteId Site ID.
     * @return Promise resolved if the element is successfully treated.
     */
    CoreExternalContentDirective.prototype.handleInlineStyles = function (siteId) {
        var _this = this;
        var inlineStyles = this.element.getAttribute('style');
        if (!inlineStyles) {
            return Promise.resolve();
        }
        var urls = inlineStyles.match(/https?:\/\/[^"'\) ;]*/g);
        if (!urls || !urls.length) {
            return Promise.resolve();
        }
        var promises = [];
        urls = this.utils.uniqueArray(urls); // Remove duplicates.
        urls.forEach(function (url) {
            promises.push(_this.filepoolProvider.getUrlByUrl(siteId, url, _this.component, _this.componentId, 0, true, true)
                .then(function (finalUrl) {
                _this.logger.debug('Using URL ' + finalUrl + ' for ' + url + ' in inline styles');
                inlineStyles = inlineStyles.replace(new RegExp(url, 'gi'), finalUrl);
            }));
        });
        return this.utils.allPromises(promises).then(function () {
            _this.element.setAttribute('style', inlineStyles);
        });
    };
    /**
     * Wait for the image to be loaded or error, and emit an event when it happens.
     */
    CoreExternalContentDirective.prototype.waitForLoad = function () {
        var _this = this;
        var listener = function () {
            _this.element.removeEventListener('load', listener);
            _this.element.removeEventListener('error', listener);
            _this.onLoad.emit();
            _this.loaded = true;
        };
        this.element.addEventListener('load', listener);
        this.element.addEventListener('error', listener);
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CoreExternalContentDirective.prototype, "siteId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CoreExternalContentDirective.prototype, "component", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], CoreExternalContentDirective.prototype, "componentId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CoreExternalContentDirective.prototype, "src", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CoreExternalContentDirective.prototype, "href", void 0);
    __decorate([
        Input('target-src'),
        __metadata("design:type", String)
    ], CoreExternalContentDirective.prototype, "targetSrc", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CoreExternalContentDirective.prototype, "poster", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CoreExternalContentDirective.prototype, "onLoad", void 0);
    CoreExternalContentDirective = __decorate([
        Directive({
            selector: '[core-external-content]'
        }),
        __metadata("design:paramtypes", [ElementRef,
            CoreLoggerProvider,
            CoreFilepoolProvider,
            Platform,
            CoreSitesProvider,
            CoreDomUtilsProvider,
            CoreUrlUtilsProvider,
            CoreUtilsProvider])
    ], CoreExternalContentDirective);
    return CoreExternalContentDirective;
}());
export { CoreExternalContentDirective };
//# sourceMappingURL=external-content.js.map