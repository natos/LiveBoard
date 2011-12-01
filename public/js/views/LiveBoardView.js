/**
*	LiveBoardView.js
*/

define([

	'templates/LiveBoardTemplate'
,	'views/CardView'
,	'collections/CardCollection'

],

function(template, CardView, CardCollection) {

	return Backbone.View.extend({

		el: $('#live-board')

,		template: _.template( template )

,		events: {
			'click #btn-new-card'		: 'new-card-handler'
		,	'mousemove'					: 'moving-cursor-handler'
		}

,		initialize: function() {

			this.cards = new CardCollection();

			this.render();

			this.trigger('view-initialized', this);

			this['new-card-handler']();

		}

,		render: function() {

			this.el.html( this.template );

		}

/**
*	UI Event Handlers
*/

,		'new-card-handler': function(event) {

			var card = new CardView();

			this.cards.add( card );

		}

,		'moving-cursor-handler': function(event) {
//			o.socket.emit("moving", o._id, o.getMousePosition(event) );
		}

	});

}) // define