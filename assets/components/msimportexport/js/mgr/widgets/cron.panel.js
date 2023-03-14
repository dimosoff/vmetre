Msie.panel.Cron = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        layout: 'form'
        , header: false
        , border: false
        , defaults: {border: false}
        , cls: 'form-with-labels'
        , style: {'margin-top': '10px'}
        , items: [{
            xtype: 'msie-grid-cron'
            , type: config.type || 1
            , sPemain: config.isPemain
        }, {
            xtype: 'combo-boolean'
            , fieldLabel: _('setting_msimportexport.import.cron_log')
            , description: _('setting_msimportexport.import.cron_log_desc')
            , name: 'cron_log'
            , hiddenName: 'cron_log'
            , allowBlank: true
            , anchor: '100%'
            , value: config.options.cron_log
        }, {
            xtype: 'textfield'
            , fieldLabel: _('setting_msimportexport.import.path_php_interpreter')
            , description: _('setting_msimportexport.import.path_php_interpreter_desc')
            , value: config.options.path_php_interpreter
            , name: 'path_php_interpreter'
            , allowBlank: true
            , anchor: '100%'
            , listeners: {
                change: {fn: this.changePathPhpInterpreter, scope: this}
            }
        }, {
            xtype: 'textfield'
            , fieldLabel: _('msimportexport.cron.label_cron_task')
            , id: 'cron-task-file-path'
            , value: '* * * * * ' + Msie.config.pathPhpInterpreter + ' ' +  Msie.config.cronScript + (config.options.cron_wait == true ? '' : ' &')
            , allowBlank: true
            , readOnly: true
            , anchor: '100%'
        }]
    });
    Msie.panel.Cron.superclass.constructor.call(this, config);
};
Ext.extend(Msie.panel.Cron, MODx.Panel, {
    changePathPhpInterpreter: function (f, val) {
        var path = Ext.getCmp('cron-task-file-path'),
            wait = this.options.cron_wait == true ? '' : ' &';
        path.setValue('* * * * * ' + val + ' ' + Msie.config.cronScript + wait);
    }
});
Ext.reg('msie-panel-cron', Msie.panel.Cron);
