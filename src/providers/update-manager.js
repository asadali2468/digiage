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
import { CoreConfigProvider } from './config';
import { CoreInitDelegate } from './init';
import { CoreLoggerProvider } from './logger';
import { CoreConfigConstants } from '../configconstants';
import { CoreH5P } from '@core/h5p/providers/h5p';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Factory to handle app updates. This factory shouldn't be used outside of core.
 *
 * This service handles processes that need to be run when updating the app, like migrate Ionic 1 database data to Ionic 3.
 */
var CoreUpdateManagerProvider = /** @class */ (function () {
    function CoreUpdateManagerProvider(logger, configProvider) {
        this.configProvider = configProvider;
        // Data for init delegate.
        this.name = 'CoreUpdateManager';
        this.priority = CoreInitDelegate.MAX_RECOMMENDED_PRIORITY + 300;
        this.blocking = true;
        this.VERSION_APPLIED = 'version_applied';
        this.logger = logger.getInstance('CoreUpdateManagerProvider');
    }
    /**
     * Check if the app has been updated and performs the needed processes.
     * This function shouldn't be used outside of core.
     *
     * @return Promise resolved when the update process finishes.
     */
    CoreUpdateManagerProvider.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promises, versionCode, versionApplied, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        versionCode = CoreConfigConstants.versioncode;
                        return [4 /*yield*/, this.configProvider.get(this.VERSION_APPLIED, 0)];
                    case 1:
                        versionApplied = _a.sent();
                        if (versionCode >= 3900 && versionApplied < 3900 && versionApplied > 0) {
                            promises.push(CoreH5P.instance.h5pPlayer.deleteAllContentIndexes());
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, Promise.all(promises)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.configProvider.set(this.VERSION_APPLIED, versionCode)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        this.logger.error("Error applying update from " + versionApplied + " to " + versionCode, error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CoreUpdateManagerProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            CoreConfigProvider])
    ], CoreUpdateManagerProvider);
    return CoreUpdateManagerProvider;
}());
export { CoreUpdateManagerProvider };
var CoreUpdateManager = /** @class */ (function (_super) {
    __extends(CoreUpdateManager, _super);
    function CoreUpdateManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreUpdateManager;
}(makeSingleton(CoreUpdateManagerProvider)));
export { CoreUpdateManager };
//# sourceMappingURL=update-manager.js.map