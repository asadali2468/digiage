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
import { Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreAppProvider } from '@providers/app';
import { CoreEventsProvider } from '@providers/events';
import { CoreInitDelegate } from '@providers/init';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreTextUtilsProvider } from '@providers/utils/text';
import { CoreUrlUtilsProvider } from '@providers/utils/url';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CoreLoginHelperProvider } from '@core/login/providers/helper';
import { CoreContentLinksDelegate } from './delegate';
import { CoreConstants } from '@core/constants';
import { CoreConfigConstants } from '../../../configconstants';
import { CoreSitePluginsProvider } from '@core/siteplugins/providers/siteplugins';
import { CoreMainMenuProvider } from '@core/mainmenu/providers/mainmenu';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Service that provides some features regarding content links.
 */
var CoreContentLinksHelperProvider = /** @class */ (function () {
    function CoreContentLinksHelperProvider(logger, sitesProvider, loginHelper, contentLinksDelegate, appProvider, domUtils, urlUtils, translate, initDelegate, eventsProvider, textUtils, sitePluginsProvider, zone, utils, mainMenuProvider) {
        this.sitesProvider = sitesProvider;
        this.loginHelper = loginHelper;
        this.contentLinksDelegate = contentLinksDelegate;
        this.appProvider = appProvider;
        this.domUtils = domUtils;
        this.urlUtils = urlUtils;
        this.translate = translate;
        this.initDelegate = initDelegate;
        this.textUtils = textUtils;
        this.sitePluginsProvider = sitePluginsProvider;
        this.zone = zone;
        this.utils = utils;
        this.mainMenuProvider = mainMenuProvider;
        this.logger = logger.getInstance('CoreContentLinksHelperProvider');
    }
    /**
     * Check whether a link can be handled by the app.
     *
     * @param url URL to handle.
     * @param courseId Course ID related to the URL. Optional but recommended.
     * @param username Username to use to filter sites.
     * @param checkRoot Whether to check if the URL is the root URL of a site.
     * @return Promise resolved with a boolean: whether the URL can be handled.
     */
    CoreContentLinksHelperProvider.prototype.canHandleLink = function (url, courseId, username, checkRoot) {
        var _this = this;
        var promise;
        if (checkRoot) {
            promise = this.sitesProvider.isStoredRootURL(url, username);
        }
        else {
            promise = Promise.resolve({});
        }
        return promise.then(function (data) {
            if (data.site) {
                // URL is the root of the site, can handle it.
                return true;
            }
            return _this.contentLinksDelegate.getActionsFor(url, undefined, username).then(function (actions) {
                return !!_this.getFirstValidAction(actions);
            });
        }).catch(function () {
            return false;
        });
    };
    /**
     * Get the first valid action in a list of actions.
     *
     * @param actions List of actions.
     * @return First valid action. Returns undefined if no valid action found.
     */
    CoreContentLinksHelperProvider.prototype.getFirstValidAction = function (actions) {
        if (actions) {
            for (var i = 0; i < actions.length; i++) {
                var action = actions[i];
                if (action && action.sites && action.sites.length) {
                    return action;
                }
            }
        }
    };
    /**
     * Goes to a certain page in a certain site. If the site is current site it will perform a regular navigation,
     * otherwise it will 'redirect' to the other site.
     *
     * @param navCtrl The NavController instance to use.
     * @param pageName Name of the page to go.
     * @param pageParams Params to send to the page.
     * @param siteId Site ID. If not defined, current site.
     * @param checkMenu If true, check if the root page of a main menu tab. Only the page name will be checked.
     * @return Promise resolved when done.
     */
    CoreContentLinksHelperProvider.prototype.goInSite = function (navCtrl, pageName, pageParams, siteId, checkMenu) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        var deferred = this.utils.promiseDefer();
        // Execute the code in the Angular zone, so change detection doesn't stop working.
        this.zone.run(function () {
            if (navCtrl && siteId == _this.sitesProvider.getCurrentSiteId()) {
                if (checkMenu) {
                    // Check if the page is in the main menu.
                    _this.mainMenuProvider.isCurrentMainMenuHandler(pageName, pageParams).catch(function () {
                        return false; // Shouldn't happen.
                    }).then(function (isInMenu) {
                        if (isInMenu) {
                            // Just select the tab.
                            _this.loginHelper.loadPageInMainMenu(pageName, pageParams);
                            deferred.resolve();
                        }
                        else {
                            navCtrl.push(pageName, pageParams).then(deferred.resolve, deferred.reject);
                        }
                    });
                }
                else {
                    navCtrl.push(pageName, pageParams).then(deferred.resolve, deferred.reject);
                }
            }
            else {
                _this.loginHelper.redirect(pageName, pageParams, siteId).then(deferred.resolve, deferred.reject);
            }
        });
        return deferred.promise;
    };
    /**
     * Go to the page to choose a site.
     *
     * @param url URL to treat.
     */
    CoreContentLinksHelperProvider.prototype.goToChooseSite = function (url) {
        this.appProvider.getRootNavController().setRoot('CoreContentLinksChooseSitePage', { url: url });
    };
    /**
     * Handle a URL received by Custom URL Scheme.
     *
     * @param url URL to handle.
     * @return True if the URL should be handled by this component, false otherwise.
     * @deprecated Please use CoreCustomURLSchemesProvider.handleCustomURL instead.
     */
    CoreContentLinksHelperProvider.prototype.handleCustomUrl = function (url) {
        var _this = this;
        var contentLinksScheme = CoreConfigConstants.customurlscheme + '://link';
        if (url.indexOf(contentLinksScheme) == -1) {
            return false;
        }
        var modal = this.domUtils.showModalLoading();
        var username;
        url = this.textUtils.decodeURIComponent(url);
        // App opened using custom URL scheme.
        this.logger.debug('Treating custom URL scheme: ' + url);
        // Delete the scheme from the URL.
        url = url.replace(contentLinksScheme + '=', '');
        // Detect if there's a user specified.
        username = this.urlUtils.getUsernameFromUrl(url);
        if (username) {
            url = url.replace(username + '@', ''); // Remove the username from the URL.
        }
        // Wait for the app to be ready.
        this.initDelegate.ready().then(function () {
            // Check if it's the root URL.
            return _this.sitesProvider.isStoredRootURL(url, username);
        }).then(function (data) {
            if (data.site) {
                // Root URL.
                modal.dismiss();
                return _this.handleRootURL(data.site, false);
            }
            else if (data.siteIds.length > 0) {
                modal.dismiss(); // Dismiss modal so it doesn't collide with confirms.
                return _this.handleLink(url, username).then(function (treated) {
                    if (!treated) {
                        _this.domUtils.showErrorModal('core.contentlinks.errornoactions', true);
                    }
                });
            }
            else {
                // Get the site URL.
                var siteUrl = _this.contentLinksDelegate.getSiteUrl(url), urlToOpen_1 = url;
                if (!siteUrl) {
                    // Site URL not found, use the original URL since it could be the root URL of the site.
                    siteUrl = url;
                    urlToOpen_1 = undefined;
                }
                // Check that site exists.
                return _this.sitesProvider.checkSite(siteUrl).then(function (result) {
                    // Site exists. We'll allow to add it.
                    var ssoNeeded = _this.loginHelper.isSSOLoginNeeded(result.code), pageName = 'CoreLoginCredentialsPage', pageParams = {
                        siteUrl: result.siteUrl,
                        username: username,
                        urlToOpen: urlToOpen_1,
                        siteConfig: result.config
                    };
                    var promise, hasSitePluginsLoaded = false;
                    modal.dismiss(); // Dismiss modal so it doesn't collide with confirms.
                    if (!_this.sitesProvider.isLoggedIn()) {
                        // Not logged in, no need to confirm. If SSO the confirm will be shown later.
                        promise = Promise.resolve();
                    }
                    else {
                        // Ask the user before changing site.
                        var confirmMsg = _this.translate.instant('core.contentlinks.confirmurlothersite');
                        promise = _this.domUtils.showConfirm(confirmMsg).then(function () {
                            if (!ssoNeeded) {
                                hasSitePluginsLoaded = _this.sitePluginsProvider.hasSitePluginsLoaded;
                                if (hasSitePluginsLoaded) {
                                    // Store the redirect since logout will restart the app.
                                    _this.appProvider.storeRedirect(CoreConstants.NO_SITE_ID, pageName, pageParams);
                                }
                                return _this.sitesProvider.logout().catch(function () {
                                    // Ignore errors (shouldn't happen).
                                });
                            }
                        });
                    }
                    return promise.then(function () {
                        if (ssoNeeded) {
                            _this.loginHelper.confirmAndOpenBrowserForSSOLogin(result.siteUrl, result.code, result.service, result.config && result.config.launchurl);
                        }
                        else if (!hasSitePluginsLoaded) {
                            return _this.loginHelper.goToNoSitePage(undefined, pageName, pageParams);
                        }
                    });
                }).catch(function (error) {
                    _this.domUtils.showErrorModalDefault(error, _this.translate.instant('core.login.invalidsite'));
                });
            }
        }).finally(function () {
            modal.dismiss();
        });
        return true;
    };
    /**
     * Handle a link.
     *
     * @param url URL to handle.
     * @param username Username related with the URL. E.g. in 'http://myuser@m.com', url would be 'http://m.com' and
     *                 the username 'myuser'. Don't use it if you don't want to filter by username.
     * @param navCtrl Nav Controller to use to navigate.
     * @param checkRoot Whether to check if the URL is the root URL of a site.
     * @param openBrowserRoot Whether to open in browser if it's root URL and it belongs to current site.
     * @return Promise resolved with a boolean: true if URL was treated, false otherwise.
     */
    CoreContentLinksHelperProvider.prototype.handleLink = function (url, username, navCtrl, checkRoot, openBrowserRoot) {
        var _this = this;
        var promise;
        if (checkRoot) {
            promise = this.sitesProvider.isStoredRootURL(url, username);
        }
        else {
            promise = Promise.resolve({});
        }
        return promise.then(function (data) {
            if (data.site) {
                // URL is the root of the site.
                _this.handleRootURL(data.site, openBrowserRoot);
                return true;
            }
            // Check if the link should be treated by some component/addon.
            return _this.contentLinksDelegate.getActionsFor(url, undefined, username).then(function (actions) {
                var action = _this.getFirstValidAction(actions);
                if (action) {
                    if (!_this.sitesProvider.isLoggedIn()) {
                        // No current site. Perform the action if only 1 site found, choose the site otherwise.
                        if (action.sites.length == 1) {
                            action.action(action.sites[0], navCtrl);
                        }
                        else {
                            _this.goToChooseSite(url);
                        }
                    }
                    else if (action.sites.length == 1 && action.sites[0] == _this.sitesProvider.getCurrentSiteId()) {
                        // Current site.
                        action.action(action.sites[0], navCtrl);
                    }
                    else {
                        // Not current site or more than one site. Ask for confirmation.
                        _this.domUtils.showConfirm(_this.translate.instant('core.contentlinks.confirmurlothersite')).then(function () {
                            if (action.sites.length == 1) {
                                action.action(action.sites[0], navCtrl);
                            }
                            else {
                                _this.goToChooseSite(url);
                            }
                        }).catch(function () {
                            // User canceled.
                        });
                    }
                    return true;
                }
                return false;
            }).catch(function () {
                return false;
            });
        });
    };
    /**
     * Handle a root URL of a site.
     *
     * @param site Site to handle.
     * @param openBrowserRoot Whether to open in browser if it's root URL and it belongs to current site.
     * @param checkToken Whether to check that token is the same to verify it's current site. If false or not defined,
     *                   only the URL will be checked.
     * @return Promise resolved when done.
     */
    CoreContentLinksHelperProvider.prototype.handleRootURL = function (site, openBrowserRoot, checkToken) {
        var currentSite = this.sitesProvider.getCurrentSite();
        if (currentSite && currentSite.getURL() == site.getURL() && (!checkToken || currentSite.getToken() == site.getToken())) {
            // Already logged in.
            if (openBrowserRoot) {
                return site.openInBrowserWithAutoLogin(site.getURL());
            }
            return Promise.resolve();
        }
        else {
            // Login in the site.
            return this.loginHelper.redirect('', {}, site.getId());
        }
    };
    CoreContentLinksHelperProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider, CoreSitesProvider, CoreLoginHelperProvider,
            CoreContentLinksDelegate, CoreAppProvider,
            CoreDomUtilsProvider, CoreUrlUtilsProvider, TranslateService,
            CoreInitDelegate, CoreEventsProvider, CoreTextUtilsProvider,
            CoreSitePluginsProvider, NgZone, CoreUtilsProvider,
            CoreMainMenuProvider])
    ], CoreContentLinksHelperProvider);
    return CoreContentLinksHelperProvider;
}());
export { CoreContentLinksHelperProvider };
var CoreContentLinksHelper = /** @class */ (function (_super) {
    __extends(CoreContentLinksHelper, _super);
    function CoreContentLinksHelper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreContentLinksHelper;
}(makeSingleton(CoreContentLinksHelperProvider)));
export { CoreContentLinksHelper };
//# sourceMappingURL=helper.js.map