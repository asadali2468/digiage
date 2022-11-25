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
import { isPresent } from 'ionic-angular/util/util';
import { PageTransition } from 'ionic-angular/transitions/page-transition';
var DURATION = 500;
var EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
var OPACITY = 'opacity';
var TRANSFORM = 'transform';
var TRANSLATEX = 'translateX';
var CENTER = '0%';
var OFF_OPACITY = 0.8;
var SHOW_BACK_BTN_CSS = 'show-back-button';
/**
 * This class overrides the default transition to avoid glitches with new tabs and split view.
 * Is based on IOSTransition class but it has some changes:
 *  - The animation is done to the full page not header, footer and content separetely.
 *  - On the Navbar only the back button is animated (title and other buttons will be done as a whole). Otherwise back button won't
 *  appear.
 */
var CorePageTransition = /** @class */ (function (_super) {
    __extends(CorePageTransition, _super);
    function CorePageTransition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CorePageTransition.prototype.init = function () {
        _super.prototype.init.call(this);
        var plt = this.plt;
        var OFF_RIGHT = plt.isRTL ? '-99.5%' : '99.5%';
        var OFF_LEFT = plt.isRTL ? '33%' : '-33%';
        var enteringView = this.enteringView;
        var leavingView = this.leavingView;
        var opts = this.opts;
        this.duration(isPresent(opts.duration) ? opts.duration : DURATION);
        this.easing(isPresent(opts.easing) ? opts.easing : EASING);
        var backDirection = (opts.direction === 'back');
        var enteringHasNavbar = (enteringView && enteringView.hasNavbar());
        var leavingHasNavbar = (leavingView && leavingView.hasNavbar());
        if (enteringView) {
            // Get the native element for the entering page.
            var enteringPageEle = enteringView.pageRef().nativeElement;
            // Entering content.
            var enteringContent = new Animation(plt, enteringPageEle);
            this.add(enteringContent);
            if (backDirection) {
                // Entering content, back direction.
                enteringContent
                    .fromTo(TRANSLATEX, OFF_LEFT, CENTER, true)
                    .fromTo(OPACITY, OFF_OPACITY, 1, true);
            }
            else {
                // Entering content, forward direction.
                enteringContent
                    .beforeClearStyles([OPACITY])
                    .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
            }
            if (enteringHasNavbar) {
                // Entering page has a navbar.
                var enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');
                var enteringNavBar = new Animation(plt, enteringNavbarEle);
                this.add(enteringNavBar);
                var enteringBackButton = new Animation(plt, enteringNavbarEle.querySelector('.back-button'));
                enteringNavBar
                    .add(enteringBackButton);
                // Set properties depending on direction.
                if (backDirection) {
                    // Entering navbar, back direction.
                    if (enteringView.enableBack()) {
                        // Back direction, entering page has a back button.
                        enteringBackButton
                            .beforeAddClass(SHOW_BACK_BTN_CSS)
                            .fromTo(OPACITY, 0.01, 1, true);
                    }
                }
                else {
                    // Entering navbar, forward direction.
                    if (enteringView.enableBack()) {
                        // Forward direction, entering page has a back button.
                        enteringBackButton
                            .beforeAddClass(SHOW_BACK_BTN_CSS)
                            .fromTo(OPACITY, 0.01, 1, true);
                        var enteringBackBtnText = new Animation(plt, enteringNavbarEle.querySelector('.back-button-text'));
                        enteringBackBtnText.fromTo(TRANSLATEX, (plt.isRTL ? '-100px' : '100px'), '0px');
                        enteringNavBar.add(enteringBackBtnText);
                    }
                    else {
                        enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
                    }
                }
            }
        }
        // Setup leaving view.
        if (leavingView && leavingView.pageRef()) {
            // Leaving content.
            var leavingPageEle = leavingView.pageRef().nativeElement;
            var leavingContent = new Animation(plt, leavingPageEle);
            this.add(leavingContent);
            if (backDirection) {
                // Leaving content, back direction.
                leavingContent
                    .beforeClearStyles([OPACITY])
                    .fromTo(TRANSLATEX, CENTER, (plt.isRTL ? '-100%' : '100%'));
            }
            else {
                // Leaving content, forward direction.
                leavingContent
                    .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
                    .fromTo(OPACITY, 1, OFF_OPACITY)
                    .afterClearStyles([TRANSFORM, OPACITY]);
            }
            if (leavingHasNavbar) {
                // Leaving page has a navbar.
                var leavingNavbarEle = leavingPageEle.querySelector('ion-navbar');
                var leavingNavBar = new Animation(plt, leavingNavbarEle);
                var leavingBackButton = new Animation(plt, leavingNavbarEle.querySelector('.back-button'));
                leavingNavBar
                    .add(leavingBackButton);
                this.add(leavingNavBar);
                // Fade out leaving navbar items.
                leavingBackButton.fromTo(OPACITY, 0.99, 0);
                if (backDirection) {
                    var leavingBackBtnText = new Animation(plt, leavingNavbarEle.querySelector('.back-button-text'));
                    leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (plt.isRTL ? -300 : 300) + 'px');
                    leavingNavBar.add(leavingBackBtnText);
                }
                else {
                    // Leaving navbar, forward direction.
                    leavingBackButton.afterClearStyles([OPACITY]);
                }
            }
        }
    };
    return CorePageTransition;
}(PageTransition));
export { CorePageTransition };
//# sourceMappingURL=page-transition.js.map