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
import { CoreUtils } from '@providers/utils/utils';
/**
 * A queue to prevent having too many concurrent executions.
 */
var CoreQueueRunner = /** @class */ (function () {
    function CoreQueueRunner(maxParallel) {
        if (maxParallel === void 0) { maxParallel = 1; }
        this.maxParallel = maxParallel;
        this.queue = {};
        this.orderedQueue = [];
        this.numberRunning = 0;
    }
    /**
     * Get unique ID.
     *
     * @param id ID.
     * @return Unique ID.
     */
    CoreQueueRunner.prototype.getUniqueId = function (id) {
        var newId = id;
        var num = 1;
        do {
            newId = id + '-' + num;
            num++;
        } while (newId in this.queue);
        return newId;
    };
    /**
     * Process next item in the queue.
     *
     * @return Promise resolved when next item has been treated.
     */
    CoreQueueRunner.prototype.processNextItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.orderedQueue.length || this.numberRunning >= this.maxParallel) {
                            // Queue is empty or max number of parallel runs reached, stop.
                            return [2 /*return*/];
                        }
                        item = this.orderedQueue.shift();
                        this.numberRunning++;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, item.fn()];
                    case 2:
                        result = _a.sent();
                        item.deferred.resolve(result);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        item.deferred.reject(error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        delete this.queue[item.id];
                        this.numberRunning--;
                        this.processNextItem();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add an item to the queue.
     *
     * @param id ID.
     * @param fn Function to call.
     * @param options Options.
     * @return Promise resolved when the function has been executed.
     */
    CoreQueueRunner.prototype.run = function (id, fn, options) {
        options = options || {};
        if (id in this.queue) {
            if (!options.allowRepeated) {
                // Item already in queue, return its promise.
                return this.queue[id].deferred.promise;
            }
            id = this.getUniqueId(id);
        }
        // Add the item in the queue.
        var item = {
            id: id,
            fn: fn,
            deferred: CoreUtils.instance.promiseDefer(),
        };
        this.queue[id] = item;
        this.orderedQueue.push(item);
        // Process next item if we haven't reached the max yet.
        this.processNextItem();
        return item.deferred.promise;
    };
    return CoreQueueRunner;
}());
export { CoreQueueRunner };
//# sourceMappingURL=queue-runner.js.map