// CardModel.js

define([

], function() {

	return Backbone.Model.extend({

		initialize: function() {

		},

		defaults: function() {
			return {
				id: 'no-id'
			,	name: 'no-name'
			,	description: 'no-description'
			,	position: 'no-position'
			,	color: '#FFEE99'
			}
		}

	});



}); // define