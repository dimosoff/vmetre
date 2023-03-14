Msie.grid.ResourceDuplicate = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'msie-resource-duplicate-grid'
        ,url: Msie.config.connectorUrl
        ,baseParams: { action: 'mgr/resource/getduplicatelist' }
        ,fields: ['id','pagetitle','parent','uri','alias']
        ,paging: true
        ,remoteSort: true
        ,anchor: '100%'
        ,autoExpandColumn: 'id'
        ,autosave: false
        ,columns: [{
				header:_('msimportexport.report.uri.header_id')
				,dataIndex: 'id'
                ,width: 30
			},{
				header:_('msimportexport.report.uri.header_parent')
				,dataIndex: 'parent'
                ,width: 30
                ,renderer: function(value, p, record){
                    if(value != 0) {
                        return String.format('<a href="/manager/?a=resource/update&id={0}" class="x-grid-link" target="_blank">{1}</a>', record.id, Ext.util.Format.htmlEncode(value));
                    } else {
                        return value;
                    }
                }
			},{
				header:_('msimportexport.report.uri.header_uri')
				,dataIndex: 'uri'
                ,renderer: function(value, p, record){
                    return String.format('<a href="/manager/?a=resource/update&id={0}" class="x-grid-link" target="_blank">{1}</a>', record.id, Ext.util.Format.htmlEncode( value ) );
                }
			},{
                header:_('msimportexport.report.uri.header_pagetitle')
                ,dataIndex: 'pagetitle'
            },{
				header:_('msimportexport.report.uri.header_alias')
				,dataIndex: 'alias'
			}]
        ,getMenu: function() {
            return [{
                text: _('msimportexport.menu.remove')
                ,handler: this.remove
                ,scope:this
            }];
        }
        ,remove: function() {
            MODx.msg.confirm({
                title: _('msimportexport.title.win_remove')
                ,text: _('msimportexport.confirm.remove.resource')
                ,url: MODx.config.connector_url
                ,params: {
                    action: 'resource/delete'
                    ,id: this.menu.record.id
                }
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        }

    });
    Msie.grid.ResourceDuplicate.superclass.constructor.call(this,config)
};
Ext.extend(Msie.grid.ResourceDuplicate,MODx.grid.Grid,{});
Ext.reg('msie-resource-duplicate-grid',Msie.grid.ResourceDuplicate);

