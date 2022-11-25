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
import { CoreUtils } from '@providers/utils/utils';
import { CoreH5P } from '../providers/h5p';
import { CoreH5PFileStorage } from './file-storage';
import { CoreH5PContentValidator } from './content-validator';
import { Md5 } from 'ts-md5/dist/md5';
import { Translate } from '@singletons/core.singletons';
/**
 * Equivalent to H5P's H5PCore class.
 */
var CoreH5PCore = /** @class */ (function () {
    function CoreH5PCore(h5pFramework) {
        this.h5pFramework = h5pFramework;
        this.aggregateAssets = true;
        this.h5pFS = new CoreH5PFileStorage();
    }
    /**
     * Determine the correct embed type to use.
     *
     * @param Embed type of the content.
     * @param Embed type of the main library.
     * @return Either 'div' or 'iframe'.
     */
    CoreH5PCore.determineEmbedType = function (contentEmbedType, libraryEmbedTypes) {
        // Detect content embed type.
        var embedType = contentEmbedType.toLowerCase().indexOf('div') != -1 ? 'div' : 'iframe';
        if (libraryEmbedTypes) {
            // Check that embed type is available for library
            var embedTypes = libraryEmbedTypes.toLowerCase();
            if (embedTypes.indexOf(embedType) == -1) {
                // Not available, pick default.
                embedType = embedTypes.indexOf('div') != -1 ? 'div' : 'iframe';
            }
        }
        return embedType;
    };
    /**
     * Filter content run parameters and rebuild content dependency cache.
     *
     * @param content Content data.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the filtered params, resolved with null if error.
     */
    CoreH5PCore.prototype.filterParameters = function (content, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var params, validator, addons, _a, _b, _i, i, addon, addTo, i_1, type, paramsStr, error_1, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        if (content.filtered) {
                            return [2 /*return*/, content.filtered];
                        }
                        if (typeof content.library == 'undefined' || typeof content.params == 'undefined') {
                            return [2 /*return*/, null];
                        }
                        params = {
                            library: CoreH5PCore.libraryToString(content.library),
                            params: CoreTextUtils.instance.parseJSON(content.params, false),
                        };
                        if (!params.params) {
                            return [2 /*return*/, null];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 17, , 18]);
                        validator = new CoreH5PContentValidator(siteId);
                        // Validate the main library and its dependencies.
                        return [4 /*yield*/, validator.validateLibrary(params, { options: [params.library] })];
                    case 2:
                        // Validate the main library and its dependencies.
                        _c.sent();
                        return [4 /*yield*/, this.h5pFramework.loadAddons(siteId)];
                    case 3:
                        addons = _c.sent();
                        _a = [];
                        for (_b in addons)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                        i = _a[_i];
                        addon = addons[i];
                        addTo = addon.addTo;
                        if (!(addTo && addTo.content && addTo.content.types && addTo.content.types.length)) return [3 /*break*/, 8];
                        i_1 = 0;
                        _c.label = 5;
                    case 5:
                        if (!(i_1 < addTo.content.types.length)) return [3 /*break*/, 8];
                        type = addTo.content.types[i_1];
                        if (!(type && type.text && type.text.regex && this.textAddonMatches(params.params, type.text.regex))) return [3 /*break*/, 7];
                        return [4 /*yield*/, validator.addon(addon)];
                    case 6:
                        _c.sent();
                        // An addon shall only be added once.
                        return [3 /*break*/, 8];
                    case 7:
                        i_1++;
                        return [3 /*break*/, 5];
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        // Update content dependencies.
                        content.dependencies = validator.getDependencies();
                        paramsStr = JSON.stringify(params.params);
                        if (!content.id) return [3 /*break*/, 16];
                        _c.label = 10;
                    case 10:
                        _c.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, this.h5pFramework.deleteLibraryUsage(content.id, siteId)];
                    case 11:
                        _c.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        error_1 = _c.sent();
                        return [3 /*break*/, 13];
                    case 13: return [4 /*yield*/, this.h5pFramework.saveLibraryUsage(content.id, content.dependencies, siteId)];
                    case 14:
                        _c.sent();
                        if (!content.slug) {
                            content.slug = this.generateContentSlug(content);
                        }
                        // Cache.
                        return [4 /*yield*/, this.h5pFramework.updateContentFields(content.id, {
                                filtered: paramsStr,
                                slug: content.slug,
                            }, siteId)];
                    case 15:
                        // Cache.
                        _c.sent();
                        _c.label = 16;
                    case 16: return [2 /*return*/, paramsStr];
                    case 17:
                        error_2 = _c.sent();
                        return [2 /*return*/, null];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Recursive. Goes through the dependency tree for the given library and
     * adds all the dependencies to the given array in a flat format.
     *
     * @param dependencies Object where to save the dependencies.
     * @param library The library to find all dependencies for.
     * @param nextWeight An integer determining the order of the libraries when they are loaded.
     * @param editor Used internally to force all preloaded sub dependencies of an editor dependency to be editor dependencies.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the next weight.
     */
    CoreH5PCore.prototype.findLibraryDependencies = function (dependencies, library, nextWeight, editor, siteId) {
        if (nextWeight === void 0) { nextWeight = 1; }
        if (editor === void 0) { editor = false; }
        return __awaiter(this, void 0, void 0, function () {
            var types, _a, _b, _i, i, type, property, _c, _d, _e, j, dependency, dependencyKey, dependencyLibrary, weight;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        types = ['dynamic', 'preloaded', 'editor'];
                        _a = [];
                        for (_b in types)
                            _a.push(_b);
                        _i = 0;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        i = _a[_i];
                        type = types[i];
                        property = type + 'Dependencies';
                        if (!library[property]) {
                            return [3 /*break*/, 6]; // Skip, no such dependencies.
                        }
                        if (type === 'preloaded' && editor) {
                            // All preloaded dependencies of an editor library is set to editor.
                            type = 'editor';
                        }
                        _c = [];
                        for (_d in library[property])
                            _c.push(_d);
                        _e = 0;
                        _f.label = 2;
                    case 2:
                        if (!(_e < _c.length)) return [3 /*break*/, 6];
                        j = _c[_e];
                        dependency = library[property][j];
                        dependencyKey = type + '-' + dependency.machineName;
                        if (dependencies[dependencyKey]) {
                            return [3 /*break*/, 5]; // Skip, already have this.
                        }
                        return [4 /*yield*/, this.loadLibrary(dependency.machineName, dependency.majorVersion, dependency.minorVersion, siteId)];
                    case 3:
                        dependencyLibrary = _f.sent();
                        dependencies[dependencyKey] = {
                            library: dependencyLibrary,
                            type: type
                        };
                        return [4 /*yield*/, this.findLibraryDependencies(dependencies, dependencyLibrary, nextWeight, type === 'editor', siteId)];
                    case 4:
                        weight = _f.sent();
                        nextWeight = weight;
                        dependencies[dependencyKey].weight = nextWeight++;
                        _f.label = 5;
                    case 5:
                        _e++;
                        return [3 /*break*/, 2];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, nextWeight];
                }
            });
        });
    };
    /**
     * Validate and fix display options, updating them if needed.
     *
     * @param displayOptions The display options to validate.
     * @param id Package ID.
     */
    CoreH5PCore.prototype.fixDisplayOptions = function (displayOptions, id) {
        // Never allow downloading in the app.
        displayOptions[CoreH5PCore.DISPLAY_OPTION_DOWNLOAD] = false;
        // Never show the embed option in the app.
        displayOptions[CoreH5PCore.DISPLAY_OPTION_EMBED] = false;
        if (!this.h5pFramework.getOption(CoreH5PCore.DISPLAY_OPTION_FRAME, true)) {
            displayOptions[CoreH5PCore.DISPLAY_OPTION_FRAME] = false;
        }
        else if (this.h5pFramework.getOption(CoreH5PCore.DISPLAY_OPTION_COPYRIGHT, true) == false) {
            displayOptions[CoreH5PCore.DISPLAY_OPTION_COPYRIGHT] = false;
        }
        displayOptions[CoreH5PCore.DISPLAY_OPTION_COPY] = this.h5pFramework.hasPermission(CoreH5PPermission.COPY_H5P, id);
        return displayOptions;
    };
    /**
     * Parses library data from a string on the form {machineName} {majorVersion}.{minorVersion}.
     *
     * @param libraryString On the form {machineName} {majorVersion}.{minorVersion}
     * @return Object with keys machineName, majorVersion and minorVersion. Null if string is not parsable.
     */
    CoreH5PCore.prototype.generateContentSlug = function (content) {
        var slug = CoreH5PCore.slugify(content.title);
        var available = null;
        while (!available) {
            if (available === false) {
                // If not available, add number suffix.
                var matches = slug.match(/(.+-)([0-9]+)$/);
                if (matches) {
                    slug = matches[1] + (Number(matches[2]) + 1);
                }
                else {
                    slug += '-2';
                }
            }
            available = this.h5pFramework.isContentSlugAvailable(slug);
        }
        return slug;
    };
    /**
     * Combines path with version.
     *
     * @param assets List of assets to get their URLs.
     * @param assetsFolderPath The path of the folder where the assets are.
     * @return List of urls.
     */
    CoreH5PCore.prototype.getAssetsUrls = function (assets, assetsFolderPath) {
        if (assetsFolderPath === void 0) { assetsFolderPath = ''; }
        var urls = [];
        assets.forEach(function (asset) {
            var url = asset.path;
            // Add URL prefix if not external.
            if (asset.path.indexOf('://') == -1 && assetsFolderPath) {
                url = CoreTextUtils.instance.concatenatePaths(assetsFolderPath, url);
            }
            // Add version if set.
            if (asset.version) {
                url += asset.version;
            }
            urls.push(url);
        });
        return urls;
    };
    /**
     * Return file paths for all dependencies files.
     *
     * @param dependencies The dependencies to get the files.
     * @param folderName Name of the folder of the content.
     * @param prefix Make paths relative to another dir.
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with the files.
     */
    CoreH5PCore.prototype.getDependenciesFiles = function (dependencies, folderName, prefix, siteId) {
        if (prefix === void 0) { prefix = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var files, cachedAssetsHash, cachedAssets, key, dependency;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = {
                            scripts: [],
                            styles: [],
                        };
                        // Avoid caching empty files.
                        if (!Object.keys(dependencies).length) {
                            return [2 /*return*/, files];
                        }
                        if (!this.aggregateAssets) return [3 /*break*/, 2];
                        // Get aggregated files for assets.
                        cachedAssetsHash = CoreH5PCore.getDependenciesHash(dependencies);
                        return [4 /*yield*/, this.h5pFS.getCachedAssets(cachedAssetsHash)];
                    case 1:
                        cachedAssets = _a.sent();
                        if (cachedAssets) {
                            // Cached assets found, return them.
                            return [2 /*return*/, Object.assign(files, cachedAssets)];
                        }
                        _a.label = 2;
                    case 2:
                        // No cached assets, use content dependencies.
                        for (key in dependencies) {
                            dependency = dependencies[key];
                            if (!dependency.path) {
                                dependency.path = this.h5pFS.getDependencyPath(dependency);
                                dependency.preloadedJs = dependency.preloadedJs.split(',');
                                dependency.preloadedCss = dependency.preloadedCss.split(',');
                            }
                            dependency.version = '?ver=' + dependency.majorVersion + '.' + dependency.minorVersion + '.' + dependency.patchVersion;
                            this.getDependencyAssets(dependency, 'preloadedJs', files.scripts, prefix);
                            this.getDependencyAssets(dependency, 'preloadedCss', files.styles, prefix);
                        }
                        if (!this.aggregateAssets) return [3 /*break*/, 5];
                        // Aggregate and store assets.
                        return [4 /*yield*/, this.h5pFS.cacheAssets(files, cachedAssetsHash, folderName, siteId)];
                    case 3:
                        // Aggregate and store assets.
                        _a.sent();
                        // Keep track of which libraries have been cached in case they are updated.
                        return [4 /*yield*/, this.h5pFramework.saveCachedAssets(cachedAssetsHash, dependencies, folderName, siteId)];
                    case 4:
                        // Keep track of which libraries have been cached in case they are updated.
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, files];
                }
            });
        });
    };
    /**
     * Get the hash of a list of dependencies.
     *
     * @param dependencies Dependencies.
     * @return Hash.
     */
    CoreH5PCore.getDependenciesHash = function (dependencies) {
        // Build hash of dependencies.
        var toHash = [];
        // Use unique identifier for each library version.
        for (var name_1 in dependencies) {
            var dep = dependencies[name_1];
            toHash.push(dep.machineName + '-' + dep.majorVersion + '.' + dep.minorVersion + '.' + dep.patchVersion);
        }
        // Sort in case the same dependencies comes in a different order.
        toHash.sort(function (a, b) {
            return a.localeCompare(b);
        });
        // Calculate hash.
        return Md5.hashAsciiStr(toHash.join(''));
    };
    /**
     * Get the paths to the content dependencies.
     *
     * @param id The H5P content ID.
     * @param siteId The site ID. If not defined, current site.
     * @return Promise resolved with an object containing the path of each content dependency.
     */
    CoreH5PCore.prototype.getDependencyRoots = function (id, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var roots, dependencies, machineName, dependency, folderName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        roots = {};
                        return [4 /*yield*/, this.h5pFramework.loadContentDependencies(id, undefined, siteId)];
                    case 1:
                        dependencies = _a.sent();
                        for (machineName in dependencies) {
                            dependency = dependencies[machineName];
                            folderName = CoreH5PCore.libraryToString(dependency, true);
                            roots[folderName] = this.h5pFS.getLibraryFolderPath(dependency, siteId, folderName);
                        }
                        return [2 /*return*/, roots];
                }
            });
        });
    };
    /**
     * Get all dependency assets of the given type.
     *
     * @param dependency The dependency.
     * @param type Type of assets to get.
     * @param assets Array where to store the assets.
     * @param prefix Make paths relative to another dir.
     */
    CoreH5PCore.prototype.getDependencyAssets = function (dependency, type, assets, prefix) {
        if (prefix === void 0) { prefix = ''; }
        // Check if dependency has any files of this type
        if (!dependency[type] || dependency[type][0] === '') {
            return;
        }
        // Check if we should skip CSS.
        if (type === 'preloadedCss' && CoreUtils.instance.isTrueOrOne(dependency.dropCss)) {
            return;
        }
        for (var key in dependency[type]) {
            var file = dependency[type][key];
            assets.push({
                path: prefix + '/' + dependency.path + '/' + (typeof file != 'string' ? file.path : file).trim(),
                version: dependency.version
            });
        }
    };
    /**
     * Convert display options to an object.
     *
     * @param disable Display options as a number.
     * @return Display options as object.
     */
    CoreH5PCore.prototype.getDisplayOptionsAsObject = function (disable) {
        var displayOptions = {};
        // tslint:disable: no-bitwise
        displayOptions[CoreH5PCore.DISPLAY_OPTION_FRAME] = !(disable & CoreH5PCore.DISABLE_FRAME);
        displayOptions[CoreH5PCore.DISPLAY_OPTION_DOWNLOAD] = false; // Never allow downloading in the app.
        displayOptions[CoreH5PCore.DISPLAY_OPTION_EMBED] = false; // Never show the embed option in the app.
        displayOptions[CoreH5PCore.DISPLAY_OPTION_COPYRIGHT] = !(disable & CoreH5PCore.DISABLE_COPYRIGHT);
        displayOptions[CoreH5PCore.DISPLAY_OPTION_ABOUT] = !!this.h5pFramework.getOption(CoreH5PCore.DISPLAY_OPTION_ABOUT, true);
        return displayOptions;
    };
    /**
     * Determine display option visibility when viewing H5P
     *
     * @param disable The display options as a number.
     * @param id Package ID.
     * @return Display options as object.
     */
    CoreH5PCore.prototype.getDisplayOptionsForView = function (disable, id) {
        return this.fixDisplayOptions(this.getDisplayOptionsAsObject(disable), id);
    };
    /**
     * Provide localization for the Core JS.
     *
     * @return Object with the translations.
     */
    CoreH5PCore.prototype.getLocalization = function () {
        return {
            fullscreen: Translate.instance.instant('core.h5p.fullscreen'),
            disableFullscreen: Translate.instance.instant('core.h5p.disablefullscreen'),
            download: Translate.instance.instant('core.h5p.download'),
            copyrights: Translate.instance.instant('core.h5p.copyright'),
            embed: Translate.instance.instant('core.h5p.embed'),
            size: Translate.instance.instant('core.h5p.size'),
            showAdvanced: Translate.instance.instant('core.h5p.showadvanced'),
            hideAdvanced: Translate.instance.instant('core.h5p.hideadvanced'),
            advancedHelp: Translate.instance.instant('core.h5p.resizescript'),
            copyrightInformation: Translate.instance.instant('core.h5p.copyright'),
            close: Translate.instance.instant('core.h5p.close'),
            title: Translate.instance.instant('core.h5p.title'),
            author: Translate.instance.instant('core.h5p.author'),
            year: Translate.instance.instant('core.h5p.year'),
            source: Translate.instance.instant('core.h5p.source'),
            license: Translate.instance.instant('core.h5p.license'),
            thumbnail: Translate.instance.instant('core.h5p.thumbnail'),
            noCopyrights: Translate.instance.instant('core.h5p.nocopyright'),
            reuse: Translate.instance.instant('core.h5p.reuse'),
            reuseContent: Translate.instance.instant('core.h5p.reuseContent'),
            reuseDescription: Translate.instance.instant('core.h5p.reuseDescription'),
            downloadDescription: Translate.instance.instant('core.h5p.downloadtitle'),
            copyrightsDescription: Translate.instance.instant('core.h5p.copyrighttitle'),
            embedDescription: Translate.instance.instant('core.h5p.embedtitle'),
            h5pDescription: Translate.instance.instant('core.h5p.h5ptitle'),
            contentChanged: Translate.instance.instant('core.h5p.contentchanged'),
            startingOver: Translate.instance.instant('core.h5p.startingover'),
            by: Translate.instance.instant('core.h5p.by'),
            showMore: Translate.instance.instant('core.h5p.showmore'),
            showLess: Translate.instance.instant('core.h5p.showless'),
            subLevel: Translate.instance.instant('core.h5p.sublevel'),
            confirmDialogHeader: Translate.instance.instant('core.h5p.confirmdialogheader'),
            confirmDialogBody: Translate.instance.instant('core.h5p.confirmdialogbody'),
            cancelLabel: Translate.instance.instant('core.h5p.cancellabel'),
            confirmLabel: Translate.instance.instant('core.h5p.confirmlabel'),
            licenseU: Translate.instance.instant('core.h5p.undisclosed'),
            licenseCCBY: Translate.instance.instant('core.h5p.ccattribution'),
            licenseCCBYSA: Translate.instance.instant('core.h5p.ccattributionsa'),
            licenseCCBYND: Translate.instance.instant('core.h5p.ccattributionnd'),
            licenseCCBYNC: Translate.instance.instant('core.h5p.ccattributionnc'),
            licenseCCBYNCSA: Translate.instance.instant('core.h5p.ccattributionncsa'),
            licenseCCBYNCND: Translate.instance.instant('core.h5p.ccattributionncnd'),
            licenseCC40: Translate.instance.instant('core.h5p.licenseCC40'),
            licenseCC30: Translate.instance.instant('core.h5p.licenseCC30'),
            licenseCC25: Translate.instance.instant('core.h5p.licenseCC25'),
            licenseCC20: Translate.instance.instant('core.h5p.licenseCC20'),
            licenseCC10: Translate.instance.instant('core.h5p.licenseCC10'),
            licenseGPL: Translate.instance.instant('core.h5p.licenseGPL'),
            licenseV3: Translate.instance.instant('core.h5p.licenseV3'),
            licenseV2: Translate.instance.instant('core.h5p.licenseV2'),
            licenseV1: Translate.instance.instant('core.h5p.licenseV1'),
            licensePD: Translate.instance.instant('core.h5p.pd'),
            licenseCC010: Translate.instance.instant('core.h5p.licenseCC010'),
            licensePDM: Translate.instance.instant('core.h5p.pdm'),
            licenseC: Translate.instance.instant('core.h5p.copyrightstring'),
            contentType: Translate.instance.instant('core.h5p.contenttype'),
            licenseExtras: Translate.instance.instant('core.h5p.licenseextras'),
            changes: Translate.instance.instant('core.h5p.changelog'),
            contentCopied: Translate.instance.instant('core.h5p.contentCopied'),
            connectionLost: Translate.instance.instant('core.h5p.connectionLost'),
            connectionReestablished: Translate.instance.instant('core.h5p.connectionReestablished'),
            resubmitScores: Translate.instance.instant('core.h5p.resubmitScores'),
            offlineDialogHeader: Translate.instance.instant('core.h5p.offlineDialogHeader'),
            offlineDialogBody: Translate.instance.instant('core.h5p.offlineDialogBody'),
            offlineDialogRetryMessage: Translate.instance.instant('core.h5p.offlineDialogRetryMessage'),
            offlineDialogRetryButtonLabel: Translate.instance.instant('core.h5p.offlineDialogRetryButtonLabel'),
            offlineSuccessfulSubmit: Translate.instance.instant('core.h5p.offlineSuccessfulSubmit'),
        };
    };
    /**
     * Get core JavaScript files.
     *
     * @return array The array containg urls of the core JavaScript files:
     */
    CoreH5PCore.getScripts = function () {
        var libUrl = CoreH5P.instance.h5pCore.h5pFS.getCoreH5PPath();
        var urls = [];
        CoreH5PCore.SCRIPTS.forEach(function (script) {
            urls.push(libUrl + script);
        });
        urls.push(CoreTextUtils.instance.concatenatePaths(libUrl, 'moodle/js/h5p_overrides.js'));
        return urls;
    };
    /**
     * Parses library data from a string on the form {machineName} {majorVersion}.{minorVersion}.
     *
     * @param libraryString On the form {machineName} {majorVersion}.{minorVersion}
     * @return Object with keys machineName, majorVersion and minorVersion. Null if string is not parsable.
     */
    CoreH5PCore.libraryFromString = function (libraryString) {
        var matches = libraryString.match(/^([\w0-9\-\.]{1,255})[\-\ ]([0-9]{1,5})\.([0-9]{1,5})$/i);
        if (matches && matches.length >= 4) {
            return {
                machineName: matches[1],
                majorVersion: Number(matches[2]),
                minorVersion: Number(matches[3])
            };
        }
        return null;
    };
    /**
     * Writes library data as string on the form {machineName} {majorVersion}.{minorVersion}.
     *
     * @param libraryData Library data.
     * @param folderName Use hyphen instead of space in returned string.
     * @return String on the form {machineName} {majorVersion}.{minorVersion}.
     */
    CoreH5PCore.libraryToString = function (libraryData, folderName) {
        return (libraryData.machineName ? libraryData.machineName : libraryData.name) + (folderName ? '-' : ' ') +
            libraryData.majorVersion + '.' + libraryData.minorVersion;
    };
    /**
     * Load content data from DB.
     *
     * @param id Content ID.
     * @param fileUrl H5P file URL. Required if id is not provided.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the content data.
     */
    CoreH5PCore.prototype.loadContent = function (id, fileUrl, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var content, validator, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        siteId = siteId || CoreSites.instance.getCurrentSiteId();
                        return [4 /*yield*/, this.h5pFramework.loadContent(id, fileUrl, siteId)];
                    case 1:
                        content = _b.sent();
                        validator = new CoreH5PContentValidator(siteId);
                        _a = content;
                        return [4 /*yield*/, validator.validateMetadata(content.metadata)];
                    case 2:
                        _a.metadata = _b.sent();
                        return [2 /*return*/, {
                                id: content.id,
                                params: content.params,
                                embedType: content.embedType,
                                disable: content.disable,
                                folderName: content.folderName,
                                title: content.title,
                                slug: content.slug,
                                filtered: content.filtered,
                                libraryMajorVersion: content.libraryMajorVersion,
                                libraryMinorVersion: content.libraryMinorVersion,
                                metadata: content.metadata,
                                library: {
                                    id: content.libraryId,
                                    name: content.libraryName,
                                    majorVersion: content.libraryMajorVersion,
                                    minorVersion: content.libraryMinorVersion,
                                    embedTypes: content.libraryEmbedTypes,
                                    fullscreen: content.libraryFullscreen,
                                },
                            }];
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
    CoreH5PCore.prototype.loadContentDependencies = function (id, type, siteId) {
        return this.h5pFramework.loadContentDependencies(id, type, siteId);
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
    CoreH5PCore.prototype.loadLibrary = function (machineName, majorVersion, minorVersion, siteId) {
        return this.h5pFramework.loadLibrary(machineName, majorVersion, minorVersion, siteId);
    };
    /**
     * Check if the current user has permission to update and install new libraries.
     *
     * @return Whether has permissions.
     */
    CoreH5PCore.prototype.mayUpdateLibraries = function () {
        // In the app the installation only affects current user, so the user always has permissions.
        return true;
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
    CoreH5PCore.prototype.saveContent = function (content, folderName, fileUrl, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = content;
                        return [4 /*yield*/, this.h5pFramework.updateContent(content, folderName, fileUrl, siteId)];
                    case 1:
                        _a.id = _b.sent();
                        // Some user data for content has to be reset when the content changes.
                        return [4 /*yield*/, this.h5pFramework.resetContentUserData(content.id, siteId)];
                    case 2:
                        // Some user data for content has to be reset when the content changes.
                        _b.sent();
                        return [2 /*return*/, content.id];
                }
            });
        });
    };
    /**
     * Helper function used to figure out embed and download behaviour.
     *
     * @param optionName The option name.
     * @param permission The permission.
     * @param id The package ID.
     * @param value Default value.
     * @return The value to use.
     */
    CoreH5PCore.prototype.setDisplayOptionOverrides = function (optionName, permission, id, value) {
        var behaviour = this.h5pFramework.getOption(optionName, CoreH5PDisplayOptionBehaviour.ALWAYS_SHOW);
        // If never show globally, force hide
        if (behaviour == CoreH5PDisplayOptionBehaviour.NEVER_SHOW) {
            value = false;
        }
        else if (behaviour == CoreH5PDisplayOptionBehaviour.ALWAYS_SHOW) {
            // If always show or permissions say so, force show
            value = true;
        }
        else if (behaviour == CoreH5PDisplayOptionBehaviour.CONTROLLED_BY_PERMISSIONS) {
            value = this.h5pFramework.hasPermission(permission, id);
        }
        return value;
    };
    /**
     * Convert strings of text into simple kebab case slugs. Based on H5PCore::slugify.
     *
     * @param input The string to slugify.
     * @return Slugified text.
     */
    CoreH5PCore.slugify = function (input) {
        input = input || '';
        input = input.toLowerCase();
        // Replace common chars.
        var newInput = '';
        for (var i = 0; i < input.length; i++) {
            var char = input[i];
            newInput += CoreH5PCore.SLUGIFY_MAP[char] || char;
        }
        // Replace everything else.
        newInput = newInput.replace(/[^a-z0-9]/g, '-');
        // Prevent double hyphen
        newInput = newInput.replace(/-{2,}/g, '-');
        // Prevent hyphen in beginning or end.
        newInput = newInput.replace(/(^-+|-+$)/g, '');
        // Prevent too long slug.
        if (newInput.length > 91) {
            newInput = newInput.substr(0, 92);
        }
        // Prevent empty slug
        if (newInput === '') {
            newInput = 'interactive';
        }
        return newInput;
    };
    /**
     * Determine if params contain any match.
     *
     * @param params Parameters.
     * @param pattern Regular expression to identify pattern.
     * @return True if params matches pattern.
     */
    CoreH5PCore.prototype.textAddonMatches = function (params, pattern) {
        if (typeof params == 'string') {
            if (params.match(pattern)) {
                return true;
            }
        }
        else if (typeof params == 'object') {
            for (var key in params) {
                var value = params[key];
                if (this.textAddonMatches(value, pattern)) {
                    return true;
                }
            }
        }
        return false;
    };
    CoreH5PCore.STYLES = [
        'styles/h5p.css',
        'styles/h5p-confirmation-dialog.css',
        'styles/h5p-core-button.css'
    ];
    CoreH5PCore.SCRIPTS = [
        'js/jquery.js',
        'js/h5p.js',
        'js/h5p-event-dispatcher.js',
        'js/h5p-x-api-event.js',
        'js/h5p-x-api.js',
        'js/h5p-content-type.js',
        'js/h5p-confirmation-dialog.js',
        'js/h5p-action-bar.js',
        'js/request-queue.js',
    ];
    CoreH5PCore.ADMIN_SCRIPTS = [
        'js/jquery.js',
        'js/h5p-utils.js',
    ];
    // Disable flags
    CoreH5PCore.DISABLE_NONE = 0;
    CoreH5PCore.DISABLE_FRAME = 1;
    CoreH5PCore.DISABLE_DOWNLOAD = 2;
    CoreH5PCore.DISABLE_EMBED = 4;
    CoreH5PCore.DISABLE_COPYRIGHT = 8;
    CoreH5PCore.DISABLE_ABOUT = 16;
    CoreH5PCore.DISPLAY_OPTION_FRAME = 'frame';
    CoreH5PCore.DISPLAY_OPTION_DOWNLOAD = 'export';
    CoreH5PCore.DISPLAY_OPTION_EMBED = 'embed';
    CoreH5PCore.DISPLAY_OPTION_COPYRIGHT = 'copyright';
    CoreH5PCore.DISPLAY_OPTION_ABOUT = 'icon';
    CoreH5PCore.DISPLAY_OPTION_COPY = 'copy';
    // Map to slugify characters.
    CoreH5PCore.SLUGIFY_MAP = {
        æ: 'ae', ø: 'oe', ö: 'o', ó: 'o', ô: 'o', Ò: 'oe', Õ: 'o', Ý: 'o', ý: 'y', ÿ: 'y', ā: 'y', ă: 'a', ą: 'a', œ: 'a', å: 'a',
        ä: 'a', á: 'a', à: 'a', â: 'a', ã: 'a', ç: 'c', ć: 'c', ĉ: 'c', ċ: 'c', č: 'c', é: 'e', è: 'e', ê: 'e', ë: 'e', í: 'i',
        ì: 'i', î: 'i', ï: 'i', ú: 'u', ñ: 'n', ü: 'u', ù: 'u', û: 'u', ß: 'es', ď: 'd', đ: 'd', ē: 'e', ĕ: 'e', ė: 'e', ę: 'e',
        ě: 'e', ĝ: 'g', ğ: 'g', ġ: 'g', ģ: 'g', ĥ: 'h', ħ: 'h', ĩ: 'i', ī: 'i', ĭ: 'i', į: 'i', ı: 'i', ĳ: 'ij', ĵ: 'j', ķ: 'k',
        ĺ: 'l', ļ: 'l', ľ: 'l', ŀ: 'l', ł: 'l', ń: 'n', ņ: 'n', ň: 'n', ŉ: 'n', ō: 'o', ŏ: 'o', ő: 'o', ŕ: 'r', ŗ: 'r', ř: 'r',
        ś: 's', ŝ: 's', ş: 's', š: 's', ţ: 't', ť: 't', ŧ: 't', ũ: 'u', ū: 'u', ŭ: 'u', ů: 'u', ű: 'u', ų: 'u', ŵ: 'w', ŷ: 'y',
        ź: 'z', ż: 'z', ž: 'z', ſ: 's', ƒ: 'f', ơ: 'o', ư: 'u', ǎ: 'a', ǐ: 'i', ǒ: 'o', ǔ: 'u', ǖ: 'u', ǘ: 'u', ǚ: 'u', ǜ: 'u',
        ǻ: 'a', ǽ: 'ae', ǿ: 'oe'
    };
    return CoreH5PCore;
}());
export { CoreH5PCore };
/**
 * Display options behaviour constants.
 */
var CoreH5PDisplayOptionBehaviour = /** @class */ (function () {
    function CoreH5PDisplayOptionBehaviour() {
    }
    CoreH5PDisplayOptionBehaviour.NEVER_SHOW = 0;
    CoreH5PDisplayOptionBehaviour.CONTROLLED_BY_AUTHOR_DEFAULT_ON = 1;
    CoreH5PDisplayOptionBehaviour.CONTROLLED_BY_AUTHOR_DEFAULT_OFF = 2;
    CoreH5PDisplayOptionBehaviour.ALWAYS_SHOW = 3;
    CoreH5PDisplayOptionBehaviour.CONTROLLED_BY_PERMISSIONS = 4;
    return CoreH5PDisplayOptionBehaviour;
}());
export { CoreH5PDisplayOptionBehaviour };
/**
 * Permission constants.
 */
var CoreH5PPermission = /** @class */ (function () {
    function CoreH5PPermission() {
    }
    CoreH5PPermission.DOWNLOAD_H5P = 0;
    CoreH5PPermission.EMBED_H5P = 1;
    CoreH5PPermission.CREATE_RESTRICTED = 2;
    CoreH5PPermission.UPDATE_LIBRARIES = 3;
    CoreH5PPermission.INSTALL_RECOMMENDED = 4;
    CoreH5PPermission.COPY_H5P = 4;
    return CoreH5PPermission;
}());
export { CoreH5PPermission };
//# sourceMappingURL=core.js.map