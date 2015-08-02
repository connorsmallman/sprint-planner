'use strict';

import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import LayoutView from './layout-view';
import SettingsView from './settings/collection-view';
import SettingsCollection from './settings/collection';
import Radio from 'backbone.radio';

const settingsChannel = Radio.channel('setting');

const App = Marionette.Application.extend({
	initialize() {
		this.listenTo(settingsChannel, 'option:changed', this.updateView);
	},
	onStart() {
		this.layoutView = new LayoutView();
		this.layoutView.render();

		let collection = new SettingsCollection();

		this.layoutView.getRegion('settings').show(new SettingsView({collection: collection}));
	},
	updateView(setting) {
		console.log(setting);
	}
});

const app = new App();

app.start();
