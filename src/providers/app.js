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
import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Platform, App, MenuController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { CoreDbProvider } from './db';
import { CoreLoggerProvider } from './logger';
import { CoreEventsProvider } from './events';
import { CoreConfigConstants } from '../configconstants';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Factory to provide some global functionalities, like access to the global app database.
 * @description
 * Each service or component should be responsible of creating their own database tables. Example:
 *
 * constructor(appProvider: CoreAppProvider) {
 *     this.appDB = appProvider.getDB();
 *     this.appDB.createTableFromSchema(this.tableSchema);
 * }
 */
var CoreAppProvider = /** @class */ (function () {
    function CoreAppProvider(dbProvider, platform, keyboard, appCtrl, network, logger, events, zone, menuCtrl, statusBar, appRef) {
        var _this = this;
        this.platform = platform;
        this.keyboard = keyboard;
        this.appCtrl = appCtrl;
        this.network = network;
        this.events = events;
        this.menuCtrl = menuCtrl;
        this.statusBar = statusBar;
        this.DBNAME = 'MoodleMobile';
        this.isKeyboardShown = false;
        this._isKeyboardOpening = false;
        this._isKeyboardClosing = false;
        this.backActions = [];
        this.mainMenuId = 0;
        this.forceOffline = false;
        this.SCHEMA_VERSIONS_TABLE = 'schema_versions';
        this.versionsTableSchema = {
            name: this.SCHEMA_VERSIONS_TABLE,
            columns: [
                {
                    name: 'name',
                    type: 'TEXT',
                    primaryKey: true,
                },
                {
                    name: 'version',
                    type: 'INTEGER',
                },
            ],
        };
        this.logger = logger.getInstance('CoreAppProvider');
        this.db = dbProvider.getDB(this.DBNAME);
        // Create the schema versions table.
        this.createVersionsTableReady = this.db.createTableFromSchema(this.versionsTableSchema);
        this.keyboard.onKeyboardShow().subscribe(function (data) {
            // Execute the callback in the Angular zone, so change detection doesn't stop working.
            zone.run(function () {
                document.body.classList.add('keyboard-is-open');
                _this.setKeyboardShown(true);
                // Error on iOS calculating size.
                // More info: https://github.com/ionic-team/ionic-plugin-keyboard/issues/276 .
                events.trigger(CoreEventsProvider.KEYBOARD_CHANGE, data.keyboardHeight);
            });
        });
        this.keyboard.onKeyboardHide().subscribe(function (data) {
            // Execute the callback in the Angular zone, so change detection doesn't stop working.
            zone.run(function () {
                document.body.classList.remove('keyboard-is-open');
                _this.setKeyboardShown(false);
                events.trigger(CoreEventsProvider.KEYBOARD_CHANGE, 0);
            });
        });
        this.keyboard.onKeyboardWillShow().subscribe(function (data) {
            // Execute the callback in the Angular zone, so change detection doesn't stop working.
            zone.run(function () {
                _this._isKeyboardOpening = true;
                _this._isKeyboardClosing = false;
            });
        });
        this.keyboard.onKeyboardWillHide().subscribe(function (data) {
            // Execute the callback in the Angular zone, so change detection doesn't stop working.
            zone.run(function () {
                _this._isKeyboardOpening = false;
                _this._isKeyboardClosing = true;
            });
        });
        this.platform.registerBackButtonAction(function () {
            _this.backButtonAction();
        }, 100);
        // Export the app provider and appRef to control the application in Behat tests.
        if (CoreAppProvider_1.isAutomated()) {
            window.appProvider = this;
            window.appRef = appRef;
        }
    }
    CoreAppProvider_1 = CoreAppProvider;
    /**
     * Check if the browser supports mediaDevices.getUserMedia.
     *
     * @return Whether the function is supported.
     */
    CoreAppProvider.prototype.canGetUserMedia = function () {
        return !!(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    };
    /**
     * Check if the browser supports MediaRecorder.
     *
     * @return Whether the function is supported.
     */
    CoreAppProvider.prototype.canRecordMedia = function () {
        return !!window.MediaRecorder;
    };
    /**
     * Closes the keyboard.
     */
    CoreAppProvider.prototype.closeKeyboard = function () {
        if (this.isMobile()) {
            this.keyboard.hide();
        }
    };
    /**
     * Install and upgrade a certain schema.
     *
     * @param schema The schema to create.
     * @return Promise resolved when done.
     */
    CoreAppProvider.prototype.createTablesFromSchema = function (schema) {
        return __awaiter(this, void 0, void 0, function () {
            var oldVersion, entry, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Apply schema to app DB: " + schema.name);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // Wait for the schema versions table to be created.
                        return [4 /*yield*/, this.createVersionsTableReady];
                    case 2:
                        // Wait for the schema versions table to be created.
                        _a.sent();
                        return [4 /*yield*/, this.db.getRecord(this.SCHEMA_VERSIONS_TABLE, { name: schema.name })];
                    case 3:
                        entry = _a.sent();
                        oldVersion = entry.version;
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        // No installed version yet.
                        oldVersion = 0;
                        return [3 /*break*/, 5];
                    case 5:
                        if (oldVersion >= schema.version) {
                            // Version already installed, nothing else to do.
                            return [2 /*return*/];
                        }
                        this.logger.debug("Migrating schema '" + schema.name + "' of app DB from version " + oldVersion + " to " + schema.version);
                        if (!schema.tables) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.db.createTablesFromSchema(schema.tables)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!schema.migrate) return [3 /*break*/, 9];
                        return [4 /*yield*/, schema.migrate(this.db, oldVersion)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: 
                    // Set installed version.
                    return [4 /*yield*/, this.db.insertRecord(this.SCHEMA_VERSIONS_TABLE, { name: schema.name, version: schema.version })];
                    case 10:
                        // Set installed version.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the application global database.
     *
     * @return App's DB.
     */
    CoreAppProvider.prototype.getDB = function () {
        return this.db;
    };
    /**
     * Get an ID for a main menu.
     *
     * @return Main menu ID.
     */
    CoreAppProvider.prototype.getMainMenuId = function () {
        return this.mainMenuId++;
    };
    /**
     * Get the app's root NavController.
     *
     * @return Root NavController.
     */
    CoreAppProvider.prototype.getRootNavController = function () {
        // Function getRootNav is deprecated. Get the first root nav, there should always be one.
        return this.appCtrl.getRootNavs()[0];
    };
    /**
     * Get app store URL.
     *
     * @param  storesConfig Config params to send the user to the right place.
     * @return Store URL.
     */
    CoreAppProvider.prototype.getAppStoreUrl = function (storesConfig) {
        if (this.isMac() && storesConfig.mac) {
            return 'itms-apps://itunes.apple.com/app/' + storesConfig.mac;
        }
        if (this.isWindows() && storesConfig.windows) {
            return 'https://www.microsoft.com/p/' + storesConfig.windows;
        }
        if (this.isLinux() && storesConfig.linux) {
            return storesConfig.linux;
        }
        if (this.isDesktop() && storesConfig.desktop) {
            return storesConfig.desktop;
        }
        if (this.isIOS() && storesConfig.ios) {
            return 'itms-apps://itunes.apple.com/app/' + storesConfig.ios;
        }
        if (this.isAndroid() && storesConfig.android) {
            return 'market://details?id=' + storesConfig.android;
        }
        if (this.isMobile() && storesConfig.mobile) {
            return storesConfig.mobile;
        }
        return storesConfig.default || null;
    };
    /**
     * Returns whether the user agent is controlled by automation. I.e. Behat testing.
     *
     * @return True if the user agent is controlled by automation, false otherwise.
     */
    CoreAppProvider.isAutomated = function () {
        return !!navigator.webdriver;
    };
    /**
     * Checks if the app is running in a 64 bits desktop environment (not browser).
     *
     * @return Whether the app is running in a 64 bits desktop environment (not browser).
     */
    CoreAppProvider.prototype.is64Bits = function () {
        var process = window.process;
        return this.isDesktop() && process.arch == 'x64';
    };
    /**
     * Checks if the app is running in an Android mobile or tablet device.
     *
     * @return Whether the app is running in an Android mobile or tablet device.
     */
    CoreAppProvider.prototype.isAndroid = function () {
        return this.isMobile() && this.platform.is('android');
    };
    /**
     * Checks if the app is running in a desktop environment (not browser).
     *
     * @return Whether the app is running in a desktop environment (not browser).
     */
    CoreAppProvider.prototype.isDesktop = function () {
        var process = window.process;
        return !!(process && process.versions && typeof process.versions.electron != 'undefined');
    };
    /**
     * Checks if the app is running in an iOS mobile or tablet device.
     *
     * @return Whether the app is running in an iOS mobile or tablet device.
     */
    CoreAppProvider.prototype.isIOS = function () {
        return this.isMobile() && !this.platform.is('android');
    };
    /**
     * Check if the keyboard is closing.
     *
     * @return Whether keyboard is closing (animating).
     */
    CoreAppProvider.prototype.isKeyboardClosing = function () {
        return this._isKeyboardClosing;
    };
    /**
     * Check if the keyboard is being opened.
     *
     * @return Whether keyboard is opening (animating).
     */
    CoreAppProvider.prototype.isKeyboardOpening = function () {
        return this._isKeyboardOpening;
    };
    /**
     * Check if the keyboard is visible.
     *
     * @return Whether keyboard is visible.
     */
    CoreAppProvider.prototype.isKeyboardVisible = function () {
        return this.isKeyboardShown;
    };
    /**
     * Check if the app is running in a Linux environment.
     *
     * @return Whether it's running in a Linux environment.
     */
    CoreAppProvider.prototype.isLinux = function () {
        if (!this.isDesktop()) {
            return false;
        }
        try {
            return require('os').platform().indexOf('linux') === 0;
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Check if the app is running in a Mac OS environment.
     *
     * @return Whether it's running in a Mac OS environment.
     */
    CoreAppProvider.prototype.isMac = function () {
        if (!this.isDesktop()) {
            return false;
        }
        try {
            return require('os').platform().indexOf('darwin') === 0;
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Check if the main menu is open.
     *
     * @return Whether the main menu is open.
     */
    CoreAppProvider.prototype.isMainMenuOpen = function () {
        return typeof this.mainMenuOpen != 'undefined';
    };
    /**
     * Checks if the app is running in a mobile or tablet device (Cordova).
     *
     * @return Whether the app is running in a mobile or tablet device.
     */
    CoreAppProvider.prototype.isMobile = function () {
        return this.platform.is('cordova');
    };
    /**
     * Checks if the current window is wider than a mobile.
     *
     * @return Whether the app the current window is wider than a mobile.
     */
    CoreAppProvider.prototype.isWide = function () {
        return this.platform.width() > 768;
    };
    /**
     * Returns whether we are online.
     *
     * @return Whether the app is online.
     */
    CoreAppProvider.prototype.isOnline = function () {
        if (this.forceOffline) {
            return false;
        }
        var online = this.network.type !== null && this.network.type != Connection.NONE && this.network.type != Connection.UNKNOWN;
        // Double check we are not online because we cannot rely 100% in Cordova APIs. Also, check it in browser.
        if (!online && navigator.onLine) {
            online = true;
        }
        return online;
    };
    /**
     * Check if device uses a limited connection.
     *
     * @return Whether the device uses a limited connection.
     */
    CoreAppProvider.prototype.isNetworkAccessLimited = function () {
        var type = this.network.type;
        if (type === null) {
            // Plugin not defined, probably in browser.
            return false;
        }
        var limited = [Connection.CELL_2G, Connection.CELL_3G, Connection.CELL_4G, Connection.CELL];
        return limited.indexOf(type) > -1;
    };
    /**
     * Check if device uses a wifi connection.
     *
     * @return Whether the device uses a wifi connection.
     */
    CoreAppProvider.prototype.isWifi = function () {
        return this.isOnline() && !this.isNetworkAccessLimited();
    };
    /**
     * Check if the app is running in a Windows environment.
     *
     * @return Whether it's running in a Windows environment.
     */
    CoreAppProvider.prototype.isWindows = function () {
        if (!this.isDesktop()) {
            return false;
        }
        try {
            return require('os').platform().indexOf('win') === 0;
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Open the keyboard.
     */
    CoreAppProvider.prototype.openKeyboard = function () {
        // Open keyboard is not supported in desktop and in iOS.
        if (this.isAndroid()) {
            this.keyboard.show();
        }
    };
    /**
     * Set keyboard shown or hidden.
     *
     * @param Whether the keyboard is shown or hidden.
     */
    CoreAppProvider.prototype.setKeyboardShown = function (shown) {
        this.isKeyboardShown = shown;
        this._isKeyboardOpening = false;
        this._isKeyboardClosing = false;
    };
    /**
     * Set a main menu as open or not.
     *
     * @param id Main menu ID.
     * @param open Whether it's open or not.
     */
    CoreAppProvider.prototype.setMainMenuOpen = function (id, open) {
        if (open) {
            this.mainMenuOpen = id;
            this.events.trigger(CoreEventsProvider.MAIN_MENU_OPEN);
        }
        else if (this.mainMenuOpen == id) {
            delete this.mainMenuOpen;
        }
    };
    /**
     * Start an SSO authentication process.
     * Please notice that this function should be called when the app receives the new token from the browser,
     * NOT when the browser is opened.
     */
    CoreAppProvider.prototype.startSSOAuthentication = function () {
        var _this = this;
        var cancelTimeout, resolvePromise;
        this.ssoAuthenticationPromise = new Promise(function (resolve, reject) {
            resolvePromise = resolve;
            // Resolve it automatically after 10 seconds (it should never take that long).
            cancelTimeout = setTimeout(function () {
                _this.finishSSOAuthentication();
            }, 10000);
        });
        // Store the resolve function in the promise itself.
        this.ssoAuthenticationPromise.resolve = resolvePromise;
        // If the promise is resolved because finishSSOAuthentication is called, stop the cancel promise.
        this.ssoAuthenticationPromise.then(function () {
            clearTimeout(cancelTimeout);
        });
    };
    /**
     * Finish an SSO authentication process.
     */
    CoreAppProvider.prototype.finishSSOAuthentication = function () {
        if (this.ssoAuthenticationPromise) {
            this.ssoAuthenticationPromise.resolve && this.ssoAuthenticationPromise.resolve();
            this.ssoAuthenticationPromise = undefined;
        }
    };
    /**
     * Check if there's an ongoing SSO authentication process.
     *
     * @return Whether there's a SSO authentication ongoing.
     */
    CoreAppProvider.prototype.isSSOAuthenticationOngoing = function () {
        return !!this.ssoAuthenticationPromise;
    };
    /**
     * Returns a promise that will be resolved once SSO authentication finishes.
     *
     * @return Promise resolved once SSO authentication finishes.
     */
    CoreAppProvider.prototype.waitForSSOAuthentication = function () {
        return this.ssoAuthenticationPromise || Promise.resolve();
    };
    /**
     * Wait until the application is resumed.
     *
     * @param timeout Maximum time to wait, use null to wait forever.
     */
    CoreAppProvider.prototype.waitForResume = function (timeout) {
        if (timeout === void 0) { timeout = null; }
        return __awaiter(this, void 0, void 0, function () {
            var resolve, resumeSubscription, timeoutId, promise, stopWaiting;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = new Promise(function (r) { return resolve = r; });
                        stopWaiting = function () {
                            if (!resolve) {
                                return;
                            }
                            resolve();
                            resumeSubscription.unsubscribe();
                            timeoutId && clearTimeout(timeoutId);
                            resolve = null;
                        };
                        resumeSubscription = this.platform.resume.subscribe(stopWaiting);
                        timeoutId = timeout ? setTimeout(stopWaiting, timeout) : false;
                        return [4 /*yield*/, promise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieve redirect data.
     *
     * @return Object with siteid, state, params and timemodified.
     */
    CoreAppProvider.prototype.getRedirect = function () {
        if (localStorage && localStorage.getItem) {
            try {
                var data = {
                    siteId: localStorage.getItem('CoreRedirectSiteId'),
                    page: localStorage.getItem('CoreRedirectState'),
                    params: localStorage.getItem('CoreRedirectParams'),
                    timemodified: parseInt(localStorage.getItem('CoreRedirectTime'), 10)
                };
                if (data.params) {
                    data.params = JSON.parse(data.params);
                }
                return data;
            }
            catch (ex) {
                this.logger.error('Error loading redirect data:', ex);
            }
        }
        return {};
    };
    /**
     * Store redirect params.
     *
     * @param siteId Site ID.
     * @param page Page to go.
     * @param params Page params.
     */
    CoreAppProvider.prototype.storeRedirect = function (siteId, page, params) {
        if (localStorage && localStorage.setItem) {
            try {
                localStorage.setItem('CoreRedirectSiteId', siteId);
                localStorage.setItem('CoreRedirectState', page);
                localStorage.setItem('CoreRedirectParams', JSON.stringify(params));
                localStorage.setItem('CoreRedirectTime', String(Date.now()));
            }
            catch (ex) {
                // Ignore errors.
            }
        }
    };
    /**
     * Implement the backbutton actions pile.
     */
    CoreAppProvider.prototype.backButtonAction = function () {
        var x = 0;
        for (; x < this.backActions.length; x++) {
            if (this.backActions[x].priority < 1000) {
                break;
            }
            // Stop in the first action taken.
            if (this.backActions[x].fn()) {
                return;
            }
        }
        // Close open modals if any.
        if (this.menuCtrl && this.menuCtrl.isOpen()) {
            this.menuCtrl.close();
            return;
        }
        // Remaining actions will have priority less than 1000.
        for (; x < this.backActions.length; x++) {
            if (this.backActions[x].priority < 500) {
                break;
            }
            // Stop in the first action taken.
            if (this.backActions[x].fn()) {
                return;
            }
        }
        // Nothing found, go back.
        var navPromise = this.appCtrl.navPop();
        if (navPromise) {
            return;
        }
        // No views to go back to.
        // Remaining actions will have priority less than 500.
        for (; x < this.backActions.length; x++) {
            // Stop in the first action taken.
            if (this.backActions[x].fn()) {
                return;
            }
        }
        // Ionic will decide (exit the app).
        this.appCtrl.goBack();
    };
    /**
     * The back button event is triggered when the user presses the native
     * platform's back button, also referred to as the "hardware" back button.
     * This event is only used within Cordova apps running on Android and
     * Windows platforms. This event is not fired on iOS since iOS doesn't come
     * with a hardware back button in the same sense an Android or Windows device
     * does.
     *
     * Registering a hardware back button action and setting a priority allows
     * apps to control which action should be called when the hardware back
     * button is pressed. This method decides which of the registered back button
     * actions has the highest priority and should be called.
     *
     * @param fn Called when the back button is pressed,
     *           if this registered action has the highest priority.
     * @param priority Set the priority for this action. All actions sorted by priority will be executed since one of
     *                 them returns true.
     *                 * Priorities higher or equal than 1000 will go before closing modals
     *                 * Priorities lower than 500 will only be executed if you are in the first state of the app (before exit).
     * @return A function that, when called, will unregister
     *         the back button action.
     */
    CoreAppProvider.prototype.registerBackButtonAction = function (fn, priority) {
        var _this = this;
        if (priority === void 0) { priority = 0; }
        var action = { fn: fn, priority: priority };
        this.backActions.push(action);
        this.backActions.sort(function (a, b) {
            return b.priority - a.priority;
        });
        return function () {
            var index = _this.backActions.indexOf(action);
            return index >= 0 && !!_this.backActions.splice(index, 1);
        };
    };
    /**
     * Set StatusBar color depending on platform.
     */
    CoreAppProvider.prototype.setStatusBarColor = function () {
        if (typeof CoreConfigConstants.statusbarbgios == 'string' && this.isIOS()) {
            // IOS Status bar properties.
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString(CoreConfigConstants.statusbarbgios);
            CoreConfigConstants.statusbarlighttextios ? this.statusBar.styleLightContent() : this.statusBar.styleDefault();
        }
        else if (typeof CoreConfigConstants.statusbarbgandroid == 'string' && this.isAndroid()) {
            // Android Status bar properties.
            this.statusBar.backgroundColorByHexString(CoreConfigConstants.statusbarbgandroid);
            CoreConfigConstants.statusbarlighttextandroid ? this.statusBar.styleLightContent() : this.statusBar.styleDefault();
        }
        else if (typeof CoreConfigConstants.statusbarbg == 'string') {
            // Generic Status bar properties.
            this.isIOS() && this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString(CoreConfigConstants.statusbarbg);
            CoreConfigConstants.statusbarlighttext ? this.statusBar.styleLightContent() : this.statusBar.styleDefault();
        }
        else {
            // Default Status bar properties.
            this.isAndroid() ? this.statusBar.styleLightContent() : this.statusBar.styleDefault();
        }
    };
    /**
     * Reset StatusBar color if any was set.
     */
    CoreAppProvider.prototype.resetStatusBarColor = function () {
        if (typeof CoreConfigConstants.statusbarbgremotetheme == 'string' &&
            ((typeof CoreConfigConstants.statusbarbgios == 'string' && this.isIOS()) ||
                (typeof CoreConfigConstants.statusbarbgandroid == 'string' && this.isAndroid()) ||
                typeof CoreConfigConstants.statusbarbg == 'string')) {
            // If the status bar has been overriden and there's a fallback color for remote themes, use it now.
            this.isIOS() && this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString(CoreConfigConstants.statusbarbgremotetheme);
            CoreConfigConstants.statusbarlighttextremotetheme ?
                this.statusBar.styleLightContent() : this.statusBar.styleDefault();
        }
    };
    /**
     * Set value of forceOffline flag. If true, the app will think the device is offline.
     *
     * @param value Value to set.
     */
    CoreAppProvider.prototype.setForceOffline = function (value) {
        this.forceOffline = !!value;
    };
    CoreAppProvider = CoreAppProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreDbProvider,
            Platform,
            Keyboard,
            App,
            Network,
            CoreLoggerProvider,
            CoreEventsProvider,
            NgZone,
            MenuController,
            StatusBar,
            ApplicationRef])
    ], CoreAppProvider);
    return CoreAppProvider;
    var CoreAppProvider_1;
}());
export { CoreAppProvider };
var CoreApp = /** @class */ (function (_super) {
    __extends(CoreApp, _super);
    function CoreApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreApp;
}(makeSingleton(CoreAppProvider)));
export { CoreApp };
//# sourceMappingURL=app.js.map