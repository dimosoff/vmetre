Msie.page.Import = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        formpanel: 'msie-panel-import'
        , buttons: [{
            text: _('msimportexport.btn_save_settings')
            , id: 'msie-btn-save'
            , cls: 'primary-button'
            , process: 'mgr/import/settings'
            , method: 'remote'
            , keys: [{
                key: 's'
                , alt: true
                , ctrl: true
            }]
        },{
            text: '<i class="icon icon-arrow-right"></i>  ' + _('msimportexport.cmenu.export')
            ,handler: function () {
                MODx.loadPage('index.php?a=export&namespace=msimportexport');
            }
        }]
        , components: [{
            xtype: 'msie-panel-import'
            , options: config.options
            , renderTo: 'msie-panel-import-div'
        }]
    });
    Msie.page.Import.superclass.constructor.call(this, config);
};
Ext.extend(Msie.page.Import, MODx.Component, {});
Ext.reg('msie-page-import', Msie.page.Import);