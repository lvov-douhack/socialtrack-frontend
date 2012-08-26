/**
 * @fileoverview Notifies background page of user activity.
 * @author wk
 */

var port = chrome.extension.connect({name: "idle"});

port.postMessage({'site': window.location.href});

var site_id = null;

port.onMessage.addListener(function(msg) {
    if (msg.listen)
    {
        site_id = msg.site_id;
        /* Keep this simple because it happens on every mouse movement. */
        document.body.onmousemove = function() {
              port.postMessage({'site_id': site_id});
        }
    }
});