Ext.define('icc.view.project.Accordion', {
    extend: 'Ext.panel.Panel',
    xtype: 'projectAccordion',
    region: 'west',
    layout: 'accordion',
    width: 400,
    title: '功能列表',
    resizable: false,
    collapsible: true,
    initComponent: function() {
        var items = [{
            xtype: 'projectGrid',
            title: '项目管理',
            isSystem : false
        }];
		
        if (typeof(isSystem) !== 'undefined') {
            items.push({
                xtype: 'projectGrid',
                title: '系统管理',
                isSystem: true
            });
        }
        Ext.apply(this, {
            items: items
        });

        this.callParent(arguments);
    }
});