/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('icc.view.desktop.UserWindow', {
    extend: 'icc.view.desktop.common.Module',

    requires: [
        'icc.view.user.Panel'
    ],
	
    id:'user-win',
	
    init : function(){
        this.launcher = {
            text: 'User Window',
            iconCls:'icon-grid'
        }
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('user-win');
        if(!win){
            win = desktop.createWindow({
                id: 'user-win',
                title:'账号管理',
                width:740,
                height:480,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                xtype: 'app-main-user',	
				layout: 'fit',
				items: [{
					border: false,
					xtype: 'userPanel'				
				}]
            });
        }
        return win;
    }

});
