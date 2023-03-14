Msie.combo.ExportCurrencyDefault = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        displayField: 'name'
        , hiddenName:  config.name || 'ym_default_currency'
        , valueField: 'key'
        , fields: ['name', 'val']
        , editable: true
        , url: Msie.config.connectorUrl
        , baseParams: {
            combo: true,
            action: 'mgr/yandexmarket/currencies/getlist'
        }
    });
    Msie.combo.ExportCurrencyDefault.superclass.constructor.call(this,config);
};
Ext.extend(Msie.combo.ExportCurrencyDefault,MODx.combo.ComboBox);
Ext.reg('msie-combo-export-currency-default',Msie.combo.ExportCurrencyDefault);