/**
*	CardView.js
*/

define([

	'templates/CardTemplate'
,	'models/CardModel'
,	'views/EditCardView'


],

function(template, model, EditCardView) {

/**
*	Private scope
*/

	var _getRandomNumber = function(n1, n2) {
		return Math.floor(Math.random()*n1) - n2; 
	}

/**
*	Constructor
*/

	return Backbone.View.extend({

		tagName: 'div'

,		className: 'card'

,		board: $('#live-board')

,		template: _.template( template )

,		events: {
		    'dblclick'					: 'edit'
		,	'mousedown .remove'	 		: 'remove'
		,	'mousedown'					: 'startDrag'
		,	'mouseup'					: 'stopDrag'
//		,	'mouseout'					: 'stopDrag'
		,	'mousemove'					: 'drag'
		}

,		initialize: function( position, id ) {

			this.id = id || 'card' + o.id();

			this.model = new model({
				id: this.id
			,	title: 'New card ;)'
			,	description: 'You can drag me around or double click to edit me!'
			});

			this.model.bind('change', this.redraw, this)

			this.position = position;

			this.card = $(this.el);

			this.card.attr('id', this.id);

			this.trigger('view-initialized', this);

			this.render();

			this.socketHandlers();

		}

,		render: function() {

			this.setRotation();

			this.card.css({ 
				top: this.position.top - 55
			,	left: this.position.left - 80
			,	zIndex: o.getLastZIndex()
			});

			this.redraw();
					
			this.board.append( this.card );
			
			return this;

		}
		
,		redraw: function(event) {

			this.card.html( this.template( { model: this.model } ) )

			this.editMode && this.exitEditMode();

		}


,		socketHandlers: function() {



		}

/**
*	Properties
*/

,		dragStatus: false

,		editMode: false

,		oldZIndex: 0

/**
*	UI Methods
*/

,		getRotation: function() {
			return this.rotation = _getRandomNumber(6, 3);
		}

,		setRotation: function( rotation ) {
			this.card[0].style.webkitTransform = 'rotate(' + this.getRotation() + 'deg)';
			this.card[0].style.MozTransform = 'rotate(' + this.getRotation() + 'deg)';
		}

,		focus: function() {

			$('.card').removeClass('focus');

			this.card
				.css({ zIndex: o.getLastZIndex() })
				.addClass('focus');

		}

,		blur: function() {

			this.card.removeClass('focus');
			
		}

/**
*	UI Event Handlers
*/

,		remove: function(event) {
	
			// avoid dragging things around on removing
			event.stopPropagation && event.stopPropagation()

			o.socket.emit('remove-card', this.id);

		    this.card.undelegate('dblclick', 'editMode');
			this.card.undelegate('mousedown', 'startDrag');
			this.card.undelegate('mouseup', 'stopDrag');
			this.card.undelegate('mouseout', 'stopDrag');
			this.card.undelegate('mousemove', 'drag');
			this.card.undelegate('click button.remove', 'remove');

			this.card[0].style.webkitTransform = 'scale(.3)';
			this.card[0].style.MozTransform = 'scale(.3)';

			this.card.fadeOut(200, function(){ $(this).remove() });

		}

,		startDrag: function(event) {

			if (this.editMode) { return }

			this.dragStatus = true;

			this.focus();
			
			this.card.addClass('dragging');

			var cardOffset = this.card.offset();

			this._click = {
				top: event.pageY - cardOffset.top
			,	left: event.pageX - cardOffset.left
			}

			o.socket.emit('card-start-draggin', this.id, this._click);

			return this;

		}

,		stopDrag: function(event) {

			if (this.editMode) { return }
			
			this.dragStatus = false;
			
			this.blur();

			this.card.removeClass('dragging');
			
			this.setRotation();

			o.socket.emit('card-stop-draggin', this.id);

			return this;

		}

,		drag: function(event) {

			if (this.editMode) { return }
			
			if ( !this.dragStatus ) { return }

			this.card.css('-webkit-transition','none');
			this.card.css('-moz-transition','none');

			var boardOffset = this.board.offset();

			var points = {
				top: event.pageY - boardOffset.top - this._click.top
			,	left: event.pageX - boardOffset.left - this._click.left
			}

			this.card.css('top', points.top + 'px');
			this.card.css('left', points.left + 'px');

			o.socket.emit('card-draggin', this.id, points);

		}

,		edit: function(event) {

			// avoid bubble, otherwise the board will be creating a new card
			event.stopPropagation && event.stopPropagation();

			this.dragStatus = false;

			// avoid edit mode if the target is a form element
			if ( /INPUT|TEXTAREA/.test(event.target.tagName) ) { return }

			this.card.toggleClass('edit-mode');
			
			(this.editMode) ? this.exitEditMode() : this.enterEditMode() ;
			
		}

,		enterEditMode: function(){

			this.editMode = true;

			this.oldCSS = {
				'top': this.card.css('top')
			,	'left': this.card.css('left')
			,	'right': this.card.css('right')
			,	'bottom': this.card.css('bottom')
//			,	'width': 130 //this.card.css('width')
//			,	'height': 90 //this.card.css('height')
			}

			var margin = 20;
			var offset = this.board.offset();

			var width = this.board.width() - offset.left - margin;
			var height = this.board.height() - offset.top - margin;

			this.card
				.removeAttr('style')
				.css({
					'top': '5px'
				,	'left': '5px'
				,	'width': width + 'px'
				,	'height': height + 'px'
				});

			this.focus();

			// Content
			var self = {
				card		: this.card
			,	model		: this.model
			}
			
			this.editView = this.editView || new EditCardView( self );
			
			this.editView.render();
						
		}

,		exitEditMode: function(){

			this.editMode = false;

			this.card.removeClass('edit-mode')

			// EditView
			this.editView.remove();
			
			this.card
				.removeAttr('style')
				.css(this.oldCSS);

			this.blur();

			this.setRotation();

		} 

/**
*	Socket Event Handlers
*/



	});

}) // define