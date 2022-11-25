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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { CoreApp } from '@providers/app';
import { CoreFilepoolProvider } from '@providers/filepool';
import { CoreLangProvider } from '@providers/lang';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSite } from '@classes/site';
import { CoreSitesProvider } from '@providers/sites';
import { CoreTextUtilsProvider } from '@providers/utils/text';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CoreConfigConstants } from '../../../configconstants';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { CoreEventsProvider } from '@providers/events';
/**
 * Service to provide functionalities regarding site plugins.
 */
var CoreSitePluginsProvider = /** @class */ (function () {
    function CoreSitePluginsProvider(logger, sitesProvider, utils, langProvider, filepoolProvider, coursesProvider, textUtils, eventsProvider) {
        var _this = this;
        this.sitesProvider = sitesProvider;
        this.utils = utils;
        this.langProvider = langProvider;
        this.filepoolProvider = filepoolProvider;
        this.coursesProvider = coursesProvider;
        this.textUtils = textUtils;
        this.eventsProvider = eventsProvider;
        this.ROOT_CACHE_KEY = 'CoreSitePlugins:';
        this.sitePlugins = {}; // Site plugins registered.
        this.sitePluginPromises = {}; // Promises of loading plugins.
        this.hasSitePluginsLoaded = false;
        this.sitePluginsFinishedLoading = false;
        this.logger = logger.getInstance('CoreUserProvider');
        var observer = this.eventsProvider.on(CoreEventsProvider.SITE_PLUGINS_LOADED, function () {
            _this.sitePluginsFinishedLoading = true;
            observer && observer.off();
        });
        // Initialize deferred at start and on logout.
        this.fetchPluginsDeferred = this.utils.promiseDefer();
        eventsProvider.on(CoreEventsProvider.LOGOUT, function () {
            _this.fetchPluginsDeferred = _this.utils.promiseDefer();
        });
    }
    /**
     * Add some params that will always be sent for get content.
     *
     * @param args Original params.
     * @param site Site. If not defined, current site.
     * @return Promise resolved with the new params.
     */
    CoreSitePluginsProvider.prototype.addDefaultArgs = function (args, site) {
        var _this = this;
        args = args || {};
        site = site || this.sitesProvider.getCurrentSite();
        return this.langProvider.getCurrentLanguage().then(function (lang) {
            // Clone the object so the original one isn't modified.
            var argsToSend = _this.utils.clone(args);
            argsToSend.userid = args.userid || site.getUserId();
            argsToSend.appid = CoreConfigConstants.app_id;
            argsToSend.appversioncode = CoreConfigConstants.versioncode;
            argsToSend.appversionname = CoreConfigConstants.versionname;
            argsToSend.applang = lang;
            argsToSend.appcustomurlscheme = CoreConfigConstants.customurlscheme;
            argsToSend.appisdesktop = CoreApp.instance.isDesktop();
            argsToSend.appismobile = CoreApp.instance.isMobile();
            argsToSend.appiswide = CoreApp.instance.isWide();
            if (argsToSend.appisdevice) {
                if (CoreApp.instance.isIOS()) {
                    argsToSend.appplatform = 'ios';
                }
                else {
                    argsToSend.appplatform = 'android';
                }
            }
            else if (argsToSend.appisdesktop) {
                if (CoreApp.instance.isMac()) {
                    argsToSend.appplatform = 'mac';
                }
                else if (CoreApp.instance.isLinux()) {
                    argsToSend.appplatform = 'linux';
                }
                else {
                    argsToSend.appplatform = 'windows';
                }
            }
            else {
                argsToSend.appplatform = 'browser';
            }
            return argsToSend;
        });
    };
    /**
     * Call a WS for a site plugin.
     *
     * @param method WS method to use.
     * @param data Data to send to the WS.
     * @param preSets Extra options.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the response.
     */
    CoreSitePluginsProvider.prototype.callWS = function (method, data, preSets, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            preSets = preSets || {};
            preSets.cacheKey = preSets.cacheKey || _this.getCallWSCacheKey(method, data);
            return site.read(method, data, preSets);
        });
    };
    /**
     * Given the result of a init get_content and, optionally, the result of another get_content,
     * build an object with the data to pass to the JS of the get_content.
     *
     * @param initResult Result of the init WS call.
     * @param contentResult Result of the content WS call (if any).
     * @return An object with the data to pass to the JS.
     */
    CoreSitePluginsProvider.prototype.createDataForJS = function (initResult, contentResult) {
        var data;
        if (initResult) {
            // First of all, add the data returned by the init JS (if any).
            data = Object.assign({}, initResult.jsResult || {});
            if (typeof data == 'boolean') {
                data = {};
            }
            // Now add some data returned by the init WS call.
            data.INIT_TEMPLATES = this.utils.objectToKeyValueMap(initResult.templates, 'id', 'html');
            data.INIT_OTHERDATA = initResult.otherdata;
        }
        if (contentResult) {
            // Now add the data returned by the content WS call.
            data.CONTENT_TEMPLATES = this.utils.objectToKeyValueMap(contentResult.templates, 'id', 'html');
            data.CONTENT_OTHERDATA = contentResult.otherdata;
        }
        return data;
    };
    /**
     * Get cache key for a WS call.
     *
     * @param method Name of the method.
     * @param data Data to identify the WS call.
     * @return Cache key.
     */
    CoreSitePluginsProvider.prototype.getCallWSCacheKey = function (method, data) {
        return this.getCallWSCommonCacheKey(method) + ':' + this.utils.sortAndStringify(data);
    };
    /**
     * Get common cache key for a WS call.
     *
     * @param method Name of the method.
     * @return Cache key.
     */
    CoreSitePluginsProvider.prototype.getCallWSCommonCacheKey = function (method) {
        return this.ROOT_CACHE_KEY + 'ws:' + method;
    };
    /**
     * Get a certain content for a site plugin.
     *
     * @param component Component where the class is. E.g. mod_assign.
     * @param method Method to execute in the class.
     * @param args The params for the method.
     * @param preSets Extra options.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the result.
     */
    CoreSitePluginsProvider.prototype.getContent = function (component, method, args, preSets, siteId) {
        var _this = this;
        this.logger.debug("Get content for component '" + component + "' and method '" + method + "'");
        return this.sitesProvider.getSite(siteId).then(function (site) {
            // Add some params that will always be sent.
            return _this.addDefaultArgs(args, site).then(function (argsToSend) {
                // Now call the WS.
                var data = {
                    component: component,
                    method: method,
                    args: _this.utils.objectToArrayOfObjects(argsToSend, 'name', 'value', true)
                };
                preSets = preSets || {};
                preSets.cacheKey = _this.getContentCacheKey(component, method, args);
                preSets.updateFrequency = typeof preSets.updateFrequency != 'undefined' ? preSets.updateFrequency :
                    CoreSite.FREQUENCY_OFTEN;
                return _this.sitesProvider.getCurrentSite().read('tool_mobile_get_content', data, preSets);
            }).then(function (result) {
                if (result.otherdata) {
                    result.otherdata = _this.utils.objectToKeyValueMap(result.otherdata, 'name', 'value');
                    // Try to parse all properties that could be JSON encoded strings.
                    for (var name_1 in result.otherdata) {
                        var value = result.otherdata[name_1];
                        if (typeof value == 'string' && (value[0] == '{' || value[0] == '[')) {
                            result.otherdata[name_1] = _this.textUtils.parseJSON(value);
                        }
                    }
                }
                else {
                    result.otherdata = {};
                }
                return result;
            });
        });
    };
    /**
     * Get cache key for get content WS calls.
     *
     * @param component Component where the class is. E.g. mod_assign.
     * @param method Method to execute in the class.
     * @param args The params for the method.
     * @return Cache key.
     */
    CoreSitePluginsProvider.prototype.getContentCacheKey = function (component, method, args) {
        return this.ROOT_CACHE_KEY + 'content:' + component + ':' + method + ':' + this.utils.sortAndStringify(args);
    };
    /**
     * Get the value of a WS param for prefetch.
     *
     * @param component The component of the handler.
     * @param paramName Name of the param as defined by the handler.
     * @param courseId Course ID (if prefetching a course).
     * @param module The module object returned by WS (if prefetching a module).
     * @return The value.
     */
    CoreSitePluginsProvider.prototype.getDownloadParam = function (component, paramName, courseId, module) {
        switch (paramName) {
            case 'courseids':
                // The WS needs the list of course IDs. Create the list.
                return [courseId];
            case component + 'id':
                // The WS needs the instance id.
                return module && module.instance;
            default:
        }
    };
    /**
     * Get the unique name of a handler (plugin + handler).
     *
     * @param plugin Data of the plugin.
     * @param handlerName Name of the handler inside the plugin.
     * @return Unique name.
     */
    CoreSitePluginsProvider.prototype.getHandlerUniqueName = function (plugin, handlerName) {
        return plugin.addon + '_' + handlerName;
    };
    /**
     * Get a site plugin handler.
     *
     * @param name Unique name of the handler.
     * @return Handler.
     */
    CoreSitePluginsProvider.prototype.getSitePluginHandler = function (name) {
        return this.sitePlugins[name];
    };
    /**
     * Invalidate all WS call to a certain method.
     *
     * @param method WS method to use.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreSitePluginsProvider.prototype.invalidateAllCallWSForMethod = function (method, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKeyStartingWith(_this.getCallWSCommonCacheKey(method));
        });
    };
    /**
     * Invalidate a WS call.
     *
     * @param method WS method to use.
     * @param data Data to send to the WS.
     * @param preSets Extra options.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreSitePluginsProvider.prototype.invalidateCallWS = function (method, data, preSets, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            preSets = preSets || {};
            return site.invalidateWsCacheForKey(preSets.cacheKey || _this.getCallWSCacheKey(method, data));
        });
    };
    /**
     * Invalidate a page content.
     *
     * @param component Component where the class is. E.g. mod_assign.
     * @param method Method to execute in the class.
     * @param args The params for the method.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreSitePluginsProvider.prototype.invalidateContent = function (component, callback, args, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getContentCacheKey(component, callback, args));
        });
    };
    /**
     * Check if the get content WS is available.
     *
     * @param site The site to check. If not defined, current site.
     */
    CoreSitePluginsProvider.prototype.isGetContentAvailable = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.wsAvailable('tool_mobile_get_content');
    };
    /**
     * Check if a handler is enabled for a certain course.
     *
     * @param courseId Course ID to check.
     * @param restrictEnrolled If true or undefined, handler is only enabled for courses the user is enrolled in.
     * @param restrict Users and courses the handler is restricted to.
     * @return Whether the handler is enabled.
     */
    CoreSitePluginsProvider.prototype.isHandlerEnabledForCourse = function (courseId, restrictEnrolled, restrict) {
        if (restrict && restrict.courses && restrict.courses.indexOf(courseId) == -1) {
            // Course is not in the list of restricted courses.
            return false;
        }
        if (restrictEnrolled || typeof restrictEnrolled == 'undefined') {
            // Only enabled for courses the user is enrolled to. Check if the user is enrolled in the course.
            return this.coursesProvider.getUserCourse(courseId, true).then(function () {
                return true;
            }).catch(function () {
                return false;
            });
        }
        return true;
    };
    /**
     * Check if a handler is enabled for a certain user.
     *
     * @param userId User ID to check.
     * @param restrictCurrent Whether handler is only enabled for current user.
     * @param restrict Users and courses the handler is restricted to.
     * @return Whether the handler is enabled.
     */
    CoreSitePluginsProvider.prototype.isHandlerEnabledForUser = function (userId, restrictCurrent, restrict) {
        if (restrictCurrent && userId != this.sitesProvider.getCurrentSite().getUserId()) {
            // Only enabled for current user.
            return false;
        }
        if (restrict && restrict.users && restrict.users.indexOf(userId) == -1) {
            // User is not in the list of restricted users.
            return false;
        }
        return true;
    };
    /**
     * Load other data into args as determined by useOtherData list.
     * If useOtherData is undefined, it won't add any data.
     * If useOtherData is an array, it will only copy the properties whose names are in the array.
     * If useOtherData is any other value, it will copy all the data from otherData to args.
     *
     * @param args The current args.
     * @param otherData All the other data.
     * @param useOtherData Names of the attributes to include.
     * @return New args.
     */
    CoreSitePluginsProvider.prototype.loadOtherDataInArgs = function (args, otherData, useOtherData) {
        if (!args) {
            args = {};
        }
        else {
            args = this.utils.clone(args);
        }
        otherData = otherData || {};
        if (typeof useOtherData == 'undefined') {
            // No need to add other data, return args as they are.
            return args;
        }
        else if (Array.isArray(useOtherData)) {
            // Include only the properties specified in the array.
            for (var i in useOtherData) {
                var name_2 = useOtherData[i];
                if (typeof otherData[name_2] == 'object' && otherData[name_2] !== null) {
                    // Stringify objects.
                    args[name_2] = JSON.stringify(otherData[name_2]);
                }
                else {
                    args[name_2] = otherData[name_2];
                }
            }
        }
        else {
            // Add all the data to args.
            for (var name_3 in otherData) {
                if (typeof otherData[name_3] == 'object' && otherData[name_3] !== null) {
                    // Stringify objects.
                    args[name_3] = JSON.stringify(otherData[name_3]);
                }
                else {
                    args[name_3] = otherData[name_3];
                }
            }
        }
        return args;
    };
    /**
     * Prefetch offline functions for a site plugin handler.
     *
     * @param component The component of the handler.
     * @param args Params to send to the get_content calls.
     * @param handlerSchema The handler schema.
     * @param courseId Course ID (if prefetching a course).
     * @param module The module object returned by WS (if prefetching a module).
     * @param prefetch True to prefetch, false to download right away.
     * @param dirPath Path of the directory where to store all the content files.
     * @param site Site. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreSitePluginsProvider.prototype.prefetchFunctions = function (component, args, handlerSchema, courseId, module, prefetch, dirPath, site) {
        var _this = this;
        site = site || this.sitesProvider.getCurrentSite();
        var promises = [];
        for (var method in handlerSchema.offlinefunctions) {
            if (site.wsAvailable(method)) {
                // The method is a WS.
                var paramsList = handlerSchema.offlinefunctions[method], cacheKey = this.getCallWSCacheKey(method, args);
                var params = {};
                if (!paramsList.length) {
                    // No params defined, send the default ones.
                    params = args;
                }
                else {
                    for (var i in paramsList) {
                        var paramName = paramsList[i];
                        if (typeof args[paramName] != 'undefined') {
                            params[paramName] = args[paramName];
                        }
                        else {
                            // The param is not one of the default ones. Try to calculate the param to use.
                            var value = this.getDownloadParam(component, paramName, courseId, module);
                            if (typeof value != 'undefined') {
                                params[paramName] = value;
                            }
                        }
                    }
                }
                promises.push(this.callWS(method, params, { cacheKey: cacheKey }));
            }
            else {
                // It's a method to get content.
                var preSets = {
                    component: component,
                    componentId: undefined
                };
                if (module) {
                    preSets.componentId = module.id;
                }
                promises.push(this.getContent(component, method, args, preSets).then(function (result) {
                    var subPromises = [];
                    // Prefetch the files in the content.
                    if (result.files && result.files.length) {
                        subPromises.push(_this.filepoolProvider.downloadOrPrefetchFiles(site.id, result.files, prefetch, false, component, module.id, dirPath));
                    }
                    return Promise.all(subPromises);
                }));
            }
        }
        return Promise.all(promises);
    };
    /**
     * Store a site plugin handler.
     *
     * @param name A unique name to identify the handler.
     * @param handler Handler to set.
     */
    CoreSitePluginsProvider.prototype.setSitePluginHandler = function (name, handler) {
        this.sitePlugins[name] = handler;
    };
    /**
     * Store the promise for a plugin that is being initialised.
     *
     * @param component
     * @param promise
     */
    CoreSitePluginsProvider.prototype.registerSitePluginPromise = function (component, promise) {
        this.sitePluginPromises[component] = promise;
    };
    /**
     * Set plugins fetched.
     */
    CoreSitePluginsProvider.prototype.setPluginsFetched = function () {
        this.fetchPluginsDeferred.resolve();
    };
    /**
     * Is a plugin being initialised for the specified component?
     *
     * @param component
     */
    CoreSitePluginsProvider.prototype.sitePluginPromiseExists = function (component) {
        return this.sitePluginPromises.hasOwnProperty(component);
    };
    /**
     * Get the promise for a plugin that is being initialised.
     *
     * @param component
     */
    CoreSitePluginsProvider.prototype.sitePluginLoaded = function (component) {
        return this.sitePluginPromises[component];
    };
    /**
     * Wait for fetch plugins to be done.
     *
     * @return Promise resolved when site plugins have been fetched.
     */
    CoreSitePluginsProvider.prototype.waitFetchPlugins = function () {
        return this.fetchPluginsDeferred.promise;
    };
    CoreSitePluginsProvider.COMPONENT = 'CoreSitePlugins';
    CoreSitePluginsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            CoreSitesProvider,
            CoreUtilsProvider,
            CoreLangProvider,
            CoreFilepoolProvider,
            CoreCoursesProvider,
            CoreTextUtilsProvider,
            CoreEventsProvider])
    ], CoreSitePluginsProvider);
    return CoreSitePluginsProvider;
}());
export { CoreSitePluginsProvider };
//# sourceMappingURL=siteplugins.js.map