var Msie = function (config) {
    config = config || {};
    Msie.superclass.constructor.call(this, config);
};
Ext.extend(Msie, Ext.Component, {
    page: {},
    window: {},
    grid: {},
    tree: {},
    panel: {},
    combo: {},
    config: {},
    view: {},
    extra: {},
    connector_url: '',
    utils: {
        formatDate: function (string) {
            if (string && string != '0000-00-00 00:00:00' && string != '-1-11-30 00:00:00' && string != 0) {
                var date = /^[0-9]+$/.test(string)
                    ? new Date(string * 1000)
                    : new Date(string.replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1'));
                return date.strftime(Msie.config['date_format'] || '%d.%m.%y <span class="gray">%H:%M</span>');
            }
            else {
                return '&nbsp;';
            }
        },
        renderActions: function (value, props, row) {
            var res = [];
            var cls, icon, title, action, item = '';
            for (var i in row.data.actions) {
                if (!row.data.actions.hasOwnProperty(i)) {
                    continue;
                }
                var a = row.data.actions[i];
                if (!a['button']) {
                    continue;
                }

                icon = a['icon'] ? a['icon'] : '';
                if (typeof(a['cls']) == 'object') {
                    if (typeof(a['cls']['button']) != 'undefined') {
                        icon += ' ' + a['cls']['button'];
                    }
                }
                else {
                    cls = a['cls'] ? a['cls'] : '';
                }
                action = a['action'] ? a['action'] : '';
                title = a['title'] ? a['title'] : '';

                item = String.format(
                    '<li class="{0}"><button class="btn btn-default {1}" action="{2}" title="{3}"></button></li>',
                    cls, icon, action, title
                );

                res.push(item);
            }

            return String.format(
                '<ul class="msie-row-actions">{0}</ul>',
                res.join('')
            );
        },
        getMenu: function (actions, grid, selected) {
            var menu = [];
            var cls, icon, title, action = '';

            var has_delete = false;
            for (var i in actions) {
                if (!actions.hasOwnProperty(i)) {
                    continue;
                }

                var a = actions[i];
                if (!a['menu']) {
                    if (a == '-') {
                        menu.push('-');
                    }
                    continue;
                }
                else if (menu.length > 0 && !has_delete && (/^remove/i.test(a['action']) || /^delete/i.test(a['action']))) {
                    menu.push('-');
                    has_delete = true;
                }

                if (selected.length > 1) {
                    if (!a['multiple']) {
                        continue;
                    }
                    else if (typeof(a['multiple']) == 'string') {
                        a['title'] = a['multiple'];
                    }
                }

                icon = a['icon'] ? a['icon'] : '';
                if (typeof(a['cls']) == 'object') {
                    if (typeof(a['cls']['menu']) != 'undefined') {
                        icon += ' ' + a['cls']['menu'];
                    }
                }
                else {
                    cls = a['cls'] ? a['cls'] : '';
                }
                title = a['title'] ? a['title'] : a['title'];
                action = a['action'] ? grid[a['action']] : '';

                menu.push({
                    handler: action,
                    text: String.format(
                        '<span class="{0}"><i class="x-menu-item-icon {1}"></i>{2}</span>',
                        cls, icon, title
                    ),
                    scope: grid
                });
            }

            return menu;
        },
        userLink: function (value, id, blank) {
            if (!value) {
                return '';
            }
            else if (!id) {
                return value;
            }

            return String.format(
                '<a href="?a=security/user/update&id={0}" class="ms2-link" target="{1}">{2}</a>',
                id,
                (blank ? '_blank' : '_self'),
                value
            );
        },
        resourceLink: function (value, id, blank) {
            if (!value) {
                return '';
            }
            else if (!id) {
                return value;
            }

            return String.format(
                '<a href="index.php?a=resource/update&id={0}" class="Msie-link" target="{1}">{2}</a>',
                id,
                (blank ? '_blank' : '_self'),
                value
            );
        },
        renderBoolean: function (value) {
            var color, text;
            if (value == 0 || value == false || value == undefined) {
                color = 'red';
                text = _('no');
            }
            else {
                color = 'green';
                text = _('yes');
            }

            return String.format('<span class="{0}">{1}</span>', color, text);
        }
    }

});
Ext.reg('Msie', Msie);

Ext.Ajax.timeout = 0;
Ext.override(Ext.form.BasicForm, {timeout: Ext.Ajax.timeout / 1000});
Ext.override(Ext.form.FormPanel, {timeout: Ext.Ajax.timeout / 1000});
Ext.override(Ext.data.Connection, {timeout: Ext.Ajax.timeout});

Ext.override(Ext.Window, {
    onShow: function () {
        // skip MODx.msg windows, the animations do not work with them as they are always the same element!
        if (!this.el.hasClass('x-window-dlg')) {
            // first set the class that scales the window down a bit
            // this has to be done after the full window is positioned correctly by extjs
            this.addClass('anim-ready');
            // let the scale transformation to 0.7 finish before animating in
            var win = this; // we need a reference to this for setTimeout
            setTimeout(function () {
                if (win.mask !== undefined) {
                    // respect that the mask is not always the same object
                    if (win.mask instanceof Ext.Element) {
                        win.mask.addClass('fade-in');
                    } else {
                        win.mask.el.addClass('fade-in');
                    }
                }
                win.el.addClass('zoom-in');
            }, 250);
        } else {
            // we need to handle MODx.msg windows (Ext.Msg singletons, e.g. always the same element, no multiple instances) differently
            if (this.mask) {
                this.mask.addClass('fade-in');
                this.el.applyStyles({'opacity': 1});
            }
        }
    }
    , onHide: function () {
        // for some unknown (to me) reason, onHide() get's called when a window is initialized, e.g. before onShow()
        // so we need to prevent the following routine be applied prematurely
        if (this.el.hasClass('zoom-in')) {
            this.el.removeClass('zoom-in');
            if (this.mask !== undefined) {
                // respect that the mask is not always the same object
                if (this.mask instanceof Ext.Element) {
                    this.mask.removeClass('fade-in');
                } else {
                    this.mask.el.removeClass('fade-in');
                }
            }
            this.addClass('zoom-out');
            // let the CSS animation finish before hiding the window
            var win = this; // we need a reference to this for setTimeout
            setTimeout(function () {
                // we have an unsolved problem with windows that are destroyed on hide
                // the zoom-out animation cannot be applied for such windows, as they
                // get destroyed too early, if someone knows a solution, please tell =)
                if (!win.isDestroyed) {
                    win.el.hide();
                    // and remove the CSS3 animation classes
                    win.el.removeClass('zoom-out');
                    win.el.removeClass('anim-ready');
                }
            }, 250);
        } else if (this.el.hasClass('x-window-dlg')) {
            // we need to handle MODx.msg windows (Ext.Msg singletons, e.g. always the same element, no multiple instances) differently
            this.el.applyStyles({'opacity': 0});

            if (this.mask !== undefined) {
                // respect that the mask is not always the same object
                if (this.mask instanceof Ext.Element) {
                    this.mask.removeClass('fade-in');
                } else {
                    if (this.mask.el) {
                        this.mask.el.removeClass('fade-in');
                    }
                }
            }
        }
    }
});

Ext.override(Ext.form.FieldSet, {
    getState: function () {
        return {collapsed: this.collapsed};
    }
});

Msie = new Msie();