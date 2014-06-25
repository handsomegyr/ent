Ext.define('icc.view.user.Data.Main', {
	extend : 'Ext.panel.Panel',
	requires : [],
	alias : 'widget.userDataMain',
	//closable : true,
	layout : 'border',
	initComponent : function() {
		var plugins = [ Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2
		}) ];

		if (this.isRowExpander) {
			plugins.push(Ext.create('Ext.grid.plugin.RowExpander', {
				rowBodyTpl : new Ext.XTemplate(this.rowBodyTpl, {
					htmlspecialchars : function(value) {
						return htmlspecialchars(value);
					}
				}),
				expandOnEnter : false,
				expandOnDblClick : false
			}));
		}

		if (this.isTree) {
			plugins.push({
				ptype : 'bufferedrenderer'
			});
			Ext.apply(this, {
				items : [ {
					xtype : 'userDataTreeGrid',
					__PROJECT_ID__ : this.__PROJECT_ID__,
					__COLLECTION_ID__ : this.__COLLECTION_ID__,
					__PLUGIN_ID__ : this.__PLUGIN_ID__,
					columns : this.gridColumns,
					store : this.gridStore,
					addOrEditFields : this.addOrEditFields,
					selType : 'checkboxmodel',
					plugins : plugins
				} ]
			});
		} else {
			Ext.apply(this, {
				items : [ {
					xtype : 'userDataGrid',
					__PROJECT_ID__ : this.__PROJECT_ID__,
					__COLLECTION_ID__ : this.__COLLECTION_ID__,
					__PLUGIN_ID__ : this.__PLUGIN_ID__,
					columns : this.gridColumns,
					store : this.gridStore,
					addOrEditFields : this.addOrEditFields,
					selType : 'checkboxmodel',
					plugins : plugins
				}, {
					xtype : 'userDataSearch',
					__PROJECT_ID__ : this.__PROJECT_ID__,
					__COLLECTION_ID__ : this.__COLLECTION_ID__,
					__PLUGIN_ID__ : this.__PLUGIN_ID__,
					searchFields : this.searchFields
				} ]
			});
		}
		this.callParent(arguments);
	}
});
