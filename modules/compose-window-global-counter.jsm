/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ["ComposeWindowGlobalConuter"];

var ComposeWindowGlobalConuter = {
  _counter: 0,
  opened: function() {
    this._counter++;
  },
  get: function() {
    return this._counter;
  },
  closed: function() {
    this._counter--;
  },
  clear: function() {
    this._counter = 0;
  }
};

ComposeWindowGlobalConuter.clear();
