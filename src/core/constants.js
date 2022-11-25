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
/**
 * Static class to contain all the core constants.
 */
var CoreConstants = /** @class */ (function () {
    function CoreConstants() {
    }
    CoreConstants.SECONDS_YEAR = 31536000;
    CoreConstants.SECONDS_WEEK = 604800;
    CoreConstants.SECONDS_DAY = 86400;
    CoreConstants.SECONDS_HOUR = 3600;
    CoreConstants.SECONDS_MINUTE = 60;
    CoreConstants.WIFI_DOWNLOAD_THRESHOLD = 104857600; // 100MB.
    CoreConstants.DOWNLOAD_THRESHOLD = 10485760; // 10MB.
    CoreConstants.MINIMUM_FREE_SPACE = 10485760; // 10MB.
    CoreConstants.IOS_FREE_SPACE_THRESHOLD = 524288000; // 500MB.
    CoreConstants.DONT_SHOW_ERROR = 'CoreDontShowError';
    CoreConstants.NO_SITE_ID = 'NoSite';
    // Settings constants.
    CoreConstants.SETTINGS_RICH_TEXT_EDITOR = 'CoreSettingsRichTextEditor';
    CoreConstants.SETTINGS_NOTIFICATION_SOUND = 'CoreSettingsNotificationSound';
    CoreConstants.SETTINGS_SYNC_ONLY_ON_WIFI = 'CoreSettingsSyncOnlyOnWifi';
    CoreConstants.SETTINGS_DEBUG_DISPLAY = 'CoreSettingsDebugDisplay';
    CoreConstants.SETTINGS_REPORT_IN_BACKGROUND = 'CoreSettingsReportInBackground'; // @deprecated since 3.5.0
    CoreConstants.SETTINGS_SEND_ON_ENTER = 'CoreSettingsSendOnEnter';
    CoreConstants.SETTINGS_FONT_SIZE = 'CoreSettingsFontSize';
    CoreConstants.SETTINGS_COLOR_SCHEME = 'CoreSettingsColorScheme';
    CoreConstants.SETTINGS_ANALYTICS_ENABLED = 'CoreSettingsAnalyticsEnabled';
    // WS constants.
    CoreConstants.WS_TIMEOUT = 30000; // Timeout when not in WiFi.
    CoreConstants.WS_TIMEOUT_WIFI = 30000; // Timeout when in WiFi.
    CoreConstants.WS_PREFIX = 'local_mobile_';
    // Login constants.
    CoreConstants.LOGIN_SSO_CODE = 2; // SSO in browser window is required.
    CoreConstants.LOGIN_SSO_INAPP_CODE = 3; // SSO in embedded browser is required.
    CoreConstants.LOGIN_LAUNCH_DATA = 'CoreLoginLaunchData';
    // Download status constants.
    CoreConstants.DOWNLOADED = 'downloaded';
    CoreConstants.DOWNLOADING = 'downloading';
    CoreConstants.NOT_DOWNLOADED = 'notdownloaded';
    CoreConstants.OUTDATED = 'outdated';
    CoreConstants.NOT_DOWNLOADABLE = 'notdownloadable';
    // Constants from Moodle's resourcelib.
    CoreConstants.RESOURCELIB_DISPLAY_AUTO = 0; // Try the best way.
    CoreConstants.RESOURCELIB_DISPLAY_EMBED = 1; // Display using object tag.
    CoreConstants.RESOURCELIB_DISPLAY_FRAME = 2; // Display inside frame.
    CoreConstants.RESOURCELIB_DISPLAY_NEW = 3; // Display normal link in new window.
    CoreConstants.RESOURCELIB_DISPLAY_DOWNLOAD = 4; // Force download of file instead of display.
    CoreConstants.RESOURCELIB_DISPLAY_OPEN = 5; // Open directly.
    CoreConstants.RESOURCELIB_DISPLAY_POPUP = 6; // Open in "emulated" pop-up without navigation.
    // Feature constants. Used to report features that are, or are not, supported by a module.
    CoreConstants.FEATURE_GRADE_HAS_GRADE = 'grade_has_grade'; // True if module can provide a grade.
    CoreConstants.FEATURE_GRADE_OUTCOMES = 'outcomes'; // True if module supports outcomes.
    CoreConstants.FEATURE_ADVANCED_GRADING = 'grade_advanced_grading'; // True if module supports advanced grading methods.
    CoreConstants.FEATURE_CONTROLS_GRADE_VISIBILITY = 'controlsgradevisbility'; // True if module controls grade visibility over gradebook.
    CoreConstants.FEATURE_PLAGIARISM = 'plagiarism'; // True if module supports plagiarism plugins.
    CoreConstants.FEATURE_COMPLETION_TRACKS_VIEWS = 'completion_tracks_views'; // True if module tracks whether somebody viewed it.
    CoreConstants.FEATURE_COMPLETION_HAS_RULES = 'completion_has_rules'; // True if module has custom completion rules.
    CoreConstants.FEATURE_NO_VIEW_LINK = 'viewlink'; // True if module has no 'view' page (like label).
    CoreConstants.FEATURE_IDNUMBER = 'idnumber'; // True if module wants support for setting the ID number for grade calculation purposes.
    CoreConstants.FEATURE_GROUPS = 'groups'; // True if module supports groups.
    CoreConstants.FEATURE_GROUPINGS = 'groupings'; // True if module supports groupings.
    CoreConstants.FEATURE_MOD_ARCHETYPE = 'mod_archetype'; // Type of module.
    CoreConstants.FEATURE_MOD_INTRO = 'mod_intro'; // True if module supports intro editor.
    CoreConstants.FEATURE_MODEDIT_DEFAULT_COMPLETION = 'modedit_default_completion'; // True if module has default completion.
    CoreConstants.FEATURE_COMMENT = 'comment';
    CoreConstants.FEATURE_RATE = 'rate';
    CoreConstants.FEATURE_BACKUP_MOODLE2 = 'backup_moodle2'; // True if module supports backup/restore of moodle2 format.
    CoreConstants.FEATURE_SHOW_DESCRIPTION = 'showdescription'; // True if module can show description on course main page.
    CoreConstants.FEATURE_USES_QUESTIONS = 'usesquestions'; // True if module uses the question bank.
    // Pssobile archetypes for modules.
    CoreConstants.MOD_ARCHETYPE_OTHER = 0; // Unspecified module archetype.
    CoreConstants.MOD_ARCHETYPE_RESOURCE = 1; // Resource-like type module.
    CoreConstants.MOD_ARCHETYPE_ASSIGNMENT = 2; // Assignment module archetype.
    CoreConstants.MOD_ARCHETYPE_SYSTEM = 3; // System (not user-addable) module archetype.
    return CoreConstants;
}());
export { CoreConstants };
//# sourceMappingURL=constants.js.map