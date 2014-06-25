Ext.define('icc.view.user.Panel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.userPanel',
	requires: [],
	layout: "fit",
	collapsible: false,
	closable: false,
	multiSelect: false,
	disableSelection: false,
	sortableColumns: false,
	initComponent: function() {
		var me = this;		
		this.buildDataPanel(me);
		//var store = Ext.create('icc.store.user.User');
		//store.proxy.extraParams = {
		//	isSystem: me.isSystem
		//};
		//store.load();
		me.callParent();
	},
	
	buildDataPanel: function(me) {
		var __PROJECT_ID__ = 1;
		var __PLUGIN_ID__ = 1;
		var __COLLECTION_ID__ = 'user';//record.get('_id');
		var __PLUGIN_COLLECTION_ID__ = 1;//record.get('plugin_collection_id');
		var collection_name = 'sytem_user';//record.get('name');
		var isTree = false;//Ext.isBoolean(record.get('isTree')) ? record.get('isTree') : false;
		var isRowExpander = false;//Ext.isBoolean(record.get('isRowExpander')) ? record.get('isRowExpander') : false;
		var rowBodyTpl = "";//record.get('rowExpanderTpl');
		
		var panel = null;
		// model的fields动态创建
		var modelFields = [];
		var searchFields = [];
		var gridColumns = [];

		var structureStore = Ext.create('icc.store.user.Structure');
		structureStore.proxy.extraParams = {};

		var treeField = '';
		var treeLabel = '';
		structureStore.load(function(records, operation, success) {
			// 存储下拉菜单模式的列
			var gridComboboxColumns = [];
			var addOrEditFields = [];

			Ext.Array.forEach(records, function(record) {
				var isBoxSelect = Ext.isBoolean(record.get('isBoxSelect')) ? record.get('isBoxSelect') : false;
				var isLinkageMenu = Ext.isBoolean(record.get('isLinkageMenu')) ? record.get('isLinkageMenu') : false;
				var linkageClearValueField = Ext.isString(record.get('linkageClearValueField')) ? record.get('linkageClearValueField') : '';
				var linkageSetValueField = Ext.isString(record.get('linkageSetValueField')) ? record.get('linkageSetValueField') : '';
				var jsonSearch = Ext.isString(record.get('rshSearchCondition')) ? record.get('rshSearchCondition') : '';
				var cdnUrl = Ext.isString(record.get('cdnUrl')) ? record.get('cdnUrl') : '';
				var xTemplate = Ext.isString(record.get('xTemplate')) ? record.get('xTemplate') : '';

				// 获取fatherField
				if (record.get('rshKey')) {
					treeField = record.get('field');
					treeLabel = record.get('label');
				}

				var convertDot = function(name) {
					return name.replace(/\./g, '__DOT__');
				};

				var convertToDot = function(name) {
					return name.replace(/__DOT__/g, '.');
				};

				var recordType = record.get('type');
				var recordField = convertDot(record.get('field'));
				var recordLabel = record.get('label');
				var allowBlank = !record.get('required');

				// 创建添加和编辑的field表单开始
				var addOrEditField = {
					xtype: recordType,
					fieldLabel: recordLabel,
					name: recordField,
					allowBlank: allowBlank
				};

				switch (recordType) {
				case 'arrayfield':
				case 'documentfield':
					addOrEditField.xtype = 'textareafield';
					addOrEditField.name = recordField;
					break;
				case 'boolfield':
					delete addOrEditField.name;
					addOrEditField.radioName = recordField;
					break;
				case 'filefield':
					addOrEditField = {
						xtype: 'filefield',
						name: recordField,
						fieldLabel: recordLabel,
						labelWidth: 100,
						msgTarget: 'side',
						allowBlank: true,
						anchor: '100%',
						buttonText: '浏览本地文件'
					};
					break;
				case '2dfield':
					addOrEditField.title = recordLabel;
					addOrEditField.fieldName = recordField;
					break;
				case 'datefield':
					addOrEditField.format = 'Y-m-d H:i:s';
					break;
				case 'numberfield':
					addOrEditField.decimalPrecision = 8;
					break;
				case 'htmleditor':
					addOrEditField.height = 300;
					break;
				};

				var rshCollection = record.get('rshCollection');
				if (rshCollection != '') {
					var rshCollectionModel = 'rshCollectionModel' + rshCollection;
					var convert = function(value) {
						if (Ext.isObject(value)) {
							if (value['$id'] != undefined) {
								return value['$id'];
							} else if (value['sec'] != undefined) {
								var date = new Date();
								date.setTime(value['sec'] * 1000);
								return date;
							}
						} else if (Ext.isArray(value)) {
							return value.join(',');
						}
						return value;
					};

					Ext.define(rshCollectionModel, {
						extend: 'icc.model.common.Model',
						fields: [{
							name: record.get('rshCollectionDisplayField'),
							convert: convert
						}, {
							name: record.get('rshCollectionValueField'),
							convert: convert
						}]
					});

					var comboboxStore = Ext.create('Ext.data.Store', {
						model: rshCollectionModel,
						autoLoad: false,
						pageSize: 20,
						proxy: {
							type: 'ajax',
							url: '/user/index/index',
							extraParams: {
								__PROJECT_ID__: __PROJECT_ID__,
								__COLLECTION_ID__: record.get('rshCollection'),
								jsonSearch: jsonSearch
							},
							reader: {
								type: 'json',
								root: 'result',
								totalProperty: 'total'
							}
						}
					});

					if (isBoxSelect) {
						addOrEditField.xtype = 'boxselect';
						addOrEditField.name = recordField + '[]';
						addOrEditField.multiSelect = true;
						addOrEditField.valueParam = 'idbComboboxSelectedValue';
						addOrEditField.delimiter = ',';
					} else {
						addOrEditField.xtype = 'combobox';
						addOrEditField.name = recordField;
						addOrEditField.multiSelect = false;
					}
					addOrEditField.fieldLabel = recordLabel;
					addOrEditField.store = comboboxStore;
					addOrEditField.queryMode = 'remote';
					addOrEditField.forceSelection = true;
					addOrEditField.editable = true;
					addOrEditField.minChars = 1;
					addOrEditField.pageSize = 20;
					addOrEditField.queryParam = 'search';
					addOrEditField.typeAhead = false;
					addOrEditField.valueField = record.get('rshCollectionValueField');
					addOrEditField.displayField = record.get('rshCollectionDisplayField');
					addOrEditField.fatherField = record.get('rshCollectionFatherField');
					addOrEditField.listeners = {
						select: function(combo, records, eOpts) {
							if (isLinkageMenu) {
								var value = [];
								if (records.length == 0 || linkageClearValueField == '' || linkageSetValueField == '') {
									return false;
								}

								Ext.Array.forEach(records, function(record) {
									value.push(record.get(combo.valueField));
								});

								var form = combo.up('form').getForm();

								var clearValueFields = linkageClearValueField.split(',');
								Ext.Array.forEach(clearValueFields, function(field) {
									var formField = form.findField(field) == null ? form.findField(field + '[]') : form.findField(field);
									if (formField != null) {
										formField.clearValue();
									}
								});


								var setValueFields = linkageSetValueField.split(',');
								Ext.Array.forEach(setValueFields, function(field) {
									var formField = form.findField(field) == null ? form.findField(field + '[]') : form.findField(field);
									if (formField != null) {
										var store = formField.store;
										var extraParams = store.proxy.extraParams;
										var linkageSearch = {};
										if (formField.fatherField != '') {
											linkageSearch[formField.fatherField] = {
												"$in": value
											};
											extraParams.linkageSearch = Ext.JSON.encode(linkageSearch);
										}
										store.load();
									}
								});

							}
							return true;
						}

					};
				}

				addOrEditFields.push(addOrEditField);
				// 创建添加和编辑的field表单结束

				// 创建model的fields开始
				var field = {
					name: convertToDot(recordField),
					type: 'string'
				};
				switch (recordType) {
				case 'arrayfield':
					field.convert = function(value, record) {
						if (Ext.isArray(value)) {
							return Ext.JSON.encode(value);
						} else {
							return value;
						}
					};
					break;
				case 'documentfield':
					field.convert = function(value, record) {
						if (Ext.isObject(value) || Ext.isArray(value)) {
							return Ext.JSON.encode(value);
						} else {
							return value;
						}
					};
					break;
				case '2dfield':
					field.convert = function(value, record) {
						if (Ext.isArray(value)) {
							return value.join(',');
						}
						return value;
					};
					break;
				case 'datefield':
					field.convert = function(value, record) {
						if (Ext.isObject(value) && value['sec'] != undefined) {
							var date = new Date();
							date.setTime(value.sec * 1000);
							return date;
						} else {
							return value;
						}
					};
					break;
				case 'numberfield':
					field.type = 'float';
					break;
				case 'boolfield':
					field.type = 'boolean';
					field.convert = function(value, record) {
						if (Ext.isBoolean(value)) {
							return value;
						} else if (Ext.isString(value)) {
							return value === 'true' || value === '√' ? true : false;
						}
						return value;
					};
					break;
				}
				modelFields.push(field);

				// 绘制grid的column信息
				if (record.get('main')) {
					var column = {
						text: recordLabel,
						dataIndex: convertToDot(recordField),
						flex: 1
					};

					if (xTemplate != '') {
						var column = {
							text: recordLabel,
							dataIndex: convertToDot(recordField),
							xtype: 'templatecolumn',
							tpl: xTemplate,
							flex: 1
						};
					}

					switch (recordType) {
					case 'boolfield':
						column.xtype = 'booleancolumn';
						column.trueText = '√';
						column.falseText = '×';
						column.field = {
							xtype: 'commonComboboxBoolean'
						};
						break;
					case '2dfield':
						column.align = 'center';
						break;
					case 'datefield':
						column.xtype = 'datecolumn';
						column.format = 'Y-m-d H:i:s';
						column.align = 'center';
						column.field = {
							xtype: 'datefield',
							allowBlank: allowBlank,
							format: 'Y-m-d H:i:s'
						};
						break;
					case 'numberfield':
						column.format = '0,000.00';
						column.align = 'right';
						column.field = {
							xtype: 'numberfield',
							allowBlank: allowBlank
						};
						break;
					case 'filefield':
						if (xTemplate != '') {
							if (record.get('showImage') != undefined && record.get('showImage') == true) {
								column.tpl = '<a href="' + cdnUrl + '{' + recordField + '}" target="_blank"><img src="' + cdnUrl + '{' + recordfield + '}?size=100x100" border="0" height="100" /></a>';
							} else {
								column.tpl = column.tpl.replace('{cdnUrl}', cdnUrl);
							}
						}
						break;
					default:
						column.field = {
							xtype: 'textfield',
							allowBlank: allowBlank
						};
						break;
					}

					// 存在关联集合数据，则直接采用combobox的方式进行显示
					if (rshCollection != '' && !isBoxSelect) {
						column.field = {
							xtype: 'combobox',
							typeAhead: true,
							store: comboboxStore,
							allowBlank: allowBlank,
							displayField: record.get('rshCollectionDisplayField'),
							valueField: record.get('rshCollectionValueField'),
							queryParam: 'search',
							minChars: 1
						};

						column.renderer = function(value) {
							var rec = comboboxStore.findRecord(record.get('rshCollectionValueField'), value, 0, false, false, true);
							if (rec != null) {
								return rec.get(record.get('rshCollectionDisplayField'));
							}
							return '';
						};

						gridComboboxColumns.push(column);
					}

					gridColumns.push(column);
				}

				// 创建model的fields结束

				// 创建条件检索form
				if (record.get('searchable') && recordType != 'filefield') {

					var rshCollection = record.get('rshCollection');

					// $not操作
					var exclusive = {
						fieldLabel: '非',
						name: 'exclusive__' + recordField,
						xtype: 'checkboxfield',
						width: 30,
						inputValue: true,
						checked: false
					};

					// 开启精确匹配
					var exactMatch = {
						fieldLabel: '等于',
						name: 'exactMatch__' + recordField,
						xtype: 'checkboxfield',
						width: 30
					};

					if (rshCollection != '') {
						var comboboxSearchStore = Ext.create('Ext.data.Store', {
							model: rshCollectionModel,
							autoLoad: false,
							pageSize: 20,
							proxy: {
								type: 'ajax',
								url: '/user/index/index',
								extraParams: {
									__PROJECT_ID__: __PROJECT_ID__,
									__COLLECTION_ID__: record.get('rshCollection'),
									jsonSearch: jsonSearch
								},
								reader: {
									type: 'json',
									root: 'result',
									totalProperty: 'total'
								}
							}
						});

						comboboxSearchStore.addListener('load', function() {
							var rec = comboboxSearchStore.findRecord(record.get('rshCollectionValueField'), '', 0, false, false, true);
							if (rec == null) {
								var insertRecord = {};
								insertRecord[record.get('rshCollectionDisplayField')] = '无';
								insertRecord[record.get('rshCollectionValueField')] = '';
								comboboxSearchStore.insert(0, Ext.create(rshCollectionModel, insertRecord));
							}
							return true;
						});

						searchFieldItem = {
							xtype: 'combobox',
							name: recordField,
							fieldLabel: recordLabel,
							typeAhead: true,
							store: comboboxSearchStore,
							displayField: record.get('rshCollectionDisplayField'),
							valueField: record.get('rshCollectionValueField'),
							queryParam: 'search',
							minChars: 1
						};

						searchField = {
							xtype: 'fieldset',
							layout: 'hbox',
							title: recordLabel,
							fieldDefaults: {
								labelAlign: 'top',
								labelSeparator: ''
							},
							items: [exclusive, searchFieldItem]
						};
					} else if (recordType == 'datefield') {
						searchField = {
							xtype: 'fieldset',
							layout: 'hbox',
							title: recordLabel,
							defaultType: 'datefield',
							fieldDefaults: {
								labelAlign: 'top',
								labelSeparator: '',
								format: 'Y-m-d H:i:s'
							},
							items: [exclusive,
							{
								fieldLabel: '开始时间',
								name: recordField + '[start]'
							}, {
								fieldLabel: '截止时间',
								name: recordField + '[end]'
							}]
						};
					} else if (recordType == 'numberfield') {
						searchField = {
							xtype: 'fieldset',
							layout: 'hbox',
							title: recordLabel,
							defaultType: 'numberfield',
							fieldDefaults: {
								labelAlign: 'top',
								labelSeparator: ''
							},
							items: [exclusive,
							{
								fieldLabel: '最小值(>=)',
								name: recordField + '[min]'
							}, {
								fieldLabel: '最大值(<=)',
								name: recordField + '[max]'
							}]
						};
					} else if (recordType == '2dfield') {
						searchField = {
							xtype: 'fieldset',
							layout: 'hbox',
							title: recordLabel,
							defaultType: 'numberfield',
							fieldDefaults: {
								labelAlign: 'top',
								labelSeparator: ''
							},
							items: [{
								name: recordField + '[lng]',
								fieldLabel: '经度'
							}, {
								name: recordField + '[lat]',
								fieldLabel: '维度'
							}, {
								name: recordField + '[distance]',
								fieldLabel: '附近范围(km)'
							}]
						};
					} else if (recordType == 'boolfield') {
						searchField = {
							xtype: 'commonComboboxBoolean',
							fieldLabel: recordLabel,
							name: recordField
						};
					} else {
						searchField = {
							xtype: 'fieldset',
							layout: 'hbox',
							title: recordLabel,
							defaultType: 'textfield',
							fieldDefaults: {
								labelAlign: 'top',
								labelSeparator: ''
							},
							items: [exclusive, exactMatch,
							{
								name: recordField,
								fieldLabel: recordLabel
							}]
						};
					}

					searchFields.push(searchField);
				}
				// 创建条件检索form结束
			});

			// 完善树状结构
			gridColumns = Ext.Array.merge(gridColumns, [{
				text: "_id",
				sortable: false,
				dataIndex: '_id',
				flex: 1,
				editor: 'textfield',
				hidden: true
			}, {
				xtype: 'datecolumn',
				format: 'Y-m-d H:i:s',
				text: "创建时间",
				sortable: false,
				flex: 1,
				dataIndex: '__CREATE_TIME__'
			}, {
				xtype: 'datecolumn',
				format: 'Y-m-d H:i:s',
				text: "修改时间",
				sortable: false,
				flex: 1,
				dataIndex: '__MODIFY_TIME__',
				hidden: true
			}]);

			// 创建数据的model
			var dataModelName = 'dataModel' + __COLLECTION_ID__;
			/*
			modelFields.push({
				name: '__DOMAIN__',
				type: 'string',
				defaultValue : __DOMAIN__
			});
			modelFields.push({
				name: '__PROJECT_ID__',
				type: 'string',
				defaultValue : __PROJECT_ID__
			});
			modelFields.push({
				name: '__COLLECTION_ID__',
				type: 'string',
				defaultValue : __COLLECTION_ID__
			});
			*/
			var dataModel = Ext.define(dataModelName, {
				extend: 'icc.model.common.Model',
				fields: modelFields
			});

			// 加载数据store
			if (isTree) {
				gridColumns = Ext.Array.merge({
					xtype: 'treecolumn',
					text: treeLabel,
					flex: 2,
					sortable: false,
					dataIndex: treeField
				}, gridColumns);

				gridColumns = Ext.Array.filter(gridColumns, function(item, index, array) {
					if (item.xtype !== 'treecolumn' && item.dataIndex === treeField) {
						return false;
					}
					return true;
				});

				var dataStore = Ext.create('Ext.data.TreeStore', {
					model: dataModelName,
					autoLoad: false,
					proxy: {
						type: 'ajax',
						url: '/user/index/tree',
						extraParams: {
							__PROJECT_ID__: __PROJECT_ID__,
							__COLLECTION_ID__: __COLLECTION_ID__,
							__PLUGIN_ID__: __PLUGIN_ID__
						}
					},
					folderSort: true
				});
			} else {
				var dataStore = Ext.create('Ext.data.Store', {
					model: dataModelName,
					autoLoad: false,
					pageSize: 20,
					proxy: {
						type: 'ajax',
						url: '/user/index/index',
						extraParams: {
							__PROJECT_ID__: __PROJECT_ID__,
							__COLLECTION_ID__: __COLLECTION_ID__,
							__PLUGIN_ID__: __PLUGIN_ID__
						},
						reader: {
							type: 'json',
							root: 'result',
							totalProperty: 'total'
						}
					}
				});
			}
			
			panel = Ext.widget('userDataMain',{
				id: __COLLECTION_ID__,
				name: collection_name,
				//title: collection_name,
				__COLLECTION_ID__: __COLLECTION_ID__,
				__PROJECT_ID__: __PROJECT_ID__,
				__PLUGIN_ID__: __PLUGIN_ID__,
				gridColumns: gridColumns,
				gridStore: dataStore,
				isTree: isTree,
				searchFields: searchFields,
				addOrEditFields: addOrEditFields,
				isRowExpander: isRowExpander,
				rowBodyTpl: rowBodyTpl,
				//region:'center'
				//bodyPadding: 20
				width:'100%',
				height:'100%'
			});

			panel.on({
				beforerender: function(panel) {
					var grid = panel.down('grid') ? panel.down('grid') : panel.down('treepanel');
					grid.store.on('load', function(store, records, success) {
						if (success) {
							var loop = gridComboboxColumns.length;
							if (loop > 0) {
								Ext.Array.forEach(gridComboboxColumns, function(gridComboboxColumn) {
									var ids = [];
									for (var index = 0; index < records.length; index++) {
										ids.push(records[index].get(gridComboboxColumn.dataIndex));
									}
									ids = Ext.Array.unique(ids);

									var store = gridComboboxColumn.field.store;
									if (isTree) {
										store.proxy.extraParams.limit = 10000;
									} else {
										store.proxy.extraParams.idbComboboxSelectedValue = ids.join(',');
									}
									store.load(function() {
										loop -= 1;
										if (loop == 0) {
											grid.getView().refresh();
										}
									});
								});
							} else {
								grid.getView().refresh();
							}
						}
					});
					if (!isTree) {
						grid.store.load();
					}

				}
			});
			
			me.add(panel);
		});
	}

});