Ext.define('icc.Application', {
    name: 'icc',

    extend: 'Ext.app.Application',
	requires:[
		'icc.view.desktop.App'
	],
    views: [
        'common.Combobox.Boolean'
    ],

    controllers: [
        // TODO: add controllers here
        'idatabase.Project',
        'idatabase.Collection',
        'idatabase.Collection.Order',
        'idatabase.Structure',
        'idatabase.Plugin',
        'idatabase.Plugin.System',
        'idatabase.Data',
        'idatabase.Index',
        'idatabase.Key',
        'idatabase.Mapping',
        'idatabase.Import',
        'idatabase.Lock',
        'idatabase.Statistic',
        'project.Project',
        'user.User'
    ],

    stores: [
        // TODO: add stores here
        'common.Boolean'
    ],
	launch: function() {
		var myApp = new icc.view.desktop.App();
    }
});
