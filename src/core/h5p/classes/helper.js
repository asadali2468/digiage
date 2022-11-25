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
import { CoreMimetypeUtils } from '@providers/utils/mimetype';
import { CoreTextUtils } from '@providers/utils/text';
import { CoreUtils } from '@providers/utils/utils';
import { CoreUser } from '@core/user/providers/user';
import { CoreH5P } from '../providers/h5p';
import { CoreH5PCore } from './core';
import { Translate } from '@singletons/core.singletons';
/**
 * Equivalent to Moodle's H5P helper class.
 */
var CoreH5PHelper = /** @class */ (function () {
    function CoreH5PHelper() {
    }
    /**
     * Convert the number representation of display options into an object.
     *
     * @param displayOptions Number representing display options.
     * @return Object with display options.
     */
    CoreH5PHelper.decodeDisplayOptions = function (displayOptions) {
        var displayOptionsObject = CoreH5P.instance.h5pCore.getDisplayOptionsAsObject(displayOptions);
        var config = {
            export: false,
            embed: false,
            copyright: CoreUtils.instance.notNullOrUndefined(displayOptionsObject[CoreH5PCore.DISPLAY_OPTION_COPYRIGHT]) ?
                displayOptionsObject[CoreH5PCore.DISPLAY_OPTION_COPYRIGHT] : false,
            icon: CoreUtils.instance.notNullOrUndefined(displayOptionsObject[CoreH5PCore.DISPLAY_OPTION_ABOUT]) ?
                displayOptionsObject[CoreH5PCore.DISPLAY_OPTION_ABOUT] : false,
        };
        config.frame = config.copyright || config.export || config.embed;
        return config;
    };
    /**
     * Get the core H5P assets, including all core H5P JavaScript and CSS.
     *
     * @return Array core H5P assets.
     */
    CoreH5PHelper.getCoreAssets = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, libUrl, cssRequires, jsRequires;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreH5PHelper.getCoreSettings(siteId)];
                    case 1:
                        settings = _a.sent();
                        settings.core = {
                            styles: [],
                            scripts: []
                        };
                        settings.loadedJs = [];
                        settings.loadedCss = [];
                        libUrl = CoreH5P.instance.h5pCore.h5pFS.getCoreH5PPath();
                        cssRequires = [];
                        jsRequires = [];
                        // Add core stylesheets.
                        CoreH5PCore.STYLES.forEach(function (style) {
                            settings.core.styles.push(libUrl + style);
                            cssRequires.push(libUrl + style);
                        });
                        // Add core JavaScript.
                        CoreH5PCore.getScripts().forEach(function (script) {
                            settings.core.scripts.push(script);
                            jsRequires.push(script);
                        });
                        return [2 /*return*/, { settings: settings, cssRequires: cssRequires, jsRequires: jsRequires }];
                }
            });
        });
    };
    /**
     * Get the settings needed by the H5P library.
     *
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with the settings.
     */
    CoreH5PHelper.getCoreSettings = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site, user, error_1, basePath, ajaxPaths;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, CoreUser.instance.getProfile(site.getUserId(), undefined, false, siteId)];
                    case 3:
                        user = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        if (!user || !user.email) {
                            throw Translate.instance.instant('core.h5p.errorgetemail');
                        }
                        basePath = CoreFile.instance.getBasePathInstant();
                        ajaxPaths = {
                            xAPIResult: '',
                            contentUserData: '',
                        };
                        return [2 /*return*/, {
                                baseUrl: CoreFile.instance.getWWWPath(),
                                url: CoreFile.instance.convertFileSrc(CoreTextUtils.instance.concatenatePaths(basePath, CoreH5P.instance.h5pCore.h5pFS.getExternalH5PFolderPath(site.getId()))),
                                urlLibraries: CoreFile.instance.convertFileSrc(CoreTextUtils.instance.concatenatePaths(basePath, CoreH5P.instance.h5pCore.h5pFS.getLibrariesFolderPath(site.getId()))),
                                postUserStatistics: false,
                                ajax: ajaxPaths,
                                saveFreq: false,
                                siteUrl: site.getURL(),
                                l10n: {
                                    H5P: CoreH5P.instance.h5pCore.getLocalization(),
                                },
                                user: { name: site.getInfo().fullname, mail: user.email },
                                hubIsEnabled: false,
                                reportingIsEnabled: false,
                                crossorigin: null,
                                libraryConfig: null,
                                pluginCacheBuster: '',
                                libraryUrl: CoreTextUtils.instance.concatenatePaths(CoreH5P.instance.h5pCore.h5pFS.getCoreH5PPath(), 'js'),
                            }];
                }
            });
        });
    };
    /**
     * Extract and store an H5P file.
     * This function won't validate most things because it should've been done by the server already.
     *
     * @param fileUrl The file URL used to download the file.
     * @param file The file entry of the downloaded file.
     * @param siteId Site ID. If not defined, current site.
     * @param onProgress Function to call on progress.
     * @return Promise resolved when done.
     */
    CoreH5PHelper.saveH5P = function (fileUrl, file, siteId, onProgress) {
        return __awaiter(this, void 0, void 0, function () {
            var queueId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        // Notify that the unzip is starting.
                        onProgress && onProgress({ message: 'core.unzipping' });
                        queueId = siteId + ':saveH5P:' + fileUrl;
                        return [4 /*yield*/, CoreH5P.instance.queueRunner.run(queueId, function () { return CoreH5PHelper.performSave(fileUrl, file, siteId, onProgress); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Extract and store an H5P file.
     *
     * @param fileUrl The file URL used to download the file.
     * @param file The file entry of the downloaded file.
     * @param siteId Site ID. If not defined, current site.
     * @param onProgress Function to call on progress.
     * @return Promise resolved when done.
     */
    CoreH5PHelper.performSave = function (fileUrl, file, siteId, onProgress) {
        return __awaiter(this, void 0, void 0, function () {
            var folderName, destFolder, contents, filesData, content, contentData, embedType, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        folderName = CoreMimetypeUtils.instance.removeExtension(file.name);
                        destFolder = CoreTextUtils.instance.concatenatePaths(CoreFileProvider.TMPFOLDER, 'h5p/' + folderName);
                        // Unzip the file.
                        return [4 /*yield*/, CoreFile.instance.unzipFile(file.toURL(), destFolder, onProgress)];
                    case 1:
                        // Unzip the file.
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 8, 12]);
                        // Notify that the unzip is starting.
                        onProgress && onProgress({ message: 'core.storingfiles' });
                        return [4 /*yield*/, CoreFile.instance.getDirectoryContents(destFolder)];
                    case 3:
                        contents = _a.sent();
                        return [4 /*yield*/, CoreH5P.instance.h5pValidator.processH5PFiles(destFolder, contents)];
                    case 4:
                        filesData = _a.sent();
                        return [4 /*yield*/, CoreH5P.instance.h5pStorage.savePackage(filesData, folderName, fileUrl, false, siteId)];
                    case 5:
                        content = _a.sent();
                        return [4 /*yield*/, CoreH5P.instance.h5pCore.loadContent(content.id, undefined, siteId)];
                    case 6:
                        contentData = _a.sent();
                        embedType = CoreH5PCore.determineEmbedType(contentData.embedType, contentData.library.embedTypes);
                        return [4 /*yield*/, CoreH5P.instance.h5pPlayer.createContentIndex(content.id, fileUrl, contentData, embedType, siteId)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, CoreFile.instance.removeDir(destFolder)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_2 = _a.sent();
                        return [3 /*break*/, 11];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    return CoreH5PHelper;
}());
export { CoreH5PHelper };
//# sourceMappingURL=helper.js.map