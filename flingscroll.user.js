// ==UserScript==
// @name FlingScroll
// @description Scroll your webpages by dragging with middle mouse button. Flinging (also known as kinetic scrolling) is supported for fast scrolling.
// @licence GPLv3; http://www.gnu.org/copyleft/gpl.html
// @match http://*/*
// @match https://*/*
// ==/UserScript==

/* Scroll your webpages by dragging with middle mouse button. Flinging
 * (also known as kinetic scrolling) is supported for fast scrolling.
 * Copyright (C) 2011 Daniel Gröber <me ät dxld dot at>
 *               2011 Erik Eloff <erik@eloff.se>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function(){
    var middleButton = 1 // middle mouse button (tested in chromium)
    var lastEv = null;
    var speedX = 0;
    var speedY = 0;

    document.addEventListener('mousemove', function(ev){
        if(!lastEv) {
            lastEv = ev;
            return;
        }

        var btn = ev.button;
        if (btn == middleButton) {
            speedX = lastEv.screenX - ev.screenX;
            speedY = lastEv.screenY - ev.screenY;
            window.scrollBy(speedX, speedY);
        } else {
            lastEv = 0;
        }

        lastEv = ev;
    });

    var intervalSeconds = 1.0 / 60;
    var intervalMillis = intervalSeconds * 1000;
    var decay = 2;
    var doScroll = function () {
        window.scrollBy(speedX, speedY);
        speedX *= (1 - decay * intervalSeconds);
        speedY *= (1 - decay * intervalSeconds);
        if (Math.abs(speedY) > 0.5 || Math.abs(speedY) > 0.5) {
            setTimeout(doScroll, intervalMillis);
        }
    }

    var preventClickEvents = function(ev){
        if(ev.button == middleButton) {
            var el = null;
            if(el = ev.toElement) {
                el.onclick = null;
                el.onmousedown = null;
                el.onmouseup = null;
            }
            if (ev.type == "mouseup") {
                setTimeout(doScroll, intervalMillis);
            } else if (ev.type == "mousedown") {
                speedX = 0;
                speedY = 0;
            }
        }
    }

    document.addEventListener('mousedown', preventClickEvents);
    document.addEventListener('mouseup', preventClickEvents);
    document.addEventListener('click', preventClickEvents);
})(undefined);

