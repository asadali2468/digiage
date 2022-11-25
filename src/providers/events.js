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
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CoreLoggerProvider } from '@providers/logger';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * Service to send and listen to events.
 */
var CoreEventsProvider = /** @class */ (function () {
    function CoreEventsProvider(logger) {
        this.observables = {};
        this.uniqueEvents = {};
        this.logger = logger.getInstance('CoreEventsProvider');
    }
    /**
     * Listen for a certain event. To stop listening to the event:
     * let observer = eventsProvider.on('something', myCallBack);
     * ...
     * observer.off();
     *
     * @param eventName Name of the event to listen to.
     * @param callBack Function to call when the event is triggered.
     * @param siteId Site where to trigger the event. Undefined won't check the site.
     * @return Observer to stop listening.
     */
    CoreEventsProvider.prototype.on = function (eventName, callBack, siteId) {
        var _this = this;
        // If it's a unique event and has been triggered already, call the callBack.
        // We don't need to create an observer because the event won't be triggered again.
        if (this.uniqueEvents[eventName]) {
            callBack(this.uniqueEvents[eventName].data);
            // Return a fake observer to prevent errors.
            return {
                off: function () {
                    // Nothing to do.
                }
            };
        }
        this.logger.debug("New observer listening to event '" + eventName + "'");
        if (typeof this.observables[eventName] == 'undefined') {
            // No observable for this event, create a new one.
            this.observables[eventName] = new Subject();
        }
        var subscription = this.observables[eventName].subscribe(function (value) {
            if (!siteId || value.siteId == siteId) {
                callBack(value);
            }
        });
        // Create and return a CoreEventObserver.
        return {
            off: function () {
                _this.logger.debug("Stop listening to event '" + eventName + "'");
                subscription.unsubscribe();
            }
        };
    };
    /**
     * Listen for several events. To stop listening to the events:
     * let observer = eventsProvider.onMultiple(['something', 'another'], myCallBack);
     * ...
     * observer.off();
     *
     * @param eventNames Names of the events to listen to.
     * @param callBack Function to call when any of the events is triggered.
     * @param siteId Site where to trigger the event. Undefined won't check the site.
     * @return Observer to stop listening.
     */
    CoreEventsProvider.prototype.onMultiple = function (eventNames, callBack, siteId) {
        var _this = this;
        var observers = eventNames.map(function (name) {
            return _this.on(name, callBack, siteId);
        });
        // Create and return a CoreEventObserver.
        return {
            off: function () {
                observers.forEach(function (observer) {
                    observer.off();
                });
            }
        };
    };
    /**
     * Triggers an event, notifying all the observers.
     *
     * @param event Name of the event to trigger.
     * @param data Data to pass to the observers.
     * @param siteId Site where to trigger the event. Undefined means no Site.
     */
    CoreEventsProvider.prototype.trigger = function (eventName, data, siteId) {
        this.logger.debug("Event '" + eventName + "' triggered.");
        if (this.observables[eventName]) {
            if (siteId) {
                if (!data) {
                    data = {};
                }
                data.siteId = siteId;
            }
            this.observables[eventName].next(data);
        }
    };
    /**
     * Triggers a unique event, notifying all the observers. If the event has already been triggered, don't do anything.
     *
     * @param event Name of the event to trigger.
     * @param data Data to pass to the observers.
     * @param siteId Site where to trigger the event. Undefined means no Site.
     */
    CoreEventsProvider.prototype.triggerUnique = function (eventName, data, siteId) {
        if (this.uniqueEvents[eventName]) {
            this.logger.debug("Unique event '" + eventName + "' ignored because it was already triggered.");
        }
        else {
            this.logger.debug("Unique event '" + eventName + "' triggered.");
            if (siteId) {
                if (!data) {
                    data = {};
                }
                data.siteId = siteId;
            }
            // Store the data so it can be passed to observers that register from now on.
            this.uniqueEvents[eventName] = {
                data: data
            };
            // Now pass the data to observers.
            if (this.observables[eventName]) {
                this.observables[eventName].next(data);
            }
        }
    };
    CoreEventsProvider.SESSION_EXPIRED = 'session_expired';
    CoreEventsProvider.PASSWORD_CHANGE_FORCED = 'password_change_forced';
    CoreEventsProvider.USER_NOT_FULLY_SETUP = 'user_not_fully_setup';
    CoreEventsProvider.SITE_POLICY_NOT_AGREED = 'site_policy_not_agreed';
    CoreEventsProvider.LOGIN = 'login';
    CoreEventsProvider.LOGOUT = 'logout';
    CoreEventsProvider.LANGUAGE_CHANGED = 'language_changed';
    CoreEventsProvider.NOTIFICATION_SOUND_CHANGED = 'notification_sound_changed';
    CoreEventsProvider.SITE_ADDED = 'site_added';
    CoreEventsProvider.SITE_UPDATED = 'site_updated';
    CoreEventsProvider.SITE_DELETED = 'site_deleted';
    CoreEventsProvider.COMPLETION_MODULE_VIEWED = 'completion_module_viewed';
    CoreEventsProvider.USER_DELETED = 'user_deleted';
    CoreEventsProvider.PACKAGE_STATUS_CHANGED = 'package_status_changed';
    CoreEventsProvider.COURSE_STATUS_CHANGED = 'course_status_changed';
    CoreEventsProvider.SECTION_STATUS_CHANGED = 'section_status_changed';
    CoreEventsProvider.COMPONENT_FILE_ACTION = 'component_file_action';
    CoreEventsProvider.SITE_PLUGINS_LOADED = 'site_plugins_loaded';
    CoreEventsProvider.SITE_PLUGINS_COURSE_RESTRICT_UPDATED = 'site_plugins_course_restrict_updated';
    CoreEventsProvider.LOGIN_SITE_CHECKED = 'login_site_checked';
    CoreEventsProvider.LOGIN_SITE_UNCHECKED = 'login_site_unchecked';
    CoreEventsProvider.IAB_LOAD_START = 'inappbrowser_load_start';
    CoreEventsProvider.IAB_EXIT = 'inappbrowser_exit';
    CoreEventsProvider.APP_LAUNCHED_URL = 'app_launched_url'; // App opened with a certain URL (custom URL scheme).
    CoreEventsProvider.FILE_SHARED = 'file_shared';
    CoreEventsProvider.KEYBOARD_CHANGE = 'keyboard_change';
    CoreEventsProvider.CORE_LOADING_CHANGED = 'core_loading_changed';
    CoreEventsProvider.ORIENTATION_CHANGE = 'orientation_change';
    CoreEventsProvider.LOAD_PAGE_MAIN_MENU = 'load_page_main_menu';
    CoreEventsProvider.SEND_ON_ENTER_CHANGED = 'send_on_enter_changed';
    CoreEventsProvider.MAIN_MENU_OPEN = 'main_menu_open';
    CoreEventsProvider.SELECT_COURSE_TAB = 'select_course_tab';
    CoreEventsProvider.WS_CACHE_INVALIDATED = 'ws_cache_invalidated';
    CoreEventsProvider.SITE_STORAGE_DELETED = 'site_storage_deleted';
    CoreEventsProvider.FORM_ACTION = 'form_action';
    CoreEventsProvider.ACTIVITY_DATA_SENT = 'activity_data_sent';
    CoreEventsProvider.DEVICE_REGISTERED_IN_MOODLE = 'device_registered_in_moodle';
    CoreEventsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider])
    ], CoreEventsProvider);
    return CoreEventsProvider;
}());
export { CoreEventsProvider };
var CoreEvents = /** @class */ (function (_super) {
    __extends(CoreEvents, _super);
    function CoreEvents() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreEvents;
}(makeSingleton(CoreEventsProvider)));
export { CoreEvents };
//# sourceMappingURL=events.js.map