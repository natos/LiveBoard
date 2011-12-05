/**
*	CardTemplate.js
*/

define([], function(){

var t = '<div class="menu">'
	+ '<button title="Remove" class="remove">x</button>'
	+ '</div>'
	+ '<div class="content">'
	+ '<h1 class="editable" data-edit-tag="input"><%= model.get("title") %></h1>'
	+ '<p class="editable" data-edit-tag="textarea"><%= model.get("description") %></p>'
	+ '</div>'
	return t;

});