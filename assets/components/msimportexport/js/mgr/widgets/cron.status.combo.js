Msie.combo.CronStatus = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        store: new Ext.data.SimpleStore({
            fields: ['d','v']
            ,data:[
                [_('msimportexport.combo.cron_status.wait'), 1],
                [_('msimportexport.combo.cron_status.run'), 2]
            ]
        })
        ,displayField: 'd'
        ,valueField: 'v'
        ,hiddenName: 'default'
        ,mode: 'local'
        ,triggerAction: 'all'
        ,editable: false
        ,preventRender: true
        ,forceSelection: true
        ,enableKeyEvents: true
    });
    Msie.combo.CronStatus.superclass.constructor.call(this,config);
};
Ext.extend(Msie.combo.CronStatus,MODx.combo.ComboBox);
Ext.reg('msie-combo-cron-status',Msie.combo.CronStatus);