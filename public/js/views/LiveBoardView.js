/**
*	LiveBoardView.js
*/

define([

	'templates/LiveBoardTemplate'

],

function(template) {

	return Backbone.View.extend({

		el: $('#live-board'),

		template: _.template( template ),

		initialize: function() {

			this.trigger('view-initialized', this);
		}

	});

}