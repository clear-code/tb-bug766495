/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ["AutoCompactionController"];

const Cu = Components.utils;
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.defineLazyModuleGetter(this,
                                  "prefs",
                                  "resource://tb-bug766495-modules/lib/prefs.js");

const kPrefix = "extensions.tb-bug766495@clear-code.com.";
const kAskPurge = "mail.purge.ask";
const kPurgeThreshold = "mail.purge_threshhold_mb";
var AutoCompactionController = {
  _counter: 0,
  _draftCount: 0,
  setDraftCount: function(aCount) {
    this._draftCount = aCount;
    if (aCount <= 0) {
      this.activateAutoCompaction();
    }
    else {
      this.deactivateAutoCompaction();
    }
  },
  composeWindowOpened: function() {
    this._counter++;
    this.deactivateAutoCompaction();
  },
  composeWindowClosed: function() {
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
    if (this.existsBackupPrefs())
      return;

    if (this._draftCount <= 0 && this._counter <= 0)
      return;

    var _oldPurgeAsk = prefs.getPref(kAskPurge);
    var _oldPurgeThresholdMB = prefs.getPref(kPurgeThreshold);
    prefs.setPref(kPrefix + kAskPurge, _oldPurgeAsk);
    prefs.setPref(kPrefix + kPurgeThreshold, _oldPurgeThresholdMB);
    prefs.setPref(kAskPurge, true);
    prefs.setPref(kPurgeThreshold, 1000 * 1000);
  },
  activateAutoCompaction: function() {
    if (!this.existsBackupPrefs())
      return;

    if (this._draftCount > 0 || this._counter > 0)
      return;

    var _oldPurgeAsk = prefs.getPref(kPrefix + kAskPurge);
    var _oldPurgeThresholdMB = prefs.getPref(kPrefix + kPurgeThreshold);
    prefs.setPref(kAskPurge, _oldPurgeAsk);
    prefs.setPref(kPurgeThreshold, _oldPurgeThresholdMB);
    prefs.clearPref(kPrefix + kAskPurge);
    prefs.clearPref(kPrefix + kPurgeThreshold);
  }
};

AutoCompactionController.clear();
