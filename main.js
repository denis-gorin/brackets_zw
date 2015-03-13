/*jslint nomen: true, vars: true */
/*global define, brackets, $*/

define(function (require, exports, module) {
    'use strict';
    
    // Brackets modules
    var AppInit     = brackets.getModule('utils/AppInit'),
        ViewCommandHandlers = brackets.getModule("view/ViewCommandHandlers"),
        PreferencesManager = brackets.getModule('preferences/PreferencesManager');

    var prefs = PreferencesManager.getExtensionPrefs("fonts");
    var MIN_FONT_SIZE = 1;
    var wheelCounter = 0;
    var MAX_FONT_SIZE = 72;

    function _adjustFontSize(adjustment, zoom_delta) {

        var fsStyle   = prefs.get("fontSize"),
            validFont = /^[\d\.]+(px|em)$/;

        // Make sure that the font size is expressed in terms we can handle (px or em). If not, simply bail.
        if (fsStyle.search(validFont) === -1) {
            return false;
        }

        var _correction = ( Math.abs(zoom_delta) == 100 )? 1 : 0.5;

        // Guaranteed to work by the validation above.
        var fsUnits = fsStyle.substring(fsStyle.length - 2, fsStyle.length),
            delta   = fsUnits === "px" ? 1 : 0.1,
            fsOld   = parseFloat(fsStyle.substring(0, fsStyle.length - 2)),
            //            fsNew   = fsOld + (delta * adjustment),
            fsNew   = fsOld + ( (-zoom_delta * 0.01 * delta) * _correction ),
            fsStr   = fsNew + fsUnits;

        // Don't let the font size get too small or too large. The minimum font size is 1px or 0.1em
        // and the maximum font size is 72px or 7.2em depending on the unit used
        if (fsNew < MIN_FONT_SIZE * delta || fsNew > MAX_FONT_SIZE * delta) {
            return false;
        }

        if ( Math.abs(zoom_delta) == 100 )
        {
            if (wheelCounter%2==0){   		
                ViewCommandHandlers.setFontSize(fsStr);
            }			
        }
        else
        {			
            ViewCommandHandlers.setFontSize(fsStr);
        }
        return true;
    }
    
    var wheelHandler = function(e){

        if (e.ctrlKey || e.metaKey) { // Windows, OSX (cmd key)
            var fontSize = parseInt(ViewCommandHandlers.getFontSize());
            var zoom_delta = (typeof e.deltaY !='undefined') ? e.deltaY : e.originalEvent.deltaY  ;
            var adjustment = (zoom_delta < 0) ? 1 : -1;
            wheelCounter += adjustment;
            _adjustFontSize(adjustment, zoom_delta);			
        }
    }

    AppInit.appReady(function () {
        document.removeEventListener("wheel");
        document.addEventListener("wheel", wheelHandler, true);
    });

});
