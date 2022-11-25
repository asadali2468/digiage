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
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { FileTransfer } from '@ionic-native/file-transfer';
import { CoreAppProvider } from './app';
import { CoreFileProvider } from './file';
import { CoreLoggerProvider } from './logger';
import { CoreMimetypeUtilsProvider } from './utils/mimetype';
import { CoreTextUtilsProvider } from './utils/text';
import { CoreConstants } from '@core/constants';
import { Md5 } from 'ts-md5/dist/md5';
import { CoreInterceptor } from '@classes/interceptor';
import { makeSingleton } from '@singletons/core.singletons';
import { CoreNativeToAngularHttpResponse } from '@classes/native-to-angular-http';
/**
 * This service allows performing WS calls and download/upload files.
 */
var CoreWSProvider = /** @class */ (function () {
    function CoreWSProvider(http, translate, appProvider, textUtils, fileProvider, fileTransfer, mimeUtils, logger, platform) {
        var _this = this;
        this.http = http;
        this.translate = translate;
        this.appProvider = appProvider;
        this.textUtils = textUtils;
        this.fileProvider = fileProvider;
        this.fileTransfer = fileTransfer;
        this.mimeUtils = mimeUtils;
        this.mimeTypeCache = {}; // A "cache" to store file mimetypes to prevent performing too many HEAD requests.
        this.ongoingCalls = {};
        this.retryCalls = [];
        this.retryTimeout = 0;
        this.logger = logger.getInstance('CoreWSProvider');
        platform.ready().then(function () {
            if (_this.appProvider.isIOS()) {
                cordova.plugin.http.setHeader('User-Agent', navigator.userAgent);
            }
        });
    }
    /**
     * Adds the call data to an special queue to be processed when retrying.
     *
     * @param method The WebService method to be called.
     * @param siteUrl Complete site url to perform the call.
     * @param ajaxData Arguments to pass to the method.
     * @param preSets Extra settings and information.
     * @return Deferred promise resolved with the response data in success and rejected with the error message
     *         if it fails.
     */
    CoreWSProvider.prototype.addToRetryQueue = function (method, siteUrl, ajaxData, preSets) {
        var call = {
            method: method,
            siteUrl: siteUrl,
            ajaxData: ajaxData,
            preSets: preSets,
            deferred: {}
        };
        call.deferred.promise = new Promise(function (resolve, reject) {
            call.deferred.resolve = resolve;
            call.deferred.reject = reject;
        });
        this.retryCalls.push(call);
        return call.deferred.promise;
    };
    /**
     * A wrapper function for a moodle WebService call.
     *
     * @param method The WebService method to be called.
     * @param data Arguments to pass to the method. It's recommended to call convertValuesToString before passing the data.
     * @param preSets Extra settings and information.
     * @return Promise resolved with the response data in success and rejected if it fails.
     */
    CoreWSProvider.prototype.call = function (method, data, preSets) {
        var siteUrl;
        if (!preSets) {
            return Promise.reject(this.createFakeWSError('core.unexpectederror', true));
        }
        else if (!this.appProvider.isOnline()) {
            return Promise.reject(this.createFakeWSError('core.networkerrormsg', true));
        }
        preSets.typeExpected = preSets.typeExpected || 'object';
        if (typeof preSets.responseExpected == 'undefined') {
            preSets.responseExpected = true;
        }
        data = Object.assign({}, data); // Create a new object so the changes don't affect the original data.
        data.wsfunction = method;
        data.wstoken = preSets.wsToken;
        siteUrl = preSets.siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json';
        // There are some ongoing retry calls, wait for timeout.
        if (this.retryCalls.length > 0) {
            this.logger.warn('Calls locked, trying later...');
            return this.addToRetryQueue(method, siteUrl, data, preSets);
        }
        else {
            return this.performPost(method, siteUrl, data, preSets);
        }
    };
    /**
     * Call a Moodle WS using the AJAX API. Please use it if the WS layer is not an option.
     * It uses a cache to prevent duplicate requests.
     *
     * @param method The WebService method to be called.
     * @param data Arguments to pass to the method.
     * @param preSets Extra settings and information. Only some
     * @return Promise resolved with the response data in success and rejected with an object containing:
     *         - error: Error message.
     *         - errorcode: Error code returned by the site (if any).
     *         - available: 0 if unknown, 1 if available, -1 if not available.
     */
    CoreWSProvider.prototype.callAjax = function (method, data, preSets) {
        var cacheParams = {
            methodname: method,
            args: data,
        };
        var promise = this.getPromiseHttp('ajax', preSets.siteUrl, cacheParams);
        if (!promise) {
            promise = this.performAjax(method, data, preSets);
            promise = this.setPromiseHttp(promise, 'ajax', preSets.siteUrl, cacheParams);
        }
        return promise;
    };
    /**
     * Converts an objects values to strings where appropriate.
     * Arrays (associative or otherwise) will be maintained, null values will be removed.
     *
     * @param data The data that needs all the non-object values set to strings.
     * @param stripUnicode If Unicode long chars need to be stripped.
     * @return The cleaned object or null if some strings becomes empty after stripping Unicode.
     */
    CoreWSProvider.prototype.convertValuesToString = function (data, stripUnicode) {
        var result = Array.isArray(data) ? [] : {};
        for (var key in data) {
            var value = data[key];
            if (value == null) {
                // Skip null or undefined value.
                continue;
            }
            else if (typeof value == 'object') {
                // Object or array.
                value = this.convertValuesToString(value, stripUnicode);
                if (value == null) {
                    return null;
                }
            }
            else if (typeof value == 'string') {
                if (stripUnicode) {
                    var stripped = this.textUtils.stripUnicode(value);
                    if (stripped != value && stripped.trim().length == 0) {
                        return null;
                    }
                    value = stripped;
                }
            }
            else if (typeof value == 'boolean') {
                /* Moodle does not allow "true" or "false" in WS parameters, only in POST parameters.
                   We've been using "true" and "false" for WS settings "filter" and "fileurl",
                   we keep it this way to avoid changing cache keys. */
                if (key == 'moodlewssettingfilter' || key == 'moodlewssettingfileurl') {
                    value = value ? 'true' : 'false';
                }
                else {
                    value = value ? '1' : '0';
                }
            }
            else if (typeof value == 'number') {
                value = String(value);
            }
            else {
                // Unknown type.
                continue;
            }
            if (Array.isArray(result)) {
                result.push(value);
            }
            else {
                result[key] = value;
            }
        }
        return result;
    };
    /**
     * Create a "fake" WS error for local errors.
     *
     * @param message The message to include in the error.
     * @param needsTranslate If the message needs to be translated.
     * @param translateParams Translation params, if needed.
     * @return Fake WS error.
     */
    CoreWSProvider.prototype.createFakeWSError = function (message, needsTranslate, translateParams) {
        if (needsTranslate) {
            message = this.translate.instant(message, translateParams);
        }
        return {
            message: message
        };
    };
    /**
     * Downloads a file from Moodle using Cordova File API.
     *
     * @param url Download url.
     * @param path Local path to store the file.
     * @param addExtension True if extension need to be added to the final path.
     * @param onProgress Function to call on progress.
     * @return Promise resolved with the downloaded file.
     */
    CoreWSProvider.prototype.downloadFile = function (url, path, addExtension, onProgress) {
        var _this = this;
        this.logger.debug('Downloading file', url, path, addExtension);
        if (!this.appProvider.isOnline()) {
            return Promise.reject(this.translate.instant('core.networkerrormsg'));
        }
        // Use a tmp path to download the file and then move it to final location.
        // This is because if the download fails, the local file is deleted.
        var tmpPath = path + '.tmp';
        // Create the tmp file as an empty file.
        return this.fileProvider.createFile(tmpPath).then(function (fileEntry) {
            var transfer = _this.fileTransfer.create();
            transfer.onProgress(onProgress);
            return transfer.download(url, fileEntry.toURL(), true).then(function () {
                var promise;
                if (addExtension) {
                    var ext_1 = _this.mimeUtils.getFileExtension(path);
                    // Google Drive extensions will be considered invalid since Moodle usually converts them.
                    if (!ext_1 || ext_1 == 'gdoc' || ext_1 == 'gsheet' || ext_1 == 'gslides' || ext_1 == 'gdraw' || ext_1 == 'php') {
                        // Not valid, get the file's mimetype.
                        promise = _this.getRemoteFileMimeType(url).then(function (mime) {
                            if (mime) {
                                var remoteExt = _this.mimeUtils.getExtension(mime, url);
                                // If the file is from Google Drive, ignore mimetype application/json.
                                if (remoteExt && (!ext_1 || mime != 'application/json')) {
                                    if (ext_1) {
                                        // Remove existing extension since we will use another one.
                                        path = _this.mimeUtils.removeExtension(path);
                                    }
                                    path += '.' + remoteExt;
                                    return remoteExt;
                                }
                            }
                            return ext_1;
                        });
                    }
                    else {
                        promise = Promise.resolve(ext_1);
                    }
                }
                else {
                    promise = Promise.resolve('');
                }
                return promise.then(function (extension) {
                    return _this.fileProvider.moveFile(tmpPath, path).then(function (movedEntry) {
                        // Save the extension.
                        movedEntry.extension = extension;
                        movedEntry.path = path;
                        _this.logger.debug("Success downloading file " + url + " to " + path + " with extension " + extension);
                        return movedEntry;
                    });
                });
            });
        }).catch(function (err) {
            _this.logger.error("Error downloading " + url + " to " + path, err);
            return Promise.reject(err);
        });
    };
    /**
     * Get a promise from the cache.
     *
     * @param method Method of the HTTP request.
     * @param url Base URL of the HTTP request.
     * @param params Params of the HTTP request.
     */
    CoreWSProvider.prototype.getPromiseHttp = function (method, url, params) {
        var queueItemId = this.getQueueItemId(method, url, params);
        if (typeof this.ongoingCalls[queueItemId] != 'undefined') {
            return this.ongoingCalls[queueItemId];
        }
        return false;
    };
    /**
     * Perform a HEAD request to get the mimetype of a remote file.
     *
     * @param url File URL.
     * @param ignoreCache True to ignore cache, false otherwise.
     * @return Promise resolved with the mimetype or '' if failure.
     */
    CoreWSProvider.prototype.getRemoteFileMimeType = function (url, ignoreCache) {
        var _this = this;
        if (this.mimeTypeCache[url] && !ignoreCache) {
            return Promise.resolve(this.mimeTypeCache[url]);
        }
        return this.performHead(url).then(function (response) {
            var mimeType = response.headers.get('Content-Type');
            if (mimeType) {
                // Remove "parameters" like charset.
                mimeType = mimeType.split(';')[0];
            }
            _this.mimeTypeCache[url] = mimeType;
            return mimeType || '';
        }).catch(function () {
            // Error, resolve with empty mimetype.
            return '';
        });
    };
    /**
     * Perform a HEAD request to get the size of a remote file.
     *
     * @param url File URL.
     * @return Promise resolved with the size or -1 if failure.
     */
    CoreWSProvider.prototype.getRemoteFileSize = function (url) {
        return this.performHead(url).then(function (response) {
            var size = parseInt(response.headers.get('Content-Length'), 10);
            if (size) {
                return size;
            }
            return -1;
        }).catch(function () {
            // Error, return -1.
            return -1;
        });
    };
    /**
     * Get a request timeout based on the network connection.
     *
     * @return Timeout in ms.
     */
    CoreWSProvider.prototype.getRequestTimeout = function () {
        return this.appProvider.isNetworkAccessLimited() ? CoreConstants.WS_TIMEOUT : CoreConstants.WS_TIMEOUT_WIFI;
    };
    /**
     * Get the unique queue item id of the cache for a HTTP request.
     *
     * @param method Method of the HTTP request.
     * @param url Base URL of the HTTP request.
     * @param params Params of the HTTP request.
     * @return Queue item ID.
     */
    CoreWSProvider.prototype.getQueueItemId = function (method, url, params) {
        if (params) {
            url += '###' + CoreInterceptor.serialize(params);
        }
        return method + '#' + Md5.hashAsciiStr(url);
    };
    /**
     * Call a Moodle WS using the AJAX API.
     *
     * @param method The WebService method to be called.
     * @param data Arguments to pass to the method.
     * @param preSets Extra settings and information. Only some
     * @return Promise resolved with the response data in success and rejected with an object containing:
     *         - error: Error message.
     *         - errorcode: Error code returned by the site (if any).
     *         - available: 0 if unknown, 1 if available, -1 if not available.
     */
    CoreWSProvider.prototype.performAjax = function (method, data, preSets) {
        var _this = this;
        var promise;
        if (typeof preSets.siteUrl == 'undefined') {
            return rejectWithError(this.createFakeWSError('core.unexpectederror', true));
        }
        else if (!this.appProvider.isOnline()) {
            return rejectWithError(this.createFakeWSError('core.networkerrormsg', true));
        }
        if (typeof preSets.responseExpected == 'undefined') {
            preSets.responseExpected = true;
        }
        var script = preSets.noLogin ? 'service-nologin.php' : 'service.php';
        var ajaxData = [{
                index: 0,
                methodname: method,
                args: this.convertValuesToString(data)
            }];
        // The info= parameter has no function. It is just to help with debugging.
        // We call it info to match the parameter name use by Moodle's AMD ajax module.
        var siteUrl = preSets.siteUrl + '/lib/ajax/' + script + '?info=' + method;
        if (preSets.noLogin && preSets.useGet) {
            // Send params using GET.
            siteUrl += '&args=' + encodeURIComponent(JSON.stringify(ajaxData));
            promise = this.sendHTTPRequest(siteUrl, {
                method: 'get',
            });
        }
        else {
            promise = this.sendHTTPRequest(siteUrl, {
                method: 'post',
                data: ajaxData,
                serializer: 'json',
            });
        }
        return promise.then(function (response) {
            var data = response.body;
            // Some moodle web services return null.
            // If the responseExpected value is set then so long as no data is returned, we create a blank object.
            if (!data && !preSets.responseExpected) {
                data = [{}];
            }
            // Check if error. Ajax layer should always return an object (if error) or an array (if success).
            if (!data || typeof data != 'object') {
                return rejectWithError(_this.createFakeWSError('core.serverconnection', true));
            }
            else if (data.error) {
                return rejectWithError(data);
            }
            // Get the first response since only one request was done.
            data = data[0];
            if (data.error) {
                return rejectWithError(data.exception);
            }
            return data.data;
        }, function (data) {
            var available = data.status == 404 ? -1 : 0;
            return rejectWithError(_this.createFakeWSError('core.serverconnection', true), available);
        });
        // Convenience function to return an error.
        function rejectWithError(exception, available) {
            if (typeof available == 'undefined') {
                if (exception.errorcode) {
                    available = exception.errorcode == 'invalidrecord' ? -1 : 1;
                }
                else {
                    available = 0;
                }
            }
            exception.available = available;
            return Promise.reject(exception);
        }
    };
    /**
     * Perform a HEAD request and save the promise while waiting to be resolved.
     *
     * @param url URL to perform the request.
     * @return Promise resolved with the response.
     */
    CoreWSProvider.prototype.performHead = function (url) {
        var promise = this.getPromiseHttp('head', url);
        if (!promise) {
            promise = this.sendHTTPRequest(url, {
                method: 'head',
                responseType: 'text',
            });
            promise = this.setPromiseHttp(promise, 'head', url);
        }
        return promise;
    };
    /**
     * Perform the post call. It can be split into several requests.
     *
     * @param method The WebService method to be called.
     * @param siteUrl Complete site url to perform the call.
     * @param ajaxData Arguments to pass to the method.
     * @param preSets Extra settings and information.
     * @return Promise resolved with the response data in success and rejected with CoreWSError if it fails.
     */
    CoreWSProvider.prototype.performPost = function (method, siteUrl, ajaxData, preSets) {
        var _this = this;
        var options = {};
        // This is done because some returned values like 0 are treated as null if responseType is json.
        if (preSets.typeExpected == 'number' || preSets.typeExpected == 'boolean' || preSets.typeExpected == 'string') {
            // Avalaible values are: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
            options['responseType'] = 'text';
        }
        if (!preSets.splitRequest || !ajaxData[preSets.splitRequest.param]) {
            return this.performSinglePost(method, siteUrl, ajaxData, preSets, options);
        }
        // Split the request into several requests if needed.
        var promises = [];
        for (var i = 0; i < ajaxData[preSets.splitRequest.param].length; i += preSets.splitRequest.maxLength) {
            // Limit the array sent.
            var limitedData = Object.assign({}, ajaxData);
            limitedData[preSets.splitRequest.param] =
                ajaxData[preSets.splitRequest.param].slice(i, i + preSets.splitRequest.maxLength);
            promises.push(this.performSinglePost(method, siteUrl, limitedData, preSets, options));
        }
        return Promise.all(promises).then(function (results) {
            // Combine the results.
            var firstResult = results.shift();
            if (preSets.splitRequest.combineCallback) {
                return results.reduce(preSets.splitRequest.combineCallback, firstResult);
            }
            return results.reduce(_this.combineObjectsArrays, firstResult);
        });
    };
    /**
     * Combine the arrays of two objects.
     *
     * @param object1 First object.
     * @param object2 Second object.
     * @return Combined object.
     */
    CoreWSProvider.prototype.combineObjectsArrays = function (object1, object2) {
        for (var name_1 in object2) {
            if (Array.isArray(object2[name_1])) {
                object1[name_1] = object1[name_1].concat(object2[name_1]);
            }
        }
        return object1;
    };
    /**
     * Perform a single post request.
     *
     * @param method The WebService method to be called.
     * @param siteUrl Complete site url to perform the call.
     * @param ajaxData Arguments to pass to the method.
     * @param preSets Extra settings and information.
     * @param options Request options.
     * @return Promise resolved with the response data in success and rejected with CoreWSError if it fails.
     */
    CoreWSProvider.prototype.performSinglePost = function (method, siteUrl, ajaxData, preSets, options) {
        var _this = this;
        // We add the method name to the URL purely to help with debugging.
        // This duplicates what is in the ajaxData, but that does no harm.
        // POST variables take precedence over GET.
        var requestUrl = siteUrl + '&wsfunction=' + method;
        // Perform the post request.
        var promise = this.http.post(requestUrl, ajaxData, options).timeout(this.getRequestTimeout()).toPromise();
        return promise.then(function (data) {
            // Some moodle web services return null.
            // If the responseExpected value is set to false, we create a blank object if the response is null.
            if (!data && !preSets.responseExpected) {
                data = {};
            }
            if (!data) {
                return Promise.reject(_this.createFakeWSError('core.serverconnection', true));
            }
            else if (typeof data != preSets.typeExpected) {
                // If responseType is text an string will be returned, parse before returning.
                if (typeof data == 'string') {
                    if (preSets.typeExpected == 'number') {
                        data = Number(data);
                        if (isNaN(data)) {
                            _this.logger.warn("Response expected type \"" + preSets.typeExpected + "\" cannot be parsed to number");
                            return Promise.reject(_this.createFakeWSError('core.errorinvalidresponse', true));
                        }
                    }
                    else if (preSets.typeExpected == 'boolean') {
                        if (data === 'true') {
                            data = true;
                        }
                        else if (data === 'false') {
                            data = false;
                        }
                        else {
                            _this.logger.warn("Response expected type \"" + preSets.typeExpected + "\" is not true or false");
                            return Promise.reject(_this.createFakeWSError('core.errorinvalidresponse', true));
                        }
                    }
                    else {
                        _this.logger.warn('Response of type "' + typeof data + ("\" received, expecting \"" + preSets.typeExpected + "\""));
                        return Promise.reject(_this.createFakeWSError('core.errorinvalidresponse', true));
                    }
                }
                else {
                    _this.logger.warn('Response of type "' + typeof data + ("\" received, expecting \"" + preSets.typeExpected + "\""));
                    return Promise.reject(_this.createFakeWSError('core.errorinvalidresponse', true));
                }
            }
            if (typeof data.exception !== 'undefined') {
                // Special debugging for site plugins, otherwise it's hard to debug errors if the data is cached.
                if (method == 'tool_mobile_get_content') {
                    _this.logger.error('Error calling WS', method, data);
                }
                return Promise.reject(data);
            }
            if (typeof data.debuginfo != 'undefined') {
                return Promise.reject(_this.createFakeWSError('Error. ' + data.message));
            }
            return data;
        }, function (error) {
            // If server has heavy load, retry after some seconds.
            if (error.status == 429) {
                var retryPromise = _this.addToRetryQueue(method, siteUrl, ajaxData, preSets);
                // Only process the queue one time.
                if (_this.retryTimeout == 0) {
                    _this.retryTimeout = parseInt(error.headers.get('Retry-After'), 10) || 5;
                    _this.logger.warn(error.statusText + ". Retrying in " + _this.retryTimeout + " seconds. " +
                        (_this.retryCalls.length + " calls left."));
                    setTimeout(function () {
                        _this.logger.warn("Retrying now with " + _this.retryCalls.length + " calls to process.");
                        // Finish timeout.
                        _this.retryTimeout = 0;
                        _this.processRetryQueue();
                    }, _this.retryTimeout * 1000);
                }
                else {
                    _this.logger.warn('Calls locked, trying later...');
                }
                return retryPromise;
            }
            return Promise.reject(_this.createFakeWSError('core.serverconnection', true));
        });
    };
    /**
     * Retry all requests in the queue.
     * This function uses recursion in order to add a delay between requests to reduce stress.
     */
    CoreWSProvider.prototype.processRetryQueue = function () {
        var _this = this;
        if (this.retryCalls.length > 0 && this.retryTimeout == 0) {
            var call_1 = this.retryCalls.shift();
            // Add a delay between calls.
            setTimeout(function () {
                call_1.deferred.resolve(_this.performPost(call_1.method, call_1.siteUrl, call_1.ajaxData, call_1.preSets));
                _this.processRetryQueue();
            }, 200);
        }
        else {
            this.logger.warn("Retry queue has stopped with " + this.retryCalls.length + " calls and " + this.retryTimeout + " timeout secs.");
        }
    };
    /**
     * Save promise on the cache.
     *
     * @param promise Promise to be saved.
     * @param method Method of the HTTP request.
     * @param url Base URL of the HTTP request.
     * @param params Params of the HTTP request.
     * @return The promise saved.
     */
    CoreWSProvider.prototype.setPromiseHttp = function (promise, method, url, params) {
        var _this = this;
        var queueItemId = this.getQueueItemId(method, url, params);
        var timeout;
        this.ongoingCalls[queueItemId] = promise;
        // HTTP not finished, but we should delete the promise after timeout.
        timeout = setTimeout(function () {
            delete _this.ongoingCalls[queueItemId];
        }, this.getRequestTimeout());
        // HTTP finished, delete from ongoing.
        return promise.finally(function () {
            delete _this.ongoingCalls[queueItemId];
            clearTimeout(timeout);
        });
    };
    /**
     * A wrapper function for a synchronous Moodle WebService call.
     * Warning: This function should only be used if synchronous is a must. It's recommended to use call.
     *
     * @param method The WebService method to be called.
     * @param data Arguments to pass to the method.
     * @param preSets Extra settings and information.
     * @return Promise resolved with the response data in success and rejected with the error message if it fails.
     * @return Request response. If the request fails, returns an object with 'error'=true and 'message' properties.
     */
    CoreWSProvider.prototype.syncCall = function (method, data, preSets) {
        var errorResponse = {
            error: true,
            message: ''
        };
        var siteUrl, xhr;
        if (!preSets) {
            errorResponse.message = this.translate.instant('core.unexpectederror');
            return errorResponse;
        }
        else if (!this.appProvider.isOnline()) {
            errorResponse.message = this.translate.instant('core.networkerrormsg');
            return errorResponse;
        }
        preSets.typeExpected = preSets.typeExpected || 'object';
        if (typeof preSets.responseExpected == 'undefined') {
            preSets.responseExpected = true;
        }
        data = this.convertValuesToString(data || {}, preSets.cleanUnicode);
        if (data == null) {
            // Empty cleaned text found.
            errorResponse.message = this.translate.instant('core.unicodenotsupportedcleanerror');
            return errorResponse;
        }
        data.wsfunction = method;
        data.wstoken = preSets.wsToken;
        siteUrl = preSets.siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json';
        // Serialize data.
        data = CoreInterceptor.serialize(data);
        // Perform sync request using XMLHttpRequest.
        xhr = new window.XMLHttpRequest();
        xhr.open('post', siteUrl, false);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhr.send(data);
        // Get response.
        data = ('response' in xhr) ? xhr.response : xhr.responseText;
        // Check status.
        var status = Math.max(xhr.status === 1223 ? 204 : xhr.status, 0);
        if (status < 200 || status >= 300) {
            // Request failed.
            errorResponse.message = data;
            return errorResponse;
        }
        // Treat response.
        data = this.textUtils.parseJSON(data);
        // Some moodle web services return null.
        // If the responseExpected value is set then so long as no data is returned, we create a blank object.
        if ((!data || !data.data) && !preSets.responseExpected) {
            data = {};
        }
        if (!data) {
            errorResponse.message = this.translate.instant('core.serverconnection');
        }
        else if (typeof data != preSets.typeExpected) {
            this.logger.warn('Response of type "' + typeof data + '" received, expecting "' + preSets.typeExpected + '"');
            errorResponse.message = this.translate.instant('core.errorinvalidresponse');
        }
        if (typeof data.exception != 'undefined' || typeof data.debuginfo != 'undefined') {
            errorResponse.message = data.message;
        }
        if (errorResponse.message !== '') {
            return errorResponse;
        }
        return data;
    };
    /*
     * Uploads a file.
     *
     * @param filePath File path.
     * @param options File upload options.
     * @param preSets Must contain siteUrl and wsToken.
     * @param onProgress Function to call on progress.
     * @return Promise resolved when uploaded.
     */
    CoreWSProvider.prototype.uploadFile = function (filePath, options, preSets, onProgress) {
        var _this = this;
        this.logger.debug("Trying to upload file: " + filePath);
        if (!filePath || !options || !preSets) {
            return Promise.reject(null);
        }
        if (!this.appProvider.isOnline()) {
            return Promise.reject(this.translate.instant('core.networkerrormsg'));
        }
        var uploadUrl = preSets.siteUrl + '/webservice/upload.php', transfer = this.fileTransfer.create();
        transfer.onProgress(onProgress);
        options.httpMethod = 'POST';
        options.params = {
            token: preSets.wsToken,
            filearea: options.fileArea || 'draft',
            itemid: options.itemId || 0
        };
        options.chunkedMode = false;
        options.headers = {
            Connection: 'close'
        };
        return transfer.upload(filePath, uploadUrl, options, true).then(function (success) {
            var data = _this.textUtils.parseJSON(success.response, null, _this.logger.error.bind(_this.logger, 'Error parsing response from upload', success.response));
            if (data === null) {
                return Promise.reject(_this.translate.instant('core.errorinvalidresponse'));
            }
            if (!data) {
                return Promise.reject(_this.translate.instant('core.serverconnection'));
            }
            else if (typeof data != 'object') {
                _this.logger.warn('Upload file: Response of type "' + typeof data + '" received, expecting "object"');
                return Promise.reject(_this.translate.instant('core.errorinvalidresponse'));
            }
            if (typeof data.exception !== 'undefined') {
                return Promise.reject(data.message);
            }
            else if (data && typeof data.error !== 'undefined') {
                return Promise.reject(data.error);
            }
            else if (data[0] && typeof data[0].error !== 'undefined') {
                return Promise.reject(data[0].error);
            }
            // We uploaded only 1 file, so we only return the first file returned.
            _this.logger.debug('Successfully uploaded file', filePath);
            return data[0];
        }).catch(function (error) {
            _this.logger.error('Error while uploading file', filePath, error);
            return Promise.reject(_this.translate.instant('core.errorinvalidresponse'));
        });
    };
    /**
     * Perform an HTTP request requesting for a text response.
     *
     * @param  url Url to get.
     * @return Resolved with the text when done.
     */
    CoreWSProvider.prototype.getText = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var options, response, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: 'get',
                            responseType: 'text',
                        };
                        return [4 /*yield*/, this.sendHTTPRequest(url, options)];
                    case 1:
                        response = _a.sent();
                        content = response.body;
                        if (typeof content !== 'string') {
                            throw 'Error reading content';
                        }
                        return [2 /*return*/, content];
                }
            });
        });
    };
    /**
     * Send an HTTP request. In mobile devices it will use the cordova plugin.
     *
     * @param url URL of the request.
     * @param options Options for the request.
     * @return Promise resolved with the response.
     */
    CoreWSProvider.prototype.sendHTTPRequest = function (url, options) {
        return __awaiter(this, void 0, void 0, function () {
            var format, content, observable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Set default values.
                        options.responseType = options.responseType || 'json';
                        options.timeout = typeof options.timeout == 'undefined' ? this.getRequestTimeout() : options.timeout;
                        if (!this.appProvider.isIOS()) return [3 /*break*/, 3];
                        if (!(url.indexOf('file://') === 0)) return [3 /*break*/, 2];
                        format = options.responseType == 'json' ? CoreFileProvider.FORMATJSON : CoreFileProvider.FORMATTEXT;
                        return [4 /*yield*/, this.fileProvider.readFile(url, format)];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, new HttpResponse({
                                body: content,
                                headers: null,
                                status: 200,
                                statusText: 'OK',
                                url: url
                            })];
                    case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                            // We cannot use Ionic Native plugin because it doesn't have the sendRequest method.
                            cordova.plugin.http.sendRequest(url, options, function (response) {
                                resolve(new CoreNativeToAngularHttpResponse(response));
                            }, reject);
                        })];
                    case 3:
                        observable = void 0;
                        // Use Angular's library.
                        switch (options.method) {
                            case 'get':
                                observable = this.http.get(url, {
                                    headers: options.headers,
                                    params: options.params,
                                    observe: 'response',
                                    responseType: options.responseType,
                                });
                                break;
                            case 'post':
                                if (options.serializer == 'json') {
                                    options.data = JSON.stringify(options.data);
                                }
                                observable = this.http.post(url, options.data, {
                                    headers: options.headers,
                                    observe: 'response',
                                    responseType: options.responseType,
                                });
                                break;
                            case 'head':
                                observable = this.http.head(url, {
                                    headers: options.headers,
                                    observe: 'response',
                                    responseType: options.responseType
                                });
                                break;
                            default:
                                return [2 /*return*/, Promise.reject('Method not implemented yet.')];
                        }
                        if (options.timeout) {
                            observable = observable.timeout(options.timeout);
                        }
                        return [2 /*return*/, observable.toPromise()];
                }
            });
        });
    };
    CoreWSProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            TranslateService,
            CoreAppProvider,
            CoreTextUtilsProvider,
            CoreFileProvider,
            FileTransfer,
            CoreMimetypeUtilsProvider,
            CoreLoggerProvider,
            Platform])
    ], CoreWSProvider);
    return CoreWSProvider;
}());
export { CoreWSProvider };
var CoreWS = /** @class */ (function (_super) {
    __extends(CoreWS, _super);
    function CoreWS() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoreWS;
}(makeSingleton(CoreWSProvider)));
export { CoreWS };
//# sourceMappingURL=ws.js.map