Msie.page.Export = function (config) {
    config = config || {record: {}};
    Ext.applyIf(config, {
        formpanel: 'msie-panel-export'
        , buttons: [{
            text: _('msimportexport.btn_save_settings')
            , id: 'msie-btn-save'
            , cls: 'primary-button'
            , process: 'mgr/export/settings'
            , method: 'remote'
            , keys: [{
                key: 's'
                , alt: true
                , ctrl: true
            }]
        }, {
            text: '<i class="icon icon-arrow-right"></i>  ' + _('msimportexport.cmenu.import')
            , handler: function () {
                MODx.loadPage('index.php?a=import&namespace=msimportexport');
            }
        }]
        , components: [{
            xtype: 'msie-panel-export'
            , options: config.options
            , fields: config.fields
            , renderTo: 'msie-panel-export-div'
        }]
    });
    Msie.page.Export.superclass.constructor.call(this, config);
};
Ext.extend(Msie.page.Export, MODx.Component);
Ext.reg('msie-page-export', Msie.page.Export);