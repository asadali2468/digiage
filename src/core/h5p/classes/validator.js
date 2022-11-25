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
import { CoreTextUtils } from '@providers/utils/text';
import { CoreH5PCore } from './core';
/**
 * Equivalent to H5P's H5PValidator class.
 */
var CoreH5PValidator = /** @class */ (function () {
    function CoreH5PValidator() {
    }
    /**
     * Get library data.
     * This function won't validate most things because it should've been done by the server already.
     *
     * @param libDir Directory where the library files are.
     * @param libPath Path to the directory where the library files are.
     * @return Promise resolved with library data.
     */
    CoreH5PValidator.prototype.getLibraryData = function (libDir, libPath) {
        return __awaiter(this, void 0, void 0, function () {
            var results, libraryData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.readLibraryJsonFile(libPath),
                            this.readLibrarySemanticsFile(libPath),
                            this.readLibraryLanguageFiles(libPath),
                            this.libraryHasIcon(libPath),
                        ])];
                    case 1:
                        results = _a.sent();
                        libraryData = results[0];
                        libraryData.semantics = results[1];
                        libraryData.language = results[2];
                        libraryData.hasIcon = results[3];
                        return [2 /*return*/, libraryData];
                }
            });
        });
    };
    /**
     * Get library data for all libraries in an H5P package.
     *
     * @param packagePath The path to the package folder.
     * @param entries List of files and directories in the root of the package folder.
     * @retun Promise resolved with the libraries data.
     */
    CoreH5PValidator.prototype.getPackageLibrariesData = function (packagePath, entries) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var libraries;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        libraries = {};
                        return [4 /*yield*/, Promise.all(entries.map(function (entry) { return __awaiter(_this, void 0, void 0, function () {
                                var libDirPath, libraryData;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (entry.name[0] == '.' || entry.name[0] == '_' || entry.name == 'content' || entry.isFile) {
                                                // Skip files, the content folder and any folder starting with a . or _.
                                                return [2 /*return*/];
                                            }
                                            libDirPath = CoreTextUtils.instance.concatenatePaths(packagePath, entry.name);
                                            return [4 /*yield*/, this.getLibraryData(entry, libDirPath)];
                                        case 1:
                                            libraryData = _a.sent();
                                            libraryData.uploadDirectory = libDirPath;
                                            libraries[CoreH5PCore.libraryToString(libraryData)] = libraryData;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, libraries];
                }
            });
        });
    };
    /**
     * Check if the library has an icon file.
     *
     * @param libPath Path to the directory where the library files are.
     * @return Promise resolved with boolean: whether the library has an icon file.
     */
    CoreH5PValidator.prototype.libraryHasIcon = function (libPath) {
        return __awaiter(this, void 0, void 0, function () {
            var path, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = CoreTextUtils.instance.concatenatePaths(libPath, 'icon.svg');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // Check if the file exists.
                        return [4 /*yield*/, CoreFile.instance.getFile(path)];
                    case 2:
                        // Check if the file exists.
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Process libraries from an H5P library, getting the required data to save them.
     * This code is inspired on the isValidPackage function in Moodle's H5PValidator.
     * This function won't validate most things because it should've been done by the server already.
     *
     * @param packagePath The path to the package folder.
     * @param entries List of files and directories in the root of the package folder.
     * @return Promise resolved when done.
     */
    CoreH5PValidator.prototype.processH5PFiles = function (packagePath, entries) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.readH5PJsonFile(packagePath),
                            this.readH5PContentJsonFile(packagePath),
                            this.getPackageLibrariesData(packagePath, entries),
                        ])];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, {
                                librariesJsonData: results[2],
                                mainJsonData: results[0],
                                contentJsonData: results[1],
                            }];
                }
            });
        });
    };
    /**
     * Read content.json file and return its parsed contents.
     *
     * @param packagePath The path to the package folder.
     * @return Promise resolved with the parsed file contents.
     */
    CoreH5PValidator.prototype.readH5PContentJsonFile = function (packagePath) {
        var path = CoreTextUtils.instance.concatenatePaths(packagePath, 'content/content.json');
        return CoreFile.instance.readFile(path, CoreFileProvider.FORMATJSON);
    };
    /**
     * Read h5p.json file and return its parsed contents.
     *
     * @param packagePath The path to the package folder.
     * @return Promise resolved with the parsed file contents.
     */
    CoreH5PValidator.prototype.readH5PJsonFile = function (packagePath) {
        var path = CoreTextUtils.instance.concatenatePaths(packagePath, 'h5p.json');
        return CoreFile.instance.readFile(path, CoreFileProvider.FORMATJSON);
    };
    /**
     * Read library.json file and return its parsed contents.
     *
     * @param libPath Path to the directory where the library files are.
     * @return Promise resolved with the parsed file contents.
     */
    CoreH5PValidator.prototype.readLibraryJsonFile = function (libPath) {
        var path = CoreTextUtils.instance.concatenatePaths(libPath, 'library.json');
        return CoreFile.instance.readFile(path, CoreFileProvider.FORMATJSON);
    };
    /**
     * Read all language files and return their contents indexed by language code.
     *
     * @param libPath Path to the directory where the library files are.
     * @return Promise resolved with the language data.
     */
    CoreH5PValidator.prototype.readLibraryLanguageFiles = function (libPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var path_1, langIndex_1, entries, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        path_1 = CoreTextUtils.instance.concatenatePaths(libPath, 'language');
                        langIndex_1 = {};
                        return [4 /*yield*/, CoreFile.instance.getDirectoryContents(path_1)];
                    case 1:
                        entries = _a.sent();
                        return [4 /*yield*/, Promise.all(entries.map(function (entry) { return __awaiter(_this, void 0, void 0, function () {
                                var langFilePath, langFileData, parts, error_3;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            langFilePath = CoreTextUtils.instance.concatenatePaths(path_1, entry.name);
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, CoreFile.instance.readFile(langFilePath, CoreFileProvider.FORMATJSON)];
                                        case 2:
                                            langFileData = _a.sent();
                                            parts = entry.name.split('.');
                                            langIndex_1[parts[0]] = langFileData;
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_3 = _a.sent();
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, langIndex_1];
                    case 3:
                        error_2 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Read semantics.json file and return its parsed contents.
     *
     * @param libPath Path to the directory where the library files are.
     * @return Promise resolved with the parsed file contents.
     */
    CoreH5PValidator.prototype.readLibrarySemanticsFile = function (libPath) {
        return __awaiter(this, void 0, void 0, function () {
            var path, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        path = CoreTextUtils.instance.concatenatePaths(libPath, 'semantics.json');
                        return [4 /*yield*/, CoreFile.instance.readFile(path, CoreFileProvider.FORMATJSON)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_4 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CoreH5PValidator;
}());
export { CoreH5PValidator };
//# sourceMappingURL=validator.js.map