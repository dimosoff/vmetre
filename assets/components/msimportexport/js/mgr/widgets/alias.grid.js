Msie.grid.alias = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'msie-grid-alias'
        ,url: Msie.config.connectorUrl
        ,baseParams: {
			action: 'mgr/fields/alias/getList'
		}
        ,fields: ['id','key','value']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'key'
        ,save_action: 'mgr/fields/alias/updateFromGrid'
        ,autosave: true
		,listeners: {
			render : function(grid){
				this.store.on('update', this.onUpdate);
			}
		}
        ,columns: [{
				header: _('msimportexport.alias.header_id')
				,dataIndex: 'id'
				,hidden: true
				,sortable: true
				,width: 100
			},{
				header:_('msimportexport.alias.header_key')
				,dataIndex: 'key'
				,sortable: true
				,editor: {
					xtype: 'textfield'
				}
			},{
			header:_('msimportexport.alias.header_value')
			,dataIndex: 'value'
			,sortable: true
			,editor: {
				xtype: 'textfield'
			}
		}],tbar:[{
             text: _('msimportexport.alias.btn_create')
			,scope: this
            ,handler: {
					xtype: 'msie-window-alias-create'
					,blankValues: true
					,cls: 'primary-button'
					,listeners: {
						'success': {fn:this.onAdd,scope:this}
					}
				}
            },'->',{
			xtype: 'textfield'
			,name: 'search'
			,id: 'msie-alias-search-filter'
			,emptyText: _('msimportexport.search')+'...'
			,listeners: {
				'change': {fn:this.search,scope:this}
				,'render': {fn: function(cmp) {
					new Ext.KeyMap(cmp.getEl(), {
						key: Ext.EventObject.ENTER
						,fn: function() {
							this.fireEvent('change',this);
							this.blur();
							return true;
						}
						,scope: cmp
					});
				},scope:this}
			}
		},{
			xtype: 'button'
			,id: 'msie-alias-filter-clear'
			,text: _('msimportexport.filter_clear')
			,listeners: {
				'click': {fn: this.clearFilter, scope: this}
			}
		}]
        ,getMenu: function() {
            return [{
                text: _('msimportexport.menu.remove')
                ,handler: this.remove
            }];
        }
		,remove: function() {
            MODx.msg.confirm({
                title: _('msimportexport.title.win_remove')
                ,text: _('msimportexport.alias.confirm.remove')
                ,url: this.config.url
                ,params: {
                    action: 'mgr/fields/alias/remove'
                    ,id: this.menu.record.id
                }
                ,listeners: {
                    'success': {fn:this.onRemove,scope:this}
                }
            });
        }

    });
    Msie.grid.alias.superclass.constructor.call(this,config)
};
Ext.extend(Msie.grid.alias,MODx.grid.Grid,{
	onRemove:function(r){
		this.refresh();
		this.fireEvent('alias-remove',r.object.id);
	}
	,onAdd:function(r,d){
		this.refresh();
		this.fireEvent('alias-add');
	}
	,onUpdate:function(store, records, operation){
		if(operation == 'commit') {
			this.fireEvent('alias-update',records.id);
		}
	},
	search: function(tf,nv,ov) {
		var s = this.getStore();
		s.baseParams.query = tf.getValue();
		this.getBottomToolbar().changePage(1);
		this.refresh();
	}
	,clearFilter: function() {
		var s = this.getStore();
		s.baseParams.query = '';
		Ext.getCmp('msie-alias-search-filter').reset();
		this.getBottomToolbar().changePage(1);
		this.refresh();
	}
});
Ext.reg('msie-grid-alias',Msie.grid.alias);


Msie.window.CreateAlias = function(config) {
	config = config || {};
	var self = this;
	Ext.applyIf(config,{
		title: _('msimportexport.alias.title.win_create')
		,url: Msie.config.connectorUrl
		,autoHeight:true
		,modal: true
		,baseParams: {
			action: 'mgr/fields/alias/create'
		}
		,fields: [{
			xtype: 'textfield'
			,fieldLabel: _('msimportexport.alias.label_key')
			,name: 'key'
			,allowBlank:false
			,anchor: '100%'
		},{
			xtype: 'textfield'
			,fieldLabel: _('msimportexport.alias.label_value')
			,name: 'value'
			,allowBlank:false
			,anchor: '100%'
		}]
	});
	Msie.window.CreateAlias.superclass.constructor.call(this,config);
};
Ext.extend(Msie.window.CreateAlias,MODx.Window);
Ext.reg('msie-window-alias-create',Msie.window.CreateAlias);