function detectSite(address) {
    $($.storage.get('config.sites')).each(function(id, site) {
        if (adderess.match(site.mask))
            return site;
    });
    return false;
}

wastedTimeManager = {
    /**
     * Updates the amount of time we have spent on a given site.
     * @param {int} site_id The site to update.
     * @param {float} seconds The number of seconds to add to the counter.
     */
    'waste': function(id, seconds) {
        $.storage.inc('stats.site-' + id, typeof(seconds) === 'undefined' ? $.storage.get('config.waste_interval') : seconds);
    },
    'is_paused': function(id) {
        return $.storage.get('runtime.site-' + id + '.paused') === 'true';
    },
    'pause': function(id) {
      $.storage.set('runtime.site-' + id + '.paused', 'true');
      // chrome.browserAction.setIcon({path: 'icon_paused.png'});
    },
    'resume': function(id) {
      $.storage.set('runtime.site-' + id + '.paused', 'false');
      chrome.browserAction.setIcon({path: 'icon.png'});
    },
    'resetActivity': function(id) {
      $.storage.set('runtime.site-' + id + '.lastActivitySeconds', 0);
      if (this.is_paused(id)) {
        this.resume();
      }
    },
    'checkIdleTime': function(id) {
      console.log('Checking idle time.');
      $.storage.inc('runtime.site-' + id + '.lastActivitySeconds', 10);
      console.log('Last activity was ' + $.storage.get('runtime.site-' + id + '.lastActivitySeconds') + ' seconds ago.');
      console.log('Paused = ' + this.is_paused(id));
      if (!this.is_paused(id) && parseInt($.storage.get('runtime.site-' + id + '.lastActivitySeconds')) > 60) {
        console.log('Idle for ' + $.storage.get('runtime.site-' + id + '.lastActivitySeconds') + ' seconds.');
        if ($.storage.get('config.idleDetection') === 'false') {
          console.log('Idle detection disabled, not pausing timer.');
        } else {
          this.pause(id);
        }
      }
    },
    'sendStatistics': function() {
        var sites = [];
        $($.storage.get('config.sites')).each(function(id, site) {
            var s = {};
            s.site_id = site.id;
            this.pause(s.site_id);
            s.wasted = $.storage.get('stats.site-' + s.site_id);
            sites.push(s);
        });
        
        var stats = {};
        
        stats.stats = sites;
        
        stats.token = $.storage.get('config.token');

        //stats.since = $.storage.get('stats.since').getTime() / 1000;
        
        var now = new Date();
        
        stats.timestamp = now.getTime() / 1000;  
        
        $.ajax({
            contentType: 'application/json',
            data: JSON.stringify(stats),
            dataType: 'json',
            processData: false,
            type: 'POST',
            url: $.storage.get('config.API_URL')
        })
        .success(function(){
            console.log("Successfully updated statistics.");
            $.storage.set('stats.since', new Date());
            $($.storage.get('config.sites')).each(function(id, site) {
                $.storage.set('stats.site-' + site.id, 0);
                this.resume(site.id);
            });
            alert('success');
        })
        .fail(function(){
            console.log("Faild to send stats to server.");
            //chrome.browserAction.setIcon({path: 'icon_error.png'});
            $($.storage.get('config.sites')).each(function(id, site) {
                this.resume(site.id);
            });
            //alert('fail');
        })
        .done(function(){
            alert('done');
        });
        
        chrome.browserAction.setIcon({path: 'icon.png'}); // why do that?

    },
    /**
     * Updates the counter for the current tab.
     */
    'updateCounter': function() {
      chrome.tabs.getSelected(null, function(tab) {
        /* Make sure we're on the focused window, otherwise we're recording bogus stats. */
        chrome.windows.get(tab.windowId, function(window) {
          if (!window.focused) {
            return;
          }
          var site = detectSite(tab.url);
          if (!site) {
            console.log("Unable to update counter. Malformed url.");
            return;
          }

          /* Update the time spent for this site by comparing the current time to
           * the last time we were ran. */
          var now = new Date();
          var delta = now.getTime() - $.storage.get('stats.since').getTime();
          this.waste(site.id, delta / 1000);

          /* This function could have been called as the result of a tab change,
           * which means the site may have changed. */
          $.storage.set('stats.since', now);
        });
      });
    }    
};

$(function(){
    if ($.storage.get('stats.since') == null)
        $.storage.set('stats.since', new Date());
    config = $.storage.get('config');

    $($.storage.get('config.sites')).each(function(id, site) {
        this.resume(site.id);
    });

    chrome.browserAction.onClicked.addListener(function(tab) {
        wastedTimeManager.sendStatistics();
    });
    
/*  chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    if (tabId == currentTabId) {
      console.log("Tab updated");
      wastedTimeManager.updateCounter();
    }
  });*/

    chrome.extension.onConnect.addListener(function(port) {
      console.assert(port.name == "idle");
      port.onMessage.addListener(function(msg) {
          if (msg.site)
          {    
              var site = detectSite(msg.site);
              if (!site)
                  return;
              wastedTimeManager.resetActivity(site.id);
              port.postMessage({'site_id': site.id});
          }
          else if (msg.site_id)
              wastedTimeManager.resetActivity(msg.site_id);
      });
    });

  /* Force an update of the counter every minute. Otherwise, the counter
     only updates for selection or URL changes. */
  $.timer(wastedTimeManager.updateCounter, $.storage.get('config.waste_interval'), true);

  // Send statistics periodically.
  console.log("Sending stats interval " + $.storage.get('config.sendStatsInterval'));
  $.timer(wastedTimeManager.sendStatistics, $.storage.get('config.sendStatsInterval'), true);

  // Keep track of idle time.
  $.timer(wastedTimeManager.checkIdleTime, $.storage.get('config.updateCounterInterval'), true);
});