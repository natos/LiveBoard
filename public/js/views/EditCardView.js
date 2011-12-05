/**
*	EditCardView.js
*/

define([

],

function() {

/**
*	Private scope
*/

/**
*	Constructor
*/

	return Backbone.View.extend({

		initialize: function(self) {

			this.el = self.card;

			this.model = self.model;

			this.trigger('view-initialized', this);

		}

,		render: function() {

			this.el.find('.editable').bind('click', this.edit)

			return this;

		}

,		remove: function() {

			this.el.find('.editable').unbind('click', this.edit)

			return this;

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

			event.preventDefault && event.preventDefault();
						
			this.model.set({
				title: $('#title').val()
			,	description: $('#description').val()
			});

		}

,		edit: function(event) {

			var tag, element, value, template, getdata, data;

				element = $(event.target);
				tag = element.attr('data-edit-tag');
				value = element.html();
				getdata = function(e){
					return e.val();
				}

			switch(tag) {
			
				case 'input':

					template = $('<input type="text" id="title" data-field="title" placeholder="Write the title here..." value="' + value + '" />');

					break;
					
				case 'textarea':

					template = $('<textarea id="description" data-field="description" rows="15" placeholder="Explain the idea here…">' + value + '</textarea>');

					break;
			}
		
			element
				.hide()
				.before( template )
		
			template
				.focus()
				.one('blur', function(event){

					var field = template.attr('data-field'),
						value = template.val();

					element
						.html( template.val() )
						.show();

					template.remove();

//					self.model.set({ field: value }); // BROKEN! out of scope
				});			
		}

	});

}) // define