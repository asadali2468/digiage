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
import { CoreTextUtils } from '@providers/utils/text';
import { CoreUtils } from '@providers/utils/utils';
import { CoreH5P } from '../providers/h5p';
import { Translate } from '@singletons/core.singletons';
import { CoreH5PCore } from './core';
/**
 * Equivalent to H5P's H5PContentValidator, but without some of the validations.
 * It's also used to build the dependency list.
 */
var CoreH5PContentValidator = /** @class */ (function () {
    function CoreH5PContentValidator(siteId) {
        this.siteId = siteId;
        this.typeMap = {
            text: 'validateText',
            number: 'validateNumber',
            boolean: 'validateBoolean',
            list: 'validateList',
            group: 'validateGroup',
            file: 'validateFile',
            image: 'validateImage',
            video: 'validateVideo',
            audio: 'validateAudio',
            select: 'validateSelect',
            library: 'validateLibrary',
        };
        this.nextWeight = 1;
        this.libraries = {};
        this.dependencies = {};
        this.relativePathRegExp = /^((\.\.\/){1,2})(.*content\/)?(\d+|editor)\/(.+)$/;
        this.allowedHtml = {};
    }
    /**
     * Add Addon library.
     *
     * @param library The addon library to add.
     * @return Promise resolved when done.
     */
    CoreH5PContentValidator.prototype.addon = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var depKey, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        depKey = 'preloaded-' + library.machineName;
                        this.dependencies[depKey] = {
                            library: library,
                            type: 'preloaded',
                        };
                        _a = this;
                        return [4 /*yield*/, CoreH5P.instance.h5pCore.findLibraryDependencies(this.dependencies, library, this.nextWeight)];
                    case 1:
                        _a.nextWeight = _b.sent();
                        this.dependencies[depKey].weight = this.nextWeight++;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the flat dependency tree.
     *
     * @return Dependencies.
     */
    CoreH5PContentValidator.prototype.getDependencies = function () {
        return this.dependencies;
    };
    /**
     * Validate metadata
     *
     * @param metadata Metadata.
     * @return Promise resolved with metadata validated & filtered.
     */
    CoreH5PContentValidator.prototype.validateMetadata = function (metadata) {
        var semantics = this.getMetadataSemantics();
        var group = CoreUtils.instance.clone(metadata || {});
        // Stop complaining about "invalid selected option in select" for old content without license chosen.
        if (typeof group.license == 'undefined') {
            group.license = 'U';
        }
        return this.validateGroup(group, { type: 'group', fields: semantics }, false);
    };
    /**
     * Validate given text value against text semantics.
     *
     * @param text Text to validate.
     * @param semantics Semantics.
     * @return Validated text.
     */
    CoreH5PContentValidator.prototype.validateText = function (text, semantics) {
        if (typeof text != 'string') {
            text = '';
        }
        if (semantics.tags) {
            // Not testing for empty array allows us to use the 4 defaults without specifying them in semantics.
            var tags = ['div', 'span', 'p', 'br'].concat(semantics.tags);
            // Add related tags for table etc.
            if (tags.indexOf('table') != -1) {
                tags = tags.concat(['tr', 'td', 'th', 'colgroup', 'thead', 'tbody', 'tfoot']);
            }
            if (tags.indexOf('b') != -1) {
                tags.push('strong');
            }
            if (tags.indexOf('i') != -1) {
                tags.push('em');
            }
            if (tags.indexOf('ul') != -1 || tags.indexOf('ol') != -1) {
                tags.push('li');
            }
            if (tags.indexOf('del') != -1 || tags.indexOf('strike') != -1) {
                tags.push('s');
            }
            tags = CoreUtils.instance.uniqueArray(tags);
            // Determine allowed style tags
            var stylePatterns = [];
            // All styles must be start to end patterns (^...$)
            if (semantics.font) {
                if (semantics.font.size) {
                    stylePatterns.push(/^font-size: *[0-9.]+(em|px|%) *;?$/i);
                }
                if (semantics.font.family) {
                    stylePatterns.push(/^font-family: *[-a-z0-9," ]+;?$/i);
                }
                if (semantics.font.color) {
                    stylePatterns.push(/^color: *(#[a-f0-9]{3}[a-f0-9]{3}?|rgba?\([0-9, ]+\)) *;?$/i);
                }
                if (semantics.font.background) {
                    stylePatterns.push(/^background-color: *(#[a-f0-9]{3}[a-f0-9]{3}?|rgba?\([0-9, ]+\)) *;?$/i);
                }
                if (semantics.font.spacing) {
                    stylePatterns.push(/^letter-spacing: *[0-9.]+(em|px|%) *;?$/i);
                }
                if (semantics.font.height) {
                    stylePatterns.push(/^line-height: *[0-9.]+(em|px|%|) *;?$/i);
                }
            }
            // Alignment is allowed for all wysiwyg texts
            stylePatterns.push(/^text-align: *(center|left|right);?$/i);
            // Strip invalid HTML tags.
            text = this.filterXss(text, tags, stylePatterns);
        }
        else {
            // Filter text to plain text.
            text = CoreTextUtils.instance.escapeHTML(text, false);
        }
        // Check if string is within allowed length.
        if (typeof semantics.maxLength != 'undefined') {
            text = text.substr(0, semantics.maxLength);
        }
        return text;
    };
    /**
     * Validates content files
     *
     * @param contentPath The path containing content files to validate.
     * @param isLibrary Whether it's a library.
     * @return True if all files are valid.
     */
    CoreH5PContentValidator.prototype.validateContentFiles = function (contentPath, isLibrary) {
        if (isLibrary === void 0) { isLibrary = false; }
        // Nothing to do, already checked by Moodle.
        return true;
    };
    /**
     * Validate given value against number semantics.
     *
     * @param num Number to validate.
     * @param semantics Semantics.
     * @return Validated number.
     */
    CoreH5PContentValidator.prototype.validateNumber = function (num, semantics) {
        // Validate that num is indeed a number.
        num = Number(num);
        if (isNaN(num)) {
            num = 0;
        }
        // Check if number is within valid bounds. Move within bounds if not.
        if (typeof semantics.min != 'undefined' && num < semantics.min) {
            num = semantics.min;
        }
        if (typeof semantics.max != 'undefined' && num > semantics.max) {
            num = semantics.max;
        }
        // Check if number is within allowed bounds even if step value is set.
        if (typeof semantics.step != 'undefined') {
            var testNumber = num - (typeof semantics.min != 'undefined' ? semantics.min : 0);
            var rest = testNumber % semantics.step;
            if (rest !== 0) {
                num -= rest;
            }
        }
        // Check if number has proper number of decimals.
        if (typeof semantics.decimals != 'undefined') {
            num = num.toFixed(semantics.decimals);
        }
        return num;
    };
    /**
     * Validate given value against boolean semantics.
     *
     * @param bool Boolean to check.
     * @return Validated bool.
     */
    CoreH5PContentValidator.prototype.validateBoolean = function (bool) {
        return !!bool;
    };
    /**
     * Validate select values.
     *
     * @param select Values to validate.
     * @param semantics Semantics.
     * @return Validated select.
     */
    CoreH5PContentValidator.prototype.validateSelect = function (select, semantics) {
        var optional = semantics.optional;
        var options = {};
        var strict = false;
        if (semantics.options && semantics.options.length) {
            // We have a strict set of options to choose from.
            strict = true;
            semantics.options.forEach(function (option) {
                // Support optgroup - just flatten options into one.
                if (option.type == 'optgroup') {
                    option.options.forEach(function (subOption) {
                        options[subOption.value] = true;
                    });
                }
                else if (option.value) {
                    options[option.value] = true;
                }
            });
        }
        if (semantics.multiple) {
            // Multi-choice generates array of values. Test each one against valid options, if we are strict.
            for (var key in select) {
                var value = select[key];
                if (strict && !optional && !options[value]) {
                    delete select[key];
                }
                else {
                    select[key] = CoreTextUtils.instance.escapeHTML(value, false);
                }
            }
        }
        else {
            // Single mode. If we get an array in here, we chop off the first element and use that instead.
            if (Array.isArray(select)) {
                select = select[0];
            }
            if (strict && !optional && !options[select]) {
                select = semantics.options[0].value;
            }
            select = CoreTextUtils.instance.escapeHTML(select, false);
        }
        return select;
    };
    /**
     * Validate given list value against list semantics.
     * Will recurse into validating each item in the list according to the type.
     *
     * @param list List to validate.
     * @param semantics Semantics.
     * @return Validated list.
     */
    CoreH5PContentValidator.prototype.validateList = function (list, semantics) {
        return __awaiter(this, void 0, void 0, function () {
            var field, fn, keys, _a, _b, _i, i, key, val;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        field = semantics.field;
                        fn = this[this.typeMap[field.type]].bind(this);
                        keys = Object.keys(list);
                        // Check that list is not longer than allowed length.
                        if (typeof semantics.max != 'undefined') {
                            keys = keys.slice(0, semantics.max);
                        }
                        _a = [];
                        for (_b in keys)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        i = _a[_i];
                        key = keys[i];
                        if (!isNaN(parseInt(key, 10))) return [3 /*break*/, 2];
                        // It's an object and the key isn't an integer. Delete it.
                        delete list[key];
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, fn(list[key], field)];
                    case 3:
                        val = _c.sent();
                        if (val === null) {
                            list.splice(key, 1);
                        }
                        else {
                            list[key] = val;
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        if (!Array.isArray(list)) {
                            list = CoreUtils.instance.objectToArray(list);
                        }
                        if (!list.length) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, list];
                }
            });
        });
    };
    /**
     * Validate a file like object, such as video, image, audio and file.
     *
     * @param file File to validate.
     * @param semantics Semantics.
     * @param typeValidKeys List of valid keys.
     * @return Promise resolved with the validated file.
     */
    CoreH5PContentValidator.prototype.validateFilelike = function (file, semantics, typeValidKeys) {
        if (typeValidKeys === void 0) { typeValidKeys = []; }
        return __awaiter(this, void 0, void 0, function () {
            var matches, validKeys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matches = file.path.match(this.relativePathRegExp);
                        if (matches && matches.length) {
                            file.path = matches[5];
                        }
                        // Remove temporary files suffix.
                        if (file.path.substr(-4, 4) === '#tmp') {
                            file.path = file.path.substr(0, file.path.length - 4);
                        }
                        // Make sure path and mime does not have any special chars
                        file.path = CoreTextUtils.instance.escapeHTML(file.path, false);
                        if (file.mime) {
                            file.mime = CoreTextUtils.instance.escapeHTML(file.mime, false);
                        }
                        validKeys = ['path', 'mime', 'copyright'].concat(typeValidKeys);
                        if (semantics.extraAttributes) {
                            validKeys = validKeys.concat(semantics.extraAttributes);
                        }
                        validKeys = CoreUtils.instance.uniqueArray(validKeys);
                        this.filterParams(file, validKeys);
                        if (typeof file.width != 'undefined') {
                            file.width = parseInt(file.width, 10);
                        }
                        if (typeof file.height != 'undefined') {
                            file.height = parseInt(file.height, 10);
                        }
                        if (file.codecs) {
                            file.codecs = CoreTextUtils.instance.escapeHTML(file.codecs, false);
                        }
                        if (typeof file.bitrate != 'undefined') {
                            file.bitrate = parseInt(file.bitrate, 10);
                        }
                        if (typeof file.quality != 'undefined') {
                            if (file.quality === null || typeof file.quality.level == 'undefined' || typeof file.quality.label == 'undefined') {
                                delete file.quality;
                            }
                            else {
                                this.filterParams(file.quality, ['level', 'label']);
                                file.quality.level = parseInt(file.quality.level);
                                file.quality.label = CoreTextUtils.instance.escapeHTML(file.quality.label, false);
                            }
                        }
                        if (!(typeof file.copyright != 'undefined')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateGroup(file.copyright, this.getCopyrightSemantics())];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, file];
                }
            });
        });
    };
    /**
     * Validate given file data.
     *
     * @param file File.
     * @param semantics Semantics.
     * @return Promise resolved with the validated file.
     */
    CoreH5PContentValidator.prototype.validateFile = function (file, semantics) {
        return this.validateFilelike(file, semantics);
    };
    /**
     * Validate given image data.
     *
     * @param image Image.
     * @param semantics Semantics.
     * @return Promise resolved with the validated file.
     */
    CoreH5PContentValidator.prototype.validateImage = function (image, semantics) {
        return this.validateFilelike(image, semantics, ['width', 'height', 'originalImage']);
    };
    /**
     * Validate given video data.
     *
     * @param video Video.
     * @param semantics Semantics.
     * @return Promise resolved with the validated file.
     */
    CoreH5PContentValidator.prototype.validateVideo = function (video, semantics) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, key;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in video)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        key = _a[_i];
                        return [4 /*yield*/, this.validateFilelike(video[key], semantics, ['width', 'height', 'codecs', 'quality', 'bitrate'])];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, video];
                }
            });
        });
    };
    /**
     * Validate given audio data.
     *
     * @param audio Audio.
     * @param semantics Semantics.
     * @return Promise resolved with the validated file.
     */
    CoreH5PContentValidator.prototype.validateAudio = function (audio, semantics) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, key;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in audio)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        key = _a[_i];
                        return [4 /*yield*/, this.validateFilelike(audio[key], semantics)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, audio];
                }
            });
        });
    };
    /**
     * Validate given group value against group semantics.
     * Will recurse into validating each group member.
     *
     * @param group Group.
     * @param semantics Semantics.
     * @param flatten Whether to flatten.
     * @return Promise resolved when done.
     */
    CoreH5PContentValidator.prototype.validateGroup = function (group, semantics, flatten) {
        if (flatten === void 0) { flatten = true; }
        return __awaiter(this, void 0, void 0, function () {
            var isSubContent, field, fn, _a, _b, _i, key, found, fn, field, i, val;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        isSubContent = semantics.isSubContent === true;
                        if (!(semantics.fields.length == 1 && flatten && !isSubContent)) return [3 /*break*/, 1];
                        field = semantics.fields[0];
                        fn = this[this.typeMap[field.type]].bind(this);
                        return [2 /*return*/, fn(group, field)];
                    case 1:
                        _a = [];
                        for (_b in group)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        key = _a[_i];
                        // If subContentId is set, keep value
                        if (isSubContent && key == 'subContentId') {
                            return [3 /*break*/, 5];
                        }
                        found = false;
                        fn = null;
                        field = null;
                        for (i = 0; i < semantics.fields.length; i++) {
                            field = semantics.fields[i];
                            if (field.name == key) {
                                if (semantics.optional) {
                                    field.optional = true;
                                }
                                fn = this[this.typeMap[field.type]].bind(this);
                                found = true;
                                break;
                            }
                        }
                        if (!(found && fn)) return [3 /*break*/, 4];
                        return [4 /*yield*/, fn(group[key], field)];
                    case 3:
                        val = _c.sent();
                        group[key] = val;
                        if (val === null) {
                            delete group[key];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        // Something exists in content that does not have a corresponding semantics field. Remove it.
                        delete group.key;
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, group];
                }
            });
        });
    };
    /**
     * Validate given library value against library semantics.
     * Check if provided library is within allowed options.
     * Will recurse into validating the library's semantics too.
     *
     * @param value Value.
     * @param semantics Semantics.
     * @return Promise resolved when done.
     */
    CoreH5PContentValidator.prototype.validateLibrary = function (value, semantics) {
        return __awaiter(this, void 0, void 0, function () {
            var libSpec, _a, _b, library, _c, _d, validKeys, depKey, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!value.library) {
                            return [2 /*return*/];
                        }
                        if (!!this.libraries[value.library]) return [3 /*break*/, 2];
                        libSpec = CoreH5PCore.libraryFromString(value.library);
                        _a = this.libraries;
                        _b = value.library;
                        return [4 /*yield*/, CoreH5P.instance.h5pCore.loadLibrary(libSpec.machineName, libSpec.majorVersion, libSpec.minorVersion, this.siteId)];
                    case 1:
                        _a[_b] = _f.sent();
                        _f.label = 2;
                    case 2:
                        library = this.libraries[value.library];
                        // Validate parameters.
                        _c = value;
                        return [4 /*yield*/, this.validateGroup(value.params, { type: 'group', fields: library.semantics }, false)];
                    case 3:
                        // Validate parameters.
                        _c.params = _f.sent();
                        if (!value.metadata) return [3 /*break*/, 5];
                        _d = value;
                        return [4 /*yield*/, this.validateMetadata(value.metadata)];
                    case 4:
                        _d.metadata = _f.sent();
                        _f.label = 5;
                    case 5:
                        validKeys = ['library', 'params', 'subContentId', 'metadata'];
                        if (semantics.extraAttributes) {
                            validKeys = CoreUtils.instance.uniqueArray(validKeys.concat(semantics.extraAttributes));
                        }
                        this.filterParams(value, validKeys);
                        if (value.subContentId &&
                            !value.subContentId.match(/^\{?[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\}?$/)) {
                            delete value.subContentId;
                        }
                        depKey = 'preloaded-' + library.machineName;
                        if (!!this.dependencies[depKey]) return [3 /*break*/, 7];
                        this.dependencies[depKey] = {
                            library: library,
                            type: 'preloaded'
                        };
                        _e = this;
                        return [4 /*yield*/, CoreH5P.instance.h5pCore.findLibraryDependencies(this.dependencies, library, this.nextWeight)];
                    case 6:
                        _e.nextWeight = _f.sent();
                        this.dependencies[depKey].weight = this.nextWeight++;
                        return [2 /*return*/, value];
                    case 7: return [2 /*return*/, value];
                }
            });
        });
    };
    /**
     * Check params for a whitelist of allowed properties.
     *
     * @param params Object to filter.
     * @param whitelist List of keys to keep.
     */
    CoreH5PContentValidator.prototype.filterParams = function (params, whitelist) {
        for (var key in params) {
            if (whitelist.indexOf(key) == -1) {
                delete params[key];
            }
        }
    };
    /**
     * Filters HTML to prevent cross-site-scripting (XSS) vulnerabilities.
     * Based on kses by Ulf Harnhammar, see http://sourceforge.net/projects/kses.
     *
     * @param str The string with raw HTML in it.
     * @param allowedTags An array of allowed tags.
     * @param allowedStyles Allowed styles.
     * @return An XSS safe version of the string.
     */
    CoreH5PContentValidator.prototype.filterXss = function (str, allowedTags, allowedStyles) {
        var _this = this;
        if (!str || typeof str != 'string') {
            return str;
        }
        allowedTags = allowedTags || ['a', 'em', 'strong', 'cite', 'blockquote', 'code', 'ul', 'ol', 'li', 'dl', 'dt', 'dd'];
        this.allowedStyles = allowedStyles;
        // Store the text format.
        this.filterXssSplit(allowedTags, true);
        // Remove Netscape 4 JS entities.
        str = str.replace(/&\s*\{[^}]*(\}\s*;?|$)/g, '');
        // Defuse all HTML entities.
        str = str.replace(/&/g, '&amp;');
        // Change back only well-formed entities in our whitelist:
        // Decimal numeric entities.
        str = str.replace(/&amp;#([0-9]+;)/g, '&#$1');
        // Hexadecimal numeric entities.
        str = str.replace(/&amp;#[Xx]0*((?:[0-9A-Fa-f]{2})+;)/g, '&#x$1');
        // Named entities.
        str = str.replace(/&amp;([A-Za-z][A-Za-z0-9]*;)/g, '&$1');
        var matches = str.match(/(<(?=[^a-zA-Z!\/])|<!--.*?-->|<[^>]*(>|$)|>)/g);
        if (matches && matches.length) {
            matches.forEach(function (match) {
                str = str.replace(match, _this.filterXssSplit([match]));
            });
        }
        return str;
    };
    /**
     * Processes an HTML tag.
     *
     * @param m An array with various meaning depending on the value of store.
     *          If store is TRUE then the array contains the allowed tags.
     *          If store is FALSE then the array has one element, the HTML tag to process.
     * @param store Whether to store m.
     * @return string If the element isn't allowed, an empty string. Otherwise, the cleaned up version of the HTML element.
     */
    CoreH5PContentValidator.prototype.filterXssSplit = function (m, store) {
        if (store === void 0) { store = false; }
        if (store) {
            this.allowedHtml = CoreUtils.instance.arrayToObject(m);
            return '';
        }
        var str = m[0];
        if (str.substr(0, 1) != '<') {
            // We matched a lone ">" character.
            return '&gt;';
        }
        else if (str.length == 1) {
            // We matched a lone "<" character.
            return '&lt;';
        }
        var matches = str.match(/^<\s*(\/\s*)?([a-zA-Z0-9\-]+)([^>]*)>?|(<!--.*?-->)$/);
        if (!matches) {
            // Seriously malformed.
            return '';
        }
        var slash = matches[1] ? matches[1].trim() : '';
        var attrList = matches[3] || '';
        var comment = matches[4] || '';
        var elem = matches[2] || '';
        if (comment) {
            elem = '!--';
        }
        if (!this.allowedHtml[elem.toLowerCase()]) {
            // Disallowed HTML element.
            return '';
        }
        if (comment) {
            return comment;
        }
        if (slash != '') {
            return '</' + elem + '>';
        }
        // Is there a closing XHTML slash at the end of the attributes?
        var newAttrList = attrList.replace(/(\s?)\/\s*$/g, '$1');
        var xhtmlSlash = attrList != newAttrList ? ' /' : '';
        // Clean up attributes.
        var attr2 = this.filterXssAttributes(newAttrList, (CoreH5PContentValidator.ALLOWED_STYLEABLE_TAGS.indexOf(elem) != -1 ? this.allowedStyles : null)).join(' ');
        attr2 = attr2.replace(/[<>]/g, '');
        attr2 = attr2.length ? ' ' + attr2 : '';
        return '<' + elem + attr2 + xhtmlSlash + '>';
    };
    /**
     * Processes a string of HTML attributes.
     *
     * @param attr HTML attributes.
     * @param allowedStyles Allowed styles.
     * @return Cleaned up version of the HTML attributes.
     */
    CoreH5PContentValidator.prototype.filterXssAttributes = function (attr, allowedStyles) {
        var attrArr = [];
        var mode = 0, attrName = '', skip = false;
        while (attr.length != 0) {
            // Was the last operation successful?
            var working = 0;
            var matches = void 0;
            var thisVal = void 0;
            switch (mode) {
                case 0:
                    // Attribute name, href for instance.
                    matches = attr.match(/^([-a-zA-Z]+)/);
                    if (matches && matches.length > 1) {
                        attrName = matches[1].toLowerCase();
                        skip = (attrName == 'style' || attrName.substr(0, 2) == 'on');
                        working = mode = 1;
                        attr = attr.replace(/^[-a-zA-Z]+/, '');
                    }
                    break;
                case 1:
                    // Equals sign or valueless ("selected").
                    if (attr.match(/^\s*=\s*/)) {
                        working = 1;
                        mode = 2;
                        attr = attr.replace(/^\s*=\s*/, '');
                        break;
                    }
                    if (attr.match(/^\s+/)) {
                        working = 1;
                        mode = 0;
                        if (!skip) {
                            attrArr.push(attrName);
                        }
                        attr = attr.replace(/^\s+/, '');
                    }
                    break;
                case 2:
                    // Attribute value, a URL after href= for instance.
                    matches = attr.match(/^"([^"]*)"(\s+|$)/);
                    if (matches && matches.length > 1) {
                        if (allowedStyles && attrName === 'style') {
                            // Allow certain styles.
                            for (var i = 0; i < allowedStyles.length; i++) {
                                var pattern = allowedStyles[i];
                                if (matches[1].match(pattern)) {
                                    // All patterns are start to end patterns, and CKEditor adds one span per style.
                                    attrArr.push('style="' + matches[1] + '"');
                                    break;
                                }
                            }
                            break;
                        }
                        thisVal = this.filterXssBadProtocol(matches[1]);
                        if (!skip) {
                            attrArr.push(attrName + '="' + thisVal + '"');
                        }
                        working = 1;
                        mode = 0;
                        attr = attr.replace(/^"[^"]*"(\s+|$)/, '');
                        break;
                    }
                    matches = attr.match(/^'([^']*)'(\s+|$)/);
                    if (matches && matches.length > 1) {
                        thisVal = this.filterXssBadProtocol(matches[1]);
                        if (!skip) {
                            attrArr.push(attrName + '="' + thisVal + '"');
                        }
                        working = 1;
                        mode = 0;
                        attr = attr.replace(/^'[^']*'(\s+|$)/, '');
                        break;
                    }
                    matches = attr.match(/^([^\s\"']+)(\s+|$)/);
                    if (matches && matches.length > 1) {
                        thisVal = this.filterXssBadProtocol(matches[1]);
                        if (!skip) {
                            attrArr.push(attrName + '="' + thisVal + '"');
                        }
                        working = 1;
                        mode = 0;
                        attr = attr.replace(/^([^\s\"']+)(\s+|$)/, '');
                    }
                    break;
                default:
            }
            if (working == 0) {
                // Not well formed; remove and try again.
                attr = attr.replace(/^("[^"]*("|$)|\'[^\']*(\'|$)||\S)*\s*/, '');
                mode = 0;
            }
        }
        // The attribute list ends with a valueless attribute like "selected".
        if (mode == 1 && !skip) {
            attrArr.push(attrName);
        }
        return attrArr;
    };
    /**
     * Processes an HTML attribute value and strips dangerous protocols from URLs.
     *
     * @param str The string with the attribute value.
     * @param decode Whether to decode entities in the str.
     * @return Cleaned up and HTML-escaped version of str.
     */
    CoreH5PContentValidator.prototype.filterXssBadProtocol = function (str, decode) {
        if (decode === void 0) { decode = true; }
        // Get the plain text representation of the attribute value (i.e. its meaning).
        if (decode) {
            str = CoreTextUtils.instance.decodeHTMLEntities(str);
        }
        return CoreTextUtils.instance.escapeHTML(this.stripDangerousProtocols(str), false);
    };
    /**
     * Strips dangerous protocols (e.g. 'javascript:') from a URI.
     *
     * @param uri A plain-text URI that might contain dangerous protocols.
     * @return A plain-text URI stripped of dangerous protocols.
     */
    CoreH5PContentValidator.prototype.stripDangerousProtocols = function (uri) {
        var allowedProtocols = {
            ftp: true,
            http: true,
            https: true,
            mailto: true
        };
        var before;
        // Iteratively remove any invalid protocol found.
        do {
            before = uri;
            var colonPos = uri.indexOf(':');
            if (colonPos > 0) {
                // We found a colon, possibly a protocol. Verify.
                var protocol = uri.substr(0, colonPos);
                // If a colon is preceded by a slash, question mark or hash, it cannot possibly be part of the URL scheme.
                // This must be a relative URL, which inherits the (safe) protocol of the base document.
                if (protocol.match(/[/?#]/)) {
                    break;
                }
                // Check if this is a disallowed protocol.
                if (!allowedProtocols[protocol.toLowerCase()]) {
                    uri = uri.substr(colonPos + 1);
                }
            }
        } while (before != uri);
        return uri;
    };
    /**
     * Get metadata semantics.
     *
     * @return Semantics.
     */
    CoreH5PContentValidator.prototype.getMetadataSemantics = function () {
        if (this.metadataSemantics) {
            return this.metadataSemantics;
        }
        var ccVersions = this.getCCVersions();
        this.metadataSemantics = [
            {
                name: 'title',
                type: 'text',
                label: Translate.instance.instant('core.h5p.title'),
                placeholder: 'La Gioconda'
            },
            {
                name: 'license',
                type: 'select',
                label: Translate.instance.instant('core.h5p.license'),
                default: 'U',
                options: [
                    {
                        value: 'U',
                        label: Translate.instance.instant('core.h5p.undisclosed')
                    },
                    {
                        type: 'optgroup',
                        label: Translate.instance.instant('core.h5p.creativecommons'),
                        options: [
                            {
                                value: 'CC BY',
                                label: Translate.instance.instant('core.h5p.ccattribution'),
                                versions: ccVersions
                            },
                            {
                                value: 'CC BY-SA',
                                label: Translate.instance.instant('core.h5p.ccattributionsa'),
                                versions: ccVersions
                            },
                            {
                                value: 'CC BY-ND',
                                label: Translate.instance.instant('core.h5p.ccattributionnd'),
                                versions: ccVersions
                            },
                            {
                                value: 'CC BY-NC',
                                label: Translate.instance.instant('core.h5p.ccattributionnc'),
                                versions: ccVersions
                            },
                            {
                                value: 'CC BY-NC-SA',
                                label: Translate.instance.instant('core.h5p.ccattributionncsa'),
                                versions: ccVersions
                            },
                            {
                                value: 'CC BY-NC-ND',
                                label: Translate.instance.instant('core.h5p.ccattributionncnd'),
                                versions: ccVersions
                            },
                            {
                                value: 'CC0 1.0',
                                label: Translate.instance.instant('core.h5p.ccpdd')
                            },
                            {
                                value: 'CC PDM',
                                label: Translate.instance.instant('core.h5p.pdm')
                            },
                        ]
                    },
                    {
                        value: 'GNU GPL',
                        label: Translate.instance.instant('core.h5p.gpl')
                    },
                    {
                        value: 'PD',
                        label: Translate.instance.instant('core.h5p.pd')
                    },
                    {
                        value: 'ODC PDDL',
                        label: Translate.instance.instant('core.h5p.pddl')
                    },
                    {
                        value: 'C',
                        label: Translate.instance.instant('core.h5p.copyrightstring')
                    }
                ]
            },
            {
                name: 'licenseVersion',
                type: 'select',
                label: Translate.instance.instant('core.h5p.licenseversion'),
                options: ccVersions,
                optional: true
            },
            {
                name: 'yearFrom',
                type: 'number',
                label: Translate.instance.instant('core.h5p.yearsfrom'),
                placeholder: '1991',
                min: '-9999',
                max: '9999',
                optional: true
            },
            {
                name: 'yearTo',
                type: 'number',
                label: Translate.instance.instant('core.h5p.yearsto'),
                placeholder: '1992',
                min: '-9999',
                max: '9999',
                optional: true
            },
            {
                name: 'source',
                type: 'text',
                label: Translate.instance.instant('core.h5p.source'),
                placeholder: 'https://',
                optional: true
            },
            {
                name: 'authors',
                type: 'list',
                field: {
                    name: 'author',
                    type: 'group',
                    fields: [
                        {
                            label: Translate.instance.instant('core.h5p.authorname'),
                            name: 'name',
                            optional: true,
                            type: 'text'
                        },
                        {
                            name: 'role',
                            type: 'select',
                            label: Translate.instance.instant('core.h5p.authorrole'),
                            default: 'Author',
                            options: [
                                {
                                    value: 'Author',
                                    label: Translate.instance.instant('core.h5p.author')
                                },
                                {
                                    value: 'Editor',
                                    label: Translate.instance.instant('core.h5p.editor')
                                },
                                {
                                    value: 'Licensee',
                                    label: Translate.instance.instant('core.h5p.licensee')
                                },
                                {
                                    value: 'Originator',
                                    label: Translate.instance.instant('core.h5p.originator')
                                }
                            ]
                        }
                    ]
                }
            },
            {
                name: 'licenseExtras',
                type: 'text',
                widget: 'textarea',
                label: Translate.instance.instant('core.h5p.licenseextras'),
                optional: true,
                description: Translate.instance.instant('core.h5p.additionallicenseinfo')
            },
            {
                name: 'changes',
                type: 'list',
                field: {
                    name: 'change',
                    type: 'group',
                    label: Translate.instance.instant('core.h5p.changelog'),
                    fields: [
                        {
                            name: 'date',
                            type: 'text',
                            label: Translate.instance.instant('core.h5p.date'),
                            optional: true
                        },
                        {
                            name: 'author',
                            type: 'text',
                            label: Translate.instance.instant('core.h5p.changedby'),
                            optional: true
                        },
                        {
                            name: 'log',
                            type: 'text',
                            widget: 'textarea',
                            label: Translate.instance.instant('core.h5p.changedescription'),
                            placeholder: Translate.instance.instant('core.h5p.changeplaceholder'),
                            optional: true
                        }
                    ]
                }
            },
            {
                name: 'authorComments',
                type: 'text',
                widget: 'textarea',
                label: Translate.instance.instant('core.h5p.authorcomments'),
                description: Translate.instance.instant('core.h5p.authorcommentsdescription'),
                optional: true
            },
            {
                name: 'contentType',
                type: 'text',
                widget: 'none'
            },
            {
                name: 'defaultLanguage',
                type: 'text',
                widget: 'none'
            }
        ];
        return this.metadataSemantics;
    };
    /**
     * Get copyright semantics.
     *
     * @return Semantics.
     */
    CoreH5PContentValidator.prototype.getCopyrightSemantics = function () {
        if (this.copyrightSemantics) {
            return this.copyrightSemantics;
        }
        var ccVersions = this.getCCVersions();
        this.copyrightSemantics = {
            name: 'copyright',
            type: 'group',
            label: Translate.instance.instant('core.h5p.copyrightinfo'),
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: Translate.instance.instant('core.h5p.title'),
                    placeholder: 'La Gioconda',
                    optional: true
                },
                {
                    name: 'author',
                    type: 'text',
                    label: Translate.instance.instant('core.h5p.author'),
                    placeholder: 'Leonardo da Vinci',
                    optional: true
                },
                {
                    name: 'year',
                    type: 'text',
                    label: Translate.instance.instant('core.h5p.years'),
                    placeholder: '1503 - 1517',
                    optional: true
                },
                {
                    name: 'source',
                    type: 'text',
                    label: Translate.instance.instant('core.h5p.source'),
                    placeholder: 'http://en.wikipedia.org/wiki/Mona_Lisa',
                    optional: true,
                    regexp: {
                        pattern: '^http[s]?://.+',
                        modifiers: 'i'
                    }
                },
                {
                    name: 'license',
                    type: 'select',
                    label: Translate.instance.instant('core.h5p.license'),
                    default: 'U',
                    options: [
                        {
                            value: 'U',
                            label: Translate.instance.instant('core.h5p.undisclosed')
                        },
                        {
                            value: 'CC BY',
                            label: Translate.instance.instant('core.h5p.ccattribution'),
                            versions: ccVersions
                        },
                        {
                            value: 'CC BY-SA',
                            label: Translate.instance.instant('core.h5p.ccattributionsa'),
                            versions: ccVersions
                        },
                        {
                            value: 'CC BY-ND',
                            label: Translate.instance.instant('core.h5p.ccattributionnd'),
                            versions: ccVersions
                        },
                        {
                            value: 'CC BY-NC',
                            label: Translate.instance.instant('core.h5p.ccattributionnc'),
                            versions: ccVersions
                        },
                        {
                            value: 'CC BY-NC-SA',
                            label: Translate.instance.instant('core.h5p.ccattributionncsa'),
                            versions: ccVersions
                        },
                        {
                            value: 'CC BY-NC-ND',
                            label: Translate.instance.instant('core.h5p.ccattributionncnd'),
                            versions: ccVersions
                        },
                        {
                            value: 'GNU GPL',
                            label: Translate.instance.instant('core.h5p.licenseGPL'),
                            versions: [
                                {
                                    value: 'v3',
                                    label: Translate.instance.instant('core.h5p.licenseV3')
                                },
                                {
                                    value: 'v2',
                                    label: Translate.instance.instant('core.h5p.licenseV2')
                                },
                                {
                                    value: 'v1',
                                    label: Translate.instance.instant('core.h5p.licenseV1')
                                }
                            ]
                        },
                        {
                            value: 'PD',
                            label: Translate.instance.instant('core.h5p.pd'),
                            versions: [
                                {
                                    value: '-',
                                    label: '-'
                                },
                                {
                                    value: 'CC0 1.0',
                                    label: Translate.instance.instant('core.h5p.licenseCC010U')
                                },
                                {
                                    value: 'CC PDM',
                                    label: Translate.instance.instant('core.h5p.pdm')
                                }
                            ]
                        },
                        {
                            value: 'C',
                            label: Translate.instance.instant('core.h5p.copyrightstring')
                        }
                    ]
                },
                {
                    name: 'version',
                    type: 'select',
                    label: Translate.instance.instant('core.h5p.licenseversion'),
                    options: []
                }
            ]
        };
        return this.copyrightSemantics;
    };
    /**
     * Get CC versions for semantics.
     *
     * @return CC versions.
     */
    CoreH5PContentValidator.prototype.getCCVersions = function () {
        return [
            {
                value: '4.0',
                label: Translate.instance.instant('core.h5p.licenseCC40')
            },
            {
                value: '3.0',
                label: Translate.instance.instant('core.h5p.licenseCC30')
            },
            {
                value: '2.5',
                label: Translate.instance.instant('core.h5p.licenseCC25')
            },
            {
                value: '2.0',
                label: Translate.instance.instant('core.h5p.licenseCC20')
            },
            {
                value: '1.0',
                label: Translate.instance.instant('core.h5p.licenseCC10')
            }
        ];
    };
    CoreH5PContentValidator.ALLOWED_STYLEABLE_TAGS = ['span', 'p', 'div', 'h1', 'h2', 'h3', 'td'];
    return CoreH5PContentValidator;
}());
export { CoreH5PContentValidator };
//# sourceMappingURL=content-validator.js.map