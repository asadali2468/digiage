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
import { Injectable, Injector } from '@angular/core';
import { CoreSite } from '@classes/site';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * Provider to create sites instances.
*/
var CoreSitesFactoryProvider = /** @class */ (function () {
    function CoreSitesFactoryProvider(injector) {
        this.injector = injector;
    }
    /**
     * Make a site object.
     *
     * @param id Site ID.
     * @param siteUrl Site URL.
     * @param token Site's WS token.
     * @param info Site info.
     * @param privateToken Private token.
     * @param config Site public config.
     * @param loggedOut Whether user is logged out.
     * @return Site instance.
     * @description
     * This returns a site object.
     */
    CoreSitesFactoryProvider.prototype.makeSite = function (id, siteUrl, token, info, privateToken, config, loggedOut) {
        return new CoreSite(this.injector, id, siteUrl, token, info, privateToken, config, loggedOut);
    };
    /**
     * Gets the list of Site methods.
     *
     * @return List of methods.
     */
    CoreSitesFactoryProvider.prototype.getSiteMethods = function () {
        var methods = [];
        for (var name_1 in CoreSite.prototype) {
            methods.push(name_1);
        }
        return methods;
    };
    CoreSitesFactoryProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Injector])
    ], CoreSitesFactoryProvider);
    return CoreSitesFactoryProvider;
}());
export { CoreSitesFactoryProvider };
var CoreSitesFactory = /** @class */ (function (_super) {
    __extends(CoreSitesFactory, _super);
    function CoreSitesFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreSitesFactory;
}(makeSingleton(CoreSitesFactoryProvider)));
export { CoreSitesFactory };
//# sourceMappingURL=sites-factory.js.map