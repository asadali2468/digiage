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
import { CoreSitesProvider } from './sites';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Helper to store some temporary data for file submission.
 *
 * It uses siteId and component name to index the files.
 * Every component can provide a File area identifier to indentify every file list on the session.
 * This value can be the activity id or a mix of name and numbers.
 */
var CoreFileSessionProvider = /** @class */ (function () {
    function CoreFileSessionProvider(sitesProvider) {
        this.sitesProvider = sitesProvider;
        this.files = {};
    }
    /**
     * Add a file to the session.
     *
     * @param component Component Name.
     * @param id File area identifier.
     * @param file File to add.
     * @param siteId Site ID. If not defined, current site.
     */
    CoreFileSessionProvider.prototype.addFile = function (component, id, file, siteId) {
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        this.initFileArea(component, id, siteId);
        this.files[siteId][component][id].push(file);
    };
    /**
     * Clear files stored in session.
     *
     * @param component Component Name.
     * @param id File area identifier.
     * @param siteId Site ID. If not defined, current site.
     */
    CoreFileSessionProvider.prototype.clearFiles = function (component, id, siteId) {
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        if (this.files[siteId] && this.files[siteId][component] && this.files[siteId][component][id]) {
            this.files[siteId][component][id] = [];
        }
    };
    /**
     * Get files stored in session.
     *
     * @param component Component Name.
     * @param id File area identifier.
     * @param siteId Site ID. If not defined, current site.
     * @return Array of files in session.
     */
    CoreFileSessionProvider.prototype.getFiles = function (component, id, siteId) {
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        if (this.files[siteId] && this.files[siteId][component] && this.files[siteId][component][id]) {
            return this.files[siteId][component][id];
        }
        return [];
    };
    /**
     * Initializes the filearea to store the file.
     *
     * @param component Component Name.
     * @param id File area identifier.
     * @param siteId Site ID. If not defined, current site.
     */
    CoreFileSessionProvider.prototype.initFileArea = function (component, id, siteId) {
        if (!this.files[siteId]) {
            this.files[siteId] = {};
        }
        if (!this.files[siteId][component]) {
            this.files[siteId][component] = {};
        }
        if (!this.files[siteId][component][id]) {
            this.files[siteId][component][id] = [];
        }
    };
    /**
     * Remove a file stored in session.
     *
     * @param component Component Name.
     * @param id File area identifier.
     * @param file File to remove. The instance should be exactly the same as the one stored in session.
     * @param siteId Site ID. If not defined, current site.
     */
    CoreFileSessionProvider.prototype.removeFile = function (component, id, file, siteId) {
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        if (this.files[siteId] && this.files[siteId][component] && this.files[siteId][component][id]) {
            var position = this.files[siteId][component][id].indexOf(file);
            if (position != -1) {
                this.files[siteId][component][id].splice(position, 1);
            }
        }
    };
    /**
     * Remove a file stored in session.
     *
     * @param component Component Name.
     * @param id File area identifier.
     * @param index Position of the file to remove.
     * @param siteId Site ID. If not defined, current site.
     */
    CoreFileSessionProvider.prototype.removeFileByIndex = function (component, id, index, siteId) {
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        if (this.files[siteId] && this.files[siteId][component] && this.files[siteId][component][id] && index >= 0 &&
            index < this.files[siteId][component][id].length) {
            this.files[siteId][component][id].splice(index, 1);
        }
    };
    /**
     * Set a group of files in the session.
     *
     * @param component Component Name.
     * @param id File area identifier.
     * @param newFiles Files to set.
     * @param siteId Site ID. If not defined, current site.
     */
    CoreFileSessionProvider.prototype.setFiles = function (component, id, newFiles, siteId) {
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        this.initFileArea(component, id, siteId);
        this.files[siteId][component][id] = newFiles;
    };
    CoreFileSessionProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreSitesProvider])
    ], CoreFileSessionProvider);
    return CoreFileSessionProvider;
}());
export { CoreFileSessionProvider };
var CoreFileSession = /** @class */ (function (_super) {
    __extends(CoreFileSession, _super);
    function CoreFileSession() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreFileSession;
}(makeSingleton(CoreFileSessionProvider)));
export { CoreFileSession };
//# sourceMappingURL=file-session.js.map