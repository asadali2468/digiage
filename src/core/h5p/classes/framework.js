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
import { CoreSites } from '@providers/sites';
import { CoreTextUtils } from '@providers/utils/text';
import { CoreH5P, CoreH5PProvider } from '../providers/h5p';
import { CoreH5PCore, CoreH5PDisplayOptionBehaviour } from './core';
/**
 * Equivalent to Moodle's implementation of H5PFrameworkInterface.
 */
var CoreH5PFramework = /** @class */ (function () {
    function CoreH5PFramework() {
    }
    /**
     * Will clear filtered params for all the content that uses the specified libraries.
     * This means that the content dependencies will have to be rebuilt and the parameters re-filtered.
     *
     * @param libraryIds Array of library ids.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFramework.prototype.clearFilteredParameters = function (libraryIds, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db, whereAndParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!libraryIds || !libraryIds.length) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        whereAndParams = db.getInOrEqual(libraryIds);
                        whereAndParams[0] = 'mainlibraryid ' + whereAndParams[0];
                        return [2 /*return*/, db.updateRecordsWhere(CoreH5PProvider.CONTENT_TABLE, { filtered: null }, whereAndParams[0], whereAndParams[1])];
                }
            });
        });
    };
    /**
     * Delete cached assets from DB.
     *
     * @param libraryId Library identifier.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the removed entries.
     */
    CoreH5PFramework.prototype.deleteCachedAssets = function (libraryId, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db, entries, hashes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.getRecords(CoreH5PProvider.LIBRARIES_CACHEDASSETS_TABLE, { libraryid: libraryId })];
                    case 2:
                        entries = _a.sent();
                        hashes = entries.map(function (entry) { return entry.hash; });
                        if (!hashes.length) return [3 /*break*/, 4];
                        // Delete the entries from DB.
                        return [4 /*yield*/, db.deleteRecordsList(CoreH5PProvider.LIBRARIES_CACHEDASSETS_TABLE, 'hash', hashes)];
                    case 3:
                        // Delete the entries from DB.
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, entries];
                }
            });
        });
    };
    /**
     * Delete content data from DB.
     *
     * @param id Content ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFramework.prototype.deleteContentData = function (id, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, Promise.all([
                                // Delete the content data.
                                db.deleteRecords(CoreH5PProvider.CONTENT_TABLE, { id: id }),
                                // Remove content library dependencies.
                                this.deleteLibraryUsage(id, siteId),
                            ])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete library data from DB.
     *
     * @param id Library ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFramework.prototype.deleteLibrary = function (id, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.deleteRecords(CoreH5PProvider.LIBRARIES_TABLE, { id: id })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete all dependencies belonging to given library.
     *
     * @param libraryId Library ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFramework.prototype.deleteLibraryDependencies = function (libraryId, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.deleteRecords(CoreH5PProvider.LIBRARY_DEPENDENCIES_TABLE, { libraryid: libraryId })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete what libraries a content item is using.
     *
     * @param id Package ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFramework.prototype.deleteLibraryUsage = function (id, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.deleteRecords(CoreH5PProvider.CONTENTS_LIBRARIES_TABLE, { h5pid: id })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all conent data from DB.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the list of content data.
     */
    CoreH5PFramework.prototype.getAllContentData = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        return [2 /*return*/, db.getAllRecords(CoreH5PProvider.CONTENT_TABLE)];
                }
            });
        });
    };
    /**
     * Get conent data from DB.
     *
     * @param id Content ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the content data.
     */
    CoreH5PFramework.prototype.getContentData = function (id, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        return [2 /*return*/, db.getRecord(CoreH5PProvider.CONTENT_TABLE, { id: id })];
                }
            });
        });
    };
    /**
     * Get conent data from DB.
     *
     * @param fileUrl H5P file URL.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the content data.
     */
    CoreH5PFramework.prototype.getContentDataByUrl = function (fileUrl, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site, db, folderName, contentData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        db = site.getDb();
                        return [4 /*yield*/, CoreH5P.instance.h5pCore.h5pFS.getContentFolderNameByUrl(fileUrl, site.getId())];
                    case 2:
                        folderName = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, db.getRecord(CoreH5PProvider.CONTENT_TABLE, { foldername: folderName })];
                    case 4:
                        contentData = _a.sent();
                        return [2 /*return*/, contentData];
                    case 5:
                        error_1 = _a.sent();
                        // Cannot get folder name, the h5p file was probably deleted. Just use the URL.
                        return [2 /*return*/, db.getRecord(CoreH5PProvider.CONTENT_TABLE, { fileurl: fileUrl })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the latest library version.
     *
     * @param machineName The library's machine name.
     * @return Promise resolved with the latest library version data.
     */
    CoreH5PFramework.prototype.getLatestLibraryVersion = function (machineName, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db, records, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, db.getRecords(CoreH5PProvider.LIBRARIES_TABLE, { machinename: machineName }, 'majorversion DESC, minorversion DESC, patchversion DESC', '*', 0, 1)];
                    case 3:
                        records = _a.sent();
                        if (records && records[0]) {
                            return [2 /*return*/, this.parseLibDBData(records[0])];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: throw "Missing required library: " + machineName;
                }
            });
        });
    };
    /**
     * Get a library data stored in DB.
     *
     * @param machineName Machine name.
     * @param majorVersion Major version number.
     * @param minorVersion Minor version number.
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with the library data, rejected if not found.
     */
    CoreH5PFramework.prototype.getLibrary = function (machineName, majorVersion, minorVersion, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db, conditions, libraries;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        conditions = {
                            machinename: machineName,
                            majorversion: undefined,
                            minorversion: undefined,
                        };
                        if (typeof majorVersion != 'undefined') {
                            conditions.majorversion = majorVersion;
                        }
                        if (typeof minorVersion != 'undefined') {
                            conditions.minorversion = minorVersion;
                        }
                        return [4 /*yield*/, db.getRecords(CoreH5PProvider.LIBRARIES_TABLE, conditions)];
                    case 2:
                        libraries = _a.sent();
                        if (!libraries.length) {
                            throw 'Libary not found.';
                        }
                        return [2 /*return*/, this.parseLibDBData(libraries[0])];
                }
            });
        });
    };
    /**
     * Get a library data stored in DB.
     *
     * @param libraryData Library data.
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with the library data, rejected if not found.
     */
    CoreH5PFramework.prototype.getLibraryByData = function (libraryData, siteId) {
        return this.getLibrary(libraryData.machineName, libraryData.majorVersion, libraryData.minorVersion, siteId);
    };
    /**
     * Get a library data stored in DB by ID.
     *
     * @param id Library ID.
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with the library data, rejected if not found.
     */
    CoreH5PFramework.prototype.getLibraryById = function (id, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db, library;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.getRecord(CoreH5PProvider.LIBRARIES_TABLE, { id: id })];
                    case 2:
                        library = _a.sent();
                        return [2 /*return*/, this.parseLibDBData(library)];
                }
            });
        });
    };
    /**
     * Get a library ID. If not found, return null.
     *
     * @param machineName Machine name.
     * @param majorVersion Major version number.
     * @param minorVersion Minor version number.
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with the library ID, null if not found.
     */
    CoreH5PFramework.prototype.getLibraryId = function (machineName, majorVersion, minorVersion, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var library, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getLibrary(machineName, majorVersion, minorVersion, siteId)];
                    case 1:
                        library = _a.sent();
                        return [2 /*return*/, (library && library.id) || null];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a library ID. If not found, return null.
     *
     * @param libraryData Library data.
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with the library ID, null if not found.
     */
    CoreH5PFramework.prototype.getLibraryIdByData = function (libraryData, siteId) {
        return this.getLibraryId(libraryData.machineName, libraryData.majorVersion, libraryData.minorVersion, siteId);
    };
    /**
     * Get the default behaviour for the display option defined.
     *
     * @param name Identifier for the setting.
     * @param defaultValue Optional default value if settings is not set.
     * @return Return the value for this display option.
     */
    CoreH5PFramework.prototype.getOption = function (name, defaultValue) {
        if (defaultValue === void 0) { defaultValue = false; }
        // For now, all them are disabled by default, so only will be rendered when defined in the display options.
        return CoreH5PDisplayOptionBehaviour.CONTROLLED_BY_AUTHOR_DEFAULT_OFF;
    };
    /**
     * Check whether the user has permission to execute an action.
     *
     * @param permission Permission to check.
     * @param id H5P package id.
     * @return Whether the user has permission to execute an action.
     */
    CoreH5PFramework.prototype.hasPermission = function (permission, id) {
        // H5P capabilities have not been introduced.
        return null;
    };
    /**
     * Determines if content slug is used.
     *
     * @param slug The content slug.
     * @return Whether the content slug is used
     */
    CoreH5PFramework.prototype.isContentSlugAvailable = function (slug) {
        // By default the slug should be available as it's currently generated as a unique value for each h5p content.
        return true;
    };
    /**
     * Check whether a library is a patched version of the one installed.
     *
     * @param library Library to check.
     * @param dbData Installed library. If not supplied it will be calculated.
     * @return Promise resolved with boolean: whether it's a patched library.
     */
    CoreH5PFramework.prototype.isPatchedLibrary = function (library, dbData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!dbData) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getLibraryByData(library)];
                    case 1:
                        dbData = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, library.patchVersion > dbData.patchversion];
                }
            });
        });
    };
    /**
     * Convert list of library parameter values to csv.
     *
     * @param libraryData Library data as found in library.json files.
     * @param key Key that should be found in libraryData.
     * @param searchParam The library parameter (Default: 'path').
     * @return Library parameter values separated by ', '
     */
    CoreH5PFramework.prototype.libraryParameterValuesToCsv = function (libraryData, key, searchParam) {
        if (searchParam === void 0) { searchParam = 'path'; }
        if (typeof libraryData[key] != 'undefined') {
            var parameterValues_1 = [];
            libraryData[key].forEach(function (file) {
                for (var index in file) {
                    if (index === searchParam) {
                        parameterValues_1.push(file[index]);
                    }
                }
            });
            return parameterValues_1.join(',');
        }
        return '';
    };
    /**
     * Load addon libraries.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the addon libraries.
     */
    CoreH5PFramework.prototype.loadAddons = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db, query, result, addons, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        query = 'SELECT l1.id AS libraryId, l1.machinename AS machineName, ' +
                            'l1.majorversion AS majorVersion, l1.minorversion AS minorVersion, ' +
                            'l1.patchversion AS patchVersion, l1.addto AS addTo, ' +
                            'l1.preloadedjs AS preloadedJs, l1.preloadedcss AS preloadedCss ' +
                            'FROM ' + CoreH5PProvider.LIBRARIES_TABLE + ' l1 ' +
                            'JOIN ' + CoreH5PProvider.LIBRARIES_TABLE + ' l2 ON l1.machinename = l2.machinename AND (' +
                            'l1.majorversion < l2.majorversion OR (l1.majorversion = l2.majorversion AND ' +
                            'l1.minorversion < l2.minorversion)) ' +
                            'WHERE l1.addto IS NOT NULL AND l2.machinename IS NULL';
                        return [4 /*yield*/, db.execute(query)];
                    case 2:
                        result = _a.sent();
                        addons = [];
                        for (i = 0; i < result.rows.length; i++) {
                            addons.push(this.parseLibAddonData(result.rows.item(i)));
                        }
                        return [2 /*return*/, addons];
                }
            });
        });
    };
    /**
     * Load content data from DB.
     *
     * @param id Content ID.
     * @param fileUrl H5P file URL. Required if id is not provided.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the content data.
     */
    CoreH5PFramework.prototype.loadContent = function (id, fileUrl, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var contentData, libData, content, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        if (!id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getContentData(id, siteId)];
                    case 1:
                        contentData = _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!fileUrl) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getContentDataByUrl(fileUrl, siteId)];
                    case 3:
                        contentData = _a.sent();
                        return [3 /*break*/, 5];
                    case 4: throw 'No id or fileUrl supplied to loadContent.';
                    case 5: return [4 /*yield*/, this.getLibraryById(contentData.mainlibraryid, siteId)];
                    case 6:
                        libData = _a.sent();
                        content = {
                            id: contentData.id,
                            params: contentData.jsoncontent,
                            embedType: 'iframe',
                            disable: null,
                            folderName: contentData.foldername,
                            title: libData.title,
                            slug: CoreH5PCore.slugify(libData.title) + '-' + contentData.id,
                            filtered: contentData.filtered,
                            libraryId: libData.id,
                            libraryName: libData.machinename,
                            libraryMajorVersion: libData.majorversion,
                            libraryMinorVersion: libData.minorversion,
                            libraryEmbedTypes: libData.embedtypes,
                            libraryFullscreen: libData.fullscreen,
                            metadata: null,
                        };
                        params = CoreTextUtils.instance.parseJSON(contentData.jsoncontent);
                        if (!params.metadata) {
                            params.metadata = {};
                        }
                        content.metadata = params.metadata;
                        content.params = JSON.stringify(typeof params.params != 'undefined' && params.params != null ? params.params : params);
                        return [2 /*return*/, content];
                }
            });
        });
    };
    /**
     * Load dependencies for the given content of the given type.
     *
     * @param id Content ID.
     * @param type The dependency type.
     * @return Content dependencies, indexed by machine name.
     */
    CoreH5PFramework.prototype.loadContentDependencies = function (id, type, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db, query, queryArgs, result, dependencies, i, dependency;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        query = 'SELECT hl.id AS libraryId, hl.machinename AS machineName, ' +
                            'hl.majorversion AS majorVersion, hl.minorversion AS minorVersion, ' +
                            'hl.patchversion AS patchVersion, hl.preloadedcss AS preloadedCss, ' +
                            'hl.preloadedjs AS preloadedJs, hcl.dropcss AS dropCss, ' +
                            'hcl.dependencytype as dependencyType ' +
                            'FROM ' + CoreH5PProvider.CONTENTS_LIBRARIES_TABLE + ' hcl ' +
                            'JOIN ' + CoreH5PProvider.LIBRARIES_TABLE + ' hl ON hcl.libraryid = hl.id ' +
                            'WHERE hcl.h5pid = ?';
                        queryArgs = [];
                        queryArgs.push(id);
                        if (type) {
                            query += ' AND hcl.dependencytype = ?';
                            queryArgs.push(type);
                        }
                        query += ' ORDER BY hcl.weight';
                        return [4 /*yield*/, db.execute(query, queryArgs)];
                    case 2:
                        result = _a.sent();
                        dependencies = {};
                        for (i = 0; i < result.rows.length; i++) {
                            dependency = result.rows.item(i);
                            dependencies[dependency.machineName] = dependency;
                        }
                        return [2 /*return*/, dependencies];
                }
            });
        });
    };
    /**
     * Loads a library and its dependencies.
     *
     * @param machineName The library's machine name.
     * @param majorVersion The library's major version.
     * @param minorVersion The library's minor version.
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with the library data.
     */
    CoreH5PFramework.prototype.loadLibrary = function (machineName, majorVersion, minorVersion, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var library, libraryData, sql, sqlParams, db, result, i, dependency, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLibrary(machineName, majorVersion, minorVersion, siteId)];
                    case 1:
                        library = _a.sent();
                        libraryData = {
                            libraryId: library.id,
                            title: library.title,
                            machineName: library.machinename,
                            majorVersion: library.majorversion,
                            minorVersion: library.minorversion,
                            patchVersion: library.patchversion,
                            runnable: library.runnable,
                            fullscreen: library.fullscreen,
                            embedTypes: library.embedtypes,
                            preloadedJs: library.preloadedjs,
                            preloadedCss: library.preloadedcss,
                            dropLibraryCss: library.droplibrarycss,
                            semantics: library.semantics,
                            preloadedDependencies: [],
                            dynamicDependencies: [],
                            editorDependencies: []
                        };
                        sql = 'SELECT hl.id, hl.machinename, hl.majorversion, hl.minorversion, hll.dependencytype ' +
                            'FROM ' + CoreH5PProvider.LIBRARY_DEPENDENCIES_TABLE + ' hll ' +
                            'JOIN ' + CoreH5PProvider.LIBRARIES_TABLE + ' hl ON hll.requiredlibraryid = hl.id ' +
                            'WHERE hll.libraryid = ? ' +
                            'ORDER BY hl.id ASC';
                        sqlParams = [
                            library.id,
                        ];
                        return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 2:
                        db = _a.sent();
                        return [4 /*yield*/, db.execute(sql, sqlParams)];
                    case 3:
                        result = _a.sent();
                        for (i = 0; i < result.rows.length; i++) {
                            dependency = result.rows.item(i);
                            key = dependency.dependencytype + 'Dependencies';
                            libraryData[key].push({
                                machineName: dependency.machinename,
                                majorVersion: dependency.majorversion,
                                minorVersion: dependency.minorversion
                            });
                        }
                        return [2 /*return*/, libraryData];
                }
            });
        });
    };
    /**
     * Parse library addon data.
     *
     * @param library Library addon data.
     * @return Parsed library.
     */
    CoreH5PFramework.prototype.parseLibAddonData = function (library) {
        library.addto = CoreTextUtils.instance.parseJSON(library.addto, null);
        return library;
    };
    /**
     * Parse library DB data.
     *
     * @param library Library DB data.
     * @return Parsed library.
     */
    CoreH5PFramework.prototype.parseLibDBData = function (library) {
        library.semantics = CoreTextUtils.instance.parseJSON(library.semantics, null);
        library.addto = CoreTextUtils.instance.parseJSON(library.addto, null);
        return library;
    };
    /**
     * Resets marked user data for the given content.
     *
     * @param contentId Content ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFramework.prototype.resetContentUserData = function (conentId, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     * Stores hash keys for cached assets, aggregated JavaScripts and stylesheets, and connects it to libraries so that we
     * know which cache file to delete when a library is updated.
     *
     * @param key Hash key for the given libraries.
     * @param libraries List of dependencies used to create the key.
     * @param folderName The name of the folder that contains the H5P.
     * @param siteId The site ID.
     * @return Promise resolved when done.
     */
    CoreH5PFramework.prototype.saveCachedAssets = function (hash, dependencies, folderName, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, Promise.all(Object.keys(dependencies).map(function (key) { return __awaiter(_this, void 0, void 0, function () {
                                var data;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            data = {
                                                hash: key,
                                                libraryid: dependencies[key].libraryId,
                                                foldername: folderName,
                                            };
                                            return [4 /*yield*/, db.insertRecord(CoreH5PProvider.LIBRARIES_CACHEDASSETS_TABLE, data)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save library data in DB.
     *
     * @param libraryData Library data to save.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFramework.prototype.saveLibraryData = function (libraryData, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var preloadedJS, preloadedCSS, dropLibraryCSS, embedTypes, site, db, data, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        preloadedJS = this.libraryParameterValuesToCsv(libraryData, 'preloadedJs', 'path');
                        preloadedCSS = this.libraryParameterValuesToCsv(libraryData, 'preloadedCss', 'path');
                        dropLibraryCSS = this.libraryParameterValuesToCsv(libraryData, 'dropLibraryCss', 'machineName');
                        if (typeof libraryData.semantics == 'undefined') {
                            libraryData.semantics = '';
                        }
                        if (typeof libraryData.fullscreen == 'undefined') {
                            libraryData.fullscreen = 0;
                        }
                        embedTypes = '';
                        if (typeof libraryData.embedTypes != 'undefined') {
                            embedTypes = libraryData.embedTypes.join(', ');
                        }
                        return [4 /*yield*/, CoreSites.instance.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        db = site.getDb();
                        data = {
                            id: undefined,
                            title: libraryData.title,
                            machinename: libraryData.machineName,
                            majorversion: libraryData.majorVersion,
                            minorversion: libraryData.minorVersion,
                            patchversion: libraryData.patchVersion,
                            runnable: libraryData.runnable,
                            fullscreen: libraryData.fullscreen,
                            embedtypes: embedTypes,
                            preloadedjs: preloadedJS,
                            preloadedcss: preloadedCSS,
                            droplibrarycss: dropLibraryCSS,
                            semantics: typeof libraryData.semantics != 'undefined' ? JSON.stringify(libraryData.semantics) : null,
                            addto: typeof libraryData.addTo != 'undefined' ? JSON.stringify(libraryData.addTo) : null,
                        };
                        if (libraryData.libraryId) {
                            data.id = libraryData.libraryId;
                        }
                        return [4 /*yield*/, db.insertRecord(CoreH5PProvider.LIBRARIES_TABLE, data)];
                    case 2:
                        _a.sent();
                        if (!!data.id) return [3 /*break*/, 4];
                        return [4 /*yield*/, db.getRecord(CoreH5PProvider.LIBRARIES_TABLE, data)];
                    case 3:
                        entry = _a.sent();
                        libraryData.libraryId = entry.id;
                        return [3 /*break*/, 6];
                    case 4: 
                    // Updated libary. Remove old dependencies.
                    return [4 /*yield*/, this.deleteLibraryDependencies(data.id, site.getId())];
                    case 5:
                        // Updated libary. Remove old dependencies.
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save what libraries a library is depending on.
     *
     * @param libraryId Library Id for the library we're saving dependencies for.
     * @param dependencies List of dependencies as associative arrays containing machineName, majorVersion, minorVersion.
     * @param dependencytype The type of dependency.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFramework.prototype.saveLibraryDependencies = function (libraryId, dependencies, dependencyType, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, Promise.all(dependencies.map(function (dependency) { return __awaiter(_this, void 0, void 0, function () {
                                var dependencyId, entry;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.getLibraryIdByData(dependency, siteId)];
                                        case 1:
                                            dependencyId = _a.sent();
                                            entry = {
                                                libraryid: libraryId,
                                                requiredlibraryid: dependencyId,
                                                dependencytype: dependencyType
                                            };
                                            return [4 /*yield*/, db.insertRecord(CoreH5PProvider.LIBRARY_DEPENDENCIES_TABLE, entry)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Saves what libraries the content uses.
     *
     * @param id Id identifying the package.
     * @param librariesInUse List of libraries the content uses.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFramework.prototype.saveLibraryUsage = function (id, librariesInUse, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db, dropLibraryCssList, key, dependency, split;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        dropLibraryCssList = {};
                        for (key in librariesInUse) {
                            dependency = librariesInUse[key];
                            if (dependency.library.dropLibraryCss) {
                                split = dependency.library.dropLibraryCss.split(', ');
                                split.forEach(function (css) {
                                    dropLibraryCssList[css] = css;
                                });
                            }
                        }
                        // Now save the uusage.
                        return [4 /*yield*/, Promise.all(Object.keys(librariesInUse).map(function (key) {
                                var dependency = librariesInUse[key];
                                var data = {
                                    h5pid: id,
                                    libraryId: dependency.library.libraryId,
                                    dependencytype: dependency.type,
                                    dropcss: dropLibraryCssList[dependency.library.machineName] ? 1 : 0,
                                    weight: dependency.weight,
                                };
                                return db.insertRecord(CoreH5PProvider.CONTENTS_LIBRARIES_TABLE, data);
                            }))];
                    case 2:
                        // Now save the uusage.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save content data in DB and clear cache.
     *
     * @param content Content to save.
     * @param folderName The name of the folder that contains the H5P.
     * @param fileUrl The online URL of the package.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with content ID.
     */
    CoreH5PFramework.prototype.updateContent = function (content, folderName, fileUrl, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db, mainLibrary, data, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        if (!(typeof content.library.libraryId == 'undefined')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getLatestLibraryVersion(content.library.machineName, siteId)];
                    case 2:
                        mainLibrary = _a.sent();
                        content.library.libraryId = mainLibrary.id;
                        _a.label = 3;
                    case 3:
                        data = {
                            id: undefined,
                            jsoncontent: content.params,
                            mainlibraryid: content.library.libraryId,
                            timemodified: Date.now(),
                            filtered: null,
                            foldername: folderName,
                            fileurl: fileUrl,
                            timecreated: undefined,
                        };
                        if (typeof content.id != 'undefined') {
                            data.id = content.id;
                        }
                        else {
                            data.timecreated = data.timemodified;
                        }
                        return [4 /*yield*/, db.insertRecord(CoreH5PProvider.CONTENT_TABLE, data)];
                    case 4:
                        _a.sent();
                        if (!!data.id) return [3 /*break*/, 6];
                        return [4 /*yield*/, db.getRecord(CoreH5PProvider.CONTENT_TABLE, data)];
                    case 5:
                        entry = _a.sent();
                        content.id = entry.id;
                        _a.label = 6;
                    case 6: return [2 /*return*/, content.id];
                }
            });
        });
    };
    /**
     * This will update selected fields on the given content.
     *
     * @param id Content identifier.
     * @param fields Object with the fields to update.
     * @param siteId Site ID. If not defined, current site.
     */
    CoreH5PFramework.prototype.updateContentFields = function (id, fields, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var db, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        data = Object.assign({}, fields);
                        delete data.slug; // Slug isn't stored in DB.
                        return [4 /*yield*/, db.updateRecords(CoreH5PProvider.CONTENT_TABLE, data, { id: id })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CoreH5PFramework;
}());
export { CoreH5PFramework };
//# sourceMappingURL=framework.js.map