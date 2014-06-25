Ext.define('icc.store.project.Project', {
	extend: 'Ext.data.Store',
	requires: ['icc.model.project.Project'],
	autoLoad: false,
	model: 'icc.model.project.Project',
	proxy: {
		type: 'ajax',
		url: '/project/index',
		extraParams: {

		},
		reader: {
			type: 'json',
			root: 'result',
			totalProperty: 'total'
		}
	}
});