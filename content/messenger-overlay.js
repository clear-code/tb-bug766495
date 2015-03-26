/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (aGlobal) {
  var Ci = Components.interfaces;
  var Cc = Components.classes;

  var tbBug766495 = {
    collectDraftFolders: function() {
      var accountManager = MailServices.accounts;
      var allServers = accountManager.allServers;
      for (var i = 0,  maxi = allServers.length; i < maxi; ++i) {
        let currentServer = allServers.queryElementAt(i, Ci.nsIMsgIncomingServer);
        if (currentServer.type == "none")
          continue;

        var folderURI = currentServer.rootFolder.server.serverURI + "/" + "Drafts";
        var rdf = Cc['@mozilla.org/rdf/rdf-service;1']
                    .getService(Ci.nsIRDFService);
        var folder = rdf.GetResource(folderURI).QueryInterface(Ci.nsIMsgFolder);
        if (currentServer.type == "pop3")

        if (currentServer.type == "imap") {
          var imapDraftFolder = folder.QueryInterface(Ci.nsIMsgImapMailFolder);
        }
      }
    },
    // nsIUrlListener
    createURLListenerForFolder: function createURLListenerForFolder() {
      return {
        OnStartRunningUrl: function OnStartRunningUrl(aURL) {
        },
        OnStopRunningUrl: function OnStopRunningUrl(aURL, aExitCode) {
          this.finished = true;
        },
        folder: aFolder,
        finished: false,
      };
    }
  };

  document.addEventListener("DOMContentLoaded", function onDOMContentLoaded(aEvent) {
    document.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
    tbBug766495.collectDraftFolders();
  });
  aGlobal.tbBug766495 = tbBug766495;
})(this);
