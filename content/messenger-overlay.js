/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (aGlobal) {
  var Ci = Components.interfaces;
  var Cc = Components.classes;
  const Cu = Components.utils;
  var { Promise } = Cu.import("resource://gre/modules/Promise.jsm", {});
  Cu.import("resource://gre/modules/XPCOMUtils.jsm");
  XPCOMUtils.defineLazyModuleGetter(this,
                                    "AutoCompactionController",
                                    "resource://tb-bug766495-modules/auto-compaction-controller.jsm");

  var tbBug766495 = {
    collectDraftFolders: function() {
      return new Promise((function(aResolve, aReject) {
        var accountManager = MailServices.accounts;
        var allServers = accountManager.allServers;
        var folders = [];
        var expectedFoldersCount = 0;
        for (var i = 0,  maxi = allServers.length; i < maxi; ++i) {
          let currentServer = allServers.queryElementAt(i, Ci.nsIMsgIncomingServer);
          if (currentServer.type == "none")
            continue;

          var folderURI = currentServer.rootFolder.server.serverURI + "/" + "Drafts";
          var rdf = Cc['@mozilla.org/rdf/rdf-service;1']
                .getService(Ci.nsIRDFService);
          var folder = rdf.GetResource(folderURI).QueryInterface(Ci.nsIMsgFolder);
          expectedFoldersCount++;
          this.ensureUpdated(folder).then(function(aFolder) {
            folders.push(aFolder);
            if (folders.length >= expectedFoldersCount) {
              aResolve(folders);
            }
          });
        }
        if (expectedFoldersCount == 0) {
          aResolve(folders);
        }
      }).bind(this));
    },
    ensureUpdated: function(aFolder) {
      if (aFolder instanceof Ci.nsIMsgImapMailFolder) {
        return new Promise((function(aResolve, aReject) {
          var listener = this.createURLListenerForFolder(function() {
            aResolve(aFolder);
          });
          var imapDraftFolder = aFolder.QueryInterface(Ci.nsIMsgImapMailFolder);
          aFolder.updateFolderWithListener(msgWindow, listener);
        }).bind(this));
      } else {
        return Promise.resolve(aFolder);
      }
    },
    // nsIUrlListener
    createURLListenerForFolder: function createURLListenerForFolder(aCallBack) {
      return {
        OnStartRunningUrl: function OnStartRunningUrl(aURL) {
        },
        OnStopRunningUrl: function OnStopRunningUrl(aURL, aExitCode) {
          aCallBack();
        },
      };
    },
    get folderMessageActions()
    {
      return Ci.nsIMsgFolderNotificationService.msgAdded |
             Ci.nsIMsgFolderNotificationService.msgDeleted;
    },
    // nsIMsgFolderListener
    createLisnerForDraftFolder: function  createLisnerForDraftFolder() {
      return {
        msgAdded: function msgAdded(aFolder) {},
        msgsDeleted: function msgsDeleted(aFolder) {},
      };
    }
  };

  document.addEventListener("DOMContentLoaded", function onDOMContentLoaded(aEvent) {
    document.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
    tbBug766495.collectDraftFolders().then(function(aFolders) {
      var draftMessagesCount = 0;
      aFolders.forEach(function(aFolder) {
        draftMessagesCount += aFolder.getTotalMessages(true);
      });
      AutoCompactionController.setDraftCount(draftMessagesCount);
    });
  });
  aGlobal.tbBug766495 = tbBug766495;
})(this);
