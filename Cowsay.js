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
/*global define, brackets, $, window*/

define(function (require, exports, module) {
    "use strict";
    
    // --- Brackets Modules ---
    var NativeApp   = brackets.getModule("utils/NativeApp");
    
    // --- Constants ---
    var DEFAULT_NEEDS_USER_TEXT     = true,
        DEFAULT_COW_TEXT            = "MOOO-OOO!!!",
        DEFAULT_COW_TYPE            = "default",
        DEFAULT_SHOW_HELP           = false;

    var HELP_URL = "https://github.com/lkcampbell/brackets-cowsay#how-to-use-cowsay";

    // --- Utility Functions
    function _repeatChar(char, count) {
        var arr = [];
        arr.length = count + 1;
        return arr.join(char);
    }
    
    // From http://james.padolsey.com/javascript/wordwrap-for-javascript/
    function _wordwrap(str, width, brk, cut) {
        brk = brk || "\n";
        width = width || 75;
        cut = cut || false;
        
        if (!str) { return str; }
        
        var regex = ".{1," + width + "}(\\s|$)" + (cut ? "|.{" + width + "}|.+$" : "|\\S+?(\\s|$)");
        
        return str.match(new RegExp(regex, "g")).join(brk);
    }
    
    function _getLongestLine(arr) {
        return arr.slice(0).sort(function (a, b) { return b.length - a.length; })[0];
    }
    
    function _padTextRight(text, length) {
        return text + _repeatChar(" ", (length - text.length + 1));
    }
    
    // --- Cowsay helper functions ---
    function _getBalloon(cowText) {
        var wrappedLines    = [],
            longestLine     = "",
            i               = 0,
            currentLine     = "",
            finalText       = "";
        
        wrappedLines    = _wordwrap(cowText, 80).split("\n");
        longestLine     = _getLongestLine(wrappedLines);
        
        // Top of the balloon
        finalText += "\n";
        finalText += " " + _repeatChar("_", (longestLine.length + 2));
        finalText += "\n";
        
        // Middle of the balloon
        if (wrappedLines.length === 1) {
            finalText += "< " + wrappedLines[0] + " >";
            finalText += "\n";
        } else {
            for (i = 0; i < wrappedLines.length; i++) {
                currentLine = wrappedLines[i];
                currentLine = _padTextRight(currentLine, longestLine.length);
                
                if (i === 0) {
                    finalText += "/ " + currentLine + "\\";
                } else if (i === wrappedLines.length - 1) {
                    finalText += "\\ " + currentLine + "/";
                } else {
                    finalText += "| " + currentLine + "|";
                }
                
                finalText += "\n";
            }
        }
        
        // Bottom of the balloon
        finalText += " " + _repeatChar("-", (longestLine.length + 2));
        finalText += "\n";
        
        return finalText;
    }

    function _processCowFile(cowFile) {
        var matchArr    = [],
            finalText   = "";
        
        cowFile     = cowFile.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '');
        matchArr    = /\$the_cow\s*=\s*<<"*EOC"*;*\n([\s\S]+)\nEOC\n/.exec(cowFile);
        
        if (!matchArr) {
            // Need better Error handling here...
            finalText = "Cannot parse cow file";
        } else {
            finalText = matchArr[1]
                .replace(/\\{2}/g, "\\")
                .replace(/\\@/g, "@")
                .replace(/\\\$/g, "$")
                .replace(/\$thoughts/g, "\\")
                .replace(/\$eyes/g, "oo")
                .replace(/\$tongue/g, "  ")
                .replace(/\$\{eyes\}/g, "oo")
                .replace(/\$\{tongue\}/g, "  ");
        }
        
        return finalText;
    }
    
    function _getCow(cowType) {
        var cowFileText = "",
            finalText   = "";
        
        // Temporary solution...
        cowFileText = require("text!cows/default.cow");
        
        // TODO: need to load the .cow file based on cowType
        
        finalText += _processCowFile(cowFileText);
        finalText += "\n";
        
        return finalText;
    }

    // -- Public methods
    function drawCow(cowText, cowType) {
        var finalText = "";
        
        finalText += _getBalloon(cowText);
        finalText += _getCow(cowType);
        
        return finalText;
    }

    function parseCommand(command) {
        var i,
            commandArray    = command.split("_"),
            finalText       = "";
        
        // Command options
        var needsUserText   = DEFAULT_NEEDS_USER_TEXT,
            cowText         = DEFAULT_COW_TEXT,
            cowType         = DEFAULT_COW_TYPE,
            showHelp        = DEFAULT_SHOW_HELP;
        
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
            if (needsUserText) {
                // Temporary solution until I make the Modal Dialog
                cowText = window.prompt("The cow says:", DEFAULT_COW_TEXT);
            }
            finalText = drawCow(cowText, cowType);
        }
        
        return finalText;
    }
    
    // --- Public API ---
    exports.drawCow         = drawCow;
    exports.parseCommand    = parseCommand;
});