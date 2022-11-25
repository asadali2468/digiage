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
import { Injectable, NgZone } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Clipboard } from '@ionic-native/clipboard';
import { FileOpener } from '@ionic-native/file-opener';
import { WebIntent } from '@ionic-native/web-intent';
import { QRScanner } from '@ionic-native/qr-scanner';
import { CoreApp } from '../app';
import { CoreDomUtilsProvider } from './dom';
import { CoreMimetypeUtilsProvider } from './mimetype';
import { CoreTextUtilsProvider } from './text';
import { CoreEventsProvider } from '../events';
import { CoreLoggerProvider } from '../logger';
import { TranslateService } from '@ngx-translate/core';
import { CoreLangProvider } from '../lang';
import { CoreWSProvider } from '../ws';
import { CoreFile } from '../file';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * "Utils" service with helper functions.
 */
var CoreUtilsProvider = /** @class */ (function () {
    function CoreUtilsProvider(iab, clipboard, domUtils, logger, translate, platform, langProvider, eventsProvider, fileOpener, mimetypeUtils, webIntent, wsProvider, zone, textUtils, modalCtrl, qrScanner) {
        this.iab = iab;
        this.clipboard = clipboard;
        this.domUtils = domUtils;
        this.translate = translate;
        this.platform = platform;
        this.langProvider = langProvider;
        this.eventsProvider = eventsProvider;
        this.fileOpener = fileOpener;
        this.mimetypeUtils = mimetypeUtils;
        this.webIntent = webIntent;
        this.wsProvider = wsProvider;
        this.zone = zone;
        this.textUtils = textUtils;
        this.modalCtrl = modalCtrl;
        this.qrScanner = qrScanner;
        this.DONT_CLONE = ['[object FileEntry]', '[object DirectoryEntry]', '[object DOMFileSystem]'];
        this.uniqueIds = {};
        this.logger = logger.getInstance('CoreUtilsProvider');
        this.platform.ready().then(function () {
            var win = window;
            if (win.cordova && win.cordova.InAppBrowser) {
                // Override the default window.open with the InAppBrowser one.
                win.open = win.cordova.InAppBrowser.open;
            }
        });
    }
    /**
     * Given an error, add an extra warning to the error message and return the new error message.
     *
     * @param error Error object or message.
     * @param defaultError Message to show if the error is not a string.
     * @return New error message.
     */
    CoreUtilsProvider.prototype.addDataNotDownloadedError = function (error, defaultError) {
        var errorMessage = error;
        if (error && typeof error != 'string') {
            errorMessage = this.textUtils.getErrorMessageFromError(error);
        }
        if (typeof errorMessage != 'string') {
            errorMessage = defaultError || '';
        }
        if (!this.isWebServiceError(error)) {
            // Local error. Add an extra warning.
            errorMessage += '<br><br>' + this.translate.instant('core.errorsomedatanotdownloaded');
        }
        return errorMessage;
    };
    /**
     * Similar to Promise.all, but if a promise fails this function's promise won't be rejected until ALL promises have finished.
     *
     * @param promises Promises.
     * @return Promise resolved if all promises are resolved and rejected if at least 1 promise fails.
     */
    CoreUtilsProvider.prototype.allPromises = function (promises) {
        if (!promises || !promises.length) {
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            var total = promises.length;
            var count = 0, hasFailed = false, error;
            promises.forEach(function (promise) {
                promise.catch(function (err) {
                    hasFailed = true;
                    error = err;
                }).finally(function () {
                    count++;
                    if (count === total) {
                        // All promises have finished, reject/resolve.
                        if (hasFailed) {
                            reject(error);
                        }
                        else {
                            resolve();
                        }
                    }
                });
            });
        });
    };
    /**
     * Converts an array of objects to an object, using a property of each entry as the key.
     * It can also be used to convert an array of strings to an object where the keys are the elements of the array.
     * E.g. [{id: 10, name: 'A'}, {id: 11, name: 'B'}] => {10: {id: 10, name: 'A'}, 11: {id: 11, name: 'B'}}
     *
     * @param array The array to convert.
     * @param propertyName The name of the property to use as the key. If not provided, the whole item will be used.
     * @param result Object where to put the properties. If not defined, a new object will be created.
     * @return The object.
     */
    CoreUtilsProvider.prototype.arrayToObject = function (array, propertyName, result) {
        result = result || {};
        array.forEach(function (entry) {
            var key = propertyName ? entry[propertyName] : entry;
            result[key] = entry;
        });
        return result;
    };
    /**
     * Compare two objects. This function won't compare functions and proto properties, it's a basic compare.
     * Also, this will only check if itemA's properties are in itemB with same value. This function will still
     * return true if itemB has more properties than itemA.
     *
     * @param itemA First object.
     * @param itemB Second object.
     * @param maxLevels Number of levels to reach if 2 objects are compared.
     * @param level Current deep level (when comparing objects).
     * @param undefinedIsNull True if undefined is equal to null. Defaults to true.
     * @return Whether both items are equal.
     */
    CoreUtilsProvider.prototype.basicLeftCompare = function (itemA, itemB, maxLevels, level, undefinedIsNull) {
        if (maxLevels === void 0) { maxLevels = 0; }
        if (level === void 0) { level = 0; }
        if (undefinedIsNull === void 0) { undefinedIsNull = true; }
        if (typeof itemA == 'function' || typeof itemB == 'function') {
            return true; // Don't compare functions.
        }
        else if (typeof itemA == 'object' && typeof itemB == 'object') {
            if (level >= maxLevels) {
                return true; // Max deep reached.
            }
            var equal = true;
            for (var name_1 in itemA) {
                var value = itemA[name_1];
                if (name_1 == '$$hashKey') {
                    // Ignore $$hashKey property since it's a "calculated" property.
                    return;
                }
                if (!this.basicLeftCompare(value, itemB[name_1], maxLevels, level + 1)) {
                    equal = false;
                }
            }
            return equal;
        }
        else {
            if (undefinedIsNull && ((typeof itemA == 'undefined' && itemB === null) || (itemA === null && typeof itemB == 'undefined'))) {
                return true;
            }
            // We'll treat "2" and 2 as the same value.
            var floatA = parseFloat(itemA), floatB = parseFloat(itemB);
            if (!isNaN(floatA) && !isNaN(floatB)) {
                return floatA == floatB;
            }
            return itemA === itemB;
        }
    };
    /**
     * Blocks leaving a view.
     * @deprecated, use ionViewCanLeave instead.
     */
    CoreUtilsProvider.prototype.blockLeaveView = function () {
        return;
    };
    /**
     * Check if a URL has a redirect.
     *
     * @param url The URL to check.
     * @return Promise resolved with boolean_ whether there is a redirect.
     */
    CoreUtilsProvider.prototype.checkRedirect = function (url) {
        if (window.fetch) {
            var win = window, // Convert to <any> to be able to use AbortController (not supported by our TS version).
            initOptions = {
                redirect: 'follow'
            };
            var controller_1;
            // Some browsers implement fetch but no AbortController.
            if (win.AbortController) {
                controller_1 = new win.AbortController();
                initOptions.signal = controller_1.signal;
            }
            return this.timeoutPromise(window.fetch(url, initOptions), this.wsProvider.getRequestTimeout())
                .then(function (response) {
                return response.redirected;
            }).catch(function (error) {
                if (error.timeout && controller_1) {
                    // Timeout, abort the request.
                    controller_1.abort();
                }
                // There was a timeout, cannot determine if there's a redirect. Assume it's false.
                return false;
            });
        }
        else {
            // Cannot check if there is a redirect, assume it's false.
            return Promise.resolve(false);
        }
    };
    /**
     * Close the InAppBrowser window.
     *
     * @param closeAll Desktop only. True to close all secondary windows, false to close only the "current" one.
     */
    CoreUtilsProvider.prototype.closeInAppBrowser = function (closeAll) {
        if (this.iabInstance) {
            this.iabInstance.close();
            if (closeAll && CoreApp.instance.isDesktop()) {
                require('electron').ipcRenderer.send('closeSecondaryWindows');
            }
        }
    };
    /**
     * Clone a variable. It should be an object, array or primitive type.
     *
     * @param source The variable to clone.
     * @param level Depth we are right now inside a cloned object. It's used to prevent reaching max call stack size.
     * @return Cloned variable.
     */
    CoreUtilsProvider.prototype.clone = function (source, level) {
        if (level === void 0) { level = 0; }
        if (level >= 20) {
            // Max 20 levels.
            this.logger.error('Max depth reached when cloning object.', source);
            return source;
        }
        if (Array.isArray(source)) {
            // Clone the array and all the entries.
            var newArray = [];
            for (var i = 0; i < source.length; i++) {
                newArray[i] = this.clone(source[i], level + 1);
            }
            return newArray;
        }
        else if (typeof source == 'object' && source !== null) {
            // Check if the object shouldn't be copied.
            if (source && source.toString && this.DONT_CLONE.indexOf(source.toString()) != -1) {
                // Object shouldn't be copied, return it as it is.
                return source;
            }
            // Clone the object and all the subproperties.
            var newObject = {};
            for (var name_2 in source) {
                newObject[name_2] = this.clone(source[name_2], level + 1);
            }
            return newObject;
        }
        else {
            // Primitive type or unknown, return it as it is.
            return source;
        }
    };
    /**
     * Copy properties from one object to another.
     *
     * @param from Object to copy the properties from.
     * @param to Object where to store the properties.
     * @param clone Whether the properties should be cloned (so they are different instances).
     */
    CoreUtilsProvider.prototype.copyProperties = function (from, to, clone) {
        if (clone === void 0) { clone = true; }
        for (var name_3 in from) {
            if (clone) {
                to[name_3] = this.clone(from[name_3]);
            }
            else {
                to[name_3] = from[name_3];
            }
        }
    };
    /**
     * Copies a text to clipboard and shows a toast message.
     *
     * @param text Text to be copied
     * @return Promise resolved when text is copied.
     */
    CoreUtilsProvider.prototype.copyToClipboard = function (text) {
        var _this = this;
        return this.clipboard.copy(text).then(function () {
            // Show toast using ionicLoading.
            return _this.domUtils.showToast('core.copiedtoclipboard', true);
        }).catch(function () {
            // Ignore errors.
        });
    };
    /**
     * Create a "fake" WS error for local errors.
     *
     * @param message The message to include in the error.
     * @param needsTranslate If the message needs to be translated.
     * @return Fake WS error.
     */
    CoreUtilsProvider.prototype.createFakeWSError = function (message, needsTranslate) {
        return this.wsProvider.createFakeWSError(message, needsTranslate);
    };
    /**
     * Empties an array without losing its reference.
     *
     * @param array Array to empty.
     */
    CoreUtilsProvider.prototype.emptyArray = function (array) {
        array.length = 0; // Empty array without losing its reference.
    };
    /**
     * Removes all properties from an object without losing its reference.
     *
     * @param object Object to remove the properties.
     */
    CoreUtilsProvider.prototype.emptyObject = function (object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                delete object[key];
            }
        }
    };
    /**
     * Execute promises one depending on the previous.
     *
     * @param orderedPromisesData Data to be executed including the following values:
     *                            - func: Function to be executed.
     *                            - context: Context to pass to the function. This allows using "this" inside the function.
     *                            - params: Array of data to be sent to the function.
     *                            - blocking: Boolean. If promise should block the following.
     * @return Promise resolved when all promises are resolved.
     */
    CoreUtilsProvider.prototype.executeOrderedPromises = function (orderedPromisesData) {
        var _this = this;
        var promises = [];
        var dependency = Promise.resolve();
        var _loop_1 = function (i) {
            var data = orderedPromisesData[i];
            var promise = void 0;
            // Add the process to the dependency stack.
            promise = dependency.finally(function () {
                var prom;
                try {
                    prom = data.func.apply(data.context, data.params || []);
                }
                catch (e) {
                    _this.logger.error(e.message);
                    return;
                }
                return prom;
            });
            promises.push(promise);
            // If the new process is blocking, we set it as the dependency.
            if (data.blocking) {
                dependency = promise;
            }
        };
        // Execute all the processes in order.
        for (var i in orderedPromisesData) {
            _loop_1(i);
        }
        // Return when all promises are done.
        return this.allPromises(promises);
    };
    /**
     * Flatten an object, moving subobjects' properties to the first level.
     * It supports 2 notations: dot notation and square brackets.
     * E.g.: {a: {b: 1, c: 2}, d: 3} -> {'a.b': 1, 'a.c': 2, d: 3}
     *
     * @param obj Object to flatten.
     * @param useDotNotation Whether to use dot notation '.' or square brackets '['.
     * @return Flattened object.
     */
    CoreUtilsProvider.prototype.flattenObject = function (obj, useDotNotation) {
        var toReturn = {};
        for (var name_4 in obj) {
            if (!obj.hasOwnProperty(name_4)) {
                continue;
            }
            var value = obj[name_4];
            if (typeof value == 'object' && !Array.isArray(value)) {
                var flatObject = this.flattenObject(value);
                for (var subName in flatObject) {
                    if (!flatObject.hasOwnProperty(subName)) {
                        continue;
                    }
                    var newName = useDotNotation ? name_4 + '.' + subName : name_4 + '[' + subName + ']';
                    toReturn[newName] = flatObject[subName];
                }
            }
            else {
                toReturn[name_4] = value;
            }
        }
        return toReturn;
    };
    /**
     * Given an array of strings, return only the ones that match a regular expression.
     *
     * @param array Array to filter.
     * @param regex RegExp to apply to each string.
     * @return Filtered array.
     */
    CoreUtilsProvider.prototype.filterByRegexp = function (array, regex) {
        if (!array || !array.length) {
            return [];
        }
        return array.filter(function (entry) {
            var matches = entry.match(regex);
            return matches && matches.length;
        });
    };
    /**
     * Filter the list of site IDs based on a isEnabled function.
     *
     * @param siteIds Site IDs to filter.
     * @param isEnabledFn Function to call for each site. Must return true or a promise resolved with true if enabled.
     *                    It receives a siteId param and all the params sent to this function after 'checkAll'.
     * @param checkAll True if it should check all the sites, false if it should check only 1 and treat them all
     *                 depending on this result.
     * @param ...args All the params sent after checkAll will be passed to isEnabledFn.
     * @return Promise resolved with the list of enabled sites.
     */
    CoreUtilsProvider.prototype.filterEnabledSites = function (siteIds, isEnabledFn, checkAll) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var promises = [], enabledSites = [];
        var _loop_2 = function (i) {
            var siteId = siteIds[i];
            if (checkAll || !promises.length) {
                promises.push(Promise.resolve(isEnabledFn.apply(isEnabledFn, [siteId].concat(args))).then(function (enabled) {
                    if (enabled) {
                        enabledSites.push(siteId);
                    }
                }));
            }
        };
        for (var i in siteIds) {
            _loop_2(i);
        }
        return this.allPromises(promises).catch(function () {
            // Ignore errors.
        }).then(function () {
            if (!checkAll) {
                // Checking 1 was enough, so it will either return all the sites or none.
                return enabledSites.length ? siteIds : [];
            }
            else {
                return enabledSites;
            }
        });
    };
    /**
     * Given a float, prints it nicely. Localized floats must not be used in calculations!
     * Based on Moodle's format_float.
     *
     * @param float The float to print.
     * @return Locale float.
     */
    CoreUtilsProvider.prototype.formatFloat = function (float) {
        if (typeof float == 'undefined' || float === null || typeof float == 'boolean') {
            return '';
        }
        var localeSeparator = this.translate.instant('core.decsep');
        // Convert float to string.
        float += '';
        return float.replace('.', localeSeparator);
    };
    /**
     * Returns a tree formatted from a plain list.
     * List has to be sorted by depth to allow this function to work correctly. Errors can be thrown if a child node is
     * processed before a parent node.
     *
     * @param list List to format.
     * @param parentFieldName Name of the parent field to match with children.
     * @param idFieldName Name of the children field to match with parent.
     * @param rootParentId The id of the root.
     * @param maxDepth Max Depth to convert to tree. Children found will be in the last level of depth.
     * @return Array with the formatted tree, children will be on each node under children field.
     */
    CoreUtilsProvider.prototype.formatTree = function (list, parentFieldName, idFieldName, rootParentId, maxDepth) {
        var _this = this;
        if (parentFieldName === void 0) { parentFieldName = 'parent'; }
        if (idFieldName === void 0) { idFieldName = 'id'; }
        if (rootParentId === void 0) { rootParentId = 0; }
        if (maxDepth === void 0) { maxDepth = 5; }
        var map = {}, mapDepth = {}, tree = [];
        var parent, id;
        list.forEach(function (node, index) {
            id = node[idFieldName];
            parent = node[parentFieldName];
            node.children = [];
            if (!id || !parent) {
                _this.logger.error("Node with incorrect " + idFieldName + ":" + id + " or " + parentFieldName + ":" + parent + " found on formatTree");
            }
            // Use map to look-up the parents.
            map[id] = index;
            if (parent != rootParentId) {
                var parentNode = list[map[parent]];
                if (parentNode) {
                    if (mapDepth[parent] == maxDepth) {
                        // Reached max level of depth. Proceed with flat order. Find parent object of the current node.
                        var parentOfParent = parentNode[parentFieldName];
                        if (parentOfParent) {
                            // This element will be the child of the node that is two levels up the hierarchy
                            // (i.e. the child of node.parent.parent).
                            list[map[parentOfParent]].children.push(node);
                            // Assign depth level to the same depth as the parent (i.e. max depth level).
                            mapDepth[id] = mapDepth[parent];
                            // Change the parent to be the one that is two levels up the hierarchy.
                            node.parent = parentOfParent;
                        }
                        else {
                            _this.logger.error("Node parent of parent:" + parentOfParent + " not found on formatTree");
                        }
                    }
                    else {
                        parentNode.children.push(node);
                        // Increase the depth level.
                        mapDepth[id] = mapDepth[parent] + 1;
                    }
                }
                else {
                    _this.logger.error("Node parent:" + parent + " not found on formatTree");
                }
            }
            else {
                tree.push(node);
                // Root elements are the first elements in the tree structure, therefore have the depth level 1.
                mapDepth[id] = 1;
            }
        });
        return tree;
    };
    /**
     * Get country name based on country code.
     *
     * @param code Country code (AF, ES, US, ...).
     * @return Country name. If the country is not found, return the country code.
     */
    CoreUtilsProvider.prototype.getCountryName = function (code) {
        var countryKey = 'assets.countries.' + code, countryName = this.translate.instant(countryKey);
        return countryName !== countryKey ? countryName : code;
    };
    /**
     * Get list of countries with their code and translated name.
     *
     * @return Promise resolved with the list of countries.
     */
    CoreUtilsProvider.prototype.getCountryList = function () {
        var _this = this;
        // Get the keys of the countries.
        return this.getCountryKeysList().then(function (keys) {
            // Now get the code and the translated name.
            var countries = {};
            keys.forEach(function (key) {
                if (key.indexOf('assets.countries.') === 0) {
                    var code = key.replace('assets.countries.', '');
                    countries[code] = _this.translate.instant(key);
                }
            });
            return countries;
        });
    };
    /**
     * Get list of countries with their code and translated name. Sorted by the name of the country.
     *
     * @return Promise resolved with the list of countries.
     */
    CoreUtilsProvider.prototype.getCountryListSorted = function () {
        // Get the keys of the countries.
        return this.getCountryList().then(function (countries) {
            // Sort translations.
            var sortedCountries = [];
            Object.keys(countries).sort(function (a, b) { return countries[a].localeCompare(countries[b]); }).forEach(function (key) {
                sortedCountries.push({ code: key, name: countries[key] });
            });
            return sortedCountries;
        });
    };
    /**
     * Get the list of language keys of the countries.
     *
     * @return Promise resolved with the countries list. Rejected if not translated.
     */
    CoreUtilsProvider.prototype.getCountryKeysList = function () {
        var _this = this;
        // It's possible that the current language isn't translated, so try with default language first.
        var defaultLang = this.langProvider.getDefaultLanguage();
        return this.getCountryKeysListForLanguage(defaultLang).catch(function () {
            // Not translated, try to use the fallback language.
            var fallbackLang = _this.langProvider.getFallbackLanguage();
            if (fallbackLang === defaultLang) {
                // Same language, just reject.
                return Promise.reject('Countries not found.');
            }
            return _this.getCountryKeysListForLanguage(fallbackLang);
        });
    };
    /**
     * Get the list of language keys of the countries, based on the translation table for a certain language.
     *
     * @param lang Language to check.
     * @return Promise resolved with the countries list. Rejected if not translated.
     */
    CoreUtilsProvider.prototype.getCountryKeysListForLanguage = function (lang) {
        // Get the translation table for the language.
        return this.langProvider.getTranslationTable(lang).then(function (table) {
            // Gather all the keys for countries,
            var keys = [];
            for (var name_5 in table) {
                if (name_5.indexOf('assets.countries.') === 0) {
                    keys.push(name_5);
                }
            }
            if (keys.length === 0) {
                // Not translated, reject.
                return Promise.reject('Countries not found.');
            }
            return keys;
        });
    };
    /**
     * Get the mimetype of a file given its URL. It'll try to guess it using the URL, if that fails then it'll
     * perform a HEAD request to get it. It's done in this order because pluginfile.php can return wrong mimetypes.
     * This function is in here instead of MimetypeUtils to prevent circular dependencies.
     *
     * @param url The URL of the file.
     * @return Promise resolved with the mimetype.
     */
    CoreUtilsProvider.prototype.getMimeTypeFromUrl = function (url) {
        // First check if it can be guessed from the URL.
        var extension = this.mimetypeUtils.guessExtensionFromUrl(url), mimetype = this.mimetypeUtils.getMimeType(extension);
        if (mimetype) {
            return Promise.resolve(mimetype);
        }
        // Can't be guessed, get the remote mimetype.
        return this.wsProvider.getRemoteFileMimeType(url).then(function (mimetype) {
            return mimetype || '';
        });
    };
    /**
     * Get a unique ID for a certain name.
     *
     * @param name The name to get the ID for.
     * @return Unique ID.
     */
    CoreUtilsProvider.prototype.getUniqueId = function (name) {
        if (!this.uniqueIds[name]) {
            this.uniqueIds[name] = 0;
        }
        return ++this.uniqueIds[name];
    };
    /**
     * Given a list of files, check if there are repeated names.
     *
     * @param files List of files.
     * @return String with error message if repeated, false if no repeated.
     */
    CoreUtilsProvider.prototype.hasRepeatedFilenames = function (files) {
        if (!files || !files.length) {
            return false;
        }
        var names = [];
        // Check if there are 2 files with the same name.
        for (var i = 0; i < files.length; i++) {
            var name_6 = files[i].filename || files[i].name;
            if (names.indexOf(name_6) > -1) {
                return this.translate.instant('core.filenameexist', { $a: name_6 });
            }
            else {
                names.push(name_6);
            }
        }
        return false;
    };
    /**
     * Gets the index of the first string that matches a regular expression.
     *
     * @param array Array to search.
     * @param regex RegExp to apply to each string.
     * @return Index of the first string that matches the RegExp. -1 if not found.
     */
    CoreUtilsProvider.prototype.indexOfRegexp = function (array, regex) {
        if (!array || !array.length) {
            return -1;
        }
        for (var i = 0; i < array.length; i++) {
            var entry = array[i], matches = entry.match(regex);
            if (matches && matches.length) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Return true if the param is false (bool), 0 (number) or "0" (string).
     *
     * @param value Value to check.
     * @return Whether the value is false, 0 or "0".
     */
    CoreUtilsProvider.prototype.isFalseOrZero = function (value) {
        return typeof value != 'undefined' && (value === false || value === 'false' || parseInt(value, 10) === 0);
    };
    /**
     * Return true if the param is true (bool), 1 (number) or "1" (string).
     *
     * @param value Value to check.
     * @return Whether the value is true, 1 or "1".
     */
    CoreUtilsProvider.prototype.isTrueOrOne = function (value) {
        return typeof value != 'undefined' && (value === true || value === 'true' || parseInt(value, 10) === 1);
    };
    /**
     * Given an error returned by a WS call, check if the error is generated by the app or it has been returned by the WebSwervice.
     *
     * @param error Error to check.
     * @return Whether the error was returned by the WebService.
     */
    CoreUtilsProvider.prototype.isWebServiceError = function (error) {
        return error && (typeof error.warningcode != 'undefined' || (typeof error.errorcode != 'undefined' &&
            error.errorcode != 'invalidtoken' && error.errorcode != 'userdeleted' && error.errorcode != 'upgraderunning' &&
            error.errorcode != 'forcepasswordchangenotice' && error.errorcode != 'usernotfullysetup' &&
            error.errorcode != 'sitepolicynotagreed' && error.errorcode != 'sitemaintenance' &&
            (error.errorcode != 'accessexception' || error.message.indexOf('Invalid token - token expired') == -1)));
    };
    /**
     * Given a list (e.g. a,b,c,d,e) this function returns an array of 1->a, 2->b, 3->c etc.
     * Taken from make_menu_from_list on moodlelib.php (not the same but similar).
     *
     * @param list The string to explode into array bits
     * @param defaultLabel Element that will become default option, if not defined, it won't be added.
     * @param separator The separator used within the list string. Default ','.
     * @param defaultValue Element that will become default option value. Default 0.
     * @return The now assembled array
     */
    CoreUtilsProvider.prototype.makeMenuFromList = function (list, defaultLabel, separator, defaultValue) {
        if (separator === void 0) { separator = ','; }
        // Split and format the list.
        var split = list.split(separator).map(function (label, index) {
            return {
                label: label.trim(),
                value: index + 1
            };
        });
        if (defaultLabel) {
            split.unshift({
                label: defaultLabel,
                value: defaultValue || 0
            });
        }
        return split;
    };
    /**
     * Merge two arrays, removing duplicate values.
     *
     * @param array1 The first array.
     * @param array2 The second array.
     * @param [key] Key of the property that must be unique. If not specified, the whole entry.
     * @return Merged array.
     */
    CoreUtilsProvider.prototype.mergeArraysWithoutDuplicates = function (array1, array2, key) {
        return this.uniqueArray(array1.concat(array2), key);
    };
    /**
     * Check if a value isn't null or undefined.
     *
     * @param value Value to check.
     * @return True if not null and not undefined.
     */
    CoreUtilsProvider.prototype.notNullOrUndefined = function (value) {
        return typeof value != 'undefined' && value !== null;
    };
    /**
     * Open a file using platform specific method.
     *
     * @param path The local path of the file to be open.
     * @return Promise resolved when done.
     */
    CoreUtilsProvider.prototype.openFile = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var extension, mimetype, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Convert the path to a native path if needed.
                        path = CoreFile.instance.unconvertFileSrc(path);
                        extension = this.mimetypeUtils.getFileExtension(path);
                        mimetype = this.mimetypeUtils.getMimeType(extension);
                        if (mimetype == 'text/html' && CoreApp.instance.isAndroid()) {
                            // Open HTML local files in InAppBrowser, in system browser some embedded files aren't loaded.
                            this.openInApp(path);
                            return [2 /*return*/];
                        }
                        // Path needs to be decoded, the file won't be opened if the path has %20 instead of spaces and so.
                        try {
                            path = decodeURIComponent(path);
                        }
                        catch (ex) {
                            // Error, use the original path.
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fileOpener.open(path, mimetype)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.logger.error('Error opening file ' + path + ' with mimetype ' + mimetype);
                        this.logger.error('Error: ', JSON.stringify(error_1));
                        if (!extension || extension.indexOf('/') > -1 || extension.indexOf('\\') > -1) {
                            // Extension not found.
                            error_1 = this.translate.instant('core.erroropenfilenoextension');
                        }
                        else {
                            error_1 = this.translate.instant('core.erroropenfilenoapp');
                        }
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Open a URL using InAppBrowser.
     * Do not use for files, refer to {@link openFile}.
     *
     * @param url The URL to open.
     * @param options Override default options passed to InAppBrowser.
     * @return The opened window.
     */
    CoreUtilsProvider.prototype.openInApp = function (url, options) {
        var _this = this;
        if (!url) {
            return;
        }
        options = options || {};
        options.usewkwebview = 'yes'; // Force WKWebView in iOS.
        if (!options.enableViewPortScale) {
            options.enableViewPortScale = 'yes'; // Enable zoom on iOS.
        }
        if (!options.allowInlineMediaPlayback) {
            options.allowInlineMediaPlayback = 'yes'; // Allow playing inline videos in iOS.
        }
        if (!options.location && CoreApp.instance.isIOS() && url.indexOf('file://') === 0) {
            // The URL uses file protocol, don't show it on iOS.
            // In Android we keep it because otherwise we lose the whole toolbar.
            options.location = 'no';
        }
        this.iabInstance = this.iab.create(url, '_blank', options);
        if (CoreApp.instance.isDesktop() || CoreApp.instance.isMobile()) {
            var loadStopSubscription_1;
            var loadStartUrls_1 = [];
            // Trigger global events when a url is loaded or the window is closed. This is to make it work like in Ionic 1.
            var loadStartSubscription_1 = this.iabInstance.on('loadstart').subscribe(function (event) {
                // Execute the callback in the Angular zone, so change detection doesn't stop working.
                _this.zone.run(function () {
                    // Store the last loaded URLs (max 10).
                    loadStartUrls_1.push(event.url);
                    if (loadStartUrls_1.length > 10) {
                        loadStartUrls_1.shift();
                    }
                    _this.eventsProvider.trigger(CoreEventsProvider.IAB_LOAD_START, event);
                });
            });
            if (CoreApp.instance.isAndroid()) {
                // Load stop is needed with InAppBrowser v3. Custom URL schemes no longer trigger load start, simulate it.
                loadStopSubscription_1 = this.iabInstance.on('loadstop').subscribe(function (event) {
                    // Execute the callback in the Angular zone, so change detection doesn't stop working.
                    _this.zone.run(function () {
                        if (loadStartUrls_1.indexOf(event.url) == -1) {
                            // The URL was stopped but not started, probably a custom URL scheme.
                            _this.eventsProvider.trigger(CoreEventsProvider.IAB_LOAD_START, event);
                        }
                    });
                });
            }
            var exitSubscription_1 = this.iabInstance.on('exit').subscribe(function (event) {
                // Execute the callback in the Angular zone, so change detection doesn't stop working.
                _this.zone.run(function () {
                    loadStartSubscription_1.unsubscribe();
                    loadStopSubscription_1 && loadStopSubscription_1.unsubscribe();
                    exitSubscription_1.unsubscribe();
                    _this.eventsProvider.trigger(CoreEventsProvider.IAB_EXIT, event);
                });
            });
        }
        return this.iabInstance;
    };
    /**
     * Open a URL using a browser.
     * Do not use for files, refer to {@link openFile}.
     *
     * @param url The URL to open.
     */
    CoreUtilsProvider.prototype.openInBrowser = function (url) {
        if (CoreApp.instance.isDesktop()) {
            // It's a desktop app, use Electron shell library to open the browser.
            var shell = require('electron').shell;
            if (!shell.openExternal(url)) {
                // Open browser failed, open a new window in the app.
                window.open(url, '_system');
            }
        }
        else {
            window.open(url, '_system');
        }
    };
    /**
     * Open an online file using platform specific method.
     * Specially useful for audio and video since they can be streamed.
     *
     * @param url The URL of the file.
     * @return Promise resolved when opened.
     */
    CoreUtilsProvider.prototype.openOnlineFile = function (url) {
        var _this = this;
        if (CoreApp.instance.isAndroid()) {
            // In Android we need the mimetype to open it.
            return this.getMimeTypeFromUrl(url).catch(function () {
                // Error getting mimetype, return undefined.
            }).then(function (mimetype) {
                if (!mimetype) {
                    // Couldn't retrieve mimetype. Return error.
                    return Promise.reject(_this.translate.instant('core.erroropenfilenoextension'));
                }
                var options = {
                    action: _this.webIntent.ACTION_VIEW,
                    url: url,
                    type: mimetype
                };
                return _this.webIntent.startActivity(options).catch(function (error) {
                    _this.logger.error('Error opening online file ' + url + ' with mimetype ' + mimetype);
                    _this.logger.error('Error: ', JSON.stringify(error));
                    return Promise.reject(_this.translate.instant('core.erroropenfilenoapp'));
                });
            });
        }
        // In the rest of platforms we need to open them in InAppBrowser.
        this.openInApp(url);
        return Promise.resolve();
    };
    /**
     * Converts an object into an array, losing the keys.
     *
     * @param obj Object to convert.
     * @return Array with the values of the object but losing the keys.
     */
    CoreUtilsProvider.prototype.objectToArray = function (obj) {
        return Object.keys(obj).map(function (key) {
            return obj[key];
        });
    };
    /**
     * Converts an object into an array of objects, where each entry is an object containing
     * the key and value of the original object.
     * For example, it can convert {size: 2} into [{name: 'size', value: 2}].
     *
     * @param obj Object to convert.
     * @param keyName Name of the properties where to store the keys.
     * @param valueName Name of the properties where to store the values.
     * @param sortByKey True to sort keys alphabetically, false otherwise. Has priority over sortByValue.
     * @param sortByValue True to sort values alphabetically, false otherwise.
     * @return Array of objects with the name & value of each property.
     */
    CoreUtilsProvider.prototype.objectToArrayOfObjects = function (obj, keyName, valueName, sortByKey, sortByValue) {
        // Get the entries from an object or primitive value.
        var getEntries = function (elKey, value) {
            if (typeof value == 'undefined' || value == null) {
                // Filter undefined and null values.
                return;
            }
            else if (typeof value == 'object') {
                // It's an object, return at least an entry for each property.
                var keys = Object.keys(value);
                var entries_1 = [];
                keys.forEach(function (key) {
                    var newElKey = elKey ? elKey + '[' + key + ']' : key, subEntries = getEntries(newElKey, value[key]);
                    if (subEntries) {
                        entries_1 = entries_1.concat(subEntries);
                    }
                });
                return entries_1;
            }
            else {
                // Not an object, return a single entry.
                var entry = {};
                entry[keyName] = elKey;
                entry[valueName] = value;
                return entry;
            }
        };
        if (!obj) {
            return [];
        }
        // "obj" will always be an object, so "entries" will always be an array.
        var entries = getEntries('', obj);
        if (sortByKey || sortByValue) {
            return entries.sort(function (a, b) {
                if (sortByKey) {
                    return a[keyName] >= b[keyName] ? 1 : -1;
                }
                else {
                    return a[valueName] >= b[valueName] ? 1 : -1;
                }
            });
        }
        return entries;
    };
    /**
     * Converts an array of objects into an object with key and value. The opposite of objectToArrayOfObjects.
     * For example, it can convert [{name: 'size', value: 2}] into {size: 2}.
     *
     * @param objects List of objects to convert.
     * @param keyName Name of the properties where the keys are stored.
     * @param valueName Name of the properties where the values are stored.
     * @param keyPrefix Key prefix if neededs to delete it.
     * @return Object.
     */
    CoreUtilsProvider.prototype.objectToKeyValueMap = function (objects, keyName, valueName, keyPrefix) {
        if (!objects) {
            return;
        }
        var prefixSubstr = keyPrefix ? keyPrefix.length : 0, mapped = {};
        objects.forEach(function (item) {
            var key = prefixSubstr > 0 ? item[keyName].substr(prefixSubstr) : item[keyName];
            mapped[key] = item[valueName];
        });
        return mapped;
    };
    /**
     * Convert an object to a format of GET param. E.g.: {a: 1, b: 2} -> a=1&b=2
     *
     * @param object Object to convert.
     * @param removeEmpty Whether to remove params whose value is null/undefined.
     * @return GET params.
     */
    CoreUtilsProvider.prototype.objectToGetParams = function (object, removeEmpty) {
        if (removeEmpty === void 0) { removeEmpty = true; }
        // First of all, flatten the object so all properties are in the first level.
        var flattened = this.flattenObject(object);
        var result = '', joinChar = '';
        for (var name_7 in flattened) {
            var value = flattened[name_7];
            if (removeEmpty && (value === null || typeof value == 'undefined')) {
                continue;
            }
            if (typeof value == 'boolean') {
                value = value ? 1 : 0;
            }
            result += joinChar + name_7 + '=' + value;
            joinChar = '&';
        }
        return result;
    };
    /**
     * Add a prefix to all the keys in an object.
     *
     * @param data Object.
     * @param prefix Prefix to add.
     * @return Prefixed object.
     */
    CoreUtilsProvider.prototype.prefixKeys = function (data, prefix) {
        var newObj = {}, keys = Object.keys(data);
        keys.forEach(function (key) {
            newObj[prefix + key] = data[key];
        });
        return newObj;
    };
    /**
     * Similar to AngularJS $q.defer().
     *
     * @return The deferred promise.
     */
    CoreUtilsProvider.prototype.promiseDefer = function () {
        var deferred = {};
        deferred.promise = new Promise(function (resolve, reject) {
            deferred.resolve = resolve;
            deferred.reject = reject;
        });
        return deferred;
    };
    /**
     * Given a promise, returns true if it's rejected or false if it's resolved.
     *
     * @param promise Promise to check
     * @return Promise resolved with boolean: true if the promise is rejected or false if it's resolved.
     */
    CoreUtilsProvider.prototype.promiseFails = function (promise) {
        return promise.then(function () {
            return false;
        }).catch(function () {
            return true;
        });
    };
    /**
     * Given a promise, returns true if it's resolved or false if it's rejected.
     *
     * @param promise Promise to check
     * @return Promise resolved with boolean: true if the promise it's resolved or false if it's rejected.
     */
    CoreUtilsProvider.prototype.promiseWorks = function (promise) {
        return promise.then(function () {
            return true;
        }).catch(function () {
            return false;
        });
    };
    /**
     * Tests to see whether two arrays or objects have the same value at a particular key.
     * Missing values are replaced by '', and the values are compared with ===.
     * Booleans and numbers are cast to string before comparing.
     *
     * @param obj1 The first object or array.
     * @param obj2 The second object or array.
     * @param key Key to check.
     * @return Whether the two objects/arrays have the same value (or lack of one) for a given key.
     */
    CoreUtilsProvider.prototype.sameAtKeyMissingIsBlank = function (obj1, obj2, key) {
        var value1 = typeof obj1[key] != 'undefined' ? obj1[key] : '', value2 = typeof obj2[key] != 'undefined' ? obj2[key] : '';
        if (typeof value1 == 'number' || typeof value1 == 'boolean') {
            value1 = '' + value1;
        }
        if (typeof value2 == 'number' || typeof value2 == 'boolean') {
            value2 = '' + value2;
        }
        return value1 === value2;
    };
    /**
     * Stringify an object, sorting the properties. It doesn't sort arrays, only object properties. E.g.:
     * {b: 2, a: 1} -> '{"a":1,"b":2}'
     *
     * @param obj Object to stringify.
     * @return Stringified object.
     */
    CoreUtilsProvider.prototype.sortAndStringify = function (obj) {
        return JSON.stringify(this.sortProperties(obj));
    };
    /**
     * Given an object, sort its properties and the properties of all the nested objects.
     *
     * @param obj The object to sort. If it isn't an object, the original value will be returned.
     * @return Sorted object.
     */
    CoreUtilsProvider.prototype.sortProperties = function (obj) {
        var _this = this;
        if (obj != null && typeof obj == 'object' && !Array.isArray(obj)) {
            // It's an object, sort it.
            return Object.keys(obj).sort().reduce(function (accumulator, key) {
                // Always call sort with the value. If it isn't an object, the original value will be returned.
                accumulator[key] = _this.sortProperties(obj[key]);
                return accumulator;
            }, {});
        }
        else {
            return obj;
        }
    };
    /**
     * Given an object, sort its values. Values need to be primitive values, it cannot have subobjects.
     *
     * @param obj The object to sort. If it isn't an object, the original value will be returned.
     * @return Sorted object.
     */
    CoreUtilsProvider.prototype.sortValues = function (obj) {
        if (typeof obj == 'object' && !Array.isArray(obj)) {
            // It's an object, sort it. Convert it to an array to be able to sort it and then convert it back to object.
            var array = this.objectToArrayOfObjects(obj, 'name', 'value', false, true);
            return this.objectToKeyValueMap(array, 'name', 'value');
        }
        else {
            return obj;
        }
    };
    /**
     * Sum the filesizes from a list of files checking if the size will be partial or totally calculated.
     *
     * @param files List of files to sum its filesize.
     * @return File size and a boolean to indicate if it is the total size or only partial.
     * @deprecated since 3.8.0. Use CorePluginFileDelegate.getFilesSize instead.
     */
    CoreUtilsProvider.prototype.sumFileSizes = function (files) {
        var result = {
            size: 0,
            total: true
        };
        files.forEach(function (file) {
            if (typeof file.filesize == 'undefined') {
                // We don't have the file size, cannot calculate its total size.
                result.total = false;
            }
            else {
                result.size += file.filesize;
            }
        });
        return result;
    };
    /**
     * Set a timeout to a Promise. If the time passes before the Promise is resolved or rejected, it will be automatically
     * rejected.
     *
     * @param promise The promise to timeout.
     * @param time Number of milliseconds of the timeout.
     * @return Promise with the timeout.
     */
    CoreUtilsProvider.prototype.timeoutPromise = function (promise, time) {
        return new Promise(function (resolve, reject) {
            var timeout = setTimeout(function () {
                reject({ timeout: true });
            }, time);
            promise.then(resolve).catch(reject).finally(function () {
                clearTimeout(timeout);
            });
        });
    };
    /**
     * Converts locale specific floating point/comma number back to standard PHP float value.
     * Do NOT try to do any math operations before this conversion on any user submitted floats!
     * Based on Moodle's unformat_float function.
     *
     * @param localeFloat Locale aware float representation.
     * @param strict If true, then check the input and return false if it is not a valid number.
     * @return False if bad format, empty string if empty value or the parsed float if not.
     */
    CoreUtilsProvider.prototype.unformatFloat = function (localeFloat, strict) {
        // Bad format on input type number.
        if (typeof localeFloat == 'undefined') {
            return false;
        }
        // Empty (but not zero).
        if (localeFloat == null) {
            return '';
        }
        // Convert float to string.
        localeFloat += '';
        localeFloat = localeFloat.trim();
        if (localeFloat == '') {
            return '';
        }
        localeFloat = localeFloat.replace(' ', ''); // No spaces - those might be used as thousand separators.
        localeFloat = localeFloat.replace(this.translate.instant('core.decsep'), '.');
        var parsedFloat = parseFloat(localeFloat);
        // Bad format.
        if (strict && (!isFinite(localeFloat) || isNaN(parsedFloat))) {
            return false;
        }
        return parsedFloat;
    };
    /**
     * Return an array without duplicate values.
     *
     * @param array The array to treat.
     * @param [key] Key of the property that must be unique. If not specified, the whole entry.
     * @return Array without duplicate values.
     */
    CoreUtilsProvider.prototype.uniqueArray = function (array, key) {
        var filtered = [], unique = {}; // Use an object to make it faster to check if it's duplicate.
        array.forEach(function (entry) {
            var value = key ? entry[key] : entry;
            if (!unique[value]) {
                unique[value] = true;
                filtered.push(entry);
            }
        });
        return filtered;
    };
    /**
     * Debounce a function so consecutive calls are ignored until a certain time has passed since the last call.
     *
     * @param context The context to apply to the function.
     * @param fn Function to debounce.
     * @param delay Time that must pass until the function is called.
     * @return Debounced function.
     */
    CoreUtilsProvider.prototype.debounce = function (fn, delay) {
        var timeoutID;
        var debounced = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            clearTimeout(timeoutID);
            timeoutID = window.setTimeout(function () {
                fn.apply(null, args);
            }, delay);
        };
        return debounced;
    };
    /**
     * Check whether the app can scan QR codes.
     *
     * @return Whether the app can scan QR codes.
     */
    CoreUtilsProvider.prototype.canScanQR = function () {
        return CoreApp.instance.isMobile();
    };
    /**
     * Open a modal to scan a QR code.
     *
     * @param title Title of the modal. Defaults to "QR reader".
     * @return Promise resolved with the captured text or undefined if cancelled or error.
     */
    CoreUtilsProvider.prototype.scanQR = function (title) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var modal = _this.modalCtrl.create('CoreViewerQRScannerPage', {
                title: title
            }, { cssClass: 'core-modal-fullscreen' });
            modal.present();
            modal.onDidDismiss(function (data) {
                resolve(data);
            });
        });
    };
    /**
     * Start scanning for a QR code.
     *
     * @return Promise resolved with the QR string, rejected if error or cancelled.
     */
    CoreUtilsProvider.prototype.startScanQR = function () {
        var _this = this;
        if (!CoreApp.instance.isMobile()) {
            return Promise.reject('QRScanner isn\'t available in desktop apps.');
        }
        // Ask the user for permission to use the camera.
        // The scan method also does this, but since it returns an Observable we wouldn't be able to detect if the user denied.
        return this.qrScanner.prepare().then(function (status) {
            if (!status.authorized) {
                // No access to the camera, reject. In android this shouldn't happen, denying access passes through catch.
                return Promise.reject('The user denied camera access.');
            }
            if (_this.qrScanData && _this.qrScanData.deferred) {
                // Already scanning.
                return _this.qrScanData.deferred.promise;
            }
            // Start scanning.
            _this.qrScanData = {
                deferred: _this.promiseDefer(),
                observable: _this.qrScanner.scan().subscribe(function (text) {
                    // Text received, stop scanning and return the text.
                    _this.stopScanQR(text, false);
                })
            };
            // Show the camera.
            return _this.qrScanner.show().then(function () {
                document.body.classList.add('core-scanning-qr');
                return _this.qrScanData.deferred.promise;
            }, function (err) {
                _this.stopScanQR(err, true);
                return Promise.reject(err);
            });
        }).catch(function (err) {
            err.message = err.message || err._message;
            return Promise.reject(err);
        });
    };
    /**
     * Stop scanning for QR code. If no param is provided, the app will consider the user cancelled.
     *
     * @param data If success, the text of the QR code. If error, the error object or message. Undefined for cancelled.
     * @param error True if the data belongs to an error, false otherwise.
     */
    CoreUtilsProvider.prototype.stopScanQR = function (data, error) {
        if (!this.qrScanData) {
            // Not scanning.
            return;
        }
        // Hide camera preview.
        document.body.classList.remove('core-scanning-qr');
        this.qrScanner.hide();
        this.qrScanner.destroy();
        this.qrScanData.observable.unsubscribe(); // Stop scanning.
        if (error) {
            this.qrScanData.deferred.reject(data);
        }
        else if (typeof data != 'undefined') {
            this.qrScanData.deferred.resolve(data);
        }
        else {
            this.qrScanData.deferred.reject(this.domUtils.createCanceledError());
        }
        delete this.qrScanData;
    };
    /**
     * Ignore errors from a promise.
     *
     * @param promise Promise to ignore errors.
     * @return Promise with ignored errors.
     */
    CoreUtilsProvider.prototype.ignoreErrors = function (promise) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, promise];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Wait some time.
     *
     * @param milliseconds Number of milliseconds to wait.
     * @return Promise resolved after the time has passed.
     */
    CoreUtilsProvider.prototype.wait = function (milliseconds) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, milliseconds);
        });
    };
    CoreUtilsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [InAppBrowser,
            Clipboard,
            CoreDomUtilsProvider,
            CoreLoggerProvider,
            TranslateService,
            Platform,
            CoreLangProvider,
            CoreEventsProvider,
            FileOpener,
            CoreMimetypeUtilsProvider,
            WebIntent,
            CoreWSProvider,
            NgZone,
            CoreTextUtilsProvider,
            ModalController,
            QRScanner])
    ], CoreUtilsProvider);
    return CoreUtilsProvider;
}());
export { CoreUtilsProvider };
var CoreUtils = /** @class */ (function (_super) {
    __extends(CoreUtils, _super);
    function CoreUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreUtils;
}(makeSingleton(CoreUtilsProvider)));
export { CoreUtils };
//# sourceMappingURL=utils.js.map