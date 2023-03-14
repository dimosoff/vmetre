Msie.combo.Fields = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        displayField: 'name'
        , hiddenName: 'fields[]'
        , valueField: 'val'
        , fields: ['name', 'val']
        , editable: true
        , minChars: 2
        , forceSelection: true
        , url: Msie.config.connectorUrl
        , baseParams: {
            action: 'mgr/fields/getlist'
            , type: config.type
        }
    });
    Msie.combo.Fields.superclass.constructor.call(this, config);
};
Ext.extend(Msie.combo.Fields, MODx.combo.ComboBox);
Ext.reg('msie-combo-fields', Msie.combo.Fields);