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
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Globalization } from '@ionic-native/globalization';
import { Platform, Config } from 'ionic-angular';
import { CoreAppProvider } from '@providers/app';
import { CoreConfigProvider } from './config';
import { CoreConfigConstants } from '../configconstants';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * Service to handle language features, like changing the current language.
*/
var CoreLangProvider = /** @class */ (function () {
    function CoreLangProvider(translate, configProvider, platform, globalization, config) {
        var _this = this;
        this.translate = translate;
        this.configProvider = configProvider;
        this.globalization = globalization;
        this.config = config;
        this.fallbackLanguage = 'en'; // Always use English as fallback language since it contains all strings.
        this.defaultLanguage = CoreConfigConstants.default_lang || 'en'; // Lang to use if device lang not valid or is forced.
        this.customStrings = {}; // Strings defined using the admin tool.
        this.sitePluginsStrings = {}; // Strings defined by site plugins.
        // Set fallback language and language to use until the app determines the right language to use.
        translate.setDefaultLang(this.fallbackLanguage);
        translate.use(this.defaultLanguage);
        platform.ready().then(function () {
            if (CoreAppProvider.isAutomated()) {
                // Force current language to English when Behat is running.
                _this.changeCurrentLanguage('en');
                return;
            }
            _this.getCurrentLanguage().then(function (language) {
                _this.changeCurrentLanguage(language);
            });
        });
        translate.onLangChange.subscribe(function (event) {
            platform.setLang(event.lang, true);
            var dir = _this.translate.instant('core.thisdirection');
            platform.setDir(dir.indexOf('rtl') != -1 ? 'rtl' : 'ltr', true);
        });
    }
    /**
     * Add a set of site plugins strings for a certain language.
     *
     * @param lang The language where to add the strings.
     * @param strings Object with the strings to add.
     * @param prefix A prefix to add to all keys.
     */
    CoreLangProvider.prototype.addSitePluginsStrings = function (lang, strings, prefix) {
        lang = lang.replace(/_/g, '-'); // Use the app format instead of Moodle format.
        // Initialize structure if it doesn't exist.
        if (!this.sitePluginsStrings[lang]) {
            this.sitePluginsStrings[lang] = {};
        }
        for (var key in strings) {
            var prefixedKey = prefix + key;
            var value = strings[key];
            if (this.customStrings[lang] && this.customStrings[lang][prefixedKey]) {
                // This string is overridden by a custom string, ignore it.
                continue;
            }
            // Replace the way to access subproperties.
            value = value.replace(/\$a->/gm, '$a.');
            // Add another curly bracket to string params ({$a} -> {{$a}}).
            value = value.replace(/{([^ ]+)}/gm, '{{$1}}');
            // Make sure we didn't add to many brackets in some case.
            value = value.replace(/{{{([^ ]+)}}}/gm, '{{$1}}');
            // Load the string.
            this.loadString(this.sitePluginsStrings, lang, prefixedKey, value);
        }
    };
    /**
     * Capitalize a string (make the first letter uppercase).
     * We cannot use a function from text utils because it would cause a circular dependency.
     *
     * @param value String to capitalize.
     * @return Capitalized string.
     */
    CoreLangProvider.prototype.capitalize = function (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    };
    /**
     * Change current language.
     *
     * @param language New language to use.
     * @return Promise resolved when the change is finished.
     */
    CoreLangProvider.prototype.changeCurrentLanguage = function (language) {
        var _this = this;
        var promises = [];
        // Change the language, resolving the promise when we receive the first value.
        promises.push(new Promise(function (resolve, reject) {
            var subscription = _this.translate.use(language).subscribe(function (data) {
                // It's a language override, load the original one first.
                var fallbackLang = _this.translate.instant('core.parentlanguage');
                if (fallbackLang != '' && fallbackLang != 'core.parentlanguage' && fallbackLang != language) {
                    var fallbackSubs_1 = _this.translate.use(fallbackLang).subscribe(function (fallbackData) {
                        data = Object.assign(fallbackData, data);
                        resolve(data);
                        // Data received, unsubscribe. Use a timeout because we can receive a value immediately.
                        setTimeout(function () {
                            fallbackSubs_1.unsubscribe();
                        });
                    }, function (error) {
                        // Resolve with the original language.
                        resolve(data);
                        // Error received, unsubscribe. Use a timeout because we can receive a value immediately.
                        setTimeout(function () {
                            fallbackSubs_1.unsubscribe();
                        });
                    });
                }
                else {
                    resolve(data);
                }
                // Data received, unsubscribe. Use a timeout because we can receive a value immediately.
                setTimeout(function () {
                    subscription.unsubscribe();
                });
            }, function (error) {
                reject(error);
                // Error received, unsubscribe. Use a timeout because we can receive a value immediately.
                setTimeout(function () {
                    subscription.unsubscribe();
                });
            });
        }));
        // Change the config.
        promises.push(this.configProvider.set('current_language', language));
        // Use british english when parent english is loaded.
        moment.locale(language == 'en' ? 'en-gb' : language);
        // Set data for ion-datetime.
        this.config.set('monthNames', moment.months().map(this.capitalize.bind(this)));
        this.config.set('monthShortNames', moment.monthsShort().map(this.capitalize.bind(this)));
        this.config.set('dayNames', moment.weekdays().map(this.capitalize.bind(this)));
        this.config.set('dayShortNames', moment.weekdaysShort().map(this.capitalize.bind(this)));
        this.currentLanguage = language;
        return Promise.all(promises).finally(function () {
            // Load the custom and site plugins strings for the language.
            if (_this.loadLangStrings(_this.customStrings, language) || _this.loadLangStrings(_this.sitePluginsStrings, language)) {
                // Some lang strings have changed, emit an event to update the pipes.
                _this.translate.onLangChange.emit({ lang: language, translations: _this.translate.translations[language] });
            }
        });
    };
    /**
     * Clear current custom strings.
     */
    CoreLangProvider.prototype.clearCustomStrings = function () {
        this.unloadStrings(this.customStrings);
        this.customStrings = {};
        this.customStringsRaw = '';
    };
    /**
     * Clear current site plugins strings.
     */
    CoreLangProvider.prototype.clearSitePluginsStrings = function () {
        this.unloadStrings(this.sitePluginsStrings);
        this.sitePluginsStrings = {};
    };
    /**
     * Get all current custom strings.
     *
     * @return Custom strings.
     */
    CoreLangProvider.prototype.getAllCustomStrings = function () {
        return this.customStrings;
    };
    /**
     * Get all current site plugins strings.
     *
     * @return Site plugins strings.
     */
    CoreLangProvider.prototype.getAllSitePluginsStrings = function () {
        return this.sitePluginsStrings;
    };
    /**
     * Get current language.
     *
     * @return Promise resolved with the current language.
     */
    CoreLangProvider.prototype.getCurrentLanguage = function () {
        var _this = this;
        if (typeof this.currentLanguage != 'undefined') {
            return Promise.resolve(this.currentLanguage);
        }
        // Get current language from config (user might have changed it).
        return this.configProvider.get('current_language').then(function (language) {
            return language;
        }).catch(function () {
            // User hasn't defined a language. If default language is forced, use it.
            if (CoreConfigConstants.default_lang && CoreConfigConstants.forcedefaultlanguage) {
                return CoreConfigConstants.default_lang;
            }
            try {
                // No forced language, try to get current language from cordova globalization.
                return _this.globalization.getPreferredLanguage().then(function (result) {
                    var language = result.value.toLowerCase();
                    if (language.indexOf('-') > -1) {
                        // Language code defined by locale has a dash, like en-US or es-ES. Check if it's supported.
                        if (CoreConfigConstants.languages && typeof CoreConfigConstants.languages[language] == 'undefined') {
                            // Code is NOT supported. Fallback to language without dash. E.g. 'en-US' would fallback to 'en'.
                            language = language.substr(0, language.indexOf('-'));
                        }
                    }
                    if (typeof CoreConfigConstants.languages[language] == 'undefined') {
                        // Language not supported, use default language.
                        return _this.defaultLanguage;
                    }
                    return language;
                }).catch(function () {
                    // Error getting locale. Use default language.
                    return _this.defaultLanguage;
                });
            }
            catch (err) {
                // Error getting locale. Use default language.
                return Promise.resolve(_this.defaultLanguage);
            }
        }).then(function (language) {
            _this.currentLanguage = language; // Save it for later.
            return language;
        });
    };
    /**
     * Get the default language.
     *
     * @return Default language.
     */
    CoreLangProvider.prototype.getDefaultLanguage = function () {
        return this.defaultLanguage;
    };
    /**
     * Get the fallback language.
     *
     * @return Fallback language.
     */
    CoreLangProvider.prototype.getFallbackLanguage = function () {
        return this.fallbackLanguage;
    };
    /**
     * Get the full list of translations for a certain language.
     *
     * @param lang The language to check.
     * @return Promise resolved when done.
     */
    CoreLangProvider.prototype.getTranslationTable = function (lang) {
        var _this = this;
        // Create a promise to convert the observable into a promise.
        return new Promise(function (resolve, reject) {
            var observer = _this.translate.getTranslation(lang).subscribe(function (table) {
                resolve(table);
                observer.unsubscribe();
            }, function (err) {
                reject(err);
                observer.unsubscribe();
            });
        });
    };
    /**
     * Load certain custom strings.
     *
     * @param strings Custom strings to load (tool_mobile_customlangstrings).
     */
    CoreLangProvider.prototype.loadCustomStrings = function (strings) {
        var _this = this;
        if (strings == this.customStringsRaw) {
            // Strings haven't changed, stop.
            return;
        }
        // Reset current values.
        this.clearCustomStrings();
        if (!strings) {
            return;
        }
        var currentLangChanged = false;
        var list = strings.split(/(?:\r\n|\r|\n)/);
        list.forEach(function (entry) {
            var values = entry.split('|');
            var lang;
            if (values.length < 3) {
                // Not enough data, ignore the entry.
                return;
            }
            lang = values[2].replace(/_/g, '-'); // Use the app format instead of Moodle format.
            if (lang == _this.currentLanguage) {
                currentLangChanged = true;
            }
            if (!_this.customStrings[lang]) {
                _this.customStrings[lang] = {};
            }
            // Convert old keys format to new one.
            var key = values[0].replace(/^mm\.core/, 'core').replace(/^mm\./, 'core.').replace(/^mma\./, 'addon.')
                .replace(/^core\.sidemenu/, 'core.mainmenu').replace(/^addon\.grades/, 'core.grades')
                .replace(/^addon\.participants/, 'core.user');
            _this.loadString(_this.customStrings, lang, key, values[1]);
        });
        this.customStringsRaw = strings;
        if (currentLangChanged) {
            // Some lang strings have changed, emit an event to update the pipes.
            this.translate.onLangChange.emit({
                lang: this.currentLanguage,
                translations: this.translate.translations[this.currentLanguage]
            });
        }
    };
    /**
     * Load custom strings for a certain language that weren't loaded because the language wasn't active.
     *
     * @param langObject The object with the strings to load.
     * @param lang Language to load.
     * @return Whether the translation table was modified.
     */
    CoreLangProvider.prototype.loadLangStrings = function (langObject, lang) {
        var langApplied = false;
        if (langObject[lang]) {
            for (var key in langObject[lang]) {
                var entry = langObject[lang][key];
                if (!entry.applied) {
                    // Store the original value of the string.
                    entry.original = this.translate.translations[lang][key];
                    // Store the string in the translations table.
                    this.translate.translations[lang][key] = entry.value;
                    entry.applied = true;
                    langApplied = true;
                }
            }
        }
        return langApplied;
    };
    /**
     * Load a string in a certain lang object and in the translate table if the lang is loaded.
     *
     * @param langObject The object where to store the lang.
     * @param lang Language code.
     * @param key String key.
     * @param value String value.
     */
    CoreLangProvider.prototype.loadString = function (langObject, lang, key, value) {
        lang = lang.replace(/_/g, '-'); // Use the app format instead of Moodle format.
        if (this.translate.translations[lang]) {
            // The language is loaded.
            // Store the original value of the string.
            langObject[lang][key] = {
                original: this.translate.translations[lang][key],
                value: value,
                applied: true
            };
            // Store the string in the translations table.
            this.translate.translations[lang][key] = value;
        }
        else {
            // The language isn't loaded.
            // Save it in our object but not in the translations table, it will be loaded when the lang is loaded.
            langObject[lang][key] = {
                value: value,
                applied: false
            };
        }
    };
    /**
     * Unload custom or site plugin strings, removing them from the translations table.
     *
     * @param strings Strings to unload.
     */
    CoreLangProvider.prototype.unloadStrings = function (strings) {
        // Iterate over all languages and strings.
        for (var lang in strings) {
            if (!this.translate.translations[lang]) {
                // Language isn't loaded, nothing to unload.
                continue;
            }
            var langStrings = strings[lang];
            for (var key in langStrings) {
                var entry = langStrings[key];
                if (entry.original) {
                    // The string had a value, restore it.
                    this.translate.translations[lang][key] = entry.original;
                }
                else {
                    // The string didn't exist, delete it.
                    delete this.translate.translations[lang][key];
                }
            }
        }
    };
    CoreLangProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [TranslateService, CoreConfigProvider, Platform,
            Globalization, Config])
    ], CoreLangProvider);
    return CoreLangProvider;
}());
export { CoreLangProvider };
var CoreLang = /** @class */ (function (_super) {
    __extends(CoreLang, _super);
    function CoreLang() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreLang;
}(makeSingleton(CoreLangProvider)));
export { CoreLang };
//# sourceMappingURL=lang.js.map