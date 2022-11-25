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
/**
 * Default handler used when the module doesn't have a specific implementation.
 */
var CoreFilterDefaultHandler = /** @class */ (function () {
    function CoreFilterDefaultHandler() {
        this.name = 'CoreFilterDefaultHandler';
        this.filterName = 'default';
        // Nothing to do.
    }
    /**
     * Filter some text.
     *
     * @param text The text to filter.
     * @param filter The filter.
     * @param options Options passed to the filters.
     * @param siteId Site ID. If not defined, current site.
     * @return Filtered text (or promise resolved with the filtered text).
     */
    CoreFilterDefaultHandler.prototype.filter = function (text, filter, options, siteId) {
        return text;
    };
    /**
     * Handle HTML. This function is called after "filter", and it will receive an HTMLElement containing the text that was
     * filtered.
     *
     * @param container The HTML container to handle.
     * @param filter The filter.
     * @param options Options passed to the filters.
     * @param viewContainerRef The ViewContainerRef where the container is.
     * @param component Component.
     * @param componentId Component ID.
     * @param siteId Site ID. If not defined, current site.
     * @return If async, promise resolved when done.
     */
    CoreFilterDefaultHandler.prototype.handleHtml = function (container, filter, options, viewContainerRef, component, componentId, siteId) {
        // To be overridden.
    };
    /**
     * Whether or not the handler is enabled on a site level.
     *
     * @return Whether or not the handler is enabled on a site level.
     */
    CoreFilterDefaultHandler.prototype.isEnabled = function () {
        return true;
    };
    /**
     * Check if the filter should be applied in a certain site based on some filter options.
     *
     * @param options Options.
     * @param site Site.
     * @return Whether filter should be applied.
     */
    CoreFilterDefaultHandler.prototype.shouldBeApplied = function (options, site) {
        return true;
    };
    CoreFilterDefaultHandler = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], CoreFilterDefaultHandler);
    return CoreFilterDefaultHandler;
}());
export { CoreFilterDefaultHandler };
//# sourceMappingURL=default-filter.js.map