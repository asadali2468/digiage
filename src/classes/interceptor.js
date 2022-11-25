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
/**
 * Interceptor for Http calls. Adds the header 'Content-Type'='application/x-www-form-urlencoded'
 * and serializes the parameters if needed.
 */
var CoreInterceptor = /** @class */ (function () {
    function CoreInterceptor() {
        // Nothing to do.
    }
    CoreInterceptor_1 = CoreInterceptor;
    CoreInterceptor.prototype.intercept = function (req, next) {
        // Add the header and serialize the body if needed.
        var newReq = req.clone({
            headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded'),
            body: typeof req.body == 'object' && String(req.body) != '[object File]' ?
                CoreInterceptor_1.serialize(req.body) : req.body
        });
        // Pass on the cloned request instead of the original request.
        return next.handle(newReq);
    };
    /**
     * Serialize an object to be used in a request.
     *
     * @param obj Object to serialize.
     * @param addNull Add null values to the serialized as empty parameters.
     * @return Serialization of the object.
     */
    CoreInterceptor.serialize = function (obj, addNull) {
        var query = '', fullSubName, subValue, innerObj;
        for (var name_1 in obj) {
            var value = obj[name_1];
            if (value instanceof Array) {
                for (var i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name_1 + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += this.serialize(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (var subName in value) {
                    subValue = value[subName];
                    fullSubName = name_1 + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += this.serialize(innerObj) + '&';
                }
            }
            else if (addNull || (typeof value != 'undefined' && value !== null)) {
                query += encodeURIComponent(name_1) + '=' + encodeURIComponent(value) + '&';
            }
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    CoreInterceptor = CoreInterceptor_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], CoreInterceptor);
    return CoreInterceptor;
    var CoreInterceptor_1;
}());
export { CoreInterceptor };
//# sourceMappingURL=interceptor.js.map