seoTemplates.window.CreateItem = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'seotemplates-field-window-create';
    }
    Ext.applyIf(config, {
        title: _('seotemplates_field_create'),
        width: 550,
        autoHeight: true,
        url: seoTemplates.config.connector_url,
        action: 'mgr/field/create',
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
            xtype: 'textfield',
            fieldLabel: _('seotemplates_field_name'),
            name: 'name',
            id: config.id + '-name',
            anchor: '99%',
            allowBlank: false,
        }, {
            xtype: 'textarea',
            fieldLabel: _('seotemplates_field_description'),
            name: 'description',
            id: config.id + '-description',
            anchor: '99%',
            allowBlank: true
        }/*, {
            xtype: 'xcheckbox',
            boxLabel: _('seotemplates_field_active'),
            name: 'active',
            id: config.id + '-active',
            checked: true,
        }*/];
    },

    loadDropZones: function () {
    }

});
Ext.reg('seotemplates-field-window-create', seoTemplates.window.CreateItem);


seoTemplates.window.UpdateItem = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'seotemplates-field-window-update';
    }
    Ext.applyIf(config, {
        title: _('seotemplates_field_update'),
        width: 550,
        autoHeight: true,
        url: seoTemplates.config.connector_url,
        action: 'mgr/field/update',
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
            xtype: 'textfield',
            fieldLabel: _('seotemplates_field_name'),
            name: 'name',
            id: config.id + '-name',
            anchor: '99%',
            allowBlank: false,
        },
        {
            xtype: 'textarea',
            fieldLabel: _('seotemplates_field_description'),
            name: 'description',
            id: config.id + '-description',
            anchor: '99%',
            allowBlank: true
        }/*, {
            xtype: 'xcheckbox',
            boxLabel: _('seotemplates_field_active'),
            name: 'active',
            id: config.id + '-active',
            checked: true,
        }*/];
    },

    loadDropZones: function () {
    }

});
Ext.reg('seotemplates-field-window-update', seoTemplates.window.UpdateItem);