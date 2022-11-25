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
import { CoreFile, CoreFileProvider } from '@providers/file';
import { CoreSites } from '@providers/sites';
import { CoreTextUtils } from '@providers/utils/text';
import { CoreUtils } from '@providers/utils/utils';
import { CoreH5PMetadata } from './metadata';
/**
 * Equivalent to H5P's H5PStorage class.
 */
var CoreH5PStorage = /** @class */ (function () {
    function CoreH5PStorage(h5pCore, h5pFramework) {
        this.h5pCore = h5pCore;
        this.h5pFramework = h5pFramework;
    }
    /**
     * Save libraries.
     *
     * @param librariesJsonData Data about libraries.
     * @param folderName Name of the folder of the H5P package.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PStorage.prototype.saveLibraries = function (librariesJsonData, folderName, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var libraryIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        // First of all, try to create the dir where the libraries are stored. This way we don't have to do it for each lib.
                        return [4 /*yield*/, CoreFile.instance.createDir(this.h5pCore.h5pFS.getLibrariesFolderPath(siteId))];
                    case 1:
                        // First of all, try to create the dir where the libraries are stored. This way we don't have to do it for each lib.
                        _a.sent();
                        libraryIds = [];
                        // Go through libraries that came with this package.
                        return [4 /*yield*/, Promise.all(Object.keys(librariesJsonData).map(function (libString) { return __awaiter(_this, void 0, void 0, function () {
                                var libraryData, dbData, error_1, isNewPatch, error_2, promises, removedEntries;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            libraryData = librariesJsonData[libString];
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this.h5pFramework.getLibraryByData(libraryData)];
                                        case 2:
                                            dbData = _a.sent();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_1 = _a.sent();
                                            return [3 /*break*/, 4];
                                        case 4:
                                            if (!dbData) return [3 /*break*/, 6];
                                            // Library already installed.
                                            libraryData.libraryId = dbData.id;
                                            return [4 /*yield*/, this.h5pFramework.isPatchedLibrary(libraryData, dbData)];
                                        case 5:
                                            isNewPatch = _a.sent();
                                            if (!isNewPatch) {
                                                // Same or older version, no need to save.
                                                libraryData.saveDependencies = false;
                                                return [2 /*return*/];
                                            }
                                            _a.label = 6;
                                        case 6:
                                            libraryData.saveDependencies = true;
                                            // Convert metadataSettings values to boolean and json_encode it before saving.
                                            libraryData.metadataSettings = libraryData.metadataSettings ?
                                                CoreH5PMetadata.boolifyAndEncodeSettings(libraryData.metadataSettings) : null;
                                            // Save the library data in DB.
                                            return [4 /*yield*/, this.h5pFramework.saveLibraryData(libraryData, siteId)];
                                        case 7:
                                            // Save the library data in DB.
                                            _a.sent();
                                            _a.label = 8;
                                        case 8:
                                            _a.trys.push([8, 10, , 12]);
                                            return [4 /*yield*/, this.h5pCore.h5pFS.saveLibrary(libraryData, siteId)];
                                        case 9:
                                            _a.sent();
                                            return [3 /*break*/, 12];
                                        case 10:
                                            error_2 = _a.sent();
                                            // An error occurred, delete the DB data because the lib FS data has been deleted.
                                            return [4 /*yield*/, this.h5pFramework.deleteLibrary(libraryData.libraryId, siteId)];
                                        case 11:
                                            // An error occurred, delete the DB data because the lib FS data has been deleted.
                                            _a.sent();
                                            throw error_2;
                                        case 12:
                                            if (!(typeof libraryData.libraryId != 'undefined')) return [3 /*break*/, 17];
                                            promises = [];
                                            // Remove all indexes of contents that use this library.
                                            promises.push(this.h5pCore.h5pFS.deleteContentIndexesForLibrary(libraryData.libraryId, siteId));
                                            if (!this.h5pCore.aggregateAssets) return [3 /*break*/, 15];
                                            return [4 /*yield*/, this.h5pFramework.deleteCachedAssets(libraryData.libraryId, siteId)];
                                        case 13:
                                            removedEntries = _a.sent();
                                            return [4 /*yield*/, this.h5pCore.h5pFS.deleteCachedAssets(removedEntries, siteId)];
                                        case 14:
                                            _a.sent();
                                            _a.label = 15;
                                        case 15: return [4 /*yield*/, CoreUtils.instance.allPromises(promises)];
                                        case 16:
                                            _a.sent();
                                            _a.label = 17;
                                        case 17: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        // Go through libraries that came with this package.
                        _a.sent();
                        // Go through the libraries again to save dependencies.
                        return [4 /*yield*/, Promise.all(Object.keys(librariesJsonData).map(function (libString) { return __awaiter(_this, void 0, void 0, function () {
                                var libraryData, promises;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            libraryData = librariesJsonData[libString];
                                            if (!libraryData.saveDependencies) {
                                                return [2 /*return*/];
                                            }
                                            libraryIds.push(libraryData.libraryId);
                                            // Remove any old dependencies.
                                            return [4 /*yield*/, this.h5pFramework.deleteLibraryDependencies(libraryData.libraryId, siteId)];
                                        case 1:
                                            // Remove any old dependencies.
                                            _a.sent();
                                            promises = [];
                                            if (typeof libraryData.preloadedDependencies != 'undefined') {
                                                promises.push(this.h5pFramework.saveLibraryDependencies(libraryData.libraryId, libraryData.preloadedDependencies, 'preloaded'));
                                            }
                                            if (typeof libraryData.dynamicDependencies != 'undefined') {
                                                promises.push(this.h5pFramework.saveLibraryDependencies(libraryData.libraryId, libraryData.dynamicDependencies, 'dynamic'));
                                            }
                                            if (typeof libraryData.editorDependencies != 'undefined') {
                                                promises.push(this.h5pFramework.saveLibraryDependencies(libraryData.libraryId, libraryData.editorDependencies, 'editor'));
                                            }
                                            return [4 /*yield*/, Promise.all(promises)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 3:
                        // Go through the libraries again to save dependencies.
                        _a.sent();
                        if (!libraryIds.length) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.h5pFramework.clearFilteredParameters(libraryIds, siteId)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
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
     * @return Promise resolved with the content data.
     */
    CoreH5PStorage.prototype.savePackage = function (data, folderName, fileUrl, skipContent, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var content, mainLib, id, destFolder, contentPath, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.h5pCore.mayUpdateLibraries()) return [3 /*break*/, 2];
                        // Save the libraries that were processed.
                        return [4 /*yield*/, this.saveLibraries(data.librariesJsonData, folderName, siteId)];
                    case 1:
                        // Save the libraries that were processed.
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        content = {};
                        if (!!skipContent) return [3 /*break*/, 10];
                        if (!data.mainJsonData.preloadedDependencies) return [3 /*break*/, 4];
                        mainLib = data.mainJsonData.preloadedDependencies.find(function (dependency) {
                            return dependency.machineName === data.mainJsonData.mainLibrary;
                        });
                        if (!mainLib) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.h5pFramework.getLibraryIdByData(mainLib)];
                    case 3:
                        id = _a.sent();
                        mainLib.libraryId = id;
                        content.library = mainLib;
                        _a.label = 4;
                    case 4:
                        content.params = JSON.stringify(data.contentJsonData);
                        // Save the content data in DB.
                        return [4 /*yield*/, this.h5pCore.saveContent(content, folderName, fileUrl, siteId)];
                    case 5:
                        // Save the content data in DB.
                        _a.sent();
                        destFolder = CoreTextUtils.instance.concatenatePaths(CoreFileProvider.TMPFOLDER, 'h5p/' + folderName);
                        contentPath = CoreTextUtils.instance.concatenatePaths(destFolder, 'content');
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 10]);
                        return [4 /*yield*/, this.h5pCore.h5pFS.saveContent(contentPath, folderName, siteId)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 8:
                        error_3 = _a.sent();
                        // An error occurred, delete the DB data because the content files have been deleted.
                        return [4 /*yield*/, this.h5pFramework.deleteContentData(content.id, siteId)];
                    case 9:
                        // An error occurred, delete the DB data because the content files have been deleted.
                        _a.sent();
                        throw error_3;
                    case 10: return [2 /*return*/, content];
                }
            });
        });
    };
    return CoreH5PStorage;
}());
export { CoreH5PStorage };
//# sourceMappingURL=storage.js.map