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
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { CoreApp } from '@providers/app';
import { CoreConfigProvider } from '@providers/config';
import { CoreEventsProvider } from '@providers/events';
import { CoreInitDelegate } from '@providers/init';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreWSProvider } from '@providers/ws';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreTextUtilsProvider } from '@providers/utils/text';
import { CoreUrlUtilsProvider } from '@providers/utils/url';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CoreSitePluginsProvider } from '@core/siteplugins/providers/siteplugins';
import { CoreCourseProvider } from '@core/course/providers/course';
import { CoreConfigConstants } from '../../../configconstants';
import { CoreConstants } from '@core/constants';
import { Md5 } from 'ts-md5/dist/md5';
import { CoreUrl } from '@singletons/url';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Helper provider that provides some common features regarding authentication.
 */
var CoreLoginHelperProvider = /** @class */ (function () {
    function CoreLoginHelperProvider(logger, sitesProvider, domUtils, wsProvider, translate, textUtils, eventsProvider, utils, urlUtils, configProvider, initDelegate, sitePluginsProvider, location, courseProvider) {
        var _this = this;
        this.sitesProvider = sitesProvider;
        this.domUtils = domUtils;
        this.wsProvider = wsProvider;
        this.translate = translate;
        this.textUtils = textUtils;
        this.eventsProvider = eventsProvider;
        this.utils = utils;
        this.urlUtils = urlUtils;
        this.configProvider = configProvider;
        this.initDelegate = initDelegate;
        this.sitePluginsProvider = sitePluginsProvider;
        this.location = location;
        this.courseProvider = courseProvider;
        this.isSSOConfirmShown = false;
        this.isOpenEditAlertShown = false;
        this.isOpeningReconnect = false;
        this.waitingForBrowser = false;
        this.logger = logger.getInstance('CoreLoginHelper');
        this.eventsProvider.on(CoreEventsProvider.MAIN_MENU_OPEN, function () {
            /* If there is any page pending to be opened, do it now. Don't open pages stored more than 5 seconds ago, probably
               the function to open the page was called when it shouldn't. */
            if (_this.pageToLoad && Date.now() - _this.pageToLoad.time < 5000) {
                _this.loadPageInMainMenu(_this.pageToLoad.page, _this.pageToLoad.params);
                delete _this.pageToLoad;
            }
        });
    }
    CoreLoginHelperProvider_1 = CoreLoginHelperProvider;
    /**
     * Accept site policy.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved if success, rejected if failure.
     */
    CoreLoginHelperProvider.prototype.acceptSitePolicy = function (siteId) {
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.write('core_user_agree_site_policy', {}).then(function (result) {
                if (!result.status) {
                    // Error.
                    if (result.warnings && result.warnings.length) {
                        // Check if there is a warning 'alreadyagreed'.
                        for (var i in result.warnings) {
                            var warning = result.warnings[i];
                            if (warning.warningcode == 'alreadyagreed') {
                                // Policy already agreed, treat it as a success.
                                return;
                            }
                        }
                        // Another warning, reject.
                        return Promise.reject(result.warnings[0]);
                    }
                    else {
                        return Promise.reject(null);
                    }
                }
            });
        });
    };
    /**
     * Function to handle URL received by Custom URL Scheme. If it's a SSO login, perform authentication.
     *
     * @param url URL received.
     * @return True if it's a SSO URL, false otherwise.
     * @deprecated Please use CoreCustomURLSchemesProvider.handleCustomURL instead.
     */
    CoreLoginHelperProvider.prototype.appLaunchedByURL = function (url) {
        var _this = this;
        var ssoScheme = CoreConfigConstants.customurlscheme + '://token=';
        if (url.indexOf(ssoScheme) == -1) {
            return false;
        }
        if (CoreApp.instance.isSSOAuthenticationOngoing()) {
            // Authentication ongoing, probably duplicated request.
            return true;
        }
        if (CoreApp.instance.isDesktop()) {
            // In desktop, make sure InAppBrowser is closed.
            this.utils.closeInAppBrowser(true);
        }
        // App opened using custom URL scheme. Probably an SSO authentication.
        CoreApp.instance.startSSOAuthentication();
        this.logger.debug('App launched by URL with an SSO');
        // Delete the sso scheme from the URL.
        url = url.replace(ssoScheme, '');
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
            return false;
        }
        var siteData, modal;
        // Wait for app to be ready.
        this.initDelegate.ready().then(function () {
            modal = _this.domUtils.showModalLoading('core.login.authenticating', true);
            return _this.validateBrowserSSOLogin(url);
        }).then(function (data) {
            siteData = data;
            return _this.handleSSOLoginAuthentication(siteData.siteUrl, siteData.token, siteData.privateToken, _this.getOAuthIdFromParams(data.ssoUrlParams));
        }).then(function () {
            if (siteData.pageName) {
                // State defined, go to that state instead of site initial page.
                CoreApp.instance.getRootNavController().push(siteData.pageName, siteData.pageParams);
            }
            else {
                _this.goToSiteInitialPage();
            }
        }).catch(function (error) {
            if (error) {
                // An error occurred, display the error and logout the user.
                _this.treatUserTokenError(siteData.siteUrl, error);
                _this.sitesProvider.logout();
            }
        }).finally(function () {
            modal.dismiss();
            CoreApp.instance.finishSSOAuthentication();
        });
        return true;
    };
    /**
     * Check if a site allows requesting a password reset through the app.
     *
     * @param siteUrl URL of the site.
     * @return Promise resolved with boolean: whether can be done through the app.
     */
    CoreLoginHelperProvider.prototype.canRequestPasswordReset = function (siteUrl) {
        return this.requestPasswordReset(siteUrl).then(function () {
            return true;
        }).catch(function (error) {
            return error.available == 1 || (typeof error.errorcode != 'undefined' && error.errorcode != 'invalidrecord' &&
                error.errorcode != '');
        });
    };
    /**
     * Function called when an SSO InAppBrowser is closed or the app is resumed. Check if user needs to be logged out.
     */
    CoreLoginHelperProvider.prototype.checkLogout = function () {
        var navCtrl = CoreApp.instance.getRootNavController();
        if (!CoreApp.instance.isSSOAuthenticationOngoing() && this.sitesProvider.isLoggedIn() &&
            this.sitesProvider.getCurrentSite().isLoggedOut() && navCtrl.getActive().name == 'CoreLoginReconnectPage') {
            // User must reauthenticate but he closed the InAppBrowser without doing so, logout him.
            this.sitesProvider.logout();
        }
    };
    /**
     * Show a confirm modal if needed and open a browser to perform SSO login.
     *
     * @param siteurl URL of the site where the SSO login will be performed.
     * @param typeOfLogin CoreConstants.LOGIN_SSO_CODE or CoreConstants.LOGIN_SSO_INAPP_CODE.
     * @param service The service to use. If not defined, external service will be used.
     * @param launchUrl The URL to open for SSO. If not defined, local_mobile launch URL will be used.
     */
    CoreLoginHelperProvider.prototype.confirmAndOpenBrowserForSSOLogin = function (siteUrl, typeOfLogin, service, launchUrl) {
        var _this = this;
        // Show confirm only if it's needed. Treat "false" (string) as false to prevent typing errors.
        var showConfirmation = this.shouldShowSSOConfirm(typeOfLogin);
        var promise;
        if (showConfirmation) {
            promise = this.domUtils.showConfirm(this.translate.instant('core.login.logininsiterequired'));
        }
        else {
            promise = Promise.resolve();
        }
        promise.then(function () {
            _this.openBrowserForSSOLogin(siteUrl, typeOfLogin, service, launchUrl);
        }).catch(function () {
            // User cancelled, ignore.
        });
    };
    /**
     * Helper function to act when the forgotten password is clicked.
     *
     * @param navCtrl NavController to use to navigate.
     * @param siteUrl Site URL.
     * @param username Username.
     * @param siteConfig Site config.
     */
    CoreLoginHelperProvider.prototype.forgottenPasswordClicked = function (navCtrl, siteUrl, username, siteConfig) {
        var _this = this;
        if (siteConfig && siteConfig.forgottenpasswordurl) {
            // URL set, open it.
            this.utils.openInApp(siteConfig.forgottenpasswordurl);
            return;
        }
        // Check if password reset can be done through the app.
        var modal = this.domUtils.showModalLoading();
        this.canRequestPasswordReset(siteUrl).then(function (canReset) {
            if (canReset) {
                navCtrl.push('CoreLoginForgottenPasswordPage', {
                    siteUrl: siteUrl, username: username
                });
            }
            else {
                _this.openForgottenPassword(siteUrl);
            }
        }).finally(function () {
            modal.dismiss();
        });
    };
    /**
     * Format profile fields, filtering the ones that shouldn't be shown on signup and classifying them in categories.
     *
     * @param profileFields Profile fields to format.
     * @return Categories with the fields to show in each one.
     */
    CoreLoginHelperProvider.prototype.formatProfileFieldsForSignup = function (profileFields) {
        if (!profileFields) {
            return [];
        }
        var categories = {};
        profileFields.forEach(function (field) {
            if (!field.signup) {
                // Not a signup field, ignore it.
                return;
            }
            if (!categories[field.categoryid]) {
                categories[field.categoryid] = {
                    id: field.categoryid,
                    name: field.categoryname,
                    fields: []
                };
            }
            categories[field.categoryid].fields.push(field);
        });
        return Object.keys(categories).map(function (index) {
            return categories[index];
        });
    };
    /**
     * Get disabled features from a site public config.
     *
     * @param config Site public config.
     * @return Disabled features.
     */
    CoreLoginHelperProvider.prototype.getDisabledFeatures = function (config) {
        var disabledFeatures = config && config.tool_mobile_disabledfeatures;
        if (!disabledFeatures) {
            return '';
        }
        return this.textUtils.treatDisabledFeatures(disabledFeatures);
    };
    /**
     * Builds an object with error messages for some common errors.
     * Please notice that this function doesn't support all possible error types.
     *
     * @param requiredMsg Code of the string for required error.
     * @param emailMsg Code of the string for invalid email error.
     * @param patternMsg Code of the string for pattern not match error.
     * @param urlMsg Code of the string for invalid url error.
     * @param minlengthMsg Code of the string for "too short" error.
     * @param maxlengthMsg Code of the string for "too long" error.
     * @param minMsg Code of the string for min value error.
     * @param maxMsg Code of the string for max value error.
     * @return Object with the errors.
     */
    CoreLoginHelperProvider.prototype.getErrorMessages = function (requiredMsg, emailMsg, patternMsg, urlMsg, minlengthMsg, maxlengthMsg, minMsg, maxMsg) {
        var errors = {};
        if (requiredMsg) {
            errors.required = errors.requiredTrue = this.translate.instant(requiredMsg);
        }
        if (emailMsg) {
            errors.email = this.translate.instant(emailMsg);
        }
        if (patternMsg) {
            errors.pattern = this.translate.instant(patternMsg);
        }
        if (urlMsg) {
            errors.url = this.translate.instant(urlMsg);
        }
        if (minlengthMsg) {
            errors.minlength = this.translate.instant(minlengthMsg);
        }
        if (maxlengthMsg) {
            errors.maxlength = this.translate.instant(maxlengthMsg);
        }
        if (minMsg) {
            errors.min = this.translate.instant(minMsg);
        }
        if (maxMsg) {
            errors.max = this.translate.instant(maxMsg);
        }
        return errors;
    };
    /**
     * Get logo URL from a site public config.
     *
     * @param config Site public config.
     * @return Logo URL.
     */
    CoreLoginHelperProvider.prototype.getLogoUrl = function (config) {
        return !CoreConfigConstants.forceLoginLogo && config ? (config.logourl || config.compactlogourl) : null;
    };
    /**
     * Returns the logout label of a site.
     *
     * @param site Site. If not defined, use current site.
     * @return The string key.
     */
    CoreLoginHelperProvider.prototype.getLogoutLabel = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        var config = site.getStoredConfig();
        return 'core.mainmenu.' + (config && config.tool_mobile_forcelogout == '1' ? 'logout' : 'changesite');
    };
    /**
     * Get the OAuth ID of some URL params (if it has an OAuth ID).
     *
     * @param params Params.
     * @return OAuth ID.
     */
    CoreLoginHelperProvider.prototype.getOAuthIdFromParams = function (params) {
        return params && typeof params.oauthsso != 'undefined' ? Number(params.oauthsso) : undefined;
    };
    /**
     * Get the site policy.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the site policy.
     */
    CoreLoginHelperProvider.prototype.getSitePolicy = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            // Try to get the latest config, maybe the site policy was just added or has changed.
            return site.getConfig('sitepolicy', true).then(function (sitePolicy) {
                return sitePolicy ? sitePolicy : Promise.reject(null);
            }, function () {
                // Cannot get config, try to get the site policy using auth_email_get_signup_settings.
                return _this.wsProvider.callAjax('auth_email_get_signup_settings', {}, { siteUrl: site.getURL() })
                    .then(function (settings) {
                    return settings.sitepolicy ? settings.sitepolicy : Promise.reject(null);
                });
            });
        });
    };
    /**
     * Get fixed site or sites.
     *
     * @return Fixed site or list of fixed sites.
     */
    CoreLoginHelperProvider.prototype.getFixedSites = function () {
        return CoreConfigConstants.siteurl;
    };
    /**
     * Get the valid identity providers from a site config.
     *
     * @param siteConfig Site's public config.
     * @param disabledFeatures List of disabled features already treated. If not provided it will be calculated.
     * @return Valid identity providers.
     */
    CoreLoginHelperProvider.prototype.getValidIdentityProviders = function (siteConfig, disabledFeatures) {
        var _this = this;
        if (this.isFeatureDisabled('NoDelegate_IdentityProviders', siteConfig, disabledFeatures)) {
            // Identity providers are disabled, return an empty list.
            return [];
        }
        var validProviders = [], httpUrl = this.textUtils.concatenatePaths(siteConfig.wwwroot, 'auth/oauth2/'), httpsUrl = this.textUtils.concatenatePaths(siteConfig.httpswwwroot, 'auth/oauth2/');
        if (siteConfig.identityproviders && siteConfig.identityproviders.length) {
            siteConfig.identityproviders.forEach(function (provider) {
                var urlParams = _this.urlUtils.extractUrlParams(provider.url);
                if (provider.url && (provider.url.indexOf(httpsUrl) != -1 || provider.url.indexOf(httpUrl) != -1) &&
                    !_this.isFeatureDisabled('NoDelegate_IdentityProvider_' + urlParams.id, siteConfig, disabledFeatures)) {
                    validProviders.push(provider);
                }
            });
        }
        return validProviders;
    };
    /**
     * Go to the page to add a new site.
     * If a fixed URL is configured, go to credentials instead.
     *
     * @param setRoot True to set the new page as root, false to add it to the stack.
     * @param showKeyboard Whether to show keyboard in the new page. Only if no fixed URL set.
     * @return Promise resolved when done.
     */
    CoreLoginHelperProvider.prototype.goToAddSite = function (setRoot, showKeyboard) {
        var pageName, params;
        if (this.isFixedUrlSet()) {
            // Fixed URL is set, go to credentials page.
            var url = typeof CoreConfigConstants.siteurl == 'string' ?
                CoreConfigConstants.siteurl : CoreConfigConstants.siteurl[0].url;
            pageName = 'CoreLoginCredentialsPage';
            params = { siteUrl: url };
        }
        else {
            pageName = 'CoreLoginSitePage';
            params = {
                showKeyboard: showKeyboard
            };
        }
        if (setRoot) {
            return CoreApp.instance.getRootNavController().setRoot(pageName, params, { animate: false });
        }
        else {
            return CoreApp.instance.getRootNavController().push(pageName, params);
        }
    };
    /**
     * Open a page that doesn't belong to any site.
     *
     * @param navCtrl Nav Controller.
     * @param page Page to open.
     * @param params Params of the page.
     * @return Promise resolved when done.
     */
    CoreLoginHelperProvider.prototype.goToNoSitePage = function (navCtrl, page, params) {
        navCtrl = navCtrl || CoreApp.instance.getRootNavController();
        var currentPage = navCtrl && navCtrl.getActive().component.name;
        if (page == currentPage) {
            // Already at page, nothing to do.
        }
        else if (page == 'CoreLoginSitesPage') {
            // Just open the page as root.
            return navCtrl.setRoot(page, params);
        }
        else if (page == 'CoreLoginCredentialsPage' && currentPage == 'CoreLoginSitePage') {
            // Just open the new page to keep the navigation history.
            return navCtrl.push(page, params);
        }
        else {
            // Check if there is any site stored.
            return this.sitesProvider.hasSites().then(function (hasSites) {
                if (hasSites) {
                    // There are sites stored, open sites page first to be able to go back.
                    navCtrl.setRoot('CoreLoginSitesPage');
                    return navCtrl.push(page, params, { animate: false });
                }
                else {
                    if (page != 'CoreLoginSitePage') {
                        // Open the new site page to be able to go back.
                        navCtrl.setRoot('CoreLoginSitePage');
                        return navCtrl.push(page, params, { animate: false });
                    }
                    else {
                        // Just open the page as root.
                        return navCtrl.setRoot(page, params);
                    }
                }
            });
        }
    };
    /**
     * Go to the initial page of a site depending on 'userhomepage' setting.
     *
     * @param navCtrl NavController to use. Defaults to app root NavController.
     * @param page Name of the page to load after loading the main page.
     * @param params Params to pass to the page.
     * @param options Navigation options.
     * @param url URL to open once the main menu is loaded.
     * @return Promise resolved when done.
     */
    CoreLoginHelperProvider.prototype.goToSiteInitialPage = function (navCtrl, page, params, options, url) {
        return this.openMainMenu(navCtrl, page, params, options, url);
    };
    /**
     * Convenient helper to handle authentication in the app using a token received by SSO login. If it's a new account,
     * the site is stored and the user is authenticated. If the account already exists, update its token.
     *
     * @param siteUrl Site's URL.
     * @param token User's token.
     * @param privateToken User's private token.
     * @param oauthId OAuth ID. Only if the authentication was using an OAuth method.
     * @return Promise resolved when the user is authenticated with the token.
     */
    CoreLoginHelperProvider.prototype.handleSSOLoginAuthentication = function (siteUrl, token, privateToken, oauthId) {
        // Always create a new site to prevent overriding data if another user credentials were introduced.
        return this.sitesProvider.newSite(siteUrl, token, privateToken, true, oauthId);
    };
    /**
     * Check if the app is configured to use several fixed URLs.
     *
     * @return Whether there are several fixed URLs.
     */
    CoreLoginHelperProvider.prototype.hasSeveralFixedSites = function () {
        return CoreConfigConstants.siteurl && Array.isArray(CoreConfigConstants.siteurl) &&
            CoreConfigConstants.siteurl.length > 1;
    };
    /**
     * Function called when a page starts loading in any InAppBrowser window.
     *
     * @param url Loaded url.
     * @deprecated
     */
    CoreLoginHelperProvider.prototype.inAppBrowserLoadStart = function (url) {
        // This function is deprecated.
    };
    /**
     * Given a site public config, check if email signup is disabled.
     *
     * @param config Site public config.
     * @param disabledFeatures List of disabled features already treated. If not provided it will be calculated.
     * @return Whether email signup is disabled.
     */
    CoreLoginHelperProvider.prototype.isEmailSignupDisabled = function (config, disabledFeatures) {
        return this.isFeatureDisabled('CoreLoginEmailSignup', config, disabledFeatures);
    };
    /**
     * Given a site public config, check if a certian feature is disabled.
     *
     * @param feature Feature to check.
     * @param config Site public config.
     * @param disabledFeatures List of disabled features already treated. If not provided it will be calculated.
     * @return Whether email signup is disabled.
     */
    CoreLoginHelperProvider.prototype.isFeatureDisabled = function (feature, config, disabledFeatures) {
        if (typeof disabledFeatures == 'undefined') {
            disabledFeatures = this.getDisabledFeatures(config);
        }
        var regEx = new RegExp('(,|^)' + feature + '(,|$)', 'g');
        return !!disabledFeatures.match(regEx);
    };
    /**
     * Check if the app is configured to use a fixed URL (only 1).
     *
     * @return Whether there is 1 fixed URL.
     */
    CoreLoginHelperProvider.prototype.isFixedUrlSet = function () {
        if (Array.isArray(CoreConfigConstants.siteurl)) {
            return CoreConfigConstants.siteurl.length == 1;
        }
        return !!CoreConfigConstants.siteurl;
    };
    /**
     * Given a site public config, check if forgotten password is disabled.
     *
     * @param config Site public config.
     * @param disabledFeatures List of disabled features already treated. If not provided it will be calculated.
     * @return Whether it's disabled.
     */
    CoreLoginHelperProvider.prototype.isForgottenPasswordDisabled = function (config, disabledFeatures) {
        return this.isFeatureDisabled('NoDelegate_ForgottenPassword', config, disabledFeatures);
    };
    /**
     * Check if current site is logged out, triggering mmCoreEventSessionExpired if it is.
     *
     * @param pageName Name of the page to go once authenticated if logged out. If not defined, site initial page.
     * @param params Params of the page to go once authenticated if logged out.
     * @return True if user is logged out, false otherwise.
     */
    CoreLoginHelperProvider.prototype.isSiteLoggedOut = function (pageName, params) {
        var site = this.sitesProvider.getCurrentSite();
        if (!site) {
            return false;
        }
        if (site.isLoggedOut()) {
            this.eventsProvider.trigger(CoreEventsProvider.SESSION_EXPIRED, {
                pageName: pageName,
                params: params
            }, site.getId());
            return true;
        }
        return false;
    };
    /**
     * Check if a site URL is "allowed". In case the app has fixed sites, only those will be allowed to connect to.
     *
     * @param siteUrl Site URL to check.
     * @return Promise resolved with boolean: whether is one of the fixed sites.
     */
    CoreLoginHelperProvider.prototype.isSiteUrlAllowed = function (siteUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var sites, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isFixedUrlSet()) return [3 /*break*/, 1];
                        // Only 1 site allowed.
                        return [2 /*return*/, CoreUrl.sameDomainAndPath(siteUrl, this.getFixedSites())];
                    case 1:
                        if (!this.hasSeveralFixedSites()) return [3 /*break*/, 2];
                        sites = this.getFixedSites();
                        return [2 /*return*/, sites.some(function (site) {
                                return CoreUrl.sameDomainAndPath(siteUrl, site.url);
                            })];
                    case 2:
                        if (!(CoreConfigConstants.multisitesdisplay == 'sitefinder' && CoreConfigConstants.onlyallowlistedsites)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sitesProvider.findSites(siteUrl.replace(/^https?\:\/\/|\.\w{2,3}\/?$/g, ''))];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result && result.some(function (site) {
                                return CoreUrl.sameDomainAndPath(siteUrl, site.url);
                            })];
                    case 4: 
                    // No fixed sites or it uses a non-restrictive sites finder. Allow connecting.
                    return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Check if SSO login should use an embedded browser.
     *
     * @param code Code to check.
     * @return True if embedded browser, false othwerise.
     */
    CoreLoginHelperProvider.prototype.isSSOEmbeddedBrowser = function (code) {
        if (CoreApp.instance.isLinux()) {
            // In Linux desktop app, always use embedded browser.
            return true;
        }
        return code == CoreConstants.LOGIN_SSO_INAPP_CODE;
    };
    /**
     * Check if SSO login is needed based on code returned by the WS.
     *
     * @param code Code to check.
     * @return True if SSO login is needed, false othwerise.
     */
    CoreLoginHelperProvider.prototype.isSSOLoginNeeded = function (code) {
        return code == CoreConstants.LOGIN_SSO_CODE || code == CoreConstants.LOGIN_SSO_INAPP_CODE;
    };
    /**
     * Load a site and load a certain page in that site.
     *
     * @param page Name of the page to load.
     * @param params Params to pass to the page.
     * @param siteId Site to load.
     * @return Promise resolved when done.
     */
    CoreLoginHelperProvider.prototype.loadSiteAndPage = function (page, params, siteId) {
        var _this = this;
        var navCtrl = CoreApp.instance.getRootNavController();
        if (siteId == CoreConstants.NO_SITE_ID) {
            // Page doesn't belong to a site, just load the page.
            return navCtrl.setRoot(page, params);
        }
        else {
            var modal_1 = this.domUtils.showModalLoading();
            return this.sitesProvider.loadSite(siteId, page, params).then(function (loggedIn) {
                if (loggedIn) {
                    return _this.openMainMenu(navCtrl, page, params);
                }
            }).catch(function (error) {
                // Site doesn't exist.
                return navCtrl.setRoot('CoreLoginSitesPage');
            }).finally(function () {
                modal_1.dismiss();
            });
        }
    };
    /**
     * Load a certain page in the main menu page.
     *
     * @param page Name of the page to load.
     * @param params Params to pass to the page.
     */
    CoreLoginHelperProvider.prototype.loadPageInMainMenu = function (page, params) {
        if (!CoreApp.instance.isMainMenuOpen()) {
            // Main menu not open. Store the page to be loaded later.
            this.pageToLoad = {
                page: page,
                params: params,
                time: Date.now()
            };
            return;
        }
        if (page == CoreLoginHelperProvider_1.OPEN_COURSE) {
            // Use the openCourse function.
            this.courseProvider.openCourse(undefined, params.course, params);
        }
        else {
            this.eventsProvider.trigger(CoreEventsProvider.LOAD_PAGE_MAIN_MENU, { redirectPage: page, redirectParams: params });
        }
    };
    /**
     * Open the main menu, loading a certain page.
     *
     * @param navCtrl NavController.
     * @param page Name of the page to load.
     * @param params Params to pass to the page.
     * @param options Navigation options.
     * @param url URL to open once the main menu is loaded.
     * @return Promise resolved when done.
     */
    CoreLoginHelperProvider.prototype.openMainMenu = function (navCtrl, page, params, options, url) {
        var _this = this;
        navCtrl = navCtrl || CoreApp.instance.getRootNavController();
        // Due to DeepLinker, we need to remove the path from the URL before going to main menu.
        // IonTabs checks the URL to determine which path to load for deep linking, so we clear the URL.
        this.location.replaceState('');
        if (page == CoreLoginHelperProvider_1.OPEN_COURSE) {
            // Load the main menu first, and then open the course.
            return navCtrl.setRoot('CoreMainMenuPage').finally(function () {
                return _this.courseProvider.openCourse(undefined, params.course, params);
            });
        }
        else {
            // Open the main menu.
            return navCtrl.setRoot('CoreMainMenuPage', { redirectPage: page, redirectParams: params, urlToOpen: url }, options);
        }
    };
    /**
     * Open a browser to perform OAuth login (Google, Facebook, Microsoft).
     *
     * @param siteUrl URL of the site where the login will be performed.
     * @param provider The identity provider.
     * @param launchUrl The URL to open for SSO. If not defined, tool/mobile launch URL will be used.
     * @param pageName Name of the page to go once authenticated. If not defined, site initial page.
     * @param pageParams Params of the state to go once authenticated.
     * @return True if success, false if error.
     */
    CoreLoginHelperProvider.prototype.openBrowserForOAuthLogin = function (siteUrl, provider, launchUrl, pageName, pageParams) {
        launchUrl = launchUrl || siteUrl + '/admin/tool/mobile/launch.php';
        if (!provider || !provider.url) {
            return false;
        }
        var params = this.urlUtils.extractUrlParams(provider.url);
        if (!params.id) {
            return false;
        }
        var service = this.sitesProvider.determineService(siteUrl);
        var loginUrl = this.prepareForSSOLogin(siteUrl, service, launchUrl, pageName, pageParams, {
            oauthsso: params.id,
        });
        if (CoreApp.instance.isLinux()) {
            // In Linux desktop app, always use embedded browser.
            this.utils.openInApp(loginUrl);
        }
        else {
            // Always open it in browser because the user might have the session stored in there.
            this.utils.openInBrowser(loginUrl);
            if (navigator.app) {
                navigator.app.exitApp();
            }
        }
        return true;
    };
    /**
     * Open a browser to perform SSO login.
     *
     * @param siteurl URL of the site where the SSO login will be performed.
     * @param typeOfLogin CoreConstants.LOGIN_SSO_CODE or CoreConstants.LOGIN_SSO_INAPP_CODE.
     * @param service The service to use. If not defined, external service will be used.
     * @param launchUrl The URL to open for SSO. If not defined, local_mobile launch URL will be used.
     * @param pageName Name of the page to go once authenticated. If not defined, site initial page.
     * @param pageParams Params of the state to go once authenticated.
     */
    CoreLoginHelperProvider.prototype.openBrowserForSSOLogin = function (siteUrl, typeOfLogin, service, launchUrl, pageName, pageParams) {
        var loginUrl = this.prepareForSSOLogin(siteUrl, service, launchUrl, pageName, pageParams);
        if (this.isSSOEmbeddedBrowser(typeOfLogin)) {
            var options = {
                clearsessioncache: 'yes',
                closebuttoncaption: this.translate.instant('core.login.cancel'),
            };
            this.utils.openInApp(loginUrl, options);
        }
        else {
            this.utils.openInBrowser(loginUrl);
            if (navigator.app) {
                navigator.app.exitApp();
            }
        }
    };
    /**
     * Convenient helper to open change password page.
     *
     * @param siteUrl Site URL to construct change password URL.
     * @param error Error message.
     */
    CoreLoginHelperProvider.prototype.openChangePassword = function (siteUrl, error) {
        var _this = this;
        this.domUtils.showAlert(this.translate.instant('core.notice'), error, undefined, 3000).then(function (alert) {
            var subscription = alert.didDismiss.subscribe(function () {
                subscription && subscription.unsubscribe();
                _this.utils.openInApp(siteUrl + '/login/change_password.php');
            });
        });
    };
    /**
     * Open forgotten password in inappbrowser.
     *
     * @param siteUrl URL of the site.
     */
    CoreLoginHelperProvider.prototype.openForgottenPassword = function (siteUrl) {
        this.utils.openInApp(siteUrl + '/login/forgot_password.php');
    };
    /**
     * Function to open in app browser to change password or complete user profile.
     *
     * @param siteId The site ID.
     * @param path The relative path of the URL to open.
     * @param alertMessage The key of the message to display before opening the in app browser.
     * @param invalidateCache Whether to invalidate site's cache (e.g. when the user is forced to change password).
     */
    CoreLoginHelperProvider.prototype.openInAppForEdit = function (siteId, path, alertMessage, invalidateCache) {
        var _this = this;
        if (!siteId || siteId !== this.sitesProvider.getCurrentSiteId()) {
            // Site that triggered the event is not current site, nothing to do.
            return;
        }
        var currentSite = this.sitesProvider.getCurrentSite(), siteUrl = currentSite && currentSite.getURL();
        if (!currentSite || !siteUrl) {
            return;
        }
        if (!this.isOpenEditAlertShown && !this.waitingForBrowser) {
            this.isOpenEditAlertShown = true;
            if (invalidateCache) {
                currentSite.invalidateWsCache();
            }
            // Open change password.
            if (alertMessage) {
                alertMessage = this.translate.instant(alertMessage) + '<br>' + this.translate.instant('core.redirectingtosite');
            }
            currentSite.openInAppWithAutoLogin(siteUrl + path, undefined, alertMessage).then(function () {
                _this.waitingForBrowser = true;
            }).finally(function () {
                _this.isOpenEditAlertShown = false;
            });
        }
    };
    /**
     * Function that should be called when password change is forced. Reserved for core use.
     *
     * @param siteId The site ID.
     */
    CoreLoginHelperProvider.prototype.passwordChangeForced = function (siteId) {
        var currentSite = this.sitesProvider.getCurrentSite();
        if (!currentSite || siteId !== currentSite.getId()) {
            return; // Site that triggered the event is not current site.
        }
        var rootNavCtrl = CoreApp.instance.getRootNavController(), activePage = rootNavCtrl.getActive();
        // If current page is already change password, stop.
        if (activePage && activePage.component && activePage.component.name == 'CoreLoginChangePasswordPage') {
            return;
        }
        rootNavCtrl.setRoot('CoreLoginChangePasswordPage', { siteId: siteId });
    };
    /**
     * Prepare the app to perform SSO login.
     *
     * @param siteUrl URL of the site where the SSO login will be performed.
     * @param service The service to use. If not defined, external service will be used.
     * @param launchUrl The URL to open for SSO. If not defined, local_mobile launch URL will be used.
     * @param pageName Name of the page to go once authenticated. If not defined, site initial page.
     * @param pageParams Params of the state to go once authenticated.
     * @param urlParams Other params to add to the URL.
     * @return Login Url.
     */
    CoreLoginHelperProvider.prototype.prepareForSSOLogin = function (siteUrl, service, launchUrl, pageName, pageParams, urlParams) {
        service = service || CoreConfigConstants.wsextservice;
        launchUrl = launchUrl || siteUrl + '/local/mobile/launch.php';
        var passport = Math.random() * 1000;
        var loginUrl = launchUrl + '?service=' + service;
        loginUrl += '&passport=' + passport;
        loginUrl += '&urlscheme=' + CoreConfigConstants.customurlscheme;
        if (urlParams) {
            loginUrl = this.urlUtils.addParamsToUrl(loginUrl, urlParams);
        }
        // Store the siteurl and passport in CoreConfigProvider for persistence.
        // We are "configuring" the app to wait for an SSO. CoreConfigProvider shouldn't be used as a temporary storage.
        this.configProvider.set(CoreConstants.LOGIN_LAUNCH_DATA, JSON.stringify({
            siteUrl: siteUrl,
            passport: passport,
            pageName: pageName || '',
            pageParams: pageParams || {},
            ssoUrlParams: urlParams || {},
        }));
        return loginUrl;
    };
    /**
     * Redirect to a new page, setting it as the root page and loading the right site if needed.
     *
     * @param page Name of the page to load. Special cases: OPEN_COURSE (to open course page).
     * @param params Params to pass to the page.
     * @param siteId Site to load. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreLoginHelperProvider.prototype.redirect = function (page, params, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        if (this.sitesProvider.isLoggedIn()) {
            if (siteId && siteId != this.sitesProvider.getCurrentSiteId()) {
                // Target page belongs to a different site. Change site.
                if (this.sitePluginsProvider.hasSitePluginsLoaded) {
                    // The site has site plugins so the app will be restarted. Store the data and logout.
                    CoreApp.instance.storeRedirect(siteId, page, params);
                    return this.sitesProvider.logout();
                }
                else {
                    return this.sitesProvider.logout().then(function () {
                        return _this.loadSiteAndPage(page, params, siteId);
                    });
                }
            }
            else {
                this.loadPageInMainMenu(page, params);
            }
        }
        else {
            if (siteId) {
                return this.loadSiteAndPage(page, params, siteId);
            }
            else {
                return CoreApp.instance.getRootNavController().setRoot('CoreLoginSitesPage');
            }
        }
        return Promise.resolve();
    };
    /**
     * Request a password reset.
     *
     * @param siteUrl URL of the site.
     * @param username Username to search.
     * @param email Email to search.
     * @return Promise resolved when done.
     */
    CoreLoginHelperProvider.prototype.requestPasswordReset = function (siteUrl, username, email) {
        var params = {};
        if (username) {
            params.username = username;
        }
        if (email) {
            params.email = email;
        }
        return this.wsProvider.callAjax('core_auth_request_password_reset', params, { siteUrl: siteUrl });
    };
    /**
     * Function that should be called when the session expires. Reserved for core use.
     *
     * @param data Data received by the SESSION_EXPIRED event.
     */
    CoreLoginHelperProvider.prototype.sessionExpired = function (data) {
        var _this = this;
        var siteId = data && data.siteId, currentSite = this.sitesProvider.getCurrentSite(), siteUrl = currentSite && currentSite.getURL();
        var promise;
        if (!currentSite || !siteUrl) {
            return;
        }
        if (siteId && siteId !== currentSite.getId()) {
            return; // Site that triggered the event is not current site.
        }
        // Check authentication method.
        this.sitesProvider.checkSite(siteUrl).then(function (result) {
            if (result.warning) {
                _this.domUtils.showErrorModal(result.warning, true, 4000);
            }
            if (_this.isSSOLoginNeeded(result.code)) {
                // SSO. User needs to authenticate in a browser. Check if we need to display a message.
                if (!CoreApp.instance.isSSOAuthenticationOngoing() && !_this.isSSOConfirmShown && !_this.waitingForBrowser) {
                    _this.isSSOConfirmShown = true;
                    if (_this.shouldShowSSOConfirm(result.code)) {
                        promise = _this.domUtils.showConfirm(_this.translate.instant('core.login.' +
                            (currentSite.isLoggedOut() ? 'loggedoutssodescription' : 'reconnectssodescription')));
                    }
                    else {
                        promise = Promise.resolve();
                    }
                    promise.then(function () {
                        _this.waitingForBrowser = true;
                        _this.openBrowserForSSOLogin(result.siteUrl, result.code, result.service, result.config && result.config.launchurl, data.pageName, data.params);
                    }).catch(function () {
                        // User cancelled, logout him.
                        _this.sitesProvider.logout();
                    }).finally(function () {
                        _this.isSSOConfirmShown = false;
                    });
                }
            }
            else {
                if (currentSite.isOAuth()) {
                    // User authenticated using an OAuth method. Check if it's still valid.
                    var identityProviders = _this.getValidIdentityProviders(result.config);
                    var providerToUse_1 = identityProviders.find(function (provider) {
                        var params = _this.urlUtils.extractUrlParams(provider.url);
                        return Number(params.id) == currentSite.getOAuthId();
                    });
                    if (providerToUse_1) {
                        if (!CoreApp.instance.isSSOAuthenticationOngoing() && !_this.isSSOConfirmShown && !_this.waitingForBrowser) {
                            // Open browser to perform the OAuth.
                            _this.isSSOConfirmShown = true;
                            var confirmMessage = _this.translate.instant('core.login.' +
                                (currentSite.isLoggedOut() ? 'loggedoutssodescription' : 'reconnectssodescription'));
                            _this.domUtils.showConfirm(confirmMessage).then(function () {
                                _this.waitingForBrowser = true;
                                _this.sitesProvider.unsetCurrentSite(); // Unset current site to make authentication work fine.
                                _this.openBrowserForOAuthLogin(siteUrl, providerToUse_1, result.config.launchurl, data.pageName, data.params);
                            }).catch(function () {
                                // User cancelled, logout him.
                                _this.sitesProvider.logout();
                            }).finally(function () {
                                _this.isSSOConfirmShown = false;
                            });
                        }
                        return;
                    }
                }
                var info = currentSite.getInfo();
                if (typeof info != 'undefined' && typeof info.username != 'undefined' && !_this.isOpeningReconnect) {
                    var rootNavCtrl = CoreApp.instance.getRootNavController(), activePage = rootNavCtrl.getActive();
                    // If current page is already reconnect, stop.
                    if (activePage && activePage.component && activePage.component.name == 'CoreLoginReconnectPage') {
                        return;
                    }
                    _this.isOpeningReconnect = true;
                    rootNavCtrl.setRoot('CoreLoginReconnectPage', {
                        infoSiteUrl: info.siteurl,
                        siteUrl: result.siteUrl,
                        siteId: siteId,
                        pageName: data.pageName,
                        pageParams: data.params,
                        siteConfig: result.config
                    }).finally(function () {
                        _this.isOpeningReconnect = false;
                    });
                }
            }
        }).catch(function (error) {
            // Error checking site.
            if (currentSite.isLoggedOut()) {
                // Site is logged out, show error and logout the user.
                _this.domUtils.showErrorModalDefault(error, 'core.networkerrormsg', true);
                _this.sitesProvider.logout();
            }
        });
    };
    /**
     * Check if a confirm should be shown to open a SSO authentication.
     *
     * @param typeOfLogin CoreConstants.LOGIN_SSO_CODE or CoreConstants.LOGIN_SSO_INAPP_CODE.
     * @return True if confirm modal should be shown, false otherwise.
     */
    CoreLoginHelperProvider.prototype.shouldShowSSOConfirm = function (typeOfLogin) {
        return !this.isSSOEmbeddedBrowser(typeOfLogin) &&
            (!CoreConfigConstants.skipssoconfirmation || String(CoreConfigConstants.skipssoconfirmation) === 'false');
    };
    /**
     * Show a modal warning the user that he should use the Workplace app.
     *
     * @param message The warning message.
     */
    CoreLoginHelperProvider.prototype.showWorkplaceNoticeModal = function (message) {
        var link = CoreApp.instance.getAppStoreUrl({ android: 'com.moodle.workplace', ios: 'id1470929705' });
        this.domUtils.showDownloadAppNoticeModal(message, link);
    };
    /**
     * Show a modal warning the user that he should use the current Moodle app.
     *
     * @param message The warning message.
     */
    CoreLoginHelperProvider.prototype.showMoodleAppNoticeModal = function (message) {
        var storesConfig = CoreConfigConstants.appstores;
        storesConfig.desktop = 'https://download.moodle.org/desktop/';
        storesConfig.mobile = 'https://download.moodle.org/mobile/';
        storesConfig.default = 'https://download.moodle.org/mobile/';
        var link = CoreApp.instance.getAppStoreUrl(storesConfig);
        this.domUtils.showDownloadAppNoticeModal(message, link);
    };
    /**
     * Show a modal to inform the user that a confirmation email was sent, and a button to resend the email on 3.6+ sites.
     *
     * @param siteUrl Site URL.
     * @param email Email of the user. If set displayed in the message.
     * @param username Username. If not set the button to resend email will not be shown.
     * @param password User password. If not set the button to resend email will not be shown.
     */
    CoreLoginHelperProvider.prototype.showNotConfirmedModal = function (siteUrl, email, username, password) {
        var _this = this;
        var title = this.translate.instant('core.login.mustconfirm');
        var message;
        if (email) {
            message = this.translate.instant('core.login.emailconfirmsent', { $a: email });
        }
        else {
            message = this.translate.instant('core.login.emailconfirmsentnoemail');
        }
        // Check whether we need to display the resend button or not.
        var promise;
        if (username && password) {
            var modal_2 = this.domUtils.showModalLoading();
            // We don't have site info before login, the only way to check if the WS is available is by calling it.
            var preSets = { siteUrl: siteUrl };
            promise = this.wsProvider.callAjax('core_auth_resend_confirmation_email', {}, preSets).catch(function (error) {
                // If the WS responds with an invalid parameter error it means the WS is avaiable.
                return Promise.resolve(error && error.errorcode === 'invalidparameter');
            }).finally(function () {
                modal_2.dismiss();
            });
        }
        else {
            promise = Promise.resolve(false);
        }
        promise.then(function (canResend) {
            if (canResend) {
                var okText = _this.translate.instant('core.login.resendemail');
                var cancelText = _this.translate.instant('core.close');
                _this.domUtils.showConfirm(message, title, okText, cancelText).then(function () {
                    // Call the WS to resend the confirmation email.
                    var modal = _this.domUtils.showModalLoading('core.sending', true);
                    var data = { username: username, password: password };
                    var preSets = { siteUrl: siteUrl };
                    _this.wsProvider.callAjax('core_auth_resend_confirmation_email', data, preSets).then(function (response) {
                        var message = _this.translate.instant('core.login.emailconfirmsentsuccess');
                        _this.domUtils.showAlert(_this.translate.instant('core.success'), message);
                    }).catch(function (error) {
                        _this.domUtils.showErrorModal(error);
                    }).finally(function () {
                        modal.dismiss();
                    });
                }).catch(function () {
                    // Dialog dismissed.
                });
            }
            else {
                _this.domUtils.showAlert(title, message);
            }
        });
    };
    /**
     * Function called when site policy is not agreed. Reserved for core use.
     *
     * @param siteId Site ID. If not defined, current site.
     */
    CoreLoginHelperProvider.prototype.sitePolicyNotAgreed = function (siteId) {
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        if (!siteId || siteId != this.sitesProvider.getCurrentSiteId()) {
            // Only current site allowed.
            return;
        }
        if (!this.sitesProvider.wsAvailableInCurrentSite('core_user_agree_site_policy')) {
            // WS not available, stop.
            return;
        }
        var rootNavCtrl = CoreApp.instance.getRootNavController(), activePage = rootNavCtrl.getActive();
        // If current page is already site policy, stop.
        if (activePage && activePage.component && activePage.component.name == 'CoreLoginSitePolicyPage') {
            return;
        }
        rootNavCtrl.setRoot('CoreLoginSitePolicyPage', { siteId: siteId });
    };
    /**
     * Convenient helper to handle get User Token error. It redirects to change password page if forcepassword is set.
     *
     * @param siteUrl Site URL to construct change password URL.
     * @param error Error object containing errorcode and error message.
     * @param username Username.
     * @param password User password.
     */
    CoreLoginHelperProvider.prototype.treatUserTokenError = function (siteUrl, error, username, password) {
        if (error.errorcode == 'forcepasswordchangenotice') {
            this.openChangePassword(siteUrl, this.textUtils.getErrorMessageFromError(error));
        }
        else if (error.errorcode == 'usernotconfirmed') {
            this.showNotConfirmedModal(siteUrl, undefined, username, password);
        }
        else if (error.errorcode == 'connecttomoodleapp') {
            this.showMoodleAppNoticeModal(this.textUtils.getErrorMessageFromError(error));
        }
        else if (error.errorcode == 'connecttoworkplaceapp') {
            this.showWorkplaceNoticeModal(this.textUtils.getErrorMessageFromError(error));
        }
        else {
            this.domUtils.showErrorModal(error);
        }
    };
    /**
     * Convenient helper to validate a browser SSO login.
     *
     * @param url URL received, to be validated.
     * @return Promise resolved on success.
     */
    CoreLoginHelperProvider.prototype.validateBrowserSSOLogin = function (url) {
        var _this = this;
        // Split signature:::token
        var params = url.split(':::');
        return this.configProvider.get(CoreConstants.LOGIN_LAUNCH_DATA).then(function (data) {
            data = _this.textUtils.parseJSON(data, null);
            if (data === null) {
                return Promise.reject(null);
            }
            var passport = data.passport;
            var launchSiteURL = data.siteUrl;
            // Reset temporary values.
            _this.configProvider.delete(CoreConstants.LOGIN_LAUNCH_DATA);
            // Validate the signature.
            // We need to check both http and https.
            var signature = Md5.hashAsciiStr(launchSiteURL + passport);
            if (signature != params[0]) {
                if (launchSiteURL.indexOf('https://') != -1) {
                    launchSiteURL = launchSiteURL.replace('https://', 'http://');
                }
                else {
                    launchSiteURL = launchSiteURL.replace('http://', 'https://');
                }
                signature = Md5.hashAsciiStr(launchSiteURL + passport);
            }
            if (signature == params[0]) {
                _this.logger.debug('Signature validated');
                return {
                    siteUrl: launchSiteURL,
                    token: params[1],
                    privateToken: params[2],
                    pageName: data.pageName,
                    pageParams: data.pageParams,
                    ssoUrlParams: data.ssoUrlParams,
                };
            }
            else {
                _this.logger.debug('Invalid signature in the URL request yours: ' + params[0] + ' mine: '
                    + signature + ' for passport ' + passport);
                return Promise.reject(_this.translate.instant('core.unexpectederror'));
            }
        });
    };
    CoreLoginHelperProvider.OPEN_COURSE = 'open_course';
    CoreLoginHelperProvider.ONBOARDING_DONE = 'onboarding_done';
    CoreLoginHelperProvider.FAQ_URL_IMAGE_HTML = '<img src="assets/img/login/faq_url.png" role="presentation">';
    CoreLoginHelperProvider.FAQ_QRCODE_IMAGE_HTML = '<img src="assets/img/login/faq_qrcode.png" role="presentation">';
    CoreLoginHelperProvider = CoreLoginHelperProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            CoreSitesProvider,
            CoreDomUtilsProvider,
            CoreWSProvider,
            TranslateService,
            CoreTextUtilsProvider,
            CoreEventsProvider,
            CoreUtilsProvider,
            CoreUrlUtilsProvider,
            CoreConfigProvider,
            CoreInitDelegate,
            CoreSitePluginsProvider,
            Location,
            CoreCourseProvider])
    ], CoreLoginHelperProvider);
    return CoreLoginHelperProvider;
    var CoreLoginHelperProvider_1;
}());
export { CoreLoginHelperProvider };
var CoreLoginHelper = /** @class */ (function (_super) {
    __extends(CoreLoginHelper, _super);
    function CoreLoginHelper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreLoginHelper;
}(makeSingleton(CoreLoginHelperProvider)));
export { CoreLoginHelper };
//# sourceMappingURL=helper.js.map