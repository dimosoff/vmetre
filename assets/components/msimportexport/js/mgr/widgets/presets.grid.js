Msie.grid.presets = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'msie-grid-presets';
    }
    Ext.applyIf(config, {
        url: Msie.config.connectorUrl
        , baseParams: {
            action: 'mgr/presets/fields/getList'
            , sort: 'id'
            , dir: 'ASC'
            , type: config.type
            , act: config.act
        }
        , autoExpandColumn: 'name'
        , save_action: 'mgr/presets/fields/updateFromGrid'
        , listeners: {
            render: function (grid) {
                this.store.on('update', this.onUpdate);
            }
        }
        /*, enableDragDrop: true
        , multi_select: true
        , ddGroup: 'dd'
        , ddAction: 'mgr/msfmstorage/sort'*/

    });
    Msie.grid.presets.superclass.constructor.call(this, config)
};
Ext.extend(Msie.grid.presets, Msie.grid.Default, {
    getFields: function () {
        return ['id', 'name', 'where', 'leftjoin', 'innerjoin', 'select', 'key', 'categories', 'properties', 'actions'];
    }
    , getColumns: function () {
        return [{
            header: _('msimportexport.preset.header_id')
            , dataIndex: 'id'
            , sortable: true
            , width: 100
        }, {
            header: _('msimportexport.preset.header_name')
            , dataIndex: 'name'
            , sortable: true
            , editor: {
                xtype: 'textfield'
            }
        }, {
            header: _('msimportexport.header_actions')
            , dataIndex: 'actions'
            , renderer: Msie.utils.renderActions
            , width: 60

        }];
    }
    , getTopBar: function (config) {
        var tbar = [];
        tbar.push({
            text: '<i class="icon icon-plus"></i> ' + _('msimportexport.preset.btn_create'),
            handler: this.createSet,
            cls: 'primary-button',
            scope: this
        });
        //tbar.push('->', this.getSearchField());

        return tbar;
    }
    , actionSet: function (method) {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.Ajax.request({
            url: Msie.config.connectorUrl,
            params: {
                action: 'mgr/presets/fields/multiple',
                method: method,
                ids: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function (response) {
                        this.refresh();
                    }, scope: this
                },
                failure: {
                    fn: function (response) {
                        MODx.msg.alert(_('error'), response.message);
                    }, scope: this
                },
            }
        })
    }
    , createSet: function (btn, e, row) {
        var record = {where: '', leftjoin: '', innerjoin: '', select: '', key: '', categories: ''};
        var grid = Ext.getCmp('msie-grid-presets');
        var w = Ext.getCmp('msie-window-preset-create');
        if (w) {
            w.close();
        }
        w = MODx.load({
            xtype: 'msie-window-preset-create'
            , id: 'msie-window-preset-create'
            , record: record
            , type: grid.baseParams.type
            , act: grid.baseParams.act
            , listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                        this.onAdd();
                    }, scope: this
                }
            }
        });
        w.fp.getForm().reset();
        w.fp.getForm().setValues(record);
        w.show(e.target);
    }
    , updateSet: function (btn, e, row) {
        if (typeof (row) != 'undefined') {
            this.menu.record = row.data;
        }
        var id = this.menu.record.id;
        var grid = Ext.getCmp('msie-grid-presets');
        MODx.Ajax.request({
            url: Msie.config.connectorUrl,
            params: {
                action: 'mgr/presets/fields/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = Ext.getCmp('msie-window-preset-update');
                        if (w) {
                            w.close();
                        }
                        var record = r.object;
                        if (record.where == null) record.where = '';
                        if (record.leftjoin == null) record.leftjoin = '';
                        if (record.innerjoin == null) record.innerjoin = '';
                        if (record.select == null) record.select = '';
                        w = MODx.load({
                            xtype: 'msie-window-preset-update',
                            id: 'msie-window-preset-update',
                            record: record,
                            type: grid.baseParams.type,
                            act: grid.baseParams.act,
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.refresh();
                                    }, scope: this
                                },
                            }
                        });
                        w.fp.getForm().reset();
                        w.fp.getForm().setValues(record);
                        w.show(e.target);
                    }, scope: this
                }
            }
        });
    }
    , duplicateSet: function () {
        MODx.Ajax.request({
            url: this.config.url
            , params: {
                action: 'mgr/presets/fields/duplicate'
                , id: this.menu.record.id
            }
            , listeners: {
                'success': {fn: this.onAdd, scope: this}
            }
        });
    }
    , removeSet: function () {
        MODx.msg.confirm({
            title: _('msimportexport.title.win_remove')
            , text: _('msimportexport.preset.confirm.remove')
            , url: this.config.url
            , params: {
                action: 'mgr/presets/fields/remove'
                , id: this.menu.record.id
            }
            , listeners: {
                'success': {fn: this.onRemove, scope: this}
            }
        });
    }
    , onRemove: function (r) {
        this.refresh();
        this.fireEvent('preset-remove', r.object.id);
    }
    , onAdd: function (r, d) {
        this.refresh();
        this.fireEvent('preset-add');
    }
    , onUpdate: function (store, records, operation) {
        if (operation == 'commit') {
            this.fireEvent('preset-update', records.id);
        }
    }
});
Ext.reg('msie-grid-presets', Msie.grid.presets);


Msie.window.CreatePreset = function (config) {
    config = config || {};
    var r = config.record;
    Ext.applyIf(config, {
        title: r.id ? _('msimportexport.preset.title.win_update') : _('msimportexport.preset.title.win_create')
        , url: Msie.config.connectorUrl
        , width: 500
        , autoHeight: true
        , modal: true
        , baseParams: {
            action: r.id ? 'mgr/presets/fields/update' : 'mgr/presets/fields/create'
            , type: config.type
            , act: config.act
        }
        , fields: this.getFields(config)
    });
    Msie.window.CreatePreset.superclass.constructor.call(this, config);
};
Ext.extend(Msie.window.CreatePreset, MODx.Window, {
    getFields: function (config) {
        var r = config.record;
        var items = [{
            xtype: 'hidden'
            , name: 'id'
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msimportexport.preset.label_name')
            , name: 'name'
            , allowBlank: false
            , anchor: '100%'
        }];
        if (config.act == 1) {
            items.push({
                xtype: 'msie-combo-keys'
                , fieldLabel: _('setting_msimportexport.key')
                , description: _('setting_msimportexport.key_desc')
                , name: 'key'
                , allowBlank: true
                , anchor: '100%'
            });
        } else {
            items.push({
                title: _('setting_msimportexport.export.where')
                , xtype: 'fieldset'
                , style: 'padding-top: 5px'
                , id: 'msie-fieldset-export-settings-preset-where'
                , hideLabel: true
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
                    , mimeType: 'application/json'
                    , height: 150
                    , name: 'where'
                    , allowBlank: true
                    , anchor: '100%'
                }, {
                    xtype: MODx.expandHelp ? 'label' : 'hidden'
                    , html: _('setting_msimportexport.export.where_desc')
                    , cls: 'desc-under'
                }]
            });

            items.push({
                title: _('setting_msimportexport.export.leftjoin')
                , xtype: 'fieldset'
                , style: 'padding-top: 5px'
                , id: 'msie-fieldset-export-settings-preset-leftjoin'
                , hideLabel: true
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
                    , mimeType: 'application/json'
                    , height: 150
                    , name: 'leftjoin'
                    , allowBlank: true
                    , anchor: '100%'
                }, {
                    xtype: MODx.expandHelp ? 'label' : 'hidden'
                    , html: _('setting_msimportexport.export.leftjoin_desc')
                    , cls: 'desc-under'
                }]
            });

            items.push({
                title: _('setting_msimportexport.export.innerjoin')
                , xtype: 'fieldset'
                , style: 'padding-top: 5px'
                , id: 'msie-fieldset-export-settings-preset-innerjoin'
                , hideLabel: true
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
                    , mimeType: 'application/json'
                    , height: 150
                    , name: 'innerjoin'
                    , allowBlank: true
                    , anchor: '100%'
                }, {
                    xtype: MODx.expandHelp ? 'label' : 'hidden'
                    , html: _('setting_msimportexport.export.innerjoin_desc')
                    , cls: 'desc-under'
                }]
            });

            items.push({
                title: _('setting_msimportexport.export.select')
                , xtype: 'fieldset'
                , style: 'padding-top: 5px'
                , id: 'msie-fieldset-export-settings-preset-select'
                , hideLabel: true
                , collapsible: true
                , stateful: true
                , stateEvents: ['collapse', 'expand']
                , items: [{
                    xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
                    , mimeType: 'application/json'
                    , height: 150
                    , name: 'select'
                    , allowBlank: true
                    , anchor: '100%'
                }, {
                    xtype: MODx.expandHelp ? 'label' : 'hidden'
                    , html: _('setting_msimportexport.export.select_desc')
                    , cls: 'desc-under'
                }]
            });
            if (r.id) {
                items.push({
                    title: _('setting_msimportexport.export.categories')
                    , xtype: 'fieldset'
                    , style: 'padding-top: 5px'
                    , id: 'msie-fieldset-export-settings-preset-categories'
                    , hideLabel: true
                    , collapsible: true
                    , stateful: true
                    , stateEvents: ['collapse', 'expand']
                    , items: [{
                        xtype: 'msie-tree-categories',
                        preset: r.id
                    }]
                });

            }
        }
        return items;
    }

});
Ext.reg('msie-window-preset-create', Msie.window.CreatePreset);

Msie.window.UpdatePreset = function (config) {
    config = config || {};
    Ext.applyIf(config, {});
    Msie.window.UpdatePreset.superclass.constructor.call(this, config);
};
Ext.extend(Msie.window.UpdatePreset, Msie.window.CreatePreset);
Ext.reg('msie-window-preset-update', Msie.window.UpdatePreset);