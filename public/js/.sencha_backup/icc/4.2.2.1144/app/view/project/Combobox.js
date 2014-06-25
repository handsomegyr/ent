Ext.define('icc.view.project.Combobox', {
	extend : 'icc.common.Combobox',
	alias : 'widget.projectCombobox',
	fieldLabel : '项目列表',
	name : '__PROJECT_ID__',
	store : 'Project',
	valueField : '_id',
	displayField : 'name',
	queryMode : 'remote',
	pageSize : 0,
	editable : false,
	typeAhead : false
});
