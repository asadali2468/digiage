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
// tslint:disable: variable-name
var CoreConfigConstants = /** @class */ (function () {
    function CoreConfigConstants() {
    }
    CoreConfigConstants.app_id = 'com.digiage.pro';
    CoreConfigConstants.appname = 'DIGIAGE';
    CoreConfigConstants.desktopappname = 'DIGIAGE Desktop';
    CoreConfigConstants.versioncode = 3940;
    CoreConfigConstants.versionname = '3.9.4';
    CoreConfigConstants.cache_update_frequency_usually = 420000;
    CoreConfigConstants.cache_update_frequency_often = 1200000;
    CoreConfigConstants.cache_update_frequency_sometimes = 3600000;
    CoreConfigConstants.cache_update_frequency_rarely = 43200000;
    CoreConfigConstants.default_lang = 'en';
    CoreConfigConstants.languages = {
        'ar': 'عربي',
        'bg': 'Български',
        'ca': 'Català',
        'cs': 'Čeština',
        'da': 'Dansk',
        'de': 'Deutsch',
        'de-du': 'Deutsch - Du',
        'el': 'Ελληνικά',
        'en': 'English',
        'en-us': 'English - United States',
        'es': 'Español',
        'es-mx': 'Español - México',
        'eu': 'Euskara',
        'fa': 'فارسی',
        'fi': 'Suomi',
        'fr': 'Français',
        'gl': 'Galego',
        'he': 'עברית',
        'hi': 'हिंदी',
        'hr': 'Hrvatski',
        'hu': 'magyar',
        'hy': 'Հայերեն',
        'id': 'Indonesian',
        'it': 'Italiano',
        'ja': '日本語',
        'km': 'ខ្មែរ',
        'kn': 'ಕನ್ನಡ',
        'ko': '한국어',
        'lt': 'Lietuvių',
        'lv': 'Latviešu',
        'mn': 'Монгол',
        'mr': 'मराठी',
        'nl': 'Nederlands',
        'no': 'Norsk - bokmål',
        'pl': 'Polski',
        'pt': 'Português - Portugal',
        'pt-br': 'Português - Brasil',
        'ro': 'Română',
        'ru': 'Русский',
        'sl': 'Slovenščina',
        'sr-cr': 'Српски',
        'sr-lt': 'Srpski',
        'sv': 'Svenska',
        'tg': 'Тоҷикӣ',
        'tr': 'Türkçe',
        'uk': 'Українська',
        'uz': 'O\'zbekcha',
        'vi': 'Vietnamese',
        'zh-cn': '简体中文',
        'zh-tw': '正體中文',
    };
    CoreConfigConstants.wsservice = 'moodle_mobile_app';
    CoreConfigConstants.wsextservice = 'local_mobile';
    CoreConfigConstants.demo_sites = {
        student: {
            url: 'https://school.moodledemo.net',
            username: 'student',
            password: 'moodle',
        },
        teacher: {
            url: 'https://school.moodledemo.net',
            username: 'teacher',
            password: 'moodle',
        },
    };
    CoreConfigConstants.font_sizes = [
        62.5,
        75.89,
        93.75,
    ];
    CoreConfigConstants.customurlscheme = 'moodlemobile';
    CoreConfigConstants.siteurl = 'https://digiage.pro/versity';
    CoreConfigConstants.sitename = 'DIGIAGE';
    CoreConfigConstants.presets = {
        url: 'https://digiage.pro/versity',
        username: '',
    };
    CoreConfigConstants.multisitesdisplay = '';
    CoreConfigConstants.sitefindersettings = {};
    CoreConfigConstants.onlyallowlistedsites = false;
    CoreConfigConstants.skipssoconfirmation = false;
    CoreConfigConstants.forcedefaultlanguage = false;
    CoreConfigConstants.privacypolicy = 'https://moodle.net/moodle-app-privacy/';
    CoreConfigConstants.notificoncolor = '#0283E5';
    CoreConfigConstants.statusbarbg = false;
    CoreConfigConstants.statusbarlighttext = false;
    CoreConfigConstants.statusbarbgios = '#0283E5';
    CoreConfigConstants.statusbarlighttextios = true;
    CoreConfigConstants.statusbarbgandroid = '#0283E5';
    CoreConfigConstants.statusbarlighttextandroid = true;
    CoreConfigConstants.statusbarbgremotetheme = '#0283E5';
    CoreConfigConstants.statusbarlighttextremotetheme = true;
    CoreConfigConstants.enableanalytics = false;
    CoreConfigConstants.enableonboarding = true;
    CoreConfigConstants.forceColorScheme = '';
    CoreConfigConstants.forceLoginLogo = false;
    CoreConfigConstants.ioswebviewscheme = 'moodleappfs';
    CoreConfigConstants.appstores = {
        android: 'com.digiage.pro',
        ios: 'id633359593',
        windows: 'moodle-desktop/9p9bwvhdc8c8',
        mac: 'id1255924440',
        linux: 'https://download.moodle.org/desktop/download.php?platform=linux&arch=64',
    };
    CoreConfigConstants.compilationtime = 1668100788111;
    CoreConfigConstants.lastcommit = '399eed4c1961aba9bfc90c5988e256e478749105';
    return CoreConfigConstants;
}());
export { CoreConfigConstants };
//# sourceMappingURL=configconstants.js.map