/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ["ComposeWindowGlobalConuter"];

var ComposeWindowGlobalConuter = {
  opened: function() {
    this._counter++;
  },
  get: function(aKey) {
    return this._counter || 0;
  },
  closed: function(aKey) {
    delete this._counter--;
  },
  clear: function() {
    this._counter = 0;
  }
};

ComposeWindowGlobalConuter.clear();
