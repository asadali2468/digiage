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
import { CoreTextUtils } from '@providers/utils/text';
/**
 * Singleton with helper functions for urls.
 */
var CoreUrl = /** @class */ (function () {
    // Avoid creating singleton instances.
    function CoreUrl() {
    }
    /**
     * Parse parts of a url, using an implicit protocol if it is missing from the url.
     *
     * @param url Url.
     * @return Url parts.
     */
    CoreUrl.parse = function (url) {
        // Parse url with regular expression taken from RFC 3986: https://tools.ietf.org/html/rfc3986#appendix-B.
        var match = url.trim().match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
        if (!match) {
            return null;
        }
        var host = match[4] || '';
        // Get the credentials and the port from the host.
        var _a = host.split('@').reverse(), domainAndPort = _a[0], credentials = _a[1];
        var _b = domainAndPort.split(':'), domain = _b[0], port = _b[1];
        var _c = credentials ? credentials.split(':') : [], username = _c[0], password = _c[1];
        // Prepare parts replacing empty strings with undefined.
        return {
            protocol: match[2] || undefined,
            domain: domain || undefined,
            port: port || undefined,
            credentials: credentials || undefined,
            username: username || undefined,
            password: password || undefined,
            path: match[5] || undefined,
            query: match[7] || undefined,
            fragment: match[9] || undefined,
        };
    };
    /**
     * Guess the Moodle domain from a site url.
     *
     * @param url Site url.
     * @return Guessed Moodle domain.
     */
    CoreUrl.guessMoodleDomain = function (url) {
        // Add protocol if it was missing. Moodle can only be served through http or https, so this is a fair assumption to make.
        if (!url.match(/^https?:\/\//)) {
            url = "https://" + url;
        }
        // Match using common suffixes.
        var knownSuffixes = [
            '\/my\/?',
            '\/\\\?redirect=0',
            '\/index\\\.php',
            '\/course\/view\\\.php',
            '\/login\/index\\\.php',
            '\/mod\/page\/view\\\.php',
        ];
        var match = url.match(new RegExp("^https?://(.*?)(" + knownSuffixes.join('|') + ")"));
        if (match) {
            return match[1];
        }
        // If nothing else worked, parse the domain.
        var urlParts = CoreUrl.parse(url);
        return urlParts && urlParts.domain ? urlParts.domain : null;
    };
    /**
     * Returns the pattern to check if the URL is a valid Moodle Url.
     *
     * @return {RegExp} Desired RegExp.
     */
    CoreUrl.getValidMoodleUrlPattern = function () {
        // Regular expression based on RFC 3986: https://tools.ietf.org/html/rfc3986#appendix-B.
        // Improved to not admit spaces.
        return new RegExp(/^(([^:/?# ]+):)?(\/\/([^/?# ]*))?([^?# ]*)(\?([^#]*))?(#(.*))?$/);
    };
    /**
     * Check if the given url is valid for the app to connect.
     *
     * @param  {string}  url Url to check.
     * @return {boolean}     True if valid, false otherwise.
     */
    CoreUrl.isValidMoodleUrl = function (url) {
        var patt = CoreUrl.getValidMoodleUrlPattern();
        return patt.test(url.trim());
    };
    /**
     * Removes protocol from the url.
     *
     * @param url Site url.
     * @return Url without protocol.
     */
    CoreUrl.removeProtocol = function (url) {
        return url.replace(/^[a-zA-Z]+:\/\//i, '');
    };
    /**
     * Check if two URLs have the same domain and path.
     *
     * @param urlA First URL.
     * @param urlB Second URL.
     * @return Whether they have same domain and path.
     */
    CoreUrl.sameDomainAndPath = function (urlA, urlB) {
        // Add protocol if missing, the parse function requires it.
        if (!urlA.match(/^[^\/:\.\?]*:\/\//)) {
            urlA = "https://" + urlA;
        }
        if (!urlB.match(/^[^\/:\.\?]*:\/\//)) {
            urlB = "https://" + urlB;
        }
        var partsA = CoreUrl.parse(urlA);
        var partsB = CoreUrl.parse(urlB);
        return partsA.domain == partsB.domain &&
            CoreTextUtils.instance.removeEndingSlash(partsA.path) == CoreTextUtils.instance.removeEndingSlash(partsB.path);
    };
    return CoreUrl;
}());
export { CoreUrl };
//# sourceMappingURL=url.js.map