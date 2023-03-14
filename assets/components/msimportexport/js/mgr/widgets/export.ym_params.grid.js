Msie.grid.ExportYmParams = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'msie-export-ym-params-grid'
        ,url: Msie.config.connectorUrl
        ,baseParams: { action: 'mgr/yandexmarket/getList' }
        ,fields: ['name','unit']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,save_action: 'mgr/yandexmarket/updateFromGrid'
        ,autosave: true
        ,columns: [{
				header:_('msimportexport.export.ym.header_name')
				,dataIndex: 'name'
               // ,editor: { xtype: 'textfield' }
			},{
				header:_('msimportexport.export.ym.header_unit')
				,dataIndex: 'unit'
                ,editor: { xtype: 'textfield' }
			}],tbar:['->',{
                text: _('msimportexport.export.ym.btn_create')
                ,cls: 'primary-button'
                ,scope: this
                ,handler: {
                    xtype: 'msie-window-export-ym-param-create'
                    ,blankValues: true
                }
            }]
        ,getMenu: function() {
            return [{
                text: _('msimportexport.menu.remove')
                ,handler: this.removeYmParam
                ,scope:this
            }];
        }
        ,removeYmParam: function() {
            MODx.msg.confirm({
                title: _('msimportexport.title.win_remove')
                ,text: _('msimportexport.confirm.remove')
                ,url: this.config.url
                ,params: {
                    action: 'mgr/yandexmarket/remove'
                    ,name: this.menu.record.name
                }
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        }

    });
    Msie.grid.ExportYmParams.superclass.constructor.call(this,config)
};
Ext.extend(Msie.grid.ExportYmParams,MODx.grid.Grid,{});
Ext.reg('msie-export-ym-params-grid',Msie.grid.ExportYmParams);

Msie.window.CreateExportYmParam = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('msimportexport.title.win_create')
        ,url: Msie.config.connectorUrl
        ,autoHeight:true
        ,modal: true
        ,baseParams: {
            action: 'mgr/yandexmarket/create'
        }
        ,fields: [{
				xtype: 'textfield'
                ,fieldLabel: _('msimportexport.export.ym.label_name')
				,name: 'name'
                ,allowBlank:false
                ,anchor: '100%'
                ,validator: function(v) {
                    return /^[a-zA-Z\_0-9]*$/.test(v)?true:_('msimportexport.err_valid_name');
                }
			},{
				xtype: 'textfield'
                ,fieldLabel: _('msimportexport.export.ym.label_unit')
				,name: 'unit'
                ,allowBlank:true
                ,anchor: '100%'
			}]
    });
    Msie.window.CreateExportYmParam.superclass.constructor.call(this,config);
};
Ext.extend(Msie.window.CreateExportYmParam,MODx.Window);
Ext.reg('msie-window-export-ym-param-create',Msie.window.CreateExportYmParam);
