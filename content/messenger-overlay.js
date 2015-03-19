/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (aGlobal) {
  var Ci = Components.interfaces;
  var Cc = Components.classes;

  var tbBug766495 = {
    collectAccounts: function() {
      var accountManager = MailServices.accounts;
      var allServers = accountManager.allServers;
      for (var i = 0,  maxi = allServers.length; i < maxi; ++i) {
        let currentServer = allServers.queryElementAt(i, Ci.nsIMsgIncomingServer);
        if (currentServer.type == "none")
          continue;

        var folderURI = currentServer.rootFolder.server.serverURI + "/" + "Drafts";
      }
    }
  };

  document.addEventListener("DOMContentLoaded", function onDOMContentLoaded(aEvent) {
    document.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
    tbBug766495.collectAccounts();
  });
  aGlobal.tbBug766495 = tbBug766495;
})(this);
