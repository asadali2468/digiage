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
import { CoreDelegate } from '@classes/delegate';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { BehaviorSubject } from 'rxjs';
/**
 * Service to interact with plugins to be shown in the main menu. Provides functions to register a plugin
 * and notify an update in the data.
 */
var CoreMainMenuDelegate = /** @class */ (function (_super) {
    __extends(CoreMainMenuDelegate, _super);
    function CoreMainMenuDelegate(loggerProvider, sitesProvider, eventsProvider) {
        var _this = _super.call(this, 'CoreMainMenuDelegate', loggerProvider, sitesProvider, eventsProvider) || this;
        _this.loggerProvider = loggerProvider;
        _this.sitesProvider = sitesProvider;
        _this.eventsProvider = eventsProvider;
        _this.loaded = false;
        _this.siteHandlers = new BehaviorSubject([]);
        _this.featurePrefix = 'CoreMainMenuDelegate_';
        eventsProvider.on(CoreEventsProvider.LOGOUT, _this.clearSiteHandlers.bind(_this));
        return _this;
    }
    /**
     * Check if handlers are loaded.
     *
     * @return True if handlers are loaded, false otherwise.
     */
    CoreMainMenuDelegate.prototype.areHandlersLoaded = function () {
        return this.loaded;
    };
    /**
     * Clear current site handlers. Reserved for core use.
     */
    CoreMainMenuDelegate.prototype.clearSiteHandlers = function () {
        this.loaded = false;
        this.siteHandlers.next([]);
    };
    /**
     * Get the handlers for the current site.
     *
     * @return An observable that will receive the handlers.
     */
    CoreMainMenuDelegate.prototype.getHandlers = function () {
        return this.siteHandlers;
    };
    /**
     * Update handlers Data.
     */
    CoreMainMenuDelegate.prototype.updateData = function () {
        var handlersData = [];
        for (var name_1 in this.enabledHandlers) {
            var handler = this.enabledHandlers[name_1], data = handler.getDisplayData();
            handlersData.push({
                name: name_1,
                data: data,
                priority: handler.priority || 0,
            });
        }
        // Sort them by priority.
        handlersData.sort(function (a, b) {
            return b.priority - a.priority;
        });
        // Return only the display data.
        var displayData = handlersData.map(function (item) {
            // Move the name and the priority to the display data.
            item.data.name = item.name;
            item.data.priority = item.priority;
            return item.data;
        });
        this.loaded = true;
        this.siteHandlers.next(displayData);
    };
    CoreMainMenuDelegate = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider, CoreSitesProvider,
            CoreEventsProvider])
    ], CoreMainMenuDelegate);
    return CoreMainMenuDelegate;
}(CoreDelegate));
export { CoreMainMenuDelegate };
//# sourceMappingURL=delegate.js.map