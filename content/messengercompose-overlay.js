/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (aGlobal) {
  const Cu = Components.utils;
  Cu.import("resource://gre/modules/XPCOMUtils.jsm");
  XPCOMUtils.defineLazyModuleGetter(this,
                                  "prefs",
                                  "resource://tb-bug766495-modules/lib/prefs.js");
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
    },
    activateComposeWindow: function() {
    },
    deactivateComposeWindow: function() {
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
        this.activateComposeWindow();
        break;

      case 'compose-window-close':
        this.deactivateComposeWindow();
        break;
      }
    }
  };
  window.addEventListener('DOMContentLoaded', tbBug766495, false);
  aGlobal.tbBug766495 = tbBug766495;
})(this);
