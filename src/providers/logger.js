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
import * as moment from 'moment';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Helper service to display messages in the console.
 *
 * @description
 * This service is meant to improve log messages, adding a timestamp and a name to all log messages.
 *
 * In your class constructor, call getInstance to configure your class name:
 * this.logger = logger.getInstance('InitPage');
 *
 * Then you can call the log function you want to use in this logger instance.
 */
var CoreLoggerProvider = /** @class */ (function () {
    function CoreLoggerProvider() {
        /** Whether the logging is enabled. */
        this.enabled = true;
        // Nothing to do.
    }
    /**
     * Get a logger instance for a certain class, service or component.
     *
     * @param className Name to use in the messages.
     * @return Instance.
     */
    CoreLoggerProvider.prototype.getInstance = function (className) {
        className = className || '';
        /* tslint:disable no-console */
        return {
            log: this.prepareLogFn(console.log.bind(console), className),
            info: this.prepareLogFn(console.info.bind(console), className),
            warn: this.prepareLogFn(console.warn.bind(console), className),
            debug: this.prepareLogFn(console.debug.bind(console), className),
            error: this.prepareLogFn(console.error.bind(console), className)
        };
    };
    /**
     * Prepare a logging function, concatenating the timestamp and class name to all messages.
     *
     * @param logFn Log function to use.
     * @param className Name to use in the messages.
     * @return Prepared function.
     */
    CoreLoggerProvider.prototype.prepareLogFn = function (logFn, className) {
        var _this = this;
        // Return our own function that will call the logging function with the treated message.
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.enabled) {
                var now = moment().format('l LTS');
                args[0] = now + ' ' + className + ': ' + args[0]; // Prepend timestamp and className to the original message.
                logFn.apply(null, args);
            }
        };
    };
    CoreLoggerProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], CoreLoggerProvider);
    return CoreLoggerProvider;
}());
export { CoreLoggerProvider };
var CoreLogger = /** @class */ (function (_super) {
    __extends(CoreLogger, _super);
    function CoreLogger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreLogger;
}(makeSingleton(CoreLoggerProvider)));
export { CoreLogger };
//# sourceMappingURL=logger.js.map