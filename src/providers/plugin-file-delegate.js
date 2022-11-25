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
import { CoreEventsProvider } from './events';
import { CoreLoggerProvider } from './logger';
import { CoreSitesProvider } from './sites';
import { CoreFilepool } from './filepool';
import { CoreConstants } from '@core/constants';
import { CoreDelegate } from '@classes/delegate';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Delegate to register pluginfile information handlers.
 */
var CorePluginFileDelegate = /** @class */ (function (_super) {
    __extends(CorePluginFileDelegate, _super);
    function CorePluginFileDelegate(loggerProvider, sitesProvider, eventsProvider) {
        var _this = _super.call(this, 'CorePluginFileDelegate', loggerProvider, sitesProvider, eventsProvider) || this;
        _this.handlerNameProperty = 'component';
        return _this;
    }
    /**
     * React to a file being deleted.
     *
     * @param fileUrl The file URL used to download the file.
     * @param path The path of the deleted file.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CorePluginFileDelegate.prototype.fileDeleted = function (fileUrl, path, siteId) {
        var handler = this.getHandlerForFile({ fileurl: fileUrl });
        if (handler && handler.fileDeleted) {
            return handler.fileDeleted(fileUrl, path, siteId);
        }
        return Promise.resolve();
    };
    /**
     * Check whether a file can be downloaded. If so, return the file to download.
     *
     * @param file The file data.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the file to use. Rejected if cannot download.
     */
    CorePluginFileDelegate.prototype.getDownloadableFile = function (file, siteId) {
        var handler = this.getHandlerForFile(file);
        return this.getHandlerDownloadableFile(file, handler, siteId);
    };
    /**
     * Check whether a file can be downloaded. If so, return the file to download.
     *
     * @param file The file data.
     * @param handler The handler to use.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the file to use. Rejected if cannot download.
     */
    CorePluginFileDelegate.prototype.getHandlerDownloadableFile = function (file, handler, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var isDownloadable, newFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isFileDownloadable(file, siteId)];
                    case 1:
                        isDownloadable = _a.sent();
                        if (!isDownloadable.downloadable) {
                            throw isDownloadable.reason;
                        }
                        if (!(handler && handler.getDownloadableFile)) return [3 /*break*/, 3];
                        return [4 /*yield*/, handler.getDownloadableFile(file, siteId)];
                    case 2:
                        newFile = _a.sent();
                        return [2 /*return*/, newFile || file];
                    case 3: return [2 /*return*/, file];
                }
            });
        });
    };
    /**
     * Get the RegExp of the component and filearea described in the URL.
     *
     * @param args Arguments of the pluginfile URL defining component and filearea at least.
     * @return RegExp to match the revision or undefined if not found.
     */
    CorePluginFileDelegate.prototype.getComponentRevisionRegExp = function (args) {
        // Get handler based on component (args[1]).
        var handler = this.getHandler(args[1], true);
        if (handler && handler.getComponentRevisionRegExp) {
            return handler.getComponentRevisionRegExp(args);
        }
    };
    /**
     * Given an HTML element, get the URLs of the files that should be downloaded and weren't treated by
     * CoreFilepoolProvider.extractDownloadableFilesFromHtml.
     *
     * @param container Container where to get the URLs from.
     * @return List of URLs.
     */
    CorePluginFileDelegate.prototype.getDownloadableFilesFromHTML = function (container) {
        var files = [];
        for (var component in this.enabledHandlers) {
            var handler = this.enabledHandlers[component];
            if (handler && handler.getDownloadableFilesFromHTML) {
                files = files.concat(handler.getDownloadableFilesFromHTML(container));
            }
        }
        return files;
    };
    /**
     * Sum the filesizes from a list if they are not downloaded.
     *
     * @param files List of files to sum its filesize.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with file size and a boolean to indicate if it is the total size or only partial.
     */
    CorePluginFileDelegate.prototype.getFilesDownloadSize = function (files, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var filteredFiles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filteredFiles = [];
                        return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                var state;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, CoreFilepool.instance.getFileStateByUrl(siteId, file.fileurl, file.timemodified)];
                                        case 1:
                                            state = _a.sent();
                                            if (state != CoreConstants.DOWNLOADED && state != CoreConstants.NOT_DOWNLOADABLE) {
                                                filteredFiles.push(file);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getFilesSize(filteredFiles, siteId)];
                }
            });
        });
    };
    /**
     * Sum the filesizes from a list of files checking if the size will be partial or totally calculated.
     *
     * @param files List of files to sum its filesize.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with file size and a boolean to indicate if it is the total size or only partial.
     */
    CorePluginFileDelegate.prototype.getFilesSize = function (files, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {
                            size: 0,
                            total: true
                        };
                        return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                var size;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.getFileSize(file, siteId)];
                                        case 1:
                                            size = _a.sent();
                                            if (typeof size == 'undefined') {
                                                // We don't have the file size, cannot calculate its total size.
                                                result.total = false;
                                            }
                                            else {
                                                result.size += size;
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get a file size.
     *
     * @param file The file data.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the size.
     */
    CorePluginFileDelegate.prototype.getFileSize = function (file, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var isDownloadable, handler, downloadableFile, size;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isFileDownloadable(file, siteId)];
                    case 1:
                        isDownloadable = _a.sent();
                        if (!isDownloadable.downloadable) {
                            return [2 /*return*/, 0];
                        }
                        handler = this.getHandlerForFile(file);
                        return [4 /*yield*/, this.getHandlerDownloadableFile(file, handler, siteId)];
                    case 2:
                        downloadableFile = _a.sent();
                        if (!downloadableFile) {
                            return [2 /*return*/, 0];
                        }
                        if (handler && handler.getFileSize) {
                            try {
                                size = handler.getFileSize(downloadableFile, siteId);
                                return [2 /*return*/, size];
                            }
                            catch (error) {
                                // Ignore errors.
                            }
                        }
                        return [2 /*return*/, downloadableFile.filesize];
                }
            });
        });
    };
    /**
     * Get a handler to treat a certain file.
     *
     * @param file File data.
     * @return Handler.
     */
    CorePluginFileDelegate.prototype.getHandlerForFile = function (file) {
        for (var component in this.enabledHandlers) {
            var handler = this.enabledHandlers[component];
            if (handler && handler.shouldHandleFile && handler.shouldHandleFile(file)) {
                return handler;
            }
        }
    };
    /**
     * Check if a file is downloadable.
     *
     * @param file The file data.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise with the data.
     */
    CorePluginFileDelegate.prototype.isFileDownloadable = function (file, siteId) {
        var handler = this.getHandlerForFile(file);
        if (handler && handler.isFileDownloadable) {
            return handler.isFileDownloadable(file, siteId);
        }
        // Default to true.
        return Promise.resolve({ downloadable: true });
    };
    /**
     * Removes the revision number from a file URL.
     *
     * @param url URL to be replaced.
     * @param args Arguments of the pluginfile URL defining component and filearea at least.
     * @return Replaced URL without revision.
     */
    CorePluginFileDelegate.prototype.removeRevisionFromUrl = function (url, args) {
        // Get handler based on component (args[1]).
        var handler = this.getHandler(args[1], true);
        if (handler && handler.getComponentRevisionRegExp && handler.getComponentRevisionReplace) {
            var revisionRegex = handler.getComponentRevisionRegExp(args);
            if (revisionRegex) {
                return url.replace(revisionRegex, handler.getComponentRevisionReplace(args));
            }
        }
        return url;
    };
    /**
     * Treat a downloaded file.
     *
     * @param fileUrl The file URL used to download the file.
     * @param file The file entry of the downloaded file.
     * @param siteId Site ID. If not defined, current site.
     * @param onProgress Function to call on progress.
     * @return Promise resolved when done.
     */
    CorePluginFileDelegate.prototype.treatDownloadedFile = function (fileUrl, file, siteId, onProgress) {
        var handler = this.getHandlerForFile({ fileurl: fileUrl });
        if (handler && handler.treatDownloadedFile) {
            return handler.treatDownloadedFile(fileUrl, file, siteId, onProgress);
        }
        return Promise.resolve();
    };
    CorePluginFileDelegate = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            CoreSitesProvider,
            CoreEventsProvider])
    ], CorePluginFileDelegate);
    return CorePluginFileDelegate;
}(CoreDelegate));
export { CorePluginFileDelegate };
var CorePluginFile = /** @class */ (function (_super) {
    __extends(CorePluginFile, _super);
    function CorePluginFile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CorePluginFile;
}(makeSingleton(CorePluginFileDelegate)));
export { CorePluginFile };
//# sourceMappingURL=plugin-file-delegate.js.map