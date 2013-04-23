/*
 * The MIT License (MIT)
 * Copyright (c) 2013 Lance Campbell. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*
 * Based off of Fabio Crisci's [Cowsay Node Module](https://github.com/piuccio/cowsay)...
 * 
 * which was based off of the original Perl project by
 * [Tony Monroe](http://www.nog.net/~tony/): [cowsay](https://github.com/schacon/cowsay)
 *
 */

/*jslint vars: true, plusplus: true, devel: true, regexp: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets */

define(function (require, exports, module) {
    "use strict";
    
    // --- Brackets Modules ---
    var NativeApp = brackets.getModule("utils/NativeApp");
    
    // --- Constants ---
    var DEFAULT_SHOW_HELP   = false;
    
    var HELP_URL = "https://github.com/lkcampbell/brackets-cowsay#how-to-use-cowsay";
    
    // --- Private variables

    // --- Utility Functions

    // --- Cowsay helper functions
    function _getBalloon(text) {
        var finalText = "";
        
        finalText += "**INSERT COW BALLOON HERE**";
        finalText += "\n";
        
        return finalText;
    }
    
    function _getCow() {
        var finalText = "";
        
        finalText += "**INSERT COW PICTURE HERE**";
        finalText += "\n";
        
        return finalText;
    }

    // -- Public methods
    function parseCommand(command) {
        var i,
            commandArray    = command.split("_"),
            cowText         = "",
            finalText       = "";
        
        // Command options
        var showHelp    = DEFAULT_SHOW_HELP;
        
        // Parse the command string
        for (i = 1; i < commandArray.length; i++) {
            
            // If any command is an empty string, it's a multiple underscore syntax error
            if (commandArray[i] === "") {
                return "Error: Two or more underscore characters adjacent to each other.";
            }
            
            switch (commandArray[i]) {
            case "help":
            case "?":
                showHelp = true;
                break;
            default:
                // Unrecognized option
                return "Error: Unrecognized option '_" + commandArray[i] + "'.";
            }
        }
        
        if (showHelp) {
            NativeApp.openURLInDefaultBrowser(HELP_URL);
            finalText = "";
        } else {
            cowText = "MOO!!";
            finalText += _getBalloon("cowText");
            finalText += _getCow();
        }
        
        return finalText;
    }
    
    // --- Public API ---
    exports.parseCommand = parseCommand;
});