if (typeof console == "undefined" || typeof console.log == "undefined") {
	var console = {
		log: function() {
			return false;
		},
		info: function() {
			return false;
		}
	};
}

Ext.Loader.setConfig({
	enabled: true
});

    function getQueryParam(name, queryString) {
        var match = RegExp(name + '=([^&]*)').exec(queryString || location.search);
        return match && decodeURIComponent(match[1]);
    }

    function hasOption(opt) {
        var s = window.location.search;
        var re = new RegExp('(?:^|[&?])' + opt + '(?:[=]([^&]*))?(?:$|[&])', 'i');
        var m = re.exec(s);

        return m ? (m[1] === undefined ? true : m[1]) : false;
    }

    var scriptTags = document.getElementsByTagName('script'),
        defaultTheme = 'neptune',
        defaultRtl = false,
        i = scriptTags.length,
        requires = [
            'Ext.toolbar.Toolbar',
            'Ext.form.field.ComboBox',
            'Ext.form.FieldContainer',
            'Ext.form.field.Radio'

        ],
        defaultQueryString, src, theme, rtl;

    while (i--) {
        src = scriptTags[i].src;
        if (src.indexOf('include-ext.js') !== -1) {
            defaultQueryString = src.split('?')[1];
            if (defaultQueryString) {
                defaultTheme = getQueryParam('theme', defaultQueryString) || defaultTheme;
                defaultRtl = getQueryParam('rtl', defaultQueryString) || defaultRtl;
            }
            break;
        }
    }

    Ext.themeName = theme = getQueryParam('theme') || defaultTheme;
    
    rtl = getQueryParam('rtl') || defaultRtl;

    if (rtl.toString() === 'true') {
        requires.push('Ext.rtl.*');
        Ext.define('Ext.GlobalRtlComponent', {
            override: 'Ext.AbstractComponent',
            rtl: true
        });
    }

    Ext.require(requires);
	
Ext.onReady(function() {
	Ext.require(['Ext.data.proxy.Ajax', 'Ext.form.field.ComboBox', 'Ext.form.field.VTypes', 'Ext.grid.plugin.RowExpander'], function() {

		Ext.override('Ext.data.proxy.Ajax', {
			timeout: 60000
		});

		Ext.override('Ext.form.action.Submit', {
			waitTitle: '系统提示',
			waitMsg: '数据处理中，请稍后……'
		});

		Ext.form.field.ComboBox.override({
			setValue: function(v) {
				var me = this;
				if (!this.store.isLoaded && this.queryMode == 'remote') {
					if (typeof(v) === 'string' || typeof(v) === 'number') {
						if (this.store.proxy.type == 'ajax') {
							this.store.proxy.extraParams.idbComboboxSelectedValue = v;
						}
						try {
							this.store.addListener('load', function() {
								try {
									this.store.isLoaded = true;
									this.setValue(v);
								} catch (e) {
									console.info(e);
								}

								try {
									if (this.store.findRecord(this.valueField, '', 0, false, false, true) == null) {
										var insertRecord = {};
										insertRecord[this.displayField] = '无';
										insertRecord[this.valueField] = '';
										var r = Ext.create(this.store.model, insertRecord);
										this.store.insert(0, r);
									}
								} catch (e) {
									console.info(e);
								}

							}, this);

							this.store.load();
						} catch (e) {
							console.info(e);
						}
					} else {
						this.callOverridden(arguments);
					}
				} else {
					this.callOverridden(arguments);
				}
			}
		});

		Ext.Ajax.on('requestcomplete', function(ajax, response) {
			var result = response.responseText;
			if (result.charAt(0) == '{') {
				var json = Ext.decode(result);
				if (json.access == 'deny') {
					Ext.Msg.alert('提示信息', json.msg);
				}
			}
		});

		Ext.Ajax.on('requestexception', function(ajax, response, options, eOpts) {
			Ext.Msg.alert('提示信息', '网络连接异常，请检查您的网络状况是否正常');
		});

	});
	
	/*
	var toolbar;
	
	setTimeout(function() {
		toolbar = Ext.widget({
			xtype: 'toolbar',
			border: false,
			rtl: false,
			id: 'logout-toolbar',
			floating: true,
			fixed: true,
			preventFocusOnActivate: true,
			draggable: {
				constrain: true
			},
			items: [{
				xtype: 'button',
				rtl: false,
				hidden: false,
				enableToggle: true,
				text: '注销登录',
				margin: '0 5 0 0',
				listeners: {
					click: function() {
						window.location.href = '/application/auth/logout';
					}
				}
			}],
			constraintInsets: '0 -' + (Ext.getScrollbarSize().width + 4) + ' 0 0'
		});
		toolbar.show();
		toolbar.alignTo(
		document.body, Ext.optionsToolbarAlign || 'tr-tr', [(Ext.getScrollbarSize().width + 4) * (Ext.rootHierarchyState.rtl ? 1 : -1), -(document.body.scrollTop || document.documentElement.scrollTop)]);

		var constrainer = function() {
			toolbar.doConstrain();
		};
		Ext.EventManager.onWindowResize(constrainer);
	}, 100);
	*/
	
	/*
	var toolbar;
            
	setTimeout(function() {
		toolbar = Ext.widget({
			xtype: 'toolbar',
			border: true,
			rtl: false,
			id: 'options-toolbar',
			floating: true,
			fixed: true,
			preventFocusOnActivate: true,
			draggable: {
				constrain: true
			},
			items: [{
				xtype: 'combo',
				rtl: false,
				width: 170,
				labelWidth: 45,
				fieldLabel: 'Theme',
				displayField: 'name',
				valueField: 'value',
				labelStyle: 'cursor:move;',
				margin: '0 5 0 0',
				store: Ext.create('Ext.data.Store', {
					fields: ['value', 'name'],
					data : [
						{ value: 'access', name: 'Accessibility' },
						{ value: 'classic', name: 'Classic' },
						{ value: 'gray', name: 'Gray' },
						{ value: 'neptune', name: 'Neptune' }
					]
				}),
				value: theme,
				listeners: {
					select: function(combo) {
						var theme = combo.getValue();
						if (theme !== defaultTheme) {
							setParam({ theme: theme });
						} else {
							removeParam('theme');
						}
					}
				}
			}, {
				xtype: 'button',
				rtl: false,
				hidden: !(Ext.repoDevMode || location.href.indexOf('qa.sencha.com') !== -1),
				enableToggle: true,
				pressed: rtl,
				text: 'RTL',
				margin: '0 5 0 0',
				listeners: {
					toggle: function(btn, pressed) {
						if (pressed) {
							setParam({ rtl: true });
						} else {
							removeParam('rtl');
						}
					}
				}
			}, {
				xtype: 'tool',
				type: 'close',
				rtl: false,
				handler: function() {
					toolbar.destroy();
				}
			}],

			// Extra constraint margins within default constrain region of parentNode
			constraintInsets: '0 -' + (Ext.getScrollbarSize().width + 4) + ' 0 0'
		});
		toolbar.show();
		toolbar.alignTo(
			document.body,
			Ext.optionsToolbarAlign || 'tr-tr',
			[
				(Ext.getScrollbarSize().width + 4) * (Ext.rootHierarchyState.rtl ? 1 : -1),
				-(document.body.scrollTop || document.documentElement.scrollTop)
			]
		);
		
		var constrainer = function() {
			toolbar.doConstrain();
		};
		
		Ext.EventManager.onWindowResize(constrainer);
		toolbar.on('destroy', function() { 
			Ext.EventManager.removeResizeListener(constrainer);
		});
	}, 100);
	*/
	
	var task = new Ext.util.DelayedTask(function(){
		Ext.TaskManager.start({
		    run: function(){
		    	Ext.Ajax.request({
					url : '/application/auth/keep',
					success : function(response) {}
				});
		    },
		    interval: 60000 //1分钟
		});
	});
	
	task.delay(60000);
});