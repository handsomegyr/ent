Ext.define('icc.view.user.Data.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.userDataGrid',
	requires: ['Ext.grid.plugin.CellEditing', 'Ext.grid.plugin.RowExpander'],
	region: "center",
	border: false,
	collapsible: false,
	split: true,
	closable: false,
	multiSelect: true,
	disableSelection: false,
	sortableColumns: false,
	width: '70%',
	height:'100%',
	initComponent: function() {
		Ext.apply(this, {
			columns: this.columns,
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					text: '新增',
					iconCls: 'add',
					width: 60,
					action: 'add'
				}, '-',
				{
					text: '编辑',
					iconCls: 'edit',
					width: 60,
					action: 'edit'
				}, '-',
				{
					text: '保存',
					iconCls: 'save',
					width: 60,
					action: 'save'
				}, '-',
				{
					text: '删除',
					iconCls: 'delete',
					width: 60,
					tooltip: '删除',
					action: 'remove'
				}, '->',
				{
					text: '清空',
					iconCls: 'recycle',
					width: 60,
					tooltip: '清空',
					action: 'drop'
				}]
			}],
			store: this.store,
			bbar: {
				xtype: 'paging',
				store: this.store
			}
		});

		this.callParent(arguments);
	}
});