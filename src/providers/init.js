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
import { Platform } from 'ionic-angular';
import { CoreLoggerProvider } from './logger';
import { CoreUtilsProvider } from './utils/utils';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * Provider for initialisation mechanisms.
 */
var CoreInitDelegate = /** @class */ (function () {
    function CoreInitDelegate(logger, platform, utils) {
        this.utils = utils;
        this.initProcesses = {};
        this.logger = logger.getInstance('CoreInitDelegate');
    }
    CoreInitDelegate_1 = CoreInitDelegate;
    /**
     * Executes the registered init processes.
     *
     * Reserved for core use, do not call directly.
     */
    CoreInitDelegate.prototype.executeInitProcesses = function () {
        var _this = this;
        var ordered = [];
        if (typeof this.readiness == 'undefined') {
            this.initReadiness();
        }
        // Re-ordering by priority.
        for (var name_1 in this.initProcesses) {
            ordered.push(this.initProcesses[name_1]);
        }
        ordered.sort(function (a, b) {
            return b.priority - a.priority;
        });
        ordered = ordered.map(function (data) {
            return {
                context: _this,
                func: _this.prepareProcess,
                params: [data],
                blocking: !!data.blocking
            };
        });
        // Execute all the processes in order to solve dependencies.
        this.utils.executeOrderedPromises(ordered).finally(this.readiness.resolve);
    };
    /**
     * Init the readiness promise.
     */
    CoreInitDelegate.prototype.initReadiness = function () {
        var _this = this;
        this.readiness = this.utils.promiseDefer();
        this.readiness.promise.then(function () { return _this.readiness.resolved = true; });
    };
    /**
     * Instantly returns if the app is ready.
     *
     * @return Whether it's ready.
     */
    CoreInitDelegate.prototype.isReady = function () {
        return this.readiness.resolved;
    };
    /**
     * Convenience function to return a function that executes the process.
     *
     * @param data The data of the process.
     * @return Promise of the process.
     */
    CoreInitDelegate.prototype.prepareProcess = function (data) {
        var promise;
        this.logger.debug("Executing init process '" + data.name + "'");
        try {
            promise = data.load();
        }
        catch (e) {
            this.logger.error('Error while calling the init process \'' + data.name + '\'. ' + e);
            return;
        }
        return promise;
    };
    /**
     * Notifies when the app is ready. This returns a promise that is resolved when the app is initialised.
     *
     * @return Resolved when the app is initialised. Never rejected.
     */
    CoreInitDelegate.prototype.ready = function () {
        if (typeof this.readiness === 'undefined') {
            // Prevent race conditions if this is called before executeInitProcesses.
            this.initReadiness();
        }
        return this.readiness.promise;
    };
    /**
     * Registers an initialisation process.
     *
     * @description
     * Init processes can be used to add initialisation logic to the app. Anything that should block the user interface while
     * some processes are done should be an init process. It is recommended to use a priority lower than MAX_RECOMMENDED_PRIORITY
     * to make sure that your process does not happen before some essential other core processes.
     *
     * An init process should never change state or prompt user interaction.
     *
     * This delegate cannot be used by site plugins.
     *
     * @param instance The instance of the handler.
     */
    CoreInitDelegate.prototype.registerProcess = function (handler) {
        if (typeof handler.priority == 'undefined') {
            handler.priority = CoreInitDelegate_1.DEFAULT_PRIORITY;
        }
        if (typeof this.initProcesses[handler.name] != 'undefined') {
            this.logger.log("Process '" + handler.name + "' already registered.");
            return;
        }
        this.logger.log("Registering process '" + handler.name + "'.");
        this.initProcesses[handler.name] = handler;
    };
    CoreInitDelegate.DEFAULT_PRIORITY = 100; // Default priority for init processes.
    CoreInitDelegate.MAX_RECOMMENDED_PRIORITY = 600;
    CoreInitDelegate = CoreInitDelegate_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider, Platform, CoreUtilsProvider])
    ], CoreInitDelegate);
    return CoreInitDelegate;
    var CoreInitDelegate_1;
}());
export { CoreInitDelegate };
var CoreInit = /** @class */ (function (_super) {
    __extends(CoreInit, _super);
    function CoreInit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreInit;
}(makeSingleton(CoreInitDelegate)));
export { CoreInit };
//# sourceMappingURL=init.js.map