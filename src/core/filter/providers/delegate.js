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
import { CoreEventsProvider } from '@providers/events';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreFilterDefaultHandler } from './default-filter';
import { CoreDelegate } from '@classes/delegate';
/**
 * Delegate to register filters.
 */
var CoreFilterDelegate = /** @class */ (function (_super) {
    __extends(CoreFilterDelegate, _super);
    function CoreFilterDelegate(loggerProvider, sitesProvider, eventsProvider, defaultHandler) {
        var _this = _super.call(this, 'CoreFilterDelegate', loggerProvider, sitesProvider, eventsProvider) || this;
        _this.sitesProvider = sitesProvider;
        _this.defaultHandler = defaultHandler;
        _this.featurePrefix = 'CoreFilterDelegate_';
        _this.handlerNameProperty = 'filterName';
        return _this;
    }
    /**
     * Apply a list of filters to some content.
     *
     * @param text The text to filter.
     * @param filters Filters to apply.
     * @param options Options passed to the filters.
     * @param skipFilters Names of filters that shouldn't be applied.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the filtered text.
     */
    CoreFilterDelegate.prototype.filterText = function (text, filters, options, skipFilters, siteId) {
        var _this = this;
        // Wait for filters to be initialized.
        return this.handlersInitPromise.then(function () {
            return _this.sitesProvider.getSite(siteId);
        }).then(function (site) {
            var promise = Promise.resolve(text);
            filters = filters || [];
            options = options || {};
            filters.forEach(function (filter) {
                if (!_this.isEnabledAndShouldApply(filter, options, site, skipFilters)) {
                    return;
                }
                promise = promise.then(function (text) {
                    return Promise.resolve(_this.executeFunctionOnEnabled(filter.filter, 'filter', [text, filter, options, siteId]))
                        .catch(function (error) {
                        _this.logger.error('Error applying filter' + filter.filter, error);
                        return text;
                    });
                });
            });
            return promise.then(function (text) {
                // Remove <nolink> tags for XHTML compatibility.
                text = text.replace(/<\/?nolink>/gi, '');
                return text;
            });
        });
    };
    /**
     * Get filters that have an enabled handler.
     *
     * @param contextLevel Context level of the filters.
     * @param instanceId Instance ID.
     * @return Filters.
     */
    CoreFilterDelegate.prototype.getEnabledFilters = function (contextLevel, instanceId) {
        var filters = [];
        for (var name_1 in this.enabledHandlers) {
            var handler = this.enabledHandlers[name_1];
            filters.push({
                contextid: -1,
                contextlevel: contextLevel,
                filter: handler.filterName,
                inheritedstate: 1,
                instanceid: instanceId,
                localstate: 1
            });
        }
        return filters;
    };
    /**
     * Let filters handle an HTML element.
     *
     * @param container The HTML container to handle.
     * @param filters Filters to apply.
     * @param viewContainerRef The ViewContainerRef where the container is.
     * @param options Options passed to the filters.
     * @param skipFilters Names of filters that shouldn't be applied.
     * @param component Component.
     * @param componentId Component ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreFilterDelegate.prototype.handleHtml = function (container, filters, viewContainerRef, options, skipFilters, component, componentId, siteId) {
        var _this = this;
        // Wait for filters to be initialized.
        return this.handlersInitPromise.then(function () {
            return _this.sitesProvider.getSite(siteId);
        }).then(function (site) {
            var promise = Promise.resolve();
            filters = filters || [];
            options = options || {};
            filters.forEach(function (filter) {
                if (!_this.isEnabledAndShouldApply(filter, options, site, skipFilters)) {
                    return;
                }
                promise = promise.then(function () {
                    return Promise.resolve(_this.executeFunctionOnEnabled(filter.filter, 'handleHtml', [container, filter, options, viewContainerRef, component, componentId, siteId])).catch(function (error) {
                        _this.logger.error('Error handling HTML' + filter.filter, error);
                    });
                });
            });
            return promise;
        });
    };
    /**
     * Check if a filter is enabled and should be applied.
     *
     * @param filters Filters to apply.
     * @param options Options passed to the filters.
     * @param site Site.
     * @param skipFilters Names of filters that shouldn't be applied.
     * @return Whether the filter is enabled and should be applied.
     */
    CoreFilterDelegate.prototype.isEnabledAndShouldApply = function (filter, options, site, skipFilters) {
        if (filter.localstate == -1 || (filter.localstate == 0 && filter.inheritedstate == -1)) {
            // Filter is disabled, ignore it.
            return false;
        }
        if (!this.shouldFilterBeApplied(filter, options, site)) {
            // Filter shouldn't be applied.
            return false;
        }
        if (skipFilters && skipFilters.indexOf(filter.filter) != -1) {
            // Skip this filter.
            return false;
        }
        return true;
    };
    /**
     * Check if at least 1 filter should be applied in a certain site and with certain options.
     *
     * @param filter Filter to check.
     * @param options Options passed to the filters.
     * @param site Site. If not defined, current site.
     * @return Promise resolved with true: whether the filter should be applied.
     */
    CoreFilterDelegate.prototype.shouldBeApplied = function (filters, options, site) {
        var _this = this;
        // Wait for filters to be initialized.
        return this.handlersInitPromise.then(function () {
            for (var i = 0; i < filters.length; i++) {
                if (_this.shouldFilterBeApplied(filters[i], options, site)) {
                    return true;
                }
            }
        });
    };
    /**
     * Check whether a filter should be applied in a certain site and with certain options.
     *
     * @param filter Filter to check.
     * @param options Options passed to the filters.
     * @param site Site. If not defined, current site.
     * @return Whether the filter should be applied.
     */
    CoreFilterDelegate.prototype.shouldFilterBeApplied = function (filter, options, site) {
        if (!this.hasHandler(filter.filter, true)) {
            return false;
        }
        return this.executeFunctionOnEnabled(filter.filter, 'shouldBeApplied', [options, site]);
    };
    CoreFilterDelegate = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider, CoreSitesProvider, CoreEventsProvider,
            CoreFilterDefaultHandler])
    ], CoreFilterDelegate);
    return CoreFilterDelegate;
}(CoreDelegate));
export { CoreFilterDelegate };
//# sourceMappingURL=delegate.js.map