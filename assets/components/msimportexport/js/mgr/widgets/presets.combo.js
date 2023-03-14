Msie.combo.Presets = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        displayField: 'name'
        , valueField: 'id'
        , fields: ['name', 'id']
        , editable: true
        , forceSelection: true
        , url: Msie.config.connectorUrl
        , listeners: {
            render: function () {
                var self = this;
                this.store.on('load', function (e, r) {
                    self.setValue(self.val);
                    self.setVal(self.val);
                });
            }
        }
        , baseParams: {
            action: 'mgr/presets/fields/getlist'
            , type: config.type || 'products'
            , act: config.act || 1
        }
    });
    Msie.combo.Presets.superclass.constructor.call(this, config);
};
Ext.extend(Msie.combo.Presets, MODx.combo.ComboBox, {
    val: null
    , reload: function (value) {
        this.val = value;
        this.getStore().reload({params: this.baseParams});
    }
    , setVal: function (value) {
        if (value) {
            this.clearInvalid();
            var store = this.getStore();
            var valueField = this.valueField;
            var displayField = this.displayField;
            var recordNumber = store.findExact(valueField, value, 0);
            if (recordNumber == -1)
                return -1;
            var displayValue = store.getAt(recordNumber).data[displayField];
            this.setValue(value);
            this.setRawValue(displayValue);
            this.selectedIndex = recordNumber;
            return recordNumber;
        }
    }
    , updateAllowBlank: function () {
        switch (this.baseParams.type) {
            /* case 'categories':
                 this.allowBlank = true;
                 this.hide();
                 break;*/
            default:
                this.allowBlank = false;
                this.show();
                break;
        }

    }
    , hasValid: function () {
        this.clearInvalid();
        var ok = false;
        switch (this.baseParams.type) {
            /*case 'categories':
                ok = true;
                break;*/
            default:
                ok = this.getValue() ? true : false;
        }
        if (!ok) this.markInvalid(_('msimportexport.err.err_ns'));
        return ok;
    }

});
Ext.reg('msie-combo-presets', Msie.combo.Presets);