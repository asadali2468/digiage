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
import { CoreEventsProvider } from './events';
import { CoreFileProvider } from './file';
import { CoreInitDelegate } from './init';
import { CoreLoggerProvider } from './logger';
import { CorePluginFileDelegate } from './plugin-file-delegate';
import { CoreSitesProvider } from './sites';
import { CoreWSProvider } from './ws';
import { CoreDomUtilsProvider } from './utils/dom';
import { CoreMimetypeUtilsProvider } from './utils/mimetype';
import { CoreTextUtilsProvider } from './utils/text';
import { CoreTimeUtilsProvider } from './utils/time';
import { CoreUrlUtilsProvider } from './utils/url';
import { CoreUtilsProvider } from './utils/utils';
import { CoreConstants } from '@core/constants';
import { Md5 } from 'ts-md5/dist/md5';
import { makeSingleton } from '@singletons/core.singletons';
/*
 * Factory for handling downloading files and retrieve downloaded files.
 *
 * @description
 * This factory is responsible for handling downloading files.
 *
 * The two main goals of this is to keep the content available offline, and improve the user experience by caching
 * the content locally.
 */
var CoreFilepoolProvider = /** @class */ (function () {
    function CoreFilepoolProvider(logger, appProvider, fileProvider, sitesProvider, wsProvider, textUtils, utils, mimeUtils, urlUtils, timeUtils, eventsProvider, initDelegate, network, pluginFileDelegate, domUtils, zone) {
        var _this = this;
        this.appProvider = appProvider;
        this.fileProvider = fileProvider;
        this.sitesProvider = sitesProvider;
        this.wsProvider = wsProvider;
        this.textUtils = textUtils;
        this.utils = utils;
        this.mimeUtils = mimeUtils;
        this.urlUtils = urlUtils;
        this.timeUtils = timeUtils;
        this.eventsProvider = eventsProvider;
        this.pluginFileDelegate = pluginFileDelegate;
        this.domUtils = domUtils;
        // Constants.
        this.QUEUE_PROCESS_INTERVAL = 0;
        this.FOLDER = 'filepool';
        this.WIFI_DOWNLOAD_THRESHOLD = 20971520; // 20MB.
        this.DOWNLOAD_THRESHOLD = 2097152; // 2MB.
        this.QUEUE_RUNNING = 'CoreFilepool:QUEUE_RUNNING';
        this.QUEUE_PAUSED = 'CoreFilepool:QUEUE_PAUSED';
        this.ERR_QUEUE_IS_EMPTY = 'CoreFilepoolError:ERR_QUEUE_IS_EMPTY';
        this.ERR_FS_OR_NETWORK_UNAVAILABLE = 'CoreFilepoolError:ERR_FS_OR_NETWORK_UNAVAILABLE';
        this.ERR_QUEUE_ON_PAUSE = 'CoreFilepoolError:ERR_QUEUE_ON_PAUSE';
        this.FILE_UPDATE_UNKNOWN_WHERE_CLAUSE = 'isexternalfile = 1 OR ((revision IS NULL OR revision = 0) AND (timemodified IS NULL OR timemodified = 0))';
        // Variables for database.
        this.QUEUE_TABLE = 'filepool_files_queue'; // Queue of files to download.
        this.FILES_TABLE = 'filepool_files'; // Downloaded files.
        this.LINKS_TABLE = 'filepool_files_links'; // Links between downloaded files and components.
        this.PACKAGES_TABLE = 'filepool_packages'; // Downloaded packages (sets of files).
        this.appTablesSchema = {
            name: 'CoreFilepoolProvider',
            version: 1,
            tables: [
                {
                    name: this.QUEUE_TABLE,
                    columns: [
                        {
                            name: 'siteId',
                            type: 'TEXT'
                        },
                        {
                            name: 'fileId',
                            type: 'TEXT'
                        },
                        {
                            name: 'added',
                            type: 'INTEGER'
                        },
                        {
                            name: 'priority',
                            type: 'INTEGER'
                        },
                        {
                            name: 'url',
                            type: 'TEXT'
                        },
                        {
                            name: 'revision',
                            type: 'INTEGER'
                        },
                        {
                            name: 'timemodified',
                            type: 'INTEGER'
                        },
                        {
                            name: 'isexternalfile',
                            type: 'INTEGER'
                        },
                        {
                            name: 'repositorytype',
                            type: 'TEXT'
                        },
                        {
                            name: 'path',
                            type: 'TEXT'
                        },
                        {
                            name: 'links',
                            type: 'TEXT'
                        },
                    ],
                    primaryKeys: ['siteId', 'fileId'],
                },
            ],
        };
        this.siteSchema = {
            name: 'CoreFilepoolProvider',
            version: 1,
            tables: [
                {
                    name: this.FILES_TABLE,
                    columns: [
                        {
                            name: 'fileId',
                            type: 'TEXT',
                            primaryKey: true
                        },
                        {
                            name: 'url',
                            type: 'TEXT',
                            notNull: true
                        },
                        {
                            name: 'revision',
                            type: 'INTEGER'
                        },
                        {
                            name: 'timemodified',
                            type: 'INTEGER'
                        },
                        {
                            name: 'stale',
                            type: 'INTEGER'
                        },
                        {
                            name: 'downloadTime',
                            type: 'INTEGER'
                        },
                        {
                            name: 'isexternalfile',
                            type: 'INTEGER'
                        },
                        {
                            name: 'repositorytype',
                            type: 'TEXT'
                        },
                        {
                            name: 'path',
                            type: 'TEXT'
                        },
                        {
                            name: 'extension',
                            type: 'TEXT'
                        }
                    ]
                },
                {
                    name: this.LINKS_TABLE,
                    columns: [
                        {
                            name: 'fileId',
                            type: 'TEXT'
                        },
                        {
                            name: 'component',
                            type: 'TEXT'
                        },
                        {
                            name: 'componentId',
                            type: 'TEXT'
                        }
                    ],
                    primaryKeys: ['fileId', 'component', 'componentId']
                },
                {
                    name: this.PACKAGES_TABLE,
                    columns: [
                        {
                            name: 'id',
                            type: 'TEXT',
                            primaryKey: true
                        },
                        {
                            name: 'component',
                            type: 'TEXT'
                        },
                        {
                            name: 'componentId',
                            type: 'TEXT'
                        },
                        {
                            name: 'status',
                            type: 'TEXT'
                        },
                        {
                            name: 'previous',
                            type: 'TEXT'
                        },
                        {
                            name: 'updated',
                            type: 'INTEGER'
                        },
                        {
                            name: 'downloadTime',
                            type: 'INTEGER'
                        },
                        {
                            name: 'previousDownloadTime',
                            type: 'INTEGER'
                        },
                        {
                            name: 'extra',
                            type: 'TEXT'
                        }
                    ]
                }
            ]
        };
        this.tokenRegex = new RegExp('(\\?|&)token=([A-Za-z0-9]*)');
        this.urlAttributes = [
            this.tokenRegex,
            new RegExp('(\\?|&)forcedownload=[0-1]'),
            new RegExp('(\\?|&)preview=[A-Za-z0-9]+'),
            new RegExp('(\\?|&)offline=[0-1]', 'g')
        ];
        this.queueDeferreds = {}; // To handle file downloads using the queue.
        this.sizeCache = {}; // A "cache" to store file sizes to prevent performing too many HEAD requests.
        // Variables to prevent downloading packages/files twice at the same time.
        this.packagesPromises = {};
        this.filePromises = {};
        this.logger = logger.getInstance('CoreFilepoolProvider');
        this.appDB = this.appProvider.getDB();
        this.dbReady = appProvider.createTablesFromSchema(this.appTablesSchema).catch(function () {
            // Ignore errors.
        });
        this.sitesProvider.registerSiteSchema(this.siteSchema);
        initDelegate.ready().then(function () {
            // Waiting for the app to be ready to start processing the queue.
            _this.checkQueueProcessing();
            // Start queue when device goes online.
            network.onConnect().subscribe(function () {
                // Execute the callback in the Angular zone, so change detection doesn't stop working.
                zone.run(function () {
                    _this.checkQueueProcessing();
                });
            });
        });
    }
    /**
     * Link a file with a component.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @return Promise resolved on success.
     */
    CoreFilepoolProvider.prototype.addFileLink = function (siteId, fileId, component, componentId) {
        var _this = this;
        if (!component) {
            return Promise.reject(null);
        }
        componentId = this.fixComponentId(componentId);
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            var newEntry = {
                fileId: fileId,
                component: component,
                componentId: componentId || ''
            };
            return db.insertRecord(_this.LINKS_TABLE, newEntry);
        });
    };
    /**
     * Link a file with a component by URL.
     *
     * @param siteId The site ID.
     * @param fileUrl The file Url.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @return Promise resolved on success.
     * @description
     * Use this method to create a link between a URL and a component. You usually do not need to call this manually since
     * downloading a file automatically does this. Note that this method does not check if the file exists in the pool.
     */
    CoreFilepoolProvider.prototype.addFileLinkByUrl = function (siteId, fileUrl, component, componentId) {
        var _this = this;
        return this.fixPluginfileURL(siteId, fileUrl).then(function (file) {
            var fileId = _this.getFileIdByUrl(file.fileurl);
            return _this.addFileLink(siteId, fileId, component, componentId);
        });
    };
    /**
     * Link a file with several components.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param links Array of objects containing the component and optionally componentId.
     * @return Promise resolved on success.
     */
    CoreFilepoolProvider.prototype.addFileLinks = function (siteId, fileId, links) {
        var _this = this;
        var promises = [];
        links.forEach(function (link) {
            promises.push(_this.addFileLink(siteId, fileId, link.component, link.componentId));
        });
        return Promise.all(promises);
    };
    /**
     * Add files to queue using a URL.
     *
     * @param siteId The site ID.
     * @param files Array of files to add.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component (optional).
     * @return Resolved on success.
     */
    CoreFilepoolProvider.prototype.addFilesToQueue = function (siteId, files, component, componentId) {
        return this.downloadOrPrefetchFiles(siteId, files, true, false, component, componentId);
    };
    /**
     * Add a file to the pool.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param data Additional information to store about the file (timemodified, url, ...). See FILES_TABLE schema.
     * @return Promise resolved on success.
     */
    CoreFilepoolProvider.prototype.addFileToPool = function (siteId, fileId, data) {
        var _this = this;
        var values = Object.assign({}, data);
        values.fileId = fileId;
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            return db.insertRecord(_this.FILES_TABLE, values);
        });
    };
    /**
     * Adds a hash to a filename if needed.
     *
     * @param url The URL of the file, already treated (decoded, without revision, etc.).
     * @param filename The filename.
     * @return The filename with the hash.
     */
    CoreFilepoolProvider.prototype.addHashToFilename = function (url, filename) {
        // Check if the file already has a hash. If a file is downloaded and re-uploaded with the app it will have a hash already.
        var matches = filename.match(/_[a-f0-9]{32}/g);
        if (matches && matches.length) {
            // There is at least 1 match. Get the last one.
            var hash = matches[matches.length - 1], treatedUrl = url.replace(hash, ''); // Remove the hash from the URL.
            // Check that the hash is valid.
            if ('_' + Md5.hashAsciiStr('url:' + treatedUrl) == hash) {
                // The data found is a hash of the URL, don't need to add it again.
                return filename;
            }
        }
        return filename + '_' + Md5.hashAsciiStr('url:' + url);
    };
    /**
     * Add a file to the queue.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param url The absolute URL to the file.
     * @param priority The priority this file should get in the queue (range 0-999).
     * @param revision The revision of the file.
     * @param timemodified The time this file was modified. Can be used to check file state.
     * @param filePath Filepath to download the file to. If not defined, download to the filepool folder.
     * @param options Extra options (isexternalfile, repositorytype).
     * @param link The link to add for the file.
     * @return Promise resolved when the file is downloaded.
     */
    CoreFilepoolProvider.prototype.addToQueue = function (siteId, fileId, url, priority, revision, timemodified, filePath, onProgress, options, link) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        this.logger.debug("Adding " + fileId + " to the queue");
                        return [4 /*yield*/, this.appDB.insertRecord(this.QUEUE_TABLE, {
                                siteId: siteId,
                                fileId: fileId,
                                url: url,
                                priority: priority,
                                revision: revision,
                                timemodified: timemodified,
                                path: filePath,
                                isexternalfile: options.isexternalfile ? 1 : 0,
                                repositorytype: options.repositorytype,
                                links: JSON.stringify(link ? [link] : []),
                                added: Date.now()
                            })];
                    case 2:
                        _a.sent();
                        // Check if the queue is running.
                        this.checkQueueProcessing();
                        this.notifyFileDownloading(siteId, fileId, link ? [link] : []);
                        return [2 /*return*/, this.getQueuePromise(siteId, fileId, true, onProgress)];
                }
            });
        });
    };
    /**
     * Add an entry to queue using a URL.
     *
     * @param siteId The site ID.
     * @param fileUrl The absolute URL to the file.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component (optional).
     * @param timemodified The time this file was modified. Can be used to check file state.
     * @param filePath Filepath to download the file to. If not defined, download to the filepool folder.
     * @param onProgress Function to call on progress.
     * @param priority The priority this file should get in the queue (range 0-999).
     * @param options Extra options (isexternalfile, repositorytype).
     * @param revision File revision. If not defined, it will be calculated using the URL.
     * @param alreadyFixed Whether the URL has already been fixed.
     * @return Resolved on success.
     */
    CoreFilepoolProvider.prototype.addToQueueByUrl = function (siteId, fileUrl, component, componentId, timemodified, filePath, onProgress, priority, options, revision, alreadyFixed) {
        if (timemodified === void 0) { timemodified = 0; }
        if (priority === void 0) { priority = 0; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var fileId, queueDeferred;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        if (!this.fileProvider.isAvailable()) {
                            return [2 /*return*/, Promise.reject(null)];
                        }
                        return [2 /*return*/, this.sitesProvider.getSite(siteId).then(function (site) {
                                if (!site.canDownloadFiles()) {
                                    return Promise.reject(null);
                                }
                                if (alreadyFixed) {
                                    // Already fixed, if we reached here it means it can be downloaded.
                                    return { fileurl: fileUrl };
                                }
                                else {
                                    return _this.fixPluginfileURL(siteId, fileUrl);
                                }
                            }).then(function (file) {
                                fileUrl = file.fileurl;
                                timemodified = file.timemodified || timemodified;
                                revision = revision || _this.getRevisionFromUrl(fileUrl);
                                fileId = _this.getFileIdByUrl(fileUrl);
                                var primaryKey = { siteId: siteId, fileId: fileId };
                                // Set up the component.
                                var link = _this.createComponentLink(component, componentId);
                                // Retrieve the queue deferred now if it exists.
                                // This is to prevent errors if file is removed from queue while we're checking if the file is in queue.
                                queueDeferred = _this.getQueueDeferred(siteId, fileId, false, onProgress);
                                return _this.hasFileInQueue(siteId, fileId).then(function (entry) {
                                    var newData = {};
                                    var foundLink = false;
                                    if (entry) {
                                        // We already have the file in queue, we update the priority and links.
                                        if (entry.priority < priority) {
                                            newData.priority = priority;
                                        }
                                        if (revision && entry.revision !== revision) {
                                            newData.revision = revision;
                                        }
                                        if (timemodified && entry.timemodified !== timemodified) {
                                            newData.timemodified = timemodified;
                                        }
                                        if (filePath && entry.path !== filePath) {
                                            newData.path = filePath;
                                        }
                                        if (entry.isexternalfile !== options.isexternalfile && (entry.isexternalfile || options.isexternalfile)) {
                                            newData.isexternalfile = options.isexternalfile;
                                        }
                                        if (entry.repositorytype !== options.repositorytype && (entry.repositorytype || options.repositorytype)) {
                                            newData.repositorytype = options.repositorytype;
                                        }
                                        if (link) {
                                            // We need to add the new link if it does not exist yet.
                                            if (entry.links && entry.links.length) {
                                                for (var i in entry.links) {
                                                    var fileLink = entry.links[i];
                                                    if (fileLink.component == link.component && fileLink.componentId == link.componentId) {
                                                        foundLink = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (!foundLink) {
                                                newData.links = entry.links || [];
                                                newData.links.push(link);
                                                newData.links = JSON.stringify(entry.links);
                                            }
                                        }
                                        if (Object.keys(newData).length) {
                                            // Update only when required.
                                            _this.logger.debug("Updating file " + fileId + " which is already in queue");
                                            return _this.appDB.updateRecords(_this.QUEUE_TABLE, newData, primaryKey).then(function () {
                                                return _this.getQueuePromise(siteId, fileId, true, onProgress);
                                            });
                                        }
                                        _this.logger.debug("File " + fileId + " already in queue and does not require update");
                                        if (queueDeferred) {
                                            // If we were able to retrieve the queue deferred before, we use that one.
                                            return queueDeferred.promise;
                                        }
                                        else {
                                            // Create a new deferred and return its promise.
                                            return _this.getQueuePromise(siteId, fileId, true, onProgress);
                                        }
                                    }
                                    else {
                                        return _this.addToQueue(siteId, fileId, fileUrl, priority, revision, timemodified, filePath, onProgress, options, link);
                                    }
                                }, function () {
                                    // Unsure why we could not get the record, let's add to the queue anyway.
                                    return _this.addToQueue(siteId, fileId, fileUrl, priority, revision, timemodified, filePath, onProgress, options, link);
                                });
                            })];
                }
            });
        });
    };
    /**
     * Adds a file to the queue if the size is allowed to be downloaded.
     *
     * @param siteId The site ID.
     * @param fileUrl The absolute URL to the file, already fixed.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @param timemodified The time this file was modified.
     * @param checkSize True if we shouldn't download files if their size is big, false otherwise.
     * @param downloadUnknown True to download file in WiFi if their size is unknown, false otherwise.
     *                        Ignored if checkSize=false.
     * @param options Extra options (isexternalfile, repositorytype).
     * @param revision File revision. If not defined, it will be calculated using the URL.
     * @return Promise resolved when the file is downloaded.
     */
    CoreFilepoolProvider.prototype.addToQueueIfNeeded = function (siteId, fileUrl, component, componentId, timemodified, checkSize, downloadUnknown, options, revision) {
        var _this = this;
        if (timemodified === void 0) { timemodified = 0; }
        if (checkSize === void 0) { checkSize = true; }
        if (options === void 0) { options = {}; }
        var promise;
        if (checkSize) {
            if (typeof this.sizeCache[fileUrl] != 'undefined') {
                promise = Promise.resolve(this.sizeCache[fileUrl]);
            }
            else {
                if (!this.appProvider.isOnline()) {
                    // Cannot check size in offline, stop.
                    return Promise.reject(null);
                }
                promise = this.wsProvider.getRemoteFileSize(fileUrl);
            }
            // Calculate the size of the file.
            return promise.then(function (size) {
                var isWifi = _this.appProvider.isWifi(), sizeUnknown = size <= 0;
                if (!sizeUnknown) {
                    // Store the size in the cache.
                    _this.sizeCache[fileUrl] = size;
                }
                // Check if the file should be downloaded.
                if (sizeUnknown) {
                    if (downloadUnknown && isWifi) {
                        return _this.addToQueueByUrl(siteId, fileUrl, component, componentId, timemodified, undefined, undefined, 0, options, revision, true);
                    }
                }
                else if (_this.shouldDownload(size)) {
                    return _this.addToQueueByUrl(siteId, fileUrl, component, componentId, timemodified, undefined, undefined, 0, options, revision, true);
                }
            });
        }
        else {
            // No need to check size, just add it to the queue.
            return this.addToQueueByUrl(siteId, fileUrl, component, componentId, timemodified, undefined, undefined, 0, options, revision, true);
        }
    };
    /**
     * Check the queue processing.
     *
     * @description
     * In mose cases, this will enable the queue processing if it was paused.
     * Though, this will disable the queue if we are missing network or if the file system
     * is not accessible. Also, this will have no effect if the queue is already running.
     */
    CoreFilepoolProvider.prototype.checkQueueProcessing = function () {
        if (!this.fileProvider.isAvailable() || !this.appProvider.isOnline()) {
            this.queueState = this.QUEUE_PAUSED;
            return;
        }
        else if (this.queueState === this.QUEUE_RUNNING) {
            return;
        }
        this.queueState = this.QUEUE_RUNNING;
        this.processQueue();
    };
    /**
     * Clear all packages status in a site.
     *
     * @param siteId Site ID.
     * @return Promise resolved when all status are cleared.
     */
    CoreFilepoolProvider.prototype.clearAllPackagesStatus = function (siteId) {
        var _this = this;
        this.logger.debug('Clear all packages status for site ' + siteId);
        return this.sitesProvider.getSite(siteId).then(function (site) {
            // Get all the packages to be able to "notify" the change in the status.
            return site.getDb().getAllRecords(_this.PACKAGES_TABLE).then(function (entries) {
                // Delete all the entries.
                return site.getDb().deleteRecords(_this.PACKAGES_TABLE).then(function () {
                    entries.forEach(function (entry) {
                        // Trigger module status changed, setting it as not downloaded.
                        _this.triggerPackageStatusChanged(siteId, CoreConstants.NOT_DOWNLOADED, entry.component, entry.componentId);
                    });
                });
            });
        });
    };
    /**
     * Clears the filepool. Use it only when all the files from a site are deleted.
     *
     * @param siteId ID of the site to clear.
     * @return Promise resolved when the filepool is cleared.
     */
    CoreFilepoolProvider.prototype.clearFilepool = function (siteId) {
        var _this = this;
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            return Promise.all([
                db.deleteRecords(_this.FILES_TABLE),
                db.deleteRecords(_this.LINKS_TABLE)
            ]);
        });
    };
    /**
     * Returns whether a component has files in the pool.
     *
     * @param siteId The site ID.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @return Resolved means yes, rejected means no.
     */
    CoreFilepoolProvider.prototype.componentHasFiles = function (siteId, component, componentId) {
        var _this = this;
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            var conditions = {
                component: component,
                componentId: _this.fixComponentId(componentId)
            };
            return db.countRecords(_this.LINKS_TABLE, conditions).then(function (count) {
                if (count <= 0) {
                    return Promise.reject(null);
                }
            });
        });
    };
    /**
     * Prepare a component link.
     *
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @return Link, null if nothing to link.
     */
    CoreFilepoolProvider.prototype.createComponentLink = function (component, componentId) {
        if (typeof component != 'undefined' && component != null) {
            return { component: component, componentId: this.fixComponentId(componentId) };
        }
        return null;
    };
    /**
     * Prepare list of links from component and componentId.
     *
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @return Links.
     */
    CoreFilepoolProvider.prototype.createComponentLinks = function (component, componentId) {
        var link = this.createComponentLink(component, componentId);
        return link ? [link] : [];
    };
    /**
     * Given the current status of a list of packages and the status of one of the packages,
     * determine the new status for the list of packages. The status of a list of packages is:
     *     - CoreConstants.NOT_DOWNLOADABLE if there are no downloadable packages.
     *     - CoreConstants.NOT_DOWNLOADED if at least 1 package has status CoreConstants.NOT_DOWNLOADED.
     *     - CoreConstants.DOWNLOADED if ALL the downloadable packages have status CoreConstants.DOWNLOADED.
     *     - CoreConstants.DOWNLOADING if ALL the downloadable packages have status CoreConstants.DOWNLOADING or
     *                                     CoreConstants.DOWNLOADED, with at least 1 package with CoreConstants.DOWNLOADING.
     *     - CoreConstants.OUTDATED if ALL the downloadable packages have status CoreConstants.OUTDATED or CoreConstants.DOWNLOADED
     *                                     or CoreConstants.DOWNLOADING, with at least 1 package with CoreConstants.OUTDATED.
     *
     * @param current Current status of the list of packages.
     * @param packagestatus Status of one of the packages.
     * @return New status for the list of packages;
     */
    CoreFilepoolProvider.prototype.determinePackagesStatus = function (current, packageStatus) {
        if (!current) {
            current = CoreConstants.NOT_DOWNLOADABLE;
        }
        if (packageStatus === CoreConstants.NOT_DOWNLOADED) {
            // If 1 package is not downloaded the status of the whole list will always be not downloaded.
            return CoreConstants.NOT_DOWNLOADED;
        }
        else if (packageStatus === CoreConstants.DOWNLOADED && current === CoreConstants.NOT_DOWNLOADABLE) {
            // If all packages are downloaded or not downloadable with at least 1 downloaded, status will be downloaded.
            return CoreConstants.DOWNLOADED;
        }
        else if (packageStatus === CoreConstants.DOWNLOADING &&
            (current === CoreConstants.NOT_DOWNLOADABLE || current === CoreConstants.DOWNLOADED)) {
            // If all packages are downloading/downloaded/notdownloadable with at least 1 downloading, status will be downloading.
            return CoreConstants.DOWNLOADING;
        }
        else if (packageStatus === CoreConstants.OUTDATED && current !== CoreConstants.NOT_DOWNLOADED) {
            // If there are no packages notdownloaded and there is at least 1 outdated, status will be outdated.
            return CoreConstants.OUTDATED;
        }
        // Status remains the same.
        return current;
    };
    /**
     * Downloads a URL and update or add it to the pool.
     *
     * This uses the file system, you should always make sure that it is accessible before calling this method.
     *
     * @param siteId The site ID.
     * @param fileUrl The file URL.
     * @param options Extra options (revision, timemodified, isexternalfile, repositorytype).
     * @param filePath Filepath to download the file to. If defined, no extension will be added.
     * @param onProgress Function to call on progress.
     * @param poolFileObject When set, the object will be updated, a new entry will not be created.
     * @return Resolved with internal URL on success, rejected otherwise.
     */
    CoreFilepoolProvider.prototype.downloadForPoolByUrl = function (siteId, fileUrl, options, filePath, onProgress, poolFileObject) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var fileId = this.getFileIdByUrl(fileUrl), extension = this.mimeUtils.guessExtensionFromUrl(fileUrl), addExtension = typeof filePath == 'undefined', pathPromise = filePath ? filePath : this.getFilePath(siteId, fileId, extension);
        return Promise.resolve(pathPromise).then(function (filePath) {
            if (poolFileObject && poolFileObject.fileId !== fileId) {
                _this.logger.error('Invalid object to update passed');
                return Promise.reject(null);
            }
            var downloadId = _this.getFileDownloadId(fileUrl, filePath);
            if (_this.filePromises[siteId] && _this.filePromises[siteId][downloadId]) {
                // There's already a download ongoing for this file in this location, return the promise.
                return _this.filePromises[siteId][downloadId];
            }
            else if (!_this.filePromises[siteId]) {
                _this.filePromises[siteId] = {};
            }
            _this.filePromises[siteId][downloadId] = _this.sitesProvider.getSite(siteId).then(function (site) {
                if (!site.canDownloadFiles()) {
                    return Promise.reject(null);
                }
                var fileEntry;
                return _this.wsProvider.downloadFile(fileUrl, filePath, addExtension, onProgress).then(function (entry) {
                    fileEntry = entry;
                    return _this.pluginFileDelegate.treatDownloadedFile(fileUrl, fileEntry, siteId, onProgress);
                }).then(function () {
                    var data = poolFileObject || {};
                    data.downloadTime = Date.now();
                    data.stale = 0;
                    data.url = fileUrl;
                    data.revision = options.revision;
                    data.timemodified = options.timemodified;
                    data.isexternalfile = options.isexternalfile ? 1 : 0;
                    data.repositorytype = options.repositorytype;
                    data.path = fileEntry.path;
                    data.extension = fileEntry.extension;
                    return _this.addFileToPool(siteId, fileId, data).then(function () {
                        return fileEntry.toURL();
                    });
                });
            }).finally(function () {
                // Download finished, delete the promise.
                delete _this.filePromises[siteId][downloadId];
            });
            return _this.filePromises[siteId][downloadId];
        });
    };
    /**
     * Download or prefetch several files into the filepool folder.
     *
     * @param siteId The site ID.
     * @param files Array of files to download.
     * @param prefetch True if should prefetch the contents (queue), false if they should be downloaded right now.
     * @param ignoreStale True if 'stale' should be ignored. Only if prefetch=false.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @param dirPath Name of the directory where to store the files (inside filepool dir). If not defined, store
     *                the files directly inside the filepool folder.
     * @return Resolved on success.
     */
    CoreFilepoolProvider.prototype.downloadOrPrefetchFiles = function (siteId, files, prefetch, ignoreStale, component, componentId, dirPath) {
        var _this = this;
        var promises = [];
        // Download files.
        files.forEach(function (file) {
            var url = file.url || file.fileurl, timemodified = file.timemodified, options = {
                isexternalfile: file.isexternalfile,
                repositorytype: file.repositorytype
            };
            var path;
            if (dirPath) {
                // Calculate the path to the file.
                path = file.filename;
                if (file.filepath !== '/') {
                    path = file.filepath.substr(1) + path;
                }
                path = _this.textUtils.concatenatePaths(dirPath, path);
            }
            if (prefetch) {
                promises.push(_this.addToQueueByUrl(siteId, url, component, componentId, timemodified, path, undefined, 0, options));
            }
            else {
                promises.push(_this.downloadUrl(siteId, url, ignoreStale, component, componentId, timemodified, path, undefined, options));
            }
        });
        return this.utils.allPromises(promises);
    };
    /**
     * Downloads or prefetches a list of files as a "package".
     *
     * @param siteId The site ID.
     * @param fileList List of files to download.
     * @param prefetch True if should prefetch the contents (queue), false if they should be downloaded right now.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @param extra Extra data to store for the package.
     * @param dirPath Name of the directory where to store the files (inside filepool dir). If not defined, store
     *                the files directly inside the filepool folder.
     * @param onProgress Function to call on progress.
     * @return Promise resolved when the package is downloaded.
     */
    CoreFilepoolProvider.prototype.downloadOrPrefetchPackage = function (siteId, fileList, prefetch, component, componentId, extra, dirPath, onProgress) {
        var _this = this;
        var packageId = this.getPackageId(component, componentId);
        var promise;
        if (this.packagesPromises[siteId] && this.packagesPromises[siteId][packageId]) {
            // There's already a download ongoing for this package, return the promise.
            return this.packagesPromises[siteId][packageId];
        }
        else if (!this.packagesPromises[siteId]) {
            this.packagesPromises[siteId] = {};
        }
        // Set package as downloading.
        promise = this.storePackageStatus(siteId, CoreConstants.DOWNLOADING, component, componentId).then(function () {
            var promises = [];
            var packageLoaded = 0;
            fileList.forEach(function (file) {
                var fileUrl = file.url || file.fileurl, options = {
                    isexternalfile: file.isexternalfile,
                    repositorytype: file.repositorytype
                };
                var path, promise, fileLoaded = 0, onFileProgress;
                if (onProgress) {
                    // There's a onProgress event, create a function to receive file download progress events.
                    onFileProgress = function (progress) {
                        if (progress && progress.loaded) {
                            // Add the new size loaded to the package loaded.
                            packageLoaded = packageLoaded + (progress.loaded - fileLoaded);
                            fileLoaded = progress.loaded;
                            onProgress({
                                packageDownload: true,
                                loaded: packageLoaded,
                                fileProgress: progress
                            });
                        }
                    };
                }
                if (dirPath) {
                    // Calculate the path to the file.
                    path = file.filename;
                    if (file.filepath !== '/') {
                        path = file.filepath.substr(1) + path;
                    }
                    path = _this.textUtils.concatenatePaths(dirPath, path);
                }
                if (prefetch) {
                    promise = _this.addToQueueByUrl(siteId, fileUrl, component, componentId, file.timemodified, path, undefined, 0, options);
                }
                else {
                    promise = _this.downloadUrl(siteId, fileUrl, false, component, componentId, file.timemodified, onFileProgress, path, options);
                }
                // Using undefined for success & fail will pass the success/failure to the parent promise.
                promises.push(promise);
            });
            return Promise.all(promises).then(function () {
                // Success prefetching, store package as downloaded.
                return _this.storePackageStatus(siteId, CoreConstants.DOWNLOADED, component, componentId, extra);
            }).catch(function (error) {
                // Error downloading, go back to previous status and reject the promise.
                return _this.setPackagePreviousStatus(siteId, component, componentId).then(function () {
                    return Promise.reject(error);
                });
            });
        }).finally(function () {
            // Download finished, delete the promise.
            delete _this.packagesPromises[siteId][packageId];
        });
        this.packagesPromises[siteId][packageId] = promise;
        return promise;
    };
    /**
     * Downloads a list of files.
     *
     * @param siteId The site ID.
     * @param fileList List of files to download.
     * @param component The component to link the file to.
     * @param componentId An ID to identify the download.
     * @param extra Extra data to store for the package.
     * @param dirPath Name of the directory where to store the files (inside filepool dir). If not defined, store
     *                the files directly inside the filepool folder.
     * @param onProgress Function to call on progress.
     * @return Promise resolved when all files are downloaded.
     */
    CoreFilepoolProvider.prototype.downloadPackage = function (siteId, fileList, component, componentId, extra, dirPath, onProgress) {
        return this.downloadOrPrefetchPackage(siteId, fileList, false, component, componentId, extra, dirPath, onProgress);
    };
    /**
     * Downloads a file on the spot.
     *
     * @param siteId The site ID.
     * @param fileUrl The file URL.
     * @param ignoreStale Whether 'stale' should be ignored.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @param timemodified The time this file was modified. Can be used to check file state.
     * @param filePath Filepath to download the file to. If not defined, download to the filepool folder.
     * @param options Extra options (isexternalfile, repositorytype).
     * @param revision File revision. If not defined, it will be calculated using the URL.
     * @return Resolved with internal URL on success, rejected otherwise.
     * @description
     * Downloads a file on the spot.
     *
     * This will also take care of adding the file to the pool if it's missing. However, please note that this will
     * not force a file to be re-downloaded if it is already part of the pool. You should mark a file as stale using
     * invalidateFileByUrl to trigger a download.
     */
    CoreFilepoolProvider.prototype.downloadUrl = function (siteId, fileUrl, ignoreStale, component, componentId, timemodified, onProgress, filePath, options, revision) {
        var _this = this;
        if (timemodified === void 0) { timemodified = 0; }
        if (options === void 0) { options = {}; }
        var fileId;
        var promise;
        var alreadyDownloaded = true;
        if (this.fileProvider.isAvailable()) {
            return this.fixPluginfileURL(siteId, fileUrl).then(function (file) {
                fileUrl = file.fileurl;
                timemodified = file.timemodified || timemodified;
                options = Object.assign({}, options); // Create a copy to prevent modifying the original object.
                options.timemodified = timemodified || 0;
                options.revision = revision || _this.getRevisionFromUrl(fileUrl);
                fileId = _this.getFileIdByUrl(fileUrl);
                var links = _this.createComponentLinks(component, componentId);
                return _this.hasFileInPool(siteId, fileId).then(function (fileObject) {
                    if (typeof fileObject === 'undefined') {
                        // We do not have the file, download and add to pool.
                        _this.notifyFileDownloading(siteId, fileId, links);
                        alreadyDownloaded = false;
                        return _this.downloadForPoolByUrl(siteId, fileUrl, options, filePath, onProgress);
                    }
                    else if (_this.isFileOutdated(fileObject, options.revision, options.timemodified) &&
                        _this.appProvider.isOnline() && !ignoreStale) {
                        // The file is outdated, force the download and update it.
                        _this.notifyFileDownloading(siteId, fileId, links);
                        alreadyDownloaded = false;
                        return _this.downloadForPoolByUrl(siteId, fileUrl, options, filePath, onProgress, fileObject);
                    }
                    // Everything is fine, return the file on disk.
                    if (filePath) {
                        promise = _this.getInternalUrlByPath(filePath);
                    }
                    else {
                        promise = _this.getInternalUrlById(siteId, fileId);
                    }
                    return promise.then(function (response) {
                        return response;
                    }, function () {
                        // The file was not found in the pool, weird.
                        _this.notifyFileDownloading(siteId, fileId, links);
                        alreadyDownloaded = false;
                        return _this.downloadForPoolByUrl(siteId, fileUrl, options, filePath, onProgress, fileObject);
                    });
                }, function () {
                    // The file is not in the pool just yet.
                    _this.notifyFileDownloading(siteId, fileId, links);
                    alreadyDownloaded = false;
                    return _this.downloadForPoolByUrl(siteId, fileUrl, options, filePath, onProgress);
                }).then(function (response) {
                    if (typeof component != 'undefined') {
                        _this.addFileLink(siteId, fileId, component, componentId).catch(function () {
                            // Ignore errors.
                        });
                    }
                    if (!alreadyDownloaded) {
                        _this.notifyFileDownloaded(siteId, fileId, links);
                    }
                    return response;
                }, function (err) {
                    _this.notifyFileDownloadError(siteId, fileId, links);
                    return Promise.reject(err);
                });
            });
        }
        else {
            return Promise.reject(null);
        }
    };
    /**
     * Extract the downloadable URLs from an HTML code.
     *
     * @param html HTML code.
     * @return List of file urls.
     */
    CoreFilepoolProvider.prototype.extractDownloadableFilesFromHtml = function (html) {
        var urls = [], elements;
        var element = this.domUtils.convertToElement(html);
        elements = element.querySelectorAll('a, img, audio, video, source, track');
        for (var i = 0; i < elements.length; i++) {
            var element_1 = elements[i];
            var url = element_1.tagName === 'A' ? element_1.href : element_1.src;
            if (url && this.urlUtils.isDownloadableUrl(url) && urls.indexOf(url) == -1) {
                urls.push(url);
            }
            // Treat video poster.
            if (element_1.tagName == 'VIDEO' && element_1.getAttribute('poster')) {
                url = element_1.getAttribute('poster');
                if (url && this.urlUtils.isDownloadableUrl(url) && urls.indexOf(url) == -1) {
                    urls.push(url);
                }
            }
        }
        // Now get other files from plugin file handlers.
        urls = urls.concat(this.pluginFileDelegate.getDownloadableFilesFromHTML(element));
        return urls;
    };
    /**
     * Extract the downloadable URLs from an HTML code and returns them in fake file objects.
     *
     * @param html HTML code.
     * @return List of fake file objects with file URLs.
     */
    CoreFilepoolProvider.prototype.extractDownloadableFilesFromHtmlAsFakeFileObjects = function (html) {
        var urls = this.extractDownloadableFilesFromHtml(html);
        // Convert them to fake file objects.
        return urls.map(function (url) {
            return {
                fileurl: url
            };
        });
    };
    /**
     * Fill Missing Extension In the File Object if needed.
     * This is to migrate from old versions.
     *
     * @param fileObject File object to be migrated.
     * @param siteId SiteID to get migrated.
     * @return Promise resolved when done.
     */
    CoreFilepoolProvider.prototype.fillExtensionInFile = function (entry, siteId) {
        var _this = this;
        if (typeof entry.extension != 'undefined') {
            // Already filled.
            return Promise.resolve();
        }
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            var extension = _this.mimeUtils.getFileExtension(entry.path);
            if (!extension) {
                // Files does not have extension. Invalidate file (stale = true).
                // Minor problem: file will remain in the filesystem once downloaded again.
                _this.logger.debug('Staled file with no extension ' + entry.fileId);
                return db.updateRecords(_this.FILES_TABLE, { stale: 1 }, { fileId: entry.fileId });
            }
            // File has extension. Save extension, and add extension to path.
            var fileId = entry.fileId;
            entry.fileId = _this.mimeUtils.removeExtension(fileId);
            entry.extension = extension;
            return db.updateRecords(_this.FILES_TABLE, entry, { fileId: fileId }).then(function () {
                if (entry.fileId == fileId) {
                    // File ID hasn't changed, we're done.
                    _this.logger.debug('Removed extesion ' + extension + ' from file ' + entry.fileId);
                    return;
                }
                // Now update the links.
                return db.updateRecords(_this.LINKS_TABLE, { fileId: entry.fileId }, { fileId: fileId });
            });
        });
    };
    /**
     * Fix a component ID to always be a Number if possible.
     *
     * @param componentId The component ID.
     * @return The normalised component ID. -1 when undefined was passed.
     */
    CoreFilepoolProvider.prototype.fixComponentId = function (componentId) {
        if (typeof componentId == 'number') {
            return componentId;
        }
        // Try to convert it to a number.
        var id = parseInt(componentId, 10);
        if (isNaN(id)) {
            // Not a number.
            if (typeof componentId == 'undefined' || componentId === null) {
                return -1;
            }
            else {
                return componentId;
            }
        }
        return id;
    };
    /**
     * Check whether the file can be downloaded, add the wstoken url and points to the correct script.
     *
     * @param siteId The site ID.
     * @param fileUrl The file URL.
     * @param timemodified The timemodified of the file.
     * @return Promise resolved with the file data to use.
     */
    CoreFilepoolProvider.prototype.fixPluginfileURL = function (siteId, fileUrl, timemodified) {
        var _this = this;
        if (timemodified === void 0) { timemodified = 0; }
        return this.pluginFileDelegate.getDownloadableFile({ fileurl: fileUrl, timemodified: timemodified }).then(function (file) {
            return _this.sitesProvider.getSite(siteId).then(function (site) {
                return site.checkAndFixPluginfileURL(file.fileurl);
            }).then(function (fixedUrl) {
                file.fileurl = fixedUrl;
                return file;
            });
        });
    };
    /**
     * Convenience function to get component files.
     *
     * @param db Site's DB.
     * @param component The component to get.
     * @param componentId An ID to use in conjunction with the component.
     * @return Promise resolved with the files.
     */
    CoreFilepoolProvider.prototype.getComponentFiles = function (db, component, componentId) {
        var _this = this;
        var conditions = {
            component: component,
            componentId: this.fixComponentId(componentId)
        };
        return db.getRecords(this.LINKS_TABLE, conditions).then(function (items) {
            items.forEach(function (item) {
                item.componentId = _this.fixComponentId(item.componentId);
            });
            return items;
        });
    };
    /**
     * Returns the local URL of a directory.
     *
     * @param siteId The site ID.
     * @param fileUrl The file URL.
     * @return Resolved with the URL. Rejected otherwise.
     */
    CoreFilepoolProvider.prototype.getDirectoryUrlByUrl = function (siteId, fileUrl) {
        var _this = this;
        if (this.fileProvider.isAvailable()) {
            return this.fixPluginfileURL(siteId, fileUrl).then(function (file) {
                var fileId = _this.getFileIdByUrl(file.fileurl), filePath = _this.getFilePath(siteId, fileId, ''); // No extension, the function will return a string.
                return _this.fileProvider.getDir(filePath).then(function (dirEntry) {
                    return dirEntry.toURL();
                });
            });
        }
        return Promise.reject(null);
    };
    /**
     * Get the ID of a file download. Used to keep track of filePromises.
     *
     * @param fileUrl The file URL.
     * @param filePath The file destination path.
     * @return File download ID.
     */
    CoreFilepoolProvider.prototype.getFileDownloadId = function (fileUrl, filePath) {
        return Md5.hashAsciiStr(fileUrl + '###' + filePath);
    };
    /**
     * Get the name of the event used to notify download events (CoreEventsProvider).
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @return Event name.
     */
    CoreFilepoolProvider.prototype.getFileEventName = function (siteId, fileId) {
        return 'CoreFilepoolFile:' + siteId + ':' + fileId;
    };
    /**
     * Get the name of the event used to notify download events (CoreEventsProvider).
     *
     * @param siteId The site ID.
     * @param fileUrl The absolute URL to the file.
     * @return Promise resolved with event name.
     */
    CoreFilepoolProvider.prototype.getFileEventNameByUrl = function (siteId, fileUrl) {
        var _this = this;
        return this.fixPluginfileURL(siteId, fileUrl).then(function (file) {
            var fileId = _this.getFileIdByUrl(file.fileurl);
            return _this.getFileEventName(siteId, fileId);
        });
    };
    /**
     * Creates a unique ID based on a URL.
     *
     * This has a minimal handling of pluginfiles in order to generate a clean file ID which will not change if
     * pointing to the same pluginfile URL even if the token or extra attributes have changed.
     *
     * @param fileUrl The absolute URL to the file.
     * @return The file ID.
     */
    CoreFilepoolProvider.prototype.getFileIdByUrl = function (fileUrl) {
        var url = fileUrl, filename;
        // If site supports it, since 3.8 we use tokenpluginfile instead of pluginfile.
        // For compatibility with files already downloaded, we need to use pluginfile to calculate the file ID.
        url = url.replace(/\/tokenpluginfile\.php\/[^\/]+\//, '/webservice/pluginfile.php/');
        // Remove the revision number from the URL so updates on the file aren't detected as a different file.
        url = this.removeRevisionFromUrl(url);
        // Decode URL.
        url = this.textUtils.decodeHTML(this.textUtils.decodeURIComponent(url));
        if (url.indexOf('/webservice/pluginfile') !== -1) {
            // Remove attributes that do not matter.
            this.urlAttributes.forEach(function (regex) {
                url = url.replace(regex, '');
            });
        }
        // Try to guess the filename the target file should have.
        // We want to keep the original file name so people can easily identify the files after the download.
        filename = this.guessFilenameFromUrl(url);
        return this.addHashToFilename(url, filename);
    };
    /**
     * Get the links of a file.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @return Promise resolved with the links.
     */
    CoreFilepoolProvider.prototype.getFileLinks = function (siteId, fileId) {
        var _this = this;
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            return db.getRecords(_this.LINKS_TABLE, { fileId: fileId });
        }).then(function (items) {
            items.forEach(function (item) {
                item.componentId = _this.fixComponentId(item.componentId);
            });
            return items;
        });
    };
    /**
     * Get the path to a file. This does not check if the file exists or not.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param extension Previously calculated extension. Empty to not add any. Undefined to calculate it.
     * @return The path to the file relative to storage root.
     */
    CoreFilepoolProvider.prototype.getFilePath = function (siteId, fileId, extension) {
        var path = this.getFilepoolFolderPath(siteId) + '/' + fileId;
        if (typeof extension == 'undefined') {
            // We need the extension to be able to open files properly.
            return this.hasFileInPool(siteId, fileId).then(function (entry) {
                if (entry.extension) {
                    path += '.' + entry.extension;
                }
                return path;
            }).catch(function () {
                // If file not found, use the path without extension.
                return path;
            });
        }
        else {
            if (extension) {
                path += '.' + extension;
            }
            return path;
        }
    };
    /**
     * Get the path to a file from its URL. This does not check if the file exists or not.
     *
     * @param siteId The site ID.
     * @param fileUrl The file URL.
     * @return Promise resolved with the path to the file relative to storage root.
     */
    CoreFilepoolProvider.prototype.getFilePathByUrl = function (siteId, fileUrl) {
        var _this = this;
        return this.fixPluginfileURL(siteId, fileUrl).then(function (file) {
            var fileId = _this.getFileIdByUrl(file.fileurl);
            return _this.getFilePath(siteId, fileId);
        });
    };
    /**
     * Get site Filepool Folder Path
     *
     * @param siteId The site ID.
     * @return The root path to the filepool of the site.
     */
    CoreFilepoolProvider.prototype.getFilepoolFolderPath = function (siteId) {
        return this.fileProvider.getSiteFolder(siteId) + '/' + this.FOLDER;
    };
    /**
     * Get all the matching files from a component. Returns objects containing properties like path, extension and url.
     *
     * @param siteId The site ID.
     * @param component The component to get.
     * @param componentId An ID to use in conjunction with the component.
     * @return Promise resolved with the files on success.
     */
    CoreFilepoolProvider.prototype.getFilesByComponent = function (siteId, component, componentId) {
        var _this = this;
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            return _this.getComponentFiles(db, component, componentId).then(function (items) {
                var promises = [], files = [];
                items.forEach(function (item) {
                    promises.push(db.getRecord(_this.FILES_TABLE, { fileId: item.fileId }).then(function (fileEntry) {
                        if (!fileEntry) {
                            return;
                        }
                        files.push({
                            url: fileEntry.url,
                            path: fileEntry.path,
                            extension: fileEntry.extension,
                            revision: fileEntry.revision,
                            timemodified: fileEntry.timemodified
                        });
                    }).catch(function () {
                        // File not found, ignore error.
                    }));
                });
                return Promise.all(promises).then(function () {
                    return files;
                });
            });
        });
    };
    /**
     * Get the size of all the files from a component.
     *
     * @param siteId The site ID.
     * @param component The component to get.
     * @param componentId An ID to use in conjunction with the component.
     * @return Promise resolved with the size on success.
     */
    CoreFilepoolProvider.prototype.getFilesSizeByComponent = function (siteId, component, componentId) {
        var _this = this;
        return this.getFilesByComponent(siteId, component, componentId).then(function (files) {
            var promises = [];
            var size = 0;
            files.forEach(function (file) {
                promises.push(_this.fileProvider.getFileSize(file.path).then(function (fs) {
                    size += fs;
                }).catch(function () {
                    // Ignore failures, maybe some file was deleted.
                }));
            });
            return Promise.all(promises).then(function () {
                return size;
            });
        });
    };
    /**
     * Returns the file state: mmCoreDownloaded, mmCoreDownloading, mmCoreNotDownloaded or mmCoreOutdated.
     *
     * @param siteId The site ID.
     * @param fileUrl File URL.
     * @param timemodified The time this file was modified.
     * @param filePath Filepath to download the file to. If defined, no extension will be added.
     * @param revision File revision. If not defined, it will be calculated using the URL.
     * @return Promise resolved with the file state.
     */
    CoreFilepoolProvider.prototype.getFileStateByUrl = function (siteId, fileUrl, timemodified, filePath, revision) {
        if (timemodified === void 0) { timemodified = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var file, e_1, fileId, e_2, extension, _a, downloadId, entry, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fixPluginfileURL(siteId, fileUrl, timemodified)];
                    case 1:
                        file = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        return [2 /*return*/, CoreConstants.NOT_DOWNLOADABLE];
                    case 3:
                        fileUrl = file.fileurl;
                        timemodified = file.timemodified || timemodified;
                        revision = revision || this.getRevisionFromUrl(fileUrl);
                        fileId = this.getFileIdByUrl(fileUrl);
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 13]);
                        // Check if the file is in queue (waiting to be downloaded).
                        return [4 /*yield*/, this.hasFileInQueue(siteId, fileId)];
                    case 5:
                        // Check if the file is in queue (waiting to be downloaded).
                        _b.sent();
                        return [2 /*return*/, CoreConstants.DOWNLOADING];
                    case 6:
                        e_2 = _b.sent();
                        extension = this.mimeUtils.guessExtensionFromUrl(fileUrl);
                        _a = filePath;
                        if (_a) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getFilePath(siteId, fileId, extension)];
                    case 7:
                        _a = (_b.sent());
                        _b.label = 8;
                    case 8:
                        filePath = _a;
                        downloadId = this.getFileDownloadId(fileUrl, filePath);
                        if (this.filePromises[siteId] && this.filePromises[siteId][downloadId]) {
                            return [2 /*return*/, CoreConstants.DOWNLOADING];
                        }
                        _b.label = 9;
                    case 9:
                        _b.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, this.hasFileInPool(siteId, fileId)];
                    case 10:
                        entry = _b.sent();
                        if (this.isFileOutdated(entry, revision, timemodified)) {
                            return [2 /*return*/, CoreConstants.OUTDATED];
                        }
                        return [2 /*return*/, CoreConstants.DOWNLOADED];
                    case 11:
                        e_3 = _b.sent();
                        return [2 /*return*/, CoreConstants.NOT_DOWNLOADED];
                    case 12: return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns an absolute URL to access the file URL.
     *
     * @param siteId The site ID.
     * @param fileUrl The absolute URL to the file.
     * @param mode The type of URL to return. Accepts 'url' or 'src'.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @param timemodified The time this file was modified.
     * @param checkSize True if we shouldn't download files if their size is big, false otherwise.
     * @param downloadUnknown True to download file in WiFi if their size is unknown, false otherwise.
     *                        Ignored if checkSize=false.
     * @param options Extra options (isexternalfile, repositorytype).
     * @param revision File revision. If not defined, it will be calculated using the URL.
     * @return Resolved with the URL to use.
     * @description
     * This will return a URL pointing to the content of the requested URL.
     *
     * This handles the queue and validity of the file. If there is a local file and it's valid, return the local URL.
     * If the file isn't downloaded or it's outdated, return the online URL and add it to the queue to be downloaded later.
     */
    CoreFilepoolProvider.prototype.getFileUrlByUrl = function (siteId, fileUrl, component, componentId, mode, timemodified, checkSize, downloadUnknown, options, revision) {
        var _this = this;
        if (mode === void 0) { mode = 'url'; }
        if (timemodified === void 0) { timemodified = 0; }
        if (checkSize === void 0) { checkSize = true; }
        if (options === void 0) { options = {}; }
        var fileId;
        var addToQueue = function (fileUrl) {
            // Add the file to queue if needed and ignore errors.
            _this.addToQueueIfNeeded(siteId, fileUrl, component, componentId, timemodified, checkSize, downloadUnknown, options, revision).catch(function () {
                // Ignore errors.
            });
        };
        return this.fixPluginfileURL(siteId, fileUrl, timemodified).then(function (file) {
            fileUrl = file.fileurl;
            timemodified = file.timemodified || timemodified;
            revision = revision || _this.getRevisionFromUrl(fileUrl);
            fileId = _this.getFileIdByUrl(fileUrl);
            return _this.hasFileInPool(siteId, fileId).then(function (entry) {
                var response;
                if (typeof entry === 'undefined') {
                    // We do not have the file, add it to the queue, and return real URL.
                    addToQueue(fileUrl);
                    response = fileUrl;
                }
                else if (_this.isFileOutdated(entry, revision, timemodified) && _this.appProvider.isOnline()) {
                    // The file is outdated, we add to the queue and return real URL.
                    addToQueue(fileUrl);
                    response = fileUrl;
                }
                else {
                    // We found the file entry, now look for the file on disk.
                    if (mode === 'src') {
                        response = _this.getInternalSrcById(siteId, fileId);
                    }
                    else {
                        response = _this.getInternalUrlById(siteId, fileId);
                    }
                    response = response.then(function (internalUrl) {
                        // The file is on disk.
                        return internalUrl;
                    }).catch(function () {
                        // We could not retrieve the file, delete the entries associated with that ID.
                        _this.logger.debug('File ' + fileId + ' not found on disk');
                        _this.removeFileById(siteId, fileId);
                        addToQueue(fileUrl);
                        if (_this.appProvider.isOnline()) {
                            // We still have a chance to serve the right content.
                            return fileUrl;
                        }
                        return Promise.reject(null);
                    });
                }
                return response;
            }, function () {
                // We do not have the file in store yet. Add to queue and return the fixed URL.
                addToQueue(fileUrl);
                return fileUrl;
            });
        });
    };
    /**
     * Returns the internal SRC of a file.
     *
     * The returned URL from this method is typically used with IMG tags.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @return Resolved with the internal URL. Rejected otherwise.
     */
    CoreFilepoolProvider.prototype.getInternalSrcById = function (siteId, fileId) {
        var _this = this;
        if (this.fileProvider.isAvailable()) {
            return Promise.resolve(this.getFilePath(siteId, fileId)).then(function (path) {
                return _this.fileProvider.getFile(path).then(function (fileEntry) {
                    return _this.fileProvider.convertFileSrc(fileEntry.toURL());
                });
            });
        }
        return Promise.reject(null);
    };
    /**
     * Returns the local URL of a file.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @return Resolved with the URL. Rejected otherwise.
     */
    CoreFilepoolProvider.prototype.getInternalUrlById = function (siteId, fileId) {
        var _this = this;
        if (this.fileProvider.isAvailable()) {
            return Promise.resolve(this.getFilePath(siteId, fileId)).then(function (path) {
                return _this.fileProvider.getFile(path).then(function (fileEntry) {
                    // This URL is usually used to launch files or put them in HTML. In desktop we need the internal URL.
                    if (_this.appProvider.isDesktop()) {
                        return fileEntry.toInternalURL();
                    }
                    else {
                        return fileEntry.toURL();
                    }
                });
            });
        }
        return Promise.reject(null);
    };
    /**
     * Returns the local URL of a file.
     *
     * @param filePath The file path.
     * @return Resolved with the URL.
     */
    CoreFilepoolProvider.prototype.getInternalUrlByPath = function (filePath) {
        if (this.fileProvider.isAvailable()) {
            return this.fileProvider.getFile(filePath).then(function (fileEntry) {
                return fileEntry.toURL();
            });
        }
        return Promise.reject(null);
    };
    /**
     * Returns the local URL of a file.
     *
     * @param siteId The site ID.
     * @param fileUrl The file URL.
     * @return Resolved with the URL. Rejected otherwise.
     */
    CoreFilepoolProvider.prototype.getInternalUrlByUrl = function (siteId, fileUrl) {
        var _this = this;
        if (this.fileProvider.isAvailable()) {
            return this.fixPluginfileURL(siteId, fileUrl).then(function (file) {
                var fileId = _this.getFileIdByUrl(file.fileurl);
                return _this.getInternalUrlById(siteId, fileId);
            });
        }
        return Promise.reject(null);
    };
    /**
     * Get the data stored for a package.
     *
     * @param siteId Site ID.
     * @param component Package's component.
     * @param componentId An ID to use in conjunction with the component.
     * @return Promise resolved with the data.
     */
    CoreFilepoolProvider.prototype.getPackageData = function (siteId, component, componentId) {
        var _this = this;
        componentId = this.fixComponentId(componentId);
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var packageId = _this.getPackageId(component, componentId);
            return site.getDb().getRecord(_this.PACKAGES_TABLE, { id: packageId });
        });
    };
    /**
     * Creates the name for a package directory (hash).
     *
     * @param url An URL to identify the package.
     * @return The directory name.
     */
    CoreFilepoolProvider.prototype.getPackageDirNameByUrl = function (url) {
        var candidate, extension = '';
        url = this.removeRevisionFromUrl(url);
        if (url.indexOf('/webservice/pluginfile') !== -1) {
            // Remove attributes that do not matter.
            this.urlAttributes.forEach(function (regex) {
                url = url.replace(regex, '');
            });
            // Guess the extension of the URL. This is for backwards compatibility.
            candidate = this.mimeUtils.guessExtensionFromUrl(url);
            if (candidate && candidate !== 'php') {
                extension = '.' + candidate;
            }
        }
        return Md5.hashAsciiStr('url:' + url) + extension;
    };
    /**
     * Get the path to a directory to store a package files. This does not check if the file exists or not.
     *
     * @param siteId The site ID.
     * @param url An URL to identify the package.
     * @return Promise resolved with the path of the package.
     */
    CoreFilepoolProvider.prototype.getPackageDirPathByUrl = function (siteId, url) {
        var _this = this;
        return this.fixPluginfileURL(siteId, url).then(function (file) {
            var dirName = _this.getPackageDirNameByUrl(file.fileurl);
            return _this.getFilePath(siteId, dirName, '');
        });
    };
    /**
     * Returns the local URL of a package directory.
     *
     * @param siteId The site ID.
     * @param url An URL to identify the package.
     * @return Resolved with the URL.
     */
    CoreFilepoolProvider.prototype.getPackageDirUrlByUrl = function (siteId, url) {
        var _this = this;
        if (this.fileProvider.isAvailable()) {
            return this.fixPluginfileURL(siteId, url).then(function (file) {
                var dirName = _this.getPackageDirNameByUrl(file.fileurl), dirPath = _this.getFilePath(siteId, dirName, ''); // No extension, the function will return a string.
                return _this.fileProvider.getDir(dirPath).then(function (dirEntry) {
                    return dirEntry.toURL();
                });
            });
        }
        return Promise.reject(null);
    };
    /**
     * Get a download promise. If the promise is not set, return undefined.
     *
     * @param siteId Site ID.
     * @param component The component of the package.
     * @param componentId An ID to use in conjunction with the component.
     * @return Download promise or undefined.
     */
    CoreFilepoolProvider.prototype.getPackageDownloadPromise = function (siteId, component, componentId) {
        var packageId = this.getPackageId(component, componentId);
        if (this.packagesPromises[siteId] && this.packagesPromises[siteId][packageId]) {
            return this.packagesPromises[siteId][packageId];
        }
    };
    /**
     * Get a package extra data.
     *
     * @param siteId Site ID.
     * @param component Package's component.
     * @param componentId An ID to use in conjunction with the component.
     * @return Promise resolved with the extra data.
     */
    CoreFilepoolProvider.prototype.getPackageExtra = function (siteId, component, componentId) {
        return this.getPackageData(siteId, component, componentId).then(function (entry) {
            return entry.extra;
        });
    };
    /**
     * Get the ID of a package.
     *
     * @param component Package's component.
     * @param componentId An ID to use in conjunction with the component.
     * @return Package ID.
     */
    CoreFilepoolProvider.prototype.getPackageId = function (component, componentId) {
        return Md5.hashAsciiStr(component + '#' + this.fixComponentId(componentId));
    };
    /**
     * Get a package previous status.
     *
     * @param siteId Site ID.
     * @param component Package's component.
     * @param componentId An ID to use in conjunction with the component.
     * @return Promise resolved with the status.
     */
    CoreFilepoolProvider.prototype.getPackagePreviousStatus = function (siteId, component, componentId) {
        return this.getPackageData(siteId, component, componentId).then(function (entry) {
            return entry.previous || CoreConstants.NOT_DOWNLOADED;
        }).catch(function () {
            return CoreConstants.NOT_DOWNLOADED;
        });
    };
    /**
     * Get a package status.
     *
     * @param siteId Site ID.
     * @param component Package's component.
     * @param componentId An ID to use in conjunction with the component.
     * @return Promise resolved with the status.
     */
    CoreFilepoolProvider.prototype.getPackageStatus = function (siteId, component, componentId) {
        return this.getPackageData(siteId, component, componentId).then(function (entry) {
            return entry.status || CoreConstants.NOT_DOWNLOADED;
        }).catch(function () {
            return CoreConstants.NOT_DOWNLOADED;
        });
    };
    /**
     * Return the array of arguments of the pluginfile url.
     *
     * @param url URL to get the args.
     * @return The args found, undefined if not a pluginfile.
     */
    CoreFilepoolProvider.prototype.getPluginFileArgs = function (url) {
        if (!this.urlUtils.isPluginFileUrl(url)) {
            // Not pluginfile, return.
            return;
        }
        var relativePath = url.substr(url.indexOf('/pluginfile.php') + 16), args = relativePath.split('/');
        if (args.length < 3) {
            // To be a plugin file it should have at least contextId, Component and Filearea.
            return;
        }
        return args;
    };
    /**
     * Get the deferred object for a file in the queue.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param create True if it should create a new deferred if it doesn't exist.
     * @param onProgress Function to call on progress.
     * @return Deferred.
     */
    CoreFilepoolProvider.prototype.getQueueDeferred = function (siteId, fileId, create, onProgress) {
        if (create === void 0) { create = true; }
        if (!this.queueDeferreds[siteId]) {
            if (!create) {
                return;
            }
            this.queueDeferreds[siteId] = {};
        }
        if (!this.queueDeferreds[siteId][fileId]) {
            if (!create) {
                return;
            }
            this.queueDeferreds[siteId][fileId] = this.utils.promiseDefer();
        }
        if (onProgress) {
            this.queueDeferreds[siteId][fileId].onProgress = onProgress;
        }
        return this.queueDeferreds[siteId][fileId];
    };
    /**
     * Get the on progress for a file in the queue.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @return On progress function, undefined if not found.
     */
    CoreFilepoolProvider.prototype.getQueueOnProgress = function (siteId, fileId) {
        var deferred = this.getQueueDeferred(siteId, fileId, false);
        if (deferred) {
            return deferred.onProgress;
        }
    };
    /**
     * Get the promise for a file in the queue.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param create True if it should create a new promise if it doesn't exist.
     * @param onProgress Function to call on progress.
     * @return Promise.
     */
    CoreFilepoolProvider.prototype.getQueuePromise = function (siteId, fileId, create, onProgress) {
        if (create === void 0) { create = true; }
        return this.getQueueDeferred(siteId, fileId, create, onProgress).promise;
    };
    /**
     * Get a revision number from a list of files (highest revision).
     *
     * @param files Package files.
     * @return Highest revision.
     */
    CoreFilepoolProvider.prototype.getRevisionFromFileList = function (files) {
        var _this = this;
        var revision = 0;
        files.forEach(function (file) {
            if (file.url || file.fileurl) {
                var r = _this.getRevisionFromUrl(file.url || file.fileurl);
                if (r > revision) {
                    revision = r;
                }
            }
        });
        return revision;
    };
    /**
     * Get the revision number from a file URL.
     *
     * @param url URL to get the revision number.
     * @return Revision number.
     */
    CoreFilepoolProvider.prototype.getRevisionFromUrl = function (url) {
        var args = this.getPluginFileArgs(url);
        if (!args) {
            // Not a pluginfile, no revision will be found.
            return 0;
        }
        var revisionRegex = this.pluginFileDelegate.getComponentRevisionRegExp(args);
        if (!revisionRegex) {
            return 0;
        }
        var matches = url.match(revisionRegex);
        if (matches && typeof matches[1] != 'undefined') {
            return parseInt(matches[1], 10);
        }
        return 0;
    };
    /**
     * Returns an absolute URL to use in IMG tags.
     *
     * @param siteId The site ID.
     * @param fileUrl The absolute URL to the file.
     * @param mode The type of URL to return. Accepts 'url' or 'src'.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @param timemodified The time this file was modified.
     * @param checkSize True if we shouldn't download files if their size is big, false otherwise.
     * @param downloadUnknown True to download file in WiFi if their size is unknown, false otherwise.
     *                        Ignored if checkSize=false.
     * @param options Extra options (isexternalfile, repositorytype).
     * @param revision File revision. If not defined, it will be calculated using the URL.
     * @return Resolved with the URL to use.
     * @description
     * This will return a URL pointing to the content of the requested URL.
     * The URL returned is compatible to use with IMG tags.
     */
    CoreFilepoolProvider.prototype.getSrcByUrl = function (siteId, fileUrl, component, componentId, timemodified, checkSize, downloadUnknown, options, revision) {
        if (timemodified === void 0) { timemodified = 0; }
        if (checkSize === void 0) { checkSize = true; }
        if (options === void 0) { options = {}; }
        return this.getFileUrlByUrl(siteId, fileUrl, component, componentId, 'src', timemodified, checkSize, downloadUnknown, options, revision);
    };
    /**
     * Get time modified from a list of files.
     *
     * @param files List of files.
     * @return Time modified.
     */
    CoreFilepoolProvider.prototype.getTimemodifiedFromFileList = function (files) {
        var timemodified = 0;
        files.forEach(function (file) {
            if (file.timemodified > timemodified) {
                timemodified = file.timemodified;
            }
        });
        return timemodified;
    };
    /**
     * Returns an absolute URL to access the file.
     *
     * @param siteId The site ID.
     * @param fileUrl The absolute URL to the file.
     * @param mode The type of URL to return. Accepts 'url' or 'src'.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @param timemodified The time this file was modified.
     * @param checkSize True if we shouldn't download files if their size is big, false otherwise.
     * @param downloadUnknown True to download file in WiFi if their size is unknown, false otherwise.
     *                        Ignored if checkSize=false.
     * @param options Extra options (isexternalfile, repositorytype).
     * @param revision File revision. If not defined, it will be calculated using the URL.
     * @return Resolved with the URL to use.
     * @description
     * This will return a URL pointing to the content of the requested URL.
     * The URL returned is compatible to use with a local browser.
     */
    CoreFilepoolProvider.prototype.getUrlByUrl = function (siteId, fileUrl, component, componentId, timemodified, checkSize, downloadUnknown, options, revision) {
        if (timemodified === void 0) { timemodified = 0; }
        if (checkSize === void 0) { checkSize = true; }
        if (options === void 0) { options = {}; }
        return this.getFileUrlByUrl(siteId, fileUrl, component, componentId, 'url', timemodified, checkSize, downloadUnknown, options, revision);
    };
    /**
     * Guess the filename of a file from its URL. This is very weak and unreliable.
     *
     * @param fileUrl The file URL.
     * @return The filename treated so it doesn't have any special character.
     */
    CoreFilepoolProvider.prototype.guessFilenameFromUrl = function (fileUrl) {
        var filename = '';
        if (fileUrl.indexOf('/webservice/pluginfile') !== -1) {
            // It's a pluginfile URL. Search for the 'file' param to extract the name.
            var params = this.urlUtils.extractUrlParams(fileUrl);
            if (params.file) {
                filename = params.file.substr(params.file.lastIndexOf('/') + 1);
            }
            else {
                // 'file' param not found. Extract what's after the last '/' without params.
                filename = this.urlUtils.getLastFileWithoutParams(fileUrl);
            }
        }
        else if (this.urlUtils.isGravatarUrl(fileUrl)) {
            // Extract gravatar ID.
            filename = 'gravatar_' + this.urlUtils.getLastFileWithoutParams(fileUrl);
        }
        else if (this.urlUtils.isThemeImageUrl(fileUrl)) {
            // Extract user ID.
            var matches = fileUrl.match(/\/core\/([^\/]*)\//);
            if (matches && matches[1]) {
                filename = matches[1];
            }
            // Attach a constant and the image type.
            filename = 'default_' + filename + '_' + this.urlUtils.getLastFileWithoutParams(fileUrl);
        }
        else {
            // Another URL. Just get what's after the last /.
            filename = this.urlUtils.getLastFileWithoutParams(fileUrl);
        }
        // If there are hashes in the URL, extract them.
        var index = filename.indexOf('#');
        var hashes;
        if (index != -1) {
            hashes = filename.split('#');
            // Remove the URL from the array.
            hashes.shift();
            filename = filename.substr(0, index);
        }
        // Remove the extension from the filename.
        filename = this.mimeUtils.removeExtension(filename);
        if (hashes) {
            // Add hashes to the name.
            filename += '_' + hashes.join('_');
        }
        return this.textUtils.removeSpecialCharactersForFiles(filename);
    };
    /**
     * Check if the file is already in the pool. This does not check if the file is on the disk.
     *
     * @param siteId The site ID.
     * @param fileUrl The file URL.
     * @return Resolved with file object from DB on success, rejected otherwise.
     */
    CoreFilepoolProvider.prototype.hasFileInPool = function (siteId, fileId) {
        var _this = this;
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            return db.getRecord(_this.FILES_TABLE, { fileId: fileId }).then(function (entry) {
                if (typeof entry === 'undefined') {
                    return Promise.reject(null);
                }
                return entry;
            });
        });
    };
    /**
     * Check if the file is in the queue.
     *
     * @param siteId The site ID.
     * @param fileUrl The file URL.
     * @return Resolved with file object from DB on success, rejected otherwise.
     */
    CoreFilepoolProvider.prototype.hasFileInQueue = function (siteId, fileId) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.appDB.getRecord(this.QUEUE_TABLE, { siteId: siteId, fileId: fileId })];
                    case 2:
                        entry = _a.sent();
                        if (typeof entry === 'undefined') {
                            throw null;
                        }
                        // Convert the links to an object.
                        entry.links = this.textUtils.parseJSON(entry.links, []);
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    /**
     * Invalidate all the files in a site.
     *
     * @param siteId The site ID.
     * @param onlyUnknown True to only invalidate files from external repos or without revision/timemodified.
     *                    It is advised to set it to true to reduce the performance and data usage of the app.
     * @return Resolved on success.
     */
    CoreFilepoolProvider.prototype.invalidateAllFiles = function (siteId, onlyUnknown) {
        if (onlyUnknown === void 0) { onlyUnknown = true; }
        return __awaiter(this, void 0, void 0, function () {
            var db, where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sitesProvider.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        where = onlyUnknown ? this.FILE_UPDATE_UNKNOWN_WHERE_CLAUSE : null;
                        return [4 /*yield*/, db.updateRecordsWhere(this.FILES_TABLE, { stale: 1 }, where)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Invalidate a file by URL.
     *
     * @param siteId The site ID.
     * @param fileUrl The file URL.
     * @return Resolved on success.
     * @description
     * Invalidates a file by marking it stale. It will not be added to the queue automatically, but the next time this file
     * is requested it will be added to the queue.
     * You can manully call addToQueueByUrl to add this file to the queue immediately.
     * Please note that, if a file is stale, the user will be presented the stale file if there is no network access.
     */
    CoreFilepoolProvider.prototype.invalidateFileByUrl = function (siteId, fileUrl) {
        var _this = this;
        return this.fixPluginfileURL(siteId, fileUrl).then(function (file) {
            var fileId = _this.getFileIdByUrl(file.fileurl);
            return _this.sitesProvider.getSiteDb(siteId).then(function (db) {
                return db.updateRecords(_this.FILES_TABLE, { stale: 1 }, { fileId: fileId });
            });
        });
    };
    /**
     * Invalidate all the matching files from a component.
     *
     * @param siteId The site ID.
     * @param component The component to invalidate.
     * @param componentId An ID to use in conjunction with the component.
     * @param onlyUnknown True to only invalidate files from external repos or without revision/timemodified.
     *                    It is advised to set it to true to reduce the performance and data usage of the app.
     * @return Resolved when done.
     */
    CoreFilepoolProvider.prototype.invalidateFilesByComponent = function (siteId, component, componentId, onlyUnknown) {
        if (onlyUnknown === void 0) { onlyUnknown = true; }
        return __awaiter(this, void 0, void 0, function () {
            var db, items, fileIds, whereAndParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sitesProvider.getSiteDb(siteId)];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, this.getComponentFiles(db, component, componentId)];
                    case 2:
                        items = _a.sent();
                        if (!items.length) {
                            // Nothing to invalidate.
                            return [2 /*return*/];
                        }
                        fileIds = items.map(function (item) { return item.fileId; });
                        whereAndParams = db.getInOrEqual(fileIds);
                        whereAndParams[0] = 'fileId ' + whereAndParams[0];
                        if (onlyUnknown) {
                            whereAndParams[0] += ' AND (' + this.FILE_UPDATE_UNKNOWN_WHERE_CLAUSE + ')';
                        }
                        return [4 /*yield*/, db.updateRecordsWhere(this.FILES_TABLE, { stale: 1 }, whereAndParams[0], whereAndParams[1])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Whether a file action indicates a file was downloaded or deleted.
     *
     * @param data Event data.
     * @return Whether downloaded or deleted.
     */
    CoreFilepoolProvider.prototype.isFileEventDownloadedOrDeleted = function (data) {
        return (data.action == "download" /* DOWNLOAD */ && data.success == true) ||
            data.action == "deleted" /* DELETED */;
    };
    /**
     * Check whether a file is downloadable.
     *
     * @param siteId The site ID.
     * @param fileUrl File URL.
     * @param timemodified The time this file was modified.
     * @param filePath Filepath to download the file to. If defined, no extension will be added.
     * @param revision File revision. If not defined, it will be calculated using the URL.
     * @return Promise resolved with a boolean: whether a file is downloadable.
     */
    CoreFilepoolProvider.prototype.isFileDownloadable = function (siteId, fileUrl, timemodified, filePath, revision) {
        if (timemodified === void 0) { timemodified = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFileStateByUrl(siteId, fileUrl, timemodified, filePath, revision)];
                    case 1:
                        state = _a.sent();
                        return [2 /*return*/, state != CoreConstants.NOT_DOWNLOADABLE];
                }
            });
        });
    };
    /**
     * Check if a file is downloading.
     *
     * @param siteId The site ID.
     * @param fileUrl File URL.
     * @param Promise resolved if file is downloading, rejected otherwise.
     */
    CoreFilepoolProvider.prototype.isFileDownloadingByUrl = function (siteId, fileUrl) {
        var _this = this;
        return this.fixPluginfileURL(siteId, fileUrl).then(function (file) {
            var fileId = _this.getFileIdByUrl(file.fileurl);
            return _this.hasFileInQueue(siteId, fileId);
        });
    };
    /**
     * Check if a file is outdated.
     *
     * @param entry Filepool entry.
     * @param revision File revision number.
     * @param timemodified The time this file was modified.
     * @param Whether the file is outdated.
     */
    CoreFilepoolProvider.prototype.isFileOutdated = function (entry, revision, timemodified) {
        return !!entry.stale || revision > entry.revision || timemodified > entry.timemodified;
    };
    /**
     * Check if cannot determine if a file has been updated.
     *
     * @param entry Filepool entry.
     * @return Whether it cannot determine updates.
     */
    CoreFilepoolProvider.prototype.isFileUpdateUnknown = function (entry) {
        return !!entry.isexternalfile || (!entry.revision && !entry.timemodified);
    };
    /**
     * Notify an action performed on a file to a list of components.
     *
     * @param siteId The site ID.
     * @param eventData The file event data.
     * @param links The links to the components.
     */
    CoreFilepoolProvider.prototype.notifyFileActionToComponents = function (siteId, eventData, links) {
        var _this = this;
        links.forEach(function (link) {
            var data = Object.assign({
                component: link.component,
                componentId: link.componentId,
            }, eventData);
            _this.eventsProvider.trigger(CoreEventsProvider.COMPONENT_FILE_ACTION, data, siteId);
        });
    };
    /**
     * Notify a file has been deleted.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param links The links to components.
     */
    CoreFilepoolProvider.prototype.notifyFileDeleted = function (siteId, fileId, links) {
        var data = {
            fileId: fileId,
            action: "deleted" /* DELETED */,
        };
        this.eventsProvider.trigger(this.getFileEventName(siteId, fileId), data);
        this.notifyFileActionToComponents(siteId, data, links);
    };
    /**
     * Notify a file has been downloaded.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param links The links to components.
     */
    CoreFilepoolProvider.prototype.notifyFileDownloaded = function (siteId, fileId, links) {
        var data = {
            fileId: fileId,
            action: "download" /* DOWNLOAD */,
            success: true,
        };
        this.eventsProvider.trigger(this.getFileEventName(siteId, fileId), data);
        this.notifyFileActionToComponents(siteId, data, links);
    };
    /**
     * Notify error occurred while downloading a file.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param links The links to components.
     */
    CoreFilepoolProvider.prototype.notifyFileDownloadError = function (siteId, fileId, links) {
        var data = {
            fileId: fileId,
            action: "download" /* DOWNLOAD */,
            success: false,
        };
        this.eventsProvider.trigger(this.getFileEventName(siteId, fileId), data);
        this.notifyFileActionToComponents(siteId, data, links);
    };
    /**
     * Notify a file starts being downloaded or added to queue.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param links The links to components.
     */
    CoreFilepoolProvider.prototype.notifyFileDownloading = function (siteId, fileId, links) {
        var data = {
            fileId: fileId,
            action: "downloading" /* DOWNLOADING */,
        };
        this.eventsProvider.trigger(this.getFileEventName(siteId, fileId), data);
        this.notifyFileActionToComponents(siteId, data, links);
    };
    /**
     * Notify a file has been outdated.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param links The links to components.
     */
    CoreFilepoolProvider.prototype.notifyFileOutdated = function (siteId, fileId, links) {
        var data = {
            fileId: fileId,
            action: "outdated" /* OUTDATED */,
        };
        this.eventsProvider.trigger(this.getFileEventName(siteId, fileId), data);
        this.notifyFileActionToComponents(siteId, data, links);
    };
    /**
     * Prefetches a list of files.
     *
     * @param siteId The site ID.
     * @param fileList List of files to download.
     * @param component The component to link the file to.
     * @param componentId An ID to identify the download.
     * @param extra Extra data to store for the package.
     * @param dirPath Name of the directory where to store the files (inside filepool dir). If not defined, store
     *                the files directly inside the filepool folder.
     * @param onProgress Function to call on progress.
     * @return Promise resolved when all files are downloaded.
     */
    CoreFilepoolProvider.prototype.prefetchPackage = function (siteId, fileList, component, componentId, extra, dirPath, onProgress) {
        return this.downloadOrPrefetchPackage(siteId, fileList, true, component, componentId, extra, dirPath, onProgress);
    };
    /**
     * Process the queue.
     *
     * @description
     * This loops over itself to keep on processing the queue in the background.
     * The queue process is site agnostic.
     */
    CoreFilepoolProvider.prototype.processQueue = function () {
        var _this = this;
        var promise;
        if (this.queueState !== this.QUEUE_RUNNING) {
            // Silently ignore, the queue is on pause.
            promise = Promise.reject(this.ERR_QUEUE_ON_PAUSE);
        }
        else if (!this.fileProvider.isAvailable() || !this.appProvider.isOnline()) {
            promise = Promise.reject(this.ERR_FS_OR_NETWORK_UNAVAILABLE);
        }
        else {
            promise = this.processImportantQueueItem();
        }
        promise.then(function () {
            // All good, we schedule next execution.
            setTimeout(function () {
                _this.processQueue();
            }, _this.QUEUE_PROCESS_INTERVAL);
        }, function (error) {
            // We had an error, in which case we pause the processing.
            if (error === _this.ERR_FS_OR_NETWORK_UNAVAILABLE) {
                _this.logger.debug('Filesysem or network unavailable, pausing queue processing.');
            }
            else if (error === _this.ERR_QUEUE_IS_EMPTY) {
                _this.logger.debug('Queue is empty, pausing queue processing.');
            }
            _this.queueState = _this.QUEUE_PAUSED;
        });
    };
    /**
     * Process the most important queue item.
     *
     * @return Resolved on success. Rejected on failure.
     */
    CoreFilepoolProvider.prototype.processImportantQueueItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, err_1, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.appDB.getRecords(this.QUEUE_TABLE, undefined, 'priority DESC, added ASC', undefined, 0, 1)];
                    case 3:
                        items = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        throw this.ERR_QUEUE_IS_EMPTY;
                    case 5:
                        item = items.pop();
                        if (!item) {
                            throw this.ERR_QUEUE_IS_EMPTY;
                        }
                        // Convert the links to an object.
                        item.links = this.textUtils.parseJSON(item.links, []);
                        return [2 /*return*/, this.processQueueItem(item)];
                }
            });
        });
    };
    /**
     * Process a queue item.
     *
     * @param item The object from the queue store.
     * @return Resolved on success. Rejected on failure.
     */
    CoreFilepoolProvider.prototype.processQueueItem = function (item) {
        var _this = this;
        // Cast optional fields to undefined instead of null.
        var siteId = item.siteId, fileId = item.fileId, fileUrl = item.url, options = {
            revision: item.revision || undefined,
            timemodified: item.timemodified || undefined,
            isexternalfile: item.isexternalfile || undefined,
            repositorytype: item.repositorytype || undefined
        }, filePath = item.path || undefined, links = item.links || [];
        this.logger.debug('Processing queue item: ' + siteId + ', ' + fileId);
        // Check if the file is already in pool.
        return this.hasFileInPool(siteId, fileId).catch(function () {
            // File not in pool.
        }).then(function (entry) {
            if (entry && !options.isexternalfile && !_this.isFileOutdated(entry, options.revision, options.timemodified)) {
                // We have the file, it is not stale, we can update links and remove from queue.
                _this.logger.debug('Queued file already in store, ignoring...');
                _this.addFileLinks(siteId, fileId, links).catch(function () {
                    // Ignore errors.
                });
                _this.removeFromQueue(siteId, fileId).catch(function () {
                    // Ignore errors.
                }).finally(function () {
                    _this.treatQueueDeferred(siteId, fileId, true);
                });
                return;
            }
            // The file does not exist, or is stale, ... download it.
            var onProgress = _this.getQueueOnProgress(siteId, fileId);
            return _this.downloadForPoolByUrl(siteId, fileUrl, options, filePath, onProgress, entry).then(function () {
                // Success, we add links and remove from queue.
                _this.addFileLinks(siteId, fileId, links).catch(function () {
                    // Ignore errors.
                });
                _this.treatQueueDeferred(siteId, fileId, true);
                _this.notifyFileDownloaded(siteId, fileId, links);
                // Wait for the item to be removed from queue before resolving the promise.
                // If the item could not be removed from queue we still resolve the promise.
                return _this.removeFromQueue(siteId, fileId).catch(function () {
                    // Ignore errors.
                });
            }, function (errorObject) {
                // Whoops, we have an error...
                var dropFromQueue = false;
                if (errorObject && errorObject.source === fileUrl) {
                    // This is most likely a FileTransfer error.
                    if (errorObject.code === 1) {
                        // The file was not found, most likely a 404, we remove from queue.
                        dropFromQueue = true;
                    }
                    else if (errorObject.code === 2) {
                        // The URL is invalid, we drop the file from the queue.
                        dropFromQueue = true;
                    }
                    else if (errorObject.code === 3) {
                        // If there was an HTTP status, then let's remove from the queue.
                        dropFromQueue = true;
                    }
                    else if (errorObject.code === 4) {
                        // The transfer was aborted, we will keep the file in queue.
                    }
                    else if (errorObject.code === 5) {
                        // We have the latest version of the file, HTTP 304 status.
                        dropFromQueue = true;
                    }
                    else {
                        // Unknown error, let's remove the file from the queue to avoi locking down the queue.
                        dropFromQueue = true;
                    }
                }
                else {
                    dropFromQueue = true;
                }
                var errorMessage = null;
                // Some Android devices restrict the amount of usable storage using quotas.
                // If this quota would be exceeded by the download, it throws an exception.
                // We catch this exception here, and report a meaningful error message to the user.
                if (errorObject instanceof FileTransferError && errorObject.exception && errorObject.exception.includes('EDQUOT')) {
                    errorMessage = 'core.course.insufficientavailablequota';
                }
                if (dropFromQueue) {
                    _this.logger.debug('Item dropped from queue due to error: ' + fileUrl, errorObject);
                    return _this.removeFromQueue(siteId, fileId).catch(function () {
                        // Consider this as a silent error, never reject the promise here.
                    }).then(function () {
                        _this.treatQueueDeferred(siteId, fileId, false, errorMessage);
                        _this.notifyFileDownloadError(siteId, fileId, links);
                    });
                }
                else {
                    // We considered the file as legit but did not get it, failure.
                    _this.treatQueueDeferred(siteId, fileId, false, errorMessage);
                    _this.notifyFileDownloadError(siteId, fileId, links);
                    return Promise.reject(errorObject);
                }
            });
        });
    };
    /**
     * Remove a file from the queue.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @return Resolved on success. Rejected on failure. It is advised to silently ignore failures.
     */
    CoreFilepoolProvider.prototype.removeFromQueue = function (siteId, fileId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbReady];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.appDB.deleteRecords(this.QUEUE_TABLE, { siteId: siteId, fileId: fileId })];
                }
            });
        });
    };
    /**
     * Remove a file from the pool.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @return Resolved on success.
     */
    CoreFilepoolProvider.prototype.removeFileById = function (siteId, fileId) {
        var _this = this;
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            // Get the path to the file first since it relies on the file object stored in the pool.
            // Don't use getFilePath to prevent performing 2 DB requests.
            var path = _this.getFilepoolFolderPath(siteId) + '/' + fileId, fileUrl;
            return _this.hasFileInPool(siteId, fileId).then(function (entry) {
                fileUrl = entry.url;
                if (entry.extension) {
                    path += '.' + entry.extension;
                }
                return path;
            }).catch(function () {
                // If file not found, use the path without extension.
                return path;
            }).then(function (path) {
                var conditions = {
                    fileId: fileId
                };
                // Get links to components to notify them after remove.
                return _this.getFileLinks(siteId, fileId).then(function (links) {
                    var promises = [];
                    // Remove entry from filepool store.
                    promises.push(db.deleteRecords(_this.FILES_TABLE, conditions));
                    // Remove links.
                    promises.push(db.deleteRecords(_this.LINKS_TABLE, conditions));
                    // Remove the file.
                    if (_this.fileProvider.isAvailable()) {
                        promises.push(_this.fileProvider.removeFile(path).catch(function (error) {
                            if (error && error.code == 1) {
                                // Not found, ignore error since maybe it was deleted already.
                            }
                            else {
                                return Promise.reject(error);
                            }
                        }));
                    }
                    return Promise.all(promises).then(function () {
                        _this.notifyFileDeleted(siteId, fileId, links);
                        return _this.pluginFileDelegate.fileDeleted(fileUrl, path, siteId).catch(function (error) {
                            // Ignore errors.
                        });
                    });
                });
            });
        });
    };
    /**
     * Delete all the matching files from a component.
     *
     * @param siteId The site ID.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @return Resolved on success.
     */
    CoreFilepoolProvider.prototype.removeFilesByComponent = function (siteId, component, componentId) {
        var _this = this;
        return this.sitesProvider.getSiteDb(siteId).then(function (db) {
            return _this.getComponentFiles(db, component, componentId);
        }).then(function (items) {
            return Promise.all(items.map(function (item) {
                return _this.removeFileById(siteId, item.fileId);
            }));
        });
    };
    /**
     * Remove a file from the pool.
     *
     * @param siteId The site ID.
     * @param fileUrl The file URL.
     * @return Resolved on success, rejected on failure.
     */
    CoreFilepoolProvider.prototype.removeFileByUrl = function (siteId, fileUrl) {
        var _this = this;
        return this.fixPluginfileURL(siteId, fileUrl).then(function (file) {
            var fileId = _this.getFileIdByUrl(file.fileurl);
            return _this.removeFileById(siteId, fileId);
        });
    };
    /**
     * Removes the revision number from a file URL.
     *
     * @param url URL to remove the revision number.
     * @return URL without revision number.
     * @description
     * The revision is used to know if a file has changed. We remove it from the URL to prevent storing a file per revision.
     */
    CoreFilepoolProvider.prototype.removeRevisionFromUrl = function (url) {
        var args = this.getPluginFileArgs(url);
        if (!args) {
            // Not a pluginfile, no revision will be found.
            return url;
        }
        return this.pluginFileDelegate.removeRevisionFromUrl(url, args);
    };
    /**
     * Change the package status, setting it to the previous status.
     *
     * @param siteId Site ID.
     * @param component Package's component.
     * @param componentId An ID to use in conjunction with the component.
     * @return Promise resolved when the status is changed. Resolve param: new status.
     */
    CoreFilepoolProvider.prototype.setPackagePreviousStatus = function (siteId, component, componentId) {
        var _this = this;
        componentId = this.fixComponentId(componentId);
        this.logger.debug("Set previous status for package " + component + " " + componentId);
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var packageId = _this.getPackageId(component, componentId);
            // Get current stored data, we'll only update 'status' and 'updated' fields.
            return site.getDb().getRecord(_this.PACKAGES_TABLE, { id: packageId }).then(function (entry) {
                var newData = {};
                if (entry.status == CoreConstants.DOWNLOADING) {
                    // Going back from downloading to previous status, restore previous download time.
                    newData.downloadTime = entry.previousDownloadTime;
                }
                newData.status = entry.previous || CoreConstants.NOT_DOWNLOADED;
                newData.updated = Date.now();
                _this.logger.debug("Set previous status '" + entry.status + "' for package " + component + " " + componentId);
                return site.getDb().updateRecords(_this.PACKAGES_TABLE, newData, { id: packageId }).then(function () {
                    // Success updating, trigger event.
                    _this.triggerPackageStatusChanged(site.id, newData.status, component, componentId);
                    return newData.status;
                });
            });
        });
    };
    /**
     * Check if a file should be downloaded based on its size.
     *
     * @param size File size.
     * @return Whether file should be downloaded.
     */
    CoreFilepoolProvider.prototype.shouldDownload = function (size) {
        return size <= this.DOWNLOAD_THRESHOLD || (this.appProvider.isWifi() && size <= this.WIFI_DOWNLOAD_THRESHOLD);
    };
    /**
     * Convenience function to check if a file should be downloaded before opening it.
     *
     * @param url File online URL.
     * @param size File size.
     * @return Promise resolved if should download before open, rejected otherwise.
     * @description
     * Convenience function to check if a file should be downloaded before opening it.
     *
     * The default behaviour in the app is to download first and then open the local file in the following cases:
     *     - The file is small (less than DOWNLOAD_THRESHOLD).
     *     - The file cannot be streamed.
     * If the file is big and can be streamed, the promise returned by this function will be rejected.
     */
    CoreFilepoolProvider.prototype.shouldDownloadBeforeOpen = function (url, size) {
        if (size >= 0 && size <= this.DOWNLOAD_THRESHOLD) {
            // The file is small, download it.
            return Promise.resolve();
        }
        if (this.appProvider.isDesktop()) {
            // In desktop always download first.
            return Promise.resolve();
        }
        return this.utils.getMimeTypeFromUrl(url).then(function (mimetype) {
            // If the file is streaming (audio or video) we reject.
            if (mimetype.indexOf('video') != -1 || mimetype.indexOf('audio') != -1) {
                return Promise.reject(null);
            }
        });
    };
    /**
     * Store package status.
     *
     * @param siteId Site ID.
     * @param status New package status.
     * @param component Package's component.
     * @param componentId An ID to use in conjunction with the component.
     * @param extra Extra data to store for the package. If you want to store more than 1 value, use JSON.stringify.
     * @return Promise resolved when status is stored.
     */
    CoreFilepoolProvider.prototype.storePackageStatus = function (siteId, status, component, componentId, extra) {
        var _this = this;
        this.logger.debug("Set status '" + status + "' for package " + component + " " + componentId);
        componentId = this.fixComponentId(componentId);
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var packageId = _this.getPackageId(component, componentId);
            var downloadTime, previousDownloadTime;
            if (status == CoreConstants.DOWNLOADING) {
                // Set download time if package is now downloading.
                downloadTime = _this.timeUtils.timestamp();
            }
            // Search current status to set it as previous status.
            return site.getDb().getRecord(_this.PACKAGES_TABLE, { id: packageId }).then(function (entry) {
                if (typeof extra == 'undefined' || extra === null) {
                    extra = entry.extra;
                }
                if (typeof downloadTime == 'undefined') {
                    // Keep previous download time.
                    downloadTime = entry.downloadTime;
                    previousDownloadTime = entry.previousDownloadTime;
                }
                else {
                    // The downloadTime will be updated, store current time as previous.
                    previousDownloadTime = entry.downloadTime;
                }
                return entry.status;
            }).catch(function () {
                // No previous status.
            }).then(function (previousStatus) {
                var packageEntry = {
                    id: packageId,
                    component: component,
                    componentId: componentId,
                    status: status,
                    previous: previousStatus,
                    updated: Date.now(),
                    downloadTime: downloadTime,
                    previousDownloadTime: previousDownloadTime,
                    extra: extra
                };
                var promise;
                if (previousStatus === status) {
                    // The package already has this status, no need to change it.
                    promise = Promise.resolve();
                }
                else {
                    promise = site.getDb().insertRecord(_this.PACKAGES_TABLE, packageEntry);
                }
                return promise.then(function () {
                    // Success inserting, trigger event.
                    _this.triggerPackageStatusChanged(siteId, status, component, componentId);
                });
            });
        });
    };
    /**
     * Search for files in a CSS code and try to download them. Once downloaded, replace their URLs
     * and store the result in the CSS file.
     *
     * @param siteId Site ID.
     * @param fileUrl CSS file URL.
     * @param cssCode CSS code.
     * @param component The component to link the file to.
     * @param componentId An ID to use in conjunction with the component.
     * @param revision Revision to use in all files. If not defined, it will be calculated using the URL of each file.
     * @return Promise resolved with the CSS code.
     */
    CoreFilepoolProvider.prototype.treatCSSCode = function (siteId, fileUrl, cssCode, component, componentId, revision) {
        var _this = this;
        var urls = this.domUtils.extractUrlsFromCSS(cssCode), promises = [];
        var filePath, updated = false;
        // Get the path of the CSS file.
        promises.push(this.getFilePathByUrl(siteId, fileUrl).then(function (path) {
            filePath = path;
        }));
        urls.forEach(function (url) {
            // Download the file only if it's an online URL.
            if (!_this.urlUtils.isLocalFileUrl(url)) {
                promises.push(_this.downloadUrl(siteId, url, false, component, componentId, 0, undefined, undefined, undefined, revision).then(function (fileUrl) {
                    if (fileUrl != url) {
                        cssCode = cssCode.replace(new RegExp(_this.textUtils.escapeForRegex(url), 'g'), fileUrl);
                        updated = true;
                    }
                }).catch(function (error) {
                    // It shouldn't happen. Ignore errors.
                    _this.logger.warn('Error treating file ', url, error);
                }));
            }
        });
        return Promise.all(promises).then(function () {
            // All files downloaded. Store the result if it has changed.
            if (updated) {
                return _this.fileProvider.writeFile(filePath, cssCode);
            }
        }).then(function () {
            return cssCode;
        });
    };
    /**
     * Resolves or rejects a queue deferred and removes it from the list.
     *
     * @param siteId The site ID.
     * @param fileId The file ID.
     * @param resolve True if promise should be resolved, false if it should be rejected.
     * @param error String identifier for error message, if rejected.
     */
    CoreFilepoolProvider.prototype.treatQueueDeferred = function (siteId, fileId, resolve, error) {
        if (this.queueDeferreds[siteId] && this.queueDeferreds[siteId][fileId]) {
            if (resolve) {
                this.queueDeferreds[siteId][fileId].resolve();
            }
            else {
                this.queueDeferreds[siteId][fileId].reject(error);
            }
            delete this.queueDeferreds[siteId][fileId];
        }
    };
    /**
     * Trigger mmCoreEventPackageStatusChanged with the right data.
     *
     * @param siteId Site ID.
     * @param status New package status.
     * @param component Package's component.
     * @param componentId An ID to use in conjunction with the component.
     */
    CoreFilepoolProvider.prototype.triggerPackageStatusChanged = function (siteId, status, component, componentId) {
        var data = {
            component: component,
            componentId: this.fixComponentId(componentId),
            status: status
        };
        this.eventsProvider.trigger(CoreEventsProvider.PACKAGE_STATUS_CHANGED, data, siteId);
    };
    /**
     * Update the download time of a package. This doesn't modify the previous download time.
     * This function should be used if a package generates some new data during a download. Calling this function
     * right after generating the data in the download will prevent detecting this data as an update.
     *
     * @param siteId Site ID.
     * @param component Package's component.
     * @param componentId An ID to use in conjunction with the component.
     * @return Promise resolved when status is stored.
     */
    CoreFilepoolProvider.prototype.updatePackageDownloadTime = function (siteId, component, componentId) {
        var _this = this;
        componentId = this.fixComponentId(componentId);
        return this.sitesProvider.getSite(siteId).then(function (site) {
            var packageId = _this.getPackageId(component, componentId);
            return site.getDb().updateRecords(_this.PACKAGES_TABLE, { downloadTime: _this.timeUtils.timestamp() }, { id: packageId });
        });
    };
    CoreFilepoolProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CoreLoggerProvider,
            CoreAppProvider,
            CoreFileProvider,
            CoreSitesProvider,
            CoreWSProvider,
            CoreTextUtilsProvider,
            CoreUtilsProvider,
            CoreMimetypeUtilsProvider,
            CoreUrlUtilsProvider,
            CoreTimeUtilsProvider,
            CoreEventsProvider,
            CoreInitDelegate,
            Network,
            CorePluginFileDelegate,
            CoreDomUtilsProvider,
            NgZone])
    ], CoreFilepoolProvider);
    return CoreFilepoolProvider;
}());
export { CoreFilepoolProvider };
var CoreFilepool = /** @class */ (function (_super) {
    __extends(CoreFilepool, _super);
    function CoreFilepool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreFilepool;
}(makeSingleton(CoreFilepoolProvider)));
export { CoreFilepool };
//# sourceMappingURL=filepool.js.map