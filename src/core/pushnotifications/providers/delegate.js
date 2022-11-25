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
import { Injectable } from '@angular/core';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { Subject } from 'rxjs';
/**
 * Service to handle push notifications actions to perform when clicked and received.
 */
var CorePushNotificationsDelegate = /** @class */ (function () {
    function CorePushNotificationsDelegate(loggerProvider, sitesProvider, utils) {
        this.sitesProvider = sitesProvider;
        this.utils = utils;
        this.observables = {};
        this.clickHandlers = {};
        this.counterHandlers = {};
        this.logger = loggerProvider.getInstance('CorePushNotificationsDelegate');
        this.observables['receive'] = new Subject();
    }
    /**
     * Function called when a push notification is clicked. Sends notification to handlers.
     *
     * @param notification Notification clicked.
     * @return Promise resolved when done.
     */
    CorePushNotificationsDelegate.prototype.clicked = function (notification) {
        if (!notification) {
            return;
        }
        var promises = [];
        var handlers = [];
        var _loop_1 = function (name_1) {
            var handler = this_1.clickHandlers[name_1];
            // Check if the handler is disabled for the site.
            promises.push(this_1.isFeatureDisabled(handler, notification.site).then(function (disabled) {
                if (!disabled) {
                    // Check if the handler handles the notification.
                    return Promise.resolve(handler.handles(notification)).then(function (handles) {
                        if (handles) {
                            handlers.push(handler);
                        }
                    });
                }
            }));
        };
        var this_1 = this;
        for (var name_1 in this.clickHandlers) {
            _loop_1(name_1);
        }
        return this.utils.allPromises(promises).catch(function () {
            // Ignore errors.
        }).then(function () {
            // Sort by priority.
            handlers = handlers.sort(function (a, b) {
                return a.priority <= b.priority ? 1 : -1;
            });
            if (handlers[0]) {
                // Execute the first one.
                handlers[0].handleClick(notification);
            }
        });
    };
    /**
     * Check if a handler's feature is disabled for a certain site.
     *
     * @param handler Handler to check.
     * @param siteId The site ID to check.
     * @return Promise resolved with boolean: whether the handler feature is disabled.
     */
    CorePushNotificationsDelegate.prototype.isFeatureDisabled = function (handler, siteId) {
        if (!siteId) {
            // Notification doesn't belong to a site. Assume all handlers are enabled.
            return Promise.resolve(false);
        }
        else if (handler.featureName) {
            // Check if the feature is disabled.
            return this.sitesProvider.isFeatureDisabled(handler.featureName, siteId);
        }
        else {
            return Promise.resolve(false);
        }
    };
    /**
     * Function called when a push notification is received in foreground (cannot tell when it's received in background).
     * Sends notification to all handlers.
     *
     * @param notification Notification received.
     */
    CorePushNotificationsDelegate.prototype.received = function (notification) {
        this.observables['receive'].next(notification);
    };
    /**
     * Register a push notifications observable for a certain event. Right now, only receive is supported.
     * let observer = pushNotificationsDelegate.on('receive').subscribe((notification) => {
     * ...
     * observer.unsuscribe();
     *
     * @param eventName Only receive is permitted.
     * @return Observer to subscribe.
     */
    CorePushNotificationsDelegate.prototype.on = function (eventName) {
        if (typeof this.observables[eventName] == 'undefined') {
            var eventNames = Object.keys(this.observables).join(', ');
            this.logger.warn("'" + eventName + "' event name is not allowed. Use one of the following: '" + eventNames + "'.");
            return new Subject();
        }
        return this.observables[eventName];
    };
    /**
     * Register a click handler.
     *
     * @param handler The handler to register.
     * @return True if registered successfully, false otherwise.
     */
    CorePushNotificationsDelegate.prototype.registerClickHandler = function (handler) {
        if (typeof this.clickHandlers[handler.name] !== 'undefined') {
            this.logger.log("Addon '" + handler.name + "' already registered");
            return false;
        }
        this.logger.log("Registered addon '" + handler.name + "'");
        this.clickHandlers[handler.name] = handler;
        handler.priority = handler.priority || 0;
        return true;
    };
    /**
     * Register a push notifications handler for update badge counter.
     *
     * @param name Handler's name.
     */
    CorePushNotificationsDelegate.prototype.registerCounterHandler = function (name) {
        if (typeof this.counterHandlers[name] == 'undefined') {
            this.logger.debug("Registered handler '" + name + "' as badge counter handler.");
            this.counterHandlers[name] = name;
        }
        else {
            this.logger.log("Handler '" + name + "' as badge counter handler already registered.");
        }
    };
    /**
     * Check if a counter handler is present.
     *
     * @param name Handler's name.
     * @return If handler name is present.
     */
    CorePushNotificationsDelegate.prototype.isCounterHandlerRegistered = function (name) {
        return typeof this.counterHandlers[name] != 'undefined';
    };
    /**
     * Get all counter badge handlers.
     *
     * @return with all the handler names.
     */
    CorePushNotificationsDelegate.prototype.getCounterHandlers = function () {
        return this.counterHandlers;
    };
    CorePushNotificationsDelegate = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider, CoreSitesProvider, CoreUtilsProvider])
    ], CorePushNotificationsDelegate);
    return CorePushNotificationsDelegate;
}());
export { CorePushNotificationsDelegate };
//# sourceMappingURL=delegate.js.map