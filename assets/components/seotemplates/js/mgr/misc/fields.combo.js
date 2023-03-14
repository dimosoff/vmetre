seoTemplates.combo.Fields = function (config) {
  config = config || {};

  Ext.applyIf(config, {
    name: 'field',
    hiddenName: 'field',
    displayField: 'name',
    valueField: 'id',
    fields: ['id', 'name', 'description'],
    pageSize: 10,
    hideMode: 'offsets',
    tpl: new Ext.XTemplate('<tpl for="."><div class="x-combo-list-item"><span style="font-weight: bold">{name:htmlEncode}</span>'
             ,'<br />{description:htmlEncode()}</div></tpl>'),
    url: seoTemplates.config.connectorUrl,
    baseParams: {
        action: 'mgr/field/getlist'
    }
  });
  seoTemplates.combo.Fields.superclass.constructor.call(this, config);
};
Ext.extend(seoTemplates.combo.Fields, MODx.combo.ComboBox);
Ext.reg('seotemplates-combo-fields', seoTemplates.combo.Fields);

seoTemplates.combo.Templates = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        xtype: 'superboxselect',
        renderTo: Ext.getBody(),
        allowBlank: false,
        //pageSize: 10,
        editable: true,
        msgTarget: 'under',
        allowAddNewData: false,
        addNewDataOnBlur: false,
        pinList: false,
        resizable: true,
        name: config.name + '[]',
        hiddenName: config.name + '[]',
        anchor: '100%',
        minChars: 1,
        store: new Ext.data.JsonStore({
            id: config.name + '-store',
            root: 'results',
            autoLoad: false,
            autoSave: false,
            totalProperty: 'total',
            fields: ['id','templatename','description'],
            url: seoTemplates.config.connectorUrl, //MODx.config.connector_url,
            baseParams: {
                action: 'mgr/template/getlist',//'element/template/getlist',
            }
        }),
        mode: 'remote',
        displayField: 'templatename',
        valueField: 'templatename',
        triggerAction: 'all',
        extraItemCls: 'x-tag',
        expandBtnCls: 'x-form-trigger',
        clearBtnCls: 'x-form-trigger',
        tpl: new Ext.XTemplate('<tpl for="."><div class="x-combo-list-item"><span style="font-weight: bold">{templatename:htmlEncode}</span>'
             ,'<br />{description:htmlEncode()}</div></tpl>'),
        listeners: {
            newitem: function(bs, v, f) {
                bs.addItem({tag: v});
            }
        }
    });
    config.name += '[]';

    seoTemplates.combo.Templates.superclass.constructor.call(this, config);
};
Ext.extend(seoTemplates.combo.Templates, Ext.ux.form.SuperBoxSelect);
Ext.reg('seotemplates-combo-templates', seoTemplates.combo.Templates);
