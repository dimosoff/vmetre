Ext.override(MODx.panel.Resource, {
  getParentFields: MODx.panel.Resource.prototype.getFields,

  getFields: function (config) {
    var parentFields = this.getParentFields.call(this, config);

    for (var i in parentFields) {
      var item = parentFields[i];

      if (item.id == 'modx-resource-tabs') {
        item.items.push({
          id: 'seotemplates-resource-tab',
          autoHeight: true,
          title: 'seoTemplates',
          layout: 'form',
          anchor: '100%',
          cls: 'main-wrapper',
          items: [
            {
              fieldLabel: 'value',
              xtype: 'textarea',
              anchor: '100%',
              name: 'seotemplates-resource-value'
            }
          ]
        })
      }
    }

    return parentFields;
  }
});