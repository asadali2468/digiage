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
import { Directive, Input, ElementRef } from '@angular/core';
import { CoreFileHelperProvider } from '@providers/file-helper';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
/**
 * Directive to allow downloading and open a file. When the item with this directive is clicked, the file will be
 * downloaded (if needed) and opened.
 */
var CoreDownloadFileDirective = /** @class */ (function () {
    function CoreDownloadFileDirective(element, domUtils, fileHelper) {
        this.domUtils = domUtils;
        this.fileHelper = fileHelper;
        this.element = element.nativeElement || element;
    }
    /**
     * Component being initialized.
     */
    CoreDownloadFileDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.element.addEventListener('click', function (ev) {
            if (!_this.file) {
                return;
            }
            ev.preventDefault();
            ev.stopPropagation();
            var modal = _this.domUtils.showModalLoading();
            _this.fileHelper.downloadAndOpenFile(_this.file, _this.component, _this.componentId).catch(function (error) {
                _this.domUtils.showErrorModalDefault(error, 'core.errordownloading', true);
            }).finally(function () {
                modal.dismiss();
            });
        });
    };
    __decorate([
        Input('core-download-file'),
        __metadata("design:type", Object)
    ], CoreDownloadFileDirective.prototype, "file", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CoreDownloadFileDirective.prototype, "component", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], CoreDownloadFileDirective.prototype, "componentId", void 0);
    CoreDownloadFileDirective = __decorate([
        Directive({
            selector: '[core-download-file]'
        }),
        __metadata("design:paramtypes", [ElementRef, CoreDomUtilsProvider, CoreFileHelperProvider])
    ], CoreDownloadFileDirective);
    return CoreDownloadFileDirective;
}());
export { CoreDownloadFileDirective };
//# sourceMappingURL=download-file.js.map