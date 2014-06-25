Ext.define('icc.model.project.Project', {
	extend: 'icc.model.common.Model',
	fields: [{
		name: 'name',
		type: 'string'
	}, {
		name: 'sn',
		type: 'string'
	}, {
		name: 'desc',
		type: 'string'
	}]
});