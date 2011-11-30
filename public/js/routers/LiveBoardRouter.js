// AppRouter.js

define([

	'views/LiveBoardView'

],

function(LiveBoardView) {

	return Backbone.Router.extend({
		
		// To know which view is the current
		current: undefined,

		// Declaring all app routes here
		// "someview": "somehandler"
		routes: {
			"topbookings": "topbookings",
			"allchannels": "allchannels",
			"nowandnext": "nowandnext"

		},
		
		// Some handlers...
		nowandnext: function() {
			this.load('nowandnext', NowAndNextView)
		},

		allchannels: function() {
			this.load('allchannels', AllChannelsView)
		},

		topbookings: function() {
			this.load('topbookings', TopBookingsView)
		},

		// Generic view loader
		load: function(namespace, View) {

			// unload current view
			if (this.current) {
				wo.views[this.current].unload();
			}
			// set the new current
			this.current = namespace;

			// Try to grab the view from the cache
			if (wo.views[namespace]) {
				wo.views[namespace].load();
				return;
			}

			// Create the requested view
			wo.views[namespace] = new View();
			wo.views[namespace].bind('view-created', function(){
				// When a new view is loaded, distroy existing scroll object
				if (wo.scroll) { wo.scroll.destroy() } 
				// Then create a new scroll to calculate every detail again
				wo.scroll = new iScroll('content');
			});
		}

	});

}); // define