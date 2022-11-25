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
import { CoreFile } from '@providers/file';
import { CoreFilepool } from '@providers/filepool';
import { CoreSites } from '@providers/sites';
import { CoreMimetypeUtils } from '@providers/utils/mimetype';
import { CoreTextUtils } from '@providers/utils/text';
import { CoreUtils } from '@providers/utils/utils';
import { CoreH5PProvider } from '../providers/h5p';
import { CoreH5PCore } from './core';
/**
 * Equivalent to Moodle's implementation of H5PFileStorage.
 */
var CoreH5PFileStorage = /** @class */ (function () {
    function CoreH5PFileStorage() {
    }
    /**
     * Will concatenate all JavaScrips and Stylesheets into two files in order to improve page performance.
     *
     * @param files A set of all the assets required for content to display.
     * @param key Hashed key for cached asset.
     * @param folderName Name of the folder of the H5P package.
     * @param siteId The site ID.
     * @return Promise resolved when done.
     */
    CoreH5PFileStorage.prototype.cacheAssets = function (files, key, folderName, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var cachedAssetsPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cachedAssetsPath = this.getCachedAssetsFolderPath(folderName, siteId);
                        // Treat each type in the assets.
                        return [4 /*yield*/, Promise.all(Object.keys(files).map(function (type) { return __awaiter(_this, void 0, void 0, function () {
                                var assets, fileName, path, content;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            assets = files[type];
                                            if (!assets || !assets.length) {
                                                return [2 /*return*/];
                                            }
                                            fileName = key + '.' + (type == 'scripts' ? 'js' : 'css');
                                            path = CoreTextUtils.instance.concatenatePaths(cachedAssetsPath, fileName);
                                            return [4 /*yield*/, this.concatenateFiles(assets, type)];
                                        case 1:
                                            content = _a.sent();
                                            return [4 /*yield*/, CoreFile.instance.writeFile(path, content)];
                                        case 2:
                                            _a.sent();
                                            // Now update the files data.
                                            files[type] = [
                                                {
                                                    path: CoreTextUtils.instance.concatenatePaths(CoreH5PFileStorage.CACHED_ASSETS_FOLDER_NAME, fileName),
                                                    version: ''
                                                }
                                            ];
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        // Treat each type in the assets.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Adds all files of a type into one file.
     *
     * @param assets A list of files.
     * @param type The type of files in assets. Either 'scripts' or 'styles'
     * @return Promise resolved with all of the files content in one string.
     */
    CoreH5PFileStorage.prototype.concatenateFiles = function (assets, type) {
        return __awaiter(this, void 0, void 0, function () {
            var basePath, content, _loop_1, _a, _b, _i, i;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        basePath = CoreFile.instance.convertFileSrc(CoreFile.instance.getBasePathInstant());
                        content = '';
                        _loop_1 = function (i) {
                            var asset, fileContent, matches, assetPath_1, treated_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        asset = assets[i];
                                        return [4 /*yield*/, CoreFile.instance.readFile(asset.path)];
                                    case 1:
                                        fileContent = _a.sent();
                                        if (type == 'scripts') {
                                            // No need to treat scripts, just append the content.
                                            content += fileContent + ';\n';
                                        }
                                        else {
                                            matches = fileContent.match(/url\([\'"]?([^"\')]+)[\'"]?\)/ig);
                                            assetPath_1 = asset.path.replace(/(^\/|\/$)/g, '');
                                            treated_1 = {};
                                            if (matches && matches.length) {
                                                matches.forEach(function (match) {
                                                    var url = match.replace(/(url\(['"]?|['"]?\)$)/ig, '');
                                                    if (treated_1[url] || url.match(/^(data:|([a-z0-9]+:)?\/)/i)) {
                                                        return; // Not relative or already treated, skip.
                                                    }
                                                    var pathSplit = assetPath_1.split('/');
                                                    treated_1[url] = url;
                                                    /* Find "../" in the URL. If it exists, we have to remove "../" and switch the last folder in the
                                                       filepath for the first folder in the url. */
                                                    if (url.match(/^\.\.\//)) {
                                                        var urlSplit = url.split('/').filter(function (i) {
                                                            return i; // Remove empty values.
                                                        });
                                                        // Remove the file name from the asset path.
                                                        pathSplit.pop();
                                                        // Remove the first element from the file URL: ../ .
                                                        urlSplit.shift();
                                                        // Put the url's first folder into the asset path.
                                                        pathSplit[pathSplit.length - 1] = urlSplit[0];
                                                        urlSplit.shift();
                                                        // Create the new URL and replace it in the file contents.
                                                        url = pathSplit.join('/') + '/' + urlSplit.join('/');
                                                    }
                                                    else {
                                                        pathSplit[pathSplit.length - 1] = url; // Put the whole path to the end of the asset path.
                                                        url = pathSplit.join('/');
                                                    }
                                                    fileContent = fileContent.replace(new RegExp(CoreTextUtils.instance.escapeForRegex(match), 'g'), 'url("' + CoreTextUtils.instance.concatenatePaths(basePath, url) + '")');
                                                });
                                            }
                                            content += fileContent + '\n';
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _a = [];
                        for (_b in assets)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        i = _a[_i];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, content];
                }
            });
        });
    };
    /**
     * Delete cached assets from file system.
     *
     * @param libraryId Library identifier.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFileStorage.prototype.deleteCachedAssets = function (removedEntries, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var site, promises, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        promises = [];
                        removedEntries.forEach(function (entry) {
                            var cachedAssetsFolder = _this.getCachedAssetsFolderPath(entry.foldername, site.getId());
                            ['js', 'css'].forEach(function (type) {
                                var path = CoreTextUtils.instance.concatenatePaths(cachedAssetsFolder, entry.hash + '.' + type);
                                promises.push(CoreFile.instance.removeFile(path));
                            });
                        });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, CoreUtils.instance.allPromises(promises)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes a content folder from the file system.
     *
     * @param folderName Folder name of the content.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFileStorage.prototype.deleteContentFolder = function (folderName, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreFile.instance.removeDir(this.getContentFolderPath(folderName, siteId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete content indexes from filesystem.
     *
     * @param folderName Name of the folder of the H5P package.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFileStorage.prototype.deleteContentIndex = function (folderName, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreFile.instance.removeFile(this.getContentIndexPath(folderName, siteId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete content indexes from filesystem.
     *
     * @param libraryId Library identifier.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFileStorage.prototype.deleteContentIndexesForLibrary = function (libraryId, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var site, db, query, queryArgs, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        db = site.getDb();
                        query = 'SELECT DISTINCT hc.foldername ' +
                            'FROM ' + CoreH5PProvider.CONTENTS_LIBRARIES_TABLE + ' hcl ' +
                            'JOIN ' + CoreH5PProvider.CONTENT_TABLE + ' hc ON hcl.h5pid = hc.id ' +
                            'WHERE hcl.libraryid = ?';
                        queryArgs = [];
                        queryArgs.push(libraryId);
                        return [4 /*yield*/, db.execute(query, queryArgs)];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, Array.from(result.rows).map(function (entry) { return __awaiter(_this, void 0, void 0, function () {
                                var error_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            // Delete the index.html.
                                            return [4 /*yield*/, this.deleteContentIndex(entry.foldername, site.getId())];
                                        case 1:
                                            // Delete the index.html.
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_2 = _a.sent();
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes a library from the file system.
     *
     * @param libraryData The library data.
     * @param folderName Folder name. If not provided, it will be calculated.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFileStorage.prototype.deleteLibraryFolder = function (libraryData, folderName, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreFile.instance.removeDir(this.getLibraryFolderPath(libraryData, siteId, folderName))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Will check if there are cache assets available for content.
     *
     * @param key Hashed key for cached asset
     * @return Promise resolved with the files.
     */
    CoreH5PFileStorage.prototype.getCachedAssets = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var results, files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.getCachedAsset(key, '.js'),
                            this.getCachedAsset(key, '.css'),
                        ])];
                    case 1:
                        results = _a.sent();
                        files = {
                            scripts: results[0],
                            styles: results[1],
                        };
                        return [2 /*return*/, files.scripts || files.styles ? files : null];
                }
            });
        });
    };
    /**
     * Check if a cached asset file exists and, if so, return its data.
     *
     * @param key Key of the cached asset.
     * @param extension Extension of the file to get.
     * @return Promise resolved with the list of assets (only one), undefined if not found.
     */
    CoreH5PFileStorage.prototype.getCachedAsset = function (key, extension) {
        return __awaiter(this, void 0, void 0, function () {
            var path, size, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        path = CoreTextUtils.instance.concatenatePaths(CoreH5PFileStorage.CACHED_ASSETS_FOLDER_NAME, key + extension);
                        return [4 /*yield*/, CoreFile.instance.getFileSize(path)];
                    case 1:
                        size = _a.sent();
                        if (size > 0) {
                            return [2 /*return*/, [
                                    {
                                        path: path,
                                        version: '',
                                    },
                                ]];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get relative path to a content cached assets.
     *
     * @param folderName Name of the folder of the content the assets belong to.
     * @param siteId Site ID.
     * @return Path.
     */
    CoreH5PFileStorage.prototype.getCachedAssetsFolderPath = function (folderName, siteId) {
        return CoreTextUtils.instance.concatenatePaths(this.getContentFolderPath(folderName, siteId), CoreH5PFileStorage.CACHED_ASSETS_FOLDER_NAME);
    };
    /**
     * Get a content folder name given the package URL.
     *
     * @param fileUrl Package URL.
     * @param siteId Site ID.
     * @return Promise resolved with the folder name.
     */
    CoreH5PFileStorage.prototype.getContentFolderNameByUrl = function (fileUrl, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var path, fileAndDir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreFilepool.instance.getFilePathByUrl(siteId, fileUrl)];
                    case 1:
                        path = _a.sent();
                        fileAndDir = CoreFile.instance.getFileAndDirectoryFromPath(path);
                        return [2 /*return*/, CoreMimetypeUtils.instance.removeExtension(fileAndDir.name)];
                }
            });
        });
    };
    /**
     * Get a package content path.
     *
     * @param folderName Name of the folder of the H5P package.
     * @param siteId The site ID.
     * @return Folder path.
     */
    CoreH5PFileStorage.prototype.getContentFolderPath = function (folderName, siteId) {
        return CoreTextUtils.instance.concatenatePaths(this.getExternalH5PFolderPath(siteId), 'packages/' + folderName + '/content');
    };
    /**
     * Get the content index file.
     *
     * @param fileUrl URL of the H5P package.
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with the file URL if exists, rejected otherwise.
     */
    CoreH5PFileStorage.prototype.getContentIndexFileUrl = function (fileUrl, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var folderName, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        return [4 /*yield*/, this.getContentFolderNameByUrl(fileUrl, siteId)];
                    case 1:
                        folderName = _a.sent();
                        return [4 /*yield*/, CoreFile.instance.getFile(this.getContentIndexPath(folderName, siteId))];
                    case 2:
                        file = _a.sent();
                        return [2 /*return*/, file.toURL()];
                }
            });
        });
    };
    /**
     * Get the path to a content index.
     *
     * @param folderName Name of the folder of the H5P package.
     * @param siteId The site ID.
     * @return Folder path.
     */
    CoreH5PFileStorage.prototype.getContentIndexPath = function (folderName, siteId) {
        return CoreTextUtils.instance.concatenatePaths(this.getContentFolderPath(folderName, siteId), 'index.html');
    };
    /**
     * Get the path to the folder that contains the H5P core libraries.
     *
     * @return Folder path.
     */
    CoreH5PFileStorage.prototype.getCoreH5PPath = function () {
        return CoreTextUtils.instance.concatenatePaths(CoreFile.instance.getWWWPath(), '/h5p/');
    };
    /**
     * Get the path to the dependency.
     *
     * @param dependency Dependency library.
     * @return The path to the dependency library
     */
    CoreH5PFileStorage.prototype.getDependencyPath = function (dependency) {
        return 'libraries/' + dependency.machineName + '-' + dependency.majorVersion + '.' + dependency.minorVersion;
    };
    /**
     * Get path to the folder containing H5P files extracted from packages.
     *
     * @param siteId The site ID.
     * @return Folder path.
     */
    CoreH5PFileStorage.prototype.getExternalH5PFolderPath = function (siteId) {
        return CoreTextUtils.instance.concatenatePaths(CoreFile.instance.getSiteFolder(siteId), 'h5p');
    };
    /**
     * Get libraries folder path.
     *
     * @param siteId The site ID.
     * @return Folder path.
     */
    CoreH5PFileStorage.prototype.getLibrariesFolderPath = function (siteId) {
        return CoreTextUtils.instance.concatenatePaths(this.getExternalH5PFolderPath(siteId), 'libraries');
    };
    /**
     * Get a library's folder path.
     *
     * @param libraryData The library data.
     * @param siteId The site ID.
     * @param folderName Folder name. If not provided, it will be calculated.
     * @return Folder path.
     */
    CoreH5PFileStorage.prototype.getLibraryFolderPath = function (libraryData, siteId, folderName) {
        if (!folderName) {
            folderName = CoreH5PCore.libraryToString(libraryData, true);
        }
        return CoreTextUtils.instance.concatenatePaths(this.getLibrariesFolderPath(siteId), folderName);
    };
    /**
     * Save the content in filesystem.
     *
     * @param contentPath Path to the current content folder (tmp).
     * @param folderName Name to put to the content folder.
     * @param siteId Site ID.
     * @return Promise resolved when done.
     */
    CoreH5PFileStorage.prototype.saveContent = function (contentPath, folderName, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var folderPath, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        folderPath = this.getContentFolderPath(folderName, siteId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, CoreFile.instance.removeDir(folderPath)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: 
                    // Copy the new one.
                    return [4 /*yield*/, CoreFile.instance.moveDir(contentPath, folderPath)];
                    case 5:
                        // Copy the new one.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save a library in filesystem.
     *
     * @param libraryData Library data.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PFileStorage.prototype.saveLibrary = function (libraryData, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var folderPath, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        folderPath = this.getLibraryFolderPath(libraryData, siteId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, CoreFile.instance.removeDir(folderPath)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: 
                    // Copy the new one.
                    return [4 /*yield*/, CoreFile.instance.moveDir(libraryData.uploadDirectory, folderPath, true)];
                    case 5:
                        // Copy the new one.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CoreH5PFileStorage.CACHED_ASSETS_FOLDER_NAME = 'cachedassets';
    return CoreH5PFileStorage;
}());
export { CoreH5PFileStorage };
//# sourceMappingURL=file-storage.js.map