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
import { CoreUrlUtilsProvider } from '@providers/utils/url';
import { CoreUtilsProvider } from '@providers/utils/utils';
/**
 * Delegate to register handlers to handle links.
 */
var CoreContentLinksDelegate = /** @class */ (function () {
    function CoreContentLinksDelegate(logger, sitesProvider, urlUtils, utils) {
        this.sitesProvider = sitesProvider;
        this.urlUtils = urlUtils;
        this.utils = utils;
        this.handlers = {}; // All registered handlers.
        this.logger = logger.getInstance('CoreContentLinksDelegate');
    }
    /**
     * Get the list of possible actions to do for a URL.
     *
     * @param url URL to handle.
     * @param courseId Course ID related to the URL. Optional but recommended.
     * @param username Username to use to filter sites.
     * @param data Extra data to handle the URL.
     * @return Promise resolved with the actions.
     */
    CoreContentLinksDelegate.prototype.getActionsFor = function (url, courseId, username, data) {
        var _this = this;
        if (!url) {
            return Promise.resolve([]);
        }
        // Get the list of sites the URL belongs to.
        return this.sitesProvider.getSiteIdsFromUrl(url, true, username).then(function (siteIds) {
            var linkActions = [], promises = [], params = _this.urlUtils.extractUrlParams(url);
            var _loop_1 = function (name_1) {
                var handler = _this.handlers[name_1], checkAll = handler.checkAllUsers, isEnabledFn = _this.isHandlerEnabled.bind(_this, handler, url, params, courseId);
                if (!handler.handles(url)) {
                    return "continue";
                }
                // Filter the site IDs using the isEnabled function.
                promises.push(_this.utils.filterEnabledSites(siteIds, isEnabledFn, checkAll).then(function (siteIds) {
                    if (!siteIds.length) {
                        // No sites supported, no actions.
                        return;
                    }
                    return Promise.resolve(handler.getActions(siteIds, url, params, courseId, data)).then(function (actions) {
                        if (actions && actions.length) {
                            // Set default values if any value isn't supplied.
                            actions.forEach(function (action) {
                                action.message = action.message || 'core.view';
                                action.icon = action.icon || 'eye';
                                action.sites = action.sites || siteIds;
                            });
                            // Add them to the list.
                            linkActions.push({
                                priority: handler.priority || 0,
                                actions: actions
                            });
                        }
                    });
                }));
            };
            for (var name_1 in _this.handlers) {
                _loop_1(name_1);
            }
            return _this.utils.allPromises(promises).catch(function () {
                // Ignore errors.
            }).then(function () {
                // Sort link actions by priority.
                return _this.sortActionsByPriority(linkActions);
            });
        });
    };
    /**
     * Get the site URL if the URL is supported by any handler.
     *
     * @param url URL to handle.
     * @return Site URL if the URL is supported by any handler, undefined otherwise.
     */
    CoreContentLinksDelegate.prototype.getSiteUrl = function (url) {
        if (!url) {
            return;
        }
        // Check if any handler supports this URL.
        for (var name_2 in this.handlers) {
            var handler = this.handlers[name_2], siteUrl = handler.getSiteUrl(url);
            if (siteUrl) {
                return siteUrl;
            }
        }
    };
    /**
     * Check if a handler is enabled for a certain site and URL.
     *
     * @param handler Handler to check.
     * @param url The URL to check.
     * @param params The params of the URL
     * @param courseId Course ID the URL belongs to (can be undefined).
     * @param siteId The site ID to check.
     * @return Promise resolved with boolean: whether the handler is enabled.
     */
    CoreContentLinksDelegate.prototype.isHandlerEnabled = function (handler, url, params, courseId, siteId) {
        var promise;
        if (handler.featureName) {
            // Check if the feature is disabled.
            promise = this.sitesProvider.isFeatureDisabled(handler.featureName, siteId);
        }
        else {
            promise = Promise.resolve(false);
        }
        return promise.then(function (disabled) {
            if (disabled) {
                return false;
            }
            if (!handler.isEnabled) {
                // Handler doesn't implement isEnabled, assume it's enabled.
                return true;
            }
            return handler.isEnabled(siteId, url, params, courseId);
        });
    };
    /**
     * Register a handler.
     *
     * @param handler The handler to register.
     * @return True if registered successfully, false otherwise.
     */
    CoreContentLinksDelegate.prototype.registerHandler = function (handler) {
        if (typeof this.handlers[handler.name] !== 'undefined') {
            this.logger.log("Addon '" + handler.name + "' already registered");
            return false;
        }
        this.logger.log("Registered addon '" + handler.name + "'");
        this.handlers[handler.name] = handler;
        return true;
    };
    /**
     * Sort actions by priority.
     *
     * @param actions Actions to sort.
     * @return Sorted actions.
     */
    CoreContentLinksDelegate.prototype.sortActionsByPriority = function (actions) {
        var sorted = [];
        // Sort by priority.
        actions = actions.sort(function (a, b) {
            return a.priority <= b.priority ? 1 : -1;
        });
        // Fill result array.
        actions.forEach(function (entry) {
            sorted = sorted.concat(entry.actions);
        });
        return sorted;
    };
    CoreContentLinksDelegate = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider, CoreSitesProvider, CoreUrlUtilsProvider,
            CoreUtilsProvider])
    ], CoreContentLinksDelegate);
    return CoreContentLinksDelegate;
}());
export { CoreContentLinksDelegate };
//# sourceMappingURL=delegate.js.map