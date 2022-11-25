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
import { Injectable, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Badge } from '@ionic-native/badge';
import { Push } from '@ionic-native/push';
import { Device } from '@ionic-native/device';
import { TranslateService } from '@ngx-translate/core';
import { CoreApp, CoreAppProvider } from '@providers/app';
import { CoreEvents, CoreEventsProvider } from '@providers/events';
import { CoreInitDelegate } from '@providers/init';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreSitesFactoryProvider } from '@providers/sites-factory';
import { CorePushNotificationsDelegate } from './delegate';
import { CoreLocalNotificationsProvider } from '@providers/local-notifications';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CoreTextUtilsProvider } from '@providers/utils/text';
import { CoreConfigProvider } from '@providers/config';
import { CoreConstants } from '@core/constants';
import { CoreConfigConstants } from '../../../configconstants';
/**
 * Service to handle push notifications.
 */
var CorePushNotificationsProvider = /** @class */ (function () {
    function CorePushNotificationsProvider(logger, initDelegate, pushNotificationsDelegate, sitesProvider, badge, localNotificationsProvider, utils, textUtils, push, configProvider, device, zone, translate, platform, appProvider, sitesFactory) {
        var _this = this;
        this.initDelegate = initDelegate;
        this.pushNotificationsDelegate = pushNotificationsDelegate;
        this.sitesProvider = sitesProvider;
        this.badge = badge;
        this.localNotificationsProvider = localNotificationsProvider;
        this.utils = utils;
        this.textUtils = textUtils;
        this.push = push;
        this.configProvider = configProvider;
        this.device = device;
        this.zone = zone;
        this.translate = translate;
        this.sitesFactory = sitesFactory;
        this.appTablesSchema = {
            name: 'CorePushNotificationsProvider',
            version: 1,
            tables: [
                {
                    name: CorePushNotificationsProvider_1.BADGE_TABLE,
                    columns: [
                        {
                            name: 'siteid',
                            type: 'TEXT'
                        },
                        {
                            name: 'addon',
                            type: 'TEXT'
                        },
                        {
                            name: 'number',
                            type: 'INTEGER'
                        },
                    ],
                    primaryKeys: ['siteid', 'addon'],
                },
                {
                    name: CorePushNotificationsProvider_1.PENDING_UNREGISTER_TABLE,
                    columns: [
                        {
                            name: 'siteid',
                            type: 'TEXT',
                            primaryKey: true
                        },
                        {
                            name: 'siteurl',
                            type: 'TEXT'
                        },
                        {
                            name: 'token',
                            type: 'TEXT'
                        },
                        {
                            name: 'info',
                            type: 'TEXT'
                        },
                    ],
                },
            ],
        };
        this.siteSchema = {
            name: 'AddonPushNotificationsProvider',
            version: 1,
            tables: [
                {
                    name: CorePushNotificationsProvider_1.REGISTERED_DEVICES_TABLE,
                    columns: [
                        {
                            name: 'appid',
                            type: 'TEXT',
                        },
                        {
                            name: 'uuid',
                            type: 'TEXT'
                        },
                        {
                            name: 'name',
                            type: 'TEXT'
                        },
                        {
                            name: 'model',
                            type: 'TEXT'
                        },
                        {
                            name: 'platform',
                            type: 'TEXT'
                        },
                        {
                            name: 'version',
                            type: 'TEXT'
                        },
                        {
                            name: 'pushid',
                            type: 'TEXT'
                        },
                    ],
                    primaryKeys: ['appid', 'uuid']
                }
            ],
        };
        this.logger = logger.getInstance('CorePushNotificationsProvider');
        this.appDB = appProvider.getDB();
        this.dbReady = appProvider.createTablesFromSchema(this.appTablesSchema).catch(function () {
            // Ignore errors.
        });
        this.sitesProvider.registerSiteSchema(this.siteSchema);
        platform.ready().then(function () {
            // Create the default channel.
            _this.createDefaultChannel();
            translate.onLangChange.subscribe(function (event) {
                // Update the channel name.
                _this.createDefaultChannel();
            });
        });
    }
    CorePushNotificationsProvider_1 = CorePushNotificationsProvider;
    /**
     * Check whether the device can be registered in Moodle to receive push notifications.
     *
     * @return Whether the device can be registered in Moodle.
     */
    CorePushNotificationsProvider.prototype.canRegisterOnMoodle = function () {
        return this.pushID && CoreApp.instance.isMobile();
    };
    /**
     * Delete all badge records for a given site.
     *
     * @param siteId Site ID.
     * @return Resolved when done.
     */
    CorePushNotificationsProvider.prototype.cleanSiteCounters = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, this.appDB.deleteRecords(CorePushNotificationsProvider_1.BADGE_TABLE, { siteid: siteId })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        this.updateAppCounter();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create the default push channel. It is used to change the name.
     *
     * @return Promise resolved when done.
     */
    CorePushNotificationsProvider.prototype.createDefaultChannel = function () {
        var _this = this;
        if (!CoreApp.instance.isAndroid()) {
            return Promise.resolve();
        }
        return this.push.createChannel({
            id: 'PushPluginChannel',
            description: this.translate.instant('core.misc'),
            importance: 4
        }).catch(function (error) {
            _this.logger.error('Error changing push channel name', error);
        });
    };
    /**
     * Enable or disable Firebase analytics.
     *
     * @param enable Whether to enable or disable.
     * @return Promise resolved when done.
     */
    CorePushNotificationsProvider.prototype.enableAnalytics = function (enable) {
        var _this = this;
        var win = window; // This feature is only present in our fork of the plugin.
        if (CoreConfigConstants.enableanalytics && win.PushNotification && win.PushNotification.enableAnalytics) {
            return new Promise(function (resolve, reject) {
                win.PushNotification.enableAnalytics(resolve, function (error) {
                    _this.logger.error('Error enabling or disabling Firebase analytics', enable, error);
                    resolve();
                }, !!enable);
            });
        }
        return Promise.resolve();
    };
    /**
     * Returns options for push notifications based on device.
     *
     * @return Promise with the push options resolved when done.
     */
    CorePushNotificationsProvider.prototype.getOptions = function () {
        var promise;
        if (this.localNotificationsProvider.canDisableSound()) {
            promise = this.configProvider.get(CoreConstants.SETTINGS_NOTIFICATION_SOUND, true);
        }
        else {
            promise = Promise.resolve(true);
        }
        return promise.then(function (soundEnabled) {
            return {
                android: {
                    sound: !!soundEnabled,
                    icon: 'smallicon',
                    iconColor: CoreConfigConstants.notificoncolor
                },
                ios: {
                    alert: 'true',
                    badge: true,
                    sound: !!soundEnabled
                },
                windows: {
                    sound: !!soundEnabled
                }
            };
        });
    };
    /**
     * Get the pushID for this device.
     *
     * @return Push ID.
     */
    CorePushNotificationsProvider.prototype.getPushId = function () {
        return this.pushID;
    };
    /**
     * Get data to register the device in Moodle.
     *
     * @return Data.
     */
    CorePushNotificationsProvider.prototype.getRegisterData = function () {
        return {
            appid: CoreConfigConstants.app_id,
            name: this.device.manufacturer || '',
            model: this.device.model,
            platform: this.device.platform + '-fcm',
            version: this.device.version,
            pushid: this.pushID,
            uuid: this.device.uuid
        };
    };
    /**
     * Get Sitebadge  counter from the database.
     *
     * @param siteId Site ID.
     * @return Promise resolved with the stored badge counter for the site.
     */
    CorePushNotificationsProvider.prototype.getSiteCounter = function (siteId) {
        return this.getAddonBadge(siteId);
    };
    /**
     * Log a firebase event.
     *
     * @param name Name of the event.
     * @param data Data of the event.
     * @param filter Whether to filter the data. This is useful when logging a full notification.
     * @return Promise resolved when done. This promise is never rejected.
     */
    CorePushNotificationsProvider.prototype.logEvent = function (name, data, filter) {
        var _this = this;
        var win = window; // This feature is only present in our fork of the plugin.
        if (CoreConfigConstants.enableanalytics && win.PushNotification && win.PushNotification.logEvent) {
            // Check if the analytics is enabled by the user.
            return this.configProvider.get(CoreConstants.SETTINGS_ANALYTICS_ENABLED, true).then(function (enabled) {
                if (enabled) {
                    return new Promise(function (resolve, reject) {
                        win.PushNotification.logEvent(resolve, function (error) {
                            _this.logger.error('Error logging firebase event', name, error);
                            resolve();
                        }, name, data, !!filter);
                    });
                }
            });
        }
        return Promise.resolve();
    };
    /**
     * Log a firebase view_item event.
     *
     * @param itemId The item ID.
     * @param itemName The item name.
     * @param itemCategory The item category.
     * @param wsName Name of the WS.
     * @param data Other data to pass to the event.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done. This promise is never rejected.
     */
    CorePushNotificationsProvider.prototype.logViewEvent = function (itemId, itemName, itemCategory, wsName, data, siteId) {
        data = data || {};
        // Add "moodle" to the name of all extra params.
        data = this.utils.prefixKeys(data, 'moodle');
        data['moodleaction'] = wsName;
        data['moodlesiteid'] = siteId || this.sitesProvider.getCurrentSiteId();
        if (itemId) {
            data['item_id'] = itemId;
        }
        if (itemName) {
            data['item_name'] = itemName;
        }
        if (itemCategory) {
            data['item_category'] = itemCategory;
        }
        return this.logEvent('view_item', data, false);
    };
    /**
     * Log a firebase view_item_list event.
     *
     * @param itemCategory The item category.
     * @param wsName Name of the WS.
     * @param data Other data to pass to the event.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done. This promise is never rejected.
     */
    CorePushNotificationsProvider.prototype.logViewListEvent = function (itemCategory, wsName, data, siteId) {
        data = data || {};
        // Add "moodle" to the name of all extra params.
        data = this.utils.prefixKeys(data, 'moodle');
        data['moodleaction'] = wsName;
        data['moodlesiteid'] = siteId || this.sitesProvider.getCurrentSiteId();
        if (itemCategory) {
            data['item_category'] = itemCategory;
        }
        return this.logEvent('view_item_list', data, false);
    };
    /**
     * Function called when a push notification is clicked. Redirect the user to the right state.
     *
     * @param notification Notification.
     */
    CorePushNotificationsProvider.prototype.notificationClicked = function (notification) {
        var _this = this;
        this.initDelegate.ready().then(function () {
            _this.pushNotificationsDelegate.clicked(notification);
        });
    };
    /**
     * This function is called when we receive a Notification from APNS or a message notification from GCM.
     * The app can be in foreground or background,
     * if we are in background this code is executed when we open the app clicking in the notification bar.
     *
     * @param notification Notification received.
     */
    CorePushNotificationsProvider.prototype.onMessageReceived = function (notification) {
        var _this = this;
        var data = notification ? notification.additionalData : {};
        var promise;
        if (data.site) {
            promise = this.sitesProvider.getSite(data.site);
        }
        else if (data.siteurl) {
            promise = this.sitesProvider.getSiteByUrl(data.siteurl);
        }
        else {
            // Notification not related to any site.
            promise = Promise.resolve();
        }
        promise.then(function (site) {
            data.site = site && site.getId();
            if (typeof data.customdata == 'string') {
                data.customdata = _this.textUtils.parseJSON(data.customdata, {});
            }
            if (_this.utils.isTrueOrOne(data.foreground)) {
                // If the app is in foreground when the notification is received, it's not shown. Let's show it ourselves.
                if (_this.localNotificationsProvider.isAvailable()) {
                    var localNotif = {
                        id: data.notId || 1,
                        data: data,
                        title: notification.title,
                        text: notification.message,
                        channel: 'PushPluginChannel'
                    };
                    var isAndroid = CoreApp.instance.isAndroid();
                    var extraFeatures = _this.utils.isTrueOrOne(data.extrafeatures);
                    if (extraFeatures && isAndroid && _this.utils.isFalseOrZero(data.notif)) {
                        // It's a message, use messaging style. Ionic Native doesn't specify this option.
                        localNotif.text = [
                            {
                                message: notification.message,
                                person: data.conversationtype == 2 ? data.userfromfullname : ''
                            }
                        ];
                    }
                    if (extraFeatures && isAndroid) {
                        // Use a different icon if needed.
                        localNotif.icon = notification.image;
                        // This feature isn't supported by the official plugin, we use a fork.
                        localNotif.iconType = data['image-type'];
                        localNotif.summary = data.summaryText;
                        if (data.picture) {
                            localNotif.attachments = [data.picture];
                        }
                    }
                    _this.localNotificationsProvider.schedule(localNotif, CorePushNotificationsProvider_1.COMPONENT, data.site || '', true);
                }
                // Trigger a notification received event.
                _this.initDelegate.ready().then(function () {
                    data.title = notification.title;
                    data.message = notification.message;
                    _this.pushNotificationsDelegate.received(data);
                });
            }
            else {
                // The notification was clicked.
                _this.notificationClicked(data);
            }
        });
    };
    /**
     * Unregisters a device from a certain Moodle site.
     *
     * @param site Site to unregister from.
     * @return Promise resolved when device is unregistered.
     */
    CorePushNotificationsProvider.prototype.unregisterDeviceOnMoodle = function (site) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, promises, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!site || !CoreApp.instance.isMobile()) {
                            return [2 /*return*/, Promise.reject(null)];
                        }
                        return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        this.logger.debug("Unregister device on Moodle: '" + site.id + "'");
                        data = {
                            appid: CoreConfigConstants.app_id,
                            uuid: this.device.uuid
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 7]);
                        return [4 /*yield*/, site.write('core_user_remove_user_device', data)];
                    case 3:
                        response = _a.sent();
                        if (!response || !response.removed) {
                            throw null;
                        }
                        promises = [];
                        // Remove the device from the local DB.
                        promises.push(site.getDb().deleteRecords(CorePushNotificationsProvider_1.REGISTERED_DEVICES_TABLE, this.getRegisterData()));
                        // Remove pending unregisters for this site.
                        promises.push(this.appDB.deleteRecords(CorePushNotificationsProvider_1.PENDING_UNREGISTER_TABLE, { siteid: site.id }));
                        return [2 /*return*/, Promise.all(promises).catch(function () {
                                // Ignore errors.
                            })];
                    case 4:
                        error_1 = _a.sent();
                        if (!!this.utils.isWebServiceError(error_1)) return [3 /*break*/, 6];
                        // Store the pending unregister so it's retried again later.
                        return [4 /*yield*/, this.appDB.insertRecord(CorePushNotificationsProvider_1.PENDING_UNREGISTER_TABLE, {
                                siteid: site.id,
                                siteurl: site.getURL(),
                                token: site.getToken(),
                                info: JSON.stringify(site.getInfo()),
                            })];
                    case 5:
                        // Store the pending unregister so it's retried again later.
                        _a.sent();
                        _a.label = 6;
                    case 6: throw error_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update Counter for an addon. It will update the refered siteId counter and the total badge.
     * It will return the updated addon counter.
     *
     * @param addon Registered addon name to set the badge number.
     * @param value The number to be stored.
     * @param siteId Site ID. If not defined, use current site.
     * @return Promise resolved with the stored badge counter for the addon on the site.
     */
    CorePushNotificationsProvider.prototype.updateAddonCounter = function (addon, value, siteId) {
        var _this = this;
        if (this.pushNotificationsDelegate.isCounterHandlerRegistered(addon)) {
            siteId = siteId || this.sitesProvider.getCurrentSiteId();
            return this.saveAddonBadge(value, siteId, addon).then(function () {
                return _this.updateSiteCounter(siteId).then(function () {
                    return value;
                });
            });
        }
        return Promise.resolve(0);
    };
    /**
     * Update total badge counter of the app.
     *
     * @return Promise resolved with the stored badge counter for the site.
     */
    CorePushNotificationsProvider.prototype.updateAppCounter = function () {
        var _this = this;
        return this.sitesProvider.getSitesIds().then(function (sites) {
            var promises = [];
            sites.forEach(function (siteId) {
                promises.push(_this.getAddonBadge(siteId));
            });
            return Promise.all(promises).then(function (counters) {
                var total = counters.reduce(function (previous, counter) {
                    // The app badge counter does not support strings, so parse to int before.
                    return previous + parseInt(counter, 10);
                }, 0);
                if (!CoreApp.instance.isDesktop() && !CoreApp.instance.isMobile()) {
                    // Browser doesn't have an app badge, stop.
                    return total;
                }
                // Set the app badge.
                return _this.badge.set(total).then(function () {
                    return total;
                });
            });
        });
    };
    /**
     * Update counter for a site using the stored addon data. It will update the total badge application number.
     * It will return the updated site counter.
     *
     * @param siteId Site ID.
     * @return Promise resolved with the stored badge counter for the site.
     */
    CorePushNotificationsProvider.prototype.updateSiteCounter = function (siteId) {
        var _this = this;
        var addons = this.pushNotificationsDelegate.getCounterHandlers(), promises = [];
        for (var x in addons) {
            promises.push(this.getAddonBadge(siteId, addons[x]));
        }
        return Promise.all(promises).then(function (counters) {
            var plus = false, total = counters.reduce(function (previous, counter) {
                // Check if there is a plus sign at the end of the counter.
                if (counter != parseInt(counter, 10)) {
                    plus = true;
                    counter = parseInt(counter, 10);
                }
                return previous + counter;
            }, 0);
            total = plus && total > 0 ? total + '+' : total;
            // Save the counter on site.
            return _this.saveAddonBadge(total, siteId);
        }).then(function (siteTotal) {
            return _this.updateAppCounter().then(function () {
                return siteTotal;
            });
        });
    };
    /**
     * Register a device in Apple APNS or Google GCM.
     *
     * @return Promise resolved when the device is registered.
     */
    CorePushNotificationsProvider.prototype.registerDevice = function () {
        var _this = this;
        try {
            // Check if sound is enabled for notifications.
            return this.getOptions().then(function (options) {
                var pushObject = _this.push.init(options);
                pushObject.on('notification').subscribe(function (notification) {
                    // Execute the callback in the Angular zone, so change detection doesn't stop working.
                    _this.zone.run(function () {
                        _this.logger.log('Received a notification', notification);
                        _this.onMessageReceived(notification);
                    });
                });
                pushObject.on('registration').subscribe(function (data) {
                    // Execute the callback in the Angular zone, so change detection doesn't stop working.
                    _this.zone.run(function () {
                        _this.pushID = data.registrationId;
                        if (_this.sitesProvider.isLoggedIn()) {
                            _this.registerDeviceOnMoodle().catch(function (error) {
                                _this.logger.warn('Can\'t register device', error);
                            });
                        }
                    });
                });
                pushObject.on('error').subscribe(function (error) {
                    // Execute the callback in the Angular zone, so change detection doesn't stop working.
                    _this.zone.run(function () {
                        _this.logger.warn('Error with Push plugin', error);
                    });
                });
            });
        }
        catch (ex) {
            // Ignore errors.
            this.logger.warn(ex);
        }
        return Promise.reject(null);
    };
    /**
     * Registers a device on a Moodle site if needed.
     *
     * @param siteId Site ID. If not defined, current site.
     * @param forceUnregister Whether to force unregister and register.
     * @return Promise resolved when device is registered.
     */
    CorePushNotificationsProvider.prototype.registerDeviceOnMoodle = function (siteId, forceUnregister) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result, site, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug('Register device on Moodle.');
                        if (!this.canRegisterOnMoodle()) {
                            return [2 /*return*/, Promise.reject(null)];
                        }
                        return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        data = this.getRegisterData();
                        return [4 /*yield*/, this.sitesProvider.getSite(siteId)];
                    case 2:
                        site = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, , 14, 16]);
                        if (!forceUnregister) return [3 /*break*/, 4];
                        result = { unregister: true, register: true };
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.shouldRegister(data, site)];
                    case 5:
                        // Check if the device is already registered.
                        result = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!result.unregister) return [3 /*break*/, 8];
                        // Unregister the device first.
                        return [4 /*yield*/, this.unregisterDeviceOnMoodle(site).catch(function () {
                                // Ignore errors.
                            })];
                    case 7:
                        // Unregister the device first.
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!result.register) return [3 /*break*/, 13];
                        // Now register the device.
                        return [4 /*yield*/, site.write('core_user_add_user_device', this.utils.clone(data))];
                    case 9:
                        // Now register the device.
                        _a.sent();
                        CoreEvents.instance.trigger(CoreEventsProvider.DEVICE_REGISTERED_IN_MOODLE, {}, site.getId());
                        _a.label = 10;
                    case 10:
                        _a.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, site.getDb().insertRecord(CorePushNotificationsProvider_1.REGISTERED_DEVICES_TABLE, data)];
                    case 11:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        err_1 = _a.sent();
                        return [3 /*break*/, 13];
                    case 13: return [3 /*break*/, 16];
                    case 14: 
                    // Remove pending unregisters for this site.
                    return [4 /*yield*/, this.appDB.deleteRecords(CorePushNotificationsProvider_1.PENDING_UNREGISTER_TABLE, { siteid: site.id }).catch(function () {
                            // Ignore errors.
                        })];
                    case 15:
                        // Remove pending unregisters for this site.
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the addon/site badge counter from the database.
     *
     * @param siteId Site ID.
     * @param addon Registered addon name. If not defined it will store the site total.
     * @return Promise resolved with the stored badge counter for the addon or site or 0 if none.
     */
    CorePushNotificationsProvider.prototype.getAddonBadge = function (siteId, addon) {
        if (addon === void 0) { addon = 'site'; }
        return __awaiter(this, void 0, void 0, function () {
            var entry, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.appDB.getRecord(CorePushNotificationsProvider_1.BADGE_TABLE, { siteid: siteId, addon: addon })];
                    case 3:
                        entry = _a.sent();
                        return [2 /*return*/, (entry && entry.number) || 0];
                    case 4:
                        err_2 = _a.sent();
                        return [2 /*return*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retry pending unregisters.
     *
     * @param siteId If defined, retry only for that site if needed. Otherwise, retry all pending unregisters.
     * @return Promise resolved when done.
     */
    CorePushNotificationsProvider.prototype.retryUnregisters = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        if (!siteId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.appDB.getRecords(CorePushNotificationsProvider_1.PENDING_UNREGISTER_TABLE, { siteid: siteId })];
                    case 2:
                        // Check if the site has a pending unregister.
                        results = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.appDB.getAllRecords(CorePushNotificationsProvider_1.PENDING_UNREGISTER_TABLE)];
                    case 4:
                        // Get all pending unregisters.
                        results = _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, Promise.all(results.map(function (result) {
                            // Create a temporary site to unregister.
                            var tmpSite = _this.sitesFactory.makeSite(result.siteid, result.siteurl, result.token, _this.textUtils.parseJSON(result.info, {}));
                            return _this.unregisterDeviceOnMoodle(tmpSite);
                        }))];
                }
            });
        });
    };
    /**
     * Save the addon/site badgecounter on the database.
     *
     * @param value The number to be stored.
     * @param siteId Site ID. If not defined, use current site.
     * @param addon Registered addon name. If not defined it will store the site total.
     * @return Promise resolved with the stored badge counter for the addon or site.
     */
    CorePushNotificationsProvider.prototype.saveAddonBadge = function (value, siteId, addon) {
        if (addon === void 0) { addon = 'site'; }
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        siteId = siteId || this.sitesProvider.getCurrentSiteId();
                        entry = {
                            siteid: siteId,
                            addon: addon,
                            number: value
                        };
                        return [4 /*yield*/, this.appDB.insertRecord(CorePushNotificationsProvider_1.BADGE_TABLE, entry)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, value];
                }
            });
        });
    };
    /**
     * Check if device should be registered (and unregistered first).
     *
     * @param data Data of the device.
     * @param site Site to use.
     * @return Promise resolved with booleans: whether to register/unregister.
     */
    CorePushNotificationsProvider.prototype.shouldRegister = function (data, site) {
        // Check if the device is already registered.
        return site.getDb().getRecords(CorePushNotificationsProvider_1.REGISTERED_DEVICES_TABLE, {
            appid: data.appid,
            uuid: data.uuid
        }).catch(function () {
            // Ignore errors.
            return [];
        }).then(function (records) {
            var isStored = false, versionOrPushChanged = false;
            records.forEach(function (record) {
                if (record.name == data.name && record.model == data.model && record.platform == data.platform) {
                    if (record.version == data.version && record.pushid == data.pushid) {
                        // The device is already stored.
                        isStored = true;
                    }
                    else {
                        // The version or pushid has changed.
                        versionOrPushChanged = true;
                    }
                }
            });
            if (isStored) {
                // The device has already been registered, no need to register it again.
                return {
                    register: false,
                    unregister: false
                };
            }
            else if (versionOrPushChanged) {
                // This data can be updated by calling register WS, no need to call unregister.
                return {
                    register: true,
                    unregister: false
                };
            }
            else {
                return {
                    register: true,
                    unregister: true
                };
            }
        });
    };
    CorePushNotificationsProvider.COMPONENT = 'CorePushNotificationsProvider';
    // Variables for database. The name still contains the name "addon" for backwards compatibility.
    CorePushNotificationsProvider.BADGE_TABLE = 'addon_pushnotifications_badge';
    CorePushNotificationsProvider.PENDING_UNREGISTER_TABLE = 'addon_pushnotifications_pending_unregister';
    CorePushNotificationsProvider.REGISTERED_DEVICES_TABLE = 'addon_pushnotifications_registered_devices';
    CorePushNotificationsProvider = CorePushNotificationsProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            CoreInitDelegate,
            CorePushNotificationsDelegate,
            CoreSitesProvider,
            Badge,
            CoreLocalNotificationsProvider,
            CoreUtilsProvider,
            CoreTextUtilsProvider,
            Push,
            CoreConfigProvider,
            Device,
            NgZone,
            TranslateService,
            Platform,
            CoreAppProvider,
            CoreSitesFactoryProvider])
    ], CorePushNotificationsProvider);
    return CorePushNotificationsProvider;
    var CorePushNotificationsProvider_1;
}());
export { CorePushNotificationsProvider };
//# sourceMappingURL=pushnotifications.js.map