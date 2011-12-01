// CardCollection.js

define([

	// Dependencies

	'models/CardModel'

],

function(model) {

	return Backbone.Collection.extend({

		model: model,

		initialize: function(a) {

		}

	});


}); // define