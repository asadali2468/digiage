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
import { CoreEventsProvider } from '@providers/events';
/**
 * Superclass to help creating delegates
 */
var CoreDelegate = /** @class */ (function () {
    /**
     * Constructor of the Delegate.
     *
     * @param delegateName Delegate name used for logging purposes.
     * @param loggerProvider CoreLoggerProvider instance, cannot be directly injected.
     * @param sitesProvider CoreSitesProvider instance, cannot be directly injected.
     * @param eventsProvider CoreEventsProvider instance, cannot be directly injected.
     *                       If not set, no events will be fired.
     */
    function CoreDelegate(delegateName, loggerProvider, sitesProvider, eventsProvider) {
        var _this = this;
        this.loggerProvider = loggerProvider;
        this.sitesProvider = sitesProvider;
        this.eventsProvider = eventsProvider;
        /**
         * List of registered handlers.
         */
        this.handlers = {};
        /**
         * List of registered handlers enabled for the current site.
         */
        this.enabledHandlers = {};
        /**
         * Name of the property to be used to index the handlers. By default, the handler's name will be used.
         * If your delegate uses a Moodle component name to identify the handlers, please override this property.
         * E.g. CoreCourseModuleDelegate uses 'modName' to index the handlers.
         */
        this.handlerNameProperty = 'name';
        /**
         * Set of promises to update a handler, to prevent doing the same operation twice.
         */
        this.updatePromises = {};
        /**
         * Whether handlers have been initialized.
         */
        this.handlersInitialized = false;
        this.logger = this.loggerProvider.getInstance(delegateName);
        this.handlersInitPromise = new Promise(function (resolve) {
            _this.handlersInitResolve = resolve;
        });
        if (eventsProvider) {
            // Update handlers on this cases.
            eventsProvider.on(CoreEventsProvider.LOGIN, this.updateHandlers.bind(this));
            eventsProvider.on(CoreEventsProvider.SITE_UPDATED, this.updateHandlers.bind(this));
            eventsProvider.on(CoreEventsProvider.SITE_PLUGINS_LOADED, this.updateHandlers.bind(this));
        }
    }
    /**
     * Execute a certain function in a enabled handler.
     * If the handler isn't found or function isn't defined, call the same function in the default handler.
     *
     * @param handlerName The handler name.
     * @param fnName Name of the function to execute.
     * @param params Parameters to pass to the function.
     * @return Function returned value or default value.
     */
    CoreDelegate.prototype.executeFunctionOnEnabled = function (handlerName, fnName, params) {
        return this.execute(this.enabledHandlers[handlerName], fnName, params);
    };
    /**
     * Execute a certain function in a handler.
     * If the handler isn't found or function isn't defined, call the same function in the default handler.
     *
     * @param handlerName The handler name.
     * @param fnName Name of the function to execute.
     * @param params Parameters to pass to the function.
     * @return Function returned value or default value.
     */
    CoreDelegate.prototype.executeFunction = function (handlerName, fnName, params) {
        return this.execute(this.handlers[handlerName], fnName, params);
    };
    /**
     * Execute a certain function in a handler.
     * If the handler isn't found or function isn't defined, call the same function in the default handler.
     *
     * @param handler The handler.
     * @param fnName Name of the function to execute.
     * @param params Parameters to pass to the function.
     * @return Function returned value or default value.
     */
    CoreDelegate.prototype.execute = function (handler, fnName, params) {
        if (handler && handler[fnName]) {
            return handler[fnName].apply(handler, params);
        }
        else if (this.defaultHandler && this.defaultHandler[fnName]) {
            return this.defaultHandler[fnName].apply(this.defaultHandler, params);
        }
    };
    /**
     * Get a handler.
     *
     * @param handlerName The handler name.
     * @param enabled Only enabled, or any.
     * @return Handler.
     */
    CoreDelegate.prototype.getHandler = function (handlerName, enabled) {
        if (enabled === void 0) { enabled = false; }
        return enabled ? this.enabledHandlers[handlerName] : this.handlers[handlerName];
    };
    /**
     * Gets the handler full name for a given name. This is useful when the handlerNameProperty is different than "name".
     * E.g. blocks are indexed by blockName. If you call this function passing the blockName it will return the name.
     *
     * @param name Name used to indentify the handler.
     * @return Full name of corresponding handler.
     */
    CoreDelegate.prototype.getHandlerName = function (name) {
        var handler = this.getHandler(name, true);
        if (!handler) {
            return '';
        }
        return handler.name;
    };
    /**
     * Check if function exists on a handler.
     *
     * @param handlerName The handler name.
     * @param fnName Name of the function to execute.
     * @param onlyEnabled If check only enabled handlers or all.
     * @return Function returned value or default value.
     */
    CoreDelegate.prototype.hasFunction = function (handlerName, fnName, onlyEnabled) {
        if (onlyEnabled === void 0) { onlyEnabled = true; }
        var handler = onlyEnabled ? this.enabledHandlers[handlerName] : this.handlers[handlerName];
        return handler && handler[fnName];
    };
    /**
     * Check if a handler name has a registered handler (not necessarily enabled).
     *
     * @param name The handler name.
     * @param enabled Only enabled, or any.
     * @return If the handler is registered or not.
     */
    CoreDelegate.prototype.hasHandler = function (name, enabled) {
        if (enabled === void 0) { enabled = false; }
        return enabled ? typeof this.enabledHandlers[name] !== 'undefined' : typeof this.handlers[name] !== 'undefined';
    };
    /**
     * Check if a time belongs to the last update handlers call.
     * This is to handle the cases where updateHandlers don't finish in the same order as they're called.
     *
     * @param time Time to check.
     * @return Whether it's the last call.
     */
    CoreDelegate.prototype.isLastUpdateCall = function (time) {
        if (!this.lastUpdateHandlersStart) {
            return true;
        }
        return time == this.lastUpdateHandlersStart;
    };
    /**
     * Register a handler.
     *
     * @param handler The handler delegate object to register.
     * @return True when registered, false if already registered.
     */
    CoreDelegate.prototype.registerHandler = function (handler) {
        var key = handler[this.handlerNameProperty] || handler.name;
        if (typeof this.handlers[key] !== 'undefined') {
            this.logger.log("Handler '" + handler[this.handlerNameProperty] + "' already registered");
            return false;
        }
        this.logger.log("Registered handler '" + handler[this.handlerNameProperty] + "'");
        this.handlers[key] = handler;
        return true;
    };
    /**
     * Update the handler for the current site.
     *
     * @param handler The handler to check.
     * @param time Time this update process started.
     * @return Resolved when done.
     */
    CoreDelegate.prototype.updateHandler = function (handler, time) {
        var _this = this;
        var siteId = this.sitesProvider.getCurrentSiteId(), currentSite = this.sitesProvider.getCurrentSite();
        var promise;
        if (this.updatePromises[siteId] && this.updatePromises[siteId][handler.name]) {
            // There's already an update ongoing for this handler, return the promise.
            return this.updatePromises[siteId][handler.name];
        }
        else if (!this.updatePromises[siteId]) {
            this.updatePromises[siteId] = {};
        }
        if (!this.sitesProvider.isLoggedIn()) {
            promise = Promise.reject(null);
        }
        else if (this.isFeatureDisabled(handler, currentSite)) {
            promise = Promise.resolve(false);
        }
        else {
            promise = Promise.resolve(handler.isEnabled());
        }
        // Checks if the handler is enabled.
        this.updatePromises[siteId][handler.name] = promise.catch(function () {
            return false;
        }).then(function (enabled) {
            // Check that site hasn't changed since the check started.
            if (_this.sitesProvider.getCurrentSiteId() === siteId) {
                var key = handler[_this.handlerNameProperty] || handler.name;
                if (enabled) {
                    _this.enabledHandlers[key] = handler;
                }
                else {
                    delete _this.enabledHandlers[key];
                }
            }
        }).finally(function () {
            // Update finished, delete the promise.
            delete _this.updatePromises[siteId][handler.name];
        });
        return this.updatePromises[siteId][handler.name];
    };
    /**
     * Check if feature is enabled or disabled in the site, depending on the feature prefix and the handler name.
     *
     * @param handler Handler to check.
     * @param site Site to check.
     * @return Whether is enabled or disabled in site.
     */
    CoreDelegate.prototype.isFeatureDisabled = function (handler, site) {
        return typeof this.featurePrefix != 'undefined' && site.isFeatureDisabled(this.featurePrefix + handler.name);
    };
    /**
     * Update the handlers for the current site.
     *
     * @return Resolved when done.
     */
    CoreDelegate.prototype.updateHandlers = function () {
        var _this = this;
        var promises = [], now = Date.now();
        this.logger.debug('Updating handlers for current site.');
        this.lastUpdateHandlersStart = now;
        // Loop over all the handlers.
        for (var name_1 in this.handlers) {
            promises.push(this.updateHandler(this.handlers[name_1], now));
        }
        return Promise.all(promises).then(function () {
            return true;
        }, function () {
            // Never reject.
            return true;
        }).then(function () {
            // Verify that this call is the last one that was started.
            if (_this.isLastUpdateCall(now)) {
                _this.handlersInitialized = true;
                _this.handlersInitResolve();
                _this.updateData();
            }
        });
    };
    /**
     * Update handlers Data.
     * Override this function to update handlers data.
     */
    CoreDelegate.prototype.updateData = function () {
        // To be overridden.
    };
    return CoreDelegate;
}());
export { CoreDelegate };
//# sourceMappingURL=delegate.js.map