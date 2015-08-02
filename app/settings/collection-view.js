'use strict';

import Marionette from 'backbone.marionette';
import ChildView from './child-view';

export default Marionette.CollectionView.extend({
	childView: ChildView,
	onRender() {
		this.collection.fetch();
	}
});