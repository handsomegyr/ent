/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('icc.view.desktop.IccWindow', {
    extend: 'icc.view.desktop.common.Module',

    requires: [
        'Ext.*',
		'Ext.chart.*',
        'Ext.form.field.HtmlEditor',
        'Ext.tab.Panel',
		'Ext.toolbar.Toolbar',
        'Ext.layout.container.Border',
        'icc.view.idatabase.Project.Grid',
        'icc.common.Form',
        'icc.common.Paging',
        'icc.common.Tbar',
        'icc.common.Window',
        'icc.common.SearchBar',
        'icc.common.Combobox',
        'Ext.ux.form.SearchField',
        'icc.view.idatabase.Data.Field.2dfield',
        'icc.view.idatabase.Data.Field.md5field',
        'icc.view.idatabase.Data.Field.sha1field',
        'icc.view.idatabase.Data.Field.boolfield'
    ],

    id:'icc-win',

    init : function(){
        this.launcher = {
            text: 'ICC Window',
            iconCls:'icon-grid'
        }
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('icc-win');
        if(!win){
            win = desktop.createWindow({
                id: 'icc-win',
                title:'ICC Window',
                width:740,
                height:480,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                xtype: 'app-main-icc',				
				layout: {
					type: 'border'
				},
				items: [{
					xtype : 'idatabaseProjectAccordion'
				},{
					xtype : 'idatabaseProjectTabPanel'
				}]
            });
        }
        return win;
    }
});
