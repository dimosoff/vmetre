Msie.combo.ExportFormat = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        store: new Ext.data.SimpleStore({
            fields: ['d','v']
            ,data:[
                [_('msimportexport.export.combo.csv'),'csv'],
                [_('msimportexport.export.combo.xlsx'),'xlsx'],
                [_('msimportexport.export.combo.ymarket'),'xml'],
            ]
        })
        ,displayField: 'd'
        ,valueField: 'v'
        ,hiddenName: 'format'
        ,mode: 'local'
        ,triggerAction: 'all'
        ,editable: false
        ,preventRender: true
        ,forceSelection: true
        ,enableKeyEvents: true
    });
    Msie.combo.ExportFormat.superclass.constructor.call(this,config);
};
Ext.extend(Msie.combo.ExportFormat,MODx.combo.ComboBox);
Ext.reg('msie-combo-export-format',Msie.combo.ExportFormat);