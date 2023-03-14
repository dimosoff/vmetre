Msie.tree.Categories = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        url: Msie.config.connectorUrl
        , title: ''
        , anchor: '100%'
        , rootVisible: false
        , expandFirst: true
        , enableDD: false
        , ddGroup: 'modx-treedrop-dd'
        , remoteToolbar: false
        , action: 'mgr/category/getnodes'
        , tbarCfg: {id: config.id ? config.id + '-tbar' : 'modx-tree-resource-tbar'}
        , baseParams: {
            action: 'mgr/category/getnodes'
            , currentResource: MODx.request.id || 0
            , currentAction: MODx.request.a || 0
            , preset: config.preset || 0
        }
        //,tbar: []
        , listeners: {
            checkchange: function (node, checked) {
                this.mask.show();
                MODx.Ajax.request({
                    url: Msie.config.connectorUrl
                    , params: {
                        action: 'mgr/category/category'
                        , category_id: node.attributes.pk
                        , product_id: MODx.request.id
                        , preset: this.preset || 0
                    }
                    , listeners: {
                        success: {
                            fn: function () {
                                this.mask.hide();
                            }, scope: this
                        }
                        , failure: {
                            fn: function () {
                                this.mask.hide();
                            }, scope: this
                        }
                    }
                });
            }
            , afterrender: function () {
                this.mask = new Ext.LoadMask(this.getEl());
            }
        }
    });
    Msie.tree.Categories.superclass.constructor.call(this, config);
};
Ext.extend(Msie.tree.Categories, MODx.tree.Tree, {});
Ext.reg('msie-tree-categories', Msie.tree.Categories);