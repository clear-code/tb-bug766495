/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const kCID  = Components.ID('{B1223178-FCE2-4185-8E74-BE1DC67E1831}');
const kID   = '@clear-code.com/tb-bug766495/startup;1';
const kNAME = 'tbBug766495StartupService';

const Cc = Components.classes;
const Ci = Components.interfaces;
Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
XPCOMUtils.defineLazyModuleGetter(this,
                                  "ComposeWindowGlobalCounter",
                                  "resource://tb-bug766495-modules/compose-window-global-counter.jsm");

function tbBug766495StartupService() {}

tbBug766495StartupService.prototype = {
  classID          : kCID,
  contractID       : kID,
  classDescription : kNAME,
  observe : function(aSubject, aTopic, aData) {
    ComposeWindowGlobalCounter.activateAutoCompaction();
  },
  QueryInterface   : XPCOMUtils.generateQI([Ci.nsIObserver]),
}

var NSGetFactory = XPCOMUtils.generateNSGetFactory([tbBug766495StartupService]);
