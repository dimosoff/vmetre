seoTemplates.window.CreateItem = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'seotemplates-item-window-create';
    }
    Ext.applyIf(config, {
        title: _('seotemplates_item_create'),
        width: 550,
        autoHeight: true,
        url: seoTemplates.config.connector_url,
        action: 'mgr/item/create',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    seoTemplates.window.CreateItem.superclass.constructor.call(this, config);
};
Ext.extend(seoTemplates.window.CreateItem, MODx.Window, {

    getFields: function (config) {
        return [{
            xtype: 'seotemplates-combo-templates',
            fieldLabel: _('seotemplates_item_template'),
            name: 'template',
            id: config.id + '-template',
            anchor: '99%',
            allowBlank: false,
            dataIndex: 'template'
        }, {
            xtype: 'seotemplates-combo-fields',
            fieldLabel: _('seotemplates_item_field'),
            name: 'field',
            id: config.id + '-field',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textarea',
            fieldLabel: _('seotemplates_item_value'),
            name: 'value',
            id: config.id + '-value',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'xcheckbox',
            boxLabel: _('seotemplates_field_active'),
            name: 'active',
            id: config.id + '-active',
            checked: true,
        }];
    },

    loadDropZones: function () {
    }

});
Ext.reg('seotemplates-item-window-create', seoTemplates.window.CreateItem);


seoTemplates.window.UpdateItem = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'seotemplates-item-window-update';
    }
    Ext.applyIf(config, {
        title: _('seotemplates_item_update'),
        width: 550,
        autoHeight: true,
        url: seoTemplates.config.connector_url,
        action: 'mgr/item/update',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    seoTemplates.window.UpdateItem.superclass.constructor.call(this, config);
};
Ext.extend(seoTemplates.window.UpdateItem, MODx.Window, {

    getFields: function (config) {
        return [{
            xtype: 'hidden',
            name: 'id',
            id: config.id + '-id',
        }, {
            xtype: 'seotemplates-combo-templates',
            fieldLabel: _('seotemplates_item_template'),
            name: 'template',
            id: config.id + '-template',
            anchor: '99%',
            allowBlank: false,
            dataIndex: 'template'
        }, {
            xtype: 'seotemplates-combo-fields',
            fieldLabel: _('seotemplates_item_field'),
            name: 'field',
            id: config.id + '-field',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textarea',
            fieldLabel: _('seotemplates_item_value'),
            name: 'value',
            id: config.id + '-value',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'xcheckbox',
            boxLabel: _('seotemplates_item_active'),
            name: 'active',
            id: config.id + '-active',
            checked: true,
        }];
    },

    loadDropZones: function () {
    }

});
Ext.reg('seotemplates-item-window-update', seoTemplates.window.UpdateItem);
