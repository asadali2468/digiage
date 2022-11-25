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
import { CoreEventsProvider } from '@providers/events';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreCourseFormatDefaultHandler } from './default-format';
import { CoreDelegate } from '@classes/delegate';
/**
 * Service to interact with course formats. Provides the functions to register and interact with the addons.
 */
var CoreCourseFormatDelegate = /** @class */ (function (_super) {
    __extends(CoreCourseFormatDelegate, _super);
    function CoreCourseFormatDelegate(loggerProvider, sitesProvider, eventsProvider, defaultHandler) {
        var _this = _super.call(this, 'CoreCoursesCourseFormatDelegate', loggerProvider, sitesProvider, eventsProvider) || this;
        _this.sitesProvider = sitesProvider;
        _this.defaultHandler = defaultHandler;
        _this.featurePrefix = 'CoreCourseFormatDelegate_';
        _this.handlerNameProperty = 'format';
        return _this;
    }
    /**
     * Whether it allows seeing all sections at the same time. Defaults to true.
     *
     * @param course The course to check.
     * @return Whether it allows seeing all sections at the same time.
     */
    CoreCourseFormatDelegate.prototype.canViewAllSections = function (course) {
        return this.executeFunctionOnEnabled(course.format, 'canViewAllSections', [course]);
    };
    /**
     * Whether the option blocks should be displayed. Defaults to true.
     *
     * @param course The course to check.
     * @return Whether it can display blocks.
     */
    CoreCourseFormatDelegate.prototype.displayBlocks = function (course) {
        return this.executeFunctionOnEnabled(course.format, 'displayBlocks', [course]);
    };
    /**
     * Whether the option to enable section/module download should be displayed. Defaults to true.
     *
     * @param course The course to check.
     * @return Whether the option to enable section/module download should be displayed
     */
    CoreCourseFormatDelegate.prototype.displayEnableDownload = function (course) {
        return this.executeFunctionOnEnabled(course.format, 'displayEnableDownload', [course]);
    };
    /**
     * Whether the course refresher should be displayed. If it returns false, a refresher must be included in the course format,
     * and the doRefresh method of CoreCourseSectionPage must be called on refresh. Defaults to true.
     *
     * @param course The course to check.
     * @param sections List of course sections.
     * @return Whether the refresher should be displayed.
     */
    CoreCourseFormatDelegate.prototype.displayRefresher = function (course, sections) {
        return this.executeFunctionOnEnabled(course.format, 'displayRefresher', [course, sections]);
    };
    /**
     * Whether the default section selector should be displayed. Defaults to true.
     *
     * @param course The course to check.
     * @return Whether the section selector should be displayed.
     */
    CoreCourseFormatDelegate.prototype.displaySectionSelector = function (course) {
        return this.executeFunctionOnEnabled(course.format, 'displaySectionSelector', [course]);
    };
    /**
     * Get the component to use to display all sections in a course.
     *
     * @param injector Injector.
     * @param course The course to render.
     * @return Promise resolved with component to use, undefined if not found.
     */
    CoreCourseFormatDelegate.prototype.getAllSectionsComponent = function (injector, course) {
        var _this = this;
        return Promise.resolve(this.executeFunctionOnEnabled(course.format, 'getAllSectionsComponent', [injector, course]))
            .catch(function (e) {
            _this.logger.error('Error getting all sections component', e);
        });
    };
    /**
     * Get the component to use to display a course format.
     *
     * @param injector Injector.
     * @param course The course to render.
     * @return Promise resolved with component to use, undefined if not found.
     */
    CoreCourseFormatDelegate.prototype.getCourseFormatComponent = function (injector, course) {
        var _this = this;
        return Promise.resolve(this.executeFunctionOnEnabled(course.format, 'getCourseFormatComponent', [injector, course]))
            .catch(function (e) {
            _this.logger.error('Error getting course format component', e);
        });
    };
    /**
     * Get the component to use to display the course summary in the default course format.
     *
     * @param injector Injector.
     * @param course The course to render.
     * @return Promise resolved with component to use, undefined if not found.
     */
    CoreCourseFormatDelegate.prototype.getCourseSummaryComponent = function (injector, course) {
        var _this = this;
        return Promise.resolve(this.executeFunctionOnEnabled(course.format, 'getCourseSummaryComponent', [injector, course]))
            .catch(function (e) {
            _this.logger.error('Error getting course summary component', e);
        });
    };
    /**
     * Given a course, return the title to use in the course page.
     *
     * @param course The course to get the title.
     * @param sections List of sections.
     * @return Course title.
     */
    CoreCourseFormatDelegate.prototype.getCourseTitle = function (course, sections) {
        return this.executeFunctionOnEnabled(course.format, 'getCourseTitle', [course, sections]);
    };
    /**
     * Given a course and a list of sections, return the current section that should be displayed first.
     *
     * @param course The course to get the title.
     * @param sections List of sections.
     * @return Promise resolved with current section.
     */
    CoreCourseFormatDelegate.prototype.getCurrentSection = function (course, sections) {
        // Convert the result to a Promise if it isn't.
        return Promise.resolve(this.executeFunctionOnEnabled(course.format, 'getCurrentSection', [course, sections])).catch(function () {
            // This function should never fail. Just return all the sections.
            return sections[0];
        });
    };
    /**
     * Get the component to use to display the section selector inside the default course format.
     *
     * @param injector Injector.
     * @param course The course to render.
     * @return Promise resolved with component to use, undefined if not found.
     */
    CoreCourseFormatDelegate.prototype.getSectionSelectorComponent = function (injector, course) {
        var _this = this;
        return Promise.resolve(this.executeFunctionOnEnabled(course.format, 'getSectionSelectorComponent', [injector, course]))
            .catch(function (e) {
            _this.logger.error('Error getting section selector component', e);
        });
    };
    /**
     * Get the component to use to display a single section. This component will only be used if the user is viewing
     * a single section. If all the sections are displayed at once then it won't be used.
     *
     * @param injector Injector.
     * @param course The course to render.
     * @return Promise resolved with component to use, undefined if not found.
     */
    CoreCourseFormatDelegate.prototype.getSingleSectionComponent = function (injector, course) {
        var _this = this;
        return Promise.resolve(this.executeFunctionOnEnabled(course.format, 'getSingleSectionComponent', [injector, course]))
            .catch(function (e) {
            _this.logger.error('Error getting single section component', e);
        });
    };
    /**
     * Invalidate the data required to load the course format.
     *
     * @param course The course to get the title.
     * @param sections List of sections.
     * @return Promise resolved when the data is invalidated.
     */
    CoreCourseFormatDelegate.prototype.invalidateData = function (course, sections) {
        return this.executeFunctionOnEnabled(course.format, 'invalidateData', [course, sections]);
    };
    /**
     * Open a course. Should not be called directly. Call CoreCourseHelper.openCourse instead.
     *
     * @param navCtrl The NavController instance to use.
     * @param course The course to open. It should contain a "format" attribute.
     * @param params Params to pass to the course page.
     * @return Promise resolved when done.
     */
    CoreCourseFormatDelegate.prototype.openCourse = function (navCtrl, course, params) {
        return this.executeFunctionOnEnabled(course.format, 'openCourse', [navCtrl, course, params]);
    };
    /**
     * Whether the view should be refreshed when completion changes. If your course format doesn't display
     * activity completion then you should return false.
     *
     * @param course The course.
     * @return Whether course view should be refreshed when an activity completion changes.
     */
    CoreCourseFormatDelegate.prototype.shouldRefreshWhenCompletionChanges = function (course) {
        return Promise.resolve(this.executeFunctionOnEnabled(course.format, 'shouldRefreshWhenCompletionChanges', [course]));
    };
    CoreCourseFormatDelegate = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider, CoreSitesProvider, CoreEventsProvider,
            CoreCourseFormatDefaultHandler])
    ], CoreCourseFormatDelegate);
    return CoreCourseFormatDelegate;
}(CoreDelegate));
export { CoreCourseFormatDelegate };
//# sourceMappingURL=format-delegate.js.map