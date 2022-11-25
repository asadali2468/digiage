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
/**
 * Stub class used to type anonymous classes created in CoreSingletonsFactory#makeSingleton method.
 */
var CoreSingleton = /** @class */ (function () {
    function CoreSingleton() {
    }
    return CoreSingleton;
}());
/**
 * Factory used to create CoreSingleton classes that get instances from an injector.
 */
var CoreSingletonsFactory = /** @class */ (function () {
    function CoreSingletonsFactory() {
    }
    /**
     * Set the injector that will be used to resolve instances in the singletons created with this factory.
     *
     * @param injector Injector.
     */
    CoreSingletonsFactory.prototype.setInjector = function (injector) {
        this.injector = injector;
    };
    /**
     * Make a singleton that will hold an instance resolved from the factory injector.
     *
     * @param injectionToken Injection token used to resolve the singleton instance. This is usually the service class if the
     * provider was defined using a class or the string used in the `provide` key if it was defined using an object.
     */
    CoreSingletonsFactory.prototype.makeSingleton = function (injectionToken) {
        // tslint:disable: no-this-assignment
        var factory = this;
        return /** @class */ (function () {
            function class_1() {
            }
            Object.defineProperty(class_1, "instance", {
                get: function () {
                    // Initialize instances lazily.
                    if (!this._instance) {
                        this._instance = factory.injector.get(injectionToken);
                    }
                    return this._instance;
                },
                enumerable: true,
                configurable: true
            });
            return class_1;
        }());
    };
    return CoreSingletonsFactory;
}());
export { CoreSingletonsFactory };
//# sourceMappingURL=singletons-factory.js.map