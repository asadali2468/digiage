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
import { CoreSitesProvider } from '@providers/sites';
/**
 * Service to handle offline user preferences.
 */
var CoreUserOfflineProvider = /** @class */ (function () {
    function CoreUserOfflineProvider(sitesProvider) {
        this.sitesProvider = sitesProvider;
        this.siteSchema = {
            name: 'CoreUserOfflineProvider',
            version: 1,
            tables: [
                {
                    name: CoreUserOfflineProvider_1.PREFERENCES_TABLE,
                    columns: [
                        {
                            name: 'name',
                            type: 'TEXT',
                            unique: true,
                            notNull: true
                        },
                        {
                            name: 'value',
                            type: 'TEXT'
                        },
                        {
                            name: 'onlinevalue',
                            type: 'TEXT'
                        },
                    ]
                }
            ]
        };
        this.sitesProvider.registerSiteSchema(this.siteSchema);
    }
    CoreUserOfflineProvider_1 = CoreUserOfflineProvider;
    /**
     * Get preferences that were changed offline.
     *
     * @return Promise resolved with list of preferences.
     */
    CoreUserOfflineProvider.prototype.getChangedPreferences = function (siteId) {
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.getDb().getRecordsSelect(CoreUserOfflineProvider_1.PREFERENCES_TABLE, 'value != onlineValue');
        });
    };
    /**
     * Get an offline preference.
     *
     * @param name Name of the preference.
     * @return Promise resolved with the preference, rejected if not found.
     */
    CoreUserOfflineProvider.prototype.getPreference = function (name, siteId) {
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var conditions = { name: name };
            return site.getDb().getRecord(CoreUserOfflineProvider_1.PREFERENCES_TABLE, conditions);
        });
    };
    /**
     * Set an offline preference.
     *
     * @param name Name of the preference.
     * @param value Value of the preference.
     * @param onlineValue Online value of the preference. If unedfined, preserve previously stored value.
     * @return Promise resolved when done.
     */
    CoreUserOfflineProvider.prototype.setPreference = function (name, value, onlineValue, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var promise;
            if (typeof onlineValue == 'undefined') {
                promise = _this.getPreference(name, site.id).then(function (preference) { return preference.onlinevalue; });
            }
            else {
                promise = Promise.resolve(onlineValue);
            }
            return promise.then(function (onlineValue) {
                var record = { name: name, value: value, onlinevalue: onlineValue };
                return site.getDb().insertRecord(CoreUserOfflineProvider_1.PREFERENCES_TABLE, record);
            });
        });
    };
    // Variables for database.
    CoreUserOfflineProvider.PREFERENCES_TABLE = 'user_preferences';
    CoreUserOfflineProvider = CoreUserOfflineProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreSitesProvider])
    ], CoreUserOfflineProvider);
    return CoreUserOfflineProvider;
    var CoreUserOfflineProvider_1;
}());
export { CoreUserOfflineProvider };
//# sourceMappingURL=offline.js.map