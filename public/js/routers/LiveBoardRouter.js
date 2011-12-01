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
			"board": "LiveBoardHandler"
		},
		
		// Some handlers...
		LiveBoardHandler: function() {

			o.board = new LiveBoardView();

		}

	});

}); // define