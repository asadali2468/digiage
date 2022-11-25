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
import { CoreAppProvider } from '@providers/app';
import { CoreEventsProvider } from '@providers/events';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreTimeUtilsProvider } from '@providers/utils/time';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CoreSite } from '@classes/site';
import { CoreConstants } from '../../constants';
import { CoreCourseOfflineProvider } from './course-offline';
import { CoreSitePluginsProvider } from '@core/siteplugins/providers/siteplugins';
import { CoreCourseFormatDelegate } from './format-delegate';
import { CorePushNotificationsProvider } from '@core/pushnotifications/providers/pushnotifications';
import { CoreCoursesProvider, CoreCourses } from '@core/courses/providers/courses';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Service that provides some features regarding a course.
 */
var CoreCourseProvider = /** @class */ (function () {
    function CoreCourseProvider(logger, sitesProvider, eventsProvider, utils, timeUtils, translate, courseOffline, appProvider, courseFormatDelegate, sitePluginsProvider, domUtils, pushNotificationsProvider) {
        this.sitesProvider = sitesProvider;
        this.eventsProvider = eventsProvider;
        this.utils = utils;
        this.timeUtils = timeUtils;
        this.translate = translate;
        this.courseOffline = courseOffline;
        this.appProvider = appProvider;
        this.courseFormatDelegate = courseFormatDelegate;
        this.sitePluginsProvider = sitePluginsProvider;
        this.domUtils = domUtils;
        this.pushNotificationsProvider = pushNotificationsProvider;
        this.ROOT_CACHE_KEY = 'mmCourse:';
        // Variables for database.
        this.COURSE_STATUS_TABLE = 'course_status';
        this.siteSchema = {
            name: 'CoreCourseProvider',
            version: 1,
            tables: [
                {
                    name: this.COURSE_STATUS_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'INTEGER',
                            primaryKey: true
                        },
                        {
                            name: 'status',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'previous',
                            type: 'TEXT'
                        },
                        {
                            name: 'updated',
                            type: 'INTEGER'
                        },
                        {
                            name: 'downloadTime',
                            type: 'INTEGER'
                        },
                        {
                            name: 'previousDownloadTime',
                            type: 'INTEGER'
                        }
                    ]
                }
            ]
        };
        this.CORE_MODULES = [
            'assign', 'assignment', 'book', 'chat', 'choice', 'data', 'database', 'date', 'external-tool',
            'feedback', 'file', 'folder', 'forum', 'glossary', 'ims', 'imscp', 'label', 'lesson', 'lti', 'page', 'quiz',
            'resource', 'scorm', 'survey', 'url', 'wiki', 'workshop', 'h5pactivity'
        ];
        this.logger = logger.getInstance('CoreCourseProvider');
        this.sitesProvider.registerSiteSchema(this.siteSchema);
    }
    CoreCourseProvider_1 = CoreCourseProvider;
    /**
     * Check if the get course blocks WS is available in current site.
     *
     * @param site Site to check. If not defined, current site.
     * @return Whether it's available.
     * @since 3.7
     */
    CoreCourseProvider.prototype.canGetCourseBlocks = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site && site.isVersionGreaterEqualThan('3.7') && site.wsAvailable('core_block_get_course_blocks');
    };
    /**
     * Check whether the site supports requesting stealth modules.
     *
     * @param site Site. If not defined, current site.
     * @return Whether the site supports requesting stealth modules.
     * @since 3.4.6, 3.5.3, 3.6
     */
    CoreCourseProvider.prototype.canRequestStealthModules = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site && site.isVersionGreaterEqualThan(['3.4.6', '3.5.3']);
    };
    /**
     * Check if module completion could have changed. If it could have, trigger event. This function must be used,
     * for example, after calling a "module_view" WS since it can change the module completion.
     *
     * @param courseId Course ID.
     * @param completion Completion status of the module.
     */
    CoreCourseProvider.prototype.checkModuleCompletion = function (courseId, completion) {
        var _this = this;
        if (completion && completion.tracking === 2 && completion.state === 0) {
            this.invalidateSections(courseId).finally(function () {
                _this.eventsProvider.trigger(CoreEventsProvider.COMPLETION_MODULE_VIEWED, { courseId: courseId });
            });
        }
    };
    /**
     * Clear all courses status in a site.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when all status are cleared.
     */
    CoreCourseProvider.prototype.clearAllCoursesStatus = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            _this.logger.debug('Clear all course status for site ' + site.id);
            return site.getDb().deleteRecords(_this.COURSE_STATUS_TABLE).then(function () {
                _this.triggerCourseStatusChanged(CoreCourseProvider_1.ALL_COURSES_CLEARED, CoreConstants.NOT_DOWNLOADED, site.id);
            });
        });
    };
    /**
     * Check if the current view in a NavController is a certain course initial page.
     *
     * @param navCtrl NavController.
     * @param courseId Course ID.
     * @return Whether the current view is a certain course.
     */
    CoreCourseProvider.prototype.currentViewIsCourse = function (navCtrl, courseId) {
        if (navCtrl) {
            var view = navCtrl.getActive();
            return view && view.id == 'CoreCourseSectionPage' && view.data && view.data.course && view.data.course.id == courseId;
        }
        return false;
    };
    /**
     * Get completion status of all the activities in a course for a certain user.
     *
     * @param courseId Course ID.
     * @param siteId Site ID. If not defined, current site.
     * @param userId User ID. If not defined, current user.
     * @param forceCache True if it should return cached data. Has priority over ignoreCache.
     * @param ignoreCache True if it should ignore cached data (it will always fail in offline or server down).
     * @param includeOffline True if it should load offline data in the completion status.
     * @return Promise resolved with the completion statuses: object where the key is module ID.
     */
    CoreCourseProvider.prototype.getActivitiesCompletionStatus = function (courseId, siteId, userId, forceCache, ignoreCache, includeOffline) {
        var _this = this;
        if (forceCache === void 0) { forceCache = false; }
        if (ignoreCache === void 0) { ignoreCache = false; }
        if (includeOffline === void 0) { includeOffline = true; }
        return this.sitesProvider.getSite(siteId).then(function (site) {
            userId = userId || site.getUserId();
            _this.logger.debug("Getting completion status for user " + userId + " in course " + courseId);
            var params = {
                courseid: courseId,
                userid: userId
            }, preSets = {
                cacheKey: _this.getActivitiesCompletionCacheKey(courseId, userId)
            };
            if (forceCache) {
                preSets.omitExpires = true;
            }
            else if (ignoreCache) {
                preSets.getFromCache = false;
                preSets.emergencyCache = false;
            }
            return site.read('core_completion_get_activities_completion_status', params, preSets).then(function (data) {
                if (data && data.statuses) {
                    return _this.utils.arrayToObject(data.statuses, 'cmid');
                }
                return Promise.reject(null);
            }).then(function (completionStatus) {
                if (!includeOffline) {
                    return completionStatus;
                }
                // Now get the offline completion (if any).
                return _this.courseOffline.getCourseManualCompletions(courseId, site.id).then(function (offlineCompletions) {
                    offlineCompletions.forEach(function (offlineCompletion) {
                        if (offlineCompletion && typeof completionStatus[offlineCompletion.cmid] != 'undefined') {
                            var onlineCompletion = completionStatus[offlineCompletion.cmid];
                            // If the activity uses manual completion, override the value with the offline one.
                            if (onlineCompletion.tracking === 1) {
                                onlineCompletion.state = offlineCompletion.completed;
                                onlineCompletion.offline = true;
                            }
                        }
                    });
                    return completionStatus;
                }).catch(function () {
                    // Ignore errors.
                    return completionStatus;
                });
            });
        });
    };
    /**
     * Get cache key for activities completion WS calls.
     *
     * @param courseId Course ID.
     * @param userId User ID.
     * @return Cache key.
     */
    CoreCourseProvider.prototype.getActivitiesCompletionCacheKey = function (courseId, userId) {
        return this.ROOT_CACHE_KEY + 'activitiescompletion:' + courseId + ':' + userId;
    };
    /**
     * Get course blocks.
     *
     * @param courseId Course ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the list of blocks.
     * @since 3.7
     */
    CoreCourseProvider.prototype.getCourseBlocks = function (courseId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                courseid: courseId,
                returncontents: 1
            }, preSets = {
                cacheKey: _this.getCourseBlocksCacheKey(courseId),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            return site.read('core_block_get_course_blocks', params, preSets).then(function (result) {
                return result.blocks || [];
            });
        });
    };
    /**
     * Get cache key for course blocks WS calls.
     *
     * @param courseId Course ID.
     * @return Cache key.
     */
    CoreCourseProvider.prototype.getCourseBlocksCacheKey = function (courseId) {
        return this.ROOT_CACHE_KEY + 'courseblocks:' + courseId;
    };
    /**
     * Get the data stored for a course.
     *
     * @param courseId Course ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the data.
     */
    CoreCourseProvider.prototype.getCourseStatusData = function (courseId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.getDb().getRecord(_this.COURSE_STATUS_TABLE, { id: courseId }).then(function (entry) {
                if (!entry) {
                    return Promise.reject(null);
                }
                return entry;
            });
        });
    };
    /**
     * Get a course status.
     *
     * @param courseId Course ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the status.
     */
    CoreCourseProvider.prototype.getCourseStatus = function (courseId, siteId) {
        return this.getCourseStatusData(courseId, siteId).then(function (entry) {
            return entry.status || CoreConstants.NOT_DOWNLOADED;
        }).catch(function () {
            return CoreConstants.NOT_DOWNLOADED;
        });
    };
    /**
     * Obtain ids of downloaded courses.
     *
     * @param siteId Site id.
     * @return Resolves with an array containing downloaded course ids.
     */
    CoreCourseProvider.prototype.getDownloadedCourseIds = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site, entries;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sitesProvider.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        return [4 /*yield*/, site.getDb().getRecordsList(this.COURSE_STATUS_TABLE, 'status', [
                                CoreConstants.DOWNLOADED,
                                CoreConstants.DOWNLOADING,
                                CoreConstants.OUTDATED,
                            ])];
                    case 2:
                        entries = _a.sent();
                        return [2 /*return*/, entries.map(function (entry) { return entry.id; })];
                }
            });
        });
    };
    /**
     * Get a module from Moodle.
     *
     * @param moduleId The module ID.
     * @param courseId The course ID. Recommended to speed up the process and minimize data usage.
     * @param sectionId The section ID.
     * @param preferCache True if shouldn't call WS if data is cached, false otherwise.
     * @param ignoreCache True if it should ignore cached data (it will always fail in offline or server down).
     * @param siteId Site ID. If not defined, current site.
     * @param modName If set, the app will retrieve all modules of this type with a single WS call. This reduces the
     *                number of WS calls, but it isn't recommended for modules that can return a lot of contents.
     * @return Promise resolved with the module.
     */
    CoreCourseProvider.prototype.getModule = function (moduleId, courseId, sectionId, preferCache, ignoreCache, siteId, modName) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        // Helper function to do the WS request without processing the result.
        var doRequest = function (site, moduleId, modName, includeStealth, preferCache) {
            var params = {
                courseid: courseId,
                options: []
            };
            var preSets = {
                omitExpires: preferCache,
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            if (includeStealth) {
                params.options.push({
                    name: 'includestealthmodules',
                    value: 1
                });
            }
            // If modName is set, retrieve all modules of that type. Otherwise get only the module.
            if (modName) {
                params.options.push({
                    name: 'modname',
                    value: modName
                });
                preSets.cacheKey = _this.getModuleByModNameCacheKey(modName);
            }
            else {
                params.options.push({
                    name: 'cmid',
                    value: moduleId
                });
                preSets.cacheKey = _this.getModuleCacheKey(moduleId);
            }
            if (!preferCache && ignoreCache) {
                preSets.getFromCache = false;
                preSets.emergencyCache = false;
            }
            return site.read('core_course_get_contents', params, preSets).catch(function () {
                // The module might still be cached by a request with different parameters.
                if (!ignoreCache && !_this.appProvider.isOnline()) {
                    if (includeStealth) {
                        // Older versions didn't include the includestealthmodules option.
                        return doRequest(site, moduleId, modName, false, true);
                    }
                    else if (modName) {
                        // Falback to the request for the given moduleId only.
                        return doRequest(site, moduleId, undefined, _this.canRequestStealthModules(site), true);
                    }
                }
                return Promise.reject(null);
            });
        };
        var promise;
        if (!courseId) {
            // No courseId passed, try to retrieve it.
            promise = this.getModuleBasicInfo(moduleId, siteId).then(function (module) {
                courseId = module.course;
            });
        }
        else {
            promise = Promise.resolve();
        }
        return promise.then(function () {
            return _this.sitesProvider.getSite(siteId);
        }).then(function (site) {
            // We have courseId, we can use core_course_get_contents for compatibility.
            _this.logger.debug("Getting module " + moduleId + " in course " + courseId);
            return doRequest(site, moduleId, modName, _this.canRequestStealthModules(site), preferCache);
        }).catch(function () {
            // Error getting the module. Try to get all contents (without filtering by module).
            var preSets = {
                omitExpires: preferCache
            };
            if (!preferCache && ignoreCache) {
                preSets.getFromCache = false;
                preSets.emergencyCache = false;
            }
            return _this.getSections(courseId, false, false, preSets, siteId);
        }).then(function (sections) {
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                if (sectionId != null && !isNaN(sectionId) && section.id != CoreCourseProvider_1.STEALTH_MODULES_SECTION_ID &&
                    sectionId != section.id) {
                    continue;
                }
                for (var j = 0; j < section.modules.length; j++) {
                    var module_1 = section.modules[j];
                    if (module_1.id == moduleId) {
                        module_1.course = courseId;
                        return module_1;
                    }
                }
            }
            return Promise.reject(null);
        });
    };
    /**
     * Gets a module basic info by module ID.
     *
     * @param moduleId Module ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the module's info.
     */
    CoreCourseProvider.prototype.getModuleBasicInfo = function (moduleId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                cmid: moduleId
            }, preSets = {
                cacheKey: _this.getModuleCacheKey(moduleId),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            return site.read('core_course_get_course_module', params, preSets).then(function (response) {
                if (response.warnings && response.warnings.length) {
                    return Promise.reject(response.warnings[0]);
                }
                else if (response.cm) {
                    return response.cm;
                }
                return Promise.reject(null);
            });
        });
    };
    /**
     * Gets a module basic grade info by module ID.
     *
     * If the user does not have permision to manage the activity false is returned.
     *
     * @param moduleId Module ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the module's grade info.
     */
    CoreCourseProvider.prototype.getModuleBasicGradeInfo = function (moduleId, siteId) {
        return this.getModuleBasicInfo(moduleId, siteId).then(function (info) {
            var grade = {
                advancedgrading: info.advancedgrading || false,
                grade: info.grade || false,
                gradecat: info.gradecat || false,
                gradepass: info.gradepass || false,
                outcomes: info.outcomes || false,
                scale: info.scale || false
            };
            if (grade.grade !== false || grade.advancedgrading !== false || grade.outcomes !== false) {
                return grade;
            }
            return false;
        });
    };
    /**
     * Gets a module basic info by instance.
     *
     * @param id Instance ID.
     * @param module Name of the module. E.g. 'glossary'.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the module's info.
     */
    CoreCourseProvider.prototype.getModuleBasicInfoByInstance = function (id, module, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                instance: id,
                module: module
            }, preSets = {
                cacheKey: _this.getModuleBasicInfoByInstanceCacheKey(id, module),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            return site.read('core_course_get_course_module_by_instance', params, preSets).then(function (response) {
                if (response.warnings && response.warnings.length) {
                    return Promise.reject(response.warnings[0]);
                }
                else if (response.cm) {
                    return response.cm;
                }
                return Promise.reject(null);
            });
        });
    };
    /**
     * Get cache key for get module by instance WS calls.
     *
     * @param id Instance ID.
     * @param module Name of the module. E.g. 'glossary'.
     * @return Cache key.
     */
    CoreCourseProvider.prototype.getModuleBasicInfoByInstanceCacheKey = function (id, module) {
        return this.ROOT_CACHE_KEY + 'moduleByInstance:' + module + ':' + id;
    };
    /**
     * Get cache key for module WS calls.
     *
     * @param moduleId Module ID.
     * @return Cache key.
     */
    CoreCourseProvider.prototype.getModuleCacheKey = function (moduleId) {
        return this.ROOT_CACHE_KEY + 'module:' + moduleId;
    };
    /**
     * Get cache key for module by modname WS calls.
     *
     * @param modName Name of the module.
     * @return Cache key.
     */
    CoreCourseProvider.prototype.getModuleByModNameCacheKey = function (modName) {
        return this.ROOT_CACHE_KEY + 'module:modName:' + modName;
    };
    /**
     * Returns the source to a module icon.
     *
     * @param moduleName The module name.
     * @param modicon The mod icon string to use in case we are not using a core activity.
     * @return The IMG src.
     */
    CoreCourseProvider.prototype.getModuleIconSrc = function (moduleName, modicon) {
        // @TODO: Check modicon url theme to apply other theme icons.
        // Use default icon on core themes.
        if (this.CORE_MODULES.indexOf(moduleName) < 0) {
            if (modicon) {
                return modicon;
            }
            moduleName = 'external-tool';
        }
        return 'assets/img/mod/' + moduleName + '.svg';
    };
    /**
     * Get the section ID a module belongs to.
     *
     * @param moduleId The module ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the section ID.
     */
    CoreCourseProvider.prototype.getModuleSectionId = function (moduleId, siteId) {
        // Try to get the section using getModuleBasicInfo.
        return this.getModuleBasicInfo(moduleId, siteId).then(function (module) {
            return module.section;
        });
    };
    /**
     * Return a specific section.
     *
     * @param courseId The course ID.
     * @param sectionId The section ID.
     * @param excludeModules Do not return modules, return only the sections structure.
     * @param excludeContents Do not return module contents (i.e: files inside a resource).
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the section.
     */
    CoreCourseProvider.prototype.getSection = function (courseId, sectionId, excludeModules, excludeContents, siteId) {
        if (sectionId < 0) {
            return Promise.reject('Invalid section ID');
        }
        return this.getSections(courseId, excludeModules, excludeContents, undefined, siteId).then(function (sections) {
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].id == sectionId) {
                    return sections[i];
                }
            }
            return Promise.reject('Unkown section');
        });
    };
    /**
     * Get the course sections.
     *
     * @param courseId The course ID.
     * @param excludeModules Do not return modules, return only the sections structure.
     * @param excludeContents Do not return module contents (i.e: files inside a resource).
     * @param preSets Presets to use.
     * @param siteId Site ID. If not defined, current site.
     * @param includeStealthModules Whether to include stealth modules. Defaults to true.
     * @return The reject contains the error message, else contains the sections.
     */
    CoreCourseProvider.prototype.getSections = function (courseId, excludeModules, excludeContents, preSets, siteId, includeStealthModules) {
        var _this = this;
        if (includeStealthModules === void 0) { includeStealthModules = true; }
        return this.sitesProvider.getSite(siteId).then(function (site) {
            preSets = preSets || {};
            preSets.cacheKey = _this.getSectionsCacheKey(courseId);
            preSets.updateFrequency = preSets.updateFrequency || CoreSite.FREQUENCY_RARELY;
            var params = {
                courseid: courseId,
                options: [
                    {
                        name: 'excludemodules',
                        value: excludeModules ? 1 : 0
                    },
                    {
                        name: 'excludecontents',
                        value: excludeContents ? 1 : 0
                    }
                ]
            };
            if (_this.canRequestStealthModules(site)) {
                params.options.push({
                    name: 'includestealthmodules',
                    value: includeStealthModules ? 1 : 0
                });
            }
            return site.read('core_course_get_contents', params, preSets).catch(function () {
                // Error getting the data, it could fail because we added a new parameter and the call isn't cached.
                // Retry without the new parameter and forcing cache.
                preSets.omitExpires = true;
                params.options.splice(-1, 1);
                return site.read('core_course_get_contents', params, preSets);
            }).then(function (sections) {
                var siteHomeId = site.getSiteHomeId();
                var showSections = true;
                if (courseId == siteHomeId) {
                    showSections = site.getStoredConfig('numsections');
                }
                if (typeof showSections != 'undefined' && !showSections && sections.length > 0) {
                    // Get only the last section (Main menu block section).
                    sections.pop();
                }
                return sections;
            });
        });
    };
    /**
     * Get cache key for section WS call.
     *
     * @param courseId Course ID.
     * @return Cache key.
     */
    CoreCourseProvider.prototype.getSectionsCacheKey = function (courseId) {
        return this.ROOT_CACHE_KEY + 'sections:' + courseId;
    };
    /**
     * Given a list of sections, returns the list of modules in the sections.
     *
     * @param sections Sections.
     * @return Modules.
     */
    CoreCourseProvider.prototype.getSectionsModules = function (sections) {
        if (!sections || !sections.length) {
            return [];
        }
        var modules = [];
        sections.forEach(function (section) {
            if (section.modules) {
                modules = modules.concat(section.modules);
            }
        });
        return modules;
    };
    /**
     * Invalidates course blocks WS call.
     *
     * @param courseId Course ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCourseProvider.prototype.invalidateCourseBlocks = function (courseId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getCourseBlocksCacheKey(courseId));
        });
    };
    /**
     * Invalidates module WS call.
     *
     * @param moduleId Module ID.
     * @param siteId Site ID. If not defined, current site.
     * @param modName Module name. E.g. 'label', 'url', ...
     * @return Promise resolved when the data is invalidated.
     */
    CoreCourseProvider.prototype.invalidateModule = function (moduleId, siteId, modName) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var promises = [];
            if (modName) {
                promises.push(site.invalidateWsCacheForKey(_this.getModuleByModNameCacheKey(modName)));
            }
            promises.push(site.invalidateWsCacheForKey(_this.getModuleCacheKey(moduleId)));
            return Promise.all(promises);
        });
    };
    /**
     * Invalidates module WS call.
     *
     * @param id Instance ID.
     * @param module Name of the module. E.g. 'glossary'.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCourseProvider.prototype.invalidateModuleByInstance = function (id, module, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getModuleBasicInfoByInstanceCacheKey(id, module));
        });
    };
    /**
     * Invalidates sections WS call.
     *
     * @param courseId Course ID.
     * @param siteId Site ID. If not defined, current site.
     * @param userId User ID. If not defined, current user.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCourseProvider.prototype.invalidateSections = function (courseId, siteId, userId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var promises = [], siteHomeId = site.getSiteHomeId();
            userId = userId || site.getUserId();
            promises.push(site.invalidateWsCacheForKey(_this.getSectionsCacheKey(courseId)));
            promises.push(site.invalidateWsCacheForKey(_this.getActivitiesCompletionCacheKey(courseId, userId)));
            if (courseId == siteHomeId) {
                promises.push(site.invalidateConfig());
            }
            return Promise.all(promises);
        });
    };
    /**
     * Load module contents into module.contents if they aren't loaded already.
     *
     * @param module Module to load the contents.
     * @param courseId The course ID. Recommended to speed up the process and minimize data usage.
     * @param sectionId The section ID.
     * @param preferCache True if shouldn't call WS if data is cached, false otherwise.
     * @param ignoreCache True if it should ignore cached data (it will always fail in offline or server down).
     * @param siteId Site ID. If not defined, current site.
     * @param modName If set, the app will retrieve all modules of this type with a single WS call. This reduces the
     *                number of WS calls, but it isn't recommended for modules that can return a lot of contents.
     * @return Promise resolved when loaded.
     */
    CoreCourseProvider.prototype.loadModuleContents = function (module, courseId, sectionId, preferCache, ignoreCache, siteId, modName) {
        if (!ignoreCache && module.contents && module.contents.length) {
            // Already loaded.
            return Promise.resolve();
        }
        return this.getModule(module.id, courseId, sectionId, preferCache, ignoreCache, siteId, modName).then(function (mod) {
            module.contents = mod.contents;
        });
    };
    /**
     * Report a course and section as being viewed.
     *
     * @param courseId Course ID.
     * @param sectionNumber Section number.
     * @param siteId Site ID. If not defined, current site.
     * @param name Name of the course.
     * @return Promise resolved when the WS call is successful.
     */
    CoreCourseProvider.prototype.logView = function (courseId, sectionNumber, siteId, name) {
        var _this = this;
        var params = {
            courseid: courseId
        }, wsName = 'core_course_view_course';
        if (typeof sectionNumber != 'undefined') {
            params.sectionnumber = sectionNumber;
        }
        return this.sitesProvider.getSite(siteId).then(function (site) {
            _this.pushNotificationsProvider.logViewEvent(courseId, name, 'course', wsName, { sectionnumber: sectionNumber }, siteId);
            return site.write('core_course_view_course', params).then(function (response) {
                if (!response.status) {
                    return Promise.reject(null);
                }
                else {
                    _this.eventsProvider.trigger(CoreCoursesProvider.EVENT_MY_COURSES_UPDATED, {
                        courseId: courseId,
                        action: CoreCoursesProvider.ACTION_VIEW,
                    }, site.getId());
                }
            });
        });
    };
    /**
     * Offline version for manually marking a module as completed.
     *
     * @param cmId The module ID.
     * @param completed Whether the module is completed or not.
     * @param courseId Course ID the module belongs to.
     * @param courseName Course name. Recommended, it is used to display a better warning message.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when completion is successfully sent or stored.
     */
    CoreCourseProvider.prototype.markCompletedManually = function (cmId, completed, courseId, courseName, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        // Convenience function to store a completion to be synchronized later.
        var storeOffline = function () {
            return _this.courseOffline.markCompletedManually(cmId, completed, courseId, courseName, siteId);
        };
        // The offline function requires a courseId and it could be missing because it's a calculated field.
        if (!this.appProvider.isOnline() && courseId) {
            // App is offline, store the action.
            return storeOffline();
        }
        // Try to send it to server.
        return this.markCompletedManuallyOnline(cmId, completed, siteId).then(function (result) {
            // Data sent to server, if there is some offline data delete it now.
            return _this.courseOffline.deleteManualCompletion(cmId, siteId).catch(function () {
                // Ignore errors, shouldn't happen.
            }).then(function () {
                return result;
            });
        }).catch(function (error) {
            if (_this.utils.isWebServiceError(error) || !courseId) {
                // The WebService has thrown an error, this means that responses cannot be submitted.
                return Promise.reject(error);
            }
            else {
                // Couldn't connect to server, store it offline.
                return storeOffline();
            }
        });
    };
    /**
     * Offline version for manually marking a module as completed.
     *
     * @param cmId The module ID.
     * @param completed Whether the module is completed or not.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when completion is successfully sent.
     */
    CoreCourseProvider.prototype.markCompletedManuallyOnline = function (cmId, completed, siteId) {
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                cmid: cmId,
                completed: completed
            };
            return site.write('core_completion_update_activity_completion_status_manually', params);
        });
    };
    /**
     * Check if a module has a view page. E.g. labels don't have a view page.
     *
     * @param module The module object.
     * @return Whether the module has a view page.
     */
    CoreCourseProvider.prototype.moduleHasView = function (module) {
        return !!module.url;
    };
    /**
     * Wait for any course format plugin to load, and open the course page.
     *
     * If the plugin's promise is resolved, the course page will be opened.  If it is rejected, they will see an error.
     * If the promise for the plugin is still in progress when the user tries to open the course, a loader
     * will be displayed until it is complete, before the course page is opened.  If the promise is already complete,
     * they will see the result immediately.
     *
     * This function must be in here instead of course helper to prevent circular dependencies.
     *
     * @param navCtrl The nav controller to use. If not defined, the course will be opened in main menu.
     * @param course Course to open
     * @param params Other params to pass to the course page.
     * @return Promise resolved when done.
     */
    CoreCourseProvider.prototype.openCourse = function (navCtrl, course, params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loading, coursesProvider, error_1, available, error_2, deferred_1, observer_1, error_3, message, reload, ignore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loading = this.domUtils.showModalLoading();
                        // Wait for site plugins to be fetched.
                        return [4 /*yield*/, this.utils.ignoreErrors(this.sitePluginsProvider.waitFetchPlugins())];
                    case 1:
                        // Wait for site plugins to be fetched.
                        _a.sent();
                        if (!(typeof course.format == 'undefined')) return [3 /*break*/, 12];
                        coursesProvider = CoreCourses.instance;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 12]);
                        return [4 /*yield*/, coursesProvider.getUserCourse(course.id, true)];
                    case 3:
                        course = _a.sent();
                        return [3 /*break*/, 12];
                    case 4:
                        error_1 = _a.sent();
                        available = coursesProvider.isGetCoursesByFieldAvailableInSite();
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 10, , 11]);
                        if (!available) return [3 /*break*/, 7];
                        return [4 /*yield*/, CoreCourses.instance.getCourseByField('id', course.id)];
                    case 6:
                        course = _a.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, CoreCourses.instance.getCourse(course.id)];
                    case 8:
                        course = _a.sent();
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_2 = _a.sent();
                        return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 12];
                    case 12:
                        if (!!this.sitePluginsProvider.sitePluginPromiseExists('format_' + course.format)) return [3 /*break*/, 14];
                        // No custom format plugin. We don't need to wait for anything.
                        loading.dismiss();
                        return [4 /*yield*/, this.courseFormatDelegate.openCourse(navCtrl, course, params)];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                    case 14:
                        _a.trys.push([14, 16, 17, 18]);
                        return [4 /*yield*/, this.sitePluginsProvider.sitePluginLoaded('format_' + course.format)];
                    case 15:
                        _a.sent();
                        // The format loaded successfully, but the handlers wont be registered until all site plugins have loaded.
                        if (this.sitePluginsProvider.sitePluginsFinishedLoading) {
                            return [2 /*return*/, this.courseFormatDelegate.openCourse(navCtrl, course, params)];
                        }
                        deferred_1 = this.utils.promiseDefer(), observer_1 = this.eventsProvider.on(CoreEventsProvider.SITE_PLUGINS_LOADED, function () {
                            observer_1 && observer_1.off();
                            _this.courseFormatDelegate.openCourse(navCtrl, course, params).then(function (response) {
                                deferred_1.resolve(response);
                            }).catch(function (error) {
                                deferred_1.reject(error);
                            });
                        });
                        return [2 /*return*/, deferred_1.promise];
                    case 16:
                        error_3 = _a.sent();
                        message = this.translate.instant('core.courses.errorloadplugins');
                        reload = this.translate.instant('core.courses.reload');
                        ignore = this.translate.instant('core.courses.ignore');
                        this.domUtils.showConfirm(message, '', reload, ignore).then(function () {
                            window.location.reload();
                        });
                        return [3 /*break*/, 18];
                    case 17:
                        loading.dismiss();
                        return [7 /*endfinally*/];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Select a certain tab in the course. Please use currentViewIsCourse() first to verify user is viewing the course.
     *
     * @param name Name of the tab. If not provided, course contents.
     * @param params Other params.
     */
    CoreCourseProvider.prototype.selectCourseTab = function (name, params) {
        params = params || {};
        params.name = name || '';
        this.eventsProvider.trigger(CoreEventsProvider.SELECT_COURSE_TAB, params);
    };
    /**
     * Change the course status, setting it to the previous status.
     *
     * @param courseId Course ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when the status is changed. Resolve param: new status.
     */
    CoreCourseProvider.prototype.setCoursePreviousStatus = function (courseId, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        this.logger.debug("Set previous status for course " + courseId + " in site " + siteId);
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var db = site.getDb(), newData = {};
            // Get current stored data.
            return _this.getCourseStatusData(courseId, siteId).then(function (entry) {
                _this.logger.debug("Set previous status '" + entry.status + "' for course " + courseId);
                newData.status = entry.previous || CoreConstants.NOT_DOWNLOADED;
                newData.updated = Date.now();
                if (entry.status == CoreConstants.DOWNLOADING) {
                    // Going back from downloading to previous status, restore previous download time.
                    newData.downloadTime = entry.previousDownloadTime;
                }
                return db.updateRecords(_this.COURSE_STATUS_TABLE, newData, { id: courseId }).then(function () {
                    // Success updating, trigger event.
                    _this.triggerCourseStatusChanged(courseId, newData.status, siteId);
                    return newData.status;
                });
            });
        });
    };
    /**
     * Store course status.
     *
     * @param courseId Course ID.
     * @param status New course status.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when the status is stored.
     */
    CoreCourseProvider.prototype.setCourseStatus = function (courseId, status, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        this.logger.debug("Set status '" + status + "' for course " + courseId + " in site " + siteId);
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var downloadTime, previousDownloadTime;
            if (status == CoreConstants.DOWNLOADING) {
                // Set download time if course is now downloading.
                downloadTime = _this.timeUtils.timestamp();
            }
            // Search current status to set it as previous status.
            return _this.getCourseStatusData(courseId, siteId).then(function (entry) {
                if (typeof downloadTime == 'undefined') {
                    // Keep previous download time.
                    downloadTime = entry.downloadTime;
                    previousDownloadTime = entry.previousDownloadTime;
                }
                else {
                    // The downloadTime will be updated, store current time as previous.
                    previousDownloadTime = entry.downloadTime;
                }
                return entry.status;
            }).catch(function () {
                // No previous status.
            }).then(function (previousStatus) {
                if (previousStatus != status) {
                    // Status has changed, update it.
                    var data = {
                        id: courseId,
                        status: status,
                        previous: previousStatus,
                        updated: new Date().getTime(),
                        downloadTime: downloadTime,
                        previousDownloadTime: previousDownloadTime
                    };
                    return site.getDb().insertRecord(_this.COURSE_STATUS_TABLE, data);
                }
            }).then(function () {
                // Success inserting, trigger event.
                _this.triggerCourseStatusChanged(courseId, status, siteId);
            });
        });
    };
    /**
     * Translate a module name to current language.
     *
     * @param moduleName The module name.
     * @return Translated name.
     */
    CoreCourseProvider.prototype.translateModuleName = function (moduleName) {
        if (this.CORE_MODULES.indexOf(moduleName) < 0) {
            moduleName = 'external-tool';
        }
        var langKey = 'core.mod_' + moduleName, translated = this.translate.instant(langKey);
        return translated !== langKey ? translated : moduleName;
    };
    /**
     * Trigger COURSE_STATUS_CHANGED with the right data.
     *
     * @param courseId Course ID.
     * @param status New course status.
     * @param siteId Site ID. If not defined, current site.
     */
    CoreCourseProvider.prototype.triggerCourseStatusChanged = function (courseId, status, siteId) {
        this.eventsProvider.trigger(CoreEventsProvider.COURSE_STATUS_CHANGED, {
            courseId: courseId,
            status: status
        }, siteId);
    };
    CoreCourseProvider.ALL_SECTIONS_ID = -2;
    CoreCourseProvider.STEALTH_MODULES_SECTION_ID = -1;
    CoreCourseProvider.ACCESS_GUEST = 'courses_access_guest';
    CoreCourseProvider.ACCESS_DEFAULT = 'courses_access_default';
    CoreCourseProvider.ALL_COURSES_CLEARED = -1;
    CoreCourseProvider.COMPLETION_TRACKING_NONE = 0;
    CoreCourseProvider.COMPLETION_TRACKING_MANUAL = 1;
    CoreCourseProvider.COMPLETION_TRACKING_AUTOMATIC = 2;
    CoreCourseProvider.COMPLETION_INCOMPLETE = 0;
    CoreCourseProvider.COMPLETION_COMPLETE = 1;
    CoreCourseProvider.COMPLETION_COMPLETE_PASS = 2;
    CoreCourseProvider.COMPLETION_COMPLETE_FAIL = 3;
    CoreCourseProvider.COMPONENT = 'CoreCourse';
    CoreCourseProvider = CoreCourseProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider, CoreSitesProvider, CoreEventsProvider,
            CoreUtilsProvider, CoreTimeUtilsProvider, TranslateService,
            CoreCourseOfflineProvider, CoreAppProvider,
            CoreCourseFormatDelegate, CoreSitePluginsProvider,
            CoreDomUtilsProvider, CorePushNotificationsProvider])
    ], CoreCourseProvider);
    return CoreCourseProvider;
    var CoreCourseProvider_1;
}());
export { CoreCourseProvider };
var CoreCourse = /** @class */ (function (_super) {
    __extends(CoreCourse, _super);
    function CoreCourse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreCourse;
}(makeSingleton(CoreCourseProvider)));
export { CoreCourse };
//# sourceMappingURL=course.js.map