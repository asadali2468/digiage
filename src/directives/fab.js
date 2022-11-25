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
import { Directive, ElementRef } from '@angular/core';
import { Content } from 'ionic-angular';
/**
 * Directive to move ion-fab components as direct children of the nearest ion-content.
 *
 * Example usage:
 *
 * <ion-fab core-fab>
 */
var CoreFabDirective = /** @class */ (function () {
    function CoreFabDirective(el, content) {
        this.content = content;
        this.element = el.nativeElement;
    }
    /**
     * Initialize Component.
     */
    CoreFabDirective.prototype.ngOnInit = function () {
        if (this.content) {
            this.content.getNativeElement().classList.add('has-fab');
            this.content.getFixedElement().appendChild(this.element);
        }
    };
    /**
     * Destroy component.
     */
    CoreFabDirective.prototype.ngOnDestroy = function () {
        if (this.content) {
            this.content.getNativeElement().classList.remove('has-fab');
        }
    };
    CoreFabDirective = __decorate([
        Directive({
            selector: 'ion-fab[core-fab]'
        }),
        __metadata("design:paramtypes", [ElementRef, Content])
    ], CoreFabDirective);
    return CoreFabDirective;
}());
export { CoreFabDirective };
//# sourceMappingURL=fab.js.map