Ext.define('Ext.form.UEditor', {
    extend: 'Ext.form.FieldContainer',
    mixins: {
        field: 'Ext.form.field.Field'
    },
    alias: 'widget.ueditor',
    alternateClassName: 'Ext.ux.UEditor',
    ueditorInstance: null,
    initialized: false,
    initComponent: function() {
        var me = this;
        me.addEvents('initialize', 'change');
        var id = me.id + '-ueditor';
        me.html = '<script id="' + id + '" type="text/plain" name="' + me.name + '"></script>';
        me.callParent(arguments);
        me.initField();
        me.on('render', function() {
            var width = me.width - 105;
            var height = me.height - 109;
            var config = {
                initialFrameWidth: width,
                initialFrameHeight: height
            };
            me.ueditorInstance = UE.getEditor(id, config);
            me.ueditorInstance.execCommand('serverparam', {
                '__PROJECT_ID__': me.__PROJECT_ID__,
                '__COLLECTION_ID__': me.__COLLECTION_ID__
            });
            me.ueditorInstance.ready(function() {
                me.initialized = true;
                me.fireEvent('initialize', me);
                me.ueditorInstance.addListener('contentChange', function() {
                    me.fireEvent('change', me);
                });
            });
        });
    },
    getValue: function() {
        var me = this,
            value = '';
        if (me.initialized) {
            value = me.ueditorInstance.getContent();
        }
        me.value = value;
        return value;
    },
    setValue: function(value) {
        var me = this;
        if (value === null || value === undefined) {
            value = '';
        }
        if (me.initialized) {
            me.ueditorInstance.setContent(value);
        } else {
            me.on('initialize', function() {
                me.ueditorInstance.setContent(value);
            });
        }
        return me;
    },
    onDestroy: function() {
        this.ueditorInstance.destroy();
    }
});