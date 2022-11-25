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
import { Platform, AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Push } from '@ionic-native/push';
import { TranslateService } from '@ngx-translate/core';
import { CoreApp, CoreAppProvider } from './app';
import { CoreConfigProvider } from './config';
import { CoreEventsProvider } from './events';
import { CoreLoggerProvider } from './logger';
import { CoreTextUtilsProvider } from './utils/text';
import { CoreUtilsProvider } from './utils/utils';
import { CoreQueueRunner } from '@classes/queue-runner';
import { CoreConstants } from '@core/constants';
import { CoreConfigConstants } from '../configconstants';
import { Subject } from 'rxjs';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * Generated class for the LocalNotificationsProvider provider.
 *
 * See https://angular.io/guide/dependency-injection for more info on providers
 * and Angular DI.
*/
var CoreLocalNotificationsProvider = /** @class */ (function () {
    function CoreLocalNotificationsProvider(logger, localNotifications, platform, utils, configProvider, textUtils, translate, alertCtrl, eventsProvider, appProvider, push, zone) {
        var _this = this;
        this.localNotifications = localNotifications;
        this.platform = platform;
        this.utils = utils;
        this.configProvider = configProvider;
        this.textUtils = textUtils;
        this.translate = translate;
        this.alertCtrl = alertCtrl;
        this.push = push;
        this.zone = zone;
        // Variables for the database.
        this.SITES_TABLE = 'notification_sites'; // Store to asigne unique codes to each site.
        this.COMPONENTS_TABLE = 'notification_components'; // Store to asigne unique codes to each component.
        this.TRIGGERED_TABLE = 'notifications_triggered'; // Store to prevent re-triggering notifications.
        this.tablesSchema = {
            name: 'CoreLocalNotificationsProvider',
            version: 1,
            tables: [
                {
                    name: this.SITES_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'TEXT',
                            primaryKey: true
                        },
                        {
                            name: 'code',
                            type: 'INTEGER',
                            notNull: true
                        },
                    ],
                },
                {
                    name: this.COMPONENTS_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'TEXT',
                            primaryKey: true
                        },
                        {
                            name: 'code',
                            type: 'INTEGER',
                            notNull: true
                        },
                    ],
                },
                {
                    name: this.TRIGGERED_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'INTEGER',
                            primaryKey: true
                        },
                        {
                            name: 'at',
                            type: 'INTEGER',
                            notNull: true
                        },
                    ],
                },
            ],
        };
        this.codes = {};
        this.codeRequestsQueue = {};
        this.observables = {};
        this.currentNotification = {
            title: '',
            texts: [],
            ids: [],
            timeouts: []
        };
        this.logger = logger.getInstance('CoreLocalNotificationsProvider');
        this.queueRunner = new CoreQueueRunner(10);
        this.appDB = appProvider.getDB();
        this.dbReady = appProvider.createTablesFromSchema(this.tablesSchema).catch(function () {
            // Ignore errors.
        });
        platform.ready().then(function () {
            // Listen to events.
            _this.triggerSubscription = localNotifications.on('trigger').subscribe(function (notification) {
                _this.trigger(notification);
                _this.handleEvent('trigger', notification);
            });
            _this.clickSubscription = localNotifications.on('click').subscribe(function (notification) {
                _this.handleEvent('click', notification);
            });
            _this.clearSubscription = localNotifications.on('clear').subscribe(function (notification) {
                _this.handleEvent('clear', notification);
            });
            _this.cancelSubscription = localNotifications.on('cancel').subscribe(function (notification) {
                _this.handleEvent('cancel', notification);
            });
            _this.addSubscription = localNotifications.on('schedule').subscribe(function (notification) {
                _this.handleEvent('schedule', notification);
            });
            _this.updateSubscription = localNotifications.on('update').subscribe(function (notification) {
                _this.handleEvent('update', notification);
            });
            // Create the default channel for local notifications.
            _this.createDefaultChannel();
            translate.onLangChange.subscribe(function (event) {
                // Update the channel name.
                _this.createDefaultChannel();
            });
        });
        eventsProvider.on(CoreEventsProvider.SITE_DELETED, function (site) {
            if (site) {
                _this.cancelSiteNotifications(site.id);
            }
        });
    }
    /**
     * Cancel a local notification.
     *
     * @param id Notification id.
     * @param component Component of the notification.
     * @param siteId Site ID.
     * @return Promise resolved when the notification is cancelled.
     */
    CoreLocalNotificationsProvider.prototype.cancel = function (id, component, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var uniqueId, queueId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUniqueNotificationId(id, component, siteId)];
                    case 1:
                        uniqueId = _a.sent();
                        queueId = 'cancel-' + uniqueId;
                        return [4 /*yield*/, this.queueRunner.run(queueId, function () { return _this.localNotifications.cancel(uniqueId); }, {
                                allowRepeated: true,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cancel all the scheduled notifications belonging to a certain site.
     *
     * @param siteId Site ID.
     * @return Promise resolved when the notifications are cancelled.
     */
    CoreLocalNotificationsProvider.prototype.cancelSiteNotifications = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var scheduled, ids, queueId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isAvailable()) {
                            return [2 /*return*/];
                        }
                        else if (!siteId) {
                            throw new Error('No site ID supplied.');
                        }
                        return [4 /*yield*/, this.getAllScheduled()];
                    case 1:
                        scheduled = _a.sent();
                        ids = [];
                        queueId = 'cancelSiteNotifications-' + siteId;
                        scheduled.forEach(function (notif) {
                            notif.data = _this.parseNotificationData(notif.data);
                            if (typeof notif.data == 'object' && notif.data.siteId === siteId) {
                                ids.push(notif.id);
                            }
                        });
                        return [4 /*yield*/, this.queueRunner.run(queueId, function () { return _this.localNotifications.cancel(ids); }, {
                                allowRepeated: true,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check whether sound can be disabled for notifications.
     *
     * @return Whether sound can be disabled for notifications.
     */
    CoreLocalNotificationsProvider.prototype.canDisableSound = function () {
        // Only allow disabling sound in Android 7 or lower. In iOS and Android 8+ it can easily be done with system settings.
        return this.isAvailable() && !CoreApp.instance.isDesktop() && CoreApp.instance.isAndroid() &&
            this.platform.version().major < 8;
    };
    /**
     * Create the default channel. It is used to change the name.
     *
     * @return Promise resolved when done.
     */
    CoreLocalNotificationsProvider.prototype.createDefaultChannel = function () {
        var _this = this;
        if (!CoreApp.instance.isAndroid()) {
            return Promise.resolve();
        }
        return this.push.createChannel({
            id: 'default-channel-id',
            description: this.translate.instant('addon.calendar.calendarreminders'),
            importance: 4
        }).catch(function (error) {
            _this.logger.error('Error changing channel name', error);
        });
    };
    /**
     * Get all scheduled notifications.
     *
     * @return Promise resolved with the notifications.
     */
    CoreLocalNotificationsProvider.prototype.getAllScheduled = function () {
        var _this = this;
        return this.queueRunner.run('allScheduled', function () { return _this.localNotifications.getScheduled(); });
    };
    /**
     * Get a code to create unique notifications. If there's no code assigned, create a new one.
     *
     * @param table Table to search in local DB.
     * @param id ID of the element to get its code.
     * @return Promise resolved when the code is retrieved.
     */
    CoreLocalNotificationsProvider.prototype.getCode = function (table, id) {
        return __awaiter(this, void 0, void 0, function () {
            var key, entry, err_1, entries, newCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        key = table + '#' + id;
                        // Check if the code is already in memory.
                        if (typeof this.codes[key] != 'undefined') {
                            return [2 /*return*/, this.codes[key]];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 7]);
                        return [4 /*yield*/, this.appDB.getRecord(table, { id: id })];
                    case 3:
                        entry = _a.sent();
                        this.codes[key] = entry.code;
                        return [2 /*return*/, entry.code];
                    case 4:
                        err_1 = _a.sent();
                        return [4 /*yield*/, this.appDB.getRecords(table, undefined, 'code DESC')];
                    case 5:
                        entries = _a.sent();
                        newCode = 0;
                        if (entries.length > 0) {
                            newCode = entries[0].code + 1;
                        }
                        return [4 /*yield*/, this.appDB.insertRecord(table, { id: id, code: newCode })];
                    case 6:
                        _a.sent();
                        this.codes[key] = newCode;
                        return [2 /*return*/, newCode];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a notification component code to be used.
     * If it's the first time this component is used to send notifications, create a new code for it.
     *
     * @param component Component name.
     * @return Promise resolved when the component code is retrieved.
     */
    CoreLocalNotificationsProvider.prototype.getComponentCode = function (component) {
        return this.requestCode(this.COMPONENTS_TABLE, component);
    };
    /**
     * Get a site code to be used.
     * If it's the first time this site is used to send notifications, create a new code for it.
     *
     * @param siteId Site ID.
     * @return Promise resolved when the site code is retrieved.
     */
    CoreLocalNotificationsProvider.prototype.getSiteCode = function (siteId) {
        return this.requestCode(this.SITES_TABLE, siteId);
    };
    /**
     * Create a unique notification ID, trying to prevent collisions. Generated ID must be a Number (Android).
     * The generated ID shouldn't be higher than 2147483647 or it's going to cause problems in Android.
     * This function will prevent collisions and keep the number under Android limit if:
     *     -User has used less than 21 sites.
     *     -There are less than 11 components.
     *     -The notificationId passed as parameter is lower than 10000000.
     *
     * @param notificationId Notification ID.
     * @param component Component triggering the notification.
     * @param siteId Site ID.
     * @return Promise resolved when the notification ID is generated.
     */
    CoreLocalNotificationsProvider.prototype.getUniqueNotificationId = function (notificationId, component, siteId) {
        var _this = this;
        if (!siteId || !component) {
            return Promise.reject(null);
        }
        return this.getSiteCode(siteId).then(function (siteCode) {
            return _this.getComponentCode(component).then(function (componentCode) {
                // We use the % operation to keep the number under Android's limit.
                return (siteCode * 100000000 + componentCode * 10000000 + notificationId) % 2147483647;
            });
        });
    };
    /**
     * Handle an event triggered by the local notifications plugin.
     *
     * @param eventName Name of the event.
     * @param notification Notification.
     */
    CoreLocalNotificationsProvider.prototype.handleEvent = function (eventName, notification) {
        if (notification && notification.data) {
            this.logger.debug('Notification event: ' + eventName + '. Data:', notification.data);
            this.notifyEvent(eventName, notification.data);
        }
    };
    /**
     * Returns whether local notifications plugin is installed.
     *
     * @return Whether local notifications plugin is installed.
     */
    CoreLocalNotificationsProvider.prototype.isAvailable = function () {
        var win = window;
        return CoreApp.instance.isDesktop() || !!(win.cordova && win.cordova.plugins && win.cordova.plugins.notification &&
            win.cordova.plugins.notification.local);
    };
    /**
     * Check if a notification has been triggered with the same trigger time.
     *
     * @param notification Notification to check.
     * @param useQueue Whether to add the call to the queue.
     * @return Promise resolved with a boolean indicating if promise is triggered (true) or not.
     */
    CoreLocalNotificationsProvider.prototype.isTriggered = function (notification, useQueue) {
        if (useQueue === void 0) { useQueue = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var stored, triggered, err_2, queueId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.appDB.getRecord(this.TRIGGERED_TABLE, { id: notification.id })];
                    case 3:
                        stored = _a.sent();
                        triggered = (notification.trigger && notification.trigger.at) || 0;
                        if (typeof triggered != 'number') {
                            triggered = triggered.getTime();
                        }
                        return [2 /*return*/, stored.at === triggered];
                    case 4:
                        err_2 = _a.sent();
                        if (useQueue) {
                            queueId = 'isTriggered-' + notification.id;
                            return [2 /*return*/, this.queueRunner.run(queueId, function () { return _this.localNotifications.isTriggered(notification.id); }, {
                                    allowRepeated: true,
                                })];
                        }
                        else {
                            return [2 /*return*/, this.localNotifications.isTriggered(notification.id)];
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Notify notification click to observers. Only the observers with the same component as the notification will be notified.
     *
     * @param data Data received by the notification.
     */
    CoreLocalNotificationsProvider.prototype.notifyClick = function (data) {
        this.notifyEvent('click', data);
    };
    /**
     * Notify a certain event to observers. Only the observers with the same component as the notification will be notified.
     *
     * @param eventName Name of the event to notify.
     * @param data Data received by the notification.
     */
    CoreLocalNotificationsProvider.prototype.notifyEvent = function (eventName, data) {
        var _this = this;
        // Execute the code in the Angular zone, so change detection doesn't stop working.
        this.zone.run(function () {
            var component = data.component;
            if (component) {
                if (_this.observables[eventName] && _this.observables[eventName][component]) {
                    _this.observables[eventName][component].next(data);
                }
            }
        });
    };
    /**
     * Parse some notification data.
     *
     * @param data Notification data.
     * @return Parsed data.
     */
    CoreLocalNotificationsProvider.prototype.parseNotificationData = function (data) {
        if (!data) {
            return {};
        }
        else if (typeof data == 'string') {
            return this.textUtils.parseJSON(data, {});
        }
        else {
            return data;
        }
    };
    /**
     * Process the next request in queue.
     */
    CoreLocalNotificationsProvider.prototype.processNextRequest = function () {
        var _this = this;
        var nextKey = Object.keys(this.codeRequestsQueue)[0];
        var request, promise;
        if (typeof nextKey == 'undefined') {
            // No more requests in queue, stop.
            return;
        }
        request = this.codeRequestsQueue[nextKey];
        // Check if request is valid.
        if (typeof request == 'object' && typeof request.table != 'undefined' && typeof request.id != 'undefined') {
            // Get the code and resolve/reject all the promises of this request.
            promise = this.getCode(request.table, request.id).then(function (code) {
                request.promises.forEach(function (p) {
                    p.resolve(code);
                });
            }).catch(function (error) {
                request.promises.forEach(function (p) {
                    p.reject(error);
                });
            });
        }
        else {
            promise = Promise.resolve();
        }
        // Once this item is treated, remove it and process next.
        promise.finally(function () {
            delete _this.codeRequestsQueue[nextKey];
            _this.processNextRequest();
        });
    };
    /**
     * Register an observer to be notified when a notification belonging to a certain component is clicked.
     *
     * @param component Component to listen notifications for.
     * @param callback Function to call with the data received by the notification.
     * @return Object with an "off" property to stop listening for clicks.
     */
    CoreLocalNotificationsProvider.prototype.registerClick = function (component, callback) {
        return this.registerObserver('click', component, callback);
    };
    /**
     * Register an observer to be notified when a certain event is fired for a notification belonging to a certain component.
     *
     * @param eventName Name of the event to listen to.
     * @param component Component to listen notifications for.
     * @param callback Function to call with the data received by the notification.
     * @return Object with an "off" property to stop listening for events.
     */
    CoreLocalNotificationsProvider.prototype.registerObserver = function (eventName, component, callback) {
        var _this = this;
        this.logger.debug("Register observer '" + component + "' for event '" + eventName + "'.");
        if (typeof this.observables[eventName] == 'undefined') {
            this.observables[eventName] = {};
        }
        if (typeof this.observables[eventName][component] == 'undefined') {
            // No observable for this component, create a new one.
            this.observables[eventName][component] = new Subject();
        }
        this.observables[eventName][component].subscribe(callback);
        return {
            off: function () {
                _this.observables[eventName][component].unsubscribe(callback);
            }
        };
    };
    /**
     * Remove a notification from triggered store.
     *
     * @param id Notification ID.
     * @return Promise resolved when it is removed.
     */
    CoreLocalNotificationsProvider.prototype.removeTriggered = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.appDB.deleteRecords(this.TRIGGERED_TABLE, { id: id })];
                }
            });
        });
    };
    /**
     * Request a unique code. The request will be added to the queue and the queue is going to be started if it's paused.
     *
     * @param table Table to search in local DB.
     * @param id ID of the element to get its code.
     * @return Promise resolved when the code is retrieved.
     */
    CoreLocalNotificationsProvider.prototype.requestCode = function (table, id) {
        var deferred = this.utils.promiseDefer(), key = table + '#' + id, isQueueEmpty = Object.keys(this.codeRequestsQueue).length == 0;
        if (typeof this.codeRequestsQueue[key] != 'undefined') {
            // There's already a pending request for this store and ID, add the promise to it.
            this.codeRequestsQueue[key].promises.push(deferred);
        }
        else {
            // Add a pending request to the queue.
            this.codeRequestsQueue[key] = {
                table: table,
                id: id,
                promises: [deferred]
            };
        }
        if (isQueueEmpty) {
            this.processNextRequest();
        }
        return deferred.promise;
    };
    /**
     * Reschedule all notifications that are already scheduled.
     *
     * @return Promise resolved when all notifications have been rescheduled.
     */
    CoreLocalNotificationsProvider.prototype.rescheduleAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var notifications;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllScheduled()];
                    case 1:
                        notifications = _a.sent();
                        return [4 /*yield*/, Promise.all(notifications.map(function (notification) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                var queueId;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            // Convert some properties to the needed types.
                                            notification.data = this.parseNotificationData(notification.data);
                                            queueId = 'schedule-' + notification.id;
                                            return [4 /*yield*/, this.queueRunner.run(queueId, function () { return _this.scheduleNotification(notification); }, {
                                                    allowRepeated: true,
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Schedule a local notification.
     *
     * @param notification Notification to schedule. Its ID should be lower than 10000000 and it should
     *                     be unique inside its component and site.
     * @param component Component triggering the notification. It is used to generate unique IDs.
     * @param siteId Site ID.
     * @param alreadyUnique Whether the ID is already unique.
     * @return Promise resolved when the notification is scheduled.
     */
    CoreLocalNotificationsProvider.prototype.schedule = function (notification, component, siteId, alreadyUnique) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, led, queueId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!alreadyUnique) return [3 /*break*/, 2];
                        _a = notification;
                        return [4 /*yield*/, this.getUniqueNotificationId(notification.id, component, siteId)];
                    case 1:
                        _a.id = _b.sent();
                        _b.label = 2;
                    case 2:
                        notification.data = notification.data || {};
                        notification.data.component = component;
                        notification.data.siteId = siteId;
                        if (CoreApp.instance.isAndroid()) {
                            notification.icon = notification.icon || 'res://icon';
                            notification.smallIcon = notification.smallIcon || 'res://smallicon';
                            notification.color = notification.color || CoreConfigConstants.notificoncolor;
                            led = notification.led || {};
                            notification.led = {
                                color: led.color || 'FF9900',
                                on: led.on || 1000,
                                off: led.off || 1000
                            };
                        }
                        queueId = 'schedule-' + notification.id;
                        return [4 /*yield*/, this.queueRunner.run(queueId, function () { return _this.scheduleNotification(notification); }, {
                                allowRepeated: true,
                            })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Helper function to schedule a notification object if it hasn't been triggered already.
     *
     * @param notification Notification to schedule.
     * @return Promise resolved when scheduled.
     */
    CoreLocalNotificationsProvider.prototype.scheduleNotification = function (notification) {
        var _this = this;
        // Check if the notification has been triggered already.
        return this.isTriggered(notification, false).then(function (triggered) {
            // Cancel the current notification in case it gets scheduled twice.
            return _this.localNotifications.cancel(notification.id).finally(function () {
                if (!triggered) {
                    // Check if sound is enabled for notifications.
                    var promise = void 0;
                    if (_this.canDisableSound()) {
                        promise = _this.configProvider.get(CoreConstants.SETTINGS_NOTIFICATION_SOUND, true);
                    }
                    else {
                        promise = Promise.resolve(true);
                    }
                    return promise.then(function (soundEnabled) {
                        if (!soundEnabled) {
                            notification.sound = null;
                        }
                        else {
                            delete notification.sound; // Use default value.
                        }
                        notification.foreground = true;
                        // Remove from triggered, since the notification could be in there with a different time.
                        _this.removeTriggered(notification.id);
                        _this.localNotifications.schedule(notification);
                    });
                }
            });
        });
    };
    /**
     * Show an in app notification popover.
     * This function was used because local notifications weren't displayed when the app was in foreground in iOS10+,
     * but the issue was fixed in the plugin and this function is no longer used.
     *
     * @param notification Notification.
     */
    CoreLocalNotificationsProvider.prototype.showNotificationPopover = function (notification) {
        var _this = this;
        if (!notification || !notification.title || !notification.text) {
            // Invalid data.
            return;
        }
        var clearAlert = function (all) {
            if (all === void 0) { all = false; }
            // Only erase first notification.
            if (!all && _this.alertNotification && _this.currentNotification.ids.length > 1) {
                _this.currentNotification.texts.shift();
                _this.currentNotification.ids.shift();
                clearTimeout(_this.currentNotification.timeouts.shift());
                var text_1 = '<p>' + _this.currentNotification.texts.join('</p><p>') + '</p>';
                _this.alertNotification.setMessage(text_1);
            }
            else {
                // Close the alert and reset the current object.
                if (_this.alertNotification && !all) {
                    _this.alertNotification.dismiss();
                }
                _this.alertNotification = null;
                _this.currentNotification.title = '';
                _this.currentNotification.texts = [];
                _this.currentNotification.ids = [];
                _this.currentNotification.timeouts.forEach(function (time) {
                    clearTimeout(time);
                });
                _this.currentNotification.timeouts = [];
            }
        };
        if (this.alertNotification && this.currentNotification.title == notification.title) {
            if (this.currentNotification.ids.indexOf(notification.id) != -1) {
                // Notification already shown, don't show it again, just renew the timeout.
                return;
            }
            // Same title and the notification is shown, update it.
            this.currentNotification.texts.push(notification.text);
            this.currentNotification.ids.push(notification.id);
            if (this.currentNotification.texts.length > 3) {
                this.currentNotification.texts.shift();
                this.currentNotification.ids.shift();
                clearTimeout(this.currentNotification.timeouts.shift());
            }
        }
        else {
            this.currentNotification.timeouts.forEach(function (time) {
                clearTimeout(time);
            });
            this.currentNotification.timeouts = [];
            // Not shown or title is different, set new data.
            this.currentNotification.title = notification.title;
            this.currentNotification.texts = [notification.text];
            this.currentNotification.ids = [notification.id];
        }
        var text = '<p>' + this.currentNotification.texts.join('</p><p>') + '</p>';
        if (this.alertNotification) {
            this.alertNotification.setTitle(this.currentNotification.title);
            this.alertNotification.setMessage(text);
        }
        else {
            this.alertNotification = this.alertCtrl.create({
                title: this.currentNotification.title,
                message: text,
                cssClass: 'core-inapp-notification',
                enableBackdropDismiss: false,
                buttons: [{
                        text: this.translate.instant('core.dismiss'),
                        role: 'cancel',
                        handler: function () {
                            clearAlert(true);
                        }
                    }]
            });
        }
        this.alertNotification.present();
        this.currentNotification.timeouts.push(setTimeout(function () {
            clearAlert();
        }, 4000));
    };
    /**
     * Function to call when a notification is triggered. Stores the notification so it's not scheduled again unless the
     * time is changed.
     *
     * @param notification Triggered notification.
     * @return Promise resolved when stored, rejected otherwise.
     */
    CoreLocalNotificationsProvider.prototype.trigger = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        entry = {
                            id: notification.id,
                            at: notification.trigger && notification.trigger.at ? notification.trigger.at : Date.now()
                        };
                        return [2 /*return*/, this.appDB.insertRecord(this.TRIGGERED_TABLE, entry)];
                }
            });
        });
    };
    /**
     * Update a component name.
     *
     * @param oldName The old name.
     * @param newName The new name.
     * @return Promise resolved when done.
     */
    CoreLocalNotificationsProvider.prototype.updateComponentName = function (oldName, newName) {
        return __awaiter(this, void 0, void 0, function () {
            var oldId, newId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        oldId = this.COMPONENTS_TABLE + '#' + oldName, newId = this.COMPONENTS_TABLE + '#' + newName;
                        return [2 /*return*/, this.appDB.updateRecords(this.COMPONENTS_TABLE, { id: newId }, { id: oldId })];
                }
            });
        });
    };
    CoreLocalNotificationsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            LocalNotifications,
            Platform,
            CoreUtilsProvider,
            CoreConfigProvider,
            CoreTextUtilsProvider,
            TranslateService,
            AlertController,
            CoreEventsProvider,
            CoreAppProvider,
            Push,
            NgZone])
    ], CoreLocalNotificationsProvider);
    return CoreLocalNotificationsProvider;
}());
export { CoreLocalNotificationsProvider };
var CoreLocalNotifications = /** @class */ (function (_super) {
    __extends(CoreLocalNotifications, _super);
    function CoreLocalNotifications() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreLocalNotifications;
}(makeSingleton(CoreLocalNotificationsProvider)));
export { CoreLocalNotifications };
//# sourceMappingURL=local-notifications.js.map