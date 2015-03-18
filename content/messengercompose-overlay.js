/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (aGlobal) {
  const Cu = Components.utils;
  Cu.import("resource://gre/modules/XPCOMUtils.jsm");
  XPCOMUtils.defineLazyModuleGetter(this,
                                    "prefs",
                                    "resource://tb-bug766495-modules/lib/prefs.js");
  XPCOMUtils.defineLazyModuleGetter(this,
                                    "ComposeWindowGlobalCounter",
                                    "resource://tb-bug766495-modules/compose-window-global-counter.jsm");
  var oldPurgeAsk, oldPurgeThresholdMB;
  var tbBug766495 = {
    init: function() {
      window.removeEventListener('DOMContentLoaded', this, false);
      window.addEventListener('unload', this, false);
      document.documentElement.addEventListener('compose-window-init', this, false);
      document.documentElement.addEventListener('compose-window-close', this, false);
    },
    destroy: function() {
      window.removeEventListener('unload', this, false);
      document.documentElement.removeEventListener('compose-window-init', this, false);
      document.documentElement.removeEventListener('compose-window-close', this, false);
      ComposeWindowGlobalCounter.closed();
      this.restorePref();
    },
    onActivated: function() {
      oldPurgeAsk = prefs.getPref("mail.purge.ask");
      oldPurgeThresholdMB = prefs.getPref("mail.purge_threshhold_mb");
      prefs.setPref("mail.purge.ask", true);
      prefs.setPref("mail.purge_threshhold_mb", 1000 * 1000);
      ComposeWindowGlobalCounter.opened();
    },
    onDeactivated: function() {
      ComposeWindowGlobalCounter.closed();
      this.restorePref();
    },
    isRemainingComposeWindow: function() {
      return ComposeWindowGlobalCounter.get() > 0;
    },
    restorePref: function() {
      if (!this.isRemainingComposeWindow()) {
        prefs.setPref("mail.purge.ask", oldPurgeAsk);
        prefs.setPref("mail.purge_threshhold_mb", oldPurgeThresholdMB);
      }
    },
    handleEvent: function(aEvent) {
      switch (aEvent.type) {
      case 'DOMContentLoaded':
        this.init();
        return;

      case 'unload':
        this.destroy();
        return;

      case 'compose-window-init':
        this.onActivated();
        break;

      case 'compose-window-close':
        this.onDeactivated();
        break;
      }
    }
  };
  window.addEventListener('DOMContentLoaded', tbBug766495, false);
  aGlobal.tbBug766495 = tbBug766495;
})(this);
