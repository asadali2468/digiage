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
import { CoreLogger } from '@providers/logger';
import { CoreSites } from '@providers/sites';
import { CoreSite } from '@classes/site';
import { CoreTextUtils } from '@providers/utils/text';
import { CoreUrlUtils } from '@providers/utils/url';
import { CoreQueueRunner } from '@classes/queue-runner';
import { CoreH5PCore } from '../classes/core';
import { CoreH5PFramework } from '../classes/framework';
import { CoreH5PPlayer } from '../classes/player';
import { CoreH5PStorage } from '../classes/storage';
import { CoreH5PValidator } from '../classes/validator';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Service to provide H5P functionalities.
 */
var CoreH5PProvider = /** @class */ (function () {
    function CoreH5PProvider() {
        this.siteSchema = {
            name: 'CoreH5PProvider',
            version: 1,
            canBeCleared: [
                CoreH5PProvider_1.CONTENT_TABLE,
                CoreH5PProvider_1.LIBRARIES_TABLE,
                CoreH5PProvider_1.LIBRARY_DEPENDENCIES_TABLE,
                CoreH5PProvider_1.CONTENTS_LIBRARIES_TABLE,
                CoreH5PProvider_1.LIBRARIES_CACHEDASSETS_TABLE,
            ],
            tables: [
                {
                    name: CoreH5PProvider_1.CONTENT_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'INTEGER',
                            primaryKey: true,
                            autoIncrement: true
                        },
                        {
                            name: 'jsoncontent',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'mainlibraryid',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'foldername',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'fileurl',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'filtered',
                            type: 'TEXT'
                        },
                        {
                            name: 'timecreated',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'timemodified',
                            type: 'INTEGER',
                            notNull: true
                        }
                    ]
                },
                {
                    name: CoreH5PProvider_1.LIBRARIES_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'INTEGER',
                            primaryKey: true,
                            autoIncrement: true
                        },
                        {
                            name: 'machinename',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'title',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'majorversion',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'minorversion',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'patchversion',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'runnable',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'fullscreen',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'embedtypes',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'preloadedjs',
                            type: 'TEXT'
                        },
                        {
                            name: 'preloadedcss',
                            type: 'TEXT'
                        },
                        {
                            name: 'droplibrarycss',
                            type: 'TEXT'
                        },
                        {
                            name: 'semantics',
                            type: 'TEXT'
                        },
                        {
                            name: 'addto',
                            type: 'TEXT'
                        }
                    ]
                },
                {
                    name: CoreH5PProvider_1.LIBRARY_DEPENDENCIES_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'INTEGER',
                            primaryKey: true,
                            autoIncrement: true
                        },
                        {
                            name: 'libraryid',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'requiredlibraryid',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'dependencytype',
                            type: 'TEXT',
                            notNull: true
                        }
                    ]
                },
                {
                    name: CoreH5PProvider_1.CONTENTS_LIBRARIES_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'INTEGER',
                            primaryKey: true,
                            autoIncrement: true
                        },
                        {
                            name: 'h5pid',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'libraryid',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'dependencytype',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'dropcss',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'weight',
                            type: 'INTEGER',
                            notNull: true
                        }
                    ]
                },
                {
                    name: CoreH5PProvider_1.LIBRARIES_CACHEDASSETS_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'INTEGER',
                            primaryKey: true,
                            autoIncrement: true
                        },
                        {
                            name: 'libraryid',
                            type: 'INTEGER',
                            notNull: true
                        },
                        {
                            name: 'hash',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'foldername',
                            type: 'TEXT',
                            notNull: true
                        }
                    ]
                }
            ]
        };
        this.ROOT_CACHE_KEY = 'CoreH5P:';
        this.logger = CoreLogger.instance.getInstance('CoreH5PProvider');
        this.queueRunner = new CoreQueueRunner(1);
        CoreSites.instance.registerSiteSchema(this.siteSchema);
        this.h5pValidator = new CoreH5PValidator();
        this.h5pFramework = new CoreH5PFramework();
        this.h5pCore = new CoreH5PCore(this.h5pFramework);
        this.h5pStorage = new CoreH5PStorage(this.h5pCore, this.h5pFramework);
        this.h5pPlayer = new CoreH5PPlayer(this.h5pCore, this.h5pStorage);
    }
    CoreH5PProvider_1 = CoreH5PProvider;
    /**
     * Returns whether or not WS to get trusted H5P file is available.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with true if ws is available, false otherwise.
     * @since 3.8
     */
    CoreH5PProvider.prototype.canGetTrustedH5PFile = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        return [2 /*return*/, this.canGetTrustedH5PFileInSite(site)];
                }
            });
        });
    };
    /**
     * Returns whether or not WS to get trusted H5P file is available in a certain site.
     *
     * @param site Site. If not defined, current site.
     * @return Promise resolved with true if ws is available, false otherwise.
     * @since 3.8
     */
    CoreH5PProvider.prototype.canGetTrustedH5PFileInSite = function (site) {
        site = site || CoreSites.instance.getCurrentSite();
        return site.wsAvailable('core_h5p_get_trusted_h5p_file');
    };
    /**
     * Get a trusted H5P file.
     *
     * @param url The file URL.
     * @param options Options.
     * @param ignoreCache Whether to ignore cache.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the file data.
     */
    CoreH5PProvider.prototype.getTrustedH5PFile = function (url, options, ignoreCache, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site, data, preSets, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = options || {};
                        return [4 /*yield*/, CoreSites.instance.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        data = {
                            url: this.treatH5PUrl(url, site.getURL()),
                            frame: options.frame ? 1 : 0,
                            export: options.export ? 1 : 0,
                            embed: options.embed ? 1 : 0,
                            copyright: options.copyright ? 1 : 0,
                        };
                        preSets = {
                            cacheKey: this.getTrustedH5PFileCacheKey(url),
                            updateFrequency: CoreSite.FREQUENCY_RARELY
                        };
                        if (ignoreCache) {
                            preSets.getFromCache = false;
                            preSets.emergencyCache = false;
                        }
                        return [4 /*yield*/, site.read('core_h5p_get_trusted_h5p_file', data, preSets)];
                    case 2:
                        result = _a.sent();
                        if (result.warnings && result.warnings.length) {
                            throw result.warnings[0];
                        }
                        if (result.files && result.files.length) {
                            return [2 /*return*/, result.files[0]];
                        }
                        throw 'File not found';
                }
            });
        });
    };
    /**
     * Get cache key for trusted H5P file WS calls.
     *
     * @param url The file URL.
     * @return Cache key.
     */
    CoreH5PProvider.prototype.getTrustedH5PFileCacheKey = function (url) {
        return this.getTrustedH5PFilePrefixCacheKey() + url;
    };
    /**
     * Get prefixed cache key for trusted H5P file WS calls.
     *
     * @return Cache key.
     */
    CoreH5PProvider.prototype.getTrustedH5PFilePrefixCacheKey = function () {
        return this.ROOT_CACHE_KEY + 'trustedH5PFile:';
    };
    /**
     * Invalidates all trusted H5P file WS calls.
     *
     * @param siteId Site ID (empty for current site).
     * @return Promise resolved when the data is invalidated.
     */
    CoreH5PProvider.prototype.invalidateAllGetTrustedH5PFile = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        return [4 /*yield*/, site.invalidateWsCacheForKeyStartingWith(this.getTrustedH5PFilePrefixCacheKey())];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Invalidates get trusted H5P file WS call.
     *
     * @param url The URL of the file.
     * @param siteId Site ID (empty for current site).
     * @return Promise resolved when the data is invalidated.
     */
    CoreH5PProvider.prototype.invalidateGetTrustedH5PFile = function (url, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        return [4 /*yield*/, site.invalidateWsCacheForKey(this.getTrustedH5PFileCacheKey(url))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check whether H5P offline is disabled.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with boolean: whether is disabled.
     */
    CoreH5PProvider.prototype.isOfflineDisabled = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        return [2 /*return*/, this.isOfflineDisabledInSite(site)];
                }
            });
        });
    };
    /**
     * Check whether H5P offline is disabled.
     *
     * @param site Site instance. If not defined, current site.
     * @return Whether is disabled.
     */
    CoreH5PProvider.prototype.isOfflineDisabledInSite = function (site) {
        site = site || CoreSites.instance.getCurrentSite();
        return site.isFeatureDisabled('NoDelegate_H5POffline');
    };
    /**
     * Treat an H5P url before sending it to WS.
     *
     * @param url H5P file URL.
     * @param siteUrl Site URL.
     * @return Treated url.
     */
    CoreH5PProvider.prototype.treatH5PUrl = function (url, siteUrl) {
        if (url.indexOf(CoreTextUtils.instance.concatenatePaths(siteUrl, '/webservice/pluginfile.php')) === 0) {
            url = url.replace('/webservice/pluginfile', '/pluginfile');
        }
        return CoreUrlUtils.instance.removeUrlParams(url);
    };
    // DB table names.
    CoreH5PProvider.CONTENT_TABLE = 'h5p_content'; // H5P content.
    CoreH5PProvider.LIBRARIES_TABLE = 'h5p_libraries'; // Installed libraries.
    CoreH5PProvider.LIBRARY_DEPENDENCIES_TABLE = 'h5p_library_dependencies'; // Library dependencies.
    CoreH5PProvider.CONTENTS_LIBRARIES_TABLE = 'h5p_contents_libraries'; // Which library is used in which content.
    CoreH5PProvider.LIBRARIES_CACHEDASSETS_TABLE = 'h5p_libraries_cachedassets'; // H5P cached library assets.
    CoreH5PProvider = CoreH5PProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], CoreH5PProvider);
    return CoreH5PProvider;
    var CoreH5PProvider_1;
}());
export { CoreH5PProvider };
var CoreH5P = /** @class */ (function (_super) {
    __extends(CoreH5P, _super);
    function CoreH5P() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreH5P;
}(makeSingleton(CoreH5PProvider)));
export { CoreH5P };
//# sourceMappingURL=h5p.js.map