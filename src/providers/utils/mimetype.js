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
import { HttpClient } from '@angular/common/http';
import { CoreFile } from '../file';
import { CoreLoggerProvider } from '../logger';
import { TranslateService } from '@ngx-translate/core';
import { CoreTextUtilsProvider } from './text';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * "Utils" service with helper functions for mimetypes and extensions.
 */
var CoreMimetypeUtilsProvider = /** @class */ (function () {
    function CoreMimetypeUtilsProvider(http, logger, translate, textUtils) {
        var _this = this;
        this.translate = translate;
        this.textUtils = textUtils;
        this.extToMime = {}; // Object to map extensions -> mimetypes.
        this.mimeToExt = {}; // Object to map mimetypes -> extensions.
        this.groupsMimeInfo = {}; // Object to hold extensions and mimetypes that belong to a certain "group" (audio, video, ...).
        this.extensionRegex = /^[a-z0-9]+$/;
        this.logger = logger.getInstance('CoreMimetypeUtilsProvider');
        http.get('assets/exttomime.json').subscribe(function (result) {
            _this.extToMime = result;
        }, function (err) {
            // Error, shouldn't happen.
        });
        http.get('assets/mimetoext.json').subscribe(function (result) {
            _this.mimeToExt = result;
        }, function (err) {
            // Error, shouldn't happen.
        });
    }
    /**
     * Check if a file extension can be embedded without using iframes.
     *
     * @param extension Extension.
     * @return Whether it can be embedded.
     */
    CoreMimetypeUtilsProvider.prototype.canBeEmbedded = function (extension) {
        return this.isExtensionInGroup(extension, ['web_image', 'web_video', 'web_audio']);
    };
    /**
     * Clean a extension, removing the dot, hash, extra params...
     *
     * @param extension Extension to clean.
     * @return Clean extension.
     */
    CoreMimetypeUtilsProvider.prototype.cleanExtension = function (extension) {
        if (!extension) {
            return extension;
        }
        // If the extension has parameters, remove them.
        var position = extension.indexOf('?');
        if (position > -1) {
            extension = extension.substr(0, position);
        }
        // If the extension has an anchor, remove it.
        position = extension.indexOf('#');
        if (position > -1) {
            extension = extension.substr(0, position);
        }
        // Remove hash in extension if there's any (added by filepool).
        extension = extension.replace(/_.{32}$/, '');
        // Remove dot from the extension if found.
        if (extension && extension[0] == '.') {
            extension = extension.substr(1);
        }
        return extension;
    };
    /**
     * Fill the mimetypes and extensions info for a certain group.
     *
     * @param group Group name.
     */
    CoreMimetypeUtilsProvider.prototype.fillGroupMimeInfo = function (group) {
        var mimetypes = {}, // Use an object to prevent duplicates.
        extensions = []; // Extensions are unique.
        for (var extension in this.extToMime) {
            var data = this.extToMime[extension];
            if (data.type && data.groups && data.groups.indexOf(group) != -1) {
                // This extension has the group, add it to the list.
                mimetypes[data.type] = true;
                extensions.push(extension);
            }
        }
        this.groupsMimeInfo[group] = {
            mimetypes: Object.keys(mimetypes),
            extensions: extensions
        };
    };
    /**
     * Get the extension of a mimetype. Returns undefined if not found.
     *
     * @param mimetype Mimetype.
     * @param url URL of the file. It will be used if there's more than one possible extension.
     * @return Extension.
     */
    CoreMimetypeUtilsProvider.prototype.getExtension = function (mimetype, url) {
        mimetype = mimetype || '';
        mimetype = mimetype.split(';')[0]; // Remove codecs from the mimetype if any.
        if (mimetype == 'application/x-forcedownload' || mimetype == 'application/forcedownload') {
            // Couldn't get the right mimetype, try to guess it.
            return this.guessExtensionFromUrl(url);
        }
        var extensions = this.mimeToExt[mimetype];
        if (extensions && extensions.length) {
            if (extensions.length > 1 && url) {
                // There's more than one possible extension. Check if the URL has extension.
                var candidate = this.guessExtensionFromUrl(url);
                if (extensions.indexOf(candidate) != -1) {
                    return candidate;
                }
            }
            return extensions[0];
        }
    };
    /**
     * Set the embed type to display an embedded file and mimetype if not found.
     *
     * @param file File object.
     * @paran path Alternative path that will override fileurl from file object.
     */
    CoreMimetypeUtilsProvider.prototype.getEmbeddedHtml = function (file, path) {
        var ext;
        var filename = file.filename || file.name;
        if (file.mimetype) {
            ext = this.getExtension(file.mimetype);
        }
        else {
            ext = this.getFileExtension(filename);
            file.mimetype = this.getMimeType(ext);
        }
        if (this.canBeEmbedded(ext)) {
            file.embedType = this.getExtensionType(ext);
            path = CoreFile.instance.convertFileSrc(path || file.fileurl || file.url || (file.toURL && file.toURL()));
            if (file.embedType == 'image') {
                return '<img src="' + path + '">';
            }
            if (file.embedType == 'audio' || file.embedType == 'video') {
                return '<' + file.embedType + ' controls title="' + filename + '" src="' + path + '">' +
                    '<source src="' + path + '" type="' + file.mimetype + '">' +
                    '</' + file.embedType + '>';
            }
        }
        return '';
    };
    /**
     * Get the URL of the icon of an extension.
     *
     * @param extension Extension.
     * @return Icon URL.
     */
    CoreMimetypeUtilsProvider.prototype.getExtensionIcon = function (extension) {
        var icon = this.getExtensionIconName(extension) || 'unknown';
        return this.getFileIconForType(icon);
    };
    /**
     * Get the name of the icon of an extension.
     *
     * @param extension Extension.
     * @return Icon. Undefined if not found.
     */
    CoreMimetypeUtilsProvider.prototype.getExtensionIconName = function (extension) {
        if (this.extToMime[extension]) {
            if (this.extToMime[extension].icon) {
                return this.extToMime[extension].icon;
            }
            else {
                var type = this.extToMime[extension].type.split('/')[0];
                if (type == 'video' || type == 'text' || type == 'image' || type == 'document' || type == 'audio') {
                    return type;
                }
            }
        }
    };
    /**
     * Get the "type" (string) of an extension, something like "image", "video" or "audio".
     *
     * @param extension Extension.
     * @return Type of the extension.
     */
    CoreMimetypeUtilsProvider.prototype.getExtensionType = function (extension) {
        extension = this.cleanExtension(extension);
        if (this.extToMime[extension] && this.extToMime[extension].string) {
            return this.extToMime[extension].string;
        }
    };
    /**
     * Get all the possible extensions of a mimetype. Returns empty array if not found.
     *
     * @param mimetype Mimetype.
     * @return Extensions.
     */
    CoreMimetypeUtilsProvider.prototype.getExtensions = function (mimetype) {
        mimetype = mimetype || '';
        mimetype = mimetype.split(';')[0]; // Remove codecs from the mimetype if any.
        return this.mimeToExt[mimetype] || [];
    };
    /**
     * Get a file icon URL based on its file name.
     *
     * @param The name of the file.
     * @return The path to a file icon.
     */
    CoreMimetypeUtilsProvider.prototype.getFileIcon = function (filename) {
        var ext = this.getFileExtension(filename), icon = this.getExtensionIconName(ext) || 'unknown';
        return this.getFileIconForType(icon);
    };
    /**
     * Get the folder icon URL.
     *
     * @return The path to a folder icon.
     */
    CoreMimetypeUtilsProvider.prototype.getFolderIcon = function () {
        return 'assets/img/files/folder-64.png';
    };
    /**
     * Given a type (audio, video, html, ...), return its file icon path.
     *
     * @param type The type to get the icon.
     * @return The icon path.
     */
    CoreMimetypeUtilsProvider.prototype.getFileIconForType = function (type) {
        return 'assets/img/files/' + type + '-64.png';
    };
    /**
     * Guess the extension of a file from its URL.
     * This is very weak and unreliable.
     *
     * @param fileUrl The file URL.
     * @return The lowercased extension without the dot, or undefined.
     */
    CoreMimetypeUtilsProvider.prototype.guessExtensionFromUrl = function (fileUrl) {
        var split = fileUrl.split('.');
        var candidate, extension, position;
        if (split.length > 1) {
            candidate = split.pop().toLowerCase();
            // Remove params if any.
            position = candidate.indexOf('?');
            if (position > -1) {
                candidate = candidate.substr(0, position);
            }
            if (this.extensionRegex.test(candidate)) {
                extension = candidate;
            }
        }
        // Check extension corresponds to a mimetype to know if it's valid.
        if (extension && typeof this.getMimeType(extension) == 'undefined') {
            this.logger.warn('Guess file extension: Not valid extension ' + extension);
            return;
        }
        return extension;
    };
    /**
     * Returns the file extension of a file.
     * When the file does not have an extension, it returns undefined.
     *
     * @param filename The file name.
     * @return The lowercased extension, or undefined.
     */
    CoreMimetypeUtilsProvider.prototype.getFileExtension = function (filename) {
        var dot = filename.lastIndexOf('.');
        var ext;
        if (dot > -1) {
            ext = filename.substr(dot + 1).toLowerCase();
            ext = this.cleanExtension(ext);
            // Check extension corresponds to a mimetype to know if it's valid.
            if (typeof this.getMimeType(ext) == 'undefined') {
                this.logger.warn('Get file extension: Not valid extension ' + ext);
                return;
            }
        }
        return ext;
    };
    /**
     * Get the mimetype/extension info belonging to a certain group.
     *
     * @param group Group name.
     * @param field The field to get. If not supplied, all the info will be returned.
     * @return Info for the group.
     */
    CoreMimetypeUtilsProvider.prototype.getGroupMimeInfo = function (group, field) {
        if (typeof this.groupsMimeInfo[group] == 'undefined') {
            this.fillGroupMimeInfo(group);
        }
        if (field) {
            return this.groupsMimeInfo[group][field];
        }
        return this.groupsMimeInfo[group];
    };
    /**
     * Get the mimetype of an extension. Returns undefined if not found.
     *
     * @param extension Extension.
     * @return Mimetype.
     */
    CoreMimetypeUtilsProvider.prototype.getMimeType = function (extension) {
        extension = this.cleanExtension(extension);
        if (this.extToMime[extension] && this.extToMime[extension].type) {
            return this.extToMime[extension].type;
        }
    };
    /**
     * Obtains descriptions for file types (e.g. 'Microsoft Word document') from the language file.
     * Based on Moodle's get_mimetype_description.
     *
     * @param obj Instance of FileEntry OR object with 'filename' and 'mimetype' OR string with mimetype.
     * @param capitalise If true, capitalises first character of result.
     * @return Type description.
     */
    CoreMimetypeUtilsProvider.prototype.getMimetypeDescription = function (obj, capitalise) {
        var langPrefix = 'assets.mimetypes.';
        var filename = '', mimetype = '', extension = '';
        if (typeof obj == 'object' && typeof obj.file == 'function') {
            // It's a FileEntry. Don't use the file function because it's asynchronous and the type isn't reliable.
            filename = obj.name;
        }
        else if (typeof obj == 'object') {
            filename = obj.filename || '';
            mimetype = obj.mimetype || '';
        }
        else {
            mimetype = obj;
        }
        if (filename) {
            extension = this.getFileExtension(filename);
            if (!mimetype) {
                // Try to calculate the mimetype using the extension.
                mimetype = this.getMimeType(extension);
            }
        }
        if (!mimetype) {
            // Don't have the mimetype, stop.
            return '';
        }
        if (!extension) {
            extension = this.getExtension(mimetype);
        }
        var mimetypeStr = this.getMimetypeType(mimetype) || '', chunks = mimetype.split('/'), attr = {
            mimetype: mimetype,
            ext: extension || '',
            mimetype1: chunks[0],
            mimetype2: chunks[1] || '',
        }, translateParams = {};
        for (var key in attr) {
            var value = attr[key];
            translateParams[key] = value;
            translateParams[key.toUpperCase()] = value.toUpperCase();
            translateParams[this.textUtils.ucFirst(key)] = this.textUtils.ucFirst(value);
        }
        // MIME types may include + symbol but this is not permitted in string ids.
        var safeMimetype = mimetype.replace(/\+/g, '_'), safeMimetypeStr = mimetypeStr.replace(/\+/g, '_'), safeMimetypeTrns = this.translate.instant(langPrefix + safeMimetype, { $a: translateParams }), safeMimetypeStrTrns = this.translate.instant(langPrefix + safeMimetypeStr, { $a: translateParams }), defaultTrns = this.translate.instant(langPrefix + 'default', { $a: translateParams });
        var result = mimetype;
        if (safeMimetypeTrns != langPrefix + safeMimetype) {
            result = safeMimetypeTrns;
        }
        else if (safeMimetypeStrTrns != langPrefix + safeMimetypeStr) {
            result = safeMimetypeStrTrns;
        }
        else if (defaultTrns != langPrefix + 'default') {
            result = defaultTrns;
        }
        if (capitalise) {
            result = this.textUtils.ucFirst(result);
        }
        return result;
    };
    /**
     * Get the "type" (string) of a mimetype, something like "image", "video" or "audio".
     *
     * @param mimetype Mimetype.
     * @return Type of the mimetype.
     */
    CoreMimetypeUtilsProvider.prototype.getMimetypeType = function (mimetype) {
        mimetype = mimetype.split(';')[0]; // Remove codecs from the mimetype if any.
        var extensions = this.mimeToExt[mimetype];
        if (!extensions) {
            return;
        }
        for (var i = 0; i < extensions.length; i++) {
            var extension = extensions[i];
            if (this.extToMime[extension] && this.extToMime[extension].string) {
                return this.extToMime[extension].string;
            }
        }
    };
    /**
     * Get the icon of a mimetype.
     *
     * @param mimetype Mimetype.
     * @return Type of the mimetype.
     */
    CoreMimetypeUtilsProvider.prototype.getMimetypeIcon = function (mimetype) {
        mimetype = mimetype.split(';')[0]; // Remove codecs from the mimetype if any.
        var extensions = this.mimeToExt[mimetype] || [];
        var icon = 'unknown';
        for (var i = 0; i < extensions.length; i++) {
            var iconName = this.getExtensionIconName(extensions[i]);
            if (iconName) {
                icon = iconName;
                break;
            }
        }
        return this.getFileIconForType(icon);
    };
    /**
     * Given a group name, return the translated name.
     *
     * @param name Group name.
     * @return Translated name.
     */
    CoreMimetypeUtilsProvider.prototype.getTranslatedGroupName = function (name) {
        var key = 'assets.mimetypes.group:' + name, translated = this.translate.instant(key);
        return translated != key ? translated : name;
    };
    /**
     * Check if an extension belongs to at least one of the groups.
     * Similar to Moodle's file_mimetype_in_typegroup, but using the extension instead of mimetype.
     *
     * @param extension Extension.
     * @param groups List of groups to check.
     * @return Whether the extension belongs to any of the groups.
     */
    CoreMimetypeUtilsProvider.prototype.isExtensionInGroup = function (extension, groups) {
        extension = this.cleanExtension(extension);
        if (groups && groups.length && this.extToMime[extension] && this.extToMime[extension].groups) {
            for (var i = 0; i < this.extToMime[extension].groups.length; i++) {
                var group = this.extToMime[extension].groups[i];
                if (groups.indexOf(group) != -1) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Remove the extension from a path (if any).
     *
     * @param path Path.
     * @return Path without extension.
     */
    CoreMimetypeUtilsProvider.prototype.removeExtension = function (path) {
        var position = path.lastIndexOf('.');
        var extension;
        if (position > -1) {
            // Check extension corresponds to a mimetype to know if it's valid.
            extension = path.substr(position + 1).toLowerCase();
            if (typeof this.getMimeType(extension) != 'undefined') {
                return path.substr(0, position); // Remove extension.
            }
        }
        return path;
    };
    CoreMimetypeUtilsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, CoreLoggerProvider, TranslateService,
            CoreTextUtilsProvider])
    ], CoreMimetypeUtilsProvider);
    return CoreMimetypeUtilsProvider;
}());
export { CoreMimetypeUtilsProvider };
var CoreMimetypeUtils = /** @class */ (function (_super) {
    __extends(CoreMimetypeUtils, _super);
    function CoreMimetypeUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreMimetypeUtils;
}(makeSingleton(CoreMimetypeUtilsProvider)));
export { CoreMimetypeUtils };
//# sourceMappingURL=mimetype.js.map