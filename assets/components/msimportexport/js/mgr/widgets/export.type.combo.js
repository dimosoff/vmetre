Msie.combo.ExportType = function (config) {
    config = config || {};
    var data = [
        [_('msimportexport.export.combo.products'), 'products']
        , [_('msimportexport.export.combo.links'), 'links']
        , [_('msimportexport.export.combo.categories'), 'categories']
        , [_('msimportexport.export.combo.gallery'), 'gallery']
    ];
    if (Msie.config.settings.isPemain) {
        data.push([_('msimportexport.export.combo.pemains'), 'pemains']);
    }
    if (Msie.config.settings.isOptionsPrice2) {
        data.push([_('msimportexport.export.combo.options_price2'), 'options_price2']);
    }
    if (Msie.config.settings.isOptionsColor) {
        data.push([_('msimportexport.export.combo.options_color'), 'options_color']);
    }
    if (Msie.config.settings.isSalePrice) {
        data.push([_('msimportexport.export.combo.sale_price'), 'sale_price']);
    }
    if (Msie.config.settings.isCityFields) {
        data.push([_('msimportexport.export.combo.city_fields'), 'city_fields']);
    }
    Ext.applyIf(config, {
        store: new Ext.data.SimpleStore({
            fields: ['d', 'v']
            , data: data
        })
        , displayField: 'd'
        , valueField: 'v'
        , mode: 'local'
        , triggerAction: 'all'
        , editable: false
        , preventRender: true
        , forceSelection: true
        , enableKeyEvents: true
    });
    Msie.combo.ExportType.superclass.constructor.call(this, config);
};
Ext.extend(Msie.combo.ExportType, MODx.combo.ComboBox);
Ext.reg('msie-combo-export-type', Msie.combo.ExportType);