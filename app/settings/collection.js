'use strict';

import Backbone from 'backbone';
import Model from './model';

export default Backbone.Collection.extend({
	url: '/api/settings',
	model: Model
});