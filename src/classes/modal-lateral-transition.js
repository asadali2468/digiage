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
import { Animation } from 'ionic-angular/animations/animation';
import { PageTransition } from 'ionic-angular/transitions/page-transition';
/**
 * Sliding transition for lateral modals.
 */
var CoreModalLateralTransition = /** @class */ (function (_super) {
    __extends(CoreModalLateralTransition, _super);
    function CoreModalLateralTransition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Animation.
     */
    CoreModalLateralTransition.prototype.init = function () {
        var enteringView = this.enteringView;
        var leavingView = this.leavingView;
        var plt = this.plt;
        var OFF_RIGHT = plt.isRTL ? '-100%' : '100%';
        if (enteringView && enteringView.pageRef()) {
            var ele = enteringView.pageRef().nativeElement;
            var wrapper = new Animation(this.plt, ele.querySelector('.modal-wrapper'));
            var backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
            wrapper.beforeStyles({ transform: 'translateX(' + OFF_RIGHT + ')', opacity: 0.8 });
            wrapper.fromTo('transform', 'translateX(' + OFF_RIGHT + ')', 'translateX(0)');
            wrapper.fromTo('opacity', 0.8, 1);
            backdrop.fromTo('opacity', 0.01, 0.4);
            this
                .element(enteringView.pageRef())
                .duration(300)
                .easing('cubic-bezier(0.36,0.66,0.04,1)')
                .add(wrapper)
                .add(backdrop);
        }
        if (leavingView && leavingView.pageRef()) {
            var ele = this.leavingView.pageRef().nativeElement;
            var wrapper = new Animation(this.plt, ele.querySelector('.modal-wrapper'));
            var contentWrapper = new Animation(this.plt, ele.querySelector('.wrapper'));
            var backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
            wrapper.beforeStyles({ transform: 'translateX(0)', opacity: 1 });
            wrapper.fromTo('transform', 'translateX(0)', 'translateX(' + OFF_RIGHT + ')');
            wrapper.fromTo('opacity', 1, 0.8);
            contentWrapper.fromTo('opacity', 1, 0);
            backdrop.fromTo('opacity', 0.4, 0);
            this
                .element(leavingView.pageRef())
                .duration(300)
                .easing('cubic-bezier(0.36,0.66,0.04,1)')
                .add(contentWrapper)
                .add(wrapper)
                .add(backdrop);
        }
    };
    return CoreModalLateralTransition;
}(PageTransition));
export { CoreModalLateralTransition };
//# sourceMappingURL=modal-lateral-transition.js.map