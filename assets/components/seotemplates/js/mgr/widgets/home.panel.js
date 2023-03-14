seoTemplates.panel.Home = function (config) {
    config = config || {};
    Ext.apply(config, {
        baseCls: 'modx-formpanel',
        layout: 'anchor',
        /*
         stateful: true,
         stateId: 'seotemplates-panel-home',
         stateEvents: ['tabchange'],
         getState:function() {return {activeTab:this.items.indexOf(this.getActiveTab())};},
         */
        hideMode: 'offsets',
        items: [{
            html: '<h2>' + _('seotemplates') + '</h2>',
            cls: '',
            style: {margin: '15px 0'}
        }, {
            xtype: 'modx-tabs',
            defaults: {border: false, autoHeight: true},
            border: true,
            hideMode: 'offsets',
            items: [{
                title: _('seotemplates_items'),
                layout: 'anchor',
                items: [{
                    html: _('seotemplates_intro_templates_msg'),
                    cls: 'panel-desc',
                }, {
                    xtype: 'seotemplates-grid-items',
                    cls: 'main-wrapper',
                }]
            },
            {
                title: _('seotemplates_fields'),
                layout: 'anchor',
                items: [{
                    html: _('seotemplates_intro_fields_msg'),
                    cls: 'panel-desc',
                }, {
                    xtype: 'seotemplates-grid-fields',
                    cls: 'main-wrapper',
                }]
            }]
        }]
    });
    seoTemplates.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(seoTemplates.panel.Home, MODx.Panel);
Ext.reg('seotemplates-panel-home', seoTemplates.panel.Home);
