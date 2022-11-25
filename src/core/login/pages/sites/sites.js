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
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CorePushNotificationsProvider } from '@core/pushnotifications/providers/pushnotifications';
import { CoreLoginHelperProvider } from '../../providers/helper';
import { CoreFilterProvider } from '@core/filter/providers/filter';
/**
 * Page that displays the list of stored sites.
 */
var CoreLoginSitesPage = /** @class */ (function () {
    function CoreLoginSitesPage(domUtils, filterProvider, sitesProvider, loginHelper, logger, pushNotificationsProvider) {
        this.domUtils = domUtils;
        this.filterProvider = filterProvider;
        this.sitesProvider = sitesProvider;
        this.loginHelper = loginHelper;
        this.pushNotificationsProvider = pushNotificationsProvider;
        this.logger = logger.getInstance('CoreLoginSitesPage');
    }
    /**
     * View loaded.
     */
    CoreLoginSitesPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.sitesProvider.getSortedSites().then(function (sites) {
            if (sites.length == 0) {
                _this.loginHelper.goToAddSite(true);
            }
            // Remove protocol from the url to show more url text.
            _this.sites = sites.map(function (site) {
                site.siteUrl = site.siteUrl.replace(/^https?:\/\//, '');
                site.badge = 0;
                _this.pushNotificationsProvider.getSiteCounter(site.id).then(function (counter) {
                    site.badge = counter;
                });
                return site;
            });
            _this.showDelete = false;
        }).catch(function () {
            // Shouldn't happen.
        });
    };
    /**
     * Go to the page to add a site.
     */
    CoreLoginSitesPage.prototype.add = function () {
        this.loginHelper.goToAddSite(false, true);
    };
    /**
     * Delete a site.
     *
     * @param e Click event.
     * @param index Position of the site.
     */
    CoreLoginSitesPage.prototype.deleteSite = function (e, index) {
        var _this = this;
        e.stopPropagation();
        var site = this.sites[index], siteName = site.siteName;
        this.filterProvider.formatText(siteName, { clean: true, singleLine: true, filter: false }, [], site.id).then(function (siteName) {
            _this.domUtils.showDeleteConfirm('core.login.confirmdeletesite', { sitename: siteName }).then(function () {
                _this.sitesProvider.deleteSite(site.id).then(function () {
                    _this.sites.splice(index, 1);
                    _this.showDelete = false;
                    // If there are no sites left, go to add site.
                    _this.sitesProvider.hasSites().then(function (hasSites) {
                        if (!hasSites) {
                            _this.loginHelper.goToAddSite(true, true);
                        }
                    });
                }).catch(function (error) {
                    _this.logger.error('Error deleting site ' + site.id, error);
                    _this.domUtils.showErrorModalDefault(error, 'core.login.errordeletesite', true);
                });
            }).catch(function () {
                // User cancelled, nothing to do.
            });
        });
    };
    /**
     * Login in a site.
     *
     * @param siteId The site ID.
     */
    CoreLoginSitesPage.prototype.login = function (siteId) {
        var _this = this;
        var modal = this.domUtils.showModalLoading();
        this.sitesProvider.loadSite(siteId).then(function (loggedIn) {
            if (loggedIn) {
                return _this.loginHelper.goToSiteInitialPage();
            }
        }).catch(function (error) {
            _this.logger.error('Error loading site ' + siteId, error);
            _this.domUtils.showErrorModalDefault(error, 'Error loading site.');
        }).finally(function () {
            modal.dismiss();
        });
    };
    /**
     * Toggle delete.
     */
    CoreLoginSitesPage.prototype.toggleDelete = function () {
        this.showDelete = !this.showDelete;
    };
    CoreLoginSitesPage = __decorate([
        IonicPage({ segment: 'core-login-sites' }),
        Component({
            selector: 'page-core-login-sites',
            templateUrl: 'sites.html',
        }),
        __metadata("design:paramtypes", [CoreDomUtilsProvider,
            CoreFilterProvider,
            CoreSitesProvider,
            CoreLoginHelperProvider,
            CoreLoggerProvider,
            CorePushNotificationsProvider])
    ], CoreLoginSitesPage);
    return CoreLoginSitesPage;
}());
export { CoreLoginSitesPage };
//# sourceMappingURL=sites.js.map