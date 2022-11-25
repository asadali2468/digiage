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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
import { TranslateService } from '@ngx-translate/core';
import { CoreAppProvider } from '@providers/app';
import { CoreDbProvider } from '@providers/db';
import { CoreEventsProvider } from '@providers/events';
import { CoreFileProvider } from '@providers/file';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreWSProvider } from '@providers/ws';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreTextUtilsProvider } from '@providers/utils/text';
import { CoreTimeUtilsProvider } from '@providers/utils/time';
import { CoreUrlUtilsProvider } from '@providers/utils/url';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CoreConstants } from '@core/constants';
import { CoreConfigConstants } from '../configconstants';
import { Md5 } from 'ts-md5/dist/md5';
/**
 * Class that represents a site (combination of site + user).
 * It will have all the site data and provide utility functions regarding a site.
 * To add tables to the site's database, please use CoreSitesProvider.registerSiteSchema. This will make sure that
 * the tables are created in all the sites, not just the current one.
 */
var CoreSite = /** @class */ (function () {
    /**
     * Create a site.
     *
     * @param injector Angular injector to prevent having to pass all the required services.
     * @param id Site ID.
     * @param siteUrl Site URL.
     * @param token Site's WS token.
     * @param info Site info.
     * @param privateToken Private token.
     * @param config Site public config.
     * @param loggedOut Whether user is logged out.
     */
    function CoreSite(injector, id, siteUrl, token, infos, privateToken, config, loggedOut) {
        this.id = id;
        this.siteUrl = siteUrl;
        this.token = token;
        this.infos = infos;
        this.privateToken = privateToken;
        this.config = config;
        this.loggedOut = loggedOut;
        // Versions of Moodle releases.
        this.MOODLE_RELEASES = {
            '3.1': 2016052300,
            '3.2': 2016120500,
            '3.3': 2017051503,
            '3.4': 2017111300,
            '3.5': 2018051700,
            '3.6': 2018120300,
            '3.7': 2019052000,
            '3.8': 2019111800,
            '3.9': 2020061500,
            '3.10': 2020092400,
        };
        // Possible cache update frequencies.
        this.UPDATE_FREQUENCIES = [
            CoreConfigConstants.cache_update_frequency_usually || 420000,
            CoreConfigConstants.cache_update_frequency_often || 1200000,
            CoreConfigConstants.cache_update_frequency_sometimes || 3600000,
            CoreConfigConstants.cache_update_frequency_rarely || 43200000
        ];
        this.cleanUnicode = false;
        this.lastAutoLogin = 0;
        this.offlineDisabled = false;
        this.ongoingRequests = {};
        this.requestQueue = [];
        this.requestQueueTimeout = null;
        // Inject the required services.
        var logger = injector.get(CoreLoggerProvider);
        this.appProvider = injector.get(CoreAppProvider);
        this.dbProvider = injector.get(CoreDbProvider);
        this.domUtils = injector.get(CoreDomUtilsProvider);
        this.eventsProvider = injector.get(CoreEventsProvider);
        this.fileProvider = injector.get(CoreFileProvider);
        this.textUtils = injector.get(CoreTextUtilsProvider);
        this.timeUtils = injector.get(CoreTimeUtilsProvider);
        this.translate = injector.get(TranslateService);
        this.utils = injector.get(CoreUtilsProvider);
        this.urlUtils = injector.get(CoreUrlUtilsProvider);
        this.wsProvider = injector.get(CoreWSProvider);
        this.logger = logger.getInstance('CoreWSProvider');
        this.setInfo(infos);
        this.calculateOfflineDisabled();
        if (this.id) {
            this.initDB();
        }
    }
    /**
     * Initialize the database.
     */
    CoreSite.prototype.initDB = function () {
        this.db = this.dbProvider.getDB('Site-' + this.id);
    };
    /**
     * Get site ID.
     *
     * @return Site ID.
     */
    CoreSite.prototype.getId = function () {
        return this.id;
    };
    /**
     * Get site URL.
     *
     * @return Site URL.
     */
    CoreSite.prototype.getURL = function () {
        return this.siteUrl;
    };
    /**
     * Get site token.
     *
     * @return Site token.
     */
    CoreSite.prototype.getToken = function () {
        return this.token;
    };
    /**
     * Get site info.
     *
     * @return Site info.
     */
    CoreSite.prototype.getInfo = function () {
        return this.infos;
    };
    /**
     * Get site private token.
     *
     * @return Site private token.
     */
    CoreSite.prototype.getPrivateToken = function () {
        return this.privateToken;
    };
    /**
     * Get site DB.
     *
     * @return Site DB.
     */
    CoreSite.prototype.getDb = function () {
        return this.db;
    };
    /**
     * Get site user's ID.
     *
     * @return User's ID.
     */
    CoreSite.prototype.getUserId = function () {
        if (typeof this.infos != 'undefined' && typeof this.infos.userid != 'undefined') {
            return this.infos.userid;
        }
    };
    /**
     * Get site Course ID for frontpage course. If not declared it will return 1 as default.
     *
     * @return Site Home ID.
     */
    CoreSite.prototype.getSiteHomeId = function () {
        return this.infos && this.infos.siteid || 1;
    };
    /**
     * Get site name.
     *
     * @return Site name.
     */
    CoreSite.prototype.getSiteName = function () {
        if (CoreConfigConstants.sitename) {
            // Overridden by config.
            return CoreConfigConstants.sitename;
        }
        else {
            return this.infos && this.infos.sitename || '';
        }
    };
    /**
     * Set site ID.
     *
     * @param New ID.
     */
    CoreSite.prototype.setId = function (id) {
        this.id = id;
        this.initDB();
    };
    /**
     * Set site token.
     *
     * @param New token.
     */
    CoreSite.prototype.setToken = function (token) {
        this.token = token;
    };
    /**
     * Set site private token.
     *
     * @param privateToken New private token.
     */
    CoreSite.prototype.setPrivateToken = function (privateToken) {
        this.privateToken = privateToken;
    };
    /**
     * Check if user logged out from the site and needs to authenticate again.
     *
     * @return Whether is logged out.
     */
    CoreSite.prototype.isLoggedOut = function () {
        return !!this.loggedOut;
    };
    /**
     * Get OAuth ID.
     *
     * @return OAuth ID.
     */
    CoreSite.prototype.getOAuthId = function () {
        return this.oauthId;
    };
    /**
     * Set site info.
     *
     * @param New info.
     */
    CoreSite.prototype.setInfo = function (infos) {
        this.infos = infos;
        // Index function by name to speed up wsAvailable method.
        if (infos && infos.functions) {
            infos.functionsByName = {};
            infos.functions.forEach(function (func) {
                infos.functionsByName[func.name] = func;
            });
        }
    };
    /**
     * Set site config.
     *
     * @param Config.
     */
    CoreSite.prototype.setConfig = function (config) {
        if (config) {
            config.tool_mobile_disabledfeatures = this.textUtils.treatDisabledFeatures(config.tool_mobile_disabledfeatures);
        }
        this.config = config;
        this.calculateOfflineDisabled();
    };
    /**
     * Set site logged out.
     *
     * @param loggedOut True if logged out and needs to authenticate again, false otherwise.
     */
    CoreSite.prototype.setLoggedOut = function (loggedOut) {
        this.loggedOut = !!loggedOut;
    };
    /**
     * Set OAuth ID.
     *
     * @param oauth OAuth ID.
     */
    CoreSite.prototype.setOAuthId = function (oauthId) {
        this.oauthId = oauthId;
    };
    /**
     * Check if the user authenticated in the site using an OAuth method.
     *
     * @return {boolean} Whether the user authenticated in the site using an OAuth method.
     */
    CoreSite.prototype.isOAuth = function () {
        return this.oauthId != null && typeof this.oauthId != 'undefined';
    };
    /**
     * Can the user access their private files?
     *
     * @return Whether can access my files.
     */
    CoreSite.prototype.canAccessMyFiles = function () {
        var infos = this.getInfo();
        return infos && (typeof infos.usercanmanageownfiles === 'undefined' || infos.usercanmanageownfiles);
    };
    /**
     * Can the user download files?
     *
     * @return Whether can download files.
     */
    CoreSite.prototype.canDownloadFiles = function () {
        var infos = this.getInfo();
        return infos && infos.downloadfiles;
    };
    /**
     * Can the user use an advanced feature?
     *
     * @param feature The name of the feature.
     * @param whenUndefined The value to return when the parameter is undefined.
     * @return Whether can use advanced feature.
     */
    CoreSite.prototype.canUseAdvancedFeature = function (feature, whenUndefined) {
        if (whenUndefined === void 0) { whenUndefined = true; }
        var infos = this.getInfo();
        var canUse = true;
        if (typeof infos.advancedfeatures === 'undefined') {
            canUse = whenUndefined;
        }
        else {
            for (var i in infos.advancedfeatures) {
                var item = infos.advancedfeatures[i];
                if (item.name === feature && parseInt(item.value, 10) === 0) {
                    canUse = false;
                }
            }
        }
        return canUse;
    };
    /**
     * Can the user upload files?
     *
     * @return Whether can upload files.
     */
    CoreSite.prototype.canUploadFiles = function () {
        var infos = this.getInfo();
        return infos && infos.uploadfiles;
    };
    /**
     * Fetch site info from the Moodle site.
     *
     * @return A promise to be resolved when the site info is retrieved.
     */
    CoreSite.prototype.fetchSiteInfo = function () {
        // The get_site_info WS call won't be cached.
        var preSets = {
            getFromCache: false,
            saveToCache: false,
            skipQueue: true
        };
        // Reset clean Unicode to check if it's supported again.
        this.cleanUnicode = false;
        return this.read('core_webservice_get_site_info', {}, preSets);
    };
    /**
     * Read some data from the Moodle site using WS. Requests are cached by default.
     *
     * @param method WS method to use.
     * @param data Data to send to the WS.
     * @param preSets Extra options.
     * @return Promise resolved with the response, rejected with CoreWSError if it fails.
     */
    CoreSite.prototype.read = function (method, data, preSets) {
        preSets = preSets || {};
        if (typeof preSets.getFromCache == 'undefined') {
            preSets.getFromCache = true;
        }
        if (typeof preSets.saveToCache == 'undefined') {
            preSets.saveToCache = true;
        }
        if (typeof preSets.reusePending == 'undefined') {
            preSets.reusePending = true;
        }
        return this.request(method, data, preSets);
    };
    /**
     * Sends some data to the Moodle site using WS. Requests are NOT cached by default.
     *
     * @param method WS method to use.
     * @param data Data to send to the WS.
     * @param preSets Extra options.
     * @return Promise resolved with the response, rejected with CoreWSError if it fails.
     */
    CoreSite.prototype.write = function (method, data, preSets) {
        preSets = preSets || {};
        if (typeof preSets.getFromCache == 'undefined') {
            preSets.getFromCache = false;
        }
        if (typeof preSets.saveToCache == 'undefined') {
            preSets.saveToCache = false;
        }
        if (typeof preSets.emergencyCache == 'undefined') {
            preSets.emergencyCache = false;
        }
        return this.request(method, data, preSets);
    };
    /**
     * WS request to the site.
     *
     * @param method The WebService method to be called.
     * @param data Arguments to pass to the method.
     * @param preSets Extra options.
     * @param retrying True if we're retrying the call for some reason. This is to prevent infinite loops.
     * @return Promise resolved with the response, rejected with CoreWSError if it fails.
     * @description
     *
     * Sends a webservice request to the site. This method will automatically add the
     * required parameters and pass it on to the low level API in CoreWSProvider.call().
     *
     * Caching is also implemented, when enabled this method will returned a cached version of the request if the
     * data hasn't expired.
     *
     * This method is smart which means that it will try to map the method to a compatibility one if need be, usually this
     * means that it will fallback on the 'local_mobile_' prefixed function if it is available and the non-prefixed is not.
     */
    CoreSite.prototype.request = function (method, data, preSets, retrying) {
        var _this = this;
        var initialToken = this.token;
        data = data || {};
        if (!this.appProvider.isOnline() && this.offlineDisabled) {
            return Promise.reject(this.wsProvider.createFakeWSError('core.errorofflinedisabled', true));
        }
        // Check if the method is available, use a prefixed version if possible.
        // We ignore this check when we do not have the site info, as the list of functions is not loaded yet.
        if (this.getInfo() && !this.wsAvailable(method, false)) {
            var compatibilityMethod = CoreConstants.WS_PREFIX + method;
            if (this.wsAvailable(compatibilityMethod, false)) {
                this.logger.info("Using compatibility WS method '" + compatibilityMethod + "'");
                method = compatibilityMethod;
            }
            else {
                this.logger.error("WS function '" + method + "' is not available, even in compatibility mode.");
                return Promise.reject(this.utils.createFakeWSError('core.wsfunctionnotavailable', true));
            }
        }
        var wsPreSets = {
            wsToken: this.token,
            siteUrl: this.siteUrl,
            cleanUnicode: this.cleanUnicode,
            typeExpected: preSets.typeExpected,
            responseExpected: preSets.responseExpected,
            splitRequest: preSets.splitRequest,
        };
        if (wsPreSets.cleanUnicode && this.textUtils.hasUnicodeData(data)) {
            // Data will be cleaned, notify the user.
            this.domUtils.showToast('core.unicodenotsupported', true, 3000);
        }
        else {
            // No need to clean data in this call.
            wsPreSets.cleanUnicode = false;
        }
        if (this.offlineDisabled) {
            // Offline is disabled, don't use cache.
            preSets.getFromCache = false;
            preSets.saveToCache = false;
            preSets.emergencyCache = false;
        }
        // Enable text filtering by default.
        data.moodlewssettingfilter = preSets.filter === false ? false : true;
        data.moodlewssettingfileurl = preSets.rewriteurls === false ? false : true;
        var originalData = data;
        // Convert arguments to strings before starting the cache process.
        data = this.wsProvider.convertValuesToString(data, wsPreSets.cleanUnicode);
        if (data == null) {
            // Empty cleaned text found.
            return Promise.reject(this.utils.createFakeWSError('core.unicodenotsupportedcleanerror', true));
        }
        var cacheId = this.getCacheId(method, data);
        // Check for an ongoing identical request if we're not ignoring cache.
        if (preSets.getFromCache && this.ongoingRequests[cacheId]) {
            return this.ongoingRequests[cacheId].then(function (response) {
                // Clone the data, this may prevent errors if in the callback the object is modified.
                return _this.utils.clone(response);
            });
        }
        var promise = this.getFromCache(method, data, preSets, false, originalData).catch(function () {
            if (preSets.forceOffline) {
                // Don't call the WS, just fail.
                return Promise.reject(_this.wsProvider.createFakeWSError('core.cannotconnect', true, { $a: CoreSite.MINIMUM_MOODLE_VERSION }));
            }
            // Call the WS.
            return _this.callOrEnqueueRequest(method, data, preSets, wsPreSets).then(function (response) {
                if (preSets.saveToCache) {
                    _this.saveToCache(method, data, response, preSets);
                }
                return response;
            }).catch(function (error) {
                if (error.errorcode == 'invalidtoken' ||
                    (error.errorcode == 'accessexception' && error.message.indexOf('Invalid token - token expired') > -1)) {
                    if (initialToken !== _this.token && !retrying) {
                        // Token has changed, retry with the new token.
                        preSets.getFromCache = false; // Don't check cache now. Also, it will skip ongoingRequests.
                        return _this.request(method, data, preSets, true);
                    }
                    else if (_this.appProvider.isSSOAuthenticationOngoing()) {
                        // There's an SSO authentication ongoing, wait for it to finish and try again.
                        return _this.appProvider.waitForSSOAuthentication().then(function () {
                            return _this.request(method, data, preSets, true);
                        });
                    }
                    // Session expired, trigger event.
                    _this.eventsProvider.trigger(CoreEventsProvider.SESSION_EXPIRED, {}, _this.id);
                    // Change error message. Try to get data from cache, the event will handle the error.
                    error.message = _this.translate.instant('core.lostconnection');
                }
                else if (error.errorcode === 'userdeleted') {
                    // User deleted, trigger event.
                    _this.eventsProvider.trigger(CoreEventsProvider.USER_DELETED, { params: data }, _this.id);
                    error.message = _this.translate.instant('core.userdeleted');
                    return Promise.reject(error);
                }
                else if (error.errorcode === 'forcepasswordchangenotice') {
                    // Password Change Forced, trigger event. Try to get data from cache, the event will handle the error.
                    _this.eventsProvider.trigger(CoreEventsProvider.PASSWORD_CHANGE_FORCED, {}, _this.id);
                    error.message = _this.translate.instant('core.forcepasswordchangenotice');
                }
                else if (error.errorcode === 'usernotfullysetup') {
                    // User not fully setup, trigger event. Try to get data from cache, the event will handle the error.
                    _this.eventsProvider.trigger(CoreEventsProvider.USER_NOT_FULLY_SETUP, {}, _this.id);
                    error.message = _this.translate.instant('core.usernotfullysetup');
                }
                else if (error.errorcode === 'sitepolicynotagreed') {
                    // Site policy not agreed, trigger event.
                    _this.eventsProvider.trigger(CoreEventsProvider.SITE_POLICY_NOT_AGREED, {}, _this.id);
                    error.message = _this.translate.instant('core.login.sitepolicynotagreederror');
                    return Promise.reject(error);
                }
                else if (error.errorcode === 'dmlwriteexception' && _this.textUtils.hasUnicodeData(data)) {
                    if (!_this.cleanUnicode) {
                        // Try again cleaning unicode.
                        _this.cleanUnicode = true;
                        return _this.request(method, data, preSets);
                    }
                    // This should not happen.
                    error.message = _this.translate.instant('core.unicodenotsupported');
                    return Promise.reject(error);
                }
                else if (error.exception === 'required_capability_exception' || error.errorcode === 'nopermission' ||
                    error.errorcode === 'notingroup') {
                    // Translate error messages with missing strings.
                    if (error.message === 'error/nopermission') {
                        error.message = _this.translate.instant('core.nopermissionerror');
                    }
                    else if (error.message === 'error/notingroup') {
                        error.message = _this.translate.instant('core.notingroup');
                    }
                    // Save the error instead of deleting the cache entry so the same content is displayed in offline.
                    _this.saveToCache(method, data, error, preSets);
                    return Promise.reject(error);
                }
                else if (preSets.cacheErrors && preSets.cacheErrors.indexOf(error.errorcode) != -1) {
                    // Save the error instead of deleting the cache entry so the same content is displayed in offline.
                    _this.saveToCache(method, data, error, preSets);
                    return Promise.reject(error);
                }
                else if (typeof preSets.emergencyCache !== 'undefined' && !preSets.emergencyCache) {
                    _this.logger.debug("WS call '" + method + "' failed. Emergency cache is forbidden, rejecting.");
                    return Promise.reject(error);
                }
                if (preSets.deleteCacheIfWSError && _this.utils.isWebServiceError(error)) {
                    // Delete the cache entry and return the entry. Don't block the user with the delete.
                    _this.deleteFromCache(method, data, preSets).catch(function () {
                        // Ignore errors.
                    });
                    return Promise.reject(error);
                }
                _this.logger.debug("WS call '" + method + "' failed. Trying to use the emergency cache.");
                preSets.omitExpires = true;
                preSets.getFromCache = true;
                return _this.getFromCache(method, data, preSets, true, originalData).catch(function () {
                    return Promise.reject(error);
                });
            });
        }).then(function (response) {
            // Check if the response is an error, this happens if the error was stored in the cache.
            if (response && (typeof response.exception != 'undefined' || typeof response.errorcode != 'undefined')) {
                return Promise.reject(response);
            }
            return response;
        });
        this.ongoingRequests[cacheId] = promise;
        // Clear ongoing request after setting the promise (just in case it's already resolved).
        return promise.finally(function () {
            // Make sure we don't clear the promise of a newer request that ignores the cache.
            if (_this.ongoingRequests[cacheId] === promise) {
                delete _this.ongoingRequests[cacheId];
            }
        }).then(function (response) {
            // We pass back a clone of the original object, this may prevent errors if in the callback the object is modified.
            return _this.utils.clone(response);
        });
    };
    /**
     * Adds a request to the queue or calls it immediately when not using the queue.
     *
     * @param method The WebService method to be called.
     * @param data Arguments to pass to the method.
     * @param preSets Extra options related to the site.
     * @param wsPreSets Extra options related to the WS call.
     * @return Promise resolved with the response when the WS is called.
     */
    CoreSite.prototype.callOrEnqueueRequest = function (method, data, preSets, wsPreSets) {
        if (preSets.skipQueue || !this.wsAvailable('tool_mobile_call_external_functions')) {
            return this.wsProvider.call(method, data, wsPreSets);
        }
        var cacheId = this.getCacheId(method, data);
        // Check if there is an identical request waiting in the queue (read requests only by default).
        if (preSets.reusePending) {
            var request_1 = this.requestQueue.find(function (request) { return request.cacheId == cacheId; });
            if (request_1) {
                return request_1.deferred.promise;
            }
        }
        var request = {
            cacheId: cacheId,
            method: method,
            data: data,
            preSets: preSets,
            wsPreSets: wsPreSets,
            deferred: {}
        };
        request.deferred.promise = new Promise(function (resolve, reject) {
            request.deferred.resolve = resolve;
            request.deferred.reject = reject;
        });
        return this.enqueueRequest(request);
    };
    /**
     * Adds a request to the queue.
     *
     * @param request The request to enqueue.
     * @return Promise resolved with the response when the WS is called.
     */
    CoreSite.prototype.enqueueRequest = function (request) {
        this.requestQueue.push(request);
        if (this.requestQueue.length >= CoreSite.REQUEST_QUEUE_LIMIT) {
            this.processRequestQueue();
        }
        else if (!this.requestQueueTimeout) {
            this.requestQueueTimeout = setTimeout(this.processRequestQueue.bind(this), CoreSite.REQUEST_QUEUE_DELAY);
        }
        return request.deferred.promise;
    };
    /**
     * Call the enqueued web service requests.
     */
    CoreSite.prototype.processRequestQueue = function () {
        var _this = this;
        this.logger.debug("Processing request queue (" + this.requestQueue.length + " requests)");
        // Clear timeout if set.
        if (this.requestQueueTimeout) {
            clearTimeout(this.requestQueueTimeout);
            this.requestQueueTimeout = null;
        }
        // Extract all requests from the queue.
        var requests = this.requestQueue;
        this.requestQueue = [];
        if (requests.length == 1 && !CoreSite.REQUEST_QUEUE_FORCE_WS) {
            // Only one request, do a regular web service call.
            this.wsProvider.call(requests[0].method, requests[0].data, requests[0].wsPreSets).then(function (data) {
                requests[0].deferred.resolve(data);
            }).catch(function (error) {
                requests[0].deferred.reject(error);
            });
            return;
        }
        var data = {
            requests: requests.map(function (request) {
                var args = {};
                var settings = {};
                // Separate WS settings from function arguments.
                Object.keys(request.data).forEach(function (key) {
                    var value = request.data[key];
                    var match = /^moodlews(setting.*)$/.exec(key);
                    if (match) {
                        if (match[1] == 'settingfilter' || match[1] == 'settingfileurl') {
                            // Undo special treatment of these settings in CoreWSProvider.convertValuesToString.
                            value = (value == 'true' ? '1' : '0');
                        }
                        settings[match[1]] = value;
                    }
                    else {
                        args[key] = value;
                    }
                });
                return __assign({ function: request.method, arguments: JSON.stringify(args) }, settings);
            })
        };
        var wsPresets = {
            siteUrl: this.siteUrl,
            wsToken: this.token,
        };
        this.wsProvider.call('tool_mobile_call_external_functions', data, wsPresets).then(function (data) {
            if (!data || !data.responses) {
                return Promise.reject(null);
            }
            requests.forEach(function (request, i) {
                var response = data.responses[i];
                if (!response) {
                    // Request not executed, enqueue again.
                    _this.enqueueRequest(request);
                }
                else if (response.error) {
                    request.deferred.reject(_this.textUtils.parseJSON(response.exception));
                }
                else {
                    var responseData = _this.textUtils.parseJSON(response.data);
                    // Match the behaviour of CoreWSProvider.call when no response is expected.
                    var responseExpected = typeof wsPresets.responseExpected == 'undefined' || wsPresets.responseExpected;
                    if (!responseExpected && (responseData == null || responseData === '')) {
                        responseData = {};
                    }
                    request.deferred.resolve(responseData);
                }
            });
        }).catch(function (error) {
            // Error not specific to a single request, reject all promises.
            requests.forEach(function (request) {
                request.deferred.reject(error);
            });
        });
    };
    /**
     * Check if a WS is available in this site.
     *
     * @param method WS name.
     * @param checkPrefix When true also checks with the compatibility prefix.
     * @return Whether the WS is available.
     */
    CoreSite.prototype.wsAvailable = function (method, checkPrefix) {
        if (checkPrefix === void 0) { checkPrefix = true; }
        if (typeof this.infos == 'undefined') {
            return false;
        }
        if (this.infos.functionsByName[method]) {
            return true;
        }
        // Let's try again with the compatibility prefix.
        if (checkPrefix) {
            return this.wsAvailable(CoreConstants.WS_PREFIX + method, false);
        }
        return false;
    };
    /**
     * Get cache ID.
     *
     * @param method The WebService method.
     * @param data Arguments to pass to the method.
     * @return Cache ID.
     */
    CoreSite.prototype.getCacheId = function (method, data) {
        return Md5.hashAsciiStr(method + ':' + this.utils.sortAndStringify(data));
    };
    /**
     * Get the cache ID used in Ionic 1 version of the app.
     *
     * @param method The WebService method.
     * @param data Arguments to pass to the method.
     * @return Cache ID.
     */
    CoreSite.prototype.getCacheOldId = function (method, data) {
        return Md5.hashAsciiStr(method + ':' + JSON.stringify(data));
    };
    /**
     * Get a WS response from cache.
     *
     * @param method The WebService method to be called.
     * @param data Arguments to pass to the method.
     * @param preSets Extra options.
     * @param emergency Whether it's an "emergency" cache call (WS call failed).
     * @param originalData Arguments to pass to the method before being converted to strings.
     * @return Promise resolved with the WS response.
     */
    CoreSite.prototype.getFromCache = function (method, data, preSets, emergency, originalData) {
        var _this = this;
        if (!this.db || !preSets.getFromCache) {
            return Promise.reject(null);
        }
        var id = this.getCacheId(method, data);
        var promise;
        if (preSets.getCacheUsingCacheKey || (emergency && preSets.getEmergencyCacheUsingCacheKey)) {
            promise = this.db.getRecords(CoreSite.WS_CACHE_TABLE, { key: preSets.cacheKey }).then(function (entries) {
                if (!entries.length) {
                    // Cache key not found, get by params sent.
                    return _this.db.getRecord(CoreSite.WS_CACHE_TABLE, { id: id });
                }
                else if (entries.length > 1) {
                    // More than one entry found. Search the one with same ID as this call.
                    for (var i = 0, len = entries.length; i < len; i++) {
                        var entry = entries[i];
                        if (entry.id == id) {
                            return entry;
                        }
                    }
                }
                return entries[0];
            });
        }
        else {
            promise = this.db.getRecord(CoreSite.WS_CACHE_TABLE, { id: id }).catch(function () {
                // Entry not found, try to get it using the old ID.
                var oldId = _this.getCacheOldId(method, originalData || {});
                return _this.db.getRecord(CoreSite.WS_CACHE_TABLE, { id: oldId }).then(function (entry) {
                    // Update the entry ID to use the new one.
                    _this.db.updateRecords(CoreSite.WS_CACHE_TABLE, { id: id }, { id: oldId });
                    return entry;
                });
            });
        }
        return promise.then(function (entry) {
            var now = Date.now();
            var expirationTime;
            preSets.omitExpires = preSets.omitExpires || preSets.forceOffline || !_this.appProvider.isOnline();
            if (!preSets.omitExpires) {
                expirationTime = entry.expirationTime + _this.getExpirationDelay(preSets.updateFrequency);
                if (now > expirationTime) {
                    _this.logger.debug('Cached element found, but it is expired');
                    return Promise.reject(null);
                }
            }
            if (typeof entry != 'undefined' && typeof entry.data != 'undefined') {
                if (!expirationTime) {
                    _this.logger.info("Cached element found, id: " + id + ". Expiration time ignored.");
                }
                else {
                    var expires = (expirationTime - now) / 1000;
                    _this.logger.info("Cached element found, id: " + id + ". Expires in expires in " + expires + " seconds");
                }
                return _this.textUtils.parseJSON(entry.data, {});
            }
            return Promise.reject(null);
        });
    };
    /**
     * Gets the size of cached data for a specific component or component instance.
     *
     * @param component Component name
     * @param componentId Optional component id (if not included, returns sum for whole component)
     * @return Promise resolved when we have calculated the size
     */
    CoreSite.prototype.getComponentCacheSize = function (component, componentId) {
        var params = [component];
        var extraClause = '';
        if (componentId !== undefined && componentId !== null) {
            params.push(componentId);
            extraClause = ' AND componentId = ?';
        }
        return this.db.getFieldSql('SELECT SUM(length(data)) FROM ' + CoreSite.WS_CACHE_TABLE +
            ' WHERE component = ?' + extraClause, params);
    };
    /**
     * Save a WS response to cache.
     *
     * @param method The WebService method.
     * @param data Arguments to pass to the method.
     * @param response The WS response.
     * @param preSets Extra options.
     * @return Promise resolved when the response is saved.
     */
    CoreSite.prototype.saveToCache = function (method, data, response, preSets) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(null);
        }
        var promise;
        if (preSets.uniqueCacheKey) {
            // Cache key must be unique, delete all entries with same cache key.
            promise = this.deleteFromCache(method, data, preSets, true).catch(function () {
                // Ignore errors.
            });
        }
        else {
            promise = Promise.resolve();
        }
        return promise.then(function () {
            // Since 3.7, the expiration time contains the time the entry is modified instead of the expiration time.
            // We decided to reuse this field to prevent modifying the database table.
            var id = _this.getCacheId(method, data), entry = {
                id: id,
                data: JSON.stringify(response),
                expirationTime: Date.now()
            };
            if (preSets.cacheKey) {
                entry.key = preSets.cacheKey;
            }
            if (preSets.component) {
                entry.component = preSets.component;
                if (preSets.componentId) {
                    entry.componentId = preSets.componentId;
                }
            }
            return _this.db.insertRecord(CoreSite.WS_CACHE_TABLE, entry);
        });
    };
    /**
     * Delete a WS cache entry or entries.
     *
     * @param method The WebService method to be called.
     * @param data Arguments to pass to the method.
     * @param preSets Extra options.
     * @param allCacheKey True to delete all entries with the cache key, false to delete only by ID.
     * @return Promise resolved when the entries are deleted.
     */
    CoreSite.prototype.deleteFromCache = function (method, data, preSets, allCacheKey) {
        if (!this.db) {
            return Promise.reject(null);
        }
        var id = this.getCacheId(method, data);
        if (allCacheKey) {
            return this.db.deleteRecords(CoreSite.WS_CACHE_TABLE, { key: preSets.cacheKey });
        }
        return this.db.deleteRecords(CoreSite.WS_CACHE_TABLE, { id: id });
    };
    /**
     * Deletes WS cache entries for all methods relating to a specific component (and
     * optionally component id).
     *
     * @param component Component name.
     * @param componentId Component id.
     * @return Promise resolved when the entries are deleted.
     */
    CoreSite.prototype.deleteComponentFromCache = function (component, componentId) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                if (!component) {
                    return [2 /*return*/];
                }
                if (!this.db) {
                    throw new Error('Site DB not initialized');
                }
                params = {
                    component: component
                };
                if (componentId) {
                    params.componentId = componentId;
                }
                return [2 /*return*/, this.db.deleteRecords(CoreSite.WS_CACHE_TABLE, params)];
            });
        });
    };
    /*
     * Uploads a file using Cordova File API.
     *
     * @param filePath File path.
     * @param options File upload options.
     * @param onProgress Function to call on progress.
     * @return Promise resolved when uploaded.
     */
    CoreSite.prototype.uploadFile = function (filePath, options, onProgress) {
        if (!options.fileArea) {
            options.fileArea = 'draft';
        }
        return this.wsProvider.uploadFile(filePath, options, {
            siteUrl: this.siteUrl,
            wsToken: this.token
        }, onProgress);
    };
    /**
     * Invalidates all the cache entries.
     *
     * @return Promise resolved when the cache entries are invalidated.
     */
    CoreSite.prototype.invalidateWsCache = function () {
        var _this = this;
        if (!this.db) {
            return Promise.reject(null);
        }
        this.logger.debug('Invalidate all the cache for site: ' + this.id);
        return this.db.updateRecords(CoreSite.WS_CACHE_TABLE, { expirationTime: 0 }).finally(function () {
            _this.eventsProvider.trigger(CoreEventsProvider.WS_CACHE_INVALIDATED, {}, _this.getId());
        });
    };
    /**
     * Invalidates all the cache entries with a certain key.
     *
     * @param key Key to search.
     * @return Promise resolved when the cache entries are invalidated.
     */
    CoreSite.prototype.invalidateWsCacheForKey = function (key) {
        if (!this.db) {
            return Promise.reject(null);
        }
        if (!key) {
            return Promise.resolve();
        }
        this.logger.debug('Invalidate cache for key: ' + key);
        return this.db.updateRecords(CoreSite.WS_CACHE_TABLE, { expirationTime: 0 }, { key: key });
    };
    /**
     * Invalidates all the cache entries in an array of keys.
     *
     * @param keys Keys to search.
     * @return Promise resolved when the cache entries are invalidated.
     */
    CoreSite.prototype.invalidateMultipleWsCacheForKey = function (keys) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(null);
        }
        if (!keys || !keys.length) {
            return Promise.resolve();
        }
        var promises = [];
        this.logger.debug('Invalidating multiple cache keys');
        keys.forEach(function (key) {
            promises.push(_this.invalidateWsCacheForKey(key));
        });
        return Promise.all(promises);
    };
    /**
     * Invalidates all the cache entries whose key starts with a certain value.
     *
     * @param key Key to search.
     * @return Promise resolved when the cache entries are invalidated.
     */
    CoreSite.prototype.invalidateWsCacheForKeyStartingWith = function (key) {
        if (!this.db) {
            return Promise.reject(null);
        }
        if (!key) {
            return Promise.resolve();
        }
        this.logger.debug('Invalidate cache for key starting with: ' + key);
        var sql = 'UPDATE ' + CoreSite.WS_CACHE_TABLE + ' SET expirationTime=0 WHERE key LIKE ?';
        return this.db.execute(sql, [key + '%']);
    };
    /**
     * Check if tokenpluginfile can be used, and fix the URL afterwards.
     *
     * @param url The url to be fixed.
     * @return Promise resolved with the fixed URL.
     */
    CoreSite.prototype.checkAndFixPluginfileURL = function (url) {
        var _this = this;
        return this.checkTokenPluginFile(url).then(function () {
            return _this.fixPluginfileURL(url);
        });
    };
    /**
     * Generic function for adding the wstoken to Moodle urls and for pointing to the correct script.
     * Uses CoreUtilsProvider.fixPluginfileURL, passing site's token.
     *
     * @param url The url to be fixed.
     * @return Fixed URL.
     */
    CoreSite.prototype.fixPluginfileURL = function (url) {
        var accessKey = this.tokenPluginFileWorks || typeof this.tokenPluginFileWorks == 'undefined' ?
            this.infos && this.infos.userprivateaccesskey : undefined;
        return this.urlUtils.fixPluginfileURL(url, this.token, this.siteUrl, accessKey);
    };
    /**
     * Deletes site's DB.
     *
     * @return Promise to be resolved when the DB is deleted.
     */
    CoreSite.prototype.deleteDB = function () {
        return this.dbProvider.deleteDB('Site-' + this.id);
    };
    /**
     * Deletes site's folder.
     *
     * @return Promise to be resolved when the DB is deleted.
     */
    CoreSite.prototype.deleteFolder = function () {
        if (this.fileProvider.isAvailable()) {
            var siteFolder = this.fileProvider.getSiteFolder(this.id);
            return this.fileProvider.removeDir(siteFolder).catch(function () {
                // Ignore any errors, CoreFileProvider.removeDir fails if folder doesn't exists.
            });
        }
        else {
            return Promise.resolve();
        }
    };
    /**
     * Get space usage of the site.
     *
     * @return Promise resolved with the site space usage (size).
     */
    CoreSite.prototype.getSpaceUsage = function () {
        if (this.fileProvider.isAvailable()) {
            var siteFolderPath = this.fileProvider.getSiteFolder(this.id);
            return this.fileProvider.getDirectorySize(siteFolderPath).catch(function () {
                return 0;
            });
        }
        else {
            return Promise.resolve(0);
        }
    };
    /**
     * Gets an approximation of the cache table usage of the site.
     *
     * Currently this is just the total length of the data fields in the cache table.
     *
     * @return Promise resolved with the total size of all data in the cache table (bytes)
     */
    CoreSite.prototype.getCacheUsage = function () {
        return this.db.getFieldSql('SELECT SUM(length(data)) FROM ' + CoreSite.WS_CACHE_TABLE);
    };
    /**
     * Gets a total of the file and cache usage.
     *
     * @return Promise with the total of getSpaceUsage and getCacheUsage
     */
    CoreSite.prototype.getTotalUsage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var space, cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSpaceUsage()];
                    case 1:
                        space = _a.sent();
                        return [4 /*yield*/, this.getCacheUsage()];
                    case 2:
                        cache = _a.sent();
                        return [2 /*return*/, space + cache];
                }
            });
        });
    };
    /**
     * Returns the URL to the documentation of the app, based on Moodle version and current language.
     *
     * @param page Docs page to go to.
     * @return Promise resolved with the Moodle docs URL.
     */
    CoreSite.prototype.getDocsUrl = function (page) {
        var release = this.infos.release ? this.infos.release : undefined;
        return this.urlUtils.getDocsUrl(release, page);
    };
    /**
     * Returns a url to link an specific page on the site.
     *
     * @param path Path of the url to go to.
     * @param params Object with the params to add.
     * @param anchor Anchor text if needed.
     * @return URL with params.
     */
    CoreSite.prototype.createSiteUrl = function (path, params, anchor) {
        return this.urlUtils.addParamsToUrl(this.siteUrl + path, params, anchor);
    };
    /**
     * Check if the local_mobile plugin is installed in the Moodle site.
     *
     * @param retrying True if we're retrying the check.
     * @return Promise resolved when the check is done.
     */
    CoreSite.prototype.checkLocalMobilePlugin = function (retrying) {
        return __awaiter(this, void 0, void 0, function () {
            var checkUrl, service, data, response, ex_1, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkUrl = this.siteUrl + '/local/mobile/check.php', service = CoreConfigConstants.wsextservice;
                        if (!service) {
                            // External service not defined.
                            return [2 /*return*/, { code: 0 }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.wsProvider.sendHTTPRequest(checkUrl, {
                                method: 'post',
                                data: { service: service },
                            })];
                    case 2:
                        response = _a.sent();
                        data = response.body;
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        return [2 /*return*/, { code: 0 }];
                    case 4:
                        if (data === null) {
                            // This probably means that the server was configured to return null for non-existing URLs. Not installed.
                            return [2 /*return*/, { code: 0 }];
                        }
                        if (typeof data != 'undefined' && data.errorcode === 'requirecorrectaccess') {
                            if (!retrying) {
                                this.siteUrl = this.urlUtils.addOrRemoveWWW(this.siteUrl);
                                return [2 /*return*/, this.checkLocalMobilePlugin(true)];
                            }
                            else {
                                throw data.error;
                            }
                        }
                        else if (typeof data == 'undefined' || typeof data.code == 'undefined') {
                            // The local_mobile returned something we didn't expect. Let's assume it's not installed.
                            return [2 /*return*/, { code: 0, warning: 'core.login.localmobileunexpectedresponse' }];
                        }
                        code = parseInt(data.code, 10);
                        if (data.error) {
                            switch (code) {
                                case 1:
                                    // Site in maintenance mode.
                                    throw this.translate.instant('core.login.siteinmaintenance');
                                case 2:
                                    // Web services not enabled.
                                    throw this.translate.instant('core.login.webservicesnotenabled');
                                case 3:
                                    // Extended service not enabled, but the official is enabled.
                                    return [2 /*return*/, { code: 0 }];
                                case 4:
                                    // Neither extended or official services enabled.
                                    throw this.translate.instant('core.login.mobileservicesnotenabled');
                                default:
                                    throw this.translate.instant('core.unexpectederror');
                            }
                        }
                        else {
                            return [2 /*return*/, { code: code, service: service, coreSupported: !!data.coresupported }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if local_mobile has been installed in Moodle.
     *
     * @return Whether the App is able to use local_mobile plugin for this site.
     */
    CoreSite.prototype.checkIfAppUsesLocalMobile = function () {
        var appUsesLocalMobile = false;
        if (!this.infos || !this.infos.functions) {
            return appUsesLocalMobile;
        }
        this.infos.functions.forEach(function (func) {
            if (func.name.indexOf(CoreConstants.WS_PREFIX) != -1) {
                appUsesLocalMobile = true;
            }
        });
        return appUsesLocalMobile;
    };
    /**
     * Check if local_mobile has been installed in Moodle but the app is not using it.
     *
     * @return Promise resolved it local_mobile was added, rejected otherwise.
     */
    CoreSite.prototype.checkIfLocalMobileInstalledAndNotUsed = function () {
        var appUsesLocalMobile = this.checkIfAppUsesLocalMobile();
        if (appUsesLocalMobile) {
            // App already uses local_mobile, it wasn't added.
            return Promise.reject(null);
        }
        return this.checkLocalMobilePlugin().then(function (data) {
            if (typeof data.service == 'undefined') {
                // The local_mobile NOT installed. Reject.
                return Promise.reject(null);
            }
            return data;
        });
    };
    /**
     * Check if a URL belongs to this site.
     *
     * @param url URL to check.
     * @return Whether the URL belongs to this site.
     */
    CoreSite.prototype.containsUrl = function (url) {
        if (!url) {
            return false;
        }
        var siteUrl = this.textUtils.addEndingSlash(this.urlUtils.removeProtocolAndWWW(this.siteUrl));
        url = this.textUtils.addEndingSlash(this.urlUtils.removeProtocolAndWWW(url));
        return url.indexOf(siteUrl) == 0;
    };
    /**
     * Get the public config of this site.
     *
     * @return Promise resolved with public config. Rejected with an object if error, see CoreWSProvider.callAjax.
     */
    CoreSite.prototype.getPublicConfig = function () {
        var _this = this;
        var preSets = {
            siteUrl: this.siteUrl
        };
        return this.wsProvider.callAjax('tool_mobile_get_public_config', {}, preSets).catch(function (error) {
            if ((!_this.getInfo() || _this.isVersionGreaterEqualThan('3.8')) && error && error.errorcode == 'codingerror') {
                // This error probably means that there is a redirect in the site. Try to use a GET request.
                preSets.noLogin = true;
                preSets.useGet = true;
                return _this.wsProvider.callAjax('tool_mobile_get_public_config', {}, preSets).catch(function (error2) {
                    if (_this.getInfo() && _this.isVersionGreaterEqualThan('3.8')) {
                        // GET is supported, return the second error.
                        return Promise.reject(error2);
                    }
                    else {
                        // GET not supported or we don't know if it's supported. Return first error.
                        return Promise.reject(error);
                    }
                });
            }
            return Promise.reject(error);
        }).then(function (config) {
            // Use the wwwroot returned by the server.
            if (config.httpswwwroot) {
                _this.siteUrl = config.httpswwwroot;
            }
            return config;
        });
    };
    /**
     * Open a URL in browser using auto-login in the Moodle site if available.
     *
     * @param url The URL to open.
     * @param alertMessage If defined, an alert will be shown before opening the browser.
     * @return Promise resolved when done, rejected otherwise.
     */
    CoreSite.prototype.openInBrowserWithAutoLogin = function (url, alertMessage) {
        return this.openWithAutoLogin(false, url, undefined, alertMessage);
    };
    /**
     * Open a URL in browser using auto-login in the Moodle site if available and the URL belongs to the site.
     *
     * @param url The URL to open.
     * @param alertMessage If defined, an alert will be shown before opening the browser.
     * @return Promise resolved when done, rejected otherwise.
     */
    CoreSite.prototype.openInBrowserWithAutoLoginIfSameSite = function (url, alertMessage) {
        return this.openWithAutoLoginIfSameSite(false, url, undefined, alertMessage);
    };
    /**
     * Open a URL in inappbrowser using auto-login in the Moodle site if available.
     *
     * @param url The URL to open.
     * @param options Override default options passed to InAppBrowser.
     * @param alertMessage If defined, an alert will be shown before opening the inappbrowser.
     * @return Promise resolved when done.
     */
    CoreSite.prototype.openInAppWithAutoLogin = function (url, options, alertMessage) {
        return this.openWithAutoLogin(true, url, options, alertMessage);
    };
    /**
     * Open a URL in inappbrowser using auto-login in the Moodle site if available and the URL belongs to the site.
     *
     * @param url The URL to open.
     * @param options Override default options passed to inappbrowser.
     * @param alertMessage If defined, an alert will be shown before opening the inappbrowser.
     * @return Promise resolved when done.
     */
    CoreSite.prototype.openInAppWithAutoLoginIfSameSite = function (url, options, alertMessage) {
        return this.openWithAutoLoginIfSameSite(true, url, options, alertMessage);
    };
    /**
     * Open a URL in browser or InAppBrowser using auto-login in the Moodle site if available.
     *
     * @param inApp True to open it in InAppBrowser, false to open in browser.
     * @param url The URL to open.
     * @param options Override default options passed to $cordovaInAppBrowser#open.
     * @param alertMessage If defined, an alert will be shown before opening the browser/inappbrowser.
     * @return Promise resolved when done. Resolve param is returned only if inApp=true.
     */
    CoreSite.prototype.openWithAutoLogin = function (inApp, url, options, alertMessage) {
        var _this = this;
        // Get the URL to open.
        return this.getAutoLoginUrl(url).then(function (url) {
            if (!alertMessage) {
                // Just open the URL.
                if (inApp) {
                    return _this.utils.openInApp(url, options);
                }
                else {
                    return _this.utils.openInBrowser(url);
                }
            }
            // Show an alert first.
            return _this.domUtils.showAlert(_this.translate.instant('core.notice'), alertMessage, undefined, 3000).then(function (alert) {
                return new Promise(function (resolve, reject) {
                    var subscription = alert.didDismiss.subscribe(function () {
                        subscription && subscription.unsubscribe();
                        if (inApp) {
                            resolve(_this.utils.openInApp(url, options));
                        }
                        else {
                            resolve(_this.utils.openInBrowser(url));
                        }
                    });
                });
            });
        });
    };
    /**
     * Open a URL in browser or InAppBrowser using auto-login in the Moodle site if available and the URL belongs to the site.
     *
     * @param inApp True to open it in InAppBrowser, false to open in browser.
     * @param url The URL to open.
     * @param options Override default options passed to inappbrowser.
     * @param alertMessage If defined, an alert will be shown before opening the browser/inappbrowser.
     * @return Promise resolved when done. Resolve param is returned only if inApp=true.
     */
    CoreSite.prototype.openWithAutoLoginIfSameSite = function (inApp, url, options, alertMessage) {
        if (this.containsUrl(url)) {
            return this.openWithAutoLogin(inApp, url, options, alertMessage);
        }
        else {
            if (inApp) {
                this.utils.openInApp(url, options);
            }
            else {
                this.utils.openInBrowser(url);
            }
            return Promise.resolve(null);
        }
    };
    /**
     * Get the config of this site.
     * It is recommended to use getStoredConfig instead since it's faster and doesn't use network.
     *
     * @param name Name of the setting to get. If not set or false, all settings will be returned.
     * @param ignoreCache True if it should ignore cached data.
     * @return Promise resolved with site config.
     */
    CoreSite.prototype.getConfig = function (name, ignoreCache) {
        var preSets = {
            cacheKey: this.getConfigCacheKey()
        };
        if (ignoreCache) {
            preSets.getFromCache = false;
            preSets.emergencyCache = false;
        }
        return this.read('tool_mobile_get_config', {}, preSets).then(function (config) {
            if (name) {
                // Return the requested setting.
                for (var x in config.settings) {
                    if (config.settings[x].name == name) {
                        return config.settings[x].value;
                    }
                }
                return Promise.reject(null);
            }
            else {
                // Return all settings in the same array.
                var settings_1 = {};
                config.settings.forEach(function (setting) {
                    settings_1[setting.name] = setting.value;
                });
                return settings_1;
            }
        });
    };
    /**
     * Invalidates config WS call.
     *
     * @return Promise resolved when the data is invalidated.
     */
    CoreSite.prototype.invalidateConfig = function () {
        return this.invalidateWsCacheForKey(this.getConfigCacheKey());
    };
    /**
     * Get cache key for getConfig WS calls.
     *
     * @return Cache key.
     */
    CoreSite.prototype.getConfigCacheKey = function () {
        return 'tool_mobile_get_config';
    };
    /**
     * Get the stored config of this site.
     *
     * @param name Name of the setting to get. If not set, all settings will be returned.
     * @return Site config or a specific setting.
     */
    CoreSite.prototype.getStoredConfig = function (name) {
        if (!this.config) {
            return;
        }
        if (name) {
            return this.config[name];
        }
        else {
            return this.config;
        }
    };
    /**
     * Check if a certain feature is disabled in the site.
     *
     * @param name Name of the feature to check.
     * @return Whether it's disabled.
     */
    CoreSite.prototype.isFeatureDisabled = function (name) {
        var disabledFeatures = this.getStoredConfig('tool_mobile_disabledfeatures');
        if (!disabledFeatures) {
            return false;
        }
        var regEx = new RegExp('(,|^)' + this.textUtils.escapeForRegex(name) + '(,|$)', 'g');
        return !!disabledFeatures.match(regEx);
    };
    /**
     * Calculate if offline is disabled in the site.
     */
    CoreSite.prototype.calculateOfflineDisabled = function () {
        this.offlineDisabled = this.isFeatureDisabled('NoDelegate_CoreOffline');
    };
    /**
     * Get whether offline is disabled in the site.
     *
     * @return Whether it's disabled.
     */
    CoreSite.prototype.isOfflineDisabled = function () {
        return this.offlineDisabled;
    };
    /**
     * Check if the site version is greater than one or several versions.
     * This function accepts a string or an array of strings. If array, the last version must be the highest.
     *
     * @param versions Version or list of versions to check.
     * @return Whether it's greater or equal, false otherwise.
     * @description
     * If a string is supplied (e.g. '3.2.1'), it will check if the site version is greater or equal than this version.
     *
     * If an array of versions is supplied, it will check if the site version is greater or equal than the last version,
     * or if it's higher or equal than any of the other releases supplied but lower than the next major release. The last
     * version of the array must be the highest version.
     * For example, if the values supplied are ['3.0.5', '3.2.3', '3.3.1'] the function will return true if the site version
     * is either:
     *     - Greater or equal than 3.3.1.
     *     - Greater or equal than 3.2.3 but lower than 3.3.
     *     - Greater or equal than 3.0.5 but lower than 3.1.
     *
     * This function only accepts versions from 2.4.0 and above. If any of the versions supplied isn't found, it will assume
     * it's the last released major version.
     */
    CoreSite.prototype.isVersionGreaterEqualThan = function (versions) {
        var siteVersion = parseInt(this.getInfo().version, 10);
        if (Array.isArray(versions)) {
            if (!versions.length) {
                return false;
            }
            for (var i = 0; i < versions.length; i++) {
                var versionNumber = this.getVersionNumber(versions[i]);
                if (i == versions.length - 1) {
                    // It's the last version, check only if site version is greater than this one.
                    return siteVersion >= versionNumber;
                }
                else {
                    // Check if site version if bigger than this number but lesser than next major.
                    if (siteVersion >= versionNumber && siteVersion < this.getNextMajorVersionNumber(versions[i])) {
                        return true;
                    }
                }
            }
        }
        else if (typeof versions == 'string') {
            // Compare with this version.
            return siteVersion >= this.getVersionNumber(versions);
        }
        return false;
    };
    /**
     * Given a URL, convert it to a URL that will auto-login if supported.
     *
     * @param url The URL to convert.
     * @param showModal Whether to show a loading modal.
     * @return Promise resolved with the converted URL.
     */
    CoreSite.prototype.getAutoLoginUrl = function (url, showModal) {
        var _this = this;
        if (showModal === void 0) { showModal = true; }
        if (!this.privateToken || !this.wsAvailable('tool_mobile_get_autologin_key') ||
            (this.lastAutoLogin && this.timeUtils.timestamp() - this.lastAutoLogin < CoreConstants.SECONDS_MINUTE * 6)) {
            // No private token, WS not available or last auto-login was less than 6 minutes ago. Don't change the URL.
            return Promise.resolve(url);
        }
        var userId = this.getUserId(), params = {
            privatetoken: this.privateToken
        };
        var modal;
        if (showModal) {
            modal = this.domUtils.showModalLoading();
        }
        // Use write to not use cache.
        return this.write('tool_mobile_get_autologin_key', params).then(function (data) {
            if (!data.autologinurl || !data.key) {
                // Not valid data, return the same URL.
                return url;
            }
            _this.lastAutoLogin = _this.timeUtils.timestamp();
            return data.autologinurl + '?userid=' + userId + '&key=' + data.key + '&urltogo=' + encodeURIComponent(url);
        }).catch(function () {
            // Couldn't get autologin key, return the same URL.
            return url;
        }).finally(function () {
            modal && modal.dismiss();
        });
    };
    /**
     * Get a version number from a release version.
     * If release version is valid but not found in the list of Moodle releases, it will use the last released major version.
     *
     * @param version Release version to convert to version number.
     * @return Version number, 0 if invalid.
     */
    CoreSite.prototype.getVersionNumber = function (version) {
        var data = this.getMajorAndMinor(version);
        if (!data) {
            // Invalid version.
            return 0;
        }
        if (typeof this.MOODLE_RELEASES[data.major] == 'undefined') {
            // Major version not found. Use the last one.
            data.major = Object.keys(this.MOODLE_RELEASES).slice(-1);
        }
        return this.MOODLE_RELEASES[data.major] + data.minor;
    };
    /**
     * Given a release version, return the major and minor versions.
     *
     * @param version Release version (e.g. '3.1.0').
     * @return Object with major and minor. Returns false if invalid version.
     */
    CoreSite.prototype.getMajorAndMinor = function (version) {
        var match = version.match(/(\d)+(?:\.(\d)+)?(?:\.(\d)+)?/);
        if (!match || !match[1]) {
            // Invalid version.
            return false;
        }
        return {
            major: match[1] + '.' + (match[2] || '0'),
            minor: parseInt(match[3], 10) || 0
        };
    };
    /**
     * Given a release version, return the next major version number.
     *
     * @param version Release version (e.g. '3.1.0').
     * @return Next major version number.
     */
    CoreSite.prototype.getNextMajorVersionNumber = function (version) {
        var data = this.getMajorAndMinor(version), releases = Object.keys(this.MOODLE_RELEASES);
        var position;
        if (!data) {
            // Invalid version.
            return 0;
        }
        position = releases.indexOf(data.major);
        if (position == -1 || position == releases.length - 1) {
            // Major version not found or it's the last one. Use the last one.
            return this.MOODLE_RELEASES[releases[position]];
        }
        return this.MOODLE_RELEASES[releases[position + 1]];
    };
    /**
     * Deletes a site setting.
     *
     * @param name The config name.
     * @return Promise resolved when done.
     */
    CoreSite.prototype.deleteSiteConfig = function (name) {
        return this.db.deleteRecords(CoreSite.CONFIG_TABLE, { name: name });
    };
    /**
     * Get a site setting on local device.
     *
     * @param name The config name.
     * @param defaultValue Default value to use if the entry is not found.
     * @return Resolves upon success along with the config data. Reject on failure.
     */
    CoreSite.prototype.getLocalSiteConfig = function (name, defaultValue) {
        return this.db.getRecord(CoreSite.CONFIG_TABLE, { name: name }).then(function (entry) {
            return entry.value;
        }).catch(function (error) {
            if (typeof defaultValue != 'undefined') {
                return defaultValue;
            }
            return Promise.reject(error);
        });
    };
    /**
     * Set a site setting on local device.
     *
     * @param name The config name.
     * @param value The config value. Can only store number or strings.
     * @return Promise resolved when done.
     */
    CoreSite.prototype.setLocalSiteConfig = function (name, value) {
        return this.db.insertRecord(CoreSite.CONFIG_TABLE, { name: name, value: value });
    };
    /**
     * Get a certain cache expiration delay.
     *
     * @param updateFrequency The update frequency of the entry.
     * @return Expiration delay.
     */
    CoreSite.prototype.getExpirationDelay = function (updateFrequency) {
        var expirationDelay = this.UPDATE_FREQUENCIES[updateFrequency] || this.UPDATE_FREQUENCIES[CoreSite.FREQUENCY_USUALLY];
        if (this.appProvider.isNetworkAccessLimited()) {
            // Not WiFi, increase the expiration delay a 50% to decrease the data usage in this case.
            expirationDelay *= 1.5;
        }
        return expirationDelay;
    };
    /*
     * Check if tokenpluginfile script works in the site.
     *
     * @param url URL to check.
     * @return Promise resolved with boolean: whether it works or not.
     */
    CoreSite.prototype.checkTokenPluginFile = function (url) {
        var _this = this;
        if (!this.urlUtils.canUseTokenPluginFile(url, this.siteUrl, this.infos && this.infos.userprivateaccesskey)) {
            // Cannot use tokenpluginfile.
            return Promise.resolve(false);
        }
        else if (typeof this.tokenPluginFileWorks != 'undefined') {
            // Already checked.
            return Promise.resolve(this.tokenPluginFileWorks);
        }
        else if (this.tokenPluginFileWorksPromise) {
            // Check ongoing, use the same promise.
            return this.tokenPluginFileWorksPromise;
        }
        else if (!this.appProvider.isOnline()) {
            // Not online, cannot check it. Assume it's working, but don't save the result.
            return Promise.resolve(true);
        }
        url = this.fixPluginfileURL(url);
        this.tokenPluginFileWorksPromise = this.wsProvider.performHead(url).then(function (result) {
            return result.status >= 200 && result.status < 300;
        }).catch(function (error) {
            // Error performing head request.
            return false;
        }).then(function (result) {
            _this.tokenPluginFileWorks = result;
            return result;
        });
        return this.tokenPluginFileWorksPromise;
    };
    CoreSite.REQUEST_QUEUE_DELAY = 50; // Maximum number of miliseconds to wait before processing the queue.
    CoreSite.REQUEST_QUEUE_LIMIT = 10; // Maximum number of requests allowed in the queue.
    CoreSite.REQUEST_QUEUE_FORCE_WS = false; // Use "tool_mobile_call_external_functions" even for calling a single function.
    // Constants for cache update frequency.
    CoreSite.FREQUENCY_USUALLY = 0;
    CoreSite.FREQUENCY_OFTEN = 1;
    CoreSite.FREQUENCY_SOMETIMES = 2;
    CoreSite.FREQUENCY_RARELY = 3;
    // Variables for the database.
    CoreSite.WS_CACHE_TABLE = 'wscache_2';
    CoreSite.CONFIG_TABLE = 'core_site_config';
    CoreSite.MINIMUM_MOODLE_VERSION = '3.1';
    return CoreSite;
}());
export { CoreSite };
//# sourceMappingURL=site.js.map