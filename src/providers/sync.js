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
import { CoreEventsProvider } from './events';
import { CoreSitesProvider } from './sites';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * Service that provides some features regarding synchronization.
*/
var CoreSyncProvider = /** @class */ (function () {
    function CoreSyncProvider(eventsProvider, sitesProvider) {
        var _this = this;
        this.sitesProvider = sitesProvider;
        // Variables for the database.
        this.SYNC_TABLE = 'sync';
        this.siteSchema = {
            name: 'CoreSyncProvider',
            version: 1,
            tables: [
                {
                    name: this.SYNC_TABLE,
                    columns: [
                        {
                            name: 'component',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'id',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'time',
                            type: 'INTEGER'
                        },
                        {
                            name: 'warnings',
                            type: 'TEXT'
                        }
                    ],
                    primaryKeys: ['component', 'id']
                }
            ]
        };
        // Store blocked sync objects.
        this.blockedItems = {};
        this.sitesProvider.registerSiteSchema(this.siteSchema);
        // Unblock all blocks on logout.
        eventsProvider.on(CoreEventsProvider.LOGOUT, function (data) {
            _this.clearAllBlocks(data.siteId);
        });
    }
    /**
     * Block a component and ID so it cannot be synchronized.
     *
     * @param component Component name.
     * @param id Unique ID per component.
     * @param operation Operation name. If not defined, a default text is used.
     * @param siteId Site ID. If not defined, current site.
     */
    CoreSyncProvider.prototype.blockOperation = function (component, id, operation, siteId) {
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        var uniqueId = this.getUniqueSyncBlockId(component, id);
        if (!this.blockedItems[siteId]) {
            this.blockedItems[siteId] = {};
        }
        if (!this.blockedItems[siteId][uniqueId]) {
            this.blockedItems[siteId][uniqueId] = {};
        }
        operation = operation || '-';
        this.blockedItems[siteId][uniqueId][operation] = true;
    };
    /**
     * Clear all blocks for a site or all sites.
     *
     * @param siteId If set, clear the blocked objects only for this site. Otherwise clear them for all sites.
     */
    CoreSyncProvider.prototype.clearAllBlocks = function (siteId) {
        if (siteId) {
            delete this.blockedItems[siteId];
        }
        else {
            this.blockedItems = {};
        }
    };
    /**
     * Clear all blocks for a certain component.
     *
     * @param component Component name.
     * @param id Unique ID per component.
     * @param siteId Site ID. If not defined, current site.
     */
    CoreSyncProvider.prototype.clearBlocks = function (component, id, siteId) {
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        var uniqueId = this.getUniqueSyncBlockId(component, id);
        if (this.blockedItems[siteId]) {
            delete this.blockedItems[siteId][uniqueId];
        }
    };
    /**
     * Returns a sync record.
     * @param component Component name.
     * @param id Unique ID per component.
     * @param siteId Site ID. If not defined, current site.
     * @return Record if found or reject.
     */
    CoreSyncProvider.prototype.getSyncRecord = function (component, id, siteId) {
        var _this = this;
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            return db.getRecord(_this.SYNC_TABLE, { component: component, id: id });
        });
    };
    /**
     * Inserts or Updates info of a sync record.
     * @param component Component name.
     * @param id Unique ID per component.
     * @param data Data that updates the record.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with done.
     */
    CoreSyncProvider.prototype.insertOrUpdateSyncRecord = function (component, id, data, siteId) {
        var _this = this;
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            data.component = component;
            data.id = id;
            return db.insertRecord(_this.SYNC_TABLE, data);
        });
    };
    /**
     * Convenience function to create unique identifiers for a component and id.
     *
     * @param component Component name.
     * @param id Unique ID per component.
     * @return Unique sync id.
     */
    CoreSyncProvider.prototype.getUniqueSyncBlockId = function (component, id) {
        return component + '#' + id;
    };
    /**
     * Check if a component is blocked.
     * One block can have different operations. Here we check how many operations are being blocking the object.
     *
     * @param component Component name.
     * @param id Unique ID per component.
     * @param siteId Site ID. If not defined, current site.
     * @return Whether it's blocked.
     */
    CoreSyncProvider.prototype.isBlocked = function (component, id, siteId) {
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        if (!this.blockedItems[siteId]) {
            return false;
        }
        var uniqueId = this.getUniqueSyncBlockId(component, id);
        if (!this.blockedItems[siteId][uniqueId]) {
            return false;
        }
        return Object.keys(this.blockedItems[siteId][uniqueId]).length > 0;
    };
    /**
     * Unblock an operation on a component and ID.
     *
     * @param component Component name.
     * @param id Unique ID per component.
     * @param operation Operation name. If not defined, a default text is used.
     * @param siteId Site ID. If not defined, current site.
     */
    CoreSyncProvider.prototype.unblockOperation = function (component, id, operation, siteId) {
        operation = operation || '-';
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        var uniqueId = this.getUniqueSyncBlockId(component, id);
        if (this.blockedItems[siteId] && this.blockedItems[siteId][uniqueId]) {
            delete this.blockedItems[siteId][uniqueId][operation];
        }
    };
    CoreSyncProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreEventsProvider, CoreSitesProvider])
    ], CoreSyncProvider);
    return CoreSyncProvider;
}());
export { CoreSyncProvider };
var CoreSync = /** @class */ (function (_super) {
    __extends(CoreSync, _super);
    function CoreSync() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreSync;
}(makeSingleton(CoreSyncProvider)));
export { CoreSync };
//# sourceMappingURL=sync.js.map