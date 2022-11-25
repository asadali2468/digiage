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
import { CoreSitesProvider } from '@providers/sites';
/**
 * Service to handle offline data for courses.
 */
var CoreCourseOfflineProvider = /** @class */ (function () {
    function CoreCourseOfflineProvider(sitesProvider) {
        this.sitesProvider = sitesProvider;
        this.siteSchema = {
            name: 'CoreCourseOfflineProvider',
            version: 1,
            tables: [
                {
                    name: CoreCourseOfflineProvider_1.MANUAL_COMPLETION_TABLE,
                    columns: [
                        {
                            name: 'cmid',
                            type: 'INTEGER',
                            primaryKey: true
                        },
                        {
                            name: 'completed',
                            type: 'INTEGER'
                        },
                        {
                            name: 'courseid',
                            type: 'INTEGER'
                        },
                        {
                            name: 'coursename',
                            type: 'TEXT'
                        },
                        {
                            name: 'timecompleted',
                            type: 'INTEGER'
                        }
                    ]
                }
            ]
        };
        this.sitesProvider.registerSiteSchema(this.siteSchema);
    }
    CoreCourseOfflineProvider_1 = CoreCourseOfflineProvider;
    /**
     * Delete a manual completion stored.
     *
     * @param cmId The module ID to remove the completion.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when deleted, rejected if failure.
     */
    CoreCourseOfflineProvider.prototype.deleteManualCompletion = function (cmId, siteId) {
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.getDb().deleteRecords(CoreCourseOfflineProvider_1.MANUAL_COMPLETION_TABLE, { cmid: cmId });
        });
    };
    /**
     * Get all offline manual completions for a certain course.
     *
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the list of completions.
     */
    CoreCourseOfflineProvider.prototype.getAllManualCompletions = function (siteId) {
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.getDb().getRecords(CoreCourseOfflineProvider_1.MANUAL_COMPLETION_TABLE);
        });
    };
    /**
     * Get all offline manual completions for a certain course.
     *
     * @param courseId Course ID the module belongs to.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the list of completions.
     */
    CoreCourseOfflineProvider.prototype.getCourseManualCompletions = function (courseId, siteId) {
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.getDb().getRecords(CoreCourseOfflineProvider_1.MANUAL_COMPLETION_TABLE, { courseid: courseId });
        });
    };
    /**
     * Get the offline manual completion for a certain module.
     *
     * @param cmId The module ID to remove the completion.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the completion, rejected if failure or not found.
     */
    CoreCourseOfflineProvider.prototype.getManualCompletion = function (cmId, siteId) {
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.getDb().getRecord(CoreCourseOfflineProvider_1.MANUAL_COMPLETION_TABLE, { cmid: cmId });
        });
    };
    /**
     * Offline version for manually marking a module as completed.
     *
     * @param cmId The module ID to store the completion.
     * @param completed Whether the module is completed or not.
     * @param courseId Course ID the module belongs to.
     * @param courseName Course name. Recommended, it is used to display a better warning message.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when completion is successfully stored.
     */
    CoreCourseOfflineProvider.prototype.markCompletedManually = function (cmId, completed, courseId, courseName, siteId) {
        // Store the offline data.
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var entry = {
                cmid: cmId,
                completed: completed,
                courseid: courseId,
                coursename: courseName || '',
                timecompleted: Date.now()
            };
            return site.getDb().insertRecord(CoreCourseOfflineProvider_1.MANUAL_COMPLETION_TABLE, entry);
        }).then(function () {
            return {
                status: true,
                offline: true
            };
        });
    };
    // Variables for database.
    CoreCourseOfflineProvider.MANUAL_COMPLETION_TABLE = 'course_manual_completion';
    CoreCourseOfflineProvider = CoreCourseOfflineProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreSitesProvider])
    ], CoreCourseOfflineProvider);
    return CoreCourseOfflineProvider;
    var CoreCourseOfflineProvider_1;
}());
export { CoreCourseOfflineProvider };
//# sourceMappingURL=course-offline.js.map