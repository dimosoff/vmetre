seoTemplates.page.Home = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        components: [{
            xtype: 'seotemplates-panel-home',
            renderTo: 'seotemplates-panel-home-div'
        }]
    });
    seoTemplates.page.Home.superclass.constructor.call(this, config);
};
Ext.extend(seoTemplates.page.Home, MODx.Component);
Ext.reg('seotemplates-page-home', seoTemplates.page.Home);