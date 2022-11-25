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
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { CoreApp, CoreAppProvider } from './app';
import { CoreLoggerProvider } from './logger';
import { CoreMimetypeUtilsProvider } from './utils/mimetype';
import { CoreTextUtilsProvider } from './utils/text';
import { CoreConfigConstants } from '../configconstants';
import { Zip } from '@ionic-native/zip';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Factory to interact with the file system.
 */
var CoreFileProvider = /** @class */ (function () {
    function CoreFileProvider(logger, appProvider, platform, file, textUtils, zip, mimeUtils) {
        this.platform = platform;
        this.file = file;
        this.textUtils = textUtils;
        this.zip = zip;
        this.mimeUtils = mimeUtils;
        this.initialized = false;
        this.basePath = '';
        this.isHTMLAPI = false;
        this.logger = logger.getInstance('CoreFileProvider');
        if (appProvider.isAndroid() && !Object.getOwnPropertyDescriptor(FileReader.prototype, 'onloadend')) {
            // Cordova File plugin creates some getters and setter for FileReader, but Ionic's polyfills override them in Android.
            // Create the getters and setters again. This code comes from FileReader.js in cordova-plugin-file.
            this.defineGetterSetter(FileReader.prototype, 'readyState', function () {
                return this._localURL ? this._readyState : this._realReader.readyState;
            });
            this.defineGetterSetter(FileReader.prototype, 'error', function () {
                return this._localURL ? this._error : this._realReader.error;
            });
            this.defineGetterSetter(FileReader.prototype, 'result', function () {
                return this._localURL ? this._result : this._realReader.result;
            });
            this.defineEvent('onloadstart');
            this.defineEvent('onprogress');
            this.defineEvent('onload');
            this.defineEvent('onerror');
            this.defineEvent('onloadend');
            this.defineEvent('onabort');
        }
    }
    CoreFileProvider_1 = CoreFileProvider;
    /**
     * Define an event for FileReader.
     *
     * @param eventName Name of the event.
     */
    CoreFileProvider.prototype.defineEvent = function (eventName) {
        this.defineGetterSetter(FileReader.prototype, eventName, function () {
            return this._realReader[eventName] || null;
        }, function (value) {
            this._realReader[eventName] = value;
        });
    };
    /**
     * Define a getter and, optionally, a setter for a certain property in an object.
     *
     * @param obj Object to set the getter/setter for.
     * @param key Name of the property where to set them.
     * @param getFunc The getter function.
     * @param setFunc The setter function.
     */
    CoreFileProvider.prototype.defineGetterSetter = function (obj, key, getFunc, setFunc) {
        if (Object.defineProperty) {
            var desc = {
                get: getFunc,
                configurable: true
            };
            if (setFunc) {
                desc.set = setFunc;
            }
            Object.defineProperty(obj, key, desc);
        }
        else {
            obj.__defineGetter__(key, getFunc);
            if (setFunc) {
                obj.__defineSetter__(key, setFunc);
            }
        }
    };
    /**
     * Sets basePath to use with HTML API. Reserved for core use.
     *
     * @param path Base path to use.
     */
    CoreFileProvider.prototype.setHTMLBasePath = function (path) {
        this.isHTMLAPI = true;
        this.basePath = path;
    };
    /**
     * Checks if we're using HTML API.
     *
     * @return True if uses HTML API, false otherwise.
     */
    CoreFileProvider.prototype.usesHTMLAPI = function () {
        return this.isHTMLAPI;
    };
    /**
     * Initialize basePath based on the OS if it's not initialized already.
     *
     * @return Promise to be resolved when the initialization is finished.
     */
    CoreFileProvider.prototype.init = function () {
        var _this = this;
        if (this.initialized) {
            return Promise.resolve();
        }
        return this.platform.ready().then(function () {
            if (CoreApp.instance.isAndroid()) {
                _this.basePath = _this.file.externalApplicationStorageDirectory || _this.basePath;
            }
            else if (CoreApp.instance.isIOS()) {
                _this.basePath = _this.file.documentsDirectory || _this.basePath;
            }
            else if (!_this.isAvailable() || _this.basePath === '') {
                _this.logger.error('Error getting device OS.');
                return Promise.reject(null);
            }
            _this.initialized = true;
            _this.logger.debug('FS initialized: ' + _this.basePath);
        });
    };
    /**
     * Check if the plugin is available.
     *
     * @return Whether the plugin is available.
     */
    CoreFileProvider.prototype.isAvailable = function () {
        return typeof window.resolveLocalFileSystemURL !== 'undefined';
    };
    /**
     * Get a file.
     *
     * @param path Relative path to the file.
     * @return Promise resolved when the file is retrieved.
     */
    CoreFileProvider.prototype.getFile = function (path) {
        var _this = this;
        return this.init().then(function () {
            _this.logger.debug('Get file: ' + path);
            return _this.file.resolveLocalFilesystemUrl(_this.addBasePathIfNeeded(path));
        }).then(function (entry) {
            return entry;
        });
    };
    /**
     * Get a directory.
     *
     * @param path Relative path to the directory.
     * @return Promise resolved when the directory is retrieved.
     */
    CoreFileProvider.prototype.getDir = function (path) {
        var _this = this;
        return this.init().then(function () {
            _this.logger.debug('Get directory: ' + path);
            return _this.file.resolveDirectoryUrl(_this.addBasePathIfNeeded(path));
        });
    };
    /**
     * Get site folder path.
     *
     * @param siteId Site ID.
     * @return Site folder path.
     */
    CoreFileProvider.prototype.getSiteFolder = function (siteId) {
        return CoreFileProvider_1.SITESFOLDER + '/' + siteId;
    };
    /**
     * Create a directory or a file.
     *
     * @param isDirectory True if a directory should be created, false if it should create a file.
     * @param path Relative path to the dir/file.
     * @param failIfExists True if it should fail if the dir/file exists, false otherwise.
     * @param base Base path to create the dir/file in. If not set, use basePath.
     * @return Promise to be resolved when the dir/file is created.
     */
    CoreFileProvider.prototype.create = function (isDirectory, path, failIfExists, base) {
        var _this = this;
        return this.init().then(function () {
            // Remove basePath if it's in the path.
            path = _this.removeStartingSlash(path.replace(_this.basePath, ''));
            base = base || _this.basePath;
            if (path.indexOf('/') == -1) {
                if (isDirectory) {
                    _this.logger.debug('Create dir ' + path + ' in ' + base);
                    return _this.file.createDir(base, path, !failIfExists);
                }
                else {
                    _this.logger.debug('Create file ' + path + ' in ' + base);
                    return _this.file.createFile(base, path, !failIfExists);
                }
            }
            else {
                // The file plugin doesn't allow creating more than 1 level at a time (e.g. tmp/folder).
                // We need to create them 1 by 1.
                var firstDir_1 = path.substr(0, path.indexOf('/')), restOfPath_1 = path.substr(path.indexOf('/') + 1);
                _this.logger.debug('Create dir ' + firstDir_1 + ' in ' + base);
                return _this.file.createDir(base, firstDir_1, true).then(function (newDirEntry) {
                    return _this.create(isDirectory, restOfPath_1, failIfExists, newDirEntry.toURL());
                }).catch(function (error) {
                    _this.logger.error('Error creating directory ' + firstDir_1 + ' in ' + base);
                    return Promise.reject(error);
                });
            }
        });
    };
    /**
     * Create a directory.
     *
     * @param path Relative path to the directory.
     * @param failIfExists True if it should fail if the directory exists, false otherwise.
     * @return Promise to be resolved when the directory is created.
     */
    CoreFileProvider.prototype.createDir = function (path, failIfExists) {
        return this.create(true, path, failIfExists);
    };
    /**
     * Create a file.
     *
     * @param path Relative path to the file.
     * @param failIfExists True if it should fail if the file exists, false otherwise..
     * @return Promise to be resolved when the file is created.
     */
    CoreFileProvider.prototype.createFile = function (path, failIfExists) {
        return this.create(false, path, failIfExists);
    };
    /**
     * Removes a directory and all its contents.
     *
     * @param path Relative path to the directory.
     * @return Promise to be resolved when the directory is deleted.
     */
    CoreFileProvider.prototype.removeDir = function (path) {
        var _this = this;
        return this.init().then(function () {
            // Remove basePath if it's in the path.
            path = _this.removeStartingSlash(path.replace(_this.basePath, ''));
            _this.logger.debug('Remove directory: ' + path);
            return _this.file.removeRecursively(_this.basePath, path);
        });
    };
    /**
     * Removes a file and all its contents.
     *
     * @param path Relative path to the file.
     * @return Promise to be resolved when the file is deleted.
     */
    CoreFileProvider.prototype.removeFile = function (path) {
        var _this = this;
        return this.init().then(function () {
            // Remove basePath if it's in the path.
            path = _this.removeStartingSlash(path.replace(_this.basePath, ''));
            _this.logger.debug('Remove file: ' + path);
            return _this.file.removeFile(_this.basePath, path).catch(function (error) {
                // The delete can fail if the path has encoded characters. Try again if that's the case.
                var decodedPath = decodeURI(path);
                if (decodedPath != path) {
                    return _this.file.removeFile(_this.basePath, decodedPath);
                }
                else {
                    return Promise.reject(error);
                }
            });
        });
    };
    /**
     * Removes a file given its FileEntry.
     *
     * @param fileEntry File Entry.
     * @return Promise resolved when the file is deleted.
     */
    CoreFileProvider.prototype.removeFileByFileEntry = function (fileEntry) {
        return new Promise(function (resolve, reject) {
            fileEntry.remove(resolve, reject);
        });
    };
    /**
     * Retrieve the contents of a directory (not subdirectories).
     *
     * @param path Relative path to the directory.
     * @return Promise to be resolved when the contents are retrieved.
     */
    CoreFileProvider.prototype.getDirectoryContents = function (path) {
        var _this = this;
        return this.init().then(function () {
            // Remove basePath if it's in the path.
            path = _this.removeStartingSlash(path.replace(_this.basePath, ''));
            _this.logger.debug('Get contents of dir: ' + path);
            return _this.file.listDir(_this.basePath, path);
        });
    };
    /**
     * Calculate the size of a directory or a file.
     *
     * @param entry Directory or file.
     * @return Promise to be resolved when the size is calculated.
     */
    CoreFileProvider.prototype.getSize = function (entry) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (entry.isDirectory) {
                var directoryReader = entry.createReader();
                directoryReader.readEntries(function (entries) {
                    var promises = [];
                    for (var i = 0; i < entries.length; i++) {
                        promises.push(_this.getSize(entries[i]));
                    }
                    Promise.all(promises).then(function (sizes) {
                        var directorySize = 0;
                        for (var i = 0; i < sizes.length; i++) {
                            var fileSize = parseInt(sizes[i]);
                            if (isNaN(fileSize)) {
                                reject();
                                return;
                            }
                            directorySize += fileSize;
                        }
                        resolve(directorySize);
                    }, reject);
                }, reject);
            }
            else if (entry.isFile) {
                entry.file(function (file) {
                    resolve(file.size);
                }, reject);
            }
        });
    };
    /**
     * Calculate the size of a directory.
     *
     * @param path Relative path to the directory.
     * @return Promise to be resolved when the size is calculated.
     */
    CoreFileProvider.prototype.getDirectorySize = function (path) {
        var _this = this;
        // Remove basePath if it's in the path.
        path = this.removeStartingSlash(path.replace(this.basePath, ''));
        this.logger.debug('Get size of dir: ' + path);
        return this.getDir(path).then(function (dirEntry) {
            return _this.getSize(dirEntry);
        });
    };
    /**
     * Calculate the size of a file.
     *
     * @param path Relative path to the file.
     * @return Promise to be resolved when the size is calculated.
     */
    CoreFileProvider.prototype.getFileSize = function (path) {
        var _this = this;
        // Remove basePath if it's in the path.
        path = this.removeStartingSlash(path.replace(this.basePath, ''));
        this.logger.debug('Get size of file: ' + path);
        return this.getFile(path).then(function (fileEntry) {
            return _this.getSize(fileEntry);
        });
    };
    /**
     * Get file object from a FileEntry.
     *
     * @param path Relative path to the file.
     * @return Promise to be resolved when the file is retrieved.
     */
    CoreFileProvider.prototype.getFileObjectFromFileEntry = function (entry) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.logger.debug('Get file object of: ' + entry.fullPath);
            entry.file(resolve, reject);
        });
    };
    /**
     * Calculate the free space in the disk.
     * Please notice that this function isn't reliable and it's not documented in the Cordova File plugin.
     *
     * @return Promise resolved with the estimated free space in bytes.
     */
    CoreFileProvider.prototype.calculateFreeSpace = function () {
        return this.file.getFreeDiskSpace().then(function (size) {
            if (CoreApp.instance.isIOS()) {
                // In iOS the size is in bytes.
                return Number(size);
            }
            // The size is in KB, convert it to bytes.
            return Number(size) * 1024;
        });
    };
    /**
     * Normalize a filename that usually comes URL encoded.
     *
     * @param filename The file name.
     * @return The file name normalized.
     */
    CoreFileProvider.prototype.normalizeFileName = function (filename) {
        filename = this.textUtils.decodeURIComponent(filename);
        return filename;
    };
    /**
     * Read a file from local file system.
     *
     * @param path Relative path to the file.
     * @param format Format to read the file. Must be one of:
     *               FORMATTEXT
     *               FORMATDATAURL
     *               FORMATBINARYSTRING
     *               FORMATARRAYBUFFER
     *               FORMATJSON
     * @return Promise to be resolved when the file is read.
     */
    CoreFileProvider.prototype.readFile = function (path, format) {
        var _this = this;
        if (format === void 0) { format = CoreFileProvider_1.FORMATTEXT; }
        // Remove basePath if it's in the path.
        path = this.removeStartingSlash(path.replace(this.basePath, ''));
        this.logger.debug('Read file ' + path + ' with format ' + format);
        switch (format) {
            case CoreFileProvider_1.FORMATDATAURL:
                return this.file.readAsDataURL(this.basePath, path);
            case CoreFileProvider_1.FORMATBINARYSTRING:
                return this.file.readAsBinaryString(this.basePath, path);
            case CoreFileProvider_1.FORMATARRAYBUFFER:
                return this.file.readAsArrayBuffer(this.basePath, path);
            case CoreFileProvider_1.FORMATJSON:
                return this.file.readAsText(this.basePath, path).then(function (text) {
                    var parsed = _this.textUtils.parseJSON(text, null);
                    if (parsed == null && text != null) {
                        return Promise.reject('Error parsing JSON file: ' + path);
                    }
                    return parsed;
                });
            default:
                return this.file.readAsText(this.basePath, path);
        }
    };
    /**
     * Read file contents from a file data object.
     *
     * @param fileData File's data.
     * @param format Format to read the file. Must be one of:
     *               FORMATTEXT
     *               FORMATDATAURL
     *               FORMATBINARYSTRING
     *               FORMATARRAYBUFFER
     *               FORMATJSON
     * @return Promise to be resolved when the file is read.
     */
    CoreFileProvider.prototype.readFileData = function (fileData, format) {
        var _this = this;
        if (format === void 0) { format = CoreFileProvider_1.FORMATTEXT; }
        format = format || CoreFileProvider_1.FORMATTEXT;
        this.logger.debug('Read file from file data with format ' + format);
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onloadend = function (evt) {
                var target = evt.target; // Convert to <any> to be able to use non-standard properties.
                if (target.result !== undefined && target.result !== null) {
                    if (format == CoreFileProvider_1.FORMATJSON) {
                        // Convert to object.
                        var parsed = _this.textUtils.parseJSON(target.result, null);
                        if (parsed == null) {
                            reject('Error parsing JSON file.');
                        }
                        resolve(parsed);
                    }
                    else {
                        resolve(target.result);
                    }
                }
                else if (target.error !== undefined && target.error !== null) {
                    reject(target.error);
                }
                else {
                    reject({ code: null, message: 'READER_ONLOADEND_ERR' });
                }
            };
            // Check if the load starts. If it doesn't start in 3 seconds, reject.
            // Sometimes in Android the read doesn't start for some reason, so the promise never finishes.
            var hasStarted = false;
            reader.onloadstart = function (evt) {
                hasStarted = true;
            };
            setTimeout(function () {
                if (!hasStarted) {
                    reject('Upload cannot start.');
                }
            }, 3000);
            switch (format) {
                case CoreFileProvider_1.FORMATDATAURL:
                    reader.readAsDataURL(fileData);
                    break;
                case CoreFileProvider_1.FORMATBINARYSTRING:
                    reader.readAsBinaryString(fileData);
                    break;
                case CoreFileProvider_1.FORMATARRAYBUFFER:
                    reader.readAsArrayBuffer(fileData);
                    break;
                default:
                    reader.readAsText(fileData);
            }
        });
    };
    /**
     * Writes some data in a file.
     *
     * @param path Relative path to the file.
     * @param data Data to write.
     * @param append Whether to append the data to the end of the file.
     * @return Promise to be resolved when the file is written.
     */
    CoreFileProvider.prototype.writeFile = function (path, data, append) {
        var _this = this;
        return this.init().then(function () {
            // Remove basePath if it's in the path.
            path = _this.removeStartingSlash(path.replace(_this.basePath, ''));
            _this.logger.debug('Write file: ' + path);
            // Create file (and parent folders) to prevent errors.
            return _this.createFile(path).then(function (fileEntry) {
                if (_this.isHTMLAPI && !CoreApp.instance.isDesktop() &&
                    (typeof data == 'string' || data.toString() == '[object ArrayBuffer]')) {
                    // We need to write Blobs.
                    var type = _this.mimeUtils.getMimeType(_this.mimeUtils.getFileExtension(path));
                    data = new Blob([data], { type: type || 'text/plain' });
                }
                return _this.file.writeFile(_this.basePath, path, data, { replace: !append, append: !!append }).then(function () {
                    return fileEntry;
                });
            });
        });
    };
    /**
     * Write some file data into a filesystem file.
     * It's done in chunks to prevent crashing the app for big files.
     * Please notice Ionic Native writeFile function already splits by chunks, but it doesn't have an onProgress function.
     *
     * @param file The data to write.
     * @param path Path where to store the data.
     * @param onProgress Function to call on progress.
     * @param offset Offset where to start reading from.
     * @param append Whether to append the data to the end of the file.
     * @return Promise resolved when done.
     */
    CoreFileProvider.prototype.writeFileDataInFile = function (file, path, onProgress, offset, append) {
        if (offset === void 0) { offset = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var chunk, fileEntry, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offset = offset || 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        chunk = file.slice(offset, Math.min(offset + CoreFileProvider_1.CHUNK_SIZE, file.size));
                        return [4 /*yield*/, this.writeFile(path, chunk, append)];
                    case 2:
                        fileEntry = _a.sent();
                        offset += CoreFileProvider_1.CHUNK_SIZE;
                        onProgress && onProgress({
                            lengthComputable: true,
                            loaded: offset,
                            total: file.size
                        });
                        if (offset >= file.size) {
                            // Done, stop.
                            return [2 /*return*/, fileEntry];
                        }
                        // Read the next chunk.
                        return [2 /*return*/, this.writeFileDataInFile(file, path, onProgress, offset, true)];
                    case 3:
                        error_1 = _a.sent();
                        if (error_1 && error_1.target && error_1.target.error) {
                            // Error returned by the writer, get the "real" error.
                            error_1 = error_1.target.error;
                        }
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets a file that might be outside the app's folder.
     *
     * @param fullPath Absolute path to the file.
     * @return Promise to be resolved when the file is retrieved.
     */
    CoreFileProvider.prototype.getExternalFile = function (fullPath) {
        return this.file.resolveLocalFilesystemUrl(fullPath).then(function (entry) {
            return entry;
        });
    };
    /**
     * Calculate the size of a file.
     *
     * @param path Absolute path to the file.
     * @return Promise to be resolved when the size is calculated.
     */
    CoreFileProvider.prototype.getExternalFileSize = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var fileEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getExternalFile(path)];
                    case 1:
                        fileEntry = _a.sent();
                        return [2 /*return*/, this.getSize(fileEntry)];
                }
            });
        });
    };
    /**
     * Removes a file that might be outside the app's folder.
     *
     * @param fullPath Absolute path to the file.
     * @return Promise to be resolved when the file is removed.
     */
    CoreFileProvider.prototype.removeExternalFile = function (fullPath) {
        var directory = fullPath.substring(0, fullPath.lastIndexOf('/')), filename = fullPath.substr(fullPath.lastIndexOf('/') + 1);
        return this.file.removeFile(directory, filename);
    };
    /**
     * Get the base path where the application files are stored.
     *
     * @return Promise to be resolved when the base path is retrieved.
     */
    CoreFileProvider.prototype.getBasePath = function () {
        var _this = this;
        return this.init().then(function () {
            if (_this.basePath.slice(-1) == '/') {
                return _this.basePath;
            }
            else {
                return _this.basePath + '/';
            }
        });
    };
    /**
     * Get the base path where the application files are stored in the format to be used for downloads.
     * iOS: Internal URL (cdvfile://).
     * Others: basePath (file://)
     *
     * @return Promise to be resolved when the base path is retrieved.
     */
    CoreFileProvider.prototype.getBasePathToDownload = function () {
        var _this = this;
        return this.init().then(function () {
            if (CoreApp.instance.isIOS()) {
                // In iOS we want the internal URL (cdvfile://localhost/persistent/...).
                return _this.file.resolveDirectoryUrl(_this.basePath).then(function (dirEntry) {
                    return dirEntry.toInternalURL();
                });
            }
            else {
                // In the other platforms we use the basePath as it is (file://...).
                return _this.basePath;
            }
        });
    };
    /**
     * Get the base path where the application files are stored. Returns the value instantly, without waiting for it to be ready.
     *
     * @return Base path. If the service hasn't been initialized it will return an invalid value.
     */
    CoreFileProvider.prototype.getBasePathInstant = function () {
        if (!this.basePath) {
            return this.basePath;
        }
        else if (this.basePath.slice(-1) == '/') {
            return this.basePath;
        }
        else {
            return this.basePath + '/';
        }
    };
    /**
     * Move a dir.
     *
     * @param originalPath Path to the dir to move.
     * @param newPath New path of the dir.
     * @param destDirExists Set it to true if you know the directory where to put the dir exists. If false, the function will
     *                      try to create it (slower).
     * @return Promise resolved when the entry is moved.
     */
    CoreFileProvider.prototype.moveDir = function (originalPath, newPath, destDirExists) {
        return this.copyOrMoveFileOrDir(originalPath, newPath, true, false, destDirExists);
    };
    /**
     * Move a file.
     *
     * @param originalPath Path to the file to move.
     * @param newPath New path of the file.
     * @param destDirExists Set it to true if you know the directory where to put the file exists. If false, the function will
     *                      try to create it (slower).
     * @return Promise resolved when the entry is moved.
     */
    CoreFileProvider.prototype.moveFile = function (originalPath, newPath, destDirExists) {
        return this.copyOrMoveFileOrDir(originalPath, newPath, false, false, destDirExists);
    };
    /**
     * Copy a directory.
     *
     * @param from Path to the directory to move.
     * @param to New path of the directory.
     * @param destDirExists Set it to true if you know the directory where to put the dir exists. If false, the function will
     *                      try to create it (slower).
     * @return Promise resolved when the entry is copied.
     */
    CoreFileProvider.prototype.copyDir = function (from, to, destDirExists) {
        return this.copyOrMoveFileOrDir(from, to, true, true, destDirExists);
    };
    /**
     * Copy a file.
     *
     * @param from Path to the file to move.
     * @param to New path of the file.
     * @param destDirExists Set it to true if you know the directory where to put the file exists. If false, the function will
     *                      try to create it (slower).
     * @return Promise resolved when the entry is copied.
     */
    CoreFileProvider.prototype.copyFile = function (from, to, destDirExists) {
        return this.copyOrMoveFileOrDir(from, to, false, true, destDirExists);
    };
    /**
     * Copy or move a file or a directory.
     *
     * @param from Path to the file/dir to move.
     * @param to New path of the file/dir.
     * @param isDir Whether it's a dir or a file.
     * @param copy Whether to copy. If false, it will move the file.
     * @param destDirExists Set it to true if you know the directory where to put the file/dir exists. If false, the function will
     *                      try to create it (slower).
     * @return Promise resolved when the entry is copied.
     */
    CoreFileProvider.prototype.copyOrMoveFileOrDir = function (from, to, isDir, copy, destDirExists) {
        return __awaiter(this, void 0, void 0, function () {
            var fileIsInAppFolder, moveCopyFn, toFileAndDir, entry, error_2, decodedFrom, decodedTo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileIsInAppFolder = this.isPathInAppFolder(from);
                        if (!fileIsInAppFolder) {
                            return [2 /*return*/, this.copyOrMoveExternalFile(from, to, copy)];
                        }
                        moveCopyFn = copy ?
                            (isDir ? this.file.copyDir.bind(this.file) : this.file.copyFile.bind(this.file)) :
                            (isDir ? this.file.moveDir.bind(this.file) : this.file.moveFile.bind(this.file));
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        // Paths cannot start with "/". Remove basePath if present.
                        from = this.removeStartingSlash(from.replace(this.basePath, ''));
                        to = this.removeStartingSlash(to.replace(this.basePath, ''));
                        toFileAndDir = this.getFileAndDirectoryFromPath(to);
                        if (!(toFileAndDir.directory && !destDirExists)) return [3 /*break*/, 3];
                        // Create the target directory if it doesn't exist.
                        return [4 /*yield*/, this.createDir(toFileAndDir.directory)];
                    case 2:
                        // Create the target directory if it doesn't exist.
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, moveCopyFn(this.basePath, from, this.basePath, to)];
                    case 4:
                        entry = _a.sent();
                        return [2 /*return*/, entry];
                    case 5:
                        error_2 = _a.sent();
                        decodedFrom = decodeURI(from);
                        decodedTo = decodeURI(to);
                        if (from != decodedFrom || to != decodedTo) {
                            return [2 /*return*/, moveCopyFn(this.basePath, decodedFrom, this.basePath, decodedTo)];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(error_2)];
                        }
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Extract the file name and directory from a given path.
     *
     * @param path Path to be extracted.
     * @return Plain object containing the file name and directory.
     * @description
     * file.pdf         -> directory: '', name: 'file.pdf'
     * /file.pdf        -> directory: '', name: 'file.pdf'
     * path/file.pdf    -> directory: 'path', name: 'file.pdf'
     * path/            -> directory: 'path', name: ''
     * path             -> directory: '', name: 'path'
     */
    CoreFileProvider.prototype.getFileAndDirectoryFromPath = function (path) {
        var file = {
            directory: '',
            name: ''
        };
        file.directory = path.substring(0, path.lastIndexOf('/'));
        file.name = path.substr(path.lastIndexOf('/') + 1);
        return file;
    };
    /**
     * Get the internal URL of a file.
     * Please notice that with WKWebView these URLs no longer work in mobile. Use fileEntry.toURL() along with convertFileSrc.
     *
     * @param fileEntry File Entry.
     * @return Internal URL.
     */
    CoreFileProvider.prototype.getInternalURL = function (fileEntry) {
        if (!fileEntry.toInternalURL) {
            // File doesn't implement toInternalURL, use toURL.
            return fileEntry.toURL();
        }
        return fileEntry.toInternalURL();
    };
    /**
     * Adds the basePath to a path if it doesn't have it already.
     *
     * @param path Path to treat.
     * @return Path with basePath added.
     */
    CoreFileProvider.prototype.addBasePathIfNeeded = function (path) {
        if (path.indexOf(this.basePath) > -1) {
            return path;
        }
        else {
            return this.textUtils.concatenatePaths(this.basePath, path);
        }
    };
    /**
     * Remove the base path from a path. If basePath isn't found, return false.
     *
     * @param path Path to treat.
     * @return Path without basePath if basePath was found, undefined otherwise.
     */
    CoreFileProvider.prototype.removeBasePath = function (path) {
        if (path.indexOf(this.basePath) > -1) {
            return path.replace(this.basePath, '');
        }
    };
    /**
     * Unzips a file.
     *
     * @param path Path to the ZIP file.
     * @param destFolder Path to the destination folder. If not defined, a new folder will be created with the
     *                   same location and name as the ZIP file (without extension).
     * @param onProgress Function to call on progress.
     * @param recreateDir Delete the dest directory before unzipping. Defaults to true.
     * @return Promise resolved when the file is unzipped.
     */
    CoreFileProvider.prototype.unzipFile = function (path, destFolder, onProgress, recreateDir) {
        var _this = this;
        if (recreateDir === void 0) { recreateDir = true; }
        // Get the source file.
        var fileEntry;
        return this.getFile(path).then(function (fe) {
            fileEntry = fe;
            if (destFolder && recreateDir) {
                // Make sure the dest dir doesn't exist already.
                return _this.removeDir(destFolder).catch(function () {
                    // Ignore errors.
                }).then(function () {
                    // Now create the dir, otherwise if any of the ancestor dirs doesn't exist the unzip would fail.
                    return _this.createDir(destFolder);
                });
            }
        }).then(function () {
            // If destFolder is not set, use same location as ZIP file. We need to use absolute paths (including basePath).
            destFolder = _this.addBasePathIfNeeded(destFolder || _this.mimeUtils.removeExtension(path));
            return _this.zip.unzip(fileEntry.toURL(), destFolder, onProgress);
        }).then(function (result) {
            if (result == -1) {
                return Promise.reject('Unzip failed.');
            }
        });
    };
    /**
     * Search a string or regexp in a file contents and replace it. The result is saved in the same file.
     *
     * @param path Path to the file.
     * @param search Value to search.
     * @param newValue New value.
     * @return Promise resolved in success.
     */
    CoreFileProvider.prototype.replaceInFile = function (path, search, newValue) {
        var _this = this;
        return this.readFile(path).then(function (content) {
            if (typeof content == 'undefined' || content === null || !content.replace) {
                return Promise.reject(null);
            }
            if (content.match(search)) {
                content = content.replace(search, newValue);
                return _this.writeFile(path, content);
            }
        });
    };
    /**
     * Get a file/dir metadata given the file's entry.
     *
     * @param fileEntry FileEntry retrieved from getFile or similar.
     * @return Promise resolved with metadata.
     */
    CoreFileProvider.prototype.getMetadata = function (fileEntry) {
        if (!fileEntry || !fileEntry.getMetadata) {
            return Promise.reject(null);
        }
        return new Promise(function (resolve, reject) {
            fileEntry.getMetadata(resolve, reject);
        });
    };
    /**
     * Get a file/dir metadata given the path.
     *
     * @param path Path to the file/dir.
     * @param isDir True if directory, false if file.
     * @return Promise resolved with metadata.
     */
    CoreFileProvider.prototype.getMetadataFromPath = function (path, isDir) {
        var _this = this;
        var promise;
        if (isDir) {
            promise = this.getDir(path);
        }
        else {
            promise = this.getFile(path);
        }
        return promise.then(function (entry) {
            return _this.getMetadata(entry);
        });
    };
    /**
     * Remove the starting slash of a path if it's there. E.g. '/sites/filepool' -> 'sites/filepool'.
     *
     * @param path Path.
     * @return Path without a slash in the first position.
     */
    CoreFileProvider.prototype.removeStartingSlash = function (path) {
        if (path[0] == '/') {
            return path.substr(1);
        }
        return path;
    };
    /**
     * Convenience function to copy or move an external file.
     *
     * @param from Absolute path to the file to copy/move.
     * @param to Relative new path of the file (inside the app folder).
     * @param copy True to copy, false to move.
     * @return Promise resolved when the entry is copied/moved.
     */
    CoreFileProvider.prototype.copyOrMoveExternalFile = function (from, to, copy) {
        var _this = this;
        // Get the file to copy/move.
        return this.getExternalFile(from).then(function (fileEntry) {
            // Create the destination dir if it doesn't exist.
            var dirAndFile = _this.getFileAndDirectoryFromPath(to);
            return _this.createDir(dirAndFile.directory).then(function (dirEntry) {
                // Now copy/move the file.
                return new Promise(function (resolve, reject) {
                    if (copy) {
                        fileEntry.copyTo(dirEntry, dirAndFile.name, resolve, reject);
                    }
                    else {
                        fileEntry.moveTo(dirEntry, dirAndFile.name, resolve, reject);
                    }
                });
            });
        });
    };
    /**
     * Copy a file from outside of the app folder to somewhere inside the app folder.
     *
     * @param from Absolute path to the file to copy.
     * @param to Relative new path of the file (inside the app folder).
     * @return Promise resolved when the entry is copied.
     */
    CoreFileProvider.prototype.copyExternalFile = function (from, to) {
        return this.copyOrMoveExternalFile(from, to, true);
    };
    /**
     * Move a file from outside of the app folder to somewhere inside the app folder.
     *
     * @param from Absolute path to the file to move.
     * @param to Relative new path of the file (inside the app folder).
     * @return Promise resolved when the entry is moved.
     */
    CoreFileProvider.prototype.moveExternalFile = function (from, to) {
        return this.copyOrMoveExternalFile(from, to, false);
    };
    /**
     * Get a unique file name inside a folder, adding numbers to the file name if needed.
     *
     * @param dirPath Path to the destination folder.
     * @param fileName File name that wants to be used.
     * @param defaultExt Default extension to use if no extension found in the file.
     * @return Promise resolved with the unique file name.
     */
    CoreFileProvider.prototype.getUniqueNameInFolder = function (dirPath, fileName, defaultExt) {
        var _this = this;
        // Get existing files in the folder.
        return this.getDirectoryContents(dirPath).then(function (entries) {
            var files = {};
            var fileNameWithoutExtension = _this.mimeUtils.removeExtension(fileName);
            var extension = _this.mimeUtils.getFileExtension(fileName) || defaultExt;
            // Clean the file name.
            fileNameWithoutExtension = _this.textUtils.removeSpecialCharactersForFiles(_this.textUtils.decodeURIComponent(fileNameWithoutExtension));
            // Index the files by name.
            entries.forEach(function (entry) {
                files[entry.name.toLowerCase()] = entry;
            });
            // Format extension.
            if (extension) {
                extension = '.' + extension;
            }
            else {
                extension = '';
            }
            return _this.calculateUniqueName(files, fileNameWithoutExtension + extension);
        }).catch(function () {
            // Folder doesn't exist, name is unique. Clean it and return it.
            return _this.textUtils.removeSpecialCharactersForFiles(_this.textUtils.decodeURIComponent(fileName));
        });
    };
    /**
     * Given a file name and a set of already used names, calculate a unique name.
     *
     * @param usedNames Object with names already used as keys.
     * @param name Name to check.
     * @return Unique name.
     */
    CoreFileProvider.prototype.calculateUniqueName = function (usedNames, name) {
        if (typeof usedNames[name.toLowerCase()] == 'undefined') {
            // No file with the same name.
            return name;
        }
        else {
            // Repeated name. Add a number until we find a free name.
            var nameWithoutExtension = this.mimeUtils.removeExtension(name);
            var extension = this.mimeUtils.getFileExtension(name);
            var num = 1;
            extension = extension ? '.' + extension : '';
            do {
                name = nameWithoutExtension + '(' + num + ')' + extension;
                num++;
            } while (typeof usedNames[name.toLowerCase()] != 'undefined');
            return name;
        }
    };
    /**
     * Remove app temporary folder.
     *
     * @return Promise resolved when done.
     */
    CoreFileProvider.prototype.clearTmpFolder = function () {
        return this.removeDir(CoreFileProvider_1.TMPFOLDER).catch(function () {
            // Ignore errors because the folder might not exist.
        });
    };
    /**
     * Given a folder path and a list of used files, remove all the files of the folder that aren't on the list of used files.
     *
     * @param dirPath Folder path.
     * @param files List of used files.
     * @return Promise resolved when done, rejected if failure.
     */
    CoreFileProvider.prototype.removeUnusedFiles = function (dirPath, files) {
        var _this = this;
        // Get the directory contents.
        return this.getDirectoryContents(dirPath).then(function (contents) {
            if (!contents.length) {
                return;
            }
            var filesMap = {}, promises = [];
            // Index the received files by fullPath and ignore the invalid ones.
            files.forEach(function (file) {
                if (file.fullPath) {
                    filesMap[file.fullPath] = file;
                }
            });
            // Check which of the content files aren't used anymore and delete them.
            contents.forEach(function (file) {
                if (!filesMap[file.fullPath]) {
                    // File isn't used, delete it.
                    promises.push(_this.removeFileByFileEntry(file));
                }
            });
            return Promise.all(promises);
        }).catch(function () {
            // Ignore errors, maybe it doesn't exist.
        });
    };
    /**
     * Check if a file is inside the app's folder.
     *
     * @param path The absolute path of the file to check.
     * @return Whether the file is in the app's folder.
     */
    CoreFileProvider.prototype.isFileInAppFolder = function (path) {
        return path.indexOf(this.basePath) != -1;
    };
    /**
     * Get the path to the www folder at runtime based on the WebView URL.
     *
     * @return Path.
     */
    CoreFileProvider.prototype.getWWWPath = function () {
        var position = window.location.href.indexOf('index.html');
        if (position != -1) {
            return window.location.href.substr(0, position);
        }
        return window.location.href;
    };
    /**
     * Get the full path to the www folder.
     *
     * @return Path.
     */
    CoreFileProvider.prototype.getWWWAbsolutePath = function () {
        if (cordova && cordova.file && cordova.file.applicationDirectory) {
            return this.textUtils.concatenatePaths(cordova.file.applicationDirectory, 'www');
        }
        // Cannot use Cordova to get it, use the WebView URL.
        return this.getWWWPath();
    };
    /**
     * Helper function to call Ionic WebView convertFileSrc only in the needed platforms.
     * This is needed to make files work with the Ionic WebView plugin.
     *
     * @param src Source to convert.
     * @return Converted src.
     */
    CoreFileProvider.prototype.convertFileSrc = function (src) {
        return CoreApp.instance.isIOS() ? window.Ionic.WebView.convertFileSrc(src) : src;
    };
    /**
     * Undo the conversion of convertFileSrc.
     *
     * @param src Source to unconvert.
     * @return Unconverted src.
     */
    CoreFileProvider.prototype.unconvertFileSrc = function (src) {
        if (!CoreApp.instance.isIOS()) {
            return src;
        }
        return src.replace(CoreConfigConstants.ioswebviewscheme + '://localhost/_app_file_', 'file://');
    };
    /**
     * Check if a certain path is in the app's folder (basePath).
     *
     * @param path Path to check.
     * @return Whether it's in the app folder.
     */
    CoreFileProvider.prototype.isPathInAppFolder = function (path) {
        return !path || !path.match(/^[a-z0-9]+:\/\//i) || path.indexOf(this.basePath) != -1;
    };
    // Formats to read a file.
    CoreFileProvider.FORMATTEXT = 0;
    CoreFileProvider.FORMATDATAURL = 1;
    CoreFileProvider.FORMATBINARYSTRING = 2;
    CoreFileProvider.FORMATARRAYBUFFER = 3;
    CoreFileProvider.FORMATJSON = 4;
    // Folders.
    CoreFileProvider.SITESFOLDER = 'sites';
    CoreFileProvider.TMPFOLDER = 'tmp';
    CoreFileProvider.CHUNK_SIZE = 1048576; // 1 MB. Same chunk size as Ionic Native.
    CoreFileProvider = CoreFileProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            CoreAppProvider,
            Platform,
            File,
            CoreTextUtilsProvider,
            Zip,
            CoreMimetypeUtilsProvider])
    ], CoreFileProvider);
    return CoreFileProvider;
    var CoreFileProvider_1;
}());
export { CoreFileProvider };
var CoreFile = /** @class */ (function (_super) {
    __extends(CoreFile, _super);
    function CoreFile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreFile;
}(makeSingleton(CoreFileProvider)));
export { CoreFile };
//# sourceMappingURL=file.js.map