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
import { ModalController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';
import { TranslateService } from '@ngx-translate/core';
import { CoreFileProvider } from '@providers/file';
import { CoreFilepoolProvider } from '@providers/filepool';
import { CoreLoggerProvider } from '@providers/logger';
import { CoreSitesProvider } from '@providers/sites';
import { CoreMimetypeUtilsProvider } from '@providers/utils/mimetype';
import { CoreTextUtilsProvider } from '@providers/utils/text';
import { CoreTimeUtilsProvider } from '@providers/utils/time';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { Subject } from 'rxjs';
import { CoreApp } from '@providers/app';
import { makeSingleton } from '@singletons/core.singletons';
/**
 * Service to upload files.
 */
var CoreFileUploaderProvider = /** @class */ (function () {
    function CoreFileUploaderProvider(logger, fileProvider, textUtils, utils, sitesProvider, timeUtils, mimeUtils, filepoolProvider, translate, mediaCapture, camera, modalCtrl) {
        this.fileProvider = fileProvider;
        this.textUtils = textUtils;
        this.utils = utils;
        this.sitesProvider = sitesProvider;
        this.timeUtils = timeUtils;
        this.mimeUtils = mimeUtils;
        this.filepoolProvider = filepoolProvider;
        this.translate = translate;
        this.mediaCapture = mediaCapture;
        this.camera = camera;
        this.modalCtrl = modalCtrl;
        // Observers to notify when a media file starts/stops being recorded/selected.
        this.onGetPicture = new Subject();
        this.onAudioCapture = new Subject();
        this.onVideoCapture = new Subject();
        this.logger = logger.getInstance('CoreFileUploaderProvider');
    }
    /**
     * Add a dot to the beginning of an extension.
     *
     * @param extension Extension.
     * @return Treated extension.
     */
    CoreFileUploaderProvider.prototype.addDot = function (extension) {
        return '.' + extension;
    };
    /**
     * Compares two file lists and returns if they are different.
     *
     * @param a First file list.
     * @param b Second file list.
     * @return Whether both lists are different.
     */
    CoreFileUploaderProvider.prototype.areFileListDifferent = function (a, b) {
        a = a || [];
        b = b || [];
        if (a.length != b.length) {
            return true;
        }
        // Currently we are going to compare the order of the files as well.
        // This function can be improved comparing more fields or not comparing the order.
        for (var i = 0; i < a.length; i++) {
            if (a[i].name != b[i].name || a[i].filename != b[i].filename) {
                return true;
            }
        }
        return false;
    };
    /**
     * Check if a certain site allows deleting draft files.
     *
     * @param siteId Site Id. If not defined, use current site.
     * @return Promise resolved with true if can delete.
     * @since 3.10
     */
    CoreFileUploaderProvider.prototype.canDeleteDraftFiles = function (siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sitesProvider.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        return [2 /*return*/, this.canDeleteDraftFilesInSite(site)];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if a certain site allows deleting draft files.
     *
     * @param site Site. If not defined, use current site.
     * @return Whether draft files can be deleted.
     * @since 3.10
     */
    CoreFileUploaderProvider.prototype.canDeleteDraftFilesInSite = function (site) {
        site = site || this.sitesProvider.getCurrentSite();
        return site.wsAvailable('core_files_delete_draft_files');
    };
    /**
     * Start the audio recorder application and return information about captured audio clip files.
     *
     * @param options Options.
     * @return Promise resolved with the result.
     */
    CoreFileUploaderProvider.prototype.captureAudio = function (options) {
        var _this = this;
        this.onAudioCapture.next(true);
        return this.mediaCapture.captureAudio(options).finally(function () {
            _this.onAudioCapture.next(false);
        });
    };
    /**
     * Record an audio file without using an external app.
     *
     * @return Promise resolved with the file.
     */
    CoreFileUploaderProvider.prototype.captureAudioInApp = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var params = {
                type: 'audio',
            };
            var modal = _this.modalCtrl.create('CoreEmulatorCaptureMediaPage', params, { enableBackdropDismiss: false });
            modal.present();
            modal.onDidDismiss(function (data, role) {
                if (role == 'success') {
                    resolve(data[0]);
                }
                else {
                    reject(data);
                }
            });
        });
    };
    /**
     * Start the video recorder application and return information about captured video clip files.
     *
     * @param options Options.
     * @return Promise resolved with the result.
     */
    CoreFileUploaderProvider.prototype.captureVideo = function (options) {
        var _this = this;
        this.onVideoCapture.next(true);
        return this.mediaCapture.captureVideo(options).finally(function () {
            _this.onVideoCapture.next(false);
        });
    };
    /**
     * Clear temporary attachments to be uploaded.
     * Attachments already saved in an offline store will NOT be deleted.
     *
     * @param files List of files.
     */
    CoreFileUploaderProvider.prototype.clearTmpFiles = function (files) {
        // Delete the local files.
        files.forEach(function (file) {
            if (!file.offline && file.remove) {
                // Pass an empty function to prevent missing parameter error.
                file.remove(function () {
                    // Nothing to do.
                });
            }
        });
    };
    /**
     * Delete draft files.
     *
     * @param draftId Draft ID.
     * @param files Files to delete.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved when done.
     */
    CoreFileUploaderProvider.prototype.deleteDraftFiles = function (draftId, files, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var site, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sitesProvider.getSite(siteId)];
                    case 1:
                        site = _a.sent();
                        params = {
                            draftitemid: draftId,
                            files: files,
                        };
                        return [2 /*return*/, site.write('core_files_delete_draft_files', params)];
                }
            });
        });
    };
    /**
     * Get the upload options for a file taken with the Camera Cordova plugin.
     *
     * @param uri File URI.
     * @param isFromAlbum True if the image was taken from album, false if it's a new image taken with camera.
     * @return Options.
     */
    CoreFileUploaderProvider.prototype.getCameraUploadOptions = function (uri, isFromAlbum) {
        var extension = this.mimeUtils.guessExtensionFromUrl(uri);
        var mimetype = this.mimeUtils.getMimeType(extension);
        var isIOS = CoreApp.instance.isIOS();
        var options = {
            deleteAfterUpload: !isFromAlbum,
            mimeType: mimetype
        };
        var fileName = this.fileProvider.getFileAndDirectoryFromPath(uri).name;
        if (isIOS && (mimetype == 'image/jpeg' || mimetype == 'image/png')) {
            // In iOS, the pictures can have repeated names, even if they come from the album.
            // Add a timestamp to the filename to make it unique.
            var split = fileName.split('.');
            split[0] += '_' + this.timeUtils.readableTimestamp();
            options.fileName = split.join('.');
        }
        else {
            // Use the same name that the file already has.
            options.fileName = fileName;
        }
        if (isFromAlbum) {
            // If the file was picked from the album, delete it only if it was copied to the app's folder.
            options.deleteAfterUpload = this.fileProvider.isFileInAppFolder(uri);
            if (CoreApp.instance.isAndroid()) {
                // Picking an image from album in Android adds a timestamp at the end of the file. Delete it.
                options.fileName = options.fileName.replace(/(\.[^\.]*)\?[^\.]*$/, '$1');
            }
        }
        return options;
    };
    /**
     * Given a list of original files and a list of current files, return the list of files to delete.
     *
     * @param originalFiles Original files.
     * @param currentFiles Current files.
     * @return List of files to delete.
     */
    CoreFileUploaderProvider.prototype.getFilesToDelete = function (originalFiles, currentFiles) {
        var filesToDelete = [];
        currentFiles = currentFiles || [];
        originalFiles.forEach(function (file) {
            var stillInList = currentFiles.some(function (currentFile) {
                return currentFile.fileurl == file.fileurl;
            });
            if (!stillInList) {
                filesToDelete.push({
                    filepath: file.filepath,
                    filename: file.filename,
                });
            }
        });
        return filesToDelete;
    };
    /**
     * Get the upload options for a file of any type.
     *
     * @param uri File URI.
     * @param name File name.
     * @param type File type.
     * @param deleteAfterUpload Whether the file should be deleted after upload.
     * @param fileArea File area to upload the file to. It defaults to 'draft'.
     * @param itemId Draft ID to upload the file to, 0 to create new.
     * @return Options.
     */
    CoreFileUploaderProvider.prototype.getFileUploadOptions = function (uri, name, type, deleteAfterUpload, fileArea, itemId) {
        var options = {};
        options.fileName = name;
        options.mimeType = type || this.mimeUtils.getMimeType(this.mimeUtils.getFileExtension(options.fileName));
        options.deleteAfterUpload = !!deleteAfterUpload;
        options.itemId = itemId || 0;
        options.fileArea = fileArea;
        return options;
    };
    /**
     * Get the upload options for a file taken with the media capture Cordova plugin.
     *
     * @param mediaFile File object to upload.
     * @return Options.
     */
    CoreFileUploaderProvider.prototype.getMediaUploadOptions = function (mediaFile) {
        var options = {};
        var filename = mediaFile.name;
        if (!filename.match(/_\d{14}(\..*)?$/)) {
            // Add a timestamp to the filename to make it unique.
            var split = filename.split('.');
            split[0] += '_' + this.timeUtils.readableTimestamp();
            filename = split.join('.');
        }
        options.fileName = filename;
        options.deleteAfterUpload = true;
        if (mediaFile.type) {
            options.mimeType = mediaFile.type;
        }
        else {
            options.mimeType = this.mimeUtils.getMimeType(this.mimeUtils.getFileExtension(options.fileName));
        }
        return options;
    };
    /**
     * Take a picture or video, or load one from the library.
     *
     * @param options Options.
     * @return Promise resolved with the result.
     */
    CoreFileUploaderProvider.prototype.getPicture = function (options) {
        var _this = this;
        this.onGetPicture.next(true);
        return this.camera.getPicture(options).finally(function () {
            _this.onGetPicture.next(false);
        });
    };
    /**
     * Get the files stored in a folder, marking them as offline.
     *
     * @param folderPath Folder where to get the files.
     * @return Promise resolved with the list of files.
     */
    CoreFileUploaderProvider.prototype.getStoredFiles = function (folderPath) {
        var _this = this;
        return this.fileProvider.getDirectoryContents(folderPath).then(function (files) {
            return _this.markOfflineFiles(files);
        });
    };
    /**
     * Get stored files from combined online and offline file object.
     *
     * @param filesObject The combined offline and online files object.
     * @param folderPath Folder path to get files from.
     * @return Promise resolved with files.
     */
    CoreFileUploaderProvider.prototype.getStoredFilesFromOfflineFilesObject = function (filesObject, folderPath) {
        var files = [];
        if (filesObject) {
            if (filesObject.online && filesObject.online.length > 0) {
                files = this.utils.clone(filesObject.online);
            }
            if (filesObject.offline > 0) {
                return this.getStoredFiles(folderPath).then(function (offlineFiles) {
                    return files.concat(offlineFiles);
                }).catch(function () {
                    // Ignore not found files.
                    return files;
                });
            }
        }
        return Promise.resolve(files);
    };
    /**
     * Check if a file's mimetype is invalid based on the list of accepted mimetypes. This function needs either the file's
     * mimetype or the file's path/name.
     *
     * @param mimetypes List of supported mimetypes. If undefined, all mimetypes supported.
     * @param path File's path or name.
     * @param mimetype File's mimetype.
     * @return Undefined if file is valid, error message if file is invalid.
     */
    CoreFileUploaderProvider.prototype.isInvalidMimetype = function (mimetypes, path, mimetype) {
        var extension;
        if (mimetypes) {
            // Verify that the mimetype of the file is supported.
            if (mimetype) {
                extension = this.mimeUtils.getExtension(mimetype);
                if (mimetypes.indexOf(mimetype) == -1) {
                    // Get the "main" mimetype of the extension.
                    // It's possible that the list of accepted mimetypes only includes the "main" mimetypes.
                    mimetype = this.mimeUtils.getMimeType(extension);
                }
            }
            else {
                extension = this.mimeUtils.getFileExtension(path);
                mimetype = this.mimeUtils.getMimeType(extension);
            }
            if (mimetype && mimetypes.indexOf(mimetype) == -1) {
                extension = extension || this.translate.instant('core.unknown');
                return this.translate.instant('core.fileuploader.invalidfiletype', { $a: extension });
            }
        }
    };
    /**
     * Mark files as offline.
     *
     * @param files Files to mark as offline.
     * @return Files marked as offline.
     */
    CoreFileUploaderProvider.prototype.markOfflineFiles = function (files) {
        // Mark the files as pending offline.
        files.forEach(function (file) {
            file.offline = true;
            file.filename = file.name;
        });
        return files;
    };
    /**
     * Parse filetypeList to get the list of allowed mimetypes and the data to render information.
     *
     * @param filetypeList Formatted string list where the mimetypes can be checked.
     * @return Mimetypes and the filetypes informations. Undefined if all types supported.
     */
    CoreFileUploaderProvider.prototype.prepareFiletypeList = function (filetypeList) {
        var _this = this;
        filetypeList = filetypeList && filetypeList.trim();
        if (!filetypeList || filetypeList == '*') {
            // All types supported, return undefined.
            return undefined;
        }
        var filetypes = filetypeList.split(/[;, ]+/g), mimetypes = {}, // Use an object to prevent duplicates.
        typesInfo = [];
        filetypes.forEach(function (filetype) {
            filetype = filetype.trim();
            if (filetype) {
                if (filetype.indexOf('/') != -1) {
                    // It's a mimetype.
                    typesInfo.push({
                        name: _this.mimeUtils.getMimetypeDescription(filetype),
                        extlist: _this.mimeUtils.getExtensions(filetype).map(_this.addDot).join(' ')
                    });
                    mimetypes[filetype] = true;
                }
                else if (filetype.indexOf('.') === 0) {
                    // It's an extension.
                    var mimetype = _this.mimeUtils.getMimeType(filetype);
                    typesInfo.push({
                        name: mimetype ? _this.mimeUtils.getMimetypeDescription(mimetype) : false,
                        extlist: filetype
                    });
                    if (mimetype) {
                        mimetypes[mimetype] = true;
                    }
                }
                else {
                    // It's a group.
                    var groupExtensions = _this.mimeUtils.getGroupMimeInfo(filetype, 'extensions'), groupMimetypes = _this.mimeUtils.getGroupMimeInfo(filetype, 'mimetypes');
                    if (groupExtensions.length > 0) {
                        typesInfo.push({
                            name: _this.mimeUtils.getTranslatedGroupName(filetype),
                            extlist: groupExtensions ? groupExtensions.map(_this.addDot).join(' ') : ''
                        });
                        groupMimetypes.forEach(function (mimetype) {
                            if (mimetype) {
                                mimetypes[mimetype] = true;
                            }
                        });
                    }
                    else {
                        // Treat them as extensions.
                        filetype = _this.addDot(filetype);
                        var mimetype = _this.mimeUtils.getMimeType(filetype);
                        typesInfo.push({
                            name: mimetype ? _this.mimeUtils.getMimetypeDescription(mimetype) : false,
                            extlist: filetype
                        });
                        if (mimetype) {
                            mimetypes[mimetype] = true;
                        }
                    }
                }
            }
        });
        return {
            info: typesInfo,
            mimetypes: Object.keys(mimetypes)
        };
    };
    /**
     * Given a list of files (either online files or local files), store the local files in a local folder
     * to be uploaded later.
     *
     * @param folderPath Path of the folder where to store the files.
     * @param files List of files.
     * @return Promise resolved if success.
     */
    CoreFileUploaderProvider.prototype.storeFilesToUpload = function (folderPath, files) {
        var _this = this;
        var result = {
            online: [],
            offline: 0
        };
        if (!files || !files.length) {
            return Promise.resolve(result);
        }
        // Remove unused files from previous saves.
        return this.fileProvider.removeUnusedFiles(folderPath, files).then(function () {
            var promises = [];
            files.forEach(function (file) {
                if (file.filename && !file.name) {
                    // It's an online file, add it to the result and ignore it.
                    result.online.push({
                        filename: file.filename,
                        fileurl: file.fileurl
                    });
                }
                else if (!file.name) {
                    // Error.
                    promises.push(Promise.reject(null));
                }
                else if (file.fullPath && file.fullPath.indexOf(folderPath) != -1) {
                    // File already in the submission folder.
                    result.offline++;
                }
                else {
                    // Local file, copy it.
                    // Use copy instead of move to prevent having a unstable state if some copies succeed and others don't.
                    var destFile = _this.textUtils.concatenatePaths(folderPath, file.name);
                    promises.push(_this.fileProvider.copyFile(file.toURL(), destFile));
                    result.offline++;
                }
            });
            return Promise.all(promises).then(function () {
                return result;
            });
        });
    };
    /**
     * Upload a file.
     *
     * @param uri File URI.
     * @param options Options for the upload.
     * @param onProgress Function to call on progress.
     * @param siteId Id of the site to upload the file to. If not defined, use current site.
     * @return Promise resolved when done.
     */
    CoreFileUploaderProvider.prototype.uploadFile = function (uri, options, onProgress, siteId) {
        var _this = this;
        options = options || {};
        var deleteAfterUpload = options.deleteAfterUpload, ftOptions = this.utils.clone(options);
        delete ftOptions.deleteAfterUpload;
        return this.sitesProvider.getSite(siteId).then(function (site) {
            return site.uploadFile(uri, ftOptions, onProgress);
        }).then(function (result) {
            if (deleteAfterUpload) {
                setTimeout(function () {
                    // Use set timeout, otherwise in Electron the upload threw an error sometimes.
                    _this.fileProvider.removeExternalFile(uri);
                }, 500);
            }
            return result;
        });
    };
    /**
     * Given a list of files (either online files or local files), upload the local files to the draft area.
     * Local files are not deleted from the device after upload.
     *
     * @param itemId Draft ID.
     * @param files List of files.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the itemId.
     */
    CoreFileUploaderProvider.prototype.uploadFiles = function (itemId, files, siteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var usedNames, filesToUpload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = siteId || this.sitesProvider.getCurrentSiteId();
                        if (!files || !files.length) {
                            return [2 /*return*/];
                        }
                        usedNames = {};
                        filesToUpload = [];
                        files.forEach(function (file) {
                            var isOnlineFile = file.filename && !file.name;
                            if (isOnlineFile) {
                                usedNames[file.filename.toLowerCase()] = file;
                            }
                            else {
                                filesToUpload.push(file);
                            }
                        });
                        return [4 /*yield*/, Promise.all(filesToUpload.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                var name, options;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            name = this.fileProvider.calculateUniqueName(usedNames, file.name);
                                            usedNames[name] = file;
                                            options = this.getFileUploadOptions(file.toURL(), name, undefined, false, 'draft', itemId);
                                            return [4 /*yield*/, this.uploadFile(file.toURL(), options, undefined, siteId)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upload a file to a draft area and return the draft ID.
     *
     * If the file is an online file it will be downloaded and then re-uploaded.
     * If the file is a local file it will not be deleted from the device after upload.
     *
     * @param file Online file or local FileEntry.
     * @param itemId Draft ID to use. Undefined or 0 to create a new draft ID.
     * @param component The component to set to the downloaded files.
     * @param componentId An ID to use in conjunction with the component.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the itemId.
     */
    CoreFileUploaderProvider.prototype.uploadOrReuploadFile = function (file, itemId, component, componentId, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        var promise, fileName;
        var isOnline = file.filename && !file.name;
        if (isOnline) {
            // It's an online file. We need to download it and re-upload it.
            fileName = file.filename;
            promise = this.filepoolProvider.downloadUrl(siteId, file.url || file.fileurl, false, component, componentId, file.timemodified, undefined, undefined, file).then(function (path) {
                return _this.fileProvider.getExternalFile(path);
            });
        }
        else {
            // Local file, we already have the file entry.
            fileName = file.name;
            promise = Promise.resolve(file);
        }
        return promise.then(function (fileEntry) {
            // Now upload the file.
            var options = _this.getFileUploadOptions(fileEntry.toURL(), fileName, fileEntry.type, isOnline, 'draft', itemId);
            return _this.uploadFile(fileEntry.toURL(), options, undefined, siteId).then(function (result) {
                return result.itemid;
            });
        });
    };
    /**
     * Given a list of files (either online files or local files), upload them to a draft area and return the draft ID.
     *
     * Online files will be downloaded and then re-uploaded.
     * Local files are not deleted from the device after upload.
     * If there are no files to upload it will return a fake draft ID (1).
     *
     * @param files List of files.
     * @param component The component to set to the downloaded files.
     * @param componentId An ID to use in conjunction with the component.
     * @param siteId Site ID. If not defined, current site.
     * @return Promise resolved with the itemId.
     */
    CoreFileUploaderProvider.prototype.uploadOrReuploadFiles = function (files, component, componentId, siteId) {
        var _this = this;
        siteId = siteId || this.sitesProvider.getCurrentSiteId();
        if (!files || !files.length) {
            // Return fake draft ID.
            return Promise.resolve(1);
        }
        // Upload only the first file first to get a draft id.
        return this.uploadOrReuploadFile(files[0], 0, component, componentId, siteId).then(function (itemId) {
            var promises = [];
            for (var i = 1; i < files.length; i++) {
                var file = files[i];
                promises.push(_this.uploadOrReuploadFile(file, itemId, component, componentId, siteId));
            }
            return Promise.all(promises).then(function () {
                return itemId;
            });
        });
    };
    CoreFileUploaderProvider.LIMITED_SIZE_WARNING = 1048576; // 1 MB.
    CoreFileUploaderProvider.WIFI_SIZE_WARNING = 10485760; // 10 MB.
    CoreFileUploaderProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            CoreFileProvider,
            CoreTextUtilsProvider,
            CoreUtilsProvider,
            CoreSitesProvider,
            CoreTimeUtilsProvider,
            CoreMimetypeUtilsProvider,
            CoreFilepoolProvider,
            TranslateService,
            MediaCapture,
            Camera,
            ModalController])
    ], CoreFileUploaderProvider);
    return CoreFileUploaderProvider;
}());
export { CoreFileUploaderProvider };
var CoreFileUploader = /** @class */ (function (_super) {
    __extends(CoreFileUploader, _super);
    function CoreFileUploader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreFileUploader;
}(makeSingleton(CoreFileUploaderProvider)));
export { CoreFileUploader };
//# sourceMappingURL=fileuploader.js.map