Msie.grid.Cron = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        url: Msie.config.connectorUrl
        , baseParams: {
            action: 'mgr/cron/getList'
            , type: config.type || 1
        }
        , cls: config['cls'] || 'main-wrapper minishop2-grid'
        , fields: ['id', 'name', 'iteration', 'params', 'schedule', 'status', 'active', 'run_user', 'date_last_ran', 'actions']
        , paging: true
        , remoteSort: true
        , anchor: '97%'
        , autoExpandColumn: 'name'
        , save_action: 'mgr/cron/updateFromGrid'
        , autosave: true
        , listeners: {
            render: function (grid) {
                this.store.on('update', this.onUpdate);
            }
        }
        , columns: [{
            header: _('msimportexport.cron.header_id')
            , dataIndex: 'id'
            , hidden: true
            , sortable: true
            , width: 100
        }, {
            header: _('msimportexport.cron.header_name')
            , dataIndex: 'name'
            , sortable: true
            , editor: {
                xtype: 'textfield'
            }
        }, {
            header: _('msimportexport.cron.header_iteration')
            , dataIndex: 'iteration'
        }, {
            header: _('msimportexport.cron.header_last_ran')
            , dataIndex: 'date_last_ran'
        }, {
            header: _('msimportexport.cron.header_status')
            , dataIndex: 'status'
            , sortable: false
            , editor: {
                xtype: 'msie-combo-cron-status',
                readOnly: true,
                renderer: true
            }
        }, {
            header: _('msimportexport.cron.header_schedule')
            , dataIndex: 'schedule'
            , renderer: function (obj) {
                var str = '';
                Ext.iterate(obj || [], function (key, val) {
                    str += str ? ' ' + val : val;
                }, this);
                return str;
            }
        }, {
            header: _('msimportexport.cron.header_active')
            , dataIndex: 'active'
            , sortable: true
            , editor: {
                xtype: 'combo-boolean',
                renderer: 'boolean'
            }
        }, {
            header: _('msimportexport.cron.header_run_user')
            , dataIndex: 'run_user'
            , sortable: true
            , editor: {
                xtype: 'combo-boolean',
                renderer: 'boolean'
            }
        }, {
            header: _('msimportexport.cron.header_actions')
            , dataIndex: 'actions'
            , width: 100
            , renderer: Msie.utils.renderActions
            , sortable: false

        }], tbar: [{
            text: _('msimportexport.cron.btn_create')
            , cls: 'primary-button'
            , scope: this
            , handler: {
                xtype: 'msie-window-cron-create'
                , blankValues: true
                , type: config.type || 1
                , listeners: {
                    'success': {fn: this.onAdd, scope: this}
                }
            }
        }, {
            xtype: 'button'
            , text: _('msimportexport.cron.btn_refresh')
            , scope: this
            , handler: this.refresh
        }]
        , getMenu: function () {
            var r = this.getSelectionModel().getSelected();
            var m = Msie.util.getMenu(r.data.actions, this, 0);
            if (this.getSelectionModel().getCount() > 1) {

            }
            if (m.length > 0) {
                this.addContextMenuItem(m);
            }
        }
        , edit: function (btn, e) {
            if (!this.editTask) {
                this.editTask = MODx.load({
                    xtype: 'msie-window-cron-edit'
                    , record: this.menu.record
                    , type: config.type || 1
                    , listeners: {
                        'success': {fn: this.refresh, scope: this}
                    }
                });
            }
            this.editTask.setData(this.menu.record);
            this.editTask.show(e.target);
        }
        , remove: function () {
            MODx.msg.confirm({
                title: _('msimportexport.title.win_remove')
                , text: _('msimportexport.cron.confirm.remove')
                , url: this.config.url
                , params: {
                    action: 'mgr/cron/remove'
                    , id: this.menu.record.id
                }
                , listeners: {
                    'success': {fn: this.onRemove, scope: this}
                }
            });
        }
        , abort: function () {
            this.cronAction('abort', this.menu.record.id);
        }
        , run: function () {
            this.cronAction('run', this.menu.record.id);
        }
    });
    Msie.grid.Cron.superclass.constructor.call(this, config)
};
Ext.extend(Msie.grid.Cron, MODx.grid.Grid, {
    onClick: function (e) {
        var elem = e.getTarget();
        if (elem.nodeName == 'BUTTON') {
            var row = this.getSelectionModel().getSelected();
            if (typeof(row) != 'undefined') {
                var action = elem.getAttribute('action');
                if (action == 'showMenu') {
                    var ri = this.getStore().find('id', row.id);
                    return this._showMenu(this, ri, e);
                }
                else if (typeof this[action] === 'function') {
                    this.menu.record = row.data;
                    return this[action](this, e);
                }
            }
        }
        return this.processEvent('click', e);
    },
    onRemove: function (r) {
        this.refresh();
        this.fireEvent('cron-remove', r.object.id);
    }
    , onAdd: function (r, d) {
        this.refresh();
        this.fireEvent('cron-add');
    }
    , onUpdate: function (store, records, operation) {
        if (operation == 'commit') {
            this.fireEvent('cron-update', records.id);
        }
    },
    cronAction: function (method, id) {
        this.getEl().mask(_('loading'), 'x-mask-loading');
        MODx.Ajax.request({
            url: Msie.config.connectorUrl,
            params: {
                action: 'mgr/cron/action',
                method: method,
                id: id
            },
            listeners: {
                success: {
                    fn: function () {
                        this.getEl().unmask();
                        this.refresh();
                    }, scope: this
                },
                failure: {
                    fn: function (e) {
                        MODx.msg.alert(_('error'), e.message);
                    }, scope: this
                },
            }
        });
    },
});
Ext.reg('msie-grid-cron', Msie.grid.Cron);


Msie.window.CreateTask = function (config) {
    config = config || {};
    var r = config.record;
    this.ident = config.ident || 'msie-cron-task-' + Ext.id();
    Ext.applyIf(config, {
        title: r.id ? _('msimportexport.cron.title.win_update') : _('msimportexport.cron.title.win_create')
        , url: Msie.config.connectorUrl
        , autoHeight: true
        , width: 600
        , modal: true
        , baseParams: {
            action: r.id ? 'mgr/cron/update' : 'mgr/cron/create'
        }
        , fields: [{
            xtype: 'hidden'
            , name: 'id'
            , value: r.id || ''
        }, {
            xtype: 'hidden'
            , name: 'type'
            , value: config.type
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msimportexport.cron.label_name')
            , name: 'name'
            , allowBlank: false
            , anchor: '100%'
            , value: r.name || ''
        }, {
            layout: 'column'
            , fieldLabel: _('msimportexport.cron.label_schedule')
            , labelAlign: 'top'
            , labelSeparator: ''
            , defaults: {
                layout: 'form'
                , labelAlign: 'top'
                , labelSeparator: ''
                , anchor: '100%'
                , border: false
            }
            , items: [{
                columnWidth: .2
                , items: [{
                    xtype: 'textfield'
                    , fieldLabel: _('msimportexport.cron.label_min')
                    , name: 'schedule[min]'
                    , value: r.id ? r.schedule.min : ''
                    , validator: this.validatorSchedule
                    , allowBlank: false
                    , anchor: '100%'
                }]
            }, {
                columnWidth: .2
                , items: [{
                    xtype: 'textfield'
                    , fieldLabel: _('msimportexport.cron.label_hour')
                    , name: 'schedule[hour]'
                    , value: r.id ? r.schedule.hour : ''
                    , allowBlank: false
                    , anchor: '100%'
                }]
            }, {
                columnWidth: .2
                , items: [{
                    xtype: 'textfield'
                    , fieldLabel: _('msimportexport.cron.label_day')
                    , name: 'schedule[day]'
                    , value: r.id ? r.schedule.day : ''
                    , allowBlank: false
                    , anchor: '100%'
                }]
            }, {
                columnWidth: .2
                , items: [{
                    xtype: 'textfield'
                    , fieldLabel: _('msimportexport.cron.label_month')
                    , name: 'schedule[month]'
                    , value: r.id ? r.schedule.month : ''
                    , allowBlank: false
                    , anchor: '100%'
                }]
            }, {
                columnWidth: .2
                , items: [{
                    xtype: 'textfield'
                    , fieldLabel: _('msimportexport.cron.label_wday')
                    , name: 'schedule[wday]'
                    , value: r.id ? r.schedule.wday : ''
                    , allowBlank: false
                    , anchor: '100%'
                }]
            }]
        }, {
            xtype: 'label'
            , html: _('msimportexport.cron.label_schedule_help')
            , cls: 'desc-under'
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msimportexport.cron.label_key')
            , description: _('msimportexport.cron.label_key_help')
            , name: 'params[key]'
            , value: r.id ? r.params.key : ''
            , allowBlank: true
            , anchor: '100%'
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msimportexport.cron.label_file')
            , description: _('msimportexport.cron.label_file_help')
            , name: 'params[file]'
            , value: r.id ? r.params.file : ''
            , allowBlank: false
            , anchor: '100%'
        }, {
            xtype: 'msie-combo-import-type'
            , fieldLabel: _('msimportexport.import.label.type_import')
            , name: 'params[type]'
            , hiddenName: 'params[type]'
            , anchor: '100%'
            , width: '100%'
            , value: r.id ? r.params.type : ''
            , allowBlank: false
            , listeners: {
                select: {
                    fn: function (ele, rec, idx) {
                        var f = this.fp.getForm(),
                            presets = f.findField('params[preset]');
                        if (ele.value) presets.baseParams.type = ele.value;
                        presets.reload();
                        presets.setValue('');
                        presets.updateAllowBlank();
                        // presets.validate();
                    }, scope: this
                }
            }
        }, {
            xtype: 'msie-combo-presets'
            , fieldLabel: _('msimportexport.cron.label_preset')
            , name: 'params[preset]'
            , value: r.id ? r.params.preset : ''
            , hiddenName: 'params[preset]'
            , type: 'products'
            , allowBlank: false
            , anchor: '100%'
            , width: '100%'
        }, {
            xtype: 'combo-boolean'
            , fieldLabel: _('msimportexport.cron.label_active')
            , name: 'active'
            , hiddenName: 'active'
            , allowBlank: false
            , anchor: '100%'
            , value: r.active || 0
        }, {
            xtype: 'combo-boolean'
            , fieldLabel: _('msimportexport.cron.label_run_user')
            , name: 'run_user'
            , hiddenName: 'run_user'
            , allowBlank: false
            , anchor: '100%'
            , value: r.run_user || 0
        }]
    });
    Msie.window.CreateTask.superclass.constructor.call(this, config);
};
Ext.extend(Msie.window.CreateTask, MODx.Window, {
    validatorSchedule: function (v) {
        var ok = false
            , regs = [
            /^\*$/,
            /^\d{1,2}$/,
            /^\*\/\d{1,2}$/,
            /^\d{1,2}-\d{1,2}$/
        ];
        Ext.each(regs || [], function (reg, index) {
            if (reg.test(v)) {
                switch (index) {
                    case 0:
                        ok = true;
                        break;
                    case 1:
                    case 2:
                        ok = parseInt(v.replace('*/', '')) <= 59;
                        break;
                    case 3:
                        var arr = v.split('-');
                        ok = parseInt(arr[0]) <= 59 && parseInt(arr[1]) <= 59 && parseInt(arr[0]) < parseInt(arr[1]);
                        break;
                }
                return false;
            }
        });
        return ok ? true : _('msimportexport.cron.err_valid_schedule');
    },
    setData: function (record) {
        var f = this.fp.getForm(),
            presets = f.findField('params[preset]');
        if (!record.params.key) record.params.key = '';
        this.setValues(record);
        this.setFormData(record.params, 'params');
        this.setFormData(record.schedule, 'schedule');

        presets.baseParams.type = record.params.type;
        presets.reload(record.params.preset);

    },
    setFormData: function (data, name) {
        if (!data) return;
        var field,
            f = this.fp.getForm();
        Ext.iterate(data || {}, function (key, val) {
            field = f.findField(name + '[' + key + ']');
            if (field) {
                field.setValue(val);
            }
        }, this);
    }

});
Ext.reg('msie-window-cron-create', Msie.window.CreateTask);

Msie.window.EditTask = function (config) {
    config = config || {};
    Ext.applyIf(config, {});
    Msie.window.EditTask.superclass.constructor.call(this, config);
};
Ext.extend(Msie.window.EditTask, Msie.window.CreateTask);
Ext.reg('msie-window-cron-edit', Msie.window.EditTask);
