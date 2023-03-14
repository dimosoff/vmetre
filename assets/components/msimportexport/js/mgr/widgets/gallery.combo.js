Msie.combo.Gallery = function (config) {
    config = config || {};
    var data = [
        [_('msimportexport.combo.gallery_product'), 'msProductFile']
    ];
    if(Msie.config.settings.isMS2Gallery){
        data.push([_('msimportexport.combo.gallery_resource'), 'msResourceFile']);
    }
    Ext.applyIf(config, {
        store: new Ext.data.SimpleStore({
            fields: ['d', 'v']
            , data: data
        })
        , displayField: 'd'
        , valueField: 'v'
        , hiddenName: config.name || 'gallery_class_name'
        , mode: 'local'
        , triggerAction: 'all'
        , editable: false
        , preventRender: true
        , forceSelection: true
        , enableKeyEvents: true
    });
    Msie.combo.Gallery.superclass.constructor.call(this, config);
};
Ext.extend(Msie.combo.Gallery, MODx.combo.ComboBox);
Ext.reg('msie-combo-gallery', Msie.combo.Gallery);