Ext.define('icc.store.user.User', {
	extend: 'Ext.data.Store',
	requires: ['icc.model.user.User'],
	autoLoad: false,
	model: 'icc.model.user.User',
	proxy: {
		type: 'ajax',
		url: '/user/index/index',
		extraParams: {

		},
		reader: {
			type: 'json',
			root: 'result',
			totalProperty: 'total'
		}
	}
});