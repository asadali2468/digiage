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
import { Injectable } from '@angular/core';
import { CoreAppProvider } from '@providers/app';
import { CoreEventsProvider } from '@providers/events';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreSite } from '@classes/site';
import { CoreTextUtilsProvider } from '@providers/utils/text';
import { CoreFilterDelegate } from './delegate';
/**
 * Service to provide filter functionalities.
 */
var CoreFilterProvider = /** @class */ (function () {
    function CoreFilterProvider(logger, eventsProvider, sitesProvider, textUtils, filterDelegate, appProvider) {
        var _this = this;
        this.sitesProvider = sitesProvider;
        this.textUtils = textUtils;
        this.filterDelegate = filterDelegate;
        this.appProvider = appProvider;
        this.ROOT_CACHE_KEY = 'mmFilter:';
        /**
         * Store the contexts in memory to speed up the process, it can take a lot of time otherwise.
         */
        this.contextsCache = {};
        this.logger = logger.getInstance('CoreFilterProvider');
        eventsProvider.on(CoreEventsProvider.WS_CACHE_INVALIDATED, function (data) {
            delete _this.contextsCache[data.siteId];
        });
        eventsProvider.on(CoreEventsProvider.SITE_STORAGE_DELETED, function (data) {
            delete _this.contextsCache[data.siteId];
        });
    }
    /**
     * Returns whether or not WS get available in context is available.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with true if ws is available, false otherwise.
     * @since 3.4
     */
    CoreFilterProvider.prototype.canGetAvailableInContext = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return _this.canGetAvailableInContextInSite(site);
        });
    };
    /**
     * Returns whether or not WS get available in context is available in a certain site.
     *
     * @param site Site. If not defined, current site.
     * @return Promise resolved with true if ws is available, false otherwise.
     * @since 3.4
     */
    CoreFilterProvider.prototype.canGetAvailableInContextInSite = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.wsAvailable('core_filters_get_available_in_context');
    };
    /**
     * Returns whether or not we can get the available filters: the WS is available and the feature isn't disabled.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with boolean: whethe can get filters.
     */
    CoreFilterProvider.prototype.canGetFilters = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var wsAvailable, disabled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.canGetAvailableInContext(siteId)];
                    case 1:
                        wsAvailable = _a.sent();
                        return [4 /*yield*/, this.checkFiltersDisabled(siteId)];
                    case 2:
                        disabled = _a.sent();
                        return [2 /*return*/, wsAvailable && !disabled];
                }
            });
        });
    };
    /**
     * Returns whether or not we can get the available filters: the WS is available and the feature isn't disabled.
     *
     * @param site Site. If not defined, current site.
     * @return Promise resolved with boolean: whethe can get filters.
     */
    CoreFilterProvider.prototype.canGetFiltersInSite = function (site) {
        return this.canGetAvailableInContextInSite(site) && this.checkFiltersDisabledInSite(site);
    };
    /**
     * Returns whether or not checking the available filters is disabled in the site.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with boolean: whether it's disabled.
     */
    CoreFilterProvider.prototype.checkFiltersDisabled = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sitesProvider.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        return [2 /*return*/, this.checkFiltersDisabledInSite(site)];
                }
            });
        });
    };
    /**
     * Returns whether or not checking the available filters is disabled in the site.
     *
     * @param site Site. If not defined, current site.
     * @return Whether it's disabled.
     */
    CoreFilterProvider.prototype.checkFiltersDisabledInSite = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.isFeatureDisabled('CoreFilterDelegate');
    };
    /**
     * Given some HTML code, this function returns the text as safe HTML.
     *
     * @param text The text to be formatted.
     * @param options Formatting options.
     * @param filters The filters to apply. Required if filter is set to true.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the formatted text.
     */
    CoreFilterProvider.prototype.formatText = function (text, options, filters, siteId) {
        var _this = this;
        if (!text || typeof text != 'string') {
            // No need to do any filters and cleaning.
            return Promise.resolve('');
        }
        // Clone object if needed so we can modify it.
        options = options ? Object.assign({}, options) : {};
        if (typeof options.clean == 'undefined') {
            options.clean = false;
        }
        if (typeof options.filter == 'undefined') {
            options.filter = true;
        }
        if (!options.contextLevel) {
            options.filter = false;
        }
        var promise;
        if (options.filter) {
            promise = this.filterDelegate.filterText(text, filters, options, [], siteId);
        }
        else {
            promise = Promise.resolve(text);
        }
        return promise.then(function (text) {
            if (options.clean) {
                text = _this.textUtils.cleanTags(text, options.singleLine);
            }
            if (options.shortenLength > 0) {
                text = _this.textUtils.shortenText(text, options.shortenLength);
            }
            if (options.highlight) {
                text = _this.textUtils.highlightText(text, options.highlight);
            }
            return text;
        });
    };
    /**
     * Get cache key for available in contexts WS calls.
     *
     * @param contexts The contexts to check.
     * @return Cache key.
     */
    CoreFilterProvider.prototype.getAvailableInContextsCacheKey = function (contexts) {
        return this.getAvailableInContextsPrefixCacheKey() + JSON.stringify(contexts);
    };
    /**
     * Get prefixed cache key for available in contexts WS calls.
     *
     * @return Cache key.
     */
    CoreFilterProvider.prototype.getAvailableInContextsPrefixCacheKey = function () {
        return this.ROOT_CACHE_KEY + 'availableInContexts:';
    };
    /**
     * Get the filters available in several contexts.
     *
     * @param contexts The contexts to check.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the filters classified by context.
     */
    CoreFilterProvider.prototype.getAvailableInContexts = function (contexts, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            siteId = site.getId();
            var result = _this.getFromMemoryCache(contexts, site);
            if (result) {
                return result;
            }
            _this.contextsCache[siteId] = _this.contextsCache[siteId] || {};
            var hasSystemContext = false, hasSiteHomeContext = false;
            var contextsToSend = contexts.slice(); // Copy the contexts array to be able to modify it.
            // Check if any of the contexts is "system". We cannot use system context, so we'll have to use a wrokaround.
            for (var i = 0; i < contextsToSend.length; i++) {
                var context = contextsToSend[i];
                if (context.contextlevel == 'system') {
                    hasSystemContext = true;
                    // Use course site home instead. Check if it's already in the list.
                    hasSiteHomeContext = contextsToSend.some(function (context) {
                        return context.contextlevel == 'course' && context.instanceid == site.getSiteHomeId();
                    });
                    if (hasSiteHomeContext) {
                        // Site home is already in list, remove this context from the list.
                        contextsToSend.splice(i, 1);
                    }
                    else {
                        // Site home not in list, use it instead of system.
                        contextsToSend[i] = {
                            contextlevel: 'course',
                            instanceid: site.getSiteHomeId()
                        };
                    }
                    break;
                }
            }
            var data = {
                contexts: contextsToSend,
            }, preSets = {
                cacheKey: _this.getAvailableInContextsCacheKey(contextsToSend),
                updateFrequency: CoreSite.FREQUENCY_RARELY,
                splitRequest: {
                    param: 'contexts',
                    maxLength: 300,
                },
            };
            return site.read('core_filters_get_available_in_context', data, preSets)
                .then(function (result) {
                var classified = {};
                // Initialize all contexts.
                contexts.forEach(function (context) {
                    classified[context.contextlevel] = classified[context.contextlevel] || {};
                    classified[context.contextlevel][context.instanceid] = [];
                });
                if (contexts.length == 1 && !hasSystemContext) {
                    // Only 1 context, no need to iterate over the filters.
                    classified[contexts[0].contextlevel][contexts[0].instanceid] = result.filters;
                    _this.storeInMemoryCache(classified, siteId);
                    return classified;
                }
                result.filters.forEach(function (filter) {
                    if (hasSystemContext && filter.contextlevel == 'course' && filter.instanceid == site.getSiteHomeId()) {
                        if (hasSiteHomeContext) {
                            // We need to return both site home and system. Add site home first.
                            classified[filter.contextlevel][filter.instanceid].push(filter);
                            // Now copy the object so it can be modified.
                            filter = Object.assign({}, filter);
                        }
                        // Simulate the system context based on the inherited data.
                        filter.contextlevel = 'system';
                        filter.instanceid = 0;
                        filter.contextid = -1;
                        filter.localstate = filter.inheritedstate;
                    }
                    classified[filter.contextlevel][filter.instanceid].push(filter);
                });
                _this.storeInMemoryCache(classified, siteId);
                return classified;
            });
        });
    };
    /**
     * Get the filters available in a certain context.
     *
     * @param contextLevel The context level to check: system, user, coursecat, course, module, block, ...
     * @param instanceId The instance ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the filters.
     */
    CoreFilterProvider.prototype.getAvailableInContext = function (contextLevel, instanceId, siteId) {
        return this.getAvailableInContexts([{ contextlevel: contextLevel, instanceid: instanceId }], siteId).then(function (result) {
            return result[contextLevel][instanceId];
        });
    };
    /**
     * Get contexts filters from the memory cache.
     *
     * @param contexts Contexts to get.
     * @param site Site.
     * @return The filters classified by context and instance.
     */
    CoreFilterProvider.prototype.getFromMemoryCache = function (contexts, site) {
        if (this.contextsCache[site.getId()]) {
            // Check if we have the contexts in the memory cache.
            var siteContexts = this.contextsCache[site.getId()], isOnline = this.appProvider.isOnline(), result = {};
            var allFound = true;
            for (var i = 0; i < contexts.length; i++) {
                var context = contexts[i], cachedCtxt = siteContexts[context.contextlevel] && siteContexts[context.contextlevel][context.instanceid];
                // Check the context isn't "expired". The time stored in this cache will not match the one in the site cache.
                if (cachedCtxt && (!isOnline ||
                    Date.now() <= cachedCtxt.time + site.getExpirationDelay(CoreSite.FREQUENCY_RARELY))) {
                    result[context.contextlevel] = result[context.contextlevel] || {};
                    result[context.contextlevel][context.instanceid] = cachedCtxt.filters;
                }
                else {
                    allFound = false;
                    break;
                }
            }
            if (allFound) {
                return result;
            }
        }
    };
    /**
     * Invalidates all available in context WS calls.
     *
     * @param siteId Site ID (empty for current site).
     * @return Promise resolved when the data is invalidated.
     */
    CoreFilterProvider.prototype.invalidateAllAvailableInContext = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKeyStartingWith(_this.getAvailableInContextsPrefixCacheKey());
        });
    };
    /**
     * Invalidates available in context WS call.
     *
     * @param contexts The contexts to check.
     * @param siteId Site ID (empty for current site).
     * @return Promise resolved when the data is invalidated.
     */
    CoreFilterProvider.prototype.invalidateAvailableInContexts = function (contexts, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getAvailableInContextsCacheKey(contexts));
        });
    };
    /**
     * Invalidates available in context WS call.
     *
     * @param contextLevel The context level to check.
     * @param instanceId The instance ID.
     * @param siteId Site ID (empty for current site).
     * @return Promise resolved when the data is invalidated.
     */
    CoreFilterProvider.prototype.invalidateAvailableInContext = function (contextLevel, instanceId, siteId) {
        return this.invalidateAvailableInContexts([{ contextlevel: contextLevel, instanceid: instanceId }], siteId);
    };
    /**
     * Store filters in the memory cache.
     *
     * @param filters Filters to store, classified by contextlevel and instanceid
     * @param siteId Site ID.
     */
    CoreFilterProvider.prototype.storeInMemoryCache = function (filters, siteId) {
        for (var contextLevel in filters) {
            this.contextsCache[siteId][contextLevel] = this.contextsCache[siteId][contextLevel] || {};
            for (var instanceId in filters[contextLevel]) {
                this.contextsCache[siteId][contextLevel][instanceId] = {
                    filters: filters[contextLevel][instanceId],
                    time: Date.now()
                };
            }
        }
    };
    CoreFilterProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            CoreEventsProvider,
            CoreSitesProvider,
            CoreTextUtilsProvider,
            CoreFilterDelegate,
            CoreAppProvider])
    ], CoreFilterProvider);
    return CoreFilterProvider;
}());
export { CoreFilterProvider };
//# sourceMappingURL=filter.js.map