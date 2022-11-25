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
import { CoreFileHelper } from '@providers/file-helper';
import { CoreSites } from '@providers/sites';
import { CoreUrlUtils } from '@providers/utils/url';
import { CoreUtils } from '@providers/utils/utils';
import { CoreContentLinksHelper } from '@core/contentlinks/providers/helper';
/**
 * Singleton with helper functions for windows.
 */
var CoreWindow = /** @class */ (function () {
    function CoreWindow() {
    }
    /**
     * "Safe" implementation of window.open. It will open the URL without overriding the app.
     *
     * @param url URL to open.
     * @param name Name of the browsing context into which to load the URL.
     * @param options Other options.
     * @return Promise resolved when done.
     */
    CoreWindow.open = function (url, name, options) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, error_1, treated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!CoreUrlUtils.instance.isLocalFileUrl(url)) return [3 /*break*/, 6];
                        filename = url.substr(url.lastIndexOf('/') + 1);
                        if (!!CoreFileHelper.instance.isOpenableInApp({ filename: filename })) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, CoreFileHelper.instance.showConfirmOpenUnsupportedFile()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/]; // Cancelled, stop.
                    case 4: return [4 /*yield*/, CoreUtils.instance.openFile(url)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 6:
                        treated = void 0;
                        options = options || {};
                        if (!(name != '_system')) return [3 /*break*/, 8];
                        return [4 /*yield*/, CoreContentLinksHelper.instance.handleLink(url, undefined, options.navCtrl, true, true)];
                    case 7:
                        // Check if it can be opened in the app.
                        treated = _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!!treated) return [3 /*break*/, 11];
                        if (!!CoreSites.instance.isLoggedIn()) return [3 /*break*/, 9];
                        // Not logged in, cannot auto-login.
                        CoreUtils.instance.openInBrowser(url);
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, CoreSites.instance.getCurrentSite().openInBrowserWithAutoLoginIfSameSite(url)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return CoreWindow;
}());
export { CoreWindow };
//# sourceMappingURL=window.js.map