Ext.setup({
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {
        var about = new Ext.Component({
			title: 'About',
			cls: 'card5',
			iconCls: 'info',
			scroll: 'none',
			html: '<div class="about"><h1>OSVDB.org Updates</h1><br /><h2>This unofficial app provides the latest vulnerability updates and news from the Open Source Vulnerability Database.</h2><br /><h2><a href="http://osvdb.org">http://osvdb.org</a></h2>'
		});
		var timeline = new Ext.Component({
            title: 'Timeline',
            cls: 'card3',
			iconCls: 'twitter1',
            scroll: 'vertical',
			listeners: {
				activate: function() { refreshtweets();}
			},
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="tweet">',
                            '<div class="avatar"><img src="{profile_image_url}" /></div>',
                            '<div class="tweet-content">',
                                '<h2>{from_user}</h2>',
                                '<p>{text:this.linkify}</p>',
                            '</div>',
                    '</div>',
                '</tpl>',
		        {
		            /**
		             * Simply wraps a link tag around each detected url
		             */
		            linkify: function(value) {
		                return value.replace(/(http:\/\/[^\s]*)/g, "<a target=\"_blank\" href=\"$1\">$1</a>");
		            }
		        }
            )
        });
        var latest = new Ext.Component({
            title: 'Latest',
            cls: 'card1',
			iconCls: 'warning_black',
            scroll: 'both',
			listeners: {
				//activate: function() { refreshnew();}
			},
            tpl: [
                '<tpl for=".">',
                    '<div class="vuln">',
                            '<div class="vuln-content">',
                                '<h2>{title}</h2>',
                                '<p><a href="{link}">{link}</a></p>',
                            '</div>',
                    '</div>',
                '</tpl>'
            ]
        });
        var popular = new Ext.Component({
            title: 'Popular',
            cls: 'card2',
			iconCls: 'favorites',
            scroll: 'both',
			listeners: {
				activate: function() { refreshpop();}
			},
            tpl: [
                '<tpl for=".">',
                    '<div class="vuln">',
                            '<div class="vuln-content">',
                                '<h2>{title}</h2>',
                                '<p><a href="{link}">{link}</a></p>',
                            '</div>',
                    '</div>',
                '</tpl>'
            ]
        });
        var blog = new Ext.Component({
            title: 'Blog',
            cls: 'card4',
			iconCls: 'rss_black2',
            scroll: 'vertical',
			listeners: {
				activate: function() { refreshblog();}
			},
            tpl: [
                '<tpl for=".">',
                    '<div class="vuln">',
                            '<div class="vuln-content">',
                                '<h2><a href="{link}">{title}</a></h2>',
                                '<p>{contentSnippet}</p>',
                            '</div>',
                    '</div>',
                '</tpl>'
            ]
        });
        var tabpanel = new Ext.TabPanel({
            tabBar: {
                dock: 'bottom',
                layout: {
                    pack: 'center'
                }
            },
            fullscreen: true,
			dockedItems: [{xtype:'toolbar', title:'OSVDB.org'}],
            cardSwitchAnimation: {
                type: 'slide',
                cover: true
            },
            
            defaults: {
                scroll: 'vertical'
            },
            items: [latest, popular, timeline, blog, about]
        });
        var refreshtweets = function() {                         

	      Ext.util.JSONP.request({                           
	        url: 'http://search.twitter.com/search.json',    
	        callbackKey: 'callback',                         
	        params: {
				q: 'from:osvdb'	
			},
	      callback: function(result) {                         
	        var data = result.results;
	        if (data) {
				timeline.update(data);
			} else {
				alert ("Error Loading Tweets!");
			}
	      }
	    });
	  };
	  var refreshnew = function() {                          

	      Ext.util.JSONP.request({                          
	        url: 'http://ajax.googleapis.com/ajax/services/feed/load',    
	        callbackKey: 'callback',                        
	        params: {
			v: '1.0',
			q: 'http://osvdb.org/feed/vulnerabilities/latest.rss',
			num: 10	
			},
	      callback: function(result) {                         
	        var data = result.responseData.feed.entries;
	        if (data) {
				latest.update(data);
			} else {
				alert ("Error Loading Feed!");
			}
	      }
	    });
	  };
	  var refreshpop = function() {                           

	      Ext.util.JSONP.request({                           
	        url: 'http://ajax.googleapis.com/ajax/services/feed/load',    
	        callbackKey: 'callback',                         
	        params: {
			v: '1.0',
			q: 'http://osvdb.org/feed/vulnerabilities/viewed.rss',
			num: 10	
			},
	      callback: function(result) {                         
	        var data = result.responseData.feed.entries;
	        if (data) {
				popular.update(data);
			} else {
				alert ("Error Loading Feed!");
			}
	      }
	    });
	  };
	  var refreshblog = function() {                           

	      Ext.util.JSONP.request({                           
	        url: 'http://ajax.googleapis.com/ajax/services/feed/load',    
	        callbackKey: 'callback',                         
	        params: {
			v: '1.0',
			q: 'http://blog.osvdb.org/articles.rss',
			num: 10	
			},
	      callback: function(result) {                        
	        var data = result.responseData.feed.entries;
	        if (data) {
				blog.update(data);
			} else {
				alert ("Error Loading Feed!");
			}
	      }
	    });
	  };
// Call initial load
      refreshtweets();		
	  refreshnew();
	  refreshpop();
	  refreshblog();
	}
});