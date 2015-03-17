/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (aGlobal) {

  var tbBug766495 = {
    init: function() {
      window.removeEventListener('load', this, false);
      window.addEventListener('unload', this, false);
      window.addEventListener('select', this, true);
      dump("init\n")
    },
    destroy: function() {
      window.removeEventListener('unload', this, false);
      window.removeEventListener('select', this, true);
      dump("destroy\n")
    },

    handleEvent: function(aEvent) {
      switch (aEvent.type) {
      case 'load':
        this.init();
        return;

      case 'unload':
        this.destroy();
        return;
      }
    }
  };
  window.addEventListener('load', tbBug766495, false);
  document.addEventListener("DOMContentLoaded", function(aEvent) {
    dump("poyo\n")
  });
  aGlobal.tbBug766495 = tbBug766495;
})(this);
