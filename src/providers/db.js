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
import { SQLite } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { SQLiteDB } from '@classes/sqlitedb';
import { SQLiteDBMock } from '@core/emulator/classes/sqlitedb';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * This service allows interacting with the local database to store and retrieve data.
 */
var CoreDbProvider = /** @class */ (function () {
    function CoreDbProvider(sqlite, platform) {
        this.sqlite = sqlite;
        this.platform = platform;
        this.dbInstances = {};
    }
    /**
     * Get or create a database object.
     *
     * The database objects are cached statically.
     *
     * @param name DB name.
     * @param forceNew True if it should always create a new instance.
     * @return DB.
     */
    CoreDbProvider.prototype.getDB = function (name, forceNew) {
        if (typeof this.dbInstances[name] === 'undefined' || forceNew) {
            if (this.platform.is('cordova')) {
                this.dbInstances[name] = new SQLiteDB(name, this.sqlite, this.platform);
            }
            else {
                this.dbInstances[name] = new SQLiteDBMock(name);
            }
        }
        return this.dbInstances[name];
    };
    /**
     * Delete a DB.
     *
     * @param name DB name.
     * @return Promise resolved when the DB is deleted.
     */
    CoreDbProvider.prototype.deleteDB = function (name) {
        var _this = this;
        var promise;
        if (typeof this.dbInstances[name] != 'undefined') {
            // Close the database first.
            promise = this.dbInstances[name].close();
        }
        else {
            promise = Promise.resolve();
        }
        return promise.then(function () {
            var db = _this.dbInstances[name];
            delete _this.dbInstances[name];
            if (_this.platform.is('cordova')) {
                return _this.sqlite.deleteDatabase({
                    name: name,
                    location: 'default'
                });
            }
            else {
                // In WebSQL we cannot delete the database, just empty it.
                return db.emptyDatabase();
            }
        });
    };
    CoreDbProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [SQLite, Platform])
    ], CoreDbProvider);
    return CoreDbProvider;
}());
export { CoreDbProvider };
var CoreDB = /** @class */ (function (_super) {
    __extends(CoreDB, _super);
    function CoreDB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreDB;
}(makeSingleton(CoreDbProvider)));
export { CoreDB };
//# sourceMappingURL=db.js.map