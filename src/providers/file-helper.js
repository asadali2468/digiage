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
import { TranslateService } from '@ngx-translate/core';
import { CoreAppProvider } from './app';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreFileProvider } from './file';
import { CoreFilepoolProvider } from './filepool';
import { CoreSitesProvider } from './sites';
import { CoreWSProvider } from './ws';
import { CoreUrlUtils } from './utils/url';
import { CoreUtilsProvider } from './utils/utils';
import { CoreConstants } from '@core/constants';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Provider to provide some helper functions regarding files and packages.
 */
var CoreFileHelperProvider = /** @class */ (function () {
    function CoreFileHelperProvider(domUtils, fileProvider, filepoolProvider, sitesProvider, appProvider, translate, utils, wsProvider) {
        this.domUtils = domUtils;
        this.fileProvider = fileProvider;
        this.filepoolProvider = filepoolProvider;
        this.sitesProvider = sitesProvider;
        this.appProvider = appProvider;
        this.translate = translate;
        this.utils = utils;
        this.wsProvider = wsProvider;
    }
    /**
     * Convenience function to open a file, downloading it if needed.
     *
     * @param file The file to download.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @param state The file's state. If not provided, it will be calculated.
     * @param onProgress Function to call on progress.
     * @param siteId The site ID. If not defined, current site.
     * @return Resolved on success.
     */
    CoreFileHelperProvider.prototype.downloadAndOpenFile = function (file, component, componentId, state, onProgress, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var fileUrl, timemodified, url, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = siteId || this.sitesProvider.getCurrentSiteId();
                        fileUrl = this.getFileUrl(file);
                        timemodified = this.getFileTimemodified(file);
                        if (!!this.isOpenableInApp(file)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.showConfirmOpenUnsupportedFile()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.downloadFileIfNeeded(file, fileUrl, component, componentId, timemodified, state, onProgress, siteId)];
                    case 3:
                        url = _a.sent();
                        if (!url) {
                            return [2 /*return*/];
                        }
                        if (!!CoreUrlUtils.instance.isLocalFileUrl(url)) return [3 /*break*/, 13];
                        /* In iOS, if we use the same URL in embedded browser and background download then the download only
                           downloads a few bytes (cached ones). Add a hash to the URL so both URLs are different. */
                        url = url + '#moodlemobile-embedded';
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 13]);
                        return [4 /*yield*/, this.utils.openOnlineFile(url)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                    case 6:
                        error_1 = _a.sent();
                        // Error opening the file, some apps don't allow opening online files.
                        if (!this.fileProvider.isAvailable()) {
                            throw error_1;
                        }
                        if (!!state) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.filepoolProvider.getFileStateByUrl(siteId, fileUrl, timemodified)];
                    case 7:
                        state = _a.sent();
                        _a.label = 8;
                    case 8:
                        if (state == CoreConstants.DOWNLOADING) {
                            throw new Error(this.translate.instant('core.erroropenfiledownloading'));
                        }
                        if (!(state === CoreConstants.NOT_DOWNLOADED)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.downloadFile(fileUrl, component, componentId, timemodified, onProgress, file, siteId)];
                    case 9:
                        // File is not downloaded, download and then return the local URL.
                        url = _a.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.filepoolProvider.getInternalUrlByUrl(siteId, fileUrl)];
                    case 11:
                        // File is outdated and can't be opened in online, return the local URL.
                        url = _a.sent();
                        _a.label = 12;
                    case 12: return [3 /*break*/, 13];
                    case 13: return [2 /*return*/, this.utils.openFile(url)];
                }
            });
        });
    };
    /**
     * Download a file if it needs to be downloaded.
     *
     * @param file The file to download.
     * @param fileUrl The file URL.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @param timemodified The time this file was modified.
     * @param state The file's state. If not provided, it will be calculated.
     * @param onProgress Function to call on progress.
     * @param siteId The site ID. If not defined, current site.
     * @return Resolved with the URL to use on success.
     */
    CoreFileHelperProvider.prototype.downloadFileIfNeeded = function (file, fileUrl, component, componentId, timemodified, state, onProgress, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.checkAndFixPluginfileURL(fileUrl);
        }).then(function (fixedUrl) {
            if (_this.fileProvider.isAvailable()) {
                var promise = void 0;
                if (state) {
                    promise = Promise.resolve(state);
                }
                else {
                    // Calculate the state.
                    promise = _this.filepoolProvider.getFileStateByUrl(siteId, fileUrl, timemodified);
                }
                return promise.then(function (state) {
                    // The file system is available.
                    var isWifi = _this.appProvider.isWifi(), isOnline = _this.appProvider.isOnline();
                    if (state == CoreConstants.DOWNLOADED) {
                        // File is downloaded, get the local file URL.
                        return _this.filepoolProvider.getUrlByUrl(siteId, fileUrl, component, componentId, timemodified, false, false, file);
                    }
                    else {
                        if (!isOnline && !_this.isStateDownloaded(state)) {
                            // Not downloaded and user is offline, reject.
                            return Promise.reject(_this.translate.instant('core.networkerrormsg'));
                        }
                        if (onProgress) {
                            // This call can take a while. Send a fake event to notify that we're doing some calculations.
                            onProgress({ calculating: true });
                        }
                        return _this.filepoolProvider.shouldDownloadBeforeOpen(fixedUrl, file.filesize).then(function () {
                            if (state == CoreConstants.DOWNLOADING) {
                                // It's already downloading, stop.
                                return;
                            }
                            // Download and then return the local URL.
                            return _this.downloadFile(fileUrl, component, componentId, timemodified, onProgress, file, siteId);
                        }, function () {
                            // Start the download if in wifi, but return the URL right away so the file is opened.
                            if (isWifi) {
                                _this.downloadFile(fileUrl, component, componentId, timemodified, onProgress, file, siteId);
                            }
                            if (!_this.isStateDownloaded(state) || isOnline) {
                                // Not downloaded or online, return the online URL.
                                return fixedUrl;
                            }
                            else {
                                // Outdated but offline, so we return the local URL.
                                return _this.filepoolProvider.getUrlByUrl(siteId, fileUrl, component, componentId, timemodified, false, false, file);
                            }
                        });
                    }
                });
            }
            else {
                // Use the online URL.
                return fixedUrl;
            }
        });
    };
    /**
     * Download the file.
     *
     * @param fileUrl The file URL.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @param timemodified The time this file was modified.
     * @param onProgress Function to call on progress.
     * @param file The file to download.
     * @param siteId The site ID. If not defined, current site.
     * @return Resolved with internal URL on success, rejected otherwise.
     */
    CoreFileHelperProvider.prototype.downloadFile = function (fileUrl, component, componentId, timemodified, onProgress, file, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        // Get the site and check if it can download files.
        return this.sitesProvider.getSite(siteId).then(function (site) {
            if (!site.canDownloadFiles()) {
                return Promise.reject(_this.translate.instant('core.cannotdownloadfiles'));
            }
            return _this.filepoolProvider.downloadUrl(siteId, fileUrl, false, component, componentId, timemodified, onProgress, undefined, file).catch(function (error) {
                // Download failed, check the state again to see if the file was downloaded before.
                return _this.filepoolProvider.getFileStateByUrl(siteId, fileUrl, timemodified).then(function (state) {
                    if (_this.isStateDownloaded(state)) {
                        return _this.filepoolProvider.getInternalUrlByUrl(siteId, fileUrl);
                    }
                    else {
                        return Promise.reject(error);
                    }
                });
            });
        });
    };
    /**
     * Get the file's URL.
     *
     * @param file The file.
     */
    CoreFileHelperProvider.prototype.getFileUrl = function (file) {
        return file.fileurl || file.url;
    };
    /**
     * Get the file's timemodified.
     *
     * @param file The file.
     */
    CoreFileHelperProvider.prototype.getFileTimemodified = function (file) {
        return file.timemodified || 0;
    };
    /**
     * Check if a state is downloaded or outdated.
     *
     * @param state The state to check.
     */
    CoreFileHelperProvider.prototype.isStateDownloaded = function (state) {
        return state === CoreConstants.DOWNLOADED || state === CoreConstants.OUTDATED;
    };
    /**
     * Whether the file has to be opened in browser (external repository).
     * The file must have a mimetype attribute.
     *
     * @param file The file to check.
     * @return Whether the file should be opened in browser.
     */
    CoreFileHelperProvider.prototype.shouldOpenInBrowser = function (file) {
        if (!file || !file.isexternalfile || !file.mimetype) {
            return false;
        }
        var mimetype = file.mimetype;
        if (mimetype.indexOf('application/vnd.google-apps.') != -1) {
            // Google Docs file, always open in browser.
            return true;
        }
        if (file.repositorytype == 'onedrive') {
            // In OneDrive, open in browser the office docs
            return mimetype.indexOf('application/vnd.openxmlformats-officedocument') != -1 ||
                mimetype == 'text/plain' || mimetype == 'document/unknown';
        }
        return false;
    };
    /**
     * Calculate the total size of the given files.
     *
     * @param files The files to check.
     * @return Total files size.
     */
    CoreFileHelperProvider.prototype.getTotalFilesSize = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            var totalSize, _i, files_1, file, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        totalSize = 0;
                        _i = 0, files_1 = files;
                        _b.label = 1;
                    case 1:
                        if (!(_i < files_1.length)) return [3 /*break*/, 4];
                        file = files_1[_i];
                        _a = totalSize;
                        return [4 /*yield*/, this.getFileSize(file)];
                    case 2:
                        totalSize = _a + _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, totalSize];
                }
            });
        });
    };
    /**
     * Calculate the file size.
     *
     * @param file The file to check.
     * @return File size.
     */
    CoreFileHelperProvider.prototype.getFileSize = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var siteId, path, fileEntry, fileObject, error_2, size, fileObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (file.filesize) {
                            return [2 /*return*/, file.filesize];
                        }
                        if (!(file.filename && !file.name)) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 7]);
                        siteId = this.sitesProvider.getCurrentSiteId();
                        return [4 /*yield*/, this.filepoolProvider.getFilePathByUrl(siteId, file.fileurl)];
                    case 2:
                        path = _a.sent();
                        return [4 /*yield*/, this.fileProvider.getFile(path)];
                    case 3:
                        fileEntry = _a.sent();
                        return [4 /*yield*/, this.fileProvider.getFileObjectFromFileEntry(fileEntry)];
                    case 4:
                        fileObject = _a.sent();
                        return [2 /*return*/, fileObject.size];
                    case 5:
                        error_2 = _a.sent();
                        return [4 /*yield*/, this.wsProvider.getRemoteFileSize(file.fileurl)];
                    case 6:
                        size = _a.sent();
                        if (size === -1) {
                            throw new Error('Couldn\'t determine file size: ' + file.fileurl);
                        }
                        return [2 /*return*/, size];
                    case 7:
                        if (!file.name) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.fileProvider.getFileObjectFromFileEntry(file)];
                    case 8:
                        fileObject = _a.sent();
                        return [2 /*return*/, fileObject.size];
                    case 9: throw new Error('Couldn\'t determine file size: ' + file.fileurl);
                }
            });
        });
    };
    /**
     * Is the file openable in app.
     *
     * @param file The file to check.
     * @return bool.
     */
    CoreFileHelperProvider.prototype.isOpenableInApp = function (file) {
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(file.filename || file.name)[1];
        return !this.isFileTypeExcludedInApp(ext);
    };
    /**
     * Show a confirm asking the user if we wants to open the file.
     *
     * @param onlyDownload Whether the user is only downloading the file, not opening it.
     * @return Promise resolved if confirmed, rejected otherwise.
     */
    CoreFileHelperProvider.prototype.showConfirmOpenUnsupportedFile = function (onlyDownload) {
        var message = this.translate.instant('core.cannotopeninapp' + (onlyDownload ? 'download' : ''));
        var okButton = this.translate.instant(onlyDownload ? 'core.downloadfile' : 'core.openfile');
        return this.domUtils.showConfirm(message, undefined, okButton, undefined, { cssClass: 'core-modal-force-on-top' });
    };
    /**
     * Is the file type excluded to open in app.
     *
     * @param file The file to check.
     * @return bool.
     */
    CoreFileHelperProvider.prototype.isFileTypeExcludedInApp = function (fileType) {
        var currentSite = this.sitesProvider.getCurrentSite();
        var fileTypeExcludeList = currentSite && currentSite.getStoredConfig('tool_mobile_filetypeexclusionlist');
        if (!fileTypeExcludeList) {
            return false;
        }
        var regEx = new RegExp('(,|^)' + fileType + '(,|$)', 'g');
        return !!fileTypeExcludeList.match(regEx);
    };
    CoreFileHelperProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreDomUtilsProvider,
            CoreFileProvider,
            CoreFilepoolProvider,
            CoreSitesProvider,
            CoreAppProvider,
            TranslateService,
            CoreUtilsProvider,
            CoreWSProvider])
    ], CoreFileHelperProvider);
    return CoreFileHelperProvider;
}());
export { CoreFileHelperProvider };
var CoreFileHelper = /** @class */ (function (_super) {
    __extends(CoreFileHelper, _super);
    function CoreFileHelper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreFileHelper;
}(makeSingleton(CoreFileHelperProvider)));
export { CoreFileHelper };
//# sourceMappingURL=file-helper.js.map