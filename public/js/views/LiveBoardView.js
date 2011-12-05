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
			'dblclick'					: 'new-card-handler'
		,	'mousemove'					: 'moving-cursor-handler'
		}

,		initialize: function() {

			this.cards = new CardCollection();

			this.render();

			this.trigger('view-initialized', this);

		}

,		render: function() {

			this.el.html( this.template );

		}

/**
*	UI Event Handlers
*/

,		'new-card-handler': function(event) {

			var offset = this.el.offset();

			var _click = {
				top: event.pageY - offset.top
			,	left: event.pageX - offset.left
			}

			var card = new CardView( _click );

			this.cards.add( card );

		}

,		'moving-cursor-handler': function(event) {
//			o.socket.emit("moving", o._id, o.getMousePosition(event) );
		}

	});

}) // define