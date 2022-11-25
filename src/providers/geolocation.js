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
import { CoreApp } from '@providers/app';
import { Geolocation, Diagnostic, makeSingleton } from '@singletons/core.singletons';
import { CoreError } from '@classes/error';
export var CoreGeolocationErrorReason;
(function (CoreGeolocationErrorReason) {
    CoreGeolocationErrorReason["PermissionDenied"] = "permission-denied";
    CoreGeolocationErrorReason["LocationNotEnabled"] = "location-not-enabled";
})(CoreGeolocationErrorReason || (CoreGeolocationErrorReason = {}));
var CoreGeolocationError = /** @class */ (function (_super) {
    __extends(CoreGeolocationError, _super);
    function CoreGeolocationError(reason) {
        var _this = _super.call(this, "GeolocationError: " + reason) || this;
        _this.reason = reason;
        return _this;
    }
    return CoreGeolocationError;
}(CoreError));
export { CoreGeolocationError };
var CoreGeolocationProvider = /** @class */ (function () {
    function CoreGeolocationProvider() {
    }
    /**
     * Get current user coordinates.
     *
     * @throws {CoreGeolocationError}
     */
    CoreGeolocationProvider.prototype.getCoordinates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.authorizeLocation()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.enableLocation()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Geolocation.instance.getCurrentPosition({
                                enableHighAccuracy: true,
                                timeout: 30000,
                            })];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result.coords];
                    case 4:
                        error_1 = _a.sent();
                        if (this.isCordovaPermissionDeniedError(error_1)) {
                            throw new CoreGeolocationError(CoreGeolocationErrorReason.PermissionDenied);
                        }
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make sure that using device location has been authorized and ask for permission if it hasn't.
     *
     * @throws {CoreGeolocationError}
     */
    CoreGeolocationProvider.prototype.authorizeLocation = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.doAuthorizeLocation()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make sure that location is enabled and open settings to enable it if necessary.
     *
     * @throws {CoreGeolocationError}
     */
    CoreGeolocationProvider.prototype.enableLocation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var locationEnabled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Diagnostic.instance.isLocationEnabled()];
                    case 1:
                        locationEnabled = _a.sent();
                        if (locationEnabled) {
                            // Location is enabled.
                            return [2 /*return*/];
                        }
                        if (!!CoreApp.instance.isIOS()) return [3 /*break*/, 5];
                        return [4 /*yield*/, Diagnostic.instance.switchToLocationSettings()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, CoreApp.instance.waitForResume(30000)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, Diagnostic.instance.isLocationEnabled()];
                    case 4:
                        locationEnabled = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!locationEnabled) {
                            throw new CoreGeolocationError(CoreGeolocationErrorReason.LocationNotEnabled);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Recursive implementation of authorizeLocation method, protected to avoid exposing the failOnDeniedOnce parameter.
     *
     * @param failOnDeniedOnce Throw an exception if the permission has been denied once.
     * @throws {CoreGeolocationError}
     */
    CoreGeolocationProvider.prototype.doAuthorizeLocation = function (failOnDeniedOnce) {
        if (failOnDeniedOnce === void 0) { failOnDeniedOnce = false; }
        return __awaiter(this, void 0, void 0, function () {
            var authorizationStatus, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Diagnostic.instance.getLocationAuthorizationStatus()];
                    case 1:
                        authorizationStatus = _b.sent();
                        _a = authorizationStatus;
                        switch (_a) {
                            case 'DENIED_ONCE': return [3 /*break*/, 2];
                            case Diagnostic.instance.permissionStatus.NOT_REQUESTED: return [3 /*break*/, 3];
                            case Diagnostic.instance.permissionStatus.GRANTED: return [3 /*break*/, 7];
                            case Diagnostic.instance.permissionStatus.GRANTED_WHEN_IN_USE: return [3 /*break*/, 7];
                            case Diagnostic.instance.permissionStatus.DENIED: return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 8];
                    case 2:
                        if (failOnDeniedOnce) {
                            throw new CoreGeolocationError(CoreGeolocationErrorReason.PermissionDenied);
                        }
                        _b.label = 3;
                    case 3: return [4 /*yield*/, Diagnostic.instance.requestLocationAuthorization()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, CoreApp.instance.waitForResume(500)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, this.doAuthorizeLocation(true)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                    case 7: 
                    // Location is authorized.
                    return [2 /*return*/];
                    case 8: throw new CoreGeolocationError(CoreGeolocationErrorReason.PermissionDenied);
                }
            });
        });
    };
    /**
     * Check whether an error was caused by a PERMISSION_DENIED from the cordova plugin.
     *
     * @param error Error.
     */
    CoreGeolocationProvider.prototype.isCordovaPermissionDeniedError = function (error) {
        return error && 'code' in error && 'PERMISSION_DENIED' in error && error.code === error.PERMISSION_DENIED;
    };
    CoreGeolocationProvider = __decorate([
        Injectable()
    ], CoreGeolocationProvider);
    return CoreGeolocationProvider;
}());
export { CoreGeolocationProvider };
var CoreGeolocation = /** @class */ (function (_super) {
    __extends(CoreGeolocation, _super);
    function CoreGeolocation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreGeolocation;
}(makeSingleton(CoreGeolocationProvider)));
export { CoreGeolocation };
//# sourceMappingURL=geolocation.js.map