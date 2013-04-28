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
    var DEFAULT_NEEDS_USER_TEXT = true,
        DEFAULT_COW_TEXT        = "MOOO-OOO!!!",
        DEFAULT_COW_TYPE        = "default",
        DEFAULT_EYES_STRING     = "oo",
        DEFAULT_TONGUE_STRING   = "  ",
        DEFAULT_IS_THINKING     = false,
        DEFAULT_IS_HTML         = false,
        DEFAULT_SHOW_HELP       = false;

    var HELP_URL = "https://github.com/lkcampbell/brackets-cowsay#how-to-use-cowsay";
    
    var FORTUNE_FILE_ARRAY  = require("text!fortunes.txt").split("%");

    // --- Utility Functions
    function _getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
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
        var arr = [];
        
        arr.length = (length - text.length) + 1;
        return text + arr.join(" ");
    }
    
    // --- Cowsay helper functions ---
    function _getRandomFortunes(count) {
        var i           = 0,
            fortune     = "",
            finalText   = "";
        
        for (i = 0; i < count; i++) {
            fortune   = _getRandomElement(FORTUNE_FILE_ARRAY);
            finalText   += fortune.trim();
            finalText   += "\n\n";
        }
        
        finalText = finalText.trim();
        return finalText;
    }
    
    function _getBalloon(cowText, isThinking) {
        var wrappedLines    = [],
            longestLine     = "",
            i               = 0,
            currentLine     = "",
            finalText       = "";
        
        // Balloon corner characters
        var upperLeftEdge   = "",
            upperRightEdge  = "",
            middleLeftEdge  = "",
            middleRightEdge = "",
            lowerLeftEdge   = "",
            lowerRightEdge  = "";
        
        wrappedLines    = _wordwrap(cowText, 80).split("\n");
        longestLine     = _getLongestLine(wrappedLines);
        
        // Top of the balloon
        finalText += "\n";
        finalText += " " + _repeatChar("_", (longestLine.length + 2));
        finalText += "\n";
        
        // Middle of the balloon
        if (wrappedLines.length === 1) {
            middleLeftEdge  = isThinking ? "( " : "< ";
            middleRightEdge = isThinking ? " )" : " >";
            finalText += middleLeftEdge + wrappedLines[0] + middleRightEdge;
            finalText += "\n";
        } else {
            for (i = 0; i < wrappedLines.length; i++) {
                currentLine = wrappedLines[i].trim();
                currentLine = _padTextRight(currentLine, (longestLine.length + 1));
                
                if (i === 0) {
                    upperLeftEdge   = isThinking ? "( " : "/ ";
                    upperRightEdge  = isThinking ? ")" : "\\";
                    finalText += upperLeftEdge + currentLine + upperRightEdge;
                } else if (i === wrappedLines.length - 1) {
                    lowerLeftEdge   = isThinking ? "( " : "\\ ";
                    lowerRightEdge  = isThinking ? ")" : "/";
                    finalText += lowerLeftEdge + currentLine + lowerRightEdge;
                } else {
                    middleLeftEdge  = isThinking ? "( " : "| ";
                    middleRightEdge = isThinking ? ")" : "|";
                    finalText += middleLeftEdge + currentLine + middleRightEdge;
                }
                finalText += "\n";
            }
        }
        
        // Bottom of the balloon
        finalText += " " + _repeatChar("-", (longestLine.length + 2));
        finalText += "\n";
        
        return finalText;
    }

    function _processCowFile(cowFile, eyesString, tongueString, isThinking) {
        var matchArr    = [],
            finalText   = "";
        
        cowFile     = cowFile.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '');
        matchArr    = /\$the_cow\s*=\s*<<"*EOC"*;*\n([\s\S]+)\nEOC\n/.exec(cowFile);
        
        if (!matchArr) {
            // Need better Error handling here...
            finalText = "Cannot parse cow file";
        } else {
            
            // Hack for greedy eyes...problem with the regexp below?
            eyesString = (eyesString === "$$") ? "$$$$" : eyesString;
            
            finalText = matchArr[1]
                .replace(/\\{2}/g, "\\")
                .replace(/\\@/g, "@")
                .replace(/\\\$/g, "$")
                .replace(/\$thoughts/g, (isThinking ? "o" : "\\"))
                .replace(/\$eyes/g, eyesString)
                .replace(/\$tongue/g, tongueString)
                .replace(/\$\{eyes\}/g, eyesString)
                .replace(/\$\{tongue\}/g, tongueString);
        }
        
        return finalText;
    }
    
    function _getCow(cowType, eyesString, tongueString, isThinking) {
        var cowFileText = "",
            finalText   = "";
        
        // Temporary solution...
        cowFileText = require("text!cows/default.cow");
        
        // TODO: need to load the .cow file based on cowType
        
        finalText += _processCowFile(cowFileText, eyesString, tongueString, isThinking);
        finalText += "\n";
        
        return finalText;
    }

    // -- Public methods
    function parseCommand(command) {
        var i,
            commandArray    = command.split("_"),
            option          = "",
            optionRegExp    = null,
            optionResult    = [],
            optionString    = "",
            finalText       = "";
        
        // Command options
        var needsUserText   = DEFAULT_NEEDS_USER_TEXT,
            cowText         = DEFAULT_COW_TEXT,
            cowType         = DEFAULT_COW_TYPE,
            eyesString      = DEFAULT_EYES_STRING,
            tongueString    = DEFAULT_TONGUE_STRING,
            isThinking      = DEFAULT_IS_THINKING,
            isHTML          = DEFAULT_IS_HTML,
            showHelp        = DEFAULT_SHOW_HELP;
        
        // Parse the command string
        for (i = 1; i < commandArray.length; i++) {
            
            // If any command is an empty string, it's a multiple underscore syntax error
            if (commandArray[i] === "") {
                return "Error: Two or more underscore characters adjacent to each other.";
            }
            
            option          = "";
            optionString    = "";
            
            // Eyes or tongue string, _e or _T, and a 0-2 character string
            optionRegExp    = /^(e|T)(\S{0,2})$/;
            
            if (optionRegExp.test(commandArray[i])) {
                optionResult    = commandArray[i].match(optionRegExp);
                option          = optionResult[1];
                optionString    = optionResult[2];
            }
            
            // Otherwise, just a one part option
            option = option || commandArray[i];
            
            switch (option) {
            case "e":
                eyesString = _padTextRight(optionString, 2);
                break;
            case "T":
                tongueString = _padTextRight(optionString, 2);
                break;
            case "b":
                eyesString      = "==";
                tongueString    = "  ";
                break;
            case "d":
                eyesString      = "xx";
                tongueString    = "U ";
                break;
            case "g":
                eyesString      = "$$";
                tongueString    = "  ";
                break;
            case "p":
                eyesString      = "@@";
                tongueString    = "  ";
                break;
            case "s":
                eyesString      = "**";
                tongueString    = "U ";
                break;
            case "t":
                eyesString      = "--";
                tongueString    = "  ";
                break;
            case "w":
                eyesString      = "OO";
                tongueString    = "  ";
                break;
            case "y":
                eyesString      = "..";
                tongueString    = "  ";
                break;
            case "think":
                isThinking = true;
                break;
            case "fortune":
                needsUserText = false;
                break;
            case "html":
                isHTML = true;
                break;
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
            } else {
                // Grab a random fortune to display
                // TODO: Allow for multiple fortunes
                cowText = _getRandomFortunes(1);
            }
            
            finalText += _getBalloon(cowText, isThinking);
            finalText += _getCow(cowType, eyesString, tongueString, isThinking);
        }
        
        if (isHTML) {
            finalText = "<pre>" + finalText + "</pre>";
        }
        
        return finalText;
    }
    
    // --- Public API ---
    exports.parseCommand    = parseCommand;
});