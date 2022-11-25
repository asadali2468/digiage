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
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreAppProvider } from './app';
import { CoreInitDelegate } from './init';
import { CoreLoggerProvider } from './logger';
import { CoreSitesProvider } from './sites';
import { CoreDomUtilsProvider } from './utils/dom';
import { CoreTextUtilsProvider } from './utils/text';
import { CoreUrlUtilsProvider } from './utils/url';
import { CoreUtilsProvider } from './utils/utils';
import { CoreLoginHelperProvider } from '@core/login/providers/helper';
import { CoreContentLinksHelperProvider } from '@core/contentlinks/providers/helper';
import { CoreContentLinksDelegate } from '@core/contentlinks/providers/delegate';
import { CoreSitePluginsProvider } from '@core/siteplugins/providers/siteplugins';
import { CoreConfigConstants } from '../configconstants';
import { CoreConstants } from '@core/constants';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * Provider to handle custom URL schemes.
 */
var CoreCustomURLSchemesProvider = /** @class */ (function () {
    function CoreCustomURLSchemesProvider(logger, appProvider, utils, loginHelper, linksHelper, initDelegate, domUtils, urlUtils, sitesProvider, textUtils, linksDelegate, translate, sitePluginsProvider) {
        this.appProvider = appProvider;
        this.utils = utils;
        this.loginHelper = loginHelper;
        this.linksHelper = linksHelper;
        this.initDelegate = initDelegate;
        this.domUtils = domUtils;
        this.urlUtils = urlUtils;
        this.sitesProvider = sitesProvider;
        this.textUtils = textUtils;
        this.linksDelegate = linksDelegate;
        this.translate = translate;
        this.sitePluginsProvider = sitePluginsProvider;
        this.lastUrls = {};
        this.logger = logger.getInstance('CoreCustomURLSchemesProvider');
    }
    /**
     * Given some data of a custom URL with a token, create a site if it needs to be created.
     *
     * @param data URL data.
     * @return Promise resolved with the site ID.
     */
    CoreCustomURLSchemesProvider.prototype.createSiteIfNeeded = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var currentSite, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.token) {
                            return [2 /*return*/];
                        }
                        currentSite = this.sitesProvider.getCurrentSite();
                        if (!(!currentSite || currentSite.getToken() != data.token)) return [3 /*break*/, 4];
                        if (!!data.siteUrl.match(/^https?:\/\//)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sitesProvider.checkSite(data.siteUrl)];
                    case 1:
                        result = _a.sent();
                        data.siteUrl = result.siteUrl;
                        return [4 /*yield*/, this.sitesProvider.checkApplication(result.config)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, this.sitesProvider.newSite(data.siteUrl, data.token, data.privateToken, !!data.isSSOToken, this.loginHelper.getOAuthIdFromParams(data.ssoUrlParams))];
                    case 4: 
                    // Token belongs to current site, no need to create it.
                    return [2 /*return*/, this.sitesProvider.getCurrentSiteId()];
                }
            });
        });
    };
    /**
     * Handle an URL received by custom URL scheme.
     *
     * @param url URL to treat.
     * @return Promise resolved when done. If rejected, the parameter is of type CoreCustomURLSchemesHandleError.
     */
    CoreCustomURLSchemesProvider.prototype.handleCustomURL = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var modal, data, error_1, isValid, siteId, siteIds, site, username, treated, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isCustomURL(url)) {
                            throw new CoreCustomURLSchemesHandleError(null);
                        }
                        /* First check that this URL hasn't been treated a few seconds ago. The function that handles custom URL schemes already
                           does this, but this function is called from other places so we need to handle it in here too. */
                        if (this.lastUrls[url] && Date.now() - this.lastUrls[url] < 3000) {
                            // Function called more than once, stop.
                            return [2 /*return*/];
                        }
                        this.lastUrls[url] = Date.now();
                        url = this.textUtils.decodeURIComponent(url);
                        // Wait for app to be ready.
                        return [4 /*yield*/, this.initDelegate.ready()];
                    case 1:
                        // Wait for app to be ready.
                        _a.sent();
                        // Some platforms like Windows add a slash at the end. Remove it.
                        // Some sites add a # at the end of the URL. If it's there, remove it.
                        url = url.replace(/\/?#?\/?$/, '');
                        modal = this.domUtils.showModalLoading();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 10]);
                        if (!this.isCustomURLToken(url)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getCustomURLTokenData(url)];
                    case 3:
                        data = _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!this.isCustomURLLink(url)) return [3 /*break*/, 6];
                        // In iOS, the protocol after the scheme doesn't have ":". Add it.
                        url = url.replace(/\/\/link=(https?)\/\//, '//link=$1://');
                        return [4 /*yield*/, this.getCustomURLLinkData(url)];
                    case 5:
                        data = _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        // In iOS, the protocol after the scheme doesn't have ":". Add it.
                        url = url.replace(/\/\/(https?)\/\//, '//$1://');
                        return [4 /*yield*/, this.getCustomURLData(url)];
                    case 7:
                        data = _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _a.sent();
                        modal.dismiss();
                        throw error_1;
                    case 10:
                        _a.trys.push([10, 25, 26, 27]);
                        return [4 /*yield*/, this.loginHelper.isSiteUrlAllowed(data.siteUrl)];
                    case 11:
                        isValid = _a.sent();
                        if (!isValid) {
                            throw this.translate.instant('core.errorurlschemeinvalidsite');
                        }
                        if (data.redirect && data.redirect.match(/^https?:\/\//) && data.redirect.indexOf(data.siteUrl) == -1) {
                            // Redirect URL must belong to the same site. Reject.
                            throw this.translate.instant('core.contentlinks.errorredirectothersite');
                        }
                        return [4 /*yield*/, this.createSiteIfNeeded(data)];
                    case 12:
                        siteId = _a.sent();
                        if (data.isSSOToken) {
                            // Site created and authenticated, open the page to go.
                            if (data.pageName) {
                                // State defined, go to that state instead of site initial page.
                                this.appProvider.getRootNavController().push(data.pageName, data.pageParams);
                            }
                            else {
                                this.loginHelper.goToSiteInitialPage();
                            }
                            return [2 /*return*/];
                        }
                        if (data.redirect && !data.redirect.match(/^https?:\/\//)) {
                            // Redirect is a relative URL. Append the site URL.
                            data.redirect = this.textUtils.concatenatePaths(data.siteUrl, data.redirect);
                        }
                        siteIds = [siteId];
                        if (!!siteId) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.sitesProvider.getSiteIdsFromUrl(data.siteUrl, true, data.username)];
                    case 13:
                        // No site created, check if the site is stored (to know which one to use).
                        siteIds = _a.sent();
                        _a.label = 14;
                    case 14:
                        if (!(siteIds.length > 1)) return [3 /*break*/, 15];
                        // More than one site to treat the URL, let the user choose.
                        this.linksHelper.goToChooseSite(data.redirect || data.siteUrl);
                        return [3 /*break*/, 24];
                    case 15:
                        if (!(siteIds.length == 1)) return [3 /*break*/, 21];
                        return [4 /*yield*/, this.sitesProvider.getSite(siteIds[0])];
                    case 16:
                        site = _a.sent();
                        if (!!data.redirect) return [3 /*break*/, 18];
                        // No redirect, go to the root URL if needed.
                        return [4 /*yield*/, this.linksHelper.handleRootURL(site, false, true)];
                    case 17:
                        // No redirect, go to the root URL if needed.
                        _a.sent();
                        return [3 /*break*/, 20];
                    case 18:
                        // Handle the redirect link.
                        modal.dismiss(); // Dismiss modal so it doesn't collide with confirms.
                        username = site.getInfo().username || data.username;
                        return [4 /*yield*/, this.linksHelper.handleLink(data.redirect, username)];
                    case 19:
                        treated = _a.sent();
                        if (!treated) {
                            this.domUtils.showErrorModal('core.contentlinks.errornoactions', true);
                        }
                        _a.label = 20;
                    case 20: return [3 /*break*/, 24];
                    case 21: return [4 /*yield*/, this.sitesProvider.checkSite(data.siteUrl)];
                    case 22:
                        result = _a.sent();
                        // Site exists. We'll allow to add it.
                        modal.dismiss(); // Dismiss modal so it doesn't collide with confirms.
                        return [4 /*yield*/, this.goToAddSite(data, result)];
                    case 23:
                        _a.sent();
                        _a.label = 24;
                    case 24: return [3 /*break*/, 27];
                    case 25:
                        error_2 = _a.sent();
                        throw new CoreCustomURLSchemesHandleError(error_2, data);
                    case 26:
                        modal.dismiss();
                        if (data.isSSOToken) {
                            this.appProvider.finishSSOAuthentication();
                        }
                        return [7 /*endfinally*/];
                    case 27: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the data from a custom URL scheme. The structure of the URL is:
     * moodlemobile://username@domain.com?token=TOKEN&privatetoken=PRIVATETOKEN&redirect=http://domain.com/course/view.php?id=2
     *
     * @param url URL to treat.
     * @return Promise resolved with the data.
     */
    CoreCustomURLSchemesProvider.prototype.getCustomURLData = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var username, params, siteIds, site;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isCustomURL(url)) {
                            throw new CoreCustomURLSchemesHandleError(null);
                        }
                        // App opened using custom URL scheme.
                        this.logger.debug('Treating custom URL scheme: ' + url);
                        // Delete the sso scheme from the URL.
                        url = this.removeCustomURLScheme(url);
                        username = this.urlUtils.getUsernameFromUrl(url);
                        if (username) {
                            url = url.replace(username + '@', ''); // Remove the username from the URL.
                        }
                        params = this.urlUtils.extractUrlParams(url);
                        // Remove the params to get the site URL.
                        if (url.indexOf('?') != -1) {
                            url = url.substr(0, url.indexOf('?'));
                        }
                        if (!!url.match(/https?:\/\//)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sitesProvider.getSiteIdsFromUrl(url, true, username)];
                    case 1:
                        siteIds = _a.sent();
                        if (!siteIds.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sitesProvider.getSite(siteIds[0])];
                    case 2:
                        site = _a.sent();
                        url = site.getURL();
                        _a.label = 3;
                    case 3: return [2 /*return*/, {
                            siteUrl: url,
                            username: username,
                            token: params.token,
                            privateToken: params.privateToken,
                            redirect: params.redirect,
                            isAuthenticationURL: !!params.token,
                        }];
                }
            });
        });
    };
    /**
     * Get the data from a "link" custom URL scheme. This kind of URL is deprecated.
     *
     * @param url URL to treat.
     * @return Promise resolved with the data.
     */
    CoreCustomURLSchemesProvider.prototype.getCustomURLLinkData = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var username, data, site, siteUrl, redirect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isCustomURLLink(url)) {
                            throw new CoreCustomURLSchemesHandleError(null);
                        }
                        // App opened using custom URL scheme.
                        this.logger.debug('Treating custom URL scheme with link param: ' + url);
                        // Delete the sso scheme from the URL.
                        url = this.removeCustomURLLinkScheme(url);
                        username = this.urlUtils.getUsernameFromUrl(url);
                        if (username) {
                            url = url.replace(username + '@', ''); // Remove the username from the URL.
                        }
                        return [4 /*yield*/, this.sitesProvider.isStoredRootURL(url, username)];
                    case 1:
                        data = _a.sent();
                        if (!data.site) return [3 /*break*/, 2];
                        // Root URL.
                        return [2 /*return*/, {
                                siteUrl: data.site.getURL(),
                                username: username
                            }];
                    case 2:
                        if (!(data.siteIds.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sitesProvider.getSite(data.siteIds[0])];
                    case 3:
                        site = _a.sent();
                        return [2 /*return*/, {
                                siteUrl: site.getURL(),
                                username: username,
                                redirect: url
                            }];
                    case 4:
                        siteUrl = this.linksDelegate.getSiteUrl(url);
                        redirect = url;
                        if (!siteUrl) {
                            // Site URL not found, use the original URL since it could be the root URL of the site.
                            siteUrl = url;
                            redirect = undefined;
                        }
                        return [2 /*return*/, {
                                siteUrl: siteUrl,
                                username: username,
                                redirect: redirect
                            }];
                }
            });
        });
    };
    /**
     * Get the data from a "token" custom URL scheme. This kind of URL is deprecated.
     *
     * @param url URL to treat.
     * @return Promise resolved with the data.
     */
    CoreCustomURLSchemesProvider.prototype.getCustomURLTokenData = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isCustomURLToken(url)) {
                            throw new CoreCustomURLSchemesHandleError(null);
                        }
                        if (this.appProvider.isSSOAuthenticationOngoing()) {
                            // Authentication ongoing, probably duplicated request.
                            throw new CoreCustomURLSchemesHandleError('Duplicated');
                        }
                        if (this.appProvider.isDesktop()) {
                            // In desktop, make sure InAppBrowser is closed.
                            this.utils.closeInAppBrowser(true);
                        }
                        // App opened using custom URL scheme. Probably an SSO authentication.
                        this.appProvider.startSSOAuthentication();
                        this.logger.debug('App launched by URL with an SSO');
                        // Delete the sso scheme from the URL.
                        url = this.removeCustomURLTokenScheme(url);
                        // Some platforms like Windows add a slash at the end. Remove it.
                        // Some sites add a # at the end of the URL. If it's there, remove it.
                        url = url.replace(/\/?#?\/?$/, '');
                        // Decode from base64.
                        try {
                            url = atob(url);
                        }
                        catch (err) {
                            // Error decoding the parameter.
                            this.logger.error('Error decoding parameter received for login SSO');
                            throw new CoreCustomURLSchemesHandleError(null);
                        }
                        return [4 /*yield*/, this.loginHelper.validateBrowserSSOLogin(url)];
                    case 1:
                        data = _a.sent();
                        data.isSSOToken = true;
                        data.isAuthenticationURL = true;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Go to page to add a site, or open a browser if SSO.
     *
     * @param data URL data.
     * @param checkResponse Result of checkSite.
     * @return Promise resolved when done.
     */
    CoreCustomURLSchemesProvider.prototype.goToAddSite = function (data, checkResponse) {
        return __awaiter(this, void 0, void 0, function () {
            var ssoNeeded, pageName, pageParams, hasSitePluginsLoaded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ssoNeeded = this.loginHelper.isSSOLoginNeeded(checkResponse.code);
                        pageName = 'CoreLoginCredentialsPage';
                        pageParams = {
                            siteUrl: checkResponse.siteUrl,
                            username: data.username,
                            urlToOpen: data.redirect,
                            siteConfig: checkResponse.config
                        };
                        hasSitePluginsLoaded = false;
                        if (!this.sitesProvider.isLoggedIn()) return [3 /*break*/, 3];
                        // Ask the user before changing site.
                        return [4 /*yield*/, this.domUtils.showConfirm(this.translate.instant('core.contentlinks.confirmurlothersite'))];
                    case 1:
                        // Ask the user before changing site.
                        _a.sent();
                        if (!!ssoNeeded) return [3 /*break*/, 3];
                        hasSitePluginsLoaded = this.sitePluginsProvider.hasSitePluginsLoaded;
                        if (hasSitePluginsLoaded) {
                            // Store the redirect since logout will restart the app.
                            this.appProvider.storeRedirect(CoreConstants.NO_SITE_ID, pageName, pageParams);
                        }
                        return [4 /*yield*/, this.sitesProvider.logout()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!ssoNeeded) return [3 /*break*/, 4];
                        this.loginHelper.confirmAndOpenBrowserForSSOLogin(checkResponse.siteUrl, checkResponse.code, checkResponse.service, checkResponse.config && checkResponse.config.launchurl);
                        return [3 /*break*/, 6];
                    case 4:
                        if (!!hasSitePluginsLoaded) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.loginHelper.goToNoSitePage(undefined, pageName, pageParams)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check whether a URL is a custom URL scheme.
     *
     * @param url URL to check.
     * @return Whether it's a custom URL scheme.
     */
    CoreCustomURLSchemesProvider.prototype.isCustomURL = function (url) {
        if (!url) {
            return false;
        }
        return url.indexOf(CoreConfigConstants.customurlscheme + '://') != -1;
    };
    /**
     * Check whether a URL is a custom URL scheme with the "link" param (deprecated).
     *
     * @param url URL to check.
     * @return Whether it's a custom URL scheme.
     */
    CoreCustomURLSchemesProvider.prototype.isCustomURLLink = function (url) {
        if (!url) {
            return false;
        }
        return url.indexOf(CoreConfigConstants.customurlscheme + '://link=') != -1;
    };
    /**
     * Check whether a URL is a custom URL scheme with a "token" param (deprecated).
     *
     * @param url URL to check.
     * @return Whether it's a custom URL scheme.
     */
    CoreCustomURLSchemesProvider.prototype.isCustomURLToken = function (url) {
        if (!url) {
            return false;
        }
        return url.indexOf(CoreConfigConstants.customurlscheme + '://token=') != -1;
    };
    /**
     * Remove the scheme from a custom URL.
     *
     * @param url URL to treat.
     * @return URL without scheme.
     */
    CoreCustomURLSchemesProvider.prototype.removeCustomURLScheme = function (url) {
        return url.replace(CoreConfigConstants.customurlscheme + '://', '');
    };
    /**
     * Remove the scheme and the "link=" prefix from a link custom URL.
     *
     * @param url URL to treat.
     * @return URL without scheme and prefix.
     */
    CoreCustomURLSchemesProvider.prototype.removeCustomURLLinkScheme = function (url) {
        return url.replace(CoreConfigConstants.customurlscheme + '://link=', '');
    };
    /**
     * Remove the scheme and the "token=" prefix from a token custom URL.
     *
     * @param url URL to treat.
     * @return URL without scheme and prefix.
     */
    CoreCustomURLSchemesProvider.prototype.removeCustomURLTokenScheme = function (url) {
        return url.replace(CoreConfigConstants.customurlscheme + '://token=', '');
    };
    /**
     * Treat error returned by handleCustomURL.
     *
     * @param error Error data.
     */
    CoreCustomURLSchemesProvider.prototype.treatHandleCustomURLError = function (error) {
        if (error.error == 'Duplicated') {
            // Duplicated request
        }
        else if (error.error && error.data && error.data.isSSOToken) {
            // An error occurred, display the error and logout the user.
            this.loginHelper.treatUserTokenError(error.data.siteUrl, error.error);
            this.sitesProvider.logout();
        }
        else {
            this.domUtils.showErrorModalDefault(error.error, this.translate.instant('core.login.invalidsite'));
        }
    };
    CoreCustomURLSchemesProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            CoreAppProvider,
            CoreUtilsProvider,
            CoreLoginHelperProvider,
            CoreContentLinksHelperProvider,
            CoreInitDelegate,
            CoreDomUtilsProvider,
            CoreUrlUtilsProvider,
            CoreSitesProvider,
            CoreTextUtilsProvider,
            CoreContentLinksDelegate,
            TranslateService,
            CoreSitePluginsProvider])
    ], CoreCustomURLSchemesProvider);
    return CoreCustomURLSchemesProvider;
}());
export { CoreCustomURLSchemesProvider };
/**
 * Error returned by handleCustomURL.
 */
var CoreCustomURLSchemesHandleError = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param error The error message or object.
     * @param data Data obtained from the URL (if any).
     */
    function CoreCustomURLSchemesHandleError(error, data) {
        this.error = error;
        this.data = data;
    }
    return CoreCustomURLSchemesHandleError;
}());
export { CoreCustomURLSchemesHandleError };
var CoreCustomURLSchemes = /** @class */ (function (_super) {
    __extends(CoreCustomURLSchemes, _super);
    function CoreCustomURLSchemes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreCustomURLSchemes;
}(makeSingleton(CoreCustomURLSchemesProvider)));
export { CoreCustomURLSchemes };
//# sourceMappingURL=urlschemes.js.map