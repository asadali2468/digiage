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
import { AlertController, App } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation as GeolocationService } from '@ionic-native/geolocation';
import { Diagnostic as DiagnosticService } from '@ionic-native/diagnostic';
import { CoreSingletonsFactory } from '@classes/singletons-factory';
var factory = new CoreSingletonsFactory();
/**
 * Set the injector that will be used to resolve instances in the singletons of this module.
 *
 * @param injector Module injector.
 */
export function setSingletonsInjector(injector) {
    factory.setInjector(injector);
}
/**
 * Make a singleton for this module.
 *
 * @param injectionToken Injection token used to resolve the singleton instance. This is usually the service class if the
 * provider was defined using a class or the string used in the `provide` key if it was defined using an object.
 */
export function makeSingleton(injectionToken) {
    return factory.makeSingleton(injectionToken);
}
var Translate = /** @class */ (function (_super) {
    __extends(Translate, _super);
    function Translate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Translate;
}(makeSingleton(TranslateService)));
export { Translate };
var Alerts = /** @class */ (function (_super) {
    __extends(Alerts, _super);
    function Alerts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Alerts;
}(makeSingleton(AlertController)));
export { Alerts };
var Ionic = /** @class */ (function (_super) {
    __extends(Ionic, _super);
    function Ionic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Ionic;
}(makeSingleton(App)));
export { Ionic };
var Diagnostic = /** @class */ (function (_super) {
    __extends(Diagnostic, _super);
    function Diagnostic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Diagnostic;
}(makeSingleton(DiagnosticService)));
export { Diagnostic };
var Geolocation = /** @class */ (function (_super) {
    __extends(Geolocation, _super);
    function Geolocation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Geolocation;
}(makeSingleton(GeolocationService)));
export { Geolocation };
var Http = /** @class */ (function (_super) {
    __extends(Http, _super);
    function Http() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Http;
}(makeSingleton(HttpClient)));
export { Http };
//# sourceMappingURL=core.singletons.js.map