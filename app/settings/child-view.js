'use strict';

import Marionette from 'backbone.marionette';
import template from './template.hbs';
import Radio from 'backbone.radio';

const settingsChannel = Radio.channel('setting');

export default Marionette.ItemView.extend({
	template: template,
	className: 'option',
	events: {
		'change select': function() {
			this.setCurrentValue();
			this.triggerChange();
		},
		'focus select': 'setPreviousValue'
	},
	setPreviousValue() {
		this.model.set('previousValue', this.$('select').val());
	},
	setCurrentValue() {
		this.model.set('currentValue', this.$('select').val());
	},
	triggerChange() {
		settingsChannel.trigger('option:changed', this.model.toJSON());
	}
});