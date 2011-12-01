/**
*	CardView.js
*/

define([

	'templates/CardTemplate'

],

function(template) {

/**
*	Private scope
*/

	var _defaultPoints = {
		top: 10
	,	left: 10
	}

	var _getPoints = function() {
		return {
			top: (_defaultPoints.top += 10) + 'px'
		,	left: (_defaultPoints.left += 10) + 'px'
		}
	}

	var _resetPoints = function() {
		_defaultPoints.top -= 10;
		_defaultPoints.left -= 10;
	}

	var _getRandomRotation = function() {
		return Math.floor(Math.random()*6) - 3; 
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
		,	'mousedown'					: 'startDrag'
		,	'mouseup'					: 'stopDrag'
		,	'mouseout'					: 'stopDrag'
		,	'mousemove'					: 'drag'
		,	'mouseup .remove'	 		: 'remove'
		}

,		initialize: function(id) {

			this.id = id || 'card' + o.id();

			this.rotation = _getRandomRotation();

			this.card = $(this.el);

			this.card.attr('id', this.id);

			this.trigger('view-initialized', this);

			this.render();

		}

,		render: function() {

			this.card
				.css( _getPoints() )
				.append( this.template() )

			this.setRotation()
			
			this.container = this.card.find('.content');

			this.board.append( this.card );

			return this;

		}

/**
*	Properties
*/

,		content: 'Double click to edit ;)'

,		dragStatus: false

,		oldZIndex: 0


/**
*	UI Methods
*/

,		setRotation: function() {
			this.card[0].style.webkitTransform = 'rotate(' + this.rotation + 'deg)';
		}

,		focus: function() {

			this.oldZIndex = this.card.css('zIndex') || 0;

			$('.card').removeClass('focus');

			this.card
				.css({ zIndex: o.getLastZIndex() })
				.addClass('focus');

			this.trigger('card:focus', this); // not working :S

		}

,		blur: function() {

			this.card
				.css({ zIndex: this.oldZIndex })
				.removeClass('focus');

			this.setRotation();
		}

/**
*	UI Event Handlers
*/

,		remove: function(event) {

			this.dragStatus = false;

		    this.card.undelegate('dblclick', 'editMode');
			this.card.undelegate('mousedown', 'startDrag');
			this.card.undelegate('mouseup', 'stopDrag');
			this.card.undelegate('mouseout', 'stopDrag');
			this.card.undelegate('mousemove', 'drag');
			this.card.undelegate('click button.remove', 'remove');

			this.card.remove();

			this.trigger('card:removed', this); // not working :S

			_resetPoints();

		}

,		startDrag: function(event) {

			if (this.editMode) { return }

			this.dragStatus = true;

			this.focus();

			var cardOffset = this.card.offset();

			this._click = {
				top: event.pageY - cardOffset.top
			,	left: event.pageX - cardOffset.left
			}

			this.card.css('-webkit-transition','none');

		}

,		stopDrag: function(event) {

			if (this.editMode) { return }

			this.dragStatus = false;

		}

,		drag: function(event) {

			if (this.editMode) { return }

			if ( !this.dragStatus ) { return }

			var mouse = o.getMousePosition(event)
			,	width = this.card.width()
			,	height = this.card.height()
			,	boardOffset = this.board.offset();

			var points = {
				top: event.pageY - boardOffset.top - this._click.top
			,	left: event.pageX - boardOffset.left - this._click.left
			}

			this.card.css({
				top: points.top + 'px'
			,	left: points.left + 'px'
			});

		}

,		edit: function(event) {

			console.log(event.target)
			console.log(event.target === this.container)

			this.card.toggleClass('edit-mode');

			if ( this.card.hasClass('edit-mode') ) {

				this.enterEditMode();

			} else {

				this.exitEditMode();

			}
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
			this.container.html('');

			//Add templating
			$('<textarea class="editor" rows="10">' + this.content + '</textarea>').appendTo(this.container);

		}

,		exitEditMode: function(){

			this.editMode = false;

			this.card
				.removeAttr('style')
				.css(this.oldCSS);

			this.blur();

			// Content

			this.content = $('.editor').val();

			console.log($('.editor').val())

			this.container.html( this.content );

			console.log(this.content);
		} 

	});

}) // define