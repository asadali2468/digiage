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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
import { CoreEventsProvider } from '@providers/events';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreSite } from '@classes/site';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Service that provides some features regarding lists of courses and categories.
 */
var CoreCoursesProvider = /** @class */ (function () {
    function CoreCoursesProvider(logger, sitesProvider, eventsProvider) {
        this.sitesProvider = sitesProvider;
        this.eventsProvider = eventsProvider;
        this.ROOT_CACHE_KEY = 'mmCourses:';
        this.logger = logger.getInstance('CoreCoursesProvider');
    }
    CoreCoursesProvider_1 = CoreCoursesProvider;
    /**
     * Whether current site supports getting course options.
     *
     * @return Whether current site supports getting course options.
     */
    CoreCoursesProvider.prototype.canGetAdminAndNavOptions = function () {
        return this.sitesProvider.wsAvailableInCurrentSite('core_course_get_user_navigation_options') &&
            this.sitesProvider.wsAvailableInCurrentSite('core_course_get_user_administration_options');
    };
    /**
     * Get categories. They can be filtered by id.
     *
     * @param categoryId Category ID to get.
     * @param addSubcategories If it should add subcategories to the list.
     * @param siteId Site to get the courses from. If not defined, use current site.
     * @return Promise resolved with the categories.
     */
    CoreCoursesProvider.prototype.getCategories = function (categoryId, addSubcategories, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            // Get parent when id is the root category.
            var criteriaKey = categoryId == 0 ? 'parent' : 'id', data = {
                criteria: [
                    { key: criteriaKey, value: categoryId }
                ],
                addsubcategories: addSubcategories ? 1 : 0
            }, preSets = {
                cacheKey: _this.getCategoriesCacheKey(categoryId, addSubcategories),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            return site.read('core_course_get_categories', data, preSets);
        });
    };
    /**
     * Get cache key for get categories methods WS call.
     *
     * @param categoryId Category ID to get.
     * @param addSubcategories If add subcategories to the list.
     * @return Cache key.
     */
    CoreCoursesProvider.prototype.getCategoriesCacheKey = function (categoryId, addSubcategories) {
        return this.ROOT_CACHE_KEY + 'categories:' + categoryId + ':' + !!addSubcategories;
    };
    /**
     * Given a list of course IDs to get course admin and nav options, return the list of courseIds to use.
     *
     * @param courseIds Course IDs.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved with the list of course IDs.
     */
    CoreCoursesProvider.prototype.getCourseIdsForAdminAndNavOptions = function (courseIds, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var siteHomeId = site.getSiteHomeId();
            if (courseIds.length == 1) {
                // Only 1 course, check if it belongs to the user courses. If so, use all user courses.
                return _this.getCourseIdsIfEnrolled(courseIds[0], siteId);
            }
            else {
                if (courseIds.length > 1 && courseIds.indexOf(siteHomeId) == -1) {
                    courseIds.push(siteHomeId);
                }
                // Sort the course IDs.
                courseIds.sort(function (a, b) {
                    return b - a;
                });
                return courseIds;
            }
        });
    };
    /**
     * Given a course ID, if user is enrolled in the course it will return the IDs of all enrolled courses and site home.
     * Return only the course ID otherwise.
     *
     * @param courseIds Course IDs.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved with the list of course IDs.
     */
    CoreCoursesProvider.prototype.getCourseIdsIfEnrolled = function (courseId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var siteHomeId = site.getSiteHomeId();
            // Check if user is enrolled in the course.
            return _this.getUserCourses(true, siteId).then(function (courses) {
                var useAllCourses = false;
                if (courseId == siteHomeId) {
                    // It's site home, use all courses.
                    useAllCourses = true;
                }
                else {
                    useAllCourses = !!courses.find(function (course) {
                        return course.id == courseId;
                    });
                }
                if (useAllCourses) {
                    // User is enrolled, return all the courses.
                    var courseIds = courses.map(function (course) {
                        return course.id;
                    });
                    // Always add the site home ID.
                    courseIds.push(siteHomeId);
                    // Sort the course IDs.
                    courseIds.sort(function (a, b) {
                        return b - a;
                    });
                    return courseIds;
                }
                return [courseId];
            }).catch(function () {
                // Ignore errors.
                return [courseId];
            });
        });
    };
    /**
     * Check if download a whole course is disabled in a certain site.
     *
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved with true if disabled, rejected or resolved with false otherwise.
     */
    CoreCoursesProvider.prototype.isDownloadCourseDisabled = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return _this.isDownloadCoursesDisabledInSite(site);
        });
    };
    /**
     * Check if download a whole course is disabled in a certain site.
     *
     * @param site Site. If not defined, use current site.
     * @return Whether it's disabled.
     */
    CoreCoursesProvider.prototype.isDownloadCourseDisabledInSite = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.isOfflineDisabled() || site.isFeatureDisabled('NoDelegate_CoreCourseDownload');
    };
    /**
     * Check if download all courses is disabled in a certain site.
     *
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved with true if disabled, rejected or resolved with false otherwise.
     */
    CoreCoursesProvider.prototype.isDownloadCoursesDisabled = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return _this.isDownloadCoursesDisabledInSite(site);
        });
    };
    /**
     * Check if download all courses is disabled in a certain site.
     *
     * @param site Site. If not defined, use current site.
     * @return Whether it's disabled.
     */
    CoreCoursesProvider.prototype.isDownloadCoursesDisabledInSite = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.isOfflineDisabled() || site.isFeatureDisabled('NoDelegate_CoreCoursesDownload');
    };
    /**
     * Check if My Courses is disabled in a certain site.
     *
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved with true if disabled, rejected or resolved with false otherwise.
     */
    CoreCoursesProvider.prototype.isMyCoursesDisabled = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return _this.isMyCoursesDisabledInSite(site);
        });
    };
    /**
     * Check if My Courses is disabled in a certain site.
     *
     * @param site Site. If not defined, use current site.
     * @return Whether it's disabled.
     */
    CoreCoursesProvider.prototype.isMyCoursesDisabledInSite = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.isFeatureDisabled('CoreMainMenuDelegate_CoreCourses');
    };
    /**
     * Check if Search Courses is disabled in a certain site.
     *
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved with true if disabled, rejected or resolved with false otherwise.
     */
    CoreCoursesProvider.prototype.isSearchCoursesDisabled = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return _this.isSearchCoursesDisabledInSite(site);
        });
    };
    /**
     * Check if Search Courses is disabled in a certain site.
     *
     * @param site Site. If not defined, use current site.
     * @return Whether it's disabled.
     */
    CoreCoursesProvider.prototype.isSearchCoursesDisabledInSite = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.isFeatureDisabled('CoreCourseOptionsDelegate_search');
    };
    /**
     * Get course.
     *
     * @param id ID of the course to get.
     * @param siteId Site to get the courses from. If not defined, use current site.
     * @return Promise resolved with the course.
     */
    CoreCoursesProvider.prototype.getCourse = function (id, siteId) {
        return this.getCourses([id], siteId).then(function (courses) {
            if (courses && courses.length > 0) {
                return courses[0];
            }
            return Promise.reject(null);
        });
    };
    /**
     * Get the enrolment methods from a course.
     *
     * @param id ID of the course.
     * @param siteId Site ID. If not defined, use current site.
     * @return Promise resolved with the methods.
     */
    CoreCoursesProvider.prototype.getCourseEnrolmentMethods = function (id, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                courseid: id
            }, preSets = {
                cacheKey: _this.getCourseEnrolmentMethodsCacheKey(id),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            return site.read('core_enrol_get_course_enrolment_methods', params, preSets);
        });
    };
    /**
     * Get cache key for get course enrolment methods WS call.
     *
     * @param id Course ID.
     * @return Cache key.
     */
    CoreCoursesProvider.prototype.getCourseEnrolmentMethodsCacheKey = function (id) {
        return this.ROOT_CACHE_KEY + 'enrolmentmethods:' + id;
    };
    /**
     * Get info from a course guest enrolment method.
     *
     * @param instanceId Guest instance ID.
     * @param siteId Site ID. If not defined, use current site.
     * @return Promise resolved when the info is retrieved.
     */
    CoreCoursesProvider.prototype.getCourseGuestEnrolmentInfo = function (instanceId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                instanceid: instanceId
            }, preSets = {
                cacheKey: _this.getCourseGuestEnrolmentInfoCacheKey(instanceId),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            return site.read('enrol_guest_get_instance_info', params, preSets).then(function (response) {
                return response.instanceinfo;
            });
        });
    };
    /**
     * Get cache key for get course guest enrolment methods WS call.
     *
     * @param instanceId Guest instance ID.
     * @return Cache key.
     */
    CoreCoursesProvider.prototype.getCourseGuestEnrolmentInfoCacheKey = function (instanceId) {
        return this.ROOT_CACHE_KEY + 'guestinfo:' + instanceId;
    };
    /**
     * Get courses.
     * Warning: if the user doesn't have permissions to view some of the courses passed the WS call will fail.
     * The user must be able to view ALL the courses passed.
     *
     * @param ids List of IDs of the courses to get.
     * @param siteId Site to get the courses from. If not defined, use current site.
     * @return Promise resolved with the courses.
     */
    CoreCoursesProvider.prototype.getCourses = function (ids, siteId) {
        var _this = this;
        if (!Array.isArray(ids)) {
            return Promise.reject(null);
        }
        else if (ids.length === 0) {
            return Promise.resolve([]);
        }
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var data = {
                options: {
                    ids: ids
                }
            }, preSets = {
                cacheKey: _this.getCoursesCacheKey(ids),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            return site.read('core_course_get_courses', data, preSets);
        });
    };
    /**
     * Get cache key for get courses WS call.
     *
     * @param ids Courses IDs.
     * @return Cache key.
     */
    CoreCoursesProvider.prototype.getCoursesCacheKey = function (ids) {
        return this.ROOT_CACHE_KEY + 'course:' + JSON.stringify(ids);
    };
    /**
     * This function is meant to decrease WS calls.
     * When requesting a single course that belongs to enrolled courses, request all enrolled courses because
     * the WS call is probably cached.
     *
     * @param field The field to search.
     * @param value The value to match.
     * @param siteId Site ID. If not defined, use current site.
     * @return Promise resolved with the field and value to use.
     */
    CoreCoursesProvider.prototype.fixCoursesByFieldParams = function (field, value, siteId) {
        if (field == 'id' || field == 'ids') {
            var courseIds = String(value).split(',');
            // Use the same optimization as in get admin and nav options. This will return the course IDs to use.
            return this.getCourseIdsForAdminAndNavOptions(courseIds, siteId).then(function (courseIds) {
                if (courseIds.length > 1) {
                    return { field: 'ids', value: courseIds.join(',') };
                }
                else {
                    return { field: 'id', value: Number(courseIds[0]) };
                }
            });
        }
        else {
            // Nothing to do.
            return Promise.resolve({ field: field, value: value });
        }
    };
    /**
     * Get the first course returned by getCoursesByField.
     *
     * @param field The field to search. Can be left empty for all courses or:
     *              id: course id.
     *              ids: comma separated course ids.
     *              shortname: course short name.
     *              idnumber: course id number.
     *              category: category id the course belongs to.
     * @param value The value to match.
     * @param siteId Site ID. If not defined, use current site.
     * @return Promise resolved with the first course.
     * @since 3.2
     */
    CoreCoursesProvider.prototype.getCourseByField = function (field, value, siteId) {
        return this.getCoursesByField(field, value, siteId).then(function (courses) {
            if (courses && courses.length > 0) {
                return courses[0];
            }
            return Promise.reject(null);
        });
    };
    /**
     * Get courses. They can be filtered by field.
     *
     * @param field The field to search. Can be left empty for all courses or:
     *              id: course id.
     *              ids: comma separated course ids.
     *              shortname: course short name.
     *              idnumber: course id number.
     *              category: category id the course belongs to.
     * @param value The value to match.
     * @param siteId Site ID. If not defined, use current site.
     * @return Promise resolved with the courses.
     * @since 3.2
     */
    CoreCoursesProvider.prototype.getCoursesByField = function (field, value, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        var originalValue = value;
        var hasChanged = false;
        return this.fixCoursesByFieldParams(field, value, siteId).then(function (result) {
            hasChanged = result.field != field || result.value != value;
            field = result.field;
            value = result.value;
            return _this.sitesProvider.getSite(siteId);
        }).then(function (site) {
            var data = {
                field: field || '',
                value: field ? value : ''
            }, preSets = {
                cacheKey: _this.getCoursesByFieldCacheKey(field, value),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            return site.read('core_course_get_courses_by_field', data, preSets).then(function (courses) {
                if (courses.courses) {
                    if (field == 'ids' && hasChanged) {
                        // The list of courses requestes was changed to optimize it.
                        // Return only the ones that were being requested.
                        var courseIds_1 = String(originalValue).split(','), finalCourses_1 = [];
                        courses.courses.forEach(function (course) {
                            var position = courseIds_1.indexOf(String(course.id));
                            if (position != -1) {
                                // Course is in the original list, take it.
                                finalCourses_1.push(course);
                                courseIds_1.splice(position, 1);
                            }
                        });
                        courses.courses = finalCourses_1;
                    }
                    // Courses will be sorted using sortorder if avalaible.
                    return courses.courses.sort(function (a, b) {
                        if (typeof a.sortorder == 'undefined' && typeof b.sortorder == 'undefined') {
                            return b.id - a.id;
                        }
                        if (typeof a.sortorder == 'undefined') {
                            return 1;
                        }
                        if (typeof b.sortorder == 'undefined') {
                            return -1;
                        }
                        return a.sortorder - b.sortorder;
                    });
                }
                return Promise.reject(null);
            });
        });
    };
    /**
     * Get cache key for get courses WS call.
     *
     * @param field The field to search.
     * @param value The value to match.
     * @return Cache key.
     */
    CoreCoursesProvider.prototype.getCoursesByFieldCacheKey = function (field, value) {
        field = field || '';
        value = field ? value : '';
        return this.ROOT_CACHE_KEY + 'coursesbyfield:' + field + ':' + value;
    };
    /**
     * Get courses matching the given custom field. Only works in online.
     *
     * @param  customFieldName Custom field name.
     * @param  customFieldValue Custom field value.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the list of courses.
     * @since 3.8
     */
    CoreCoursesProvider.prototype.getEnrolledCoursesByCustomField = function (customFieldName, customFieldValue, siteId) {
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var data = {
                classification: 'customfield',
                customfieldname: customFieldName,
                customfieldvalue: customFieldValue
            }, preSets = {
                getFromCache: false
            };
            return site.read('core_course_get_enrolled_courses_by_timeline_classification', data, preSets).then(function (courses) {
                if (courses.courses) {
                    return courses.courses;
                }
                return Promise.reject(null);
            });
        });
    };
    /**
     * Check if get courses by field WS is available in a certain site.
     *
     * @param site Site to check.
     * @return Whether get courses by field is available.
     * @since 3.2
     */
    CoreCoursesProvider.prototype.isGetCoursesByFieldAvailable = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.wsAvailable('core_course_get_courses_by_field');
    };
    /**
     * Check if get courses by field WS is available in a certain site, by site ID.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with boolean: whether get courses by field is available.
     * @since 3.2
     */
    CoreCoursesProvider.prototype.isGetCoursesByFieldAvailableInSite = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return _this.isGetCoursesByFieldAvailable(site);
        });
    };
    /**
     * Get the navigation and administration options for the given courses.
     *
     * @param courseIds IDs of courses to get.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the options for each course.
     */
    CoreCoursesProvider.prototype.getCoursesAdminAndNavOptions = function (courseIds, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        // Get the list of courseIds to use based on the param.
        return this.getCourseIdsForAdminAndNavOptions(courseIds, siteId).then(function (courseIds) {
            var promises = [];
            var navOptions, admOptions;
            // Get user navigation and administration options.
            promises.push(_this.getUserNavigationOptions(courseIds, siteId).catch(function () {
                // Couldn't get it, return empty options.
                return {};
            }).then(function (options) {
                navOptions = options;
            }));
            promises.push(_this.getUserAdministrationOptions(courseIds, siteId).catch(function () {
                // Couldn't get it, return empty options.
                return {};
            }).then(function (options) {
                admOptions = options;
            }));
            return Promise.all(promises).then(function () {
                return { navOptions: navOptions, admOptions: admOptions };
            });
        });
    };
    /**
     * Get the common part of the cache keys for user administration options WS calls.
     *
     * @return Cache key.
     */
    CoreCoursesProvider.prototype.getUserAdministrationOptionsCommonCacheKey = function () {
        return this.ROOT_CACHE_KEY + 'administrationOptions:';
    };
    /**
     * Get cache key for get user administration options WS call.
     *
     * @param courseIds IDs of courses to get.
     * @return Cache key.
     */
    CoreCoursesProvider.prototype.getUserAdministrationOptionsCacheKey = function (courseIds) {
        return this.getUserAdministrationOptionsCommonCacheKey() + courseIds.join(',');
    };
    /**
     * Get user administration options for a set of courses.
     *
     * @param courseIds IDs of courses to get.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with administration options for each course.
     */
    CoreCoursesProvider.prototype.getUserAdministrationOptions = function (courseIds, siteId) {
        var _this = this;
        if (!courseIds || courseIds.length == 0) {
            return Promise.resolve({});
        }
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                courseids: courseIds
            }, preSets = {
                cacheKey: _this.getUserAdministrationOptionsCacheKey(courseIds),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            return site.read('core_course_get_user_administration_options', params, preSets).then(function (response) {
                // Format returned data.
                return _this.formatUserAdminOrNavOptions(response.courses);
            });
        });
    };
    /**
     * Get the common part of the cache keys for user navigation options WS calls.
     *
     * @param courseIds IDs of courses to get.
     * @return Cache key.
     */
    CoreCoursesProvider.prototype.getUserNavigationOptionsCommonCacheKey = function () {
        return this.ROOT_CACHE_KEY + 'navigationOptions:';
    };
    /**
     * Get cache key for get user navigation options WS call.
     *
     * @return Cache key.
     */
    CoreCoursesProvider.prototype.getUserNavigationOptionsCacheKey = function (courseIds) {
        return this.getUserNavigationOptionsCommonCacheKey() + courseIds.join(',');
    };
    /**
     * Get user navigation options for a set of courses.
     *
     * @param courseIds IDs of courses to get.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with navigation options for each course.
     */
    CoreCoursesProvider.prototype.getUserNavigationOptions = function (courseIds, siteId) {
        var _this = this;
        if (!courseIds || courseIds.length == 0) {
            return Promise.resolve({});
        }
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                courseids: courseIds
            }, preSets = {
                cacheKey: _this.getUserNavigationOptionsCacheKey(courseIds),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            return site.read('core_course_get_user_navigation_options', params, preSets).then(function (response) {
                // Format returned data.
                return _this.formatUserAdminOrNavOptions(response.courses);
            });
        });
    };
    /**
     * Format user navigation or administration options.
     *
     * @param courses Navigation or administration options for each course.
     * @return Formatted options.
     */
    CoreCoursesProvider.prototype.formatUserAdminOrNavOptions = function (courses) {
        var result = {};
        courses.forEach(function (course) {
            var options = {};
            if (course.options) {
                course.options.forEach(function (option) {
                    options[option.name] = option.available;
                });
            }
            result[course.id] = options;
        });
        return result;
    };
    /**
     * Get a course the user is enrolled in. This function relies on getUserCourses.
     * preferCache=true will try to speed up the response, but the data returned might not be updated.
     *
     * @param id ID of the course to get.
     * @param preferCache True if shouldn't call WS if data is cached, false otherwise.
     * @param siteId Site to get the courses from. If not defined, use current site.
     * @return Promise resolved with the course.
     */
    CoreCoursesProvider.prototype.getUserCourse = function (id, preferCache, siteId) {
        if (!id) {
            return Promise.reject(null);
        }
        return this.getUserCourses(preferCache, siteId).then(function (courses) {
            var course;
            for (var i in courses) {
                if (courses[i].id == id) {
                    course = courses[i];
                    break;
                }
            }
            return course ? course : Promise.reject(null);
        });
    };
    /**
     * Get user courses.
     *
     * @param preferCache True if shouldn't call WS if data is cached, false otherwise.
     * @param siteId Site to get the courses from. If not defined, use current site.
     * @return Promise resolved with the courses.
     */
    CoreCoursesProvider.prototype.getUserCourses = function (preferCache, siteId, strategy) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var userId = site.getUserId(), data = {
                userid: userId
            }, strategyPreSets = strategy
                ? _this.sitesProvider.getReadingStrategyPreSets(strategy)
                : { omitExpires: !!preferCache }, preSets = __assign({ cacheKey: _this.getUserCoursesCacheKey(), getCacheUsingCacheKey: true, updateFrequency: CoreSite.FREQUENCY_RARELY }, strategyPreSets);
            if (site.isVersionGreaterEqualThan('3.7')) {
                data.returnusercount = 0;
            }
            return site.read('core_enrol_get_users_courses', data, preSets).then(function (courses) {
                if (_this.userCoursesIds) {
                    // Check if the list of courses has changed.
                    var added_1 = [], removed_1 = [], previousIds = Object.keys(_this.userCoursesIds), currentIds_1 = {}; // Use an object to make it faster to search.
                    courses.forEach(function (course) {
                        currentIds_1[course.id] = true;
                        if (!_this.userCoursesIds[course.id]) {
                            // Course added.
                            added_1.push(course.id);
                        }
                    });
                    if (courses.length - added_1.length != previousIds.length) {
                        // A course was removed, check which one.
                        previousIds.forEach(function (id) {
                            if (!currentIds_1[id]) {
                                // Course removed.
                                removed_1.push(Number(id));
                            }
                        });
                    }
                    if (added_1.length || removed_1.length) {
                        // At least 1 course was added or removed, trigger the event.
                        _this.eventsProvider.trigger(CoreCoursesProvider_1.EVENT_MY_COURSES_CHANGED, {
                            added: added_1,
                            removed: removed_1
                        }, site.getId());
                    }
                    _this.userCoursesIds = currentIds_1;
                }
                else {
                    _this.userCoursesIds = {};
                    // Store the list of courses.
                    courses.forEach(function (course) {
                        _this.userCoursesIds[course.id] = true;
                    });
                }
                return courses;
            });
        });
    };
    /**
     * Get cache key for get user courses WS call.
     *
     * @return Cache key.
     */
    CoreCoursesProvider.prototype.getUserCoursesCacheKey = function () {
        return this.ROOT_CACHE_KEY + 'usercourses';
    };
    /**
     * Invalidates get categories WS call.
     *
     * @param categoryId Category ID to get.
     * @param addSubcategories If it should add subcategories to the list.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateCategories = function (categoryId, addSubcategories, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getCategoriesCacheKey(categoryId, addSubcategories));
        });
    };
    /**
     * Invalidates get course WS call.
     *
     * @param id Course ID.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateCourse = function (id, siteId) {
        return this.invalidateCourses([id], siteId);
    };
    /**
     * Invalidates get course enrolment methods WS call.
     *
     * @param id Course ID.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateCourseEnrolmentMethods = function (id, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getCourseEnrolmentMethodsCacheKey(id));
        });
    };
    /**
     * Invalidates get course guest enrolment info WS call.
     *
     * @param instanceId Guest instance ID.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateCourseGuestEnrolmentInfo = function (instanceId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getCourseGuestEnrolmentInfoCacheKey(instanceId));
        });
    };
    /**
     * Invalidates the navigation and administration options for the given courses.
     *
     * @param courseIds IDs of courses to get.
     * @param siteId Site ID to invalidate. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateCoursesAdminAndNavOptions = function (courseIds, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        return this.getCourseIdsForAdminAndNavOptions(courseIds, siteId).then(function (ids) {
            var promises = [];
            promises.push(_this.invalidateUserAdministrationOptionsForCourses(ids, siteId));
            promises.push(_this.invalidateUserNavigationOptionsForCourses(ids, siteId));
            return Promise.all(promises);
        });
    };
    /**
     * Invalidates get courses WS call.
     *
     * @param ids Courses IDs.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateCourses = function (ids, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getCoursesCacheKey(ids));
        });
    };
    /**
     * Invalidates get courses by field WS call.
     *
     * @param field See getCoursesByField for info.
     * @param value The value to match.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateCoursesByField = function (field, value, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        return this.fixCoursesByFieldParams(field, value, siteId).then(function (result) {
            field = result.field;
            value = result.value;
            return _this.sitesProvider.getSite(siteId);
        }).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getCoursesByFieldCacheKey(field, value));
        });
    };
    /**
     * Invalidates all user administration options.
     *
     * @param siteId Site ID to invalidate. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateUserAdministrationOptions = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKeyStartingWith(_this.getUserAdministrationOptionsCommonCacheKey());
        });
    };
    /**
     * Invalidates user administration options for certain courses.
     *
     * @param courseIds IDs of courses.
     * @param siteId Site ID to invalidate. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateUserAdministrationOptionsForCourses = function (courseIds, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getUserAdministrationOptionsCacheKey(courseIds));
        });
    };
    /**
     * Invalidates get user courses WS call.
     *
     * @param siteId Site ID to invalidate. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateUserCourses = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getUserCoursesCacheKey());
        });
    };
    /**
     * Invalidates all user navigation options.
     *
     * @param siteId Site ID to invalidate. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateUserNavigationOptions = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKeyStartingWith(_this.getUserNavigationOptionsCommonCacheKey());
        });
    };
    /**
     * Invalidates user navigation options for certain courses.
     *
     * @param courseIds IDs of courses.
     * @param siteId Site ID to invalidate. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCoursesProvider.prototype.invalidateUserNavigationOptionsForCourses = function (courseIds, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getUserNavigationOptionsCacheKey(courseIds));
        });
    };
    /**
     * Check if WS to retrieve guest enrolment data is available.
     *
     * @return Whether guest WS is available.
     */
    CoreCoursesProvider.prototype.isGuestWSAvailable = function () {
        var currentSite = this.sitesProvider.getCurrentSite();
        return currentSite && currentSite.wsAvailable('enrol_guest_get_instance_info');
    };
    /**
     * Search courses.
     *
     * @param text Text to search.
     * @param page Page to get.
     * @param perPage Number of courses per page. Defaults to CoreCoursesProvider.SEARCH_PER_PAGE.
     * @param siteId Site ID. If not defined, use current site.
     * @return Promise resolved with the courses and the total of matches.
     */
    CoreCoursesProvider.prototype.search = function (text, page, perPage, siteId) {
        if (page === void 0) { page = 0; }
        perPage = perPage || CoreCoursesProvider_1.SEARCH_PER_PAGE;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                criterianame: 'search',
                criteriavalue: text,
                page: page,
                perpage: perPage
            }, preSets = {
                getFromCache: false
            };
            return site.read('core_course_search_courses', params, preSets).then(function (response) {
                return { total: response.total, courses: response.courses };
            });
        });
    };
    /**
     * Self enrol current user in a certain course.
     *
     * @param courseId Course ID.
     * @param password Password to use.
     * @param instanceId Enrol instance ID.
     * @param siteId Site ID. If not defined, use current site.
     * @return Promise resolved if the user is enrolled. If the password is invalid, the promise is rejected
     *         with an object with code = CoreCoursesProvider.ENROL_INVALID_KEY.
     */
    CoreCoursesProvider.prototype.selfEnrol = function (courseId, password, instanceId, siteId) {
        if (password === void 0) { password = ''; }
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                courseid: courseId,
                password: password
            };
            if (instanceId) {
                params.instanceid = instanceId;
            }
            return site.write('enrol_self_enrol_user', params).then(function (response) {
                if (response) {
                    if (response.status) {
                        return true;
                    }
                    else if (response.warnings && response.warnings.length) {
                        var message_1;
                        response.warnings.forEach(function (warning) {
                            // Invalid password warnings.
                            if (warning.warningcode == '2' || warning.warningcode == '3' || warning.warningcode == '4') {
                                message_1 = warning.message;
                            }
                        });
                        if (message_1) {
                            return Promise.reject({ code: CoreCoursesProvider_1.ENROL_INVALID_KEY, message: message_1 });
                        }
                        else {
                            return Promise.reject(response.warnings[0]);
                        }
                    }
                }
                return Promise.reject(null);
            });
        });
    };
    /**
     * Set favourite property on a course.
     *
     * @param courseId Course ID.
     * @param favourite If favourite or unfavourite.
     * @param siteId Site ID. If not defined, use current site.
     * @return Promise resolved when done.
     */
    CoreCoursesProvider.prototype.setFavouriteCourse = function (courseId, favourite, siteId) {
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                courses: [
                    {
                        id: courseId,
                        favourite: favourite ? 1 : 0
                    }
                ]
            };
            return site.write('core_course_set_favourite_courses', params);
        });
    };
    CoreCoursesProvider.SEARCH_PER_PAGE = 20;
    CoreCoursesProvider.ENROL_INVALID_KEY = 'CoreCoursesEnrolInvalidKey';
    CoreCoursesProvider.EVENT_MY_COURSES_CHANGED = 'courses_my_courses_changed'; // User course list changed while app is running.
    CoreCoursesProvider.EVENT_MY_COURSES_UPDATED = 'courses_my_courses_updated'; // A course was hidden/favourite, or user enroled in a course.
    CoreCoursesProvider.EVENT_MY_COURSES_REFRESHED = 'courses_my_courses_refreshed';
    CoreCoursesProvider.EVENT_DASHBOARD_DOWNLOAD_ENABLED_CHANGED = 'dashboard_download_enabled_changed';
    // Actions for event EVENT_MY_COURSES_UPDATED.
    CoreCoursesProvider.ACTION_ENROL = 'enrol'; // User enrolled in a course.
    CoreCoursesProvider.ACTION_STATE_CHANGED = 'state_changed'; // Course state changed (hidden, favourite).
    CoreCoursesProvider.ACTION_VIEW = 'view'; // Course viewed.
    // Possible states changed.
    CoreCoursesProvider.STATE_HIDDEN = 'hidden';
    CoreCoursesProvider.STATE_FAVOURITE = 'favourite';
    CoreCoursesProvider = CoreCoursesProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider, CoreSitesProvider, CoreEventsProvider])
    ], CoreCoursesProvider);
    return CoreCoursesProvider;
    var CoreCoursesProvider_1;
}());
export { CoreCoursesProvider };
var CoreCourses = /** @class */ (function (_super) {
    __extends(CoreCourses, _super);
    function CoreCourses() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreCourses;
}(makeSingleton(CoreCoursesProvider)));
export { CoreCourses };
//# sourceMappingURL=courses.js.map