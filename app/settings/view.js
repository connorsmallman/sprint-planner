'use strict';

import Marionette from 'backbone.marionette';
import Model from './model';
import template from './template.hbs';

export default Marionette.ItemView.extend({
	template: template,
	onRender() {
		console.log(this.model);
	}
});