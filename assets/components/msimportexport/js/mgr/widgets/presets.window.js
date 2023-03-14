Msie.window.presets = function(config) {
    config = config || {};
    this.ident = config.ident || Ext.id();
    var self = this;
    Ext.applyIf(config,{
        id: this.ident
        ,modal: true
        ,width: 650
        ,height: 400
        ,autoHeight: false
        ,autoScroll: true
        ,buttons: [{
            text: config.cancelBtnText || _('cancel')
            ,scope: this
            ,handler: function() { config.closeAction !== 'close' ? this.hide() : this.close(); }
        }]
        ,fields: [{
            xtype: 'msie-grid-presets'
            ,id: 'msie-grid-presets'
            ,type: config.type
            ,act: config.act
            ,listeners: {
                'preset-add' : function(){
                    self.fireEvent('preset-change',{event:'add'});
                }
                ,'preset-remove' : function(id){
                    self.fireEvent('preset-change',{event:'remove',id:id});
                }
                ,render : function(grid){
                    this.store.on('update', function(store, records, operation){
                        if(operation == 'commit') {
                            self.fireEvent('preset-change',{event:'update',id:records.id});
                        }
                    });
                }
            }
        }]
    });
    Msie.window.presets.superclass.constructor.call(this,config);
};
Ext.extend(Msie.window.presets,MODx.Window,{

});
Ext.reg('msie-window-presets',Msie.window.presets);