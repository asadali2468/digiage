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
import { Component, NgZone } from '@angular/core';
import { Config, Platform, IonicApp } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { CoreApp, CoreAppProvider } from '@providers/app';
import { CoreEventsProvider } from '@providers/events';
import { CoreLangProvider } from '@providers/lang';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreUrlUtilsProvider } from '@providers/utils/url';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CoreCustomURLSchemesProvider } from '@providers/urlschemes';
import { CoreLoginHelperProvider } from '@core/login/providers/helper';
import { Keyboard } from '@ionic-native/keyboard';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { CoreLoginSitesPage } from '@core/login/pages/sites/sites';
import { CoreWindow } from '@singletons/window';
import { Device } from '@ionic-native/device';
var MoodleMobileApp = /** @class */ (function () {
    function MoodleMobileApp(platform, logger, keyboard, config, device, app, eventsProvider, loginHelper, zone, appProvider, langProvider, sitesProvider, screenOrientation, urlSchemesProvider, utils, urlUtils, network) {
        var _this = this;
        this.platform = platform;
        this.app = app;
        this.eventsProvider = eventsProvider;
        this.loginHelper = loginHelper;
        this.zone = zone;
        this.appProvider = appProvider;
        this.langProvider = langProvider;
        this.sitesProvider = sitesProvider;
        this.screenOrientation = screenOrientation;
        this.urlSchemesProvider = urlSchemesProvider;
        this.utils = utils;
        this.urlUtils = urlUtils;
        this.network = network;
        // Use page name (string) because the page is lazy loaded (Ionic feature). That way we can load pages without importing them.
        // The downside is that each page needs to implement a ngModule.
        this.rootPage = 'CoreLoginInitPage';
        this.lastUrls = {};
        this.logger = logger.getInstance('AppComponent');
        if (this.appProvider.isIOS() && !platform.is('ios')) {
            // Solve problem with wrong detected iPadOS.
            var platforms = platform.platforms();
            var index = platforms.indexOf('core');
            if (index > -1) {
                platforms.splice(index, 1);
            }
            platforms.push('mobile');
            platforms.push('ios');
            platforms.push('ipad');
            platforms.push('tablet');
            app.setElementClass('app-root-ios', true);
            platform.ready().then(function () {
                if (device.version) {
                    var _a = device.version.split('.', 2), major = _a[0], minor = _a[1];
                    app.setElementClass('platform-ios' + major, true);
                    app.setElementClass('platform-ios' + major + '_' + minor, true);
                }
            });
            app._elementRef.nativeElement.classList.remove('app-root-md');
            var iosConfig_1 = config.getModeConfig('ios');
            config.set('mode', 'ios');
            Object.keys(iosConfig_1).forEach(function (key) {
                // Already overriden: pageTransition, do not change.
                if (key != 'pageTransition') {
                    config.set('ios', key, iosConfig_1[key]);
                }
            });
        }
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            // Set StatusBar properties.
            _this.appProvider.setStatusBarColor();
            keyboard.hideFormAccessoryBar(false);
            if (_this.appProvider.isDesktop()) {
                app.setElementClass('platform-desktop', true);
                if (_this.appProvider.isMac()) {
                    app.setElementClass('platform-mac', true);
                }
                else if (_this.appProvider.isLinux()) {
                    app.setElementClass('platform-linux', true);
                }
                else if (_this.appProvider.isWindows()) {
                    app.setElementClass('platform-windows', true);
                }
            }
            // Register back button action to allow closing modals before anything else.
            _this.appProvider.registerBackButtonAction(function () {
                return _this.closeModal();
            }, 2000);
        });
    }
    /**
     * Component being initialized.
     */
    MoodleMobileApp.prototype.ngOnInit = function () {
        var _this = this;
        this.eventsProvider.on(CoreEventsProvider.LOGOUT, function () {
            // Go to sites page when user is logged out.
            // Due to DeepLinker, we need to use the ViewCtrl instead of name.
            // Otherwise some pages are re-created when they shouldn't.
            _this.appProvider.getRootNavController().setRoot(CoreLoginSitesPage);
            // Unload lang custom strings.
            _this.langProvider.clearCustomStrings();
            // Remove version classes from body.
            _this.removeVersionClass();
        });
        // Listen for session expired events.
        this.eventsProvider.on(CoreEventsProvider.SESSION_EXPIRED, function (data) {
            _this.loginHelper.sessionExpired(data);
        });
        // Listen for passwordchange and usernotfullysetup events to open InAppBrowser.
        this.eventsProvider.on(CoreEventsProvider.PASSWORD_CHANGE_FORCED, function (data) {
            _this.loginHelper.passwordChangeForced(data.siteId);
        });
        this.eventsProvider.on(CoreEventsProvider.USER_NOT_FULLY_SETUP, function (data) {
            _this.loginHelper.openInAppForEdit(data.siteId, '/user/edit.php', 'core.usernotfullysetup');
        });
        // Listen for sitepolicynotagreed event to accept the site policy.
        this.eventsProvider.on(CoreEventsProvider.SITE_POLICY_NOT_AGREED, function (data) {
            _this.loginHelper.sitePolicyNotAgreed(data.siteId);
        });
        this.platform.ready().then(function () {
            // Refresh online status when changes.
            _this.network.onchange().subscribe(function () {
                // Execute the callback in the Angular zone, so change detection doesn't stop working.
                _this.zone.run(function () {
                    var isOnline = _this.appProvider.isOnline(), hadOfflineMessage = document.body.classList.contains('core-offline');
                    document.body.classList.toggle('core-offline', !isOnline);
                    if (isOnline && hadOfflineMessage) {
                        document.body.classList.add('core-online');
                        setTimeout(function () {
                            document.body.classList.remove('core-online');
                        }, 3000);
                    }
                    else if (!isOnline) {
                        document.body.classList.remove('core-online');
                    }
                });
            });
        });
        // Check URLs loaded in any InAppBrowser.
        this.eventsProvider.on(CoreEventsProvider.IAB_LOAD_START, function (event) {
            // URLs with a custom scheme can be prefixed with "http://" or "https://", we need to remove this.
            var url = event.url.replace(/^https?:\/\//, '');
            if (_this.urlSchemesProvider.isCustomURL(url)) {
                // Close the browser if it's a valid SSO URL.
                _this.urlSchemesProvider.handleCustomURL(url).catch(function (error) {
                    _this.urlSchemesProvider.treatHandleCustomURLError(error);
                });
                _this.utils.closeInAppBrowser(false);
            }
            else if (CoreApp.instance.isAndroid()) {
                // Check if the URL has a custom URL scheme. In Android they need to be opened manually.
                var urlScheme = _this.urlUtils.getUrlProtocol(url);
                if (urlScheme && urlScheme !== 'file' && urlScheme !== 'cdvfile') {
                    // Open in browser should launch the right app if found and do nothing if not found.
                    _this.utils.openInBrowser(url);
                    // At this point the InAppBrowser is showing a "Webpage not available" error message.
                    // Try to navigate to last loaded URL so this error message isn't found.
                    if (_this.lastInAppUrl) {
                        _this.utils.openInApp(_this.lastInAppUrl);
                    }
                    else {
                        // No last URL loaded, close the InAppBrowser.
                        _this.utils.closeInAppBrowser(false);
                    }
                }
                else {
                    _this.lastInAppUrl = url;
                }
            }
        });
        // Check InAppBrowser closed.
        this.eventsProvider.on(CoreEventsProvider.IAB_EXIT, function () {
            _this.loginHelper.waitingForBrowser = false;
            _this.lastInAppUrl = '';
            _this.loginHelper.checkLogout();
        });
        this.platform.resume.subscribe(function () {
            // Wait a second before setting it to false since in iOS there could be some frozen WS calls.
            setTimeout(function () {
                _this.loginHelper.waitingForBrowser = false;
                _this.loginHelper.checkLogout();
            }, 1000);
        });
        // Handle app launched with a certain URL (custom URL scheme).
        window.handleOpenURL = function (url) {
            // Execute the callback in the Angular zone, so change detection doesn't stop working.
            _this.zone.run(function () {
                // First check that the URL hasn't been treated a few seconds ago. Sometimes this function is called more than once.
                if (_this.lastUrls[url] && Date.now() - _this.lastUrls[url] < 3000) {
                    // Function called more than once, stop.
                    return;
                }
                if (!_this.urlSchemesProvider.isCustomURL(url)) {
                    // Not a custom URL, ignore.
                    return;
                }
                _this.logger.debug('App launched by URL ', url);
                _this.lastUrls[url] = Date.now();
                _this.eventsProvider.trigger(CoreEventsProvider.APP_LAUNCHED_URL, url);
                _this.urlSchemesProvider.handleCustomURL(url).catch(function (error) {
                    _this.urlSchemesProvider.treatHandleCustomURLError(error);
                });
            });
        };
        // "Expose" CoreWindow.open.
        window.openWindowSafely = function (url, name, windowFeatures) {
            CoreWindow.open(url, name);
        };
        // Load custom lang strings. This cannot be done inside the lang provider because it causes circular dependencies.
        var loadCustomStrings = function () {
            var currentSite = _this.sitesProvider.getCurrentSite(), customStrings = currentSite && currentSite.getStoredConfig('tool_mobile_customlangstrings');
            if (typeof customStrings != 'undefined') {
                _this.langProvider.loadCustomStrings(customStrings);
            }
        };
        this.eventsProvider.on(CoreEventsProvider.LOGIN, function (data) {
            if (data.siteId) {
                _this.sitesProvider.getSite(data.siteId).then(function (site) {
                    var info = site.getInfo();
                    if (info) {
                        // Add version classes to body.
                        _this.removeVersionClass();
                        _this.addVersionClass(_this.sitesProvider.getReleaseNumber(info.release || ''));
                    }
                });
            }
            loadCustomStrings();
        });
        this.eventsProvider.on(CoreEventsProvider.SITE_UPDATED, function (data) {
            if (data.siteId == _this.sitesProvider.getCurrentSiteId()) {
                loadCustomStrings();
                // Add version classes to body.
                _this.removeVersionClass();
                _this.addVersionClass(_this.sitesProvider.getReleaseNumber(data.release || ''));
            }
        });
        this.eventsProvider.on(CoreEventsProvider.SITE_ADDED, function (data) {
            if (data.siteId == _this.sitesProvider.getCurrentSiteId()) {
                loadCustomStrings();
                // Add version classes to body.
                _this.removeVersionClass();
                _this.addVersionClass(_this.sitesProvider.getReleaseNumber(data.release || ''));
            }
        });
        // Pause Youtube videos in Android when app is put in background or screen is locked.
        this.platform.pause.subscribe(function () {
            if (!CoreApp.instance.isAndroid()) {
                return;
            }
            var pauseVideos = function (window) {
                // Search videos in iframes recursively.
                for (var i = 0; i < window.length; i++) {
                    pauseVideos(window[i]);
                }
                if (window.location.hostname.match(/^www\.youtube(-nocookie)?\.com$/)) {
                    // Embedded Youtube video, pause it.
                    var videos = window.document.querySelectorAll('video');
                    for (var i = 0; i < videos.length; i++) {
                        videos[i].pause();
                    }
                }
            };
            pauseVideos(window);
        });
        // Detect orientation changes.
        this.screenOrientation.onChange().subscribe(function () {
            if (CoreApp.instance.isIOS()) {
                // Force ios to recalculate safe areas when rotating.
                // This can be erased when https://issues.apache.org/jira/browse/CB-13448 issue is solved or
                // After switching to WkWebview.
                var viewport_1 = document.querySelector('meta[name=viewport]');
                viewport_1.setAttribute('content', viewport_1.getAttribute('content').replace('viewport-fit=cover,', ''));
                setTimeout(function () {
                    viewport_1.setAttribute('content', 'viewport-fit=cover,' + viewport_1.getAttribute('content'));
                });
            }
            _this.eventsProvider.trigger(CoreEventsProvider.ORIENTATION_CHANGE);
        });
    };
    /**
     * Convenience function to add version to body classes.
     *
     * @param release Current release number of the site.
     */
    MoodleMobileApp.prototype.addVersionClass = function (release) {
        var parts = release.split('.');
        parts[1] = parts[1] || '0';
        parts[2] = parts[2] || '0';
        document.body.classList.add('version-' + parts[0], 'version-' + parts[0] + '-' + parts[1], 'version-' + parts[0] + '-' + parts[1] + '-' + parts[2]);
    };
    /**
     * Convenience function to remove all version classes form body.
     */
    MoodleMobileApp.prototype.removeVersionClass = function () {
        var remove = [];
        Array.from(document.body.classList).forEach(function (tempClass) {
            if (tempClass.substring(0, 8) == 'version-') {
                remove.push(tempClass);
            }
        });
        remove.forEach(function (tempClass) {
            document.body.classList.remove(tempClass);
        });
    };
    /**
     * Close one modal if any.
     *
     * @return True if one modal was present.
     */
    MoodleMobileApp.prototype.closeModal = function () {
        // Following function is hidden in Ionic Code, however there's no solution for that.
        var portal = this.app._getActivePortal();
        if (portal) {
            portal.pop();
            return true;
        }
        return false;
    };
    MoodleMobileApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform,
            CoreLoggerProvider,
            Keyboard,
            Config,
            Device,
            IonicApp,
            CoreEventsProvider,
            CoreLoginHelperProvider,
            NgZone,
            CoreAppProvider,
            CoreLangProvider,
            CoreSitesProvider,
            ScreenOrientation,
            CoreCustomURLSchemesProvider,
            CoreUtilsProvider,
            CoreUrlUtilsProvider,
            Network])
    ], MoodleMobileApp);
    return MoodleMobileApp;
}());
export { MoodleMobileApp };
//# sourceMappingURL=app.component.js.map