Msie.combo.ImportType = function(config) {
    config = config || {};
    var data = [
        [_('msimportexport.import.combo.products'),'products']
        ,[_('msimportexport.import.combo.update_products'),'update_products']
        ,[_('msimportexport.import.combo.links'),'links']
        ,[_('msimportexport.import.combo.categories'),'categories']
        ,[_('msimportexport.import.combo.gallery'),'gallery']
    ];
    if(Msie.config.settings.isPemain){
        data.push([_('msimportexport.import.combo.pemains'),'pemains']);
    }
    if(Msie.config.settings.isOptionsPrice2){
        data.push([_('msimportexport.import.combo.options_price2'),'options_price2']);
    }
    if(Msie.config.settings.isOptionsColor){
        data.push([_('msimportexport.import.combo.options_color'),'options_color']);
    }
    if(Msie.config.settings.isSalePrice){
        data.push([_('msimportexport.import.combo.sale_price'),'sale_price']);
    }
    if(Msie.config.settings.isCityFields){
        data.push([_('msimportexport.import.combo.city_fields'),'city_fields']);
    }
    Ext.applyIf(config,{
        store: new Ext.data.SimpleStore({
            fields: ['d','v']
            ,data: data
        })
        ,displayField: 'd'
        ,valueField: 'v'
        ,hiddenName: 'import_type'
        ,mode: 'local'
        ,triggerAction: 'all'
        ,editable: false
        ,preventRender: true
        ,forceSelection: true
        ,enableKeyEvents: true
    });
    Msie.combo.ImportType.superclass.constructor.call(this,config);
};
Ext.extend(Msie.combo.ImportType,MODx.combo.ComboBox);
Ext.reg('msie-combo-import-type',Msie.combo.ImportType);