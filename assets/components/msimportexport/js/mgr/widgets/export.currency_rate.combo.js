Msie.combo.ExportCurrencyRate = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        store: new Ext.data.SimpleStore({
            fields: ['d','v']
            ,data:[
                ['CBRF — курс по Центральному банку РФ','CBRF'],
                ['NBU — курс по Национальному банку Украины','NBU'],
                ['NBK — курс по Национальному банку Казахстана','NBK'],
                ['CB — курс по банку той страны, к которой относится магазин','CB'],
            ]
        })
        ,displayField: 'd'
        ,valueField: 'v'
        ,hiddenName: 'ym_currency_rate'
        ,mode: 'local'
        ,triggerAction: 'all'
        ,editable: false
        ,preventRender: true
        ,forceSelection: true
        ,enableKeyEvents: true
    });
    Msie.combo.ExportCurrencyRate.superclass.constructor.call(this,config);
};
Ext.extend(Msie.combo.ExportCurrencyRate,MODx.combo.ComboBox);
Ext.reg('msie-combo-export-currency-rate',Msie.combo.ExportCurrencyRate);