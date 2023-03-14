Msie.combo.Ctx = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        displayField: 'name'
        , hiddenName:  config.name || 'key'
        , valueField: 'key'
        , fields: ['name', 'key']
        , editable: true
        , url: Msie.config.connectorUrl
        , baseParams: {
            combo: true,
            action: 'mgr/system/context/getlist'
        },
        tpl: new Ext.XTemplate('\
            <tpl for=".">\
                <div class="x-combo-list-item">\
                    <span>\
                        <b>{name}</b>\
                        <tpl if="key"> ({key})</tpl>\
                    </span>\
                </div>\
            </tpl>',
            {compiled: true}
        ),
    });
    Msie.combo.Ctx.superclass.constructor.call(this, config);
};
Ext.extend(Msie.combo.Ctx, MODx.combo.ComboBox);
Ext.reg('msie-combo-ctx', Msie.combo.Ctx);