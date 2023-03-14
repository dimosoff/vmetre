Msie.combo.Сatalog = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        displayField: 'pagetitle'
        ,hiddenName: 'catalog'
        ,valueField: 'id'
        ,fields: ['pagetitle','id','context_key']
        ,editable: true
        ,url:  Msie.config.connectorUrl
        ,baseParams:{
            action: 'mgr/catalog/getlist'
        },
        tpl: new Ext.XTemplate('\
            <tpl for=".">\
                <div class="x-combo-list-item">\
                    <span>\
                        <b>{pagetitle}</b>\
                        <tpl if="context_key"> ({context_key})</tpl>\
                    </span>\
                </div>\
            </tpl>',
            {compiled: true}
        ),
    });
    Msie.combo.Сatalog.superclass.constructor.call(this,config);
};
Ext.extend(Msie.combo.Сatalog,MODx.combo.ComboBox);
Ext.reg('msie-combo-catalog',Msie.combo.Сatalog);