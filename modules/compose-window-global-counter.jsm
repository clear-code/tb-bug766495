/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ["ComposeWindowGlobalCounter"];

const Cu = Components.utils;
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.defineLazyModuleGetter(this,
                                  "prefs",
                                  "resource://tb-bug766495-modules/lib/prefs.js");

var _oldPurgeAsk, _oldPurgeThresholdMB;
var ComposeWindowGlobalCounter = {
  _counter: 0,
  init: function() {
    this.storeOldPrefs();
  },
  opened: function() {
    this._counter++;
  },
  get: function() {
    return this._counter;
  },
  closed: function() {
    this._counter--;
    this.restoreOldPrefs();
  },
  clear: function() {
    this._counter = 0;
  },
  storeOldPrefs: function() {
    _oldPurgeAsk = prefs.getPref("mail.purge.ask");
    _oldPurgeThresholdMB =  prefs.getPref("mail.purge_threshhold_mb");
    prefs.setPref("mail.purge.ask", true);
    prefs.setPref("mail.purge_threshhold_mb", 1000 * 1000);
  },
  restoreOldPrefs: function (){
    if (!this._counter > 0) {
      prefs.setPref("mail.purge.ask", _oldPurgeAsk);
      prefs.setPref("mail.purge_threshhold_mb", _oldPurgeThresholdMB);
    }
  }
};

ComposeWindowGlobalCounter.clear();
