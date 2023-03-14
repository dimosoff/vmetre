Msie.panel.ExportSettings = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        id: 'msie-panel-export-settings'
        , border: false
        , deferredRender: false
        , forceLayout: true
        , items: [{
            layout: 'column'
            , border: false
            , anchor: '100%'
            , id: 'msie-panel-settings-columns'
            , defaults: {
                labelSeparator: ''
                , labelAlign: 'top'
                , border: false
                , msgTarget: 'under'
            }
            , items: [{
                columnWidth: .5
                , layout: 'form'
                , id: 'msie-panel-settings-left'
                , items: [{
                    xtype: 'numberfield'
                    , fieldLabel: _('setting_msimportexport.export.depth')
                    , description: _('setting_msimportexport.export.depth_desc')
                    , name: 'depth'
                    , value: config.options.depth
                    , anchor: '100%'
                }, {
                    xtype: 'numberfield'
                    , fieldLabel: _('setting_msimportexport.export.limit')
                    , description: _('setting_msimportexport.export.limit_desc')
                    , name: 'limit'
                    , value: config.options.limit
                    , anchor: '100%'
                }, {
                    xtype: 'combo-boolean'
                    , fieldLabel: _('setting_msimportexport.export.debug')
                    , description: _('setting_msimportexport.export.debug_desc')
                    , name: 'debug'
                    , hiddenName: 'debug'
                    , allowBlank: true
                    , anchor: '100%'
                    , value: config.options.debug
                }, {
                    xtype: 'msie-combo-ctx'
                    , fieldLabel: _('setting_msimportexport.import.ctx')
                    , description: _('setting_msimportexport.import.ctx_desc')
                    , name: 'context'
                    , allowBlank: true
                    , anchor: '100%'
                    , value: config.options.ctx
                }, {
                    xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
                    , mimeType: 'application/json'
                    , height: 150
                    , fieldLabel: _('setting_msimportexport.export.where')
                    , name: 'where'
                    , allowBlank: true
                    , anchor: '100%'
                    , value: config.options.where
                }, {
                    xtype: MODx.expandHelp ? 'label' : 'hidden'
                    , html: _('setting_msimportexport.export.where_desc')
                    , cls: 'desc-under'
                }
                    , this.getSettingsCSV(config)
                    , this.getSettingsYmarket(config)
                    , this.getSettingsGallery(config)
                ]
            }, {
                columnWidth: .5
                , title: _('msimportexport.category_tree')
                , id: 'msie-panel-settings-right'
                , style: 'margin-top: 12px;'
                , items: [{
                    xtype: 'msie-tree-categories'
                }]
            }]
        }]
    });
    Msie.panel.ExportSettings.superclass.constructor.call(this, config);
    this.on('render', function () {
        this.mask = new Ext.LoadMask(this.getEl());
    }, this);
};
Ext.extend(Msie.panel.ExportSettings, MODx.Panel, {
    windows: {}
    , preset: []
    , getSettingsCSV: function (config) {
        config = config || {};
        var items = [];
        return {
            title: _('msimportexport.export.settings_csv')
            , xtype: 'fieldset'
            , cls: 'x-fieldset-checkbox-toggle'
            , style: 'padding-top: 5px'
            , id: 'msie-fieldset-export-settings-csv'
            , hideLabel: true
            , collapsible: true
            , stateful: true
            , stateEvents: ['collapse', 'expand']
            , items: [{
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.export.delimeter')
                , name: 'delimeter'
                , value: config.options.delimeter
                , anchor: '100%'
            }, {
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.export.sub_delimeter')
                , description: _('setting_msimportexport.export.sub_delimeter_desc')
                , name: 'sub_delimeter'
                , value: config.options.sub_delimeter
                , anchor: '100%'
            }, {
                xtype: 'combo-boolean'
                , fieldLabel: _('setting_msimportexport.export.head')
                , description: _('setting_msimportexport.export.head_desc')
                , name: 'head'
                , hiddenName: 'head'
                , allowBlank: false
                , anchor: '100%'
                , inputValue: 0
                , value: config.options.head || 0
            }, {
                xtype: 'combo-boolean'
                , fieldLabel: _('setting_msimportexport.export.image_scheme')
                , description: _('setting_msimportexport.export.image_scheme_desc')
                , name: 'image_scheme'
                , hiddenName: 'image_scheme'
                , allowBlank: false
                , anchor: '100%'
                , inputValue: 0
                , value: config.options.imageScheme || 0
            }, {
                title: _('setting_msimportexport.export.head_alias')
                , description: _('setting_msimportexport.export.head_alias_desc')
                , xtype: 'fieldset'
                , cls: 'x-fieldset-checkbox-toggle'
                , style: 'padding-top: 5px'
                , id: 'msie-fieldset-export-head-alias'
                , hideLabel: true
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'msie-grid-alias'
                }]
            }, {
                xtype: 'combo-boolean'
                , fieldLabel: _('setting_msimportexport.export.convert_date')
                , description: _('setting_msimportexport.export.convert_date_desc')
                , name: 'convert_date'
                , hiddenName: 'convert_date'
                , allowBlank: false
                , anchor: '100%'
                , inputValue: 0
                , value: config.options.convert_date || 0
            }, {
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.export.format_date')
                , description: _('setting_msimportexport.export.format_date_desc')
                , name: 'format_date'
                , value: config.options.format_date
                , anchor: '100%'
            }, {
                xtype: 'combo-boolean'
                , fieldLabel: _('setting_msieimport.export.column_auto_size')
                , description: _('setting_msieimport.export.column_auto_size_desc')
                , name: 'column_auto_size'
                , hiddenName: 'column_auto_size'
                , allowBlank: false
                , anchor: '100%'
                , inputValue: 0
                , value: config.options.columnAutoAize || 0
            }, {
                xtype: 'panel'
                , title: _('msimportexport.export.settings.fields_csv')
                , layout: 'form'
                , style: 'padding-top: 20px'
                , items: [{
                    xtype: 'msie-combo-export-type'
                    , fieldLabel: _('msimportexport.export.label_type')
                    , id: 'msie-export-setting-type'
                    , anchor: '100%'
                    , hiddenName: 'export_type'
                    , columnWidth: .8
                    , listeners: {
                        select: {
                            fn: function (ele) {
                                this.resetFieldsList(ele.getValue());
                                Ext.getCmp('msie-column-settings-presets').show().doLayout();
                            }, scope: this
                        }
                    }
                }, {
                    layout: 'column'
                    , border: false
                    , labelAlign: 'top'
                    , fieldLabel: _('msimportexport.preset_fields')
                    , id: 'msie-column-settings-presets'
                    , hidden: true
                    , items: [{
                        xtype: 'msie-combo-presets'
                        , id: 'msie-combo-setting-presets'
                        , hiddenName: 'preset'
                        , columnWidth: .9
                        , allowBlank: true
                        , act: 2
                        , listeners: {
                            select: {fn: this.changePreset, scope: this}
                        }
                    }, {
                        xtype: 'button'
                        , text: '<i class="icon icon-cog"></i> '
                        , scope: this
                        , handler: this.presetsList
                    }]
                }, {
                    layout: 'column'
                    , border: false
                    , labelAlign: 'top'
                    , hidden: true
                    , id: 'msie-column-settings-field-count'
                    , fieldLabel: _('msimportexport.amount.fields')
                    , items: [{
                        xtype: 'numberfield'
                        , id: 'msie-panel-settings-field-count'
                        , columnWidth: .7
                        , description: _('msimportexport.export.settings.field_count_desc')
                        , value: 1
                    }, {
                        xtype: 'button'
                        , text: _('msimportexport.btn_add_field')
                        , cls: 'primary-button'
                        , listeners: {
                            'click': {
                                fn: function () {
                                    this.addCSVField();
                                }, scope: this
                            }
                        }
                    }, {
                        xtype: 'button'
                        , text: _('msimportexport.btn_remove_all_field')
                        , listeners: {
                            'click': {fn: this.removeAllCSVField, scope: this}
                        }
                    }]
                }, {
                    xtype: 'panel'
                    , bodyStyle: 'padding-top: 15px'
                    , layout: 'form'
                    , id: 'msie-panel-settings-fields-csv'
                    , items: items
                }]
            }]
        };
    }
    , getSettingsYmarket: function (config) {
        return {
            title: _('msimportexport.export.settings_ymarket')
            , xtype: 'fieldset'
            , cls: 'x-fieldset-checkbox-toggle'
            , style: 'padding-top: 5px'
            , id: 'msie-fieldset-export-settings-ymarket'
            , hideLabel: true
            , collapsible: true
            , stateful: true
            , stateEvents: ['collapse', 'expand']
            , items: [{
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.export.ym.name')
                , description: _('setting_msimportexport.export.ym.name_desc')
                , name: 'ym_name'
                , value: config.options.ym.name
                , anchor: '100%'
            }, {
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.export.ym.company')
                , description: _('setting_msimportexport.export.ym.company_desc')
                , name: 'ym_company'
                , value: config.options.ym.company
                , anchor: '100%'
            }, {
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.export.ym.currencies')
                , description: _('setting_msimportexport.export.ym.currencies_desc')
                , name: 'ym_currencies'
                , value: config.options.ym.currencies
                , anchor: '100%'
            }, {
                xtype: 'msie-combo-export-currency-default'
                , fieldLabel: _('setting_msimportexport.export.ym.default_currency')
                , description: _('setting_msimportexport.export.ym.default_currency_desc')
                , name: 'ym_default_currency'
                , value: config.options.ym.default_currency
                , anchor: '100%'
            }, {
                xtype: 'msie-combo-export-currency-rate'
                , fieldLabel: _('setting_msimportexport.export.ym.currency_rate')
                , description: _('setting_msimportexport.export.ym.currency_rate_desc')
                , name: 'ym_currency_rate'
                , value: config.options.ym.currency_rate
                , anchor: '100%'
            }, {
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.export.ym.delivery_field')
                , description: _('setting_msimportexport.export.ym.delivery_field_desc')
                , name: 'ym_delivery_field'
                , value: config.options.ym.delivery_field
                , anchor: '100%'
            }, {
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.export.ym.in_stock_field')
                , description: _('setting_msimportexport.export.ym.in_stock_field_desc')
                , name: 'ym_in_stock_field'
                , value: config.options.ym.in_stock_field
                , anchor: '100%'
            }, {
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.export.ym.pickup_field')
                , description: _('setting_msimportexport.export.ym.pickup_field_desc')
                , name: 'ym_pickup_field'
                , value: config.options.ym.pickup_field
                , anchor: '100%'
            }, {
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.export.ym.sales_notes_field')
                , description: _('setting_msimportexport.export.ym.sales_notes_field_desc')
                , name: 'ym_sales_notes_field'
                , value: config.options.ym.sales_notes_field
                , anchor: '100%'
            }, {
                xtype: 'msie-export-ym-params-grid'
                , fieldLabel: _('setting_msimportexport.export.ym.param_fields')
                , anchor: '100%'
            }, {
                title: _('msimportexport.export.cron')
                , xtype: 'fieldset'
                , cls: 'x-fieldset-checkbox-toggle'
                , style: 'padding-top: 5px'
                , id: 'msie-fieldset-export-cron'
                , hideLabel: true
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'textfield'
                    , fieldLabel: _('msimportexport.export.cron_url')
                    , value: Msie.config.exportUrl + '?token=' + Msie.config.token
                    , allowBlank: true
                    , readOnly: true
                    , anchor: '100%'
                }]
            }]
        };
    }
    , getSettingsGallery: function (config) {
        return {
            title: _('msimportexport.export.settings_gallery')
            , xtype: 'fieldset'
            , cls: 'x-fieldset-checkbox-toggle'
            , style: 'padding-top: 5px'
            , id: 'msie-fieldset-export-settings-gallery'
            , hideLabel: true
            , collapsible: true
            , stateful: true
            , stateEvents: ['collapse', 'expand']
            , items: [{
                xtype: 'msie-combo-gallery'
                , fieldLabel: _('setting_msimportexport.gallery.class_name')
                , description: _('setting_msimportexport.gallery.class_name_desc')
                , name: 'gallery_class_name'
                , value: config.options.gallery_class_name
                , anchor: '100%'
            }, {
                xtype: 'combo-boolean'
                , fieldLabel: _('setting_msimportexport.gallery.copy_image')
                , description: _('setting_msimportexport.gallery.copy_image_desc')
                , value: config.options.gallery_copy_image
                , name: 'gallery_copy_image'
                , hiddenName: 'gallery_copy_image'
                , store: new Ext.data.SimpleStore({
                    fields: ['d', 'v']
                    , data: [[_('yes'), 1], [_('no'), 0]]
                })
                , anchor: '100%'
            }, {
                xtype: 'combo-boolean'
                , fieldLabel: _('setting_msimportexport.gallery.zip')
                , description: _('setting_msimportexport.gallery.zip_desc')
                , value: config.options.gallery_zip
                , name: 'gallery_zip'
                , hiddenName: 'gallery_zip'
                , store: new Ext.data.SimpleStore({
                    fields: ['d', 'v']
                    , data: [[_('yes'), 1], [_('no'), 0]]
                })
                , anchor: '100%'
            }, {
                xtype: 'combo-boolean'
                , fieldLabel: _('setting_msimportexport.gallery.clear_dir')
                , description: _('setting_msimportexport.gallery.clear_dir_desc')
                , value: config.options.gallery_clear_dir
                , name: 'gallery_clear_dir'
                , hiddenName: 'gallery_clear_dir'
                , store: new Ext.data.SimpleStore({
                    fields: ['d', 'v']
                    , data: [[_('yes'), 1], [_('no'), 0]]
                })
                , anchor: '100%'
            }, {
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.gallery.copy_image_path')
                , description: _('setting_msimportexport.gallery.copy_image_path_desc')
                , name: 'gallery_copy_image_path'
                , value: config.options.gallery_copy_image_path
                , anchor: '100%'
            }, {
                xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
                , mimeType: 'application/json'
                , height: 40
                , fieldLabel: _('setting_msimportexport.export_thumb_settings')
                , name: 'thumb_settings'
                , allowBlank: true
                , anchor: '100%'
                , value: config.options.thumb_settings
            }, {
                xtype: 'label',
                html: _('setting_msimportexport.export_thumb_settings_desc'),
                cls: 'desc-under'
            }]
        };
    }
    , addCSVField: function (val) {
        var count = Ext.getCmp('msie-panel-settings-field-count').getValue();
        var panel = Ext.getCmp('msie-panel-settings-fields-csv');
        var type = Ext.getCmp('msie-export-setting-type').getValue();
        var length = panel.items.length;
        count = count > 0 ? count : 1;
        for (var i = 0; i < count; i++) {
            var id = 'msie-panel-settings-field-csv-' + Ext.id();
            var index = length + i;
            var col = {
                layout: 'column'
                , id: id
                , border: false
                , labelAlign: 'top'
                , fieldLabel: '#' + (index + 1)
                , items: [{
                    xtype: 'msie-combo-export-fields'
                    , value: val ? val : ''
                    , type: type
                    , columnWidth: .8
                }, {
                    xtype: 'button'
                    ,
                    text: '<i class="' + (MODx.modx23 ? 'icon icon-trash-o' : 'bicon-trash') + '"></i> ' + _('msimportexport.btn_remove_field')
                    ,
                    columnWidth: .2
                    ,
                    pid: id
                    ,
                    listeners: {
                        'click': {fn: this.removeCSVField, scope: this}
                    }
                }]
            };
            panel.insert(index, col);
            panel.doLayout();
        }
    }
    , removeCSVField: function (e) {
        var panel = Ext.getCmp('msie-panel-settings-fields-csv');
        var item = Ext.getCmp(e.pid);
        panel.remove(item, true);
    }
    , removeAllCSVField: function () {
        var panel = Ext.getCmp('msie-panel-settings-fields-csv');
        panel.removeAll();
    }
    , presetsList: function (btn, e) {
        var type = Ext.getCmp('msie-export-setting-type');
        this.windows.presetsList = MODx.load({
            xtype: 'msie-window-presets'
            , title: _('msimportexport.preset.title.win_list') + '"' + type.getRawValue() + '"'
            , type: type.getValue()
            , act: 2
            , listeners: {
                'preset-change': {
                    fn: function () {
                        this.resetFieldsList();
                    }, scope: this
                }
            }
        });
        this.windows.presetsList.show(e.target);
    }
    , buildCSVFieldsList: function () {
        var panel = Ext.getCmp('msie-panel-settings-fields-csv');
        panel.removeAll();
        for (var i = 0; i < this.preset.length; i++) {
            this.addCSVField(this.preset[i]);
        }
    }
    , reloadPresets: function (type) {
        Ext.getCmp('msie-column-settings-field-count').hide();
        var presets = Ext.getCmp('msie-combo-setting-presets')
        if (type) {
            presets.baseParams.type = type;
        }
        presets.reload();
        presets.setValue('');
        this.preset = [];
    }
    , resetFieldsList: function (type) {
        this.reloadPresets(type);
        this.buildCSVFieldsList();
    }
    , changePreset: function (ele, rec, idx) {
        if (this.mask) {
            this.mask.show();
        }
        MODx.Ajax.request({
            url: Msie.config.connectorUrl
            , params: {
                action: 'mgr/presets/fields/get'
                , id: ele.value
            }
            , listeners: {
                'success': {
                    fn: function (r) {
                        this.mask.hide();
                        this.preset = r.object.fields ? r.object.fields : [];
                        Ext.getCmp('msie-column-settings-field-count').show().doLayout();
                        this.buildCSVFieldsList();
                    }, scope: this
                }
                , 'failure': {
                    fn: function (r) {
                        this.mask.hide();
                    }, scope: this
                }
            }
        });
    }
});
Ext.reg('msie-panel-export-settings', Msie.panel.ExportSettings);


