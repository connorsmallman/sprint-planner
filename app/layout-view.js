'use strict';

import Marionette from 'backbone.marionette';
import template from './layout-template.hbs'

export default Marionette.LayoutView.extend({
	el:'#app',
	className: 'main',
	template: template,
	regions: {
    	settings: "#settings",
    	calendar: "#calendar"
  	}
});