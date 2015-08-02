'use strict';

import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import LayoutView from './layout-view';
import SettingsView from './settings/view';
import SettingsModel from './settings/model';

let App = Marionette.Application.extend({
	onStart() {
		this.layoutView = new LayoutView();
		this.layoutView.render();

		const options = [
			{
				name: 'hello',
				value: 'hello'
			},
			{
				name: 'world',
				value: 'world'
			}
		];

		const settingsModel = new SettingsModel({options: options});

		this.layoutView.getRegion('settings').show(new SettingsView({model: settingsModel}));
	}
});

let app = new App();

app.start();
