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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Directive, Input, ElementRef, Optional } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreUtilsProvider } from '@providers/utils/utils';
/**
 * Directive to auto focus an element when a view is loaded.
 *
 * You can apply it conditionallity assigning it a boolean value: <ion-input [core-auto-focus]="{{showKeyboard}}">
 */
var CoreAutoFocusDirective = /** @class */ (function () {
    function CoreAutoFocusDirective(element, domUtils, utils, navCtrl) {
        this.domUtils = domUtils;
        this.utils = utils;
        this.navCtrl = navCtrl;
        this.coreAutoFocus = true;
        this.element = element.nativeElement || element;
    }
    /**
     * Component being initialized.
     */
    CoreAutoFocusDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (this.navCtrl.isTransitioning()) {
            // Navigating to a new page. Wait for the transition to be over.
            var subscription_1 = this.navCtrl.viewDidEnter.subscribe(function () {
                _this.autoFocus();
                subscription_1.unsubscribe();
            });
        }
        else {
            this.autoFocus();
        }
    };
    /**
     * Function after the view is initialized.
     */
    CoreAutoFocusDirective.prototype.autoFocus = function () {
        var _this = this;
        var autoFocus = this.utils.isTrueOrOne(this.coreAutoFocus);
        if (autoFocus) {
            // Wait a bit to make sure the view is loaded.
            setTimeout(function () {
                // If it's a ion-input or ion-textarea, search the right input to use.
                var element = _this.element;
                if (_this.element.tagName == 'ION-INPUT') {
                    element = _this.element.querySelector('input') || element;
                }
                else if (_this.element.tagName == 'ION-TEXTAREA') {
                    element = _this.element.querySelector('textarea') || element;
                }
                _this.domUtils.focusElement(element);
            }, 200);
        }
    };
    __decorate([
        Input('core-auto-focus'),
        __metadata("design:type", Object)
    ], CoreAutoFocusDirective.prototype, "coreAutoFocus", void 0);
    CoreAutoFocusDirective = __decorate([
        Directive({
            selector: '[core-auto-focus]'
        }),
        __param(3, Optional()),
        __metadata("design:paramtypes", [ElementRef, CoreDomUtilsProvider, CoreUtilsProvider,
            NavController])
    ], CoreAutoFocusDirective);
    return CoreAutoFocusDirective;
}());
export { CoreAutoFocusDirective };
//# sourceMappingURL=auto-focus.js.map