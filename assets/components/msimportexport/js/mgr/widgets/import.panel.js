Msie.panel.Import = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        url: Msie.config.connectorUrl
        , baseParams: {}
        , border: false
        , id: 'msie-panel-import'
        , baseCls: 'modx-formpanel'
        , cls: 'container'
        , items: [{
            html: '<h2>' + _('msimportexport') + ': ' + _('msimportexport.page_title_import') + '</h2>'
            , border: false
            , cls: 'modx-page-header'
        }, {
            xtype: 'modx-tabs'
            , id: 'msie-import-tabs'
            , anchor: '100% 100%'
            , forceLayout: true
            , deferredRender: false
            , stateEvents: ['tabchange']
            , getState: function () {
                return {activeTab: this.items.indexOf(this.getActiveTab())};
            }
            , items: [
                this.getImportProducts(config)
                , this.getImportSettings(config)
            ]
        }, {
            xtype: 'panel'
            , id: 'msie-panel-report'
            , layout: 'form'
            , bodyCssClass: 'tab-panel-wrapper main-wrapper'
            , hidden: true
            , items: []
        }

        ]
        , listeners: {
            'setup': {fn: this.setup, scope: this}
            , 'beforeSubmit': {fn: this.beforeSubmit, scope: this}
            , 'success': {fn: this.success, scope: this}
            , 'failure': {fn: this.failure, scope: this}
        }
    });
    Msie.panel.Import.superclass.constructor.call(this, config);
};
Ext.extend(Msie.panel.Import, MODx.FormPanel, {
    windows: {}
    , steps: 0
    , offset: 0
    , maxReconnect: 5
    , reconnect: 0
    , fields: []
    , preset: []
    , reportData: {}
    , timeout: 0
    , ext: ''
    , totalFields: 0
    , memoryLimit: ''
    , phpversion: ''
    , timeStartImport: 0
    , timeStopImport: 0
    , chart: {
        time: []
        , create: []
        , update: []
        , error: []
    }
    , getImportSettings: function (config) {
        return {
            title: _('msimportexport.tab.import_settings')
            , id: 'msie-panel-settings'
            , layout: 'form'
            , labelAlign: 'top'
            , labelSeparator: ''
            , baseCls: 'modx-formpanel'
            , cls: 'container'
            , autoHeight: true
            , collapsible: false
            , animCollapse: false
            , hideMode: 'offsets'
            , items: [{
                xtype: 'hidden'
                , id: 'msie-chart-show'
                , value: config.options.chartShow
            }, {
                xtype: 'textfield'
                , id: 'msie-delimeter'
                , fieldLabel: _('setting_msimportexport.delimeter')
                , name: 'delimeter'
                , value: config.options.delimeter
                , anchor: '100%'
            }, {
                xtype: 'textfield'
                , id: 'msie-sub_delimeter'
                , fieldLabel: _('setting_msimportexport.import.sub_delimeter')
                , description: _('setting_msimportexport.import.sub_delimeter_desc')
                , name: 'sub_delimeter'
                , value: config.options.sub_delimeter
                , anchor: '100%'
            }, {
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.import.sub_delimeter2')
                , description: _('setting_msimportexport.import.sub_delimeter2_desc')
                , name: 'sub_delimeter2'
                , value: config.options.sub_delimeter2
                , anchor: '100%'
            }, {
                xtype: 'numberfield'
                , fieldLabel: _('setting_msimportexport.time_limit')
                , description: _('setting_msimportexport.time_limit_desc')
                , name: 'time_limit'
                , value: config.options.time_limit
                , anchor: '100%'
            }, {
                xtype: 'numberfield'
                , fieldLabel: _('setting_msimportexport.memory_limit')
                , description: _('setting_msimportexport.memory_limit_desc')
                , name: 'memory_limit'
                , value: config.options.memory_limit
                , anchor: '100%'
            }, {
                xtype: 'numberfield'
                , fieldLabel: _('setting_msimportexport.import.step_limit')
                , id: 'msie-step-limit'
                , description: _('setting_msimportexport.import.step_limit_desc')
                , name: 'step_limit'
                , value: config.options.step_limit
                , anchor: '100%'
            }, {
                xtype: 'msie-combo-keys'
                , fieldLabel: _('setting_msimportexport.key')
                , description: _('setting_msimportexport.key_desc')
                , name: 'key'
                , allowBlank: false
                , value: config.options.key
                , anchor: '100%'
            }, {
                xtype: 'msie-combo-catalog'
                , fieldLabel: _('setting_msimportexport.import.root_catalog')
                , description: _('setting_msimportexport.import.root_catalog_desc')
                , name: 'catalog'
                , allowBlank: true
                , anchor: '100%'
                , value: config.options.catalog
            }, {
                xtype: 'msie-combo-ctx'
                , fieldLabel: _('setting_msimportexport.import.ctx')
                , description: _('setting_msimportexport.import.ctx_desc')
                , name: 'context'
                , allowBlank: true
                , anchor: '100%'
                , value: config.options.ctx
            }, {
                xtype: 'modx-combo-template'
                , fieldLabel: _('setting_msimportexport.import.template_category')
                , description: _('setting_msimportexport.import.template_category_desc')
                , name: 'template_category'
                , hiddenName: 'template_category'
                , allowBlank: true
                , anchor: '100%'
                , value: config.options.template_category
            }, {
                xtype: 'combo-boolean'
                , fieldLabel: _('setting_msimportexport.import.use_only_root_catalog')
                , description: _('setting_msimportexport.import.use_only_root_catalog_desc')
                , name: 'use_only_root_catalog'
                , hiddenName: 'use_only_root_catalog'
                , allowBlank: true
                , anchor: '100%'
                , value: config.options.use_only_root_catalog
            }, {
                xtype: 'combo-boolean'
                , id: 'msie-skip-empty-parent'
                , fieldLabel: _('setting_msimportexport.skip_empty_parent')
                , description: _('setting_msimportexport.skip_empty_parent_desc')
                , name: 'skip_empty_parent'
                , hiddenName: 'skip_empty_parent'
                , allowBlank: true
                , anchor: '100%'
                , value: config.options.skip_empty_parent
            }, {
                xtype: 'combo-boolean'
                , id: 'msie-create-parent'
                , fieldLabel: _('setting_msimportexport.create_parent')
                , description: _('setting_msimportexport.create_parent_desc')
                , name: 'create_parent'
                , hiddenName: 'create_parent'
                , allowBlank: true
                , anchor: '100%'
                , value: config.options.create_parent
            }, {
                xtype: 'textfield'
                , fieldLabel: _('setting_msimportexport.import.id_parent_new_product')
                , description: _('setting_msimportexport.import.id_parent_new_product_desc')
                , name: 'id_parent_new_product'
                , value: config.options.id_parent_new_product
                , anchor: '100%'
            }, {
                xtype: 'combo-boolean'
                , id: 'msie-ignore-first-line'
                , fieldLabel: _('setting_msimportexport.ignore_first_line')
                , description: _('setting_msimportexport.ignore_first_line_desc')
                , name: 'ignore_first_line'
                , hiddenName: 'ignore_first_line'
                , allowBlank: true
                , anchor: '100%'
                , value: config.options.ignore_first_line
            }, {
                xtype: 'combo-boolean'
                , fieldLabel: _('setting_msimportexport.import.check_page_title')
                , description: _('setting_msimportexport.import.check_page_title_desc')
                , name: 'check_page_title'
                , hiddenName: 'check_page_title'
                , allowBlank: true
                , anchor: '100%'
                , value: config.options.check_page_title
            }, {
                xtype: 'combo-boolean'
                , id: 'msie-debug'
                , fieldLabel: _('setting_msimportexport.debug')
                , description: _('setting_msimportexport.debug_desc')
                , name: 'debug'
                , hiddenName: 'debug'
                , allowBlank: true
                , anchor: '100%'
                , value: config.options.debug
            }, {
                xtype: 'combo-boolean'
                , fieldLabel: _('setting_msimportexport.import.utf8_encode')
                , description: _('setting_msimportexport.import.utf8_encode_desc')
                , name: 'utf8_encode'
                , hiddenName: 'utf8_encode'
                , allowBlank: true
                , anchor: '100%'
                , value: config.options.utf8_encode
            }, {
                xtype: 'fieldset'
                , title: _('msimportexport.fieldset.msop')
                , id: 'msie-fieldset-msop'
                , cls: 'x-fieldset-checkbox-toggle'
                , hideLabel: false
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'combo-boolean'
                    , fieldLabel: _('setting_msimportexport.import.msop_disable_modification')
                    , description: _('setting_msimportexport.import.msop_disable_modification_desc')
                    , name: 'msop_disable_modification'
                    , hiddenName: 'msop_disable_modification'
                    , value: config.options.msop_disable_modification
                    , store: new Ext.data.SimpleStore({
                        fields: ['d', 'v']
                        , data: [[_('yes'), 1], [_('no'), 0]]
                    })
                    , anchor: '100%'
                }, {
                    xtype: 'combo-boolean'
                    , fieldLabel: _('setting_msimportexport.import.msop_remove_modification')
                    , description: _('setting_msimportexport.import.msop_remove_modification_desc')
                    , name: 'msop_remove_modification'
                    , hiddenName: 'msop_remove_modification'
                    , value: config.options.msop_remove_modification
                    , store: new Ext.data.SimpleStore({
                        fields: ['d', 'v']
                        , data: [[_('yes'), 1], [_('no'), 0]]
                    })
                    , anchor: '100%'
                }]
            }, {
                xtype: 'fieldset'
                , title: _('msimportexport.fieldset.msoc')
                , id: 'msie-fieldset-msoc'
                , cls: 'x-fieldset-checkbox-toggle'
                , hideLabel: false
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'combo-boolean'
                    , fieldLabel: _('setting_msimportexport.import.msoc_disable_color')
                    , description: _('setting_msimportexport.import.msoc_disable_color_desc')
                    , name: 'msoc_disable_color'
                    , hiddenName: 'msoc_disable_color'
                    , value: config.options.msoc_disable_color
                    , store: new Ext.data.SimpleStore({
                        fields: ['d', 'v']
                        , data: [[_('yes'), 1], [_('no'), 0]]
                    })
                    , anchor: '100%'
                }, {
                    xtype: 'combo-boolean'
                    , fieldLabel: _('setting_msimportexport.import.msoc_remove_color')
                    , description: _('setting_msimportexport.import.msoc_remove_color_desc')
                    , name: 'msoc_remove_color'
                    , hiddenName: 'msoc_remove_color'
                    , value: config.options.msoc_remove_color
                    , store: new Ext.data.SimpleStore({
                        fields: ['d', 'v']
                        , data: [[_('yes'), 1], [_('no'), 0]]
                    })
                    , anchor: '100%'
                }]
            }, {
                xtype: 'fieldset'
                , title: _('msimportexport.fieldset.mssp')
                , id: 'msie-fieldset-mssp'
                , cls: 'x-fieldset-checkbox-toggle'
                , hideLabel: false
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'combo-boolean'
                    , fieldLabel: _('setting_msimportexport.import.mssp_remove')
                    , description: _('setting_msimportexport.import.mssp_remove_desc')
                    , name: 'mssp_remove'
                    , hiddenName: 'mssp_remove'
                    , value: config.options.mssp_remove
                    , store: new Ext.data.SimpleStore({
                        fields: ['d', 'v']
                        , data: [[_('yes'), 1], [_('no'), 0]]
                    })
                    , anchor: '100%'
                }]
            }, {
                xtype: 'fieldset'
                , title: _('msimportexport.fieldset.mspr')
                , id: 'msie-fieldset-mspr'
                , cls: 'x-fieldset-checkbox-toggle'
                , hideLabel: false
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'combo-boolean'
                    , fieldLabel: _('setting_msimportexport.import.mspr_remove')
                    , description: _('setting_msimportexport.import.mspr_remove_desc')
                    , name: 'mspr_remove'
                    , hiddenName: 'mspr_remove'
                    , value: config.options.mspr_remove
                    , store: new Ext.data.SimpleStore({
                        fields: ['d', 'v']
                        , data: [[_('yes'), 1], [_('no'), 0]]
                    })
                    , anchor: '100%'
                }]
            }, {
                title: _('msimportexport.export.settings_gallery')
                , xtype: 'fieldset'
                , cls: 'x-fieldset-checkbox-toggle'
                , style: 'padding-top: 5px'
                , id: 'msie-fieldset-import-settings-gallery'
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
                    xtype: 'textfield'
                    , fieldLabel: _('setting_msimportexport.import.image_base_path')
                    , description: _('setting_msimportexport.import.image_base_path_desc')
                    , name: 'gallery_image_base_path'
                    , value: config.options.gallery_image_base_path
                    , anchor: '100%'
                }, {
                    xtype: 'combo-boolean'
                    , fieldLabel: _('setting_msimportexport.gallery.remove_before_import')
                    , description: _('setting_msimportexport.gallery.remove_before_import_desc')
                    , name: 'gallery_remove_before_import'
                    , hiddenName: 'gallery_remove_before_import'
                    , allowBlank: true
                    , store: new Ext.data.SimpleStore({
                        fields: ['d', 'v']
                        , data: [[_('yes'), 1], [_('no'), 0]]
                    })
                    , anchor: '100%'
                    , value: config.options.gallery_remove_before_import
                }]
            }, {
                title: _('msimportexport.fieldset.text_format')
                , xtype: 'fieldset'
                , cls: 'x-fieldset-checkbox-toggle'
                , style: 'padding-top: 5px'
                , id: 'msie-fieldset-import-text-format'
                , hideLabel: true
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'msie-combo-text-format'
                    , fieldLabel: _('setting_msimportexport.import.text_format_method')
                    , description: _('setting_msimportexport.import.text_format_method_desc')
                    , name: 'text_format_method'
                    , value: config.options.text_format_method
                    , anchor: '100%'
                }, {
                    xtype: 'textfield'
                    , fieldLabel: _('setting_msimportexport.import.text_format_fields')
                    , description: _('setting_msimportexport.import.text_format_fields_desc')
                    , name: 'text_format_fields'
                    , value: config.options.text_format_fields
                    , anchor: '100%'
                }]
            }, {
                title: _('msimportexport.import.settings_link')
                , xtype: 'fieldset'
                , cls: 'x-fieldset-checkbox-toggle'
                , style: 'padding-top: 5px'
                , id: 'msie-fieldset-import-settings-link'
                , hideLabel: true
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'combo-boolean'
                    , fieldLabel: _('setting_msimportexport.import.remove_link')
                    , description: _('setting_msimportexport.import.remove_link_desc')
                    , value: config.options.remove_link
                    , name: 'remove_link'
                    , hiddenName: 'remove_link'
                    , store: new Ext.data.SimpleStore({
                        fields: ['d', 'v']
                        , data: [[_('yes'), 1], [_('no'), 0]]
                    })
                    , anchor: '100%'
                }]
            }, {
                title: _('msimportexport.import.cron')
                , xtype: 'fieldset'
                , id: 'msie-fieldset-import-settings-cron'
                , cls: 'x-fieldset-checkbox-toggle'
                , style: 'padding-top: 5px'
                , hideLabel: true
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: 'msie-panel-cron'
                    , type: 1
                    , options: config.options
                }]
            }]
        }
    }
    , getImportProducts: function (config) {
        var self = this;
        return {
            title: _('msimportexport.tab.import')
            , layout: 'form'
            , labelAlign: 'top'
            , labelSeparator: ''
            , baseCls: 'modx-formpanel'
            , cls: 'container'
            , autoHeight: true
            , collapsible: false
            , animCollapse: false
            , hideMode: 'offsets'
            , items: [{
                xtype: 'msie-combo-import-type'
                , fieldLabel: _('msimportexport.import.label.type_import')
                , name: 'import_type'
                , id: 'msie-import-type'
                , anchor: '72.5%'
                , value: Ext.state.Manager.get('msie_import-type') ? Ext.state.Manager.get('msie_import-type') : 'products'
                ,
                listeners: {
                    select: function (ele, rec, idx) {
                        self.hidePanelFields();
                        self.setReport();
                        self.reloadPresets(ele.value);
                        Ext.getCmp('msie-import-filename').setValue('');
                        Ext.state.Manager.set('msie_import-type', ele.value);
                    }
                }
            }, {
                layout: 'column'
                , border: false
                , fieldLabel: _('msimportexport.import_filename')
                , items: [{
                    xtype: 'textfield'
                    , name: 'filename'
                    , id: 'msie-import-filename'
                    , readOnly: true
                    , allowBlank: true
                    , msgTarget: 'under'
                    , columnWidth: .7
                }, {
                    xtype: 'button'
                    , text: _('msimportexport.import_upload')
                    , scope: this
                    , handler: this.uploadFile
                }, {
                    xtype: 'button'
                    , text: _('msimportexport.btn_import')
                    , cls: 'primary-button'
                    , scope: this
                    , handler: this.import
                }]
            }, {
                xtype: 'label',
                html: _('msimportexport.import_upload_help'),
                cls: 'desc-under'
            }, {
                xtype: 'panel'
                , id: 'msie-setting-fields'
                , layout: 'form'
                , bodyStyle: 'padding-top: 15px'
                , hidden: true
                , items: [{
                    html: '<h3>' + _('msimportexport.setting.fields') + '</h3>'
                    , border: false
                }, {
                    layout: 'column'
                    , border: false
                    , labelAlign: 'top'
                    , fieldLabel: _('msimportexport.preset_fields')
                    , items: [{
                        xtype: 'msie-combo-presets'
                        ,
                        id: 'msie-combo-presets'
                        ,
                        hiddenName: 'preset'
                        ,
                        columnWidth: .4
                        ,
                        allowBlank: true
                        ,
                        type: Ext.getCmp('msie-import-type') ? Ext.getCmp('msie-import-type').getValue() : (Ext.state.Manager.get('msie_import-type') ? Ext.state.Manager.get('msie_import-type') : 'products')
                        ,
                        listeners: {
                            select: {fn: this.changePreset, scope: this}
                        }
                    }, {
                        xtype: 'button'
                        , text: '<i class="icon icon-cog"></i> '
                        , scope: this
                        , handler: this.presetsList
                    }, {
                        xtype: 'button'
                        , id: 'msie-btn-auto-set-field'
                        , text: '<i class="icon icon-magic"></i> '
                        , tooltip: _('msimportexport.import.tooltip.auto_set_field')
                        , scope: this
                        , handler: this.autoSetField
                    }]
                }, {
                    xtype: 'panel'
                    , bodyStyle: 'padding-top: 15px'
                    , layout: 'form'
                    , id: 'msie-panel-fields'
                    , items: []
                }]
            }]
        };
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
                        this.buildFieldsList();
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
    , hidePanelFields: function () {
        var panel = Ext.getCmp('msie-setting-fields');
        panel.hide();
        this.fields = [];
    }
    , showPanelFields: function () {
        var panel = Ext.getCmp('msie-setting-fields');
        panel.show();
    }

    , buildFieldsList: function () {
        var type = Ext.getCmp('msie-import-type').getValue();
        if (this.fields) {
            var panel = Ext.getCmp('msie-panel-fields');
            if (panel) {
                panel.removeAll();
                for (var i = 0; i < this.fields.length; i++) {
                    var col = {
                        layout: 'column'
                        , border: false
                        , labelAlign: 'top'
                        , fieldLabel: _('msimportexport.col_num') + (i + 1)
                        , items: [{
                            xtype: 'textfield'
                            , readOnly: true
                            , columnWidth: .6
                            , value: this.fields[i]
                        }, {
                            xtype: 'msie-combo-fields'
                            , id: 'msie-combo-field-' + i
                            , value: this.preset[i] ? this.preset[i] : -1
                            , type: type
                            , msgTarget: 'under'
                            , columnWidth: .39999999
                        }]
                    };
                    panel.add(col);
                    panel.doLayout();
                }
            }
        }
    }
    , setFieldsError: function (errors) {
        errors = errors || [];
        var f, e;
        for (var i = 0; i < errors.length; i++) {
            e = errors[i];
            if (f = Ext.getCmp('msie-combo-field-' + e.id)) {
                f.markInvalid(e.msg);
            }
        }
    },
    getFieldIndex: function (field) {
        if (self.fields) {
            for (var i = 0; i < self.fields.length; i++) {
                if (self.fields[i] == field && field != -1) {
                    return i;
                }
            }
        }
        return -1;
    }
    , reloadPresets: function (type) {
        var presets = Ext.getCmp('msie-combo-presets');
        if (type) presets.baseParams.type = type
        presets.reload();
        presets.setValue('');
        this.preset = [];
    }
    , resetFieldsList: function (type) {
        this.reloadPresets(type);
        this.buildFieldsList();
    }
    , resetChart: function () {
        this.chart = {
            time: []
            , create: []
            , update: []
            , error: []
        };
    }
    , setReport: function (data) {
        var panel = Ext.getCmp('msie-panel-report')
            , diffTimeImport = this.timeStopImport - this.timeStartImport
            , d = new Date(diffTimeImport)
            , totalTimeImport = Highcharts.dateFormat('%H:%M:%S.', diffTimeImport) + d.getMilliseconds()
            , chartShow = parseInt(Ext.getCmp('msie-chart-show').getValue());
        panel.removeAll();
        panel.hide();
        if (data) {
            var items = [{
                html: '<h2>' + _('msimportexport.result.report') + '</h2>'
                , border: false
            }];
            for (var key in data) {
                if (key === 'seek') {
                    continue;
                }
                if (key !== 'uri') {
                    items.push({
                        xtype: 'label'
                        ,
                        style: {display: 'block'}
                        ,
                        html: _('msimportexport.result.' + key) + (key == 'errors' ? ('<a href="' + Msie.config.managerUrl + '?a=system/event" target="_blank">' + data[key] + '</a>') : ('<span> ' + data[key] + '</span>'))
                    });
                }
            }
            if (data.uri) {
                items.push({
                    html: '<h2>' + _('msimportexport.result.report.uri') + '</h2>'
                    , style: {'padding-top': '20px'}
                    , border: false
                });
                for (var key in data.uri) {
                    items.push({
                        xtype: 'label'
                        ,
                        style: {display: 'block'}
                        ,
                        html: _('msimportexport.result.' + key) + (key == 'errors' ? ('<a href="' + Msie.config.managerUrl + '?a=system/event" target="_blank">' + data.uri[key] + '</a>') : ('<span> ' + data.uri[key] + '</span>'))
                    });
                }
                if (data.uri.failed) {
                    items.push({
                        xtype: 'msie-resource-duplicate-grid'
                        , style: {'padding-top': '25px'}
                    });
                }
            }
            items.push({
                xtype: 'label'
                , style: {display: 'block'}
                , html: _('msimportexport.result.time') + '<span> ' + totalTimeImport + '</span>'
            });
            if (chartShow) {
                items.push({
                    xtype: 'msie-panel-chart'
                    , dataset: {
                        data: this.chart
                        , sys: {
                            timeout: this.timeout
                            , memoryLimit: this.memoryLimit
                            , chunk: Ext.getCmp('msie-step-limit').getValue()
                            , phpversion: this.phpversion
                            , rows: this.reportData.rows
                            , totalFields: this.totalFields
                            , ext: this.ext
                        }
                    }
                });
            }
            panel.add(items);
            panel.doLayout();
            panel.show();

        }

    }
    , uploadFile: function (btn, e) {
        var data = this.getForm().getValues();
        var self = this;
        this.setReport();
        this.windows.upload = MODx.load({
            xtype: 'msie-window-upload'
            , listeners: {
                'success': function (o) {
                    if (o.a.result.object) {
                        var panel = Ext.getCmp('msie-panel-import');
                        Ext.getCmp('msie-import-filename').setValue(o.a.result.object.filename);

                        self.fields = o.a.result.object.fields;
                        self.resetChart();
                        self.showPanelFields();
                        self.buildFieldsList();
                        self.ext = Ext.util.Format.uppercase(o.a.result.object.filename.split('.').pop());
                        self.steps = o.a.result.object.steps;
                        self.offset = 0;
                        self.reportData = {};
                        self.totalFields = self.fields.length;
                        self.timeout = o.a.result.object.timeout;
                        self.memoryLimit = o.a.result.object.memory_limit;
                        self.phpversion = o.a.result.object.phpversion;
                    }
                    this.close();
                }
            }
        });
        this.windows.upload.setValues(data);
        this.windows.upload.show(e.target);
    }
    , mergeImportData: function (slave, master) {
        var tmp = {};
        master = master || {};
        for (var key in slave) {
            if (Ext.isNumber(slave[key])) {
                if (!master[key]) {
                    master[key] = 0;
                }
                tmp[key] = master[key] + slave[key];
            } else {
                if (!master[key]) {
                    master[key] = {};
                }
                tmp[key] = this.mergeImportData(slave[key], master[key]);
            }
        }
        return tmp;

    }
    , _import: function (params) {
        this.offset++;
        var timeStart = new Date().getTime();
        var self = this;
        try {
            Ext.Ajax.request({
                url: Msie.config.connectorUrl
                , params: params
                , success: function (e) {
                    e = Ext.decode(e.responseText);
                    if (!e.success) {
                        if (e.message) Ext.Msg.alert(_('error'), e.message);
                        if (e.data && e.data.length) {
                            self.setFieldsError(e.data);
                        }
                        Ext.Msg.hide();
                        return;
                    }
                    if (e.object) {
                        //Ext.MessageBox.updateProgress((this.offset/this.steps) , this.offset+'/'+this.steps);
                        var debug = parseInt(Ext.getCmp('msie-debug').getValue());
                        Ext.MessageBox.updateProgress((self.offset / self.steps), self.offset);
                        self.reconnect = 0;
                        self.chart.time.push(new Date().getTime() - timeStart);
                        self.chart.create.push(e.object.create);
                        self.chart.update.push(e.object.update);
                        self.chart.error.push(e.object.errors);
                        if (e.object.seek > 0 && debug != 1) {
                            params.seek = e.object.seek;
                            params.offset = self.offset;
                            self.reportData = self.mergeImportData(e.object, self.reportData);
                            self._import(params);
                        } else {
                            Ext.Msg.hide();
                            self.timeStopImport = new Date().getTime();
                            self.reportData = self.mergeImportData(e.object, self.reportData);
                            self.hidePanelFields();
                            self.setReport(self.reportData);
                        }
                    }
                }
                , failure: function (e) {
                    if (e.status == 502) {
                        if (self.maxReconnect > self.reconnect) {
                            self.offset--;
                            Ext.Msg.show({
                                title: _('please_wait')
                                , msg: _('msimportexport.mess.import')
                                , width: 340
                                , progress: true
                                , closable: false
                            });
                            self._import(params);
                        } else {
                            console.log('Exceeded the maximum number of reconnections: ' + self.maxReconnect + ' offset : ' + self.offset);
                        }
                        self.reconnect++;
                    } else {
                        console.log(e);
                    }
                }
            });
        } catch (e) {
            console.log("error", e);
        }

    }
    , import: function (btn, e) {
        var filename = Ext.getCmp('msie-import-filename')
            , presets = Ext.getCmp('msie-combo-presets');
        if (!presets.hasValid()) return;
        if (filename.getValue()) {
            var filename = Ext.getCmp('msie-import-filename');
            var params = this.getForm().getValues();
            params.action = 'mgr/import/import';
            params.steps = this.steps;
            params.seek = 0;
            Ext.Msg.show({
                title: _('please_wait')
                , msg: _('msimportexport.mess.import')
                , width: 340
                , progress: true
                , closable: false
            });
            Ext.getCmp('msie-import-filename').setValue('');
            this.timeStartImport = new Date().getTime();
            this._import(params);
        } else {
            this.getForm().markInvalid({'filename': _('msimportexport.err.err_ns')});
        }

    }
    , presetsList: function (btn, e) {
        var type = Ext.getCmp('msie-import-type');
        this.windows.presetsList = MODx.load({
            xtype: 'msie-window-presets'
            , title: _('msimportexport.preset.title.win_list') + '"' + type.getRawValue() + '"'
            , type: type.getValue()
            , act: 1
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
    , autoSetField: function () {
        var self = this;
        Ext.MessageBox.show({
            title: _('warning'),
            msg: _('msimportexport.warning.auto_set_field'),
            width: 450,
            buttons: Ext.MessageBox.OKCANCEL,
            icon: Ext.MessageBox.WARNING,
            fn: function (btn, text) {
                if (btn == 'ok') {
                    if (self.fields) {
                        for (var i = 0; i < self.fields.length; i++) {
                            var combo = Ext.getCmp('msie-combo-field-' + i);
                            if (combo && combo.getValue() == -1) {
                                var val = self.fields[i] ? self.fields[i] : -1;
                                val = Ext.util.Format.trim(val);
                                combo.setValue(val);
                            }
                        }
                    }
                }
            }
        });
    }
    , beforeSubmit: function (o) {
        this.setReport();
        Ext.apply(o.form.baseParams, {});
    }
    , success: function (o) {
        self.timeout = o.result.object.timeout;
        self.memoryLimit = o.result.object.memory_limit;
        Ext.getCmp('msie-btn-save').setDisabled(false);
    }, failure: function (o) {
        if (o.result.errors) {
            this.setFieldsError(o.result.errors);
        }
    }
    , setup: function () {
        if (!this.mask) {
            this.mask = new Ext.LoadMask(this.getEl());
        }
    }
});
Ext.reg('msie-panel-import', Msie.panel.Import);

Msie.window.uploadFile = function (config) {
    config = config || {};
    this.ident = config.ident || 'gupit' + Ext.id();
    var type = Ext.getCmp('msie-import-type');
    Ext.applyIf(config, {
        title: _('msimportexport.win.upload_title')
        , id: this.ident
        , autoHeight: true
        , saveBtnText: _('msimportexport.import_upload')
        , url: Msie.config.connectorUrl
        , baseParams: {
            action: 'mgr/import/upload'
            , delimeter: Ext.getCmp('msie-delimeter').getValue()
            , ignore_first_line: Ext.getCmp('msie-ignore-first-line').getValue()
            , type: type.getValue()
        }
        , fileUpload: true
        , fields: [{
            layout: 'column'
            , border: false
            , defaults: {
                layout: 'form'
                , labelAlign: 'top'
                , border: false
                , cls: (MODx.config.connector_url) ? '' : 'main-wrapper' // check for 2.3
                , labelSeparator: ''
            }
            , items: [{
                columnWidth: 1
                , items: [{
                    xtype: (MODx.config.connector_url) ? 'fileuploadfield' : 'textfield' // check for 2.3
                    , inputType: (MODx.config.connector_url) ? 'text' : 'file' // check for 2.3
                    , fieldLabel: _('msimportexport.file')
                    , name: 'file'
                    , id: this.ident + '-file'
                    , anchor: '100%'
                }]
            }]
        }]
    });
    Msie.window.uploadFile.superclass.constructor.call(this, config);
};
Ext.extend(Msie.window.uploadFile, MODx.Window);
Ext.reg('msie-window-upload', Msie.window.uploadFile);