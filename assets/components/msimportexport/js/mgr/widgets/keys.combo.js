Msie.combo.Keys = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        displayField: 'name'
        , hiddenName: config.name || 'key'
        , valueField: 'val'
        , fields: ['name', 'val']
        , editable: true
        , minChars: 2
        , forceSelection: true
        , url: Msie.config.connectorUrl
        , baseParams: {
            action: 'mgr/fields/getlist'
            , type: 'keys'
        }
    });
    Msie.combo.Keys.superclass.constructor.call(this, config);
};
Ext.extend(Msie.combo.Keys, MODx.combo.ComboBox);
Ext.reg('msie-combo-keys', Msie.combo.Keys);