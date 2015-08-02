'use strict';

import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import LayoutView from './layout-view';
import SettingsView from './settings/collection-view';
import CalenderView from './calendar/collection-view';
import SettingsCollection from './settings/collection';
import CalendarCollection from './calendar/collection';
import Radio from 'backbone.radio';
import _ from 'lodash';

var days = require('../helpers/days');

const settingsChannel = Radio.channel('setting');

const App = Marionette.Application.extend({
	initialize() {
		this.listenTo(settingsChannel, 'option:changed', this.updateView);
	},
	onStart() {
		this.layoutView = new LayoutView();
		this.layoutView.render();

		const settingsCollection = new SettingsCollection();
		const calendarCollection = new CalendarCollection();

		this.layoutView.getRegion('settings').show(new SettingsView({collection: settingsCollection}));
		this.layoutView.getRegion('calendar').show(new CalenderView({collection: calendarCollection}));

		this.listenTo(settingsCollection, 'sync', this.createCalendar);
	},
	updateView(setting) {
		console.log(setting);
	},
	createCalendar() {
		const _this = this;

		function getSettings() {
			return _this.layoutView.getRegion('settings').currentView.collection.models.map((model) => {
				return {
					currentValue: model.attributes.currentValue,
					name: model.attributes.name
				}
			});
		}

		function createWeek(start, end, workDays){

			//need to remove non work days.

			const dayNames = days.map((day) => {
				return day.name.toLowerCase();
			});

			const startDayIndex = dayNames.indexOf(start);
			const endDayIndex = dayNames.indexOf(end);

			if (endDayIndex > startDayIndex) {
				const week = days.slice(startDayIndex, (endDayIndex + 1));
			} else {
				const tail = days.slice(0, endDayIndex);
				const head = days.slice(startDayIndex, (days.length + 1));
				const week = head.push(tail);
			}
		}

		function removeSpaces(s) {
			return s.replace(/\s/g, "");
		}

		function titleCase(s) {
			return s.replace(/\w\S*/g, function(s) {
				return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
			});
		}

		function sentanceCase(s) {
			return s.charAt(0).toLowerCase() + s.substring(1, s.length);
		}

		const camelCase = _.flowRight(sentanceCase, removeSpaces, titleCase);

		const calendar = {};
		const settings = getSettings();

		for(let i = 0; i < settings.length; i++){
			var name = camelCase(settings[i].name);

			calendar[name] = settings[i].currentValue;
		}

		const week = createWeek(calendar.startDay, calendar.endDay, calendar.workDays);
	}
});

const app = new App();

app.start();
