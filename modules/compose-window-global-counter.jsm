/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ["ComposeWindowGlobalCounter"];

const Cu = Components.utils;
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.defineLazyModuleGetter(this,
                                  "prefs",
                                  "resource://tb-bug766495-modules/lib/prefs.js");

const kPrefix = "extensions.tb-bug766495@clear-code.com.";
const kAskPurge = "mail.purge.ask";
const kPurgeThreshold = "mail.purge_threshhold_mb";
var ComposeWindowGlobalCounter = {
  _counter: 0,
  opened: function() {
    this._counter++;
    this.deactivateAutoCompaction();
  },
  closed: function() {
    this._counter--;
    this.activateAutoCompaction();
  },
  clear: function() {
    this._counter = 0;
  },
  existsBackupPrefs: function() {
    return !(prefs.getPref(kPrefix + kAskPurge) === null
             && prefs.getPref(kPrefix + kPurgeThreshold) === null);
  },
  deactivateAutoCompaction: function() {
    if (this.existsBackupPrefs() || this._counter <= 0)
      return;

    var _oldPurgeAsk = prefs.getPref(kAskPurge);
    var _oldPurgeThresholdMB = prefs.getPref(kPurgeThreshold);
    prefs.setPref(kPrefix + kAskPurge, _oldPurgeAsk);
    prefs.setPref(kPrefix + kPurgeThreshold, _oldPurgeThresholdMB);
    prefs.setPref(kAskPurge, true);
    prefs.setPref(kPurgeThreshold, 1000 * 1000);
  },
  activateAutoCompaction: function (){
    if (!this.existsBackupPrefs() || this._counter > 0)
      return;

    var _oldPurgeAsk = prefs.getPref(kPrefix + kAskPurge);
    var _oldPurgeThresholdMB = prefs.getPref(kPrefix + kPurgeThreshold);
    prefs.setPref(kAskPurge, _oldPurgeAsk);
    prefs.setPref(kPurgeThreshold, _oldPurgeThresholdMB);
  }
};

ComposeWindowGlobalCounter.clear();
