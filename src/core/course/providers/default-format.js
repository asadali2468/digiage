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
import { Injectable, Injector } from '@angular/core';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { CoreLoginHelperProvider } from '@core/login/providers/helper';
/**
 * Default handler used when the course format doesn't have a specific implementation.
 */
var CoreCourseFormatDefaultHandler = /** @class */ (function () {
    function CoreCourseFormatDefaultHandler(coursesProvider, injector) {
        this.coursesProvider = coursesProvider;
        this.injector = injector;
        this.name = 'CoreCourseFormatDefault';
        this.format = 'default';
    }
    /**
     * Whether or not the handler is enabled on a site level.
     *
     * @return True or promise resolved with true if enabled.
     */
    CoreCourseFormatDefaultHandler.prototype.isEnabled = function () {
        return true;
    };
    /**
     * Get the title to use in course page.
     *
     * @param course The course.
     * @return Title.
     */
    CoreCourseFormatDefaultHandler.prototype.getCourseTitle = function (course) {
        if (course.displayname) {
            return course.displayname;
        }
        else if (course.fullname) {
            return course.fullname;
        }
        else {
            return '';
        }
    };
    /**
     * Whether it allows seeing all sections at the same time. Defaults to true.
     *
     * @param course The course to check.
     * @return Whether it can view all sections.
     */
    CoreCourseFormatDefaultHandler.prototype.canViewAllSections = function (course) {
        return true;
    };
    /**
     * Whether the option blocks should be displayed. Defaults to true.
     *
     * @param course The course to check.
     * @return Whether it can display blocks.
     */
    CoreCourseFormatDefaultHandler.prototype.displayBlocks = function (course) {
        return true;
    };
    /**
     * Whether the option to enable section/module download should be displayed. Defaults to true.
     *
     * @param course The course to check.
     * @return Whether the option to enable section/module download should be displayed
     */
    CoreCourseFormatDefaultHandler.prototype.displayEnableDownload = function (course) {
        return true;
    };
    /**
     * Whether the default section selector should be displayed. Defaults to true.
     *
     * @param course The course to check.
     * @return Whether the default section selector should be displayed.
     */
    CoreCourseFormatDefaultHandler.prototype.displaySectionSelector = function (course) {
        return true;
    };
    /**
     * Whether the course refresher should be displayed. If it returns false, a refresher must be included in the course format,
     * and the doRefresh method of CoreCourseSectionPage must be called on refresh. Defaults to true.
     *
     * @param course The course to check.
     * @param sections List of course sections.
     * @return Whether the refresher should be displayed.
     */
    CoreCourseFormatDefaultHandler.prototype.displayRefresher = function (course, sections) {
        return true;
    };
    /**
     * Given a list of sections, get the "current" section that should be displayed first.
     *
     * @param course The course to get the title.
     * @param sections List of sections.
     * @return Current section (or promise resolved with current section).
     */
    CoreCourseFormatDefaultHandler.prototype.getCurrentSection = function (course, sections) {
        var promise;
        // We need the "marker" to determine the current section.
        if (typeof course.marker != 'undefined') {
            // We already have it.
            promise = Promise.resolve(course.marker);
        }
        else if (!this.coursesProvider.isGetCoursesByFieldAvailable()) {
            // Cannot get the current section, return all of them.
            return sections[0];
        }
        else {
            // Try to retrieve the marker.
            promise = this.coursesProvider.getCourseByField('id', course.id).catch(function () {
                // Ignore errors.
            }).then(function (course) {
                return course && course.marker;
            });
        }
        return promise.then(function (marker) {
            if (marker > 0) {
                // Find the marked section.
                var section = sections.find(function (sect) {
                    return sect.section == marker;
                });
                if (section) {
                    return section;
                }
            }
            // Marked section not found or we couldn't retrieve the marker. Return all sections.
            return sections[0];
        });
    };
    /**
     * Invalidate the data required to load the course format.
     *
     * @param course The course to get the title.
     * @param sections List of sections.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCourseFormatDefaultHandler.prototype.invalidateData = function (course, sections) {
        return this.coursesProvider.invalidateCoursesByField('id', course.id);
    };
    /**
     * Open the page to display a course. If not defined, the page CoreCourseSectionPage will be opened.
     * Implement it only if you want to create your own page to display the course. In general it's better to use the method
     * getCourseFormatComponent because it will display the course handlers at the top.
     * Your page should include the course handlers using CoreCoursesDelegate.
     *
     * @param navCtrl The NavController instance to use. If not defined, please use loginHelper.redirect.
     * @param course The course to open. It should contain a "format" attribute.
     * @param params Params to pass to the course page.
     * @return Promise resolved when done.
     */
    CoreCourseFormatDefaultHandler.prototype.openCourse = function (navCtrl, course, params) {
        params = params || {};
        Object.assign(params, { course: course });
        if (navCtrl) {
            // Don't return the .push promise, we don't want to display a loading modal during the page transition.
            navCtrl.push('CoreCourseSectionPage', params);
            return Promise.resolve();
        }
        else {
            // Open the course in the "phantom" tab.
            this.loginHelper = this.loginHelper || this.injector.get(CoreLoginHelperProvider);
            return this.loginHelper.redirect('CoreCourseSectionPage', params);
        }
    };
    /**
     * Whether the view should be refreshed when completion changes. If your course format doesn't display
     * activity completion then you should return false.
     *
     * @param course The course.
     * @return Whether course view should be refreshed when an activity completion changes.
     */
    CoreCourseFormatDefaultHandler.prototype.shouldRefreshWhenCompletionChanges = function (course) {
        return true;
    };
    CoreCourseFormatDefaultHandler = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreCoursesProvider, Injector])
    ], CoreCourseFormatDefaultHandler);
    return CoreCourseFormatDefaultHandler;
}());
export { CoreCourseFormatDefaultHandler };
//# sourceMappingURL=default-format.js.map