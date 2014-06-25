Ext.define('icc.model.user.User', {
	extend: 'icc.model.common.Model',
	fields: [{
		name: 'username',
		type: 'string'
	}, {
		name: 'password',
		type: 'string'
	}, {
		name : 'isProfessional',
		type : 'boolean'
	}, {
		name : 'active',
		type : 'boolean'
	}, {
		name : 'expire',
		type : 'string',
		convert : function(value, record) {
			if (Ext.isObject(value) && value['sec'] != undefined) {
				var date = new Date();
				date.setTime(value.sec * 1000);
				return date;
			} else {
				return value;
			}
		}
	}, {
		name: 'role',
		type: 'string'
	}, {
		name: 'name',
		type: 'string'
	}, {
		name: 'mobile',
		type: 'string'
	}, {
		name: 'email',
		type: 'string'
	}, {
		name : 'verifyEmail',
		type : 'boolean'
	}]
});