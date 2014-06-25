Ext.define('icc.store.user.Structure', {
	extend: 'Ext.data.Store',
	autoLoad: false,
	model : 'icc.model.user.Structure',
	proxy : {
		type : 'ajax',
		url : '/user/index/structure',
		extraParams : {
			
		},
		reader : {
			type : 'json',
			root : 'result',
			totalProperty : 'total'
		}
	}
});