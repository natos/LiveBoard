/**
*	EditCardView.js
*/

define([

	'templates/EditCardTemplate'

],

function(template) {

/**
*	Private scope
*/

/**
*	Constructor
*/

	return Backbone.View.extend({

		tagName: 'div'

,		className: 'edit-card-view'

,		template: _.template( template )

,		events: {
		    'submit form'		: 'save'
		}

,		initialize: function(conf) {

			this.el = $(this.el);
			
			this.container = conf.container || this.container;

			this.model = conf.model || this.model || [];

			this.trigger('view-initialized', this);

		}

,		render: function() {

			this.el.html( this.template( this.model ) )

			this.container
				.append( this.el )
				.hide()
				.fadeIn(300);

			return this;

		}

,		remove: function() {

			this.el.detach();

		}
/**
*	Properties
*/

/**
*	UI Methods
*/

/**
*	UI Event Handlers
*/

,		save: function(event) {

			console.log(event);

			if (event.preventDefault) { event.preventDefault() }
			
			console.log(this.model)
			
			this.model.set({
				title: $('#title').val()
			,	description: $('#description').val()
			})

		}
		
	});

}) // define