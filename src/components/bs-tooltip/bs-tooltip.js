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
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
/**
 * Component to display a Bootstrap Tooltip in a popover.
 */
var CoreBSTooltipComponent = /** @class */ (function () {
    function CoreBSTooltipComponent(navParams) {
        this.content = navParams.get('content') || '';
        this.html = !!navParams.get('html');
    }
    CoreBSTooltipComponent = __decorate([
        Component({
            selector: 'core-bs-tooltip',
            templateUrl: 'core-bs-tooltip.html'
        }),
        __metadata("design:paramtypes", [NavParams])
    ], CoreBSTooltipComponent);
    return CoreBSTooltipComponent;
}());
export { CoreBSTooltipComponent };
//# sourceMappingURL=bs-tooltip.js.map