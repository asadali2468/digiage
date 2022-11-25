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
import { Injectable, NgZone } from '@angular/core';
import { Network } from '@ionic-native/network';
import { CoreAppProvider } from './app';
import { CoreConfigProvider } from './config';
import { CoreLoggerProvider } from './logger';
import { CoreUtilsProvider } from './utils/utils';
import { CoreConstants } from '@core/constants';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * Service to handle cron processes. The registered processes will be executed every certain time.
*/
var CoreCronDelegate = /** @class */ (function () {
    function CoreCronDelegate(logger, appProvider, configProvider, utils, network, zone) {
        var _this = this;
        this.appProvider = appProvider;
        this.configProvider = configProvider;
        this.utils = utils;
        // Variables for database.
        this.CRON_TABLE = 'cron';
        this.tableSchema = {
            name: 'CoreCronDelegate',
            version: 1,
            tables: [
                {
                    name: this.CRON_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'TEXT',
                            primaryKey: true
                        },
                        {
                            name: 'value',
                            type: 'INTEGER'
                        },
                    ],
                },
            ],
        };
        this.handlers = {};
        this.queuePromise = Promise.resolve();
        this.logger = logger.getInstance('CoreCronDelegate');
        this.appDB = this.appProvider.getDB();
        this.dbReady = appProvider.createTablesFromSchema(this.tableSchema).catch(function () {
            // Ignore errors.
        });
        // When the app is re-connected, start network handlers that were stopped.
        network.onConnect().subscribe(function () {
            // Execute the callback in the Angular zone, so change detection doesn't stop working.
            zone.run(function () {
                _this.startNetworkHandlers();
            });
        });
        // Export the sync provider so Behat tests can trigger cron tasks without waiting.
        if (CoreAppProvider.isAutomated()) {
            window.cronProvider = this;
        }
    }
    CoreCronDelegate_1 = CoreCronDelegate;
    /**
     * Try to execute a handler. It will schedule the next execution once done.
     * If the handler cannot be executed or it fails, it will be re-executed after mmCoreCronMinInterval.
     *
     * @param name Name of the handler.
     * @param force Wether the execution is forced (manual sync).
     * @param siteId Site ID. If not defined, all sites.
     * @return Promise resolved if handler is executed successfully, rejected otherwise.
     */
    CoreCronDelegate.prototype.checkAndExecuteHandler = function (name, force, siteId) {
        var _this = this;
        if (!this.handlers[name] || !this.handlers[name].execute) {
            // Invalid handler.
            this.logger.debug('Cannot execute handler because is invalid: ' + name);
            return Promise.reject(null);
        }
        var usesNetwork = this.handlerUsesNetwork(name), isSync = !force && this.isHandlerSync(name);
        var promise;
        if (usesNetwork && !this.appProvider.isOnline()) {
            // Offline, stop executing.
            this.logger.debug('Cannot execute handler because device is offline: ' + name);
            this.stopHandler(name);
            return Promise.reject(null);
        }
        if (isSync) {
            // Check network connection.
            promise = this.configProvider.get(CoreConstants.SETTINGS_SYNC_ONLY_ON_WIFI, false).then(function (syncOnlyOnWifi) {
                return !syncOnlyOnWifi || _this.appProvider.isWifi();
            });
        }
        else {
            promise = Promise.resolve(true);
        }
        return promise.then(function (execute) {
            if (!execute) {
                // Cannot execute in this network connection, retry soon.
                _this.logger.debug('Cannot execute handler because device is using limited connection: ' + name);
                _this.scheduleNextExecution(name, CoreCronDelegate_1.MIN_INTERVAL);
                return Promise.reject(null);
            }
            // Add the execution to the queue.
            _this.queuePromise = _this.queuePromise.catch(function () {
                // Ignore errors in previous handlers.
            }).then(function () {
                return _this.executeHandler(name, force, siteId).then(function () {
                    _this.logger.debug("Execution of handler '" + name + "' was a success.");
                    return _this.setHandlerLastExecutionTime(name, Date.now()).then(function () {
                        _this.scheduleNextExecution(name);
                    });
                }, function (error) {
                    // Handler call failed. Retry soon.
                    _this.logger.error("Execution of handler '" + name + "' failed.", error);
                    _this.scheduleNextExecution(name, CoreCronDelegate_1.MIN_INTERVAL);
                    return Promise.reject(null);
                });
            });
            return _this.queuePromise;
        });
    };
    /**
     * Run a handler, cancelling the execution if it takes more than MAX_TIME_PROCESS.
     *
     * @param name Name of the handler.
     * @param force Wether the execution is forced (manual sync).
     * @param siteId Site ID. If not defined, all sites.
     * @return Promise resolved when the handler finishes or reaches max time, rejected if it fails.
     */
    CoreCronDelegate.prototype.executeHandler = function (name, force, siteId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var cancelTimeout;
            _this.logger.debug('Executing handler: ' + name);
            // Wrap the call in Promise.resolve to make sure it's a promise.
            Promise.resolve(_this.handlers[name].execute(siteId, force)).then(resolve).catch(reject).finally(function () {
                clearTimeout(cancelTimeout);
            });
            cancelTimeout = setTimeout(function () {
                // The handler took too long. Resolve because we don't want to retry soon.
                _this.logger.debug("Resolving execution of handler '" + name + "' because it took too long.");
                resolve();
            }, CoreCronDelegate_1.MAX_TIME_PROCESS);
        });
    };
    /**
     * Force execution of synchronization cron tasks without waiting for the scheduled time.
     * Please notice that some tasks may not be executed depending on the network connection and sync settings.
     *
     * @param siteId Site ID. If not defined, all sites.
     * @return Promise resolved if all handlers are executed successfully, rejected otherwise.
     */
    CoreCronDelegate.prototype.forceSyncExecution = function (siteId) {
        var promises = [];
        for (var name_1 in this.handlers) {
            if (this.isHandlerManualSync(name_1)) {
                // Now force the execution of the handler.
                promises.push(this.forceCronHandlerExecution(name_1, siteId));
            }
        }
        return this.utils.allPromises(promises);
    };
    /**
     * Force execution of a cron tasks without waiting for the scheduled time.
     * Please notice that some tasks may not be executed depending on the network connection and sync settings.
     *
     * @param name If provided, the name of the handler.
     * @param siteId Site ID. If not defined, all sites.
     * @return Promise resolved if handler has been executed successfully, rejected otherwise.
     */
    CoreCronDelegate.prototype.forceCronHandlerExecution = function (name, siteId) {
        var handler = this.handlers[name];
        // Mark the handler as running (it might be running already).
        handler.running = true;
        // Cancel pending timeout.
        clearTimeout(handler.timeout);
        delete handler.timeout;
        // Now force the execution of the handler.
        return this.checkAndExecuteHandler(name, true, siteId);
    };
    /**
     * Get a handler's interval.
     *
     * @param name Handler's name.
     * @return Handler's interval.
     */
    CoreCronDelegate.prototype.getHandlerInterval = function (name) {
        if (!this.handlers[name] || !this.handlers[name].getInterval) {
            // Invalid, return default.
            return CoreCronDelegate_1.DEFAULT_INTERVAL;
        }
        // Don't allow intervals lower than the minimum.
        var minInterval = this.appProvider.isDesktop() ? CoreCronDelegate_1.DESKTOP_MIN_INTERVAL : CoreCronDelegate_1.MIN_INTERVAL, handlerInterval = this.handlers[name].getInterval();
        if (!handlerInterval) {
            return CoreCronDelegate_1.DEFAULT_INTERVAL;
        }
        else {
            return Math.max(minInterval, handlerInterval);
        }
    };
    /**
     * Get a handler's last execution ID.
     *
     * @param name Handler's name.
     * @return Handler's last execution ID.
     */
    CoreCronDelegate.prototype.getHandlerLastExecutionId = function (name) {
        return 'last_execution_' + name;
    };
    /**
     * Get a handler's last execution time. If not defined, return 0.
     *
     * @param name Handler's name.
     * @return Promise resolved with the handler's last execution time.
     */
    CoreCronDelegate.prototype.getHandlerLastExecutionTime = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var id, entry, time, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        id = this.getHandlerLastExecutionId(name);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.appDB.getRecord(this.CRON_TABLE, { id: id })];
                    case 3:
                        entry = _a.sent();
                        time = parseInt(entry.value, 10);
                        return [2 /*return*/, isNaN(time) ? 0 : time];
                    case 4:
                        err_1 = _a.sent();
                        return [2 /*return*/, 0]; // Not set, return 0.
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if a handler uses network. Defaults to true.
     *
     * @param name Handler's name.
     * @return True if handler uses network or not defined, false otherwise.
     */
    CoreCronDelegate.prototype.handlerUsesNetwork = function (name) {
        if (!this.handlers[name] || !this.handlers[name].usesNetwork) {
            // Invalid, return default.
            return true;
        }
        return this.handlers[name].usesNetwork();
    };
    /**
     * Check if there is any manual sync handler registered.
     *
     * @return Whether it has at least 1 manual sync handler.
     */
    CoreCronDelegate.prototype.hasManualSyncHandlers = function () {
        for (var name_2 in this.handlers) {
            if (this.isHandlerManualSync(name_2)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Check if there is any sync handler registered.
     *
     * @return Whether it has at least 1 sync handler.
     */
    CoreCronDelegate.prototype.hasSyncHandlers = function () {
        for (var name_3 in this.handlers) {
            if (this.isHandlerSync(name_3)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Check if a handler can be manually synced. Defaults will use isSync instead.
     *
     * @param name Handler's name.
     * @return True if handler is a sync process and can be manually executed or not defined, false otherwise.
     */
    CoreCronDelegate.prototype.isHandlerManualSync = function (name) {
        if (!this.handlers[name] || !this.handlers[name].canManualSync) {
            // Invalid, return default.
            return this.isHandlerSync(name);
        }
        return this.handlers[name].canManualSync();
    };
    /**
     * Check if a handler is a sync process. Defaults to true.
     *
     * @param name Handler's name.
     * @return True if handler is a sync process or not defined, false otherwise.
     */
    CoreCronDelegate.prototype.isHandlerSync = function (name) {
        if (!this.handlers[name] || !this.handlers[name].isSync) {
            // Invalid, return default.
            return true;
        }
        return this.handlers[name].isSync();
    };
    /**
     * Register a handler to be executed every certain time.
     *
     * @param handler The handler to register.
     */
    CoreCronDelegate.prototype.register = function (handler) {
        if (!handler || !handler.name) {
            // Invalid handler.
            return;
        }
        if (typeof this.handlers[handler.name] != 'undefined') {
            this.logger.debug("The cron handler '" + handler.name + "' is already registered.");
            return;
        }
        this.logger.debug("Register handler '" + handler.name + "' in cron.");
        handler.running = false;
        this.handlers[handler.name] = handler;
        // Start the handler.
        this.startHandler(handler.name);
    };
    /**
     * Schedule a next execution for a handler.
     *
     * @param name Name of the handler.
     * @param time Time to the next execution. If not supplied it will be calculated using the last execution and
     *             the handler's interval. This param should be used only if it's really necessary.
     */
    CoreCronDelegate.prototype.scheduleNextExecution = function (name, time) {
        var _this = this;
        if (!this.handlers[name]) {
            // Invalid handler.
            return;
        }
        if (this.handlers[name].timeout) {
            // There's already a pending timeout.
            return;
        }
        var promise;
        if (time) {
            promise = Promise.resolve(time);
        }
        else {
            // Get last execution time to check when do we need to execute it.
            promise = this.getHandlerLastExecutionTime(name).then(function (lastExecution) {
                var interval = _this.getHandlerInterval(name), nextExecution = lastExecution + interval;
                return nextExecution - Date.now();
            });
        }
        promise.then(function (nextExecution) {
            _this.logger.debug("Scheduling next execution of handler '" + name + "' in '" + nextExecution + "' ms");
            if (nextExecution < 0) {
                nextExecution = 0; // Big negative numbers aren't executed immediately.
            }
            _this.handlers[name].timeout = setTimeout(function () {
                delete _this.handlers[name].timeout;
                _this.checkAndExecuteHandler(name).catch(function () {
                    // Ignore errors.
                });
            }, nextExecution);
        });
    };
    /**
     * Set a handler's last execution time.
     *
     * @param name Handler's name.
     * @param time Time to set.
     * @return Promise resolved when the execution time is saved.
     */
    CoreCronDelegate.prototype.setHandlerLastExecutionTime = function (name, time) {
        return __awaiter(this, void 0, void 0, function () {
            var id, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        id = this.getHandlerLastExecutionId(name), entry = {
                            id: id,
                            value: time
                        };
                        return [2 /*return*/, this.appDB.insertRecord(this.CRON_TABLE, entry)];
                }
            });
        });
    };
    /**
     * Start running a handler periodically.
     *
     * @param name Name of the handler.
     */
    CoreCronDelegate.prototype.startHandler = function (name) {
        if (!this.handlers[name]) {
            // Invalid handler.
            this.logger.debug("Cannot start handler '" + name + "', is invalid.");
            return;
        }
        if (this.handlers[name].running) {
            this.logger.debug("Handler '" + name + "', is already running.");
            return;
        }
        this.handlers[name].running = true;
        this.scheduleNextExecution(name);
    };
    /**
     * Start running periodically the handlers that use network.
     */
    CoreCronDelegate.prototype.startNetworkHandlers = function () {
        for (var name_4 in this.handlers) {
            if (this.handlerUsesNetwork(name_4)) {
                this.startHandler(name_4);
            }
        }
    };
    /**
     * Stop running a handler periodically.
     *
     * @param name Name of the handler.
     */
    CoreCronDelegate.prototype.stopHandler = function (name) {
        if (!this.handlers[name]) {
            // Invalid handler.
            this.logger.debug("Cannot stop handler '" + name + "', is invalid.");
            return;
        }
        if (!this.handlers[name].running) {
            this.logger.debug("Cannot stop handler '" + name + "', it's not running.");
            return;
        }
        this.handlers[name].running = false;
        clearTimeout(this.handlers[name].timeout);
        delete this.handlers[name].timeout;
    };
    // Constants.
    CoreCronDelegate.DEFAULT_INTERVAL = 3600000; // Default interval is 1 hour.
    CoreCronDelegate.MIN_INTERVAL = 300000; // Minimum interval is 5 minutes.
    CoreCronDelegate.DESKTOP_MIN_INTERVAL = 60000; // Minimum interval in desktop is 1 minute.
    CoreCronDelegate.MAX_TIME_PROCESS = 120000; // Max time a process can block the queue. Defaults to 2 minutes.
    CoreCronDelegate = CoreCronDelegate_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider, CoreAppProvider, CoreConfigProvider,
            CoreUtilsProvider, Network, NgZone])
    ], CoreCronDelegate);
    return CoreCronDelegate;
    var CoreCronDelegate_1;
}());
export { CoreCronDelegate };
var CoreCron = /** @class */ (function (_super) {
    __extends(CoreCron, _super);
    function CoreCron() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreCron;
}(makeSingleton(CoreCronDelegate)));
export { CoreCron };
//# sourceMappingURL=cron.js.map