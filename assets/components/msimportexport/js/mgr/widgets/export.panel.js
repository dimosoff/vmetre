Msie.panel.Export = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        url: Msie.config.connectorUrl
        ,baseParams: {}
        ,border: false
        ,id: 'msie-panel-export'
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+_('msimportexport') + ': ' + _('msimportexport.page_title_export')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,id: 'msie-export-tabs'
            ,anchor: '100% 100%'
            ,forceLayout: true
            ,deferredRender: false
            ,stateEvents: ['tabchange']
            ,getState:function() {return { activeTab:this.items.indexOf(this.getActiveTab())};}
            ,items: [
                this.getTabExportProducts(config)
                ,this.getTabExportSettings(config)
            ]
        }]
        ,listeners: {
            'beforeSubmit': {fn:this.beforeSubmit,scope:this}
            ,'success': {fn:this.success,scope:this}
        }
    });
    Msie.panel.Export.superclass.constructor.call(this,config);
};
Ext.extend(Msie.panel.Export,MODx.FormPanel,{
    getTabExportSettings: function(config) {
        config = config || {};
        return {
            title: _('msimportexport.tab.export_settings')
            ,id: 'msie-tab-settings'
            ,hideMode: 'offsets'
            ,anchor: '100%'
            ,cls: 'container'
            ,items: [{
                xtype: 'msie-panel-export-settings'
                ,options: config.options
                ,fields: config.fields
            }]
        }
    }
    ,getTabExportProducts: function(config) {
        return {
            title: _('msimportexport.tab.export_product')
            ,id: 'msie-tab-products'
            ,hideMode: 'offsets'
            ,layout: 'form'
            ,labelAlign: 'top'
            ,labelSeparator: ''
            ,cls: 'container'
            , items: [{
                xtype: 'msie-combo-export-type'
                ,fieldLabel: _('msimportexport.export.label_type')
                ,id:'msie-export-type'
                ,anchor: '100%'
                ,columnWidth: .8
                ,value:  Ext.state.Manager.get('msie_export_type') ? Ext.state.Manager.get('msie_export_type') : 'products'
                ,listeners: {
                    select: {
                        fn: function(ele, rec, idx) {
                            var presets = Ext.getCmp('msie-combo-preset');
                            Ext.state.Manager.set('msie_export_type', ele.value);
                            this.switchStateComboPreset(presets);
                            presets.baseParams.type = ele.getValue();
                            presets.reload();
                            presets.setValue('');
                        }, scope: this
                    }
                    ,change: function(ele, newValue, oldValue) {
                        console.log(newValue);
                    }
                }
            },{
                xtype: 'msie-combo-export-format'
                ,id:'msie-export-to'
                ,name: 'format'
                ,fieldLabel: _('msimportexport.export.label_format')
                ,description: _('msimportexport.export.label_format_help')
                ,anchor: '100%'
                ,columnWidth: .9
                ,value:  Ext.state.Manager.get('msie_export_format') ? Ext.state.Manager.get('msie_export_format') : 'xml'
                ,listeners: {
                    select: {fn: function(ele, rec, idx) {
                                  Ext.state.Manager.set('msie_export_format',ele.value);
                                  this.switchStateComboPreset(Ext.getCmp('msie-combo-preset'));
                                }, scope: this
                            }
                }
            },{
                xtype: 'msie-combo-presets'
                ,fieldLabel: _('msimportexport.preset_fields')
                ,id:'msie-combo-preset'
                ,anchor: '100%'
                ,disabled: this.switchStateComboPreset()
                ,act:2
                ,type:  Ext.getCmp('msie-export-type') ? Ext.getCmp('msie-export-type').getValue() : (Ext.state.Manager.get('msie_export_type') ? Ext.state.Manager.get('msie_export_type') : 'products')
            },{
                xtype: 'button'
                ,text: _('msimportexport.btn_export')
                ,cls: 'primary-button'
                ,style: {'margin-top': '25px'}
                ,anchor: '100%'
                ,listeners: {
                    'click': {fn: this.export, scope: this}
                }
            }]
        };
    }
    ,switchStateComboPreset:function(combo){
        var exportType =  Ext.getCmp('msie-export-type');
        var type =exportType ? exportType.getValue() : (Ext.state.Manager.get('msie_export_type') ? Ext.state.Manager.get('msie_export_type') : 'products')
            ,format = Ext.getCmp('msie-export-to')?  Ext.getCmp('msie-export-to').getValue() : (Ext.state.Manager.get('msie_export_format') ? Ext.state.Manager.get('msie_export_format') : 'xml')
            ,state = false;
        /*if (format == 'xml') {
            state = true;
        } else {
            state = false;
        }*/
        //console.log(type,format,state);
       if(combo) combo.setDisabled(state);
        return state;
    }
    ,export: function(e) {
        var  exportTo = Ext.getCmp('msie-export-to')
            //,exportType = Ext.getCmp('msie-export-type')
            ,preset = Ext.getCmp('msie-combo-preset');
        if(exportTo.getValue() !== 'xml') {
            if (!preset.hasValid()) return;
        }
        var  url = Msie.config.exportUrl + '?to=' + Ext.getCmp('msie-export-to').getValue() + '&type=' + Ext.getCmp('msie-export-type').getValue() + '&preset=' + preset.getValue();
        url += '&token=' + Msie.config.token;
        window.open(url);
        return false;
    }
    ,beforeSubmit: function(o) {
         Ext.apply(o.form.baseParams,{});
     }
    ,success: function(o) {
        Ext.getCmp('msie-btn-save').setDisabled(false);
    }
});
Ext.reg('msie-panel-export',Msie.panel.Export);


