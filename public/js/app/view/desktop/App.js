/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('icc.view.desktop.App', {
    extend: 'icc.view.desktop.common.App',

    requires: [
        'Ext.window.MessageBox',

        'icc.view.desktop.common.ShortcutModel',

        'icc.view.desktop.SystemStatus',
        'icc.view.desktop.VideoWindow',
        'icc.view.desktop.GridWindow',
        'icc.view.desktop.TabWindow',
        'icc.view.desktop.AccordionWindow',
        'icc.view.desktop.Notepad',
        'icc.view.desktop.BogusMenuModule',
        'icc.view.desktop.BogusModule',

//        'icc.view.desktop.Blockalanche',
        'icc.view.desktop.Settings',
		'icc.view.desktop.ProjectWindow',
		'icc.view.desktop.UserWindow'
    ],

    init: function() {
        // custom logic before getXYZ methods get called...
        this.callParent();

        // now ready...
    },

    getModules : function(){
        return [
            new icc.view.desktop.VideoWindow(),
            //new icc.view.desktop.Blockalanche(),
            new icc.view.desktop.SystemStatus(),
            new icc.view.desktop.GridWindow(),
            new icc.view.desktop.TabWindow(),
            new icc.view.desktop.AccordionWindow(),
            new icc.view.desktop.Notepad(),
            new icc.view.desktop.BogusMenuModule(),
            new icc.view.desktop.BogusModule(),
			new icc.view.desktop.ProjectWindow(),
			new icc.view.desktop.IccWindow(),
			new icc.view.desktop.UserWindow()
        ];
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();
        return Ext.apply(ret, {
            //cls: 'ux-desktop-black',

            contextMenuItems: [
                { text: 'Change Settings', handler: me.onSettings, scope: me }
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'icc.view.desktop.common.ShortcutModel',
                data: [
                    { name: 'Grid Window', iconCls: 'grid-shortcut', module: 'grid-win' },
                    { name: 'Accordion Window', iconCls: 'accordion-shortcut', module: 'acc-win' },
                    { name: 'Notepad', iconCls: 'notepad-shortcut', module: 'notepad' },
                    { name: 'System Status', iconCls: 'cpu-shortcut', module: 'systemstatus'},
                    { name: 'Project Manager', iconCls: 'grid-shortcut', module: 'project-win'},
                    { name: 'ICC Manager', iconCls: 'grid-shortcut', module: 'icc-win'},
                    { name: 'User Manager', iconCls: 'grid-shortcut', module: 'user-win'}
                ]
            }),

            wallpaper: 'wallpapers/Blue-Sencha.jpg',
            wallpaperStretch: false
        });
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();
        return Ext.apply(ret, {
            title: 'Don Griffin',
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text:'Settings',
                        iconCls:'settings',
                        handler: me.onSettings,
                        scope: me
                    },
                    '-',
                    {
                        text:'Logout',
                        iconCls:'logout',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();
        return Ext.apply(ret, {
            quickStart: [
                { name: 'Accordion Window', iconCls: 'accordion', module: 'acc-win' },
                { name: 'Grid Window', iconCls: 'icon-grid', module: 'grid-win' },
                { name: 'User Window', iconCls: 'icon-grid', module: 'user-win' }
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        Ext.Msg.confirm('Logout', 'Are you sure you want to logout?');
    },

    onSettings: function () {
        var dlg = new icc.view.desktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});
