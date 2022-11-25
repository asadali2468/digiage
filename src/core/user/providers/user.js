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
import { CoreFilepoolProvider } from '@providers/filepool';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSite } from '@classes/site';
import { CoreSitesProvider } from '@providers/sites';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CoreAppProvider } from '@providers/app';
import { CoreUserOfflineProvider } from './offline';
import { CorePushNotificationsProvider } from '@core/pushnotifications/providers/pushnotifications';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Service to provide user functionalities.
 */
var CoreUserProvider = /** @class */ (function () {
    function CoreUserProvider(logger, sitesProvider, utils, filepoolProvider, appProvider, userOffline, pushNotificationsProvider) {
        this.sitesProvider = sitesProvider;
        this.utils = utils;
        this.filepoolProvider = filepoolProvider;
        this.appProvider = appProvider;
        this.userOffline = userOffline;
        this.pushNotificationsProvider = pushNotificationsProvider;
        this.ROOT_CACHE_KEY = 'mmUser:';
        // Variables for database.
        this.USERS_TABLE = 'users';
        this.siteSchema = {
            name: 'CoreUserProvider',
            version: 1,
            canBeCleared: [this.USERS_TABLE],
            tables: [
                {
                    name: this.USERS_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'INTEGER',
                            primaryKey: true
                        },
                        {
                            name: 'fullname',
                            type: 'TEXT'
                        },
                        {
                            name: 'profileimageurl',
                            type: 'TEXT'
                        }
                    ],
                }
            ]
        };
        this.logger = logger.getInstance('CoreUserProvider');
        this.sitesProvider.registerSiteSchema(this.siteSchema);
    }
    CoreUserProvider_1 = CoreUserProvider;
    /**
     * Check if WS to search participants is available in site.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with boolean: whether it's available.
     * @since 3.8
     */
    CoreUserProvider.prototype.canSearchParticipants = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return _this.canSearchParticipantsInSite(site);
        });
    };
    /**
     * Check if WS to search participants is available in site.
     *
     * @param site Site. If not defined, current site.
     * @return Whether it's available.
     * @since 3.8
     */
    CoreUserProvider.prototype.canSearchParticipantsInSite = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.wsAvailable('core_enrol_search_users');
    };
    /**
     * Change the given user profile picture.
     *
     * @param draftItemId New picture draft item id.
     * @param userId User ID.
     * @return Promise resolve with the new profileimageurl
     */
    CoreUserProvider.prototype.changeProfilePicture = function (draftItemId, userId) {
        var data = {
            draftitemid: draftItemId,
            delete: 0,
            userid: userId
        };
        return this.sitesProvider.getCurrentSite().write('core_user_update_picture', data).then(function (result) {
            if (!result.success) {
                return Promise.reject(null);
            }
            return result.profileimageurl;
        });
    };
    /**
     * Store user basic information in local DB to be retrieved if the WS call fails.
     *
     * @param userId User ID.
     * @param siteId ID of the site. If not defined, use current site.
     * @return Promise resolve when the user is deleted.
     */
    CoreUserProvider.prototype.deleteStoredUser = function (userId, siteId) {
        var _this = this;
        if (isNaN(userId)) {
            return Promise.reject(null);
        }
        var promises = [];
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        // Invalidate WS calls.
        promises.push(this.invalidateUserCache(userId, siteId));
        promises.push(this.sitesProvider.getSite(siteId).then(function (site) {
            return site.getDb().deleteRecords(_this.USERS_TABLE, { id: userId });
        }));
        return Promise.all(promises);
    };
    /**
     * Get participants for a certain course.
     *
     * @param courseId ID of the course.
     * @param limitFrom Position of the first participant to get.
     * @param limitNumber Number of participants to get.
     * @param siteId Site Id. If not defined, use current site.
     * @param ignoreCache True if it should ignore cached data (it will always fail in offline or server down).
     * @return Promise resolved when the participants are retrieved.
     */
    CoreUserProvider.prototype.getParticipants = function (courseId, limitFrom, limitNumber, siteId, ignoreCache) {
        var _this = this;
        if (limitFrom === void 0) { limitFrom = 0; }
        if (limitNumber === void 0) { limitNumber = CoreUserProvider_1.PARTICIPANTS_LIST_LIMIT; }
        return this.sitesProvider.getSite(siteId).then(function (site) {
            _this.logger.debug("Get participants for course '" + courseId + "' starting at '" + limitFrom + "'");
            var data = {
                courseid: courseId,
                options: [
                    {
                        name: 'limitfrom',
                        value: limitFrom
                    },
                    {
                        name: 'limitnumber',
                        value: limitNumber
                    },
                    {
                        name: 'sortby',
                        value: 'siteorder'
                    }
                ]
            }, preSets = {
                cacheKey: _this.getParticipantsListCacheKey(courseId),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            if (ignoreCache) {
                preSets.getFromCache = false;
                preSets.emergencyCache = false;
            }
            return site.read('core_enrol_get_enrolled_users', data, preSets).then(function (users) {
                var canLoadMore = users.length >= limitNumber;
                _this.storeUsers(users, siteId);
                return { participants: users, canLoadMore: canLoadMore };
            });
        });
    };
    /**
     * Get cache key for participant list WS calls.
     *
     * @param courseId Course ID.
     * @return Cache key.
     */
    CoreUserProvider.prototype.getParticipantsListCacheKey = function (courseId) {
        return this.ROOT_CACHE_KEY + 'list:' + courseId;
    };
    /**
     * Get user profile. The type of profile retrieved depends on the params.
     *
     * @param userId User's ID.
     * @param courseId Course ID to get course profile, undefined or 0 to get site profile.
     * @param forceLocal True to retrieve the user data from local DB, false to retrieve it from WS.
     * @param siteId ID of the site. If not defined, use current site.
     * @return Promise resolved with the user data.
     */
    CoreUserProvider.prototype.getProfile = function (userId, courseId, forceLocal, siteId) {
        var _this = this;
        if (forceLocal === void 0) { forceLocal = false; }
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        if (forceLocal) {
            return this.getUserFromLocalDb(userId, siteId).catch(function () {
                return _this.getUserFromWS(userId, courseId, siteId);
            });
        }
        return this.getUserFromWS(userId, courseId, siteId).catch(function () {
            return _this.getUserFromLocalDb(userId, siteId);
        });
    };
    /**
     * Get cache key for a user WS call.
     *
     * @param userId User ID.
     * @return Cache key.
     */
    CoreUserProvider.prototype.getUserCacheKey = function (userId) {
        return this.ROOT_CACHE_KEY + 'data:' + userId;
    };
    /**
     * Get user basic information from local DB.
     *
     * @param userId User ID.
     * @param siteId ID of the site. If not defined, use current site.
     * @return Promise resolve when the user is retrieved.
     */
    CoreUserProvider.prototype.getUserFromLocalDb = function (userId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.getDb().getRecord(_this.USERS_TABLE, { id: userId });
        });
    };
    /**
     * Get user profile from WS.
     *
     * @param userId User ID.
     * @param courseId Course ID to get course profile, undefined or 0 to get site profile.
     * @param siteId ID of the site. If not defined, use current site.
     * @return Promise resolve when the user is retrieved.
     */
    CoreUserProvider.prototype.getUserFromWS = function (userId, courseId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var presets = {
                cacheKey: _this.getUserCacheKey(userId),
                updateFrequency: CoreSite.FREQUENCY_RARELY
            };
            var wsName, data;
            // Determine WS and data to use.
            if (courseId && courseId != site.getSiteHomeId()) {
                _this.logger.debug("Get participant with ID '" + userId + "' in course '" + courseId);
                wsName = 'core_user_get_course_user_profiles';
                data = {
                    userlist: [
                        {
                            userid: userId,
                            courseid: courseId
                        }
                    ]
                };
            }
            else {
                _this.logger.debug("Get user with ID '" + userId + "'");
                wsName = 'core_user_get_users_by_field';
                data = {
                    field: 'id',
                    values: [userId]
                };
            }
            return site.read(wsName, data, presets).then(function (users) {
                if (users.length == 0) {
                    return Promise.reject('Cannot retrieve user info.');
                }
                var user = users.shift();
                if (user.country) {
                    user.country = _this.utils.getCountryName(user.country);
                }
                _this.storeUser(user.id, user.fullname, user.profileimageurl);
                return user;
            });
        });
    };
    /**
     * Get a user preference (online or offline).
     *
     * @param name Name of the preference.
     * @param siteId Site Id. If not defined, use current site.
     * @return Preference value or null if preference not set.
     */
    CoreUserProvider.prototype.getUserPreference = function (name, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        return this.userOffline.getPreference(name, siteId).catch(function () {
            return null;
        }).then(function (preference) {
            if (preference && !_this.appProvider.isOnline()) {
                // Offline, return stored value.
                return preference.value;
            }
            return _this.getUserPreferenceOnline(name, siteId).then(function (wsValue) {
                if (preference && preference.value != preference.onlinevalue && preference.onlinevalue == wsValue) {
                    // Sync is pending for this preference, return stored value.
                    return preference.value;
                }
                return _this.userOffline.setPreference(name, wsValue, wsValue).then(function () {
                    return wsValue;
                });
            });
        });
    };
    /**
     * Get cache key for a user preference WS call.
     *
     * @param name Preference name.
     * @return Cache key.
     */
    CoreUserProvider.prototype.getUserPreferenceCacheKey = function (name) {
        return this.ROOT_CACHE_KEY + 'preference:' + name;
    };
    /**
     * Get a user preference online.
     *
     * @param name Name of the preference.
     * @param siteId Site Id. If not defined, use current site.
     * @return Preference value or null if preference not set.
     */
    CoreUserProvider.prototype.getUserPreferenceOnline = function (name, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var data = { name: name };
            var preSets = {
                cacheKey: _this.getUserPreferenceCacheKey(data.name),
                updateFrequency: CoreSite.FREQUENCY_SOMETIMES
            };
            return site.read('core_user_get_user_preferences', data, preSets).then(function (result) {
                return result.preferences[0] ? result.preferences[0].value : null;
            });
        });
    };
    /**
     * Invalidates user WS calls.
     *
     * @param userId User ID.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreUserProvider.prototype.invalidateUserCache = function (userId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getUserCacheKey(userId));
        });
    };
    /**
     * Invalidates participant list for a certain course.
     *
     * @param courseId Course ID.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved when the list is invalidated.
     */
    CoreUserProvider.prototype.invalidateParticipantsList = function (courseId, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getParticipantsListCacheKey(courseId));
        });
    };
    /**
     * Invalidate user preference.
     *
     * @param name Name of the preference.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved when the data is invalidated.
     */
    CoreUserProvider.prototype.invalidateUserPreference = function (name, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.invalidateWsCacheForKey(_this.getUserPreferenceCacheKey(name));
        });
    };
    /**
     * Check if course participants is disabled in a certain site.
     *
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved with true if disabled, rejected or resolved with false otherwise.
     */
    CoreUserProvider.prototype.isParticipantsDisabled = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return _this.isParticipantsDisabledInSite(site);
        });
    };
    /**
     * Check if course participants is disabled in a certain site.
     *
     * @param site Site. If not defined, use current site.
     * @return Whether it's disabled.
     */
    CoreUserProvider.prototype.isParticipantsDisabledInSite = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.isFeatureDisabled('CoreCourseOptionsDelegate_CoreUserParticipants');
    };
    /**
     * Returns whether or not participants is enabled for a certain course.
     *
     * @param courseId Course ID.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved with true if plugin is enabled, rejected or resolved with false otherwise.
     */
    CoreUserProvider.prototype.isPluginEnabledForCourse = function (courseId, siteId) {
        if (!courseId) {
            return Promise.reject(null);
        }
        // Retrieving one participant will fail if browsing users is disabled by capabilities.
        return this.utils.promiseWorks(this.getParticipants(courseId, 0, 1, siteId));
    };
    /**
     * Check if update profile picture is disabled in a certain site.
     *
     * @param site Site. If not defined, use current site.
     * @return True if disabled, false otherwise.
     */
    CoreUserProvider.prototype.isUpdatePictureDisabledInSite = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.isFeatureDisabled('CoreUserDelegate_picture');
    };
    /**
     * Log User Profile View in Moodle.
     * @param userId User ID.
     * @param courseId Course ID.
     * @param name Name of the user.
     * @return Promise resolved when done.
     */
    CoreUserProvider.prototype.logView = function (userId, courseId, name) {
        var params = {
            userid: userId
        }, wsName = 'core_user_view_user_profile';
        if (courseId) {
            params['courseid'] = courseId;
        }
        this.pushNotificationsProvider.logViewEvent(userId, name, 'user', wsName, { courseid: courseId });
        return this.sitesProvider.getCurrentSite().write(wsName, params);
    };
    /**
     * Log Participants list view in Moodle.
     * @param courseId Course ID.
     * @return Promise resolved when done.
     */
    CoreUserProvider.prototype.logParticipantsView = function (courseId) {
        var params = {
            courseid: courseId
        };
        this.pushNotificationsProvider.logViewListEvent('user', 'core_user_view_user_list', params);
        return this.sitesProvider.getCurrentSite().write('core_user_view_user_list', params);
    };
    /**
     * Prefetch user profiles and their images from a certain course. It prevents duplicates.
     *
     * @param userIds List of user IDs.
     * @param courseId Course the users belong to.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when prefetched.
     */
    CoreUserProvider.prototype.prefetchProfiles = function (userIds, courseId, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        var treated = {}, promises = [];
        userIds.forEach(function (userId) {
            if (userId === null) {
                return;
            }
            userId = Number(userId); // Make sure it's a number.
            // Prevent repeats and errors.
            if (!isNaN(userId) && !treated[userId] && userId > 0) {
                treated[userId] = true;
                promises.push(_this.getProfile(userId, courseId, false, siteId).then(function (profile) {
                    if (profile.profileimageurl) {
                        return _this.filepoolProvider.addToQueueByUrl(siteId, profile.profileimageurl);
                    }
                }).catch(function (error) {
                    _this.logger.warn("Ignore error when prefetching user " + userId, error);
                }));
            }
        });
        return Promise.all(promises);
    };
    /**
     * Prefetch user avatars. It prevents duplicates.
     *
     * @param entries List of entries that have the images.
     * @param propertyName The name of the property that contains the image.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when prefetched.
     */
    CoreUserProvider.prototype.prefetchUserAvatars = function (entries, propertyName, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var treated, promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = siteId || this.sitesProvider.getCurrentSiteId();
                        treated = {};
                        promises = entries.map(function (entry) { return __awaiter(_this, void 0, void 0, function () {
                            var imageUrl, ex_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        imageUrl = entry[propertyName];
                                        if (!imageUrl || treated[imageUrl]) {
                                            // It doesn't have an image or it has already been treated.
                                            return [2 /*return*/];
                                        }
                                        treated[imageUrl] = true;
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, this.filepoolProvider.addToQueueByUrl(siteId, imageUrl)];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        ex_1 = _a.sent();
                                        this.logger.warn("Ignore error when prefetching user avatar " + imageUrl, entry, ex_1);
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Search participants in a certain course.
     *
     * @param courseId ID of the course.
     * @param search The string to search.
     * @param searchAnywhere Whether to find a match anywhere or only at the beginning.
     * @param page Page to get.
     * @param limitNumber Number of participants to get.
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved when the participants are retrieved.
     * @since 3.8
     */
    CoreUserProvider.prototype.searchParticipants = function (courseId, search, searchAnywhere, page, perPage, siteId) {
        var _this = this;
        if (searchAnywhere === void 0) { searchAnywhere = true; }
        if (page === void 0) { page = 0; }
        if (perPage === void 0) { perPage = CoreUserProvider_1.PARTICIPANTS_LIST_LIMIT; }
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var data = {
                courseid: courseId,
                search: search,
                searchanywhere: searchAnywhere ? 1 : 0,
                page: page,
                perpage: perPage,
            }, preSets = {
                getFromCache: false // Always try to get updated data. If it fails, it will get it from cache.
            };
            return site.read('core_enrol_search_users', data, preSets).then(function (users) {
                var canLoadMore = users.length >= perPage;
                _this.storeUsers(users, siteId);
                return { participants: users, canLoadMore: canLoadMore };
            });
        });
    };
    /**
     * Store user basic information in local DB to be retrieved if the WS call fails.
     *
     * @param userId User ID.
     * @param fullname User full name.
     * @param avatar User avatar URL.
     * @param siteId ID of the site. If not defined, use current site.
     * @return Promise resolve when the user is stored.
     */
    CoreUserProvider.prototype.storeUser = function (userId, fullname, avatar, siteId) {
        var _this = this;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var userRecord = {
                id: userId,
                fullname: fullname,
                profileimageurl: avatar
            };
            return site.getDb().insertRecord(_this.USERS_TABLE, userRecord);
        });
    };
    /**
     * Store users basic information in local DB.
     *
     * @param users Users to store. Fields stored: id, fullname, profileimageurl.
     * @param siteId ID of the site. If not defined, use current site.
     * @return Promise resolve when the user is stored.
     */
    CoreUserProvider.prototype.storeUsers = function (users, siteId) {
        var _this = this;
        var promises = [];
        users.forEach(function (user) {
            if (typeof user.id != 'undefined' && !isNaN(parseInt(user.id, 10))) {
                promises.push(_this.storeUser(parseInt(user.id, 10), user.fullname, user.profileimageurl, siteId));
            }
        });
        return Promise.all(promises);
    };
    /**
     * Set a user preference (online or offline).
     *
     * @param name Name of the preference.
     * @param value Value of the preference.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved on success.
     */
    CoreUserProvider.prototype.setUserPreference = function (name, value, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        var isOnline = this.appProvider.isOnline();
        var promise;
        if (isOnline) {
            var preferences = [{ type: name, value: value }];
            promise = this.updateUserPreferences(preferences, undefined, undefined, siteId).catch(function (error) {
                // Preference not saved online.
                isOnline = false;
                return Promise.reject(error);
            });
        }
        else {
            promise = Promise.resolve();
        }
        return promise.finally(function () {
            // Update stored online value if saved online.
            var onlineValue = isOnline ? value : undefined;
            return Promise.all([
                _this.userOffline.setPreference(name, value, onlineValue),
                _this.invalidateUserPreference(name).catch(function () {
                    // Ignore error.
                })
            ]);
        });
    };
    /**
     * Update a preference for a user.
     *
     * @param name Preference name.
     * @param value Preference new value.
     * @param userId User ID. If not defined, site's current user.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved if success.
     */
    CoreUserProvider.prototype.updateUserPreference = function (name, value, userId, siteId) {
        var preferences = [
            {
                type: name,
                value: value
            }
        ];
        return this.updateUserPreferences(preferences, undefined, userId, siteId);
    };
    /**
     * Update some preferences for a user.
     *
     * @param preferences List of preferences.
     * @param disableNotifications Whether to disable all notifications. Undefined to not update this value.
     * @param userId User ID. If not defined, site's current user.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved if success.
     */
    CoreUserProvider.prototype.updateUserPreferences = function (preferences, disableNotifications, userId, siteId) {
        return this.sitesProvider.getSite(siteId).then(function (site) {
            userId = userId || site.getUserId();
            var data = {
                userid: userId,
                preferences: preferences
            }, preSets = {
                responseExpected: false
            };
            if (typeof disableNotifications != 'undefined') {
                data['emailstop'] = disableNotifications ? 1 : 0;
            }
            return site.write('core_user_update_user_preferences', data, preSets);
        });
    };
    CoreUserProvider.PARTICIPANTS_LIST_LIMIT = 50; // Max of participants to retrieve in each WS call.
    CoreUserProvider.PROFILE_REFRESHED = 'CoreUserProfileRefreshed';
    CoreUserProvider.PROFILE_PICTURE_UPDATED = 'CoreUserProfilePictureUpdated';
    CoreUserProvider = CoreUserProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider, CoreSitesProvider, CoreUtilsProvider,
            CoreFilepoolProvider, CoreAppProvider,
            CoreUserOfflineProvider, CorePushNotificationsProvider])
    ], CoreUserProvider);
    return CoreUserProvider;
    var CoreUserProvider_1;
}());
export { CoreUserProvider };
var CoreUser = /** @class */ (function (_super) {
    __extends(CoreUser, _super);
    function CoreUser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreUser;
}(makeSingleton(CoreUserProvider)));
export { CoreUser };
//# sourceMappingURL=user.js.map