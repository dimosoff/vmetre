var seoTemplates = function (config) {
    config = config || {};
    seoTemplates.superclass.constructor.call(this, config);
};
Ext.extend(seoTemplates, Ext.Component, {
    page: {}, window: {}, grid: {}, tree: {}, panel: {}, combo: {}, config: {}, view: {}, utils: {}
});
Ext.reg('seotemplates', seoTemplates);

seoTemplates = new seoTemplates();