Ext.define('icc.view.project.Add', {
	extend: 'icc.common.Window',
	alias: 'widget.projectAdd',
	title: '添加项目',
	initComponent: function() {
		this.items = [{
			xtype: 'iform',
			url: '/project/add',
			items: [{
				name: 'name',
				fieldLabel: '项目名称',
				allowBlank: false
			}, {
				name: 'sn',
				fieldLabel: '项目编号',
				allowBlank: false
			}, {
				xtype: 'textareafield',
				name: 'desc',
				fieldLabel: '项目介绍',
				allowBlank: false
			}, {
				xtype: 'hiddenfield',
				name: 'isSystem',
				fieldLabel: '项目编号',
				allowBlank: false,
				value: this.isSystem
			}]
		}];

		this.callParent();
	}

});