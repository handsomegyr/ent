Ext.define('icc.view.user.Data.Add', {
	extend: 'icc.common.Window',
	alias: 'widget.userDataAdd',
	title: '添加数据',
	initComponent: function() {
		var items = Ext.Array.merge(this.addOrEditFields, [{
			xtype: 'hiddenfield',
			name: '__PROJECT_ID__',
			value: this.__PROJECT_ID__,
			allowBlank: false
		}, {
			xtype: 'hiddenfield',
			name: '__COLLECTION_ID__',
			value: this.__COLLECTION_ID__,
			allowBlank: false
		}, {
			xtype: 'hiddenfield',
			name: '__PLUGIN_ID__',
			value: this.__PLUGIN_ID__,
			allowBlank: false
		}]);

		Ext.apply(this, {
			items: [{
				xtype: 'iform',
				url: '/user/index/add',
				items: items
			}]
		});

		this.callParent();
	}
});