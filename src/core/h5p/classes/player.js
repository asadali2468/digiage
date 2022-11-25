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
import { CoreSites } from '@providers/sites';
import { CoreTextUtils } from '@providers/utils/text';
import { CoreUrlUtils } from '@providers/utils/url';
import { CoreUtils } from '@providers/utils/utils';
import { CoreXAPI } from '@core/xapi/providers/xapi';
import { CoreH5P } from '../providers/h5p';
import { CoreH5PCore } from './core';
import { CoreH5PHelper } from './helper';
/**
 * Equivalent to Moodle's H5P player class.
 */
var CoreH5PPlayer = /** @class */ (function () {
    function CoreH5PPlayer(h5pCore, h5pStorage) {
        this.h5pCore = h5pCore;
        this.h5pStorage = h5pStorage;
    }
    /**
     * Calculate the URL to the site H5P player.
     *
     * @param siteUrl Site URL.
     * @param fileUrl File URL.
     * @param displayOptions Display options.
     * @param component Component to send xAPI events to.
     * @return URL.
     */
    CoreH5PPlayer.prototype.calculateOnlinePlayerUrl = function (siteUrl, fileUrl, displayOptions, component) {
        fileUrl = CoreH5P.instance.treatH5PUrl(fileUrl, siteUrl);
        var params = this.getUrlParamsFromDisplayOptions(displayOptions);
        params.url = encodeURIComponent(fileUrl);
        if (component) {
            params.component = component;
        }
        return CoreUrlUtils.instance.addParamsToUrl(CoreTextUtils.instance.concatenatePaths(siteUrl, '/h5p/embed.php'), params);
    };
    /**
     * Create the index.html to render an H5P package.
     * Part of the code of this function is equivalent to Moodle's add_assets_to_page function.
     *
     * @param id Content ID.
     * @param h5pUrl The URL of the H5P file.
     * @param content Content data.
     * @param embedType Embed type. The app will always use 'iframe'.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the URL of the index file.
     */
    CoreH5PPlayer.prototype.createContentIndex = function (id, h5pUrl, content, embedType, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site, contentId, basePath, contentUrl, contentSettings, result, indexPath, html, fileEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        contentId = this.getContentId(id);
                        basePath = CoreFile.instance.getBasePathInstant();
                        contentUrl = CoreFile.instance.convertFileSrc(CoreTextUtils.instance.concatenatePaths(basePath, this.h5pCore.h5pFS.getContentFolderPath(content.folderName, site.getId())));
                        contentSettings = {
                            library: CoreH5PCore.libraryToString(content.library),
                            fullScreen: content.library.fullscreen,
                            exportUrl: '',
                            embedCode: this.getEmbedCode(site.getURL(), h5pUrl, true),
                            resizeCode: this.getResizeCode(),
                            title: content.slug,
                            displayOptions: {},
                            url: '',
                            contentUrl: contentUrl,
                            metadata: content.metadata,
                            contentUserData: [
                                {
                                    state: '{}'
                                }
                            ]
                        };
                        return [4 /*yield*/, this.getAssets(id, content, embedType, site.getId())];
                    case 2:
                        result = _a.sent();
                        result.settings.contents[contentId] = Object.assign(result.settings.contents[contentId], contentSettings);
                        indexPath = this.h5pCore.h5pFS.getContentIndexPath(content.folderName, siteId);
                        html = '<html><head><title>' + content.title + '</title>' +
                            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
                        // Include the required CSS.
                        result.cssRequires.forEach(function (cssUrl) {
                            html += '<link rel="stylesheet" type="text/css" href="' + cssUrl + '">';
                        });
                        // Add the settings.
                        html += '<script type="text/javascript">var H5PIntegration = ' +
                            JSON.stringify(result.settings).replace(/\//g, '\\/') + '</script>';
                        // Add our own script to handle the params.
                        html += '<script type="text/javascript" src="' + CoreTextUtils.instance.concatenatePaths(this.h5pCore.h5pFS.getCoreH5PPath(), 'moodle/js/params.js') + '"></script>';
                        html += '</head><body>';
                        // Include the required JS at the beginning of the body, like Moodle web does.
                        // Load the embed.js to allow communication with the parent window.
                        html += '<script type="text/javascript" src="' +
                            CoreTextUtils.instance.concatenatePaths(this.h5pCore.h5pFS.getCoreH5PPath(), 'moodle/js/embed.js') + '"></script>';
                        result.jsRequires.forEach(function (jsUrl) {
                            html += '<script type="text/javascript" src="' + jsUrl + '"></script>';
                        });
                        html += '<div class="h5p-iframe-wrapper">' +
                            '<iframe id="h5p-iframe-' + id + '" class="h5p-iframe" data-content-id="' + id + '"' +
                            'style="height:1px; min-width: 100%" src="about:blank"></iframe>' +
                            '</div></body>';
                        return [4 /*yield*/, CoreFile.instance.writeFile(indexPath, html)];
                    case 3:
                        fileEntry = _a.sent();
                        return [2 /*return*/, fileEntry.toURL()];
                }
            });
        });
    };
    /**
     * Delete all content indexes of all sites from filesystem.
     *
     * @return Promise resolved when done.
     */
    CoreH5PPlayer.prototype.deleteAllContentIndexes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var siteIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreSites.instance.getSitesIds()];
                    case 1:
                        siteIds = _a.sent();
                        return [4 /*yield*/, Promise.all(siteIds.map(function (siteId) { return _this.deleteAllContentIndexesForSite(siteId); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete all content indexes for a certain site from filesystem.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PPlayer.prototype.deleteAllContentIndexesForSite = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        return [4 /*yield*/, this.h5pCore.h5pFramework.getAllContentData(siteId)];
                    case 1:
                        records = _a.sent();
                        return [4 /*yield*/, Promise.all(records.map(function (record) { return __awaiter(_this, void 0, void 0, function () {
                                var err_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.h5pCore.h5pFS.deleteContentIndex(record.foldername, siteId)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            err_1 = _a.sent();
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
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
     * Delete all package content data.
     *
     * @param fileUrl File URL.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreH5PPlayer.prototype.deleteContentByUrl = function (fileUrl, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        return [4 /*yield*/, this.h5pCore.h5pFramework.getContentDataByUrl(fileUrl, siteId)];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, CoreUtils.instance.allPromises([
                                this.h5pCore.h5pFramework.deleteContentData(data.id, siteId),
                                this.h5pCore.h5pFS.deleteContentFolder(data.foldername, siteId),
                            ])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the assets of a package.
     *
     * @param id Content id.
     * @param content Content data.
     * @param embedType Embed type.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the assets.
     */
    CoreH5PPlayer.prototype.getAssets = function (id, content, embedType, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var coreAssets, contentId, settings, _a, _b, files;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        return [4 /*yield*/, CoreH5PHelper.getCoreAssets(siteId)];
                    case 1:
                        coreAssets = _c.sent();
                        contentId = this.getContentId(id);
                        settings = coreAssets.settings;
                        settings.contents = settings.contents || {};
                        settings.contents[contentId] = settings.contents[contentId] || {};
                        _a = settings;
                        return [4 /*yield*/, this.h5pCore.getDependencyRoots(id)];
                    case 2:
                        _a.moodleLibraryPaths = _c.sent();
                        /* The filterParameters function should be called before getting the dependency files because it rebuilds content
                           dependency cache. */
                        _b = settings.contents[contentId];
                        return [4 /*yield*/, this.h5pCore.filterParameters(content, siteId)];
                    case 3:
                        /* The filterParameters function should be called before getting the dependency files because it rebuilds content
                           dependency cache. */
                        _b.jsonContent = _c.sent();
                        return [4 /*yield*/, this.getDependencyFiles(id, content.folderName, siteId)];
                    case 4:
                        files = _c.sent();
                        // H5P checks the embedType in here, but we'll always use iframe so there's no need to do it.
                        // JavaScripts and stylesheets will be loaded through h5p.js.
                        settings.contents[contentId].scripts = this.h5pCore.getAssetsUrls(files.scripts);
                        settings.contents[contentId].styles = this.h5pCore.getAssetsUrls(files.styles);
                        return [2 /*return*/, {
                                settings: settings,
                                cssRequires: coreAssets.cssRequires,
                                jsRequires: coreAssets.jsRequires,
                            }];
                }
            });
        });
    };
    /**
     * Get the identifier for the H5P content. This identifier is different than the ID stored in the DB.
     *
     * @param id Package ID.
     * @return Content identifier.
     */
    CoreH5PPlayer.prototype.getContentId = function (id) {
        return 'cid-' + id;
    };
    /**
     * Get the content index file.
     *
     * @param fileUrl URL of the H5P package.
     * @param displayOptions Display options.
     * @param component Component to send xAPI events to.
     * @param contextId Context ID where the H5P is. Required for tracking.
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with the file URL if exists, rejected otherwise.
     */
    CoreH5PPlayer.prototype.getContentIndexFileUrl = function (fileUrl, displayOptions, component, contextId, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var path, data, params, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        return [4 /*yield*/, this.h5pCore.h5pFS.getContentIndexFileUrl(fileUrl, siteId)];
                    case 1:
                        path = _b.sent();
                        return [4 /*yield*/, this.h5pCore.h5pFramework.getContentDataByUrl(fileUrl, siteId)];
                    case 2:
                        data = _b.sent();
                        displayOptions = this.h5pCore.fixDisplayOptions(displayOptions, data.id);
                        params = {
                            displayOptions: JSON.stringify(displayOptions),
                            component: component || '',
                            trackingUrl: undefined,
                        };
                        if (!contextId) return [3 /*break*/, 4];
                        _a = params;
                        return [4 /*yield*/, CoreXAPI.instance.getUrl(contextId, 'activity', siteId)];
                    case 3:
                        _a.trackingUrl = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, CoreUrlUtils.instance.addParamsToUrl(path, params)];
                }
            });
        });
    };
    /**
     * Finds library dependencies files of a certain package.
     *
     * @param id Content id.
     * @param folderName Name of the folder of the content.
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with the files.
     */
    CoreH5PPlayer.prototype.getDependencyFiles = function (id, folderName, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var preloadedDeps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CoreH5P.instance.h5pCore.loadContentDependencies(id, 'preloaded', siteId)];
                    case 1:
                        preloadedDeps = _a.sent();
                        return [2 /*return*/, this.h5pCore.getDependenciesFiles(preloadedDeps, folderName, this.h5pCore.h5pFS.getExternalH5PFolderPath(siteId), siteId)];
                }
            });
        });
    };
    /**
     * Get display options from a URL params.
     *
     * @param params URL params.
     * @return Display options as object.
     */
    CoreH5PPlayer.prototype.getDisplayOptionsFromUrlParams = function (params) {
        var displayOptions = {};
        if (!params) {
            return displayOptions;
        }
        displayOptions[CoreH5PCore.DISPLAY_OPTION_DOWNLOAD] = false; // Never allow downloading in the app.
        displayOptions[CoreH5PCore.DISPLAY_OPTION_EMBED] = false; // Never show the embed option in the app.
        displayOptions[CoreH5PCore.DISPLAY_OPTION_COPYRIGHT] =
            CoreUtils.instance.isTrueOrOne(params[CoreH5PCore.DISPLAY_OPTION_COPYRIGHT]);
        displayOptions[CoreH5PCore.DISPLAY_OPTION_FRAME] = displayOptions[CoreH5PCore.DISPLAY_OPTION_DOWNLOAD] ||
            displayOptions[CoreH5PCore.DISPLAY_OPTION_EMBED] || displayOptions[CoreH5PCore.DISPLAY_OPTION_COPYRIGHT];
        displayOptions[CoreH5PCore.DISPLAY_OPTION_ABOUT] =
            !!this.h5pCore.h5pFramework.getOption(CoreH5PCore.DISPLAY_OPTION_ABOUT, true);
        return displayOptions;
    };
    /**
     * Embed code for settings.
     *
     * @param siteUrl The site URL.
     * @param h5pUrl The URL of the .h5p file.
     * @param embedEnabled Whether the option to embed the H5P content is enabled.
     * @return The HTML code to reuse this H5P content in a different place.
     */
    CoreH5PPlayer.prototype.getEmbedCode = function (siteUrl, h5pUrl, embedEnabled) {
        if (!embedEnabled) {
            return '';
        }
        return '<iframe src="' + this.getEmbedUrl(siteUrl, h5pUrl) + '" allowfullscreen="allowfullscreen"></iframe>';
    };
    /**
     * Get the encoded URL for embeding an H5P content.
     *
     * @param siteUrl The site URL.
     * @param h5pUrl The URL of the .h5p file.
     * @return The embed URL.
     */
    CoreH5PPlayer.prototype.getEmbedUrl = function (siteUrl, h5pUrl) {
        return CoreTextUtils.instance.concatenatePaths(siteUrl, '/h5p/embed.php') + '?url=' + h5pUrl;
    };
    /**
     * Resizing script for settings.
     *
     * @return The HTML code with the resize script.
     */
    CoreH5PPlayer.prototype.getResizeCode = function () {
        return '<script src="' + this.getResizerScriptUrl() + '"></script>';
    };
    /**
     * Get the URL to the resizer script.
     *
     * @return URL.
     */
    CoreH5PPlayer.prototype.getResizerScriptUrl = function () {
        return CoreTextUtils.instance.concatenatePaths(this.h5pCore.h5pFS.getCoreH5PPath(), 'js/h5p-resizer.js');
    };
    /**
     * Get online player URL params from display options.
     *
     * @param options Display options.
     * @return Object with URL params.
     */
    CoreH5PPlayer.prototype.getUrlParamsFromDisplayOptions = function (options) {
        var params = {};
        if (!options) {
            return params;
        }
        params[CoreH5PCore.DISPLAY_OPTION_FRAME] = options[CoreH5PCore.DISPLAY_OPTION_FRAME] ? '1' : '0';
        params[CoreH5PCore.DISPLAY_OPTION_DOWNLOAD] = options[CoreH5PCore.DISPLAY_OPTION_DOWNLOAD] ? '1' : '0';
        params[CoreH5PCore.DISPLAY_OPTION_EMBED] = options[CoreH5PCore.DISPLAY_OPTION_EMBED] ? '1' : '0';
        params[CoreH5PCore.DISPLAY_OPTION_COPYRIGHT] = options[CoreH5PCore.DISPLAY_OPTION_COPYRIGHT] ? '1' : '0';
        return params;
    };
    return CoreH5PPlayer;
}());
export { CoreH5PPlayer };
//# sourceMappingURL=player.js.map