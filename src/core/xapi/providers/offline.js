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
import { CoreSites } from '@providers/sites';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Service to handle offline xAPI.
 */
var CoreXAPIOfflineProvider = /** @class */ (function () {
    function CoreXAPIOfflineProvider() {
        this.siteSchema = {
            name: 'CoreXAPIOfflineProvider',
            version: 1,
            tables: [
                {
                    name: CoreXAPIOfflineProvider_1.STATEMENTS_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'INTEGER',
                            primaryKey: true,
                            autoIncrement: true,
                        },
                        {
                            name: 'contextid',
                            type: 'INTEGER'
                        },
                        {
                            name: 'component',
                            type: 'TEXT'
                        },
                        {
                            name: 'statements',
                            type: 'TEXT'
                        },
                        {
                            name: 'timecreated',
                            type: 'INTEGER'
                        },
                        {
                            name: 'courseid',
                            type: 'INTEGER'
                        },
                        {
                            name: 'extra',
                            type: 'TEXT'
                        },
                    ],
                }
            ]
        };
        this.dbReady = CoreSites.instance.registerSiteSchema(this.siteSchema);
    }
    CoreXAPIOfflineProvider_1 = CoreXAPIOfflineProvider;
    /**
     * Check if there are offline statements to send for a context.
     *
     * @param contextId Context ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with boolean: true if has offline statements, false otherwise.
     */
    CoreXAPIOfflineProvider.prototype.contextHasStatements = function (contextId, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var statementsList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContextStatements(contextId, siteId)];
                    case 1:
                        statementsList = _a.sent();
                        return [2 /*return*/, statementsList && statementsList.length > 0];
                }
            });
        });
    };
    /**
     * Delete certain statements.
     *
     * @param id ID of the statements.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved if stored, rejected if failure.
     */
    CoreXAPIOfflineProvider.prototype.deleteStatements = function (id, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSiteDB(siteId)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.deleteRecords(CoreXAPIOfflineProvider_1.STATEMENTS_TABLE, { id: id })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete all statements of a certain context.
     *
     * @param contextId Context ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved if stored, rejected if failure.
     */
    CoreXAPIOfflineProvider.prototype.deleteStatementsForContext = function (contextId, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSiteDB(siteId)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.deleteRecords(CoreXAPIOfflineProvider_1.STATEMENTS_TABLE, { contextid: contextId })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all offline statements.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with all the data.
     */
    CoreXAPIOfflineProvider.prototype.getAllStatements = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSiteDB(siteId)];
                    case 1:
                        db = _a.sent();
                        return [2 /*return*/, db.getRecords(CoreXAPIOfflineProvider_1.STATEMENTS_TABLE, undefined, 'timecreated ASC')];
                }
            });
        });
    };
    /**
     * Get statements for a context.
     *
     * @param contextId Context ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the data.
     */
    CoreXAPIOfflineProvider.prototype.getContextStatements = function (contextId, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSiteDB(siteId)];
                    case 1:
                        db = _a.sent();
                        return [2 /*return*/, db.getRecords(CoreXAPIOfflineProvider_1.STATEMENTS_TABLE, { contextid: contextId }, 'timecreated ASC')];
                }
            });
        });
    };
    /**
     * Get certain statements.
     *
     * @param id ID of the statements.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the data.
     */
    CoreXAPIOfflineProvider.prototype.getStatements = function (id, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSiteDB(siteId)];
                    case 1:
                        db = _a.sent();
                        return [2 /*return*/, db.getRecord(CoreXAPIOfflineProvider_1.STATEMENTS_TABLE, { id: id })];
                }
            });
        });
    };
    /**
     * Save statements.
     *
     * @param contextId Context ID.
     * @param component  Component to send the statements to.
     * @param statements Statements (JSON-encoded).
     * @param options Options.
     * @return Promise resolved when statements are successfully saved.
     */
    CoreXAPIOfflineProvider.prototype.saveStatements = function (contextId, component, statements, options) {
        return __awaiter(this, void 0, void 0, function () {
            var db, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSiteDB(options.siteId)];
                    case 1:
                        db = _a.sent();
                        entry = {
                            contextid: contextId,
                            component: component,
                            statements: statements,
                            timecreated: Date.now(),
                            courseid: options.courseId,
                            extra: options.extra,
                        };
                        return [4 /*yield*/, db.insertRecord(CoreXAPIOfflineProvider_1.STATEMENTS_TABLE, entry)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get Site database when ready.
     *
     * @param siteId Site id.
     * @return SQLiteDB Site database.
     */
    CoreXAPIOfflineProvider.prototype.getSiteDB = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, CoreSites.instance.getSiteDb(siteId)];
                }
            });
        });
    };
    // Variables for database.
    CoreXAPIOfflineProvider.STATEMENTS_TABLE = 'core_xapi_statements';
    CoreXAPIOfflineProvider = CoreXAPIOfflineProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], CoreXAPIOfflineProvider);
    return CoreXAPIOfflineProvider;
    var CoreXAPIOfflineProvider_1;
}());
export { CoreXAPIOfflineProvider };
var CoreXAPIOffline = /** @class */ (function (_super) {
    __extends(CoreXAPIOffline, _super);
    function CoreXAPIOffline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreXAPIOffline;
}(makeSingleton(CoreXAPIOfflineProvider)));
export { CoreXAPIOffline };
//# sourceMappingURL=offline.js.map