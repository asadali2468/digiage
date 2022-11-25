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
import { Injectable, NgZone } from '@angular/core';
import { Config, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network';
import { CoreApp, CoreAppProvider } from '../app';
import { CoreFileProvider } from '../file';
import { CoreFileHelper } from '../file-helper';
import { CoreLoggerProvider } from '../logger';
import { CoreSitesProvider } from '../sites';
import { CoreDomUtilsProvider } from './dom';
import { CoreTextUtilsProvider } from './text';
import { CoreUrlUtilsProvider } from './url';
import { CoreUtilsProvider } from './utils';
import { CoreContentLinksHelperProvider } from '@core/contentlinks/providers/helper';
import { makeSingleton } from '@singletons/core.singletons';
import { CoreUrl } from '@singletons/url';
import { CoreWindow } from '@singletons/window';
/*
 * "Utils" service with helper functions for iframes, embed and similar.
 */
var CoreIframeUtilsProvider = /** @class */ (function () {
    function CoreIframeUtilsProvider(logger, fileProvider, sitesProvider, urlUtils, textUtils, utils, domUtils, platform, appProvider, translate, network, zone, config, contentLinksHelper) {
        var _this = this;
        this.fileProvider = fileProvider;
        this.sitesProvider = sitesProvider;
        this.urlUtils = urlUtils;
        this.textUtils = textUtils;
        this.utils = utils;
        this.domUtils = domUtils;
        this.translate = translate;
        this.network = network;
        this.zone = zone;
        this.config = config;
        this.contentLinksHelper = contentLinksHelper;
        this.logger = logger.getInstance('CoreUtilsProvider');
        var win = window;
        if (appProvider.isIOS() && win.WKUserScript) {
            platform.ready().then(function () {
                // Inject code to the iframes because we cannot access the online ones.
                var wwwPath = fileProvider.getWWWAbsolutePath();
                var linksPath = textUtils.concatenatePaths(wwwPath, 'assets/js/iframe-treat-links.js');
                var recaptchaPath = textUtils.concatenatePaths(wwwPath, 'assets/js/iframe-recaptcha.js');
                win.WKUserScript.addScript({ id: 'CoreIframeUtilsLinksScript', file: linksPath });
                win.WKUserScript.addScript({
                    id: 'CoreIframeUtilsRecaptchaScript',
                    file: recaptchaPath,
                    injectionTime: win.WKUserScript.InjectionTime.END,
                });
                // Handle post messages received by iframes.
                window.addEventListener('message', _this.handleIframeMessage.bind(_this));
            });
        }
    }
    CoreIframeUtilsProvider_1 = CoreIframeUtilsProvider;
    /**
     * Check if a frame uses an online URL but the app is offline. If it does, the iframe is hidden and a warning is shown.
     *
     * @param element The frame to check (iframe, embed, ...).
     * @param isSubframe Whether it's a frame inside another frame.
     * @return True if frame is online and the app is offline, false otherwise.
     */
    CoreIframeUtilsProvider.prototype.checkOnlineFrameInOffline = function (element, isSubframe) {
        var _this = this;
        var src = element.src || element.data;
        if (src && src != 'about:blank' && !this.urlUtils.isLocalFileUrl(src) && !CoreApp.instance.isOnline()) {
            if (element.classList.contains('core-iframe-offline-disabled')) {
                // Iframe already hidden, stop.
                return true;
            }
            // The frame has an online URL but the app is offline. Show a warning, or a link if the URL can be opened in the app.
            var div_1 = document.createElement('div');
            div_1.setAttribute('text-center', '');
            div_1.setAttribute('padding', '');
            div_1.classList.add('core-iframe-offline-warning');
            var site = this.sitesProvider.getCurrentSite();
            var username_1 = site ? site.getInfo().username : undefined;
            this.contentLinksHelper.canHandleLink(src, undefined, username_1).then(function (canHandleLink) {
                if (canHandleLink) {
                    var link = document.createElement('a');
                    if (isSubframe) {
                        // Ionic styles are not available in subframes, adding some minimal inline styles.
                        link.style.display = 'block';
                        link.style.padding = '1em';
                        link.style.fontWeight = '500';
                        link.style.textAlign = 'center';
                        link.style.textTransform = 'uppercase';
                        link.style.cursor = 'pointer';
                    }
                    else {
                        var mode = _this.config.get('mode');
                        link.setAttribute('ion-button', '');
                        link.classList.add('button', 'button-' + mode, 'button-default', 'button-default-' + mode, 'button-block', 'button-block-' + mode);
                    }
                    var message = _this.translate.instant('core.viewembeddedcontent');
                    link.innerHTML = isSubframe ? message : '<span class="button-inner">' + message + '</span>';
                    link.onclick = function (event) {
                        _this.contentLinksHelper.handleLink(src, username_1);
                        event.preventDefault();
                    };
                    div_1.appendChild(link);
                }
                else {
                    div_1.innerHTML = (isSubframe ? '' : _this.domUtils.getConnectionWarningIconHtml()) +
                        '<p>' + _this.translate.instant('core.networkerroriframemsg') + '</p>';
                }
                element.parentElement.insertBefore(div_1, element);
            });
            // Add a class to specify that the iframe is hidden.
            element.classList.add('core-iframe-offline-disabled');
            if (isSubframe) {
                // We cannot apply CSS styles in subframes, just hide the iframe.
                element.style.display = 'none';
            }
            // If the network changes, check it again.
            var subscription_1 = this.network.onConnect().subscribe(function () {
                // Execute the callback in the Angular zone, so change detection doesn't stop working.
                _this.zone.run(function () {
                    if (!_this.checkOnlineFrameInOffline(element, isSubframe)) {
                        // Now the app is online, no need to check connection again.
                        subscription_1.unsubscribe();
                    }
                });
            });
            return true;
        }
        else if (element.classList.contains('core-iframe-offline-disabled')) {
            // Reload the frame.
            element.src = element.src;
            element.data = element.data;
            // Remove the warning and show the iframe
            this.domUtils.removeElement(element.parentElement, 'div.core-iframe-offline-warning');
            element.classList.remove('core-iframe-offline-disabled');
            if (isSubframe) {
                element.style.display = '';
            }
        }
        return false;
    };
    /**
     * Given an element, return the content window and document.
     * Please notice that the element should be an iframe, embed or similar.
     *
     * @param element Element to treat (iframe, embed, ...).
     * @return Window and Document.
     */
    CoreIframeUtilsProvider.prototype.getContentWindowAndDocument = function (element) {
        var contentWindow = element.contentWindow, contentDocument;
        try {
            contentDocument = element.contentDocument || (contentWindow && contentWindow.document);
        }
        catch (ex) {
            // Ignore errors.
        }
        if (!contentWindow && contentDocument) {
            // It's probably an <object>. Try to get the window.
            contentWindow = contentDocument.defaultView;
        }
        if (!contentWindow && element.getSVGDocument) {
            // It's probably an <embed>. Try to get the window and the document.
            try {
                contentDocument = element.getSVGDocument();
            }
            catch (ex) {
                // Ignore errors.
            }
            if (contentDocument && contentDocument.defaultView) {
                contentWindow = contentDocument.defaultView;
            }
            else if (element.window) {
                contentWindow = element.window;
            }
            else if (element.getWindow) {
                contentWindow = element.getWindow();
            }
        }
        return { window: contentWindow, document: contentDocument };
    };
    /**
     * Handle some iframe messages.
     *
     * @param event Message event.
     */
    CoreIframeUtilsProvider.prototype.handleIframeMessage = function (event) {
        if (!event.data || event.data.environment != 'moodleapp' || event.data.context != 'iframe') {
            return;
        }
        switch (event.data.action) {
            case 'window_open':
                this.windowOpen(event.data.url, event.data.name);
                break;
            case 'link_clicked':
                this.linkClicked(event.data.link);
                break;
            default:
                break;
        }
    };
    /**
     * Redefine the open method in the contentWindow of an element and the sub frames.
     * Please notice that the element should be an iframe, embed or similar.
     *
     * @param element Element to treat (iframe, embed, ...).
     * @param contentWindow The window of the element contents.
     * @param contentDocument The document of the element contents.
     * @param navCtrl NavController to use if a link can be opened in the app.
     */
    CoreIframeUtilsProvider.prototype.redefineWindowOpen = function (element, contentWindow, contentDocument, navCtrl) {
        var _this = this;
        if (contentWindow) {
            // Intercept window.open.
            contentWindow.open = function (url, name) {
                _this.windowOpen(url, name, element, navCtrl);
                return null;
            };
        }
        if (contentDocument) {
            // Search sub frames.
            CoreIframeUtilsProvider_1.FRAME_TAGS.forEach(function (tag) {
                var elements = Array.from(contentDocument.querySelectorAll(tag));
                elements.forEach(function (subElement) {
                    _this.treatFrame(subElement, true, navCtrl);
                });
            });
        }
    };
    /**
     * Intercept window.open in a frame and its subframes, shows an error modal instead.
     * Search links (<a>) and open them in browser or InAppBrowser if needed.
     *
     * @param element Element to treat (iframe, embed, ...).
     * @param isSubframe Whether it's a frame inside another frame.
     * @param navCtrl NavController to use if a link can be opened in the app.
     */
    CoreIframeUtilsProvider.prototype.treatFrame = function (element, isSubframe, navCtrl) {
        var _this = this;
        if (element) {
            this.checkOnlineFrameInOffline(element, isSubframe);
            var winAndDoc_1 = this.getContentWindowAndDocument(element);
            // Redefine window.open in this element and sub frames, it might have been loaded already.
            this.redefineWindowOpen(element, winAndDoc_1.window, winAndDoc_1.document, navCtrl);
            // Treat links.
            this.treatFrameLinks(element, winAndDoc_1.document);
            element.addEventListener('load', function () {
                _this.checkOnlineFrameInOffline(element, isSubframe);
                // Element loaded, redefine window.open and treat links again.
                winAndDoc_1 = _this.getContentWindowAndDocument(element);
                _this.redefineWindowOpen(element, winAndDoc_1.window, winAndDoc_1.document, navCtrl);
                _this.treatFrameLinks(element, winAndDoc_1.document);
                if (winAndDoc_1.window) {
                    // Send a resize events to the iframe so it calculates the right size if needed.
                    setTimeout(function () {
                        winAndDoc_1.window.dispatchEvent(new Event('resize'));
                    }, 1000);
                }
            });
        }
    };
    /**
     * Search links (<a>) in a frame and open them in browser or InAppBrowser if needed.
     * Only links that haven't been treated by the frame's Javascript will be treated.
     *
     * @param element Element to treat (iframe, embed, ...).
     * @param contentDocument The document of the element contents.
     */
    CoreIframeUtilsProvider.prototype.treatFrameLinks = function (element, contentDocument) {
        var _this = this;
        if (!contentDocument) {
            return;
        }
        contentDocument.addEventListener('click', function (event) {
            if (event.defaultPrevented) {
                // Event already prevented by some other code.
                return;
            }
            // Find the link being clicked.
            var el = event.target;
            while (el && el.tagName !== 'A' && el.tagName !== 'a') {
                el = el.parentElement;
            }
            var link = el;
            if (!link || link.treated) {
                return;
            }
            // Add click listener to the link, this way if the iframe has added a listener to the link it will be executed first.
            link.treated = true;
            link.addEventListener('click', _this.linkClicked.bind(_this, link, element));
        }, {
            capture: true // Use capture to fix this listener not called if the element clicked is too deep in the DOM.
        });
    };
    /**
     * Handle a window.open called by a frame.
     *
     * @param url URL passed to window.open.
     * @param name Name passed to window.open.
     * @param element HTML element of the frame.
     * @param navCtrl NavController to use if a link can be opened in the app.
     * @return Promise resolved when done.
     */
    CoreIframeUtilsProvider.prototype.windowOpen = function (url, name, element, navCtrl) {
        return __awaiter(this, void 0, void 0, function () {
            var scheme, src, dirAndFile, filename, error_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scheme = this.urlUtils.getUrlScheme(url);
                        if (!scheme) {
                            src = element && (element.src || element.data);
                            if (src) {
                                dirAndFile = this.fileProvider.getFileAndDirectoryFromPath(src);
                                if (dirAndFile.directory) {
                                    url = this.textUtils.concatenatePaths(dirAndFile.directory, url);
                                }
                                else {
                                    this.logger.warn('Cannot get iframe dir path to open relative url', url, element);
                                    return [2 /*return*/];
                                }
                            }
                            else {
                                this.logger.warn('Cannot get iframe src to open relative url', url, element);
                                return [2 /*return*/];
                            }
                        }
                        if (!(name == '_self')) return [3 /*break*/, 1];
                        // Link should be loaded in the same frame.
                        if (!element) {
                            this.logger.warn('Cannot load URL in iframe because the element was not supplied', url);
                            return [2 /*return*/];
                        }
                        if (element.tagName.toLowerCase() == 'object') {
                            element.setAttribute('data', url);
                        }
                        else {
                            element.setAttribute('src', url);
                        }
                        return [3 /*break*/, 11];
                    case 1:
                        if (!this.urlUtils.isLocalFileUrl(url)) return [3 /*break*/, 9];
                        filename = url.substr(url.lastIndexOf('/') + 1);
                        if (!!CoreFileHelper.instance.isOpenableInApp({ filename: filename })) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, CoreFileHelper.instance.showConfirmOpenUnsupportedFile()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/]; // Cancelled, stop.
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.utils.openFile(url)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        this.domUtils.showErrorModal(error_2);
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 11];
                    case 9: 
                    // It's an external link, check if it can be opened in the app.
                    return [4 /*yield*/, CoreWindow.open(url, name, {
                            navCtrl: navCtrl,
                        })];
                    case 10:
                        // It's an external link, check if it can be opened in the app.
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * A link inside a frame was clicked.
     *
     * @param link Data of the link clicked.
     * @param element Frame element.
     * @param event Click event.
     * @return Promise resolved when done.
     */
    CoreIframeUtilsProvider.prototype.linkClicked = function (link, element, event) {
        return __awaiter(this, void 0, void 0, function () {
            var urlParts, frameSrc, filename, error_3, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (event && event.defaultPrevented) {
                            // Event already prevented by some other code.
                            return [2 /*return*/];
                        }
                        urlParts = CoreUrl.parse(link.href);
                        if (!link.href || (urlParts.protocol && urlParts.protocol == 'javascript')) {
                            // Links with no URL and Javascript links are ignored.
                            return [2 /*return*/];
                        }
                        if (!!this.urlUtils.isLocalFileUrlScheme(urlParts.protocol, urlParts.domain)) return [3 /*break*/, 4];
                        // Scheme suggests it's an external resource.
                        event && event.preventDefault();
                        frameSrc = element && (element.src || element.data);
                        // If the frame is not local, check the target to identify how to treat the link.
                        if (element && !this.urlUtils.isLocalFileUrl(frameSrc) && (!link.target || link.target == '_self')) {
                            // Load the link inside the frame itself.
                            if (element.tagName.toLowerCase() == 'object') {
                                element.setAttribute('data', link.href);
                            }
                            else {
                                element.setAttribute('src', link.href);
                            }
                            return [2 /*return*/];
                        }
                        if (!!this.sitesProvider.isLoggedIn()) return [3 /*break*/, 1];
                        this.utils.openInBrowser(link.href);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.sitesProvider.getCurrentSite().openInBrowserWithAutoLoginIfSameSite(link.href)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 13];
                    case 4:
                        if (!(link.target == '_parent' || link.target == '_top' || link.target == '_blank')) return [3 /*break*/, 12];
                        // Opening links with _parent, _top or _blank can break the app. We'll open it in InAppBrowser.
                        event && event.preventDefault();
                        filename = link.href.substr(link.href.lastIndexOf('/') + 1);
                        if (!!CoreFileHelper.instance.isOpenableInApp({ filename: filename })) return [3 /*break*/, 8];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, CoreFileHelper.instance.showConfirmOpenUnsupportedFile()];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_3 = _a.sent();
                        return [2 /*return*/]; // Cancelled, stop.
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.utils.openFile(link.href)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_4 = _a.sent();
                        this.domUtils.showErrorModal(error_4);
                        return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (CoreApp.instance.isIOS() && (!link.target || link.target == '_self') && element) {
                            // In cordova ios 4.1.0 links inside iframes stopped working. We'll manually treat them.
                            event && event.preventDefault();
                            if (element.tagName.toLowerCase() == 'object') {
                                element.setAttribute('data', link.href);
                            }
                            else {
                                element.setAttribute('src', link.href);
                            }
                        }
                        _a.label = 13;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fix cookies for an iframe URL.
     *
     * @param url URL of the iframe.
     * @return Promise resolved when done.
     */
    CoreIframeUtilsProvider.prototype.fixIframeCookies = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var win, urlParts, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!CoreApp.instance.isIOS() || !url || this.urlUtils.isLocalFileUrl(url)) {
                            // No need to fix cookies.
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        win = window;
                        urlParts = CoreUrl.parse(url);
                        if (!urlParts.domain) return [3 /*break*/, 3];
                        return [4 /*yield*/, win.WKWebViewCookies.setCookie({
                                name: 'MoodleAppCookieForWKWebView',
                                value: '1',
                                domain: urlParts.domain,
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        // Ignore errors.
                        this.logger.error('Error setting cookie', err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CoreIframeUtilsProvider.FRAME_TAGS = ['iframe', 'frame', 'object', 'embed'];
    CoreIframeUtilsProvider = CoreIframeUtilsProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            CoreFileProvider,
            CoreSitesProvider,
            CoreUrlUtilsProvider,
            CoreTextUtilsProvider,
            CoreUtilsProvider,
            CoreDomUtilsProvider,
            Platform,
            CoreAppProvider,
            TranslateService,
            Network, NgZone,
            Config,
            CoreContentLinksHelperProvider])
    ], CoreIframeUtilsProvider);
    return CoreIframeUtilsProvider;
    var CoreIframeUtilsProvider_1;
}());
export { CoreIframeUtilsProvider };
var CoreIframeUtils = /** @class */ (function (_super) {
    __extends(CoreIframeUtils, _super);
    function CoreIframeUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreIframeUtils;
}(makeSingleton(CoreIframeUtilsProvider)));
export { CoreIframeUtils };
//# sourceMappingURL=iframe.js.map