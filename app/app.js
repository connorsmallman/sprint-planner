'use strict';

import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import LayoutView from './layout-view';
import SettingsView from './settings/collection-view';
import CalendarView from './calendar/collection-view';
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

		this.layoutView.getRegion('settings').show(new SettingsView({ collection: settingsCollection }));
		this.layoutView.getRegion('calendar').show(new CalendarView({ collection: calendarCollection }));

		this.listenTo(settingsCollection, 'sync', this.createCalendar);
	},
	createCalendar() {
		const _this = this;

		function getSettings() {
			return _this.layoutView.getRegion('calendar').currentView.collection.models.map((model) => {
				return {
					currentValue: model.attributes.currentValue,
					name: model.attributes.name
				}
			});
		}

		function createWeek(start, end, includesWeekend){
			let weekNames = _.map(days, function(x) {
			  return x.name.toLowerCase();
			});

			const startDayIndex = weekNames.indexOf('saturday');
			const endDayIndex = weekNames.indexOf('tuesday');

			if(!includesWeekend){
			  weekNames = _.filter(weekNames, function(s) {
			    return s != 'sunday' && s != 'saturday';
			  });
			}

			if(endDayIndex > startDayIndex){
			  return days.slice(startDayIndex, endDayIndex + 1);
			} else {
			  const head = days.slice(startDayIndex, days.length);
			  const tail = days.slice(0, endDayIndex + 1);
			  
			  return head.concat(tail);
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

		const week = createWeek(calendar.startDay, calendar.endDay, calendar.includesWeekend);
		const calendarCollection = new CalendarCollection(week);

		//update region
	}
});

const app = new App();

app.start();
