Msie.combo.ExportFields = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        displayField: 'name'
        , hiddenName: 'fields[]'
        , valueField: 'val'
        , fields: ['name', 'val']
        , editable: true
        , forceSelection: true
        , url: Msie.config.connectorUrl
        , baseParams: {
            action: 'mgr/fields/export/getlist'
            , type: config.type
        }
    });
    Msie.combo.ExportFields.superclass.constructor.call(this, config);
};
Ext.extend(Msie.combo.ExportFields, MODx.combo.ComboBox);
Ext.reg('msie-combo-export-fields', Msie.combo.ExportFields);