Msie.combo.TextFormat = function(config) {
    config = config || {};
    var data = [
        [_('msimportexport.combo.format_text.nl2br'),'nl2br']
        ,[_('msimportexport.combo.format_text.wrap'),'wrap']
    ];
    Ext.applyIf(config,{
        store: new Ext.data.SimpleStore({
            fields: ['d','v']
            ,data: data
        })
        ,displayField: 'd'
        ,valueField: 'v'
        ,hiddenName: config.name || 'text_format_method'
        ,mode: 'local'
        ,triggerAction: 'all'
        ,editable: false
        ,preventRender: true
        ,forceSelection: true
        ,enableKeyEvents: true
    });
    Msie.combo.TextFormat.superclass.constructor.call(this,config);
};
Ext.extend(Msie.combo.TextFormat,MODx.combo.ComboBox);
Ext.reg('msie-combo-text-format',Msie.combo.TextFormat);