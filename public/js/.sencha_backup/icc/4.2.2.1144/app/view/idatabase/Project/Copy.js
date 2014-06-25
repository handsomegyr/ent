Ext.define('icc.view.idatabase.Project.Copy', {
	extend : 'icc.common.Window',
	alias : 'widget.idatabaseProjectCopy',
	title : '复制项目',
	requires : [ 'icc.view.idatabase.Project.Combobox' ],
	layout: 'border',
	autoScroll : false,
	initComponent: function() {
		var __PROJECT_ID__ = this.__PROJECT_ID__;
		this.items = [ {
			xtype : 'iform',
			region: 'center',
			url : '/idatabase/project/clone',
			items : [{
				xtype : 'hiddenfield',
				name : 'projectId',
				value: __PROJECT_ID__
			},
			{
				xtype : 'idatabaseProjectCombobox',
				name : 'targetProjectId',
				anchor : '98%'
			},
			{
				xtype : 'radiogroup',
				fieldLabel : '是否复制数据',
				defaultType : 'radiofield',
				layout : 'hbox',
				anchor : '98%',
				items : [
					{
						boxLabel : '是',
						name : 'isCopyData',
						inputValue : 1
					}, {
						boxLabel : '否',
						name : 'isCopyData',
						inputValue : 0,
						checked: true
					}
				]
			}]
		},{
			region : 'west',
			xtype : 'idatabaseProjectTree',
			__PROJECT_ID__:__PROJECT_ID__
		} ];
        this.callParent();
    }
	
});