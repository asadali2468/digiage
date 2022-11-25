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
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreSitesProvider } from './sites';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { CoreSite } from '@classes/site';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * Service to handle groups.
*/
var CoreGroupsProvider = /** @class */ (function () {
    function CoreGroupsProvider(sitesProvider, translate, coursesProvider) {
        this.sitesProvider = sitesProvider;
        this.translate = translate;
        this.coursesProvider = coursesProvider;
        this.ROOT_CACHE_KEY = 'mmGroups:';
    }
    CoreGroupsProvider_1 = CoreGroupsProvider;
    /**
     * Check if group mode of an activity is enabled.
     *
     * @param cmId Course module ID.
     * @param siteId Site ID. If not defined, current site.
     * @param ignoreCache True if it should ignore cached data (it will always fail in offline or server down).
     * @return Promise resolved with true if the activity has groups, resolved with false otherwise.
     */
    CoreGroupsProvider.prototype.activityHasGroups = function (cmId, siteId, ignoreCache) {
        return this.getActivityGroupMode(cmId, siteId, ignoreCache).then(function (groupmode) {
            return groupmode === CoreGroupsProvider_1.SEPARATEGROUPS || groupmode === CoreGroupsProvider_1.VISIBLEGROUPS;
        }).catch(function () {
            return false;
        });
    };
    /**
     * Get the groups allowed in an activity.
     *
     * @param cmId Course module ID.
     * @param userId User ID. If not defined, use current user.
     * @param siteId Site ID. If not defined, current site.
     * @param ignoreCache True if it should ignore cached data (it will always fail in offline or server down).
     * @return Promise resolved when the groups are retrieved.
     */
    CoreGroupsProvider.prototype.getActivityAllowedGroups = function (cmId, userId, siteId, ignoreCache) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            userId = userId || site.getUserId();
            var params = {
                cmid: cmId,
                userid: userId
            }, preSets = {
                cacheKey: _this.getActivityAllowedGroupsCacheKey(cmId, userId),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            if (ignoreCache) {
                preSets.getFromCache = false;
                preSets.emergencyCache = false;
            }
            return site.read('core_group_get_activity_allowed_groups', params, preSets).then(function (response) {
                if (!response || !response.groups) {
                    return Promise.reject(null);
                }
                return response;
            });
        });
    };
    /**
     * Get cache key for group mode WS calls.
     *
     * @param cmId Course module ID.
     * @param userId User ID.
     * @return Cache key.
     */
    CoreGroupsProvider.prototype.getActivityAllowedGroupsCacheKey = function (cmId, userId) {
        return this.ROOT_CACHE_KEY + 'allowedgroups:' + cmId + ':' + userId;
    };
    /**
     * Get the groups allowed in an activity if they are allowed.
     *
     * @param cmId Course module ID.
     * @param userId User ID. If not defined, use current user.
     * @param siteId Site ID. If not defined, current site.
     * @param ignoreCache True if it should ignore cached data (it will always fail in offline or server down).
     * @return Promise resolved when the groups are retrieved. If not allowed, empty array will be returned.
     */
    CoreGroupsProvider.prototype.getActivityAllowedGroupsIfEnabled = function (cmId, userId, siteId, ignoreCache) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        // Get real groupmode, in case it's forced by the course.
        return this.activityHasGroups(cmId, siteId, ignoreCache).then(function (hasGroups) {
            if (hasGroups) {
                // Get the groups available for the user.
                return _this.getActivityAllowedGroups(cmId, userId, siteId, ignoreCache);
            }
            return {
                groups: []
            };
        });
    };
    /**
     * Helper function to get activity group info (group mode and list of groups).
     *
     * @param cmId Course module ID.
     * @param addAllParts Deprecated.
     * @param userId User ID. If not defined, use current user.
     * @param siteId Site ID. If not defined, current site.
     * @param ignoreCache True if it should ignore cached data (it will always fail in offline or server down).
     * @return Promise resolved with the group info.
     */
    CoreGroupsProvider.prototype.getActivityGroupInfo = function (cmId, addAllParts, userId, siteId, ignoreCache) {
        var _this = this;
        var groupInfo = {
            groups: []
        };
        return this.getActivityGroupMode(cmId, siteId, ignoreCache).then(function (groupMode) {
            groupInfo.separateGroups = groupMode === CoreGroupsProvider_1.SEPARATEGROUPS;
            groupInfo.visibleGroups = groupMode === CoreGroupsProvider_1.VISIBLEGROUPS;
            if (groupInfo.separateGroups || groupInfo.visibleGroups) {
                return _this.getActivityAllowedGroups(cmId, userId, siteId, ignoreCache);
            }
            return {
                groups: [],
                canaccessallgroups: false
            };
        }).then(function (result) {
            if (result.groups.length <= 0) {
                groupInfo.separateGroups = false;
                groupInfo.visibleGroups = false;
                groupInfo.defaultGroupId = 0;
            }
            else {
                // The "canaccessallgroups" field was added in 3.4. Add all participants for visible groups in previous versions.
                if (result.canaccessallgroups || (typeof result.canaccessallgroups == 'undefined' && groupInfo.visibleGroups)) {
                    groupInfo.groups.push({ id: 0, name: _this.translate.instant('core.allparticipants') });
                    groupInfo.defaultGroupId = 0;
                }
                else {
                    groupInfo.defaultGroupId = result.groups[0].id;
                }
                groupInfo.groups = groupInfo.groups.concat(result.groups);
            }
            return groupInfo;
        });
    };
    /**
     * Get the group mode of an activity.
     *
     * @param cmId Course module ID.
     * @param siteId Site ID. If not defined, current site.
     * @param ignoreCache True if it should ignore cached data (it will always fail in offline or server down).
     * @return Promise resolved when the group mode is retrieved.
     */
    CoreGroupsProvider.prototype.getActivityGroupMode = function (cmId, siteId, ignoreCache) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var params = {
                cmid: cmId
            }, preSets = {
                cacheKey: _this.getActivityGroupModeCacheKey(cmId),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            if (ignoreCache) {
                preSets.getFromCache = false;
                preSets.emergencyCache = false;
            }
            return site.read('core_group_get_activity_groupmode', params, preSets).then(function (response) {
                if (!response || typeof response.groupmode == 'undefined') {
                    return Promise.reject(null);
                }
                return response.groupmode;
            });
        });
    };
    /**
     * Get cache key for group mode WS calls.
     *
     * @param cmId Course module ID.
     * @return Cache key.
     */
    CoreGroupsProvider.prototype.getActivityGroupModeCacheKey = function (cmId) {
        return this.ROOT_CACHE_KEY + 'groupmode:' + cmId;
    };
    /**
     * Get user groups in all the user enrolled courses.
     *
     * @param siteId Site to get the groups from. If not defined, use current site.
     * @return Promise resolved when the groups are retrieved.
     */
    CoreGroupsProvider.prototype.getAllUserGroups = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            siteId = siteId || site.getId();
            if (site.isVersionGreaterEqualThan('3.6')) {
                return _this.getUserGroupsInCourse(0, siteId);
            }
            return _this.coursesProvider.getUserCourses(false, siteId).then(function (courses) {
                courses.push({ id: site.getSiteHomeId() }); // Add front page.
                return _this.getUserGroups(courses, siteId);
            });
        });
    };
    /**
     * Get user groups in all the supplied courses.
     *
     * @param courses List of courses or course ids to get the groups from.
     * @param siteId Site to get the groups from. If not defined, use current site.
     * @param userId ID of the user. If not defined, use the userId related to siteId.
     * @return Promise resolved when the groups are retrieved.
     */
    CoreGroupsProvider.prototype.getUserGroups = function (courses, siteId, userId) {
        var _this = this;
        // Get all courses one by one.
        var promises = courses.map(function (course) {
            var courseId = typeof course == 'object' ? course.id : course;
            return _this.getUserGroupsInCourse(courseId, siteId, userId);
        });
        return Promise.all(promises).then(function (courseGroups) {
            return [].concat.apply([], courseGroups);
        });
    };
    /**
     * Get user groups in a course.
     *
     * @param courseId ID of the course. 0 to get all enrolled courses groups (Moodle version > 3.6).
     * @param siteId Site to get the groups from. If not defined, use current site.
     * @param userId ID of the user. If not defined, use ID related to siteid.
     * @return Promise resolved when the groups are retrieved.
     */
    CoreGroupsProvider.prototype.getUserGroupsInCourse = function (courseId, siteId, userId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            userId = userId || site.getUserId();
            var data = {
                userid: userId,
                courseid: courseId
            }, preSets = {
                cacheKey: _this.getUserGroupsInCourseCacheKey(courseId, userId),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            return site.read('core_group_get_course_user_groups', data, preSets).then(function (response) {
                if (response && response.groups) {
                    return response.groups;
                }
                else {
                    return Promise.reject(null);
                }
            });
        });
    };
    /**
     * Get prefix cache key for  user groups in course WS calls.
     *
     * @return Prefix Cache key.
     */
    CoreGroupsProvider.prototype.getUserGroupsInCoursePrefixCacheKey = function () {
        return this.ROOT_CACHE_KEY + 'courseGroups:';
    };
    /**
     * Get cache key for user groups in course WS calls.
     *
     * @param courseId Course ID.
     * @param userId User ID.
     * @return Cache key.
     */
    CoreGroupsProvider.prototype.getUserGroupsInCourseCacheKey = function (courseId, userId) {
        return this.getUserGroupsInCoursePrefixCacheKey() + courseId + ':' + userId;
    };
    /**
     * Invalidates activity allowed groups.
     *
     * @param cmId Course module ID.
     * @param userId User ID. If not defined, use current user.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreGroupsProvider.prototype.invalidateActivityAllowedGroups = function (cmId, userId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            userId = userId || site.getUserId();
            return site.invalidateWsCacheForKey(_this.getActivityAllowedGroupsCacheKey(cmId, userId));
        });
    };
    /**
     * Invalidates activity group mode.
     *
     * @param cmId Course module ID.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreGroupsProvider.prototype.invalidateActivityGroupMode = function (cmId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getActivityGroupModeCacheKey(cmId));
        });
    };
    /**
     * Invalidates all activity group info: mode and allowed groups.
     *
     * @param cmId Course module ID.
     * @param userId User ID. If not defined, use current user.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreGroupsProvider.prototype.invalidateActivityGroupInfo = function (cmId, userId, siteId) {
        var promises = [];
        promises.push(this.invalidateActivityAllowedGroups(cmId, userId, siteId));
        promises.push(this.invalidateActivityGroupMode(cmId, siteId));
        return Promise.all(promises);
    };
    /**
     * Invalidates user groups in all user enrolled courses.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreGroupsProvider.prototype.invalidateAllUserGroups = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            if (site.isVersionGreaterEqualThan('3.6')) {
                return _this.invalidateUserGroupsInCourse(0, siteId);
            }
            return site.invalidateWsCacheForKeyStartingWith(_this.getUserGroupsInCoursePrefixCacheKey());
        });
    };
    /**
     * Invalidates user groups in courses.
     *
     * @param courses List of courses or course ids.
     * @param siteId Site ID. If not defined, current site.
     * @param userId User ID. If not defined, use current user.
     * @return Promise resolved when the data is invalidated.
     */
    CoreGroupsProvider.prototype.invalidateUserGroups = function (courses, siteId, userId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            userId = userId || site.getUserId();
            var promises = courses.map(function (course) {
                var courseId = typeof course == 'object' ? course.id : course;
                return _this.invalidateUserGroupsInCourse(courseId, site.id, userId);
            });
            return Promise.all(promises);
        });
    };
    /**
     * Invalidates user groups in course.
     *
     * @param courseId ID of the course. 0 to get all enrolled courses groups (Moodle version > 3.6).
     * @param siteId Site ID. If not defined, current site.
     * @param userId User ID. If not defined, use current user.
     * @return Promise resolved when the data is invalidated.
     */
    CoreGroupsProvider.prototype.invalidateUserGroupsInCourse = function (courseId, siteId, userId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            userId = userId || site.getUserId();
            return site.invalidateWsCacheForKey(_this.getUserGroupsInCourseCacheKey(courseId, userId));
        });
    };
    /**
     * Validate a group ID. If the group is not visible by the user, it will return the first group ID.
     *
     * @param groupId Group ID to validate.
     * @param groupInfo Group info.
     * @return Group ID to use.
     */
    CoreGroupsProvider.prototype.validateGroupId = function (groupId, groupInfo) {
        if (groupId > 0 && groupInfo && groupInfo.groups && groupInfo.groups.length > 0) {
            // Check if the group is in the list of groups.
            if (groupInfo.groups.some(function (group) { return groupId == group.id; })) {
                return groupId;
            }
        }
        return groupInfo.defaultGroupId;
    };
    // Group mode constants.
    CoreGroupsProvider.NOGROUPS = 0;
    CoreGroupsProvider.SEPARATEGROUPS = 1;
    CoreGroupsProvider.VISIBLEGROUPS = 2;
    CoreGroupsProvider = CoreGroupsProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreSitesProvider, TranslateService,
            CoreCoursesProvider])
    ], CoreGroupsProvider);
    return CoreGroupsProvider;
    var CoreGroupsProvider_1;
}());
export { CoreGroupsProvider };
var CoreGroups = /** @class */ (function (_super) {
    __extends(CoreGroups, _super);
    function CoreGroups() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreGroups;
}(makeSingleton(CoreGroupsProvider)));
export { CoreGroups };
//# sourceMappingURL=groups.js.map