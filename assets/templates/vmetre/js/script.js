!(function (t) {
  "function" == typeof define && define.noamd
    ? define(["jquery"], t)
    : t(jQuery);
})(function (k) {
  k.ui = k.ui || {};
  k.ui.version = "1.12.1";
  var n,
    i = 0,
    r = Array.prototype.slice;
  (k.cleanData =
    ((n = k.cleanData),
    function (t) {
      for (var e, i, s = 0; null != (i = t[s]); s++)
        try {
          (e = k._data(i, "events")) &&
            e.remove &&
            k(i).triggerHandler("remove");
        } catch (t) {}
      n(t);
    })),
    (k.widget = function (t, i, e) {
      var s,
        n,
        o,
        a = {},
        r = t.split(".")[0],
        h = r + "-" + (t = t.split(".")[1]);
      return (
        e || ((e = i), (i = k.Widget)),
        k.isArray(e) && (e = k.extend.apply(null, [{}].concat(e))),
        (k.expr[":"][h.toLowerCase()] = function (t) {
          return !!k.data(t, h);
        }),
        (k[r] = k[r] || {}),
        (s = k[r][t]),
        (n = k[r][t] =
          function (t, e) {
            if (!this._createWidget) return new n(t, e);
            arguments.length && this._createWidget(t, e);
          }),
        k.extend(n, s, {
          version: e.version,
          _proto: k.extend({}, e),
          _childConstructors: [],
        }),
        ((o = new i()).options = k.widget.extend({}, o.options)),
        k.each(e, function (e, s) {
          function n() {
            return i.prototype[e].apply(this, arguments);
          }
          function o(t) {
            return i.prototype[e].apply(this, t);
          }
          k.isFunction(s)
            ? (a[e] = function () {
                var t,
                  e = this._super,
                  i = this._superApply;
                return (
                  (this._super = n),
                  (this._superApply = o),
                  (t = s.apply(this, arguments)),
                  (this._super = e),
                  (this._superApply = i),
                  t
                );
              })
            : (a[e] = s);
        }),
        (n.prototype = k.widget.extend(
          o,
          { widgetEventPrefix: (s && o.widgetEventPrefix) || t },
          a,
          { constructor: n, namespace: r, widgetName: t, widgetFullName: h }
        )),
        s
          ? (k.each(s._childConstructors, function (t, e) {
              var i = e.prototype;
              k.widget(i.namespace + "." + i.widgetName, n, e._proto);
            }),
            delete s._childConstructors)
          : i._childConstructors.push(n),
        k.widget.bridge(t, n),
        n
      );
    }),
    (k.widget.extend = function (t) {
      for (var e, i, s = r.call(arguments, 1), n = 0, o = s.length; n < o; n++)
        for (e in s[n])
          (i = s[n][e]),
            s[n].hasOwnProperty(e) &&
              void 0 !== i &&
              (k.isPlainObject(i)
                ? (t[e] = k.isPlainObject(t[e])
                    ? k.widget.extend({}, t[e], i)
                    : k.widget.extend({}, i))
                : (t[e] = i));
      return t;
    }),
    (k.widget.bridge = function (o, e) {
      var a = e.prototype.widgetFullName || o;
      k.fn[o] = function (i) {
        var t = "string" == typeof i,
          s = r.call(arguments, 1),
          n = this;
        return (
          t
            ? this.length || "instance" !== i
              ? this.each(function () {
                  var t,
                    e = k.data(this, a);
                  return "instance" === i
                    ? ((n = e), !1)
                    : e
                    ? k.isFunction(e[i]) && "_" !== i.charAt(0)
                      ? (t = e[i].apply(e, s)) !== e && void 0 !== t
                        ? ((n = t && t.jquery ? n.pushStack(t.get()) : t), !1)
                        : void 0
                      : k.error(
                          "no such method '" +
                            i +
                            "' for " +
                            o +
                            " widget instance"
                        )
                    : k.error(
                        "cannot call methods on " +
                          o +
                          " prior to initialization; attempted to call method '" +
                          i +
                          "'"
                      );
                })
              : (n = void 0)
            : (s.length && (i = k.widget.extend.apply(null, [i].concat(s))),
              this.each(function () {
                var t = k.data(this, a);
                t
                  ? (t.option(i || {}), t._init && t._init())
                  : k.data(this, a, new e(i, this));
              })),
          n
        );
      };
    }),
    (k.Widget = function () {}),
    (k.Widget._childConstructors = []),
    (k.Widget.prototype = {
      widgetName: "widget",
      widgetEventPrefix: "",
      defaultElement: "<div>",
      options: { classes: {}, disabled: !1, create: null },
      _createWidget: function (t, e) {
        (e = k(e || this.defaultElement || this)[0]),
          (this.element = k(e)),
          (this.uuid = i++),
          (this.eventNamespace = "." + this.widgetName + this.uuid),
          (this.bindings = k()),
          (this.hoverable = k()),
          (this.focusable = k()),
          (this.classesElementLookup = {}),
          e !== this &&
            (k.data(e, this.widgetFullName, this),
            this._on(!0, this.element, {
              remove: function (t) {
                t.target === e && this.destroy();
              },
            }),
            (this.document = k(e.style ? e.ownerDocument : e.document || e)),
            (this.window = k(
              this.document[0].defaultView || this.document[0].parentWindow
            ))),
          (this.options = k.widget.extend(
            {},
            this.options,
            this._getCreateOptions(),
            t
          )),
          this._create(),
          this.options.disabled &&
            this._setOptionDisabled(this.options.disabled),
          this._trigger("create", null, this._getCreateEventData()),
          this._init();
      },
      _getCreateOptions: function () {
        return {};
      },
      _getCreateEventData: k.noop,
      _create: k.noop,
      _init: k.noop,
      destroy: function () {
        var i = this;
        this._destroy(),
          k.each(this.classesElementLookup, function (t, e) {
            i._removeClass(e, t);
          }),
          this.element.off(this.eventNamespace).removeData(this.widgetFullName),
          this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),
          this.bindings.off(this.eventNamespace);
      },
      _destroy: k.noop,
      widget: function () {
        return this.element;
      },
      option: function (t, e) {
        var i,
          s,
          n,
          o = t;
        if (0 === arguments.length) return k.widget.extend({}, this.options);
        if ("string" == typeof t)
          if (((o = {}), (t = (i = t.split(".")).shift()), i.length)) {
            for (
              s = o[t] = k.widget.extend({}, this.options[t]), n = 0;
              n < i.length - 1;
              n++
            )
              (s[i[n]] = s[i[n]] || {}), (s = s[i[n]]);
            if (((t = i.pop()), 1 === arguments.length))
              return void 0 === s[t] ? null : s[t];
            s[t] = e;
          } else {
            if (1 === arguments.length)
              return void 0 === this.options[t] ? null : this.options[t];
            o[t] = e;
          }
        return this._setOptions(o), this;
      },
      _setOptions: function (t) {
        for (var e in t) this._setOption(e, t[e]);
        return this;
      },
      _setOption: function (t, e) {
        return (
          "classes" === t && this._setOptionClasses(e),
          (this.options[t] = e),
          "disabled" === t && this._setOptionDisabled(e),
          this
        );
      },
      _setOptionClasses: function (t) {
        var e, i, s;
        for (e in t)
          (s = this.classesElementLookup[e]),
            t[e] !== this.options.classes[e] &&
              s &&
              s.length &&
              ((i = k(s.get())),
              this._removeClass(s, e),
              i.addClass(
                this._classes({ element: i, keys: e, classes: t, add: !0 })
              ));
      },
      _setOptionDisabled: function (t) {
        this._toggleClass(
          this.widget(),
          this.widgetFullName + "-disabled",
          null,
          !!t
        ),
          t &&
            (this._removeClass(this.hoverable, null, "ui-state-hover"),
            this._removeClass(this.focusable, null, "ui-state-focus"));
      },
      enable: function () {
        return this._setOptions({ disabled: !1 });
      },
      disable: function () {
        return this._setOptions({ disabled: !0 });
      },
      _classes: function (n) {
        var o = [],
          a = this;
        function t(t, e) {
          for (var i, s = 0; s < t.length; s++)
            (i = a.classesElementLookup[t[s]] || k()),
              (i = n.add
                ? k(k.unique(i.get().concat(n.element.get())))
                : k(i.not(n.element).get())),
              (a.classesElementLookup[t[s]] = i),
              o.push(t[s]),
              e && n.classes[t[s]] && o.push(n.classes[t[s]]);
        }
        return (
          (n = k.extend(
            { element: this.element, classes: this.options.classes || {} },
            n
          )),
          this._on(n.element, { remove: "_untrackClassesElement" }),
          n.keys && t(n.keys.match(/\S+/g) || [], !0),
          n.extra && t(n.extra.match(/\S+/g) || []),
          o.join(" ")
        );
      },
      _untrackClassesElement: function (i) {
        var s = this;
        k.each(s.classesElementLookup, function (t, e) {
          -1 !== k.inArray(i.target, e) &&
            (s.classesElementLookup[t] = k(e.not(i.target).get()));
        });
      },
      _removeClass: function (t, e, i) {
        return this._toggleClass(t, e, i, !1);
      },
      _addClass: function (t, e, i) {
        return this._toggleClass(t, e, i, !0);
      },
      _toggleClass: function (t, e, i, s) {
        s = "boolean" == typeof s ? s : i;
        var n = "string" == typeof t || null === t,
          t = {
            extra: n ? e : i,
            keys: n ? t : e,
            element: n ? this.element : t,
            add: s,
          };
        return t.element.toggleClass(this._classes(t), s), this;
      },
      _on: function (n, o, t) {
        var a,
          r = this;
        "boolean" != typeof n && ((t = o), (o = n), (n = !1)),
          t
            ? ((o = a = k(o)), (this.bindings = this.bindings.add(o)))
            : ((t = o), (o = this.element), (a = this.widget())),
          k.each(t, function (t, e) {
            function i() {
              if (
                n ||
                (!0 !== r.options.disabled &&
                  !k(this).hasClass("ui-state-disabled"))
              )
                return ("string" == typeof e ? r[e] : e).apply(r, arguments);
            }
            "string" != typeof e &&
              (i.guid = e.guid = e.guid || i.guid || k.guid++);
            var s = t.match(/^([\w:-]*)\s*(.*)$/),
              t = s[1] + r.eventNamespace,
              s = s[2];
            s ? a.on(t, s, i) : o.on(t, i);
          });
      },
      _off: function (t, e) {
        (e =
          (e || "").split(" ").join(this.eventNamespace + " ") +
          this.eventNamespace),
          t.off(e).off(e),
          (this.bindings = k(this.bindings.not(t).get())),
          (this.focusable = k(this.focusable.not(t).get())),
          (this.hoverable = k(this.hoverable.not(t).get()));
      },
      _delay: function (t, e) {
        var i = this;
        return setTimeout(function () {
          return ("string" == typeof t ? i[t] : t).apply(i, arguments);
        }, e || 0);
      },
      _hoverable: function (t) {
        (this.hoverable = this.hoverable.add(t)),
          this._on(t, {
            mouseenter: function (t) {
              this._addClass(k(t.currentTarget), null, "ui-state-hover");
            },
            mouseleave: function (t) {
              this._removeClass(k(t.currentTarget), null, "ui-state-hover");
            },
          });
      },
      _focusable: function (t) {
        (this.focusable = this.focusable.add(t)),
          this._on(t, {
            focusin: function (t) {
              this._addClass(k(t.currentTarget), null, "ui-state-focus");
            },
            focusout: function (t) {
              this._removeClass(k(t.currentTarget), null, "ui-state-focus");
            },
          });
      },
      _trigger: function (t, e, i) {
        var s,
          n,
          o = this.options[t];
        if (
          ((i = i || {}),
          ((e = k.Event(e)).type = (
            t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t
          ).toLowerCase()),
          (e.target = this.element[0]),
          (n = e.originalEvent))
        )
          for (s in n) s in e || (e[s] = n[s]);
        return (
          this.element.trigger(e, i),
          !(
            (k.isFunction(o) &&
              !1 === o.apply(this.element[0], [e].concat(i))) ||
            e.isDefaultPrevented()
          )
        );
      },
    }),
    k.each({ show: "fadeIn", hide: "fadeOut" }, function (o, a) {
      k.Widget.prototype["_" + o] = function (e, t, i) {
        var s;
        "string" == typeof t && (t = { effect: t });
        var n = t ? (!0 !== t && "number" != typeof t && t.effect) || a : o;
        "number" == typeof (t = t || {}) && (t = { duration: t }),
          (s = !k.isEmptyObject(t)),
          (t.complete = i),
          t.delay && e.delay(t.delay),
          s && k.effects && k.effects.effect[n]
            ? e[o](t)
            : n !== o && e[n]
            ? e[n](t.duration, t.easing, i)
            : e.queue(function (t) {
                k(this)[o](), i && i.call(e[0]), t();
              });
      };
    });
  var s, C, x, o, a, h, l, c, D;
  k.widget;
  function I(t, e, i) {
    return [
      parseFloat(t[0]) * (c.test(t[0]) ? e / 100 : 1),
      parseFloat(t[1]) * (c.test(t[1]) ? i / 100 : 1),
    ];
  }
  function P(t, e) {
    return parseInt(k.css(t, e), 10) || 0;
  }
  (C = Math.max),
    (x = Math.abs),
    (o = /left|center|right/),
    (a = /top|center|bottom/),
    (h = /[\+\-]\d+(\.[\d]+)?%?/),
    (l = /^\w+/),
    (c = /%$/),
    (D = k.fn.position),
    (k.position = {
      scrollbarWidth: function () {
        if (void 0 !== s) return s;
        var t,
          e = k(
            "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"
          ),
          i = e.children()[0];
        return (
          k("body").append(e),
          (t = i.offsetWidth),
          e.css("overflow", "scroll"),
          t === (i = i.offsetWidth) && (i = e[0].clientWidth),
          e.remove(),
          (s = t - i)
        );
      },
      getScrollInfo: function (t) {
        var e = t.isWindow || t.isDocument ? "" : t.element.css("overflow-x"),
          i = t.isWindow || t.isDocument ? "" : t.element.css("overflow-y"),
          e =
            "scroll" === e ||
            ("auto" === e && t.width < t.element[0].scrollWidth);
        return {
          width:
            "scroll" === i ||
            ("auto" === i && t.height < t.element[0].scrollHeight)
              ? k.position.scrollbarWidth()
              : 0,
          height: e ? k.position.scrollbarWidth() : 0,
        };
      },
      getWithinInfo: function (t) {
        var e = k(t || window),
          i = k.isWindow(e[0]),
          s = !!e[0] && 9 === e[0].nodeType;
        return {
          element: e,
          isWindow: i,
          isDocument: s,
          offset: !i && !s ? k(t).offset() : { left: 0, top: 0 },
          scrollLeft: e.scrollLeft(),
          scrollTop: e.scrollTop(),
          width: e.outerWidth(),
          height: e.outerHeight(),
        };
      },
    }),
    (k.fn.position = function (u) {
      if (!u || !u.of) return D.apply(this, arguments);
      u = k.extend({}, u);
      var d,
        p,
        f,
        g,
        m,
        t,
        _ = k(u.of),
        v = k.position.getWithinInfo(u.within),
        b = k.position.getScrollInfo(v),
        y = (u.collision || "flip").split(" "),
        w = {},
        e =
          9 === (t = (e = _)[0]).nodeType
            ? {
                width: e.width(),
                height: e.height(),
                offset: { top: 0, left: 0 },
              }
            : k.isWindow(t)
            ? {
                width: e.width(),
                height: e.height(),
                offset: { top: e.scrollTop(), left: e.scrollLeft() },
              }
            : t.preventDefault
            ? { width: 0, height: 0, offset: { top: t.pageY, left: t.pageX } }
            : {
                width: e.outerWidth(),
                height: e.outerHeight(),
                offset: e.offset(),
              };
      return (
        _[0].preventDefault && (u.at = "left top"),
        (p = e.width),
        (f = e.height),
        (g = e.offset),
        (m = k.extend({}, g)),
        k.each(["my", "at"], function () {
          var t,
            e,
            i = (u[this] || "").split(" ");
          1 === i.length &&
            (i = o.test(i[0])
              ? i.concat(["center"])
              : a.test(i[0])
              ? ["center"].concat(i)
              : ["center", "center"]),
            (i[0] = o.test(i[0]) ? i[0] : "center"),
            (i[1] = a.test(i[1]) ? i[1] : "center"),
            (t = h.exec(i[0])),
            (e = h.exec(i[1])),
            (w[this] = [t ? t[0] : 0, e ? e[0] : 0]),
            (u[this] = [l.exec(i[0])[0], l.exec(i[1])[0]]);
        }),
        1 === y.length && (y[1] = y[0]),
        "right" === u.at[0]
          ? (m.left += p)
          : "center" === u.at[0] && (m.left += p / 2),
        "bottom" === u.at[1]
          ? (m.top += f)
          : "center" === u.at[1] && (m.top += f / 2),
        (d = I(w.at, p, f)),
        (m.left += d[0]),
        (m.top += d[1]),
        this.each(function () {
          var i,
            t,
            a = k(this),
            r = a.outerWidth(),
            h = a.outerHeight(),
            e = P(this, "marginLeft"),
            s = P(this, "marginTop"),
            n = r + e + P(this, "marginRight") + b.width,
            o = h + s + P(this, "marginBottom") + b.height,
            l = k.extend({}, m),
            c = I(w.my, a.outerWidth(), a.outerHeight());
          "right" === u.my[0]
            ? (l.left -= r)
            : "center" === u.my[0] && (l.left -= r / 2),
            "bottom" === u.my[1]
              ? (l.top -= h)
              : "center" === u.my[1] && (l.top -= h / 2),
            (l.left += c[0]),
            (l.top += c[1]),
            (i = { marginLeft: e, marginTop: s }),
            k.each(["left", "top"], function (t, e) {
              k.ui.position[y[t]] &&
                k.ui.position[y[t]][e](l, {
                  targetWidth: p,
                  targetHeight: f,
                  elemWidth: r,
                  elemHeight: h,
                  collisionPosition: i,
                  collisionWidth: n,
                  collisionHeight: o,
                  offset: [d[0] + c[0], d[1] + c[1]],
                  my: u.my,
                  at: u.at,
                  within: v,
                  elem: a,
                });
            }),
            u.using &&
              (t = function (t) {
                var e = g.left - l.left,
                  i = e + p - r,
                  s = g.top - l.top,
                  n = s + f - h,
                  o = {
                    target: {
                      element: _,
                      left: g.left,
                      top: g.top,
                      width: p,
                      height: f,
                    },
                    element: {
                      element: a,
                      left: l.left,
                      top: l.top,
                      width: r,
                      height: h,
                    },
                    horizontal: i < 0 ? "left" : 0 < e ? "right" : "center",
                    vertical: n < 0 ? "top" : 0 < s ? "bottom" : "middle",
                  };
                p < r && x(e + i) < p && (o.horizontal = "center"),
                  f < h && x(s + n) < f && (o.vertical = "middle"),
                  C(x(e), x(i)) > C(x(s), x(n))
                    ? (o.important = "horizontal")
                    : (o.important = "vertical"),
                  u.using.call(this, t, o);
              }),
            a.offset(k.extend(l, { using: t }));
        })
      );
    }),
    (k.ui.position = {
      fit: {
        left: function (t, e) {
          var i = e.within,
            s = i.isWindow ? i.scrollLeft : i.offset.left,
            n = i.width,
            o = t.left - e.collisionPosition.marginLeft,
            a = s - o,
            r = o + e.collisionWidth - n - s;
          e.collisionWidth > n
            ? 0 < a && r <= 0
              ? ((i = t.left + a + e.collisionWidth - n - s), (t.left += a - i))
              : (t.left =
                  !(0 < r && a <= 0) && r < a ? s + n - e.collisionWidth : s)
            : 0 < a
            ? (t.left += a)
            : 0 < r
            ? (t.left -= r)
            : (t.left = C(t.left - o, t.left));
        },
        top: function (t, e) {
          var i = e.within,
            s = i.isWindow ? i.scrollTop : i.offset.top,
            n = e.within.height,
            o = t.top - e.collisionPosition.marginTop,
            a = s - o,
            r = o + e.collisionHeight - n - s;
          e.collisionHeight > n
            ? 0 < a && r <= 0
              ? ((i = t.top + a + e.collisionHeight - n - s), (t.top += a - i))
              : (t.top =
                  !(0 < r && a <= 0) && r < a ? s + n - e.collisionHeight : s)
            : 0 < a
            ? (t.top += a)
            : 0 < r
            ? (t.top -= r)
            : (t.top = C(t.top - o, t.top));
        },
      },
      flip: {
        left: function (t, e) {
          var i = e.within,
            s = i.offset.left + i.scrollLeft,
            n = i.width,
            o = i.isWindow ? i.scrollLeft : i.offset.left,
            a = t.left - e.collisionPosition.marginLeft,
            r = a - o,
            h = a + e.collisionWidth - n - o,
            l =
              "left" === e.my[0]
                ? -e.elemWidth
                : "right" === e.my[0]
                ? e.elemWidth
                : 0,
            i =
              "left" === e.at[0]
                ? e.targetWidth
                : "right" === e.at[0]
                ? -e.targetWidth
                : 0,
            a = -2 * e.offset[0];
          r < 0
            ? ((s = t.left + l + i + a + e.collisionWidth - n - s) < 0 ||
                s < x(r)) &&
              (t.left += l + i + a)
            : 0 < h &&
              (0 <
                (o = t.left - e.collisionPosition.marginLeft + l + i + a - o) ||
                x(o) < h) &&
              (t.left += l + i + a);
        },
        top: function (t, e) {
          var i = e.within,
            s = i.offset.top + i.scrollTop,
            n = i.height,
            o = i.isWindow ? i.scrollTop : i.offset.top,
            a = t.top - e.collisionPosition.marginTop,
            r = a - o,
            h = a + e.collisionHeight - n - o,
            l =
              "top" === e.my[1]
                ? -e.elemHeight
                : "bottom" === e.my[1]
                ? e.elemHeight
                : 0,
            i =
              "top" === e.at[1]
                ? e.targetHeight
                : "bottom" === e.at[1]
                ? -e.targetHeight
                : 0,
            a = -2 * e.offset[1];
          r < 0
            ? ((s = t.top + l + i + a + e.collisionHeight - n - s) < 0 ||
                s < x(r)) &&
              (t.top += l + i + a)
            : 0 < h &&
              (0 <
                (o = t.top - e.collisionPosition.marginTop + l + i + a - o) ||
                x(o) < h) &&
              (t.top += l + i + a);
        },
      },
      flipfit: {
        left: function () {
          k.ui.position.flip.left.apply(this, arguments),
            k.ui.position.fit.left.apply(this, arguments);
        },
        top: function () {
          k.ui.position.flip.top.apply(this, arguments),
            k.ui.position.fit.top.apply(this, arguments);
        },
      },
    });
  var t;
  k.ui.position,
    k.extend(k.expr[":"], {
      data: k.expr.createPseudo
        ? k.expr.createPseudo(function (e) {
            return function (t) {
              return !!k.data(t, e);
            };
          })
        : function (t, e, i) {
            return !!k.data(t, i[3]);
          },
    }),
    k.fn.extend({
      disableSelection:
        ((t =
          "onselectstart" in document.createElement("div")
            ? "selectstart"
            : "mousedown"),
        function () {
          return this.on(t + ".ui-disableSelection", function (t) {
            t.preventDefault();
          });
        }),
      enableSelection: function () {
        return this.off(".ui-disableSelection");
      },
    });
  (k.ui.focusable = function (t, e) {
    var i,
      s,
      n,
      o,
      a = t.nodeName.toLowerCase();
    return "area" === a
      ? ((s = (i = t.parentNode).name),
        !(!t.href || !s || "map" !== i.nodeName.toLowerCase()) &&
          0 < (s = k("img[usemap='#" + s + "']")).length &&
          s.is(":visible"))
      : (/^(input|select|textarea|button|object)$/.test(a)
          ? (n = !t.disabled) &&
            (o = k(t).closest("fieldset")[0]) &&
            (n = !o.disabled)
          : (n = ("a" === a && t.href) || e),
        n &&
          k(t).is(":visible") &&
          (function (t) {
            var e = t.css("visibility");
            for (; "inherit" === e; )
              (t = t.parent()), (e = t.css("visibility"));
            return "hidden" !== e;
          })(k(t)));
  }),
    k.extend(k.expr[":"], {
      focusable: function (t) {
        return k.ui.focusable(t, null != k.attr(t, "tabindex"));
      },
    });
  k.ui.focusable,
    (k.fn.form = function () {
      return "string" == typeof this[0].form
        ? this.closest("form")
        : k(this[0].form);
    }),
    (k.ui.formResetMixin = {
      _formResetHandler: function () {
        var e = k(this);
        setTimeout(function () {
          var t = e.data("ui-form-reset-instances");
          k.each(t, function () {
            this.refresh();
          });
        });
      },
      _bindFormResetHandler: function () {
        var t;
        (this.form = this.element.form()),
          this.form.length &&
            ((t = this.form.data("ui-form-reset-instances") || []).length ||
              this.form.on("reset.ui-form-reset", this._formResetHandler),
            t.push(this),
            this.form.data("ui-form-reset-instances", t));
      },
      _unbindFormResetHandler: function () {
        var t;
        this.form.length &&
          ((t = this.form.data("ui-form-reset-instances")).splice(
            k.inArray(this, t),
            1
          ),
          t.length
            ? this.form.data("ui-form-reset-instances", t)
            : this.form
                .removeData("ui-form-reset-instances")
                .off("reset.ui-form-reset"));
      },
    }),
    (k.ui.keyCode = {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38,
    }),
    (k.ui.escapeSelector =
      ((e = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g),
      function (t) {
        return t.replace(e, "\\$1");
      })),
    (k.fn.labels = function () {
      var t, e, i;
      return this[0].labels && this[0].labels.length
        ? this.pushStack(this[0].labels)
        : ((e = this.eq(0).parents("label")),
          (t = this.attr("id")) &&
            ((i = (i = this.eq(0).parents().last()).add(
              (i.length ? i : this).siblings()
            )),
            (t = "label[for='" + k.ui.escapeSelector(t) + "']"),
            (e = e.add(i.find(t).addBack(t)))),
          this.pushStack(e));
    }),
    (k.fn.scrollParent = function (t) {
      var e = this.css("position"),
        i = "absolute" === e,
        s = t ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
        t = this.parents()
          .filter(function () {
            var t = k(this);
            return (
              (!i || "static" !== t.css("position")) &&
              s.test(
                t.css("overflow") + t.css("overflow-y") + t.css("overflow-x")
              )
            );
          })
          .eq(0);
      return "fixed" !== e && t.length
        ? t
        : k(this[0].ownerDocument || document);
    }),
    k.extend(k.expr[":"], {
      tabbable: function (t) {
        var e = k.attr(t, "tabindex"),
          i = null != e;
        return (!i || 0 <= e) && k.ui.focusable(t, i);
      },
    }),
    k.fn.extend({
      uniqueId:
        ((u = 0),
        function () {
          return this.each(function () {
            this.id || (this.id = "ui-id-" + ++u);
          });
        }),
      removeUniqueId: function () {
        return this.each(function () {
          /^ui-id-\d+$/.test(this.id) && k(this).removeAttr("id");
        });
      },
    }),
    (k.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()));
  var e,
    u,
    d = !1;
  k(document).on("mouseup", function () {
    d = !1;
  });
  k.widget("ui.mouse", {
    version: "1.12.1",
    options: {
      cancel: "input, textarea, button, select, option",
      distance: 1,
      delay: 0,
    },
    _mouseInit: function () {
      var e = this;
      this.element
        .on("mousedown." + this.widgetName, function (t) {
          return e._mouseDown(t);
        })
        .on("click." + this.widgetName, function (t) {
          if (!0 === k.data(t.target, e.widgetName + ".preventClickEvent"))
            return (
              k.removeData(t.target, e.widgetName + ".preventClickEvent"),
              t.stopImmediatePropagation(),
              !1
            );
        }),
        (this.started = !1);
    },
    _mouseDestroy: function () {
      this.element.off("." + this.widgetName),
        this._mouseMoveDelegate &&
          this.document
            .off("mousemove." + this.widgetName, this._mouseMoveDelegate)
            .off("mouseup." + this.widgetName, this._mouseUpDelegate);
    },
    _mouseDown: function (t) {
      if (!d) {
        (this._mouseMoved = !1),
          this._mouseStarted && this._mouseUp(t),
          (this._mouseDownEvent = t);
        var e = this,
          i = 1 === t.which,
          s =
            !("string" != typeof this.options.cancel || !t.target.nodeName) &&
            k(t.target).closest(this.options.cancel).length;
        return i && !s && this._mouseCapture(t)
          ? ((this.mouseDelayMet = !this.options.delay),
            this.mouseDelayMet ||
              (this._mouseDelayTimer = setTimeout(function () {
                e.mouseDelayMet = !0;
              }, this.options.delay)),
            this._mouseDistanceMet(t) &&
            this._mouseDelayMet(t) &&
            ((this._mouseStarted = !1 !== this._mouseStart(t)),
            !this._mouseStarted)
              ? (t.preventDefault(), !0)
              : (!0 ===
                  k.data(t.target, this.widgetName + ".preventClickEvent") &&
                  k.removeData(
                    t.target,
                    this.widgetName + ".preventClickEvent"
                  ),
                (this._mouseMoveDelegate = function (t) {
                  return e._mouseMove(t);
                }),
                (this._mouseUpDelegate = function (t) {
                  return e._mouseUp(t);
                }),
                this.document
                  .on("mousemove." + this.widgetName, this._mouseMoveDelegate)
                  .on("mouseup." + this.widgetName, this._mouseUpDelegate),
                t.preventDefault(),
                (d = !0)))
          : !0;
      }
    },
    _mouseMove: function (t) {
      if (this._mouseMoved) {
        if (
          k.ui.ie &&
          (!document.documentMode || document.documentMode < 9) &&
          !t.button
        )
          return this._mouseUp(t);
        if (!t.which)
          if (
            t.originalEvent.altKey ||
            t.originalEvent.ctrlKey ||
            t.originalEvent.metaKey ||
            t.originalEvent.shiftKey
          )
            this.ignoreMissingWhich = !0;
          else if (!this.ignoreMissingWhich) return this._mouseUp(t);
      }
      return (
        (t.which || t.button) && (this._mouseMoved = !0),
        this._mouseStarted
          ? (this._mouseDrag(t), t.preventDefault())
          : (this._mouseDistanceMet(t) &&
              this._mouseDelayMet(t) &&
              ((this._mouseStarted =
                !1 !== this._mouseStart(this._mouseDownEvent, t)),
              this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)),
            !this._mouseStarted)
      );
    },
    _mouseUp: function (t) {
      this.document
        .off("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .off("mouseup." + this.widgetName, this._mouseUpDelegate),
        this._mouseStarted &&
          ((this._mouseStarted = !1),
          t.target === this._mouseDownEvent.target &&
            k.data(t.target, this.widgetName + ".preventClickEvent", !0),
          this._mouseStop(t)),
        this._mouseDelayTimer &&
          (clearTimeout(this._mouseDelayTimer), delete this._mouseDelayTimer),
        (this.ignoreMissingWhich = !1),
        (d = !1),
        t.preventDefault();
    },
    _mouseDistanceMet: function (t) {
      return (
        Math.max(
          Math.abs(this._mouseDownEvent.pageX - t.pageX),
          Math.abs(this._mouseDownEvent.pageY - t.pageY)
        ) >= this.options.distance
      );
    },
    _mouseDelayMet: function () {
      return this.mouseDelayMet;
    },
    _mouseStart: function () {},
    _mouseDrag: function () {},
    _mouseStop: function () {},
    _mouseCapture: function () {
      return !0;
    },
  }),
    (k.ui.plugin = {
      add: function (t, e, i) {
        var s,
          n = k.ui[t].prototype;
        for (s in i)
          (n.plugins[s] = n.plugins[s] || []), n.plugins[s].push([e, i[s]]);
      },
      call: function (t, e, i, s) {
        var n,
          o = t.plugins[e];
        if (
          o &&
          (s ||
            (t.element[0].parentNode &&
              11 !== t.element[0].parentNode.nodeType))
        )
          for (n = 0; n < o.length; n++)
            t.options[o[n][0]] && o[n][1].apply(t.element, i);
      },
    }),
    (k.ui.safeActiveElement = function (e) {
      var i;
      try {
        i = e.activeElement;
      } catch (t) {
        i = e.body;
      }
      return (i = i || e.body).nodeName || (i = e.body), i;
    }),
    (k.ui.safeBlur = function (t) {
      t && "body" !== t.nodeName.toLowerCase() && k(t).trigger("blur");
    });
  k.widget("ui.draggable", k.ui.mouse, {
    version: "1.12.1",
    widgetEventPrefix: "drag",
    options: {
      addClasses: !0,
      appendTo: "parent",
      axis: !1,
      connectToSortable: !1,
      containment: !1,
      cursor: "auto",
      cursorAt: !1,
      grid: !1,
      handle: !1,
      helper: "original",
      iframeFix: !1,
      opacity: !1,
      refreshPositions: !1,
      revert: !1,
      revertDuration: 500,
      scope: "default",
      scroll: !0,
      scrollSensitivity: 20,
      scrollSpeed: 20,
      snap: !1,
      snapMode: "both",
      snapTolerance: 20,
      stack: !1,
      zIndex: !1,
      drag: null,
      start: null,
      stop: null,
    },
    _create: function () {
      "original" === this.options.helper && this._setPositionRelative(),
        this.options.addClasses && this._addClass("ui-draggable"),
        this._setHandleClassName(),
        this._mouseInit();
    },
    _setOption: function (t, e) {
      this._super(t, e),
        "handle" === t &&
          (this._removeHandleClassName(), this._setHandleClassName());
    },
    _destroy: function () {
      (this.helper || this.element).is(".ui-draggable-dragging")
        ? (this.destroyOnClear = !0)
        : (this._removeHandleClassName(), this._mouseDestroy());
    },
    _mouseCapture: function (t) {
      var e = this.options;
      return (
        !(
          this.helper ||
          e.disabled ||
          0 < k(t.target).closest(".ui-resizable-handle").length
        ) &&
        ((this.handle = this._getHandle(t)),
        !!this.handle &&
          (this._blurActiveElement(t),
          this._blockFrames(!0 === e.iframeFix ? "iframe" : e.iframeFix),
          !0))
      );
    },
    _blockFrames: function (t) {
      this.iframeBlocks = this.document.find(t).map(function () {
        var t = k(this);
        return k("<div>")
          .css("position", "absolute")
          .appendTo(t.parent())
          .outerWidth(t.outerWidth())
          .outerHeight(t.outerHeight())
          .offset(t.offset())[0];
      });
    },
    _unblockFrames: function () {
      this.iframeBlocks &&
        (this.iframeBlocks.remove(), delete this.iframeBlocks);
    },
    _blurActiveElement: function (t) {
      var e = k.ui.safeActiveElement(this.document[0]);
      k(t.target).closest(e).length || k.ui.safeBlur(e);
    },
    _mouseStart: function (t) {
      var e = this.options;
      return (
        (this.helper = this._createHelper(t)),
        this._addClass(this.helper, "ui-draggable-dragging"),
        this._cacheHelperProportions(),
        k.ui.ddmanager && (k.ui.ddmanager.current = this),
        this._cacheMargins(),
        (this.cssPosition = this.helper.css("position")),
        (this.scrollParent = this.helper.scrollParent(!0)),
        (this.offsetParent = this.helper.offsetParent()),
        (this.hasFixedAncestor =
          0 <
          this.helper.parents().filter(function () {
            return "fixed" === k(this).css("position");
          }).length),
        (this.positionAbs = this.element.offset()),
        this._refreshOffsets(t),
        (this.originalPosition = this.position = this._generatePosition(t, !1)),
        (this.originalPageX = t.pageX),
        (this.originalPageY = t.pageY),
        e.cursorAt && this._adjustOffsetFromHelper(e.cursorAt),
        this._setContainment(),
        !1 === this._trigger("start", t)
          ? (this._clear(), !1)
          : (this._cacheHelperProportions(),
            k.ui.ddmanager &&
              !e.dropBehaviour &&
              k.ui.ddmanager.prepareOffsets(this, t),
            this._mouseDrag(t, !0),
            k.ui.ddmanager && k.ui.ddmanager.dragStart(this, t),
            !0)
      );
    },
    _refreshOffsets: function (t) {
      (this.offset = {
        top: this.positionAbs.top - this.margins.top,
        left: this.positionAbs.left - this.margins.left,
        scroll: !1,
        parent: this._getParentOffset(),
        relative: this._getRelativeOffset(),
      }),
        (this.offset.click = {
          left: t.pageX - this.offset.left,
          top: t.pageY - this.offset.top,
        });
    },
    _mouseDrag: function (t, e) {
      if (
        (this.hasFixedAncestor &&
          (this.offset.parent = this._getParentOffset()),
        (this.position = this._generatePosition(t, !0)),
        (this.positionAbs = this._convertPositionTo("absolute")),
        !e)
      ) {
        e = this._uiHash();
        if (!1 === this._trigger("drag", t, e))
          return this._mouseUp(new k.Event("mouseup", t)), !1;
        this.position = e.position;
      }
      return (
        (this.helper[0].style.left = this.position.left + "px"),
        (this.helper[0].style.top = this.position.top + "px"),
        k.ui.ddmanager && k.ui.ddmanager.drag(this, t),
        !1
      );
    },
    _mouseStop: function (t) {
      var e = this,
        i = !1;
      return (
        k.ui.ddmanager &&
          !this.options.dropBehaviour &&
          (i = k.ui.ddmanager.drop(this, t)),
        this.dropped && ((i = this.dropped), (this.dropped = !1)),
        ("invalid" === this.options.revert && !i) ||
        ("valid" === this.options.revert && i) ||
        !0 === this.options.revert ||
        (k.isFunction(this.options.revert) &&
          this.options.revert.call(this.element, i))
          ? k(this.helper).animate(
              this.originalPosition,
              parseInt(this.options.revertDuration, 10),
              function () {
                !1 !== e._trigger("stop", t) && e._clear();
              }
            )
          : !1 !== this._trigger("stop", t) && this._clear(),
        !1
      );
    },
    _mouseUp: function (t) {
      return (
        this._unblockFrames(),
        k.ui.ddmanager && k.ui.ddmanager.dragStop(this, t),
        this.handleElement.is(t.target) && this.element.trigger("focus"),
        k.ui.mouse.prototype._mouseUp.call(this, t)
      );
    },
    cancel: function () {
      return (
        this.helper.is(".ui-draggable-dragging")
          ? this._mouseUp(new k.Event("mouseup", { target: this.element[0] }))
          : this._clear(),
        this
      );
    },
    _getHandle: function (t) {
      return (
        !this.options.handle ||
        !!k(t.target).closest(this.element.find(this.options.handle)).length
      );
    },
    _setHandleClassName: function () {
      (this.handleElement = this.options.handle
        ? this.element.find(this.options.handle)
        : this.element),
        this._addClass(this.handleElement, "ui-draggable-handle");
    },
    _removeHandleClassName: function () {
      this._removeClass(this.handleElement, "ui-draggable-handle");
    },
    _createHelper: function (t) {
      var e = this.options,
        i = k.isFunction(e.helper),
        t = i
          ? k(e.helper.apply(this.element[0], [t]))
          : "clone" === e.helper
          ? this.element.clone().removeAttr("id")
          : this.element;
      return (
        t.parents("body").length ||
          t.appendTo(
            "parent" === e.appendTo ? this.element[0].parentNode : e.appendTo
          ),
        i && t[0] === this.element[0] && this._setPositionRelative(),
        t[0] === this.element[0] ||
          /(fixed|absolute)/.test(t.css("position")) ||
          t.css("position", "absolute"),
        t
      );
    },
    _setPositionRelative: function () {
      /^(?:r|a|f)/.test(this.element.css("position")) ||
        (this.element[0].style.position = "relative");
    },
    _adjustOffsetFromHelper: function (t) {
      "string" == typeof t && (t = t.split(" ")),
        k.isArray(t) && (t = { left: +t[0], top: +t[1] || 0 }),
        "left" in t && (this.offset.click.left = t.left + this.margins.left),
        "right" in t &&
          (this.offset.click.left =
            this.helperProportions.width - t.right + this.margins.left),
        "top" in t && (this.offset.click.top = t.top + this.margins.top),
        "bottom" in t &&
          (this.offset.click.top =
            this.helperProportions.height - t.bottom + this.margins.top);
    },
    _isRootNode: function (t) {
      return /(html|body)/i.test(t.tagName) || t === this.document[0];
    },
    _getParentOffset: function () {
      var t = this.offsetParent.offset(),
        e = this.document[0];
      return (
        "absolute" === this.cssPosition &&
          this.scrollParent[0] !== e &&
          k.contains(this.scrollParent[0], this.offsetParent[0]) &&
          ((t.left += this.scrollParent.scrollLeft()),
          (t.top += this.scrollParent.scrollTop())),
        this._isRootNode(this.offsetParent[0]) && (t = { top: 0, left: 0 }),
        {
          top:
            t.top +
            (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
          left:
            t.left +
            (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0),
        }
      );
    },
    _getRelativeOffset: function () {
      if ("relative" !== this.cssPosition) return { top: 0, left: 0 };
      var t = this.element.position(),
        e = this._isRootNode(this.scrollParent[0]);
      return {
        top:
          t.top -
          (parseInt(this.helper.css("top"), 10) || 0) +
          (e ? 0 : this.scrollParent.scrollTop()),
        left:
          t.left -
          (parseInt(this.helper.css("left"), 10) || 0) +
          (e ? 0 : this.scrollParent.scrollLeft()),
      };
    },
    _cacheMargins: function () {
      this.margins = {
        left: parseInt(this.element.css("marginLeft"), 10) || 0,
        top: parseInt(this.element.css("marginTop"), 10) || 0,
        right: parseInt(this.element.css("marginRight"), 10) || 0,
        bottom: parseInt(this.element.css("marginBottom"), 10) || 0,
      };
    },
    _cacheHelperProportions: function () {
      this.helperProportions = {
        width: this.helper.outerWidth(),
        height: this.helper.outerHeight(),
      };
    },
    _setContainment: function () {
      var t,
        e,
        i,
        s = this.options,
        n = this.document[0];
      (this.relativeContainer = null),
        s.containment
          ? "window" !== s.containment
            ? "document" !== s.containment
              ? s.containment.constructor !== Array
                ? ("parent" === s.containment &&
                    (s.containment = this.helper[0].parentNode),
                  (i = (e = k(s.containment))[0]) &&
                    ((t = /(scroll|auto)/.test(e.css("overflow"))),
                    (this.containment = [
                      (parseInt(e.css("borderLeftWidth"), 10) || 0) +
                        (parseInt(e.css("paddingLeft"), 10) || 0),
                      (parseInt(e.css("borderTopWidth"), 10) || 0) +
                        (parseInt(e.css("paddingTop"), 10) || 0),
                      (t
                        ? Math.max(i.scrollWidth, i.offsetWidth)
                        : i.offsetWidth) -
                        (parseInt(e.css("borderRightWidth"), 10) || 0) -
                        (parseInt(e.css("paddingRight"), 10) || 0) -
                        this.helperProportions.width -
                        this.margins.left -
                        this.margins.right,
                      (t
                        ? Math.max(i.scrollHeight, i.offsetHeight)
                        : i.offsetHeight) -
                        (parseInt(e.css("borderBottomWidth"), 10) || 0) -
                        (parseInt(e.css("paddingBottom"), 10) || 0) -
                        this.helperProportions.height -
                        this.margins.top -
                        this.margins.bottom,
                    ]),
                    (this.relativeContainer = e)))
                : (this.containment = s.containment)
              : (this.containment = [
                  0,
                  0,
                  k(n).width() -
                    this.helperProportions.width -
                    this.margins.left,
                  (k(n).height() || n.body.parentNode.scrollHeight) -
                    this.helperProportions.height -
                    this.margins.top,
                ])
            : (this.containment = [
                k(window).scrollLeft() -
                  this.offset.relative.left -
                  this.offset.parent.left,
                k(window).scrollTop() -
                  this.offset.relative.top -
                  this.offset.parent.top,
                k(window).scrollLeft() +
                  k(window).width() -
                  this.helperProportions.width -
                  this.margins.left,
                k(window).scrollTop() +
                  (k(window).height() || n.body.parentNode.scrollHeight) -
                  this.helperProportions.height -
                  this.margins.top,
              ])
          : (this.containment = null);
    },
    _convertPositionTo: function (t, e) {
      e = e || this.position;
      var i = "absolute" === t ? 1 : -1,
        t = this._isRootNode(this.scrollParent[0]);
      return {
        top:
          e.top +
          this.offset.relative.top * i +
          this.offset.parent.top * i -
          ("fixed" === this.cssPosition
            ? -this.offset.scroll.top
            : t
            ? 0
            : this.offset.scroll.top) *
            i,
        left:
          e.left +
          this.offset.relative.left * i +
          this.offset.parent.left * i -
          ("fixed" === this.cssPosition
            ? -this.offset.scroll.left
            : t
            ? 0
            : this.offset.scroll.left) *
            i,
      };
    },
    _generatePosition: function (t, e) {
      var i,
        s = this.options,
        n = this._isRootNode(this.scrollParent[0]),
        o = t.pageX,
        a = t.pageY;
      return (
        (n && this.offset.scroll) ||
          (this.offset.scroll = {
            top: this.scrollParent.scrollTop(),
            left: this.scrollParent.scrollLeft(),
          }),
        e &&
          (this.containment &&
            ((i = this.relativeContainer
              ? ((i = this.relativeContainer.offset()),
                [
                  this.containment[0] + i.left,
                  this.containment[1] + i.top,
                  this.containment[2] + i.left,
                  this.containment[3] + i.top,
                ])
              : this.containment),
            t.pageX - this.offset.click.left < i[0] &&
              (o = i[0] + this.offset.click.left),
            t.pageY - this.offset.click.top < i[1] &&
              (a = i[1] + this.offset.click.top),
            t.pageX - this.offset.click.left > i[2] &&
              (o = i[2] + this.offset.click.left),
            t.pageY - this.offset.click.top > i[3] &&
              (a = i[3] + this.offset.click.top)),
          s.grid &&
            ((t = s.grid[1]
              ? this.originalPageY +
                Math.round((a - this.originalPageY) / s.grid[1]) * s.grid[1]
              : this.originalPageY),
            (a =
              !i ||
              t - this.offset.click.top >= i[1] ||
              t - this.offset.click.top > i[3]
                ? t
                : t - this.offset.click.top >= i[1]
                ? t - s.grid[1]
                : t + s.grid[1]),
            (t = s.grid[0]
              ? this.originalPageX +
                Math.round((o - this.originalPageX) / s.grid[0]) * s.grid[0]
              : this.originalPageX),
            (o =
              !i ||
              t - this.offset.click.left >= i[0] ||
              t - this.offset.click.left > i[2]
                ? t
                : t - this.offset.click.left >= i[0]
                ? t - s.grid[0]
                : t + s.grid[0])),
          "y" === s.axis && (o = this.originalPageX),
          "x" === s.axis && (a = this.originalPageY)),
        {
          top:
            a -
            this.offset.click.top -
            this.offset.relative.top -
            this.offset.parent.top +
            ("fixed" === this.cssPosition
              ? -this.offset.scroll.top
              : n
              ? 0
              : this.offset.scroll.top),
          left:
            o -
            this.offset.click.left -
            this.offset.relative.left -
            this.offset.parent.left +
            ("fixed" === this.cssPosition
              ? -this.offset.scroll.left
              : n
              ? 0
              : this.offset.scroll.left),
        }
      );
    },
    _clear: function () {
      this._removeClass(this.helper, "ui-draggable-dragging"),
        this.helper[0] === this.element[0] ||
          this.cancelHelperRemoval ||
          this.helper.remove(),
        (this.helper = null),
        (this.cancelHelperRemoval = !1),
        this.destroyOnClear && this.destroy();
    },
    _trigger: function (t, e, i) {
      return (
        (i = i || this._uiHash()),
        k.ui.plugin.call(this, t, [e, i, this], !0),
        /^(drag|start|stop)/.test(t) &&
          ((this.positionAbs = this._convertPositionTo("absolute")),
          (i.offset = this.positionAbs)),
        k.Widget.prototype._trigger.call(this, t, e, i)
      );
    },
    plugins: {},
    _uiHash: function () {
      return {
        helper: this.helper,
        position: this.position,
        originalPosition: this.originalPosition,
        offset: this.positionAbs,
      };
    },
  }),
    k.ui.plugin.add("draggable", "connectToSortable", {
      start: function (e, t, i) {
        var s = k.extend({}, t, { item: i.element });
        (i.sortables = []),
          k(i.options.connectToSortable).each(function () {
            var t = k(this).sortable("instance");
            t &&
              !t.options.disabled &&
              (i.sortables.push(t),
              t.refreshPositions(),
              t._trigger("activate", e, s));
          });
      },
      stop: function (e, t, i) {
        var s = k.extend({}, t, { item: i.element });
        (i.cancelHelperRemoval = !1),
          k.each(i.sortables, function () {
            var t = this;
            t.isOver
              ? ((t.isOver = 0),
                (i.cancelHelperRemoval = !0),
                (t.cancelHelperRemoval = !1),
                (t._storedCSS = {
                  position: t.placeholder.css("position"),
                  top: t.placeholder.css("top"),
                  left: t.placeholder.css("left"),
                }),
                t._mouseStop(e),
                (t.options.helper = t.options._helper))
              : ((t.cancelHelperRemoval = !0), t._trigger("deactivate", e, s));
          });
      },
      drag: function (i, s, n) {
        k.each(n.sortables, function () {
          var t = !1,
            e = this;
          (e.positionAbs = n.positionAbs),
            (e.helperProportions = n.helperProportions),
            (e.offset.click = n.offset.click),
            e._intersectsWith(e.containerCache) &&
              ((t = !0),
              k.each(n.sortables, function () {
                return (
                  (this.positionAbs = n.positionAbs),
                  (this.helperProportions = n.helperProportions),
                  (this.offset.click = n.offset.click),
                  this !== e &&
                    this._intersectsWith(this.containerCache) &&
                    k.contains(e.element[0], this.element[0]) &&
                    (t = !1),
                  t
                );
              })),
            t
              ? (e.isOver ||
                  ((e.isOver = 1),
                  (n._parent = s.helper.parent()),
                  (e.currentItem = s.helper
                    .appendTo(e.element)
                    .data("ui-sortable-item", !0)),
                  (e.options._helper = e.options.helper),
                  (e.options.helper = function () {
                    return s.helper[0];
                  }),
                  (i.target = e.currentItem[0]),
                  e._mouseCapture(i, !0),
                  e._mouseStart(i, !0, !0),
                  (e.offset.click.top = n.offset.click.top),
                  (e.offset.click.left = n.offset.click.left),
                  (e.offset.parent.left -=
                    n.offset.parent.left - e.offset.parent.left),
                  (e.offset.parent.top -=
                    n.offset.parent.top - e.offset.parent.top),
                  n._trigger("toSortable", i),
                  (n.dropped = e.element),
                  k.each(n.sortables, function () {
                    this.refreshPositions();
                  }),
                  (n.currentItem = n.element),
                  (e.fromOutside = n)),
                e.currentItem && (e._mouseDrag(i), (s.position = e.position)))
              : e.isOver &&
                ((e.isOver = 0),
                (e.cancelHelperRemoval = !0),
                (e.options._revert = e.options.revert),
                (e.options.revert = !1),
                e._trigger("out", i, e._uiHash(e)),
                e._mouseStop(i, !0),
                (e.options.revert = e.options._revert),
                (e.options.helper = e.options._helper),
                e.placeholder && e.placeholder.remove(),
                s.helper.appendTo(n._parent),
                n._refreshOffsets(i),
                (s.position = n._generatePosition(i, !0)),
                n._trigger("fromSortable", i),
                (n.dropped = !1),
                k.each(n.sortables, function () {
                  this.refreshPositions();
                }));
        });
      },
    }),
    k.ui.plugin.add("draggable", "cursor", {
      start: function (t, e, i) {
        var s = k("body"),
          i = i.options;
        s.css("cursor") && (i._cursor = s.css("cursor")),
          s.css("cursor", i.cursor);
      },
      stop: function (t, e, i) {
        i = i.options;
        i._cursor && k("body").css("cursor", i._cursor);
      },
    }),
    k.ui.plugin.add("draggable", "opacity", {
      start: function (t, e, i) {
        (e = k(e.helper)), (i = i.options);
        e.css("opacity") && (i._opacity = e.css("opacity")),
          e.css("opacity", i.opacity);
      },
      stop: function (t, e, i) {
        i = i.options;
        i._opacity && k(e.helper).css("opacity", i._opacity);
      },
    }),
    k.ui.plugin.add("draggable", "scroll", {
      start: function (t, e, i) {
        i.scrollParentNotHidden ||
          (i.scrollParentNotHidden = i.helper.scrollParent(!1)),
          i.scrollParentNotHidden[0] !== i.document[0] &&
            "HTML" !== i.scrollParentNotHidden[0].tagName &&
            (i.overflowOffset = i.scrollParentNotHidden.offset());
      },
      drag: function (t, e, i) {
        var s = i.options,
          n = !1,
          o = i.scrollParentNotHidden[0],
          a = i.document[0];
        o !== a && "HTML" !== o.tagName
          ? ((s.axis && "x" === s.axis) ||
              (i.overflowOffset.top + o.offsetHeight - t.pageY <
              s.scrollSensitivity
                ? (o.scrollTop = n = o.scrollTop + s.scrollSpeed)
                : t.pageY - i.overflowOffset.top < s.scrollSensitivity &&
                  (o.scrollTop = n = o.scrollTop - s.scrollSpeed)),
            (s.axis && "y" === s.axis) ||
              (i.overflowOffset.left + o.offsetWidth - t.pageX <
              s.scrollSensitivity
                ? (o.scrollLeft = n = o.scrollLeft + s.scrollSpeed)
                : t.pageX - i.overflowOffset.left < s.scrollSensitivity &&
                  (o.scrollLeft = n = o.scrollLeft - s.scrollSpeed)))
          : ((s.axis && "x" === s.axis) ||
              (t.pageY - k(a).scrollTop() < s.scrollSensitivity
                ? (n = k(a).scrollTop(k(a).scrollTop() - s.scrollSpeed))
                : k(window).height() - (t.pageY - k(a).scrollTop()) <
                    s.scrollSensitivity &&
                  (n = k(a).scrollTop(k(a).scrollTop() + s.scrollSpeed))),
            (s.axis && "y" === s.axis) ||
              (t.pageX - k(a).scrollLeft() < s.scrollSensitivity
                ? (n = k(a).scrollLeft(k(a).scrollLeft() - s.scrollSpeed))
                : k(window).width() - (t.pageX - k(a).scrollLeft()) <
                    s.scrollSensitivity &&
                  (n = k(a).scrollLeft(k(a).scrollLeft() + s.scrollSpeed)))),
          !1 !== n &&
            k.ui.ddmanager &&
            !s.dropBehaviour &&
            k.ui.ddmanager.prepareOffsets(i, t);
      },
    }),
    k.ui.plugin.add("draggable", "snap", {
      start: function (t, e, i) {
        var s = i.options;
        (i.snapElements = []),
          k(
            s.snap.constructor !== String
              ? s.snap.items || ":data(ui-draggable)"
              : s.snap
          ).each(function () {
            var t = k(this),
              e = t.offset();
            this !== i.element[0] &&
              i.snapElements.push({
                item: this,
                width: t.outerWidth(),
                height: t.outerHeight(),
                top: e.top,
                left: e.left,
              });
          });
      },
      drag: function (t, e, i) {
        for (
          var s,
            n,
            o,
            a,
            r,
            h,
            l,
            c,
            u,
            d = i.options,
            p = d.snapTolerance,
            f = e.offset.left,
            g = f + i.helperProportions.width,
            m = e.offset.top,
            _ = m + i.helperProportions.height,
            v = i.snapElements.length - 1;
          0 <= v;
          v--
        )
          (h =
            (r = i.snapElements[v].left - i.margins.left) +
            i.snapElements[v].width),
            (c =
              (l = i.snapElements[v].top - i.margins.top) +
              i.snapElements[v].height),
            g < r - p ||
            h + p < f ||
            _ < l - p ||
            c + p < m ||
            !k.contains(
              i.snapElements[v].item.ownerDocument,
              i.snapElements[v].item
            )
              ? (i.snapElements[v].snapping &&
                  i.options.snap.release &&
                  i.options.snap.release.call(
                    i.element,
                    t,
                    k.extend(i._uiHash(), { snapItem: i.snapElements[v].item })
                  ),
                (i.snapElements[v].snapping = !1))
              : ("inner" !== d.snapMode &&
                  ((s = Math.abs(l - _) <= p),
                  (n = Math.abs(c - m) <= p),
                  (o = Math.abs(r - g) <= p),
                  (a = Math.abs(h - f) <= p),
                  s &&
                    (e.position.top = i._convertPositionTo("relative", {
                      top: l - i.helperProportions.height,
                      left: 0,
                    }).top),
                  n &&
                    (e.position.top = i._convertPositionTo("relative", {
                      top: c,
                      left: 0,
                    }).top),
                  o &&
                    (e.position.left = i._convertPositionTo("relative", {
                      top: 0,
                      left: r - i.helperProportions.width,
                    }).left),
                  a &&
                    (e.position.left = i._convertPositionTo("relative", {
                      top: 0,
                      left: h,
                    }).left)),
                (u = s || n || o || a),
                "outer" !== d.snapMode &&
                  ((s = Math.abs(l - m) <= p),
                  (n = Math.abs(c - _) <= p),
                  (o = Math.abs(r - f) <= p),
                  (a = Math.abs(h - g) <= p),
                  s &&
                    (e.position.top = i._convertPositionTo("relative", {
                      top: l,
                      left: 0,
                    }).top),
                  n &&
                    (e.position.top = i._convertPositionTo("relative", {
                      top: c - i.helperProportions.height,
                      left: 0,
                    }).top),
                  o &&
                    (e.position.left = i._convertPositionTo("relative", {
                      top: 0,
                      left: r,
                    }).left),
                  a &&
                    (e.position.left = i._convertPositionTo("relative", {
                      top: 0,
                      left: h - i.helperProportions.width,
                    }).left)),
                !i.snapElements[v].snapping &&
                  (s || n || o || a || u) &&
                  i.options.snap.snap &&
                  i.options.snap.snap.call(
                    i.element,
                    t,
                    k.extend(i._uiHash(), { snapItem: i.snapElements[v].item })
                  ),
                (i.snapElements[v].snapping = s || n || o || a || u));
      },
    }),
    k.ui.plugin.add("draggable", "stack", {
      start: function (t, e, i) {
        var s,
          i = i.options,
          i = k.makeArray(k(i.stack)).sort(function (t, e) {
            return (
              (parseInt(k(t).css("zIndex"), 10) || 0) -
              (parseInt(k(e).css("zIndex"), 10) || 0)
            );
          });
        i.length &&
          ((s = parseInt(k(i[0]).css("zIndex"), 10) || 0),
          k(i).each(function (t) {
            k(this).css("zIndex", s + t);
          }),
          this.css("zIndex", s + i.length));
      },
    }),
    k.ui.plugin.add("draggable", "zIndex", {
      start: function (t, e, i) {
        (e = k(e.helper)), (i = i.options);
        e.css("zIndex") && (i._zIndex = e.css("zIndex")),
          e.css("zIndex", i.zIndex);
      },
      stop: function (t, e, i) {
        i = i.options;
        i._zIndex && k(e.helper).css("zIndex", i._zIndex);
      },
    });
  k.ui.draggable;
  k.widget("ui.droppable", {
    version: "1.12.1",
    widgetEventPrefix: "drop",
    options: {
      accept: "*",
      addClasses: !0,
      greedy: !1,
      scope: "default",
      tolerance: "intersect",
      activate: null,
      deactivate: null,
      drop: null,
      out: null,
      over: null,
    },
    _create: function () {
      var t,
        e = this.options,
        i = e.accept;
      (this.isover = !1),
        (this.isout = !0),
        (this.accept = k.isFunction(i)
          ? i
          : function (t) {
              return t.is(i);
            }),
        (this.proportions = function () {
          if (!arguments.length)
            return (
              t ||
              (t = {
                width: this.element[0].offsetWidth,
                height: this.element[0].offsetHeight,
              })
            );
          t = arguments[0];
        }),
        this._addToManager(e.scope),
        e.addClasses && this._addClass("ui-droppable");
    },
    _addToManager: function (t) {
      (k.ui.ddmanager.droppables[t] = k.ui.ddmanager.droppables[t] || []),
        k.ui.ddmanager.droppables[t].push(this);
    },
    _splice: function (t) {
      for (var e = 0; e < t.length; e++) t[e] === this && t.splice(e, 1);
    },
    _destroy: function () {
      var t = k.ui.ddmanager.droppables[this.options.scope];
      this._splice(t);
    },
    _setOption: function (t, e) {
      var i;
      "accept" === t
        ? (this.accept = k.isFunction(e)
            ? e
            : function (t) {
                return t.is(e);
              })
        : "scope" === t &&
          ((i = k.ui.ddmanager.droppables[this.options.scope]),
          this._splice(i),
          this._addToManager(e)),
        this._super(t, e);
    },
    _activate: function (t) {
      var e = k.ui.ddmanager.current;
      this._addActiveClass(), e && this._trigger("activate", t, this.ui(e));
    },
    _deactivate: function (t) {
      var e = k.ui.ddmanager.current;
      this._removeActiveClass(),
        e && this._trigger("deactivate", t, this.ui(e));
    },
    _over: function (t) {
      var e = k.ui.ddmanager.current;
      e &&
        (e.currentItem || e.element)[0] !== this.element[0] &&
        this.accept.call(this.element[0], e.currentItem || e.element) &&
        (this._addHoverClass(), this._trigger("over", t, this.ui(e)));
    },
    _out: function (t) {
      var e = k.ui.ddmanager.current;
      e &&
        (e.currentItem || e.element)[0] !== this.element[0] &&
        this.accept.call(this.element[0], e.currentItem || e.element) &&
        (this._removeHoverClass(), this._trigger("out", t, this.ui(e)));
    },
    _drop: function (e, t) {
      var i = t || k.ui.ddmanager.current,
        s = !1;
      return (
        !(!i || (i.currentItem || i.element)[0] === this.element[0]) &&
        (this.element
          .find(":data(ui-droppable)")
          .not(".ui-draggable-dragging")
          .each(function () {
            var t = k(this).droppable("instance");
            if (
              t.options.greedy &&
              !t.options.disabled &&
              t.options.scope === i.options.scope &&
              t.accept.call(t.element[0], i.currentItem || i.element) &&
              p(
                i,
                k.extend(t, { offset: t.element.offset() }),
                t.options.tolerance,
                e
              )
            )
              return !(s = !0);
          }),
        !s &&
          !!this.accept.call(this.element[0], i.currentItem || i.element) &&
          (this._removeActiveClass(),
          this._removeHoverClass(),
          this._trigger("drop", e, this.ui(i)),
          this.element))
      );
    },
    ui: function (t) {
      return {
        draggable: t.currentItem || t.element,
        helper: t.helper,
        position: t.position,
        offset: t.positionAbs,
      };
    },
    _addHoverClass: function () {
      this._addClass("ui-droppable-hover");
    },
    _removeHoverClass: function () {
      this._removeClass("ui-droppable-hover");
    },
    _addActiveClass: function () {
      this._addClass("ui-droppable-active");
    },
    _removeActiveClass: function () {
      this._removeClass("ui-droppable-active");
    },
  });
  var p = (k.ui.intersect = function (t, e, i, s) {
    if (!e.offset) return !1;
    var n = (t.positionAbs || t.position.absolute).left + t.margins.left,
      o = (t.positionAbs || t.position.absolute).top + t.margins.top,
      a = n + t.helperProportions.width,
      r = o + t.helperProportions.height,
      h = e.offset.left,
      l = e.offset.top,
      c = h + e.proportions().width,
      u = l + e.proportions().height;
    switch (i) {
      case "fit":
        return h <= n && a <= c && l <= o && r <= u;
      case "intersect":
        return (
          h < n + t.helperProportions.width / 2 &&
          a - t.helperProportions.width / 2 < c &&
          l < o + t.helperProportions.height / 2 &&
          r - t.helperProportions.height / 2 < u
        );
      case "pointer":
        return (
          f(s.pageY, l, e.proportions().height) &&
          f(s.pageX, h, e.proportions().width)
        );
      case "touch":
        return (
          ((l <= o && o <= u) || (l <= r && r <= u) || (o < l && u < r)) &&
          ((h <= n && n <= c) || (h <= a && a <= c) || (n < h && c < a))
        );
      default:
        return !1;
    }
  });
  function f(t, e, i) {
    return e <= t && t < e + i;
  }
  !(k.ui.ddmanager = {
    current: null,
    droppables: { default: [] },
    prepareOffsets: function (t, e) {
      var i,
        s,
        n = k.ui.ddmanager.droppables[t.options.scope] || [],
        o = e ? e.type : null,
        a = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();
      t: for (i = 0; i < n.length; i++)
        if (
          !(
            n[i].options.disabled ||
            (t &&
              !n[i].accept.call(n[i].element[0], t.currentItem || t.element))
          )
        ) {
          for (s = 0; s < a.length; s++)
            if (a[s] === n[i].element[0]) {
              n[i].proportions().height = 0;
              continue t;
            }
          (n[i].visible = "none" !== n[i].element.css("display")),
            n[i].visible &&
              ("mousedown" === o && n[i]._activate.call(n[i], e),
              (n[i].offset = n[i].element.offset()),
              n[i].proportions({
                width: n[i].element[0].offsetWidth,
                height: n[i].element[0].offsetHeight,
              }));
        }
    },
    drop: function (t, e) {
      var i = !1;
      return (
        k.each(
          (k.ui.ddmanager.droppables[t.options.scope] || []).slice(),
          function () {
            this.options &&
              (!this.options.disabled &&
                this.visible &&
                p(t, this, this.options.tolerance, e) &&
                (i = this._drop.call(this, e) || i),
              !this.options.disabled &&
                this.visible &&
                this.accept.call(this.element[0], t.currentItem || t.element) &&
                ((this.isout = !0),
                (this.isover = !1),
                this._deactivate.call(this, e)));
          }
        ),
        i
      );
    },
    dragStart: function (t, e) {
      t.element.parentsUntil("body").on("scroll.droppable", function () {
        t.options.refreshPositions || k.ui.ddmanager.prepareOffsets(t, e);
      });
    },
    drag: function (n, o) {
      n.options.refreshPositions && k.ui.ddmanager.prepareOffsets(n, o),
        k.each(k.ui.ddmanager.droppables[n.options.scope] || [], function () {
          var t, e, i, s;
          this.options.disabled ||
            this.greedyChild ||
            !this.visible ||
            ((s =
              !(i = p(n, this, this.options.tolerance, o)) && this.isover
                ? "isout"
                : i && !this.isover
                ? "isover"
                : null) &&
              (this.options.greedy &&
                ((e = this.options.scope),
                (i = this.element
                  .parents(":data(ui-droppable)")
                  .filter(function () {
                    return k(this).droppable("instance").options.scope === e;
                  })).length &&
                  ((t = k(i[0]).droppable("instance")).greedyChild =
                    "isover" === s)),
              t &&
                "isover" === s &&
                ((t.isover = !1), (t.isout = !0), t._out.call(t, o)),
              (this[s] = !0),
              (this["isout" === s ? "isover" : "isout"] = !1),
              this["isover" === s ? "_over" : "_out"].call(this, o),
              t &&
                "isout" === s &&
                ((t.isout = !1), (t.isover = !0), t._over.call(t, o))));
        });
    },
    dragStop: function (t, e) {
      t.element.parentsUntil("body").off("scroll.droppable"),
        t.options.refreshPositions || k.ui.ddmanager.prepareOffsets(t, e);
    },
  }) !== k.uiBackCompat &&
    k.widget("ui.droppable", k.ui.droppable, {
      options: { hoverClass: !1, activeClass: !1 },
      _addActiveClass: function () {
        this._super(),
          this.options.activeClass &&
            this.element.addClass(this.options.activeClass);
      },
      _removeActiveClass: function () {
        this._super(),
          this.options.activeClass &&
            this.element.removeClass(this.options.activeClass);
      },
      _addHoverClass: function () {
        this._super(),
          this.options.hoverClass &&
            this.element.addClass(this.options.hoverClass);
      },
      _removeHoverClass: function () {
        this._super(),
          this.options.hoverClass &&
            this.element.removeClass(this.options.hoverClass);
      },
    });
  k.ui.droppable;
  k.widget("ui.resizable", k.ui.mouse, {
    version: "1.12.1",
    widgetEventPrefix: "resize",
    options: {
      alsoResize: !1,
      animate: !1,
      animateDuration: "slow",
      animateEasing: "swing",
      aspectRatio: !1,
      autoHide: !1,
      classes: { "ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se" },
      containment: !1,
      ghost: !1,
      grid: !1,
      handles: "e,s,se",
      helper: !1,
      maxHeight: null,
      maxWidth: null,
      minHeight: 10,
      minWidth: 10,
      zIndex: 90,
      resize: null,
      start: null,
      stop: null,
    },
    _num: function (t) {
      return parseFloat(t) || 0;
    },
    _isNumber: function (t) {
      return !isNaN(parseFloat(t));
    },
    _hasScroll: function (t, e) {
      if ("hidden" === k(t).css("overflow")) return !1;
      var i = e && "left" === e ? "scrollLeft" : "scrollTop",
        e = !1;
      return 0 < t[i] || ((t[i] = 1), (e = 0 < t[i]), (t[i] = 0), e);
    },
    _create: function () {
      var t,
        e = this.options,
        i = this;
      this._addClass("ui-resizable"),
        k.extend(this, {
          _aspectRatio: !!e.aspectRatio,
          aspectRatio: e.aspectRatio,
          originalElement: this.element,
          _proportionallyResizeElements: [],
          _helper:
            e.helper || e.ghost || e.animate
              ? e.helper || "ui-resizable-helper"
              : null,
        }),
        this.element[0].nodeName.match(
          /^(canvas|textarea|input|select|button|img)$/i
        ) &&
          (this.element.wrap(
            k("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
              position: this.element.css("position"),
              width: this.element.outerWidth(),
              height: this.element.outerHeight(),
              top: this.element.css("top"),
              left: this.element.css("left"),
            })
          ),
          (this.element = this.element
            .parent()
            .data("ui-resizable", this.element.resizable("instance"))),
          (this.elementIsWrapper = !0),
          (t = {
            marginTop: this.originalElement.css("marginTop"),
            marginRight: this.originalElement.css("marginRight"),
            marginBottom: this.originalElement.css("marginBottom"),
            marginLeft: this.originalElement.css("marginLeft"),
          }),
          this.element.css(t),
          this.originalElement.css("margin", 0),
          (this.originalResizeStyle = this.originalElement.css("resize")),
          this.originalElement.css("resize", "none"),
          this._proportionallyResizeElements.push(
            this.originalElement.css({
              position: "static",
              zoom: 1,
              display: "block",
            })
          ),
          this.originalElement.css(t),
          this._proportionallyResize()),
        this._setupHandles(),
        e.autoHide &&
          k(this.element)
            .on("mouseenter", function () {
              e.disabled ||
                (i._removeClass("ui-resizable-autohide"), i._handles.show());
            })
            .on("mouseleave", function () {
              e.disabled ||
                i.resizing ||
                (i._addClass("ui-resizable-autohide"), i._handles.hide());
            }),
        this._mouseInit();
    },
    _destroy: function () {
      this._mouseDestroy();
      function t(t) {
        k(t)
          .removeData("resizable")
          .removeData("ui-resizable")
          .off(".resizable")
          .find(".ui-resizable-handle")
          .remove();
      }
      var e;
      return (
        this.elementIsWrapper &&
          (t(this.element),
          (e = this.element),
          this.originalElement
            .css({
              position: e.css("position"),
              width: e.outerWidth(),
              height: e.outerHeight(),
              top: e.css("top"),
              left: e.css("left"),
            })
            .insertAfter(e),
          e.remove()),
        this.originalElement.css("resize", this.originalResizeStyle),
        t(this.originalElement),
        this
      );
    },
    _setOption: function (t, e) {
      this._super(t, e),
        "handles" === t && (this._removeHandles(), this._setupHandles());
    },
    _setupHandles: function () {
      var t,
        e,
        i,
        s,
        n,
        o = this.options,
        a = this;
      if (
        ((this.handles =
          o.handles ||
          (k(".ui-resizable-handle", this.element).length
            ? {
                n: ".ui-resizable-n",
                e: ".ui-resizable-e",
                s: ".ui-resizable-s",
                w: ".ui-resizable-w",
                se: ".ui-resizable-se",
                sw: ".ui-resizable-sw",
                ne: ".ui-resizable-ne",
                nw: ".ui-resizable-nw",
              }
            : "e,s,se")),
        (this._handles = k()),
        this.handles.constructor === String)
      )
        for (
          "all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"),
            i = this.handles.split(","),
            this.handles = {},
            e = 0;
          e < i.length;
          e++
        )
          (s = "ui-resizable-" + (t = k.trim(i[e]))),
            (n = k("<div>")),
            this._addClass(n, "ui-resizable-handle " + s),
            n.css({ zIndex: o.zIndex }),
            (this.handles[t] = ".ui-resizable-" + t),
            this.element.append(n);
      (this._renderAxis = function (t) {
        var e, i, s;
        for (e in ((t = t || this.element), this.handles))
          this.handles[e].constructor === String
            ? (this.handles[e] = this.element
                .children(this.handles[e])
                .first()
                .show())
            : (this.handles[e].jquery || this.handles[e].nodeType) &&
              ((this.handles[e] = k(this.handles[e])),
              this._on(this.handles[e], { mousedown: a._mouseDown })),
            this.elementIsWrapper &&
              this.originalElement[0].nodeName.match(
                /^(textarea|input|select|button)$/i
              ) &&
              ((i = k(this.handles[e], this.element)),
              (s = /sw|ne|nw|se|n|s/.test(e)
                ? i.outerHeight()
                : i.outerWidth()),
              (i = [
                "padding",
                /ne|nw|n/.test(e)
                  ? "Top"
                  : /se|sw|s/.test(e)
                  ? "Bottom"
                  : /^e$/.test(e)
                  ? "Right"
                  : "Left",
              ].join("")),
              t.css(i, s),
              this._proportionallyResize()),
            (this._handles = this._handles.add(this.handles[e]));
      }),
        this._renderAxis(this.element),
        (this._handles = this._handles.add(
          this.element.find(".ui-resizable-handle")
        )),
        this._handles.disableSelection(),
        this._handles.on("mouseover", function () {
          a.resizing ||
            (this.className &&
              (n = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),
            (a.axis = n && n[1] ? n[1] : "se"));
        }),
        o.autoHide &&
          (this._handles.hide(), this._addClass("ui-resizable-autohide"));
    },
    _removeHandles: function () {
      this._handles.remove();
    },
    _mouseCapture: function (t) {
      var e,
        i,
        s = !1;
      for (e in this.handles)
        ((i = k(this.handles[e])[0]) !== t.target &&
          !k.contains(i, t.target)) ||
          (s = !0);
      return !this.options.disabled && s;
    },
    _mouseStart: function (t) {
      var e,
        i,
        s = this.options,
        n = this.element;
      return (
        (this.resizing = !0),
        this._renderProxy(),
        (e = this._num(this.helper.css("left"))),
        (i = this._num(this.helper.css("top"))),
        s.containment &&
          ((e += k(s.containment).scrollLeft() || 0),
          (i += k(s.containment).scrollTop() || 0)),
        (this.offset = this.helper.offset()),
        (this.position = { left: e, top: i }),
        (this.size = this._helper
          ? { width: this.helper.width(), height: this.helper.height() }
          : { width: n.width(), height: n.height() }),
        (this.originalSize = this._helper
          ? { width: n.outerWidth(), height: n.outerHeight() }
          : { width: n.width(), height: n.height() }),
        (this.sizeDiff = {
          width: n.outerWidth() - n.width(),
          height: n.outerHeight() - n.height(),
        }),
        (this.originalPosition = { left: e, top: i }),
        (this.originalMousePosition = { left: t.pageX, top: t.pageY }),
        (this.aspectRatio =
          "number" == typeof s.aspectRatio
            ? s.aspectRatio
            : this.originalSize.width / this.originalSize.height || 1),
        (s = k(".ui-resizable-" + this.axis).css("cursor")),
        k("body").css("cursor", "auto" === s ? this.axis + "-resize" : s),
        this._addClass("ui-resizable-resizing"),
        this._propagate("start", t),
        !0
      );
    },
    _mouseDrag: function (t) {
      var e = this.originalMousePosition,
        i = this.axis,
        s = t.pageX - e.left || 0,
        e = t.pageY - e.top || 0,
        i = this._change[i];
      return (
        this._updatePrevProperties(),
        i &&
          ((e = i.apply(this, [t, s, e])),
          this._updateVirtualBoundaries(t.shiftKey),
          (this._aspectRatio || t.shiftKey) && (e = this._updateRatio(e, t)),
          (e = this._respectSize(e, t)),
          this._updateCache(e),
          this._propagate("resize", t),
          (e = this._applyChanges()),
          !this._helper &&
            this._proportionallyResizeElements.length &&
            this._proportionallyResize(),
          k.isEmptyObject(e) ||
            (this._updatePrevProperties(),
            this._trigger("resize", t, this.ui()),
            this._applyChanges())),
        !1
      );
    },
    _mouseStop: function (t) {
      this.resizing = !1;
      var e,
        i,
        s,
        n = this.options,
        o = this;
      return (
        this._helper &&
          ((s =
            (e =
              (i = this._proportionallyResizeElements).length &&
              /textarea/i.test(i[0].nodeName)) && this._hasScroll(i[0], "left")
              ? 0
              : o.sizeDiff.height),
          (i = e ? 0 : o.sizeDiff.width),
          (e = { width: o.helper.width() - i, height: o.helper.height() - s }),
          (i =
            parseFloat(o.element.css("left")) +
              (o.position.left - o.originalPosition.left) || null),
          (s =
            parseFloat(o.element.css("top")) +
              (o.position.top - o.originalPosition.top) || null),
          n.animate || this.element.css(k.extend(e, { top: s, left: i })),
          o.helper.height(o.size.height),
          o.helper.width(o.size.width),
          this._helper && !n.animate && this._proportionallyResize()),
        k("body").css("cursor", "auto"),
        this._removeClass("ui-resizable-resizing"),
        this._propagate("stop", t),
        this._helper && this.helper.remove(),
        !1
      );
    },
    _updatePrevProperties: function () {
      (this.prevPosition = {
        top: this.position.top,
        left: this.position.left,
      }),
        (this.prevSize = { width: this.size.width, height: this.size.height });
    },
    _applyChanges: function () {
      var t = {};
      return (
        this.position.top !== this.prevPosition.top &&
          (t.top = this.position.top + "px"),
        this.position.left !== this.prevPosition.left &&
          (t.left = this.position.left + "px"),
        this.size.width !== this.prevSize.width &&
          (t.width = this.size.width + "px"),
        this.size.height !== this.prevSize.height &&
          (t.height = this.size.height + "px"),
        this.helper.css(t),
        t
      );
    },
    _updateVirtualBoundaries: function (t) {
      var e,
        i,
        s = this.options,
        n = {
          minWidth: this._isNumber(s.minWidth) ? s.minWidth : 0,
          maxWidth: this._isNumber(s.maxWidth) ? s.maxWidth : 1 / 0,
          minHeight: this._isNumber(s.minHeight) ? s.minHeight : 0,
          maxHeight: this._isNumber(s.maxHeight) ? s.maxHeight : 1 / 0,
        };
      (this._aspectRatio || t) &&
        ((e = n.minHeight * this.aspectRatio),
        (i = n.minWidth / this.aspectRatio),
        (s = n.maxHeight * this.aspectRatio),
        (t = n.maxWidth / this.aspectRatio),
        e > n.minWidth && (n.minWidth = e),
        i > n.minHeight && (n.minHeight = i),
        s < n.maxWidth && (n.maxWidth = s),
        t < n.maxHeight && (n.maxHeight = t)),
        (this._vBoundaries = n);
    },
    _updateCache: function (t) {
      (this.offset = this.helper.offset()),
        this._isNumber(t.left) && (this.position.left = t.left),
        this._isNumber(t.top) && (this.position.top = t.top),
        this._isNumber(t.height) && (this.size.height = t.height),
        this._isNumber(t.width) && (this.size.width = t.width);
    },
    _updateRatio: function (t) {
      var e = this.position,
        i = this.size,
        s = this.axis;
      return (
        this._isNumber(t.height)
          ? (t.width = t.height * this.aspectRatio)
          : this._isNumber(t.width) && (t.height = t.width / this.aspectRatio),
        "sw" === s && ((t.left = e.left + (i.width - t.width)), (t.top = null)),
        "nw" === s &&
          ((t.top = e.top + (i.height - t.height)),
          (t.left = e.left + (i.width - t.width))),
        t
      );
    },
    _respectSize: function (t) {
      var e = this._vBoundaries,
        i = this.axis,
        s = this._isNumber(t.width) && e.maxWidth && e.maxWidth < t.width,
        n = this._isNumber(t.height) && e.maxHeight && e.maxHeight < t.height,
        o = this._isNumber(t.width) && e.minWidth && e.minWidth > t.width,
        a = this._isNumber(t.height) && e.minHeight && e.minHeight > t.height,
        r = this.originalPosition.left + this.originalSize.width,
        h = this.originalPosition.top + this.originalSize.height,
        l = /sw|nw|w/.test(i),
        i = /nw|ne|n/.test(i);
      return (
        o && (t.width = e.minWidth),
        a && (t.height = e.minHeight),
        s && (t.width = e.maxWidth),
        n && (t.height = e.maxHeight),
        o && l && (t.left = r - e.minWidth),
        s && l && (t.left = r - e.maxWidth),
        a && i && (t.top = h - e.minHeight),
        n && i && (t.top = h - e.maxHeight),
        t.width || t.height || t.left || !t.top
          ? t.width || t.height || t.top || !t.left || (t.left = null)
          : (t.top = null),
        t
      );
    },
    _getPaddingPlusBorderDimensions: function (t) {
      for (
        var e = 0,
          i = [],
          s = [
            t.css("borderTopWidth"),
            t.css("borderRightWidth"),
            t.css("borderBottomWidth"),
            t.css("borderLeftWidth"),
          ],
          n = [
            t.css("paddingTop"),
            t.css("paddingRight"),
            t.css("paddingBottom"),
            t.css("paddingLeft"),
          ];
        e < 4;
        e++
      )
        (i[e] = parseFloat(s[e]) || 0), (i[e] += parseFloat(n[e]) || 0);
      return { height: i[0] + i[2], width: i[1] + i[3] };
    },
    _proportionallyResize: function () {
      if (this._proportionallyResizeElements.length)
        for (
          var t, e = 0, i = this.helper || this.element;
          e < this._proportionallyResizeElements.length;
          e++
        )
          (t = this._proportionallyResizeElements[e]),
            this.outerDimensions ||
              (this.outerDimensions = this._getPaddingPlusBorderDimensions(t)),
            t.css({
              height: i.height() - this.outerDimensions.height || 0,
              width: i.width() - this.outerDimensions.width || 0,
            });
    },
    _renderProxy: function () {
      var t = this.element,
        e = this.options;
      (this.elementOffset = t.offset()),
        this._helper
          ? ((this.helper =
              this.helper || k("<div style='overflow:hidden;'></div>")),
            this._addClass(this.helper, this._helper),
            this.helper.css({
              width: this.element.outerWidth(),
              height: this.element.outerHeight(),
              position: "absolute",
              left: this.elementOffset.left + "px",
              top: this.elementOffset.top + "px",
              zIndex: ++e.zIndex,
            }),
            this.helper.appendTo("body").disableSelection())
          : (this.helper = this.element);
    },
    _change: {
      e: function (t, e) {
        return { width: this.originalSize.width + e };
      },
      w: function (t, e) {
        var i = this.originalSize;
        return { left: this.originalPosition.left + e, width: i.width - e };
      },
      n: function (t, e, i) {
        var s = this.originalSize;
        return { top: this.originalPosition.top + i, height: s.height - i };
      },
      s: function (t, e, i) {
        return { height: this.originalSize.height + i };
      },
      se: function (t, e, i) {
        return k.extend(
          this._change.s.apply(this, arguments),
          this._change.e.apply(this, [t, e, i])
        );
      },
      sw: function (t, e, i) {
        return k.extend(
          this._change.s.apply(this, arguments),
          this._change.w.apply(this, [t, e, i])
        );
      },
      ne: function (t, e, i) {
        return k.extend(
          this._change.n.apply(this, arguments),
          this._change.e.apply(this, [t, e, i])
        );
      },
      nw: function (t, e, i) {
        return k.extend(
          this._change.n.apply(this, arguments),
          this._change.w.apply(this, [t, e, i])
        );
      },
    },
    _propagate: function (t, e) {
      k.ui.plugin.call(this, t, [e, this.ui()]),
        "resize" !== t && this._trigger(t, e, this.ui());
    },
    plugins: {},
    ui: function () {
      return {
        originalElement: this.originalElement,
        element: this.element,
        helper: this.helper,
        position: this.position,
        size: this.size,
        originalSize: this.originalSize,
        originalPosition: this.originalPosition,
      };
    },
  }),
    k.ui.plugin.add("resizable", "animate", {
      stop: function (e) {
        var i = k(this).resizable("instance"),
          t = i.options,
          s = i._proportionallyResizeElements,
          n = s.length && /textarea/i.test(s[0].nodeName),
          o = n && i._hasScroll(s[0], "left") ? 0 : i.sizeDiff.height,
          a = n ? 0 : i.sizeDiff.width,
          n = { width: i.size.width - a, height: i.size.height - o },
          a =
            parseFloat(i.element.css("left")) +
              (i.position.left - i.originalPosition.left) || null,
          o =
            parseFloat(i.element.css("top")) +
              (i.position.top - i.originalPosition.top) || null;
        i.element.animate(k.extend(n, o && a ? { top: o, left: a } : {}), {
          duration: t.animateDuration,
          easing: t.animateEasing,
          step: function () {
            var t = {
              width: parseFloat(i.element.css("width")),
              height: parseFloat(i.element.css("height")),
              top: parseFloat(i.element.css("top")),
              left: parseFloat(i.element.css("left")),
            };
            s && s.length && k(s[0]).css({ width: t.width, height: t.height }),
              i._updateCache(t),
              i._propagate("resize", e);
          },
        });
      },
    }),
    k.ui.plugin.add("resizable", "containment", {
      start: function () {
        var i,
          s,
          n = k(this).resizable("instance"),
          t = n.options,
          e = n.element,
          o = t.containment,
          a =
            o instanceof k
              ? o.get(0)
              : /parent/.test(o)
              ? e.parent().get(0)
              : o;
        a &&
          ((n.containerElement = k(a)),
          /document/.test(o) || o === document
            ? ((n.containerOffset = { left: 0, top: 0 }),
              (n.containerPosition = { left: 0, top: 0 }),
              (n.parentData = {
                element: k(document),
                left: 0,
                top: 0,
                width: k(document).width(),
                height:
                  k(document).height() || document.body.parentNode.scrollHeight,
              }))
            : ((i = k(a)),
              (s = []),
              k(["Top", "Right", "Left", "Bottom"]).each(function (t, e) {
                s[t] = n._num(i.css("padding" + e));
              }),
              (n.containerOffset = i.offset()),
              (n.containerPosition = i.position()),
              (n.containerSize = {
                height: i.innerHeight() - s[3],
                width: i.innerWidth() - s[1],
              }),
              (t = n.containerOffset),
              (e = n.containerSize.height),
              (o = n.containerSize.width),
              (o = n._hasScroll(a, "left") ? a.scrollWidth : o),
              (e = n._hasScroll(a) ? a.scrollHeight : e),
              (n.parentData = {
                element: a,
                left: t.left,
                top: t.top,
                width: o,
                height: e,
              })));
      },
      resize: function (t) {
        var e = k(this).resizable("instance"),
          i = e.options,
          s = e.containerOffset,
          n = e.position,
          o = e._aspectRatio || t.shiftKey,
          a = { top: 0, left: 0 },
          r = e.containerElement,
          t = !0;
        r[0] !== document && /static/.test(r.css("position")) && (a = s),
          n.left < (e._helper ? s.left : 0) &&
            ((e.size.width =
              e.size.width +
              (e._helper
                ? e.position.left - s.left
                : e.position.left - a.left)),
            o && ((e.size.height = e.size.width / e.aspectRatio), (t = !1)),
            (e.position.left = i.helper ? s.left : 0)),
          n.top < (e._helper ? s.top : 0) &&
            ((e.size.height =
              e.size.height +
              (e._helper ? e.position.top - s.top : e.position.top)),
            o && ((e.size.width = e.size.height * e.aspectRatio), (t = !1)),
            (e.position.top = e._helper ? s.top : 0)),
          (i = e.containerElement.get(0) === e.element.parent().get(0)),
          (n = /relative|absolute/.test(e.containerElement.css("position"))),
          i && n
            ? ((e.offset.left = e.parentData.left + e.position.left),
              (e.offset.top = e.parentData.top + e.position.top))
            : ((e.offset.left = e.element.offset().left),
              (e.offset.top = e.element.offset().top)),
          (n = Math.abs(
            e.sizeDiff.width +
              (e._helper ? e.offset.left - a.left : e.offset.left - s.left)
          )),
          (s = Math.abs(
            e.sizeDiff.height +
              (e._helper ? e.offset.top - a.top : e.offset.top - s.top)
          )),
          n + e.size.width >= e.parentData.width &&
            ((e.size.width = e.parentData.width - n),
            o && ((e.size.height = e.size.width / e.aspectRatio), (t = !1))),
          s + e.size.height >= e.parentData.height &&
            ((e.size.height = e.parentData.height - s),
            o && ((e.size.width = e.size.height * e.aspectRatio), (t = !1))),
          t ||
            ((e.position.left = e.prevPosition.left),
            (e.position.top = e.prevPosition.top),
            (e.size.width = e.prevSize.width),
            (e.size.height = e.prevSize.height));
      },
      stop: function () {
        var t = k(this).resizable("instance"),
          e = t.options,
          i = t.containerOffset,
          s = t.containerPosition,
          n = t.containerElement,
          o = k(t.helper),
          a = o.offset(),
          r = o.outerWidth() - t.sizeDiff.width,
          o = o.outerHeight() - t.sizeDiff.height;
        t._helper &&
          !e.animate &&
          /relative/.test(n.css("position")) &&
          k(this).css({ left: a.left - s.left - i.left, width: r, height: o }),
          t._helper &&
            !e.animate &&
            /static/.test(n.css("position")) &&
            k(this).css({
              left: a.left - s.left - i.left,
              width: r,
              height: o,
            });
      },
    }),
    k.ui.plugin.add("resizable", "alsoResize", {
      start: function () {
        var t = k(this).resizable("instance").options;
        k(t.alsoResize).each(function () {
          var t = k(this);
          t.data("ui-resizable-alsoresize", {
            width: parseFloat(t.width()),
            height: parseFloat(t.height()),
            left: parseFloat(t.css("left")),
            top: parseFloat(t.css("top")),
          });
        });
      },
      resize: function (t, i) {
        var e = k(this).resizable("instance"),
          s = e.options,
          n = e.originalSize,
          o = e.originalPosition,
          a = {
            height: e.size.height - n.height || 0,
            width: e.size.width - n.width || 0,
            top: e.position.top - o.top || 0,
            left: e.position.left - o.left || 0,
          };
        k(s.alsoResize).each(function () {
          var t = k(this),
            s = k(this).data("ui-resizable-alsoresize"),
            n = {},
            e = t.parents(i.originalElement[0]).length
              ? ["width", "height"]
              : ["width", "height", "top", "left"];
          k.each(e, function (t, e) {
            var i = (s[e] || 0) + (a[e] || 0);
            i && 0 <= i && (n[e] = i || null);
          }),
            t.css(n);
        });
      },
      stop: function () {
        k(this).removeData("ui-resizable-alsoresize");
      },
    }),
    k.ui.plugin.add("resizable", "ghost", {
      start: function () {
        var t = k(this).resizable("instance"),
          e = t.size;
        (t.ghost = t.originalElement.clone()),
          t.ghost.css({
            opacity: 0.25,
            display: "block",
            position: "relative",
            height: e.height,
            width: e.width,
            margin: 0,
            left: 0,
            top: 0,
          }),
          t._addClass(t.ghost, "ui-resizable-ghost"),
          !1 !== k.uiBackCompat &&
            "string" == typeof t.options.ghost &&
            t.ghost.addClass(this.options.ghost),
          t.ghost.appendTo(t.helper);
      },
      resize: function () {
        var t = k(this).resizable("instance");
        t.ghost &&
          t.ghost.css({
            position: "relative",
            height: t.size.height,
            width: t.size.width,
          });
      },
      stop: function () {
        var t = k(this).resizable("instance");
        t.ghost && t.helper && t.helper.get(0).removeChild(t.ghost.get(0));
      },
    }),
    k.ui.plugin.add("resizable", "grid", {
      resize: function () {
        var t,
          e = k(this).resizable("instance"),
          i = e.options,
          s = e.size,
          n = e.originalSize,
          o = e.originalPosition,
          a = e.axis,
          r = "number" == typeof i.grid ? [i.grid, i.grid] : i.grid,
          h = r[0] || 1,
          l = r[1] || 1,
          c = Math.round((s.width - n.width) / h) * h,
          u = Math.round((s.height - n.height) / l) * l,
          d = n.width + c,
          p = n.height + u,
          f = i.maxWidth && i.maxWidth < d,
          g = i.maxHeight && i.maxHeight < p,
          m = i.minWidth && i.minWidth > d,
          s = i.minHeight && i.minHeight > p;
        (i.grid = r),
          m && (d += h),
          s && (p += l),
          f && (d -= h),
          g && (p -= l),
          /^(se|s|e)$/.test(a)
            ? ((e.size.width = d), (e.size.height = p))
            : /^(ne)$/.test(a)
            ? ((e.size.width = d),
              (e.size.height = p),
              (e.position.top = o.top - u))
            : /^(sw)$/.test(a)
            ? ((e.size.width = d),
              (e.size.height = p),
              (e.position.left = o.left - c))
            : ((p - l <= 0 || d - h <= 0) &&
                (t = e._getPaddingPlusBorderDimensions(this)),
              0 < p - l
                ? ((e.size.height = p), (e.position.top = o.top - u))
                : ((p = l - t.height),
                  (e.size.height = p),
                  (e.position.top = o.top + n.height - p)),
              0 < d - h
                ? ((e.size.width = d), (e.position.left = o.left - c))
                : ((d = h - t.width),
                  (e.size.width = d),
                  (e.position.left = o.left + n.width - d)));
      },
    });
  k.ui.resizable,
    k.widget("ui.selectable", k.ui.mouse, {
      version: "1.12.1",
      options: {
        appendTo: "body",
        autoRefresh: !0,
        distance: 0,
        filter: "*",
        tolerance: "touch",
        selected: null,
        selecting: null,
        start: null,
        stop: null,
        unselected: null,
        unselecting: null,
      },
      _create: function () {
        var i = this;
        this._addClass("ui-selectable"),
          (this.dragged = !1),
          (this.refresh = function () {
            (i.elementPos = k(i.element[0]).offset()),
              (i.selectees = k(i.options.filter, i.element[0])),
              i._addClass(i.selectees, "ui-selectee"),
              i.selectees.each(function () {
                var t = k(this),
                  e = t.offset(),
                  e = {
                    left: e.left - i.elementPos.left,
                    top: e.top - i.elementPos.top,
                  };
                k.data(this, "selectable-item", {
                  element: this,
                  $element: t,
                  left: e.left,
                  top: e.top,
                  right: e.left + t.outerWidth(),
                  bottom: e.top + t.outerHeight(),
                  startselected: !1,
                  selected: t.hasClass("ui-selected"),
                  selecting: t.hasClass("ui-selecting"),
                  unselecting: t.hasClass("ui-unselecting"),
                });
              });
          }),
          this.refresh(),
          this._mouseInit(),
          (this.helper = k("<div>")),
          this._addClass(this.helper, "ui-selectable-helper");
      },
      _destroy: function () {
        this.selectees.removeData("selectable-item"), this._mouseDestroy();
      },
      _mouseStart: function (i) {
        var s = this,
          t = this.options;
        (this.opos = [i.pageX, i.pageY]),
          (this.elementPos = k(this.element[0]).offset()),
          this.options.disabled ||
            ((this.selectees = k(t.filter, this.element[0])),
            this._trigger("start", i),
            k(t.appendTo).append(this.helper),
            this.helper.css({
              left: i.pageX,
              top: i.pageY,
              width: 0,
              height: 0,
            }),
            t.autoRefresh && this.refresh(),
            this.selectees.filter(".ui-selected").each(function () {
              var t = k.data(this, "selectable-item");
              (t.startselected = !0),
                i.metaKey ||
                  i.ctrlKey ||
                  (s._removeClass(t.$element, "ui-selected"),
                  (t.selected = !1),
                  s._addClass(t.$element, "ui-unselecting"),
                  (t.unselecting = !0),
                  s._trigger("unselecting", i, { unselecting: t.element }));
            }),
            k(i.target)
              .parents()
              .addBack()
              .each(function () {
                var t,
                  e = k.data(this, "selectable-item");
                if (e)
                  return (
                    (t =
                      (!i.metaKey && !i.ctrlKey) ||
                      !e.$element.hasClass("ui-selected")),
                    s
                      ._removeClass(
                        e.$element,
                        t ? "ui-unselecting" : "ui-selected"
                      )
                      ._addClass(
                        e.$element,
                        t ? "ui-selecting" : "ui-unselecting"
                      ),
                    (e.unselecting = !t),
                    (e.selecting = t),
                    (e.selected = t)
                      ? s._trigger("selecting", i, { selecting: e.element })
                      : s._trigger("unselecting", i, {
                          unselecting: e.element,
                        }),
                    !1
                  );
              }));
      },
      _mouseDrag: function (s) {
        if (((this.dragged = !0), !this.options.disabled)) {
          var t,
            n = this,
            o = this.options,
            a = this.opos[0],
            r = this.opos[1],
            h = s.pageX,
            l = s.pageY;
          return (
            h < a && ((t = h), (h = a), (a = t)),
            l < r && ((t = l), (l = r), (r = t)),
            this.helper.css({ left: a, top: r, width: h - a, height: l - r }),
            this.selectees.each(function () {
              var t = k.data(this, "selectable-item"),
                e = !1,
                i = {};
              t &&
                t.element !== n.element[0] &&
                ((i.left = t.left + n.elementPos.left),
                (i.right = t.right + n.elementPos.left),
                (i.top = t.top + n.elementPos.top),
                (i.bottom = t.bottom + n.elementPos.top),
                "touch" === o.tolerance
                  ? (e = !(
                      i.left > h ||
                      i.right < a ||
                      i.top > l ||
                      i.bottom < r
                    ))
                  : "fit" === o.tolerance &&
                    (e =
                      i.left > a && i.right < h && i.top > r && i.bottom < l),
                e
                  ? (t.selected &&
                      (n._removeClass(t.$element, "ui-selected"),
                      (t.selected = !1)),
                    t.unselecting &&
                      (n._removeClass(t.$element, "ui-unselecting"),
                      (t.unselecting = !1)),
                    t.selecting ||
                      (n._addClass(t.$element, "ui-selecting"),
                      (t.selecting = !0),
                      n._trigger("selecting", s, { selecting: t.element })))
                  : (t.selecting &&
                      ((s.metaKey || s.ctrlKey) && t.startselected
                        ? (n._removeClass(t.$element, "ui-selecting"),
                          (t.selecting = !1),
                          n._addClass(t.$element, "ui-selected"),
                          (t.selected = !0))
                        : (n._removeClass(t.$element, "ui-selecting"),
                          (t.selecting = !1),
                          t.startselected &&
                            (n._addClass(t.$element, "ui-unselecting"),
                            (t.unselecting = !0)),
                          n._trigger("unselecting", s, {
                            unselecting: t.element,
                          }))),
                    t.selected &&
                      (s.metaKey ||
                        s.ctrlKey ||
                        t.startselected ||
                        (n._removeClass(t.$element, "ui-selected"),
                        (t.selected = !1),
                        n._addClass(t.$element, "ui-unselecting"),
                        (t.unselecting = !0),
                        n._trigger("unselecting", s, {
                          unselecting: t.element,
                        })))));
            }),
            !1
          );
        }
      },
      _mouseStop: function (e) {
        var i = this;
        return (
          (this.dragged = !1),
          k(".ui-unselecting", this.element[0]).each(function () {
            var t = k.data(this, "selectable-item");
            i._removeClass(t.$element, "ui-unselecting"),
              (t.unselecting = !1),
              (t.startselected = !1),
              i._trigger("unselected", e, { unselected: t.element });
          }),
          k(".ui-selecting", this.element[0]).each(function () {
            var t = k.data(this, "selectable-item");
            i
              ._removeClass(t.$element, "ui-selecting")
              ._addClass(t.$element, "ui-selected"),
              (t.selecting = !1),
              (t.selected = !0),
              (t.startselected = !0),
              i._trigger("selected", e, { selected: t.element });
          }),
          this._trigger("stop", e),
          this.helper.remove(),
          !1
        );
      },
    }),
    k.widget("ui.sortable", k.ui.mouse, {
      version: "1.12.1",
      widgetEventPrefix: "sort",
      ready: !1,
      options: {
        appendTo: "parent",
        axis: !1,
        connectWith: !1,
        containment: !1,
        cursor: "auto",
        cursorAt: !1,
        dropOnEmpty: !0,
        forcePlaceholderSize: !1,
        forceHelperSize: !1,
        grid: !1,
        handle: !1,
        helper: "original",
        items: "> *",
        opacity: !1,
        placeholder: !1,
        revert: !1,
        scroll: !0,
        scrollSensitivity: 20,
        scrollSpeed: 20,
        scope: "default",
        tolerance: "intersect",
        zIndex: 1e3,
        activate: null,
        beforeStop: null,
        change: null,
        deactivate: null,
        out: null,
        over: null,
        receive: null,
        remove: null,
        sort: null,
        start: null,
        stop: null,
        update: null,
      },
      _isOverAxis: function (t, e, i) {
        return e <= t && t < e + i;
      },
      _isFloating: function (t) {
        return (
          /left|right/.test(t.css("float")) ||
          /inline|table-cell/.test(t.css("display"))
        );
      },
      _create: function () {
        (this.containerCache = {}),
          this._addClass("ui-sortable"),
          this.refresh(),
          (this.offset = this.element.offset()),
          this._mouseInit(),
          this._setHandleClassName(),
          (this.ready = !0);
      },
      _setOption: function (t, e) {
        this._super(t, e), "handle" === t && this._setHandleClassName();
      },
      _setHandleClassName: function () {
        var t = this;
        this._removeClass(
          this.element.find(".ui-sortable-handle"),
          "ui-sortable-handle"
        ),
          k.each(this.items, function () {
            t._addClass(
              this.instance.options.handle
                ? this.item.find(this.instance.options.handle)
                : this.item,
              "ui-sortable-handle"
            );
          });
      },
      _destroy: function () {
        this._mouseDestroy();
        for (var t = this.items.length - 1; 0 <= t; t--)
          this.items[t].item.removeData(this.widgetName + "-item");
        return this;
      },
      _mouseCapture: function (t, e) {
        var i = null,
          s = !1,
          n = this;
        return (
          !this.reverting &&
          !this.options.disabled &&
          "static" !== this.options.type &&
          (this._refreshItems(t),
          k(t.target)
            .parents()
            .each(function () {
              if (k.data(this, n.widgetName + "-item") === n)
                return (i = k(this)), !1;
            }),
          k.data(t.target, n.widgetName + "-item") === n && (i = k(t.target)),
          !!i &&
            !(
              this.options.handle &&
              !e &&
              (k(this.options.handle, i)
                .find("*")
                .addBack()
                .each(function () {
                  this === t.target && (s = !0);
                }),
              !s)
            ) &&
            ((this.currentItem = i), this._removeCurrentsFromItems(), !0))
        );
      },
      _mouseStart: function (t, e, i) {
        var s,
          n,
          o = this.options;
        if (
          ((this.currentContainer = this).refreshPositions(),
          (this.helper = this._createHelper(t)),
          this._cacheHelperProportions(),
          this._cacheMargins(),
          (this.scrollParent = this.helper.scrollParent()),
          (this.offset = this.currentItem.offset()),
          (this.offset = {
            top: this.offset.top - this.margins.top,
            left: this.offset.left - this.margins.left,
          }),
          k.extend(this.offset, {
            click: {
              left: t.pageX - this.offset.left,
              top: t.pageY - this.offset.top,
            },
            parent: this._getParentOffset(),
            relative: this._getRelativeOffset(),
          }),
          this.helper.css("position", "absolute"),
          (this.cssPosition = this.helper.css("position")),
          (this.originalPosition = this._generatePosition(t)),
          (this.originalPageX = t.pageX),
          (this.originalPageY = t.pageY),
          o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt),
          (this.domPosition = {
            prev: this.currentItem.prev()[0],
            parent: this.currentItem.parent()[0],
          }),
          this.helper[0] !== this.currentItem[0] && this.currentItem.hide(),
          this._createPlaceholder(),
          o.containment && this._setContainment(),
          o.cursor &&
            "auto" !== o.cursor &&
            ((n = this.document.find("body")),
            (this.storedCursor = n.css("cursor")),
            n.css("cursor", o.cursor),
            (this.storedStylesheet = k(
              "<style>*{ cursor: " + o.cursor + " !important; }</style>"
            ).appendTo(n))),
          o.opacity &&
            (this.helper.css("opacity") &&
              (this._storedOpacity = this.helper.css("opacity")),
            this.helper.css("opacity", o.opacity)),
          o.zIndex &&
            (this.helper.css("zIndex") &&
              (this._storedZIndex = this.helper.css("zIndex")),
            this.helper.css("zIndex", o.zIndex)),
          this.scrollParent[0] !== this.document[0] &&
            "HTML" !== this.scrollParent[0].tagName &&
            (this.overflowOffset = this.scrollParent.offset()),
          this._trigger("start", t, this._uiHash()),
          this._preserveHelperProportions || this._cacheHelperProportions(),
          !i)
        )
          for (s = this.containers.length - 1; 0 <= s; s--)
            this.containers[s]._trigger("activate", t, this._uiHash(this));
        return (
          k.ui.ddmanager && (k.ui.ddmanager.current = this),
          k.ui.ddmanager &&
            !o.dropBehaviour &&
            k.ui.ddmanager.prepareOffsets(this, t),
          (this.dragging = !0),
          this._addClass(this.helper, "ui-sortable-helper"),
          this._mouseDrag(t),
          !0
        );
      },
      _mouseDrag: function (t) {
        var e,
          i,
          s,
          n,
          o = this.options,
          a = !1;
        for (
          this.position = this._generatePosition(t),
            this.positionAbs = this._convertPositionTo("absolute"),
            this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs),
            this.options.scroll &&
              (this.scrollParent[0] !== this.document[0] &&
              "HTML" !== this.scrollParent[0].tagName
                ? (this.overflowOffset.top +
                    this.scrollParent[0].offsetHeight -
                    t.pageY <
                  o.scrollSensitivity
                    ? (this.scrollParent[0].scrollTop = a =
                        this.scrollParent[0].scrollTop + o.scrollSpeed)
                    : t.pageY - this.overflowOffset.top < o.scrollSensitivity &&
                      (this.scrollParent[0].scrollTop = a =
                        this.scrollParent[0].scrollTop - o.scrollSpeed),
                  this.overflowOffset.left +
                    this.scrollParent[0].offsetWidth -
                    t.pageX <
                  o.scrollSensitivity
                    ? (this.scrollParent[0].scrollLeft = a =
                        this.scrollParent[0].scrollLeft + o.scrollSpeed)
                    : t.pageX - this.overflowOffset.left <
                        o.scrollSensitivity &&
                      (this.scrollParent[0].scrollLeft = a =
                        this.scrollParent[0].scrollLeft - o.scrollSpeed))
                : (t.pageY - this.document.scrollTop() < o.scrollSensitivity
                    ? (a = this.document.scrollTop(
                        this.document.scrollTop() - o.scrollSpeed
                      ))
                    : this.window.height() -
                        (t.pageY - this.document.scrollTop()) <
                        o.scrollSensitivity &&
                      (a = this.document.scrollTop(
                        this.document.scrollTop() + o.scrollSpeed
                      )),
                  t.pageX - this.document.scrollLeft() < o.scrollSensitivity
                    ? (a = this.document.scrollLeft(
                        this.document.scrollLeft() - o.scrollSpeed
                      ))
                    : this.window.width() -
                        (t.pageX - this.document.scrollLeft()) <
                        o.scrollSensitivity &&
                      (a = this.document.scrollLeft(
                        this.document.scrollLeft() + o.scrollSpeed
                      ))),
              !1 !== a &&
                k.ui.ddmanager &&
                !o.dropBehaviour &&
                k.ui.ddmanager.prepareOffsets(this, t)),
            this.positionAbs = this._convertPositionTo("absolute"),
            (this.options.axis && "y" === this.options.axis) ||
              (this.helper[0].style.left = this.position.left + "px"),
            (this.options.axis && "x" === this.options.axis) ||
              (this.helper[0].style.top = this.position.top + "px"),
            e = this.items.length - 1;
          0 <= e;
          e--
        )
          if (
            ((s = (i = this.items[e]).item[0]),
            (n = this._intersectsWithPointer(i)) &&
              i.instance === this.currentContainer &&
              !(
                s === this.currentItem[0] ||
                this.placeholder[1 === n ? "next" : "prev"]()[0] === s ||
                k.contains(this.placeholder[0], s) ||
                ("semi-dynamic" === this.options.type &&
                  k.contains(this.element[0], s))
              ))
          ) {
            if (
              ((this.direction = 1 === n ? "down" : "up"),
              "pointer" !== this.options.tolerance &&
                !this._intersectsWithSides(i))
            )
              break;
            this._rearrange(t, i), this._trigger("change", t, this._uiHash());
            break;
          }
        return (
          this._contactContainers(t),
          k.ui.ddmanager && k.ui.ddmanager.drag(this, t),
          this._trigger("sort", t, this._uiHash()),
          (this.lastPositionAbs = this.positionAbs),
          !1
        );
      },
      _mouseStop: function (t, e) {
        var i, s, n, o;
        if (t)
          return (
            k.ui.ddmanager &&
              !this.options.dropBehaviour &&
              k.ui.ddmanager.drop(this, t),
            this.options.revert
              ? ((s = (i = this).placeholder.offset()),
                (o = {}),
                ((n = this.options.axis) && "x" !== n) ||
                  (o.left =
                    s.left -
                    this.offset.parent.left -
                    this.margins.left +
                    (this.offsetParent[0] === this.document[0].body
                      ? 0
                      : this.offsetParent[0].scrollLeft)),
                (n && "y" !== n) ||
                  (o.top =
                    s.top -
                    this.offset.parent.top -
                    this.margins.top +
                    (this.offsetParent[0] === this.document[0].body
                      ? 0
                      : this.offsetParent[0].scrollTop)),
                (this.reverting = !0),
                k(this.helper).animate(
                  o,
                  parseInt(this.options.revert, 10) || 500,
                  function () {
                    i._clear(t);
                  }
                ))
              : this._clear(t, e),
            !1
          );
      },
      cancel: function () {
        if (this.dragging) {
          this._mouseUp(new k.Event("mouseup", { target: null })),
            "original" === this.options.helper
              ? (this.currentItem.css(this._storedCSS),
                this._removeClass(this.currentItem, "ui-sortable-helper"))
              : this.currentItem.show();
          for (var t = this.containers.length - 1; 0 <= t; t--)
            this.containers[t]._trigger("deactivate", null, this._uiHash(this)),
              this.containers[t].containerCache.over &&
                (this.containers[t]._trigger("out", null, this._uiHash(this)),
                (this.containers[t].containerCache.over = 0));
        }
        return (
          this.placeholder &&
            (this.placeholder[0].parentNode &&
              this.placeholder[0].parentNode.removeChild(this.placeholder[0]),
            "original" !== this.options.helper &&
              this.helper &&
              this.helper[0].parentNode &&
              this.helper.remove(),
            k.extend(this, {
              helper: null,
              dragging: !1,
              reverting: !1,
              _noFinalSort: null,
            }),
            this.domPosition.prev
              ? k(this.domPosition.prev).after(this.currentItem)
              : k(this.domPosition.parent).prepend(this.currentItem)),
          this
        );
      },
      serialize: function (e) {
        var t = this._getItemsAsjQuery(e && e.connected),
          i = [];
        return (
          (e = e || {}),
          k(t).each(function () {
            var t = (k(e.item || this).attr(e.attribute || "id") || "").match(
              e.expression || /(.+)[\-=_](.+)/
            );
            t &&
              i.push(
                (e.key || t[1] + "[]") +
                  "=" +
                  (e.key && e.expression ? t[1] : t[2])
              );
          }),
          !i.length && e.key && i.push(e.key + "="),
          i.join("&")
        );
      },
      toArray: function (t) {
        var e = this._getItemsAsjQuery(t && t.connected),
          i = [];
        return (
          (t = t || {}),
          e.each(function () {
            i.push(k(t.item || this).attr(t.attribute || "id") || "");
          }),
          i
        );
      },
      _intersectsWith: function (t) {
        var e = this.positionAbs.left,
          i = e + this.helperProportions.width,
          s = this.positionAbs.top,
          n = s + this.helperProportions.height,
          o = t.left,
          a = o + t.width,
          r = t.top,
          h = r + t.height,
          l = this.offset.click.top,
          c = this.offset.click.left,
          l = "x" === this.options.axis || (r < s + l && s + l < h),
          c = "y" === this.options.axis || (o < e + c && e + c < a),
          c = l && c;
        return "pointer" === this.options.tolerance ||
          this.options.forcePointerForContainers ||
          ("pointer" !== this.options.tolerance &&
            this.helperProportions[this.floating ? "width" : "height"] >
              t[this.floating ? "width" : "height"])
          ? c
          : o < e + this.helperProportions.width / 2 &&
              i - this.helperProportions.width / 2 < a &&
              r < s + this.helperProportions.height / 2 &&
              n - this.helperProportions.height / 2 < h;
      },
      _intersectsWithPointer: function (t) {
        var e =
            "x" === this.options.axis ||
            this._isOverAxis(
              this.positionAbs.top + this.offset.click.top,
              t.top,
              t.height
            ),
          t =
            "y" === this.options.axis ||
            this._isOverAxis(
              this.positionAbs.left + this.offset.click.left,
              t.left,
              t.width
            );
        return (
          !(!e || !t) &&
          ((e = this._getDragVerticalDirection()),
          (t = this._getDragHorizontalDirection()),
          this.floating
            ? "right" === t || "down" === e
              ? 2
              : 1
            : e && ("down" === e ? 2 : 1))
        );
      },
      _intersectsWithSides: function (t) {
        var e = this._isOverAxis(
            this.positionAbs.top + this.offset.click.top,
            t.top + t.height / 2,
            t.height
          ),
          i = this._isOverAxis(
            this.positionAbs.left + this.offset.click.left,
            t.left + t.width / 2,
            t.width
          ),
          s = this._getDragVerticalDirection(),
          t = this._getDragHorizontalDirection();
        return this.floating && t
          ? ("right" === t && i) || ("left" === t && !i)
          : s && (("down" === s && e) || ("up" === s && !e));
      },
      _getDragVerticalDirection: function () {
        var t = this.positionAbs.top - this.lastPositionAbs.top;
        return 0 != t && (0 < t ? "down" : "up");
      },
      _getDragHorizontalDirection: function () {
        var t = this.positionAbs.left - this.lastPositionAbs.left;
        return 0 != t && (0 < t ? "right" : "left");
      },
      refresh: function (t) {
        return (
          this._refreshItems(t),
          this._setHandleClassName(),
          this.refreshPositions(),
          this
        );
      },
      _connectWith: function () {
        var t = this.options;
        return t.connectWith.constructor === String
          ? [t.connectWith]
          : t.connectWith;
      },
      _getItemsAsjQuery: function (t) {
        var e,
          i,
          s,
          n,
          o = [],
          a = [],
          r = this._connectWith();
        if (r && t)
          for (e = r.length - 1; 0 <= e; e--)
            for (i = (s = k(r[e], this.document[0])).length - 1; 0 <= i; i--)
              (n = k.data(s[i], this.widgetFullName)) &&
                n !== this &&
                !n.options.disabled &&
                a.push([
                  k.isFunction(n.options.items)
                    ? n.options.items.call(n.element)
                    : k(n.options.items, n.element)
                        .not(".ui-sortable-helper")
                        .not(".ui-sortable-placeholder"),
                  n,
                ]);
        function h() {
          o.push(this);
        }
        for (
          a.push([
            k.isFunction(this.options.items)
              ? this.options.items.call(this.element, null, {
                  options: this.options,
                  item: this.currentItem,
                })
              : k(this.options.items, this.element)
                  .not(".ui-sortable-helper")
                  .not(".ui-sortable-placeholder"),
            this,
          ]),
            e = a.length - 1;
          0 <= e;
          e--
        )
          a[e][0].each(h);
        return k(o);
      },
      _removeCurrentsFromItems: function () {
        var i = this.currentItem.find(":data(" + this.widgetName + "-item)");
        this.items = k.grep(this.items, function (t) {
          for (var e = 0; e < i.length; e++) if (i[e] === t.item[0]) return !1;
          return !0;
        });
      },
      _refreshItems: function (t) {
        (this.items = []), (this.containers = [this]);
        var e,
          i,
          s,
          n,
          o,
          a,
          r,
          h,
          l = this.items,
          c = [
            [
              k.isFunction(this.options.items)
                ? this.options.items.call(this.element[0], t, {
                    item: this.currentItem,
                  })
                : k(this.options.items, this.element),
              this,
            ],
          ],
          u = this._connectWith();
        if (u && this.ready)
          for (e = u.length - 1; 0 <= e; e--)
            for (i = (s = k(u[e], this.document[0])).length - 1; 0 <= i; i--)
              (n = k.data(s[i], this.widgetFullName)) &&
                n !== this &&
                !n.options.disabled &&
                (c.push([
                  k.isFunction(n.options.items)
                    ? n.options.items.call(n.element[0], t, {
                        item: this.currentItem,
                      })
                    : k(n.options.items, n.element),
                  n,
                ]),
                this.containers.push(n));
        for (e = c.length - 1; 0 <= e; e--)
          for (o = c[e][1], i = 0, h = (a = c[e][0]).length; i < h; i++)
            (r = k(a[i])).data(this.widgetName + "-item", o),
              l.push({
                item: r,
                instance: o,
                width: 0,
                height: 0,
                left: 0,
                top: 0,
              });
      },
      refreshPositions: function (t) {
        var e, i, s, n;
        for (
          this.floating =
            !!this.items.length &&
            ("x" === this.options.axis || this._isFloating(this.items[0].item)),
            this.offsetParent &&
              this.helper &&
              (this.offset.parent = this._getParentOffset()),
            e = this.items.length - 1;
          0 <= e;
          e--
        )
          ((i = this.items[e]).instance !== this.currentContainer &&
            this.currentContainer &&
            i.item[0] !== this.currentItem[0]) ||
            ((s = this.options.toleranceElement
              ? k(this.options.toleranceElement, i.item)
              : i.item),
            t || ((i.width = s.outerWidth()), (i.height = s.outerHeight())),
            (n = s.offset()),
            (i.left = n.left),
            (i.top = n.top));
        if (this.options.custom && this.options.custom.refreshContainers)
          this.options.custom.refreshContainers.call(this);
        else
          for (e = this.containers.length - 1; 0 <= e; e--)
            (n = this.containers[e].element.offset()),
              (this.containers[e].containerCache.left = n.left),
              (this.containers[e].containerCache.top = n.top),
              (this.containers[e].containerCache.width =
                this.containers[e].element.outerWidth()),
              (this.containers[e].containerCache.height =
                this.containers[e].element.outerHeight());
        return this;
      },
      _createPlaceholder: function (i) {
        var s,
          n = (i = i || this).options;
        (n.placeholder && n.placeholder.constructor !== String) ||
          ((s = n.placeholder),
          (n.placeholder = {
            element: function () {
              var t = i.currentItem[0].nodeName.toLowerCase(),
                e = k("<" + t + ">", i.document[0]);
              return (
                i
                  ._addClass(
                    e,
                    "ui-sortable-placeholder",
                    s || i.currentItem[0].className
                  )
                  ._removeClass(e, "ui-sortable-helper"),
                "tbody" === t
                  ? i._createTrPlaceholder(
                      i.currentItem.find("tr").eq(0),
                      k("<tr>", i.document[0]).appendTo(e)
                    )
                  : "tr" === t
                  ? i._createTrPlaceholder(i.currentItem, e)
                  : "img" === t && e.attr("src", i.currentItem.attr("src")),
                s || e.css("visibility", "hidden"),
                e
              );
            },
            update: function (t, e) {
              (s && !n.forcePlaceholderSize) ||
                (e.height() ||
                  e.height(
                    i.currentItem.innerHeight() -
                      parseInt(i.currentItem.css("paddingTop") || 0, 10) -
                      parseInt(i.currentItem.css("paddingBottom") || 0, 10)
                  ),
                e.width() ||
                  e.width(
                    i.currentItem.innerWidth() -
                      parseInt(i.currentItem.css("paddingLeft") || 0, 10) -
                      parseInt(i.currentItem.css("paddingRight") || 0, 10)
                  ));
            },
          })),
          (i.placeholder = k(
            n.placeholder.element.call(i.element, i.currentItem)
          )),
          i.currentItem.after(i.placeholder),
          n.placeholder.update(i, i.placeholder);
      },
      _createTrPlaceholder: function (t, e) {
        var i = this;
        t.children().each(function () {
          k("<td>&#160;</td>", i.document[0])
            .attr("colspan", k(this).attr("colspan") || 1)
            .appendTo(e);
        });
      },
      _contactContainers: function (t) {
        for (
          var e,
            i,
            s,
            n,
            o,
            a,
            r,
            h,
            l,
            c = null,
            u = null,
            d = this.containers.length - 1;
          0 <= d;
          d--
        )
          k.contains(this.currentItem[0], this.containers[d].element[0]) ||
            (this._intersectsWith(this.containers[d].containerCache)
              ? (c &&
                  k.contains(this.containers[d].element[0], c.element[0])) ||
                ((c = this.containers[d]), (u = d))
              : this.containers[d].containerCache.over &&
                (this.containers[d]._trigger("out", t, this._uiHash(this)),
                (this.containers[d].containerCache.over = 0)));
        if (c)
          if (1 === this.containers.length)
            this.containers[u].containerCache.over ||
              (this.containers[u]._trigger("over", t, this._uiHash(this)),
              (this.containers[u].containerCache.over = 1));
          else {
            for (
              i = 1e4,
                s = null,
                n = (h = c.floating || this._isFloating(this.currentItem))
                  ? "left"
                  : "top",
                o = h ? "width" : "height",
                l = h ? "pageX" : "pageY",
                e = this.items.length - 1;
              0 <= e;
              e--
            )
              k.contains(
                this.containers[u].element[0],
                this.items[e].item[0]
              ) &&
                this.items[e].item[0] !== this.currentItem[0] &&
                ((a = this.items[e].item.offset()[n]),
                (r = !1),
                t[l] - a > this.items[e][o] / 2 && (r = !0),
                Math.abs(t[l] - a) < i &&
                  ((i = Math.abs(t[l] - a)),
                  (s = this.items[e]),
                  (this.direction = r ? "up" : "down")));
            (s || this.options.dropOnEmpty) &&
              (this.currentContainer !== this.containers[u]
                ? (s
                    ? this._rearrange(t, s, null, !0)
                    : this._rearrange(t, null, this.containers[u].element, !0),
                  this._trigger("change", t, this._uiHash()),
                  this.containers[u]._trigger("change", t, this._uiHash(this)),
                  (this.currentContainer = this.containers[u]),
                  this.options.placeholder.update(
                    this.currentContainer,
                    this.placeholder
                  ),
                  this.containers[u]._trigger("over", t, this._uiHash(this)),
                  (this.containers[u].containerCache.over = 1))
                : this.currentContainer.containerCache.over ||
                  (this.containers[u]._trigger("over", t, this._uiHash()),
                  (this.currentContainer.containerCache.over = 1)));
          }
      },
      _createHelper: function (t) {
        var e = this.options,
          t = k.isFunction(e.helper)
            ? k(e.helper.apply(this.element[0], [t, this.currentItem]))
            : "clone" === e.helper
            ? this.currentItem.clone()
            : this.currentItem;
        return (
          t.parents("body").length ||
            k(
              "parent" !== e.appendTo
                ? e.appendTo
                : this.currentItem[0].parentNode
            )[0].appendChild(t[0]),
          t[0] === this.currentItem[0] &&
            (this._storedCSS = {
              width: this.currentItem[0].style.width,
              height: this.currentItem[0].style.height,
              position: this.currentItem.css("position"),
              top: this.currentItem.css("top"),
              left: this.currentItem.css("left"),
            }),
          (t[0].style.width && !e.forceHelperSize) ||
            t.width(this.currentItem.width()),
          (t[0].style.height && !e.forceHelperSize) ||
            t.height(this.currentItem.height()),
          t
        );
      },
      _adjustOffsetFromHelper: function (t) {
        "string" == typeof t && (t = t.split(" ")),
          k.isArray(t) && (t = { left: +t[0], top: +t[1] || 0 }),
          "left" in t && (this.offset.click.left = t.left + this.margins.left),
          "right" in t &&
            (this.offset.click.left =
              this.helperProportions.width - t.right + this.margins.left),
          "top" in t && (this.offset.click.top = t.top + this.margins.top),
          "bottom" in t &&
            (this.offset.click.top =
              this.helperProportions.height - t.bottom + this.margins.top);
      },
      _getParentOffset: function () {
        this.offsetParent = this.helper.offsetParent();
        var t = this.offsetParent.offset();
        return (
          "absolute" === this.cssPosition &&
            this.scrollParent[0] !== this.document[0] &&
            k.contains(this.scrollParent[0], this.offsetParent[0]) &&
            ((t.left += this.scrollParent.scrollLeft()),
            (t.top += this.scrollParent.scrollTop())),
          (this.offsetParent[0] === this.document[0].body ||
            (this.offsetParent[0].tagName &&
              "html" === this.offsetParent[0].tagName.toLowerCase() &&
              k.ui.ie)) &&
            (t = { top: 0, left: 0 }),
          {
            top:
              t.top +
              (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
            left:
              t.left +
              (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0),
          }
        );
      },
      _getRelativeOffset: function () {
        if ("relative" !== this.cssPosition) return { top: 0, left: 0 };
        var t = this.currentItem.position();
        return {
          top:
            t.top -
            (parseInt(this.helper.css("top"), 10) || 0) +
            this.scrollParent.scrollTop(),
          left:
            t.left -
            (parseInt(this.helper.css("left"), 10) || 0) +
            this.scrollParent.scrollLeft(),
        };
      },
      _cacheMargins: function () {
        this.margins = {
          left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
          top: parseInt(this.currentItem.css("marginTop"), 10) || 0,
        };
      },
      _cacheHelperProportions: function () {
        this.helperProportions = {
          width: this.helper.outerWidth(),
          height: this.helper.outerHeight(),
        };
      },
      _setContainment: function () {
        var t,
          e,
          i = this.options;
        "parent" === i.containment &&
          (i.containment = this.helper[0].parentNode),
          ("document" !== i.containment && "window" !== i.containment) ||
            (this.containment = [
              0 - this.offset.relative.left - this.offset.parent.left,
              0 - this.offset.relative.top - this.offset.parent.top,
              "document" === i.containment
                ? this.document.width()
                : this.window.width() -
                  this.helperProportions.width -
                  this.margins.left,
              ("document" === i.containment
                ? this.document.height() ||
                  document.body.parentNode.scrollHeight
                : this.window.height() ||
                  this.document[0].body.parentNode.scrollHeight) -
                this.helperProportions.height -
                this.margins.top,
            ]),
          /^(document|window|parent)$/.test(i.containment) ||
            ((t = k(i.containment)[0]),
            (e = k(i.containment).offset()),
            (i = "hidden" !== k(t).css("overflow")),
            (this.containment = [
              e.left +
                (parseInt(k(t).css("borderLeftWidth"), 10) || 0) +
                (parseInt(k(t).css("paddingLeft"), 10) || 0) -
                this.margins.left,
              e.top +
                (parseInt(k(t).css("borderTopWidth"), 10) || 0) +
                (parseInt(k(t).css("paddingTop"), 10) || 0) -
                this.margins.top,
              e.left +
                (i ? Math.max(t.scrollWidth, t.offsetWidth) : t.offsetWidth) -
                (parseInt(k(t).css("borderLeftWidth"), 10) || 0) -
                (parseInt(k(t).css("paddingRight"), 10) || 0) -
                this.helperProportions.width -
                this.margins.left,
              e.top +
                (i
                  ? Math.max(t.scrollHeight, t.offsetHeight)
                  : t.offsetHeight) -
                (parseInt(k(t).css("borderTopWidth"), 10) || 0) -
                (parseInt(k(t).css("paddingBottom"), 10) || 0) -
                this.helperProportions.height -
                this.margins.top,
            ]));
      },
      _convertPositionTo: function (t, e) {
        e = e || this.position;
        var i = "absolute" === t ? 1 : -1,
          s =
            "absolute" !== this.cssPosition ||
            (this.scrollParent[0] !== this.document[0] &&
              k.contains(this.scrollParent[0], this.offsetParent[0]))
              ? this.scrollParent
              : this.offsetParent,
          t = /(html|body)/i.test(s[0].tagName);
        return {
          top:
            e.top +
            this.offset.relative.top * i +
            this.offset.parent.top * i -
            ("fixed" === this.cssPosition
              ? -this.scrollParent.scrollTop()
              : t
              ? 0
              : s.scrollTop()) *
              i,
          left:
            e.left +
            this.offset.relative.left * i +
            this.offset.parent.left * i -
            ("fixed" === this.cssPosition
              ? -this.scrollParent.scrollLeft()
              : t
              ? 0
              : s.scrollLeft()) *
              i,
        };
      },
      _generatePosition: function (t) {
        var e = this.options,
          i = t.pageX,
          s = t.pageY,
          n =
            "absolute" !== this.cssPosition ||
            (this.scrollParent[0] !== this.document[0] &&
              k.contains(this.scrollParent[0], this.offsetParent[0]))
              ? this.scrollParent
              : this.offsetParent,
          o = /(html|body)/i.test(n[0].tagName);
        return (
          "relative" !== this.cssPosition ||
            (this.scrollParent[0] !== this.document[0] &&
              this.scrollParent[0] !== this.offsetParent[0]) ||
            (this.offset.relative = this._getRelativeOffset()),
          this.originalPosition &&
            (this.containment &&
              (t.pageX - this.offset.click.left < this.containment[0] &&
                (i = this.containment[0] + this.offset.click.left),
              t.pageY - this.offset.click.top < this.containment[1] &&
                (s = this.containment[1] + this.offset.click.top),
              t.pageX - this.offset.click.left > this.containment[2] &&
                (i = this.containment[2] + this.offset.click.left),
              t.pageY - this.offset.click.top > this.containment[3] &&
                (s = this.containment[3] + this.offset.click.top)),
            e.grid &&
              ((t =
                this.originalPageY +
                Math.round((s - this.originalPageY) / e.grid[1]) * e.grid[1]),
              (s =
                !this.containment ||
                (t - this.offset.click.top >= this.containment[1] &&
                  t - this.offset.click.top <= this.containment[3])
                  ? t
                  : t - this.offset.click.top >= this.containment[1]
                  ? t - e.grid[1]
                  : t + e.grid[1]),
              (t =
                this.originalPageX +
                Math.round((i - this.originalPageX) / e.grid[0]) * e.grid[0]),
              (i =
                !this.containment ||
                (t - this.offset.click.left >= this.containment[0] &&
                  t - this.offset.click.left <= this.containment[2])
                  ? t
                  : t - this.offset.click.left >= this.containment[0]
                  ? t - e.grid[0]
                  : t + e.grid[0]))),
          {
            top:
              s -
              this.offset.click.top -
              this.offset.relative.top -
              this.offset.parent.top +
              ("fixed" === this.cssPosition
                ? -this.scrollParent.scrollTop()
                : o
                ? 0
                : n.scrollTop()),
            left:
              i -
              this.offset.click.left -
              this.offset.relative.left -
              this.offset.parent.left +
              ("fixed" === this.cssPosition
                ? -this.scrollParent.scrollLeft()
                : o
                ? 0
                : n.scrollLeft()),
          }
        );
      },
      _rearrange: function (t, e, i, s) {
        i
          ? i[0].appendChild(this.placeholder[0])
          : e.item[0].parentNode.insertBefore(
              this.placeholder[0],
              "down" === this.direction ? e.item[0] : e.item[0].nextSibling
            ),
          (this.counter = this.counter ? ++this.counter : 1);
        var n = this.counter;
        this._delay(function () {
          n === this.counter && this.refreshPositions(!s);
        });
      },
      _clear: function (t, e) {
        this.reverting = !1;
        var i,
          s = [];
        if (
          (!this._noFinalSort &&
            this.currentItem.parent().length &&
            this.placeholder.before(this.currentItem),
          (this._noFinalSort = null),
          this.helper[0] === this.currentItem[0])
        ) {
          for (i in this._storedCSS)
            ("auto" !== this._storedCSS[i] &&
              "static" !== this._storedCSS[i]) ||
              (this._storedCSS[i] = "");
          this.currentItem.css(this._storedCSS),
            this._removeClass(this.currentItem, "ui-sortable-helper");
        } else this.currentItem.show();
        function n(e, i, s) {
          return function (t) {
            s._trigger(e, t, i._uiHash(i));
          };
        }
        for (
          this.fromOutside &&
            !e &&
            s.push(function (t) {
              this._trigger("receive", t, this._uiHash(this.fromOutside));
            }),
            (!this.fromOutside &&
              this.domPosition.prev ===
                this.currentItem.prev().not(".ui-sortable-helper")[0] &&
              this.domPosition.parent === this.currentItem.parent()[0]) ||
              e ||
              s.push(function (t) {
                this._trigger("update", t, this._uiHash());
              }),
            this !== this.currentContainer &&
              (e ||
                (s.push(function (t) {
                  this._trigger("remove", t, this._uiHash());
                }),
                s.push(
                  function (e) {
                    return function (t) {
                      e._trigger("receive", t, this._uiHash(this));
                    };
                  }.call(this, this.currentContainer)
                ),
                s.push(
                  function (e) {
                    return function (t) {
                      e._trigger("update", t, this._uiHash(this));
                    };
                  }.call(this, this.currentContainer)
                ))),
            i = this.containers.length - 1;
          0 <= i;
          i--
        )
          e || s.push(n("deactivate", this, this.containers[i])),
            this.containers[i].containerCache.over &&
              (s.push(n("out", this, this.containers[i])),
              (this.containers[i].containerCache.over = 0));
        if (
          (this.storedCursor &&
            (this.document.find("body").css("cursor", this.storedCursor),
            this.storedStylesheet.remove()),
          this._storedOpacity &&
            this.helper.css("opacity", this._storedOpacity),
          this._storedZIndex &&
            this.helper.css(
              "zIndex",
              "auto" === this._storedZIndex ? "" : this._storedZIndex
            ),
          (this.dragging = !1),
          e || this._trigger("beforeStop", t, this._uiHash()),
          this.placeholder[0].parentNode.removeChild(this.placeholder[0]),
          this.cancelHelperRemoval ||
            (this.helper[0] !== this.currentItem[0] && this.helper.remove(),
            (this.helper = null)),
          !e)
        ) {
          for (i = 0; i < s.length; i++) s[i].call(this, t);
          this._trigger("stop", t, this._uiHash());
        }
        return (this.fromOutside = !1), !this.cancelHelperRemoval;
      },
      _trigger: function () {
        !1 === k.Widget.prototype._trigger.apply(this, arguments) &&
          this.cancel();
      },
      _uiHash: function (t) {
        var e = t || this;
        return {
          helper: e.helper,
          placeholder: e.placeholder || k([]),
          position: e.position,
          originalPosition: e.originalPosition,
          offset: e.positionAbs,
          item: e.currentItem,
          sender: t ? t.element : null,
        };
      },
    }),
    k.widget("ui.accordion", {
      version: "1.12.1",
      options: {
        active: 0,
        animate: {},
        classes: {
          "ui-accordion-header": "ui-corner-top",
          "ui-accordion-header-collapsed": "ui-corner-all",
          "ui-accordion-content": "ui-corner-bottom",
        },
        collapsible: !1,
        event: "click",
        header: "> li > :first-child, > :not(li):even",
        heightStyle: "auto",
        icons: {
          activeHeader: "ui-icon-triangle-1-s",
          header: "ui-icon-triangle-1-e",
        },
        activate: null,
        beforeActivate: null,
      },
      hideProps: {
        borderTopWidth: "hide",
        borderBottomWidth: "hide",
        paddingTop: "hide",
        paddingBottom: "hide",
        height: "hide",
      },
      showProps: {
        borderTopWidth: "show",
        borderBottomWidth: "show",
        paddingTop: "show",
        paddingBottom: "show",
        height: "show",
      },
      _create: function () {
        var t = this.options;
        (this.prevShow = this.prevHide = k()),
          this._addClass("ui-accordion", "ui-widget ui-helper-reset"),
          this.element.attr("role", "tablist"),
          t.collapsible ||
            (!1 !== t.active && null != t.active) ||
            (t.active = 0),
          this._processPanels(),
          t.active < 0 && (t.active += this.headers.length),
          this._refresh();
      },
      _getCreateEventData: function () {
        return {
          header: this.active,
          panel: this.active.length ? this.active.next() : k(),
        };
      },
      _createIcons: function () {
        var t,
          e = this.options.icons;
        e &&
          ((t = k("<span>")),
          this._addClass(t, "ui-accordion-header-icon", "ui-icon " + e.header),
          t.prependTo(this.headers),
          (t = this.active.children(".ui-accordion-header-icon")),
          this._removeClass(t, e.header)
            ._addClass(t, null, e.activeHeader)
            ._addClass(this.headers, "ui-accordion-icons"));
      },
      _destroyIcons: function () {
        this._removeClass(this.headers, "ui-accordion-icons"),
          this.headers.children(".ui-accordion-header-icon").remove();
      },
      _destroy: function () {
        var t;
        this.element.removeAttr("role"),
          this.headers
            .removeAttr(
              "role aria-expanded aria-selected aria-controls tabIndex"
            )
            .removeUniqueId(),
          this._destroyIcons(),
          (t = this.headers
            .next()
            .css("display", "")
            .removeAttr("role aria-hidden aria-labelledby")
            .removeUniqueId()),
          "content" !== this.options.heightStyle && t.css("height", "");
      },
      _setOption: function (t, e) {
        "active" !== t
          ? ("event" === t &&
              (this.options.event &&
                this._off(this.headers, this.options.event),
              this._setupEvents(e)),
            this._super(t, e),
            "collapsible" !== t ||
              e ||
              !1 !== this.options.active ||
              this._activate(0),
            "icons" === t && (this._destroyIcons(), e && this._createIcons()))
          : this._activate(e);
      },
      _setOptionDisabled: function (t) {
        this._super(t),
          this.element.attr("aria-disabled", t),
          this._toggleClass(null, "ui-state-disabled", !!t),
          this._toggleClass(
            this.headers.add(this.headers.next()),
            null,
            "ui-state-disabled",
            !!t
          );
      },
      _keydown: function (t) {
        if (!t.altKey && !t.ctrlKey) {
          var e = k.ui.keyCode,
            i = this.headers.length,
            s = this.headers.index(t.target),
            n = !1;
          switch (t.keyCode) {
            case e.RIGHT:
            case e.DOWN:
              n = this.headers[(s + 1) % i];
              break;
            case e.LEFT:
            case e.UP:
              n = this.headers[(s - 1 + i) % i];
              break;
            case e.SPACE:
            case e.ENTER:
              this._eventHandler(t);
              break;
            case e.HOME:
              n = this.headers[0];
              break;
            case e.END:
              n = this.headers[i - 1];
          }
          n &&
            (k(t.target).attr("tabIndex", -1),
            k(n).attr("tabIndex", 0),
            k(n).trigger("focus"),
            t.preventDefault());
        }
      },
      _panelKeyDown: function (t) {
        t.keyCode === k.ui.keyCode.UP &&
          t.ctrlKey &&
          k(t.currentTarget).prev().trigger("focus");
      },
      refresh: function () {
        var t = this.options;
        this._processPanels(),
          (!1 === t.active && !0 === t.collapsible) || !this.headers.length
            ? ((t.active = !1), (this.active = k()))
            : !1 === t.active
            ? this._activate(0)
            : this.active.length && !k.contains(this.element[0], this.active[0])
            ? this.headers.length ===
              this.headers.find(".ui-state-disabled").length
              ? ((t.active = !1), (this.active = k()))
              : this._activate(Math.max(0, t.active - 1))
            : (t.active = this.headers.index(this.active)),
          this._destroyIcons(),
          this._refresh();
      },
      _processPanels: function () {
        var t = this.headers,
          e = this.panels;
        (this.headers = this.element.find(this.options.header)),
          this._addClass(
            this.headers,
            "ui-accordion-header ui-accordion-header-collapsed",
            "ui-state-default"
          ),
          (this.panels = this.headers
            .next()
            .filter(":not(.ui-accordion-content-active)")
            .hide()),
          this._addClass(
            this.panels,
            "ui-accordion-content",
            "ui-helper-reset ui-widget-content"
          ),
          e && (this._off(t.not(this.headers)), this._off(e.not(this.panels)));
      },
      _refresh: function () {
        var i,
          t = this.options,
          e = t.heightStyle,
          s = this.element.parent();
        (this.active = this._findActive(t.active)),
          this._addClass(
            this.active,
            "ui-accordion-header-active",
            "ui-state-active"
          )._removeClass(this.active, "ui-accordion-header-collapsed"),
          this._addClass(this.active.next(), "ui-accordion-content-active"),
          this.active.next().show(),
          this.headers
            .attr("role", "tab")
            .each(function () {
              var t = k(this),
                e = t.uniqueId().attr("id"),
                i = t.next(),
                s = i.uniqueId().attr("id");
              t.attr("aria-controls", s), i.attr("aria-labelledby", e);
            })
            .next()
            .attr("role", "tabpanel"),
          this.headers
            .not(this.active)
            .attr({
              "aria-selected": "false",
              "aria-expanded": "false",
              tabIndex: -1,
            })
            .next()
            .attr({ "aria-hidden": "true" })
            .hide(),
          this.active.length
            ? this.active
                .attr({
                  "aria-selected": "true",
                  "aria-expanded": "true",
                  tabIndex: 0,
                })
                .next()
                .attr({ "aria-hidden": "false" })
            : this.headers.eq(0).attr("tabIndex", 0),
          this._createIcons(),
          this._setupEvents(t.event),
          "fill" === e
            ? ((i = s.height()),
              this.element.siblings(":visible").each(function () {
                var t = k(this),
                  e = t.css("position");
                "absolute" !== e && "fixed" !== e && (i -= t.outerHeight(!0));
              }),
              this.headers.each(function () {
                i -= k(this).outerHeight(!0);
              }),
              this.headers
                .next()
                .each(function () {
                  k(this).height(
                    Math.max(0, i - k(this).innerHeight() + k(this).height())
                  );
                })
                .css("overflow", "auto"))
            : "auto" === e &&
              ((i = 0),
              this.headers
                .next()
                .each(function () {
                  var t = k(this).is(":visible");
                  t || k(this).show(),
                    (i = Math.max(i, k(this).css("height", "").height())),
                    t || k(this).hide();
                })
                .height(i));
      },
      _activate: function (t) {
        t = this._findActive(t)[0];
        t !== this.active[0] &&
          ((t = t || this.active[0]),
          this._eventHandler({
            target: t,
            currentTarget: t,
            preventDefault: k.noop,
          }));
      },
      _findActive: function (t) {
        return "number" == typeof t ? this.headers.eq(t) : k();
      },
      _setupEvents: function (t) {
        var i = { keydown: "_keydown" };
        t &&
          k.each(t.split(" "), function (t, e) {
            i[e] = "_eventHandler";
          }),
          this._off(this.headers.add(this.headers.next())),
          this._on(this.headers, i),
          this._on(this.headers.next(), { keydown: "_panelKeyDown" }),
          this._hoverable(this.headers),
          this._focusable(this.headers);
      },
      _eventHandler: function (t) {
        var e = this.options,
          i = this.active,
          s = k(t.currentTarget),
          n = s[0] === i[0],
          o = n && e.collapsible,
          a = o ? k() : s.next(),
          r = i.next(),
          a = {
            oldHeader: i,
            oldPanel: r,
            newHeader: o ? k() : s,
            newPanel: a,
          };
        t.preventDefault(),
          (n && !e.collapsible) ||
            !1 === this._trigger("beforeActivate", t, a) ||
            ((e.active = !o && this.headers.index(s)),
            (this.active = n ? k() : s),
            this._toggle(a),
            this._removeClass(
              i,
              "ui-accordion-header-active",
              "ui-state-active"
            ),
            e.icons &&
              ((i = i.children(".ui-accordion-header-icon")),
              this._removeClass(i, null, e.icons.activeHeader)._addClass(
                i,
                null,
                e.icons.header
              )),
            n ||
              (this._removeClass(s, "ui-accordion-header-collapsed")._addClass(
                s,
                "ui-accordion-header-active",
                "ui-state-active"
              ),
              e.icons &&
                ((n = s.children(".ui-accordion-header-icon")),
                this._removeClass(n, null, e.icons.header)._addClass(
                  n,
                  null,
                  e.icons.activeHeader
                )),
              this._addClass(s.next(), "ui-accordion-content-active")));
      },
      _toggle: function (t) {
        var e = t.newPanel,
          i = this.prevShow.length ? this.prevShow : t.oldPanel;
        this.prevShow.add(this.prevHide).stop(!0, !0),
          (this.prevShow = e),
          (this.prevHide = i),
          this.options.animate
            ? this._animate(e, i, t)
            : (i.hide(), e.show(), this._toggleComplete(t)),
          i.attr({ "aria-hidden": "true" }),
          i.prev().attr({ "aria-selected": "false", "aria-expanded": "false" }),
          e.length && i.length
            ? i.prev().attr({ tabIndex: -1, "aria-expanded": "false" })
            : e.length &&
              this.headers
                .filter(function () {
                  return 0 === parseInt(k(this).attr("tabIndex"), 10);
                })
                .attr("tabIndex", -1),
          e
            .attr("aria-hidden", "false")
            .prev()
            .attr({
              "aria-selected": "true",
              "aria-expanded": "true",
              tabIndex: 0,
            });
      },
      _animate: function (t, i, e) {
        var s,
          n,
          o,
          a = this,
          r = 0,
          h = t.css("box-sizing"),
          l = t.length && (!i.length || t.index() < i.index()),
          c = this.options.animate || {},
          u = (l && c.down) || c,
          l = function () {
            a._toggleComplete(e);
          };
        return (
          "number" == typeof u && (o = u),
          "string" == typeof u && (n = u),
          (n = n || u.easing || c.easing),
          (o = o || u.duration || c.duration),
          i.length
            ? t.length
              ? ((s = t.show().outerHeight()),
                i.animate(this.hideProps, {
                  duration: o,
                  easing: n,
                  step: function (t, e) {
                    e.now = Math.round(t);
                  },
                }),
                void t.hide().animate(this.showProps, {
                  duration: o,
                  easing: n,
                  complete: l,
                  step: function (t, e) {
                    (e.now = Math.round(t)),
                      "height" !== e.prop
                        ? "content-box" === h && (r += e.now)
                        : "content" !== a.options.heightStyle &&
                          ((e.now = Math.round(s - i.outerHeight() - r)),
                          (r = 0));
                  },
                }))
              : i.animate(this.hideProps, o, n, l)
            : t.animate(this.showProps, o, n, l)
        );
      },
      _toggleComplete: function (t) {
        var e = t.oldPanel,
          i = e.prev();
        this._removeClass(e, "ui-accordion-content-active"),
          this._removeClass(i, "ui-accordion-header-active")._addClass(
            i,
            "ui-accordion-header-collapsed"
          ),
          e.length && (e.parent()[0].className = e.parent()[0].className),
          this._trigger("activate", null, t);
      },
    }),
    k.widget("ui.menu", {
      version: "1.12.1",
      defaultElement: "<ul>",
      delay: 300,
      options: {
        icons: { submenu: "ui-icon-caret-1-e" },
        items: "> *",
        menus: "ul",
        position: { my: "left top", at: "right top" },
        role: "menu",
        blur: null,
        focus: null,
        select: null,
      },
      _create: function () {
        (this.activeMenu = this.element),
          (this.mouseHandled = !1),
          this.element
            .uniqueId()
            .attr({ role: this.options.role, tabIndex: 0 }),
          this._addClass("ui-menu", "ui-widget ui-widget-content"),
          this._on({
            "mousedown .ui-menu-item": function (t) {
              t.preventDefault();
            },
            "click .ui-menu-item": function (t) {
              var e = k(t.target),
                i = k(k.ui.safeActiveElement(this.document[0]));
              !this.mouseHandled &&
                e.not(".ui-state-disabled").length &&
                (this.select(t),
                t.isPropagationStopped() || (this.mouseHandled = !0),
                e.has(".ui-menu").length
                  ? this.expand(t)
                  : !this.element.is(":focus") &&
                    i.closest(".ui-menu").length &&
                    (this.element.trigger("focus", [!0]),
                    this.active &&
                      1 === this.active.parents(".ui-menu").length &&
                      clearTimeout(this.timer)));
            },
            "mouseenter .ui-menu-item": function (t) {
              var e, i;
              this.previousFilter ||
                ((e = k(t.target).closest(".ui-menu-item")),
                (i = k(t.currentTarget)),
                e[0] === i[0] &&
                  (this._removeClass(
                    i.siblings().children(".ui-state-active"),
                    null,
                    "ui-state-active"
                  ),
                  this.focus(t, i)));
            },
            mouseleave: "collapseAll",
            "mouseleave .ui-menu": "collapseAll",
            focus: function (t, e) {
              var i =
                this.active || this.element.find(this.options.items).eq(0);
              e || this.focus(t, i);
            },
            blur: function (t) {
              this._delay(function () {
                k.contains(
                  this.element[0],
                  k.ui.safeActiveElement(this.document[0])
                ) || this.collapseAll(t);
              });
            },
            keydown: "_keydown",
          }),
          this.refresh(),
          this._on(this.document, {
            click: function (t) {
              this._closeOnDocumentClick(t) && this.collapseAll(t),
                (this.mouseHandled = !1);
            },
          });
      },
      _destroy: function () {
        var t = this.element
          .find(".ui-menu-item")
          .removeAttr("role aria-disabled")
          .children(".ui-menu-item-wrapper")
          .removeUniqueId()
          .removeAttr("tabIndex role aria-haspopup");
        this.element
          .removeAttr("aria-activedescendant")
          .find(".ui-menu")
          .addBack()
          .removeAttr(
            "role aria-labelledby aria-expanded aria-hidden aria-disabled tabIndex"
          )
          .removeUniqueId()
          .show(),
          t.children().each(function () {
            var t = k(this);
            t.data("ui-menu-submenu-caret") && t.remove();
          });
      },
      _keydown: function (t) {
        var e,
          i,
          s,
          n = !0;
        switch (t.keyCode) {
          case k.ui.keyCode.PAGE_UP:
            this.previousPage(t);
            break;
          case k.ui.keyCode.PAGE_DOWN:
            this.nextPage(t);
            break;
          case k.ui.keyCode.HOME:
            this._move("first", "first", t);
            break;
          case k.ui.keyCode.END:
            this._move("last", "last", t);
            break;
          case k.ui.keyCode.UP:
            this.previous(t);
            break;
          case k.ui.keyCode.DOWN:
            this.next(t);
            break;
          case k.ui.keyCode.LEFT:
            this.collapse(t);
            break;
          case k.ui.keyCode.RIGHT:
            this.active &&
              !this.active.is(".ui-state-disabled") &&
              this.expand(t);
            break;
          case k.ui.keyCode.ENTER:
          case k.ui.keyCode.SPACE:
            this._activate(t);
            break;
          case k.ui.keyCode.ESCAPE:
            this.collapse(t);
            break;
          default:
            (n = !1),
              (e = this.previousFilter || ""),
              (s = !1),
              (i =
                96 <= t.keyCode && t.keyCode <= 105
                  ? (t.keyCode - 96).toString()
                  : String.fromCharCode(t.keyCode)),
              clearTimeout(this.filterTimer),
              i === e ? (s = !0) : (i = e + i),
              (e = this._filterMenuItems(i)),
              (e =
                s && -1 !== e.index(this.active.next())
                  ? this.active.nextAll(".ui-menu-item")
                  : e).length ||
                ((i = String.fromCharCode(t.keyCode)),
                (e = this._filterMenuItems(i))),
              e.length
                ? (this.focus(t, e),
                  (this.previousFilter = i),
                  (this.filterTimer = this._delay(function () {
                    delete this.previousFilter;
                  }, 1e3)))
                : delete this.previousFilter;
        }
        n && t.preventDefault();
      },
      _activate: function (t) {
        this.active &&
          !this.active.is(".ui-state-disabled") &&
          (this.active.children("[aria-haspopup='true']").length
            ? this.expand(t)
            : this.select(t));
      },
      refresh: function () {
        var t,
          e,
          s = this,
          n = this.options.icons.submenu,
          i = this.element.find(this.options.menus);
        this._toggleClass(
          "ui-menu-icons",
          null,
          !!this.element.find(".ui-icon").length
        ),
          (e = i
            .filter(":not(.ui-menu)")
            .hide()
            .attr({
              role: this.options.role,
              "aria-hidden": "true",
              "aria-expanded": "false",
            })
            .each(function () {
              var t = k(this),
                e = t.prev(),
                i = k("<span>").data("ui-menu-submenu-caret", !0);
              s._addClass(i, "ui-menu-icon", "ui-icon " + n),
                e.attr("aria-haspopup", "true").prepend(i),
                t.attr("aria-labelledby", e.attr("id"));
            })),
          this._addClass(e, "ui-menu", "ui-widget ui-widget-content ui-front"),
          (t = i.add(this.element).find(this.options.items))
            .not(".ui-menu-item")
            .each(function () {
              var t = k(this);
              s._isDivider(t) &&
                s._addClass(t, "ui-menu-divider", "ui-widget-content");
            }),
          (i = (e = t.not(".ui-menu-item, .ui-menu-divider"))
            .children()
            .not(".ui-menu")
            .uniqueId()
            .attr({ tabIndex: -1, role: this._itemRole() })),
          this._addClass(e, "ui-menu-item")._addClass(
            i,
            "ui-menu-item-wrapper"
          ),
          t.filter(".ui-state-disabled").attr("aria-disabled", "true"),
          this.active &&
            !k.contains(this.element[0], this.active[0]) &&
            this.blur();
      },
      _itemRole: function () {
        return { menu: "menuitem", listbox: "option" }[this.options.role];
      },
      _setOption: function (t, e) {
        var i;
        "icons" === t &&
          ((i = this.element.find(".ui-menu-icon")),
          this._removeClass(i, null, this.options.icons.submenu)._addClass(
            i,
            null,
            e.submenu
          )),
          this._super(t, e);
      },
      _setOptionDisabled: function (t) {
        this._super(t),
          this.element.attr("aria-disabled", String(t)),
          this._toggleClass(null, "ui-state-disabled", !!t);
      },
      focus: function (t, e) {
        var i;
        this.blur(t, t && "focus" === t.type),
          this._scrollIntoView(e),
          (this.active = e.first()),
          (i = this.active.children(".ui-menu-item-wrapper")),
          this._addClass(i, null, "ui-state-active"),
          this.options.role &&
            this.element.attr("aria-activedescendant", i.attr("id")),
          (i = this.active
            .parent()
            .closest(".ui-menu-item")
            .children(".ui-menu-item-wrapper")),
          this._addClass(i, null, "ui-state-active"),
          t && "keydown" === t.type
            ? this._close()
            : (this.timer = this._delay(function () {
                this._close();
              }, this.delay)),
          (i = e.children(".ui-menu")).length &&
            t &&
            /^mouse/.test(t.type) &&
            this._startOpening(i),
          (this.activeMenu = e.parent()),
          this._trigger("focus", t, { item: e });
      },
      _scrollIntoView: function (t) {
        var e, i, s;
        this._hasScroll() &&
          ((i = parseFloat(k.css(this.activeMenu[0], "borderTopWidth")) || 0),
          (s = parseFloat(k.css(this.activeMenu[0], "paddingTop")) || 0),
          (e = t.offset().top - this.activeMenu.offset().top - i - s),
          (i = this.activeMenu.scrollTop()),
          (s = this.activeMenu.height()),
          (t = t.outerHeight()),
          e < 0
            ? this.activeMenu.scrollTop(i + e)
            : s < e + t && this.activeMenu.scrollTop(i + e - s + t));
      },
      blur: function (t, e) {
        e || clearTimeout(this.timer),
          this.active &&
            (this._removeClass(
              this.active.children(".ui-menu-item-wrapper"),
              null,
              "ui-state-active"
            ),
            this._trigger("blur", t, { item: this.active }),
            (this.active = null));
      },
      _startOpening: function (t) {
        clearTimeout(this.timer),
          "true" === t.attr("aria-hidden") &&
            (this.timer = this._delay(function () {
              this._close(), this._open(t);
            }, this.delay));
      },
      _open: function (t) {
        var e = k.extend({ of: this.active }, this.options.position);
        clearTimeout(this.timer),
          this.element
            .find(".ui-menu")
            .not(t.parents(".ui-menu"))
            .hide()
            .attr("aria-hidden", "true"),
          t
            .show()
            .removeAttr("aria-hidden")
            .attr("aria-expanded", "true")
            .position(e);
      },
      collapseAll: function (e, i) {
        clearTimeout(this.timer),
          (this.timer = this._delay(function () {
            var t = i
              ? this.element
              : k(e && e.target).closest(this.element.find(".ui-menu"));
            t.length || (t = this.element),
              this._close(t),
              this.blur(e),
              this._removeClass(
                t.find(".ui-state-active"),
                null,
                "ui-state-active"
              ),
              (this.activeMenu = t);
          }, this.delay));
      },
      _close: function (t) {
        (t = t || (this.active ? this.active.parent() : this.element))
          .find(".ui-menu")
          .hide()
          .attr("aria-hidden", "true")
          .attr("aria-expanded", "false");
      },
      _closeOnDocumentClick: function (t) {
        return !k(t.target).closest(".ui-menu").length;
      },
      _isDivider: function (t) {
        return !/[^\-\u2014\u2013\s]/.test(t.text());
      },
      collapse: function (t) {
        var e =
          this.active &&
          this.active.parent().closest(".ui-menu-item", this.element);
        e && e.length && (this._close(), this.focus(t, e));
      },
      expand: function (t) {
        var e =
          this.active &&
          this.active.children(".ui-menu ").find(this.options.items).first();
        e &&
          e.length &&
          (this._open(e.parent()),
          this._delay(function () {
            this.focus(t, e);
          }));
      },
      next: function (t) {
        this._move("next", "first", t);
      },
      previous: function (t) {
        this._move("prev", "last", t);
      },
      isFirstItem: function () {
        return this.active && !this.active.prevAll(".ui-menu-item").length;
      },
      isLastItem: function () {
        return this.active && !this.active.nextAll(".ui-menu-item").length;
      },
      _move: function (t, e, i) {
        var s;
        this.active &&
          (s =
            "first" === t || "last" === t
              ? this.active["first" === t ? "prevAll" : "nextAll"](
                  ".ui-menu-item"
                ).eq(-1)
              : this.active[t + "All"](".ui-menu-item").eq(0)),
          (s && s.length && this.active) ||
            (s = this.activeMenu.find(this.options.items)[e]()),
          this.focus(i, s);
      },
      nextPage: function (t) {
        var e, i, s;
        this.active
          ? this.isLastItem() ||
            (this._hasScroll()
              ? ((i = this.active.offset().top),
                (s = this.element.height()),
                this.active.nextAll(".ui-menu-item").each(function () {
                  return (e = k(this)).offset().top - i - s < 0;
                }),
                this.focus(t, e))
              : this.focus(
                  t,
                  this.activeMenu
                    .find(this.options.items)
                    [this.active ? "last" : "first"]()
                ))
          : this.next(t);
      },
      previousPage: function (t) {
        var e, i, s;
        this.active
          ? this.isFirstItem() ||
            (this._hasScroll()
              ? ((i = this.active.offset().top),
                (s = this.element.height()),
                this.active.prevAll(".ui-menu-item").each(function () {
                  return 0 < (e = k(this)).offset().top - i + s;
                }),
                this.focus(t, e))
              : this.focus(t, this.activeMenu.find(this.options.items).first()))
          : this.next(t);
      },
      _hasScroll: function () {
        return this.element.outerHeight() < this.element.prop("scrollHeight");
      },
      select: function (t) {
        this.active = this.active || k(t.target).closest(".ui-menu-item");
        var e = { item: this.active };
        this.active.has(".ui-menu").length || this.collapseAll(t, !0),
          this._trigger("select", t, e);
      },
      _filterMenuItems: function (t) {
        var t = t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"),
          e = new RegExp("^" + t, "i");
        return this.activeMenu
          .find(this.options.items)
          .filter(".ui-menu-item")
          .filter(function () {
            return e.test(
              k.trim(k(this).children(".ui-menu-item-wrapper").text())
            );
          });
      },
    });
  k.widget("ui.autocomplete", {
    version: "1.12.1",
    defaultElement: "<input>",
    options: {
      appendTo: null,
      autoFocus: !1,
      delay: 300,
      minLength: 1,
      position: { my: "left top", at: "left bottom", collision: "none" },
      source: null,
      change: null,
      close: null,
      focus: null,
      open: null,
      response: null,
      search: null,
      select: null,
    },
    requestIndex: 0,
    pending: 0,
    _create: function () {
      var i,
        s,
        n,
        t = this.element[0].nodeName.toLowerCase(),
        e = "textarea" === t,
        t = "input" === t;
      (this.isMultiLine = e || (!t && this._isContentEditable(this.element))),
        (this.valueMethod = this.element[e || t ? "val" : "text"]),
        (this.isNewMenu = !0),
        this._addClass("ui-autocomplete-input"),
        this.element.attr("autocomplete", "off"),
        this._on(this.element, {
          keydown: function (t) {
            if (this.element.prop("readOnly")) s = n = i = !0;
            else {
              s = n = i = !1;
              var e = k.ui.keyCode;
              switch (t.keyCode) {
                case e.PAGE_UP:
                  (i = !0), this._move("previousPage", t);
                  break;
                case e.PAGE_DOWN:
                  (i = !0), this._move("nextPage", t);
                  break;
                case e.UP:
                  (i = !0), this._keyEvent("previous", t);
                  break;
                case e.DOWN:
                  (i = !0), this._keyEvent("next", t);
                  break;
                case e.ENTER:
                  this.menu.active &&
                    ((i = !0), t.preventDefault(), this.menu.select(t));
                  break;
                case e.TAB:
                  this.menu.active && this.menu.select(t);
                  break;
                case e.ESCAPE:
                  this.menu.element.is(":visible") &&
                    (this.isMultiLine || this._value(this.term),
                    this.close(t),
                    t.preventDefault());
                  break;
                default:
                  (s = !0), this._searchTimeout(t);
              }
            }
          },
          keypress: function (t) {
            if (i)
              return (
                (i = !1),
                void (
                  (this.isMultiLine && !this.menu.element.is(":visible")) ||
                  t.preventDefault()
                )
              );
            if (!s) {
              var e = k.ui.keyCode;
              switch (t.keyCode) {
                case e.PAGE_UP:
                  this._move("previousPage", t);
                  break;
                case e.PAGE_DOWN:
                  this._move("nextPage", t);
                  break;
                case e.UP:
                  this._keyEvent("previous", t);
                  break;
                case e.DOWN:
                  this._keyEvent("next", t);
              }
            }
          },
          input: function (t) {
            if (n) return (n = !1), void t.preventDefault();
            this._searchTimeout(t);
          },
          focus: function () {
            (this.selectedItem = null), (this.previous = this._value());
          },
          blur: function (t) {
            this.cancelBlur
              ? delete this.cancelBlur
              : (clearTimeout(this.searching), this.close(t), this._change(t));
          },
        }),
        this._initSource(),
        (this.menu = k("<ul>")
          .appendTo(this._appendTo())
          .menu({ role: null })
          .hide()
          .menu("instance")),
        this._addClass(this.menu.element, "ui-autocomplete", "ui-front"),
        this._on(this.menu.element, {
          mousedown: function (t) {
            t.preventDefault(),
              (this.cancelBlur = !0),
              this._delay(function () {
                delete this.cancelBlur,
                  this.element[0] !==
                    k.ui.safeActiveElement(this.document[0]) &&
                    this.element.trigger("focus");
              });
          },
          menufocus: function (t, e) {
            var i;
            if (
              this.isNewMenu &&
              ((this.isNewMenu = !1),
              t.originalEvent && /^mouse/.test(t.originalEvent.type))
            )
              return (
                this.menu.blur(),
                void this.document.one("mousemove", function () {
                  k(t.target).trigger(t.originalEvent);
                })
              );
            (i = e.item.data("ui-autocomplete-item")),
              !1 !== this._trigger("focus", t, { item: i }) &&
                t.originalEvent &&
                /^key/.test(t.originalEvent.type) &&
                this._value(i.value),
              (i = e.item.attr("aria-label") || i.value) &&
                k.trim(i).length &&
                (this.liveRegion.children().hide(),
                k("<div>").text(i).appendTo(this.liveRegion));
          },
          menuselect: function (t, e) {
            var i = e.item.data("ui-autocomplete-item"),
              s = this.previous;
            this.element[0] !== k.ui.safeActiveElement(this.document[0]) &&
              (this.element.trigger("focus"),
              (this.previous = s),
              this._delay(function () {
                (this.previous = s), (this.selectedItem = i);
              })),
              !1 !== this._trigger("select", t, { item: i }) &&
                this._value(i.value),
              (this.term = this._value()),
              this.close(t),
              (this.selectedItem = i);
          },
        }),
        (this.liveRegion = k("<div>", {
          role: "status",
          "aria-live": "assertive",
          "aria-relevant": "additions",
        }).appendTo(this.document[0].body)),
        this._addClass(this.liveRegion, null, "ui-helper-hidden-accessible"),
        this._on(this.window, {
          beforeunload: function () {
            this.element.removeAttr("autocomplete");
          },
        });
    },
    _destroy: function () {
      clearTimeout(this.searching),
        this.element.removeAttr("autocomplete"),
        this.menu.element.remove(),
        this.liveRegion.remove();
    },
    _setOption: function (t, e) {
      this._super(t, e),
        "source" === t && this._initSource(),
        "appendTo" === t && this.menu.element.appendTo(this._appendTo()),
        "disabled" === t && e && this.xhr && this.xhr.abort();
    },
    _isEventTargetInWidget: function (t) {
      var e = this.menu.element[0];
      return (
        t.target === this.element[0] ||
        t.target === e ||
        k.contains(e, t.target)
      );
    },
    _closeOnClickOutside: function (t) {
      this._isEventTargetInWidget(t) || this.close();
    },
    _appendTo: function () {
      var t = this.options.appendTo;
      return (
        ((t =
          t && (t.jquery || t.nodeType ? k(t) : this.document.find(t).eq(0))) &&
          t[0]) ||
          (t = this.element.closest(".ui-front, dialog")),
        t.length || (t = this.document[0].body),
        t
      );
    },
    _initSource: function () {
      var i,
        s,
        n = this;
      k.isArray(this.options.source)
        ? ((i = this.options.source),
          (this.source = function (t, e) {
            e(k.ui.autocomplete.filter(i, t.term));
          }))
        : "string" == typeof this.options.source
        ? ((s = this.options.source),
          (this.source = function (t, e) {
            n.xhr && n.xhr.abort(),
              (n.xhr = k.ajax({
                url: s,
                data: t,
                dataType: "json",
                success: function (t) {
                  e(t);
                },
                error: function () {
                  e([]);
                },
              }));
          }))
        : (this.source = this.options.source);
    },
    _searchTimeout: function (s) {
      clearTimeout(this.searching),
        (this.searching = this._delay(function () {
          var t = this.term === this._value(),
            e = this.menu.element.is(":visible"),
            i = s.altKey || s.ctrlKey || s.metaKey || s.shiftKey;
          (t && (!t || e || i)) ||
            ((this.selectedItem = null), this.search(null, s));
        }, this.options.delay));
    },
    search: function (t, e) {
      return (
        (t = null != t ? t : this._value()),
        (this.term = this._value()),
        t.length < this.options.minLength
          ? this.close(e)
          : !1 !== this._trigger("search", e)
          ? this._search(t)
          : void 0
      );
    },
    _search: function (t) {
      this.pending++,
        this._addClass("ui-autocomplete-loading"),
        (this.cancelSearch = !1),
        this.source({ term: t }, this._response());
    },
    _response: function () {
      var e = ++this.requestIndex;
      return k.proxy(function (t) {
        e === this.requestIndex && this.__response(t),
          this.pending--,
          this.pending || this._removeClass("ui-autocomplete-loading");
      }, this);
    },
    __response: function (t) {
      (t = t && this._normalize(t)),
        this._trigger("response", null, { content: t }),
        !this.options.disabled && t && t.length && !this.cancelSearch
          ? (this._suggest(t), this._trigger("open"))
          : this._close();
    },
    close: function (t) {
      (this.cancelSearch = !0), this._close(t);
    },
    _close: function (t) {
      this._off(this.document, "mousedown"),
        this.menu.element.is(":visible") &&
          (this.menu.element.hide(),
          this.menu.blur(),
          (this.isNewMenu = !0),
          this._trigger("close", t));
    },
    _change: function (t) {
      this.previous !== this._value() &&
        this._trigger("change", t, { item: this.selectedItem });
    },
    _normalize: function (t) {
      return t.length && t[0].label && t[0].value
        ? t
        : k.map(t, function (t) {
            return "string" == typeof t
              ? { label: t, value: t }
              : k.extend({}, t, {
                  label: t.label || t.value,
                  value: t.value || t.label,
                });
          });
    },
    _suggest: function (t) {
      var e = this.menu.element.empty();
      this._renderMenu(e, t),
        (this.isNewMenu = !0),
        this.menu.refresh(),
        e.show(),
        this._resizeMenu(),
        e.position(k.extend({ of: this.element }, this.options.position)),
        this.options.autoFocus && this.menu.next(),
        this._on(this.document, { mousedown: "_closeOnClickOutside" });
    },
    _resizeMenu: function () {
      var t = this.menu.element;
      t.outerWidth(
        Math.max(t.width("").outerWidth() + 1, this.element.outerWidth())
      );
    },
    _renderMenu: function (i, t) {
      var s = this;
      k.each(t, function (t, e) {
        s._renderItemData(i, e);
      });
    },
    _renderItemData: function (t, e) {
      return this._renderItem(t, e).data("ui-autocomplete-item", e);
    },
    _renderItem: function (t, e) {
      return k("<li>").append(k("<div>").text(e.label)).appendTo(t);
    },
    _move: function (t, e) {
      if (this.menu.element.is(":visible"))
        return (this.menu.isFirstItem() && /^previous/.test(t)) ||
          (this.menu.isLastItem() && /^next/.test(t))
          ? (this.isMultiLine || this._value(this.term), void this.menu.blur())
          : void this.menu[t](e);
      this.search(null, e);
    },
    widget: function () {
      return this.menu.element;
    },
    _value: function () {
      return this.valueMethod.apply(this.element, arguments);
    },
    _keyEvent: function (t, e) {
      (this.isMultiLine && !this.menu.element.is(":visible")) ||
        (this._move(t, e), e.preventDefault());
    },
    _isContentEditable: function (t) {
      if (!t.length) return !1;
      var e = t.prop("contentEditable");
      return "inherit" === e
        ? this._isContentEditable(t.parent())
        : "true" === e;
    },
  }),
    k.extend(k.ui.autocomplete, {
      escapeRegex: function (t) {
        return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
      },
      filter: function (t, e) {
        var i = new RegExp(k.ui.autocomplete.escapeRegex(e), "i");
        return k.grep(t, function (t) {
          return i.test(t.label || t.value || t);
        });
      },
    }),
    k.widget("ui.autocomplete", k.ui.autocomplete, {
      options: {
        messages: {
          noResults: "No search results.",
          results: function (t) {
            return (
              t +
              (1 < t ? " results are" : " result is") +
              " available, use up and down arrow keys to navigate."
            );
          },
        },
      },
      __response: function (t) {
        var e;
        this._superApply(arguments),
          this.options.disabled ||
            this.cancelSearch ||
            ((e =
              t && t.length
                ? this.options.messages.results(t.length)
                : this.options.messages.noResults),
            this.liveRegion.children().hide(),
            k("<div>").text(e).appendTo(this.liveRegion));
      },
    });
  k.ui.autocomplete;
  var g = /ui-corner-([a-z]){2,6}/g;
  k.widget("ui.controlgroup", {
    version: "1.12.1",
    defaultElement: "<div>",
    options: {
      direction: "horizontal",
      disabled: null,
      onlyVisible: !0,
      items: {
        button:
          "input[type=button], input[type=submit1], input[type=reset], button, a",
        controlgroupLabel: ".ui-controlgroup-label",
        checkboxradio: "input[type='checkbox'], input[type='radio']",
        selectmenu: "select",
        spinner: ".ui-spinner-input",
      },
    },
    _create: function () {
      this._enhance();
    },
    _enhance: function () {
      this.element.attr("role", "toolbar"), this.refresh();
    },
    _destroy: function () {
      this._callChildMethod("destroy"),
        this.childWidgets.removeData("ui-controlgroup-data"),
        this.element.removeAttr("role"),
        this.options.items.controlgroupLabel &&
          this.element
            .find(this.options.items.controlgroupLabel)
            .find(".ui-controlgroup-label-contents")
            .contents()
            .unwrap();
    },
    _initWidgets: function () {
      var o = this,
        a = [];
      k.each(this.options.items, function (s, t) {
        var e,
          n = {};
        if (t)
          return "controlgroupLabel" === s
            ? ((e = o.element.find(t)).each(function () {
                var t = k(this);
                t.children(".ui-controlgroup-label-contents").length ||
                  t
                    .contents()
                    .wrapAll(
                      "<span class='ui-controlgroup-label-contents'></span>"
                    );
              }),
              o._addClass(
                e,
                null,
                "ui-widget ui-widget-content ui-state-default"
              ),
              void (a = a.concat(e.get())))
            : void (
                k.fn[s] &&
                ((n = o["_" + s + "Options"]
                  ? o["_" + s + "Options"]("middle")
                  : { classes: {} }),
                o.element.find(t).each(function () {
                  var t = k(this),
                    e = t[s]("instance"),
                    i = k.widget.extend({}, n);
                  ("button" === s && t.parent(".ui-spinner").length) ||
                    ((e = e || t[s]()[s]("instance")) &&
                      (i.classes = o._resolveClassesValues(i.classes, e)),
                    t[s](i),
                    (i = t[s]("widget")),
                    k.data(i[0], "ui-controlgroup-data", e || t[s]("instance")),
                    a.push(i[0]));
                }))
              );
      }),
        (this.childWidgets = k(k.unique(a))),
        this._addClass(this.childWidgets, "ui-controlgroup-item");
    },
    _callChildMethod: function (e) {
      this.childWidgets.each(function () {
        var t = k(this).data("ui-controlgroup-data");
        t && t[e] && t[e]();
      });
    },
    _updateCornerClass: function (t, e) {
      e = this._buildSimpleOptions(e, "label").classes.label;
      this._removeClass(
        t,
        null,
        "ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all"
      ),
        this._addClass(t, null, e);
    },
    _buildSimpleOptions: function (t, e) {
      var i = "vertical" === this.options.direction,
        s = { classes: {} };
      return (
        (s.classes[e] = {
          middle: "",
          first: "ui-corner-" + (i ? "top" : "left"),
          last: "ui-corner-" + (i ? "bottom" : "right"),
          only: "ui-corner-all",
        }[t]),
        s
      );
    },
    _spinnerOptions: function (t) {
      t = this._buildSimpleOptions(t, "ui-spinner");
      return (
        (t.classes["ui-spinner-up"] = ""),
        (t.classes["ui-spinner-down"] = ""),
        t
      );
    },
    _buttonOptions: function (t) {
      return this._buildSimpleOptions(t, "ui-button");
    },
    _checkboxradioOptions: function (t) {
      return this._buildSimpleOptions(t, "ui-checkboxradio-label");
    },
    _selectmenuOptions: function (t) {
      var e = "vertical" === this.options.direction;
      return {
        width: e && "auto",
        classes: {
          middle: {
            "ui-selectmenu-button-open": "",
            "ui-selectmenu-button-closed": "",
          },
          first: {
            "ui-selectmenu-button-open": "ui-corner-" + (e ? "top" : "tl"),
            "ui-selectmenu-button-closed": "ui-corner-" + (e ? "top" : "left"),
          },
          last: {
            "ui-selectmenu-button-open": e ? "" : "ui-corner-tr",
            "ui-selectmenu-button-closed":
              "ui-corner-" + (e ? "bottom" : "right"),
          },
          only: {
            "ui-selectmenu-button-open": "ui-corner-top",
            "ui-selectmenu-button-closed": "ui-corner-all",
          },
        }[t],
      };
    },
    _resolveClassesValues: function (i, s) {
      var n = {};
      return (
        k.each(i, function (t) {
          var e = s.options.classes[t] || "",
            e = k.trim(e.replace(g, ""));
          n[t] = (e + " " + i[t]).replace(/\s+/g, " ");
        }),
        n
      );
    },
    _setOption: function (t, e) {
      "direction" === t &&
        this._removeClass("ui-controlgroup-" + this.options.direction),
        this._super(t, e),
        "disabled" !== t
          ? this.refresh()
          : this._callChildMethod(e ? "disable" : "enable");
    },
    refresh: function () {
      var n,
        o = this;
      this._addClass(
        "ui-controlgroup ui-controlgroup-" + this.options.direction
      ),
        "horizontal" === this.options.direction &&
          this._addClass(null, "ui-helper-clearfix"),
        this._initWidgets(),
        (n = this.childWidgets),
        this.options.onlyVisible && (n = n.filter(":visible")),
        n.length &&
          (k.each(["first", "last"], function (t, e) {
            var i,
              s = n[e]().data("ui-controlgroup-data");
            s && o["_" + s.widgetName + "Options"]
              ? (((i = o["_" + s.widgetName + "Options"](
                  1 === n.length ? "only" : e
                )).classes = o._resolveClassesValues(i.classes, s)),
                s.element[s.widgetName](i))
              : o._updateCornerClass(n[e](), e);
          }),
          this._callChildMethod("refresh"));
    },
  });
  k.widget("ui.checkboxradio", [
    k.ui.formResetMixin,
    {
      version: "1.12.1",
      options: {
        disabled: null,
        label: null,
        icon: !0,
        classes: {
          "ui-checkboxradio-label": "ui-corner-all",
          "ui-checkboxradio-icon": "ui-corner-all",
        },
      },
      _getCreateOptions: function () {
        var t,
          e = this,
          i = this._super() || {};
        return (
          this._readType(),
          (t = this.element.labels()),
          (this.label = k(t[t.length - 1])),
          this.label.length ||
            k.error("No label found for checkboxradio widget"),
          (this.originalLabel = ""),
          this.label
            .contents()
            .not(this.element[0])
            .each(function () {
              e.originalLabel +=
                3 === this.nodeType ? k(this).text() : this.outerHTML;
            }),
          this.originalLabel && (i.label = this.originalLabel),
          null != (t = this.element[0].disabled) && (i.disabled = t),
          i
        );
      },
      _create: function () {
        var t = this.element[0].checked;
        this._bindFormResetHandler(),
          null == this.options.disabled &&
            (this.options.disabled = this.element[0].disabled),
          this._setOption("disabled", this.options.disabled),
          this._addClass("ui-checkboxradio", "ui-helper-hidden-accessible"),
          this._addClass(
            this.label,
            "ui-checkboxradio-label",
            "ui-button ui-widget"
          ),
          "radio" === this.type &&
            this._addClass(this.label, "ui-checkboxradio-radio-label"),
          this.options.label && this.options.label !== this.originalLabel
            ? this._updateLabel()
            : this.originalLabel && (this.options.label = this.originalLabel),
          this._enhance(),
          t &&
            (this._addClass(
              this.label,
              "ui-checkboxradio-checked",
              "ui-state-active"
            ),
            this.icon && this._addClass(this.icon, null, "ui-state-hover")),
          this._on({
            change: "_toggleClasses",
            focus: function () {
              this._addClass(
                this.label,
                null,
                "ui-state-focus ui-visual-focus"
              );
            },
            blur: function () {
              this._removeClass(
                this.label,
                null,
                "ui-state-focus ui-visual-focus"
              );
            },
          });
      },
      _readType: function () {
        var t = this.element[0].nodeName.toLowerCase();
        (this.type = this.element[0].type),
          ("input" === t && /radio|checkbox/.test(this.type)) ||
            k.error(
              "Can't create checkboxradio on element.nodeName=" +
                t +
                " and element.type=" +
                this.type
            );
      },
      _enhance: function () {
        this._updateIcon(this.element[0].checked);
      },
      widget: function () {
        return this.label;
      },
      _getRadioGroup: function () {
        var t = this.element[0].name,
          e = "input[name='" + k.ui.escapeSelector(t) + "']";
        return t
          ? (this.form.length
              ? k(this.form[0].elements).filter(e)
              : k(e).filter(function () {
                  return 0 === k(this).form().length;
                })
            ).not(this.element)
          : k([]);
      },
      _toggleClasses: function () {
        var t = this.element[0].checked;
        this._toggleClass(
          this.label,
          "ui-checkboxradio-checked",
          "ui-state-active",
          t
        ),
          this.options.icon &&
            "checkbox" === this.type &&
            this._toggleClass(
              this.icon,
              null,
              "ui-icon-check ui-state-checked",
              t
            )._toggleClass(this.icon, null, "ui-icon-blank", !t),
          "radio" === this.type &&
            this._getRadioGroup().each(function () {
              var t = k(this).checkboxradio("instance");
              t &&
                t._removeClass(
                  t.label,
                  "ui-checkboxradio-checked",
                  "ui-state-active"
                );
            });
      },
      _destroy: function () {
        this._unbindFormResetHandler(),
          this.icon && (this.icon.remove(), this.iconSpace.remove());
      },
      _setOption: function (t, e) {
        if ("label" !== t || e) {
          if ((this._super(t, e), "disabled" === t))
            return (
              this._toggleClass(this.label, null, "ui-state-disabled", e),
              void (this.element[0].disabled = e)
            );
          this.refresh();
        }
      },
      _updateIcon: function (t) {
        var e = "ui-icon ui-icon-background ";
        this.options.icon
          ? (this.icon ||
              ((this.icon = k("<span>")),
              (this.iconSpace = k("<span> </span>")),
              this._addClass(this.iconSpace, "ui-checkboxradio-icon-space")),
            "checkbox" === this.type
              ? ((e += t ? "ui-icon-check ui-state-checked" : "ui-icon-blank"),
                this._removeClass(
                  this.icon,
                  null,
                  t ? "ui-icon-blank" : "ui-icon-check"
                ))
              : (e += "ui-icon-blank"),
            this._addClass(this.icon, "ui-checkboxradio-icon", e),
            t ||
              this._removeClass(
                this.icon,
                null,
                "ui-icon-check ui-state-checked"
              ),
            this.icon.prependTo(this.label).after(this.iconSpace))
          : void 0 !== this.icon &&
            (this.icon.remove(), this.iconSpace.remove(), delete this.icon);
      },
      _updateLabel: function () {
        var t = this.label.contents().not(this.element[0]);
        this.icon && (t = t.not(this.icon[0])),
          this.iconSpace && (t = t.not(this.iconSpace[0])),
          t.remove(),
          this.label.append(this.options.label);
      },
      refresh: function () {
        var t = this.element[0].checked,
          e = this.element[0].disabled;
        this._updateIcon(t),
          this._toggleClass(
            this.label,
            "ui-checkboxradio-checked",
            "ui-state-active",
            t
          ),
          null !== this.options.label && this._updateLabel(),
          e !== this.options.disabled && this._setOptions({ disabled: e });
      },
    },
  ]);
  var m;
  k.ui.checkboxradio;
  k.widget("ui.button", {
    version: "1.12.1",
    defaultElement: "<button>",
    options: {
      classes: { "ui-button": "ui-corner-all" },
      disabled: null,
      icon: null,
      iconPosition: "beginning",
      label: null,
      showLabel: !0,
    },
    _getCreateOptions: function () {
      var t,
        e = this._super() || {};
      return (
        (this.isInput = this.element.is("input")),
        null != (t = this.element[0].disabled) && (e.disabled = t),
        (this.originalLabel = this.isInput
          ? this.element.val()
          : this.element.html()),
        this.originalLabel && (e.label = this.originalLabel),
        e
      );
    },
    _create: function () {
      !this.option.showLabel & !this.options.icon &&
        (this.options.showLabel = !0),
        null == this.options.disabled &&
          (this.options.disabled = this.element[0].disabled || !1),
        (this.hasTitle = !!this.element.attr("title")),
        this.options.label &&
          this.options.label !== this.originalLabel &&
          (this.isInput
            ? this.element.val(this.options.label)
            : this.element.html(this.options.label)),
        this._addClass("ui-button", "ui-widget"),
        this._setOption("disabled", this.options.disabled),
        this._enhance(),
        this.element.is("a") &&
          this._on({
            keyup: function (t) {
              t.keyCode === k.ui.keyCode.SPACE &&
                (t.preventDefault(),
                this.element[0].click
                  ? this.element[0].click()
                  : this.element.trigger("click"));
            },
          });
    },
    _enhance: function () {
      this.element.is("button") || this.element.attr("role", "button"),
        this.options.icon &&
          (this._updateIcon("icon", this.options.icon), this._updateTooltip());
    },
    _updateTooltip: function () {
      (this.title = this.element.attr("title")),
        this.options.showLabel ||
          this.title ||
          this.element.attr("title", this.options.label);
    },
    _updateIcon: function (t, e) {
      var i = "iconPosition" !== t,
        s = i ? this.options.iconPosition : e,
        t = "top" === s || "bottom" === s;
      this.icon
        ? i && this._removeClass(this.icon, null, this.options.icon)
        : ((this.icon = k("<span>")),
          this._addClass(this.icon, "ui-button-icon", "ui-icon"),
          this.options.showLabel || this._addClass("ui-button-icon-only")),
        i && this._addClass(this.icon, null, e),
        this._attachIcon(s),
        t
          ? (this._addClass(this.icon, null, "ui-widget-icon-block"),
            this.iconSpace && this.iconSpace.remove())
          : (this.iconSpace ||
              ((this.iconSpace = k("<span> </span>")),
              this._addClass(this.iconSpace, "ui-button-icon-space")),
            this._removeClass(this.icon, null, "ui-wiget-icon-block"),
            this._attachIconSpace(s));
    },
    _destroy: function () {
      this.element.removeAttr("role"),
        this.icon && this.icon.remove(),
        this.iconSpace && this.iconSpace.remove(),
        this.hasTitle || this.element.removeAttr("title");
    },
    _attachIconSpace: function (t) {
      this.icon[/^(?:end|bottom)/.test(t) ? "before" : "after"](this.iconSpace);
    },
    _attachIcon: function (t) {
      this.element[/^(?:end|bottom)/.test(t) ? "append" : "prepend"](this.icon);
    },
    _setOptions: function (t) {
      var e = (void 0 === t.showLabel ? this.options : t).showLabel,
        i = (void 0 === t.icon ? this.options : t).icon;
      e || i || (t.showLabel = !0), this._super(t);
    },
    _setOption: function (t, e) {
      "icon" === t &&
        (e
          ? this._updateIcon(t, e)
          : this.icon &&
            (this.icon.remove(), this.iconSpace && this.iconSpace.remove())),
        "iconPosition" === t && this._updateIcon(t, e),
        "showLabel" === t &&
          (this._toggleClass("ui-button-icon-only", null, !e),
          this._updateTooltip()),
        "label" === t &&
          (this.isInput
            ? this.element.val(e)
            : (this.element.html(e),
              this.icon &&
                (this._attachIcon(this.options.iconPosition),
                this._attachIconSpace(this.options.iconPosition)))),
        this._super(t, e),
        "disabled" === t &&
          (this._toggleClass(null, "ui-state-disabled", e),
          (this.element[0].disabled = e) && this.element.blur());
    },
    refresh: function () {
      var t = this.element.is("input, button")
        ? this.element[0].disabled
        : this.element.hasClass("ui-button-disabled");
      t !== this.options.disabled && this._setOptions({ disabled: t }),
        this._updateTooltip();
    },
  }),
    !1 !== k.uiBackCompat &&
      (k.widget("ui.button", k.ui.button, {
        options: { text: !0, icons: { primary: null, secondary: null } },
        _create: function () {
          this.options.showLabel &&
            !this.options.text &&
            (this.options.showLabel = this.options.text),
            !this.options.showLabel &&
              this.options.text &&
              (this.options.text = this.options.showLabel),
            this.options.icon ||
            (!this.options.icons.primary && !this.options.icons.secondary)
              ? this.options.icon &&
                (this.options.icons.primary = this.options.icon)
              : this.options.icons.primary
              ? (this.options.icon = this.options.icons.primary)
              : ((this.options.icon = this.options.icons.secondary),
                (this.options.iconPosition = "end")),
            this._super();
        },
        _setOption: function (t, e) {
          "text" !== t
            ? ("showLabel" === t && (this.options.text = e),
              "icon" === t && (this.options.icons.primary = e),
              "icons" === t &&
                (e.primary
                  ? (this._super("icon", e.primary),
                    this._super("iconPosition", "beginning"))
                  : e.secondary &&
                    (this._super("icon", e.secondary),
                    this._super("iconPosition", "end"))),
              this._superApply(arguments))
            : this._super("showLabel", e);
        },
      }),
      (k.fn.button =
        ((m = k.fn.button),
        function () {
          return !this.length ||
            (this.length && "INPUT" !== this[0].tagName) ||
            (this.length &&
              "INPUT" === this[0].tagName &&
              "checkbox" !== this.attr("type") &&
              "radio" !== this.attr("type"))
            ? m.apply(this, arguments)
            : (k.ui.checkboxradio || k.error("Checkboxradio widget missing"),
              0 === arguments.length
                ? this.checkboxradio({ icon: !1 })
                : this.checkboxradio.apply(this, arguments));
        })),
      (k.fn.buttonset = function () {
        return (
          k.ui.controlgroup || k.error("Controlgroup widget missing"),
          "option" === arguments[0] && "items" === arguments[1] && arguments[2]
            ? this.controlgroup.apply(this, [
                arguments[0],
                "items.button",
                arguments[2],
              ])
            : "option" === arguments[0] && "items" === arguments[1]
            ? this.controlgroup.apply(this, [arguments[0], "items.button"])
            : ("object" == typeof arguments[0] &&
                arguments[0].items &&
                (arguments[0].items = { button: arguments[0].items }),
              this.controlgroup.apply(this, arguments))
        );
      }));
  var _;
  k.ui.button;
  function v() {
    (this._curInst = null),
      (this._keyEvent = !1),
      (this._disabledInputs = []),
      (this._datepickerShowing = !1),
      (this._inDialog = !1),
      (this._mainDivId = "ui-datepicker-div"),
      (this._inlineClass = "ui-datepicker-inline"),
      (this._appendClass = "ui-datepicker-append"),
      (this._triggerClass = "ui-datepicker-trigger"),
      (this._dialogClass = "ui-datepicker-dialog"),
      (this._disableClass = "ui-datepicker-disabled"),
      (this._unselectableClass = "ui-datepicker-unselectable"),
      (this._currentClass = "ui-datepicker-current-day"),
      (this._dayOverClass = "ui-datepicker-days-cell-over"),
      (this.regional = []),
      (this.regional[""] = {
        closeText: "Done",
        prevText: "Prev",
        nextText: "Next",
        currentText: "Today",
        monthNames: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        monthNamesShort: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        dayNames: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        weekHeader: "Wk",
        dateFormat: "mm/dd/yy",
        firstDay: 0,
        isRTL: !1,
        showMonthAfterYear: !1,
        yearSuffix: "",
      }),
      (this._defaults = {
        showOn: "focus",
        showAnim: "fadeIn",
        showOptions: {},
        defaultDate: null,
        appendText: "",
        buttonText: "...",
        buttonImage: "",
        buttonImageOnly: !1,
        hideIfNoPrevNext: !1,
        navigationAsDateFormat: !1,
        gotoCurrent: !1,
        changeMonth: !1,
        changeYear: !1,
        yearRange: "c-10:c+10",
        showOtherMonths: !1,
        selectOtherMonths: !1,
        showWeek: !1,
        calculateWeek: this.iso8601Week,
        shortYearCutoff: "+10",
        minDate: null,
        maxDate: null,
        duration: "fast",
        beforeShowDay: null,
        beforeShow: null,
        onSelect: null,
        onChangeMonthYear: null,
        onClose: null,
        numberOfMonths: 1,
        showCurrentAtPos: 0,
        stepMonths: 1,
        stepBigMonths: 12,
        altField: "",
        altFormat: "",
        constrainInput: !0,
        showButtonPanel: !1,
        autoSize: !1,
        disabled: !1,
      }),
      k.extend(this._defaults, this.regional[""]),
      (this.regional.en = k.extend(!0, {}, this.regional[""])),
      (this.regional["en-US"] = k.extend(!0, {}, this.regional.en)),
      (this.dpDiv = b(
        k(
          "<div id='" +
            this._mainDivId +
            "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"
        )
      ));
  }
  function b(t) {
    var e =
      "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
    return t
      .on("mouseout", e, function () {
        k(this).removeClass("ui-state-hover"),
          -1 !== this.className.indexOf("ui-datepicker-prev") &&
            k(this).removeClass("ui-datepicker-prev-hover"),
          -1 !== this.className.indexOf("ui-datepicker-next") &&
            k(this).removeClass("ui-datepicker-next-hover");
      })
      .on("mouseover", e, y);
  }
  function y() {
    k.datepicker._isDisabledDatepicker(
      (_.inline ? _.dpDiv.parent() : _.input)[0]
    ) ||
      (k(this)
        .parents(".ui-datepicker-calendar")
        .find("a")
        .removeClass("ui-state-hover"),
      k(this).addClass("ui-state-hover"),
      -1 !== this.className.indexOf("ui-datepicker-prev") &&
        k(this).addClass("ui-datepicker-prev-hover"),
      -1 !== this.className.indexOf("ui-datepicker-next") &&
        k(this).addClass("ui-datepicker-next-hover"));
  }
  function w(t, e) {
    for (var i in (k.extend(t, e), e)) null == e[i] && (t[i] = e[i]);
    return t;
  }
  k.extend(k.ui, { datepicker: { version: "1.12.1" } }),
    k.extend(v.prototype, {
      markerClassName: "hasDatepicker",
      maxRows: 4,
      _widgetDatepicker: function () {
        return this.dpDiv;
      },
      setDefaults: function (t) {
        return w(this._defaults, t || {}), this;
      },
      _attachDatepicker: function (t, e) {
        var i,
          s = t.nodeName.toLowerCase(),
          n = "div" === s || "span" === s;
        t.id || ((this.uuid += 1), (t.id = "dp" + this.uuid)),
          ((i = this._newInst(k(t), n)).settings = k.extend({}, e || {})),
          "input" === s
            ? this._connectDatepicker(t, i)
            : n && this._inlineDatepicker(t, i);
      },
      _newInst: function (t, e) {
        return {
          id: t[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"),
          input: t,
          selectedDay: 0,
          selectedMonth: 0,
          selectedYear: 0,
          drawMonth: 0,
          drawYear: 0,
          inline: e,
          dpDiv: e
            ? b(
                k(
                  "<div class='" +
                    this._inlineClass +
                    " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"
                )
              )
            : this.dpDiv,
        };
      },
      _connectDatepicker: function (t, e) {
        var i = k(t);
        (e.append = k([])),
          (e.trigger = k([])),
          i.hasClass(this.markerClassName) ||
            (this._attachments(i, e),
            i
              .addClass(this.markerClassName)
              .on("keydown", this._doKeyDown)
              .on("keypress", this._doKeyPress)
              .on("keyup", this._doKeyUp),
            this._autoSize(e),
            k.data(t, "datepicker", e),
            e.settings.disabled && this._disableDatepicker(t));
      },
      _attachments: function (t, e) {
        var i,
          s = this._get(e, "appendText"),
          n = this._get(e, "isRTL");
        e.append && e.append.remove(),
          s &&
            ((e.append = k(
              "<span class='" + this._appendClass + "'>" + s + "</span>"
            )),
            t[n ? "before" : "after"](e.append)),
          t.off("focus", this._showDatepicker),
          e.trigger && e.trigger.remove(),
          ("focus" !== (i = this._get(e, "showOn")) && "both" !== i) ||
            t.on("focus", this._showDatepicker),
          ("button" !== i && "both" !== i) ||
            ((s = this._get(e, "buttonText")),
            (i = this._get(e, "buttonImage")),
            (e.trigger = k(
              this._get(e, "buttonImageOnly")
                ? k("<img/>")
                    .addClass(this._triggerClass)
                    .attr({ src: i, alt: s, title: s })
                : k("<button type='button'></button>")
                    .addClass(this._triggerClass)
                    .html(
                      i ? k("<img/>").attr({ src: i, alt: s, title: s }) : s
                    )
            )),
            t[n ? "before" : "after"](e.trigger),
            e.trigger.on("click", function () {
              return (
                k.datepicker._datepickerShowing &&
                k.datepicker._lastInput === t[0]
                  ? k.datepicker._hideDatepicker()
                  : (k.datepicker._datepickerShowing &&
                      k.datepicker._lastInput !== t[0] &&
                      k.datepicker._hideDatepicker(),
                    k.datepicker._showDatepicker(t[0])),
                !1
              );
            }));
      },
      _autoSize: function (t) {
        var e, i, s, n, o, a;
        this._get(t, "autoSize") &&
          !t.inline &&
          ((o = new Date(2009, 11, 20)),
          (a = this._get(t, "dateFormat")).match(/[DM]/) &&
            ((e = function (t) {
              for (n = s = i = 0; n < t.length; n++)
                t[n].length > i && ((i = t[n].length), (s = n));
              return s;
            }),
            o.setMonth(
              e(this._get(t, a.match(/MM/) ? "monthNames" : "monthNamesShort"))
            ),
            o.setDate(
              e(this._get(t, a.match(/DD/) ? "dayNames" : "dayNamesShort")) +
                20 -
                o.getDay()
            )),
          t.input.attr("size", this._formatDate(t, o).length));
      },
      _inlineDatepicker: function (t, e) {
        var i = k(t);
        i.hasClass(this.markerClassName) ||
          (i.addClass(this.markerClassName).append(e.dpDiv),
          k.data(t, "datepicker", e),
          this._setDate(e, this._getDefaultDate(e), !0),
          this._updateDatepicker(e),
          this._updateAlternate(e),
          e.settings.disabled && this._disableDatepicker(t),
          e.dpDiv.css("display", "block"));
      },
      _dialogDatepicker: function (t, e, i, s, n) {
        var o,
          a = this._dialogInst;
        return (
          a ||
            ((this.uuid += 1),
            (o = "dp" + this.uuid),
            (this._dialogInput = k(
              "<input type='text' id='" +
                o +
                "' style='position: absolute; top: -100px; width: 0px;'/>"
            )),
            this._dialogInput.on("keydown", this._doKeyDown),
            k("body").append(this._dialogInput),
            ((a = this._dialogInst =
              this._newInst(this._dialogInput, !1)).settings = {}),
            k.data(this._dialogInput[0], "datepicker", a)),
          w(a.settings, s || {}),
          (e = e && e.constructor === Date ? this._formatDate(a, e) : e),
          this._dialogInput.val(e),
          (this._pos = n ? (n.length ? n : [n.pageX, n.pageY]) : null),
          this._pos ||
            ((o = document.documentElement.clientWidth),
            (s = document.documentElement.clientHeight),
            (e =
              document.documentElement.scrollLeft || document.body.scrollLeft),
            (n = document.documentElement.scrollTop || document.body.scrollTop),
            (this._pos = [o / 2 - 100 + e, s / 2 - 150 + n])),
          this._dialogInput
            .css("left", this._pos[0] + 20 + "px")
            .css("top", this._pos[1] + "px"),
          (a.settings.onSelect = i),
          (this._inDialog = !0),
          this.dpDiv.addClass(this._dialogClass),
          this._showDatepicker(this._dialogInput[0]),
          k.blockUI && k.blockUI(this.dpDiv),
          k.data(this._dialogInput[0], "datepicker", a),
          this
        );
      },
      _destroyDatepicker: function (t) {
        var e,
          i = k(t),
          s = k.data(t, "datepicker");
        i.hasClass(this.markerClassName) &&
          ((e = t.nodeName.toLowerCase()),
          k.removeData(t, "datepicker"),
          "input" === e
            ? (s.append.remove(),
              s.trigger.remove(),
              i
                .removeClass(this.markerClassName)
                .off("focus", this._showDatepicker)
                .off("keydown", this._doKeyDown)
                .off("keypress", this._doKeyPress)
                .off("keyup", this._doKeyUp))
            : ("div" !== e && "span" !== e) ||
              i.removeClass(this.markerClassName).empty(),
          _ === s && (_ = null));
      },
      _enableDatepicker: function (e) {
        var t,
          i = k(e),
          s = k.data(e, "datepicker");
        i.hasClass(this.markerClassName) &&
          ("input" === (t = e.nodeName.toLowerCase())
            ? ((e.disabled = !1),
              s.trigger
                .filter("button")
                .each(function () {
                  this.disabled = !1;
                })
                .end()
                .filter("img")
                .css({ opacity: "1.0", cursor: "" }))
            : ("div" !== t && "span" !== t) ||
              ((i = i.children("." + this._inlineClass))
                .children()
                .removeClass("ui-state-disabled"),
              i
                .find("select.ui-datepicker-month, select.ui-datepicker-year")
                .prop("disabled", !1)),
          (this._disabledInputs = k.map(this._disabledInputs, function (t) {
            return t === e ? null : t;
          })));
      },
      _disableDatepicker: function (e) {
        var t,
          i = k(e),
          s = k.data(e, "datepicker");
        i.hasClass(this.markerClassName) &&
          ("input" === (t = e.nodeName.toLowerCase())
            ? ((e.disabled = !0),
              s.trigger
                .filter("button")
                .each(function () {
                  this.disabled = !0;
                })
                .end()
                .filter("img")
                .css({ opacity: "0.5", cursor: "default" }))
            : ("div" !== t && "span" !== t) ||
              ((i = i.children("." + this._inlineClass))
                .children()
                .addClass("ui-state-disabled"),
              i
                .find("select.ui-datepicker-month, select.ui-datepicker-year")
                .prop("disabled", !0)),
          (this._disabledInputs = k.map(this._disabledInputs, function (t) {
            return t === e ? null : t;
          })),
          (this._disabledInputs[this._disabledInputs.length] = e));
      },
      _isDisabledDatepicker: function (t) {
        if (!t) return !1;
        for (var e = 0; e < this._disabledInputs.length; e++)
          if (this._disabledInputs[e] === t) return !0;
        return !1;
      },
      _getInst: function (t) {
        try {
          return k.data(t, "datepicker");
        } catch (t) {
          throw "Missing instance data for this datepicker";
        }
      },
      _optionDatepicker: function (t, e, i) {
        var s,
          n,
          o,
          a,
          r = this._getInst(t);
        if (2 === arguments.length && "string" == typeof e)
          return "defaults" === e
            ? k.extend({}, k.datepicker._defaults)
            : r
            ? "all" === e
              ? k.extend({}, r.settings)
              : this._get(r, e)
            : null;
        (s = e || {}),
          "string" == typeof e && ((s = {})[e] = i),
          r &&
            (this._curInst === r && this._hideDatepicker(),
            (n = this._getDateDatepicker(t, !0)),
            (o = this._getMinMaxDate(r, "min")),
            (a = this._getMinMaxDate(r, "max")),
            w(r.settings, s),
            null !== o &&
              void 0 !== s.dateFormat &&
              void 0 === s.minDate &&
              (r.settings.minDate = this._formatDate(r, o)),
            null !== a &&
              void 0 !== s.dateFormat &&
              void 0 === s.maxDate &&
              (r.settings.maxDate = this._formatDate(r, a)),
            "disabled" in s &&
              (s.disabled
                ? this._disableDatepicker(t)
                : this._enableDatepicker(t)),
            this._attachments(k(t), r),
            this._autoSize(r),
            this._setDate(r, n),
            this._updateAlternate(r),
            this._updateDatepicker(r));
      },
      _changeDatepicker: function (t, e, i) {
        this._optionDatepicker(t, e, i);
      },
      _refreshDatepicker: function (t) {
        t = this._getInst(t);
        t && this._updateDatepicker(t);
      },
      _setDateDatepicker: function (t, e) {
        t = this._getInst(t);
        t &&
          (this._setDate(t, e),
          this._updateDatepicker(t),
          this._updateAlternate(t));
      },
      _getDateDatepicker: function (t, e) {
        t = this._getInst(t);
        return (
          t && !t.inline && this._setDateFromField(t, e),
          t ? this._getDate(t) : null
        );
      },
      _doKeyDown: function (t) {
        var e,
          i,
          s = k.datepicker._getInst(t.target),
          n = !0,
          o = s.dpDiv.is(".ui-datepicker-rtl");
        if (((s._keyEvent = !0), k.datepicker._datepickerShowing))
          switch (t.keyCode) {
            case 9:
              k.datepicker._hideDatepicker(), (n = !1);
              break;
            case 13:
              return (
                (i = k(
                  "td." +
                    k.datepicker._dayOverClass +
                    ":not(." +
                    k.datepicker._currentClass +
                    ")",
                  s.dpDiv
                ))[0] &&
                  k.datepicker._selectDay(
                    t.target,
                    s.selectedMonth,
                    s.selectedYear,
                    i[0]
                  ),
                (e = k.datepicker._get(s, "onSelect"))
                  ? ((i = k.datepicker._formatDate(s)),
                    e.apply(s.input ? s.input[0] : null, [i, s]))
                  : k.datepicker._hideDatepicker(),
                !1
              );
            case 27:
              k.datepicker._hideDatepicker();
              break;
            case 33:
              k.datepicker._adjustDate(
                t.target,
                t.ctrlKey
                  ? -k.datepicker._get(s, "stepBigMonths")
                  : -k.datepicker._get(s, "stepMonths"),
                "M"
              );
              break;
            case 34:
              k.datepicker._adjustDate(
                t.target,
                t.ctrlKey
                  ? +k.datepicker._get(s, "stepBigMonths")
                  : +k.datepicker._get(s, "stepMonths"),
                "M"
              );
              break;
            case 35:
              (t.ctrlKey || t.metaKey) && k.datepicker._clearDate(t.target),
                (n = t.ctrlKey || t.metaKey);
              break;
            case 36:
              (t.ctrlKey || t.metaKey) && k.datepicker._gotoToday(t.target),
                (n = t.ctrlKey || t.metaKey);
              break;
            case 37:
              (t.ctrlKey || t.metaKey) &&
                k.datepicker._adjustDate(t.target, o ? 1 : -1, "D"),
                (n = t.ctrlKey || t.metaKey),
                t.originalEvent.altKey &&
                  k.datepicker._adjustDate(
                    t.target,
                    t.ctrlKey
                      ? -k.datepicker._get(s, "stepBigMonths")
                      : -k.datepicker._get(s, "stepMonths"),
                    "M"
                  );
              break;
            case 38:
              (t.ctrlKey || t.metaKey) &&
                k.datepicker._adjustDate(t.target, -7, "D"),
                (n = t.ctrlKey || t.metaKey);
              break;
            case 39:
              (t.ctrlKey || t.metaKey) &&
                k.datepicker._adjustDate(t.target, o ? -1 : 1, "D"),
                (n = t.ctrlKey || t.metaKey),
                t.originalEvent.altKey &&
                  k.datepicker._adjustDate(
                    t.target,
                    t.ctrlKey
                      ? +k.datepicker._get(s, "stepBigMonths")
                      : +k.datepicker._get(s, "stepMonths"),
                    "M"
                  );
              break;
            case 40:
              (t.ctrlKey || t.metaKey) &&
                k.datepicker._adjustDate(t.target, 7, "D"),
                (n = t.ctrlKey || t.metaKey);
              break;
            default:
              n = !1;
          }
        else
          36 === t.keyCode && t.ctrlKey
            ? k.datepicker._showDatepicker(this)
            : (n = !1);
        n && (t.preventDefault(), t.stopPropagation());
      },
      _doKeyPress: function (t) {
        var e,
          i = k.datepicker._getInst(t.target);
        if (k.datepicker._get(i, "constrainInput"))
          return (
            (e = k.datepicker._possibleChars(
              k.datepicker._get(i, "dateFormat")
            )),
            (i = String.fromCharCode(
              null == t.charCode ? t.keyCode : t.charCode
            )),
            t.ctrlKey || t.metaKey || i < " " || !e || -1 < e.indexOf(i)
          );
      },
      _doKeyUp: function (t) {
        var e = k.datepicker._getInst(t.target);
        if (e.input.val() !== e.lastVal)
          try {
            k.datepicker.parseDate(
              k.datepicker._get(e, "dateFormat"),
              e.input ? e.input.val() : null,
              k.datepicker._getFormatConfig(e)
            ) &&
              (k.datepicker._setDateFromField(e),
              k.datepicker._updateAlternate(e),
              k.datepicker._updateDatepicker(e));
          } catch (t) {}
        return !0;
      },
      _showDatepicker: function (t) {
        var e, i, s, n;
        "input" !== (t = t.target || t).nodeName.toLowerCase() &&
          (t = k("input", t.parentNode)[0]),
          k.datepicker._isDisabledDatepicker(t) ||
            k.datepicker._lastInput === t ||
            ((n = k.datepicker._getInst(t)),
            k.datepicker._curInst &&
              k.datepicker._curInst !== n &&
              (k.datepicker._curInst.dpDiv.stop(!0, !0),
              n &&
                k.datepicker._datepickerShowing &&
                k.datepicker._hideDatepicker(k.datepicker._curInst.input[0])),
            !1 !==
              (i = (s = k.datepicker._get(n, "beforeShow"))
                ? s.apply(t, [t, n])
                : {}) &&
              (w(n.settings, i),
              (n.lastVal = null),
              (k.datepicker._lastInput = t),
              k.datepicker._setDateFromField(n),
              k.datepicker._inDialog && (t.value = ""),
              k.datepicker._pos ||
                ((k.datepicker._pos = k.datepicker._findPos(t)),
                (k.datepicker._pos[1] += t.offsetHeight)),
              (e = !1),
              k(t)
                .parents()
                .each(function () {
                  return !(e |= "fixed" === k(this).css("position"));
                }),
              (s = { left: k.datepicker._pos[0], top: k.datepicker._pos[1] }),
              (k.datepicker._pos = null),
              n.dpDiv.empty(),
              n.dpDiv.css({
                position: "absolute",
                display: "block",
                top: "-1000px",
              }),
              k.datepicker._updateDatepicker(n),
              (s = k.datepicker._checkOffset(n, s, e)),
              n.dpDiv.css({
                position:
                  k.datepicker._inDialog && k.blockUI
                    ? "static"
                    : e
                    ? "fixed"
                    : "absolute",
                display: "none",
                left: s.left + "px",
                top: s.top + "px",
              }),
              n.inline ||
                ((i = k.datepicker._get(n, "showAnim")),
                (s = k.datepicker._get(n, "duration")),
                n.dpDiv.css(
                  "z-index",
                  (function (t) {
                    for (var e, i; t.length && t[0] !== document; ) {
                      if (
                        ("absolute" === (e = t.css("position")) ||
                          "relative" === e ||
                          "fixed" === e) &&
                        ((i = parseInt(t.css("zIndex"), 10)),
                        !isNaN(i) && 0 !== i)
                      )
                        return i;
                      t = t.parent();
                    }
                    return 0;
                  })(k(t)) + 1
                ),
                (k.datepicker._datepickerShowing = !0),
                k.effects && k.effects.effect[i]
                  ? n.dpDiv.show(i, k.datepicker._get(n, "showOptions"), s)
                  : n.dpDiv[i || "show"](i ? s : null),
                k.datepicker._shouldFocusInput(n) && n.input.trigger("focus"),
                (k.datepicker._curInst = n))));
      },
      _updateDatepicker: function (t) {
        (this.maxRows = 4),
          (_ = t).dpDiv.empty().append(this._generateHTML(t)),
          this._attachHandlers(t);
        var e,
          i = this._getNumberOfMonths(t),
          s = i[1],
          n = t.dpDiv.find("." + this._dayOverClass + " a");
        0 < n.length && y.apply(n.get(0)),
          t.dpDiv
            .removeClass(
              "ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4"
            )
            .width(""),
          1 < s &&
            t.dpDiv
              .addClass("ui-datepicker-multi-" + s)
              .css("width", 17 * s + "em"),
          t.dpDiv[(1 !== i[0] || 1 !== i[1] ? "add" : "remove") + "Class"](
            "ui-datepicker-multi"
          ),
          t.dpDiv[(this._get(t, "isRTL") ? "add" : "remove") + "Class"](
            "ui-datepicker-rtl"
          ),
          t === k.datepicker._curInst &&
            k.datepicker._datepickerShowing &&
            k.datepicker._shouldFocusInput(t) &&
            t.input.trigger("focus"),
          t.yearshtml &&
            ((e = t.yearshtml),
            setTimeout(function () {
              e === t.yearshtml &&
                t.yearshtml &&
                t.dpDiv
                  .find("select.ui-datepicker-year:first")
                  .replaceWith(t.yearshtml),
                (e = t.yearshtml = null);
            }, 0));
      },
      _shouldFocusInput: function (t) {
        return (
          t.input &&
          t.input.is(":visible") &&
          !t.input.is(":disabled") &&
          !t.input.is(":focus")
        );
      },
      _checkOffset: function (t, e, i) {
        var s = t.dpDiv.outerWidth(),
          n = t.dpDiv.outerHeight(),
          o = t.input ? t.input.outerWidth() : 0,
          a = t.input ? t.input.outerHeight() : 0,
          r =
            document.documentElement.clientWidth +
            (i ? 0 : k(document).scrollLeft()),
          h =
            document.documentElement.clientHeight +
            (i ? 0 : k(document).scrollTop());
        return (
          (e.left -= this._get(t, "isRTL") ? s - o : 0),
          (e.left -=
            i && e.left === t.input.offset().left
              ? k(document).scrollLeft()
              : 0),
          (e.top -=
            i && e.top === t.input.offset().top + a
              ? k(document).scrollTop()
              : 0),
          (e.left -= Math.min(
            e.left,
            e.left + s > r && s < r ? Math.abs(e.left + s - r) : 0
          )),
          (e.top -= Math.min(
            e.top,
            e.top + n > h && n < h ? Math.abs(n + a) : 0
          )),
          e
        );
      },
      _findPos: function (t) {
        for (
          var e = this._getInst(t), i = this._get(e, "isRTL");
          t &&
          ("hidden" === t.type || 1 !== t.nodeType || k.expr.filters.hidden(t));

        )
          t = t[i ? "previousSibling" : "nextSibling"];
        return [(e = k(t).offset()).left, e.top];
      },
      _hideDatepicker: function (t) {
        var e,
          i,
          s = this._curInst;
        !s ||
          (t && s !== k.data(t, "datepicker")) ||
          (this._datepickerShowing &&
            ((e = this._get(s, "showAnim")),
            (i = this._get(s, "duration")),
            (t = function () {
              k.datepicker._tidyDialog(s);
            }),
            k.effects && (k.effects.effect[e] || k.effects[e])
              ? s.dpDiv.hide(e, k.datepicker._get(s, "showOptions"), i, t)
              : s.dpDiv[
                  "slideDown" === e
                    ? "slideUp"
                    : "fadeIn" === e
                    ? "fadeOut"
                    : "hide"
                ](e ? i : null, t),
            e || t(),
            (this._datepickerShowing = !1),
            (t = this._get(s, "onClose")) &&
              t.apply(s.input ? s.input[0] : null, [
                s.input ? s.input.val() : "",
                s,
              ]),
            (this._lastInput = null),
            this._inDialog &&
              (this._dialogInput.css({
                position: "absolute",
                left: "0",
                top: "-100px",
              }),
              k.blockUI && (k.unblockUI(), k("body").append(this.dpDiv))),
            (this._inDialog = !1)));
      },
      _tidyDialog: function (t) {
        t.dpDiv.removeClass(this._dialogClass).off(".ui-datepicker-calendar");
      },
      _checkExternalClick: function (t) {
        var e;
        k.datepicker._curInst &&
          ((e = k(t.target)),
          (t = k.datepicker._getInst(e[0])),
          ((e[0].id === k.datepicker._mainDivId ||
            0 !== e.parents("#" + k.datepicker._mainDivId).length ||
            e.hasClass(k.datepicker.markerClassName) ||
            e.closest("." + k.datepicker._triggerClass).length ||
            !k.datepicker._datepickerShowing ||
            (k.datepicker._inDialog && k.blockUI)) &&
            (!e.hasClass(k.datepicker.markerClassName) ||
              k.datepicker._curInst === t)) ||
            k.datepicker._hideDatepicker());
      },
      _adjustDate: function (t, e, i) {
        var s = k(t),
          t = this._getInst(s[0]);
        this._isDisabledDatepicker(s[0]) ||
          (this._adjustInstDate(
            t,
            e + ("M" === i ? this._get(t, "showCurrentAtPos") : 0),
            i
          ),
          this._updateDatepicker(t));
      },
      _gotoToday: function (t) {
        var e = k(t),
          i = this._getInst(e[0]);
        this._get(i, "gotoCurrent") && i.currentDay
          ? ((i.selectedDay = i.currentDay),
            (i.drawMonth = i.selectedMonth = i.currentMonth),
            (i.drawYear = i.selectedYear = i.currentYear))
          : ((t = new Date()),
            (i.selectedDay = t.getDate()),
            (i.drawMonth = i.selectedMonth = t.getMonth()),
            (i.drawYear = i.selectedYear = t.getFullYear())),
          this._notifyChange(i),
          this._adjustDate(e);
      },
      _selectMonthYear: function (t, e, i) {
        var s = k(t),
          t = this._getInst(s[0]);
        (t["selected" + ("M" === i ? "Month" : "Year")] = t[
          "draw" + ("M" === i ? "Month" : "Year")
        ] =
          parseInt(e.options[e.selectedIndex].value, 10)),
          this._notifyChange(t),
          this._adjustDate(s);
      },
      _selectDay: function (t, e, i, s) {
        var n = k(t);
        k(s).hasClass(this._unselectableClass) ||
          this._isDisabledDatepicker(n[0]) ||
          (((n = this._getInst(n[0])).selectedDay = n.currentDay =
            k("a", s).html()),
          (n.selectedMonth = n.currentMonth = e),
          (n.selectedYear = n.currentYear = i),
          this._selectDate(
            t,
            this._formatDate(n, n.currentDay, n.currentMonth, n.currentYear)
          ));
      },
      _clearDate: function (t) {
        t = k(t);
        this._selectDate(t, "");
      },
      _selectDate: function (t, e) {
        var i = k(t),
          t = this._getInst(i[0]);
        (e = null != e ? e : this._formatDate(t)),
          t.input && t.input.val(e),
          this._updateAlternate(t),
          (i = this._get(t, "onSelect"))
            ? i.apply(t.input ? t.input[0] : null, [e, t])
            : t.input && t.input.trigger("change"),
          t.inline
            ? this._updateDatepicker(t)
            : (this._hideDatepicker(),
              (this._lastInput = t.input[0]),
              "object" != typeof t.input[0] && t.input.trigger("focus"),
              (this._lastInput = null));
      },
      _updateAlternate: function (t) {
        var e,
          i,
          s = this._get(t, "altField");
        s &&
          ((e = this._get(t, "altFormat") || this._get(t, "dateFormat")),
          (i = this._getDate(t)),
          (t = this.formatDate(e, i, this._getFormatConfig(t))),
          k(s).val(t));
      },
      noWeekends: function (t) {
        t = t.getDay();
        return [0 < t && t < 6, ""];
      },
      iso8601Week: function (t) {
        var e = new Date(t.getTime());
        return (
          e.setDate(e.getDate() + 4 - (e.getDay() || 7)),
          (t = e.getTime()),
          e.setMonth(0),
          e.setDate(1),
          Math.floor(Math.round((t - e) / 864e5) / 7) + 1
        );
      },
      parseDate: function (e, n, t) {
        if (null == e || null == n) throw "Invalid arguments";
        if ("" === (n = "object" == typeof n ? n.toString() : n + ""))
          return null;
        function o(t) {
          return (t = w + 1 < e.length && e.charAt(w + 1) === t) && w++, t;
        }
        function i(t) {
          var e = o(t),
            e =
              "@" === t
                ? 14
                : "!" === t
                ? 20
                : "y" === t && e
                ? 4
                : "o" === t
                ? 3
                : 2,
            e = new RegExp("^\\d{" + ("y" === t ? e : 1) + "," + e + "}");
          if (!(e = n.substring(c).match(e)))
            throw "Missing number at position " + c;
          return (c += e[0].length), parseInt(e[0], 10);
        }
        function s(t, e, i) {
          var s = -1,
            e = k
              .map(o(t) ? i : e, function (t, e) {
                return [[e, t]];
              })
              .sort(function (t, e) {
                return -(t[1].length - e[1].length);
              });
          if (
            (k.each(e, function (t, e) {
              var i = e[1];
              if (n.substr(c, i.length).toLowerCase() === i.toLowerCase())
                return (s = e[0]), (c += i.length), !1;
            }),
            -1 !== s)
          )
            return s + 1;
          throw "Unknown name at position " + c;
        }
        function a() {
          if (n.charAt(c) !== e.charAt(w))
            throw "Unexpected literal at position " + c;
          c++;
        }
        for (
          var r,
            h,
            l,
            c = 0,
            u =
              (t ? t.shortYearCutoff : null) || this._defaults.shortYearCutoff,
            u =
              "string" != typeof u
                ? u
                : (new Date().getFullYear() % 100) + parseInt(u, 10),
            d = (t ? t.dayNamesShort : null) || this._defaults.dayNamesShort,
            p = (t ? t.dayNames : null) || this._defaults.dayNames,
            f =
              (t ? t.monthNamesShort : null) || this._defaults.monthNamesShort,
            g = (t ? t.monthNames : null) || this._defaults.monthNames,
            m = -1,
            _ = -1,
            v = -1,
            b = -1,
            y = !1,
            w = 0;
          w < e.length;
          w++
        )
          if (y) "'" !== e.charAt(w) || o("'") ? a() : (y = !1);
          else
            switch (e.charAt(w)) {
              case "d":
                v = i("d");
                break;
              case "D":
                s("D", d, p);
                break;
              case "o":
                b = i("o");
                break;
              case "m":
                _ = i("m");
                break;
              case "M":
                _ = s("M", f, g);
                break;
              case "y":
                m = i("y");
                break;
              case "@":
                (m = (l = new Date(i("@"))).getFullYear()),
                  (_ = l.getMonth() + 1),
                  (v = l.getDate());
                break;
              case "!":
                (m = (l = new Date(
                  (i("!") - this._ticksTo1970) / 1e4
                )).getFullYear()),
                  (_ = l.getMonth() + 1),
                  (v = l.getDate());
                break;
              case "'":
                o("'") ? a() : (y = !0);
                break;
              default:
                a();
            }
        if (c < n.length && ((h = n.substr(c)), !/^\s+/.test(h)))
          throw "Extra/unparsed characters found in date: " + h;
        if (
          (-1 === m
            ? (m = new Date().getFullYear())
            : m < 100 &&
              (m +=
                new Date().getFullYear() -
                (new Date().getFullYear() % 100) +
                (m <= u ? 0 : -100)),
          -1 < b)
        )
          for (_ = 1, v = b; ; ) {
            if (v <= (r = this._getDaysInMonth(m, _ - 1))) break;
            _++, (v -= r);
          }
        if (
          (l = this._daylightSavingAdjust(
            new Date(m, _ - 1, v)
          )).getFullYear() !== m ||
          l.getMonth() + 1 !== _ ||
          l.getDate() !== v
        )
          throw "Invalid date";
        return l;
      },
      ATOM: "yy-mm-dd",
      COOKIE: "D, dd M yy",
      ISO_8601: "yy-mm-dd",
      RFC_822: "D, d M y",
      RFC_850: "DD, dd-M-y",
      RFC_1036: "D, d M y",
      RFC_1123: "D, d M yy",
      RFC_2822: "D, d M yy",
      RSS: "D, d M y",
      TICKS: "!",
      TIMESTAMP: "@",
      W3C: "yy-mm-dd",
      _ticksTo1970:
        24 *
        (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) *
        60 *
        60 *
        1e7,
      formatDate: function (e, t, i) {
        if (!t) return "";
        function n(t) {
          return (t = a + 1 < e.length && e.charAt(a + 1) === t) && a++, t;
        }
        function s(t, e, i) {
          var s = "" + e;
          if (n(t)) for (; s.length < i; ) s = "0" + s;
          return s;
        }
        function o(t, e, i, s) {
          return (n(t) ? s : i)[e];
        }
        var a,
          r = (i ? i.dayNamesShort : null) || this._defaults.dayNamesShort,
          h = (i ? i.dayNames : null) || this._defaults.dayNames,
          l = (i ? i.monthNamesShort : null) || this._defaults.monthNamesShort,
          c = (i ? i.monthNames : null) || this._defaults.monthNames,
          u = "",
          d = !1;
        if (t)
          for (a = 0; a < e.length; a++)
            if (d)
              "'" !== e.charAt(a) || n("'") ? (u += e.charAt(a)) : (d = !1);
            else
              switch (e.charAt(a)) {
                case "d":
                  u += s("d", t.getDate(), 2);
                  break;
                case "D":
                  u += o("D", t.getDay(), r, h);
                  break;
                case "o":
                  u += s(
                    "o",
                    Math.round(
                      (new Date(
                        t.getFullYear(),
                        t.getMonth(),
                        t.getDate()
                      ).getTime() -
                        new Date(t.getFullYear(), 0, 0).getTime()) /
                        864e5
                    ),
                    3
                  );
                  break;
                case "m":
                  u += s("m", t.getMonth() + 1, 2);
                  break;
                case "M":
                  u += o("M", t.getMonth(), l, c);
                  break;
                case "y":
                  u += n("y")
                    ? t.getFullYear()
                    : (t.getFullYear() % 100 < 10 ? "0" : "") +
                      (t.getFullYear() % 100);
                  break;
                case "@":
                  u += t.getTime();
                  break;
                case "!":
                  u += 1e4 * t.getTime() + this._ticksTo1970;
                  break;
                case "'":
                  n("'") ? (u += "'") : (d = !0);
                  break;
                default:
                  u += e.charAt(a);
              }
        return u;
      },
      _possibleChars: function (e) {
        function t(t) {
          return (t = n + 1 < e.length && e.charAt(n + 1) === t) && n++, t;
        }
        for (var i = "", s = !1, n = 0; n < e.length; n++)
          if (s) "'" !== e.charAt(n) || t("'") ? (i += e.charAt(n)) : (s = !1);
          else
            switch (e.charAt(n)) {
              case "d":
              case "m":
              case "y":
              case "@":
                i += "0123456789";
                break;
              case "D":
              case "M":
                return null;
              case "'":
                t("'") ? (i += "'") : (s = !0);
                break;
              default:
                i += e.charAt(n);
            }
        return i;
      },
      _get: function (t, e) {
        return (void 0 !== t.settings[e] ? t.settings : this._defaults)[e];
      },
      _setDateFromField: function (t, e) {
        if (t.input.val() !== t.lastVal) {
          var i = this._get(t, "dateFormat"),
            s = (t.lastVal = t.input ? t.input.val() : null),
            n = this._getDefaultDate(t),
            o = n,
            a = this._getFormatConfig(t);
          try {
            o = this.parseDate(i, s, a) || n;
          } catch (t) {
            s = e ? "" : s;
          }
          (t.selectedDay = o.getDate()),
            (t.drawMonth = t.selectedMonth = o.getMonth()),
            (t.drawYear = t.selectedYear = o.getFullYear()),
            (t.currentDay = s ? o.getDate() : 0),
            (t.currentMonth = s ? o.getMonth() : 0),
            (t.currentYear = s ? o.getFullYear() : 0),
            this._adjustInstDate(t);
        }
      },
      _getDefaultDate: function (t) {
        return this._restrictMinMax(
          t,
          this._determineDate(t, this._get(t, "defaultDate"), new Date())
        );
      },
      _determineDate: function (r, t, e) {
        var i,
          s,
          t =
            null == t || "" === t
              ? e
              : "string" == typeof t
              ? (function (t) {
                  try {
                    return k.datepicker.parseDate(
                      k.datepicker._get(r, "dateFormat"),
                      t,
                      k.datepicker._getFormatConfig(r)
                    );
                  } catch (t) {}
                  for (
                    var e =
                        (t.toLowerCase().match(/^c/)
                          ? k.datepicker._getDate(r)
                          : null) || new Date(),
                      i = e.getFullYear(),
                      s = e.getMonth(),
                      n = e.getDate(),
                      o = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                      a = o.exec(t);
                    a;

                  ) {
                    switch (a[2] || "d") {
                      case "d":
                      case "D":
                        n += parseInt(a[1], 10);
                        break;
                      case "w":
                      case "W":
                        n += 7 * parseInt(a[1], 10);
                        break;
                      case "m":
                      case "M":
                        (s += parseInt(a[1], 10)),
                          (n = Math.min(n, k.datepicker._getDaysInMonth(i, s)));
                        break;
                      case "y":
                      case "Y":
                        (i += parseInt(a[1], 10)),
                          (n = Math.min(n, k.datepicker._getDaysInMonth(i, s)));
                    }
                    a = o.exec(t);
                  }
                  return new Date(i, s, n);
                })(t)
              : "number" == typeof t
              ? isNaN(t)
                ? e
                : ((i = t), (s = new Date()).setDate(s.getDate() + i), s)
              : new Date(t.getTime());
        return (
          (t = t && "Invalid Date" === t.toString() ? e : t) &&
            (t.setHours(0),
            t.setMinutes(0),
            t.setSeconds(0),
            t.setMilliseconds(0)),
          this._daylightSavingAdjust(t)
        );
      },
      _daylightSavingAdjust: function (t) {
        return t
          ? (t.setHours(12 < t.getHours() ? t.getHours() + 2 : 0), t)
          : null;
      },
      _setDate: function (t, e, i) {
        var s = !e,
          n = t.selectedMonth,
          o = t.selectedYear,
          e = this._restrictMinMax(t, this._determineDate(t, e, new Date()));
        (t.selectedDay = t.currentDay = e.getDate()),
          (t.drawMonth = t.selectedMonth = t.currentMonth = e.getMonth()),
          (t.drawYear = t.selectedYear = t.currentYear = e.getFullYear()),
          (n === t.selectedMonth && o === t.selectedYear) ||
            i ||
            this._notifyChange(t),
          this._adjustInstDate(t),
          t.input && t.input.val(s ? "" : this._formatDate(t));
      },
      _getDate: function (t) {
        return !t.currentYear || (t.input && "" === t.input.val())
          ? null
          : this._daylightSavingAdjust(
              new Date(t.currentYear, t.currentMonth, t.currentDay)
            );
      },
      _attachHandlers: function (t) {
        var e = this._get(t, "stepMonths"),
          i = "#" + t.id.replace(/\\\\/g, "\\");
        t.dpDiv.find("[data-handler]").map(function () {
          var t = {
            prev: function () {
              k.datepicker._adjustDate(i, -e, "M");
            },
            next: function () {
              k.datepicker._adjustDate(i, +e, "M");
            },
            hide: function () {
              k.datepicker._hideDatepicker();
            },
            today: function () {
              k.datepicker._gotoToday(i);
            },
            selectDay: function () {
              return (
                k.datepicker._selectDay(
                  i,
                  +this.getAttribute("data-month"),
                  +this.getAttribute("data-year"),
                  this
                ),
                !1
              );
            },
            selectMonth: function () {
              return k.datepicker._selectMonthYear(i, this, "M"), !1;
            },
            selectYear: function () {
              return k.datepicker._selectMonthYear(i, this, "Y"), !1;
            },
          };
          k(this).on(
            this.getAttribute("data-event"),
            t[this.getAttribute("data-handler")]
          );
        });
      },
      _generateHTML: function (t) {
        var e,
          i,
          s,
          n,
          o,
          a,
          r,
          h,
          l,
          c,
          u,
          d,
          p,
          f,
          g,
          m,
          _,
          v,
          b,
          y,
          w,
          k,
          C,
          x,
          D,
          I,
          P,
          T,
          M,
          S,
          z,
          O = new Date(),
          A = this._daylightSavingAdjust(
            new Date(O.getFullYear(), O.getMonth(), O.getDate())
          ),
          H = this._get(t, "isRTL"),
          N = this._get(t, "showButtonPanel"),
          E = this._get(t, "hideIfNoPrevNext"),
          W = this._get(t, "navigationAsDateFormat"),
          F = this._getNumberOfMonths(t),
          L = this._get(t, "showCurrentAtPos"),
          O = this._get(t, "stepMonths"),
          R = 1 !== F[0] || 1 !== F[1],
          Y = this._daylightSavingAdjust(
            t.currentDay
              ? new Date(t.currentYear, t.currentMonth, t.currentDay)
              : new Date(9999, 9, 9)
          ),
          B = this._getMinMaxDate(t, "min"),
          K = this._getMinMaxDate(t, "max"),
          j = t.drawMonth - L,
          U = t.drawYear;
        if ((j < 0 && ((j += 12), U--), K))
          for (
            e = this._daylightSavingAdjust(
              new Date(
                K.getFullYear(),
                K.getMonth() - F[0] * F[1] + 1,
                K.getDate()
              )
            ),
              e = B && e < B ? B : e;
            this._daylightSavingAdjust(new Date(U, j, 1)) > e;

          )
            --j < 0 && ((j = 11), U--);
        for (
          t.drawMonth = j,
            t.drawYear = U,
            L = this._get(t, "prevText"),
            L = W
              ? this.formatDate(
                  L,
                  this._daylightSavingAdjust(new Date(U, j - O, 1)),
                  this._getFormatConfig(t)
                )
              : L,
            i = this._canAdjustMonth(t, -1, U, j)
              ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" +
                L +
                "'><span class='ui-icon ui-icon-circle-triangle-" +
                (H ? "e" : "w") +
                "'>" +
                L +
                "</span></a>"
              : E
              ? ""
              : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" +
                L +
                "'><span class='ui-icon ui-icon-circle-triangle-" +
                (H ? "e" : "w") +
                "'>" +
                L +
                "</span></a>",
            L = this._get(t, "nextText"),
            L = W
              ? this.formatDate(
                  L,
                  this._daylightSavingAdjust(new Date(U, j + O, 1)),
                  this._getFormatConfig(t)
                )
              : L,
            s = this._canAdjustMonth(t, 1, U, j)
              ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" +
                L +
                "'><span class='ui-icon ui-icon-circle-triangle-" +
                (H ? "w" : "e") +
                "'>" +
                L +
                "</span></a>"
              : E
              ? ""
              : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" +
                L +
                "'><span class='ui-icon ui-icon-circle-triangle-" +
                (H ? "w" : "e") +
                "'>" +
                L +
                "</span></a>",
            E = this._get(t, "currentText"),
            L = this._get(t, "gotoCurrent") && t.currentDay ? Y : A,
            E = W ? this.formatDate(E, L, this._getFormatConfig(t)) : E,
            W = t.inline
              ? ""
              : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
                this._get(t, "closeText") +
                "</button>",
            W = N
              ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" +
                (H ? W : "") +
                (this._isInRange(t, L)
                  ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" +
                    E +
                    "</button>"
                  : "") +
                (H ? "" : W) +
                "</div>"
              : "",
            n = parseInt(this._get(t, "firstDay"), 10),
            n = isNaN(n) ? 0 : n,
            o = this._get(t, "showWeek"),
            a = this._get(t, "dayNames"),
            r = this._get(t, "dayNamesMin"),
            h = this._get(t, "monthNames"),
            l = this._get(t, "monthNamesShort"),
            c = this._get(t, "beforeShowDay"),
            u = this._get(t, "showOtherMonths"),
            d = this._get(t, "selectOtherMonths"),
            p = this._getDefaultDate(t),
            f = "",
            m = 0;
          m < F[0];
          m++
        ) {
          for (_ = "", this.maxRows = 4, v = 0; v < F[1]; v++) {
            if (
              ((b = this._daylightSavingAdjust(new Date(U, j, t.selectedDay))),
              (C = " ui-corner-all"),
              (y = ""),
              R)
            ) {
              if (((y += "<div class='ui-datepicker-group"), 1 < F[1]))
                switch (v) {
                  case 0:
                    (y += " ui-datepicker-group-first"),
                      (C = " ui-corner-" + (H ? "right" : "left"));
                    break;
                  case F[1] - 1:
                    (y += " ui-datepicker-group-last"),
                      (C = " ui-corner-" + (H ? "left" : "right"));
                    break;
                  default:
                    (y += " ui-datepicker-group-middle"), (C = "");
                }
              y += "'>";
            }
            for (
              y +=
                "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" +
                C +
                "'>" +
                (/all|left/.test(C) && 0 === m ? (H ? s : i) : "") +
                (/all|right/.test(C) && 0 === m ? (H ? i : s) : "") +
                this._generateMonthYearHeader(
                  t,
                  j,
                  U,
                  B,
                  K,
                  0 < m || 0 < v,
                  h,
                  l
                ) +
                "</div><table class='ui-datepicker-calendar'><thead><tr>",
                w = o
                  ? "<th class='ui-datepicker-week-col'>" +
                    this._get(t, "weekHeader") +
                    "</th>"
                  : "",
                g = 0;
              g < 7;
              g++
            )
              w +=
                "<th scope='col'" +
                (5 <= (g + n + 6) % 7
                  ? " class='ui-datepicker-week-end'"
                  : "") +
                "><span title='" +
                a[(k = (g + n) % 7)] +
                "'>" +
                r[k] +
                "</span></th>";
            for (
              y += w + "</tr></thead><tbody>",
                x = this._getDaysInMonth(U, j),
                U === t.selectedYear &&
                  j === t.selectedMonth &&
                  (t.selectedDay = Math.min(t.selectedDay, x)),
                C = (this._getFirstDayOfMonth(U, j) - n + 7) % 7,
                x = Math.ceil((C + x) / 7),
                D = R && this.maxRows > x ? this.maxRows : x,
                this.maxRows = D,
                I = this._daylightSavingAdjust(new Date(U, j, 1 - C)),
                P = 0;
              P < D;
              P++
            ) {
              for (
                y += "<tr>",
                  T = o
                    ? "<td class='ui-datepicker-week-col'>" +
                      this._get(t, "calculateWeek")(I) +
                      "</td>"
                    : "",
                  g = 0;
                g < 7;
                g++
              )
                (M = c ? c.apply(t.input ? t.input[0] : null, [I]) : [!0, ""]),
                  (z =
                    ((S = I.getMonth() !== j) && !d) ||
                    !M[0] ||
                    (B && I < B) ||
                    (K && K < I)),
                  (T +=
                    "<td class='" +
                    (5 <= (g + n + 6) % 7 ? " ui-datepicker-week-end" : "") +
                    (S ? " ui-datepicker-other-month" : "") +
                    ((I.getTime() === b.getTime() &&
                      j === t.selectedMonth &&
                      t._keyEvent) ||
                    (p.getTime() === I.getTime() && p.getTime() === b.getTime())
                      ? " " + this._dayOverClass
                      : "") +
                    (z
                      ? " " + this._unselectableClass + " ui-state-disabled"
                      : "") +
                    (S && !u
                      ? ""
                      : " " +
                        M[1] +
                        (I.getTime() === Y.getTime()
                          ? " " + this._currentClass
                          : "") +
                        (I.getTime() === A.getTime()
                          ? " ui-datepicker-today"
                          : "")) +
                    "'" +
                    ((S && !u) || !M[2]
                      ? ""
                      : " title='" + M[2].replace(/'/g, "&#39;") + "'") +
                    (z
                      ? ""
                      : " data-handler='selectDay' data-event='click' data-month='" +
                        I.getMonth() +
                        "' data-year='" +
                        I.getFullYear() +
                        "'") +
                    ">" +
                    (S && !u
                      ? "&#xa0;"
                      : z
                      ? "<span class='ui-state-default'>" +
                        I.getDate() +
                        "</span>"
                      : "<a class='ui-state-default" +
                        (I.getTime() === A.getTime()
                          ? " ui-state-highlight"
                          : "") +
                        (I.getTime() === Y.getTime()
                          ? " ui-state-active"
                          : "") +
                        (S ? " ui-priority-secondary" : "") +
                        "' href='#'>" +
                        I.getDate() +
                        "</a>") +
                    "</td>"),
                  I.setDate(I.getDate() + 1),
                  (I = this._daylightSavingAdjust(I));
              y += T + "</tr>";
            }
            11 < ++j && ((j = 0), U++),
              (_ += y +=
                "</tbody></table>" +
                (R
                  ? "</div>" +
                    (0 < F[0] && v === F[1] - 1
                      ? "<div class='ui-datepicker-row-break'></div>"
                      : "")
                  : ""));
          }
          f += _;
        }
        return (f += W), (t._keyEvent = !1), f;
      },
      _generateMonthYearHeader: function (t, e, i, s, n, o, a, r) {
        var h,
          l,
          c,
          u,
          d,
          p,
          f,
          g = this._get(t, "changeMonth"),
          m = this._get(t, "changeYear"),
          _ = this._get(t, "showMonthAfterYear"),
          v = "<div class='ui-datepicker-title'>",
          b = "";
        if (o || !g)
          b += "<span class='ui-datepicker-month'>" + a[e] + "</span>";
        else {
          for (
            h = s && s.getFullYear() === i,
              l = n && n.getFullYear() === i,
              b +=
                "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",
              c = 0;
            c < 12;
            c++
          )
            (!h || c >= s.getMonth()) &&
              (!l || c <= n.getMonth()) &&
              (b +=
                "<option value='" +
                c +
                "'" +
                (c === e ? " selected='selected'" : "") +
                ">" +
                r[c] +
                "</option>");
          b += "</select>";
        }
        if ((_ || (v += b + (!o && g && m ? "" : "&#xa0;")), !t.yearshtml))
          if (((t.yearshtml = ""), o || !m))
            v += "<span class='ui-datepicker-year'>" + i + "</span>";
          else {
            for (
              u = this._get(t, "yearRange").split(":"),
                d = new Date().getFullYear(),
                p = (a = function (t) {
                  t = t.match(/c[+\-].*/)
                    ? i + parseInt(t.substring(1), 10)
                    : t.match(/[+\-].*/)
                    ? d + parseInt(t, 10)
                    : parseInt(t, 10);
                  return isNaN(t) ? d : t;
                })(u[0]),
                f = Math.max(p, a(u[1] || "")),
                p = s ? Math.max(p, s.getFullYear()) : p,
                f = n ? Math.min(f, n.getFullYear()) : f,
                t.yearshtml +=
                  "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
              p <= f;
              p++
            )
              t.yearshtml +=
                "<option value='" +
                p +
                "'" +
                (p === i ? " selected='selected'" : "") +
                ">" +
                p +
                "</option>";
            (t.yearshtml += "</select>"),
              (v += t.yearshtml),
              (t.yearshtml = null);
          }
        return (
          (v += this._get(t, "yearSuffix")),
          _ && (v += (!o && g && m ? "" : "&#xa0;") + b),
          (v += "</div>")
        );
      },
      _adjustInstDate: function (t, e, i) {
        var s = t.selectedYear + ("Y" === i ? e : 0),
          n = t.selectedMonth + ("M" === i ? e : 0),
          e =
            Math.min(t.selectedDay, this._getDaysInMonth(s, n)) +
            ("D" === i ? e : 0),
          e = this._restrictMinMax(
            t,
            this._daylightSavingAdjust(new Date(s, n, e))
          );
        (t.selectedDay = e.getDate()),
          (t.drawMonth = t.selectedMonth = e.getMonth()),
          (t.drawYear = t.selectedYear = e.getFullYear()),
          ("M" !== i && "Y" !== i) || this._notifyChange(t);
      },
      _restrictMinMax: function (t, e) {
        var i = this._getMinMaxDate(t, "min"),
          t = this._getMinMaxDate(t, "max"),
          e = i && e < i ? i : e;
        return t && t < e ? t : e;
      },
      _notifyChange: function (t) {
        var e = this._get(t, "onChangeMonthYear");
        e &&
          e.apply(t.input ? t.input[0] : null, [
            t.selectedYear,
            t.selectedMonth + 1,
            t,
          ]);
      },
      _getNumberOfMonths: function (t) {
        t = this._get(t, "numberOfMonths");
        return null == t ? [1, 1] : "number" == typeof t ? [1, t] : t;
      },
      _getMinMaxDate: function (t, e) {
        return this._determineDate(t, this._get(t, e + "Date"), null);
      },
      _getDaysInMonth: function (t, e) {
        return 32 - this._daylightSavingAdjust(new Date(t, e, 32)).getDate();
      },
      _getFirstDayOfMonth: function (t, e) {
        return new Date(t, e, 1).getDay();
      },
      _canAdjustMonth: function (t, e, i, s) {
        var n = this._getNumberOfMonths(t),
          n = this._daylightSavingAdjust(
            new Date(i, s + (e < 0 ? e : n[0] * n[1]), 1)
          );
        return (
          e < 0 &&
            n.setDate(this._getDaysInMonth(n.getFullYear(), n.getMonth())),
          this._isInRange(t, n)
        );
      },
      _isInRange: function (t, e) {
        var i = this._getMinMaxDate(t, "min"),
          s = this._getMinMaxDate(t, "max"),
          n = null,
          o = null,
          a = this._get(t, "yearRange");
        return (
          a &&
            ((t = a.split(":")),
            (a = new Date().getFullYear()),
            (n = parseInt(t[0], 10)),
            (o = parseInt(t[1], 10)),
            t[0].match(/[+\-].*/) && (n += a),
            t[1].match(/[+\-].*/) && (o += a)),
          (!i || e.getTime() >= i.getTime()) &&
            (!s || e.getTime() <= s.getTime()) &&
            (!n || e.getFullYear() >= n) &&
            (!o || e.getFullYear() <= o)
        );
      },
      _getFormatConfig: function (t) {
        var e = this._get(t, "shortYearCutoff");
        return {
          shortYearCutoff: (e =
            "string" != typeof e
              ? e
              : (new Date().getFullYear() % 100) + parseInt(e, 10)),
          dayNamesShort: this._get(t, "dayNamesShort"),
          dayNames: this._get(t, "dayNames"),
          monthNamesShort: this._get(t, "monthNamesShort"),
          monthNames: this._get(t, "monthNames"),
        };
      },
      _formatDate: function (t, e, i, s) {
        e ||
          ((t.currentDay = t.selectedDay),
          (t.currentMonth = t.selectedMonth),
          (t.currentYear = t.selectedYear));
        e = e
          ? "object" == typeof e
            ? e
            : this._daylightSavingAdjust(new Date(s, i, e))
          : this._daylightSavingAdjust(
              new Date(t.currentYear, t.currentMonth, t.currentDay)
            );
        return this.formatDate(
          this._get(t, "dateFormat"),
          e,
          this._getFormatConfig(t)
        );
      },
    }),
    (k.fn.datepicker = function (t) {
      if (!this.length) return this;
      k.datepicker.initialized ||
        (k(document).on("mousedown", k.datepicker._checkExternalClick),
        (k.datepicker.initialized = !0)),
        0 === k("#" + k.datepicker._mainDivId).length &&
          k("body").append(k.datepicker.dpDiv);
      var e = Array.prototype.slice.call(arguments, 1);
      return ("string" == typeof t &&
        ("isDisabled" === t || "getDate" === t || "widget" === t)) ||
        ("option" === t &&
          2 === arguments.length &&
          "string" == typeof arguments[1])
        ? k.datepicker["_" + t + "Datepicker"].apply(
            k.datepicker,
            [this[0]].concat(e)
          )
        : this.each(function () {
            "string" == typeof t
              ? k.datepicker["_" + t + "Datepicker"].apply(
                  k.datepicker,
                  [this].concat(e)
                )
              : k.datepicker._attachDatepicker(this, t);
          });
    }),
    (k.datepicker = new v()),
    (k.datepicker.initialized = !1),
    (k.datepicker.uuid = new Date().getTime()),
    (k.datepicker.version = "1.12.1");
  k.datepicker;
  k.widget("ui.dialog", {
    version: "1.12.1",
    options: {
      appendTo: "body",
      autoOpen: !0,
      buttons: [],
      classes: {
        "ui-dialog": "ui-corner-all",
        "ui-dialog-titlebar": "ui-corner-all",
      },
      closeOnEscape: !0,
      closeText: "Close",
      draggable: !0,
      hide: null,
      height: "auto",
      maxHeight: null,
      maxWidth: null,
      minHeight: 150,
      minWidth: 150,
      modal: !1,
      position: {
        my: "center",
        at: "center",
        of: window,
        collision: "fit",
        using: function (t) {
          var e = k(this).css(t).offset().top;
          e < 0 && k(this).css("top", t.top - e);
        },
      },
      resizable: !0,
      show: null,
      title: null,
      width: 300,
      beforeClose: null,
      close: null,
      drag: null,
      dragStart: null,
      dragStop: null,
      focus: null,
      open: null,
      resize: null,
      resizeStart: null,
      resizeStop: null,
    },
    sizeRelatedOptions: {
      buttons: !0,
      height: !0,
      maxHeight: !0,
      maxWidth: !0,
      minHeight: !0,
      minWidth: !0,
      width: !0,
    },
    resizableRelatedOptions: {
      maxHeight: !0,
      maxWidth: !0,
      minHeight: !0,
      minWidth: !0,
    },
    _create: function () {
      (this.originalCss = {
        display: this.element[0].style.display,
        width: this.element[0].style.width,
        minHeight: this.element[0].style.minHeight,
        maxHeight: this.element[0].style.maxHeight,
        height: this.element[0].style.height,
      }),
        (this.originalPosition = {
          parent: this.element.parent(),
          index: this.element.parent().children().index(this.element),
        }),
        (this.originalTitle = this.element.attr("title")),
        null == this.options.title &&
          null != this.originalTitle &&
          (this.options.title = this.originalTitle),
        this.options.disabled && (this.options.disabled = !1),
        this._createWrapper(),
        this.element.show().removeAttr("title").appendTo(this.uiDialog),
        this._addClass("ui-dialog-content", "ui-widget-content"),
        this._createTitlebar(),
        this._createButtonPane(),
        this.options.draggable && k.fn.draggable && this._makeDraggable(),
        this.options.resizable && k.fn.resizable && this._makeResizable(),
        (this._isOpen = !1),
        this._trackFocus();
    },
    _init: function () {
      this.options.autoOpen && this.open();
    },
    _appendTo: function () {
      var t = this.options.appendTo;
      return t && (t.jquery || t.nodeType)
        ? k(t)
        : this.document.find(t || "body").eq(0);
    },
    _destroy: function () {
      var t,
        e = this.originalPosition;
      this._untrackInstance(),
        this._destroyOverlay(),
        this.element.removeUniqueId().css(this.originalCss).detach(),
        this.uiDialog.remove(),
        this.originalTitle && this.element.attr("title", this.originalTitle),
        (t = e.parent.children().eq(e.index)).length && t[0] !== this.element[0]
          ? t.before(this.element)
          : e.parent.append(this.element);
    },
    widget: function () {
      return this.uiDialog;
    },
    disable: k.noop,
    enable: k.noop,
    close: function (t) {
      var e = this;
      this._isOpen &&
        !1 !== this._trigger("beforeClose", t) &&
        ((this._isOpen = !1),
        (this._focusedElement = null),
        this._destroyOverlay(),
        this._untrackInstance(),
        this.opener.filter(":focusable").trigger("focus").length ||
          k.ui.safeBlur(k.ui.safeActiveElement(this.document[0])),
        this._hide(this.uiDialog, this.options.hide, function () {
          e._trigger("close", t);
        }));
    },
    isOpen: function () {
      return this._isOpen;
    },
    moveToTop: function () {
      this._moveToTop();
    },
    _moveToTop: function (t, e) {
      var i = !1,
        s = this.uiDialog
          .siblings(".ui-front:visible")
          .map(function () {
            return +k(this).css("z-index");
          })
          .get(),
        s = Math.max.apply(null, s);
      return (
        s >= +this.uiDialog.css("z-index") &&
          (this.uiDialog.css("z-index", s + 1), (i = !0)),
        i && !e && this._trigger("focus", t),
        i
      );
    },
    open: function () {
      var t = this;
      this._isOpen
        ? this._moveToTop() && this._focusTabbable()
        : ((this._isOpen = !0),
          (this.opener = k(k.ui.safeActiveElement(this.document[0]))),
          this._size(),
          this._position(),
          this._createOverlay(),
          this._moveToTop(null, !0),
          this.overlay &&
            this.overlay.css("z-index", this.uiDialog.css("z-index") - 1),
          this._show(this.uiDialog, this.options.show, function () {
            t._focusTabbable(), t._trigger("focus");
          }),
          this._makeFocusTarget(),
          this._trigger("open"));
    },
    _focusTabbable: function () {
      var t = this._focusedElement;
      (t = t || this.element.find("[autofocus]")).length ||
        (t = this.element.find(":tabbable")),
        t.length || (t = this.uiDialogButtonPane.find(":tabbable")),
        t.length || (t = this.uiDialogTitlebarClose.filter(":tabbable")),
        t.length || (t = this.uiDialog),
        t.eq(0).trigger("focus");
    },
    _keepFocus: function (t) {
      function e() {
        var t = k.ui.safeActiveElement(this.document[0]);
        this.uiDialog[0] === t ||
          k.contains(this.uiDialog[0], t) ||
          this._focusTabbable();
      }
      t.preventDefault(), e.call(this), this._delay(e);
    },
    _createWrapper: function () {
      (this.uiDialog = k("<div>")
        .hide()
        .attr({ tabIndex: -1, role: "dialog" })
        .appendTo(this._appendTo())),
        this._addClass(
          this.uiDialog,
          "ui-dialog",
          "ui-widget ui-widget-content ui-front"
        ),
        this._on(this.uiDialog, {
          keydown: function (t) {
            if (
              this.options.closeOnEscape &&
              !t.isDefaultPrevented() &&
              t.keyCode &&
              t.keyCode === k.ui.keyCode.ESCAPE
            )
              return t.preventDefault(), void this.close(t);
            var e, i, s;
            t.keyCode !== k.ui.keyCode.TAB ||
              t.isDefaultPrevented() ||
              ((e = this.uiDialog.find(":tabbable")),
              (i = e.filter(":first")),
              (s = e.filter(":last")),
              (t.target !== s[0] && t.target !== this.uiDialog[0]) || t.shiftKey
                ? (t.target !== i[0] && t.target !== this.uiDialog[0]) ||
                  !t.shiftKey ||
                  (this._delay(function () {
                    s.trigger("focus");
                  }),
                  t.preventDefault())
                : (this._delay(function () {
                    i.trigger("focus");
                  }),
                  t.preventDefault()));
          },
          mousedown: function (t) {
            this._moveToTop(t) && this._focusTabbable();
          },
        }),
        this.element.find("[aria-describedby]").length ||
          this.uiDialog.attr({
            "aria-describedby": this.element.uniqueId().attr("id"),
          });
    },
    _createTitlebar: function () {
      var t;
      (this.uiDialogTitlebar = k("<div>")),
        this._addClass(
          this.uiDialogTitlebar,
          "ui-dialog-titlebar",
          "ui-widget-header ui-helper-clearfix"
        ),
        this._on(this.uiDialogTitlebar, {
          mousedown: function (t) {
            k(t.target).closest(".ui-dialog-titlebar-close") ||
              this.uiDialog.trigger("focus");
          },
        }),
        (this.uiDialogTitlebarClose = k("<button type='button'></button>")
          .button({
            label: k("<a>").text(this.options.closeText).html(),
            icon: "ui-icon-closethick",
            showLabel: !1,
          })
          .appendTo(this.uiDialogTitlebar)),
        this._addClass(this.uiDialogTitlebarClose, "ui-dialog-titlebar-close"),
        this._on(this.uiDialogTitlebarClose, {
          click: function (t) {
            t.preventDefault(), this.close(t);
          },
        }),
        (t = k("<span>").uniqueId().prependTo(this.uiDialogTitlebar)),
        this._addClass(t, "ui-dialog-title"),
        this._title(t),
        this.uiDialogTitlebar.prependTo(this.uiDialog),
        this.uiDialog.attr({ "aria-labelledby": t.attr("id") });
    },
    _title: function (t) {
      this.options.title ? t.text(this.options.title) : t.html("&#160;");
    },
    _createButtonPane: function () {
      (this.uiDialogButtonPane = k("<div>")),
        this._addClass(
          this.uiDialogButtonPane,
          "ui-dialog-buttonpane",
          "ui-widget-content ui-helper-clearfix"
        ),
        (this.uiButtonSet = k("<div>").appendTo(this.uiDialogButtonPane)),
        this._addClass(this.uiButtonSet, "ui-dialog-buttonset"),
        this._createButtons();
    },
    _createButtons: function () {
      var s = this,
        t = this.options.buttons;
      this.uiDialogButtonPane.remove(),
        this.uiButtonSet.empty(),
        k.isEmptyObject(t) || (k.isArray(t) && !t.length)
          ? this._removeClass(this.uiDialog, "ui-dialog-buttons")
          : (k.each(t, function (t, e) {
              var i;
              (e = k.isFunction(e) ? { click: e, text: t } : e),
                (e = k.extend({ type: "button" }, e)),
                (i = e.click),
                (t = {
                  icon: e.icon,
                  iconPosition: e.iconPosition,
                  showLabel: e.showLabel,
                  icons: e.icons,
                  text: e.text,
                }),
                delete e.click,
                delete e.icon,
                delete e.iconPosition,
                delete e.showLabel,
                delete e.icons,
                "boolean" == typeof e.text && delete e.text,
                k("<button></button>", e)
                  .button(t)
                  .appendTo(s.uiButtonSet)
                  .on("click", function () {
                    i.apply(s.element[0], arguments);
                  });
            }),
            this._addClass(this.uiDialog, "ui-dialog-buttons"),
            this.uiDialogButtonPane.appendTo(this.uiDialog));
    },
    _makeDraggable: function () {
      var n = this,
        o = this.options;
      function a(t) {
        return { position: t.position, offset: t.offset };
      }
      this.uiDialog.draggable({
        cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
        handle: ".ui-dialog-titlebar",
        containment: "document",
        start: function (t, e) {
          n._addClass(k(this), "ui-dialog-dragging"),
            n._blockFrames(),
            n._trigger("dragStart", t, a(e));
        },
        drag: function (t, e) {
          n._trigger("drag", t, a(e));
        },
        stop: function (t, e) {
          var i = e.offset.left - n.document.scrollLeft(),
            s = e.offset.top - n.document.scrollTop();
          (o.position = {
            my: "left top",
            at:
              "left" +
              (0 <= i ? "+" : "") +
              i +
              " top" +
              (0 <= s ? "+" : "") +
              s,
            of: n.window,
          }),
            n._removeClass(k(this), "ui-dialog-dragging"),
            n._unblockFrames(),
            n._trigger("dragStop", t, a(e));
        },
      });
    },
    _makeResizable: function () {
      var n = this,
        o = this.options,
        t = o.resizable,
        e = this.uiDialog.css("position"),
        t = "string" == typeof t ? t : "n,e,s,w,se,sw,ne,nw";
      function a(t) {
        return {
          originalPosition: t.originalPosition,
          originalSize: t.originalSize,
          position: t.position,
          size: t.size,
        };
      }
      this.uiDialog
        .resizable({
          cancel: ".ui-dialog-content",
          containment: "document",
          alsoResize: this.element,
          maxWidth: o.maxWidth,
          maxHeight: o.maxHeight,
          minWidth: o.minWidth,
          minHeight: this._minHeight(),
          handles: t,
          start: function (t, e) {
            n._addClass(k(this), "ui-dialog-resizing"),
              n._blockFrames(),
              n._trigger("resizeStart", t, a(e));
          },
          resize: function (t, e) {
            n._trigger("resize", t, a(e));
          },
          stop: function (t, e) {
            var i = n.uiDialog.offset(),
              s = i.left - n.document.scrollLeft(),
              i = i.top - n.document.scrollTop();
            (o.height = n.uiDialog.height()),
              (o.width = n.uiDialog.width()),
              (o.position = {
                my: "left top",
                at:
                  "left" +
                  (0 <= s ? "+" : "") +
                  s +
                  " top" +
                  (0 <= i ? "+" : "") +
                  i,
                of: n.window,
              }),
              n._removeClass(k(this), "ui-dialog-resizing"),
              n._unblockFrames(),
              n._trigger("resizeStop", t, a(e));
          },
        })
        .css("position", e);
    },
    _trackFocus: function () {
      this._on(this.widget(), {
        focusin: function (t) {
          this._makeFocusTarget(), (this._focusedElement = k(t.target));
        },
      });
    },
    _makeFocusTarget: function () {
      this._untrackInstance(), this._trackingInstances().unshift(this);
    },
    _untrackInstance: function () {
      var t = this._trackingInstances(),
        e = k.inArray(this, t);
      -1 !== e && t.splice(e, 1);
    },
    _trackingInstances: function () {
      var t = this.document.data("ui-dialog-instances");
      return t || ((t = []), this.document.data("ui-dialog-instances", t)), t;
    },
    _minHeight: function () {
      var t = this.options;
      return "auto" === t.height
        ? t.minHeight
        : Math.min(t.minHeight, t.height);
    },
    _position: function () {
      var t = this.uiDialog.is(":visible");
      t || this.uiDialog.show(),
        this.uiDialog.position(this.options.position),
        t || this.uiDialog.hide();
    },
    _setOptions: function (t) {
      var i = this,
        s = !1,
        n = {};
      k.each(t, function (t, e) {
        i._setOption(t, e),
          t in i.sizeRelatedOptions && (s = !0),
          t in i.resizableRelatedOptions && (n[t] = e);
      }),
        s && (this._size(), this._position()),
        this.uiDialog.is(":data(ui-resizable)") &&
          this.uiDialog.resizable("option", n);
    },
    _setOption: function (t, e) {
      var i,
        s = this.uiDialog;
      "disabled" !== t &&
        (this._super(t, e),
        "appendTo" === t && this.uiDialog.appendTo(this._appendTo()),
        "buttons" === t && this._createButtons(),
        "closeText" === t &&
          this.uiDialogTitlebarClose.button({
            label: k("<a>")
              .text("" + this.options.closeText)
              .html(),
          }),
        "draggable" === t &&
          ((i = s.is(":data(ui-draggable)")) && !e && s.draggable("destroy"),
          !i && e && this._makeDraggable()),
        "position" === t && this._position(),
        "resizable" === t &&
          ((i = s.is(":data(ui-resizable)")) && !e && s.resizable("destroy"),
          i && "string" == typeof e && s.resizable("option", "handles", e),
          i || !1 === e || this._makeResizable()),
        "title" === t &&
          this._title(this.uiDialogTitlebar.find(".ui-dialog-title")));
    },
    _size: function () {
      var t,
        e,
        i,
        s = this.options;
      this.element
        .show()
        .css({ width: "auto", minHeight: 0, maxHeight: "none", height: 0 }),
        s.minWidth > s.width && (s.width = s.minWidth),
        (t = this.uiDialog
          .css({ height: "auto", width: s.width })
          .outerHeight()),
        (e = Math.max(0, s.minHeight - t)),
        (i =
          "number" == typeof s.maxHeight
            ? Math.max(0, s.maxHeight - t)
            : "none"),
        "auto" === s.height
          ? this.element.css({ minHeight: e, maxHeight: i, height: "auto" })
          : this.element.height(Math.max(0, s.height - t)),
        this.uiDialog.is(":data(ui-resizable)") &&
          this.uiDialog.resizable("option", "minHeight", this._minHeight());
    },
    _blockFrames: function () {
      this.iframeBlocks = this.document.find("iframe").map(function () {
        var t = k(this);
        return k("<div>")
          .css({
            position: "absolute",
            width: t.outerWidth(),
            height: t.outerHeight(),
          })
          .appendTo(t.parent())
          .offset(t.offset())[0];
      });
    },
    _unblockFrames: function () {
      this.iframeBlocks &&
        (this.iframeBlocks.remove(), delete this.iframeBlocks);
    },
    _allowInteraction: function (t) {
      return (
        !!k(t.target).closest(".ui-dialog").length ||
        !!k(t.target).closest(".ui-datepicker").length
      );
    },
    _createOverlay: function () {
      var e;
      this.options.modal &&
        ((e = !0),
        this._delay(function () {
          e = !1;
        }),
        this.document.data("ui-dialog-overlays") ||
          this._on(this.document, {
            focusin: function (t) {
              e ||
                this._allowInteraction(t) ||
                (t.preventDefault(),
                this._trackingInstances()[0]._focusTabbable());
            },
          }),
        (this.overlay = k("<div>").appendTo(this._appendTo())),
        this._addClass(this.overlay, null, "ui-widget-overlay ui-front"),
        this._on(this.overlay, { mousedown: "_keepFocus" }),
        this.document.data(
          "ui-dialog-overlays",
          (this.document.data("ui-dialog-overlays") || 0) + 1
        ));
    },
    _destroyOverlay: function () {
      var t;
      this.options.modal &&
        this.overlay &&
        ((t = this.document.data("ui-dialog-overlays") - 1)
          ? this.document.data("ui-dialog-overlays", t)
          : (this._off(this.document, "focusin"),
            this.document.removeData("ui-dialog-overlays")),
        this.overlay.remove(),
        (this.overlay = null));
    },
  }),
    !1 !== k.uiBackCompat &&
      k.widget("ui.dialog", k.ui.dialog, {
        options: { dialogClass: "" },
        _createWrapper: function () {
          this._super(), this.uiDialog.addClass(this.options.dialogClass);
        },
        _setOption: function (t, e) {
          "dialogClass" === t &&
            this.uiDialog.removeClass(this.options.dialogClass).addClass(e),
            this._superApply(arguments);
        },
      });
  k.ui.dialog,
    k.widget("ui.progressbar", {
      version: "1.12.1",
      options: {
        classes: {
          "ui-progressbar": "ui-corner-all",
          "ui-progressbar-value": "ui-corner-left",
          "ui-progressbar-complete": "ui-corner-right",
        },
        max: 100,
        value: 0,
        change: null,
        complete: null,
      },
      min: 0,
      _create: function () {
        (this.oldValue = this.options.value = this._constrainedValue()),
          this.element.attr({ role: "progressbar", "aria-valuemin": this.min }),
          this._addClass("ui-progressbar", "ui-widget ui-widget-content"),
          (this.valueDiv = k("<div>").appendTo(this.element)),
          this._addClass(
            this.valueDiv,
            "ui-progressbar-value",
            "ui-widget-header"
          ),
          this._refreshValue();
      },
      _destroy: function () {
        this.element.removeAttr(
          "role aria-valuemin aria-valuemax aria-valuenow"
        ),
          this.valueDiv.remove();
      },
      value: function (t) {
        if (void 0 === t) return this.options.value;
        (this.options.value = this._constrainedValue(t)), this._refreshValue();
      },
      _constrainedValue: function (t) {
        return (
          void 0 === t && (t = this.options.value),
          (this.indeterminate = !1 === t),
          "number" != typeof t && (t = 0),
          !this.indeterminate &&
            Math.min(this.options.max, Math.max(this.min, t))
        );
      },
      _setOptions: function (t) {
        var e = t.value;
        delete t.value,
          this._super(t),
          (this.options.value = this._constrainedValue(e)),
          this._refreshValue();
      },
      _setOption: function (t, e) {
        "max" === t && (e = Math.max(this.min, e)), this._super(t, e);
      },
      _setOptionDisabled: function (t) {
        this._super(t),
          this.element.attr("aria-disabled", t),
          this._toggleClass(null, "ui-state-disabled", !!t);
      },
      _percentage: function () {
        return this.indeterminate
          ? 100
          : (100 * (this.options.value - this.min)) /
              (this.options.max - this.min);
      },
      _refreshValue: function () {
        var t = this.options.value,
          e = this._percentage();
        this.valueDiv
          .toggle(this.indeterminate || t > this.min)
          .width(e.toFixed(0) + "%"),
          this._toggleClass(
            this.valueDiv,
            "ui-progressbar-complete",
            null,
            t === this.options.max
          )._toggleClass(
            "ui-progressbar-indeterminate",
            null,
            this.indeterminate
          ),
          this.indeterminate
            ? (this.element.removeAttr("aria-valuenow"),
              this.overlayDiv ||
                ((this.overlayDiv = k("<div>").appendTo(this.valueDiv)),
                this._addClass(this.overlayDiv, "ui-progressbar-overlay")))
            : (this.element.attr({
                "aria-valuemax": this.options.max,
                "aria-valuenow": t,
              }),
              this.overlayDiv &&
                (this.overlayDiv.remove(), (this.overlayDiv = null))),
          this.oldValue !== t && ((this.oldValue = t), this._trigger("change")),
          t === this.options.max && this._trigger("complete");
      },
    }),
    k.widget("ui.selectmenu", [
      k.ui.formResetMixin,
      {
        version: "1.12.1",
        defaultElement: "<select>",
        options: {
          appendTo: null,
          classes: {
            "ui-selectmenu-button-open": "ui-corner-top",
            "ui-selectmenu-button-closed": "ui-corner-all",
          },
          disabled: null,
          icons: { button: "ui-icon-triangle-1-s" },
          position: { my: "left top", at: "left bottom", collision: "none" },
          width: !1,
          change: null,
          close: null,
          focus: null,
          open: null,
          select: null,
        },
        _create: function () {
          var t = this.element.uniqueId().attr("id");
          (this.ids = { element: t, button: t + "-button", menu: t + "-menu" }),
            this._drawButton(),
            this._drawMenu(),
            this._bindFormResetHandler(),
            (this._rendered = !1),
            (this.menuItems = k());
        },
        _drawButton: function () {
          var t,
            e = this,
            i = this._parseOption(
              this.element.find("option:selected"),
              this.element[0].selectedIndex
            );
          (this.labels = this.element.labels().attr("for", this.ids.button)),
            this._on(this.labels, {
              click: function (t) {
                this.button.focus(), t.preventDefault();
              },
            }),
            this.element.hide(),
            (this.button = k("<span>", {
              tabindex: this.options.disabled ? -1 : 0,
              id: this.ids.button,
              role: "combobox",
              "aria-expanded": "false",
              "aria-autocomplete": "list",
              "aria-owns": this.ids.menu,
              "aria-haspopup": "true",
              title: this.element.attr("title"),
            }).insertAfter(this.element)),
            this._addClass(
              this.button,
              "ui-selectmenu-button ui-selectmenu-button-closed",
              "ui-button ui-widget"
            ),
            (t = k("<span>").appendTo(this.button)),
            this._addClass(
              t,
              "ui-selectmenu-icon",
              "ui-icon " + this.options.icons.button
            ),
            (this.buttonItem = this._renderButtonItem(i).appendTo(this.button)),
            !1 !== this.options.width && this._resizeButton(),
            this._on(this.button, this._buttonEvents),
            this.button.one("focusin", function () {
              e._rendered || e._refreshMenu();
            });
        },
        _drawMenu: function () {
          var i = this;
          (this.menu = k("<ul>", {
            "aria-hidden": "true",
            "aria-labelledby": this.ids.button,
            id: this.ids.menu,
          })),
            (this.menuWrap = k("<div>").append(this.menu)),
            this._addClass(this.menuWrap, "ui-selectmenu-menu", "ui-front"),
            this.menuWrap.appendTo(this._appendTo()),
            (this.menuInstance = this.menu
              .menu({
                classes: { "ui-menu": "ui-corner-bottom" },
                role: "listbox",
                select: function (t, e) {
                  t.preventDefault(),
                    i._setSelection(),
                    i._select(e.item.data("ui-selectmenu-item"), t);
                },
                focus: function (t, e) {
                  e = e.item.data("ui-selectmenu-item");
                  null != i.focusIndex &&
                    e.index !== i.focusIndex &&
                    (i._trigger("focus", t, { item: e }),
                    i.isOpen || i._select(e, t)),
                    (i.focusIndex = e.index),
                    i.button.attr(
                      "aria-activedescendant",
                      i.menuItems.eq(e.index).attr("id")
                    );
                },
              })
              .menu("instance")),
            this.menuInstance._off(this.menu, "mouseleave"),
            (this.menuInstance._closeOnDocumentClick = function () {
              return !1;
            }),
            (this.menuInstance._isDivider = function () {
              return !1;
            });
        },
        refresh: function () {
          this._refreshMenu(),
            this.buttonItem.replaceWith(
              (this.buttonItem = this._renderButtonItem(
                this._getSelectedItem().data("ui-selectmenu-item") || {}
              ))
            ),
            null === this.options.width && this._resizeButton();
        },
        _refreshMenu: function () {
          var t = this.element.find("option");
          this.menu.empty(),
            this._parseOptions(t),
            this._renderMenu(this.menu, this.items),
            this.menuInstance.refresh(),
            (this.menuItems = this.menu
              .find("li")
              .not(".ui-selectmenu-optgroup")
              .find(".ui-menu-item-wrapper")),
            (this._rendered = !0),
            t.length &&
              ((t = this._getSelectedItem()),
              this.menuInstance.focus(null, t),
              this._setAria(t.data("ui-selectmenu-item")),
              this._setOption("disabled", this.element.prop("disabled")));
        },
        open: function (t) {
          this.options.disabled ||
            (this._rendered
              ? (this._removeClass(
                  this.menu.find(".ui-state-active"),
                  null,
                  "ui-state-active"
                ),
                this.menuInstance.focus(null, this._getSelectedItem()))
              : this._refreshMenu(),
            this.menuItems.length &&
              ((this.isOpen = !0),
              this._toggleAttr(),
              this._resizeMenu(),
              this._position(),
              this._on(this.document, this._documentClick),
              this._trigger("open", t)));
        },
        _position: function () {
          this.menuWrap.position(
            k.extend({ of: this.button }, this.options.position)
          );
        },
        close: function (t) {
          this.isOpen &&
            ((this.isOpen = !1),
            this._toggleAttr(),
            (this.range = null),
            this._off(this.document),
            this._trigger("close", t));
        },
        widget: function () {
          return this.button;
        },
        menuWidget: function () {
          return this.menu;
        },
        _renderButtonItem: function (t) {
          var e = k("<span>");
          return (
            this._setText(e, t.label),
            this._addClass(e, "ui-selectmenu-text"),
            e
          );
        },
        _renderMenu: function (s, t) {
          var n = this,
            o = "";
          k.each(t, function (t, e) {
            var i;
            e.optgroup !== o &&
              ((i = k("<li>", { text: e.optgroup })),
              n._addClass(
                i,
                "ui-selectmenu-optgroup",
                "ui-menu-divider" +
                  (e.element.parent("optgroup").prop("disabled")
                    ? " ui-state-disabled"
                    : "")
              ),
              i.appendTo(s),
              (o = e.optgroup)),
              n._renderItemData(s, e);
          });
        },
        _renderItemData: function (t, e) {
          return this._renderItem(t, e).data("ui-selectmenu-item", e);
        },
        _renderItem: function (t, e) {
          var i = k("<li>"),
            s = k("<div>", { title: e.element.attr("title") });
          return (
            e.disabled && this._addClass(i, null, "ui-state-disabled"),
            this._setText(s, e.label),
            i.append(s).appendTo(t)
          );
        },
        _setText: function (t, e) {
          e ? t.text(e) : t.html("&#160;");
        },
        _move: function (t, e) {
          var i,
            s = ".ui-menu-item";
          this.isOpen
            ? (i = this.menuItems.eq(this.focusIndex).parent("li"))
            : ((i = this.menuItems
                .eq(this.element[0].selectedIndex)
                .parent("li")),
              (s += ":not(.ui-state-disabled)")),
            (s =
              "first" === t || "last" === t
                ? i["first" === t ? "prevAll" : "nextAll"](s).eq(-1)
                : i[t + "All"](s).eq(0)).length &&
              this.menuInstance.focus(e, s);
        },
        _getSelectedItem: function () {
          return this.menuItems.eq(this.element[0].selectedIndex).parent("li");
        },
        _toggle: function (t) {
          this[this.isOpen ? "close" : "open"](t);
        },
        _setSelection: function () {
          var t;
          this.range &&
            (window.getSelection
              ? ((t = window.getSelection()).removeAllRanges(),
                t.addRange(this.range))
              : this.range.select(),
            this.button.focus());
        },
        _documentClick: {
          mousedown: function (t) {
            this.isOpen &&
              (k(t.target).closest(
                ".ui-selectmenu-menu, #" + k.ui.escapeSelector(this.ids.button)
              ).length ||
                this.close(t));
          },
        },
        _buttonEvents: {
          mousedown: function () {
            var t;
            window.getSelection
              ? (t = window.getSelection()).rangeCount &&
                (this.range = t.getRangeAt(0))
              : (this.range = document.selection.createRange());
          },
          click: function (t) {
            this._setSelection(), this._toggle(t);
          },
          keydown: function (t) {
            var e = !0;
            switch (t.keyCode) {
              case k.ui.keyCode.TAB:
              case k.ui.keyCode.ESCAPE:
                this.close(t), (e = !1);
                break;
              case k.ui.keyCode.ENTER:
                this.isOpen && this._selectFocusedItem(t);
                break;
              case k.ui.keyCode.UP:
                t.altKey ? this._toggle(t) : this._move("prev", t);
                break;
              case k.ui.keyCode.DOWN:
                t.altKey ? this._toggle(t) : this._move("next", t);
                break;
              case k.ui.keyCode.SPACE:
                this.isOpen ? this._selectFocusedItem(t) : this._toggle(t);
                break;
              case k.ui.keyCode.LEFT:
                this._move("prev", t);
                break;
              case k.ui.keyCode.RIGHT:
                this._move("next", t);
                break;
              case k.ui.keyCode.HOME:
              case k.ui.keyCode.PAGE_UP:
                this._move("first", t);
                break;
              case k.ui.keyCode.END:
              case k.ui.keyCode.PAGE_DOWN:
                this._move("last", t);
                break;
              default:
                this.menu.trigger(t), (e = !1);
            }
            e && t.preventDefault();
          },
        },
        _selectFocusedItem: function (t) {
          var e = this.menuItems.eq(this.focusIndex).parent("li");
          e.hasClass("ui-state-disabled") ||
            this._select(e.data("ui-selectmenu-item"), t);
        },
        _select: function (t, e) {
          var i = this.element[0].selectedIndex;
          (this.element[0].selectedIndex = t.index),
            this.buttonItem.replaceWith(
              (this.buttonItem = this._renderButtonItem(t))
            ),
            this._setAria(t),
            this._trigger("select", e, { item: t }),
            t.index !== i && this._trigger("change", e, { item: t }),
            this.close(e);
        },
        _setAria: function (t) {
          t = this.menuItems.eq(t.index).attr("id");
          this.button.attr({
            "aria-labelledby": t,
            "aria-activedescendant": t,
          }),
            this.menu.attr("aria-activedescendant", t);
        },
        _setOption: function (t, e) {
          var i;
          "icons" === t &&
            ((i = this.button.find("span.ui-icon")),
            this._removeClass(i, null, this.options.icons.button)._addClass(
              i,
              null,
              e.button
            )),
            this._super(t, e),
            "appendTo" === t && this.menuWrap.appendTo(this._appendTo()),
            "width" === t && this._resizeButton();
        },
        _setOptionDisabled: function (t) {
          this._super(t),
            this.menuInstance.option("disabled", t),
            this.button.attr("aria-disabled", t),
            this._toggleClass(this.button, null, "ui-state-disabled", t),
            this.element.prop("disabled", t),
            t
              ? (this.button.attr("tabindex", -1), this.close())
              : this.button.attr("tabindex", 0);
        },
        _appendTo: function () {
          var t = this.options.appendTo;
          return (
            ((t =
              t &&
              (t.jquery || t.nodeType ? k(t) : this.document.find(t).eq(0))) &&
              t[0]) ||
              (t = this.element.closest(".ui-front, dialog")),
            t.length || (t = this.document[0].body),
            t
          );
        },
        _toggleAttr: function () {
          this.button.attr("aria-expanded", this.isOpen),
            this._removeClass(
              this.button,
              "ui-selectmenu-button-" + (this.isOpen ? "closed" : "open")
            )
              ._addClass(
                this.button,
                "ui-selectmenu-button-" + (this.isOpen ? "open" : "closed")
              )
              ._toggleClass(
                this.menuWrap,
                "ui-selectmenu-open",
                null,
                this.isOpen
              ),
            this.menu.attr("aria-hidden", !this.isOpen);
        },
        _resizeButton: function () {
          var t = this.options.width;
          !1 !== t
            ? (null === t &&
                ((t = this.element.show().outerWidth()), this.element.hide()),
              this.button.outerWidth(t))
            : this.button.css("width", "");
        },
        _resizeMenu: function () {
          this.menu.outerWidth(
            Math.max(
              this.button.outerWidth(),
              this.menu.width("").outerWidth() + 1
            )
          );
        },
        _getCreateOptions: function () {
          var t = this._super();
          return (t.disabled = this.element.prop("disabled")), t;
        },
        _parseOptions: function (t) {
          var i = this,
            s = [];
          t.each(function (t, e) {
            s.push(i._parseOption(k(e), t));
          }),
            (this.items = s);
        },
        _parseOption: function (t, e) {
          var i = t.parent("optgroup");
          return {
            element: t,
            index: e,
            value: t.val(),
            label: t.text(),
            optgroup: i.attr("label") || "",
            disabled: i.prop("disabled") || t.prop("disabled"),
          };
        },
        _destroy: function () {
          this._unbindFormResetHandler(),
            this.menuWrap.remove(),
            this.button.remove(),
            this.element.show(),
            this.element.removeUniqueId(),
            this.labels.attr("for", this.ids.element);
        },
      },
    ]),
    k.widget("ui.slider", k.ui.mouse, {
      version: "1.12.1",
      widgetEventPrefix: "slide",
      options: {
        animate: !1,
        classes: {
          "ui-slider": "ui-corner-all",
          "ui-slider-handle": "ui-corner-all",
          "ui-slider-range": "ui-corner-all ui-widget-header",
        },
        distance: 0,
        max: 100,
        min: 0,
        orientation: "horizontal",
        range: !1,
        step: 1,
        value: 0,
        values: null,
        change: null,
        slide: null,
        start: null,
        stop: null,
      },
      numPages: 5,
      _create: function () {
        (this._keySliding = !1),
          (this._mouseSliding = !1),
          (this._animateOff = !0),
          (this._handleIndex = null),
          this._detectOrientation(),
          this._mouseInit(),
          this._calculateNewMax(),
          this._addClass(
            "ui-slider ui-slider-" + this.orientation,
            "ui-widget ui-widget-content"
          ),
          this._refresh(),
          (this._animateOff = !1);
      },
      _refresh: function () {
        this._createRange(),
          this._createHandles(),
          this._setupEvents(),
          this._refreshValue();
      },
      _createHandles: function () {
        var t,
          e = this.options,
          i = this.element.find(".ui-slider-handle"),
          s = [],
          n = (e.values && e.values.length) || 1;
        for (
          i.length > n && (i.slice(n).remove(), (i = i.slice(0, n))),
            t = i.length;
          t < n;
          t++
        )
          s.push("<span tabindex='0'></span>");
        (this.handles = i.add(k(s.join("")).appendTo(this.element))),
          this._addClass(this.handles, "ui-slider-handle", "ui-state-default"),
          (this.handle = this.handles.eq(0)),
          this.handles.each(function (t) {
            k(this).data("ui-slider-handle-index", t).attr("tabIndex", 0);
          });
      },
      _createRange: function () {
        var t = this.options;
        t.range
          ? (!0 === t.range &&
              (t.values
                ? t.values.length && 2 !== t.values.length
                  ? (t.values = [t.values[0], t.values[0]])
                  : k.isArray(t.values) && (t.values = t.values.slice(0))
                : (t.values = [this._valueMin(), this._valueMin()])),
            this.range && this.range.length
              ? (this._removeClass(
                  this.range,
                  "ui-slider-range-min ui-slider-range-max"
                ),
                this.range.css({ left: "", bottom: "" }))
              : ((this.range = k("<div>").appendTo(this.element)),
                this._addClass(this.range, "ui-slider-range")),
            ("min" !== t.range && "max" !== t.range) ||
              this._addClass(this.range, "ui-slider-range-" + t.range))
          : (this.range && this.range.remove(), (this.range = null));
      },
      _setupEvents: function () {
        this._off(this.handles),
          this._on(this.handles, this._handleEvents),
          this._hoverable(this.handles),
          this._focusable(this.handles);
      },
      _destroy: function () {
        this.handles.remove(),
          this.range && this.range.remove(),
          this._mouseDestroy();
      },
      _mouseCapture: function (t) {
        var i,
          s,
          n,
          o,
          e,
          a,
          r = this,
          h = this.options;
        return (
          !h.disabled &&
          ((this.elementSize = {
            width: this.element.outerWidth(),
            height: this.element.outerHeight(),
          }),
          (this.elementOffset = this.element.offset()),
          (a = { x: t.pageX, y: t.pageY }),
          (i = this._normValueFromMouse(a)),
          (s = this._valueMax() - this._valueMin() + 1),
          this.handles.each(function (t) {
            var e = Math.abs(i - r.values(t));
            (e < s ||
              (s === e &&
                (t === r._lastChangedValue || r.values(t) === h.min))) &&
              ((s = e), (n = k(this)), (o = t));
          }),
          !1 !== this._start(t, o) &&
            ((this._mouseSliding = !0),
            (this._handleIndex = o),
            this._addClass(n, null, "ui-state-active"),
            n.trigger("focus"),
            (e = n.offset()),
            (a = !k(t.target).parents().addBack().is(".ui-slider-handle")),
            (this._clickOffset = a
              ? { left: 0, top: 0 }
              : {
                  left: t.pageX - e.left - n.width() / 2,
                  top:
                    t.pageY -
                    e.top -
                    n.height() / 2 -
                    (parseInt(n.css("borderTopWidth"), 10) || 0) -
                    (parseInt(n.css("borderBottomWidth"), 10) || 0) +
                    (parseInt(n.css("marginTop"), 10) || 0),
                }),
            this.handles.hasClass("ui-state-hover") || this._slide(t, o, i),
            (this._animateOff = !0)))
        );
      },
      _mouseStart: function () {
        return !0;
      },
      _mouseDrag: function (t) {
        var e = { x: t.pageX, y: t.pageY },
          e = this._normValueFromMouse(e);
        return this._slide(t, this._handleIndex, e), !1;
      },
      _mouseStop: function (t) {
        return (
          this._removeClass(this.handles, null, "ui-state-active"),
          (this._mouseSliding = !1),
          this._stop(t, this._handleIndex),
          this._change(t, this._handleIndex),
          (this._handleIndex = null),
          (this._clickOffset = null),
          (this._animateOff = !1)
        );
      },
      _detectOrientation: function () {
        this.orientation =
          "vertical" === this.options.orientation ? "vertical" : "horizontal";
      },
      _normValueFromMouse: function (t) {
        var e,
          t =
            "horizontal" === this.orientation
              ? ((e = this.elementSize.width),
                t.x -
                  this.elementOffset.left -
                  (this._clickOffset ? this._clickOffset.left : 0))
              : ((e = this.elementSize.height),
                t.y -
                  this.elementOffset.top -
                  (this._clickOffset ? this._clickOffset.top : 0)),
          t = t / e;
        return (
          1 < t && (t = 1),
          t < 0 && (t = 0),
          "vertical" === this.orientation && (t = 1 - t),
          (e = this._valueMax() - this._valueMin()),
          (e = this._valueMin() + t * e),
          this._trimAlignValue(e)
        );
      },
      _uiHash: function (t, e, i) {
        var s = {
          handle: this.handles[t],
          handleIndex: t,
          value: void 0 !== e ? e : this.value(),
        };
        return (
          this._hasMultipleValues() &&
            ((s.value = void 0 !== e ? e : this.values(t)),
            (s.values = i || this.values())),
          s
        );
      },
      _hasMultipleValues: function () {
        return this.options.values && this.options.values.length;
      },
      _start: function (t, e) {
        return this._trigger("start", t, this._uiHash(e));
      },
      _slide: function (t, e, i) {
        var s,
          n = this.value(),
          o = this.values();
        this._hasMultipleValues() &&
          ((s = this.values(e ? 0 : 1)),
          (n = this.values(e)),
          2 === this.options.values.length &&
            !0 === this.options.range &&
            (i = 0 === e ? Math.min(s, i) : Math.max(s, i)),
          (o[e] = i)),
          i !== n &&
            !1 !== this._trigger("slide", t, this._uiHash(e, i, o)) &&
            (this._hasMultipleValues() ? this.values(e, i) : this.value(i));
      },
      _stop: function (t, e) {
        this._trigger("stop", t, this._uiHash(e));
      },
      _change: function (t, e) {
        this._keySliding ||
          this._mouseSliding ||
          ((this._lastChangedValue = e),
          this._trigger("change", t, this._uiHash(e)));
      },
      value: function (t) {
        return arguments.length
          ? ((this.options.value = this._trimAlignValue(t)),
            this._refreshValue(),
            void this._change(null, 0))
          : this._value();
      },
      values: function (t, e) {
        var i, s, n;
        if (1 < arguments.length)
          return (
            (this.options.values[t] = this._trimAlignValue(e)),
            this._refreshValue(),
            void this._change(null, t)
          );
        if (!arguments.length) return this._values();
        if (!k.isArray(t))
          return this._hasMultipleValues() ? this._values(t) : this.value();
        for (i = this.options.values, s = t, n = 0; n < i.length; n += 1)
          (i[n] = this._trimAlignValue(s[n])), this._change(null, n);
        this._refreshValue();
      },
      _setOption: function (t, e) {
        var i,
          s = 0;
        switch (
          ("range" === t &&
            !0 === this.options.range &&
            ("min" === e
              ? ((this.options.value = this._values(0)),
                (this.options.values = null))
              : "max" === e &&
                ((this.options.value = this._values(
                  this.options.values.length - 1
                )),
                (this.options.values = null))),
          k.isArray(this.options.values) && (s = this.options.values.length),
          this._super(t, e),
          t)
        ) {
          case "orientation":
            this._detectOrientation(),
              this._removeClass(
                "ui-slider-horizontal ui-slider-vertical"
              )._addClass("ui-slider-" + this.orientation),
              this._refreshValue(),
              this.options.range && this._refreshRange(e),
              this.handles.css("horizontal" === e ? "bottom" : "left", "");
            break;
          case "value":
            (this._animateOff = !0),
              this._refreshValue(),
              this._change(null, 0),
              (this._animateOff = !1);
            break;
          case "values":
            for (
              this._animateOff = !0, this._refreshValue(), i = s - 1;
              0 <= i;
              i--
            )
              this._change(null, i);
            this._animateOff = !1;
            break;
          case "step":
          case "min":
          case "max":
            (this._animateOff = !0),
              this._calculateNewMax(),
              this._refreshValue(),
              (this._animateOff = !1);
            break;
          case "range":
            (this._animateOff = !0), this._refresh(), (this._animateOff = !1);
        }
      },
      _setOptionDisabled: function (t) {
        this._super(t), this._toggleClass(null, "ui-state-disabled", !!t);
      },
      _value: function () {
        var t = this.options.value;
        return (t = this._trimAlignValue(t));
      },
      _values: function (t) {
        var e, i, s;
        if (arguments.length)
          return (e = this.options.values[t]), this._trimAlignValue(e);
        if (this._hasMultipleValues()) {
          for (i = this.options.values.slice(), s = 0; s < i.length; s += 1)
            i[s] = this._trimAlignValue(i[s]);
          return i;
        }
        return [];
      },
      _trimAlignValue: function (t) {
        if (t <= this._valueMin()) return this._valueMin();
        if (t >= this._valueMax()) return this._valueMax();
        var e = 0 < this.options.step ? this.options.step : 1,
          i = (t - this._valueMin()) % e,
          t = t - i;
        return (
          2 * Math.abs(i) >= e && (t += 0 < i ? e : -e),
          parseFloat(t.toFixed(5))
        );
      },
      _calculateNewMax: function () {
        var t = this.options.max,
          e = this._valueMin(),
          i = this.options.step;
        (t = Math.round((t - e) / i) * i + e) > this.options.max && (t -= i),
          (this.max = parseFloat(t.toFixed(this._precision())));
      },
      _precision: function () {
        var t = this._precisionOf(this.options.step);
        return (
          null !== this.options.min &&
            (t = Math.max(t, this._precisionOf(this.options.min))),
          t
        );
      },
      _precisionOf: function (t) {
        var e = t.toString(),
          t = e.indexOf(".");
        return -1 === t ? 0 : e.length - t - 1;
      },
      _valueMin: function () {
        return this.options.min;
      },
      _valueMax: function () {
        return this.max;
      },
      _refreshRange: function (t) {
        "vertical" === t && this.range.css({ width: "", left: "" }),
          "horizontal" === t && this.range.css({ height: "", bottom: "" });
      },
      _refreshValue: function () {
        var e,
          i,
          t,
          s,
          n,
          o = this.options.range,
          a = this.options,
          r = this,
          h = !this._animateOff && a.animate,
          l = {};
        this._hasMultipleValues()
          ? this.handles.each(function (t) {
              (i =
                ((r.values(t) - r._valueMin()) /
                  (r._valueMax() - r._valueMin())) *
                100),
                (l["horizontal" === r.orientation ? "left" : "bottom"] =
                  i + "%"),
                k(this).stop(1, 1)[h ? "animate" : "css"](l, a.animate),
                !0 === r.options.range &&
                  ("horizontal" === r.orientation
                    ? (0 === t &&
                        r.range
                          .stop(1, 1)
                          [h ? "animate" : "css"]({ left: i + "%" }, a.animate),
                      1 === t &&
                        r.range[h ? "animate" : "css"](
                          { width: i - e + "%" },
                          { queue: !1, duration: a.animate }
                        ))
                    : (0 === t &&
                        r.range
                          .stop(1, 1)
                          [h ? "animate" : "css"](
                            { bottom: i + "%" },
                            a.animate
                          ),
                      1 === t &&
                        r.range[h ? "animate" : "css"](
                          { height: i - e + "%" },
                          { queue: !1, duration: a.animate }
                        ))),
                (e = i);
            })
          : ((t = this.value()),
            (s = this._valueMin()),
            (n = this._valueMax()),
            (i = n !== s ? ((t - s) / (n - s)) * 100 : 0),
            (l["horizontal" === this.orientation ? "left" : "bottom"] =
              i + "%"),
            this.handle.stop(1, 1)[h ? "animate" : "css"](l, a.animate),
            "min" === o &&
              "horizontal" === this.orientation &&
              this.range
                .stop(1, 1)
                [h ? "animate" : "css"]({ width: i + "%" }, a.animate),
            "max" === o &&
              "horizontal" === this.orientation &&
              this.range
                .stop(1, 1)
                [h ? "animate" : "css"]({ width: 100 - i + "%" }, a.animate),
            "min" === o &&
              "vertical" === this.orientation &&
              this.range
                .stop(1, 1)
                [h ? "animate" : "css"]({ height: i + "%" }, a.animate),
            "max" === o &&
              "vertical" === this.orientation &&
              this.range
                .stop(1, 1)
                [h ? "animate" : "css"]({ height: 100 - i + "%" }, a.animate));
      },
      _handleEvents: {
        keydown: function (t) {
          var e,
            i,
            s,
            n = k(t.target).data("ui-slider-handle-index");
          switch (t.keyCode) {
            case k.ui.keyCode.HOME:
            case k.ui.keyCode.END:
            case k.ui.keyCode.PAGE_UP:
            case k.ui.keyCode.PAGE_DOWN:
            case k.ui.keyCode.UP:
            case k.ui.keyCode.RIGHT:
            case k.ui.keyCode.DOWN:
            case k.ui.keyCode.LEFT:
              if (
                (t.preventDefault(),
                !this._keySliding &&
                  ((this._keySliding = !0),
                  this._addClass(k(t.target), null, "ui-state-active"),
                  !1 === this._start(t, n)))
              )
                return;
          }
          switch (
            ((s = this.options.step),
            (e = i = this._hasMultipleValues() ? this.values(n) : this.value()),
            t.keyCode)
          ) {
            case k.ui.keyCode.HOME:
              i = this._valueMin();
              break;
            case k.ui.keyCode.END:
              i = this._valueMax();
              break;
            case k.ui.keyCode.PAGE_UP:
              i = this._trimAlignValue(
                e + (this._valueMax() - this._valueMin()) / this.numPages
              );
              break;
            case k.ui.keyCode.PAGE_DOWN:
              i = this._trimAlignValue(
                e - (this._valueMax() - this._valueMin()) / this.numPages
              );
              break;
            case k.ui.keyCode.UP:
            case k.ui.keyCode.RIGHT:
              if (e === this._valueMax()) return;
              i = this._trimAlignValue(e + s);
              break;
            case k.ui.keyCode.DOWN:
            case k.ui.keyCode.LEFT:
              if (e === this._valueMin()) return;
              i = this._trimAlignValue(e - s);
          }
          this._slide(t, n, i);
        },
        keyup: function (t) {
          var e = k(t.target).data("ui-slider-handle-index");
          this._keySliding &&
            ((this._keySliding = !1),
            this._stop(t, e),
            this._change(t, e),
            this._removeClass(k(t.target), null, "ui-state-active"));
        },
      },
    });
  function T(e) {
    return function () {
      var t = this.element.val();
      e.apply(this, arguments),
        this._refresh(),
        t !== this.element.val() && this._trigger("change");
    };
  }
  k.widget("ui.spinner", {
    version: "1.12.1",
    defaultElement: "<input>",
    widgetEventPrefix: "spin",
    options: {
      classes: {
        "ui-spinner": "ui-corner-all",
        "ui-spinner-down": "ui-corner-br",
        "ui-spinner-up": "ui-corner-tr",
      },
      culture: null,
      icons: { down: "ui-icon-triangle-1-s", up: "ui-icon-triangle-1-n" },
      incremental: !0,
      max: null,
      min: null,
      numberFormat: null,
      page: 10,
      step: 1,
      change: null,
      spin: null,
      start: null,
      stop: null,
    },
    _create: function () {
      this._setOption("max", this.options.max),
        this._setOption("min", this.options.min),
        this._setOption("step", this.options.step),
        "" !== this.value() && this._value(this.element.val(), !0),
        this._draw(),
        this._on(this._events),
        this._refresh(),
        this._on(this.window, {
          beforeunload: function () {
            this.element.removeAttr("autocomplete");
          },
        });
    },
    _getCreateOptions: function () {
      var s = this._super(),
        n = this.element;
      return (
        k.each(["min", "max", "step"], function (t, e) {
          var i = n.attr(e);
          null != i && i.length && (s[e] = i);
        }),
        s
      );
    },
    _events: {
      keydown: function (t) {
        this._start(t) && this._keydown(t) && t.preventDefault();
      },
      keyup: "_stop",
      focus: function () {
        this.previous = this.element.val();
      },
      blur: function (t) {
        this.cancelBlur
          ? delete this.cancelBlur
          : (this._stop(),
            this._refresh(),
            this.previous !== this.element.val() && this._trigger("change", t));
      },
      mousewheel: function (t, e) {
        if (e) {
          if (!this.spinning && !this._start(t)) return !1;
          this._spin((0 < e ? 1 : -1) * this.options.step, t),
            clearTimeout(this.mousewheelTimer),
            (this.mousewheelTimer = this._delay(function () {
              this.spinning && this._stop(t);
            }, 100)),
            t.preventDefault();
        }
      },
      "mousedown .ui-spinner-button": function (t) {
        var e;
        function i() {
          this.element[0] === k.ui.safeActiveElement(this.document[0]) ||
            (this.element.trigger("focus"),
            (this.previous = e),
            this._delay(function () {
              this.previous = e;
            }));
        }
        (e =
          this.element[0] === k.ui.safeActiveElement(this.document[0])
            ? this.previous
            : this.element.val()),
          t.preventDefault(),
          i.call(this),
          (this.cancelBlur = !0),
          this._delay(function () {
            delete this.cancelBlur, i.call(this);
          }),
          !1 !== this._start(t) &&
            this._repeat(
              null,
              k(t.currentTarget).hasClass("ui-spinner-up") ? 1 : -1,
              t
            );
      },
      "mouseup .ui-spinner-button": "_stop",
      "mouseenter .ui-spinner-button": function (t) {
        if (k(t.currentTarget).hasClass("ui-state-active"))
          return (
            !1 !== this._start(t) &&
            void this._repeat(
              null,
              k(t.currentTarget).hasClass("ui-spinner-up") ? 1 : -1,
              t
            )
          );
      },
      "mouseleave .ui-spinner-button": "_stop",
    },
    _enhance: function () {
      this.uiSpinner = this.element
        .attr("autocomplete", "off")
        .wrap("<span>")
        .parent()
        .append("<a></a><a></a>");
    },
    _draw: function () {
      this._enhance(),
        this._addClass(
          this.uiSpinner,
          "ui-spinner",
          "ui-widget ui-widget-content"
        ),
        this._addClass("ui-spinner-input"),
        this.element.attr("role", "spinbutton"),
        (this.buttons = this.uiSpinner
          .children("a")
          .attr("tabIndex", -1)
          .attr("aria-hidden", !0)
          .button({ classes: { "ui-button": "" } })),
        this._removeClass(this.buttons, "ui-corner-all"),
        this._addClass(this.buttons.first(), "ui-spinner-button ui-spinner-up"),
        this._addClass(
          this.buttons.last(),
          "ui-spinner-button ui-spinner-down"
        ),
        this.buttons
          .first()
          .button({ icon: this.options.icons.up, showLabel: !1 }),
        this.buttons
          .last()
          .button({ icon: this.options.icons.down, showLabel: !1 }),
        this.buttons.height() > Math.ceil(0.5 * this.uiSpinner.height()) &&
          0 < this.uiSpinner.height() &&
          this.uiSpinner.height(this.uiSpinner.height());
    },
    _keydown: function (t) {
      var e = this.options,
        i = k.ui.keyCode;
      switch (t.keyCode) {
        case i.UP:
          return this._repeat(null, 1, t), !0;
        case i.DOWN:
          return this._repeat(null, -1, t), !0;
        case i.PAGE_UP:
          return this._repeat(null, e.page, t), !0;
        case i.PAGE_DOWN:
          return this._repeat(null, -e.page, t), !0;
      }
      return !1;
    },
    _start: function (t) {
      return (
        !(!this.spinning && !1 === this._trigger("start", t)) &&
        (this.counter || (this.counter = 1), (this.spinning = !0))
      );
    },
    _repeat: function (t, e, i) {
      (t = t || 500),
        clearTimeout(this.timer),
        (this.timer = this._delay(function () {
          this._repeat(40, e, i);
        }, t)),
        this._spin(e * this.options.step, i);
    },
    _spin: function (t, e) {
      var i = this.value() || 0;
      this.counter || (this.counter = 1),
        (i = this._adjustValue(i + t * this._increment(this.counter))),
        (this.spinning && !1 === this._trigger("spin", e, { value: i })) ||
          (this._value(i), this.counter++);
    },
    _increment: function (t) {
      var e = this.options.incremental;
      return e
        ? k.isFunction(e)
          ? e(t)
          : Math.floor((t * t * t) / 5e4 - (t * t) / 500 + (17 * t) / 200 + 1)
        : 1;
    },
    _precision: function () {
      var t = this._precisionOf(this.options.step);
      return (
        null !== this.options.min &&
          (t = Math.max(t, this._precisionOf(this.options.min))),
        t
      );
    },
    _precisionOf: function (t) {
      var e = t.toString(),
        t = e.indexOf(".");
      return -1 === t ? 0 : e.length - t - 1;
    },
    _adjustValue: function (t) {
      var e = this.options,
        i = null !== e.min ? e.min : 0,
        s = t - i;
      return (
        (t = i + Math.round(s / e.step) * e.step),
        (t = parseFloat(t.toFixed(this._precision()))),
        null !== e.max && t > e.max
          ? e.max
          : null !== e.min && t < e.min
          ? e.min
          : t
      );
    },
    _stop: function (t) {
      this.spinning &&
        (clearTimeout(this.timer),
        clearTimeout(this.mousewheelTimer),
        (this.counter = 0),
        (this.spinning = !1),
        this._trigger("stop", t));
    },
    _setOption: function (t, e) {
      var i;
      if ("culture" === t || "numberFormat" === t)
        return (
          (i = this._parse(this.element.val())),
          (this.options[t] = e),
          void this.element.val(this._format(i))
        );
      ("max" !== t && "min" !== t && "step" !== t) ||
        ("string" == typeof e && (e = this._parse(e))),
        "icons" === t &&
          ((i = this.buttons.first().find(".ui-icon")),
          this._removeClass(i, null, this.options.icons.up),
          this._addClass(i, null, e.up),
          (i = this.buttons.last().find(".ui-icon")),
          this._removeClass(i, null, this.options.icons.down),
          this._addClass(i, null, e.down)),
        this._super(t, e);
    },
    _setOptionDisabled: function (t) {
      this._super(t),
        this._toggleClass(this.uiSpinner, null, "ui-state-disabled", !!t),
        this.element.prop("disabled", !!t),
        this.buttons.button(t ? "disable" : "enable");
    },
    _setOptions: T(function (t) {
      this._super(t);
    }),
    _parse: function (t) {
      return (
        "string" == typeof t &&
          "" !== t &&
          (t =
            window.Globalize && this.options.numberFormat
              ? Globalize.parseFloat(t, 10, this.options.culture)
              : +t),
        "" === t || isNaN(t) ? null : t
      );
    },
    _format: function (t) {
      return "" === t
        ? ""
        : window.Globalize && this.options.numberFormat
        ? Globalize.format(t, this.options.numberFormat, this.options.culture)
        : t;
    },
    _refresh: function () {
      this.element.attr({
        "aria-valuemin": this.options.min,
        "aria-valuemax": this.options.max,
        "aria-valuenow": this._parse(this.element.val()),
      });
    },
    isValid: function () {
      var t = this.value();
      return null !== t && t === this._adjustValue(t);
    },
    _value: function (t, e) {
      var i;
      "" !== t &&
        null !== (i = this._parse(t)) &&
        (e || (i = this._adjustValue(i)), (t = this._format(i))),
        this.element.val(t),
        this._refresh();
    },
    _destroy: function () {
      this.element
        .prop("disabled", !1)
        .removeAttr(
          "autocomplete role aria-valuemin aria-valuemax aria-valuenow"
        ),
        this.uiSpinner.replaceWith(this.element);
    },
    stepUp: T(function (t) {
      this._stepUp(t);
    }),
    _stepUp: function (t) {
      this._start() && (this._spin((t || 1) * this.options.step), this._stop());
    },
    stepDown: T(function (t) {
      this._stepDown(t);
    }),
    _stepDown: function (t) {
      this._start() &&
        (this._spin((t || 1) * -this.options.step), this._stop());
    },
    pageUp: T(function (t) {
      this._stepUp((t || 1) * this.options.page);
    }),
    pageDown: T(function (t) {
      this._stepDown((t || 1) * this.options.page);
    }),
    value: function (t) {
      if (!arguments.length) return this._parse(this.element.val());
      T(this._value).call(this, t);
    },
    widget: function () {
      return this.uiSpinner;
    },
  }),
    !1 !== k.uiBackCompat &&
      k.widget("ui.spinner", k.ui.spinner, {
        _enhance: function () {
          this.uiSpinner = this.element
            .attr("autocomplete", "off")
            .wrap(this._uiSpinnerHtml())
            .parent()
            .append(this._buttonHtml());
        },
        _uiSpinnerHtml: function () {
          return "<span>";
        },
        _buttonHtml: function () {
          return "<a></a><a></a>";
        },
      });
  var M;
  k.ui.spinner;
  k.widget("ui.tabs", {
    version: "1.12.1",
    delay: 300,
    options: {
      active: null,
      classes: {
        "ui-tabs": "ui-corner-all",
        "ui-tabs-nav": "ui-corner-all",
        "ui-tabs-panel": "ui-corner-bottom",
        "ui-tabs-tab": "ui-corner-top",
      },
      collapsible: !1,
      event: "click",
      heightStyle: "content",
      hide: null,
      show: null,
      activate: null,
      beforeActivate: null,
      beforeLoad: null,
      load: null,
    },
    _isLocal:
      ((M = /#.*$/),
      function (t) {
        var e = t.href.replace(M, ""),
          i = location.href.replace(M, "");
        try {
          e = decodeURIComponent(e);
        } catch (t) {}
        try {
          i = decodeURIComponent(i);
        } catch (t) {}
        return 1 < t.hash.length && e === i;
      }),
    _create: function () {
      var e = this,
        t = this.options;
      (this.running = !1),
        this._addClass("ui-tabs", "ui-widget ui-widget-content"),
        this._toggleClass("ui-tabs-collapsible", null, t.collapsible),
        this._processTabs(),
        (t.active = this._initialActive()),
        k.isArray(t.disabled) &&
          (t.disabled = k
            .unique(
              t.disabled.concat(
                k.map(this.tabs.filter(".ui-state-disabled"), function (t) {
                  return e.tabs.index(t);
                })
              )
            )
            .sort()),
        !1 !== this.options.active && this.anchors.length
          ? (this.active = this._findActive(t.active))
          : (this.active = k()),
        this._refresh(),
        this.active.length && this.load(t.active);
    },
    _initialActive: function () {
      var i = this.options.active,
        t = this.options.collapsible,
        s = location.hash.substring(1);
      return (
        null === i &&
          (s &&
            this.tabs.each(function (t, e) {
              if (k(e).attr("aria-controls") === s) return (i = t), !1;
            }),
          null === i &&
            (i = this.tabs.index(this.tabs.filter(".ui-tabs-active"))),
          (null !== i && -1 !== i) || (i = !!this.tabs.length && 0)),
        !1 !== i &&
          -1 === (i = this.tabs.index(this.tabs.eq(i))) &&
          (i = !t && 0),
        !t && !1 === i && this.anchors.length && (i = 0),
        i
      );
    },
    _getCreateEventData: function () {
      return {
        tab: this.active,
        panel: this.active.length ? this._getPanelForTab(this.active) : k(),
      };
    },
    _tabKeydown: function (t) {
      var e = k(k.ui.safeActiveElement(this.document[0])).closest("li"),
        i = this.tabs.index(e),
        s = !0;
      if (!this._handlePageNav(t)) {
        switch (t.keyCode) {
          case k.ui.keyCode.RIGHT:
          case k.ui.keyCode.DOWN:
            i++;
            break;
          case k.ui.keyCode.UP:
          case k.ui.keyCode.LEFT:
            (s = !1), i--;
            break;
          case k.ui.keyCode.END:
            i = this.anchors.length - 1;
            break;
          case k.ui.keyCode.HOME:
            i = 0;
            break;
          case k.ui.keyCode.SPACE:
            return (
              t.preventDefault(),
              clearTimeout(this.activating),
              void this._activate(i)
            );
          case k.ui.keyCode.ENTER:
            return (
              t.preventDefault(),
              clearTimeout(this.activating),
              void this._activate(i !== this.options.active && i)
            );
          default:
            return;
        }
        t.preventDefault(),
          clearTimeout(this.activating),
          (i = this._focusNextTab(i, s)),
          t.ctrlKey ||
            t.metaKey ||
            (e.attr("aria-selected", "false"),
            this.tabs.eq(i).attr("aria-selected", "true"),
            (this.activating = this._delay(function () {
              this.option("active", i);
            }, this.delay)));
      }
    },
    _panelKeydown: function (t) {
      this._handlePageNav(t) ||
        (t.ctrlKey &&
          t.keyCode === k.ui.keyCode.UP &&
          (t.preventDefault(), this.active.trigger("focus")));
    },
    _handlePageNav: function (t) {
      return t.altKey && t.keyCode === k.ui.keyCode.PAGE_UP
        ? (this._activate(this._focusNextTab(this.options.active - 1, !1)), !0)
        : t.altKey && t.keyCode === k.ui.keyCode.PAGE_DOWN
        ? (this._activate(this._focusNextTab(this.options.active + 1, !0)), !0)
        : void 0;
    },
    _findNextTab: function (t, e) {
      var i = this.tabs.length - 1;
      for (
        ;
        -1 !==
        k.inArray(
          (i < t && (t = 0), t < 0 && (t = i), t),
          this.options.disabled
        );

      )
        t = e ? t + 1 : t - 1;
      return t;
    },
    _focusNextTab: function (t, e) {
      return (t = this._findNextTab(t, e)), this.tabs.eq(t).trigger("focus"), t;
    },
    _setOption: function (t, e) {
      "active" !== t
        ? (this._super(t, e),
          "collapsible" === t &&
            (this._toggleClass("ui-tabs-collapsible", null, e),
            e || !1 !== this.options.active || this._activate(0)),
          "event" === t && this._setupEvents(e),
          "heightStyle" === t && this._setupHeightStyle(e))
        : this._activate(e);
    },
    _sanitizeSelector: function (t) {
      return t ? t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : "";
    },
    refresh: function () {
      var t = this.options,
        e = this.tablist.children(":has(a[href])");
      (t.disabled = k.map(e.filter(".ui-state-disabled"), function (t) {
        return e.index(t);
      })),
        this._processTabs(),
        !1 !== t.active && this.anchors.length
          ? this.active.length && !k.contains(this.tablist[0], this.active[0])
            ? this.tabs.length === t.disabled.length
              ? ((t.active = !1), (this.active = k()))
              : this._activate(this._findNextTab(Math.max(0, t.active - 1), !1))
            : (t.active = this.tabs.index(this.active))
          : ((t.active = !1), (this.active = k())),
        this._refresh();
    },
    _refresh: function () {
      this._setOptionDisabled(this.options.disabled),
        this._setupEvents(this.options.event),
        this._setupHeightStyle(this.options.heightStyle),
        this.tabs
          .not(this.active)
          .attr({
            "aria-selected": "false",
            "aria-expanded": "false",
            tabIndex: -1,
          }),
        this.panels
          .not(this._getPanelForTab(this.active))
          .hide()
          .attr({ "aria-hidden": "true" }),
        this.active.length
          ? (this.active.attr({
              "aria-selected": "true",
              "aria-expanded": "true",
              tabIndex: 0,
            }),
            this._addClass(this.active, "ui-tabs-active", "ui-state-active"),
            this._getPanelForTab(this.active)
              .show()
              .attr({ "aria-hidden": "false" }))
          : this.tabs.eq(0).attr("tabIndex", 0);
    },
    _processTabs: function () {
      var h = this,
        t = this.tabs,
        e = this.anchors,
        i = this.panels;
      (this.tablist = this._getList().attr("role", "tablist")),
        this._addClass(
          this.tablist,
          "ui-tabs-nav",
          "ui-helper-reset ui-helper-clearfix ui-widget-header"
        ),
        this.tablist
          .on("mousedown" + this.eventNamespace, "> li", function (t) {
            k(this).is(".ui-state-disabled") && t.preventDefault();
          })
          .on("focus" + this.eventNamespace, ".ui-tabs-anchor", function () {
            k(this).closest("li").is(".ui-state-disabled") && this.blur();
          }),
        (this.tabs = this.tablist
          .find("> li:has(a[href])")
          .attr({ role: "tab", tabIndex: -1 })),
        this._addClass(this.tabs, "ui-tabs-tab", "ui-state-default"),
        (this.anchors = this.tabs
          .map(function () {
            return k("a", this)[0];
          })
          .attr({ role: "presentation", tabIndex: -1 })),
        this._addClass(this.anchors, "ui-tabs-anchor"),
        (this.panels = k()),
        this.anchors.each(function (t, e) {
          var i,
            s,
            n,
            o = k(e).uniqueId().attr("id"),
            a = k(e).closest("li"),
            r = a.attr("aria-controls");
          h._isLocal(e)
            ? ((n = (i = e.hash).substring(1)),
              (s = h.element.find(h._sanitizeSelector(i))))
            : ((i =
                "#" + (n = a.attr("aria-controls") || k({}).uniqueId()[0].id)),
              (s = h.element.find(i)).length ||
                (s = h._createPanel(n)).insertAfter(
                  h.panels[t - 1] || h.tablist
                ),
              s.attr("aria-live", "polite")),
            s.length && (h.panels = h.panels.add(s)),
            r && a.data("ui-tabs-aria-controls", r),
            a.attr({ "aria-controls": n, "aria-labelledby": o }),
            s.attr("aria-labelledby", o);
        }),
        this.panels.attr("role", "tabpanel"),
        this._addClass(this.panels, "ui-tabs-panel", "ui-widget-content"),
        t &&
          (this._off(t.not(this.tabs)),
          this._off(e.not(this.anchors)),
          this._off(i.not(this.panels)));
    },
    _getList: function () {
      return this.tablist || this.element.find("ol, ul").eq(0);
    },
    _createPanel: function (t) {
      return k("<div>").attr("id", t).data("ui-tabs-destroy", !0);
    },
    _setOptionDisabled: function (t) {
      var e, i;
      for (
        k.isArray(t) &&
          (t.length ? t.length === this.anchors.length && (t = !0) : (t = !1)),
          i = 0;
        (e = this.tabs[i]);
        i++
      )
        (e = k(e)),
          !0 === t || -1 !== k.inArray(i, t)
            ? (e.attr("aria-disabled", "true"),
              this._addClass(e, null, "ui-state-disabled"))
            : (e.removeAttr("aria-disabled"),
              this._removeClass(e, null, "ui-state-disabled"));
      (this.options.disabled = t),
        this._toggleClass(
          this.widget(),
          this.widgetFullName + "-disabled",
          null,
          !0 === t
        );
    },
    _setupEvents: function (t) {
      var i = {};
      t &&
        k.each(t.split(" "), function (t, e) {
          i[e] = "_eventHandler";
        }),
        this._off(this.anchors.add(this.tabs).add(this.panels)),
        this._on(!0, this.anchors, {
          click: function (t) {
            t.preventDefault();
          },
        }),
        this._on(this.anchors, i),
        this._on(this.tabs, { keydown: "_tabKeydown" }),
        this._on(this.panels, { keydown: "_panelKeydown" }),
        this._focusable(this.tabs),
        this._hoverable(this.tabs);
    },
    _setupHeightStyle: function (t) {
      var i,
        e = this.element.parent();
      "fill" === t
        ? ((i = e.height()),
          (i -= this.element.outerHeight() - this.element.height()),
          this.element.siblings(":visible").each(function () {
            var t = k(this),
              e = t.css("position");
            "absolute" !== e && "fixed" !== e && (i -= t.outerHeight(!0));
          }),
          this.element
            .children()
            .not(this.panels)
            .each(function () {
              i -= k(this).outerHeight(!0);
            }),
          this.panels
            .each(function () {
              k(this).height(
                Math.max(0, i - k(this).innerHeight() + k(this).height())
              );
            })
            .css("overflow", "auto"))
        : "auto" === t &&
          ((i = 0),
          this.panels
            .each(function () {
              i = Math.max(i, k(this).height("").height());
            })
            .height(i));
    },
    _eventHandler: function (t) {
      var e = this.options,
        i = this.active,
        s = k(t.currentTarget).closest("li"),
        n = s[0] === i[0],
        o = n && e.collapsible,
        a = o ? k() : this._getPanelForTab(s),
        r = i.length ? this._getPanelForTab(i) : k(),
        i = { oldTab: i, oldPanel: r, newTab: o ? k() : s, newPanel: a };
      t.preventDefault(),
        s.hasClass("ui-state-disabled") ||
          s.hasClass("ui-tabs-loading") ||
          this.running ||
          (n && !e.collapsible) ||
          !1 === this._trigger("beforeActivate", t, i) ||
          ((e.active = !o && this.tabs.index(s)),
          (this.active = n ? k() : s),
          this.xhr && this.xhr.abort(),
          r.length ||
            a.length ||
            k.error("jQuery UI Tabs: Mismatching fragment identifier."),
          a.length && this.load(this.tabs.index(s), t),
          this._toggle(t, i));
    },
    _toggle: function (t, e) {
      var i = this,
        s = e.newPanel,
        n = e.oldPanel;
      function o() {
        (i.running = !1), i._trigger("activate", t, e);
      }
      function a() {
        i._addClass(
          e.newTab.closest("li"),
          "ui-tabs-active",
          "ui-state-active"
        ),
          s.length && i.options.show
            ? i._show(s, i.options.show, o)
            : (s.show(), o());
      }
      (this.running = !0),
        n.length && this.options.hide
          ? this._hide(n, this.options.hide, function () {
              i._removeClass(
                e.oldTab.closest("li"),
                "ui-tabs-active",
                "ui-state-active"
              ),
                a();
            })
          : (this._removeClass(
              e.oldTab.closest("li"),
              "ui-tabs-active",
              "ui-state-active"
            ),
            n.hide(),
            a()),
        n.attr("aria-hidden", "true"),
        e.oldTab.attr({ "aria-selected": "false", "aria-expanded": "false" }),
        s.length && n.length
          ? e.oldTab.attr("tabIndex", -1)
          : s.length &&
            this.tabs
              .filter(function () {
                return 0 === k(this).attr("tabIndex");
              })
              .attr("tabIndex", -1),
        s.attr("aria-hidden", "false"),
        e.newTab.attr({
          "aria-selected": "true",
          "aria-expanded": "true",
          tabIndex: 0,
        });
    },
    _activate: function (t) {
      var t = this._findActive(t);
      t[0] !== this.active[0] &&
        (t.length || (t = this.active),
        (t = t.find(".ui-tabs-anchor")[0]),
        this._eventHandler({
          target: t,
          currentTarget: t,
          preventDefault: k.noop,
        }));
    },
    _findActive: function (t) {
      return !1 === t ? k() : this.tabs.eq(t);
    },
    _getIndex: function (t) {
      return (
        "string" == typeof t &&
          (t = this.anchors.index(
            this.anchors.filter("[href$='" + k.ui.escapeSelector(t) + "']")
          )),
        t
      );
    },
    _destroy: function () {
      this.xhr && this.xhr.abort(),
        this.tablist.removeAttr("role").off(this.eventNamespace),
        this.anchors.removeAttr("role tabIndex").removeUniqueId(),
        this.tabs.add(this.panels).each(function () {
          k.data(this, "ui-tabs-destroy")
            ? k(this).remove()
            : k(this).removeAttr(
                "role tabIndex aria-live aria-busy aria-selected aria-labelledby aria-hidden aria-expanded"
              );
        }),
        this.tabs.each(function () {
          var t = k(this),
            e = t.data("ui-tabs-aria-controls");
          e
            ? t.attr("aria-controls", e).removeData("ui-tabs-aria-controls")
            : t.removeAttr("aria-controls");
        }),
        this.panels.show(),
        "content" !== this.options.heightStyle && this.panels.css("height", "");
    },
    enable: function (i) {
      var t = this.options.disabled;
      !1 !== t &&
        ((t =
          void 0 !== i &&
          ((i = this._getIndex(i)),
          k.isArray(t)
            ? k.map(t, function (t) {
                return t !== i ? t : null;
              })
            : k.map(this.tabs, function (t, e) {
                return e !== i ? e : null;
              }))),
        this._setOptionDisabled(t));
    },
    disable: function (t) {
      var e = this.options.disabled;
      if (!0 !== e) {
        if (void 0 === t) e = !0;
        else {
          if (((t = this._getIndex(t)), -1 !== k.inArray(t, e))) return;
          e = k.isArray(e) ? k.merge([t], e).sort() : [t];
        }
        this._setOptionDisabled(e);
      }
    },
    load: function (t, s) {
      t = this._getIndex(t);
      function n(t, e) {
        "abort" === e && o.panels.stop(!1, !0),
          o._removeClass(i, "ui-tabs-loading"),
          a.removeAttr("aria-busy"),
          t === o.xhr && delete o.xhr;
      }
      var o = this,
        i = this.tabs.eq(t),
        t = i.find(".ui-tabs-anchor"),
        a = this._getPanelForTab(i),
        r = { tab: i, panel: a };
      this._isLocal(t[0]) ||
        ((this.xhr = k.ajax(this._ajaxSettings(t, s, r))),
        this.xhr &&
          "canceled" !== this.xhr.statusText &&
          (this._addClass(i, "ui-tabs-loading"),
          a.attr("aria-busy", "true"),
          this.xhr
            .done(function (t, e, i) {
              setTimeout(function () {
                a.html(t), o._trigger("load", s, r), n(i, e);
              }, 1);
            })
            .fail(function (t, e) {
              setTimeout(function () {
                n(t, e);
              }, 1);
            })));
    },
    _ajaxSettings: function (t, i, s) {
      var n = this;
      return {
        url: t.attr("href").replace(/#.*$/, ""),
        beforeSend: function (t, e) {
          return n._trigger(
            "beforeLoad",
            i,
            k.extend({ jqXHR: t, ajaxSettings: e }, s)
          );
        },
      };
    },
    _getPanelForTab: function (t) {
      t = k(t).attr("aria-controls");
      return this.element.find(this._sanitizeSelector("#" + t));
    },
  }),
    !1 !== k.uiBackCompat &&
      k.widget("ui.tabs", k.ui.tabs, {
        _processTabs: function () {
          this._superApply(arguments), this._addClass(this.tabs, "ui-tab");
        },
      });
  k.ui.tabs;
  k.widget("ui.tooltip", {
    version: "1.12.1",
    options: {
      classes: { "ui-tooltip": "ui-corner-all ui-widget-shadow" },
      content: function () {
        var t = k(this).attr("title") || "";
        return k("<a>").text(t).html();
      },
      hide: !0,
      items: "[title]:not([disabled])",
      position: {
        my: "left top+15",
        at: "left bottom",
        collision: "flipfit flip",
      },
      show: !0,
      track: !1,
      close: null,
      open: null,
    },
    _addDescribedBy: function (t, e) {
      var i = (t.attr("aria-describedby") || "").split(/\s+/);
      i.push(e),
        t
          .data("ui-tooltip-id", e)
          .attr("aria-describedby", k.trim(i.join(" ")));
    },
    _removeDescribedBy: function (t) {
      var e = t.data("ui-tooltip-id"),
        i = (t.attr("aria-describedby") || "").split(/\s+/),
        e = k.inArray(e, i);
      -1 !== e && i.splice(e, 1),
        t.removeData("ui-tooltip-id"),
        (i = k.trim(i.join(" ")))
          ? t.attr("aria-describedby", i)
          : t.removeAttr("aria-describedby");
    },
    _create: function () {
      this._on({ mouseover: "open", focusin: "open" }),
        (this.tooltips = {}),
        (this.parents = {}),
        (this.liveRegion = k("<div>")
          .attr({
            role: "log",
            "aria-live": "assertive",
            "aria-relevant": "additions",
          })
          .appendTo(this.document[0].body)),
        this._addClass(this.liveRegion, null, "ui-helper-hidden-accessible"),
        (this.disabledTitles = k([]));
    },
    _setOption: function (t, e) {
      var i = this;
      this._super(t, e),
        "content" === t &&
          k.each(this.tooltips, function (t, e) {
            i._updateContent(e.element);
          });
    },
    _setOptionDisabled: function (t) {
      this[t ? "_disable" : "_enable"]();
    },
    _disable: function () {
      var s = this;
      k.each(this.tooltips, function (t, e) {
        var i = k.Event("blur");
        (i.target = i.currentTarget = e.element[0]), s.close(i, !0);
      }),
        (this.disabledTitles = this.disabledTitles.add(
          this.element
            .find(this.options.items)
            .addBack()
            .filter(function () {
              var t = k(this);
              if (t.is("[title]"))
                return t
                  .data("ui-tooltip-title", t.attr("title"))
                  .removeAttr("title");
            })
        ));
    },
    _enable: function () {
      this.disabledTitles.each(function () {
        var t = k(this);
        t.data("ui-tooltip-title") &&
          t.attr("title", t.data("ui-tooltip-title"));
      }),
        (this.disabledTitles = k([]));
    },
    open: function (t) {
      var i = this,
        e = k(t ? t.target : this.element).closest(this.options.items);
      e.length &&
        !e.data("ui-tooltip-id") &&
        (e.attr("title") && e.data("ui-tooltip-title", e.attr("title")),
        e.data("ui-tooltip-open", !0),
        t &&
          "mouseover" === t.type &&
          e.parents().each(function () {
            var t,
              e = k(this);
            e.data("ui-tooltip-open") &&
              (((t = k.Event("blur")).target = t.currentTarget = this),
              i.close(t, !0)),
              e.attr("title") &&
                (e.uniqueId(),
                (i.parents[this.id] = {
                  element: this,
                  title: e.attr("title"),
                }),
                e.attr("title", ""));
          }),
        this._registerCloseHandlers(t, e),
        this._updateContent(e, t));
    },
    _updateContent: function (e, i) {
      var t = this.options.content,
        s = this,
        n = i ? i.type : null;
      if ("string" == typeof t || t.nodeType || t.jquery)
        return this._open(i, e, t);
      (t = t.call(e[0], function (t) {
        s._delay(function () {
          e.data("ui-tooltip-open") && (i && (i.type = n), this._open(i, e, t));
        });
      })) && this._open(i, e, t);
    },
    _open: function (t, e, i) {
      var s,
        n,
        o,
        a = k.extend({}, this.options.position);
      function r(t) {
        (a.of = t), n.is(":hidden") || n.position(a);
      }
      i &&
        ((s = this._find(e))
          ? s.tooltip.find(".ui-tooltip-content").html(i)
          : (e.is("[title]") &&
              (t && "mouseover" === t.type
                ? e.attr("title", "")
                : e.removeAttr("title")),
            (s = this._tooltip(e)),
            (n = s.tooltip),
            this._addDescribedBy(e, n.attr("id")),
            n.find(".ui-tooltip-content").html(i),
            this.liveRegion.children().hide(),
            (i = k("<div>").html(n.find(".ui-tooltip-content").html()))
              .removeAttr("name")
              .find("[name]")
              .removeAttr("name"),
            i.removeAttr("id").find("[id]").removeAttr("id"),
            i.appendTo(this.liveRegion),
            this.options.track && t && /^mouse/.test(t.type)
              ? (this._on(this.document, { mousemove: r }), r(t))
              : n.position(k.extend({ of: e }, this.options.position)),
            n.hide(),
            this._show(n, this.options.show),
            this.options.track &&
              this.options.show &&
              this.options.show.delay &&
              (o = this.delayedShow =
                setInterval(function () {
                  n.is(":visible") && (r(a.of), clearInterval(o));
                }, k.fx.interval)),
            this._trigger("open", t, { tooltip: n })));
    },
    _registerCloseHandlers: function (t, e) {
      var i = {
        keyup: function (t) {
          t.keyCode === k.ui.keyCode.ESCAPE &&
            (((t = k.Event(t)).currentTarget = e[0]), this.close(t, !0));
        },
      };
      e[0] !== this.element[0] &&
        (i.remove = function () {
          this._removeTooltip(this._find(e).tooltip);
        }),
        (t && "mouseover" !== t.type) || (i.mouseleave = "close"),
        (t && "focusin" !== t.type) || (i.focusout = "close"),
        this._on(!0, e, i);
    },
    close: function (t) {
      var e,
        i = this,
        s = k(t ? t.currentTarget : this.element),
        n = this._find(s);
      n
        ? ((e = n.tooltip),
          n.closing ||
            (clearInterval(this.delayedShow),
            s.data("ui-tooltip-title") &&
              !s.attr("title") &&
              s.attr("title", s.data("ui-tooltip-title")),
            this._removeDescribedBy(s),
            (n.hiding = !0),
            e.stop(!0),
            this._hide(e, this.options.hide, function () {
              i._removeTooltip(k(this));
            }),
            s.removeData("ui-tooltip-open"),
            this._off(s, "mouseleave focusout keyup"),
            s[0] !== this.element[0] && this._off(s, "remove"),
            this._off(this.document, "mousemove"),
            t &&
              "mouseleave" === t.type &&
              k.each(this.parents, function (t, e) {
                k(e.element).attr("title", e.title), delete i.parents[t];
              }),
            (n.closing = !0),
            this._trigger("close", t, { tooltip: e }),
            n.hiding || (n.closing = !1)))
        : s.removeData("ui-tooltip-open");
    },
    _tooltip: function (t) {
      var e = k("<div>").attr("role", "tooltip"),
        i = k("<div>").appendTo(e),
        s = e.uniqueId().attr("id");
      return (
        this._addClass(i, "ui-tooltip-content"),
        this._addClass(e, "ui-tooltip", "ui-widget ui-widget-content"),
        e.appendTo(this._appendTo(t)),
        (this.tooltips[s] = { element: t, tooltip: e })
      );
    },
    _find: function (t) {
      t = t.data("ui-tooltip-id");
      return t ? this.tooltips[t] : null;
    },
    _removeTooltip: function (t) {
      t.remove(), delete this.tooltips[t.attr("id")];
    },
    _appendTo: function (t) {
      t = t.closest(".ui-front, dialog");
      return t.length || (t = this.document[0].body), t;
    },
    _destroy: function () {
      var s = this;
      k.each(this.tooltips, function (t, e) {
        var i = k.Event("blur"),
          e = e.element;
        (i.target = i.currentTarget = e[0]),
          s.close(i, !0),
          k("#" + t).remove(),
          e.data("ui-tooltip-title") &&
            (e.attr("title") || e.attr("title", e.data("ui-tooltip-title")),
            e.removeData("ui-tooltip-title"));
      }),
        this.liveRegion.remove();
    },
  }),
    !1 !== k.uiBackCompat &&
      k.widget("ui.tooltip", k.ui.tooltip, {
        options: { tooltipClass: null },
        _tooltip: function () {
          var t = this._superApply(arguments);
          return (
            this.options.tooltipClass &&
              t.tooltip.addClass(this.options.tooltipClass),
            t
          );
        },
      });
  k.ui.tooltip;
});
!(function (e, n) {
  function t(e, n) {
    return typeof e === n;
  }
  function o() {
    var e, n, o, i, s, r, d;
    for (var l in f) {
      if (
        ((e = []),
        (n = f[l]),
        n.name &&
          (e.push(n.name.toLowerCase()),
          n.options && n.options.aliases && n.options.aliases.length))
      )
        for (o = 0; o < n.options.aliases.length; o++)
          e.push(n.options.aliases[o].toLowerCase());
      for (i = t(n.fn, "function") ? n.fn() : n.fn, s = 0; s < e.length; s++)
        (r = e[s]),
          (d = r.split(".")),
          1 === d.length
            ? (Modernizr[d[0]] = i)
            : (!Modernizr[d[0]] ||
                Modernizr[d[0]] instanceof Boolean ||
                (Modernizr[d[0]] = new Boolean(Modernizr[d[0]])),
              (Modernizr[d[0]][d[1]] = i)),
          a.push((i ? "" : "no-") + d.join("-"));
    }
  }
  function i(e) {
    var n = l.className,
      t = Modernizr._config.classPrefix || "";
    if (Modernizr._config.enableJSClass) {
      var o = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
      n = n.replace(o, "$1" + t + "js$2");
    }
    Modernizr._config.enableClasses &&
      ((n += " " + t + e.join(" " + t)), (l.className = n));
  }
  function s() {
    var e = n.body;
    return e || ((e = c("body")), (e.fake = !0)), e;
  }
  function r(e, n, t, o) {
    var i,
      r,
      a,
      f,
      d = "modernizr",
      u = c("div"),
      p = s();
    if (parseInt(t, 10))
      for (; t--; )
        (a = c("div")), (a.id = o ? o[t] : d + (t + 1)), u.appendChild(a);
    return (
      (i = ["&#173;", '<style id="s', d, '">', e, "</style>"].join("")),
      (u.id = d),
      ((p.fake ? p : u).innerHTML += i),
      p.appendChild(u),
      p.fake &&
        ((p.style.background = ""),
        (p.style.overflow = "hidden"),
        (f = l.style.overflow),
        (l.style.overflow = "hidden"),
        l.appendChild(p)),
      (r = n(u, e)),
      p.fake
        ? (p.parentNode.removeChild(p), (l.style.overflow = f), l.offsetHeight)
        : u.parentNode.removeChild(u),
      !!r
    );
  }
  var a = [],
    f = [],
    d = {
      _version: "3.0.0-alpha.3",
      _config: {
        classPrefix: "",
        enableClasses: !0,
        enableJSClass: !0,
        usePrefixes: !0,
      },
      _q: [],
      on: function (e, n) {
        var t = this;
        setTimeout(function () {
          n(t[e]);
        }, 0);
      },
      addTest: function (e, n, t) {
        f.push({ name: e, fn: n, options: t });
      },
      addAsyncTest: function (e) {
        f.push({ name: null, fn: e });
      },
    },
    Modernizr = function () {};
  (Modernizr.prototype = d),
    (Modernizr = new Modernizr()),
    Modernizr.addTest("cookies", function () {
      try {
        n.cookie = "cookietest=1";
        var e = -1 != n.cookie.indexOf("cookietest=");
        return (
          (n.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT"), e
        );
      } catch (t) {
        return !1;
      }
    }),
    Modernizr.addTest("filereader", !!(e.File && e.FileList && e.FileReader));
  var l = n.documentElement,
    u = d._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [];
  d._prefixes = u;
  var c = function () {
    return "function" != typeof n.createElement
      ? n.createElement(arguments[0])
      : n.createElement.apply(n, arguments);
  };
  Modernizr.addTest("draganddrop", function () {
    var e = c("div");
    return "draggable" in e || ("ondragstart" in e && "ondrop" in e);
  });
  var p = (function (e) {
      function t(n, t) {
        var i;
        return n
          ? ((t && "string" != typeof t) || (t = c(t || "div")),
            (n = "on" + n),
            (i = n in t),
            !i &&
              o &&
              (t.setAttribute || (t = c("div")),
              t.setAttribute(n, ""),
              (i = "function" == typeof t[n]),
              t[n] !== e && (t[n] = e),
              t.removeAttribute(n)),
            i)
          : !1;
      }
      var o = !("onblur" in n.documentElement);
      return t;
    })(),
    v = ((d.hasEvent = p), (d.testStyles = r));
  Modernizr.addTest("touchevents", function () {
    var t;
    if ("ontouchstart" in e || (e.DocumentTouch && n instanceof DocumentTouch))
      t = !0;
    else {
      var o = [
        "@media (",
        u.join("touch-enabled),("),
        "heartz",
        ")",
        "{#modernizr{top:9px;position:absolute}}",
      ].join("");
      v(o, function (e) {
        t = 9 === e.offsetTop;
      });
    }
    return t;
  }),
    o(),
    i(a),
    delete d.addTest,
    delete d.addAsyncTest;
  for (var h = 0; h < Modernizr._q.length; h++) Modernizr._q[h]();
  e.Modernizr = Modernizr;
})(window, document);
!(function (e) {
  var t = {};
  function a(i) {
    if (t[i]) return t[i].exports;
    var n = (t[i] = { i: i, l: !1, exports: {} });
    return e[i].call(n.exports, n, n.exports, a), (n.l = !0), n.exports;
  }
  (a.m = e),
    (a.c = t),
    (a.d = function (e, t, i) {
      a.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: i });
    }),
    (a.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (a.t = function (e, t) {
      if ((1 & t && (e = a(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var i = Object.create(null);
      if (
        (a.r(i),
        Object.defineProperty(i, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var n in e)
          a.d(
            i,
            n,
            function (t) {
              return e[t];
            }.bind(null, n)
          );
      return i;
    }),
    (a.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return a.d(t, "a", t), t;
    }),
    (a.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (a.p = ""),
    a((a.s = 27));
})({
  0: function (e, t) {
    e.exports = jQuery;
  },
  1: function (e, t, a) {
    "use strict";
    a.d(t, "a", function () {
      return n;
    });
    var i = a(2),
      n = {
        embedded: "undefined" != typeof TYGH_LOADER,
        doc: "undefined" != typeof TYGH_LOADER ? TYGH_LOADER.doc : document,
        body: "undefined" != typeof TYGH_LOADER ? TYGH_LOADER.body : null,
        otherjQ: "undefined" != typeof TYGH_LOADER && TYGH_LOADER.otherjQ,
        facebook: "undefined" != typeof TYGH_FACEBOOK && TYGH_FACEBOOK,
        container: "tygh_main_container",
        init_container: "tygh_container",
        area: "",
        security_hash: "",
        isTouch: !1,
        anchor: "undefined" != typeof TYGH_LOADER ? "" : window.location.hash,
      },
      o = {};
    (n.tr = function (e, t) {
      var a = n.$;
      return "string" == typeof e && void 0 === t
        ? (o[e] || console.error("'".concat(e, "' is not defined")), o[e])
        : void 0 !== t
        ? ((o[e] = t), !0)
        : "object" == Object(i.a)(e) && (a.extend(o, e), !0);
    }),
      (n.lang = o),
      (n.toNumeric = function (e) {
        var t = Number(String(e).str_replace(",", "."));
        return isNaN(t) ? 0 : t;
      }),
      (n.getFloatPrecision = function (e) {
        return String(e).replace(".", "").length - e.toFixed().length;
      });
  },
  2: function (e, t, a) {
    "use strict";
    function i(e) {
      return (i =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            })(e);
    }
    function n(e) {
      return (n =
        "function" == typeof Symbol && "symbol" === i(Symbol.iterator)
          ? function (e) {
              return i(e);
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : i(e);
            })(e);
    }
    a.d(t, "a", function () {
      return n;
    });
  },
  27: function (e, t, a) {
    "use strict";
    a.r(t);
    var i,
      n = a(0),
      o = a.n(n),
      r = a(2),
      s = function (e) {
        l(c(e));
      },
      l = function (e, t) {
        (e = t ? e : d(e)), alert(e);
      },
      c = function e(t, a) {
        var i = "";
        a || (a = 0);
        for (var n = "", o = 0; o < a + 1; o++) n += "    ";
        if ("object" == Object(r.a)(t))
          for (var s in t) {
            var l = t[s];
            "object" == Object(r.a)(l)
              ? ((i += n + "'" + s + "' ...\n"), (i += e(l, a + 1)))
              : (i += n + "'" + s + "' => \"" + l + '"\n');
          }
        else i = t + " (" + Object(r.a)(t) + ")";
        return i;
      },
      _ = function (e) {
        var t = Tygh.current_location + "/" + Tygh.index_script,
          a = o.a.parseUrl(e);
        if ("" == e) e = t;
        else if (a.protocol) {
          var i, n;
          if (Tygh.embedded)
            if (
              (Tygh.facebook && -1 != Tygh.facebook.url.indexOf(a.location)
                ? (i = "&app_data=")
                : Tygh.init_context ==
                    a.source.str_replace("#" + a.anchor, "") && (i = "#!"),
              i)
            ) {
              var r = "";
              -1 != (n = e.indexOf(i)) &&
                (r = decodeURIComponent(e.substr(n + i.length)).replace(
                  "&amp;",
                  "&"
                )),
                (e = Tygh.current_location + r);
            }
        } else
          a.file != Tygh.index_script &&
            (e =
              0 == e.indexOf("?")
                ? t + e
                : t + "?dispatch=" + e.replace("?", "&"));
        return e;
      },
      d = function (e) {
        return (e = String(e).replace(/<.*?>/g, ""));
      },
      u = function (e) {
        var t = e.parents("form"),
          a = t.parent(),
          i = t.find("input[type='submit1']");
        if (
          (i.length ||
            (i = Tygh.$("[data-ca-target-form=" + t.prop("name") + "]")),
          a.length && i.length)
        ) {
          var n,
            o = t.prop("action") + "?reload_form=1&" + i.prop("name"),
            r = t.serializeObject();
          (n = "undefined" != r.result_ids ? r.result_ids : a.prop("id")),
            Tygh.$.ceAjax("request", _(o), { data: r, result_ids: n });
        }
      },
      p = function (e) {
        Tygh.$;
        var t = [Tygh.cart_language, Tygh.default_language, "en"],
          a = "";
        if (e.length) {
          a = e[0];
          for (var i = 0; i < t.length; i++)
            if (-1 != Tygh.$.inArray(t[i], e)) {
              a = t[i];
              break;
            }
        }
        return a;
      },
      f = function (e, t) {
        if (void 0 === t) return e;
        "string" == typeof t && (t = [t]);
        var a = e;
        if (e.indexOf("?") >= 0) {
          a = e.substr(0, e.indexOf("?") + 1);
          for (
            var i = e.substr(e.indexOf("?") + 1).split("&"),
              n = [],
              o = !0,
              r = "",
              s = 0;
            s < i.length;
            s++
          ) {
            (n = i[s].split("=")), (o = !0);
            for (var l = 0; l < t.length; l++)
              if (t[l] == n[0] || -1 != n[0].indexOf(t[l] + "[")) {
                o = !1;
                break;
              }
            1 == o && (a += r + n[0] + "=" + n[1]), (r = "&");
          }
        }
        return a;
      },
      h = function (e) {
        var t = Tygh.$,
          a = t("#" + (e = e || "shipping_estimation")),
          i = t("input[type=radio]:checked", a),
          n = [];
        t.each(i, function (e, t) {
          n.push({ name: t.name, value: t.value });
        });
        var o = _("checkout.shipping_estimation.get_total");
        for (var r in n)
          o += "&" + n[r].name + "=" + encodeURIComponent(n[r].value);
        var s = a.find('input[name="suffix"]').first().val(),
          l = {
            additional_id: a.find('input[name="additional_id"]').first().val(),
          };
        t.ceEvent(
          "trigger",
          "ce.calculate_total_shipping.before_send_request",
          [l, a]
        ),
          t.ceAjax("request", o, {
            result_ids:
              "rate_extra_*,shipping_label_*,shipping_estimation_total" + s,
            data: l,
            method: "post",
          });
      },
      m = a(1),
      g = m.a,
      v = function () {
        var e = o()(this);
        "object" !== Object(r.a)(e.data("select2")) && e.select2();
        var t = e
          .siblings(".select2-container")
          .first("ul.select2-selection__rendered");
        t.sortable({
          placeholder: "ui-select2-sortable-placeholder",
          forcePlaceholderSize: !0,
          items: "li:not(.select2-search,.select2-drag--disabled)",
          tolerance: "pointer",
          stop: function () {
            o.a.each(
              t.find(".select2-selection__choice").get().reverse(),
              function () {
                var t = o()(this).data("optionId"),
                  a = e.find('option[value="' + t + '"]').get();
                e.prepend(a);
              }
            );
          },
        });
      },
      E = function (e) {
        return (
          0 == e || 1 == e
            ? 0 == e
              ? this.show()
              : this.hide()
            : this.toggle(),
          !0
        );
      },
      b = function (e, t) {
        t = t || {};
        if (
          (o()(
            "option" + (t.move_all ? "" : ":selected") + ":not(.cm-required)",
            this
          ).appendTo(e),
          t.check_required)
        ) {
          var a = [];
          o()("option.cm-required:selected", this).each(function () {
            a.push(o()(this).text());
          }),
            a.length && fn_alert(t.message + "\n" + a.join(", "));
        }
        return this.change(), o()(e).change(), !0;
      },
      y = function (e) {
        return (
          o()("option:selected", this).each(function () {
            "up" == e
              ? o()(this).prev().insertAfter(this)
              : o()(this).next().insertBefore(this);
          }),
          this.change(),
          !0
        );
      },
      C = function (e) {
        return o()("option", this).prop("selected", e), !0;
      },
      D = function () {
        var e = o.a.getWindowSizes(),
          t = o()(this);
        t.css({
          display: "block",
          top: e.offset_y + (e.view_height - t.height()) / 2,
          left: e.offset_x + (e.view_width - t.width()) / 2,
        });
      },
      j = function (e) {
        var t = !1,
          a = ":input:visible,.cm-wysiwyg,.cm-object-picker";
        return (
          !o()(this).hasClass("cm-skip-check-items") &&
          (e && (a = ":input:enabled,.cm-wysiwyg,.cm-object-picker"),
          o()(a, this).each(function () {
            return !(t = o()(this).fieldIsChanged());
          }),
          t)
        );
      },
      O = function (e) {
        var t = !1,
          a = o()(this),
          i = a.get(0);
        if (
          (void 0 === e && (e = !1),
          a.hasClass("cm-skip-check-item") ||
            (!e && (a.hasClass("cm-item") || a.hasClass("cm-check-items"))))
        )
          return t;
        if (a.is("select")) {
          var n = !1,
            r = [];
          o()("option", a).each(function () {
            this.defaultSelected && (n = !0),
              this.selected != this.defaultSelected && r.push(this);
          }),
            ((1 == n && r.length) ||
              (1 != n &&
                ((r.length && "select-multiple" == a.prop("type")) ||
                  ("select-one" == a.prop("type") && i.selectedIndex > 0)))) &&
              (t = !0);
        } else if (a.is("input[type=radio], input[type=checkbox]"))
          i.checked != i.defaultChecked && (t = !0);
        else if (a.is("input,textarea")) {
          var s,
            l = i.defaultValue;
          if (a.hasClass("cm-numeric"))
            (s = parseFloat(a.autoNumeric("get"))), (l = parseFloat(l));
          else if (a.hasClass("cm-wysiwyg")) {
            s = i.value;
            var c = o()(i).ceEditor("val");
            !1 !== c && (s = c);
          } else s = i.value;
          s !== l && (t = !0);
        }
        return t;
      },
      P = function () {
        "A" == g.area &&
          o()(this).each(function () {
            var e = o()(this),
              t = ":not(.cm-no-hide-input):not(.cm-no-hide-input *)";
            o()("input[type=text]", e)
              .filter(t)
              .each(function () {
                var e = o()(this),
                  t = e.hasClass("hidden") ? " hidden" : "",
                  a = "",
                  i = e.data("caMetaClass") ? " " + e.data("caMetaClass") : "";
                e.prev().hasClass("cm-field-prefix") &&
                  ((a += e.prev().text()), e.prev().remove()),
                  (a += e.val()),
                  e.next().hasClass("cm-field-suffix") &&
                    ((a += e.next().text()), e.next().remove()),
                  e.wrap(
                    '<span class="shift-input' + t + i + '">' + a + "</span>"
                  ),
                  e.remove();
              }),
              o()("label.cm-required", e)
                .filter(t)
                .each(function () {
                  o()(this).removeClass("cm-required");
                }),
              o()("textarea", e)
                .filter(t)
                .each(function () {
                  var e = o()(this);
                  e.wrap('<div class="shift-input">' + e.val() + "</div>"),
                    e.remove();
                }),
              o()("select:not([multiple])", e)
                .filter(t)
                .each(function () {
                  var e = o()(this),
                    t = e.hasClass("hidden") ? " hidden" : "";
                  e.wrap(
                    '<span class="shift-input' +
                      t +
                      '">' +
                      o()(":selected", e).text() +
                      "</span>"
                  ),
                    e.remove();
                }),
              o()("input[type=radio]", e)
                .filter(t)
                .each(function () {
                  var e = o()(this),
                    t = o()("label[for=" + e.prop("id") + "]"),
                    a = e.hasClass("hidden") ? " hidden" : "";
                  e.prop("checked")
                    ? (t.wrap(
                        '<span class="shift-input' +
                          a +
                          '">' +
                          t.text() +
                          "</span>"
                      ),
                      o()(
                        '<input type="radio" checked="checked" disabled="disabled">'
                      ).insertAfter(e))
                    : o()(
                        '<input type="radio" disabled="disabled">'
                      ).insertAfter(e),
                    e.prop("id") && t.remove(),
                    e.remove();
                }),
              o()(":input:not([type=submit1])", e)
                .filter(t)
                .each(function () {
                  o()(this).prop("disabled", !0);
                }),
              o()("a[id^='on_b']", e).remove(),
              o()("a[id^='off_b']", e).remove(),
              o()("a", e).filter(t).prop("onclick", ""),
              o()(
                "a[id^=opener_picker_], a[data-ca-external-click-id^=opener_picker_]",
                e
              )
                .filter(t)
                .each(function () {
                  o()(this).remove();
                }),
              o()(".attach-images-alt", e).filter(t).remove(),
              o()("tbody[id^='box_add_']", e).filter(t).remove(),
              o()("tr[id^='box_add_']", e).filter(t).remove(),
              o()("[id$='_ajax_select_object']", e)
                .filter(t)
                .each(function () {
                  var e = o()(this)
                      .prop("id")
                      .replace(/_ajax_select_object/, ""),
                    t = o()("#sw_" + e + "_wrap_"),
                    a = t.closest(".dropdown-toggle").parent();
                  a.wrap('<span class="shift-input">' + t.html() + "</span>"),
                    a.remove(),
                    o()(this).remove();
                }),
              o()("a.cm-delete-row", e)
                .filter(t)
                .each(function () {
                  o()(this).remove();
                }),
              o()("button.cm-delete-row", e)
                .filter(t)
                .each(function () {
                  o()(this).remove();
                }),
              o()(e).removeClass("cm-sortable"),
              o()(".cm-sortable-row", e)
                .filter(t)
                .removeClass("cm-sortable-row"),
              o()("p.description", e).filter(t).remove(),
              o()("a.cm-delete-image-link", e).filter(t).remove(),
              o()(".action-add", e).filter(t).remove(),
              o()(".cm-hide-with-inputs", e).filter(t).remove();
          });
      },
      w = function (e) {
        return e
          ? this.on("click", e)
          : (o()(this).each(function () {
              if (document.createEventObject) o()(this).trigger("click");
              else {
                var e = document.createEvent("MouseEvents");
                e.initEvent("click", !0, !0), this.dispatchEvent(e);
              }
            }),
            this);
      },
      M = function (e, t) {
        if ((1 != t && 0 != t && (t = !0), 0 == e || 1 == e)) {
          o()(":input:not(.cm-skip-avail-switch)", this)
            .prop("disabled", e)
            .toggleClass("disabled", e);
          var a = o()(".cm-fileuploader:not(.cm-skip-avail-switch)", this);
          a.prop("hidden", e),
            o()(a).find(".cm-fileuploader-field").prop("disabled", e),
            t && this.toggle(!e);
        } else
          o()(":input:not(.cm-skip-avail-switch)", this).each(function () {
            var e = o()(this),
              t = e.prop("disabled");
            e.prop("disabled", !t),
              e[t ? "removeClass" : "addClass"]("disabled");
          }),
            o()(".cm-fileuploader:not(.cm-skip-avail-switch)", this).each(
              function () {
                var e = o()(this),
                  t = e.prop("hidden");
                e.prop("hidden", !t),
                  e.find(".cm-fileuploader-field").prop("disabled", !t);
              }
            ),
            t && this.toggle();
      },
      k = function () {
        var e = {},
          t = this.serializeArray();
        o.a.each(t, function () {
          void 0 !== e[this.name] && this.name.indexOf("[]") > 0
            ? (e[this.name].push || (e[this.name] = [e[this.name]]),
              e[this.name].push(this.value || ""))
            : (e[this.name] = this.value || "");
        });
        var a = this.find(".cm-j-tabs .active");
        return void 0 !== a && a.length > 0 && (e.active_tab = a.prop("id")), e;
      },
      A = function (e) {
        var t = o()(this);
        t.css("position", "absolute");
        var a = t.is(":hidden");
        a && t.show(), t.position(e), a && t.hide();
      },
      x = a(8),
      T =
        (m.a,
        {
          in_out_callback: function (e, t, a, i, n) {
            if (e.allow_in_out_callback)
              if ("next" == e.options.autoDirection)
                e.add(a + e.options.item_count, o()(t).html()), e.remove(a);
              else {
                var r = o()("li:last", e.list);
                e.add(
                  r.data("caJcarouselindex") - e.options.item_count,
                  r.html()
                ),
                  e.remove(r.data("caJcarouselindex"));
              }
          },
          next_callback: function (e, t, a, i, n) {
            "next" == i &&
              (e.add(a + e.options.item_count, o()(t).html()), e.remove(a));
          },
          prev_callback: function (e, t, a, i, n) {
            if ("prev" == i) {
              var r = o()("li:last", e.list),
                s =
                  ((t = r.html()),
                  r.data("caJcarouselindex") - e.options.item_count);
              e.remove(r.data("caJcarouselindex")), e.add(s, t);
            }
          },
          init_callback: function (e, t) {
            if ("prev" == e.options.autoDirection) {
              var a = e.buttonNext;
              (e.buttonNext = e.buttonPrev), (e.buttonPrev = a);
            }
            o()(".jcarousel-clip", e.container).height(
              e.options.clip_height + "px"
            ),
              o()(".jcarousel-clip", e.container).width(
                e.options.clip_width + "px"
              );
            var i = e.options.clip_width;
            if ((e.container.width(i), i > e.container.width())) {
              var n = e.pos(e.options.start, !0);
              e.animate(n, !1);
            }
            e.clip.hover(
              function () {
                e.stopAuto();
              },
              function () {
                e.startAuto();
              }
            ),
              (!o.a.browser.msie || o.a.browser.version > 8) &&
                o()(window).on("beforeunload", function () {
                  e.allow_in_out_callback = !1;
                }),
              o.a.browser.chrome && o.a.jcarousel.windowLoaded();
          },
        }),
      I = m.a,
      B = {
        open: function (e) {
          e = e || {};
          var t = { is_opening_allowed: !0 };
          if (
            (o.a.ceEvent("trigger", "ce.dialog.before_open", [t, e]),
            !t.is_opening_allowed)
          )
            return !1;
          var a = o()(this);
          if (!a.length) return !1;
          if (
            (a.attr("tabindex", -1).focus(),
            o()("html").addClass("dialog-is-open"),
            a.hasClass("ui-dialog-content"))
          ) {
            if (
              e.view_id &&
              a.data("caViewId") != e.view_id &&
              a.ceDialog("_load_content", e)
            )
              return !1;
            a.dialog("isOpen") &&
              (a.height("auto"),
              a.parent().height("auto"),
              B._resize(o()(this)));
          } else {
            if (a.ceDialog("_load_content", e)) return !1;
            a.ceDialog("_init", e);
          }
          o.a.browser.msie &&
            "auto" == e.width &&
            (e.width = a.dialog("option", "width")),
            0 == o()(".object-container", a).length &&
              (a.wrapInner(
                '<div class="object-container ' +
                  (e.containerClass ? e.containerClass : "") +
                  '" />'
              ),
              a
                .find(".object-container")
                .prepend(
                  '<div class="cm-notification-container-dialog notification-container-dialog"/>'
                )),
            e && a.dialog("option", e),
            o.a.popupStack.add({
              name: a.prop("id"),
              close: function () {
                try {
                  a.dialog("close");
                } catch (e) {}
              },
            }),
            1 == I.isTouch &&
              (o.a.ui.dialog.prototype._focusTabbable = function () {});
          var i = a.dialog("open");
          return e.scroll && o.a.scrollToElm(e.scroll, a), i;
        },
        _is_empty: function () {
          var e = o()(this).html().trim();
          return e && (e = e.replace(/<!--(.*?)-->/g, "")), !e.trim();
        },
        _load_content: function (e) {
          var t = o()(this),
            a = {};
          if (
            ((e.href = e.href || ""),
            e.href &&
              (t.ceDialog("_is_empty") ||
                (e.view_id && t.data("caViewId") != e.view_id)))
          ) {
            if (
              (e.view_id && t.data("caViewId", e.view_id), e.contentRequestForm)
            ) {
              var i = o()("#" + e.contentRequestForm);
              i.length && (a = i.serializeObject());
            }
            return (
              e.actionContext && (a._action_context = e.actionContext),
              o.a.ceAjax("request", e.href, {
                full_render: 0,
                result_ids: t.prop("id"),
                skip_result_ids_check: !0,
                keep_status_box: !0,
                data: a,
                callback: function () {
                  if (t.ceDialog("_is_empty")) {
                    o.a.toggleStatusBox("hide"),
                      0 == o.a.ceDialog("get_last").length &&
                        o()("html").removeClass("dialog-is-open");
                  } else {
                    var a = t.find("img");
                    a.length
                      ? a.each(function (i) {
                          var n = new Image();
                          (n.src = this.src),
                            (n.onload = function () {
                              ++i == a.length &&
                                (o.a.toggleStatusBox("hide"),
                                t.ceDialog("open", e));
                            });
                        })
                      : (o.a.toggleStatusBox("hide"), t.ceDialog("open", e));
                  }
                },
              }),
              !0
            );
          }
          return !1;
        },
        close: function () {
          var e = o()(this);
          e.data("close", !0),
            e.dialog("close"),
            o.a.popupStack.remove(e.prop("id"));
        },
        reload: function () {
          var e = o()(this);
          if (
            o()("img", e).length > 0 &&
            !1 === e.dialog("option", "destroyOnClose")
          ) {
            var t = o.a.debounce(B._resize_and_center);
            o()("img", e).on("load", function () {
              t(e);
            });
          } else B._resize_and_center(e);
        },
        _resize_and_center: function (e) {
          e.ceDialog("resize"),
            e.dialog("option", "position", e.dialog("option", "position"));
        },
        resize: function () {
          var e = this,
            t = e.find(".object-container"),
            a = B._get_buttons(e);
          B.reset_default_height(t, e, a), B._resize(o()(this));
        },
        change_title: function (e) {
          o()(this).dialog("option", "title", e);
        },
        destroy: function () {
          var e = o()(this).prop("id"),
            t = q.indexOf(e);
          o.a.popupStack.remove(e), -1 != t && q.splice(t, 1);
          try {
            o()(this).dialog("destroy");
          } catch (e) {}
        },
        _get_buttons: function (e) {
          var t = e.find(".buttons-container"),
            a = null;
          if (t.length) {
            var i = e.find(".cm-dialog-opener");
            i.length
              ? t.each(function () {
                  var e = !1,
                    t = o()(this);
                  return (
                    i.each(function () {
                      var a = o()(this).data("caTargetId");
                      return !t.parents("#" + a).length || ((e = !0), !1);
                    }),
                    e || (a = t),
                    !0
                  );
                })
              : (a = e.find(".buttons-container:last"));
          }
          return a;
        },
        _init: function (e) {
          e = e || {};
          var t = o()(this),
            a = 80,
            i = e.dialogClass || "";
          o.a.matchScreenSize(["xs", "xs-large", "sm"]) && (a = 0);
          var n = o.a.getWindowSizes(),
            s = t.parent();
          "auto" !== e.height &&
            "A" == I.area &&
            (e.height = n.view_height - a),
            t.find("form").length ||
              t.parents(".object-container").length ||
              t.data("caKeepInPlace") ||
              (e.keepInPlace = !0),
            o.a.ui.dialog.overlayInstances ||
              (o.a.ui.dialog.overlayInstances = 1),
            t.find("script[src]").remove(),
            o.a.browser.msie &&
              "auto" == e.width &&
              (o.a.browser.version < 8 && t.appendTo(I.body),
              (e.width = t.outerWidth() + 10)),
            o.a.matchScreenSize(["xs", "xs-large", "sm"]) &&
              (e.height = n.height),
            t.dialog({
              title: e.title || null,
              autoOpen: !1,
              draggable: !1,
              modal: !0,
              width: e.width || (n.view_width > 926 ? 926 : n.view_width - 120),
              height: e.height,
              maxWidth: 926,
              resizable: !1,
              closeOnEscape: !1,
              dialogClass: i,
              destroyOnClose: e.destroyOnClose || !1,
              closeText: I.tr("close"),
              appendTo: e.keepInPlace ? s : I.body,
              show: 150,
              hide: 150,
              open: function (t, a) {
                var i = o()(this),
                  n = i.dialog("widget");
                if (
                  (n
                    .find(".ui-dialog-titlebar-close")
                    .attr({ "data-dismiss": "modal", type: "button" }),
                  Object(r.a)(e.titleFirstChunk) == Object(r.a)("string") &&
                    Object(r.a)(e.titleSecondChunk) == Object(r.a)("string") &&
                    Object(r.a)(e.titleTemplate) == Object(r.a)("string"))
                ) {
                  var s = o.a.sprintf(e.titleTemplate, [
                    e.titleFirstChunk,
                    e.titleSecondChunk,
                  ]);
                  n.find(".ui-dialog-title").html(s);
                }
                var l = 1099;
                if (q.length) {
                  var c = q.pop(),
                    _ = o()("#" + c).parent(".ui-front");
                  q.push(c), (l = _.css("z-index") ? _.css("z-index") : 0);
                }
                n.css("z-index", ++l), n.prev().css("z-index", l);
                var d = i.prop("id");
                q.push(d),
                  e.keepInPlace || (-1 == S.indexOf(d) && S.push(d)),
                  B._resize(i),
                  o()("html").addClass("dialog-is-open"),
                  o.a.ceEvent("trigger", "ce.dialogshow", [i, t, a]),
                  o()("textarea.cm-wysiwyg", i).ceEditor("destroy"),
                  o()("textarea.cm-wysiwyg", i).ceEditor("recover"),
                  e.switch_avail && i.switchAvailability(!1, !1);
              },
              beforeClose: function (t, a) {
                var i = o()(this),
                  n = o()("textarea.cm-wysiwyg", i);
                n &&
                  n.each(function () {
                    o()(this).ceEditor("destroy");
                  });
                var r = i.find(".object-container"),
                  s = e.nonClosable || !1,
                  l = B._get_buttons(i);
                if (
                  (B.reset_default_height(r, i, l),
                  o()("textarea.cm-wysiwyg", i).ceEditor("destroy"),
                  s && !i.data("close"))
                )
                  return !1;
                q.pop(),
                  e.switch_avail && i.switchAvailability(!0, !1),
                  o.a.ceEvent("trigger", "ce.dialogbeforeclose", [i, t, a]);
              },
              close: function (t, a) {
                o()(this).dialog("option", "destroyOnClose") &&
                  o()(this).dialog("destroy").remove(),
                  setTimeout(function () {
                    0 == o()(".ui-widget-overlay").length &&
                      o()("html").removeClass("dialog-is-open"),
                      e.onClose && e.onClose();
                  }, 50),
                  o.a.ceEvent("trigger", "ce.dialogclose", [o()(this), t, a]);
              },
            });
        },
        _resize: function (e) {
          var t = B._get_buttons(e),
            a = e.find(".cm-picker-options-container"),
            i = e.find(".object-container"),
            n = o.a.getWindowSizes().view_height,
            r = 0,
            s = 0,
            l = 0,
            c = e.parent().outerHeight(!0),
            _ = e.parent().find(".ui-dialog-titlebar").outerHeight();
          t &&
            (t.addClass("buttons-container-picker"), (r = t.outerHeight(!0))),
            a.length && (s = a.outerHeight(!0)),
            c > n && e.parent().outerHeight(n),
            (l = e.parent().outerHeight() - _),
            "C" == I.area
              ? (t &&
                  (c >= n
                    ? ((l -= r), t.css({ position: "absolute", bottom: -r }))
                    : t.css({ position: "absolute", bottom: 0 }),
                  i.outerHeight(l)),
                c > n && i.outerHeight(l))
              : (t &&
                  "A" == I.area &&
                  ((l -= r),
                  t.css({
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                  })),
                o.a.matchScreenSize(["xs", "xs-large", "sm"]) &&
                  (l = e.parent().outerHeight() - _),
                i.outerHeight(l)),
            s &&
              (a.positionElm({
                my: "left top",
                at: "left bottom",
                of: i,
                collision: "none",
              }),
              a.css("width", i.outerWidth()));
        },
        reset_default_height: function (e, t, a) {
          e.height("inherit"),
            t.parent().height("auto"),
            a && a.css({ position: "static" });
        },
      },
      q = [],
      S = [],
      R = m.a,
      L = {
        init: function (e) {
          ((e = e || {}).heightStyle = e.heightStyle || "content"),
            (e.animate =
              e.animate || o()(R.body).data("caAccordionAnimateDelay") || 300),
            o()(this).accordion(e);
        },
        reinit: function (e) {
          o()(this).accordion(e);
        },
      },
      U = (m.a, {}),
      W = "not-loaded",
      K = [],
      F = {
        run: function (e) {
          if (!this.length) return !1;
          "loading" == o.a.ceEditor("state")
            ? o.a.ceEditor("push", this)
            : o.a.ceEditor("run", this, e);
        },
        destroy: function () {
          if (!this.length || "loaded" != o.a.ceEditor("state")) return !1;
          o.a.ceEditor("destroy", this);
        },
        recover: function () {
          if (!this.length || "loaded" != o.a.ceEditor("state")) return !1;
          o.a.ceEditor("recover", this);
        },
        val: function (e) {
          return !!this.length && o.a.ceEditor("val", this, e);
        },
        disable: function (e) {
          if (!this.length || "loaded" != o.a.ceEditor("state")) return !1;
          o.a.ceEditor("disable", this, e);
        },
        change: function (e) {
          var t = this.data("ceeditor_onchange") || [];
          t.push(e), this.data("ceeditor_onchange", t);
        },
        changed: function (e) {
          for (
            var t = this.data("ceeditor_onchange") || [], a = 0;
            a < t.length;
            a++
          )
            t[a](e);
        },
        insert: function (e) {
          return !!this.length && o.a.ceEditor("insert", this, e);
        },
      },
      z =
        (m.a,
        {
          display: function () {
            o.a.cePreviewer("display", this);
          },
        }),
      N =
        (m.a,
        function (e) {
          var t = o()(e);
          if (0 == t.length) return !1;
          var a = t.prop("href").split("#")[1];
          return o()("#" + a);
        }),
      H = {
        init: function () {
          var e = N(this);
          if (0 == e) return !1;
          e.find(".bar").css("width", 0).prop("data-percentage", 0),
            this.trigger("click"),
            this.data("ceProgressbar", !0),
            o.a.ceEvent("trigger", "ce.progress_init");
        },
        setValue: function (e) {
          var t = N(this);
          if (0 == t) return !1;
          this.data("ceProgressbar") || this.ceProgress("init"),
            e.progress &&
              t
                .find(".bar")
                .css("width", e.progress + "%")
                .prop("data-percentage", e.progress),
            e.text && t.find(".modal-body p").html(e.text),
            o.a.ceEvent("trigger", "ce.progress", [e]);
        },
        getValue: function (e) {
          var t = N(this);
          return (
            0 != t &&
            (this.data("ceProgressbar")
              ? parseInt(t.find(".bar").prop("data-percentage"))
              : 0)
          );
        },
        setTitle: function (e) {
          if (0 == N(this)) return !1;
          this.data("ceProgressbar") || this.ceProgress("init"),
            e.title && o()("#comet_title").text(e.title);
        },
        finish: function () {
          var e = N(this);
          if (0 == e) return !1;
          e.find(".bar").css("width", 100).prop("data-percentage", 100),
            e.modal("hide"),
            this.removeData("ceProgressbar"),
            o.a.ceEvent("trigger", "ce.progress_finish");
        },
      },
      V = m.a,
      G = {
        init: function () {
          return (
            !!o.a.history &&
            (o.a.history.init(
              function (e, t) {
                if (t && "result_ids" in t) {
                  var a = G.parseHash("#" + e),
                    i =
                      -1 != a.indexOf(V.current_location)
                        ? a
                        : V.current_location + "/" + a,
                    n = t.result_ids,
                    r = o()('a[data-ca-target-id="' + n + '"]:first'),
                    s = r.prop("name");
                  o.a.ceAjax("request", i, {
                    full_render: t.full_render,
                    result_ids: n,
                    caching: !1,
                    obj: r,
                    skip_history: !0,
                    callback: "ce.ajax_callback_" + s,
                  });
                } else if (V.embedded) {
                  var l = fn_url(window.location.href);
                  l != V.current_url && o.a.redirect(l);
                }
              },
              { unescape: !1 }
            ),
            !0)
          );
        },
        load: function (e, t) {
          var a, i;
          (e = G.prepareHash(e)),
            (i = G.prepareHash(V.current_url)),
            (a = { result_ids: t.result_ids, full_render: t.full_render }),
            o.a.ceEvent("trigger", "ce.history_load", [e]),
            o.a.history.reload(i, a),
            o.a.history.load(e, a);
        },
        prepareHash: function (e) {
          try {
            e = decodeURI(e);
          } finally {
            return (
              -1 !== e.indexOf("://") &&
                (e = e.str_replace(V.current_location + "/", "")),
              (e = "!/" + (e = fn_query_remove(e, ["result_ids"])))
            );
          }
        },
        parseHash: function (e) {
          return (
            -1 !== e.indexOf("%") && (e = decodeURI(e)),
            (-1 != e.indexOf("#!") && e.split("#!/")[1]) || ""
          );
        },
      },
      Y =
        (m.a,
        {
          init: function () {
            return this.each(function () {
              var e = o()(this);
              e.bind({
                click: function () {
                  o()(this).ceHint("_check_hint");
                },
                focus: function () {
                  o()(this).ceHint("_check_hint");
                },
                focusin: function () {
                  o()(this).ceHint("_check_hint");
                },
                blur: function () {
                  o()(this).ceHint("_check_hint_focused");
                },
                focusout: function () {
                  o()(this).ceHint("_check_hint_focused");
                },
              }),
                e.addClass("cm-hint-focused"),
                e.removeClass("cm-hint"),
                e.ceHint("_check_hint_focused");
            });
          },
          is_hint: function () {
            return (
              o()(this).hasClass("cm-hint") &&
              o()(this).val() == o()(this).ceHint("_get_hint_value")
            );
          },
          _check_hint: function () {
            var e = o()(this);
            e.ceHint("is_hint") &&
              (e.addClass("cm-hint-focused"),
              e.val(""),
              e.removeClass("cm-hint"),
              e.prop("name", e.prop("name").str_replace("hint_", "")));
          },
          _check_hint_focused: function () {
            var e = o()(this);
            e.hasClass("cm-hint-focused") &&
              (("" != e.val() && e.val() != e.ceHint("_get_hint_value")) ||
                (e.addClass("cm-hint"),
                e.removeClass("cm-hint-focused"),
                e.val(e.ceHint("_get_hint_value")),
                e.prop("name", "hint_" + e.prop("name"))));
          },
          _get_hint_value: function () {
            return "" != o()(this).prop("title")
              ? o()(this).prop("title")
              : o()(this).prop("defaultValue");
          },
        }),
      J = m.a,
      Z = {
        init: function (e) {
          var t = {
            events: { def: "mouseover, mouseout", input: "focus, blur" },
            layout: '<div><span class="tooltip-arrow"></span></div>',
            use_dynamic_plugin: !0,
          };
          return (
            o.a.extend(t, e),
            this.each(function () {
              var e = o()(this),
                a = t;
              if (e.data("tooltip")) return !1;
              "top" === e.data("ceTooltipPosition")
                ? ((a.position = "top left"),
                  (a.tipClass = "tooltip arrow-top"),
                  (a.offset = [-10, 7]),
                  "rtl" == J.language_direction &&
                    ((a.offset = [-10, -7]), (a.position = "top right")))
                : "center" === e.data("ceTooltipPosition")
                ? ((a.offset = [10, 7]),
                  (a.tipClass = "tooltip arrow-down center"),
                  (a.position = "bottom center"),
                  "rtl" == J.language_direction &&
                    ((a.offset = [10, -7]), (a.position = "bottom center")))
                : "centerRight" === e.data("ceTooltipPosition")
                ? ((a.offset = [0, 7]),
                  (a.tipClass = "tooltip arrow-right center"),
                  (a.position = "center right"),
                  "rtl" == J.language_direction &&
                    ((a.offset = [0, 7]), (a.position = "center right")))
                : "centerLeft" === e.data("ceTooltipPosition")
                ? ((a.offset = [0, -7]),
                  (a.tipClass = "tooltip arrow-left center"),
                  (a.position = "center left"),
                  "rtl" == J.language_direction &&
                    ((a.offset = [0, -7]), (a.position = "center left")))
                : ((a.offset = [10, 7]),
                  (a.tipClass = "tooltip arrow-down"),
                  (a.position = "bottom left"),
                  "rtl" == J.language_direction &&
                    ((a.offset = [10, -7]), (a.position = "bottom right"))),
                "undefined" !== e.data("ceTooltipClass") &&
                  (a.tipClass += " " + e.data("ceTooltipClass")),
                e.data("caTooltipLayoutSelector") &&
                  (a.layout = o()(e.data("caTooltipLayoutSelector")).html()),
                e.data("ceTooltipEventsTooltip") &&
                  (a.events.tooltip = e.data("ceTooltipEventsTooltip")),
                e.tooltip(a),
                a.use_dynamic_plugin &&
                  "function" == typeof e.dynamic &&
                  e.dynamic({ right: {}, left: {} }),
                e.get(0).addEventListener(
                  "DOMNodeRemovedFromDocument",
                  function (e) {
                    o()(e.target).trigger("mouseout");
                  },
                  !1
                ),
                e.on("remove", function () {
                  o()(this).trigger("mouseout");
                });
            })
          );
        },
        show: function () {
          return this.each(function () {
            var e = o()(this);
            if (!e.data("tooltip")) return !1;
            e.data("tooltip").show();
          });
        },
        hide: function () {
          return this.each(function () {
            var e = o()(this);
            if (!e.data("tooltip")) return !1;
            e.data("tooltip").hide();
          });
        },
      },
      Q = m.a,
      X = {
        init: function (e) {
          return this.each(function () {
            var e = Q.tr("text_position_updating"),
              t = o()(this),
              a = t.data("caSortableTable"),
              i = t.data("caSortableIdName"),
              n = {
                accept: "cm-sortable-row",
                items: ".cm-row-item",
                tolerance: "pointer",
                axis: "y",
                containment: "parent",
                opacity: "0.9",
                update: function (t, n) {
                  var r = [],
                    s = [],
                    l = o()(n.item).closest(".cm-sortable");
                  o()(".cm-row-item", l).each(function () {
                    var e = o()(this)
                        .prop("class")
                        .match(/cm-sortable-id-([^\s]+)/i),
                      t = o()(this).index();
                    (r[t] = t), (s[t] = e[1]);
                  });
                  var c = { positions: r.join(","), ids: s.join(",") };
                  return (
                    o.a.ceAjax(
                      "request",
                      fn_url(
                        "tools.update_position?table=" + a + "&id_name=" + i
                      ),
                      { method: "get", caching: !1, message: e, data: c }
                    ),
                    !0
                  );
                },
              };
            o()(".cm-sortable-handle", t).length &&
              (n = o.a.extend(n, {
                opacity: "0.5",
                handle: ".cm-sortable-handle",
              })),
              t.sortable(n);
          });
        },
      },
      ee =
        (m.a,
        {
          init: function (e) {
            if (!o()(this).length) return !1;
            if (!o.a.fn.spectrum) {
              var t = o()(this);
              return (
                o.a.loadCss(["js/lib/spectrum/spectrum.css"], !1, !0),
                o.a.getScript("js/lib/spectrum/spectrum.js", function () {
                  t.ceColorpicker();
                }),
                !1
              );
            }
            var a = [
              [
                "#000000",
                "#434343",
                "#666666",
                "#999999",
                "#b7b7b7",
                "#cccccc",
                "#d9d9d9",
                "#efefef",
                "#f3f3f3",
                "#ffffff",
              ],
              [
                "#980000",
                "#ff0000",
                "#ff9900",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#4a86e8",
                "#0000ff",
                "#9900ff",
                "#ff00ff",
              ],
              [
                "#e6b8af",
                "#f4cccc",
                "#fce5cd",
                "#fff2cc",
                "#d9ead3",
                "#d0e0e3",
                "#c9daf8",
                "#cfe2f3",
                "#d9d2e9",
                "#ead1dc",
              ],
              [
                "#dd7e6b",
                "#ea9999",
                "#f9cb9c",
                "#ffe599",
                "#b6d7a8",
                "#a2c4c9",
                "#a4c2f4",
                "#9fc5e8",
                "#b4a7d6",
                "#d5a6bd",
              ],
              [
                "#cc4125",
                "#e06666",
                "#f6b26b",
                "#ffd966",
                "#93c47d",
                "#76a5af",
                "#6d9eeb",
                "#6fa8dc",
                "#8e7cc3",
                "#c27ba0",
              ],
              [
                "#a61c00",
                "#cc0000",
                "#e69138",
                "#f1c232",
                "#6aa84f",
                "#45818e",
                "#3c78d8",
                "#3d85c6",
                "#674ea7",
                "#a64d79",
              ],
              [
                "#85200c",
                "#990000",
                "#b45f06",
                "#bf9000",
                "#38761d",
                "#134f5c",
                "#1155cc",
                "#0b5394",
                "#351c75",
                "#741b47",
              ],
              [
                "#5b0f00",
                "#660000",
                "#783f04",
                "#7f6000",
                "#274e13",
                "#0c343d",
                "#1c4587",
                "#073763",
                "#20124d",
                "#4c1130",
              ],
            ];
            return this.each(function () {
              var e = o()(this),
                t = {
                  showInput:
                    !e.data("caSpectrumShowInput") ||
                    e.data("caSpectrumShowInput"),
                  showInitial:
                    !!e.data("caSpectrumShowInitial") &&
                    e.data("caSpectrumShowInitial"),
                  showPalette:
                    !!e.data("caSpectrumShowPalette") &&
                    e.data("caSpectrumShowPalette"),
                  showAlpha:
                    !!e.data("caSpectrumShowAlpha") &&
                    e.data("caSpectrumShowAlpha"),
                  showSelectionPalette:
                    !!e.data("caSpectrumShowSelectionPalette") &&
                    e.data("caSpectrumShowSelectionPalette"),
                  palette: e.data("caSpectrumPalette")
                    ? JSON.parse(e.data("caSpectrumPalette"))
                    : a,
                  preferredFormat: e.data("caSpectrumPreferredFormat")
                    ? e.data("caSpectrumPreferredFormat")
                    : "hex6",
                  beforeShow: function () {
                    e.spectrum("option", "showPalette", !0),
                      e.spectrum("option", "showInitial", !0),
                      e.spectrum("option", "showSelectionPalette", !0);
                  },
                  hide: function () {
                    o.a.ceEvent("trigger", "ce.colorpicker.hide");
                  },
                  show: function () {
                    o.a.ceEvent("trigger", "ce.colorpicker.show");
                  },
                };
              e.data("caView") &&
                "palette" == e.data("caView") &&
                (t.showPaletteOnly = !0),
                e.data("caStorage") &&
                  (t.localStorageKey = e.data("caStorage")),
                e.spectrum(t),
                e.spectrum("container").appendTo(e.parent());
            });
          },
          destroy: function () {
            o.a.fn.spectrum && this.spectrum("destroy");
          },
          reset: function () {
            o.a.fn.spectrum && this.spectrum("set", this.val());
          },
          set: function (e) {
            o.a.fn.spectrum && this.spectrum("set", e);
          },
        }),
      te = m.a,
      ae = {
        init: function () {
          ae.setMoreVisibility($(this)), ae.bindEvents();
        },
        showFullText: function (e) {
          ae._getElement("contentMoreBtnWrapper", e).addClass("hidden"),
            ae
              ._getElement("contentMoreText", e)
              .addClass("cs-content-more__text--full");
        },
        setMoreVisibility: function (e) {
          ae._getElement("contentMoreText", e).each(function () {
            var e = $(this);
            ae._getElement("contentMoreBtnWrapper", e).toggleClass(
              "hidden",
              Math.round(e.height()) >= e[0].scrollHeight
            );
          });
        },
        _getElement: function (e, t) {
          return t
            .closest('[data-ca-elem="contentMore"]')
            .find('[data-ca-elem="'.concat(e, '"]'));
        },
        bindEvents: function () {
          $(te.doc).on("click", '[data-ca-elem="contentMoreBtn"]', function () {
            ae.showFullText($(this));
          });
        },
      },
      ie = m.a,
      ne = {},
      oe = {},
      re = [],
      se = {};
    function le(e, t) {
      var a,
        i,
        n,
        r,
        s = {};
      (i = t ? o()(t, e).find("label") : o()("label", e)),
        e.hasClass("cm-outside-inputs") &&
          o.a.each(e.get(0).elements, function (e, t) {
            t.labels &&
              t.labels.length &&
              t.labels.forEach(function (e) {
                i = i.add(o()(e));
              });
          });
      for (var l = 0; l < i.length; l++)
        (n = (a = o()(i[l])).prop("for")) &&
          a.prop("class") &&
          n.match(/^([a-z0-9-_]+)$/i) &&
          !a.parents(".cm-skip-validation").length &&
          (((r = o()("#" + n)).prop("form") && r.prop("form") !== e.get(0)) ||
            (r.length && !r.prop("disabled") && (s[n] = { elm: r, lbl: a })));
      return s;
    }
    function ce(e, t, a, i) {
      var n,
        r,
        s,
        l,
        c,
        _,
        d = !1;
      for (var u in ((a = a || !1),
      (i = i || !a),
      o()(".cm-failed-field", e).removeClass("cm-failed-field"),
      (se = {}),
      t)) {
        if (
          ((n = !1),
          (r = t[u].elm),
          (s = t[u].lbl).hasClass("cm-trim") && !a && r.val(o.a.trim(r.val())),
          s.hasClass("cm-email") &&
            (o.a.is.email(r.val()) ||
              o.a.is.blank(r.val()) ||
              (de(ie.tr("error_validator_email"), s), (n = !0))),
          s.hasClass("cm-color") &&
            0 == o.a.is.color(r.val()) &&
            (s.hasClass("cm-required") || 0 == o.a.is.blank(r.val())) &&
            (de(ie.tr("error_validator_color"), s), (n = !0)),
          s.hasClass("cm-phone") &&
            1 != o.a.is.phone(r.val()) &&
            (s.hasClass("cm-required") || 0 == o.a.is.blank(r.val())) &&
            (de(ie.tr("error_validator_phone"), s), (n = !0)),
          s.hasClass("cm-zipcode"))
        ) {
          var p = s.prop("class").match(/cm-location-([^\s]+)/i)[1] || "",
            f = o()(".cm-country" + (p ? ".cm-location-" + p : ""), e).val(),
            h = r.val();
          ne[f] &&
            !r.val().match(ne[f].regexp) &&
            (s.hasClass("cm-required") || 0 == o.a.is.blank(r.val())) &&
            (de(ie.tr("error_validator_zipcode"), s, null, ne[f].format),
            (n = !0));
        }
        if (
          (s.hasClass("cm-integer") &&
            0 == o.a.is.integer(r.val()) &&
            (s.hasClass("cm-required") || 0 == o.a.is.blank(r.val())) &&
            (de(ie.tr("error_validator_integer"), s), (n = !0)),
          s.hasClass("cm-multiple") &&
            0 == r.prop("length") &&
            (de(ie.tr("error_validator_multiple"), s), (n = !0)),
          s.hasClass("cm-password"))
        ) {
          var m = o()("label.cm-password", e).not(s),
            g = o()("#" + m.prop("for"));
          r.val() &&
            r.val() != g.val() &&
            (de(ie.tr("error_validator_password"), s, m), (n = !0));
        }
        if (re)
          for (var v = 0; v < re.length; v++)
            s.hasClass(re[v].class_name) &&
              1 != (E = re[v].func(u, r, s)) &&
              (de(re[v].message, s), (n = !0));
        if (
          s.hasClass("cm-regexp") &&
          ((c = null),
          (_ = null),
          u in oe
            ? ((c = oe[u].regexp),
              (_ = oe[u].message
                ? oe[u].message
                : ie.tr("error_validator_message")))
            : s.data("caRegexp") &&
              ((c = s.data("caRegexp")), (_ = s.data("caMessage"))),
          c &&
            !r.ceHint("is_hint") &&
            ("" !== r.val() ||
              (!s.hasClass("cm-required") && !s.data("caRegexpAllowEmpty"))))
        ) {
          h = r.val();
          var E = new RegExp(c).test(h);
          E || (de(_, s), (n = !0));
        }
        if (
          (s.hasClass("cm-multiple-checkboxes") ||
            s.hasClass("cm-multiple-radios")) &&
          s.hasClass("cm-required")
        ) {
          var b = s.hasClass("cm-multiple-checkboxes")
            ? "[type=checkbox]"
            : "[type=radio]";
          if (
            o()(b + ":not(:disabled)", r).length &&
            !o()(b + ":checked", r).length
          )
            de(
              s.data("caValidatorErrorMessage") ||
                ie.tr("error_validator_required"),
              s
            ),
              (n = !0);
        }
        if (
          (s.hasClass("cm-all")
            ? 0 == r.prop("length") && s.hasClass("cm-required")
              ? (de(ie.tr("error_validator_multiple"), s), (n = !0))
              : o()("option", r).prop("selected", !0)
            : r.is(":input") &&
              s.hasClass("cm-required") &&
              ((r.is("[type=checkbox]") && !r.prop("checked")) ||
                1 == o.a.is.blank(r.val()) ||
                r.ceHint("is_hint")) &&
              (de(ie.tr("error_validator_required"), s), (n = !0)),
          s.hasClass("cm-required") &&
            r.is(":disabled") &&
            (de(ie.tr("error_validator_required"), s), (n = !0)),
          (l = r.closest(".cm-field-container")).length && (r = l),
          i)
        )
          if (
            (o()(
              '[id="' + u + '_error_message"].help-inline',
              r.parent()
            ).remove(),
            1 == n)
          ) {
            s.parent().addClass("error"),
              r.addClass("cm-failed-field"),
              s.addClass("cm-failed-label");
            var y = r.data(),
              C = y.caErrorMessageTargetNode,
              D = y.caErrorMessageTargetNodeOnScreen,
              j = y.caErrorMessageTargetNodeAfterMode,
              O = y.caErrorMessageTargetNodeChangeOnScreen,
              P = y.caErrorMessageTargetMethod,
              w = !1,
              M = o()(r),
              k = "after";
            if (
              (O &&
                Object(x.matchScreenSize)(O.split(",")) &&
                ((M = o()(D)), (w = !0)),
              C && !w && ((M = o()(C)), j || (k = "html")),
              P && (k = P),
              !r.hasClass("cm-no-failed-msg"))
            ) {
              var A = '<span id="'
                .concat(u, '_error_message" class="help-inline">')
                .concat(pe(u), "</span>");
              M[k](A);
            }
            d || (M.data("caNoScroll") || o.a.scrollToElm(M), (d = !0));
            var T = o.a.ceDialog("get_last");
            if (
              (o()(
                '.cm-dialog-auto-size[data-ca-target-id="' + T.attr("id") + '"]'
              ).length && T.ceDialog("reload"),
              o.a.fn.ceSidebar)
            ) {
              var I = r.closest(".cm-sidebar");
              I.length && I.ceSidebar("open");
            }
          } else
            s.parent().removeClass("error"),
              r.removeClass("cm-failed-field"),
              s.removeClass("cm-failed-label");
        else n && (d = !0);
      }
      return !d;
    }
    function _e(e, t) {
      var a,
        n = !0,
        r = !0,
        s = !1;
      if (
        (((t = t || {}).only_check = t.only_check || !1),
        (t.show_validation_errors = t.show_validation_errors || !t.only_check),
        i ||
          (o()("[type=submit1]", e).length
            ? (i = o()("[type=submit1]:first", e))
            : o()("input[type=image]", e).length &&
              (i = o()("input[type=image]:first", e))),
        !i.hasClass("cm-skip-validation"))
      ) {
        var l = le(e, t.check_filter || i.data("caCheckFilter"));
        !1 === o.a.ceEvent("trigger", "ce.formpre_" + e.prop("name"), [e, i]) &&
          (n = !1),
          (r = ce(e, l, t.only_check, t.show_validation_errors));
      }
      if (t.only_check) return r && n;
      if (r && n) {
        if (
          ((function (e) {
            var t = [];
            e.hasClass("cm-disable-empty") && t.push("input[type=text]"),
              e.hasClass("cm-disable-empty-files") &&
                (t.push("input[type=file]"),
                o()('input[type=file][data-ca-empty-file=""]', e).prop(
                  "disabled",
                  !0
                )),
              t.length &&
                o()(t.join(","), e).each(function () {
                  var e = o()(this);
                  "" == e.val() &&
                    (e.prop("disabled", !0), e.addClass("cm-disabled"));
                });
          })(e),
          e.find(".cm-numeric").each(function () {
            var e = o()(this).autoNumeric("get");
            o()(this).prop("value", e);
          }),
          1 ==
            (a = i.data("original_element")
              ? i.data("original_element")
              : i).data("clicked") && !e.data("caIsMultipleSubmitAllowed"))
        )
          return !1;
        if (
          (a.data("clicked", !0),
          (!e.hasClass("cm-ajax") && !i.hasClass("cm-ajax")) ||
            i.hasClass("cm-no-ajax") ||
            o.a.ceEvent("one", "ce.ajaxdone", function () {
              a.data("clicked", !1);
            }),
          i.hasClass("cm-comet") &&
            o.a.ceEvent("one", "ce.cometdone", function () {
              a.data("clicked", !1);
            }),
          i.hasClass("cm-new-window"))
        )
          return (
            e.prop("target", "_blank"),
            setTimeout(function () {
              a.data("clicked", !1);
            }, 1e3),
            !0
          );
        if (i.hasClass("cm-parent-window"))
          return e.prop("target", "_parent"), !0;
        if (
          (e.prop("target", "_self"),
          !1 ===
            o.a.ceEvent("trigger", "ce.formpost_" + e.prop("name"), [e, i]) &&
            (n = !1),
          i.closest(".cm-dialog-closer").length &&
            setTimeout(function () {
              o.a.ceDialog("get_last").ceDialog("close");
            }, 100),
          (e.hasClass("cm-ajax") || i.hasClass("cm-ajax")) &&
            !i.hasClass("cm-no-ajax"))
        ) {
          var c = e.add(i);
          (c.hasClass("cm-form-dialog-closer") ||
            c.hasClass("cm-form-dialog-opener")) &&
            o.a.ceEvent(
              "one",
              "ce.formajaxpost_" + e.prop("name"),
              function (t, a) {
                if (t.failed_request) return !1;
                if (
                  (c.hasClass("cm-form-dialog-closer") &&
                    ("C" == ie.area
                      ? o.a.ceDialog("get_last").ceDialog("close")
                      : "A" == ie.area && o.a.popupStack.last_close()),
                  c.hasClass("cm-form-dialog-opener"))
                ) {
                  var i = e.find("input[name=result_ids]").val();
                  i &&
                    void 0 !== t.html &&
                    o()("#" + i).ceDialog(
                      "open",
                      o.a.ceDialog("get_params", e)
                    );
                }
              }
            ),
            e.find(".cm-wysiwyg").each(function () {
              o.a.ceEditor("updateTextFields", o()(this));
            }),
            (s = o.a.ceAjax("submit1Form", e, i));
          var _ = c.find(".cm-dialog-opener");
          return (
            _.length &&
              _.each(function () {
                if (o()(this).attr("href")) {
                  var e = "#" + o()(this).data("caTargetId");
                  o()(e).ceDialog("destroy"),
                    o()(e).find(".object-container").remove(),
                    o.a.popupStack.remove(e);
                }
              }),
            s
          );
        }
        return (
          i.hasClass("cm-no-ajax") && o()("input[name=is_ajax]", e).remove(),
          ie.embedded && 1 == n && !o.a.externalLink(e.prop("action"))
            ? (e.append(
                '<input type="hidden" name="result_ids" value="' +
                  ie.container +
                  '" />'
              ),
              i.data("caScroll", ie.container),
              o.a.ceAjax("submit1Form", e, i))
            : (!1 ===
                o.a.ceEvent("trigger", "ce.form.beforeSubmit", [e, i, n]) &&
                (n = !1),
              0 == n && a.data("clicked", !1),
              n)
        );
      }
      if (0 == r) {
        var d = o()(".cm-failed-field", e).parents('[id^="content_"]:hidden');
        d.length &&
          o()(".cm-failed-field", e).length ==
            o()(".cm-failed-field", d).length &&
          d.closest('[id^="content_"]').each(function () {
            o()("#" + o()(this).prop("id").str_replace("content_", "")).click();
          }),
          o.a.ceEvent("trigger", "ce.formcheckfailed_" + e.prop("name"), [
            e,
            i,
          ]);
      }
      return !1;
    }
    function de(e, t, a, i) {
      var n = t.prop("for");
      if (se[n]) return !1;
      (se[n] = []),
        (e = e.str_replace("[field]", ue(t))),
        a && (e = e.str_replace("[field2]", ue(a))),
        i && (e = e.str_replace("[extra]", i)),
        se[n].push(e);
    }
    function ue(e) {
      return e.text().replace(/(\s*\(\?\))?:\s*$/, "");
    }
    function pe(e) {
      return "<p>" + se[e].join("</p><p>") + "</p>";
    }
    var fe = {
        init: function () {
          var e = o()(this);
          e.on("submit1", function (t) {
            return _e(e);
          });
        },
        setClicked: function (e) {
          i = e;
        },
        check: function (e, t, a) {
          var i = o()(this);
          return (
            void 0 === e && (e = !0),
            void 0 === t && (t = null),
            void 0 === a && (a = !1),
            _e(i, { only_check: e, filter: t, show_validation_errors: a })
          );
        },
        checkFields: function (e, t, a) {
          var i = o()(this);
          return (
            void 0 === e && (e = !0),
            void 0 === t && (t = null),
            void 0 === a && (a = !1),
            ce(i, le(i, t), e, a)
          );
        },
      },
      he = m.a,
      me = {},
      ge = !1;
    function ve() {
      var e = o()(this)
        .prop("class")
        .match(/cm-location-([^\s]+)/i);
      e &&
        (function (e, t) {
          t = t || o()(".cm-state.cm-location-" + e).prop("id");
          var a =
              o()("select#" + t).length > 0
                ? o()("select#" + t)
                : o()("select#".concat(t, "_d")),
            i =
              o()("input#" + t).length > 0
                ? o()("input#" + t)
                : o()("input#".concat(t, "_d")),
            n = o()(".cm-country.cm-location-" + e).last(),
            r = i.val(),
            s = n.length ? n.val() : me.default_country,
            l = n.length ? n.prop("disabled") : a.prop("disabled"),
            c = a.is(":focus") || i.is(":focus");
          a
            .prop("id", t)
            .prop("disabled", !1)
            .removeClass("hidden cm-skip-avail-switch"),
            i
              .prop("id", t + "_d")
              .prop("disabled", !0)
              .addClass("hidden cm-skip-avail-switch")
              .val(""),
            i.hasClass("disabled") || a.removeClass("disabled");
          var _ = i.attr("id"),
            d = a.attr("id");
          if (me.states && me.states[s]) {
            a.find("option").each(function () {
              var e = o()(this);
              e.val() && "skip" !== e.data("caRebuildStates") && e.remove();
            });
            for (var u = 0; u < me.states[s].length; u++)
              a.append(
                '<option value="'
                  .concat(
                    me.states[s][u].code,
                    '" \n                            '
                  )
                  .concat(
                    me.states[s][u].code == r ? " selected" : "",
                    ">\n                            "
                  )
                  .concat(
                    me.states[s][u].state,
                    "\n                         </option>"
                  )
              );
            a
              .prop("id", t)
              .prop("disabled", !1)
              .removeClass("cm-skip-avail-switch"),
              i
                .prop("id", t + "_d")
                .prop("disabled", !0)
                .addClass("cm-skip-avail-switch"),
              c && a.focus(),
              i.hasClass("disabled") || a.removeClass("disabled"),
              o()("label[for*=".concat(_, "]")).addClass("cm-required"),
              o()("label[for*=".concat(d, "]")).addClass("cm-required");
          } else
            a
              .prop("id", t + "_d")
              .prop("disabled", !0)
              .addClass("hidden cm-skip-avail-switch"),
              i
                .prop("id", t)
                .prop("disabled", !1)
                .removeClass("hidden cm-skip-avail-switch")
                .val(""),
              o()("label[for*=".concat(_, "]")).removeClass("cm-required"),
              o()("label[for*=".concat(d, "]")).removeClass("cm-required"),
              c && i.focus(),
              a.hasClass("disabled") || i.removeClass("disabled");
          !0 === l && (a.prop("disabled", !0), i.prop("disabled", !0)),
            o.a.ceEvent("trigger", "ce.rebuild_states");
        })(
          e[1],
          o()(".cm-state.cm-location-" + e[1])
            .not(":disabled")
            .last()
            .prop("id")
        );
    }
    var Ee,
      be = {
        init: function () {
          o()(this).hasClass("cm-country")
            ? (0 == ge &&
                (o()(he.doc).on("change", "select.cm-country", ve), (ge = !0)),
              o()(this).trigger("change", { is_triggered_by_user: !1 }))
            : ve.call(this);
        },
      },
      ye =
        (m.a,
        o()(window),
        {
          init: function (e) {
            var t = !1;
            if (
              !(t =
                (t =
                  (t =
                    t ||
                    (o.a.browser.edge && +o.a.browser.version < 17.17134) ||
                    !1) ||
                  o.a.browser.msie ||
                  !1) ||
                (o.a.browser.chrome &&
                  +o.a.browser.version.split(".")[0] < 63) ||
                !1)
            )
              return this.each(function () {
                var e = o()(this);
                e.data("caStickOnScreens") &&
                  e.data("caStickOnScreens").split(",");
                e.css({ position: "sticky", top: e.data("caTop") || 0 }),
                  o.a.browser.safari && e.css({ position: "-webkit-sticky" });
              });
            o()("body").toggleClass("sticky-no-support");
          },
        }),
      Ce = m.a,
      De = {},
      je = 0,
      Oe =
        '<span class="ty-icon cm-icon-live-edit icon-live-edit ty-icon-live-edit"></span>';
    function Pe(e) {
      return (
        Ce.live_editor_mode &&
          -1 != e.indexOf("[lang") &&
          (e =
            '<var class="live-edit-wrap">' +
            Oe +
            '<var class="cm-live-edit live-edit-item" data-ca-live-edit="langvar::' +
            e.substring(e.indexOf("=") + 1, e.indexOf("]")) +
            '">' +
            e.substring(e.indexOf("]") + 1, e.lastIndexOf("[")) +
            "</var></var>"),
        e
      );
    }
    function we(e) {
      var t = o()(".cm-notification-content", o()(e.target));
      return t.length && (Me(t) || Ee.append(t)), !0;
    }
    function Me(e) {
      var t = o.a.ceDialog("get_last");
      return (
        !!t.length &&
        (o()(".cm-notification-container-dialog", t).prepend(e),
        t.off("dialogclose", we),
        t.on("dialogclose", we),
        !0)
      );
    }
    var ke = {
        show: function (e, t) {
          if ((t || (t = o.a.crc32(e.message)), void 0 === e.message))
            return !1;
          if (
            (function (e) {
              var t = o()("div[data-ca-notification-key=" + e + "]");
              return (
                !!t.length &&
                (Me(t) ||
                  t
                    .fadeTo("fast", 0.5)
                    .fadeTo("fast", 1)
                    .fadeTo("fast", 0.5)
                    .fadeTo("fast", 1),
                De[e] && (clearTimeout(De[e]), ke.close(t, !0)),
                !0)
              );
            })(t)
          )
            return !0;
          if (
            ((e.message = Pe(e.message)),
            (e.title = Pe(e.title)),
            "I" == e.type)
          ) {
            o()(
              ".cm-notification-content.cm-notification-content-extended"
            ).each(function () {
              ke.close(o()(this), !1);
            }),
              o()(Ce.body).append(
                '<div class="ui-widget-overlay" style="z-index:1010" data-ca-notification-key="' +
                  t +
                  '"></div>'
              );
            var a = o()(
              '<div class="cm-notification-content cm-notification-content-extended notification-content-extended ' +
                ("I" == e.message_state ? " cm-auto-hide" : "") +
                '" data-ca-notification-key="' +
                t +
                '"><h1>' +
                e.title +
                '<span class="cm-notification-close close"></span></h1><div class="notification-body-extended">' +
                e.message +
                "</div></div>"
            );
            ke.position(a);
          } else {
            var i = "alert",
              n = "";
            "N" == e.type
              ? (i += " alert-success")
              : "W" == e.type
              ? (i += " alert-warning")
              : "S" == e.type
              ? (i += " alert-info")
              : (i += " alert-error"),
              "I" == e.message_state
                ? (i += " cm-auto-hide")
                : "S" == e.message_state &&
                  (n += " cm-notification-close-ajax"),
              Me(
                (a = o()(
                  '<div class="cm-notification-content notification-content ' +
                    i +
                    '" data-ca-notification-key="' +
                    t +
                    '"><button type="button" class="close cm-notification-close ' +
                    n +
                    '" data-dismiss="alert">&times;</button><strong>' +
                    e.title +
                    "</strong>" +
                    e.message +
                    "</div>"
                ))
              ) || Ee.append(a);
          }
          o.a.ceEvent("trigger", "ce.notificationshow", [a]),
            "I" == e.message_state && ke.close(a, !0);
        },
        showMany: function (e) {
          for (var t in e) ke.show(e[t], t);
        },
        closeAll: function () {
          var e = Ee.find(".cm-notification-content"),
            t = o.a.ceDialog("get_last");
          t.length && (e = e.add(t.find(".cm-notification-content"))),
            e.each(function () {
              var e = o()(this);
              e.hasClass("cm-notification-close-ajax") || ke.close(e, !1);
            });
        },
        close: function (e, t) {
          if (1 == t)
            return (
              0 === je ||
              ((De[e.data("caNotificationKey")] = setTimeout(function () {
                ke.close(e, !1);
              }, je)),
              !0)
            );
          !(function (e) {
            if (
              (e.find(".cm-notification-close-ajax").length &&
                o.a.ceAjax(
                  "request",
                  fn_url(
                    "notifications.close?notification_id=" +
                      e.data("caNotificationKey")
                  ),
                  { hidden: !0 }
                ),
              e.fadeOut("fast", function () {
                e.remove();
              }),
              e.hasClass("cm-notification-content-extended"))
            ) {
              var t = o()(
                ".ui-widget-overlay[data-ca-notification-key=" +
                  e.data("caNotificationKey") +
                  "]"
              );
              t.length &&
                t.fadeOut("fast", function () {
                  t.remove();
                });
            }
            0 == o()(".ui-dialog").is(":visible") &&
              o()("html").removeClass("dialog-is-open");
          })(e);
        },
        init: function () {
          (je = 1e3 * Ce.notice_displaying_time),
            (Ee = o()(".cm-notification-container")),
            o()(Ce.doc).on("click", ".cm-notification-close", function () {
              ke.close(o()(this).parents(".cm-notification-content:first"), !1);
            }),
            Ee.find(".cm-auto-hide").each(function () {
              ke.close(o()(this), !0);
            }),
            o()(".cm-notification-content.notification-content-extended").each(
              function (e, t) {
                var a = o()(t);
                ke.position(a);
              }
            );
        },
        position: function (e) {
          var t = o.a.getWindowSizes(),
            a = t.view_height - 300;
          e.find(".cm-notification-max-height").css({ "max-height": a }),
            o()(Ce.body).append(e),
            e.css("top", t.view_height / 2 - e.height() / 2);
        },
      },
      Ae = (m.a, {}),
      xe = {
        on: function (e, t, a) {
          (a = a || !1),
            e in Ae || (Ae[e] = []),
            Ae[e].push({ handler: t, one: a });
        },
        one: function (e, t) {
          xe.on(e, t, !0);
        },
        trigger: function (e, t) {
          t = t || [];
          var a,
            i = !0;
          if (e in Ae)
            for (var n = 0; n < Ae[e].length; n++)
              if (
                ((a = Ae[e][n].handler.apply(Ae[e][n].handler, t)),
                Ae[e][n].one && (Ae[e].splice(n, 1), n--),
                !1 === a)
              ) {
                i = !1;
                break;
              }
          return i;
        },
      },
      Te =
        (m.a,
        {
          _init: function (e) {
            if (!e.data("codeEditor")) {
              var t = ace.edit(e.prop("id"));
              t.session.setUseWrapMode(!0),
                t.session.setWrapLimitRange(),
                t.setFontSize("14px"),
                t.renderer.setShowPrintMargin(!1),
                t.getSession().on("change", function (t) {
                  e.addClass("cm-item-modified");
                }),
                e.data("codeEditor", t);
            }
            return o()(this);
          },
          init: function (e) {
            var t = o()(this);
            return (
              Te._init(t),
              e && t.data("codeEditor").getSession().setMode(e),
              o()(this)
            );
          },
          set_value: function (e, t) {
            var a = o()(this);
            return (
              Te._init(a),
              void 0 == t && (t = "ace/mode/html"),
              a.data("codeEditor").getSession().setMode(t),
              a.data("codeEditor").setValue(e),
              a.data("codeEditor").navigateLineStart(),
              a.data("codeEditor").clearSelection(),
              a.data("codeEditor").scrollToRow(0),
              o()(this)
            );
          },
          set_show_gutter: function (e) {
            o()(this).data("codeEditor").renderer.setShowGutter(e);
          },
          value: function () {
            var e = o()(this);
            return Te._init(e), e.data("codeEditor").getValue();
          },
          focus: function () {
            var e = o()(this),
              t = e.data("codeEditor").getSession(),
              a = t.getLength();
            e.data("codeEditor").focus(),
              e.data("codeEditor").gotoLine(a, t.getLine(a - 1).length);
          },
          set_listener: function (e, t) {
            return (
              o()(this)
                .data("codeEditor")
                .getSession()
                .on(e, function (e) {
                  t(e);
                }),
              o()(this)
            );
          },
        }),
      Ie = m.a,
      Be = {
        pageSize: 10,
        enableSearch: !0,
        closeOnSelect: !0,
        loadViaAjax: !1,
        dataUrl: null,
        enableImages: !1,
        imageWidth: 20,
        imageHeight: 20,
        placeholder: null,
        allowClear: !1,
        debug: !1,
        autofocus: !1,
        dropdownCssClass: "",
        delay: 0,
      };
    function qe(e, t) {
      (this.$el = o()(e)), (this.settings = o.a.extend({}, Be, t)), this.init();
    }
    o.a.extend(qe.prototype, {
      init: function () {
        var e = this.$el.data();
        (this.settings.bulkEditMode = e.caBulkEditMode || !1),
          (this.settings.dropdownParent = e.caDropdownParent || !1),
          (this.settings.placeholder =
            e.caPlaceholder || this.settings.placeholder),
          (this.settings.pageSize = e.caPageSize || this.settings.pageSize),
          (this.settings.dataUrl = e.caDataUrl || this.settings.dataUrl),
          (this.settings.loadViaAjax =
            void 0 === e.caLoadViaAjax
              ? this.settings.loadViaAjax
              : e.caLoadViaAjax),
          (this.settings.closeOnSelect =
            void 0 === e.caCloseOnSelect
              ? this.settings.closeOnSelect
              : e.caCloseOnSelect),
          (this.settings.enableImages =
            void 0 === e.caEnableImages
              ? this.settings.enableImages
              : e.caEnableImages),
          (this.settings.enableSearch =
            void 0 === e.caEnableSearch
              ? this.settings.enableSearch
              : e.caEnableSearch),
          (this.settings.imageWidth =
            void 0 === e.caImageWidth
              ? this.settings.imageWidth
              : e.caImageWidth),
          (this.settings.imageHeight =
            void 0 === e.caImageHeight
              ? this.settings.imageHeight
              : e.caImageHeight),
          (this.settings.multiple =
            void 0 === this.settings.multiple
              ? this.$el.is("[multiple]")
              : this.settings.multiple),
          (this.settings.debug =
            void 0 === e.debug ? this.settings.debug : e.caDebug),
          (this.settings.allowClear =
            void 0 === e.caAllowClear
              ? this.settings.allowClear
              : e.caAllowClear),
          (this.settings.autofocus =
            void 0 === e.caAutofocus ? this.settings.autofocus : e.caAutofocus),
          (this.settings.dropdownCssClass =
            e.caDropdownCssClass || this.settings.dropdownCssClass),
          (this.settings.delay = e.caAjaxDelay || this.settings.delay),
          (this.settings.allowSorting = e.caAllowSorting || !1),
          (this.settings.escapeHtml =
            void 0 === e.caEscapeHtml || e.caEscapeHtml),
          (this.settings.addTemplateSelectionHook =
            void 0 !== e.caAddTemplateSelectionHook &&
            e.caAddTemplateSelectionHook),
          (this.settings.isRequired = void 0 !== e.caRequired && e.caRequired),
          (this.settings.width = void 0 !== e.caSelectWidth && e.caSelectWidth),
          (this.settings.repaintDropdownOnChange =
            e.caRepaintDropdownOnChange || !1),
          (this.settings.templateType = e.caTemplateType || ""),
          (this.settings.enableAdd = e.caEnableAdd || !1),
          (this.settings.templateResultSelector =
            e.caTemplateResultSelector || ""),
          (this.settings.templateSelectionSelector =
            e.caTemplateSelectionSelector || ""),
          (this.settings.templateResultAddSelector =
            e.caTemplateResultAddSelector || ""),
          (this.settings.newValueHolderSelector =
            e.caNewValueHolderSelector || null),
          (this.settings.newValueAllowMultiple =
            e.caNewValueAllowMultiple || !1),
          this.initSelect2(this.settings);
      },
      initSelect2: function (e) {
        var t = this,
          a = {
            language: {
              loadingMore: function () {
                return Ie.tr("loading");
              },
              searching: function () {
                return Ie.tr("loading");
              },
              errorLoading: function () {
                return Ie.tr("error");
              },
              noResults: function () {
                return Ie.tr("nothing_found");
              },
            },
            closeOnSelect: this.settings.closeOnSelect,
            placeholder: this.settings.placeholder,
            allowClear: this.settings.allowClear,
            multiple: this.settings.multiple,
            dropdownCssClass: this.settings.dropdownCssClass,
          };
        this.settings.loadViaAjax &&
          null !== this.settings.dataUrl &&
          (a.ajax = {
            url: this.settings.dataUrl,
            delay: this.settings.delay,
            data: function (e) {
              var a = {
                q: e.term,
                page: e.page || 1,
                page_size: t.settings.pageSize,
              };
              return (
                t.settings.enableImages &&
                  ((a.image_width = t.settings.imageWidth),
                  (a.image_height = t.settings.imageHeight)),
                a
              );
            },
            processResults: function (e, a) {
              return (
                (a.page = a.page || 1),
                {
                  results: e.objects,
                  pagination: {
                    more: a.page * t.settings.pageSize < e.total_objects,
                  },
                }
              );
            },
            transport: function (e, t, a) {
              return (
                (e.callback = t),
                (e.hidden = !0),
                o.a.ceAjax("request", e.url, e)
              );
            },
          }),
          this.settings.escapeHtml ||
            (a.escapeMarkup = function (e) {
              return e;
            }),
          (a.templateSelection = function (a, i) {
            a.content || (a.content = { text: a.text, append: "" });
            var n = "";
            (a.type = t.settings.templateType),
              (a.bulkEditMode = e.bulkEditMode),
              (a.context = a.text),
              t.templateResultAddSelector && a.newTag
                ? (n = o()(t.settings.templateResultAddSelector).html())
                : t.settings.templateSelectionSelector &&
                  (n = o()(t.settings.templateSelectionSelector).html());
            var r = Object.assign({}, o()(a.element).data()).data;
            return (
              r && (a.data = r.data),
              void 0 !== a.element &&
                o()(a.element).data("caObjectSelectorItemTemplate") &&
                (a.context = o()(a.element).data(
                  "caObjectSelectorItemTemplate"
                )),
              n &&
                (Object.keys(a.content).forEach(function (e) {
                  n = n.str_replace("[".concat(e, "]"), a.content[e]);
                }),
                (a.context = n)),
              o.a.ceEvent("trigger", "ce.select_template_selection", [
                a,
                i,
                t.$el,
              ]),
              a.context
            );
          });
        var i = this.$el;
        if (
          this.settings.data &&
          ((a.data = this.settings.data), Array.isArray(a.data))
        ) {
          var n = {};
          i.find("option").each(function () {
            n[o()(this).val()] = o()(this);
          }),
            this.settings.data.forEach(function (e) {
              e.id &&
                e.text &&
                n[e.id] &&
                !n[e.id].text() &&
                n[e.id].text(e.text);
            });
        }
        (this.settings.templateSelectionSelector ||
          this.settings.enableImages ||
          this.settings.enableAdd) &&
          (a.templateResult = function (e) {
            if (e.loading) return e.text;
            if (
              (e.content || (e.content = { text: e.text, append: "" }),
              t.settings.enableImages && !e.image_url)
            )
              return o()("<span>" + e.text + "</span>");
            (e.type = t.settings.templateType), (e.context = e.text);
            var a = "";
            return (
              o.a.ceEvent("trigger", "ce.select_template_result", [e, i]),
              t.settings.enableImages &&
                e.image_url &&
                (e.content.append = e.image_url),
              t.settings.enableAdd && e.newTag
                ? (a = o()(t.settings.templateResultAddSelector).html())
                : t.settings.templateResultSelector &&
                  (a = o()(t.settings.templateResultSelector).html()),
              a &&
                (Object.keys(e.content).forEach(function (t) {
                  var i = new RegExp(
                    "\\[".concat(
                      t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
                      "\\]"
                    ),
                    "g"
                  );
                  a = a.replace(i, e.content[t]);
                }),
                (e.context = a)),
              o.a.ceEvent("trigger", "ce.change_select_list", [e, i]),
              a
                ? o()(e.context)
                : e.image_url
                ? o()(
                    '<img src="' +
                      e.image_url +
                      '" alt="' +
                      e.text +
                      '" /><span>' +
                      e.context +
                      "</span>"
                  )
                : o()("<span>" + e.context + "</span>")
            );
          }),
          this.settings.enableSearch || (a.minimumResultsForSearch = 1 / 0),
          this.settings.width && (a.width = this.settings.width),
          this.settings.repaintDropdownOnChange &&
            this.$el.on("select2:select select2:unselect", function () {
              var e = o()(this).data("select2");
              e.isOpen() && e.dropdown._positionDropdown();
            }),
          this.settings.dropdownParent &&
            (a.dropdownParent = o()(this.settings.dropdownParent)),
          this.settings.enableAdd &&
            ((a.tags = !0),
            (a.createTag = function (e) {
              var a = o.a.trim(e.term);
              if ("" === a) return null;
              var n = {
                id: a,
                text: a,
                newTag: !0,
                type: t.settings.templateType,
                content: { text: a },
              };
              return (
                o.a.ceEvent("trigger", "ce.select2.create_tag", [i, n, a]),
                n.content.append || (n.content.append = ""),
                n
              );
            })),
          i.select2(a),
          o.a.ceEvent("on", "ce.window.resize", function (e, t) {
            var a = i.parent();
            a.hasClass("select2-wrapper--width-auto") ||
              a
                .find("input.select2-search__field, .select2-container")
                .css({ width: "100%" });
          }),
          o.a.ceEvent("on", "ce.tab.show", function (e, t) {
            o()(window).width() <= 768 &&
              i
                .parent()
                .find("input.select2-search__field, .select2-container")
                .css({ width: "100%" });
          }),
          this.settings.allowSorting && this.$el.select2Sortable(),
          this.settings.autofocus && this.$el.select2("focus"),
          i.on("select2:select", function (e) {
            var a = e.params.data;
            if (t.settings.newValueHolderSelector)
              if (t.settings.newValueAllowMultiple) {
                if (a.newTag) {
                  var n = o()(t.settings.newValueHolderSelector).last(),
                    r = n.val() ? n.clone() : n;
                  r.val(a.id), r.insertAfter(n);
                }
              } else
                a.newTag
                  ? o()(t.settings.newValueHolderSelector).val(a.id)
                  : o()(t.settings.newValueHolderSelector).val(null);
            o.a.ceEvent("trigger", "ce.select2.select", [i, a, e]);
          }),
          i.on("select2:unselect", function (e) {
            var a = e.params.data;
            if (t.settings.newValueHolderSelector && a.newTag) {
              var n = o()(t.settings.newValueHolderSelector);
              n.length > 1
                ? n.each(function (e, t) {
                    var i = o()(t);
                    i.val() === a.id && i.remove();
                  })
                : n.val(null);
            }
            o.a.ceEvent("trigger", "ce.select2.unselect", [i, e]);
          }),
          o.a.ceEvent("trigger", "ce.select2.init", [i]);
      },
    });
    m.a;
    var Se,
      Re = {
        init: function (e) {
          var t = this.get(0);
          if (document.selection)
            t.focus(), (document.selection.createRange().text = e), t.focus();
          else if (t.selectionStart || "0" == t.selectionStart) {
            var a = t.selectionStart,
              i = t.selectionEnd,
              n = t.scrollTop;
            (t.value =
              t.value.substring(0, a) +
              e +
              t.value.substring(i, t.value.length)),
              t.focus(),
              (t.selectionStart = a + e.length),
              (t.selectionEnd = a + e.length),
              (t.scrollTop = n);
          } else (t.value += e), t.focus();
        },
      },
      Le =
        (m.a,
        {
          init: function () {
            var e = o()(this);
            return e.length
              ? (o.a.fn.bootstrapSwitch
                  ? e.bootstrapSwitch()
                  : o.a.getScript(
                      "js/lib/bootstrap_switch/js/bootstrapSwitch.js",
                      function () {
                        e.bootstrapSwitch();
                      }
                    ),
                e)
              : e;
          },
          isActive: function () {
            return o()(this).bootstrapSwitch("isActive");
          },
          setActive: function (e) {
            o()(this).bootstrapSwitch("setActive", e),
              o()(this).find("input").prop("disabled", !e);
          },
          getStatus: function () {
            return o()(this).bootstrapSwitch("status");
          },
        }),
      Ue =
        (m.a,
        {
          selectToggler: function (e, t) {
            e.prop("checked", !1), t.prop("checked", !0).prop("disabled", !0);
          },
          init: function () {
            var e = o()(this),
              t = e.data("caCheckboxGroupRole"),
              a = e.data("caCheckboxGroup"),
              i = o()(
                '[data-ca-checkbox-group="'
                  .concat(a, '"][data-ca-checkbox-group-role="')
                  .concat("togglee", '"]')
              ),
              n = o()(
                '[data-ca-checkbox-group="'
                  .concat(a, '"][data-ca-checkbox-group-role="')
                  .concat("toggler", '"]')
              );
            e.on("change", function (a) {
              var r = e.is(":checked"),
                s = !1;
              i.each(function (e, t) {
                o()(t).is(":checked") && (s = !0);
              }),
                "toggler" === t && r
                  ? Ue.selectToggler(i, n)
                  : "togglee" === t && r
                  ? n.prop("checked", !1).prop("disabled", !1)
                  : "togglee" !== t || s || Ue.selectToggler(i, n);
            });
          },
        }),
      We = {
        container_selector: "[data-ca-block-manager-container-id]",
        row_selector: "[data-ca-block-manager-row-id]",
        grid_selector: "[data-ca-block-manager-grid-id]",
        block_selector: "[data-ca-block-manager-snapping-id]",
        blocks_place_selector: "[data-ca-block-manager-blocks-place]",
        block_disabled_class: "bm-block-manager__block--disabled",
        block_got_up_class: "bm-block-manager__block--got-up",
        block_got_down_class: "bm-block-manager__block--got-down",
        block_menu_wrapper_bottom_class:
          "bm-block-manager__menu-wrapper--bottom",
        block_menu_bottom_class: "bm-block-manager__menu--bottom",
        menu_wrapper_selector: "[data-ca-block-manager-menu-wrapper]",
        menu_selector: "[data-ca-block-manager-menu]",
        action_selector: "[data-ca-block-manager-action]",
        switch_selector: "[data-ca-block-manager-switch]",
        switch_icon_selector: "[data-ca-block-manager-switch-icon]",
        switch_icon_show_selector: '[data-ca-block-manager-switch-icon="show"]',
        switch_icon_hide_selector: '[data-ca-block-manager-switch-icon="hide"]',
        switch_icon_hidden_class: "bm-block-manager__icon--hidden",
        move_selector: "[data-ca-block-manager-move]",
        left_alignment_selector:
          '[data-ca-block-manager-is-left-alignment="true"]',
        right_alignment_selector:
          '[data-ca-block-manager-is-right-alignment="true"]',
        float_left_class: "ty-float-left",
        float_right_class: "ty-float-right",
        sortable_items_selector:
          "> *:not(#litecheckout_form):not(#litecheckout_final_section)",
        offset_threshold: 50,
        _hover_element: {},
        _self: {},
      },
      Ke = {
        sendRequest: function (e, t, a) {
          o.a.ceAjax(
            "request",
            fn_url("block_manager." + e + (t ? "." + t : "")),
            { data: a, method: "post" }
          );
        },
      },
      Fe = {
        up: function () {
          We._hover_element.addClass(We.block_got_up_class),
            setTimeout(function () {
              We._hover_element.removeClass(We.block_got_up_class),
                We._hover_element.trigger(
                  "block_manager:animation_complete",
                  "up"
                );
            }, 300);
        },
        down: function () {
          We._hover_element.addClass(We.block_got_down_class),
            setTimeout(function () {
              We._hover_element.removeClass(We.block_got_down_class),
                We._hover_element.trigger(
                  "block_manager:animation_complete",
                  "down"
                );
            }, 300);
        },
      },
      $e = {
        _snapBlocks: function (e) {
          var t = {};
          return (
            e
              .parent()
              .find(We.block_selector)
              .each(function () {
                var e = o()(this),
                  a = e.index();
                t[a] = {
                  grid_id: e
                    .closest(We.grid_selector)
                    .data("caBlockManagerGridId"),
                  order: a,
                  snapping_id: e.data("caBlockManagerSnappingId"),
                  action: "update",
                };
              }),
            t
          );
        },
        _executeAction: function (e) {
          var t = !1;
          return (
            "switch" == e
              ? (t = $e._blockSwitch())
              : "move" == e && (t = $e._blockMove()),
            t
          );
        },
        _blockSwitch: function () {
          var e = We._self.data("caBlockManagerSwitch") ? "A" : "D",
            t = We._self.find(We.switch_icon_show_selector),
            a = We._self.find(We.switch_icon_hide_selector),
            i = {
              snapping_id: We._hover_element.data("caBlockManagerSnappingId"),
              object_id: 0,
              object_type: "",
              status: e,
              type: "block",
            };
          return (
            Ke.sendRequest("update_status", "", i),
            "A" === e
              ? (We._self.removeClass(We.block_disabled_class),
                We._hover_element.removeClass(We.block_disabled_class),
                We._self.data("caBlockManagerSwitch", !1),
                a.addClass(We.switch_icon_hidden_class),
                t.removeClass(We.switch_icon_hidden_class))
              : (We._self.addClass(We.block_disabled_class),
                We._hover_element.addClass(We.block_disabled_class),
                We._self.data("caBlockManagerSwitch", !0),
                t.addClass(We.switch_icon_hidden_class),
                a.removeClass(We.switch_icon_hidden_class)),
            !0
          );
        },
        _blockMove: function () {
          var e = We._self.data("caBlockManagerMove"),
            t = We._hover_element,
            a = $e._getNearElem(t, e);
          if (o.a.isEmptyObject(a)) return !0;
          var i = $e._getBlockMovingTactics(t, a, e);
          return (
            $e._setBlockFloats(t, a),
            t[i](a),
            $e._updateBlock(t),
            Fe[e](),
            Ke.sendRequest("snapping", "", {
              snappings: $e._snapBlocks(We._hover_element),
            }),
            !0
          );
        },
        _updateBlock: function (e) {
          return (
            o()(window).trigger("resize"),
            e.find(".cm-image-gallery").each(function () {
              o()(this).data("owlCarousel").reinit();
            }),
            !0
          );
        },
        _setMenuPosition: function (e) {
          var t = e.offset().top < We.offset_threshold;
          return (
            e
              .find(We.menu_wrapper_selector)
              .toggleClass(We.block_menu_wrapper_bottom_class, t),
            e.find(We.menu_selector).toggleClass(We.block_menu_bottom_class, t),
            !0
          );
        },
        _setBlockFloats: function (e, t) {
          var a =
              t.closest(We.grid_selector).filter(We.left_alignment_selector)
                .length > 0,
            i =
              t.closest(We.grid_selector).filter(We.right_alignment_selector)
                .length > 0;
          return (
            e.toggleClass(We.float_left_class, (a && i) || a),
            e.toggleClass(We.float_right_class, (a && i) || i),
            !0
          );
        },
        _getBlockMovingTactics: function (e, t, a) {
          var i = "up" === a,
            n = 0 === e.prevAll(We.block_selector).first().length,
            o = 0 === e.nextAll(We.block_selector).first().length,
            r = t.is(We.blocks_place_selector);
          return r && i && n
            ? "appendTo"
            : r && !i && o
            ? "prependTo"
            : (i && n) || (!i && !o)
            ? "insertAfter"
            : "insertBefore";
        },
        _getNearElem: function (e, t, a) {
          var i = "up" === t,
            n = !1,
            o = We.container_selector,
            r = "";
          e.is(We.blocks_place_selector + ":not(" + We.grid_selector + ")") &&
            console.log("BLOCKS PLACE STOP"),
            e.is(We.block_selector)
              ? ((o = We.block_selector), (r = We.grid_selector))
              : e.is(We.grid_selector)
              ? ((n = !0), (o = We.grid_selector), (r = We.row_selector))
              : e.is(We.row_selector) && e.closest(We.grid_selector).length
              ? ((n = !0), (o = We.row_selector), (r = We.grid_selector))
              : e.is(We.row_selector) &&
                ((n = !0), (o = We.row_selector), (r = We.container_selector));
          var s = i ? "last" : "first",
            l = e[i ? "prevAll" : "nextAll"](o).first(),
            c = a ? e : l,
            _ = a || l.length > 0,
            d = c.find(We.grid_selector),
            u = d.length > 0,
            p = c.find(We.blocks_place_selector),
            f = p.length > 0;
          return _ && n && u
            ? $e._getNearElem(d[s](), t, !0)
            : f
            ? p
            : _
            ? c
            : r
            ? $e._getNearElem(e.closest(r), t)
            : {};
        },
      },
      ze = function () {
        var e = {
          items: We.sortable_items_selector,
          connectWith: We.blocks_place_selector,
          update: function (e, t) {
            var a = $e._snapBlocks(o()(t.item));
            Ke.sendRequest("snapping", "", { snappings: a });
          },
        };
        o.a.extend(We, e), o()(We.blocks_place_selector).sortable(We);
      },
      Ne = {
        init: {
          init: function () {
            Se ||
              (ze(),
              o()(We.block_selector).each(function () {
                $e._setMenuPosition(o()(this));
              }),
              o()(m.a.doc).on("click", We.action_selector, function (e) {
                We._self = o()(this);
                var t = We._self.parents(We.menu_selector).parent().parent();
                We._hover_element = t;
                var a = We._self.data("caBlockManagerAction");
                return $e._executeAction(a);
              }),
              o()(m.a.doc).on("block_manager:animation_complete", function (e) {
                $e._setMenuPosition(o()(e.target));
              }),
              (Se = !0));
          },
        }.init,
        api: { sendRequest: Ke.sendRequest },
        defaults: We,
      };
    var He = {
        init: function () {
          o()(this).each(function () {
            var e,
              t = o()(this);
            if (!t.length) return !1;
            if (
              (t[0].classList.forEach(function (t) {
                0 === t.indexOf("cm-block-loader--") && (e = t.split("--")[1]);
              }),
              void 0 !== e)
            ) {
              var a = o()(
                '<div class="cm-block-loader" data-ca-object-key="'.concat(
                  e,
                  '"></div>'
                )
              );
              t.after(a),
                t.remove(),
                o.a.ceAjax(
                  "request",
                  fn_url(
                    "block_manager.render&object_key=".concat(
                      encodeURIComponent(e)
                    )
                  ),
                  { method: "get", callback: He.processResponse(a), hidden: !0 }
                );
            }
          });
        },
        processResponse: function (e) {
          return function (t) {
            var a = o()(t.block_content);
            a.toggleClass("cm-block-loaded");
            var i = [];
            a.find("script").each(function (e, t) {
              t.src && i.push(t.src);
            }),
              (function (e) {
                var t = o.a.map(e, function (e) {
                  return o.a.getScript(e);
                });
                return (
                  t.push(
                    o.a.Deferred(function (e) {
                      o()(e.resolve);
                    })
                  ),
                  o.a.when.apply(o.a, t)
                );
              })(i).done(function () {
                a.find("script[src]").remove(),
                  o()(".cm-block-loaded", o()(e)).remove(),
                  o()(e).append(a),
                  o.a.commonInit(e);
              });
          };
        },
      },
      Ve = {
        objectType: "",
        ajaxUrl: "",
        ajaxDelay: "",
        ajaxPageSize: 10,
        allowSorting: !1,
        enableSearch: !0,
        enableCreateObject: !1,
        createObjectToEnd: !1,
        tokenSeparators: [],
        allowMultipleCreatedObjects: !1,
        closeOnSelect: !0,
        selectOnClose: !1,
        allowClear: !1,
        autofocus: !1,
        autoopen: !1,
        escapeHtml: !0,
        redrawDropdownOnChange: !1,
        width: "100%",
        showDropdown: !0,
        containerHideCssClass:
          "object-picker__selection-simple--disable-dropdown",
        dropdownHideCssClass:
          "object-picker__select2-dropdown--disable-dropdown",
        containerCssClass: "",
        dropdownCssClass: "",
        templateResultSelector: null,
        templateResultNewSelector: null,
        templateResultPredefinedSelector: null,
        templateSelectionSelector: null,
        templateSelectionNewSelector: null,
        templateSelectionLoadSelector: null,
        templateSelectionPredefinedSelector: null,
        createdObjectHolderSelector: null,
        externalContainerSelector: null,
        placeholder: "",
        placeholderValue: "",
        hasStrictComplianceMatcher: !1,
        maximumInputLength: 0,
        minimumInputLength: 0,
        maximumSelectionLength: 0,
        minimumResultsForSearch: 0,
        languageLoadingMore: "loading",
        languageSearching: "loading",
        languageErrorLoading: "error",
        languageNoResults: "nothing_found",
        extendedPickerId: null,
        extendedPickerIdKey: "",
        extendedPickerTextKey: "",
        predefinedVariants: [],
        dropdownParentSelector: "",
        searchRequestData: {},
        unremovableItemIds: [],
        hideSelection: !1,
        enablePermanentPlaceholder: !1,
      },
      Ge = a(4),
      Ye = a(5),
      Je = (function () {
        function e() {
          Object(Ge.a)(this, e);
        }
        return (
          Object(Ye.a)(e, null, [
            {
              key: "set",
              value: function (e, t) {
                var a = this;
                try {
                  t.forEach(function (t) {
                    sessionStorage.setItem(
                      a.getItemKey(e, t.id),
                      JSON.stringify(t)
                    );
                  });
                } catch (e) {}
              },
            },
            {
              key: "get",
              value: function (e, t) {
                try {
                  var a = sessionStorage.getItem(this.getItemKey(e, t));
                  if (a)
                    return (a = JSON.parse(a)), (a = this.normalizeObject(a));
                } catch (e) {}
                return null;
              },
            },
            {
              key: "mget",
              value: function (e, t) {
                var a = [],
                  i = this;
                return (
                  t.forEach(function (t) {
                    var n = i.get(e, t);
                    n && a.push(n);
                  }),
                  a
                );
              },
            },
            {
              key: "load",
              value: function (e, t, a) {
                var i = o.a.Deferred(),
                  n = this;
                return (
                  o.a.ceAjax("request", e, {
                    hidden: !0,
                    caching: !0,
                    data: { ids: a },
                    error_callback: function () {
                      i.reject();
                    },
                    callback: function (e) {
                      if (void 0 !== Object(r.a)(e.objects)) {
                        var a = {};
                        o.a.each(e.objects, function (e, t) {
                          ((t = n.normalizeObject(t)).loaded = !0),
                            (a[t.id] = t);
                        }),
                          n.set(t, e.objects),
                          i.resolve(a);
                      }
                    },
                  }),
                  i.promise()
                );
              },
            },
            {
              key: "find",
              value: function (e, t, a) {
                var i = o.a.Deferred();
                return (
                  (a = o.a.extend({}, a, {
                    error_callback: function () {
                      i.reject();
                    },
                    callback: function (e) {
                      i.resolve(e);
                    },
                    hidden: !0,
                  })),
                  o.a.ceAjax("request", e, a),
                  i.promise()
                );
              },
            },
            {
              key: "getItemKey",
              value: function (e, t) {
                return "".concat(e, "_").concat(t);
              },
            },
            {
              key: "normalizeObject",
              value: function (e) {
                return e.id && null !== e.id && (e.id = e.id.toString()), e;
              },
            },
          ]),
          e
        );
      })();
    function Ze(e, t, a) {
      e.call(this, t, a),
        (this.unremovableItemsIds = a.get("unremovableItemIds")),
        (this.enablePermanentPlaceholder = a.get("enablePermanentPlaceholder"));
    }
    function Qe(e, t, a) {
      e.call(this, t, a),
        (this.$externalSelectionContainer = o()(
          a.get("externalContainerSelector")
        ));
    }
    function Xe(e, t, a) {
      e.call(this, t, a);
    }
    function et(e, t, a) {
      e.call(this, t, a), (this.variants = a.get("predefinedVariants"));
    }
    function tt(e, t, a, i) {
      e.call(this, t, a, i),
        (this.unremovableItemsIds = a.get("unremovableItemIds"));
    }
    (Ze.prototype.bind = function (e, t, a) {
      this.$selection.on("click", function (e) {
        o()(e.target).hasClass("select2-search__field") ||
          o()(e.target).hasClass("select2-selection__rendered") ||
          e.stopImmediatePropagation();
      }),
        e.call(this, t, a);
    }),
      (Ze.prototype.display = function (e, t, a) {
        return (
          t.id &&
            Array.isArray(this.unremovableItemsIds) &&
            -1 !== this.unremovableItemsIds.indexOf(t.id) &&
            (a.find(".select2-selection__choice__remove").remove(),
            a.addClass("select2-selection__choice--unremovable")),
          e.call(this, t, a)
        );
      }),
      (Ze.prototype.searchRemoveChoice = function () {
        return !1;
      }),
      (Ze.prototype.update = function (e, t) {
        e.call(this, t),
          this.enablePermanentPlaceholder &&
            this.$search.attr("placeholder", this.placeholder.text);
      }),
      (Qe.prototype.update = function (e, t) {
        e.call(this, []);
        var a = o.a.fn.select2.amd.require("select2/utils"),
          i = [],
          n = new Map();
        this.$externalSelectionContainer.children().each(function () {
          var e = o()(this),
            t = a.GetData(e[0], "data");
          t && n.set(t.id, e);
        });
        for (var r = 0; r < t.length; r++) {
          var s = t[r];
          s.data && (s.data._index = r);
          var l = o()(this.display(s, ""));
          if (n.has(s.id)) {
            var c = n.get(s.id);
            a.GetData(c[0], "data");
            s.isChanged && c.replaceWith(l), n.delete(s.id);
          } else i.push(l);
          a.StoreData(l[0], "data", s);
        }
        i.length && a.appendMany(this.$externalSelectionContainer, i),
          n.size &&
            n.forEach(function (e) {
              a.RemoveData(e[0]), e.remove();
            });
      }),
      (Qe.prototype.bind = function (e, t, a) {
        e.call(this, t, a);
        var i = this,
          n = o.a.fn.select2.amd.require("select2/utils");
        this.$externalSelectionContainer.on(
          "click",
          ".cm-object-picker-remove-object",
          function (e) {
            if (!i.options.get("disabled")) {
              var t = o()(this).closest(".cm-object-picker-object"),
                a = n.GetData(t[0], "data");
              e.originalEvent &&
                (e.originalEvent = Object.assign({}, e.originalEvent, {
                  metaKey: !0,
                })),
                i.trigger("unselect", { originalEvent: e, data: a });
            }
          }
        );
      }),
      (Xe.prototype.update = function (e, t) {
        e.call(this, []);
      }),
      (et.prototype.current = function (e, t) {
        e.call(this, t);
        var a = [],
          i = this,
          n = this.$element.val();
        Array.isArray(n) || (n = [n]),
          this.variants.forEach(function (e) {
            (e = i._normalizeVariant(e)), -1 !== n.indexOf(e.id) && a.push(e);
          }),
          a.length && t(a);
      }),
      (et.prototype.query = function (e, t, a) {
        var i = this;
        t.term || null != t.page
          ? e.call(this, t, a)
          : e.call(this, t, function (e) {
              var t = e.results,
                n = [];
              i.variants.forEach(function (e) {
                e = i._normalizeVariant(e);
                var a = i.option(e);
                a.attr("data-select2-predefined-variant", !0),
                  n.push(a),
                  i._insertVariant(t, e);
              }),
                (e.results = t),
                a(e);
            });
      }),
      (et.prototype._insertVariant = function (e, t, a) {
        t.unshift(a);
      }),
      (et.prototype._normalizeVariant = function (e, t) {
        return Object.assign(t, {
          data: t.data || {},
          loaded: !0,
          isPredefined: !0,
        });
      }),
      (tt.prototype.option = function (e, t) {
        return (
          t.id &&
            Array.isArray(this.unremovableItemsIds) &&
            -1 !== this.unremovableItemsIds.indexOf(t.id) &&
            (t.disabled = !0),
          e.call(this, t)
        );
      });
    var at = m.a,
      it = (function () {
        function e(t, a) {
          Object(Ge.a)(this, e),
            (this.$elem = t),
            (this.options = a),
            this.tryLoadFromStorage();
          this.$elem.select2(this.buildSelect2Options());
          this.options.allowSorting && this.$elem.select2Sortable(),
            this.options.autofocus && this.$elem.select2("focus"),
            this.options.autoopen && this.openDropdown(),
            this.bindEvents(),
            this.fireEvent("inited");
        }
        return (
          Object(Ye.a)(
            e,
            [
              {
                key: "destroy",
                value: function () {
                  this.$elem.select2("destroy");
                },
              },
              {
                key: "resize",
                value: function () {
                  var e = this.$elem.parent();
                  e.hasClass("select2-wrapper--width-auto") ||
                    (e
                      .find("input.select2-search__field, .select2-container")
                      .css({ width: "100%" }),
                    this.fireEvent("resized"));
                },
              },
              {
                key: "getSelectedObjectIds",
                value: function () {
                  var e = this.$elem.val();
                  return Array.isArray(e) || (e = [e]), e;
                },
              },
              {
                key: "setSelectedObjectIds",
                value: function (e) {
                  this.$elem.val(e), this.$elem.trigger("change");
                },
              },
              {
                key: "selectObjectId",
                value: function (e) {
                  if (this.isMultiple()) {
                    var t = new Set(this.getSelectedObjectIds());
                    t.add(e), (e = Array.from(t));
                  }
                  this.setSelectedObjectIds(e);
                },
              },
              {
                key: "unselectObjectId",
                value: function (e) {
                  if (this.isMultiple()) {
                    var t = new Set(this.getSelectedObjectIds());
                    t.delete(String(e)), (e = Array.from(t));
                  } else e = null;
                  this.setSelectedObjectIds(e);
                },
              },
              {
                key: "addObjects",
                value: function (t) {
                  var a =
                      !(arguments.length > 1 && void 0 !== arguments[1]) ||
                      arguments[1],
                    i =
                      !(arguments.length > 2 && void 0 !== arguments[2]) ||
                      arguments[2],
                    n = this,
                    r = new Set();
                  t.forEach(function (e) {
                    var t = n.$elem.find('option[value="'.concat(e.id, '"]'));
                    if (t.length) a && t.prop("selected", !0);
                    else {
                      var s = new Option(e.text, e.id, a, a);
                      n.$elem.append(s),
                        i || ((e.loaded = !0), o()(s).data("data", e));
                    }
                    r.add(e.id);
                  }),
                    this.$elem.trigger("change"),
                    this.isAjaxSource() &&
                      i &&
                      e.loadObjects(
                        o()([this.$elem]),
                        this.options.objectType,
                        r
                      );
                },
              },
              {
                key: "updateObjects",
                value: function (e) {
                  var t = this,
                    a = this.$elem.data("select2");
                  e.forEach(function (e) {
                    var a = t.$elem.find('option[value="'.concat(e.id, '"]')),
                      i = a.data("data") || {},
                      n = o.a.extend({}, i, e);
                    (i.isChanged = n.isChanged = !1),
                      (n.isChanged = JSON.stringify(i) !== JSON.stringify(n)),
                      a.text(e.text),
                      a.data("data", n),
                      a.removeAttr("data-select2-id");
                  }),
                    a &&
                      a.dataAdapter.current(function (e) {
                        a.trigger("selection:update", { data: e });
                      });
                },
              },
              {
                key: "openDropdown",
                value: function () {
                  this.$elem.select2("open");
                },
              },
              {
                key: "closeDropdown",
                value: function () {
                  this.$elem.select2("close");
                },
              },
              {
                key: "isMultiple",
                value: function () {
                  return this.$elem.is("[multiple]");
                },
              },
              {
                key: "isCreateObjectAvailable",
                value: function () {
                  return Boolean(this.options.enableCreateObject);
                },
              },
              {
                key: "isAjaxSource",
                value: function () {
                  return Boolean(this.options.ajaxUrl);
                },
              },
              {
                key: "getObjectType",
                value: function () {
                  return this.options.objectType;
                },
              },
              {
                key: "extendSearchRequestData",
                value: function (e) {
                  this.options.searchRequestData = o.a.extend(
                    {},
                    this.options.searchRequestData,
                    e
                  );
                },
              },
              {
                key: "isInited",
                value: function () {
                  return !0 === this.$elem.data("caObjectPickerInited");
                },
              },
              {
                key: "isDropdownOpen",
                value: function () {
                  return this.$elem.data("select2").isOpen();
                },
              },
              {
                key: "fireEvent",
                value: function (e) {
                  for (
                    var t = arguments.length,
                      a = new Array(t > 1 ? t - 1 : 0),
                      i = 1;
                    i < t;
                    i++
                  )
                    a[i - 1] = arguments[i];
                  this.$elem.trigger(
                    "ce:object_picker:".concat(e),
                    [this].concat(a)
                  ),
                    o.a.ceEvent(
                      "trigger",
                      "ce.object_picker.".concat(e),
                      [this].concat(a)
                    );
                },
              },
              {
                key: "buildSelect2Options",
                value: function () {
                  var e = this,
                    t = {
                      width: this.options.width,
                      allowClear: this.options.allowClear,
                      closeOnSelect: this.options.closeOnSelect,
                      containerCssClass: this.options.containerCssClass,
                      dropdownCssClass: this.options.dropdownCssClass,
                      showDropdown: this.options.showDropdown,
                      language: {
                        loadingMore: function () {
                          return at.tr(e.options.languageLoadingMore);
                        },
                        searching: function () {
                          return at.tr(e.options.languageSearching);
                        },
                        errorLoading: function () {
                          return at.tr(e.options.languageErrorLoading);
                        },
                        noResults: function () {
                          return at.tr(e.options.languageNoResults);
                        },
                      },
                      maximumInputLength: this.options.maximumInputLength,
                      maximumSelectionLength:
                        this.options.maximumSelectionLength,
                      minimumInputLength: this.options.minimumInputLength,
                      minimumResultsForSearch: this.options.enableSearch
                        ? this.options.minimumResultsForSearch
                        : 1 / 0,
                      externalContainerSelector:
                        this.options.externalContainerSelector,
                      unremovableItemIds: this.options.unremovableItemIds,
                      enablePermanentPlaceholder:
                        this.options.enablePermanentPlaceholder,
                      placeholder: {
                        id: this.options.placeholderValue,
                        text: this.options.placeholder,
                        loaded: !0,
                        data: { name: this.options.placeholder },
                      },
                      selectOnClose: this.options.selectOnClose,
                      templateResult: function (t) {
                        return e.renderResultItemTemplate(t);
                      },
                      templateSelection: function (t, a) {
                        return e.renderSelectionItemTemplate(t, a);
                      },
                      predefinedVariants: this.options.predefinedVariants,
                      tokenSeparators: this.options.tokenSeparators,
                    };
                  this.options.showDropdown ||
                    ((t.containerCssClass +=
                      " " + this.options.containerHideCssClass + " "),
                    (t.dropdownCssClass +=
                      " " + this.options.dropdownHideCssClass + " ")),
                    this.options.dropdownParentSelector &&
                      (t.dropdownParent = o()(
                        this.options.dropdownParentSelector
                      )),
                    this.options.hasStrictComplianceMatcher &&
                      (t.matcher = function (e, t) {
                        return "" === o.a.trim(e.term)
                          ? t
                          : void 0 === t.text
                          ? null
                          : t.text.toUpperCase() == e.term.toUpperCase()
                          ? t
                          : null;
                      }),
                    this.isAjaxSource() &&
                      (t.ajax = {
                        url: this.options.ajaxUrl,
                        delay: this.options.ajaxDelay,
                        data: function (t) {
                          var a = {
                            q: t.term,
                            page: t.page || 1,
                            page_size: e.options.ajaxPageSize,
                          };
                          return (
                            e.options.searchRequestData &&
                              (a = o.a.extend(
                                {},
                                e.options.searchRequestData,
                                a
                              )),
                            a
                          );
                        },
                        processResults: function (t, a) {
                          return (
                            (a.page = a.page || 1),
                            (t.objects = t.objects || []),
                            t.objects.forEach(function (e) {
                              (e = Je.normalizeObject(e)).loaded = !0;
                            }),
                            {
                              results: t.objects,
                              pagination: {
                                more:
                                  a.page * e.options.ajaxPageSize <
                                  t.total_objects,
                              },
                            }
                          );
                        },
                        transport: function (t, a, i) {
                          Je.find(t.url, e.options.objectType, t)
                            .done(a)
                            .fail(i);
                        },
                      }),
                    this.isCreateObjectAvailable() &&
                      ((t.tags = !0),
                      (t.createTag = function (t) {
                        return e.createNewObjectCallback(t);
                      }),
                      (t.insertTag = function (t, a) {
                        return e.insertNewObjectCallback(t, a);
                      })),
                    this.options.escapeHtml ||
                      (t.escapeMarkup = function (e) {
                        return e;
                      });
                  var a = o.a.fn.select2.amd.require("select2/options"),
                    i = o.a.fn.select2.amd.require("select2/utils"),
                    n = new a(t, this.$elem);
                  if (this.isMultiple()) {
                    var r = n.get("selectionAdapter");
                    (r = i.Decorate(r, Ze)),
                      this.options.externalContainerSelector &&
                        (r = i.Decorate(r, Qe)),
                      n.set("selectionAdapter", r);
                  }
                  if (this.options.hideSelection) {
                    var s = n.get("selectionAdapter");
                    (s = i.Decorate(s, Xe)), n.set("selectionAdapter", s);
                  }
                  if (this.options.predefinedVariants.length) {
                    var l = n.get("dataAdapter");
                    (l = i.Decorate(l, et)), n.set("dataAdapter", l);
                  }
                  var c = n.get("resultsAdapter");
                  return (
                    (c = i.Decorate(c, tt)),
                    n.set("resultsAdapter", c),
                    n.options
                  );
                },
              },
              {
                key: "renderTemplate",
                value: function (e, t) {
                  return new Function("data", "return `".concat(t, "`;"))(e);
                },
              },
              {
                key: "getItemTemplate",
                value: function (e) {
                  return o()(e).html();
                },
              },
              {
                key: "renderResultItemTemplate",
                value: function (e) {
                  return e.loading
                    ? e.text
                    : ((e.data = e.data || {}),
                      (e.data.text = e.text),
                      e.isPredefined &&
                      this.options.templateResultPredefinedSelector
                        ? (t = this.renderTemplate(
                            e.data,
                            this.getItemTemplate(
                              this.options.templateResultPredefinedSelector
                            )
                          ))
                        : e.isNew && this.options.templateResultNewSelector
                        ? (t = this.renderTemplate(
                            e.data,
                            this.getItemTemplate(
                              this.options.templateResultNewSelector
                            )
                          ))
                        : this.options.templateResultSelector &&
                          (t = this.renderTemplate(
                            e.data,
                            this.getItemTemplate(
                              this.options.templateResultSelector
                            )
                          )),
                      t || (t = e.text),
                      this.fireEvent("init_template_result_item", e, t),
                      t);
                  var t;
                },
              },
              {
                key: "renderSelectionItemTemplate",
                value: function (e, t) {
                  var a;
                  return (
                    (e.data = e.data || {}),
                    (e.data.text = e.text),
                    e.isPredefined &&
                    this.options.templateSelectionPredefinedSelector
                      ? (a = this.renderTemplate(
                          e.data,
                          this.getItemTemplate(
                            this.options.templateSelectionPredefinedSelector
                          )
                        ))
                      : e.isNew && this.options.templateSelectionNewSelector
                      ? (a = this.renderTemplate(
                          e.data,
                          this.getItemTemplate(
                            this.options.templateSelectionNewSelector
                          )
                        ))
                      : this.isAjaxSource() &&
                        !e.loaded &&
                        this.options.templateSelectionLoadSelector
                      ? (a = this.renderTemplate(
                          e.data,
                          this.getItemTemplate(
                            this.options.templateSelectionLoadSelector
                          )
                        ))
                      : this.options.templateSelectionSelector &&
                        (a = this.renderTemplate(
                          e.data,
                          this.getItemTemplate(
                            this.options.templateSelectionSelector
                          )
                        )),
                    a || (a = e.text),
                    this.options.allowSorting &&
                      o()(t).data("optionId", e.id ? e.id : 0),
                    this.fireEvent("init_template_selection_item", e, a, t),
                    a
                  );
                },
              },
              {
                key: "createNewObjectCallback",
                value: function (e) {
                  var t = o.a.trim(e.term);
                  if (
                    ((e.enableCreateNewObject = !0),
                    this.fireEvent("before_create_object", e, a),
                    "" === t || !e.enableCreateNewObject)
                  )
                    return null;
                  var a = {
                    id: t,
                    text: t,
                    isNew: !0,
                    content: { text: t },
                    data: { name: t },
                  };
                  return this.fireEvent("create_object", e, a), a;
                },
              },
              {
                key: "insertNewObjectCallback",
                value: function (e, t) {
                  this.fireEvent("before_insert_object", e, t),
                    this.options.createObjectToEnd ? e.push(t) : e.unshift(t),
                    this.fireEvent("insert_object", e, t);
                },
              },
              {
                key: "bindEvents",
                value: function () {
                  var e = this,
                    t = o.a.fn.select2.amd.require(
                      "select2/selection/allowClear"
                    ),
                    a = o.a.fn.select2.amd.require("select2/keys"),
                    i = o.a.fn.select2.amd.require("select2/utils");
                  (t.prototype._handleKeyboardClear = function (e, t, n) {
                    if (!n.isOpen())
                      if (t.which == a.DELETE) this._handleClear(t);
                      else if (
                        t.which == a.BACKSPACE &&
                        n.$element[0].lastChild
                      ) {
                        var o = this.$selection.find(
                            ".select2-selection__clear"
                          ),
                          r = i.GetData(o[0], "data");
                        n.$element.trigger({
                          type: "select2:unselect",
                          params: { data: r[r.length - 1] },
                        }),
                          n.$element[0].lastChild.remove();
                      }
                  }),
                    this.options.redrawDropdownOnChange &&
                      this.$elem.on(
                        "select2:select select2:unselect",
                        function () {
                          var e = o()(this).data("select2");
                          e.isOpen() && e.dropdown._positionDropdown();
                        }
                      ),
                    this.$elem.on("select2:select", function (t) {
                      var a = t.params.data;
                      if (e.options.createdObjectHolderSelector)
                        if (e.options.allowMultipleCreatedObjects) {
                          if (a.isNew) {
                            var i = o()(
                                e.options.createdObjectHolderSelector
                              ).last(),
                              n = i.val() ? i.clone() : i;
                            n.val(a.id), n.insertAfter(i);
                          }
                        } else
                          a.isNew
                            ? o()(e.options.createdObjectHolderSelector).val(
                                a.id
                              )
                            : o()(e.options.createdObjectHolderSelector).val(
                                null
                              );
                      e.fireEvent("object_selected", a, t);
                    }),
                    this.$elem.on("select2:unselect", function (t) {
                      var a = t.params.data;
                      if (e.options.createdObjectHolderSelector && a.isNew) {
                        var i = o()(e.options.createdObjectHolderSelector);
                        i.length > 1
                          ? i.each(function (e, t) {
                              var i = o()(t);
                              i.val() === a.id && i.remove();
                            })
                          : i.val(null);
                      }
                      e.fireEvent("object_unselected", a, t);
                    }),
                    this.$elem.on("change", function () {
                      var t = [];
                      o()(this)
                        .find("option:selected")
                        .each(function () {
                          t.push(i.GetData(this, "data"));
                        }),
                        e.fireEvent("change", e.isMultiple() ? t : t.shift());
                    }),
                    this.$elem.on("select2:open", function () {
                      e.fireEvent("dropdown_opened");
                    }),
                    this.$elem.on("select2:close", function () {
                      e.fireEvent("dropdown_closed");
                    }),
                    this.$elem.on("select2:clear", function () {
                      e.fireEvent("cleared");
                    }),
                    o.a.ceEvent("on", "ce.window.resize", function (t, a) {
                      e.resize();
                    }),
                    o.a.ceEvent("on", "ce.tab.show", function (t, a) {
                      e.resize();
                    }),
                    this.options.extendedPickerId &&
                      (o.a.ceEvent(
                        "on",
                        "ce.picker_add_js_items",
                        function (t, a, i) {
                          if (e.options.extendedPickerId === i.root_id) {
                            var n = [];
                            o.a.map(a, function (t, a) {
                              if (t instanceof Object)
                                var i = t[e.options.extendedPickerTextKey];
                              else i = t;
                              n.push({
                                id: a,
                                text: i,
                                loaded: !e.isAjaxSource(),
                                extended_picker_data: t,
                                data: {},
                              });
                            }),
                              n.length && e.addObjects(n);
                          }
                        }
                      ),
                      o.a.ceEvent(
                        "on",
                        "ce.picker_delete_js_items",
                        function (t, a, i) {
                          e.options.extendedPickerId === i.root_id &&
                            o.a.map(a, function (t, a) {
                              e.unselectObjectId(a);
                            });
                        }
                      )),
                    this.$elem
                      .data("select2")
                      .on("selection:update", function () {
                        (e.fireEvent("selection_before_update"),
                        e.options.externalContainerSelector) &&
                          e.$elem.closest(".cm-hide-inputs").length &&
                          o()(
                            e.options.externalContainerSelector
                          ).disableFields();
                        e.fireEvent("selection_updated");
                      });
                },
              },
              {
                key: "tryLoadFromStorage",
                value: function () {
                  if (this.isAjaxSource()) {
                    var e = Je.mget(
                      this.options.objectType,
                      this.getSelectedObjectIds()
                    );
                    e.length && this.updateObjects(e);
                  }
                },
              },
            ],
            [
              {
                key: "loadObjects",
                value: function (e, t, a) {
                  a = Array.from(a);
                  var i = e.get(0).data("caObjectPicker").options.ajaxUrl;
                  Je.load(i, t, a).done(function (t) {
                    e.each(function (e, a) {
                      if (a.data("caObjectPicker")) {
                        var i = a.data("caObjectPicker"),
                          n = i.getSelectedObjectIds(),
                          r = [];
                        o.a.each(n, function (e, a) {
                          t[a] && r.push(t[a]);
                        }),
                          r.length && i.updateObjects(r);
                      }
                    });
                  });
                },
              },
            ]
          ),
          e
        );
      })();
    m.a;
    function nt(e, t) {
      e.length &&
        (function () {
          var e = o.a.Deferred();
          o.a.fn.select2
            ? e.resolve()
            : o.a.getScript(
                "js/lib/select2/dist/js/select2.full.min.js",
                e.resolve
              );
          return e.promise();
        })().done(function () {
          var t = {},
            a = {};
          e.each(function () {
            var e = o()(this),
              i = o.a.extend(
                {},
                Ve,
                (function (e) {
                  var t = {};
                  for (var a in Ve)
                    t[a] = e.data(o.a.camelCase("ca-object-picker-".concat(a)));
                  return t;
                })(e),
                i
              ),
              n = new it(e, i);
            e.data("caObjectPicker", n),
              n.isAjaxSource() &&
                (t[n.options.objectType] ||
                  (t[n.options.objectType] = new Set()),
                a[n.options.objectType] || (a[n.options.objectType] = []),
                n.getSelectedObjectIds().forEach(function (e) {
                  e && 0 != e && t[n.options.objectType].add(e);
                }),
                a[n.options.objectType].push(e));
          }),
            o.a.each(t, function (e, t) {
              t.size && it.loadObjects(o()(a[e]), e, t);
            });
        });
    }
    var ot = function (e) {
        e.fn.ceObjectPicker = function (t) {
          for (
            var a = arguments.length, i = new Array(a > 1 ? a - 1 : 0), n = 1;
            n < a;
            n++
          )
            i[n - 1] = arguments[n];
          return (
            t && "init" !== t
              ? function (e, t) {
                  for (
                    var a = arguments.length,
                      i = new Array(a > 2 ? a - 2 : 0),
                      n = 2;
                    n < a;
                    n++
                  )
                    i[n - 2] = arguments[n];
                  e.each(function () {
                    var e = o()(this).data("caObjectPicker");
                    e && "function" == typeof e[t] && e[t].apply(e, i);
                  });
                }.apply(void 0, [e(this), t].concat(i))
              : nt(e(this), i[0]),
            e(this)
          );
        };
      },
      rt =
        (m.a,
        (function () {
          function e(t, a) {
            Object(Ge.a)(this, e),
              (this.$elem = t),
              (this.options = a),
              this.bindEvents(),
              this.fireEvent("inited");
          }
          return (
            Object(Ye.a)(e, [
              {
                key: "fireEvent",
                value: function (e) {
                  for (
                    var t = arguments.length,
                      a = new Array(t > 1 ? t - 1 : 0),
                      i = 1;
                    i < t;
                    i++
                  )
                    a[i - 1] = arguments[i];
                  this.$elem.trigger(
                    "ce:notification_receivers_editor:".concat(e),
                    [this].concat(a)
                  ),
                    o.a.ceEvent(
                      "trigger",
                      "ce.notification_receivers_editor.".concat(e),
                      [this].concat(a)
                    );
                },
              },
              {
                key: "bindEvents",
                value: function () {
                  var e = this;
                  this.$elem.on(
                    "click",
                    this.options.cancelButtonSelector,
                    function () {
                      e.resetChanges.apply(e);
                    }
                  ),
                    this.$elem.on(
                      "click",
                      this.options.updateButtonSelector,
                      function () {
                        e.saveReceivers.apply(e);
                      }
                    );
                },
              },
              {
                key: "resetChanges",
                value: function () {
                  var e = this,
                    t = {};
                  o.a.ceAjax("request", this.options.loadUrl, {
                    method: "get",
                    result_ids: this.options.resultIds,
                    data: t,
                    caching: !0,
                    hidden: !0,
                    callback: function (a) {
                      e.options.resetCallback(e, t, a), e.fireEvent("reset");
                    },
                  });
                },
              },
              {
                key: "saveReceivers",
                value: function () {
                  var e = this,
                    t = {
                      object_type: this.options.objectType,
                      object_id: this.options.objectId,
                      conditions: this.serialize(),
                    };
                  o.a.ceAjax("request", this.options.submit1Url, {
                    method: "post",
                    result_ids: this.options.resultIds,
                    data: t,
                    caching: !1,
                    callback: function (a) {
                      e.options.saveCallback(e, t, a),
                        e.fireEvent("saved", t, a);
                    },
                  });
                },
              },
              {
                key: "serialize",
                value: function () {
                  var e = [],
                    t = this;
                  return (
                    this.$elem
                      .find(this.options.receiverPickerSelector)
                      .each(function () {
                        var a = o()(this);
                        t.getSelectedReceivers(a).forEach(function (t) {
                          e.push(t);
                        });
                      }),
                    this.fireEvent("serialized", e),
                    e
                  );
                },
              },
              {
                key: "getSelectedReceivers",
                value: function (e) {
                  var t = [];
                  return (
                    e.select2("data").forEach(function (a) {
                      var i = a.data,
                        n = i.method,
                        o = i.criterion;
                      (n =
                        n ||
                        e.data(
                          "caNotificationReceiversEditorReceiverSearchMethod"
                        )),
                        (o = o || a.text),
                        t.push({ method: n, criterion: o });
                    }),
                    t
                  );
                },
              },
              {
                key: "getEditorObjectType",
                value: function () {
                  return this.options.groupName ? "group" : "event";
                },
              },
              {
                key: "getEditorObjectId",
                value: function () {
                  return this.options.groupName
                    ? this.options.groupName
                    : this.options.eventName;
                },
              },
            ]),
            e
          );
        })()),
      st = {
        cancelButtonSelector: null,
        updateButtonSelector: null,
        receiverPickerSelector: null,
        submit1Url: "",
        loadUrl: "",
        resultIds: "",
        saveCallback: function () {},
        resetCallback: function () {},
        objectType: "group",
        objectId: null,
      },
      lt = function (e, t) {
        e.each(function () {
          var e = $(this),
            t = $.extend({}, st, ct(e, st), t),
            a = new rt(e, t);
          e.data("caNotificationReceiversEditor", a);
        });
      },
      ct = function (e) {
        var t = {};
        for (var a in st)
          t[a] = e.data(
            $.camelCase("ca-notification-receivers-editor-".concat(a))
          );
        return t;
      },
      _t = m.a,
      dt = {
        init: function (e) {
          return (
            (e = e || {}),
            this.each(function () {
              var t = o()(this),
                a = e.url || t.data("caInlineDialogUrl"),
                i = e.actionContext || t.data("caInlineDialogActionContext"),
                n = e.data || t.data("caInlineDialogData") || {},
                r = t.prop("id");
              if (a) {
                t.data("caInlineDialog") && dt._destroy(t),
                  i && (n._action_context = i),
                  t.data("caInlineDialog", { placeholder: t.html() }),
                  t.addClass("cm-inline-dialog");
                var s = o.a.ceAjax("request", a, {
                  full_render: 0,
                  result_ids: r,
                  get_promise: !0,
                  skip_result_ids_check: !0,
                  data: n,
                  pre_processing: function (e) {
                    e.html &&
                      e.html[r] &&
                      (e.html[r] = e.html[r]
                        .replace("<form", "<x-form")
                        .replace("</form", "</x-form"));
                  },
                });
                s.done(function (e) {
                  var a = [];
                  t.find("x-form").each(function () {
                    var e = o()("<form>"),
                      t = o()(this),
                      i = t.attr("id") || r + "_" + a.length;
                    o.a.each(t.prop("attributes"), function () {
                      e.attr(this.name, this.value);
                    }),
                      e.attr("id", i),
                      e.addClass("hidden cm-outside-inputs"),
                      o()(_t.body).append(e),
                      t.attr("id", i + "_base"),
                      t.find(":input").attr("form", i),
                      a.push(e),
                      e.ceFormValidator();
                  });
                  var i = t.data("caInlineDialog");
                  (i.forms = a), t.data("caInlineDialog", i);
                }),
                  s.fail(function () {
                    dt._destroy(t);
                  });
              }
            })
          );
        },
        destroy: function () {
          dt._destroy(this);
        },
        opener: function () {
          return (
            this.on("click", function () {
              var e = o()(this).data("caInlineDialogContainer");
              if (e) return o()("#" + e).ceInlineDialog(), !1;
            }),
            this
          );
        },
        closer: function () {
          return (
            this.on("click", function () {
              var e = o()(this),
                t = e.data("caInlineDialogContainer"),
                a = null;
              if (
                (a = t ? o()("#" + t) : e.closest(".cm-inline-dialog")).length
              )
                return (
                  dt._destroy(a),
                  o.a.ceEvent("trigger", "ce.inline_dialog.closed", [this]),
                  a.trigger("ce:inline_dialog:closed"),
                  !1
                );
            }),
            this
          );
        },
        _destroy: function (e) {
          var t = e.data("caInlineDialog");
          if (
            t &&
            (e.find(".cm-dialog-opener").each(function () {
              var e = o()(this).data("caTargetId"),
                t = o()("#" + e);
              t.length && t.ceDialog("close");
            }),
            e.html(t.placeholder),
            e.removeData("caInlineDialog"),
            e.removeClass("cm-inline-dialog"),
            t.forms && t.forms.length)
          )
            for (var a in t.forms) t.forms[a].remove();
        },
      },
      ut = m.a,
      pt = function () {};
    pt.prototype = Object.create(Array.prototype, {
      orderFilesByPosition: {
        value: function () {
          return (
            this.sort(function (e, t) {
              return e.tygh.position < t.tygh.position
                ? -1
                : e.tygh.position > t.tygh.position
                ? 1
                : 0;
            }),
            this
          );
        },
        enumerable: !1,
      },
      getFirstActive: {
        value: function () {
          this.orderFilesByPosition();
          for (var e = 0; e < this.length; e++)
            if (!this[e].removed) return this[e];
          return !1;
        },
        enumerable: !1,
      },
      getMainFile: {
        value: function () {
          for (var e = 0; e < this.length; e++)
            if ("M" === this[e].image_type) return this[e];
          return !1;
        },
        enumerable: !1,
      },
      isUploadingInProgress: {
        value: function () {
          for (var e = 0; e < this.length; e++)
            if ("uploading" === this[e].status) return !0;
          return !1;
        },
        enumerable: !1,
      },
    });
    var ft = (ut.FileUploader = function (e, t) {
      (this.$el = e),
        (this.el = e.get(0)),
        (this.$context = t),
        (this.files = new pt());
    });
    o.a.extend(ft.prototype, {
      options: {},
      elements: {},
      newAttachedFilesCounter: 0,
      orderPositionCounter: null,
      init: function () {
        this.initOptions(), this.lookupDomElements();
        var e = ht(this.elements.$parentForm);
        e.push(this),
          mt(this.elements.$parentForm, e),
          this.initDropzone(),
          this.bindEvents(),
          this.registerExistingFiles();
      },
      initOptions: function () {
        (this.options.thumbnailWidth = this.$el.data("caThumbnailWidth")),
          (this.options.thumbnailHeight = this.$el.data("caThumbnailHeight")),
          (this.options.uploadUrl = this.$el.data("caUploadUrl")),
          (this.options.maxFileSize = this.$el.data("caMaxFileSize")),
          (this.options.newFilesParamName = this.$el.data(
            "caNewFilesParamName"
          )),
          (this.options.previewTemplateId = this.$el.data("caTemplateId")),
          (this.options.existingFiles = this.$el.data("caExistingPairs")),
          (this.options.maxFilesCount = this.$el.data("caMaxFilesCount")),
          (this.options.allowSorting = this.$el.data("caAllowSorting")),
          (this.options.destroyAfterInitializing = this.$el.data(
            "caDestroyAfterInitializing"
          )),
          (this.options.defaultImagePairType = this.$el.data(
            "caDefaultImagePairType"
          )),
          (this.options.imagePairTypes = this.$el.data("caImagePairTypes")),
          (this.options.imagePairObjectId = this.$el.data(
            "caImagePairObjectId"
          )),
          (this.options.existingPairThumbnails = this.$el.data(
            "caExistingPairThumbnails"
          )),
          (this.options.expandedDropzoneSelector =
            "file-uploader__pickers--expanded");
      },
      lookupDomElements: function () {
        (this.elements.$parentForm = this.$el.parents("form")),
          (this.elements.$filesContainerEl = o()(
            "[data-ca-fileuploader-files-container]",
            this.$el
          )),
          (this.elements.$pickerContainerEl = o()(
            "[data-ca-fileupload-picker-container]",
            this.$el
          )),
          (this.elements.$pickerBtnEl = o()(
            "[data-ca-fileupload-picker-btn]",
            this.$el
          )),
          (this.elements.$pickerMenuEl = o()(
            "[data-ca-fileupload-picker-menu]",
            this.$el
          )),
          (this.elements.$localFilePickerTrigger = o()(
            "[data-ca-fileupload-picker-local]",
            this.$el
          )),
          (this.elements.$serverFilePickerTrigger = o()(
            "[data-ca-fileupload-picker-server]",
            this.$el
          )),
          (this.elements.$urlFilePickerTrigger = o()(
            "[data-ca-fileupload-picker-url]",
            this.$el
          )),
          (this.elements.$removeAllFilesTrigger = o()(
            "[data-ca-fileupload-remove-all]",
            this.$el
          )),
          (this.elements.$previewTemplate = o()(
            "#" + this.options.previewTemplateId,
            this.$context
          )),
          (this.elements.$uploaderPickers = this.$el.find(
            ".file-uploader__pickers"
          ));
      },
      initDropzone: function () {
        var e = {
          url: this.options.uploadUrl,
          thumbnailWidth: this.options.thumbnailWidth,
          thumbnailHeight: this.options.thumbnailHeight,
          paramName: this.options.newFilesParamName + "[]",
          autoProcessQueue: !0,
          uploadMultiple: !1,
          parallelUploads: 3,
          maxFiles: this.options.maxFilesCount,
          previewsContainer: this.elements.$filesContainerEl.get(0),
          clickable: this.elements.$localFilePickerTrigger.get(0),
          previewTemplate: this.elements.$previewTemplate.html(),
        };
        this.options.maxFileSize && (e.maxFilesize = this.options.maxFileSize),
          (this.dropzone = new Dropzone(this.el, e));
      },
      reindexFileOrderPositions: function () {
        var e = 0;
        this.elements.$filesContainerEl.children().each(function () {
          o()(this).data("caNewPosition", e++);
        }),
          o.a.each(this.files, function () {
            var e = o()(this.previewElement),
              t = e.data("caNewPosition");
            e.data("caNewPosition", null),
              (this.tygh.position = t),
              (this.dynamicData["image-position"] = {
                name: "position",
                value: t,
                postfix: "_data",
              }),
              this.tygh.$sortingPositionInput.val(t);
          }),
          this.files.orderFilesByPosition(),
          this._changeFilesInputNames();
      },
      _changeFilesInputNames: function () {
        var e = this;
        o.a.each(e.files, function () {
          e._isMainImagePair(this)
            ? (e._changeMainFileToAdditional(),
              e._markFileAsMain(this),
              (e.filesGotChanged = !0))
            : (e._markFileAsAdditional(this), (e.filesGotChanged = !0)),
            e.refreshPreview(this);
        });
      },
      bindEvents: function () {
        var e = this;
        o()(window).on("beforeunload", function (t) {
          return e.isUploadingInProgress()
            ? ut.tr("file_uploading_in_progress_please_wait")
            : e.filesGotChanged
            ? ut.tr("file_uploading_in_progress_please_wait")
            : void 0;
        }),
          o()(".cm-product-save-buttons").on("click", function (t) {
            (e.filesGotChanged = !1), t.preventDefault();
          }),
          e.options.allowSorting &&
            this.elements.$filesContainerEl.sortable({
              tolerance: "pointer",
              containment: e.elements.$filesContainerEl,
              cursor: "move",
              placeholder: "file-uploader__sortable-placeholder",
              forceHelperSize: !0,
              axis: "xy",
              items: ".file-uploader__file",
              update: function (t, a) {
                e.reindexFileOrderPositions();
              },
            }),
          this.elements.$pickerBtnEl.on("click", function (t) {
            var a = o()(t.target),
              i = e.elements,
              n =
                i.$filesContainerEl.offset().left +
                i.$filesContainerEl.outerWidth() -
                (a.offset().left + a.outerWidth()),
              r = i.$pickerMenuEl.outerWidth(),
              s =
                i.$filesContainerEl.offset().top +
                i.$filesContainerEl.outerHeight() -
                (a.offset().top + a.outerHeight()),
              l = i.$pickerMenuEl.outerHeight();
            i.$pickerMenuEl.toggleClass("pull-right", n < r),
              i.$pickerContainerEl.toggleClass("dropup", s < l);
          }),
          this.elements.$serverFilePickerTrigger.on("click", function (t) {
            t.preventDefault(), e.runElfinderFilePickerModal();
          }),
          this.elements.$removeAllFilesTrigger.on("click", function () {
            o()(".file-uploader__file-button-delete").trigger("removefiles");
          }),
          this.elements.$urlFilePickerTrigger.on("click", function (t) {
            t.preventDefault();
            var a;
            if ((a = prompt(ut.tr("url")).trim())) {
              var i = {
                name: "",
                size: null,
                image_type: "N",
                dynamicData: {},
                mock: { type: "url", value: a },
              };
              (i.dynamicData["upload-type"] = {
                prefix: "type_",
                value: "url",
                postfix: "_detailed",
              }),
                (i.dynamicData["upload-file"] = {
                  prefix: "file_",
                  value: a,
                  postfix: "_detailed",
                }),
                e.dropzone.emit("addedfile", i),
                e.dropzone.emit("complete", i),
                e.dropzone.emit("thumbnail", i, a);
            }
          }),
          this.dropzone.on("dragover", function (t) {
            void 0 == e._dragTimer && (e._dragTimer = null);
            var a = t.dataTransfer,
              i = a.types.indexOf
                ? 1 != a.types.indexOf("Files")
                : a.types.contains("Files");
            "application/x-moz-file" == a.types[0] && (i = !0),
              a.types &&
                i &&
                (e._expandDropzone(), window.clearTimeout(e._dragTimer));
          }),
          this.dropzone.on("dragleave", function (t) {
            e._dragTimer = window.setTimeout(function () {
              e._shrinkDropzone();
            }, 25);
          }),
          this.dropzone.on("complete", function (t) {
            e.options.destroyAfterInitializing && e.dropzone.destroy();
          }),
          this.dropzone.on("success", function (t, a) {
            a.local_data
              ? "path" in a.local_data &&
                ((t.dynamicData["upload-type"] = {
                  prefix: "type_",
                  value: "uploaded",
                  postfix: "_detailed",
                }),
                (t.dynamicData["upload-file"] = {
                  prefix: "file_",
                  value: a.local_data.path,
                  postfix: "_detailed",
                }),
                e._isMainImagePair(t) &&
                  (e._changeMainFileToAdditional(), e._markFileAsMain(t)),
                e.refreshPreview(t))
              : e.dropzone.emit(
                  "error",
                  t,
                  { error: ut.tr("cannot_upload_file") },
                  a
                );
          }),
          this.dropzone.on("sending", function (e, t, a) {
            a.append("is_ajax", 1),
              ut.security_hash &&
                ut.security_hash.length &&
                a.append("security_hash", ut.security_hash);
          }),
          this.dropzone.on("addedfile", function (t) {
            if (
              ((t.tygh = t.tygh || {}),
              (t.dynamicData = t.dynamicData || {}),
              (t.dynamicData = t.dynamicData || {}),
              (t.tygh.index = e.getImageDataIndex(t)),
              e._shrinkDropzone(),
              e._moveDropzoneToEnd(),
              (t.image_type = t.original_image_type = "N"),
              (t.dynamicData["image-type"] = {
                name: "type",
                value: e.options.defaultImagePairType,
                postfix: "_data",
              }),
              (t.dynamicData["image-object-id"] = {
                name: "object_id",
                value: e.options.imagePairObjectId,
                postfix: "_data",
              }),
              (t.dynamicData["is-new-file"] = {
                name: "is_new",
                value: "Y",
                postfix: "_data",
              }),
              (t.dynamicData["alt-text-detailed"] = {
                name: "detailed_alt",
                value: "",
                postfix: "_data",
              }),
              t.mock)
            )
              if ("existing" === t.mock.type) {
                if (t.mock.existingPair) {
                  var a = t.mock.existingPair.detailed
                    ? t.mock.existingPair.detailed
                    : t.mock.existingPair.icon;
                  (t.previewLink = a.image_path),
                    (t.dynamicData["image-pair-id"] = {
                      name: "pair_id",
                      value: t.mock.existingPair.pair_id,
                      postfix: "_data",
                    }),
                    (t.dynamicData["alt-text-detailed"] = {
                      name: "detailed_alt",
                      value: a.alt ? a.alt : "",
                      defaultValue: a.alt ? a.alt : "",
                      postfix: "_data",
                    }),
                    (t.dynamicData["is-new-file"] = {
                      name: "is_new",
                      value: "N",
                      postfix: "_data",
                    });
                }
                t.image_type = t.original_image_type = "A";
              } else
                (t.dynamicData["upload-type"] = {
                  prefix: "type_",
                  value: t.mock.type,
                  postfix: "_detailed",
                }),
                  (t.dynamicData["upload-file"] = {
                    prefix: "file_",
                    value: t.mock.value,
                    postfix: "_detailed",
                  });
            e.options.allowSorting &&
              (t.mock && "existing" === t.mock.type
                ? (t.tygh.position = t.mock.position)
                : (t.tygh.position =
                    null !== e.orderPositionCounter
                      ? ++e.orderPositionCounter
                      : (e.orderPositionCounter = 0)),
              (t.dynamicData["image-position"] = {
                name: "position",
                value: t.tygh.position,
                postfix: "_data",
              })),
              (void 0 !== t.mock && "existing" === t.mock.type) ||
                e.newAttachedFilesCounter++,
              e.files.push(t),
              e.newAttachedFilesCounter && (e.filesGotChanged = !0),
              e._isMainImagePair(t) && e._markFileAsMain(t),
              e.options.allowSorting &&
                e.elements.$filesContainerEl.sortable("refresh"),
              e.refreshPreview(t),
              e.registerCustomRemoveEvent(t),
              e.registerCustomAltUpdateEvent(t),
              e.expandAltTextarea(t);
          });
      },
      getImageDataIndex: function (e) {
        return e.mock && "existing" === e.mock.type
          ? e.mock.index
          : this.newAttachedFilesCounter;
      },
      registerExistingFiles: function () {
        var e = this;
        this.options.existingFiles.forEach(function (e, t) {
          e.index = t;
        }),
          this.options.existingFiles.sort(function (e, t) {
            var a = Number(e.position) - Number(t.position);
            return 0 === a && (a = e.index - t.index), a;
          }),
          o.a.each(this.options.existingFiles, function () {
            var t = e.options.existingPairThumbnails[this.pair_id];
            if (
              ((e.orderPositionCounter = Math.max(
                e.orderPositionCounter,
                Number(this.position)
              )),
              (this.detailed_id && this.detailed) ||
                (this.image_id && this.icon))
            ) {
              var a = {
                name: null,
                size: null,
                mock: {
                  type: "existing",
                  index: this.pair_id,
                  position: Number(this.position),
                  existingPair: this,
                },
              };
              e.dropzone.emit("addedfile", a),
                e.dropzone.emit("complete", a),
                t.detailed
                  ? e.dropzone.emit("thumbnail", a, t.detailed.image_path)
                  : t.icon &&
                    e.dropzone.emit("thumbnail", a, t.icon.image_path);
            }
          });
      },
      expandAltTextarea: function (e) {
        var t = e.previewElement,
          a = o()(t).find(".file-uploader__file-control-menu"),
          i = o()(t).find("textarea"),
          n = function () {
            a.toggleClass("file-uploader__file-control-menu--expanded");
          };
        a.on("click", function (e) {
          n(), i.focus().select();
        }),
          i.on("blur", function (e) {
            n();
          });
      },
      registerCustomRemoveEvent: function (e) {
        var t = this;
        o()(e.previewElement)
          .find("[data-ca-dz-remove]")
          .each(function (a, i) {
            o()(i).on(
              "click touch removefiles",
              (function (e) {
                return function (a) {
                  var i = o()(e.previewElement),
                    n = "";
                  i
                    .find(".cm-file-uploader-dynamic-field")
                    .prop("disabled", !0),
                    i
                      .find(".file-uploader__remove-overlay")
                      .removeClass("hidden"),
                    i.find("[data-ca-dz-remove]").hide(),
                    i.addClass("file-uploader__file--removed"),
                    "mock" in e &&
                      "existing" === e.mock.type &&
                      (n = e.mock.existingPair.pair_id),
                    (e.removed = !0),
                    (e.dynamicData["image-remove"] = {
                      value: n,
                      update_name: !1,
                    });
                  var r = t.files.getFirstActive();
                  t._isMainImagePair(r) &&
                    (t._markFileAsMain(r), t.refreshPreview(r)),
                    (t.filesGotChanged = !0),
                    t._markFileAsAdditional(e),
                    t.refreshPreview(e);
                };
              })(e)
            );
          }),
          o()(e.previewElement)
            .find(".file-uploader__remove-button-recover")
            .each(function (a, i) {
              o()(i).on(
                "click touch",
                (function (e, a) {
                  return function (i) {
                    var n = o()(e.previewElement);
                    n
                      .find(".cm-file-uploader-dynamic-field")
                      .prop("disabled", !1),
                      n
                        .find(".file-uploader__remove-overlay")
                        .addClass("hidden"),
                      n.find("[data-ca-dz-remove]").css("display", ""),
                      n.removeClass("file-uploader__file--removed"),
                      (e.removed = !1),
                      (e.dynamicData["image-remove"] = {
                        value: "",
                        update_name: !1,
                      }),
                      t._isMainImagePair(e) &&
                        (t._changeMainFileToAdditional(), t._markFileAsMain(e)),
                      (t.filesGotChanged = !0),
                      a.refreshPreview(e);
                  };
                })(e, t)
              );
            });
      },
      registerCustomAltUpdateEvent: function (e) {
        var t = this;
        o()(e.previewElement)
          .find(".file-uploader__file-description-input")
          .on("keyup", function () {
            (e.dynamicData["alt-text-detailed"].value = o()(this).val()),
              t.refreshPreview(e);
          });
      },
      refreshPreview: function (e) {
        if ("dynamicData" in e) {
          var t = this,
            a = o()(e.previewElement),
            i = ["[", e.tygh.index, "]"].join("");
          o.a.each(e.dynamicData, function (n, r) {
            var s = a.find(["[data-ca-", n, "]"].join("")),
              l = t.options.imagePairTypes[e.image_type];
            if (!1 !== r.update_name) {
              var c = [r.prefix, l, r.postfix, i].filter(function (e) {
                return void 0 !== e;
              });
              r.name && c.push(["[", r.name, "]"].join("")),
                s.attr("name", c.join(""));
            }
            o()(s).val(r.value),
              "defaultValue" in r &&
                s.length &&
                (s.get(0).defaultValue = r.value);
          });
          var n = a.find("[data-ca-preview-detailed]");
          e.previewLink ? (n.attr("href", e.previewLink), n.show()) : n.hide(),
            (e.tygh.$sortingPositionInput = o()("[data-ca-image-position]", a));
        }
      },
      runElfinderFilePickerModal: function () {
        var e = this;
        o.a.fn.elfinder
          ? this._initElfinderFilePickerModal()
          : (o.a.loadCss(["js/lib/elfinder/css/elfinder.min.css"]),
            o.a.loadCss(["js/lib/elfinder/css/theme.css"]),
            o.a.getScript("js/lib/elfinder/js/elfinder.min.js", function () {
              e._initElfinderFilePickerModal();
            }));
      },
      _initElfinderFilePickerModal: function () {
        var e = this,
          t = o.a.ceDialog("get_last").parent(".ui-front").css("z-index"),
          a = o()('<div id="server_file_browser"></div>'),
          i = o.a.extend(ut.fileManagerOptions, {
            url: fn_url(
              "elf_connector.files?security_hash=" + ut.security_hash
            ),
            cutURL: ut.allowed_file_path,
            getFileCallback: function (t) {
              a.dialog("close"), e.registerFileFromElfinder(t);
            },
          }),
          n = a.elfinder(i).dialog({
            width: 900,
            height: 500,
            modal: !0,
            title: ut.tr("file_browser"),
            close: function (e, t) {
              a.dialog("destroy").elfinder("destroy").remove();
            },
          });
        t && n.closest(".ui-dialog").css("z-index", t + 1);
      },
      registerFileFromElfinder: function (e) {
        var t = e.path.split("/");
        t.shift();
        var a = t.join("/"),
          i = {
            name: e.name,
            size: Number(e.size),
            type: e.mime,
            lastModified: e.ts,
            mock: { type: "server", value: a },
          };
        e.height && (i.height = Number(e.height)),
          e.width && (i.width = Number(e.width)),
          this.dropzone.emit("addedfile", i),
          this.dropzone.emit("complete", i),
          this.dropzone.emit("thumbnail", i, e.url);
      },
      isUploadingInProgress: function () {
        return this.files.isUploadingInProgress();
      },
      _markFileAsMain: function (e) {
        (e.image_type = "M"),
          (e.dynamicData["image-type"] = {
            name: "type",
            value: "M",
            postfix: "_data",
          });
      },
      _markFileAsAdditional: function (e) {
        (e.image_type = e.original_image_type),
          (e.dynamicData["image-type"] = {
            name: "type",
            value: "A",
            postfix: "_data",
          });
      },
      _changeMainFileToAdditional: function () {
        var e = this.files.getMainFile();
        e && (this._markFileAsAdditional(e), this.refreshPreview(e));
      },
      _isMainImagePair: function (e) {
        var t = this.files.getFirstActive();
        return t && o()(e.previewElement).is(o()(t.previewElement));
      },
      _validateUrl: function (e) {
        e.includes("://") || (e = "http://" + e);
        return /^[A-Za-z]+:\/\/[A-Za-z0-9-_:@]+\.[A-Za-z0-9-+_%~&\\?\/.=()]+$/.test(
          e
        );
      },
      _expandDropzone: function () {
        this.elements.$uploaderPickers.hasClass(
          this.options.expandedDropzoneSelector
        ) ||
          this.elements.$uploaderPickers.addClass(
            this.options.expandedDropzoneSelector
          );
      },
      _shrinkDropzone: function () {
        this.elements.$uploaderPickers.removeClass(
          this.options.expandedDropzoneSelector
        );
      },
      _moveDropzoneToEnd: function () {
        var e = this.elements;
        e.$filesContainerEl.append(e.$uploaderPickers);
      },
    });
    var ht = function (e) {
        return e.data("caContainedFileUploaders") || [];
      },
      mt = function (e, t) {
        e.data("caContainedFileUploaders", t);
      };
    function gt(e) {
      e.length &&
        o.a.ceEvent("on", "ce.commoninit", function (e) {
          o.a.ceEvent("on", "ce.form.beforeSubmit", function (e, t, a) {
            var i = ht(e),
              n = !1;
            return (
              o.a.each(i, function () {
                this.isUploadingInProgress() && (n = !0);
              }),
              n
                ? (o.a.ceNotification("show", {
                    type: "W",
                    title: ut.tr("warning"),
                    message: ut.tr("file_uploading_in_progress_please_wait"),
                  }),
                  !1)
                : a
            );
          }),
            (function (e) {
              var t = o.a.Deferred();
              o.a.fn.file_uploader
                ? t.resolve()
                : o.a.getScript("js/lib/dropzone/dist/dropzone.js", t.resolve),
                Promise.resolve(t).then(function () {
                  o()(".cm-file-uploader", e).each(function () {
                    new ft(o()(this), e).init();
                  });
                }),
                t.promise();
            })(e);
        });
    }
    m.a;
    var vt = {
        init: function () {
          var e = o()(this);
          e.on("change", function () {
            var t = e.data("caAuthUserId"),
              a = e.data("caProductObjectPrefix"),
              i = e.data("caProductId"),
              n = e.prop("checked"),
              r = "";
            if (!t) {
              var s = o()("#product_notify_email_".concat(a).concat(i));
              if (s.length) {
                var l = s.attr("placeholder"),
                  c = s.val();
                if (!(r = c.length && c !== l ? "&email=" + c : r).length)
                  return;
              }
            }
            if (t || !n) {
              var _ = o()(
                  '[name="product_form_'.concat(a).concat(i, '"]')
                ).ceFormValidator("checkFields", !0, !1, !0),
                d = n ? "Y" : "N";
              _
                ? o.a.ceAjax(
                    "request",
                    fn_url(
                      "products.product_notifications?enable="
                        .concat(d, "&product_id=")
                        .concat(i)
                        .concat(r)
                    ),
                    { caching: !1 }
                  )
                : e.prop("checked", !n);
            }
          });
        },
      },
      Et = m.a,
      bt = {
        init: function () {
          if (Et.deferred_scripts)
            for (
              var e = function (e) {
                  setTimeout(function () {
                    o.a.getScript(Et.deferred_scripts[e].src, function () {
                      o.a.ceEvent(
                        "trigger",
                        "ce.lazy_script_load_".concat(
                          Et.deferred_scripts[e].event_suffix
                        )
                      );
                    });
                  }, Et.deferred_scripts[e].delay || 3e3);
                },
                t = 0;
              t < Et.deferred_scripts.length;
              t++
            )
              e(t);
        },
      },
      yt = function (e) {
        !(function (e) {
          e.ceScrollerMethods = T;
        })(e),
          (function (e) {
            (e.fn.ceDialog = function (t) {
              return B[t]
                ? B[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error("ty.dialog: method " + t + " does not exist")
                : B._init.apply(this, arguments);
            }),
              (e.ceDialog = function (t, a) {
                if (((a = a || {}), "get_last" == t)) {
                  if (0 == q.length) return e();
                  var i = e("#" + q[q.length - 1]);
                  return a.getWidget ? i.dialog("widget") : i;
                }
                if ("fit_elements" == t)
                  a.jelm.parents(".cm-picker-options-container").length &&
                    e.ceDialog("get_last").data("dialog")._trigger("resize");
                else if ("reload_parent" == t) {
                  i = a.jelm.closest(".ui-dialog-content");
                  var n = e(".object-container", i);
                  if (
                    (n.length ||
                      (i.wrapInner('<div class="object-container" />'),
                      i
                        .find(".object-container")
                        .prepend(
                          '<div class="cm-notification-container-dialog notification-container-dialog"/>'
                        )),
                    i.length && i.is(":visible"))
                  ) {
                    var o = n.scrollTop();
                    i.ceDialog("reload"), n.animate({ scrollTop: o }, 0);
                  }
                } else {
                  if ("inside_dialog" == t)
                    return 0 != a.jelm.closest(".ui-dialog-content").length;
                  if ("get_params" == t) {
                    if (!a.length) return;
                    var r = {
                      keepInPlace: a.hasClass("cm-dialog-keep-in-place"),
                      nonClosable: a.hasClass("cm-dialog-non-closable"),
                      scroll: a.data("caScroll") ? a.data("caScroll") : "",
                      titleTemplate: a.data("caDialogTemplate") || null,
                      titleFirstChunk: a.data("caDialogTextFirst") || null,
                      titleSecondChunk: a.data("caDialogTextSecond") || null,
                      purpose: a.data("caDialogPurpose") || null,
                    };
                    if (
                      (a.data("caDialogTitle")
                        ? (r.title = a.data("caDialogTitle"))
                        : ((r.title =
                            a.prop("title") ||
                            e("#".concat(a.data("caTargetId"))).prop("title") ||
                            ""),
                          a.prop("title", r.title)),
                      a.prop("href") && (r.href = a.prop("href")),
                      a.hasClass("cm-dialog-auto-size")
                        ? ((r.width = "auto"),
                          (r.height = "auto"),
                          (r.dialogClass = "dialog-auto-sized"))
                        : a.hasClass("cm-dialog-auto-width")
                        ? (r.width = "auto")
                        : a.hasClass("cm-dialog-auto-height") &&
                          (r.height = "auto"),
                      a.hasClass("cm-dialog-switch-avail") &&
                        (r.switch_avail = !0),
                      a.hasClass("cm-dialog-destroy-on-close") &&
                        (r.destroyOnClose = !0),
                      0 == e("#" + a.data("caTargetId")).length)
                    ) {
                      var s = a.data("caDialogTitle")
                        ? a.data("caDialogTitle")
                        : a.prop("title");
                      e(
                        '<div class="hidden" title="' +
                          s +
                          '" id="' +
                          a.data("caTargetId") +
                          '">\x3c!--' +
                          a.data("caTargetId") +
                          "--\x3e</div>"
                      ).appendTo(I.body);
                    }
                    return (
                      a.prop("href") &&
                        a.data("caViewId") &&
                        (r.view_id = a.data("caViewId")),
                      a.data("caDialogClass") &&
                        (r.dialogClass = a.data("caDialogClass")),
                      a.data("caDialogContentRequestForm") &&
                        (r.contentRequestForm = a.data(
                          "caDialogContentRequestForm"
                        )),
                      a.data("caDialogActionContext") &&
                        (r.actionContext = a.data("caDialogActionContext")),
                      r
                    );
                  }
                  if ("clear_stack" == t)
                    return e.popupStack.clear_stack(), (q = []);
                  if ("destroy_loaded" == t) {
                    var l = e("<div>").html(a.content);
                    e.each(S, function (t, a) {
                      l.find("#" + a).length && e("#" + a).ceDialog("destroy");
                    });
                  }
                }
              }),
              e.extend({
                popupStack: {
                  stack: [],
                  add: function (e) {
                    return this.stack.push(e);
                  },
                  remove: function (e) {
                    var t = this.stack.indexOf(e);
                    if (-1 != t) return this.stack.splice(t, 1);
                  },
                  last_close: function () {
                    var e = this.stack.pop();
                    return !(!e || !e.close || (e.close(), 0));
                  },
                  last: function () {
                    return this.stack[this.stack.length - 1];
                  },
                  close: function (e) {
                    var t = this.stack.indexOf(e);
                    if (-1 != t) {
                      var a = this.stack.splice(t, 1)[0];
                      return a.close && a.close(), !0;
                    }
                    return !1;
                  },
                  clear_stack: function () {
                    return (this.stack = []);
                  },
                },
              });
          })(e),
          (function (e) {
            (e.fn.ceAccordion = function (t) {
              return L[t]
                ? L[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error("ty.accordion: method " + t + " does not exist")
                : L.init.apply(this, arguments);
            }),
              (e.ceAccordion = function (t, a) {
                if (L[t])
                  return L[t].apply(
                    this,
                    Array.prototype.slice.call(arguments, 1)
                  );
                e.error("ty.notification: method " + t + " does not exist");
              });
          })(e),
          (function (e) {
            (e.fn.ceEditor = function (t) {
              return F[t]
                ? F[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error("ty.editor: method " + t + " does not exist")
                : F.run.apply(this, arguments);
            }),
              (e.ceEditor = function (e, t, a) {
                if ("push" == e) {
                  if (!t) return K.unshift();
                  K.push(t);
                } else if ("state" == e) {
                  if (!t) return W;
                  if (((W = t), "loaded" == t && K.length)) {
                    for (var i = 0; i < K.length; i++) K[i].ceEditor("run", a);
                    K = [];
                  }
                } else if ("handlers" == e) U = t;
                else if (
                  "run" == e ||
                  "destroy" == e ||
                  "updateTextFields" == e ||
                  "recover" == e ||
                  "val" == e ||
                  "disable" == e ||
                  "insert" == e
                )
                  return U[e](t, a);
              });
          })(e),
          (function (e) {
            (e.fn.cePreviewer = function (t) {
              return z[t]
                ? z[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error("ty.previewer: method " + t + " does not exist")
                : z.run.apply(this, arguments);
            }),
              (e.cePreviewer = function (e, t) {
                if ("handlers" == e) this.handlers = t;
                else if ("display" == e) return this.handlers[e](t);
              });
          })(e),
          (function (e) {
            e.fn.ceProgress = function (t) {
              return H[t]
                ? H[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error("ty.progress: method " + t + " does not exist")
                : H.init.apply(this, arguments);
            };
          })(e),
          (function (e) {
            e.ceHistory = function (t) {
              if (G[t])
                return G[t].apply(
                  this,
                  Array.prototype.slice.call(arguments, 1)
                );
              e.error("ty.history: method " + t + " does not exist");
            };
          })(e),
          (function (e) {
            e.fn.ceHint = function (t) {
              return Y[t]
                ? Y[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error("ty.hint: method " + t + " does not exist")
                : Y.run.apply(this, arguments);
            };
          })(e),
          (function (e) {
            e.fn.ceTooltip = function (t) {
              return Z[t]
                ? Z[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error("ty.tooltip: method " + t + " does not exist")
                : Z.init.apply(this, arguments);
            };
          })(e),
          (function (e) {
            e.fn.ceSortable = function (t) {
              return X[t]
                ? X[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error("ty.sortable: method " + t + " does not exist")
                : X.init.apply(this, arguments);
            };
          })(e),
          (function (e) {
            e.fn.ceColorpicker = function (t) {
              return ee[t]
                ? ee[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error(
                    "ty.colorpicker: method " + t + " does not exist"
                  )
                : ee.init.apply(this, arguments);
            };
          })(e),
          (function (e) {
            e.fn.ceContentMore = function (t) {
              return e(this).each(function (e, a) {
                (ae[t] || ae.init).apply(
                  this,
                  Array.prototype.slice.call(arguments, 1)
                );
              });
            };
          })(e),
          (function (e) {
            (e.fn.ceFormValidator = function (t) {
              var a,
                i = arguments;
              return (
                e(this).each(function (n, o) {
                  fe[t]
                    ? (a = fe[t].apply(this, Array.prototype.slice.call(i, 1)))
                    : "object" !== Object(r.a)(t) && t
                    ? e.error(
                        "ty.formvalidator: method " + t + " does not exist"
                      )
                    : (a = fe.init.apply(this, i));
                }),
                a
              );
            }),
              (e.ceFormValidator = function (t, a) {
                if (((a = a || {}), "setZipcode" == t)) ne = a;
                else if ("setRegexp" == t)
                  "console" in window &&
                    console.log(
                      'This method is deprecated, use data-attributes "data-ca-regexp" and "data-ca-message" instead'
                    ),
                    (oe = e.extend(oe, a));
                else if ("registerValidator" == t) re.push(a);
                else if ("check" == t && a.form)
                  return (
                    void 0 === a.only_check && (a.only_check = !0),
                    fe.check.apply(a.form, [a.only_check])
                  );
              });
          })(e),
          (function (e) {
            (e.fn.ceRebuildStates = function (t) {
              var a = arguments;
              return e(this).each(function (i, n) {
                return be[t]
                  ? be[t].apply(this, Array.prototype.slice.call(a, 1))
                  : "object" !== Object(r.a)(t) && t
                  ? void e.error(
                      "ty.rebuildstates: method " + t + " does not exist"
                    )
                  : be.init.apply(this, a);
              });
            }),
              (e.ceRebuildStates = function (e, t) {
                (t = t || {}), "init" == e && (me = t);
              });
          })(e),
          (function (e) {
            e.fn.ceStickyScroll = function (t) {
              return ye[t]
                ? ye[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error(
                    "ty.stickyScroll: method " + t + " does not exist"
                  )
                : ye.init.apply(this, arguments);
            };
          })(e),
          (function (e) {
            e.ceNotification = function (t) {
              if (ke[t])
                return ke[t].apply(
                  this,
                  Array.prototype.slice.call(arguments, 1)
                );
              e.error("ty.notification: method " + t + " does not exist");
            };
          })(e),
          (function (e) {
            e.ceEvent = function (t) {
              if (xe[t])
                return xe[t].apply(
                  this,
                  Array.prototype.slice.call(arguments, 1)
                );
              e.error("ty.event: method " + t + " does not exist");
            };
          })(e),
          (function (e) {
            e.fn.ceCodeEditor = function (t) {
              return Te[t]
                ? Te[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error("ty.codeeditor: method " + t + " does not exist")
                : Te.init.apply(this, arguments);
            };
          })(e),
          (function (e) {
            e.fn.ceObjectSelector = function (t) {
              var a = this,
                i = function () {
                  var i = e.fn.select2.amd.require(
                      "select2/selection/multiple"
                    ),
                    n = e.fn.select2.amd.require("select2/selection/search"),
                    o = i.prototype.bind;
                  return (
                    (i.prototype.bind = function (t, a) {
                      this.$selection.on("click", function (t) {
                        e(t.target).hasClass("select2-search__field") ||
                          e(t.target).hasClass("select2-selection__rendered") ||
                          t.stopImmediatePropagation();
                      }),
                        o.apply(this, arguments);
                    }),
                    (n.prototype.searchRemoveChoice = function () {
                      return !1;
                    }),
                    a.each(function () {
                      if (e.data(this, "plugin_ceObjectSelector")) {
                        var a = e.data(this, "plugin_ceObjectSelector");
                        (a.settings = e.extend({}, Be, t)), a.init();
                      } else e.data(this, "plugin_ceObjectSelector", new qe(this, t));
                    })
                  );
                };
              if (this.length) {
                if (e.fn.select2) return i();
                e.getScript(
                  "js/lib/select2/dist/js/select2.full.min.js",
                  function () {
                    i();
                  }
                );
              }
              return this;
            };
          })(e),
          (function (e) {
            e.fn.ceInsertAtCaret = function () {
              return Re.init.apply(this, arguments);
            };
          })(e),
          (function (e) {
            e.fn.ceSwitchCheckbox = function (t) {
              return Le[t]
                ? Le[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error(
                    "ty.switchcheckbox: method " + t + " does not exist"
                  )
                : Le.init.apply(this, arguments);
            };
          })(e),
          (function (e) {
            e.fn.ceCheckboxGroup = function (t) {
              var a = arguments;
              return e(this).each(function (i, n) {
                return Ue[t]
                  ? Ue[t].apply(this, Array.prototype.slice.call(a, 1))
                  : "object" !== Object(r.a)(t) && t
                  ? void e.error(
                      "ty.checkboxGroup: method " + t + " does not exist"
                    )
                  : Ue.init.apply(this, a);
              });
            };
          })(e),
          (function (e) {
            (e.fn.ceBlockManager = function (t) {
              return Ne[t]
                ? Ne[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error("ty.accordion: method " + t + " does not exist")
                : Ne.init.apply(this, arguments);
            }),
              (e.ceBlockManager = function (t, a) {
                if (Ne[t])
                  return Ne[t].apply(
                    this,
                    Array.prototype.slice.call(arguments, 1)
                  );
                e.error("ty.notification: method " + t + " does not exist");
              });
          })(e),
          Object(x.createPlugin)("ceBlockLoader", He, "ce.block_loader", !0),
          ot(e),
          (function (e) {
            e.fn.ceTableSortable = function () {
              0 !== e('[data-ca-sortable="true"]').length &&
                e.getScript(
                  "js/lib/tablesorter/jquery.tablesorter.combined.min.js",
                  function () {
                    e('[data-ca-sortable-column="false"]').data("sorter", !1),
                      e('[data-ca-sortable="true"]').each(function (t, a) {
                        var i = e(a);
                        i.tablesorter({
                          sortList: i.data("caSortList") || [[0, 0]],
                          emptyTo: i.data("caEmptyTo") || "emptyMin",
                          widgets: ["saveSort"],
                          saveSort: !0,
                          widgetOptions: { storage_useSessionStorage: !0 },
                        });
                      });
                  }
                );
            };
          })(e),
          (function (e) {
            e.fn.ceNotificationReceiversEditor = function (t) {
              for (
                var a = arguments.length,
                  i = new Array(a > 1 ? a - 1 : 0),
                  n = 1;
                n < a;
                n++
              )
                i[n - 1] = arguments[n];
              return (
                t && "init" !== t
                  ? function () {}.apply(void 0, [e(this), t].concat(i))
                  : lt(e(this), i[0]),
                e(this)
              );
            };
          })(e),
          (function (e) {
            e.fn.ceInlineDialog = function (t) {
              if ((t || (t = "init"), dt[t]))
                return dt[t].apply(
                  this,
                  Array.prototype.slice.call(arguments, 1)
                );
              e.error("ty.inlineDialog: method " + t + " does not exist");
            };
          })(e),
          (function (e) {
            e.fn.ceFileUploader = function () {
              return gt(e(this)), e(this);
            };
          })(e),
          (function (e) {
            e.fn.ceBackInStockNotificationSwitcher = function (t) {
              return vt[t]
                ? vt[t].apply(this, Array.prototype.slice.call(arguments, 1))
                : "object" !== Object(r.a)(t) && t
                ? void e.error(
                    "ty.backinstocknotificationswitcher: method " +
                      t +
                      " does not exist"
                  )
                : vt.init.apply(this, arguments);
            };
          })(e),
          (function (e) {
            e.ceLazyLoader = function (t) {
              if (bt[t])
                return bt[t].apply(
                  this,
                  Array.prototype.slice.call(arguments, 1)
                );
              e.error("ty.lazyloader: method " + t + " does not exist");
            };
          })(e);
      };
    (String.prototype.str_replace = function (e, t) {
      return this.toString().split(e).join(t);
    }),
      String.prototype.trim ||
        (String.prototype.trim = function () {
          return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        }),
      (window.Tygh = m.a),
      (window.fn_print_r = s),
      (window.fn_alert = l),
      (window.fn_print_array = c),
      (window.fn_url = _),
      (window.fn_strip_tags = d),
      (window.fn_reload_form = u),
      (window.fn_get_listed_lang = p),
      (window.fn_query_remove = f),
      (window.fn_calculate_total_shipping = h),
      (function (e, t) {
        if (
          ((e.$ = t),
          t.fn.extend({
            select2Sortable: v,
            toggleBy: E,
            moveOptions: b,
            swapOptions: y,
            selectOptions: C,
            alignElement: D,
            formIsChanged: j,
            fieldIsChanged: O,
            disableFields: P,
            click: w,
            switchAvailability: M,
            serializeObject: k,
            positionElm: A,
          }),
          t.extend(x),
          yt(t),
          (function (e) {
            var t = !0,
              a = {
                "screen--xs": [0, 350],
                "screen--xs-large": [350, 480],
                "screen--sm": [481, 767],
                "screen--sm-large": [768, 1024],
                "screen--md": [1024, 1280],
                "screen--md-large": [1280, 1440],
                "screen--lg": [1440, 1920],
                "screen--uhd": [1920, 9999],
              },
              i = e.debounce(function (i) {
                var n = { old: "", new: "" },
                  o = e(window).width();
                for (var r in a) {
                  e("body").hasClass(r) &&
                    ((n.old = r), e("body").removeClass(r));
                  var s = a[r];
                  o >= s[0] &&
                    o <= s[1] &&
                    (e("body").addClass(r), (n.new = r));
                }
                e.ceEvent("trigger", "ce.window.resize", [i, n]),
                  t &&
                    ((t = !1),
                    e.ceEvent("trigger", "ce.responsive_classes.ready", []));
              });
            e.ceEvent("on", "ce.commoninit", function () {
              e(window).on("resize", i), e(window).trigger("resize");
            });
          })(t),
          !e.embedded &&
            location.hash &&
            0 === decodeURIComponent(location.hash).indexOf("#!/"))
        ) {
          var a = t.parseUrl(location.href),
            i = t.ceHistory("parseHash", location.hash);
          t.redirect(a.protocol + "://" + a.host + a.directory + i);
        }
      })(m.a, o.a);
  },
  4: function (e, t, a) {
    "use strict";
    function i(e, t) {
      if (!(e instanceof t))
        throw new TypeError("Cannot call a class as a function");
    }
    a.d(t, "a", function () {
      return i;
    });
  },
  5: function (e, t, a) {
    "use strict";
    function i(e, t) {
      for (var a = 0; a < t.length; a++) {
        var i = t[a];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(e, i.key, i);
      }
    }
    function n(e, t, a) {
      return t && i(e.prototype, t), a && i(e, a), e;
    }
    a.d(t, "a", function () {
      return n;
    });
  },
  8: function (module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__),
      __webpack_require__.d(
        __webpack_exports__,
        "lastClickedElement",
        function () {
          return lastClickedElement;
        }
      ),
      __webpack_require__.d(__webpack_exports__, "getWindowSizes", function () {
        return getWindowSizes;
      }),
      __webpack_require__.d(__webpack_exports__, "disable_elms", function () {
        return disable_elms;
      }),
      __webpack_require__.d(__webpack_exports__, "ua", function () {
        return ua;
      }),
      __webpack_require__.d(__webpack_exports__, "is", function () {
        return is;
      }),
      __webpack_require__.d(__webpack_exports__, "cookie", function () {
        return cookie;
      }),
      __webpack_require__.d(__webpack_exports__, "redirect", function () {
        return redirect;
      }),
      __webpack_require__.d(__webpack_exports__, "dispatchEvent", function () {
        return dispatchEvent;
      }),
      __webpack_require__.d(__webpack_exports__, "runCart", function () {
        return runCart;
      }),
      __webpack_require__.d(__webpack_exports__, "commonInit", function () {
        return commonInit;
      }),
      __webpack_require__.d(__webpack_exports__, "afterLoad", function () {
        return afterLoad;
      }),
      __webpack_require__.d(__webpack_exports__, "processForms", function () {
        return processForms;
      }),
      __webpack_require__.d(__webpack_exports__, "formatPrice", function () {
        return formatPrice;
      }),
      __webpack_require__.d(__webpack_exports__, "formatNum", function () {
        return formatNum;
      }),
      __webpack_require__.d(__webpack_exports__, "utf8Encode", function () {
        return utf8Encode;
      }),
      __webpack_require__.d(__webpack_exports__, "crc32", function () {
        return crc32;
      }),
      __webpack_require__.d(__webpack_exports__, "rc64_helper", function () {
        return rc64_helper;
      }),
      __webpack_require__.d(__webpack_exports__, "utf8_decode", function () {
        return utf8_decode;
      }),
      __webpack_require__.d(__webpack_exports__, "rc64", function () {
        return rc64;
      }),
      __webpack_require__.d(
        __webpack_exports__,
        "toggleStatusBox",
        function () {
          return toggleStatusBox;
        }
      ),
      __webpack_require__.d(__webpack_exports__, "scrollToElm", function () {
        return scrollToElm;
      }),
      __webpack_require__.d(__webpack_exports__, "stickyFooter", function () {
        return stickyFooter;
      }),
      __webpack_require__.d(
        __webpack_exports__,
        "showPickerByAnchor",
        function () {
          return showPickerByAnchor;
        }
      ),
      __webpack_require__.d(__webpack_exports__, "ltrim", function () {
        return ltrim;
      }),
      __webpack_require__.d(__webpack_exports__, "rtrim", function () {
        return rtrim;
      }),
      __webpack_require__.d(__webpack_exports__, "loadCss", function () {
        return loadCss;
      }),
      __webpack_require__.d(
        __webpack_exports__,
        "loadAjaxContent",
        function () {
          return loadAjaxContent;
        }
      ),
      __webpack_require__.d(__webpack_exports__, "ajaxLink", function () {
        return ajaxLink;
      }),
      __webpack_require__.d(__webpack_exports__, "isJson", function () {
        return isJson;
      }),
      __webpack_require__.d(__webpack_exports__, "isMobile", function () {
        return isMobile;
      }),
      __webpack_require__.d(__webpack_exports__, "isUndefined", function () {
        return isUndefined;
      }),
      __webpack_require__.d(__webpack_exports__, "debounce", function () {
        return debounce;
      }),
      __webpack_require__.d(
        __webpack_exports__,
        "matchScreenSize",
        function () {
          return matchScreenSize;
        }
      ),
      __webpack_require__.d(__webpack_exports__, "createPlugin", function () {
        return createPlugin;
      }),
      __webpack_require__.d(__webpack_exports__, "sprintf", function () {
        return sprintf;
      }),
      __webpack_require__.d(__webpack_exports__, "parseUrl", function () {
        return parseUrl;
      }),
      __webpack_require__.d(__webpack_exports__, "attachToUrl", function () {
        return attachToUrl;
      }),
      __webpack_require__.d(__webpack_exports__, "matchClass", function () {
        return matchClass;
      }),
      __webpack_require__.d(
        __webpack_exports__,
        "getProcessItemsMeta",
        function () {
          return getProcessItemsMeta;
        }
      ),
      __webpack_require__.d(__webpack_exports__, "getTargetForm", function () {
        return getTargetForm;
      }),
      __webpack_require__.d(
        __webpack_exports__,
        "checkSelectedItems",
        function () {
          return checkSelectedItems;
        }
      ),
      __webpack_require__.d(__webpack_exports__, "submit1Form", function () {
        return submit1Form;
      }),
      __webpack_require__.d(__webpack_exports__, "externalLink", function () {
        return externalLink;
      }),
      __webpack_require__.d(__webpack_exports__, "toggleCheckbox", function () {
        return toggleCheckbox;
      }),
      __webpack_require__.d(
        __webpack_exports__,
        "performPostRequest",
        function () {
          return performPostRequest;
        }
      );
    var _tmp_ipac_builder_CsCartMultivendor_164479_802_repo_js_core_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(2),
      jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0),
      jquery__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(
        jquery__WEBPACK_IMPORTED_MODULE_1__
      ),
      ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1),
      _ = ___WEBPACK_IMPORTED_MODULE_2__.a;
    !(function (e) {
      var t = navigator.userAgent.toLowerCase(),
        a =
          /(edge)[ \/]([\w.]+)/.exec(t) ||
          /(chrome)[ \/]([\w.]+)/.exec(t) ||
          /(webkit)[ \/]([\w.]+)/.exec(t) ||
          /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t) ||
          /(msie) ([\w.]+)/.exec(t) ||
          (/(trident\/7.0;)/.exec(t) ? [null, "msie", "11"] : void 0) ||
          (t.indexOf("compatible") < 0 &&
            /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t)) ||
          [],
        i = { browser: a[1] || "", version: a[2] || "0" },
        n = {};
      i.browser && ((n[i.browser] = !0), (n.version = i.version)),
        n.chrome ? (n.webkit = !0) : n.webkit && (n.safari = !0),
        (e.browser = n);
    })(jquery__WEBPACK_IMPORTED_MODULE_1___default.a);
    var lastClickedElement = null,
      getWindowSizes = function () {
        var e =
          document.compatMode && "BackCompat" != document.compatMode
            ? document.documentElement
            : document.body;
        return {
          offset_x: e.scrollLeft
            ? e.scrollLeft
            : self.pageXOffset
            ? self.pageXOffset
            : 0,
          offset_y: e.scrollTop
            ? e.scrollTop
            : self.pageYOffset
            ? self.pageYOffset
            : 0,
          view_height: self.innerHeight ? self.innerHeight : e.clientHeight,
          view_width: self.innerWidth ? self.innerWidth : e.clientWidth,
          height: e.scrollHeight ? e.scrollHeight : window.height,
          width: e.scrollWidth ? e.scrollWidth : window.width,
        };
      },
      disable_elms = function (e, t) {
        jquery__WEBPACK_IMPORTED_MODULE_1___default()("#" + e.join(",#")).prop(
          "disabled",
          t
        );
      },
      ua = {
        version:
          navigator.userAgent.toLowerCase().indexOf("chrome") >= 0
            ? (navigator.userAgent.match(/.+(?:chrome)[\/: ]([\d.]+)/i) ||
                [])[1]
            : navigator.userAgent.toLowerCase().indexOf("msie") >= 0
            ? (navigator.userAgent.match(/.*?msie[\/:\ ]([\d.]+)/i) || [])[1]
            : (navigator.userAgent.match(
                /.+(?:it|pera|irefox|ersion)[\/: ]([\d.]+)/i
              ) || [])[1],
        browser:
          navigator.userAgent.toLowerCase().indexOf("chrome") >= 0
            ? "Chrome"
            : jquery__WEBPACK_IMPORTED_MODULE_1___default.a.browser.safari
            ? "Safari"
            : jquery__WEBPACK_IMPORTED_MODULE_1___default.a.browser.opera
            ? "Opera"
            : jquery__WEBPACK_IMPORTED_MODULE_1___default.a.browser.msie
            ? "Internet Explorer"
            : "Firefox",
        os:
          -1 != navigator.platform.toLowerCase().indexOf("mac")
            ? "MacOS"
            : -1 != navigator.platform.toLowerCase().indexOf("win")
            ? "Windows"
            : "Linux",
        language: navigator.language
          ? navigator.language
          : navigator.browserLanguage
          ? navigator.browserLanguage
          : navigator.userLanguage
          ? navigator.userLanguage
          : navigator.systemLanguage
          ? navigator.systemLanguage
          : "",
      },
      is = {
        email: function (e) {
          return !!/^([^@\s]*<?)([^@\s]*)@([^@\s]*?)(>?)$/i.test(e);
        },
        blank: function (e) {
          return !!(
            (jquery__WEBPACK_IMPORTED_MODULE_1___default.a.isArray(e) &&
              0 == e.length) ||
            "null" === jquery__WEBPACK_IMPORTED_MODULE_1___default.a.type(e) ||
            "" == ("" + e).replace(/[\n\r\t]/gi, "")
          );
        },
        integer: function (e) {
          return !(
            !/^[0-9]+$/.test(e) ||
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.is.blank(e)
          );
        },
        rgbColor: function (e) {
          return /^(rgb)\((\d*)(,|,*)(\d*)(,|,*)(\d*)\)$/.test(e);
        },
        rgbaColor: function (e) {
          return /^(rgba)\((\d*)(,|,*)(\d*)(,|,*)(\d*)(,|,*)(\d*|\d.\d*)\)$/.test(
            e
          );
        },
        hex6Color: function (e) {
          return /^\#[0-9a-fA-F]{6}$/.test(e);
        },
        color: function (e) {
          return (
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.is.rgbColor(e) ||
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.is.rgbaColor(e) ||
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.is.hex6Color(e)
          );
        },
        phone: function (e) {
          return !(!/^[\s()+-]*([0-9][\s()+-]*){6,20}$/.test(e) || !e.length);
        },
      },
      cookie = {
        get: function (e) {
          for (
            var t = e + "=", a = t.length, i = document.cookie.length, n = 0;
            n < i;

          ) {
            var o = n + a;
            if (document.cookie.substring(n, o) == t) {
              var r = document.cookie.indexOf(";", o);
              return (
                -1 == r && (r = document.cookie.length),
                decodeURI(document.cookie.substring(o, r))
              );
            }
            if (0 == (n = document.cookie.indexOf(" ", n) + 1)) break;
          }
          return null;
        },
        set: function (e, t, a, i, n, o) {
          document.cookie =
            e +
            "=" +
            encodeURIComponent(t) +
            (a ? "; expires=" + a.toGMTString() : "") +
            (i ? "; path=" + i : "") +
            (n ? "; domain=" + n : "") +
            (o ? "; secure" : "");
        },
        remove: function (e, t, a) {
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.cookie.get(e) &&
            (document.cookie =
              e +
              "=" +
              (t ? "; path=" + t : "") +
              (a ? "; domain=" + a : "") +
              "; expires=Thu, 01-Jan-70 00:00:01 GMT");
        },
      },
      redirect = function (e, t) {
        (t = t || !1),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()("base").length &&
            0 != e.indexOf("/") &&
            0 !== e.indexOf("http") &&
            (e =
              jquery__WEBPACK_IMPORTED_MODULE_1___default()("base").prop(
                "href"
              ) + e),
          _.embedded
            ? jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceAjax(
                "request",
                e,
                { result_ids: _.container }
              )
            : t
            ? window.location.replace(e)
            : (window.location.href = e);
      },
      dispatchEvent = function dispatchEvent(e) {
        var jelm = jquery__WEBPACK_IMPORTED_MODULE_1___default()(e.target),
          elm = e.target,
          s;
        if (
          ((e.which = e.which || 1),
          ("click" == e.type || "mousedown" == e.type) &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.browser.mozilla &&
            1 != e.which)
        )
          return !0;
        var processed = { status: !1, to_return: !0 };
        if (
          (jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
            "trigger",
            "dispatch_event_pre",
            [e, jelm, processed]
          ),
          processed.status)
        )
          return processed.to_return;
        if ("click" == e.type) {
          if (
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.getProcessItemsMeta(
              elm
            )
          ) {
            if (
              !jquery__WEBPACK_IMPORTED_MODULE_1___default.a.checkSelectedItems(
                elm
              )
            )
              return !1;
          } else if (
            (jelm.hasClass("cm-confirm") ||
              jelm.parents().hasClass("cm-confirm")) &&
            !jelm.parents().hasClass("cm-skip-confirmation")
          ) {
            var confirm_text = _.tr("text_are_you_sure_to_proceed"),
              $parent_confirm;
            if (
              (jelm.hasClass("cm-confirm") && jelm.data("ca-confirm-text")
                ? (confirm_text = jelm.data("ca-confirm-text"))
                : (($parent_confirm = jelm
                    .parents('[class="cm-confirm"][data-ca-confirm-text]')
                    .first()),
                  $parent_confirm.get(0) &&
                    (confirm_text = $parent_confirm.data("ca-confirm-text"))),
              !1 === confirm(fn_strip_tags(confirm_text)))
            )
              return !1;
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
              "trigger",
              "ce.form_confirm",
              [jelm]
            );
          }
          if (
            ((jquery__WEBPACK_IMPORTED_MODULE_1___default.a.lastClickedElement =
              jelm),
            jelm.hasClass("cm-select-bm-block") ||
              jelm.parent(".cm-select-bm-block").length)
          ) {
            var _elm2 = jelm.hasClass("cm-select-bm-block")
                ? jelm
                : jelm.parent(".cm-select-bm-block"),
              data =
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(_elm2).data();
            return (
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
                "trigger",
                "ce.bm.block.selected",
                [data]
              ),
              !0
            );
          }
          if (
            jelm.hasClass("cm-disabled") ||
            jelm.parents(".cm-disabled").length
          )
            return !1;
          if (
            jelm.hasClass("cm-delete-row") ||
            jelm.parents(".cm-delete-row").length
          ) {
            var holder;
            if (jelm.is("tr") || jelm.hasClass("cm-row-item")) holder = jelm;
            else if (jelm.parents(".cm-row-item").length)
              holder = jelm.parents(".cm-row-item:first");
            else {
              if (
                !jelm.parents("tr").length ||
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  ".cm-picker",
                  jelm.parents("tr:first")
                ).length
              )
                return !1;
              holder = jelm.parents("tr:first");
            }
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              ".cm-combination[id^=off_]",
              holder
            ).click(),
              holder.parent("tbody.cm-row-item").length &&
                (holder = holder.parent("tbody.cm-row-item")),
              jelm.hasClass("cm-ajax") || jelm.parents(".cm-ajax").length
                ? (jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceAjax(
                    "clearCache"
                  ),
                  holder.remove())
                : holder.hasClass("cm-opacity")
                ? (jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    ":input",
                    holder
                  ).each(function () {
                    jquery__WEBPACK_IMPORTED_MODULE_1___default()(this).prop(
                      "name",
                      jquery__WEBPACK_IMPORTED_MODULE_1___default()(this).data(
                        "caInputName"
                      )
                    );
                  }),
                  holder.removeClass("cm-delete-row cm-opacity"))
                : (jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    ":input[name]",
                    holder
                  ).each(function () {
                    var e = jquery__WEBPACK_IMPORTED_MODULE_1___default()(this),
                      t = e.prop("name");
                    e.data("caInputName", t)
                      .attr("data-ca-input-name", t)
                      .prop("name", "");
                  }),
                  holder.addClass("cm-delete-row cm-opacity"));
          }
          if (
            (jelm.hasClass("cm-save-and-close") &&
              jelm
                .parents("form:first")
                .append(
                  '<input type="hidden" name="return_to_list" value="Y" />'
                ),
            (jelm.hasClass("cm-new-window") && jelm.prop("href")) ||
              (jelm.closest(".cm-new-window") &&
                jelm.closest(".cm-new-window").prop("href")))
          ) {
            var _e = jelm.hasClass("cm-new-window")
              ? jelm.prop("href")
              : jelm.closest(".cm-new-window").prop("href");
            return window.open(_e), !1;
          }
          if (jelm.hasClass("cm-select-text"))
            if (jelm.data("caSelectId")) {
              var c_elm = jelm.data("caSelectId");
              c_elm &&
                jquery__WEBPACK_IMPORTED_MODULE_1___default()("#" + c_elm)
                  .length &&
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "#" + c_elm
                ).select();
            } else jelm.get(0).select();
          if (
            jelm.hasClass("cm-external-click") ||
            jelm.parents(".cm-external-click").length
          ) {
            var _e = jelm.hasClass("cm-external-click")
                ? jelm
                : jelm.parents(".cm-external-click:first"),
              c_elm = _e.data("caExternalClickId");
            c_elm &&
              jquery__WEBPACK_IMPORTED_MODULE_1___default()("#" + c_elm)
                .length &&
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                "#" + c_elm
              ).click();
            var opt = { need_scroll: !0, jelm: _e, timeout: 0 };
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
              "trigger",
              "ce.needScroll",
              [opt]
            ),
              _e.data("caScroll") &&
                opt.need_scroll &&
                (opt.timeout
                  ? setTimeout(function () {
                      jquery__WEBPACK_IMPORTED_MODULE_1___default.a.scrollToElm(
                        _e.data("caScroll")
                      );
                    }, opt.timeout)
                  : jquery__WEBPACK_IMPORTED_MODULE_1___default.a.scrollToElm(
                      _e.data("caScroll")
                    ));
          }
          if (jelm.closest(".cm-dialog-opener").length) {
            var _e = jelm.closest(".cm-dialog-opener"),
              params = jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceDialog(
                "get_params",
                _e
              );
            return (
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                "#" + _e.data("caTargetId")
              ).ceDialog("open", params),
              !1
            );
          }
          if (
            "modal" == jelm.data("toggle") &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceDialog("get_last")
              .length
          ) {
            var href = jelm.prop("href"),
              target = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                jelm.data("target") ||
                  (href && href.replace(/.*(?=#[^\s]+$)/, ""))
              );
            if (target.length) {
              var $dialog = jquery__WEBPACK_IMPORTED_MODULE_1___default.a
                  .ceDialog("get_last")
                  .parent(".ui-front"),
                minZ = $dialog.css("z-index");
              target.css("z-index", minZ + 2),
                target.on("shown", function () {
                  jquery__WEBPACK_IMPORTED_MODULE_1___default()(this)
                    .data("modal")
                    .$backdrop.css("z-index", minZ + 1);
                });
            }
          }
          if (jelm.hasClass("cm-cancel")) {
            var form = jelm.parents("form");
            form.length &&
              (form.get(0).reset(),
              _.fileuploader && _.fileuploader.clean_form(),
              form.find(".error-message").remove(),
              form.find("input[checked]").change(),
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
                "trigger",
                "ce.cm_cancel.clean_form",
                [form, jelm]
              ));
          }
          if (
            (jelm.hasClass("cm-scroll") &&
              jelm.data("caScroll") &&
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.scrollToElm(
                jelm.data("caScroll")
              ),
            "Y" == _.changes_warning &&
              jelm.parents(".cm-confirm-changes").length &&
              jelm.parents("form").length &&
              jelm.parents("form:first").formIsChanged() &&
              !1 === confirm(fn_strip_tags(_.tr("text_changes_not_saved"))))
          )
            return !1;
          if (
            jelm.hasClass("cm-check-items") ||
            jelm.parents(".cm-check-items").length
          ) {
            var check_disabled = jelm.hasClass("cm-check-disabled"),
              disabled_state = check_disabled ? "" : ":disabled",
              container_selector =
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(elm).data(
                  "caContainer"
                ),
              elms_container =
                container_selector &&
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  container_selector
                ).length
                  ? jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                      container_selector
                    )
                  : elm.form;
            elms_container || (elms_container = jelm.parents("form:first"));
            var item_class =
              ".cm-item" +
              (jelm.data("caTarget") ? "-" + jelm.data("caTarget") : "");
            if (jelm.data("caStatus")) {
              var items = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                "input" +
                  item_class +
                  "[type=checkbox]:not(" +
                  disabled_state +
                  ")",
                elms_container
              );
              jelm.hasClass("cm-skip-unselect-all") ||
                (items.prop("checked", !1), items.trigger("change")),
                (item_class += ".cm-item-status-" + jelm.data("caStatus"));
            }
            var inputs = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              "input" +
                item_class +
                "[type=checkbox]:not(" +
                disabled_state +
                ")",
              elms_container
            );
            if (inputs.length) {
              var flag = !0;
              jelm.is("[type=checkbox]") && (flag = jelm.prop("checked")),
                jelm.hasClass("cm-on")
                  ? (flag = !0)
                  : jelm.hasClass("cm-off") && (flag = !1),
                inputs.prop("checked", flag),
                inputs.trigger("change");
            }
          } else {
            if (
              jelm.hasClass("cm-promo-popup") ||
              jelm.parents(".cm-promo-popup").length
            )
              return (
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "#restriction_promo_dialog"
                ).ceDialog("open", {
                  width: "auto",
                  height: "auto",
                  dialogClass: "restriction-promo",
                }),
                e.stopPropagation(),
                !1
              );
            if (
              "submit1" == jelm.prop("type") ||
              jelm.closest("button[type=submit1]").length
            ) {
              var _jelm = jelm.is("input,button")
                ? jelm
                : jelm.closest("button[type=submit1]");
              return (
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  _jelm.prop("form")
                ).ceFormValidator("setClicked", _jelm),
                1 == _jelm.length && null == _jelm.prop("form")
                  ? jquery__WEBPACK_IMPORTED_MODULE_1___default.a.submit1Form(
                      _jelm
                    )
                  : !_jelm.hasClass("cm-no-submit1")
              );
            }
          }
          var $ajax_link = jelm.closest("a.cm-ajax[href]");
          if ($ajax_link.length)
            return jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ajaxLink(e);
          if (
            jelm.parents(".cm-reset-link").length ||
            jelm.hasClass("cm-reset-link")
          ) {
            var frm = jelm.parents("form:first");
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              "[type=checkbox]",
              frm
            )
              .prop("checked", !1)
              .change(),
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                "input[type=text], input[type=password], input[type=file]",
                frm
              ).val(""),
              jquery__WEBPACK_IMPORTED_MODULE_1___default()("select", frm).each(
                function () {
                  jquery__WEBPACK_IMPORTED_MODULE_1___default()(this)
                    .val(
                      jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                        "option:first",
                        this
                      ).val()
                    )
                    .change();
                }
              );
            var radio_names = [];
            return (
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                "input[type=radio]",
                frm
              ).each(function () {
                -1 ==
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a.inArray(
                  this.name,
                  radio_names
                )
                  ? (jquery__WEBPACK_IMPORTED_MODULE_1___default()(this)
                      .prop("checked", !0)
                      .change(),
                    radio_names.push(this.name))
                  : jquery__WEBPACK_IMPORTED_MODULE_1___default()(this).prop(
                      "checked",
                      !1
                    );
              }),
              !0
            );
          }
          if (
            jelm.hasClass("cm-submit1") ||
            jelm.parents(".cm-submit1").length
          ) {
            if (!jelm.is("select,input"))
              return jquery__WEBPACK_IMPORTED_MODULE_1___default.a.submit1Form(
                jelm
              );
          } else {
            if (
              jelm.hasClass("cm-popup-switch") ||
              jelm.parents(".cm-popup-switch").length
            )
              return jelm.parents(".cm-popup-box:first").hide(), !1;
            if (
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.matchClass(
                elm,
                /cm-combinations([-\w]+)?/gi
              )
            ) {
              var s =
                  elm.className.match(/cm-combinations([-\w]+)?/gi) ||
                  jelm
                    .parent()
                    .get(0)
                    .className.match(/cm-combinations(-[\w]+)?/gi),
                p_elm = jelm.prop("id") ? jelm : jelm.parent(),
                class_group = s[0].replace(/cm-combinations/, ""),
                id_group = p_elm.prop("id").replace(/on_|off_|sw_/, "");
              return (
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "#on_" + id_group
                ).toggle(),
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "#off_" + id_group
                ).toggle(),
                0 == p_elm.prop("id").indexOf("sw_")
                  ? jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                      '[data-ca-switch-id="' + id_group + '"]'
                    ).toggle()
                  : 0 == p_elm.prop("id").indexOf("on_")
                  ? jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                      ".cm-combination" + class_group + ':visible[id^="on_"]'
                    ).click()
                  : jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                      ".cm-combination" + class_group + ':visible[id^="off_"]'
                    ).click(),
                !0
              );
            }
            if (
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.matchClass(
                elm,
                /cm-combination(-[\w]+)?/gi
              ) ||
              jelm.parents(".cm-combination").length
            ) {
              var p_elm = jelm.parents(".cm-combination").length
                  ? jelm.parents(".cm-combination:first")
                  : jelm.prop("id")
                  ? jelm
                  : jelm.parent(),
                id,
                prefix;
              p_elm.prop("id") &&
                ((prefix = p_elm.prop("id").match(/^(on_|off_|sw_)/)[0] || ""),
                (id = p_elm.prop("id").replace(/^(on_|off_|sw_)/, "")));
              var container = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "#" + id
                ),
                flag =
                  "on_" != prefix &&
                  ("off_" == prefix || !!container.is(":visible"));
              p_elm.hasClass("cm-uncheck") &&
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "#" + id + " [type=checkbox]"
                ).prop("disabled", flag),
                container.removeClass("hidden"),
                container.toggleBy(flag),
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
                  "trigger",
                  "ce.switch_" + id,
                  [flag]
                ),
                p_elm.trigger("ce:combination:switch", [container, flag]),
                container.is(".cm-smart-position:visible") &&
                  container.position({
                    my: "right top",
                    at: "right top",
                    of: p_elm,
                  });
              var s_elm = jelm.hasClass("cm-save-state")
                ? jelm
                : !!p_elm.hasClass("cm-save-state") && p_elm;
              if (s_elm) {
                var _s = s_elm.hasClass("cm-ss-reverse")
                  ? ":hidden"
                  : ":visible";
                container.is(_s)
                  ? jquery__WEBPACK_IMPORTED_MODULE_1___default.a.cookie.set(
                      id,
                      1
                    )
                  : jquery__WEBPACK_IMPORTED_MODULE_1___default.a.cookie.remove(
                      id
                    );
              }
              if (
                ("sw_" == prefix &&
                  (p_elm.hasClass("open")
                    ? p_elm.removeClass("open")
                    : p_elm.hasClass("open") || p_elm.addClass("open")),
                jquery__WEBPACK_IMPORTED_MODULE_1___default()("#on_" + id)
                  .removeClass("hidden")
                  .toggleBy(!flag),
                jquery__WEBPACK_IMPORTED_MODULE_1___default()("#off_" + id)
                  .removeClass("hidden")
                  .toggleBy(flag),
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceDialog(
                  "fit_elements",
                  { container: container, jelm: jelm }
                ),
                !jelm.is("[type=checkbox]"))
              )
                return !1;
            } else {
              if (
                (jelm.is(":not(:focusable)") || jelm.is("label")) &&
                (jelm.hasClass("cm-click-on-visible") ||
                  jelm.parents(".cm-click-on-visible").length)
              ) {
                var _data =
                    jelm.parents(".cm-click-on-visible:first").data() ||
                    jelm.data(),
                  clickAt = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    _.body
                  );
                return (
                  (clickAt =
                    void 0 != _data.caSearchInner
                      ? jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                          _data.caSearchInnerContainer
                        ).find("".concat(_data.caTarget, ":visible"))
                      : jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                          "".concat(_data.caTarget, ":visible")
                        )),
                  clickAt.click(),
                  !1
                );
              }
              if (
                (jelm.is("a.cm-increase, a.cm-decrease") ||
                  jelm.parents("a.cm-increase").length ||
                  jelm.parents("a.cm-decrease").length) &&
                jelm.parents(".cm-value-changer").length
              ) {
                var inp = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    "input",
                    jelm.closest(".cm-value-changer")
                  ),
                  step = 1,
                  min_qty = 0,
                  currentValue = inp.val();
                inp.attr("data-ca-step") &&
                  (step = parseInt(inp.attr("data-ca-step"))),
                  inp.data("caMinQty") &&
                    (min_qty = parseInt(inp.data("caMinQty")));
                var new_val =
                    parseInt(inp.val()) +
                    (jelm.is("a.cm-increase") ||
                    jelm.parents("a.cm-increase").length
                      ? step
                      : -step),
                  newValue = new_val > min_qty ? new_val : min_qty;
                inp.val(newValue),
                  inp.keypress(),
                  currentValue != newValue && inp.trigger("change");
                var trigger_name = "ce.valuechangerincrease",
                  trigger_params = [inp, step, min_qty, new_val];
                return (
                  jelm.is("a.cm-decrease") &&
                    (trigger_name = "ce.valuechangerdecrease"),
                  jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
                    "trigger",
                    trigger_name,
                    trigger_params
                  ),
                  !0
                );
              }
              if (
                jelm.hasClass("cm-external-focus") ||
                jelm.parents(".cm-external-focus").length
              ) {
                var f_elm = jelm.data("caExternalFocusId")
                  ? jelm.data("caExternalFocusId")
                  : jelm
                      .parents(".cm-external-focus:first")
                      .data("caExternalFocusId");
                f_elm &&
                  jquery__WEBPACK_IMPORTED_MODULE_1___default()("#" + f_elm)
                    .length &&
                  jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    "#" + f_elm
                  ).focus();
              } else {
                if (
                  jelm.hasClass("cm-previewer") ||
                  jelm.parent().hasClass("cm-previewer")
                ) {
                  var lnk = jelm.hasClass("cm-previewer")
                    ? jelm
                    : jelm.parent();
                  return lnk.cePreviewer("display"), !1;
                }
                if (jelm.hasClass("cm-update-for-all-icon")) {
                  var object_ids = jelm.data("caDisableId"),
                    disable = jelm.hasClass("visible");
                  if (
                    (jelm.toggleClass("visible"),
                    jelm.prop(
                      "title",
                      jelm.data("caTitle" + (disable ? "Disabled" : "Active"))
                    ),
                    jquery__WEBPACK_IMPORTED_MODULE_1___default.a.isArray(
                      object_ids
                    ) || (object_ids = [object_ids]),
                    object_ids.forEach(function (e) {
                      jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                        "#hidden_update_all_vendors_" + e
                      ).prop("disabled", disable);
                    }),
                    jelm.data("caHideId"))
                  ) {
                    var parent_elm =
                      jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                        "#container_" + jelm.data("caHideId")
                      );
                    parent_elm.find(":input:visible").prop("disabled", disable),
                      parent_elm
                        .find(":input[type=hidden]")
                        .prop("disabled", disable),
                      parent_elm
                        .find("textarea.cm-wysiwyg")
                        .ceEditor("disable", disable),
                      parent_elm
                        .find(".cm-switch-checkbox")
                        .ceSwitchCheckbox("setActive", !disable);
                  }
                  var state_select_trigger =
                    jquery__WEBPACK_IMPORTED_MODULE_1___default()(".cm-state")
                      .parent()
                      .find(".cm-update-for-all-icon");
                  jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    "#" + jelm.data("caHideId")
                  ).hasClass("cm-country") &&
                    jelm.hasClass("visible") !=
                      state_select_trigger.hasClass("visible") &&
                    state_select_trigger.click();
                  var country_select_trigger =
                    jquery__WEBPACK_IMPORTED_MODULE_1___default()(".cm-country")
                      .parent()
                      .find(".cm-update-for-all-icon");
                  jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    "#" + jelm.data("caHideId")
                  ).hasClass("cm-state") &&
                    jelm.hasClass("visible") !=
                      country_select_trigger.hasClass("visible") &&
                    country_select_trigger.click();
                } else {
                  if (
                    (jelm.hasClass("cm-toggle-checked") ||
                      jelm.parents(".cm-toggle-checked").length) &&
                    !jelm.is('input[type="checkbox"]') &&
                    !jelm.is('input[type="radio"]')
                  ) {
                    var $target = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                      jelm.data("caTarget") ||
                        jelm
                          .parents(".cm-toggle-checked:first")
                          .data("caTarget")
                    );
                    return toggleCheckbox($target), !1;
                  }
                  if (jelm.hasClass("cm-toggle-checkbox"))
                    jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                      ".cm-toggle-element"
                    ).prop(
                      "disabled",
                      !jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                        ".cm-toggle-checkbox"
                      ).prop("checked")
                    );
                  else if (
                    jelm.hasClass("cm-back-link") ||
                    jelm.parents(".cm-back-link").length
                  )
                    parent.history.back();
                  else if (jelm.closest(".cm-post").length) {
                    var _elm = jelm.closest(".cm-post");
                    if (!_elm.hasClass("cm-ajax")) {
                      var href = _elm.prop("href"),
                        target = _elm.prop("target") || "";
                      return (
                        jquery__WEBPACK_IMPORTED_MODULE_1___default.a.performPostRequest(
                          href,
                          [],
                          target
                        ),
                        !1
                      );
                    }
                  }
                }
              }
            }
          }
          if (
            (jelm.closest(".cm-dialog-closer").length &&
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a
                .ceDialog("get_last")
                .ceDialog("close"),
            jelm.hasClass("cm-instant-upload"))
          ) {
            var href = jelm.data("caHref"),
              result_ids = jelm.data("caTargetId") || "",
              placeholder = jelm.data("caPlaceholder") || "",
              form_elm = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                '<form class="cm-ajax hidden" name="instant_upload_form" action="' +
                  href +
                  '" method="post" enctype="multipart/form-data"><input type="hidden" name="result_ids" value="' +
                  result_ids +
                  '"><input type="file" name="upload" value=""><input type="submit1"></form>'
              ),
              clicked_elm = form_elm.find("input[type=submit1]"),
              file_elm = form_elm.find("input[type=file]");
            file_elm.on("change", function () {
              clicked_elm.click();
            }),
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
                "one",
                "ce.formajaxpost_instant_upload_form",
                function (e, t) {
                  if (e.placeholder) {
                    var a = new Date().getTime() / 1e3;
                    jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                      "#" + placeholder
                    ).prop("src", e.placeholder + "?" + a);
                  }
                  t.form.remove();
                }
              ),
              form_elm.ceFormValidator(),
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(_.body).append(
                form_elm
              ),
              file_elm.click();
          }
          if (jelm.is("a") || jelm.parents("a").length) {
            var _lnk = jelm.is("a") ? jelm : jelm.parents("a:first");
            if (
              (jquery__WEBPACK_IMPORTED_MODULE_1___default.a.showPickerByAnchor(
                _lnk.prop("href")
              ),
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.browser.msie &&
                _lnk.prop("href") &&
                -1 != _lnk.prop("href").indexOf("window.open"))
            )
              return eval(_lnk.prop("href")), !1;
            if (
              jquery__WEBPACK_IMPORTED_MODULE_1___default()("base").length &&
              _lnk.attr("href") &&
              0 == _lnk.attr("href").indexOf("#")
            ) {
              var anchor_name = _lnk
                  .attr("href")
                  .substr(1, _lnk.attr("href").length),
                url = window.location.href;
              return (
                -1 != url.indexOf("#") &&
                  (url = url.substr(0, url.indexOf("#"))),
                (url += "#" + anchor_name),
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a.redirect(url),
                !1
              );
            }
          }
          if (_.embedded && (jelm.is("a") || jelm.closest("a").length)) {
            var _elm = jelm.is("a") ? jelm : jelm.closest("a");
            if (
              _elm.prop("href") &&
              "_blank" != _elm.prop("target") &&
              -1 == _elm.prop("href").search(/javascript:/i)
            ) {
              if (
                !_elm.hasClass("cm-no-ajax") &&
                !jquery__WEBPACK_IMPORTED_MODULE_1___default.a.externalLink(
                  fn_url(_elm.prop("href"))
                )
              )
                return (
                  _elm.data("caScroll") || _elm.data("caScroll", _.container),
                  jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ajaxLink(
                    e,
                    _.container
                  )
                );
              _elm.prop("target", "_parent");
            }
          }
        } else {
          if ("keydown" == e.type) {
            var char_code = e.which ? e.which : e.keyCode;
            if (27 == char_code) {
              var comet_controller =
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "#comet_container_controller"
                );
              if (
                comet_controller.length &&
                0 != comet_controller.ceProgress("getValue") &&
                100 != comet_controller.ceProgress("getValue")
              )
                return !1;
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.popupStack.last_close();
              var _notification_container =
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  ".cm-notification-content-extended:visible"
                );
              _notification_container.length &&
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceNotification(
                  "close",
                  _notification_container,
                  !1
                );
            }
            if ("A" === _.area && e.ctrlKey && 222 === char_code) {
              var productId = prompt("Product ID", "");
              productId &&
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a.redirect(
                  fn_url("products.update?product_id=" + productId)
                );
            }
            return !0;
          }
          if ("mousedown" == e.type) {
            if (
              jelm.hasClass("cm-disabled") ||
              jelm.parents(".cm-disabled").length
            )
              return !1;
            if (jelm.hasClass("cm-select-option")) {
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                ".cm-popup-box"
              ).removeClass("open");
              var upd_elm = jelm.parents(".cm-popup-box:first");
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                "a:first",
                upd_elm
              ).html(jelm.text() + ' <span class="caret"></span>'),
                jquery__WEBPACK_IMPORTED_MODULE_1___default()("li a", upd_elm)
                  .removeClass("active")
                  .addClass("cm-select-option"),
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "li",
                  upd_elm
                ).removeClass("disabled"),
                jelm.removeClass("cm-select-option").addClass("active"),
                jelm.parents("li:first").addClass("disabled"),
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "input",
                  upd_elm
                ).val(jelm.data("caListItem"));
            }
            var popups = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              ".cm-popup-box:visible"
            );
            if (popups.length) {
              var zindex =
                  jquery__WEBPACK_IMPORTED_MODULE_1___default.a.isNumeric(
                    jelm.css("z-index")
                  )
                    ? jelm.css("z-index")
                    : 0,
                foundz = 0;
              0 === zindex &&
                (jelm.parents().each(function () {
                  var e = jquery__WEBPACK_IMPORTED_MODULE_1___default()(this),
                    t = jquery__WEBPACK_IMPORTED_MODULE_1___default.a.isNumeric(
                      e.css("z-index")
                    )
                      ? e.css("z-index")
                      : 0;
                  0 === foundz && 0 !== t && (foundz = t);
                }),
                (zindex = foundz)),
                popups.each(function () {
                  var e = jquery__WEBPACK_IMPORTED_MODULE_1___default()(this);
                  if (
                    (jquery__WEBPACK_IMPORTED_MODULE_1___default.a.isNumeric(
                      e.css("z-index")
                    )
                      ? e.css("z-index")
                      : 0) > zindex &&
                    !e.has(jelm).length
                  ) {
                    if (e.prop("id")) {
                      var t = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                        "#sw_" + e.prop("id")
                      );
                      if (t.length)
                        return jelm.closest(t).length || t.click(), !0;
                    }
                    e.hide();
                  }
                });
            }
            return !0;
          }
          if ("keyup" == e.type) {
            var elm_val = jelm.val(),
              negative_expr = new RegExp("^-.*", "i");
            if (jelm.hasClass("cm-value-integer")) {
              var new_val = elm_val.replace(/[^\d]+/, "");
              elm_val != new_val && jelm.val(new_val);
            } else if (jelm.hasClass("cm-value-decimal")) {
              var is_negative = negative_expr.test(elm_val),
                new_val = elm_val.replace(/[^.0-9]+/g, "");
              (new_val = new_val.replace(/([0-9]+[.]?[0-9]*).*$/g, "$1")),
                elm_val != new_val && jelm.val(new_val);
            }
            if (jelm.hasClass("cm-ajax-content-input")) {
              if (39 == e.which || 37 == e.which) return;
              var delay = 500;
              void 0 !== this.to && clearTimeout(this.to),
                (this.to = setTimeout(function () {
                  jquery__WEBPACK_IMPORTED_MODULE_1___default.a.loadAjaxContent(
                    jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                      "#" + jelm.data("caTargetId")
                    ),
                    jelm.val().trim()
                  );
                }, delay));
            }
            return !0;
          }
          if ("change" == e.type) {
            if (
              jelm.hasClass("cm-amount") &&
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.is.blank(jelm.val())
            ) {
              var _jelm$data = jelm.data(),
                caMinQty = _jelm$data.caMinQty;
              jelm.val(caMinQty || 0);
            }
            if (jelm.hasClass("cm-select-with-input-key")) {
              var value = jelm.val(),
                assoc_input = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "#" + jelm.prop("id").replace("_select", "")
                );
              assoc_input.prop("value", value),
                assoc_input.prop("disabled", "" != value),
                "" == value
                  ? assoc_input.removeClass("input-text-disabled")
                  : assoc_input.addClass("input-text-disabled");
            }
            if (
              (jelm.hasClass("cm-reload-form") && fn_reload_form(jelm),
              jelm.hasClass("cm-submit1") &&
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a.submit1Form(jelm),
              jelm.hasClass("cm-bs-trigger"))
            ) {
              var container = jelm.closest(".cm-bs-container"),
                block = container.find(".cm-bs-block"),
                group = jelm.closest(".cm-bs-group"),
                other_blocks = group.find(".cm-bs-block").not(block);
              block.switchAvailability(!jelm.prop("checked"), !1),
                block.find(".cm-bs-off").hide(),
                other_blocks.switchAvailability(jelm.prop("checked"), !1),
                other_blocks.find(".cm-bs-off").show();
            }
            if (jelm.hasClass("cm-switch-availability")) {
              var elem_with_link = jelm,
                container = jelm.closest(".cm-switch-availability-container"),
                container_exist = 0 !== container.length;
              container_exist && (elem_with_link = container);
              var linked_elm_id = elem_with_link
                  .prop("id")
                  .replace("sw_", "")
                  .replace(/_suffix.*/, ""),
                state,
                hide_flag = !1;
              jelm.hasClass("cm-switch-visibility") && (hide_flag = !0),
                jelm.is("[type=checkbox],[type=radio]")
                  ? ((state = jelm.hasClass("cm-switch-inverse")
                      ? jelm.prop("checked")
                      : !jelm.prop("checked")),
                    container_exist &&
                      (state = container.hasClass("cm-switch-inverse")
                        ? 0 ===
                          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                            container
                          )
                            .find("[type=checkbox]:checked")
                            .not("#" + linked_elm_id + " :input").length
                        : 0 !==
                          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                            container
                          )
                            .find("[type=checkbox]:checked")
                            .not("#" + linked_elm_id + " :input").length))
                  : jelm.hasClass("cm-switched")
                  ? (jelm.removeClass("cm-switched"), (state = !0))
                  : (jelm.addClass("cm-switched"), (state = !1)),
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "#" + linked_elm_id
                ).switchAvailability(state, hide_flag),
                jelm.is("[type=checkbox],[type=radio]") &&
                  jquery__WEBPACK_IMPORTED_MODULE_1___default.a
                    .ceDialog("get_last")
                    .ceDialog("resize");
            }
            if (
              jelm.hasClass("cm-enable-class") ||
              jelm.hasClass("cm-disable-class")
            ) {
              var _jelm$data2 = jelm.data(),
                caDisableClassName = _jelm$data2.caDisableClassName,
                caDisableClassTarget = _jelm$data2.caDisableClassTarget,
                caEnableClassName = _jelm$data2.caEnableClassName,
                caEnableClassTarget = _jelm$data2.caEnableClassTarget;
              caDisableClassName
                ? jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    caDisableClassTarget
                  ).removeClass(caDisableClassName)
                : caEnableClassName &&
                  jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    caEnableClassTarget
                  ).addClass(caEnableClassName);
            }
            if (jelm.hasClass("cm-combo-checkbox")) {
              var combo_block = jelm.parents(".control-group:first"),
                combo_select = combo_block
                  .next(".control-group")
                  .find("select.cm-combo-select:first"),
                current_val = combo_select.val();
              if (combo_select.length) {
                var options = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    ".cm-combo-checkbox:checked",
                    combo_block
                  ),
                  _options = "";
                0 === options.length
                  ? (_options +=
                      '<option value="' +
                      jelm.val() +
                      '">' +
                      jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                        "label[for=" + jelm.prop("id") + "]"
                      ).text() +
                      "</option>")
                  : jquery__WEBPACK_IMPORTED_MODULE_1___default.a.each(
                      options,
                      function () {
                        var e =
                            jquery__WEBPACK_IMPORTED_MODULE_1___default()(this),
                          t = e.val(),
                          a = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                            "label[for=" + e.prop("id") + "]"
                          ).text();
                        _options +=
                          '<option value="' +
                          t +
                          '"' +
                          (t == current_val ? ' selected="selected"' : "") +
                          ">" +
                          a +
                          "</option>";
                      }
                    ),
                  combo_select.html(_options);
              }
            }
          }
        }
      },
      runCart = function (e) {
        (_.area = e),
          _.body || (_.body = document.body),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            "<style>.cm-noscript {display:none}</style>"
          ).appendTo("head"),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(_.doc).on(
            "click mousedown keyup keydown change",
            function (e) {
              return jquery__WEBPACK_IMPORTED_MODULE_1___default.a.dispatchEvent(
                e
              );
            }
          ),
          "A" == e &&
            (-1 !== location.href.indexOf("?") ||
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a.rc64_helper(
                  "Lm9uZS1waXhlbC1iYWNrZ3JvdW5k"
                )
              ).length ||
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                ".admin-content-wrapper",
                _.body
              ).after(jquery__WEBPACK_IMPORTED_MODULE_1___default.a.rc64()),
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              ".cm-popover"
            ).popover({ html: !0 })),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()("#push").length > 0 &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.stickyFooter(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-sticky-scroll"
          ).ceStickyScroll(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(_.doc).on(
            "mouseover",
            '.cm-tooltip[title]:not([title=""]):not([title=" "]):not([title="\t"])',
            function () {
              var e = jquery__WEBPACK_IMPORTED_MODULE_1___default()(this);
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.trim(
                e.attr("title")
              ) &&
                (e.data("tooltip") || e.ceTooltip(), e.data("tooltip").show());
            }
          );
        var t = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
          ".cm-dialog-auto-open"
        );
        return (
          t.ceDialog(
            "open",
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceDialog(
              "get_params",
              t
            )
          ),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceNotification("init"),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.showPickerByAnchor(
            location.href
          ),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(window).on(
            "load",
            function () {
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.afterLoad(e),
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceLazyLoader(
                  "init"
                );
            }
          ),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(window).on(
            "beforeunload",
            function (e) {
              var t =
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a
                  .lastClickedElement;
              if (
                "Y" == _.changes_warning &&
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "form.cm-check-changes"
                ).formIsChanged() &&
                (null === t ||
                  (t &&
                    !t.is("[type=submit1]") &&
                    !t.is("input[type=image]") &&
                    !t.hasClass("cm-submit1") &&
                    !t.parents().hasClass("cm-submit1") &&
                    !t.hasClass("cm-confirm") &&
                    !t.parents().hasClass("cm-confirm")))
              )
                return _.tr("text_changes_not_saved");
            }
          ),
          window.performance &&
            2 === window.performance.navigation.type &&
            window.location.reload(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceHistory("init"),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.commonInit(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.widget(
            "ui.dialog",
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ui.dialog,
            {
              _moveToTop: function (e, t) {
                var a = !!this.uiDialog
                  .nextAll(":visible:not(.tooltip)")
                  .insertBefore(this.uiDialog).length;
                return a && !t && this._trigger("focus", e), a;
              },
              _allowInteraction: function (e) {
                return jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  e.target
                ).closest(".editable-input").length
                  ? !!jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                      e.target
                    ).closest(".editable-input").length || this._super(e)
                  : !!jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                      e.target
                    ).is(".select2-search__field") || this._super(e);
              },
              _focusTabbable: function () {
                this.options.delayFocusTabbable
                  ? setTimeout(
                      this._super.bind(this),
                      this.options.delayFocusTabbable
                    )
                  : this._super();
              },
            }
          ),
          "undefined" == typeof Modernizr ||
            0 != Modernizr.cookies ||
            _.embedded ||
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceNotification(
              "show",
              { title: _.tr("warning"), message: _.tr("cookie_is_disabled") }
            ),
          "A" == _.area &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(this).find(
              "[data-ca-notifications-center-root]"
            ).length &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.getScript(
              "js/tygh/notifications_center.js",
              function () {
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  ".notifications-center__opener-wrapper"
                ).hasClass("open") &&
                  jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
                    "trigger",
                    "ce.notifications_center.enabled"
                  );
              }
            ),
          !0
        );
      },
      commonInit = function (e) {
        e = jquery__WEBPACK_IMPORTED_MODULE_1___default()(e || _.doc);
        var t = jquery__WEBPACK_IMPORTED_MODULE_1___default()("body"),
          a = jquery__WEBPACK_IMPORTED_MODULE_1___default()("html");
        if (
          "ontouchstart" in window ||
          (window.DocumentTouch && document instanceof DocumentTouch) ||
          navigator.userAgent.match(/IEMobile/i)
        ) {
          t.on("mousemove touchstart", function e(i) {
            "mousemove" === i.type
              ? (jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "#" + _.container
                ).addClass("no-touch"),
                a.addClass("mouseevents"))
              : "touchstart" === i.type &&
                ((_.isTouch = !0),
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "#" + _.container
                ).addClass("touch")),
              t.off("mousemove touchstart", e);
          });
        } else
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            "#" + _.container
          ).addClass("no-touch"),
            a.addClass("mouseevents");
        if (
          (("A" != _.area && "C" != _.area) ||
            (jquery__WEBPACK_IMPORTED_MODULE_1___default.a.fn.autoNumeric &&
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                ".cm-numeric",
                e
              ).autoNumeric("init")),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.fn.ceTabs &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              ".cm-j-tabs",
              e
            ).ceTabs(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.fn.ceSidebar &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              ".cm-sidebar",
              e
            ).ceSidebar(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.fn
            .ceProductImageGallery &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              ".cm-image-gallery",
              e
            ).ceProductImageGallery(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.fn.ceSwitchCheckbox &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              ".cm-switch-checkbox",
              e
            ).ceSwitchCheckbox(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.fn.ceBlockLoader &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              ".cm-block-loader",
              e
            ).ceBlockLoader(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.processForms(e),
          e.closest(".cm-hide-inputs").length && e.disableFields(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-hide-inputs",
            e
          ).disableFields(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(".cm-hint", e).ceHint(
            "init"
          ),
          0 == _.isTouch &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              ".cm-focus:visible:first",
              e
            ).focus(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-autocomplete-off",
            e
          ).prop("autocomplete", "off"),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-ajax-content-more",
            e
          ).each(function () {
            var e = jquery__WEBPACK_IMPORTED_MODULE_1___default()(this);
            e.appear(
              function () {
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a.loadAjaxContent(
                  e
                );
              },
              { one: !1, container: "#scroller_" + e.data("caTargetId") }
            );
          }),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-colorpicker",
            e
          ).ceColorpicker(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-sortable",
            e
          ).ceSortable(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-table-sortable",
            e
          ).ceTableSortable(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-accordion",
            e
          ).ceAccordion(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-checkbox-group",
            e
          ).ceCheckboxGroup(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            "[data-ca-block-manager]",
            e
          ).ceBlockManager(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.fn.ceContentMore)
        ) {
          var i = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            '[data-ca-elem="contentMore"]',
            e
          );
          i.ceContentMore(),
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
              "on",
              "ce.tab.show",
              function () {
                i.ceContentMore("setVisibility");
              }
            );
        }
        if (
          (jquery__WEBPACK_IMPORTED_MODULE_1___default()("select.cm-country", e)
            .length
            ? jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                "select.cm-country",
                e
              ).ceRebuildStates()
            : jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                "select.cm-state",
                e
              ).ceRebuildStates(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(".dropdown-menu", e).on(
            "click",
            function (e) {
              var t = jquery__WEBPACK_IMPORTED_MODULE_1___default()(e.target);
              if (t.parents(".cm-dropdown-skip-processing").length)
                return e.stopPropagation(), !0;
              if (t.is("a")) {
                if (
                  !jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    "input[type=checkbox]:enabled",
                    t
                  ).length
                )
                  return (
                    !t.hasClass("cm-ajax") ||
                    (jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                      "a.dropdown-toggle",
                      t.parents(".dropdown:first")
                    ).dropdown("toggle"),
                    !0)
                  );
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "input[type=checkbox]:enabled",
                  t
                ).click();
              }
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.dispatchEvent(e),
                e.stopPropagation();
            }
          ),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(".cm-back-link").length)
        ) {
          var n = !0;
          1 == parent.history.length && (n = !1),
            n ||
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                ".cm-back-link"
              ).addClass("cm-disabled");
        }
        jquery__WEBPACK_IMPORTED_MODULE_1___default()(
          ".cm-bs-trigger[checked]",
          e
        ).change(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-object-selector",
            e
          ).ceObjectSelector(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-object-picker",
            e
          ).ceObjectPicker(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-file-uploader",
            e
          ).ceFileUploader(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-notification-receivers-editor",
            e
          ).ceNotificationReceiversEditor(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-combo-checkbox-group",
            e
          ).each(function (e, t) {
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(t)
              .find(".cm-combo-checkbox:first")
              .change();
          }),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-input-text-auto-submit1",
            e
          )
            .on("change checkvalue", function () {
              var e = jquery__WEBPACK_IMPORTED_MODULE_1___default()(this),
                t = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  e.get(0).form
                ),
                a = e.val().trim(),
                i = e.data("caLastValue"),
                n = e.attr("maxlength");
              n &&
                a.length >= n &&
                a !== i &&
                (t.ceFormValidator("setClicked", null),
                t.trigger("submit1"),
                e.data("caLastValue", a));
            })
            .on("keyup", function (e) {
              e.which <= 90 &&
                e.which >= 48 &&
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(this).trigger(
                  "checkvalue"
                );
            })
            .on("paste", function () {
              var e = jquery__WEBPACK_IMPORTED_MODULE_1___default()(this);
              setTimeout(function () {
                e.trigger("checkvalue");
              }, 100);
            }),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-inline-dialog-opener",
            e
          ).ceInlineDialog("opener"),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            ".cm-inline-dialog-closer",
            e
          ).ceInlineDialog("closer"),
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(
            "[data-ca-product-notify-stock]",
            e
          ).ceBackInStockNotificationSwitcher(),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
            "trigger",
            "ce.commoninit",
            [e]
          );
      },
      afterLoad = function (e) {
        return !0;
      },
      processForms = function (e) {
        var t = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
          "form:not(.cm-processed-form)",
          e
        );
        if (
          (t.addClass("cm-processed-form"), t.ceFormValidator(), "A" == _.area)
        ) {
          t.filter("[method=post]:not(.cm-disable-check-changes)").addClass(
            "cm-check-changes"
          );
          var a = 0 == t.length ? e : t;
        }
        jquery__WEBPACK_IMPORTED_MODULE_1___default()(
          "textarea.cm-wysiwyg",
          a
        ).appear(function () {
          jquery__WEBPACK_IMPORTED_MODULE_1___default()(this).ceEditor();
        });
      },
      formatPrice = function (e, t) {
        void 0 === t && (t = 2);
        var a = (e = parseFloat(e.toString()) + 1e-11).toFixed(t);
        return "." == a.charAt(0) ? "0" + a : a;
      },
      formatNum = function (e, t, a) {
        var i = "",
          n = "",
          o = 0,
          r = 0,
          s = 0,
          l = _.currencies,
          c =
            1 == a
              ? l.primary.thousands_separator
              : l.secondary.thousands_separator,
          d =
            1 == a
              ? l.primary.decimals_separator
              : l.secondary.decimals_separator,
          u = ((t = 1 == a ? l.primary.decimals : l.secondary.decimals), !0);
        if (((e = e.toString()), (o = parseInt(e)), t > 0)) {
          if (-1 != e.indexOf(".")) {
            var p = e.substr(e.indexOf(".") + 1, e.length);
            p.length > t
              ? ((n = Math.round(p / Math.pow(10, p.length - t)).toString())
                  .length > t && ((o = Math.floor(o) + 1), (n = "0")),
                (u = !1))
              : (n = e.substr(e.indexOf(".") + 1, t));
          } else n = "0";
          if (n.length < t) {
            var f = n.length;
            for (s = 0; s < t - f; s++) u ? (n += "0") : (n = "0" + n);
          }
        } else (e = Math.round(parseFloat(e))), (o = parseInt(e));
        if ((i = o.toString()).length >= 4 && "" != c) {
          o = new Array();
          for (
            s = i.length - 3;
            s > -4 &&
            ((r = 3),
            s < 0 && ((r = 3 + s), (s = 0)),
            o.push(i.substr(s, r)),
            0 != s);
            s -= 3
          );
          i = o.reverse().join(c);
        }
        return t > 0 && (i += d + n), i;
      },
      utf8Encode = function (e) {
        e = e.replace(/\r\n/g, "\n");
        for (var t = "", a = 0; a < e.length; a++) {
          var i = e.charCodeAt(a);
          i < 128
            ? (t += String.fromCharCode(i))
            : i > 127 && i < 2048
            ? ((t += String.fromCharCode((i >> 6) | 192)),
              (t += String.fromCharCode((63 & i) | 128)))
            : ((t += String.fromCharCode((i >> 12) | 224)),
              (t += String.fromCharCode(((i >> 6) & 63) | 128)),
              (t += String.fromCharCode((63 & i) | 128)));
        }
        return t;
      },
      crc32 = function (e) {
        e = this.utf8Encode(e);
        var t = 0,
          a = 0,
          i = 0;
        t ^= -1;
        for (var n = 0, o = e.length; n < o; n++)
          (i = 255 & (t ^ e.charCodeAt(n))),
            (a =
              "0x" +
              "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D".substr(
                9 * i,
                8
              )),
            (t = (t >>> 8) ^ parseInt(a));
        return Math.abs(-1 ^ t);
      },
      rc64_helper = function (e) {
        var t,
          a,
          i,
          n,
          o,
          r,
          s =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
          l = 0,
          c = 0,
          _ = "",
          d = [];
        do {
          (t =
            ((r =
              (s.indexOf(e.charAt(l++)) << 18) |
              (s.indexOf(e.charAt(l++)) << 12) |
              ((n = s.indexOf(e.charAt(l++))) << 6) |
              (o = s.indexOf(e.charAt(l++)))) >>
              16) &
            255),
            (a = (r >> 8) & 255),
            (i = 255 & r),
            (d[c++] =
              64 == n
                ? String.fromCharCode(t)
                : 64 == o
                ? String.fromCharCode(t, a)
                : String.fromCharCode(t, a, i));
        } while (l < e.length);
        return (
          (_ = d.join("")),
          (_ = jquery__WEBPACK_IMPORTED_MODULE_1___default.a.utf8_decode(_))
        );
      },
      utf8_decode = function (e) {
        for (var t = [], a = 0, i = 0, n = 0, o = 0, r = 0; a < e.length; )
          (n = e.charCodeAt(a)) < 128
            ? ((t[i++] = String.fromCharCode(n)), a++)
            : n > 191 && n < 224
            ? ((o = e.charCodeAt(a + 1)),
              (t[i++] = String.fromCharCode(((31 & n) << 6) | (63 & o))),
              (a += 2))
            : ((o = e.charCodeAt(a + 1)),
              (r = e.charCodeAt(a + 2)),
              (t[i++] = String.fromCharCode(
                ((15 & n) << 12) | ((63 & o) << 6) | (63 & r)
              )),
              (a += 3));
        return t.join("");
      },
      rc64 = function () {
        return jquery__WEBPACK_IMPORTED_MODULE_1___default.a.rc64_helper(
          "PGltZyBjbGFzcz0ib25lLXBpeGVsLWJhY2tncm91bmQiIHNyYz0iaHR0cHM6Ly93d3cuY3MtY2FydC5jb20vaW1hZ2VzL2JhY2tncm91bmQuZ2lmIiBoZWlnaHQ9IjEiIHdpZHRoPSIxIiBhbHQ9IiIgLz4="
        );
      },
      toggleStatusBox = function (e, t) {
        var a =
          jquery__WEBPACK_IMPORTED_MODULE_1___default()("#ajax_loading_box");
        if (
          ((e = e || "show"),
          (t = t || {}),
          a.data("default_class") ||
            a.data("default_class", a.prop("statusClass")),
          "show" == e)
        ) {
          t.statusContent && a.html(t.statusContent),
            t.statusClass && a.addClass(t.statusClass),
            t.overlay &&
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(t.overlay)
                .addClass("cm-overlay")
                .css("opacity", "0.4"),
            a.show();
          var i = !0;
          void 0 !== t.show_overlay && (i = t.show_overlay),
            i &&
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                "#ajax_overlay"
              ).show(),
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
              "trigger",
              "ce.loadershow",
              [a, t]
            );
        } else
          a.hide(),
            a.empty(),
            a.prop("class", a.data("default_class")),
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              "#ajax_overlay"
            ).hide(),
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(".cm-overlay")
              .removeClass("cm-overlay")
              .css("opacity", "1"),
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
              "trigger",
              "ce.loaderhide",
              [a, t]
            );
      },
      scrollToElm = function (e, t, a) {
        if (
          ((t = t || void 0),
          (a = a || {}),
          "string" == typeof e &&
            (e.length &&
              "." !== e.charAt(0) &&
              "#" !== e.charAt(0) &&
              (e = "#" + e),
            (e = jquery__WEBPACK_IMPORTED_MODULE_1___default()(e, t))),
          !(
            e instanceof jquery__WEBPACK_IMPORTED_MODULE_1___default.a &&
            e.length
          ))
        ) {
          if (
            !(
              t instanceof jquery__WEBPACK_IMPORTED_MODULE_1___default.a &&
              t.length
            )
          )
            return;
          e = t;
        }
        var i,
          n =
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(_.body).data(
              "caScrollToElmDelay"
            ) ||
            a.delay ||
            500,
          o =
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(_.body).data(
              "caScrollToElmOffset"
            ) ||
            a.offset ||
            0;
        e.is(":hidden") && (e = e.parent());
        var r = e.offset().top;
        (_.scrolling = !0),
          !jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceDialog(
            "inside_dialog",
            { jelm: e }
          ) ||
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a
            .ceDialog("get_last")
            .data("caDialogAutoHeight")
            ? ((i = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                jquery__WEBPACK_IMPORTED_MODULE_1___default.a.browser.opera
                  ? "html"
                  : "html,body"
              )),
              (r -= o))
            : ((i = jquery__WEBPACK_IMPORTED_MODULE_1___default.a
                .ceDialog("get_last")
                .find(".object-container")),
              (e = jquery__WEBPACK_IMPORTED_MODULE_1___default.a
                .ceDialog("get_last")
                .find(e)),
              i.length &&
                e.length &&
                (r =
                  (r = e.offset().top) < 0
                    ? i.scrollTop() - Math.abs(r) - i.offset().top - o
                    : i.scrollTop() + Math.abs(r) - i.offset().top - o)),
          "-ms-user-select" in document.documentElement.style &&
          navigator.userAgent.match(/IEMobile\/10\.0/)
            ? (setTimeout(function () {
                jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                  "html, body"
                ).scrollTop(r);
              }, 300),
              (_.scrolling = !1))
            : jquery__WEBPACK_IMPORTED_MODULE_1___default()(i).animate(
                { scrollTop: r },
                n,
                function () {
                  _.scrolling = !1;
                }
              ),
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
            "trigger",
            "ce.scrolltoelm",
            [e]
          );
      },
      stickyFooter = function () {
        var e =
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              "#tygh_footer"
            ).height(),
          t = jquery__WEBPACK_IMPORTED_MODULE_1___default()("#tygh_wrap"),
          a = jquery__WEBPACK_IMPORTED_MODULE_1___default()("#push");
        t.css({ "margin-bottom": -e }), a.css({ height: e });
      },
      showPickerByAnchor = function (e) {
        if (e && "#" != e && -1 != e.indexOf("#")) {
          var t = e.split("#");
          /^[a-z0-9_]+$/.test(t[1]) &&
            jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              "#opener_" + t[1]
            ).click();
        }
      },
      ltrim = function (e, t) {
        t = t ? t.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "$1") : " s ";
        var a = new RegExp("^[" + t + "]+", "g");
        return e.replace(a, "");
      },
      rtrim = function (e, t) {
        t = t ? t.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "$1") : " s ";
        var a = new RegExp("[" + t + "]+$", "g");
        return e.replace(a, "");
      },
      loadCss = function (e, t, a) {
        a = void 0 !== a;
        var i,
          n = document.getElementsByTagName("head")[0];
        (t = t || !1) &&
          jquery__WEBPACK_IMPORTED_MODULE_1___default.a.toggleStatusBox("show");
        for (var o = 0; o < e.length; o++)
          ((i = document.createElement("link")).type = "text/css"),
            (i.rel = "stylesheet"),
            (i.href =
              -1 == e[o].indexOf("://")
                ? _.current_location + "/" + e[o]
                : e[o]),
            (i.media = "screen"),
            a
              ? jquery__WEBPACK_IMPORTED_MODULE_1___default()(n).prepend(i)
              : jquery__WEBPACK_IMPORTED_MODULE_1___default()(n).append(i),
            t &&
              jquery__WEBPACK_IMPORTED_MODULE_1___default()(i).on(
                "load",
                function () {
                  jquery__WEBPACK_IMPORTED_MODULE_1___default.a.toggleStatusBox(
                    "hide"
                  );
                }
              );
      },
      loadAjaxContent = function (e, t) {
        var a = e.data("caTargetId"),
          i = jquery__WEBPACK_IMPORTED_MODULE_1___default()("#" + a);
        if (i.data("ajax_content")) {
          var n = i.data("ajax_content");
          void 0 !== t
            ? ((n.pattern = t), (n.start = 0))
            : (n.start += n.limit),
            i.data("ajax_content", n);
        } else i.data("ajax_content", { start: 0, limit: 6 });
        jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceAjax(
          "request",
          e.data("caTargetUrl"),
          {
            full_render: e.hasClass("cm-ajax-full-render"),
            result_ids: a,
            data: i.data("ajax_content"),
            caching: !0,
            hidden: !0,
            append: 0 != i.data("ajax_content").start,
            callback: function (t) {
              var i = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                "a[data-ca-action]",
                jquery__WEBPACK_IMPORTED_MODULE_1___default()("#" + a)
              );
              "href" == t.action && 0 != i.length
                ? i.each(function () {
                    var e = jquery__WEBPACK_IMPORTED_MODULE_1___default()(this);
                    if ("" == e.data("caAction") && "0" != e.data("caAction"))
                      return !0;
                    var t = fn_query_remove(_.current_url, [
                      "switch_company_id",
                      "meta_redirect_url",
                    ]);
                    t.indexOf("#") > 0 && (t = t.substr(0, t.indexOf("#"))),
                      e.prop(
                        "href",
                        jquery__WEBPACK_IMPORTED_MODULE_1___default.a.attachToUrl(
                          t,
                          "switch_company_id=" + e.data("caAction")
                        )
                      ),
                      e.data("caAction", "");
                  })
                : (jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    "#" + a + " .divider"
                  ).remove(),
                  jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                    "a[data-ca-action]",
                    jquery__WEBPACK_IMPORTED_MODULE_1___default()("#" + a)
                  ).each(function () {
                    var t = jquery__WEBPACK_IMPORTED_MODULE_1___default()(this);
                    t.on("click", function () {
                      jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                        "#" + e.data("caResultId")
                      )
                        .val(t.data("caAction"))
                        .trigger("change"),
                        jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                          "#" + e.data("caResultId") + "_name"
                        ).val(t.text()),
                        jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                          "#sw_" + a + "_wrap_"
                        ).html(t.html()),
                        jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceEvent(
                          "trigger",
                          "ce.picker_js_action_" + a,
                          [e]
                        ),
                        "C" == _.area && t.addClass("cm-popup-switch");
                    });
                  })),
                e.toggle(!t.completed);
            },
          }
        );
      },
      ajaxLink = function (e, t, a) {
        var i = jquery__WEBPACK_IMPORTED_MODULE_1___default()(e.target),
          n = i.is("a") ? i : i.parents("a").eq(0),
          o = n.data("caTargetId"),
          r = n.prop("href");
        if (r) {
          var s = n.hasClass("cm-ajax-cache"),
            l = n.hasClass("cm-ajax-force"),
            c = n.hasClass("cm-ajax-full-render"),
            _ = n.hasClass("cm-history"),
            d = n.hasClass("cm-ajax-send-form"),
            u = "";
          n.data("caEventName")
            ? (u = "ce.ajaxlink.done." + n.data("caEventName"))
            : n.data("caEvent") && (u = n.data("caEvent"));
          var p = {
            method: n.hasClass("cm-post") ? "post" : "get",
            result_ids: t || o,
            force_exec: l,
            caching: s,
            save_history: _,
            obj: n,
            scroll: n.data("caScroll"),
            overlay: n.data("caOverlay"),
            callback: a || u,
          };
          d &&
            (p.data = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              n.data("caTargetForm")
            ).serializeObject()),
            c && (p.full_render = c),
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.ceAjax(
              "request",
              fn_url(r),
              p
            );
        }
        return e.preventDefault(), !0;
      },
      isJson = function (e) {
        return (
          "" != jquery__WEBPACK_IMPORTED_MODULE_1___default.a.trim(e) &&
          ((e = e.replace(/\\./g, "@").replace(/"[^"\\\n\r]*"/g, "")),
          /^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(e))
        );
      },
      isMobile = function () {
        return (
          "iPad" == navigator.platform ||
          "iPhone" == navigator.platform ||
          "iPod" == navigator.platform ||
          navigator.userAgent.match(/Android/i)
        );
      },
      isUndefined = function (e) {
        return (
          "undefined" ===
          Object(
            _tmp_ipac_builder_CsCartMultivendor_164479_802_repo_js_core_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__.a
          )(e)
        );
      },
      debounce = function (e, t) {
        var a;
        t = t || 300;
        return function () {
          clearTimeout(a);
          var i = arguments,
            n = this;
          a = setTimeout(function () {
            e.apply(n, i);
          }, t);
        };
      },
      matchScreenSize = function (e, t) {
        var a = function (e) {
          return jquery__WEBPACK_IMPORTED_MODULE_1___default()("body").hasClass(
            "screen--" + e
          );
        };
        if (
          Object(
            _tmp_ipac_builder_CsCartMultivendor_164479_802_repo_js_core_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__.a
          )(e) ==
          Object(
            _tmp_ipac_builder_CsCartMultivendor_164479_802_repo_js_core_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__.a
          )("string")
        )
          return a(e);
        if (
          Object(
            _tmp_ipac_builder_CsCartMultivendor_164479_802_repo_js_core_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__.a
          )(e) ==
          Object(
            _tmp_ipac_builder_CsCartMultivendor_164479_802_repo_js_core_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__.a
          )([])
        ) {
          var i = !1;
          return (
            e.forEach(function (e) {
              i = !0 === t ? i && a(e) : i || a(e);
            }),
            i
          );
        }
        return !1;
      },
      createPlugin = function (e, t, a, i) {
        var n = function (e) {
          return t[e]
            ? t[e].apply(this, Array.prototype.slice.call(arguments, 1))
            : "object" !==
                Object(
                  _tmp_ipac_builder_CsCartMultivendor_164479_802_repo_js_core_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__.a
                )(e) && e
            ? void jquery__WEBPACK_IMPORTED_MODULE_1___default.a.error(
                a + ": method " + e + " does not exist"
              )
            : t.init.apply(this, arguments);
        };
        i
          ? (jquery__WEBPACK_IMPORTED_MODULE_1___default.a.fn[e] = n)
          : (jquery__WEBPACK_IMPORTED_MODULE_1___default.a[e] = n);
      },
      sprintf = function (e, t, a) {
        var i = "";
        return (
          e.split(a || "?").forEach(function (e, a) {
            t[a] ? (i += e + t[a].toString()) : (i += e);
          }),
          i
        );
      },
      parseUrl = function (e) {
        for (
          var t = {
              strictMode: !1,
              key: [
                "source",
                "protocol",
                "authority",
                "userInfo",
                "user",
                "password",
                "host",
                "port",
                "relative",
                "path",
                "directory",
                "file",
                "query",
                "anchor",
              ],
              parser: {
                strict:
                  /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose:
                  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
              },
            },
            a = t.parser[t.strictMode ? "strict" : "loose"].exec(e),
            i = {},
            n = 14;
          n--;

        )
          i[t.key[n]] = a[n] || "";
        ((i.location = i.protocol + "://" + i.host + i.path),
        (i.base_dir = ""),
        i.directory) &&
          ((r = i.directory.split("/")).pop(),
          r.pop(),
          (i.base_dir = r.join("/")));
        if (((i.parsed_query = {}), i.query)) {
          var o = i.query.split("&");
          for (n = 0; n < o.length; n++) {
            var r;
            2 == (r = o[n].split("=")).length &&
              (i.parsed_query[decodeURIComponent(r[0])] = decodeURIComponent(
                r[1].replace(/\+/g, " ")
              ));
          }
        }
        return i;
      },
      attachToUrl = function (e, t) {
        return -1 == e.indexOf(t)
          ? -1 !== e.indexOf("?")
            ? e + "&" + t
            : e + "?" + t
          : e;
      },
      matchClass = function (e, t) {
        var a = jquery__WEBPACK_IMPORTED_MODULE_1___default()(e);
        if (
          "object" !==
            Object(
              _tmp_ipac_builder_CsCartMultivendor_164479_802_repo_js_core_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__.a
            )(a.prop("class")) &&
          void 0 !== a.prop("class")
        ) {
          var i = a.prop("class").match(t);
          if (i) return i;
          if (
            "object" !==
              Object(
                _tmp_ipac_builder_CsCartMultivendor_164479_802_repo_js_core_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__.a
              )(a.parent().prop("class")) &&
            void 0 !== a.parent().prop("class")
          )
            return a.parent().prop("class").match(t);
        }
      },
      getProcessItemsMeta = function (e) {
        var t = jquery__WEBPACK_IMPORTED_MODULE_1___default()(e);
        return jquery__WEBPACK_IMPORTED_MODULE_1___default.a.matchClass(
          t,
          /cm-process-items(-[\w]+)?/gi
        );
      },
      getTargetForm = function (e) {
        var t;
        jquery__WEBPACK_IMPORTED_MODULE_1___default()(e);
        return (
          e.data("caTargetForm") &&
            ((t = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              "form[name=" + e.data("caTargetForm") + "]"
            )).length ||
              (t = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
                "#" + e.data("caTargetForm")
              ))),
          (t && t.length) || (t = e.parents("form")),
          t
        );
      },
      checkSelectedItems = function (e) {
        var t,
          a,
          i,
          n = !1,
          o = jquery__WEBPACK_IMPORTED_MODULE_1___default()(e),
          r =
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.getProcessItemsMeta(
              e
            );
        if (!o.length || !r) return !0;
        for (var s = 0; s < r.length; s++)
          if (
            ((t = o.hasClass(r[s]) ? o : o.parents("." + r[s])),
            (a =
              jquery__WEBPACK_IMPORTED_MODULE_1___default.a.getTargetForm(t)),
            !(i = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              "input.cm-item" +
                r[s].str_replace("cm-process-items", "") +
                "[type=checkbox]",
              a
            )).length || i.filter(":checked").length)
          ) {
            n = !0;
            break;
          }
        if (0 == n) return fn_alert(_.tr("error_no_items_selected")), !1;
        if (
          (o.hasClass("cm-confirm") && !o.hasClass("cm-disabled")) ||
          o.parents().hasClass("cm-confirm")
        ) {
          var l,
            c = _.tr("text_are_you_sure_to_proceed");
          if (
            (o.hasClass("cm-confirm") && o.data("ca-confirm-text")
              ? (c = o.data("ca-confirm-text"))
              : (l = o
                  .parents('[class="cm-confirm"][data-ca-confirm-text]')
                  .first()).get(0) && (c = l.data("ca-confirm-text")),
            !1 === confirm(fn_strip_tags(c)))
          )
            return !1;
        }
        return !0;
      },
      submit1Form = function (e) {
        var t = e.hasClass("cm-submit1") ? e : e.parents(".cm-submit1"),
          a = jquery__WEBPACK_IMPORTED_MODULE_1___default.a.getTargetForm(t);
        if (a.length) {
          a.append(
            '<input type="submit1" class="' +
              t.prop("class") +
              '" name="' +
              t.data("caDispatch") +
              '" value="" style="display:none;" />'
          );
          var i = jquery__WEBPACK_IMPORTED_MODULE_1___default()(
              'input[name="' + t.data("caDispatch") + '"]:last',
              a
            ),
            n = ["caDispatch", "caTargetForm"];
          return (
            jquery__WEBPACK_IMPORTED_MODULE_1___default.a.each(
              e.data(),
              function (e, t) {
                0 == e.indexOf("ca") &&
                  -1 ==
                    jquery__WEBPACK_IMPORTED_MODULE_1___default.a.inArray(
                      e,
                      n
                    ) &&
                  i.data(e, t);
              }
            ),
            i.data("original_element", t),
            i.removeClass("cm-submit1"),
            i.removeClass("cm-confirm"),
            i.click(),
            !0
          );
        }
        return !1;
      },
      externalLink = function (e) {
        return -1 != e.indexOf("://") && -1 == e.indexOf(_.current_location);
      };
    function toggleCheckbox(e) {
      e.prop("checked", !e.prop("checked"));
    }
    var performPostRequest = function (e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "",
        i =
          '<input type="hidden" name="security_hash" value="' +
          _.security_hash +
          '">';
      jquery__WEBPACK_IMPORTED_MODULE_1___default.a.map(t, function (e, t) {
        i += '<input type="hidden" name="' + t + '" value="' + e + '">';
      }),
        jquery__WEBPACK_IMPORTED_MODULE_1___default()(
          '<form class="hidden" action="' +
            e +
            '" method="post" target="' +
            a +
            '">' +
            i +
            "</form>"
        )
          .appendTo(_.body)
          .submit1();
    };
  },
});
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}
(function (_, $) {
  var loadedScripts = {};
  var loadedScriptPromises = {};
  var sessionData = {};
  (function ($) {
    var REQUEST_XML = 1;
    var REQUEST_IFRAME = 2;
    var REQUEST_COMET = 3;
    var REQUEST_JSONP_POST = 5;
    var QUERIES_LIMIT = 1;
    var queryStack = [];
    var activeQueries = 0;
    var evalCache = {};
    var responseCache = {};
    var getScriptQueries = 0;
    var oldjQuery = {};
    var methods = {
      request: function request(url, params) {
        params = params || {};
        params.method = params.method || "get";
        params.data = params.data || {};
        params.message = params.message || _.tr("loading");
        params.caching = params.caching || false;
        params.hidden = params.hidden || false;
        params.repeat_on_error = params.repeat_on_error || false;
        params.force_exec = params.force_exec || false;
        params.obj = params.obj || null;
        params.append = params.append || null;
        params.scroll = params.scroll || null;
        params.overlay = params.overlay || null;
        params.original_url = _.current_url || null;
        params.get_promise = params.get_promise || null;
        if (_.embedded) {
          params.full_render = true;
        }
        if (params.full_render) {
          params.data.full_render = params.full_render;
        }
        if (
          typeof params.data.security_hash == "undefined" &&
          typeof _.security_hash != "undefined" &&
          params.method.toLowerCase() == "post"
        ) {
          params.data.security_hash = _.security_hash;
        }
        if (params.result_ids) {
          params.data.result_ids = params.result_ids;
        }
        if (params.skip_result_ids_check) {
          params.data.skip_result_ids_check = params.skip_result_ids_check;
        }
        if (activeQueries >= QUERIES_LIMIT) {
          var result = true;
          if (params.get_promise) {
            params.defered_object = methods.createDeferedObject();
            result = methods.createPromise(params.defered_object);
          }
          queryStack.unshift(function () {
            methods.request(url, params);
          });
          return result;
        }
        if (params.defered_object && params.defered_object.isAborted) {
          params.defered_object.reject({}, "abort", "abort");
          methods.executeNext();
          return false;
        }
        if (params.hidden === false) {
          $.toggleStatusBox("show", { overlay: params.overlay });
        }
        var hash = "";
        if (params.caching === true) {
          hash = $.crc32(url + $.param(params.data));
        }
        if (!hash || !responseCache[hash]) {
          var saved_data = {};
          var result_ids = params.data.result_ids
            ? params.data.result_ids.split(",")
            : [];
          if (result_ids.length > 0) {
            for (var j = 0; j < result_ids.length; j++) {
              var container = $("#" + result_ids[j]);
              var $save_fields_block = container.find(".cm-save-fields");
              if (container.hasClass("cm-save-fields")) {
                saved_data[result_ids[j]] = $(
                  ":input:visible",
                  container
                ).serializeArray();
              } else if ($save_fields_block.length) {
                saved_data[result_ids[j]] = $(
                  ":input:visible",
                  $save_fields_block
                ).serializeArray();
              }
            }
            params.saved_data = saved_data;
          }
          if (url) {
            url = fn_query_remove(url, "result_ids");
            if (url.indexOf("://") == -1) {
              url = _.current_location + "/" + url;
            }
            if (params.obj && params.obj.hasClass("cm-comet")) {
              params.url =
                url +
                "&result_ids=" +
                params.result_ids +
                "&is_ajax=" +
                REQUEST_COMET;
              return transports.iframe(null, params, { is_comet: true });
            } else {
              activeQueries++;
              var data_type =
                !$.support.cors &&
                url.indexOf("://" + window.location.hostname) == -1
                  ? "jsonp"
                  : "json";
              if (!("is_ajax" in params.data) && data_type == "json") {
                params.data.is_ajax = REQUEST_XML;
              }
              if (sessionData.name && url.indexOf(sessionData.name) == -1) {
                params.data[sessionData.name] = localStorage.getItem(
                  sessionData.name
                );
              }
              var components = $.parseUrl(url);
              if (components.anchor) {
                params.data.anchor = components.anchor;
              }
              var jqXHR = $.ajax({
                type: params.method,
                url: url,
                dataType: data_type,
                cache: true,
                data: params.data,
                xhrFields: { withCredentials: true },
                success: function success(data, textStatus) {
                  if (hash) {
                    responseCache[hash] = data;
                  }
                  _response(data, params);
                },
                error: function error(XMLHttpRequest, textStatus, errorThrown) {
                  if (textStatus === "abort") {
                    $.toggleStatusBox("hide");
                    return false;
                  }
                  if (params.repeat_on_error) {
                    params.repeat_on_error = false;
                    methods.request(url, params);
                    return false;
                  }
                  $.toggleStatusBox("hide");
                  if (params.hidden === false && errorThrown) {
                    var err_msg = _.tr("error_ajax").str_replace(
                      "[error]",
                      errorThrown
                    );
                    $.ceNotification("show", {
                      type: "E",
                      title: _.tr("error"),
                      message: err_msg,
                    });
                  }
                  if (
                    params.error_callback &&
                    typeof params.error_callback == "function"
                  ) {
                    params.error_callback(
                      XMLHttpRequest,
                      textStatus,
                      errorThrown
                    );
                  }
                },
                complete: function complete(XMLHttpRequest, textStatus) {
                  methods.executeNext();
                },
              });
              if (params.get_promise) {
                if (params.defered_object) {
                  var deferedObject = params.defered_object;
                } else {
                  var deferedObject = methods.createDeferedObject();
                }
                methods.bindXhrToDeferedObject(jqXHR, deferedObject);
                return methods.createPromise(deferedObject);
              } else {
                return jqXHR;
              }
            }
          }
        } else if (hash && responseCache[hash]) {
          var result = false;
          _response(responseCache[hash], params);
          if (params.get_promise) {
            var deferedObject = methods.createDeferedObject();
            var result = methods.createPromise(deferedObject);
            deferedObject.resolve(responseCache[hash]);
          }
          methods.executeNext();
          return result;
        }
        return false;
      },
      submit1Form: function submit1Form(form, clicked_elm) {
        if (activeQueries >= QUERIES_LIMIT) {
          queryStack.unshift(function () {
            var submit1_name = clicked_elm.attr("name"),
              submit1_value = clicked_elm.val(),
              input;
            if (submit1_name) {
              input = $("<input>", {
                type: "hidden",
                value: submit1_value,
                name: submit1_name,
              }).appendTo(form);
            }
            if (methods.submit1Form(form, clicked_elm)) {
              form.get(0).submit1();
            }
            if (input) {
              input.remove();
            }
          });
          return false;
        }
        var params = {
          form: form,
          obj: clicked_elm,
          scroll: clicked_elm.data("caScroll") || "",
          overlay: clicked_elm.data("caOverlay") || "",
          callback: "ce.formajaxpost_" + form.prop("name"),
        };
        $.ceNotification("closeAll");
        $.toggleStatusBox("show", { overlay: params.overlay });
        var options = _getOptions(form, params);
        if (options.force_exec) {
          params["force_exec"] = true;
        }
        if (sessionData.name) {
          form.append(
            '<input type="hidden" name="' +
              sessionData.name +
              '" value="' +
              localStorage.getItem(sessionData.name) +
              '">'
          );
        }
        if (options.full_render) {
          form.append('<input type="hidden" name="full_render" value="Y">');
        }
        form.append(
          '<input type="hidden" name="is_ajax" value="' +
            (options.transport == "iframe"
              ? options.is_comet
                ? REQUEST_COMET
                : REQUEST_IFRAME
              : options.transport == "jsonpPOST"
              ? REQUEST_JSONP_POST
              : REQUEST_XML) +
            '">'
        );
        return transports[options.transport](form, params, options);
      },
      inProgress: function inProgress() {
        return activeQueries !== 0;
      },
      clearCache: function clearCache() {
        responseCache = {};
        return true;
      },
      response: function response(_response2, params) {
        return _response(_response2, params);
      },
      executeNext: function executeNext() {
        activeQueries--;
        if (queryStack.length) {
          var f = queryStack.shift();
          f();
        }
      },
      createDeferedObject: function createDeferedObject() {
        var deferredObject = $.Deferred();
        deferredObject.jqXHR = null;
        deferredObject.isAborted = false;
        deferredObject.abort = function () {
          deferredObject.isAborted = true;
          if (deferredObject.jqXHR) {
            deferredObject.jqXHR.abort();
          }
        };
        return deferredObject;
      },
      bindXhrToDeferedObject: function bindXhrToDeferedObject(
        jqXHR,
        deferredObject
      ) {
        jqXHR.done(deferredObject.resolve);
        jqXHR.fail(deferredObject.reject);
        deferredObject.jqXHR = jqXHR;
      },
      createPromise: function createPromise(deferredObject) {
        var promise = deferredObject.promise();
        promise.abort = function () {
          deferredObject.abort();
        };
        return promise;
      },
    };
    var transports = {
      iframe: function iframe(form, params, options) {
        var iframe = $(
          '<iframe name="upload_iframe" src="about:blank" class="hidden"></iframe>'
        ).appendTo(_.body);
        activeQueries++;
        if (options.is_comet && $("#comet_control:visible").length === 0) {
          $("#comet_container_controller").ceProgress("init");
        }
        iframe.on("load", function () {
          var response = {};
          var self = $(this);
          if (self.contents().text() !== null) {
            eval("var response = " + self.contents().find("textarea").val());
          }
          response = response || {};
          _response(response, params);
          if (options.is_comet && jQuery.isEmptyObject(response) == false) {
            if (typeof response.comet_is_finished === "undefined") {
              response.comet_is_finished = true;
            }
            if (response.comet_is_finished) {
              $("#comet_container_controller").ceProgress("finish");
            }
            $.ceEvent("trigger", "ce.cometdone", [
              form,
              params,
              options,
              response,
            ]);
          }
          self.remove();
          activeQueries--;
          if (queryStack.length) {
            var f = queryStack.shift();
            f();
          }
        });
        if (form) {
          form.prop("target", "upload_iframe");
        } else if (params.url) {
          if (params.method == "post") {
            $(
              '<form class="hidden" action="' +
                params.url +
                '" method="post" target="upload_iframe"><input type="hidden" name="security_hash" value="' +
                _.security_hash +
                '"></form>'
            )
              .appendTo(_.body)
              .submit1();
          } else {
            iframe.prop("src", params.url);
          }
        }
        return true;
      },
      xml: function xml(form, params) {
        if (form.hasClass("cm-outside-inputs")) {
          var hash = form.serializeObject();
        } else {
          var hash = $(":input", form).serializeObject();
        }
        if (params.obj && params.obj.prop("name")) {
          hash[params.obj.prop("name")] = params.obj.val();
        }
        params["method"] = form.prop("method");
        params["data"] = hash;
        params["result_ids"] = form.data("caTargetId");
        methods.request(form.prop("action"), params);
        return false;
      },
      jsonpPOST: function jsonpPOST(form, params, options) {
        $.receiveMessage(function (e) {
          if (options.is_comet) {
            $("#comet_container_controller").ceProgress("finish");
          }
          iframe.remove();
          _response($.parseJSON(e.data), params);
          activeQueries--;
        });
        var iframe = $(
          '<iframe name="upload_iframe" src="about:blank" class="hidden"></iframe>'
        ).appendTo(_.body);
        activeQueries++;
        if (options.is_comet) {
          $("#comet_container_controller").ceProgress("init");
        }
        if (form) {
          form.prop("target", "upload_iframe");
        } else if (params.url) {
          iframe.prop("src", params.url);
        }
        return true;
      },
    };
    function _getOptions(obj, params) {
      var is_comet =
        obj.hasClass("cm-comet") ||
        (params.obj && params.obj.hasClass("cm-comet"));
      var transport = "xml";
      var uploads = is_comet;
      if (!is_comet && obj.prop("enctype") == "multipart/form-data") {
        obj.find("input[type=file]").each(function () {
          if ($(this).val()) {
            uploads = true;
          }
        });
      }
      if (
        (!$.support.cors || (_.embedded && uploads)) &&
        obj.prop("action").indexOf("//") != -1 &&
        obj.prop("action").indexOf("//" + window.location.hostname) == -1 &&
        obj.prop("method") == "post"
      ) {
        transport = "jsonpPOST";
      } else if (uploads) {
        transport = "iframe";
      }
      return {
        full_render: obj.hasClass("cm-ajax-full-render"),
        is_comet: is_comet,
        force_exec: obj.hasClass("cm-ajax-force"),
        transport: transport,
      };
    }
    function _response(response, params) {
      params = params || {};
      params.force_exec = params.force_exec || false;
      params.pre_processing = params.pre_processing || {};
      var regex_all = new RegExp(
        "<script[^>\xA7]*>([\x01-\uFFFF]*?)</script>",
        "img"
      );
      var matches = [];
      var match = "";
      var elm;
      var data = response || {};
      var inline_scripts = null;
      var scripts_to_load = [];
      var elms = [];
      var content;
      if (params.pre_processing && typeof params.pre_processing == "function") {
        params.pre_processing(data, params);
      }
      if (data.force_redirection) {
        $.toggleStatusBox("hide");
        $.redirect(data.force_redirection);
        return true;
      }
      if ($.isEmptyObject(evalCache)) {
        $("script:not([src])").each(function () {
          var self = $(this);
          evalCache[$.crc32(self.html())] = true;
        });
      }
      if (data.html) {
        for (var k in data.html) {
          elm = $("#" + k);
          if (elm.length != 1 || data.html[k] === null) {
            continue;
          }
          if (
            data.html[k].indexOf("<form") != -1 &&
            elm.parents("form").length
          ) {
            $(_.body).append(elm);
          }
          matches = data.html[k].match(regex_all);
          content = matches
            ? data.html[k].replace(regex_all, "")
            : data.html[k];
          $("textarea.cm-wysiwyg", elm).each(function () {
            $(this).ceEditor("destroy");
          });
          $.ceDialog("destroy_loaded", { content: content });
          if (params.append) {
            elm.append(content);
          } else {
            elm.html(content);
          }
          if (
            typeof params.saved_data != "undefined" &&
            typeof params.saved_data[k] != "undefined"
          ) {
            var elements = [];
            for (var i in params.saved_data[k]) {
              elements[params.saved_data[k][i]["name"]] =
                params.saved_data[k][i]["value"];
            }
            $(":input:visible", elm).each(function (id, local_elm) {
              var jelm = $(local_elm);
              if (
                typeof elements[jelm.prop("name")] != "undefined" &&
                !jelm.parents().hasClass("cm-skip-save-fields")
              ) {
                if (jelm.prop("type") == "radio") {
                  if (jelm.val() == elements[jelm.prop("name")]) {
                    jelm.prop("checked", true);
                  }
                } else {
                  jelm.val(elements[jelm.prop("name")]);
                }
                jelm.trigger("change");
              }
            });
          }
          if (elm.html().trim()) {
            elm.parents(".hidden.cm-hidden-wrapper").removeClass("hidden");
          } else {
            elm.parents(".cm-hidden-wrapper").addClass("hidden");
          }
          var all_scripts = null,
            ext_scripts = null;
          if (matches) {
            all_scripts = $(matches.join("\n"));
            ext_scripts = all_scripts.filter("[src]");
            inline_scripts = inline_scripts
              ? inline_scripts.add(all_scripts.filter(":not([src])"))
              : all_scripts.filter(":not([src])");
            if (ext_scripts.length) {
              for (var i = 0; i < ext_scripts.length; i++) {
                var _src = ext_scripts.eq(i).prop("src");
                if (loadedScripts[_src]) {
                  if (ext_scripts.eq(i).hasClass("cm-ajax-force")) {
                    loadedScripts[_src] = null;
                  } else {
                    continue;
                  }
                }
                scripts_to_load.push($.getScript(_src));
              }
            }
          }
          elms.push(elm);
        }
        if ($.ceDialog("inside_dialog", { jelm: elm })) {
          $.ceDialog("reload_parent", { jelm: elm });
        }
        if (response.title) {
          $(document).prop("title", response.title);
        }
      }
      var done_event = function done_event() {
        $.ceEvent("trigger", "ce.ajaxdone", [
          elms,
          inline_scripts,
          params,
          data,
          response.text || "",
        ]);
      };
      if (scripts_to_load.length) {
        $.when.apply(null, scripts_to_load).then(done_event);
      } else {
        done_event();
      }
    }
    var ajax = $.ajax;
    $.ajax = function (origSettings) {
      if (origSettings.dataType && origSettings.dataType === "script") {
        var _src = origSettings.url,
          promise;
        if (loadedScripts[_src]) {
          promise =
            _src in loadedScriptPromises
              ? loadedScriptPromises[_src]
              : $.Deferred().resolve().promise();
          if ("success" in origSettings) {
            promise.done(origSettings.success);
          }
        } else {
          promise = ajax(origSettings);
          loadedScripts[_src] = true;
          loadedScriptPromises[_src] = promise;
        }
        return promise;
      }
      return ajax(origSettings);
    };
    $.getScript = function (url, callback) {
      url = url.indexOf("//") == -1 ? _.current_location + "/" + url : url;
      if (_.otherjQ && getScriptQueries === 0) {
        oldjQuery = jQuery;
        jQuery = _.$;
      }
      getScriptQueries++;
      return $.ajax({
        type: "GET",
        url: url,
        success: function success(data, textStatus, jqxhr) {
          getScriptQueries--;
          if (_.otherjQ && getScriptQueries === 0) {
            _.$ = jQuery;
            jQuery = oldjQuery;
          }
          if (callback) {
            callback(data, textStatus, jqxhr);
          }
        },
        dataType: "script",
        cache: true,
      });
    };
    $.ceEvent(
      "on",
      "ce.ajaxdone",
      function (elms, scripts, params, response_data, response_text) {
        var i;
        if (_.embedded && response_data.language_changed) {
          _.embedded = false;
          $.redirect(response_data.current_url, false);
          window.location.reload(true);
          return;
        }
        if (params.on_ajax_done && typeof params.on_ajax_done == "function") {
          params.on_ajax_done(response_data, params, response_text);
        }
        if (scripts) {
          for (i = 0; i < scripts.length; i++) {
            var _hash = $.crc32(scripts.eq(i).html());
            if (
              !evalCache[_hash] ||
              params.force_exec ||
              scripts.eq(i).hasClass("cm-ajax-force")
            ) {
              $.globalEval(scripts.eq(i).html());
              evalCache[_hash] = true;
            }
          }
        }
        if (response_data.debug_info) {
          console.log(response_data.debug_info);
        }
        var link_history =
          params.save_history &&
          (!params.obj ||
            (params.obj &&
              $.ceDialog("inside_dialog", { jelm: params.obj }) === false));
        if (response_data.session_data) {
          sessionData = response_data.session_data;
          localStorage.setItem(sessionData.name, sessionData.id);
        }
        if (response_data.current_url) {
          var current_url = decodeURIComponent(response_data.current_url);
          if (!params.skip_history && (_.embedded || link_history)) {
            var _params = params;
            if (!link_history) {
              _params.result_ids = _.container;
            }
            if (response_data.anchor) {
              current_url += "#" + response_data.anchor;
            }
            $.ceHistory("load", current_url, _params, true);
            _.current_url = current_url;
          }
          if (response_data.anchor) {
            params.scroll = response_data.anchor;
            _.anchor = "#" + response_data.anchor;
          }
        }
        for (i = 0; i < elms.length; i++) {
          $.commonInit(elms[i]);
        }
        if (params.form) {
          $("input[name=is_ajax]", params.form).remove();
          $("input[name=full_render]", params.form).remove();
          if (
            params.form.hasClass("cm-disable-empty") ||
            params.form.hasClass("cm-disable-empty-files")
          ) {
            $("input.cm-disabled", params.form)
              .prop("disabled", false)
              .removeClass("cm-disabled");
          }
          if (params.form.data("caAjaxDoneEvent")) {
            $.ceEvent("trigger", params.form.data("caAjaxDoneEvent"), [
              response_data,
              params,
              response_text,
            ]);
          }
        }
        if (params.callback && $.isFunction(params.callback)) {
          params.callback(response_data, params, response_text);
        } else if (params.callback) {
          $.ceEvent("trigger", params.callback, [
            response_data,
            params,
            response_text,
          ]);
        }
        if (!params.keep_status_box) {
          $.toggleStatusBox("hide");
        }
        if (params.scroll) {
          if (!_.scrolling) {
            $.scrollToElm(params.scroll);
          }
        }
        if (response_data.notifications) {
          $.ceNotification("showMany", response_data.notifications);
        }
      }
    );
    $.ceAjax = function (method) {
      if (methods[method]) {
        return methods[method].apply(
          this,
          Array.prototype.slice.call(arguments, 1)
        );
      } else if (_typeof(method) === "object" || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error("ty.ajax: method " + method + " does not exist");
      }
    };
  })($);
  $(document).ready(function () {
    $("script").each(function () {
      var _src = $(this).prop("src");
      if (_src) {
        loadedScripts[_src] = true;
      }
    });
    if (typeof ajax_callback_data != "undefined" && ajax_callback_data) {
      $.globalEval(ajax_callback_data);
      ajax_callback_data = false;
    }
  });
})(Tygh, Tygh.$);
(function (_, $) {
  var locationWrapper = {
    put: function put(hash, win) {
      (win || window).location.hash = this.encoder(hash);
    },
    get: function get(win) {
      var hash = (win || window).location.hash.replace(/^#/, "");
      try {
        return decodeURIComponent(hash);
      } catch (error) {
        return hash;
      }
    },
    encoder: encodeURIComponent,
  };
  var historyState = {
    storage: null,
    first: "",
    put: function put(hash, params) {
      if (!this.storage) {
        this.storage = {};
        this.first = hash;
      }
      this.storage[hash] = params;
    },
    get: function get(hash) {
      if (hash in this.storage) {
        return this.storage[hash];
      }
      return {};
    },
  };
  function initObjects(options) {
    options = $.extend({ unescape: false }, options || {});
    locationWrapper.encoder = encoder(options.unescape);
    function encoder(unescape_) {
      if (unescape_ === true) {
        return function (hash) {
          return hash;
        };
      }
      if (
        (typeof unescape_ == "string" &&
          (unescape_ = partialDecoder(unescape_.split("")))) ||
        typeof unescape_ == "function"
      ) {
        return function (hash) {
          return unescape_(encodeURIComponent(hash));
        };
      }
      return encodeURIComponent;
    }
    function partialDecoder(chars) {
      var re = new RegExp($.map(chars, encodeURIComponent).join("|"), "ig");
      return function (enc) {
        return enc.replace(re, decodeURIComponent);
      };
    }
  }
  var implementations = {};
  implementations.base = {
    callback: undefined,
    type: undefined,
    check: function check() {},
    load: function load(hash) {},
    init: function init(callback, options) {
      initObjects(options);
      self.callback = callback;
      self._options = options;
      self._init();
    },
    _init: function _init() {},
    _options: {},
  };
  implementations.hashchangeEvent = {
    _skip: false,
    _init: function _init() {
      $(window).bind("hashchange", function () {
        if (self._skip === true) {
          self._skip = false;
          return;
        }
        self.check();
      });
    },
    check: function check() {
      var hash = locationWrapper.get()
        ? locationWrapper.get()
        : historyState.first;
      self.callback(hash, historyState.get(hash));
    },
    load: function load(hash, params) {
      var current_hash = locationWrapper.get()
        ? locationWrapper.get()
        : historyState.first;
      historyState.put(hash, params);
      if (hash != current_hash) {
        self._skip = true;
      }
      locationWrapper.put(hash);
    },
    reload: function reload(hash, params) {
      historyState.put(hash, params);
    },
  };
  implementations.HTML5 = {
    _init: function _init() {
      $(window).bind("popstate", self.check);
    },
    check: function check(evt) {
      var state = evt.originalEvent.state;
      self.callback(state ? "#!/" + document.location : "", state);
    },
    load: function load(hash, params) {
      window.history.pushState(
        params,
        null,
        _.current_location + "/" + hash.replace(/^\!\//, "")
      );
    },
    reload: function reload(hash, params) {
      window.history.replaceState(
        params,
        null,
        _.current_location + "/" + hash.replace(/^\!\//, "")
      );
    },
  };
  var self = $.extend({}, implementations.base);
  if (!_.embedded && "pushState" in window.history) {
    self.type = "HTML5";
  } else if ("onhashchange" in window) {
    self.type = "hashchangeEvent";
  }
  if (self.type) {
    $.extend(self, implementations[self.type]);
    $.history = self;
  }
})(Tygh, Tygh.$);
(function (factory) {
  if (typeof define === "function" && define.noamd) {
    define(["jquery"], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(require("jquery"));
  } else {
    factory(window.jQuery);
  }
})(function ($) {
  "use strict";
  function getElementSelection(that) {
    var position = {};
    if (that.selectionStart === undefined) {
      that.focus();
      var select = document.selection.createRange();
      position.length = select.text.length;
      select.moveStart("character", -that.value.length);
      position.end = select.text.length;
      position.start = position.end - position.length;
    } else {
      position.start = that.selectionStart;
      position.end = that.selectionEnd;
      position.length = position.end - position.start;
    }
    return position;
  }
  function setElementSelection(that, start, end) {
    if (that.selectionStart === undefined) {
      that.focus();
      var r = that.createTextRange();
      r.collapse(true);
      r.moveEnd("character", end);
      r.moveStart("character", start);
      r.select();
    } else {
      that.selectionStart = start;
      that.selectionEnd = end;
    }
  }
  function runCallbacks($this, settings) {
    $.each(settings, function (k, val) {
      if (typeof val === "function") {
        settings[k] = val($this, settings, k);
      } else if (typeof $this.autoNumeric[val] === "function") {
        settings[k] = $this.autoNumeric[val]($this, settings, k);
      }
    });
  }
  function convertKeyToNumber(settings, key) {
    if (typeof settings[key] === "string") {
      settings[key] *= 1;
    }
  }
  function autoCode($this, settings) {
    runCallbacks($this, settings);
    settings.tagList = [
      "b",
      "caption",
      "cite",
      "code",
      "dd",
      "del",
      "div",
      "dfn",
      "dt",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ins",
      "kdb",
      "label",
      "li",
      "output",
      "p",
      "q",
      "s",
      "sample",
      "span",
      "strong",
      "td",
      "th",
      "u",
      "var",
    ];
    var vmax = settings.vMax.toString().split("."),
      vmin =
        !settings.vMin && settings.vMin !== 0
          ? []
          : settings.vMin.toString().split(".");
    convertKeyToNumber(settings, "vMax");
    convertKeyToNumber(settings, "vMin");
    convertKeyToNumber(settings, "mDec");
    settings.mDec = settings.mRound === "CHF" ? "2" : settings.mDec;
    settings.allowLeading = true;
    settings.aNeg = settings.vMin < 0 ? "-" : "";
    vmax[0] = vmax[0].replace("-", "");
    vmin[0] = vmin[0].replace("-", "");
    settings.mInt = Math.max(vmax[0].length, vmin[0].length, 1);
    if (settings.mDec === null) {
      var vmaxLength = 0,
        vminLength = 0;
      if (vmax[1]) {
        vmaxLength = vmax[1].length;
      }
      if (vmin[1]) {
        vminLength = vmin[1].length;
      }
      settings.mDec = Math.max(vmaxLength, vminLength);
    }
    if (settings.altDec === null && settings.mDec > 0) {
      if (settings.aDec === "." && settings.aSep !== ",") {
        settings.altDec = ",";
      } else if (settings.aDec === "," && settings.aSep !== ".") {
        settings.altDec = ".";
      }
    }
    var aNegReg = settings.aNeg ? "([-\\" + settings.aNeg + "]?)" : "(-?)";
    settings.aNegRegAutoStrip = aNegReg;
    settings.skipFirstAutoStrip = new RegExp(
      aNegReg +
        "[^-" +
        (settings.aNeg ? "\\" + settings.aNeg : "") +
        "\\" +
        settings.aDec +
        "\\d]" +
        ".*?(\\d|\\" +
        settings.aDec +
        "\\d)"
    );
    settings.skipLastAutoStrip = new RegExp(
      "(\\d\\" + settings.aDec + "?)[^\\" + settings.aDec + "\\d]\\D*$"
    );
    var allowed = "-" + settings.aNum + "\\" + settings.aDec;
    settings.allowedAutoStrip = new RegExp("[^" + allowed + "]", "gi");
    settings.numRegAutoStrip = new RegExp(
      aNegReg +
        "(?:\\" +
        settings.aDec +
        "?(\\d+\\" +
        settings.aDec +
        "\\d+)|(\\d*(?:\\" +
        settings.aDec +
        "\\d*)?))"
    );
    return settings;
  }
  function autoStrip(s, settings, strip_zero) {
    if (settings.aSign) {
      while (s.indexOf(settings.aSign) > -1) {
        s = s.replace(settings.aSign, "");
      }
    }
    s = s.replace(settings.skipFirstAutoStrip, "$1$2");
    s = s.replace(settings.skipLastAutoStrip, "$1");
    s = s.replace(settings.allowedAutoStrip, "");
    if (settings.altDec) {
      s = s.replace(settings.altDec, settings.aDec);
    }
    var m = s.match(settings.numRegAutoStrip);
    s = m ? [m[1], m[2], m[3]].join("") : "";
    if (
      (settings.lZero === "allow" || settings.lZero === "keep") &&
      strip_zero !== "strip"
    ) {
      var parts = [],
        nSign = "";
      parts = s.split(settings.aDec);
      if (parts[0].indexOf("-") !== -1) {
        nSign = "-";
        parts[0] = parts[0].replace("-", "");
      }
      if (parts[0].length > settings.mInt && parts[0].charAt(0) === "0") {
        parts[0] = parts[0].slice(1);
      }
      s = nSign + parts.join(settings.aDec);
    }
    if (
      (strip_zero && settings.lZero === "deny") ||
      (strip_zero &&
        settings.lZero === "allow" &&
        settings.allowLeading === false)
    ) {
      var strip_reg =
        "^" +
        settings.aNegRegAutoStrip +
        "0*(\\d" +
        (strip_zero === "leading" ? ")" : "|$)");
      strip_reg = new RegExp(strip_reg);
      s = s.replace(strip_reg, "$1$2");
    }
    return s;
  }
  function negativeBracket(s, settings) {
    if (settings.pSign === "p") {
      var brackets = settings.nBracket.split(",");
      if (!settings.hasFocus && !settings.removeBrackets) {
        s = s.replace(settings.aNeg, "");
        s = brackets[0] + s + brackets[1];
      } else if (
        (settings.hasFocus && s.charAt(0) === brackets[0]) ||
        (settings.removeBrackets && s.charAt(0) === brackets[0])
      ) {
        s = s.replace(brackets[0], settings.aNeg);
        s = s.replace(brackets[1], "");
      }
    }
    return s;
  }
  function checkValue(value, settings) {
    if (value) {
      var checkSmall = +value;
      if (checkSmall < 0.000001 && checkSmall > -1) {
        value = +value;
        if (value < 0.000001 && value > 0) {
          value = (value + 10).toString();
          value = value.substring(1);
        }
        if (value < 0 && value > -1) {
          value = (value - 10).toString();
          value = "-" + value.substring(2);
        }
        value = value.toString();
      } else {
        var parts = value.split(".");
        if (parts[1] !== undefined) {
          if (+parts[1] === 0) {
            value = parts[0];
          } else {
            parts[1] = parts[1].replace(/0*$/, "");
            value = parts.join(".");
          }
        }
      }
    }
    return settings.lZero === "keep" ? value : value.replace(/^0*(\d)/, "$1");
  }
  function fixNumber(s, aDec, aNeg) {
    if (aDec && aDec !== ".") {
      s = s.replace(aDec, ".");
    }
    if (aNeg && aNeg !== "-") {
      s = s.replace(aNeg, "-");
    }
    if (!s.match(/\d/)) {
      s += "0";
    }
    return s;
  }
  function presentNumber(s, aDec, aNeg) {
    if (aNeg && aNeg !== "-") {
      s = s.replace("-", aNeg);
    }
    if (aDec && aDec !== ".") {
      s = s.replace(".", aDec);
    }
    return s;
  }
  function checkEmpty(iv, settings, signOnEmpty) {
    if (iv === "" || iv === settings.aNeg) {
      if (settings.wEmpty === "zero") {
        return iv + "0";
      }
      if (settings.wEmpty === "sign" || signOnEmpty) {
        return iv + settings.aSign;
      }
      return iv;
    }
    return null;
  }
  function autoGroup(iv, settings) {
    iv = autoStrip(iv, settings);
    var testNeg = iv.replace(",", "."),
      empty = checkEmpty(iv, settings, true);
    if (empty !== null) {
      return empty;
    }
    var digitalGroup = "";
    if (settings.dGroup === 2) {
      digitalGroup = /(\d)((\d)(\d{2}?)+)$/;
    } else if (settings.dGroup === 4) {
      digitalGroup = /(\d)((\d{4}?)+)$/;
    } else {
      digitalGroup = /(\d)((\d{3}?)+)$/;
    }
    var ivSplit = iv.split(settings.aDec);
    if (settings.altDec && ivSplit.length === 1) {
      ivSplit = iv.split(settings.altDec);
    }
    var s = ivSplit[0];
    if (settings.aSep) {
      while (digitalGroup.test(s)) {
        s = s.replace(digitalGroup, "$1" + settings.aSep + "$2");
      }
    }
    if (settings.mDec !== 0 && ivSplit.length > 1) {
      if (ivSplit[1].length > settings.mDec) {
        ivSplit[1] = ivSplit[1].substring(0, settings.mDec);
      }
      iv = s + settings.aDec + ivSplit[1];
    } else {
      iv = s;
    }
    if (settings.aSign) {
      var has_aNeg = iv.indexOf(settings.aNeg) !== -1;
      iv = iv.replace(settings.aNeg, "");
      iv = settings.pSign === "p" ? settings.aSign + iv : iv + settings.aSign;
      if (has_aNeg) {
        iv = settings.aNeg + iv;
      }
    }
    if (testNeg < 0 && settings.nBracket !== null) {
      iv = negativeBracket(iv, settings);
    }
    return iv;
  }
  function autoRound(iv, settings) {
    iv = iv === "" ? "0" : iv.toString();
    convertKeyToNumber(settings, "mDec");
    if (settings.mRound === "CHF") {
      iv = (Math.round(iv * 20) / 20).toString();
    }
    var ivRounded = "",
      i = 0,
      nSign = "",
      rDec =
        typeof settings.aPad === "boolean" || settings.aPad === null
          ? settings.aPad
            ? settings.mDec
            : 0
          : +settings.aPad;
    var truncateZeros = function (ivRounded) {
      var regex =
        rDec === 0
          ? /(\.(?:\d*[1-9])?)0*$/
          : rDec === 1
          ? /(\.\d(?:\d*[1-9])?)0*$/
          : new RegExp("(\\.\\d{" + rDec + "}(?:\\d*[1-9])?)0*$");
      ivRounded = ivRounded.replace(regex, "$1");
      if (rDec === 0) {
        ivRounded = ivRounded.replace(/\.$/, "");
      }
      return ivRounded;
    };
    if (iv.charAt(0) === "-") {
      nSign = "-";
      iv = iv.replace("-", "");
    }
    if (!iv.match(/^\d/)) {
      iv = "0" + iv;
    }
    if (nSign === "-" && +iv === 0) {
      nSign = "";
    }
    if (
      (+iv > 0 && settings.lZero !== "keep") ||
      (iv.length > 0 && settings.lZero === "allow")
    ) {
      iv = iv.replace(/^0*(\d)/, "$1");
    }
    var dPos = iv.lastIndexOf("."),
      vdPos = dPos === -1 ? iv.length - 1 : dPos,
      cDec = iv.length - 1 - vdPos;
    if (cDec <= settings.mDec) {
      ivRounded = iv;
      if (cDec < rDec) {
        if (dPos === -1) {
          ivRounded += settings.aDec;
        }
        var zeros = "000000";
        while (cDec < rDec) {
          zeros = zeros.substring(0, rDec - cDec);
          ivRounded += zeros;
          cDec += zeros.length;
        }
      } else if (cDec > rDec) {
        ivRounded = truncateZeros(ivRounded);
      } else if (cDec === 0 && rDec === 0) {
        ivRounded = ivRounded.replace(/\.$/, "");
      }
      if (settings.mRound !== "CHF") {
        return +ivRounded === 0 ? ivRounded : nSign + ivRounded;
      }
      if (settings.mRound === "CHF") {
        dPos = ivRounded.lastIndexOf(".");
        iv = ivRounded;
      }
    }
    var rLength = dPos + settings.mDec,
      tRound = +iv.charAt(rLength + 1),
      ivArray = iv.substring(0, rLength + 1).split(""),
      odd =
        iv.charAt(rLength) === "."
          ? iv.charAt(rLength - 1) % 2
          : iv.charAt(rLength) % 2,
      onePass = true;
    if (odd !== 1) {
      odd = odd === 0 && iv.substring(rLength + 2, iv.length) > 0 ? 1 : 0;
    }
    if (
      (tRound > 4 && settings.mRound === "S") ||
      (tRound > 4 && settings.mRound === "A" && nSign === "") ||
      (tRound > 5 && settings.mRound === "A" && nSign === "-") ||
      (tRound > 5 && settings.mRound === "s") ||
      (tRound > 5 && settings.mRound === "a" && nSign === "") ||
      (tRound > 4 && settings.mRound === "a" && nSign === "-") ||
      (tRound > 5 && settings.mRound === "B") ||
      (tRound === 5 && settings.mRound === "B" && odd === 1) ||
      (tRound > 0 && settings.mRound === "C" && nSign === "") ||
      (tRound > 0 && settings.mRound === "F" && nSign === "-") ||
      (tRound > 0 && settings.mRound === "U") ||
      settings.mRound === "CHF"
    ) {
      for (i = ivArray.length - 1; i >= 0; i -= 1) {
        if (ivArray[i] !== ".") {
          if (settings.mRound === "CHF" && ivArray[i] <= 2 && onePass) {
            ivArray[i] = 0;
            onePass = false;
            break;
          }
          if (settings.mRound === "CHF" && ivArray[i] <= 7 && onePass) {
            ivArray[i] = 5;
            onePass = false;
            break;
          }
          if (settings.mRound === "CHF" && onePass) {
            ivArray[i] = 10;
            onePass = false;
          } else {
            ivArray[i] = +ivArray[i] + 1;
          }
          if (ivArray[i] < 10) {
            break;
          }
          if (i > 0) {
            ivArray[i] = "0";
          }
        }
      }
    }
    ivArray = ivArray.slice(0, rLength + 1);
    ivRounded = truncateZeros(ivArray.join(""));
    return +ivRounded === 0 ? ivRounded : nSign + ivRounded;
  }
  function truncateDecimal(s, settings, paste) {
    var aDec = settings.aDec,
      mDec = settings.mDec;
    s = paste === "paste" ? autoRound(s, settings) : s;
    if (aDec && mDec) {
      var parts = s.split(aDec);
      if (parts[1] && parts[1].length > mDec) {
        if (mDec > 0) {
          parts[1] = parts[1].substring(0, mDec);
          s = parts.join(aDec);
        } else {
          s = parts[0];
        }
      }
    }
    return s;
  }
  function autoCheck(s, settings) {
    s = autoStrip(s, settings);
    s = truncateDecimal(s, settings);
    s = fixNumber(s, settings.aDec, settings.aNeg);
    var value = +s;
    return value >= settings.vMin && value <= settings.vMax;
  }
  function AutoNumericHolder(that, settings) {
    this.settings = settings;
    this.that = that;
    this.$that = $(that);
    this.formatted = false;
    this.settingsClone = autoCode(this.$that, this.settings);
    this.value = that.value;
  }
  AutoNumericHolder.prototype = {
    init: function (e) {
      this.value = this.that.value;
      this.settingsClone = autoCode(this.$that, this.settings);
      this.ctrlKey = e.ctrlKey;
      this.cmdKey = e.metaKey;
      this.shiftKey = e.shiftKey;
      this.selection = getElementSelection(this.that);
      if (e.type === "keydown" || e.type === "keyup") {
        this.kdCode = e.keyCode;
      }
      this.which = e.which;
      this.processed = false;
      this.formatted = false;
    },
    setSelection: function (start, end, setReal) {
      start = Math.max(start, 0);
      end = Math.min(end, this.that.value.length);
      this.selection = { start: start, end: end, length: end - start };
      if (setReal === undefined || setReal) {
        setElementSelection(this.that, start, end);
      }
    },
    setPosition: function (pos, setReal) {
      this.setSelection(pos, pos, setReal);
    },
    getBeforeAfter: function () {
      var value = this.value,
        left = value.substring(0, this.selection.start),
        right = value.substring(this.selection.end, value.length);
      return [left, right];
    },
    getBeforeAfterStriped: function () {
      var parts = this.getBeforeAfter();
      parts[0] = autoStrip(parts[0], this.settingsClone);
      parts[1] = autoStrip(parts[1], this.settingsClone);
      return parts;
    },
    normalizeParts: function (left, right) {
      var settingsClone = this.settingsClone;
      right = autoStrip(right, settingsClone);
      var strip = right.match(/^\d/) ? true : "leading";
      left = autoStrip(left, settingsClone, strip);
      if (
        (left === "" || left === settingsClone.aNeg) &&
        settingsClone.lZero === "deny"
      ) {
        if (right > "") {
          right = right.replace(/^0*(\d)/, "$1");
        }
      }
      var new_value = left + right;
      if (settingsClone.aDec) {
        var m = new_value.match(
          new RegExp(
            "^" + settingsClone.aNegRegAutoStrip + "\\" + settingsClone.aDec
          )
        );
        if (m) {
          left = left.replace(m[1], m[1] + "0");
          new_value = left + right;
        }
      }
      if (
        settingsClone.wEmpty === "zero" &&
        (new_value === settingsClone.aNeg || new_value === "")
      ) {
        left += "0";
      }
      return [left, right];
    },
    setValueParts: function (left, right, paste) {
      var settingsClone = this.settingsClone,
        parts = this.normalizeParts(left, right),
        new_value = parts.join(""),
        position = parts[0].length;
      if (autoCheck(new_value, settingsClone)) {
        new_value = truncateDecimal(new_value, settingsClone, paste);
        if (position > new_value.length) {
          position = new_value.length;
        }
        this.value = new_value;
        this.setPosition(position, false);
        return true;
      }
      return false;
    },
    signPosition: function () {
      var settingsClone = this.settingsClone,
        aSign = settingsClone.aSign,
        that = this.that;
      if (aSign) {
        var aSignLen = aSign.length;
        if (settingsClone.pSign === "p") {
          var hasNeg =
            settingsClone.aNeg &&
            that.value &&
            that.value.charAt(0) === settingsClone.aNeg;
          return hasNeg ? [1, aSignLen + 1] : [0, aSignLen];
        }
        var valueLen = that.value.length;
        return [valueLen - aSignLen, valueLen];
      }
      return [1000, -1];
    },
    expandSelectionOnSign: function (setReal) {
      var sign_position = this.signPosition(),
        selection = this.selection;
      if (
        selection.start < sign_position[1] &&
        selection.end > sign_position[0]
      ) {
        if (
          (selection.start < sign_position[0] ||
            selection.end > sign_position[1]) &&
          this.value
            .substring(
              Math.max(selection.start, sign_position[0]),
              Math.min(selection.end, sign_position[1])
            )
            .match(/^\s*$/)
        ) {
          if (selection.start < sign_position[0]) {
            this.setSelection(selection.start, sign_position[0], setReal);
          } else {
            this.setSelection(sign_position[1], selection.end, setReal);
          }
        } else {
          this.setSelection(
            Math.min(selection.start, sign_position[0]),
            Math.max(selection.end, sign_position[1]),
            setReal
          );
        }
      }
    },
    checkPaste: function () {
      if (this.valuePartsBeforePaste !== undefined) {
        var parts = this.getBeforeAfter(),
          oldParts = this.valuePartsBeforePaste;
        delete this.valuePartsBeforePaste;
        parts[0] =
          parts[0].substr(0, oldParts[0].length) +
          autoStrip(parts[0].substr(oldParts[0].length), this.settingsClone);
        if (!this.setValueParts(parts[0], parts[1], "paste")) {
          this.value = oldParts.join("");
          this.setPosition(oldParts[0].length, false);
        }
      }
    },
    skipAllways: function (e) {
      var kdCode = this.kdCode,
        which = this.which,
        ctrlKey = this.ctrlKey,
        cmdKey = this.cmdKey,
        shiftKey = this.shiftKey;
      if (
        ((ctrlKey || cmdKey) &&
          e.type === "keyup" &&
          this.valuePartsBeforePaste !== undefined) ||
        (shiftKey && kdCode === 45)
      ) {
        this.checkPaste();
        return false;
      }
      if (
        (kdCode >= 112 && kdCode <= 123) ||
        (kdCode >= 91 && kdCode <= 93) ||
        (kdCode >= 9 && kdCode <= 31) ||
        (kdCode < 8 && (which === 0 || which === kdCode)) ||
        kdCode === 144 ||
        kdCode === 145 ||
        kdCode === 45 ||
        kdCode === 224
      ) {
        return true;
      }
      if ((ctrlKey || cmdKey) && kdCode === 65) {
        return true;
      }
      if (
        (ctrlKey || cmdKey) &&
        (kdCode === 67 || kdCode === 86 || kdCode === 88)
      ) {
        if (e.type === "keydown") {
          this.expandSelectionOnSign();
        }
        if (kdCode === 86 || kdCode === 45) {
          if (e.type === "keydown" || e.type === "keypress") {
            if (this.valuePartsBeforePaste === undefined) {
              this.valuePartsBeforePaste = this.getBeforeAfter();
            }
          } else {
            this.checkPaste();
          }
        }
        return e.type === "keydown" || e.type === "keypress" || kdCode === 67;
      }
      if (ctrlKey || cmdKey) {
        return true;
      }
      if (kdCode === 37 || kdCode === 39) {
        var aSep = this.settingsClone.aSep,
          start = this.selection.start,
          value = this.that.value;
        if (e.type === "keydown" && aSep && !this.shiftKey) {
          if (kdCode === 37 && value.charAt(start - 2) === aSep) {
            this.setPosition(start - 1);
          } else if (kdCode === 39 && value.charAt(start + 1) === aSep) {
            this.setPosition(start + 1);
          }
        }
        return true;
      }
      if (kdCode >= 34 && kdCode <= 40) {
        return true;
      }
      return false;
    },
    processAllways: function () {
      var parts;
      if (this.kdCode === 8 || this.kdCode === 46) {
        if (!this.selection.length) {
          parts = this.getBeforeAfterStriped();
          if (this.kdCode === 8) {
            parts[0] = parts[0].substring(0, parts[0].length - 1);
          } else {
            parts[1] = parts[1].substring(1, parts[1].length);
          }
          this.setValueParts(parts[0], parts[1]);
        } else {
          this.expandSelectionOnSign(false);
          parts = this.getBeforeAfterStriped();
          this.setValueParts(parts[0], parts[1]);
        }
        return true;
      }
      return false;
    },
    processKeypress: function () {
      var settingsClone = this.settingsClone,
        cCode = String.fromCharCode(this.which),
        parts = this.getBeforeAfterStriped(),
        left = parts[0],
        right = parts[1];
      if (
        cCode === settingsClone.aDec ||
        (settingsClone.altDec && cCode === settingsClone.altDec) ||
        ((cCode === "." || cCode === ",") && this.kdCode === 110)
      ) {
        if (!settingsClone.mDec || !settingsClone.aDec) {
          return true;
        }
        if (settingsClone.aNeg && right.indexOf(settingsClone.aNeg) > -1) {
          return true;
        }
        if (left.indexOf(settingsClone.aDec) > -1) {
          return true;
        }
        if (right.indexOf(settingsClone.aDec) > 0) {
          return true;
        }
        if (right.indexOf(settingsClone.aDec) === 0) {
          right = right.substr(1);
        }
        this.setValueParts(left + settingsClone.aDec, right);
        return true;
      }
      if (cCode === "-" || cCode === "+") {
        if (!settingsClone.aNeg) {
          return true;
        }
        if (left === "" && right.indexOf(settingsClone.aNeg) > -1) {
          left = settingsClone.aNeg;
          right = right.substring(1, right.length);
        }
        if (left.charAt(0) === settingsClone.aNeg) {
          left = left.substring(1, left.length);
        } else {
          left = cCode === "-" ? settingsClone.aNeg + left : left;
        }
        this.setValueParts(left, right);
        return true;
      }
      if (cCode >= "0" && cCode <= "9") {
        if (
          settingsClone.aNeg &&
          left === "" &&
          right.indexOf(settingsClone.aNeg) > -1
        ) {
          left = settingsClone.aNeg;
          right = right.substring(1, right.length);
        }
        if (
          settingsClone.vMax <= 0 &&
          settingsClone.vMin < settingsClone.vMax &&
          this.value.indexOf(settingsClone.aNeg) === -1 &&
          cCode !== "0"
        ) {
          left = settingsClone.aNeg + left;
        }
        this.setValueParts(left + cCode, right);
        return true;
      }
      return true;
    },
    formatQuick: function () {
      var settingsClone = this.settingsClone,
        parts = this.getBeforeAfterStriped(),
        leftLength = this.value;
      if (
        (settingsClone.aSep === "" ||
          (settingsClone.aSep !== "" &&
            leftLength.indexOf(settingsClone.aSep) === -1)) &&
        (settingsClone.aSign === "" ||
          (settingsClone.aSign !== "" &&
            leftLength.indexOf(settingsClone.aSign) === -1))
      ) {
        var subParts = [],
          nSign = "";
        subParts = leftLength.split(settingsClone.aDec);
        if (subParts[0].indexOf("-") > -1) {
          nSign = "-";
          subParts[0] = subParts[0].replace("-", "");
          parts[0] = parts[0].replace("-", "");
        }
        if (
          subParts[0].length > settingsClone.mInt &&
          parts[0].charAt(0) === "0"
        ) {
          parts[0] = parts[0].slice(1);
        }
        parts[0] = nSign + parts[0];
      }
      var value = autoGroup(this.value, this.settingsClone),
        position = value.length;
      if (value) {
        var left_ar = parts[0].split(""),
          i = 0;
        for (i; i < left_ar.length; i += 1) {
          if (!left_ar[i].match("\\d")) {
            left_ar[i] = "\\" + left_ar[i];
          }
        }
        var leftReg = new RegExp("^.*?" + left_ar.join(".*?"));
        var newLeft = value.match(leftReg);
        if (newLeft) {
          position = newLeft[0].length;
          if (
            ((position === 0 && value.charAt(0) !== settingsClone.aNeg) ||
              (position === 1 && value.charAt(0) === settingsClone.aNeg)) &&
            settingsClone.aSign &&
            settingsClone.pSign === "p"
          ) {
            position =
              this.settingsClone.aSign.length +
              (value.charAt(0) === "-" ? 1 : 0);
          }
        } else if (settingsClone.aSign && settingsClone.pSign === "s") {
          position -= settingsClone.aSign.length;
        }
      }
      this.that.value = value;
      this.setPosition(position);
      this.formatted = true;
    },
  };
  function autoGet(obj) {
    if (typeof obj === "string") {
      obj = obj.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
      obj = "#" + obj.replace(/(:|\.)/g, "\\$1");
    }
    return $(obj);
  }
  function getHolder($that, settings, update) {
    var data = $that.data("autoNumeric");
    if (!data) {
      data = {};
      $that.data("autoNumeric", data);
    }
    var holder = data.holder;
    if ((holder === undefined && settings) || update) {
      holder = new AutoNumericHolder($that.get(0), settings);
      data.holder = holder;
    }
    return holder;
  }
  var methods = {
    init: function (options) {
      return this.each(function () {
        var $this = $(this),
          settings = $this.data("autoNumeric"),
          tagData = $this.data(),
          $input = $this.is(
            "input[type=text], input[type=hidden], input[type=tel], input:not([type])"
          );
        if (typeof settings !== "object") {
          settings = $.extend({}, $.fn.autoNumeric.defaults, tagData, options, {
            aNum: "0123456789",
            hasFocus: false,
            removeBrackets: false,
            runOnce: false,
            tagList: [
              "b",
              "caption",
              "cite",
              "code",
              "dd",
              "del",
              "div",
              "dfn",
              "dt",
              "em",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "ins",
              "kdb",
              "label",
              "li",
              "output",
              "p",
              "q",
              "s",
              "sample",
              "span",
              "strong",
              "td",
              "th",
              "u",
              "var",
            ],
          });
          if (settings.aDec === settings.aSep) {
            $.error(
              "autoNumeric will not function properly when the decimal character aDec: '" +
                settings.aDec +
                "' and thousand separator aSep: '" +
                settings.aSep +
                "' are the same character"
            );
          }
          $this.data("autoNumeric", settings);
        } else {
          return this;
        }
        var holder = getHolder($this, settings);
        if (!$input && $this.prop("tagName").toLowerCase() === "input") {
          $.error(
            'The input type "' +
              $this.prop("type") +
              '" is not supported by autoNumeric()'
          );
        }
        if (
          $.inArray($this.prop("tagName").toLowerCase(), settings.tagList) ===
            -1 &&
          $this.prop("tagName").toLowerCase() !== "input"
        ) {
          $.error(
            "The <" +
              $this.prop("tagName").toLowerCase() +
              "> is not supported by autoNumeric()"
          );
        }
        if (settings.runOnce === false && settings.aForm) {
          if ($input) {
            var setValue = true;
            if ($this[0].value === "" && settings.wEmpty === "empty") {
              $this[0].value = "";
              setValue = false;
            }
            if ($this[0].value === "" && settings.wEmpty === "sign") {
              $this[0].value = settings.aSign;
              setValue = false;
            }
            if (
              setValue &&
              $this.val() !== "" &&
              ((settings.anDefault === null &&
                $this[0].value === $this.prop("defaultValue")) ||
                (settings.anDefault !== null &&
                  settings.anDefault.toString() === $this.val()))
            ) {
              $this.autoNumeric("set", $this.val());
            }
          }
          if (
            $.inArray($this.prop("tagName").toLowerCase(), settings.tagList) !==
              -1 &&
            $this.text() !== ""
          ) {
            $this.autoNumeric("set", $this.text());
          }
        }
        settings.runOnce = true;
        if (
          $this.is(
            "input[type=text], input[type=hidden], input[type=tel], input:not([type])"
          )
        ) {
          $this.on("keydown.autoNumeric", function (e) {
            holder = getHolder($this);
            if (holder.settings.aDec === holder.settings.aSep) {
              $.error(
                "autoNumeric will not function properly when the decimal character aDec: '" +
                  holder.settings.aDec +
                  "' and thousand separator aSep: '" +
                  holder.settings.aSep +
                  "' are the same character"
              );
            }
            if (holder.that.readOnly) {
              holder.processed = true;
              return true;
            }
            holder.init(e);
            if (holder.skipAllways(e)) {
              holder.processed = true;
              return true;
            }
            if (holder.processAllways()) {
              holder.processed = true;
              holder.formatQuick();
              e.preventDefault();
              return false;
            }
            holder.formatted = false;
            return true;
          });
          $this.on("keypress.autoNumeric", function (e) {
            holder = getHolder($this);
            var processed = holder.processed;
            holder.init(e);
            if (holder.skipAllways(e)) {
              return true;
            }
            if (processed) {
              e.preventDefault();
              return false;
            }
            if (holder.processAllways() || holder.processKeypress()) {
              holder.formatQuick();
              e.preventDefault();
              return false;
            }
            holder.formatted = false;
          });
          $this.on("keyup.autoNumeric", function (e) {
            holder = getHolder($this);
            holder.init(e);
            var skip = holder.skipAllways(e);
            holder.kdCode = 0;
            delete holder.valuePartsBeforePaste;
            if ($this[0].value === holder.settings.aSign) {
              if (holder.settings.pSign === "s") {
                setElementSelection(this, 0, 0);
              } else {
                setElementSelection(
                  this,
                  holder.settings.aSign.length,
                  holder.settings.aSign.length
                );
              }
            }
            if (skip) {
              return true;
            }
            if (this.value === "") {
              return true;
            }
            if (!holder.formatted) {
              holder.formatQuick();
            }
          });
          $this.on("focusin.autoNumeric", function () {
            holder = getHolder($this);
            var $settings = holder.settingsClone;
            $settings.hasFocus = true;
            if ($settings.nBracket !== null) {
              var checkVal = $this.val();
              $this.val(negativeBracket(checkVal, $settings));
            }
            holder.inVal = $this.val();
            var onEmpty = checkEmpty(holder.inVal, $settings, true);
            if (onEmpty !== null && onEmpty !== "") {
              $this.val(onEmpty);
            }
          });
          $this.on("focusout.autoNumeric", function () {
            holder = getHolder($this);
            var $settings = holder.settingsClone,
              value = $this.val(),
              origValue = value;
            $settings.hasFocus = false;
            var strip_zero = "";
            if ($settings.lZero === "allow") {
              $settings.allowLeading = false;
              strip_zero = "leading";
            }
            if (value !== "") {
              value = autoStrip(value, $settings, strip_zero);
              if (
                checkEmpty(value, $settings) === null &&
                autoCheck(value, $settings, $this[0])
              ) {
                value = fixNumber(value, $settings.aDec, $settings.aNeg);
                value = autoRound(value, $settings);
                value = presentNumber(value, $settings.aDec, $settings.aNeg);
              } else {
                value = "";
              }
            }
            var groupedValue = checkEmpty(value, $settings, false);
            if (groupedValue === null) {
              groupedValue = autoGroup(value, $settings);
            }
            if (groupedValue !== holder.inVal || groupedValue !== origValue) {
              $this.val(groupedValue);
              $this.change();
              delete holder.inVal;
            }
          });
        }
      });
    },
    destroy: function () {
      return $(this).each(function () {
        var $this = $(this);
        $this.removeData("autoNumeric");
        $this.off("autoNumeric");
      });
    },
    update: function (options) {
      return $(this).each(function () {
        var $this = autoGet($(this)),
          settings = $this.data("autoNumeric");
        if (typeof settings !== "object") {
          $.error(
            "You must initialize autoNumeric('init', {options}) prior to calling the 'update' method"
          );
        }
        var strip = $this.autoNumeric("get");
        settings = $.extend(settings, options);
        getHolder($this, settings, true);
        if (settings.aDec === settings.aSep) {
          $.error(
            "autoNumeric will not function properly when the decimal character aDec: '" +
              settings.aDec +
              "' and thousand separator aSep: '" +
              settings.aSep +
              "' are the same character"
          );
        }
        $this.data("autoNumeric", settings);
        if ($this.val() !== "" || $this.text() !== "") {
          return $this.autoNumeric("set", strip);
        }
        return;
      });
    },
    set: function (valueIn) {
      if (valueIn === null || isNaN(valueIn)) {
        return;
      }
      return $(this).each(function () {
        var $this = autoGet($(this)),
          settings = $this.data("autoNumeric"),
          value = valueIn.toString(),
          testValue = valueIn.toString(),
          $input = $this.is(
            "input[type=text], input[type=hidden], input[type=tel], input:not([type])"
          );
        if (typeof settings !== "object") {
          $.error(
            "You must initialize autoNumeric('init', {options}) prior to calling the 'set' method"
          );
        }
        if (
          (testValue === $this.attr("value") || testValue === $this.text()) &&
          settings.runOnce === false
        ) {
          value = value.replace(",", ".");
        }
        if (!$.isNumeric(+value)) {
          $.error(
            "The value (" +
              value +
              ") being 'set' is not numeric and has caused a error to be thrown"
          );
        }
        value = checkValue(value, settings);
        settings.setEvent = true;
        value.toString();
        if (value !== "") {
          value = autoRound(value, settings);
        }
        value = presentNumber(value, settings.aDec, settings.aNeg);
        if (!autoCheck(value, settings)) {
          value = autoRound("", settings);
        }
        value = autoGroup(value, settings);
        if ($input) {
          return $this.val(value);
        }
        if (
          $.inArray($this.prop("tagName").toLowerCase(), settings.tagList) !==
          -1
        ) {
          return $this.text(value);
        }
        return false;
      });
    },
    get: function () {
      var $this = autoGet($(this)),
        settings = $this.data("autoNumeric");
      if (typeof settings !== "object") {
        $.error(
          "You must initialize autoNumeric('init', {options}) prior to calling the 'get' method"
        );
      }
      var getValue = "";
      if (
        $this.is(
          "input[type=text], input[type=hidden], input[type=tel], input:not([type])"
        )
      ) {
        getValue = $this.eq(0).val();
      } else if (
        $.inArray($this.prop("tagName").toLowerCase(), settings.tagList) !== -1
      ) {
        getValue = $this.eq(0).text();
      } else {
        $.error(
          "The <" +
            $this.prop("tagName").toLowerCase() +
            "> is not supported by autoNumeric()"
        );
      }
      if (
        (getValue === "" && settings.wEmpty === "empty") ||
        (getValue === settings.aSign &&
          (settings.wEmpty === "sign" || settings.wEmpty === "empty"))
      ) {
        return "";
      }
      if (getValue !== "" && settings.nBracket !== null) {
        settings.removeBrackets = true;
        getValue = negativeBracket(getValue, settings);
        settings.removeBrackets = false;
      }
      if (settings.runOnce || settings.aForm === false) {
        getValue = autoStrip(getValue, settings);
      }
      getValue = fixNumber(getValue, settings.aDec, settings.aNeg);
      if (+getValue === 0 && settings.lZero !== "keep") {
        getValue = "0";
      }
      if (settings.lZero === "keep") {
        return getValue;
      }
      getValue = checkValue(getValue, settings);
      return getValue;
    },
    getString: function () {
      var isAutoNumeric = false,
        $this = autoGet($(this)),
        formFields = $this.serialize(),
        formParts = formFields.split("&"),
        formIndex = $("form").index($this),
        allFormElements = $("form:eq(" + formIndex + ")"),
        aiIndex = [],
        scIndex = [],
        rsubmit1terTypes = /^(?:submit1|button|image|reset|file)$/i,
        rsubmit1table = /^(?:input|select|textarea|keygen)/i,
        rcheckableType = /^(?:checkbox|radio)$/i,
        rnonAutoNumericTypes =
          /^(?:button|checkbox|color|date|datetime|datetime-local|email|file|image|month|number|password|radio|range|reset|search|submit1|time|url|week)/i,
        count = 0;
      $.each(allFormElements[0], function (i, field) {
        if (
          field.name !== "" &&
          rsubmit1table.test(field.localName) &&
          !rsubmit1terTypes.test(field.type) &&
          !field.disabled &&
          (field.checked || !rcheckableType.test(field.type))
        ) {
          scIndex.push(count);
          count = count + 1;
        } else {
          scIndex.push(-1);
        }
      });
      count = 0;
      $.each(allFormElements[0], function (i, field) {
        if (
          field.localName === "input" &&
          (field.type === "" ||
            field.type === "text" ||
            field.type === "hidden" ||
            field.type === "tel")
        ) {
          aiIndex.push(count);
          count = count + 1;
        } else {
          aiIndex.push(-1);
          if (
            field.localName === "input" &&
            rnonAutoNumericTypes.test(field.type)
          ) {
            count = count + 1;
          }
        }
      });
      $.each(formParts, function (i, miniParts) {
        miniParts = formParts[i].split("=");
        var scElement = $.inArray(i, scIndex);
        if (scElement > -1 && aiIndex[scElement] > -1) {
          var testInput = $(
              "form:eq(" + formIndex + ") input:eq(" + aiIndex[scElement] + ")"
            ),
            settings = testInput.data("autoNumeric");
          if (typeof settings === "object") {
            if (miniParts[1] !== null) {
              miniParts[1] = $(
                "form:eq(" +
                  formIndex +
                  ") input:eq(" +
                  aiIndex[scElement] +
                  ")"
              )
                .autoNumeric("get")
                .toString();
              formParts[i] = miniParts.join("=");
              isAutoNumeric = true;
            }
          }
        }
      });
      if (!isAutoNumeric) {
        $.error(
          "You must initialize autoNumeric('init', {options}) prior to calling the 'getString' method"
        );
      }
      return formParts.join("&");
    },
    getArray: function () {
      var isAutoNumeric = false,
        $this = autoGet($(this)),
        formFields = $this.serializeArray(),
        formIndex = $("form").index($this),
        allFormElements = $("form:eq(" + formIndex + ")"),
        aiIndex = [],
        scIndex = [],
        rsubmit1terTypes = /^(?:submit1|button|image|reset|file)$/i,
        rsubmit1table = /^(?:input|select|textarea|keygen)/i,
        rcheckableType = /^(?:checkbox|radio)$/i,
        rnonAutoNumericTypes =
          /^(?:button|checkbox|color|date|datetime|datetime-local|email|file|image|month|number|password|radio|range|reset|search|submit1|time|url|week)/i,
        count = 0;
      $.each(allFormElements[0], function (i, field) {
        if (
          field.name !== "" &&
          rsubmit1table.test(field.localName) &&
          !rsubmit1terTypes.test(field.type) &&
          !field.disabled &&
          (field.checked || !rcheckableType.test(field.type))
        ) {
          scIndex.push(count);
          count = count + 1;
        } else {
          scIndex.push(-1);
        }
      });
      count = 0;
      $.each(allFormElements[0], function (i, field) {
        if (
          field.localName === "input" &&
          (field.type === "" ||
            field.type === "text" ||
            field.type === "hidden" ||
            field.type === "tel")
        ) {
          aiIndex.push(count);
          count = count + 1;
        } else {
          aiIndex.push(-1);
          if (
            field.localName === "input" &&
            rnonAutoNumericTypes.test(field.type)
          ) {
            count = count + 1;
          }
        }
      });
      $.each(formFields, function (i, field) {
        var scElement = $.inArray(i, scIndex);
        if (scElement > -1 && aiIndex[scElement] > -1) {
          var testInput = $(
              "form:eq(" + formIndex + ") input:eq(" + aiIndex[scElement] + ")"
            ),
            settings = testInput.data("autoNumeric");
          if (typeof settings === "object") {
            field.value = $(
              "form:eq(" + formIndex + ") input:eq(" + aiIndex[scElement] + ")"
            )
              .autoNumeric("get")
              .toString();
            isAutoNumeric = true;
          }
        }
      });
      if (!isAutoNumeric) {
        $.error(
          "None of the successful form inputs are initialized by autoNumeric."
        );
      }
      return formFields;
    },
    getSettings: function () {
      var $this = autoGet($(this));
      return $this.eq(0).data("autoNumeric");
    },
  };
  $.fn.autoNumeric = function (method) {
    if (methods[method]) {
      return methods[method].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
    }
    if (typeof method === "object" || !method) {
      return methods.init.apply(this, arguments);
    }
    $.error('Method "' + method + '" is not supported by autoNumeric()');
  };
  $.fn.autoNumeric.defaults = {
    aSep: ",",
    dGroup: "3",
    aDec: ".",
    altDec: null,
    aSign: "",
    pSign: "p",
    vMax: "9999999999999.99",
    vMin: "-9999999999999.99",
    mDec: null,
    mRound: "S",
    aPad: true,
    nBracket: null,
    wEmpty: "empty",
    lZero: "allow",
    sNumber: true,
    aForm: true,
    anDefault: null,
  };
});
(function ($) {
  $.fn.appear = function (fn, options) {
    var settings = $.extend({ data: undefined, one: true }, options);
    return this.each(function () {
      var t = $(this);
      t.appeared = false;
      if (!fn) {
        t.trigger("appear", settings.data);
        return;
      }
      var w = settings.container ? $(settings.container) : $(window);
      if (settings.container) {
        w.data("customContainer", true);
      }
      var check = function () {
        if (!t.is(":visible")) {
          t.appeared = false;
          return;
        }
        var a = w.scrollLeft();
        var b = w.scrollTop();
        var wh = w.height();
        var ww = w.width();
        var o = t.offset();
        if (w.data("customContainer")) {
          var cOffset = w.offset();
          var x = o.left - cOffset.left + a;
          var y = o.top - cOffset.top + b;
        } else {
          var x = o.left;
          var y = o.top;
        }
        if (
          y + t.height() >= b &&
          y <= b + wh &&
          x + t.width() >= a &&
          x <= a + ww
        ) {
          if (!t.appeared) t.trigger("appear", settings.data);
        } else {
          t.appeared = false;
        }
      };
      var modifiedFn = function () {
        t.appeared = true;
        if (settings.one) {
          w.unbind("scroll", check);
          var i = $.inArray(check, $.fn.appear.checks);
          if (i >= 0) $.fn.appear.checks.splice(i, 1);
        }
        fn.apply(this, arguments);
      };
      if (settings.one) t.one("appear", settings.data, modifiedFn);
      else t.bind("appear", settings.data, modifiedFn);
      w.scroll(check);
      $.fn.appear.checks.push(check);
      check();
    });
  };
  $.extend($.fn.appear, {
    checks: [],
    timeout: null,
    checkAll: function () {
      var length = $.fn.appear.checks.length;
      if (length > 0) while (length--) $.fn.appear.checks[length]();
    },
    run: function () {
      if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
      $.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
    },
  });
  $.each(
    [
      "append",
      "prepend",
      "after",
      "before",
      "attr",
      "removeAttr",
      "addClass",
      "removeClass",
      "toggleClass",
      "remove",
      "css",
      "show",
      "hide",
    ],
    function (i, n) {
      var old = $.fn[n];
      if (old) {
        $.fn[n] = function () {
          var r = old.apply(this, arguments);
          $.fn.appear.run();
          return r;
        };
      }
    }
  );
})(jQuery);
(function (a) {
  (a.tools = a.tools || { version: "v1.2.7" }),
    (a.tools.tooltip = {
      conf: {
        effect: "toggle",
        fadeOutSpeed: "fast",
        predelay: 0,
        delay: 30,
        opacity: 1,
        tip: 0,
        fadeIE: !1,
        position: ["top", "center"],
        offset: [0, 0],
        relative: !1,
        cancelDefault: !0,
        events: {
          def: "mouseenter,mouseleave",
          input: "focus,blur",
          widget: "focus mouseenter,blur mouseleave",
          tooltip: "mouseenter,mouseleave",
        },
        layout: "<div/>",
        tipClass: "tooltip",
      },
      addEffect: function (a, c, d) {
        b[a] = [c, d];
      },
    });
  var b = {
    toggle: [
      function (a) {
        var b = this.getConf(),
          c = this.getTip(),
          d = b.opacity;
        d < 1 && c.css({ opacity: d }), c.show(), a.call();
      },
      function (a) {
        this.getTip().hide(), a.call();
      },
    ],
    fade: [
      function (b) {
        var c = this.getConf();
        !a.browser.msie || c.fadeIE
          ? this.getTip().fadeTo(c.fadeInSpeed, c.opacity, b)
          : (this.getTip().show(), b());
      },
      function (b) {
        var c = this.getConf();
        !a.browser.msie || c.fadeIE
          ? this.getTip().fadeOut(c.fadeOutSpeed, b)
          : (this.getTip().hide(), b());
      },
    ],
  };
  function c(b, c, d) {
    var e = d.relative ? b.position().top : b.offset().top,
      f = d.relative ? b.position().left : b.offset().left,
      g = d.position[0];
    (e -= c.outerHeight() - d.offset[0]), (f += b.outerWidth() + d.offset[1]);
    var h = c.outerHeight() + b.outerHeight();
    g == "center" && (e += h / 2),
      g == "bottom" && (e += h),
      (g = d.position[1]);
    var i = c.outerWidth() + b.outerWidth();
    g == "center" && (f -= i / 2), g == "left" && (f -= i);
    return { top: e, left: f };
  }
  function d(d, e) {
    var f = this,
      g = d.add(f),
      h,
      i = 0,
      j = 0,
      k = d.attr("title"),
      l = d.attr("data-tooltip"),
      m = b[e.effect],
      n,
      o = d.is(":input"),
      p = o && d.is(":checkbox, :radio, select, :button, :submit1"),
      q = d.attr("type"),
      r = e.events[q] || e.events[o ? (p ? "widget" : "input") : "def"];
    if (!m) throw 'Nonexistent effect "' + e.effect + '"';
    r = r.split(/,\s*/);
    if (r.length != 2) throw "Tooltip: bad events configuration for " + q;
    d
      .on(r[0], function (a) {
        clearTimeout(i),
          e.predelay
            ? (j = setTimeout(function () {
                f.show(a);
              }, e.predelay))
            : f.show(a);
      })
      .on(r[1], function (a) {
        clearTimeout(j),
          e.delay
            ? (i = setTimeout(function () {
                f.hide(a);
              }, e.delay))
            : f.hide(a);
      }),
      k && e.cancelDefault && (d.removeAttr("title"), d.data("title", k)),
      a.extend(f, {
        show: function (b) {
          if (!h) {
            l
              ? (h = a(l))
              : e.tip
              ? (h = a(e.tip).eq(0))
              : k
              ? (h = a(e.layout)
                  .addClass(e.tipClass)
                  .appendTo(document.body)
                  .hide()
                  .append(k))
              : ((h = d.next()), h.length || (h = d.parent().next()));
            if (!h.length) throw "Cannot find tooltip for " + d;
          }
          if (f.isShown()) return f;
          h.stop(!0, !0);
          var o = c(d, h, e);
          e.tip && h.html(d.data("title")),
            (b = a.Event()),
            (b.type = "onBeforeShow"),
            g.trigger(b, [o]);
          if (b.isDefaultPrevented()) return f;
          (o = c(d, h, e)),
            h.css({ position: "absolute", top: o.top, left: o.left }),
            (n = !0),
            m[0].call(f, function () {
              (b.type = "onShow"), (n = "full"), g.trigger(b);
            });
          var p = e.events.tooltip.split(/,\s*/);
          h.data("__set") ||
            (h.off(p[0]).on(p[0], function () {
              clearTimeout(i), clearTimeout(j);
            }),
            p[1] &&
              !d.is("input:not(:checkbox, :radio), textarea") &&
              h.off(p[1]).on(p[1], function (a) {
                a.relatedTarget != d[0] && d.trigger(r[1].split(" ")[0]);
              }),
            e.tip || h.data("__set", !0));
          return f;
        },
        hide: function (c) {
          if (!h || !f.isShown()) return f;
          (c = a.Event()), (c.type = "onBeforeHide"), g.trigger(c);
          if (!c.isDefaultPrevented()) {
            (n = !1),
              b[e.effect][1].call(f, function () {
                (c.type = "onHide"), g.trigger(c);
              });
            return f;
          }
        },
        isShown: function (a) {
          return a ? n == "full" : n;
        },
        getConf: function () {
          return e;
        },
        getTip: function () {
          return h;
        },
        getTrigger: function () {
          return d;
        },
      }),
      a.each(
        "onHide,onBeforeShow,onShow,onBeforeHide".split(","),
        function (b, c) {
          a.isFunction(e[c]) && a(f).on(c, e[c]),
            (f[c] = function (b) {
              b && a(f).on(c, b);
              return f;
            });
        }
      );
  }
  a.fn.tooltip = function (b) {
    var c = this.data("tooltip");
    if (c) return c;
    (b = a.extend(!0, {}, a.tools.tooltip.conf, b)),
      typeof b.position == "string" && (b.position = b.position.split(/,?\s/)),
      this.each(function () {
        (c = new d(a(this), b)), a(this).data("tooltip", c);
      });
    return b.api ? c : this;
  };
})(jQuery);
(function (a) {
  var b = a.tools.tooltip;
  b.dynamic = { conf: { classNames: "top right bottom left" } };
  function c(b) {
    var c = a(window),
      d = c.width() + c.scrollLeft(),
      e = c.height() + c.scrollTop();
    return [
      b.offset().top <= c.scrollTop(),
      d <= b.offset().left + b.width(),
      e <= b.offset().top + b.height(),
      c.scrollLeft() >= b.offset().left,
    ];
  }
  function d(a) {
    var b = a.length;
    while (b--) if (a[b]) return !1;
    return !0;
  }
  a.fn.dynamic = function (e) {
    typeof e == "number" && (e = { speed: e }),
      (e = a.extend({}, b.dynamic.conf, e));
    var f = a.extend(!0, {}, e),
      g = e.classNames.split(/\s/),
      h;
    this.each(function () {
      var b = a(this)
        .tooltip()
        .onBeforeShow(function (b, e) {
          var i = this.getTip(),
            j = this.getConf();
          h ||
            (h = [
              j.position[0],
              j.position[1],
              j.offset[0],
              j.offset[1],
              a.extend({}, j),
            ]),
            a.extend(j, h[4]),
            (j.position = [h[0], h[1]]),
            (j.offset = [h[2], h[3]]),
            i
              .css({
                visibility: "hidden",
                position: "absolute",
                top: e.top,
                left: e.left,
              })
              .show();
          var k = a.extend(!0, {}, f),
            l = c(i);
          if (!d(l)) {
            l[2] &&
              (a.extend(j, k.top), (j.position[0] = "top"), i.addClass(g[0])),
              l[3] &&
                (a.extend(j, k.right),
                (j.position[1] = "right"),
                i.addClass(g[1])),
              l[0] &&
                (a.extend(j, k.bottom),
                (j.position[0] = "bottom"),
                i.addClass(g[2])),
              l[1] &&
                (a.extend(j, k.left),
                (j.position[1] = "left"),
                i.addClass(g[3]));
            if (l[0] || l[2]) j.offset[0] *= -1;
            if (l[1] || l[3]) j.offset[1] *= -1;
          }
          i.css({ visibility: "visible" }).hide();
        });
      b.onBeforeShow(function () {
        var a = this.getConf(),
          b = this.getTip();
        setTimeout(function () {
          (a.position = [h[0], h[1]]), (a.offset = [h[2], h[3]]);
        }, 0);
      }),
        b.onHide(function () {
          var a = this.getTip();
          a.removeClass(e.classNames);
        }),
        (ret = b);
    });
    return e.api ? ret : this;
  };
})(jQuery);
(function (a) {
  var b = a.tools.tooltip;
  a.extend(b.conf, {
    direction: "up",
    bounce: !1,
    slideOffset: 10,
    slideInSpeed: 200,
    slideOutSpeed: 200,
    slideFade: !a.browser.msie,
  });
  var c = {
    up: ["-", "top"],
    down: ["+", "top"],
    left: ["-", "left"],
    right: ["+", "left"],
  };
  b.addEffect(
    "slide",
    function (a) {
      var b = this.getConf(),
        d = this.getTip(),
        e = b.slideFade ? { opacity: b.opacity } : {},
        f = c[b.direction] || c.up;
      (e[f[1]] = f[0] + "=" + b.slideOffset),
        b.slideFade && d.css({ opacity: 0 }),
        d.show().animate(e, b.slideInSpeed, a);
    },
    function (b) {
      var d = this.getConf(),
        e = d.slideOffset,
        f = d.slideFade ? { opacity: 0 } : {},
        g = c[d.direction] || c.up,
        h = "" + g[0];
      d.bounce && (h = h == "+" ? "-" : "+"),
        (f[g[1]] = h + "=" + e),
        this.getTip().animate(f, d.slideOutSpeed, function () {
          a(this).hide(), b.call();
        });
    }
  );
})(jQuery);
(function (_, $) {
  $.widget("ui.dialog", $.ui.dialog, {
    _allowInteraction: function _allowInteraction(event) {
      if (this._super(event)) {
        return true;
      }
      if (event.target.ownerDocument != this.document[0]) {
        return true;
      }
      if ($(event.target).closest(".ui-draggable").length) {
        return true;
      }
      if ($(event.target).closest(".cke").length) {
        return true;
      }
    },
    _moveToTop: function _moveToTop(event, silent) {
      if (!event || !this.options.modal) {
        this._super(event, silent);
      }
    },
  });
  var methods = {
    _getEditor: function _getEditor(elm) {
      var obj = $("#" + elm.prop("id"));
      if (obj.data("redactor")) {
        return obj;
      }
      return false;
    },
  };
  $.ceEditor("handlers", {
    editorName: "redactor2",
    params: null,
    elms: [],
    run: function run(elm, params) {
      var support_langs = {
        de: { path: "js/lib/redactor2/lang/de.js" },
        en: { path: "js/lib/redactor2/lang/en.js" },
        es: { path: "js/lib/redactor2/lang/es.js" },
        fa: { path: "js/lib/redactor2/lang/fa.js" },
        fi: { path: "js/lib/redactor2/lang/fi.js" },
        fr: { path: "js/lib/redactor2/lang/fr.js" },
        he: { path: "js/lib/redactor2/lang/he.js" },
        hu: { path: "js/lib/redactor2/lang/hu.js" },
        it: { path: "js/lib/redactor2/lang/it.js" },
        ja: { path: "js/lib/redactor2/lang/ja.js" },
        ko: { path: "js/lib/redactor2/lang/ko.js" },
        nl: { path: "js/lib/redactor2/lang/nl.js" },
        pl: { path: "js/lib/redactor2/lang/pl.js" },
        pt: { path: "js/lib/redactor2/lang/pt_br.js", lang_code_full: "pt_br" },
        ru: { path: "js/tygh/wysiwyg_plugins/langs/redactor2/ru.js" },
        sv: { path: "js/lib/redactor2/lang/sv.js" },
        tr: { path: "js/lib/redactor2/lang/tr.js" },
        zh: { path: "js/lib/redactor2/lang/zh_cn.js", lang_code_full: "zh_cn" },
      };
      var lang_code = fn_get_listed_lang(Object.keys(support_langs)),
        lang_code_full = support_langs[lang_code].lang_code_full || lang_code,
        lang_route = support_langs[lang_code].path;
      var isBlockManagerEnabled = elm.data("caIsBlockManagerEnabled");
      if (typeof $.fn.redactor == "undefined") {
        $.ceEditor("state", "loading");
        $.loadCss(["js/lib/redactor2/redactor.min.css"]);
        $.loadCss(["js/lib/redactor2/plugins/alignment/alignment.css"]);
        $.loadCss(["js/lib/elfinder/css/elfinder.min.css"]);
        $.loadCss(["js/lib/elfinder/css/theme.css"]);
        $.getScript("js/lib/elfinder/js/elfinder.min.js");
        var pluginsQueue = [
          "js/lib/redactor2/plugins/fontcolor/fontcolor.js",
          "js/lib/redactor2/plugins/table/table.js",
          "js/lib/redactor2/plugins/imageupload/imageupload.js",
          "js/lib/redactor2/plugins/source/source.js",
          "js/lib/redactor2/plugins/alignment/alignment.js",
          "js/lib/redactor2/plugins/video/video.js",
        ];
        if (isBlockManagerEnabled) {
          pluginsQueue.push(
            "js/tygh/wysiwyg_plugins/block_manager/redactor2.js"
          );
        }
        if (lang_code !== "en") {
          pluginsQueue.push(lang_route);
        }
        var pluginsLoadedCount = 0;
        $.getScript("js/lib/redactor2/redactor.min.js", function () {
          for (var i in pluginsQueue) {
            $.getScript(pluginsQueue[i], function () {
              pluginsLoadedCount++;
              if (pluginsLoadedCount === pluginsQueue.length) {
                callback();
              }
            });
          }
        });
        var callback = function callback() {
          $.ceEditor("state", "loaded");
          elm.ceEditor("run", params);
        };
        return true;
      }
      if (!this.params) {
        this.params = {
          lang: lang_code_full,
          removeComments: false,
          replaceTags: false,
          overrideStyles: true,
        };
        this.params.direction = _.language_direction;
      }
      if (typeof params !== "undefined" && params[this.editorName]) {
        $.extend(this.params, params[this.editorName]);
      }
      this.params.callbacks = {
        init: function init() {
          $(".redactor-toolbar-tooltip").each(function () {
            $(this).css("z-index", 50001);
          });
          $(".redactor-box").addClass("redactor2-box");
        },
        modalOpened: function modalOpened() {
          $(
            "#redactor-modal-overlay, #redactor-modal-box, #redactor-modal, .redactor-dropdown"
          ).each(function () {
            $(this).css("z-index", 50001, "important");
          });
        },
        dropdownShow: function dropdownShow() {
          $(
            "#redactor-modal-overlay, #redactor-modal-box, #redactor-modal, .redactor-dropdown"
          ).each(function () {
            $(this).css("z-index", 50001, "important");
          });
        },
        changeCallback: function changeCallback(html) {
          elm.ceEditor("changed", html);
        },
      };
      this.params.plugins = ["alignment", "fontcolor", "table", "source"];
      this.params.buttons = [
        "source",
        "format",
        "bold",
        "italic",
        "deleted",
        "lists",
        "video",
        "table",
        "link",
        "alignment",
        "horizontalrule",
      ];
      if (_.area === "A" || _.live_editor_mode === true) {
        this.params.plugins.push("imageupload", "video");
        if (isBlockManagerEnabled) {
          this.params.plugins.push("blockManager");
        }
      }
      this.params.imageResizable = true;
      this.params.imageCaption = false;
      this.params.imagePosition = true;
      this.params.keepStyleAttr = ["*"];
      elm.redactor(this.params);
      elm.get(0).defaultValue = elm.get(0).value;
      var $parent = elm.parent();
      $parent.find("textarea:not([name])").addClass("cm-skip-check-item");
      if (elm.prop("disabled")) {
        elm.ceEditor("disable", true);
      }
      this.elms.push(elm.get(0));
      return true;
    },
    destroy: function destroy(elm) {
      var ed = methods._getEditor(elm);
      if (ed) {
        ed.redactor("core.destroy");
      }
    },
    recover: function recover(elm) {
      if ($.inArray(elm.get(0), this.elms) !== -1) {
        $.ceEditor("run", elm);
      }
    },
    val: function val(elm, value) {
      var ed = methods._getEditor(elm);
      if (!ed) {
        return false;
      }
      if (typeof value == "undefined") {
        return ed.redactor("code.get");
      } else {
        ed.redactor("code.set", value);
      }
      return true;
    },
    updateTextFields: function updateTextFields(elm) {
      return true;
    },
    insert: function insert(elm, text) {
      var ed = methods._getEditor(elm);
      if (ed) {
        ed.redactor("selection.restore");
        ed.redactor("insert.text", text);
      }
    },
    disable: function disable(elm, value) {
      var ed = methods._getEditor(elm);
      if (ed) {
        var obj = ed.redactor("core.getBox");
        if (value == true) {
          if (!$(obj).parent().hasClass("disable-overlay-wrap")) {
            $(obj).wrap(
              "<div class='disable-overlay-wrap wysiwyg-overlay'></div>"
            );
            $(obj).before(
              "<div id='" +
                elm.prop("id") +
                "_overlay' class='disable-overlay'></div>"
            );
            elm.prop("disabled", true);
          }
        } else {
          $(obj).unwrap();
          $("#" + elm.prop("id") + "_overlay").remove();
          elm.prop("disabled", false);
        }
      }
    },
  });
})(Tygh, Tygh.$);
(function (_, $) {
  var breakpoints = { tablet: 767, phone: 479 };
  var ui = (function () {
    return {
      winWidth: function winWidth() {
        return $(window).width();
      },
      responsiveScroll: function responsiveScroll() {
        this.needScrollInited = this.needScrollInited || false;
        if (this.needScrollInited) {
          return;
        }
        this.needScrollInited = true;
        $.ceEvent("on", "ce.needScroll", function (opt) {
          opt.timeout = 310;
        });
      },
      responsiveTabs: function responsiveTabs() {
        if (ui.winWidth() <= breakpoints.phone + 1) {
          var accordionOptions = {
            animate: $(_.body).data("caAccordionAnimateDelay") || 300,
            heightStyle: "content",
            activate: function activate(event, ui) {
              var selectedItem = $(ui.newHeader);
              if (!selectedItem.length) return;
              var tabId = selectedItem.prop("id");
              var isActiveScrollToElm = ui.newPanel.data(
                "caAccordionIsActiveScrollToElm"
              );
              if (isActiveScrollToElm) {
                $.scrollToElm(selectedItem);
              }
              selectedItem.addClass("active");
              if (tabId) {
                $.ceEvent("trigger", "ce.tab.show", [tabId, $(this)]);
              }
            },
          };
          $(".cm-j-tabs:not(.cm-j-tabs-disable-convertation)").each(function (
            index
          ) {
            var accordion = $(
              '<div class="ty-accordion cm-accordion" id="accordion_id_' +
                index +
                '">'
            );
            var tabsContent = $(this)
              .nextAll(
                ".cm-tabs-content:not(.cm-j-content-disable-convertation)"
              )
              .first();
            var self = this;
            $(this).hide();
            tabsContent.hide();
            if (!$("#accordion_id_" + index).length) {
              $(this)
                .find(">ul>li")
                .each(function (indexTab) {
                  var id = $(this).attr("id");
                  if ($(this).hasClass("active")) {
                    accordionOptions.active = indexTab;
                  }
                  var content = $("> #content_" + id, tabsContent).show();
                  $(this).attr("id", "hidden_tab_" + id);
                  accordion.append(
                    '<h3 id="' + id + '">' + $(this).text() + "</h3>"
                  );
                  $(content).appendTo(accordion);
                });
              $(self).before(accordion);
            }
          });
          $(".cm-accordion").ceAccordion("reinit", accordionOptions);
          var active = _.anchor;
          if (typeof active !== "undefined" && $(active).length > 0) {
            $(active).click();
          }
        } else {
          $(".cm-accordion").accordion("destroy");
          $(".cm-accordion > div").each(function (index) {
            var $tabsContent = $(this)
              .parent()
              .nextAll(
                ".cm-tabs-content:not(.cm-j-content-disable-convertation)"
              )
              .first();
            $(this).hide();
            $(this).appendTo($tabsContent);
          });
          $(".cm-accordion").remove();
          $(".cm-j-tabs>ul>li").each(function () {
            var $tabs = $(this).closest(".cm-j-tabs");
            var $tabsContent = $tabs
              .nextAll(
                ".cm-tabs-content:not(.cm-j-content-disable-convertation)"
              )
              .first();
            var id = $(this).attr("id").replace("hidden_tab_", "");
            $(this).attr("id", id);
            var $content = $tabsContent.find("#content_" + id);
            $content.css("display", "");
          });
          $(".cm-j-tabs, .cm-tabs-content").show();
        }
      },
      responsiveMenu: function responsiveMenu(elms) {
        var whichEvent =
          "ontouch" in document.documentElement ? "touch" : "click";
        if (_.isTouch && window.navigator.msPointerEnabled) {
          whichEvent = "click";
        }
        if (_.isTouch == false && ui.winWidth() >= breakpoints.tablet) {
          $(".cm-responsive-menu").on("mouseover mouseout", function (e) {
            ui.detectMenuWidth(e);
          });
        }
        if ($("html").data("caResponsiveMenu")) {
          return;
        }
        $(_.doc).on(
          whichEvent,
          ".cm-responsive-menu-toggle-main",
          function (e) {
            e.preventDefault();
            $(this)
              .parent(".cm-responsive-menu")
              .find(".cm-menu-item-responsive")
              .toggle();
          }
        );
        $(_.doc).on(whichEvent, ".cm-responsive-menu-toggle", function (e) {
          e.preventDefault();
          $(this).toggleClass("ty-menu__item-toggle-active");
          $(this)
            .parent()
            .find(".cm-responsive-menu-submenu")
            .first()
            .toggleClass("ty-menu__items-show");
        });
        $("html").data("caResponsiveMenu", true);
      },
      responsiveMenuLargeTouch: function responsiveMenuLargeTouch(e) {
        var elm = $(e.target);
        var menuWidth = $(".cm-responsive-menu").width();
        if (ui.winWidth() >= breakpoints.tablet && e.type == "touchstart") {
          if (elm.is(".ty-menu__submenu-link")) {
            elm.click();
          }
          var menuItem = elm.hasClass("cm-menu-item-responsive")
            ? elm
            : elm.closest(".cm-menu-item-responsive");
          if (
            !menuItem.hasClass("is-hover-menu") &&
            menuItem.find(".ty-menu__submenu-items").length > 0
          ) {
            e.preventDefault();
            menuItem
              .siblings(".cm-menu-item-responsive")
              .removeClass("is-hover-menu");
            menuItem.addClass("is-hover-menu");
          }
          var subMenu = $(".ty-menu__submenu-items");
          if (
            subMenu.is(":visible") &&
            !elm.closest(".cm-menu-item-responsive").length
          ) {
            $(".cm-menu-item-responsive").removeClass("is-hover-menu");
          }
        } else {
          $(".cm-menu-item-responsive").removeClass("is-hover-menu");
        }
        ui.detectMenuWidth(e);
      },
      detectMenuWidth: function detectMenuWidth(e) {
        var $self = $(e.target),
          $menuItem = $self.closest(".cm-menu-item-responsive"),
          $menuItemSubmenu = $(
            ".cm-responsive-menu-submenu",
            $menuItem
          ).first(),
          $menu = $self.parents(".cm-responsive-menu");
        var verticalMenuClassName = "ty-menu-vertical",
          reverseDirectionClassName = "ty-menu__submenu-reverse-direction",
          isHorizontal = !$menu.parent().hasClass(verticalMenuClassName);
        if (!isHorizontal || !$menuItemSubmenu.length || !$menuItem.length) {
          return false;
        }
        var menuWidth = $menu.outerWidth(),
          itemWidth = $menuItem.outerWidth(),
          menuItemSubmenuWidth = _getSubmenuOriginWidth($menuItemSubmenu);
        $("." + reverseDirectionClassName).removeClass(
          reverseDirectionClassName
        );
        if ($menuItem.index() / $menu.children().length > 0.5) {
          var _offset = Math.abs(
            _.language_direction == "rtl"
              ? $menuItem.offset().left +
                  itemWidth -
                  ($menu.offset().left + menuWidth)
              : $menuItem.offset().left - $menu.offset().left
          );
          $menuItemSubmenu.toggleClass(
            reverseDirectionClassName,
            menuWidth - itemWidth * 2 < menuItemSubmenuWidth + itemWidth ||
              _offset + menuItemSubmenuWidth > menuWidth
          );
        }
        function _getSubmenuOriginWidth($submenu) {
          $submenu.css("left", 0);
          var _width = $submenu.outerWidth() || 0;
          $submenu.get(0).style.left = "";
          return _width;
        }
      },
      responsiveTables: function responsiveTables(e) {
        var tables = $(".ty-table");
        if (ui.winWidth() <= breakpoints.tablet) {
          tables.each(function () {
            var thTexts = [];
            var subTable = $(this).find(".ty-table");
            if (subTable.length) {
              var subTableStack = [];
              subTable.each(function (index) {
                $(this)
                  .parent()
                  .attr("data-ca-has-sub-table_" + index, "true");
                subTableStack.push($(this).detach());
              });
            }
            $(this)
              .find("th:not(.ty-table-disable-convertation)")
              .each(function () {
                thTexts.push($(this).text());
              });
            $(this)
              .find("tr:not(.ty-table__no-items)")
              .each(function () {
                $(this)
                  .find("td:not(.ty-table-disable-convertation)")
                  .each(function (index) {
                    var $elm = $(this);
                    if (
                      $elm.find(".ty-table__responsive-content").length == 0
                    ) {
                      $elm.wrapInner(
                        '<div class="ty-table__responsive-content"></div>'
                      );
                      $elm.prepend(
                        '<div class="ty-table__responsive-header">' +
                          thTexts[index] +
                          "</div>"
                      );
                    }
                  });
              });
            if (subTable.length) {
              subTable.each(function (index) {
                var subTableElm = $("[data-ca-has-sub-table_" + index + "]");
                subTableElm.prepend(subTableStack[index]);
                subTableElm.removeAttr("data-ca-has-sub-table_" + index);
              });
            }
          });
        }
      },
      resizeDialog: function resizeDialog() {
        var dlg = $(".ui-dialog");
        var $contentElem = $(dlg).find(".ui-dialog-content");
        if (ui.winWidth() > breakpoints.tablet) {
          $contentElem.data("caDialogAutoHeight", false);
          return;
        }
        $contentElem.data("caDialogAutoHeight", true);
        $(".ui-widget-overlay").css({ "min-height": $(window).height() });
        $(dlg).css({
          position: "absolute",
          width: $(window).width() - 20,
          left: "10px",
          top: "10px",
          "max-height": "none",
          height: "auto",
          "margin-bottom": "10px",
        });
        $(dlg)
          .find(".ui-dialog-title")
          .css({ width: $(window).width() - 80 });
        $contentElem.css({ height: "auto", "max-height": "none" });
        $(dlg).find(".object-container").css({ height: "auto" });
        $(dlg)
          .find(".buttons-container")
          .css({
            position: "relative",
            top: "auto",
            left: "0px",
            right: "0px",
            bottom: "0px",
            width: "auto",
          });
        $(".cm-notification-content.notification-content-extended").each(
          function (id, elm) {
            $.ceNotification("position", $(elm));
          }
        );
      },
      responsiveDialog: function responsiveDialog() {
        $.ceEvent("on", "ce.dialogshow", function () {
          if (ui.winWidth() <= breakpoints.tablet) {
            var currentScrollPosition = $(document).scrollTop();
            ui.resizeDialog();
            $("body,html").scrollTop(0);
            $.ceEvent("on", "ce.dialogclose", function () {
              $("body,html").scrollTop(currentScrollPosition);
            });
          }
        });
      },
      responsiveFilters: function responsiveFilters(e) {
        var filtersContent = $(".cm-horizontal-filters-content");
        if (ui.winWidth() <= breakpoints.tablet) {
          filtersContent.removeClass("cm-popup-box");
        } else {
          filtersContent.addClass("cm-popup-box");
        }
        if (ui.winWidth() > breakpoints.tablet) {
          $(".ty-horizontal-filters-content-to-right").removeClass(
            "ty-horizontal-filters-content-to-right"
          );
          $(".ty-horizontal-product-filters-dropdown").click(function () {
            var hrFiltersWidth = $(".cm-horizontal-filters").width();
            var hrFiltersContent = $(".cm-horizontal-filters-content", this);
            setTimeout(function () {
              var position =
                hrFiltersContent.offset().left + hrFiltersContent.width();
              if (position > hrFiltersWidth) {
                hrFiltersContent.addClass(
                  "ty-horizontal-filters-content-to-right"
                );
              }
            }, 1);
          });
        }
      },
      responsiveInlineTextLinksLargeTouch:
        function responsiveInlineTextLinksLargeTouch(e) {
          var elm = $(e.target);
          if (ui.winWidth() >= breakpoints.tablet && e.type == "touchstart") {
            var linksItem = elm.hasClass("ty-text-links__item")
              ? elm
              : elm.closest(".ty-text-links__item");
            if (
              !linksItem.hasClass("is-hover-link") &&
              linksItem.hasClass("ty-text-links__subitems")
            ) {
              e.preventDefault();
              linksItem
                .siblings(".ty-text-links__item")
                .removeClass("is-hover-link");
              linksItem.addClass("is-hover-link");
            }
          } else {
            $(".ty-text-links__item").removeClass("is-hover-link");
          }
        },
    };
  })();
  $(document).ready(function () {
    var responsiveTablesDebounced = $.debounce(ui.responsiveTables);
    var responsiveFiltersDebounced = $.debounce(ui.responsiveFilters);
    var resizeDialogDebounced = $.debounce(ui.resizeDialog);
    var responsiveMenuDebounced = $.debounce(ui.responsiveMenu);
    $(window).on("resize", function () {
      responsiveTablesDebounced();
      responsiveFiltersDebounced();
      resizeDialogDebounced();
    });
    if (window.addEventListener) {
      window.addEventListener(
        "orientationchange",
        function () {
          resizeDialogDebounced();
          $.ceDialog("get_last").ceDialog("reload");
        },
        false
      );
    }
    ui.responsiveDialog();
    responsiveTablesDebounced();
    responsiveFiltersDebounced();
    $.ceEvent("on", "ce.ajaxdone", function (elms) {
      responsiveTablesDebounced();
      responsiveFiltersDebounced();
      resizeDialogDebounced();
      if (elms.length) {
        ui.responsiveMenu(elms);
      } else {
        responsiveMenuDebounced();
      }
    });
    responsiveMenuDebounced();
    $(document).on("touchstart", function (e) {
      var elm = $(e.target);
      if (
        elm.hasClass("cm-menu-item-responsive") ||
        elm.closest(".cm-menu-item-responsive").length
      ) {
        ui.responsiveMenuLargeTouch(e);
      } else {
        $(".is-hover-menu").removeClass("is-hover-menu");
      }
      if (
        elm.hasClass("ty-text-links__subitems") ||
        elm.closest(".ty-text-links__subitems").length
      ) {
        ui.responsiveInlineTextLinksLargeTouch(e);
      } else {
        $(".is-hover-link").removeClass("is-hover-link");
      }
    });
  });
  $.ceEvent("on", "ce.tab.init", function () {
    var responsiveTabsDebounced = $.debounce(ui.responsiveTabs);
    $(window).on("resize", function () {
      responsiveTabsDebounced();
    });
    responsiveTabsDebounced();
    ui.responsiveScroll();
  });
})(Tygh, Tygh.$);
(function ($) {
  var splitVersion = $.fn.jquery.split(".");
  var major = parseInt(splitVersion[0]);
  var minor = parseInt(splitVersion[1]);
  var JQ_LT_17 = major < 1 || (major == 1 && minor < 7);
  function eventsData($el) {
    return JQ_LT_17 ? $el.data("events") : $._data($el[0]).events;
  }
  function moveHandlerToTop($el, eventName, isDelegated) {
    var data = eventsData($el);
    var events = data[eventName];
    if (!JQ_LT_17) {
      var handler = isDelegated
        ? events.splice(events.delegateCount - 1, 1)[0]
        : events.pop();
      events.splice(isDelegated ? 0 : events.delegateCount || 0, 0, handler);
      return;
    }
    if (isDelegated) {
      data.live.unshift(data.live.pop());
    } else {
      events.unshift(events.pop());
    }
  }
  function moveEventHandlers($elems, eventsString, isDelegate) {
    var events = eventsString.split(/\s+/);
    $elems.each(function () {
      for (var i = 0; i < events.length; ++i) {
        var pureEventName = $.trim(events[i]).match(/[^\.]+/i)[0];
        moveHandlerToTop($(this), pureEventName, isDelegate);
      }
    });
  }
  function makeMethod(methodName) {
    $.fn[methodName + "First"] = function () {
      var args = $.makeArray(arguments);
      var eventsString = args.shift();
      if (eventsString) {
        $.fn[methodName].apply(this, arguments);
        moveEventHandlers(this, eventsString);
      }
      return this;
    };
  }
  makeMethod("bind");
  makeMethod("one");
  $.fn.delegateFirst = function () {
    var args = $.makeArray(arguments);
    var eventsString = args[1];
    if (eventsString) {
      args.splice(0, 2);
      $.fn.delegate.apply(this, arguments);
      moveEventHandlers(this, eventsString, true);
    }
    return this;
  };
  $.fn.liveFirst = function () {
    var args = $.makeArray(arguments);
    args.unshift(this.selector);
    $.fn.delegateFirst.apply($(document), args);
    return this;
  };
  if (!JQ_LT_17) {
    $.fn.onFirst = function (types, selector) {
      var $el = $(this);
      var isDelegated = typeof selector === "string";
      $.fn.on.apply($el, arguments);
      if (typeof types === "object") {
        for (type in types)
          if (types.hasOwnProperty(type)) {
            moveEventHandlers($el, type, isDelegated);
          }
      } else if (typeof types === "string") {
        moveEventHandlers($el, types, isDelegated);
      }
      return $el;
    };
  }
})(jQuery);
(function (_, $) {
  $(document).ready(function () {
    var ab_lc_time = 300;
    $(document).on(
      "click",
      ".ab-lc-group .show-hidden-items-level-2",
      function () {
        var ul = $(this).parent().find("ul.hidden-items-level-2");
        if (ul.hasClass("opened")) {
          ul.removeClass("opened").stop().slideUp(ab_lc_time);
          $(this).removeClass("opened");
        } else {
          ul.addClass("opened").slideDown(ab_lc_time);
          $(this).addClass("opened");
        }
      }
    );
    $(document).on(
      "click",
      '.ab-lc-group li[data-subcategories="Y"] > a',
      function () {
        var ul = $(this).parent().find("ul.items-level-3");
        var li_of_a = $(this).parent();
        if (ul.hasClass("opened")) {
          ul.removeClass("opened").stop().slideUp(ab_lc_time);
          li_of_a.removeClass("opened");
        } else {
          ul.addClass("opened").slideDown(ab_lc_time);
          li_of_a.addClass("opened");
        }
        return false;
      }
    );
    $(document).on(
      "click",
      ".ab-lc-landing .show-hidden-items-level-2",
      function () {
        var ul = $(this).parent().find("ul.hidden-items-level-2");
        if (ul.hasClass("opened")) {
          ul.removeClass("opened").stop().slideUp(ab_lc_time);
          $(this).removeClass("opened");
        } else {
          ul.addClass("opened").slideDown(ab_lc_time);
          $(this).addClass("opened");
        }
      }
    );
  });
})(Tygh, Tygh.$);
function fn_abt__ut2_calc_cell(context) {
  if (fn_abt__ut2_calc_cell.timers === undefined) {
    fn_abt__ut2_calc_cell.timers = [];
  }
  context.each((k, elem) => {
    if (fn_abt__ut2_calc_cell.timers[elem]) {
      clearTimeout(fn_abt__ut2_calc_cell.timers[elem]);
    }
    fn_abt__ut2_calc_cell.timers[elem] = setTimeout(
      fn_abt__ut2_calc_cell_execute,
      100,
      $(elem)
    );
  });
}
function fn_abt__ut2_calc_cell_execute(context) {
  var min_width = 215;
  var mid_width = 260;
  $("div.grid-list", context).each(function () {
    var cell = $(this).find('div[class*="ut2-gl__item"]:first');
    if (cell.length && cell.outerWidth() < min_width) {
      $(this).addClass("ut2-min-narrow");
      $(this).removeClass("ut2-mid-narrow");
      $(this).find(".ut2-gl__control").addClass("view");
    } else if (
      cell.length &&
      cell.outerWidth() > min_width &&
      cell.outerWidth() < mid_width
    ) {
      $(this).addClass("ut2-mid-narrow");
      $(this).removeClass("ut2-min-narrow");
      $(this).find(".ut2-gl__control").addClass("view");
    } else {
      $(this).removeClass("ut2-min-narrow ut2-mid-narrow");
      $(this).find(".ut2-gl__control").addClass("view");
    }
  });
}
(function (_, $) {
  $(document).ready(function () {
    $.extend(_.abt__ut2, {
      functions: {
        in_array: function (val, arr) {
          var answ = 0;
          if (Array.isArray(arr)) {
            answ = ~arr.indexOf(val);
          } else {
            answ = ~Object.keys(arr).indexOf(val);
          }
          return Boolean(answ);
        },
        detect_class_changes: function (elem, callback, add_old_val) {
          var vanilla_elem = elem[0];
          var observer = new MutationObserver(callback);
          observer.observe(vanilla_elem, {
            attributes: true,
            attributeOldValue: add_old_val || false,
            attributeFilter: ["class"],
          });
        },
        toggle_class_on_scrolling: function (
          element_to_manipulate,
          element_to_add_class,
          class_name,
          add_to_offset,
          conditions
        ) {
          var additional_offset = add_to_offset;
          if (_.abt__ut2.settings.general.enable_fixed_header_panel === "Y") {
            additional_offset += $(".top-menu-grid").outerHeight();
          }
          $(window).on("scroll resize", function () {
            var scroll_top = $(window).scrollTop() - additional_offset;
            var scroll_bot = scroll_top + window.innerHeight;
            var element_coords = element_to_manipulate.offset();
            element_coords.bottom =
              element_coords.top + element_to_manipulate.outerHeight();
            if (scroll_bot >= element_coords.bottom) {
              if (
                conditions != void 0 &&
                typeof conditions.add === "function" &&
                !conditions.add()
              )
                return false;
              element_to_add_class.addClass(class_name);
            } else {
              if (
                conditions != void 0 &&
                typeof conditions.remove === "function" &&
                !conditions.remove()
              )
                return false;
              element_to_add_class.removeClass(class_name);
            }
          });
        },
      },
    });
    if (_.abt__ut2.settings.general.enable_fixed_header_panel === "Y") {
      $("body").data("ca-scroll-to-elm-offset", 50);
    }
    if (
      _.abt__ut2.settings.product_list.show_fixed_filters_button[
        _.abt__ut2.device
      ] === "Y"
    ) {
      var filters = $(
        ".ty-dropdown-box.ut2-filters:not(.ty-sidebox-important)"
      );
      if (filters.length) {
        var offset = filters.offset();
        offset.bottom = offset.top + Number(filters.outerHeight());
        var class_list = ["fixed-filters"];
        var header_height = 0;
        if (_.abt__ut2.settings.general.enable_fixed_header_panel === "Y") {
          var header = $(".header-grid .top-menu-grid");
          if (header.length) {
            header_height = Number(header.outerHeight());
          }
        }
        var class_string = class_list.join(" ");
        $(window).on("resize scroll", function () {
          var scroll_top = window.scrollY + header_height;
          if (scroll_top > offset.bottom) {
            filters.addClass(class_string);
          } else {
            filters.removeClass(class_string);
          }
        });
      }
    }
    if (_.abt__ut2.controller === "checkout" && _.abt__ut2.mode === "cart") {
      $(".ty-dropdown-box__title:not(.open)").addClass("__cart-page");
    }
  });
  $(document).ready(function () {
    if (_.abt__ut2.settings.general.enable_fixed_header_panel === "Y") {
      var header_selector =
        "#tygh_main_container > .tygh-header > .header-grid";
      if (document.documentElement.clientWidth > 768) {
        header_selector += ":not(.fixed)";
      }
      var top_panel = $("#tygh_main_container > .tygh-top-panel"),
        header = $(header_selector),
        menu = $(".top-menu-grid"),
        b = $("body"),
        top_panel_height = top_panel.height(),
        header_height = header.height(),
        menu_height = menu.height(),
        fixed = "fixed-header";
      var height = header_height;
      if (top_panel_height != void 0) {
        height += top_panel_height;
      }
      $(window).on("resize scroll", function () {
        var scroll = $(window).scrollTop();
        if (scroll >= height && !b.hasClass(fixed)) {
          header.css("padding-top", menu_height + "px");
          b.addClass(fixed);
        } else if (scroll < height - menu_height && b.hasClass(fixed)) {
          header.css("padding-top", "");
          b.removeClass(fixed);
        }
      });
    }
  });
  $(document).ready(function () {
    fn_abt__ut2_calc_cell($(document));
    $(window).on("resize", function (e) {
      fn_abt__ut2_calc_cell($(document));
    });
    $.ceEvent("on", "ce.commoninit", function (context) {
      fn_abt__ut2_calc_cell(context);
    });
    $.ceEvent("on", "ce.tab.show", function (tab_id, tabs_elm) {
      fn_abt__ut2_calc_cell(tabs_elm);
    });
  });
  $.ceEvent("on", "ce.commoninit", function (context) {
    (function () {
      if (_.abt__ut2.device === "mobile" || _.abt__ut2.device === "tablet") {
        var main_content_breadcrumbs = $(".main-content-grid");
        var m_c_b_w = main_content_breadcrumbs.outerWidth();
        var mobile_breadcrumbs = $(".ty-breadcrumbs").css(
          "display",
          "inline-block"
        );
        var m_b_w = mobile_breadcrumbs.outerWidth(true);
        if (m_b_w >= m_c_b_w) {
          mobile_breadcrumbs.addClass("long").css("display", "");
        }
      }
    })();
  });
  $(document).ready(function () {
    if (document.documentElement.clientWidth > 768) {
      var m = $(".hpo-menu");
      if (m.length) {
        var menu_height = m.outerHeight();
        m.addClass("open-menu")
          .find(".ty-dropdown-box__title:first")
          .addClass("open");
        var last_first_level_item = m.find("li.ty-menu__item.first-lvl.last");
        var m_height = parseInt(
          last_first_level_item.offset().top +
            last_first_level_item.outerHeight()
        );
        var fixed_header = function () {
          var scroll = $(window).scrollTop();
          if (scroll >= m_height) {
            $("body")
              .addClass("fixed-header")
              .css("margin-top", menu_height + "px");
            m.removeClass("open-menu");
            $(".hpo-menu > .ty-dropdown-box__title").removeClass("open");
          } else {
            $("body").removeClass("fixed-header").css("margin-top", "");
            m.addClass("open-menu");
            $(".hpo-menu > .ty-dropdown-box__title").addClass("open");
          }
        };
        fixed_header();
        $(window).scroll(fixed_header);
      }
    } else {
      $('.ty-menu__item-link[href="javascript:void(0)"]').click(function () {
        var link = $(this);
        var toggler = link.prev();
        if (toggler.length && toggler.hasClass("ty-menu__item-toggle")) {
          toggler.click();
        }
      });
    }
    (function () {
      if (
        _.abt__ut2.settings.products.view.show_sticky_add_to_cart[
          _.abt__ut2.device
        ] === "Y" &&
        _.abt__ut2.controller === "products" &&
        _.abt__ut2.mode === "view" &&
        $(".ty-product-block.sticky_add_to_cart").length
      ) {
        _.abt__ut2.functions.toggle_class_on_scrolling(
          $(".ty-product-block"),
          $(".ty-product-block__button, .ut2-qty__wrap"),
          "hide_add_to_cart by_scroll",
          66,
          {
            remove: function () {
              return !$(".menu-grid .ty-dropdown-box__title").hasClass("open");
            },
          }
        );
        $(".menu-grid .ty-dropdown-box__title").on("click", function () {
          var buttons = $(".ut2-pb__button, .ut2-qty__wrap");
          if (!buttons.hasClass("by_scroll")) {
            buttons.toggleClass("hide_add_to_cart");
          } else {
            setTimeout(function () {
              $(window).trigger("scroll");
            }, 100);
          }
        });
      }
    })();
  });
  $(".ut2-h__menu .ty-menu__item").mouseenter(function () {
    var $item = $(this);
    var submenu = $item.find(".ty-menu__submenu-items");
    var t = 250;
    submenu.css("display", "none");
    setTimeout(function () {
      submenu.css("display", "");
    }, t);
  });
  (function () {
    var clicks_counter = 0;
    $.ceEvent("on", "dispatch_event_pre", function (e, jelm, processed) {
      if (
        e.type === "click" &&
        _.abt__ut2.settings.category.use_swipe_to_close_filters[
          _.abt__ut2.device
        ] === "N"
      ) {
        if (clicks_counter === 2) {
          processed.status = true;
          processed.to_return = false;
          clicks_counter = 0;
          return false;
        }
        var visible_popup = $(".abt-ut2-draggable .cm-popup-box:visible");
        if (visible_popup.length) {
          var vanilla_visible_popup = visible_popup[0];
          var id = vanilla_visible_popup.getAttribute("id");
          if (
            !vanilla_visible_popup.contains(jelm[0]) &&
            clicks_counter === 0
          ) {
            clicks_counter = 1;
          }
          if (clicks_counter === 1 && jelm.attr("id") === "sw_" + id) {
            clicks_counter = 2;
          }
        }
      }
    });
  })();
})(Tygh, Tygh.$);
(function (_, $) {
  $(document).ready(function () {
    $(".ut2-upload-block").each(function () {
      var $this = $(this);
      var data = {
        object_dispatch: $this.data("ut2-object-dispatch"),
        object_type: $this.data("ut2-object-type"),
        object_id: $this.data("ut2-object-id"),
      };
      $.ceAjax(
        "request",
        fn_url("abt__ut2.ajax_block_upload." + $this.data("ut2-action")),
        {
          method: "post",
          hidden: true,
          data: data,
          callback: function (answer) {
            var res = answer.result;
            if (res != void 0) {
              $this.append(res.html);
            }
          },
        }
      );
    });
  });
})(Tygh, Tygh.$);
(function (_, $) {
  $.ceEvent("on", "ce.commoninit", function (context) {
    function abt__ut2_gt_cloneTools(tab_id, prev_id) {
      if (!tab_id || !prev_id) {
        return;
      }
      var _prev_tools = abt__ut2_gt_getTabTools(prev_id);
      _prev_tools.each(function () {
        var self = $(this);
        var _new_id = self.prop("id").replace(prev_id, tab_id);
        if (!$("#" + _new_id).length) {
          var _new_tool = self.clone();
          _new_tool.children().remove();
          _new_tool.prop("id", _new_id).hide().appendTo(self.parent());
        }
      });
    }
    function abt__ut2_gt_getTabTools(id) {
      return $('.cm-tab-tools[id^="tools_' + id + '"]');
    }
    var abt__tabs = $("li.abt__ut2_grid_tabs.cm-ajax.cm-js", context);
    if (abt__tabs.length) {
      abt__tabs.each(function () {
        var self = $(this);
        if (self.data("passed")) {
          return true;
        }
        self.data("passed", true);
        self.one("click", function () {
          var tab_id = self.prop("id");
          if (self.hasClass("active")) {
            var block = $("#content_" + tab_id);
            if (block.length) {
              content = block
                .html()
                .replace(/<!--.*?-->/, "")
                .replace(/(^\s+|\s+$)/, "");
              if (content.length && content != "<span></span>") {
                return true;
              }
            }
          }
          var active_id = $("li.abt__ut2_grid_tabs.cm-ajax.cm-js:first").prop(
            "id"
          );
          var id = "content_" + tab_id;
          var block = $("#" + id);
          if (!block.length) {
            self
              .parents(".cm-j-tabs")
              .eq(0)
              .next()
              .prepend('<div id="' + id + '"></div>');
            block = $("#" + id);
          }
          if (!self.hasClass("active")) {
            block.addClass("hidden");
          }
          abt__ut2_gt_cloneTools(tab_id, active_id);
          $.ceAjax("request", fn_url("abt__ut2_grid_tabs.load"), {
            result_ids: "content_abt__ut2_grid_tab_" + self.data("block"),
            hidden: false,
            repeat_on_error: true,
          });
        });
      });
    }
  });
})(Tygh, Tygh.$);
(function (_, $) {
  $(document).ready(function () {
    $(".ut2-sp-n, .ut2-sp-f").on("click", function () {
      var swiper = $(this);
      var swiper_parent = swiper.parents(".ut2-sw-w").toggleClass("active");
      var bolster = swiper_parent.siblings(".ut2-sw-b").toggleClass("active");
      $("body").toggleClass("swipe-no-scroll");
      bolster.on("click", function () {
        swiper_parent.removeClass("active");
        $(this).removeClass("active");
        $("body").toggleClass("swipe-no-scroll");
      });
    });
    $(".ut2-mt")
      .each(function () {
        $(this)
          .parent()
          .css("max-height", $(this).parent().height() + "px")
          .addClass("toggle-it");
      })
      .on("click", function () {
        $(this).toggleClass("active").parent().toggleClass("toggle-it");
      });
    if ($(window).width() > 1200) {
      $(".ut2-lfl").hover(
        function () {
          var parent = $(this);
          var parent_pos = parent[0].getBoundingClientRect();
          var child = parent.find(".ut2-slw");
          if (child.length) {
            child.css("top", parent_pos.top + "px");
            var child_pos = child[0].getBoundingClientRect();
            if (child_pos.top < 0) {
              child.addClass("no-translate");
            } else if (child_pos.bottom > $(window).height()) {
              child.addClass("no-translate bottom");
            }
          }
        },
        function () {}
      );
    } else {
      $(".ut2-lfl i").on("click", function () {
        var item = $(this);
        var parent = item.parent();
        var siblings = parent.siblings(".ut2-lfl, .ut2-lsl");
        siblings.toggleClass("hidden");
        var back_to_main = parent
          .parents(".ut2-lm")
          .find(".ut2-lm-back-to-main");
        if (back_to_main.hasClass("hidden")) {
          back_to_main.removeClass("hidden");
        } else if (!parent.hasClass("ut2-lsl")) {
          back_to_main.addClass("hidden");
        }
        parent.toggleClass("active");
      });
      $(".ut2-lm-back-to-main").on("click", function () {
        var wrapper = $(this).addClass("hidden").parent();
        wrapper.find(".ut2-lfl, .ut2-lsl").removeClass("hidden active");
      });
    }
    $(".ut2-lsl bdi").on("click", function () {
      $(this).parent().attr("style", "");
      $(this).remove();
    });
  });
})(Tygh, Tygh.$);
(function (_, $) {
  function fn_abt__ut2_load_video(elm) {
    var id = elm.data("banner-youtube-id"),
      params = elm.data("banner-youtube-params");
    elm
      .addClass("loaded")
      .empty()
      .append(
        $("<iframe>", {
          src: "https://www.youtube.com/embed/" + id + "?" + params,
          frameborder: 0,
          allowfullscreen: "true",
          allowscriptaccess: "always",
        })
      );
  }
  $(_.doc).on(
    "click",
    'a[data-content="video"]:not(.loaded),div[data-banner-youtube-id]',
    function (e) {
      if (
        $(e.target).attr("data-banner-youtube-id") ||
        $(e.target).attr("data-type")
      ) {
        var elm = $(e.target);
        if ($(e.target).attr("data-type")) elm = elm.parent();
        $(this).addClass("loaded");
        fn_abt__ut2_load_video(elm);
        return false;
      } else {
        return true;
      }
    }
  );
})(Tygh, Tygh.$);
(function (_, $) {
  $(document).ready(function () {
    $(_.doc).on(
      "click",
      ".ut2-load-more:not(.hidden):not(.ut2-load-more-loading)",
      function () {
        $(this).addClass("ut2-load-more-loading");
        let current_position = 0;
        $.ceAjax("request", $(this).data("ut2-load-more-url"), {
          save_history: true,
          result_ids: $(this).data("ut2-load-more-result-ids"),
          append: true,
          hidden: true,
          pre_processing: function (data, params) {
            var grid_items = $(".cm-pagination-container").find(
              'div[class^="ty-column"]'
            );
            if (grid_items.length) {
              var empty_items = $(
                "." +
                  "ty-column" +
                  grid_items[0].className.match(/ty-column(\d)+/)[1] +
                  ":empty"
              );
              if (empty_items.length) {
                empty_items.remove();
              }
            }
            current_position = $(window).scrollTop();
            $("html").addClass("dialog-is-open");
          },
          callback: function (data) {
            $(window).scrollTop(current_position);
            $("html").removeClass("dialog-is-open");
            $(".ut2-load-more-loading").addClass("hidden");
            if (data.html.ut2_pagination_block_bottom !== undefined) {
              $("#ut2_pagination_block_bottom")
                .empty()
                .html(data.html.ut2_pagination_block_bottom);
            }
            if (data.html.ut2_pagination_block !== undefined) {
              $("#ut2_pagination_block")
                .empty()
                .html(data.html.ut2_pagination_block);
            }
            $.ceEvent("trigger", "ce.ut2-load-more", [data]);
          },
        });
      }
    );
    if (_.abt__ut2.settings.load_more.mode === "auto") {
      $(window).on("scroll", function () {
        if (
          !$("html").hasClass("dialog-is-open") &&
          $(window).scrollTop() + $(window).height() >=
            $(document).height() -
              parseInt(_.abt__ut2.settings.load_more.before_end)
        ) {
          var load_more_button = $(
            ".ut2-load-more:not(.hidden):not(.ut2-load-more-loading)"
          );
          if (load_more_button.length) {
            load_more_button.click();
          }
        }
      });
    }
  });
})(Tygh, Tygh.$);
(function (_, $) {
  $(document).ready(function () {
    if (_.abt__ut2.controller === "products" && _.abt__ut2.mode === "view") {
      $(
        ".ut2-bt__products a.cm-dialog-opener[id^='opener_buy_together_options']"
      ).click(function () {
        var link = $(this);
        var product = link.parents(".ut2-bt__product");
        setTimeout(function () {
          var overlay = product.find(".ui-widget-overlay");
          var modal = overlay.next().detach();
          overlay.detach();
          overlay.insertBefore("#ut2__buy-together");
          modal.insertBefore("#ut2__buy-together");
          var form_name = link.parents("form").attr("name");
          modal.attr("data-ut2-pfn", form_name);
        }, 0);
      });
      $.ceEvent(
        "on",
        "ce.product_option_changed_post",
        function (objId, id, optionId, updateIds, formData, data, params) {
          var active_modal = $(
            document.querySelector(
              ".ui-dialog.ui-widget:not([style*='display: none'])"
            )
          );
          var overlay = $(".ui-widget-overlay");
          overlay.insertBefore("#ut2__buy-together");
          active_modal.insertBefore("#ut2__buy-together");
        }
      );
      $("#ut2__buy-together form").each(function () {
        var form_name = this.name;
        $.ceEvent("on", "ce.formpre_" + form_name, function (form, elm) {
          var inputs = $(
            ".ui-dialog.ui-widget[data-ut2-pfn='" + form_name + "']"
          )
            .find("input, select")
            .serializeObject();
          $.each(inputs, function (key, value) {
            form.append(
              '<input type="hidden" name="' + key + '" value="' + value + '" />'
            );
          });
        });
      });
    }
  });
})(Tygh, Tygh.$);
(function (_, $) {
  $(_.doc).on("click", ".cm-abt-filter-post", function () {
    var self = $(this);
    $.ceAjax("request", fn_url("products.view"), {
      method: "get",
      data: {
        product_id: self.data("caProductId"),
        abt__rating: self.data("caRating"),
        page: 1,
      },
      result_ids: "pagination_contents_comments_*,abt__discussion_buttons_*",
      caching: true,
    });
  });
})(Tygh, Tygh.$);
(function (_, $) {
  var timer;
  function fn_abt__ut2_lazy_load(context) {
    var w_h = $(window).height() + 400,
      w_t = $(window).scrollTop() - 200,
      w_b = w_t + w_h,
      img,
      block;
    if (context) {
      img = $("img[data-src]", context);
    } else {
      img = $("img[data-src]:visible");
    }
    img.each(function () {
      var i = $(this),
        i_h = $(this).outerHeight(),
        i_t = $(this).offset().top,
        i_b = i_h + i_t;
      if ((i_t >= w_t && i_t <= w_b) || (i_b >= w_t && i_b <= w_b)) {
        var tmp = $(new Image()),
          src = i.attr("data-src"),
          srcset = i.attr("data-srcset");
        if (srcset) {
          tmp.attr("srcset", srcset);
        }
        tmp.attr("src", src);
        tmp.on("load", function () {
          i.css({ opacity: 0 }).attr("src", src).removeAttr("data-src");
          if (srcset) {
            i.attr("srcset", srcset).removeAttr("data-srcset");
          }
          i.removeClass("lazyOwl").animate({ opacity: 1 }, 250);
        });
      }
    });
    if (context) {
      block = $("[data-background-url]", context);
    } else {
      block = $("[data-background-url]:visible");
    }
    block.each(function () {
      var b = $(this),
        b_h = $(this).height(),
        b_t = $(this).offset().top,
        b_b = b_t + b_h;
      if ((b_t >= w_t && b_t <= w_b) || (b_b >= w_t && b_b <= w_b)) {
        var tmp = $(new Image()),
          src = b.attr("data-background-url");
        tmp.attr("src", src);
        tmp.on("load", function () {
          b.css({ opacity: 0, "background-image": "url('" + src + "')" })
            .removeAttr("data-background-url")
            .animate({ opacity: 1 }, 250);
        });
      }
    });
  }
  $(window).on("scroll resize", function () {
    clearTimeout(timer);
    timer = setTimeout(fn_abt__ut2_lazy_load, 100);
  });
  $(".cm-menu-item-responsive").hover(function () {
    fn_abt__ut2_lazy_load($(this));
  });
  $(".cm-combination").click(function () {
    var context = $(this).next(".cm-popup-box");
    if (context.length) {
      fn_abt__ut2_lazy_load(context);
    }
  });
  $.ceEvent("on", "ce.commoninit", function (context) {
    if ($.isReady) {
      setTimeout(() => {
        fn_abt__ut2_lazy_load(context);
      }, 100);
    }
  });
  $.ceEvent("on", "ce.notificationshow", function (context) {
    fn_abt__ut2_lazy_load(context);
  });
  $.ceEvent("on", "ce.dialogshow", function (context) {
    fn_abt__ut2_lazy_load(context);
  });
  $.ceEvent("on", "ce.tab.show", function (tab_id, tabs_elm) {
    var context = $("#content_" + tab_id);
    if (context.length) {
      fn_abt__ut2_lazy_load(context);
    }
  });
  $(".ut2-gl__item").hover(function () {
    clearTimeout(timer);
    timer = setTimeout(fn_abt__ut2_lazy_load, 100);
  });
  timer = setTimeout(fn_abt__ut2_lazy_load, 100);
})(Tygh, Tygh.$);
function fn_buy_together_get_price_schema(chain_id) {
  var $ = Tygh.$;
  var result = {};
  var prices = {};
  var total_price = 0;
  elms = $("div#content_tab_products_" + chain_id);
  $(".cm-chain-" + chain_id, elms).each(function () {
    var elm_id = $(this).val();
    if (elm_id != "{bt_id}") {
      prices[elm_id] = {};
      prices[elm_id]["amount"] = $(
        "[name*=amount]",
        $(this).parent().parent()
      ).val();
      if (!isNaN(parseInt(prices[elm_id]["amount"]))) {
        prices[elm_id]["amount"] = parseInt(prices[elm_id]["amount"]);
      } else {
        prices[elm_id]["amount"] = 0;
      }
      prices[elm_id]["price"] = parseFloat(
        $("#item_price_bt_" + chain_id + "_" + elm_id, elms).val()
      );
      prices[elm_id]["modifier"] = parseFloat(
        $("#item_modifier_bt_" + chain_id + "_" + elm_id, elms).val()
      );
      if (isNaN(prices[elm_id]["modifier"])) {
        prices[elm_id]["modifier"] = 0;
      }
      prices[elm_id]["modifier_type"] = $(
        "#item_modifier_type_bt_" + chain_id + "_" + elm_id,
        elms
      ).val();
      total_price += prices[elm_id]["price"] * prices[elm_id]["amount"];
    }
  });
  result["price_schema"] = prices;
  result["total_price"] = total_price;
  return result;
}
function fn_buy_together_apply_discount(chain_id) {
  var $ = Tygh.$;
  var global_discount = 0;
  elms = $("div#content_tab_products_" + chain_id);
  global_discount = parseFloat(
    $("#elm_buy_together_global_discount_" + chain_id, elms).val()
  );
  if (isNaN(global_discount)) {
    return false;
  }
  var prices = {};
  var total_price = 0;
  var discounted_price = 0;
  price_schema = fn_buy_together_get_price_schema(chain_id);
  prices = price_schema["price_schema"];
  total_price = price_schema["total_price"];
  if (global_discount > total_price) {
    global_discount = total_price;
    $("#elm_buy_together_global_discount_" + chain_id, elms).val(total_price);
  }
  for (i in prices) {
    discount = (prices[i]["price"] / total_price) * global_discount;
    discount = discount.toFixed(2);
    item_price = prices[i]["price"] - discount;
    item_price = item_price.toFixed(2);
    $("#item_modifier_bt_" + chain_id + "_" + i, elms).val(discount);
    $("#item_modifier_type_bt_" + chain_id + "_" + i, elms).val("by_fixed");
    $("[id*=item_display_price_bt_" + chain_id + "_" + i + "_]", elms).text(
      prices[i]["price"].toFixed(2)
    );
    $("[id*=item_discounted_price_bt_" + chain_id + "_" + i + "_]", elms).text(
      item_price
    );
    discounted_price += item_price * prices[i]["amount"];
  }
  $("[id*=total_price_" + chain_id + "]", elms).text(total_price.toFixed(2));
  $("[id*=price_for_all_" + chain_id + "]", elms).text(
    discounted_price.toFixed(2)
  );
}
function fn_buy_together_recalculate(chain_id) {
  var $ = Tygh.$;
  var prices = {};
  var total_price = 0;
  var discounted_price = 0;
  elms = $("div#content_tab_products_" + chain_id);
  price_schema = fn_buy_together_get_price_schema(chain_id);
  prices = price_schema["price_schema"];
  total_price = price_schema["total_price"];
  for (i in prices) {
    switch (prices[i]["modifier_type"]) {
      case "to_fixed":
        item_price = prices[i]["modifier"];
        break;
      case "by_fixed":
        item_price = prices[i]["price"] - prices[i]["modifier"];
        break;
      case "to_percentage":
        item_price = (prices[i]["modifier"] / 100) * prices[i]["price"];
        break;
      case "by_percentage":
        item_price =
          prices[i]["price"] -
          (prices[i]["modifier"] / 100) * prices[i]["price"];
        break;
      default:
        item_price = prices[i]["price"];
    }
    if (item_price < 0) {
      item_price = 0;
    }
    item_price = item_price.toFixed(2);
    discounted_price += item_price * prices[i]["amount"];
    $("[id*=item_display_price_bt_" + chain_id + "_" + i + "_]", elms).text(
      prices[i]["price"].toFixed(2)
    );
    $("[id*=item_discounted_price_bt_" + chain_id + "_" + i + "_]", elms).text(
      item_price
    );
  }
  $("[id*=price_for_all_" + chain_id + "]", elms).text(
    discounted_price.toFixed(2)
  );
  $("[id*=total_price_" + chain_id + "]", elms).text(total_price.toFixed(2));
  $("#elm_buy_together_global_discount_" + chain_id, elms).val("");
}
function fn_buy_together_share_discount(evt, chain_id) {
  if (evt.keyCode) {
    code = evt.keyCode;
  } else if (evt.which) {
    code = evt.which;
  }
  if (code == 13) {
    fn_buy_together_apply_discount(chain_id);
  }
  return false;
}
(function (_, $) {
  $.ceEvent("on", "ce.picker_add_js_item", function (data) {
    if (data["var_prefix"] == "p") {
      price = parseFloat(data.item_id.price);
      if (isNaN(price)) {
        price = 0;
      }
      data["append_obj_content"] = data["append_obj_content"]
        .str_replace("{bt_id}", data["item_id"]["product_id"])
        .str_replace("{price}", price);
      var content = $("<tr>" + data["append_obj_content"] + "</tr>");
      content.find("span[id*='price_bt']").each(function () {
        $(this).text(price.toFixed(2));
      });
      data["append_obj_content"] = content.html();
    }
  });
  $.ceEvent("on", "ce.picker_transfer_js_items", function (data) {
    for (var id in data) {
      data[id].price = parseFloat($("#price_" + id).val());
      if (data[id].option && data[id].option.path) {
        for (var option_id in data[id].option.path) {
          variant_id = data[id].option.path[option_id];
          modifier = parseFloat(
            $("#bt_option_modifier_" + option_id + "_" + variant_id).val()
          );
          if (!isNaN(modifier)) {
            data[id].price += modifier;
          }
        }
      }
      data[id].test = true;
    }
  });
  $.ceEvent("on", "ce.commoninit", function (context) {
    var available_period_checkbox = context.find(".use_avail_period");
    if (available_period_checkbox.length !== 0) {
      available_period_checkbox.on("click", function () {
        var $ = Tygh.$,
          elm_obj = $(this),
          checked = elm_obj.prop("checked"),
          chain_id = $.trim(elm_obj.data("id"));
        $(
          "input#elm_buy_together_avail_from_" +
            chain_id +
            ",input#elm_buy_together_avail_till_" +
            chain_id
        ).prop("disabled", !checked);
      });
      available_period_checkbox.closest("form").on("reset", function () {
        var chain_id = $.trim(available_period_checkbox.data("id")),
          checked = available_period_checkbox.attr("checked") ? 1 : 0;
        $(
          "input#elm_buy_together_avail_from_" +
            chain_id +
            ",input#elm_buy_together_avail_till_" +
            chain_id
        ).prop("disabled", !checked);
      });
    }
  });
  $(_.doc).on("click", ".buy-together-js-company-switcher", function () {
    var companyId = $(this).data("caSwitcherCompanyId") || 0,
      paramName = $(this).data("caSwitcherParamName"),
      productId = $(this).data("caSwitcherProductId"),
      params = {};
    params[paramName] = companyId;
    params["redirect_url"] = ""
      .concat(_.current_dispatch, "&product_id=")
      .concat(productId, "&selected_section=buy_together");
    $.performPostRequest(fn_url("profiles.login_as_vendor"), params, "_blank");
  });
  $(_.doc).on("click", ".buy-together-js-storefront-switcher", function () {
    var storefront_id = $(this).data("caSwitcherStorefrontId") || 0,
      paramName = $(this).data("caSwitcherParamName"),
      url = fn_query_remove(_.current_url, [paramName, "meta_redirect_url"]);
    $.redirect(
      $.attachToUrl(url, "".concat(paramName, "=").concat(storefront_id))
    );
  });
  $(document).ready(function () {
    $(".cm-buy-together-submit1")
      .closest("form")
      .on("submit1", function () {
        var container = {};
        container = $("form", $(this).parents());
        fields = $(".cm-failed-field", container);
        if (fields.length > 0) {
          $.ceNotification("show", {
            type: "E",
            title: _.tr("error"),
            message: _.tr("buy_together_fill_the_mandatory_fields"),
            message_state: "I",
          });
        }
      });
  });
})(Tygh, Tygh.$);
(function (_, $) {
  $(document).ready(function () {
    $(_.doc).on("click", ".cm-news-subscribe", function (e) {
      var elms = $(this)
        .parents(".subscription-container")
        .find(".cm-news-subscribe");
      var params = "";
      var all_mailing_lists = "";
      if (elms.length > 0) {
        elms.each(function () {
          if ($(this).prop("name").length > 0) {
            if ($(this).prop("checked")) {
              params += $(this).prop("name") + "=" + $(this).val() + "&";
            } else {
              all_mailing_lists +=
                "all_mailing_lists" + "=" + $(this).val() + "&";
            }
          }
        });
      }
      if (!params) {
        params = "mailing_lists=";
      }
      if (!all_mailing_lists) {
        params += "&all_mailing_lists=";
      } else {
        all_mailing_lists = "&" + all_mailing_lists;
        params += all_mailing_lists;
      }
      $.ceAjax("request", fn_url("checkout.subscribe_customer?" + params), {
        method: "post",
        result_ids: "subsciption*",
      });
    });
  });
  $.ceEvent("on", "ce.commoninit", function (context) {
    var $newsletter_togglers = $(
      '[data-ca-lite-checkout-element="newsletter-toggler"]',
      context
    );
    if (!$newsletter_togglers.length) {
      return;
    }
    $newsletter_togglers.on("change", function () {
      var $checkbox = $(this);
      $.ceLiteCheckout(
        "updateCustomerInfo",
        function (data) {
          if (data.user_data.email) {
            var connected_checkbox_id = $checkbox.data("caTargetId");
            $("#" + connected_checkbox_id).trigger("click");
          }
        },
        false
      );
    });
  });
})(Tygh, Tygh.$);
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}
(function (_, $) {
  var handlers = {
    init: function init() {
      return true;
    },
    setCenter: function setCenter(lat, lng, zoom) {
      return true;
    },
    getCenter: function getCenter() {
      return {};
    },
    removeAllMarkers: function removeAllMarkers() {
      return true;
    },
    resize: function resize() {
      return true;
    },
    destroy: function destroy() {
      return true;
    },
    addMarkers: function addMarkers() {
      return true;
    },
    adjustMapBoundariesToSeeAllMarkers:
      function adjustMapBoundariesToSeeAllMarkers() {
        return true;
      },
    exitFullscreen: function exitFullscreen() {
      return true;
    },
  };
  var methods = {
    prepareMarkers: function prepareMarkers(marker_selector) {
      var markers = [];
      $(marker_selector).each(function (index, marker) {
        var $marker = $(marker);
        markers.push({
          lat: $marker.data("caGeoMapMarkerLat"),
          lng: $marker.data("caGeoMapMarkerLng"),
          selected: !!$marker.data("caGeoMapMarkerSelected"),
          content: $marker.html(),
          static: !!$marker.data("caGeoMapMarkerStatic"),
          header: $marker.data("caGeoMapMarkerHeader"),
        });
      });
      return markers;
    },
    setHandlers: function setHandlers(data) {
      handlers = data;
    },
  };
  $.fn.ceGeoMap = function (method) {
    if (handlers[method]) {
      return handlers[method].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
    } else if (_typeof(method) === "object" || !method) {
      return handlers.init.apply(this, arguments);
    } else {
      $.error("ty.geoMap: method " + method + " does not exist");
    }
  };
  $.ceGeoMap = function (action, data) {
    if (methods[action]) {
      return methods[action].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
    } else {
      $.error("ty.geoMap: action " + action + " does not exist");
    }
  };
})(Tygh, Tygh.$);
(function (_, $) {
  var methods = {
    setHandlers: function setHandlers(data) {
      handlers = data;
    },
  };
  var handlers = {
    getCoords: function getCoords(location) {
      var d = $.Deferred();
      d.reject();
      return d.promise();
    },
  };
  $.ceGeoCode = function (method) {
    if (methods[method]) {
      return methods[method].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
    } else if (handlers[method]) {
      return handlers[method].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
    } else {
      $.error("ty.geoCode: method " + method + " does not exist");
    }
  };
})(Tygh, Tygh.$);
(function (_, $) {
  var methods = {
    setHandlers: function setHandlers(data) {
      handlers = data;
    },
  };
  var handlers = {
    getCurrentLocation: function getCurrentLocation() {
      return $.Deferred().reject().promise();
    },
    getLocationByCoords: function getLocationByCoords(lat, lng) {
      return $.Deferred().reject().promise();
    },
    getProviderCode: function getProviderCode() {
      return "default";
    },
    getLanguageCode: function getLanguageCode() {
      return _.geo_maps.language;
    },
  };
  var caching_decorator = {
    getCurrentLocation: function getCurrentLocation() {
      var location_key =
          "geo_maps_customer_location_" +
          handlers.getProviderCode() +
          "_" +
          handlers.getLanguageCode(),
        location = caching_decorator.getFromLocalSession(location_key),
        d = $.Deferred();
      if (!location) {
        handlers.getCurrentLocation().then(function (location) {
          caching_decorator.saveToLocalSession(location_key, location);
          d.resolve(location);
        });
      } else {
        d.resolve(location);
      }
      return d.promise();
    },
    getLocationByCoords: function getLocationByCoords(lat, lng) {
      var location_key = [
          "geo_maps_coords_location",
          handlers.getProviderCode(),
          lat,
          lng,
          handlers.getLanguageCode(),
        ].join("_"),
        location = caching_decorator.getFromLocalSession(location_key),
        d = $.Deferred();
      if (!location) {
        handlers.getLocationByCoords(lat, lng).then(function (location) {
          caching_decorator.saveToLocalSession(location_key, location);
          d.resolve(location);
        }, d.reject);
      } else {
        d.resolve(location);
      }
      return d.promise();
    },
    saveToLocalSession: function saveToLocalSession(key, value) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (e) {}
    },
    getFromLocalSession: function getFromLocalSession(key) {
      try {
        var value = sessionStorage.getItem(key);
        if (value) {
          return JSON.parse(value);
        }
      } catch (e) {}
      return false;
    },
  };
  $.ceGeoLocate = function (method) {
    if (methods[method]) {
      return methods[method].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
    } else if (caching_decorator[method]) {
      return caching_decorator[method].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
    } else if (handlers[method]) {
      return handlers[method].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
    } else {
      $.error("ty.geoLocate: method " + method + " does not exist");
    }
  };
})(Tygh, Tygh.$);
(function (_, $) {
  var commercial_api_url = "https://enterprise.api-maps.yandex.ru/",
    free_api_url = "https://api-maps.yandex.ru/",
    default_language = "en",
    api_version = "2.1",
    locales = { ru: "ru_RU", en: "en_US", uk: "uk_UA", tr: "tr_TR" };
  function fn_get_yandex_api_loader() {
    var d = $.Deferred(),
      yandex_api_initialized = false,
      loading_failed = false,
      loading_started = false;
    return function (options) {
      if (yandex_api_initialized || loading_started || loading_failed) {
        return d.promise();
      }
      loading_started = true;
      options = $.extend(options || {}, _.geo_maps);
      var url = fn_generate_api_url(options || {});
      $.getScript(url)
        .then(function () {
          geo_maps_yandex.ready(function () {
            yandex_api_initialized = true;
            clearTimeout(await_timeout);
            d.resolve();
          });
        })
        .fail(function () {
          loading_failed = true;
          d.reject();
        });
      var await_timeout = setTimeout(function () {
        if (d.state() === "pending") {
          loading_failed = true;
          d.reject();
        }
      }, 7000);
      return d.promise();
    };
  }
  function fn_generate_api_url(options) {
    var data = [
      "ns=geo_maps_yandex",
      "lang=" + fn_get_locale(options.language || ""),
    ];
    var url = free_api_url;
    if (options.yandex_commercial) {
      url = commercial_api_url;
    }
    if (options.api_key) {
      data.push("apikey=" + options.api_key);
    }
    url += api_version + "?" + data.join("&");
    return url;
  }
  function fn_get_locale(lang_code) {
    return locales[lang_code.toLowerCase()] || locales[default_language];
  }
  $.geoMapInitYandexApi = fn_get_yandex_api_loader();
})(Tygh, Tygh.$);
(function (_, $) {
  var yandex = {
    default_zoom: 16,
    init: function init(options) {
      var $container = $(this),
        self = yandex;
      if ($container.data("ceGeoMapInitialized")) {
        return true;
      }
      $.geoMapInitYandexApi(options)
        .done(function () {
          self._initMap($container, options);
          self._registerMapClickEvent($container);
          self._registerSearchEvent($container);
          self._fireEvent($container, "ce:geomap:init");
        })
        .fail(function () {
          self._fireEvent($container, "ce:geomap:init_failed");
        });
      return this;
    },
    _initMap: function _initMap($container, options) {
      options = options || {};
      var self = yandex,
        controls = self._initMapControls(options),
        behaviors = self._initMapBehaviors(options);
      var map_state = {
        zoom: parseInt(options.zoom) || self.default_zoom,
        type: "yandex#map",
        center: [options.initial_lat || 0, options.initial_lng || 0],
        controls: controls,
        behaviors: behaviors,
        draggableCursor: "crosshair",
        draggingCursor: "pointer",
      };
      $container.ceGeoMap("destroy");
      var map = new geo_maps_yandex.Map($container[0], map_state);
      $container.data("caGeoMap", map);
      var clusterer =
        self._getClusterer($container) || new geo_maps_yandex.Clusterer();
      $container.data("caYandexClusterer", clusterer);
      self._registerFullscreenEvent($container);
      self._renderMarkers($container, options.markers, options);
    },
    _initMapControls: function _initMapControls(options) {
      var controls = options.controls;
      if ($.isEmptyObject(controls)) {
        return ["default"];
      } else if (controls.no_controls) {
        return [];
      }
      var ctls = [];
      if (controls.enable_traffic) {
        ctls.push("trafficControl");
      }
      if (controls.enable_layers) {
        ctls.push("typeSelector");
      }
      if (controls.enable_fullscreen) {
        ctls.push("fullscreenControl");
      }
      if (controls.enable_zoom) {
        ctls.push("zoomControl");
      }
      if (controls.enable_ruler) {
        ctls.push("rulerControl");
      }
      if (controls.enable_search) {
        ctls.push("searchControl");
      }
      if (controls.enable_routing) {
        ctls.push("routeButtonControl");
      }
      if (controls.enable_geolocation) {
        ctls.push("geolocationControl");
      }
      return ctls;
    },
    _initMapBehaviors: function _initMapBehaviors(options) {
      var behaviors = options.behaviors;
      if ($.isEmptyObject(behaviors)) {
        return ["default"];
      } else if (behaviors.no_behaviors) {
        return [];
      }
      var bhvs = [];
      if (behaviors.enable_drag) {
        bhvs.push("drag");
      }
      if (behaviors.enable_scroll_zoom) {
        bhvs.push("scrollZoom");
      }
      if (behaviors.enable_dbl_click_zoom) {
        bhvs.push("dblClickZoom");
      }
      if (behaviors.enable_multi_touch) {
        bhvs.push("multiTouch");
      }
      if (behaviors.enable_ruler) {
        bhvs.push("ruler");
      }
      if (behaviors.enable_route_editor) {
        bhvs.push("routeEditor");
      }
      return bhvs;
    },
    _renderMarkers: function _renderMarkers($container, markers, options) {
      var self = yandex;
      $container.ceGeoMap("removeAllMarkers");
      $container.ceGeoMap("addMarkers", markers);
      options = options || {};
      self._showSelectedMarker($container, markers, options);
      return true;
    },
    _getGeoMap: function _getGeoMap($container) {
      return $container.data("caGeoMap");
    },
    _addMarkersToCluster: function _addMarkersToCluster($container, markers) {
      var self = yandex,
        clusterer = self._getClusterer($container),
        map = self._getGeoMap($container),
        cluster = [],
        map_marker;
      if (!clusterer) {
        return;
      }
      $.each(markers, function (index, marker) {
        map_marker = self._prepareMarker(marker, $container);
        cluster.push(map_marker);
      });
      clusterer.add(cluster);
      map.geoObjects.add(clusterer);
    },
    _prepareMarker: function _prepareMarker(marker, $container) {
      var marker_data = {};
      if (marker.content) {
        marker_data.balloonContentBody = marker.content;
      }
      if (marker.header) {
        marker_data.balloonContentHeader = marker.header;
      }
      var map_marker = new geo_maps_yandex.Placemark(
        [marker.lat, marker.lng],
        marker_data
      );
      map_marker.events.add("click", function (e) {
        var self = yandex,
          marker = self._normalizeMarkerClickResult(e);
        self._fireEvent($container, "ce:geomap:click_marker", [marker]);
      });
      return map_marker;
    },
    _addStaticMarkers: function _addStaticMarkers($container, markers) {
      var self = yandex,
        map = self._getGeoMap($container),
        map_marker;
      $.each(markers, function (index, marker) {
        map_marker = self._prepareMarker(marker, $container);
        map.geoObjects.add(map_marker);
      });
    },
    _normalizeMarkerClickResult: function _normalizeMarkerClickResult(result) {
      var coords = result.get("target").geometry.getCoordinates(),
        marker = { lat: coords[0], lng: coords[1] };
      return marker;
    },
    _showSelectedMarker: function _showSelectedMarker(
      $container,
      markers,
      options
    ) {
      var self = yandex;
      if (markers.length === 1) {
        var selected_marker = markers[0];
      } else {
        var selected_marker = $.grep(markers, function (marker) {
          return marker.selected;
        })[0];
      }
      if (selected_marker) {
        $container.ceGeoMap(
          "setCenter",
          selected_marker.lat,
          selected_marker.lng,
          parseInt(options.zoom) || self.default_zoom
        );
      } else if (markers.length > 1) {
        $container.ceGeoMap("adjustMapBoundariesToSeeAllMarkers");
      }
      return true;
    },
    _registerMapClickEvent: function _registerMapClickEvent($container) {
      var self = yandex,
        map = self._getGeoMap($container);
      if (!map) {
        return false;
      }
      map.events.add("click", function (result) {
        var data = self._normalizeClickResult(result);
        self._fireEvent($container, "ce:geomap:click", [data]);
      });
      return true;
    },
    _registerFullscreenEvent: function _registerFullscreenEvent($container) {
      var self = yandex,
        map = self._getGeoMap($container);
      if (!map) {
        return false;
      }
      map.container.events.add("fullscreenenter", function (e) {
        map.behaviors.enable("scrollZoom");
      });
      map.container.events.add("fullscreenexit", function (e) {
        map.behaviors.disable("scrollZoom");
      });
      return true;
    },
    _fireEvent: function _fireEvent($container, name, data) {
      data = data || [];
      $container.trigger(name, data);
      data.unshift($container);
      $.ceEvent("trigger", name, data);
    },
    _normalizeClickResult: function _normalizeClickResult(result) {
      var coordinates = result.get("coords");
      var normalized_result = { lat: coordinates[0], lng: coordinates[1] };
      return normalized_result;
    },
    _registerSearchEvent: function _registerSearchEvent($container) {
      var self = yandex,
        map = self._getGeoMap($container),
        searchControl = map ? map.controls.get("searchControl") : null;
      if (!searchControl) {
        return false;
      }
      searchControl.events.add("resultselect", function (e) {
        var index = e.get("index");
        searchControl.getResult(index).then(function (result) {
          result.getParent().remove(result);
          var data = self._normalizeSearchResult(result);
          self._fireEvent($container, "ce:geomap:search_result_select", [data]);
        });
      });
      return true;
    },
    _normalizeSearchResult: function _normalizeSearchResult(result) {
      var coords = result.geometry.getCoordinates();
      var normalized_result = { lat: coords[0], lng: coords[1] };
      return normalized_result;
    },
    resize: function resize() {
      var self = yandex,
        $container = $(this),
        map = self._getGeoMap($container);
      if (!map) {
        return false;
      }
      map.container.fitToViewport();
      return true;
    },
    destroy: function destroy() {
      var self = yandex,
        $container = $(this),
        map = self._getGeoMap($container);
      if (!map) {
        return false;
      }
      map.destroy();
      return true;
    },
    removeAllMarkers: function removeAllMarkers() {
      var self = yandex,
        $container = $(this),
        clusterer = self._getClusterer($container),
        map = self._getGeoMap($container);
      if (clusterer) {
        clusterer.removeAll();
      }
      if (map) {
        map.geoObjects.removeAll();
      }
      return true;
    },
    _getClusterer: function _getClusterer($container) {
      return $container.data("caYandexClusterer");
    },
    addMarkers: function addMarkers(markers) {
      var self = yandex,
        $container = $(this);
      var cluster_markers = $.grep(markers, function (marker) {
        return !marker.static;
      });
      self._addMarkersToCluster($container, cluster_markers);
      var static_markers = $.grep(markers, function (marker) {
        return marker.static;
      });
      self._addStaticMarkers($container, static_markers);
    },
    adjustMapBoundariesToSeeAllMarkers:
      function adjustMapBoundariesToSeeAllMarkers() {
        var self = yandex,
          $container = $(this),
          clusterer = self._getClusterer($container),
          map = self._getGeoMap($container);
        if (!clusterer || !map) {
          return false;
        }
        map.setBounds(clusterer.getBounds(), { checkZoomRange: true });
        return true;
      },
    setCenter: function setCenter(lat, lng, zoom) {
      var self = yandex,
        $container = $(this),
        map = self._getGeoMap($container);
      if (!map) {
        return false;
      }
      map.setCenter([lat, lng]);
      map.setZoom(parseInt(zoom) || self.default_zoom);
      return true;
    },
    getCenter: function getCenter() {
      var self = yandex,
        $container = $(this),
        map = self._getGeoMap($container);
      if (!map) {
        return {};
      }
      var coords = map.getCenter();
      return { lat: coords[0], lng: coords[1] };
    },
    exitFullscreen: function exitFullscreen() {
      var self = yandex,
        $container = $(this),
        map = self._getGeoMap($container);
      if (map) {
        map.container.exitFullscreen();
        return true;
      }
      return false;
    },
  };
  $.ceGeoMap("setHandlers", yandex);
})(Tygh, Tygh.$);
(function (_, $) {
  var yandex = {
    getCoords: function getCoords(location) {
      var d = $.Deferred(),
        self = yandex;
      $.geoMapInitYandexApi()
        .done(function () {
          geo_maps_yandex.geocode(location).then(function (response) {
            var data = self._normalizeGeoCodeResponse(response);
            d.resolve(data);
          });
        })
        .fail(function () {});
      return d.promise();
    },
    _normalizeGeoCodeResponse: function _normalizeGeoCodeResponse(res) {
      var coords = res.geoObjects.get(0).geometry.getCoordinates();
      var normalized_result = { lat: coords[0], lng: coords[1] };
      return normalized_result;
    },
  };
  $.ceGeoCode("setHandlers", yandex);
})(Tygh, Tygh.$);
(function (_, $) {
  var geolocate = {
    getCurrentLocation: function getCurrentLocation() {
      return geolocate
        ._getCurrentPosition()
        .then(geolocate.getLocationByCoords);
    },
    _getCurrentPosition: function _getCurrentPosition() {
      return geolocate
        ._detectCurrentPosition()
        .then(geolocate._extractCoordinatesFromGeoObject);
    },
    _detectCurrentPosition: function _detectCurrentPosition() {
      var d = $.Deferred();
      $.geoMapInitYandexApi().done(function () {
        geo_maps_yandex.geolocation
          .get({ provider: location.protocol === "https:" ? "auto" : "yandex" })
          .then(
            function (result) {
              d.resolve(result.geoObjects.get(0));
            },
            function () {
              d.reject();
            }
          );
      });
      return d.promise();
    },
    _extractCoordinatesFromGeoObject: function _extractCoordinatesFromGeoObject(
      geo_object
    ) {
      var coords = geo_object.geometry.getCoordinates();
      return $.Deferred().resolve(coords[0], coords[1]).promise();
    },
    getLocationByCoords: function getLocationByCoords(lat, lng) {
      var self = geolocate,
        d = $.Deferred();
      geo_maps_yandex.geocode([lat, lng]).then(d.resolve).fail(d.reject);
      return d
        .then(self._extractLocationFromGeocodeResponse)
        .then(self._getStateCode)
        .promise();
    },
    _extractLocationFromGeocodeResponse:
      function _extractLocationFromGeocodeResponse(res) {
        var geo_object = res.geoObjects.get(0),
          meta = geo_object.properties.get("metaDataProperty").GeocoderMetaData,
          coords = geo_object.geometry.getCoordinates(),
          location = {
            place_id: meta.id,
            lat: coords[0],
            lng: coords[1],
            formatted_address: meta.Address.formatted,
            type: meta.kind,
            country: meta.Address.country_code,
            postal_code: meta.Address.postal_code,
            postal_code_text: meta.Address.postal_code,
          };
        $.each(meta.Address.Components, function (index, component) {
          switch (component.kind) {
            case "country":
              location.country_text = component.name;
              break;
            case "province":
              location.state = location.state_text = component.name;
              location.locality = location.locality_text = !location.locality
                ? component.name
                : location.locality;
              break;
            case "district":
              location.locality = location.locality_text = !location.locality
                ? component.name
                : location.locality;
              break;
            case "locality":
              location.locality = location.locality_text = component.name;
              break;
            case "area":
              location.locality = location.locality_text = !location.locality
                ? component.name
                : location.locality;
              break;
            case "street":
              location.route = location.route_text = component.name;
              break;
            case "house":
              location.street_number = location.street_number_text =
                component.name;
              break;
          }
        });
        return $.Deferred().resolve(location).promise();
      },
    _getStateCode: function _getStateCode(location) {
      var self = geolocate,
        d = $.Deferred(),
        options = { quality: 0 };
      geo_maps_yandex.borders.load(location.country, options).then(
        function (geojson) {
          location.state_code = self._getStateCodeFromResponse(
            geojson,
            location.state_text
          );
          d.resolve(location);
        },
        function () {
          location.state_code = "";
          d.resolve(location);
        }
      );
      return d.promise();
    },
    _getStateCodeFromResponse: function _getStateCodeFromResponse(
      geojson,
      state
    ) {
      var state_code = "";
      for (var i = 0; i < geojson.features.length; i++) {
        var region = geojson.features[i].properties;
        var state_name_equals = "Республика " + region.name === state;
        if (region.name === state || state_name_equals) {
          state_code = region.iso3166.split("-").pop();
          break;
        }
      }
      return state_code;
    },
    getProviderCode: function getProviderCode() {
      return "yandex";
    },
    getLanguageCode: function getLanguageCode() {
      var geo_maps_yandex = geo_maps_yandex || null;
      return (
        (geo_maps_yandex &&
          geo_maps_yandex.meta &&
          geo_maps_yandex.meta.languageCode) ||
        _.geo_maps.language
      );
    },
  };
  $.ceGeoLocate("setHandlers", geolocate);
})(Tygh, Tygh.$);
(function (_, $) {
  $.ceEvent("on", "ce.commoninit", function (context) {
    var $mapContainers = $(".cm-geo-map-container", context);
    if (!$mapContainers.length) {
      return;
    }
    fn_init_maps(context);
    fn_init_address_on_map(context);
  });
  function fn_init_maps(context) {
    $(context)
      .find(".cm-geo-map-container")
      .each(function (index, container) {
        var $container = $(container),
          marker_selector = $container.data("caGeoMapMarkerSelector");
        var options = {
          initial_lat: $container.data("caGeoMapInitialLat"),
          initial_lng: $container.data("caGeoMapInitialLng"),
          zoom: $container.data("caGeoMapZoom"),
          language: $container.data("caGeoMapLanguage"),
          controls: {
            no_controls: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapControlsNoControls"
            ),
            enable_traffic: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapControlsEnableTraffic"
            ),
            enable_layers: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapControlsEnableLayers"
            ),
            enable_fullscreen: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapControlsEnableFullscreen"
            ),
            enable_zoom: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapControlsEnableZoom"
            ),
            enable_ruler: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapControlsEnableRuler"
            ),
            enable_search: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapControlsEnableSearch"
            ),
            enable_routing: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapControlsEnableRouting"
            ),
            enable_geolocation: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapControlsEnableGeolocation"
            ),
            enable_panorama: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapControlsEnablePanorama"
            ),
            enable_rotation: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapControlsEnableRotation"
            ),
          },
          behaviors: {
            no_behaviors: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapBehaviorsNoBehaviors"
            ),
            enable_drag: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapBehaviorsEnableDrag"
            ),
            enable_smart_drag: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapBehaviorsEnableSmartDrag"
            ),
            enable_drag_on_mobile: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapBehaviorsEnableDragOnMobile"
            ),
            enable_scroll_zoom: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapBehaviorsEnableScrollZoom"
            ),
            enable_dbl_click_zoom: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapBehaviorsEnableDblClickZoom"
            ),
            enable_multi_touch: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapBehaviorsEnableMultiTouch"
            ),
            enable_ruler: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapBehaviorsEnableRuler"
            ),
            enable_route_editor: fn_get_boolean_from_data_attribute(
              $container,
              "caGeoMapBehaviorsEnableRouteEditor"
            ),
          },
        };
        options.markers = $.ceGeoMap("prepareMarkers", marker_selector);
        options.controls = fn_filter_out_object_nulls(options.controls);
        options.behaviors = fn_filter_out_object_nulls(options.behaviors);
        options.behaviors = fn_process_additional_behaviors(options.behaviors);
        $container.ceGeoMap(options);
      });
  }
  function fn_filter_out_object_nulls(object) {
    var filtered = {};
    $.each(object, function (index, value) {
      if (value !== null) {
        filtered[index] = value;
      }
    });
    return filtered;
  }
  function fn_get_boolean_from_data_attribute($elm, attribute_name) {
    return $elm.data(attribute_name) !== undefined
      ? !!$elm.data(attribute_name)
      : null;
  }
  function fn_init_address_on_map(context) {
    var $address_on_map_container = $(context).find(".cm-aom-map-container");
    $address_on_map_container.on("ce:geomap:init", function (e) {
      var address = [
        $address_on_map_container.data("caAomCountry"),
        $address_on_map_container.data("caAomCity"),
        $address_on_map_container.data("caAomAddress"),
      ]
        .filter(function (item) {
          return !!item;
        })
        .join(", ");
      if (!address) {
        return;
      }
      $.ceGeoCode("getCoords", address).done(function (data) {
        if (data.lat && data.lng) {
          data.static = true;
          data.content = address;
          $address_on_map_container.ceGeoMap("removeAllMarkers");
          $address_on_map_container.ceGeoMap("addMarkers", [data]);
          $address_on_map_container.ceGeoMap("setCenter", data.lat, data.lng);
        }
      });
    });
  }
  function fn_process_additional_behaviors(behaviors) {
    if ($.isMobile() != null) {
      behaviors.enable_drag = behaviors.enable_drag_on_mobile;
    }
    return behaviors;
  }
})(Tygh, Tygh.$);
(function (_, $) {
  var methods = {
    prepare: function prepare(location_blocks, maps) {
      location_blocks.each(function (i, elm) {
        var $elm = $(elm);
        if (!$elm.data("caGeoMapLocationIsLocationDetected")) {
          $.ceGeoMapLocation("init", $elm);
        }
      });
      maps.each(function (i, elm) {
        $.ceGeoMapLocation("initMap", elm);
      });
    },
    init: function init($elm) {
      methods.autoDetect(methods.setLocationAsync, $elm);
    },
    autoDetect: function autoDetect(callback, $elm) {
      $.ceGeoLocate("getCurrentLocation").then(function (location) {
        callback(location, $elm);
      });
    },
    setLocation: function setLocation(location, $container, auto_detect) {
      var d = $.Deferred();
      $.ceAjax("request", fn_url("geo_maps.set_location"), {
        method: "post",
        data: { location: location, auto_detect: Number(auto_detect) },
        hidden: true,
        caching: false,
        callback: function callback(response) {
          $container.each(function (i, elm) {
            var $elm = $(elm);
            $('[data-ca-geo-map-location-element="location"]', $elm).text(
              response.city
            );
            $elm.data("caGeoMapLocationIsLocationDetected", true);
          });
          $.ceEvent("trigger", "ce:geomap:location_set_after", [
            location,
            $container,
            response,
            auto_detect,
          ]);
          d.resolve(response);
        },
      });
      return d.promise();
    },
    setLocationAsync: function setLocationAsync(location, $container) {
      methods.setLocation(location, $container, true);
    },
    initMap: function initMap(elm) {
      var $set_location = $(elm)
          .closest('[data-ca-geo-map-location-element="location_selector"]')
          .find(".ty-geo-maps__geolocation__set-location"),
        coordinates;
      methods.autoDetect(function (location, $container) {
        var options = {
          initial_lat: location.lat,
          initial_lng: location.lng,
          zoom: 10,
          controls: { enable_search: true },
          markers: [{ lat: location.lat, lng: location.lng }],
        };
        coordinates = [location.lat, location.lng];
        $container.on("ce:geomap:init_failed", function (e) {
          methods.showMapLoadError($(e.target));
        });
        $container.ceGeoMap(options);
        $container.on("ce:geomap:click_marker", function (e, marker) {
          coordinates = [marker.lat, marker.lng];
          $set_location.trigger("click");
        });
        $container.on("ce:geomap:search_result_select", function (e, data) {
          if (!data.lat || !data.lng) {
            return;
          }
          coordinates = [data.lat, data.lng];
          var $container = $(e.target);
          $container.ceGeoMap("removeAllMarkers");
          $container.ceGeoMap("addMarkers", [data]);
          $container.ceGeoMap("setCenter", data.lat, data.lng);
        });
        $set_location.removeClass("pending");
      }, $(elm));
      $set_location.click(function (e) {
        if ($(this).is("pending") || !coordinates) {
          return false;
        }
        var lat = coordinates[0],
          lng = coordinates[1];
        if (!lat || !lng) {
          return;
        }
        $.ceGeoLocate("getLocationByCoords", lat, lng).then(
          function (location) {
            methods.setLocation(
              location,
              $('[data-ca-geo-map-location-element="location_block"]'),
              false
            );
          },
          function () {
            $.ceNotification("show", {
              type: "W",
              title: _.tr("warning"),
              message: _.tr("geo_maps_cannot_select_location"),
            });
          }
        );
      });
    },
    showMapLoadError: function showMapLoadError($elm) {
      $elm
        .closest('[data-ca-geo-map-location-element="location_selector"]')
        .find('[data-ca-geo-map-location-element="map_load_error_message"]')
        .removeClass("hidden");
      $elm.addClass("hidden");
      $(".ty-geo-maps__geolocation__set-location").removeClass("pending");
    },
  };
  $.extend({
    ceGeoMapLocation: function ceGeoMapLocation(method) {
      if (methods[method]) {
        return methods[method].apply(
          this,
          Array.prototype.slice.call(arguments, 1)
        );
      } else {
        $.error("ty.geo-maps-location: method " + method + " does not exist");
      }
    },
  });
  $.ceEvent("on", "ce.commoninit", function (context) {
    var location_blocks = $(
        '[data-ca-geo-map-location-element="location_block"]',
        context
      ),
      maps = $('[data-ca-geo-map-location-element="map"]', context);
    if (!location_blocks.length && !maps.length) {
      return;
    }
    if (document.readyState === "complete") {
      $.ceGeoMapLocation("prepare", location_blocks, maps);
    } else {
      $(window).on("load", function () {
        $.ceGeoMapLocation("prepare", location_blocks, maps);
      });
    }
  });
  $.ceEvent("on", "ce.dialogshow", function ($context) {
    if (!$('[data-ca-geo-map-location-element="map"]', $context).length) {
      return;
    }
    $('[data-ca-geo-map-location-element="map"]', $context).ceGeoMap("resize");
  });
})(Tygh, Tygh.$);
(function (_, $) {
  var methods = {
    setLocation: function setLocation(location, $container) {
      location.state = location.state_code;
      location.locality_text = location.locality;
      $.ceGeoMapLocation("setLocation", location, $container);
    },
    initCitySelector: function initCitySelector($elm) {
      $elm.on("click touch", function (e) {
        var $parent_container = $(this).closest(
          "[id^=geo_maps_location_block_]"
        );
        e.preventDefault();
        methods.setLocation(
          {
            country: $elm.data("caStoreLocatorLocationCountry") || "",
            country_text: $elm.data("caStoreLocatorLocationCountryName") || "",
            state_code: $elm.data("caStoreLocatorLocationState") || "",
            state_text: $elm.data("caStoreLocatorLocationStateName") || "",
            locality: $elm.data("caStoreLocatorLocationCity") || "",
          },
          $parent_container
        );
      });
    },
  };
  $.extend({
    ceStoreLocatorLocation: function ceStoreLocatorLocation(method) {
      if (methods[method]) {
        return methods[method].apply(
          this,
          Array.prototype.slice.call(arguments, 1)
        );
      } else {
        $.error(
          "ty.store-locator-location: method " + method + " does not exist"
        );
      }
    },
  });
  $.ceEvent("on", "ce.commoninit", function (context) {
    var city_selectors = $(
      '[data-ca-store-locator-location-element="city"]',
      context
    );
    if (city_selectors.length) {
      city_selectors.each(function (i, elm) {
        $.ceStoreLocatorLocation("initCitySelector", $(elm));
      });
    }
  });
})(Tygh, Tygh.$);
(function (window, document, _, $) {
  var isCounterAvailable = function isCounterAvailable() {
    return typeof ym !== "undefined";
  };
  $.ceEvent("on", "ce:yandexMetrika:init", function () {
    _.yandexMetrika.provider = {
      id: "default",
      setupHitHandlers: function setupHitHandlers() {
        $.ceEvent("on", "ce.ajaxdone", function (elms, inline_scripts, params) {
          if (!isCounterAvailable()) {
            return;
          }
          if (params.original_url !== _.current_url) {
            ym(_.yandexMetrika.settings.id, "hit", _.current_url);
          }
        });
      },
      setupReachGoalHandlers: function setupReachGoalHandlers() {
        $(document).on(
          "click",
          'button[type="submit1"][name^="dispatch[checkout.add"]',
          function () {
            $.ceEvent(
              "one",
              "ce.formajaxpost_" + $(this).parents("form").prop("name"),
              function () {
                if (!isCounterAvailable()) {
                  return;
                }
                if (!_.yandexMetrika.settings.collectedGoals.basket) {
                  return;
                }
                ym(_.yandexMetrika.settings.id, "reachGoal", "basket", {});
              }
            );
          }
        );
        $(document).on(
          "click",
          '.cm-submit1[id^="button_wishlist"]',
          function () {
            $.ceEvent(
              "one",
              "ce.formajaxpost_" + $(this).parents("form").prop("name"),
              function () {
                if (!isCounterAvailable()) {
                  return;
                }
                if (!_.yandexMetrika.settings.collectedGoals.wishlist) {
                  return;
                }
                ym(_.yandexMetrika.settings.id, "reachGoal", "wishlist", {});
              }
            );
          }
        );
        $(document).on(
          "click",
          'a[id^="opener_buy_now_with_one_click"]',
          function () {
            if (!isCounterAvailable()) {
              return;
            }
            if (
              !_.yandexMetrika.settings.collectedGoals
                .buy_with_one_click_form_opened
            ) {
              return;
            }
            ym(
              _.yandexMetrika.settings.id,
              "reachGoal",
              "buy_with_one_click_form_opened",
              {}
            );
          }
        );
        $.ceEvent("on", "ce.formajaxpost_call_requests_form_main", function () {
          if (!isCounterAvailable()) {
            return;
          }
          if (!_.yandexMetrika.settings.collectedGoals.call_request) {
            return;
          }
          ym(_.yandexMetrika.settings.id, "reachGoal", "call_request", {});
        });
        $.ceEvent("on", "ce.commoninit", function () {
          var goalsSchema = _.yandexMetrika.goalsSchema;
          $.each(_.yandexMetrika.settings.collectedGoals, function (goalName) {
            if (
              goalsSchema.hasOwnProperty(goalName) &&
              goalsSchema[goalName].controller &&
              goalsSchema[goalName].controller ===
                _.yandexMetrika.currentController &&
              goalsSchema[goalName].mode === _.yandexMetrika.currentMode
            ) {
              if (!isCounterAvailable()) {
                return;
              }
              ym(_.yandexMetrika.settings.id, "reachGoal", "order", {});
            }
          });
        });
      },
      setupEcommerceHandlers: function setupEcommerceHandlers() {
        $.ceEvent(
          "on",
          "ce.ajaxdone",
          function (elms, inline_scripts, params, data) {
            var products = data.yandex_metrika || {};
            if (products.added) {
              window.dataLayerYM.push({
                ecommerce: { add: { products: products.added } },
              });
            }
            if (products.deleted) {
              window.dataLayerYM.push({
                ecommerce: { remove: { products: products.deleted } },
              });
            }
            if (products.detail) {
              window.dataLayerYM.push({
                ecommerce: { detail: { products: products.detail } },
              });
            }
          }
        );
        var goalsSchema = _.yandexMetrika.goalsSchema;
        $.each(_.yandexMetrika.settings.collectedGoals, function (goalName) {
          if (
            goalsSchema.hasOwnProperty(goalName) &&
            goalsSchema[goalName].controller &&
            goalsSchema[goalName].controller ===
              _.yandexMetrika.currentController &&
            goalsSchema[goalName].mode === _.yandexMetrika.currentMode
          ) {
            window.dataLayerYM.push({
              ecommerce: {
                currencyCode: _.yandexMetrika.settings.params.currencyCode,
                purchase: _.yandexMetrika.settings.params.purchase,
              },
            });
          }
        });
      },
      load: function load() {
        (function (m, e, t, r, i, k, a) {
          m[i] =
            m[i] ||
            function () {
              (m[i].a = m[i].a || []).push(arguments);
            };
          m[i].l = 1 * new Date();
          (k = e.createElement(t)),
            (a = e.getElementsByTagName(t)[0]),
            (k.async = 1),
            (k.src = r),
            a.parentNode.insertBefore(k, a);
        })(
          window,
          document,
          "script",
          "https://mc.yandex.ru/metrika/tag.js",
          "ym"
        );
        $.ceEvent("trigger", "ce:yandexMetrika:dependencyLoaded");
      },
      run: function run() {
        window.dataLayerYM = window.dataLayerYM || [];
        _.yandexMetrika.settings.params = window.yaParams || {};
        ym(_.yandexMetrika.settings.id, "init", _.yandexMetrika.settings);
      },
    };
    $.ceEvent("trigger", "ce:yandexMetrika:providerReady");
  });
})(window, Tygh.doc, Tygh, Tygh.$);
(function (_, $) {
  $.ceEvent("on", "ce:yandexMetrika:providerReady", function () {
    _.yandexMetrika.provider.setupHitHandlers();
    _.yandexMetrika.provider.setupReachGoalHandlers();
    _.yandexMetrika.provider.load();
  });
  $.ceEvent("on", "ce:yandexMetrika:dependencyLoaded", function () {
    try {
      _.yandexMetrika.provider.run();
      _.yandexMetrika.provider.setupEcommerceHandlers();
    } catch (err) {}
  });
})(Tygh, Tygh.$);
(function (_, $) {
  var base_url;
  var ajax_ids;
  function setHandler() {
    $(_.doc).on("click", ".ab__dotd_promotions-filter_item", function () {
      var self = $(this);
      var category_id = self.data("caCategoryId");
      var url;
      if (category_id !== undefined) {
        url = $.attachToUrl(base_url, "ab_category_id=" + category_id);
      } else {
        url = base_url;
      }
      return getProducts(url, self);
    });
  }
  function setCallback() {
    $.ceEvent("on", "ce.commoninit", function (context) {
      context.find(".ab__dotd_promotions-filter").each(function () {
        var self = $(this);
        if (self.data("caBaseUrl")) {
          base_url = self.data("caBaseUrl");
          ajax_ids = self.data("caTargetId");
        }
      });
    });
  }
  function getProducts(url, obj) {
    if (ajax_ids) {
      $.ceAjax("request", url, {
        result_ids: ajax_ids,
        full_render: true,
        save_history: true,
        caching: false,
        scroll: ".ab__dotd_promotion",
        obj: obj,
        callback: function (response) {
          if (response.no_products) {
            obj.removeClass("active");
          }
        },
      });
    } else {
      $.redirect(url);
    }
    return false;
  }
  setCallback();
  setHandler();
  $.ceEvent("on", "ce.commoninit", function (context) {
    if (_.ab__dotd !== undefined) {
      if (_.ab__dotd.chains_page === undefined) {
        _.ab__dotd.chains_page = 1;
      }
      var desc = $("div.ab__dotd_promotion-description", context);
      if (
        _.ab__dotd.current_dispatch == "promotions.view" &&
        desc.length &&
        !desc.hasClass("ab__dotd_description")
      ) {
        _.ab__dotd.full_height_description = desc.outerHeight();
        if (
          parseInt(_.ab__dotd.full_height_description) >
          parseInt(_.ab__dotd.max_height)
        ) {
          desc
            .addClass("ab__dotd_description")
            .css({
              maxHeight: parseInt(_.ab__dotd.max_height) + "px",
              overflow: "hidden",
            });
          desc.after(
            "<div class='ab__dotd_more'>" + _.ab__dotd.more + "</div>"
          );
        }
      }
      var container = $("div.ab__dotd_chains_content"),
        button = $(".ab__dotd_chains-show_more", container);
      if (
        _.ab__dotd.current_dispatch == "promotions.list" &&
        container.length &&
        button.length
      ) {
        $(_.doc).off("click", ".ab__dotd_chains-show_more");
        $(_.doc).on("click", ".ab__dotd_chains-show_more", function () {
          button.addClass("loading");
          $.ceAjax("request", fn_url("ab__dotd.get_chains"), {
            hidden: true,
            caching: false,
            force_exec: true,
            save_history: true,
            method: "post",
            data: { page: ++_.ab__dotd.chains_page },
            callback: function (data) {
              if (data.html !== undefined) {
                button.before(data.html);
                if (data.search !== undefined) {
                  if (data.search.page < data.search.total_pages) {
                    $(".ab__dotd-text_get_more").text(
                      data.search.text_get_more
                    );
                    $(".ab__dotd-text_showed").text(data.search.text_showed);
                  } else {
                    button.remove();
                  }
                }
                $.commonInit(container);
              }
            },
          });
          button.removeClass("loading");
        });
      }
    }
  });
  $(document).on("click", "div.ab__dotd_more:not(.inverse)", function () {
    var button = $(this);
    $("div.ab__dotd_promotion-description").animate(
      { maxHeight: _.ab__dotd.full_height_description },
      800,
      function () {
        $(".ab__dotd_description").addClass("inverse");
        button.addClass("inverse").html(_.ab__dotd.less);
      }
    );
  });
  $(document).on("click", "div.ab__dotd_more.inverse", function () {
    var button = $(this);
    $("div.ab__dotd_promotion-description").animate(
      { maxHeight: parseInt(_.ab__dotd.max_height) + "px" },
      800,
      function () {
        $(".ab__dotd_description").removeClass("inverse");
        button.removeClass("inverse").html(_.ab__dotd.more);
      }
    );
  });
  $(document).on("click", ".ab-flip-clock-item", function () {
    return false;
  });
  $.ceEvent("on", "ce.commoninit", function (context) {
    setTimeout(function () {
      ab__dotd_load_promos(context);
    }, 100);
  });
  function ab__dotd_load_promos(context) {
    var items = context.find(".ab-dotd-category-promo:not(.ab-dotd-loaded)");
    var promotions_ids_list = [];
    if (items.length) {
      items.each(function () {
        $(this).addClass("ab-dotd-loaded");
        var promotion_id = $(this).data("caPromotionId");
        if (
          promotion_id !== undefined &&
          promotion_id !== _.ab__dotd.current_promotion_id &&
          $.inArray(promotion_id.promotions_ids_list) === -1
        ) {
          promotions_ids_list.push(promotion_id);
        }
      });
      if (promotions_ids_list.length) {
        $.ceAjax("request", fn_url("ab__dotd.get_promos"), {
          method: "post",
          data: { promotions_ids: promotions_ids_list },
          caching: true,
          hidden: true,
          callback: function (d) {
            if (d.promotions !== undefined) {
              for (promo in d.promotions) {
                items
                  .filter("[data-ca-promotion-id=" + promo + "]")
                  .append(d.promotions[promo]);
              }
              items.filter(":not(.ab-dotd-loaded)").remove();
              $.commonInit(items);
            }
          },
        });
      } else {
        items.remove();
      }
    }
  }
})(Tygh, Tygh.$);
(function (_, $) {
  $.ceEvent("on", "ce.commoninit", function (context) {
    var selector =
      _.ab__smc.selector +
      (_.ab__smc.additional_selector.parent_selectors.length
        ? "," + _.ab__smc.additional_selector.parent_selectors.join(",")
        : "");
    if (selector) {
      var elems = context.find(selector);
      if (elems.length) {
        $.each(elems, function () {
          var elem = $(this);
          if (elem.is(_.ab__smc.exclude.parent_selectors.join(","))) {
            return;
          }
          if (
            elem.find(_.ab__smc.exclude.selectors_in_content.join(",")).length
          ) {
            return;
          }
          var more_txt = _.tr("ab__smc.more");
          var less_txt = _.tr("ab__smc.less");
          var max_height = parseInt(_.ab__smc.max_height);
          var tab_hide = elem.attr("data-ab-smc-tab-hide");
          if (tab_hide != void 0 && tab_hide.length) {
            tab_hide = tab_hide.split("|");
            var device = 2;
            if (window.innerWidth < 1280 && window.innerWidth > 768) {
              device = 1;
            } else if (window.innerWidth < 768) {
              device = 0;
            }
            if (tab_hide[device] === "N") {
              return;
            }
            more_txt = elem.attr("data-ab-smc-more") || _.tr("ab__smc.more");
            less_txt = elem.attr("data-ab-smc-less") || _.tr("ab__smc.less");
            if (elem.attr("data-ab-smc-tab-override-h") === "Y") {
              max_height = parseInt(elem.attr("data-ab-smc-height"));
            }
          }
          var elem_height = parseInt(elem.outerHeight());
          if (elem_height > max_height) {
            elem.find("> *").wrapAll("<div>");
            var t = _.ab__smc.transition;
            elem
              .addClass(
                "ab-smc-description" + _.ab__smc.description_element_classes
              )
              .css({
                maxHeight: max_height + "px",
                transition: "max-height " + t + "s ease",
                opacity: "0.999999",
              });
            var clickable = $(
              "<div class='ab-smc-more" +
                _.ab__smc.additional_classes_for_parent +
                "'>" +
                "<span class='" +
                _.ab__smc.additional_classes +
                "'>" +
                more_txt +
                "</span>" +
                "<i class='ab-smc-arrow'></i>" +
                "</div>"
            ).appendTo(elem);
            var timeout = t * 0.65 * 1000;
            clickable.on("click", function () {
              var btn = $(this);
              var parent = btn.parent();
              var elem_height = parent
                .addClass("ab-smc-opened")
                .find("> div:first-child")
                .css({ paddingBottom: btn.outerHeight() + "px" })
                .outerHeight();
              btn.parent().css({ maxHeight: elem_height + "px" });
              setTimeout(function () {
                btn.addClass("ab-smc-opened");
                if (!_.ab__smc.show_button) {
                  elem.find(".ab-smc-more").detach();
                  return;
                }
                elem
                  .find(".ab-smc-more")
                  .html(
                    "<span class='" +
                      _.ab__smc.additional_classes +
                      "'>" +
                      less_txt +
                      "</span><i class='ab-smc-arrow'></i>"
                  );
              }, timeout);
              btn.parent().css({ maxHeight: "" });
            });
            _.ab__smc.show_button &&
              elem.on("click", ".ab-smc-more.ab-smc-opened", function () {
                var btn = $(this);
                btn.parent().css({ maxHeight: max_height + "px" });
                setTimeout(function () {
                  btn.removeClass("ab-smc-opened");
                  btn.parent().removeClass("ab-smc-opened");
                  elem
                    .find(".ab-smc-more")
                    .html(
                      "<span>" +
                        more_txt +
                        "</span><i class='ab-smc-arrow'></i>"
                    );
                  elem
                    .find(".ab-smc-more span")
                    .addClass(_.ab__smc.additional_classes);
                }, timeout);
              });
          }
        });
        $.ceEvent("trigger", "ab.hide_product_description.hide", [
          context,
          elems,
          _.ab__smc,
        ]);
      }
    }
  });
})(Tygh, Tygh.$);
(function (_, $) {
  var is_ltr = $("html").attr("dir") === "ltr";
  (function (w, d) {
    var qwerty = {
      q: [0, 0],
      w: [0, 1],
      e: [0, 2],
      r: [0, 3],
      t: [0, 4],
      y: [0, 5],
      u: [0, 6],
      i: [0, 7],
      o: [0, 8],
      p: [0, 9],
      a: [1, 0],
      s: [1, 1],
      d: [1, 2],
      f: [1, 3],
      g: [1, 4],
      h: [1, 5],
      j: [1, 6],
      k: [1, 7],
      l: [1, 8],
      z: [2, 0],
      x: [2, 1],
      c: [2, 2],
      v: [2, 3],
      b: [2, 4],
      n: [2, 5],
      m: [2, 6],
    };
    var azerty = {
      a: [0, 0],
      z: [0, 1],
      e: [0, 2],
      r: [0, 3],
      t: [0, 4],
      y: [0, 5],
      u: [0, 6],
      i: [0, 7],
      o: [0, 8],
      p: [0, 9],
      q: [1, 0],
      s: [1, 1],
      d: [1, 2],
      f: [1, 3],
      g: [1, 4],
      h: [1, 5],
      j: [1, 6],
      k: [1, 7],
      l: [1, 8],
      m: [1, 9],
      w: [2, 0],
      x: [2, 1],
      c: [2, 2],
      v: [2, 3],
      b: [2, 4],
      n: [2, 5],
    };
    var lang = (window.navigator.languages ||
        window.navigator.language ||
        window.navigator.userLanguage)[0],
      keyboard =
        typeof lang != "undefined" &&
        typeof lang.indexOf === "function" &&
        lang.indexOf("fr") > -1
          ? azerty
          : qwerty;
    function TheaterJS(options) {
      var self = this,
        defaults = { autoplay: true, erase: true };
      self.events = {};
      self.scene = -1;
      self.scenario = [];
      self.options = self.utils.merge(defaults, options || {});
      self.casting = {};
      self.current = {};
      self.state = "ready";
      self.lineVisible = false;
    }
    TheaterJS.prototype = {
      constructor: TheaterJS,
      set: function (value, args) {
        var self = this;
        self.current.model = value;
        var setDataPlaceholder = false;
        switch (self.current.type) {
          case "function":
            self.current.voice.apply(self, args);
            break;
          default:
            if (self.lineVisible != true && value != args[3]) {
              value = is_ltr ? value + "|" : "|" + value;
              self.lineVisible = true;
              setDataPlaceholder = true;
            } else {
              self.lineVisible = false;
            }
            if (self.current.voice.tagName === "INPUT") {
              if (setDataPlaceholder) {
                self.current.voice.setAttribute(
                  "data-cur-placeholder-string",
                  args[3]
                );
              }
              self.current.voice.placeholder = value;
            } else {
              self.current.voice.innerHTML = value;
            }
            break;
        }
        return self;
      },
      getSayingSpeed: function (filter, constant) {
        if (typeof filter !== "number") {
          constant = filter;
          filter = 0;
        }
        var self = this,
          experience = self.current.experience + filter,
          skill = constant ? experience : self.utils.randomFloat(experience, 1);
        return self.utils.getPercentageBetween(1000, 50, skill);
      },
      getInvincibility: function () {
        var self = this;
        return self.current.experience * 10;
      },
      isMistaking: function () {
        var self = this;
        return self.current.experience < self.utils.randomFloat(0, 1.4);
      },
      utils: {
        merge: function (dest, origin) {
          for (var key in origin)
            if (origin.hasOwnProperty(key)) dest[key] = origin[key];
          return dest;
        },
        getPercentageBetween: function (min, max, perc) {
          return min - min * perc + max * perc;
        },
        randomCharNear: function (ch) {
          var utils = this,
            threshold = 1,
            nearbyChars = [],
            uppercase = !!ch.match(/[A-Z]/);
          ch = ch.toLowerCase();
          var charPosition = keyboard[ch] || [],
            c,
            p;
          for (c in keyboard) {
            if (!keyboard.hasOwnProperty(c) || c === ch) continue;
            p = keyboard[c];
            if (
              Math.abs(charPosition[0] - p[0]) <= threshold &&
              Math.abs(charPosition[1] - p[1]) <= threshold
            ) {
              nearbyChars.push(c);
            }
          }
          var randomChar =
            nearbyChars.length > 0
              ? nearbyChars[utils.randomNumber(0, nearbyChars.length - 1)]
              : utils.randomChar();
          return uppercase ? randomChar.toUpperCase() : randomChar;
        },
        randomChar: function () {
          var utils = this,
            chars = _.tr("ab__sm.random_char");
          return chars.charAt(utils.randomNumber(0, chars.length - 1));
        },
        randomNumber: function (min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        randomFloat: function (min, max) {
          return Math.round((Math.random() * (max - min) + min) * 10) / 10;
        },
        hasClass: function (el, className) {
          if (el.classList) return el.classList.contains(className);
          else
            return new RegExp("(^| )" + className + "( |$)", "gi").test(
              el.className
            );
        },
        addClass: function (el, className) {
          if (el.classList) el.classList.add(className);
          else el.className += " " + className;
        },
        removeClass: function (el, className) {
          if (el.classList) el.classList.remove(className);
          else
            el.className = el.className.replace(
              new RegExp(
                "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
                "gi"
              ),
              " "
            );
        },
      },
      train: function (actor) {
        var self = this,
          defaults = {
            experience: 0.6,
            voice: function (newValue, newChar, prevChar, str) {
              console.log(newValue);
            },
            type: "function",
            model: "",
          };
        return self.utils.merge(defaults, actor);
      },
      describe: function (name, experience, voice) {
        if (typeof name !== "string")
          throw "actor's name has wrong type: " + typeof name;
        var self = this,
          actor = { name: name };
        if (experience !== void 0) actor.experience = experience;
        if (voice !== void 0) {
          actor.type = typeof voice === "function" ? "function" : "DOM";
          if (actor.type === "DOM")
            actor.voice =
              typeof voice === "string" ? d.querySelector(voice) : voice;
          else actor.voice = voice;
        }
        self.casting[name] = self.train(actor);
        return self;
      },
      write: function () {
        var self = this,
          scenes = Array.prototype.splice.apply(arguments, [0]),
          scene;
        for (var i = 0, l = scenes.length; i < l; i++) {
          scene = scenes[i];
          if (typeof scene === "string") {
            var params = scene.split(":"),
              hasActor = params.length > 1,
              actor = hasActor ? params[0].trim() : null,
              speech = hasActor ? params[1] : params[0];
            if (hasActor) self.write({ name: "actor", args: [actor] });
            if (self.options.erase && hasActor) self.write({ name: "erase" });
            self.write({ name: "say", args: [speech, !hasActor] });
          } else if (typeof scene === "number") {
            if (scene < 0) self.write({ name: "erase", args: [scene] });
            else self.write({ name: "wait", args: [scene] });
          } else if (typeof scene === "function") {
            self.write({ name: "call", args: [scene] });
          } else if (scene instanceof Object) {
            self.scenario.push(scene);
          }
        }
        if (self.options.autoplay) self.play();
        return self;
      },
      play: function (restart) {
        var self = this;
        if (restart === true) self.scene = -1;
        if (self.state === "ready") self.next();
        return self;
      },
      on: function (events, fn) {
        var self = this;
        events = events.split(",");
        for (var i = 0, l = events.length, event; i < l; i++) {
          event = events[i] = events[i].trim();
          (self.events[event] || (self.events[event] = [])).push(fn);
        }
        return self;
      },
      emit: function (scope, event, args) {
        if (typeof scope !== "string") throw "emit: scope missing";
        if (typeof event !== "string") event = void 0;
        else if (event !== void 0 && args === void 0) args = event;
        var self = this,
          eventName = scope + (event ? ":" + event : "");
        self.trigger(eventName, args).trigger("*", [eventName].concat(args));
        return self;
      },
      trigger: function (eventName, args) {
        var self = this,
          events = self.events[eventName] || [];
        args instanceof Array || (args = [args]);
        for (var i = 0, l = events.length; i < l; i++)
          events[i].apply(self, [eventName].concat(args));
        return self;
      },
      call: function (fn, async) {
        var self = this;
        fn.apply(self);
        return !async ? self.next() : self;
      },
      next: function () {
        var self = this,
          prevScene = self.scenario[self.scene];
        if (prevScene)
          self.emit(
            prevScene.name,
            "end",
            [prevScene.name].concat(prevScene.args)
          );
        if (self.scene + 1 >= self.scenario.length) {
          self.state = "ready";
        } else {
          self.state = "playing";
          var nextScene = self.scenario[++self.scene];
          self.emit(
            nextScene.name,
            "start",
            [nextScene.name].concat(nextScene.args)
          );
          self[nextScene.name].apply(self, nextScene.args);
        }
        return self;
      },
      actor: function (actor) {
        var self = this;
        self.current = self.casting[actor];
        return self.next();
      },
      say: function (speech, append) {
        var self = this,
          mistaken = false,
          invincible = self.getInvincibility(),
          cursor,
          model;
        if (append) {
          model = self.current.model;
          cursor = self.current.model.length - 1;
          speech = model + speech;
        } else {
          model = self.current.model = "";
          cursor = -1;
        }
        var timeout = setTimeout(function nextChar() {
          var prevChar = model.charAt(cursor),
            newChar,
            newValue;
          if (mistaken) {
            invincible = self.getInvincibility();
            mistaken = false;
            newChar = null;
            newValue = model = model.substr(0, cursor);
            cursor--;
          } else {
            cursor++;
            newChar = speech.charAt(cursor);
            if (
              --invincible < 0 &&
              (prevChar !== newChar || self.current.experience <= 0.3) &&
              self.isMistaking()
            ) {
              newChar = self.utils.randomCharNear(newChar);
            }
            if (newChar !== speech.charAt(cursor)) mistaken = true;
            newValue = model += newChar;
          }
          self.set(newValue, [newValue, newChar, prevChar, speech]);
          if (mistaken || cursor < speech.length)
            timeout = setTimeout(nextChar, self.getSayingSpeed());
          else self.next();
        }, self.getSayingSpeed());
        return self;
      },
      erase: function (n) {
        var self = this,
          cursor =
            typeof self.current.model === "string"
              ? self.current.model.length
              : -1,
          min = typeof n === "number" && n < 0 ? cursor + 1 + n : 0;
        if (cursor < 0) return self.next();
        var timeout = setTimeout(function eraseChar() {
          var prevChar = self.current.model.charAt(cursor),
            newValue = self.current.model.substr(0, --cursor);
          self.set(newValue, [newValue, null, prevChar, newValue]);
          if (cursor >= min)
            setTimeout(eraseChar, self.getSayingSpeed(0.2, true));
          else self.next();
        }, self.getSayingSpeed(0.2, true));
        return self;
      },
      wait: function (delay) {
        var self = this;
        setTimeout(function () {
          self.next();
        }, delay);
        return self;
      },
    };
    w.TheaterJS = TheaterJS;
  })(window, document);
  function _get_cyrillic_languages() {
    return ["ru", "ua"];
  }
})(Tygh, Tygh.$);
(function (_, $) {
  $.ceEvent("on", "ce.commoninit", function (context) {
    var is_ltr = _.language_direction === "ltr";
    setTimeout(function () {
      var input = context.find(
        "#search_input:not([data-cur-placeholder-string])"
      );
      if (
        input.length &&
        _.ab__sm.phrases.length &&
        typeof _.ab__sm.phrases === "object"
      ) {
        _.ab__sm.theater = new TheaterJS();
        _.ab__sm.theater.describe("SearchBox", 0.8, "#search_input");
        input.removeClass("cm-hint").val("");
        var v_input = input[0];
        var title = v_input.getAttribute("title");
        v_input.setAttribute("data-cur-placeholder-string", title);
        v_input.setAttribute("name", "q");
        var erase = function (title, tmp_c) {
          v_input.setAttribute(
            "placeholder",
            (!is_ltr ? "|" : "") +
              title.substring(0, title.length - tmp_c) +
              (is_ltr ? "|" : "")
          );
          if (title.length - tmp_c) {
            setTimeout(function () {
              erase(title, tmp_c + 1);
            }, 75);
          } else {
            _.ab__sm.phrases.forEach(function (item) {
              if (item !== "") {
                _.ab__sm.theater
                  .write("SearchBox:" + item.trim())
                  .write({ name: "wait", args: [2000] });
              }
            });
            _.ab__sm.theater.write(function () {
              _.ab__sm.theater.play(true);
            });
          }
        };
        erase(title, 0);
      }
    }, _.ab__sm.delay);
  });
})(Tygh, Tygh.$);
(function (_, $) {
  $(document).ready(function () {
    var scroll_height = 100;
    var position = _.ab__stt.settings.position;
    var hide_on_mobile = _.ab__stt.settings.hide_on_mobile;
    var css_arrow = {
      "font-size": _.ab__stt.settings.font_size + _.ab__stt.units,
      "font-weight": _.ab__stt.settings.font_weight,
      color: _.ab__stt.settings.ab__stt_color,
    };
    var css_block = {
      "margin-top": _.ab__stt.settings.margin_top + _.ab__stt.units,
      "margin-right": _.ab__stt.settings.margin_right + _.ab__stt.units,
      "margin-bottom": _.ab__stt.settings.margin_bottom + _.ab__stt.units,
      "margin-left": _.ab__stt.settings.margin_left + _.ab__stt.units,
      display: "none",
    };
    switch (position) {
      case "top_right":
        css_block.top = 0;
        css_block.right = 0;
        break;
      case "top_left":
        css_block.top = 0;
        css_block.left = 0;
        break;
      case "bottom_right":
        css_block.bottom = 0;
        css_block.right = 0;
        break;
      case "bottom_left":
        css_block.bottom = 0;
        css_block.left = 0;
        break;
    }
    if ($(window).scrollTop() > scroll_height) css_block.display = "block";
    if (!_is_mobile() || hide_on_mobile === "N") {
      $("body").append(
        '<div class="ab__scroll_to_top_button"><span class="ab__stt-' +
          _.ab__stt.settings.icon +
          '"></span></div>'
      );
      $("div.ab__scroll_to_top_button")
        .css(css_block)
        .find("span")
        .css(css_arrow);
    }
    $(window).scroll(function () {
      if ($(this).scrollTop() > scroll_height)
        $(".ab__scroll_to_top_button").stop().fadeIn();
      else $(".ab__scroll_to_top_button").stop().fadeOut();
    });
    $(document).on("click", "div.ab__scroll_to_top_button", function () {
      $("html, body")
        .stop()
        .animate(
          { scrollTop: 0 },
          {
            duration: _.ab__stt.transition > 1500 ? 1500 : _.ab__stt.transition,
            easing: "linear",
          }
        );
      return false;
    });
    function _is_mobile() {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
          navigator.userAgent
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          navigator.userAgent.substr(0, 4)
        )
      ) {
        return true;
      }
      return false;
    }
  });
})(Tygh, Tygh.$);
(function (_, $) {
  function ab__toogle_video(iframe) {
    iframe.contentWindow.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "*"
    );
  }
  $.ceEvent("on", "ce.dialogshow", function (d) {
    if (/ab__vg_video_/.test(d.attr("id"))) {
      $(".ab__vg_loading", $(d)).trigger("click");
    }
    $(d).one("dialogclose", function (event) {
      var iframe = $("iframe", $(this));
      if (iframe.length) {
        iframe.each(function (i, v) {
          ab__toogle_video(v);
        });
      }
    });
  });
  $.ceEvent("on", "ce.product_image_gallery.ready", function () {
    var elem = $(".cm-thumbnails-mini.active");
    if (elem.length) {
      var c_id = elem.data("caGalleryLargeId");
      var pos = elem.data("caImageOrder") || 0;
      if (c_id !== undefined) {
        $("#" + c_id)
          .closest(".cm-preview-wrapper")
          .trigger("owl.goTo", pos);
      }
      let gallery = elem.closest(".owl-carousel");
      if (gallery.length) {
        for (let i = 2; i < pos; i++) {
          gallery.trigger("owl.next");
        }
      }
    }
  });
  $.ceEvent("on", "ce.product_image_gallery.image_changed", function () {
    var iframes = $("iframe.ab__vg-image_gallery_video");
    iframes.each(function () {
      ab__toogle_video($(this).get(0));
    });
  });
  $(_.doc).on("click", ".ab__vg_loading", function () {
    var elem = $(this),
      iframe = $("<iframe></iframe>");
    iframe.addClass(elem.attr("class"));
    iframe.attr("id", elem.attr("id"));
    $.each(elem.data(), function (i, val) {
      iframe.attr(i, val);
    });
    elem.replaceWith(iframe);
    iframe.removeClass("ab__vg_loading");
  });
  $(_.doc).on(
    "click",
    ".ab__vg-image_gallery_video.cm-dialog-opener",
    function () {
      var id = $(this).data("caTargetId");
      if (id !== undefined) {
        $("#" + id + " .ab__vg_loading").trigger("click");
      }
    }
  );
})(Tygh, Tygh.$);
(function (_, $) {
  $.ceEvent("on", "ce.commoninit", function (context) {
    var cache_key = _.ab__stickers.runtime.cache_key;
    var items = context.find("[data-ab-sticker-id]");
    for (var timeout in _.ab__stickers.timeouts) {
      clearTimeout(_.ab__stickers.timeouts[timeout]);
    }
    if (items.length) {
      var sticker_ids = [];
      var stickers_storage = JSON.parse(localStorage.getItem(cache_key));
      var ids_to_remove = [];
      items.each(function () {
        var item = $(this);
        var item_sticker = item.attr("data-ab-sticker-id");
        if (stickers_storage !== null) {
          if (stickers_storage.html[item_sticker] != void 0) {
            create_sticker(item, stickers_storage.html[item_sticker]);
            ids_to_remove.push(item_sticker);
          }
        }
        sticker_ids.push(item_sticker);
      });
      sticker_ids = sticker_ids.filter(function (value, index, self) {
        return self.indexOf(value) === index && !~ids_to_remove.indexOf(value);
      });
      if (sticker_ids.length) {
        var sticker_placeholders = [];
        sticker_ids.forEach(function (id) {
          sticker_placeholders.push({
            placeholders: $('[data-ab-sticker-id="' + id + '"]').data(
              "placeholders"
            ),
            id: id,
          });
        });
        $.ceAjax(
          "request",
          fn_url("ab__stickers.get_stickers?sl=" + _.cart_language),
          {
            method: "post",
            hidden: true,
            data: {
              sticker_ids: sticker_ids,
              sticker_placeholders: sticker_placeholders,
              controller_mode: _.ab__stickers.runtime.controller_mode,
            },
            callback: function (data, params) {
              if (!is_object_empty(data.stickers_html)) {
                var html = data.stickers_html;
                var local_storage_assign = { html: {} };
                items.each(function () {
                  var item = $(this);
                  var item_sticker = item.attr("data-ab-sticker-id");
                  local_storage_assign.html[item_sticker] = html[item_sticker];
                  create_sticker(item, html[item_sticker]);
                });
                if (_.ab__stickers.runtime.caching === true) {
                  if (stickers_storage !== null) {
                    local_storage_assign.html = Object.assign(
                      local_storage_assign.html,
                      stickers_storage.html
                    );
                  }
                  try {
                    localStorage.setItem(
                      cache_key,
                      JSON.stringify(local_storage_assign)
                    );
                  } catch (e) {
                    localStorage.removeItem(cache_key);
                    localStorage.setItem(
                      cache_key,
                      JSON.stringify(local_storage_assign)
                    );
                  }
                }
              }
            },
          }
        );
      }
      _.ab__stickers.close_tooltip = function (btn) {
        btn = $(btn);
        var tooltip = btn.parent();
        var id = tooltip.data("data-sticker-id");
        clearTimeout(_.ab__stickers.timeouts[id]);
        tooltip.css({ display: "none", top: "-1000px" });
        setTimeout(function () {
          tooltip.css("display", "");
        }, 50);
      };
    }
    var wrapper = context.find(".ab-stickers-wrapper");
    if (wrapper.length) {
      var prev_w_size = 0;
      var resize = function () {
        if (prev_w_size !== window.innerWidth) {
          prev_w_size = window.innerWidth;
          var add_h = function () {
            var image = context
              .find(".ty-product-img a.cm-image-previewer img")
              .first();
            if (
              image.length &&
              image[0].complete &&
              image[0].offsetHeight > 150
            ) {
              wrapper.css("max-height", image[0].offsetHeight + "px");
            } else {
              setTimeout(function () {
                add_h();
              }, 100);
            }
          };
          add_h();
        }
      };
      $(window).on("resize", resize);
      resize();
    }
  });
  $.ceEvent("on", "ab__vg.on_state_change", (info, state) => {
    if (_.ab__video_gallery.settings.on_thumbnail_click === "image_replace") {
      var stickers = $("#" + info.iframe_id)
        .parents(".ab_vg-images-wrapper")
        .find(".ab-stickers-wrapper");
      if (stickers.length) {
        if (info.video_type === "Y") {
          if (state.data === 1) {
            stickers.css("display", "none");
          } else if (state.data === 2) {
            stickers.css("display", "");
          }
        } else if (info.video_type === "V") {
          if (info.event === "play") {
            stickers.css("display", "none");
          } else if (info.event === "pause") {
            stickers.css("display", "");
          }
        }
      }
    }
  });
  function create_sticker(item, sticker_html) {
    item.html(sticker_html);
    var sticker = item.find("[data-id]");
    if (sticker.length) {
      var id = sticker.data("id");
      var tooltip = $("[data-sticker-id='" + id + "']").first();
      sticker.on("touchstart mouseenter", function () {
        var tooltip_pointer = tooltip.next();
        if (!tooltip.hasClass("moved")) {
          $("[data-sticker-id='" + id + "']:not(:first)").remove();
          $("[data-sticker-p-id='" + id + "']:not(:first)").remove();
          tooltip.appendTo("#" + _.container).addClass("moved");
          tooltip_pointer.appendTo("#" + _.container);
        }
        clearTimeout(_.ab__stickers.timeouts[id]);
        var s_height = sticker.outerHeight(true);
        var s_width = sticker.outerWidth(true);
        var s_pos = sticker.offset();
        var tooltip_w = tooltip.outerWidth();
        var tooltip_pos_y = s_pos.top + s_height + 10;
        var tooltip_pos_x = s_pos.left + s_width / 2 - tooltip_w / 2;
        var rectangle = {
          top: tooltip_pos_y,
          left: tooltip_pos_x,
          right: tooltip_pos_x + tooltip_w,
        };
        if (rectangle.right > window.innerWidth) {
          rectangle.left -= rectangle.right - window.innerWidth + 25;
        } else if (rectangle.left < 0) {
          rectangle.left = 25;
        }
        tooltip_pointer
          .css({
            top: rectangle.top + "px",
            left: sticker.offset().left + sticker.outerWidth() / 2,
          })
          .hover(
            function () {
              clearTimeout(_.ab__stickers.timeouts[id]);
              tooltip.addClass("hovered");
            },
            function () {
              clearTimeout(_.ab__stickers.timeouts[id]);
              _.ab__stickers.timeouts[id] = setTimeout(function () {
                tooltip.removeClass("hovered");
              }, 50);
            }
          );
        tooltip
          .css({ top: rectangle.top + "px", left: rectangle.left + "px" })
          .addClass("hovered");
      });
      var hide_sticker = function () {
        clearTimeout(_.ab__stickers.timeouts[id]);
        _.ab__stickers.timeouts[id] = setTimeout(function () {
          tooltip.removeClass("hovered");
        }, 50);
      };
      sticker.on("mouseleave", hide_sticker);
    }
  }
  var hide_active_sticker = function () {
    $(".ab-sticker__tooltip.hovered").each(function () {
      var id = this.getAttribute("data-sticker-id");
      $('.ab-sticker[data-id="' + id + '"]').trigger("mouseleave");
    });
  };
  $(_.doc).on("touchstart", function (e) {
    var selectors = ".ab-sticker, .ab-sticker__tooltip";
    var jelm = $(e.target);
    if (!jelm.is(selectors) && !jelm.parents(selectors).length) {
      hide_active_sticker();
    }
  });
  function is_object_empty(obj) {
    return obj == void 0 || Object.keys(obj).length === 0;
  }
})(Tygh, Tygh.$);
(function (_, $) {
  $.ceEvent("on", "ce.commoninit", function (context) {
    var time_elements = context.find(".cm-cr-mask-time");
    if (time_elements.length === 0) {
      return true;
    }
    time_elements.mask("99:99");
  });
  $.ceEvent("on", "ce.formpre_call_requests_form", function (form, elm) {
    var val_email = form.find('[name="call_data[email]"]').val(),
      val_phone = form.find('[name="call_data[phone]"]').val(),
      allow = !!(val_email || val_phone),
      error_box = form.find(".cm-cr-error-box"),
      dlg = $.ceDialog("get_last");
    error_box.toggle(!allow);
    dlg.ceDialog("reload");
    if (allow) {
      var product_data = $(
        '[name="' + form.data("caProductForm") + '"]'
      ).serializeObject();
      $.each(product_data, function (key, value) {
        if (key.match(/product_data/)) {
          form.append(
            '<input type="hidden" name="' + key + '" value="' + value + '" />'
          );
        }
      });
    }
    return allow;
  });
  $.ceEvent("on", "ce.dialog.before_open", function (dialog_state, params) {
    if (dialog_state.is_opening_allowed === false) {
      return;
    }
    if (params.purpose === "call_request") {
      var $clickedButton = $('[href="'.concat(params.href, '"]')),
        $form = $clickedButton.closest("form"),
        $existSubmitButton = $form.find(
          "[type=submit1], input[type=image]"
        ).length;
      if ($existSubmitButton) {
        var result = $form.ceFormValidator("check", true, null, true);
        dialog_state.is_opening_allowed = result;
      }
    }
  });
  $.ceEvent(
    "on",
    "ce.stripe.instant_payment.loaded",
    function (hasShownButtons) {
      if (!hasShownButtons) {
        return;
      }
      $(".ty-cr-product-button").addClass("hidden");
    }
  );
})(Tygh, Tygh.$);
!(function (t, e) {
  "use strict";
  "function" == typeof define && define.noamd
    ? define(["jquery"], function (t) {
        e(t);
      })
    : "object" == typeof module && module.exports
    ? (module.exports = t.EasyZoom = e(require("jquery")))
    : (t.EasyZoom = e(t.jQuery));
})(this, function (i) {
  "use strict";
  var c,
    d,
    l,
    p,
    u,
    f,
    o = {
      loadingNotice: "Loading image",
      errorNotice: "The image could not be loaded",
      errorDuration: 2500,
      linkAttribute: "href",
      preventClicks: !0,
      beforeShow: i.noop,
      beforeHide: i.noop,
      onShow: i.noop,
      onHide: i.noop,
      onMove: i.noop,
    };
  function s(t, e) {
    (this.$target = i(t)),
      (this.opts = i.extend({}, o, e, this.$target.data())),
      void 0 === this.isOpen && this._init();
  }
  return (
    (s.prototype._init = function () {
      (this.$link = this.$target.find("a")),
        (this.$image = this.$target.find("img")),
        (this.$flyout = i('<div class="easyzoom-flyout" />')),
        (this.$notice = i('<div class="easyzoom-notice" />')),
        this.$target.on({
          "mousemove.easyzoom touchmove.easyzoom": i.proxy(this._onMove, this),
          "mouseleave.easyzoom touchend.easyzoom": i.proxy(this._onLeave, this),
          "mouseenter.easyzoom touchstart.easyzoom": i.proxy(
            this._onEnter,
            this
          ),
        }),
        this.opts.preventClicks &&
          this.$target.on("click.easyzoom", function (t) {
            t.preventDefault();
          });
    }),
    (s.prototype.show = function (t, e) {
      var o = this;
      if (!1 !== this.opts.beforeShow.call(this)) {
        if (!this.isReady)
          return this._loadImage(
            this.$link.attr(this.opts.linkAttribute),
            function () {
              (!o.isMouseOver && e) || o.show(t);
            }
          );
        this.$target.append(this.$flyout);
        var i = this.$target.outerWidth(),
          s = this.$target.outerHeight(),
          h = this.$flyout.width(),
          n = this.$flyout.height(),
          a = this.$zoom.width(),
          r = this.$zoom.height();
        (c = a - h) < 0 && (c = 0),
          (d = r - n) < 0 && (d = 0),
          (l = c / i),
          (p = d / s),
          (this.isOpen = !0),
          this.opts.onShow.call(this),
          t && this._move(t);
      }
    }),
    (s.prototype._onEnter = function (t) {
      var e = t.originalEvent.touches;
      (this.isMouseOver = !0),
        (e && 1 != e.length) || (t.preventDefault(), this.show(t, !0));
    }),
    (s.prototype._onMove = function (t) {
      this.isOpen && (t.preventDefault(), this._move(t));
    }),
    (s.prototype._onLeave = function () {
      (this.isMouseOver = !1), this.isOpen && this.hide();
    }),
    (s.prototype._onLoad = function (t) {
      t.currentTarget.width &&
        ((this.isReady = !0),
        this.$notice.detach(),
        this.$flyout.html(this.$zoom),
        this.$target.removeClass("is-loading").addClass("is-ready"),
        t.data.call && t.data());
    }),
    (s.prototype._onError = function () {
      var t = this;
      this.$notice.text(this.opts.errorNotice),
        this.$target.removeClass("is-loading").addClass("is-error"),
        (this.detachNotice = setTimeout(function () {
          t.$notice.detach(), (t.detachNotice = null);
        }, this.opts.errorDuration));
    }),
    (s.prototype._loadImage = function (t, e) {
      var o = new Image();
      this.$target
        .addClass("is-loading")
        .append(this.$notice.text(this.opts.loadingNotice)),
        (this.$zoom = i(o)
          .on("error", i.proxy(this._onError, this))
          .on("load", e, i.proxy(this._onLoad, this))),
        (o.style.position = "absolute"),
        (o.src = t);
    }),
    (s.prototype._move = function (t) {
      if (0 === t.type.indexOf("touch")) {
        var e = t.touches || t.originalEvent.touches;
        (u = e[0].pageX), (f = e[0].pageY);
      } else (u = t.pageX || u), (f = t.pageY || f);
      var o = this.$target.offset(),
        i = f - o.top,
        s = u - o.left,
        h = Math.ceil(i * p),
        n = Math.ceil(s * l);
      if (n < 0 || h < 0 || c < n || d < h) this.hide();
      else {
        var a = -1 * h,
          r = -1 * n;
        this.$zoom.css({ top: a, left: r }), this.opts.onMove.call(this, a, r);
      }
    }),
    (s.prototype.hide = function () {
      this.isOpen &&
        !1 !== this.opts.beforeHide.call(this) &&
        (this.$flyout.detach(),
        (this.isOpen = !1),
        this.opts.onHide.call(this));
    }),
    (s.prototype.swap = function (t, e, o) {
      this.hide(),
        (this.isReady = !1),
        this.detachNotice && clearTimeout(this.detachNotice),
        this.$notice.parent().length && this.$notice.detach(),
        this.$target.removeClass("is-loading is-ready is-error"),
        this.$image.attr({ src: t, srcset: i.isArray(o) ? o.join() : o }),
        this.$link.attr(this.opts.linkAttribute, e);
    }),
    (s.prototype.teardown = function () {
      this.hide(),
        this.$target
          .off(".easyzoom")
          .removeClass("is-loading is-ready is-error"),
        this.detachNotice && clearTimeout(this.detachNotice),
        delete this.$link,
        delete this.$zoom,
        delete this.$image,
        delete this.$notice,
        delete this.$flyout,
        delete this.isOpen,
        delete this.isReady;
    }),
    (i.fn.easyZoom = function (e) {
      return this.each(function () {
        var t = i.data(this, "easyZoom");
        t
          ? void 0 === t.isOpen && t._init()
          : i.data(this, "easyZoom", new s(this, e));
      });
    }),
    s
  );
});
(function (_, $) {
  var FLYOUT_WIDTH = 450,
    FLYOUT_HEIGHT = 450,
    FLYOUT_OFFSET = 10,
    VISIBLE_Z_INDEX = 1100,
    HIDDEN_Z_INDEX = -9001,
    FLYOUT_CLASS = "ty-image-zoom__flyout",
    FLYOUT_VISIBLE_CLASS = FLYOUT_CLASS + "--visible",
    QUICK_VIEW_SELECTOR = '[aria-describedby="product_quick_view"]:visible',
    FLYOUT_DELAY_BEFORE_DISPLAY = 200,
    FLYOUT_DELAY_BEFORE_HIDE = 100,
    VIEW_BOX_SIZE = 100;
  var POS_TOP_CENTER = 0,
    POS_TOP_RIGHT = 1,
    POS_TOP_RIGHT_OUT = 2,
    POS_RIGHT_TOP = 3,
    POS_RIGHT_CENTER = 4,
    POS_RIGHT_BOTTOM = 5,
    POS_RIGHT_BOTTOM_OUT = 6,
    POS_BOTTOM_RIGHT = 7,
    POS_BOTTOM_CENTER = 8,
    POS_BOTTOM_LEFT = 9,
    POS_LEFT_BOTTOM_OUT = 10,
    POS_LEFT_BOTTOM = 11,
    POS_LEFT_CENTER = 12,
    POS_LEFT_TOP = 13,
    POS_TOP_LEFT_OUT = 14,
    POS_TOP_LEFT = 15,
    POSITION_EDGE = 16;
  var thumbnailPosition,
    flyoutSize,
    thumbnailSize,
    pointerPosition,
    ratioX,
    ratioY,
    pointerPositionChecker,
    hasActiveFlyout,
    positionId,
    $thumbnail,
    $previewerWrapper;
  function isPointBoundedByRectangle(
    pointX,
    pointY,
    rectX,
    rectY,
    rectWidth,
    rectHeight
  ) {
    return (
      pointX > rectX &&
      pointX < rectX + rectWidth &&
      pointY > rectY &&
      pointY < rectY + rectHeight
    );
  }
  EasyZoom.prototype._move = function (e) {
    var self = this;
    if (!pointerPosition) {
      return;
    }
    if (!hasActiveFlyout) {
      $.debounce(function () {
        $.ceImageZoom("getThumbnailPosition");
        if (!$.ceImageZoom("isPointerInThumbnail")) {
          return;
        }
        var flyoutPosition = $.ceImageZoom("getFlyoutPosition", positionId);
        self.$flyout.css({
          left: flyoutPosition.left,
          top: flyoutPosition.top,
          zIndex: $(QUICK_VIEW_SELECTOR).length
            ? $(QUICK_VIEW_SELECTOR).css("zIndex") + 1
            : VISIBLE_Z_INDEX,
        });
        self.$flyout.addClass(FLYOUT_VISIBLE_CLASS);
        hasActiveFlyout = true;
      }, FLYOUT_DELAY_BEFORE_DISPLAY)();
    }
    if (!pointerPositionChecker) {
      pointerPositionChecker = setInterval(function () {
        if (hasActiveFlyout && !$.ceImageZoom("isPointerInThumbnail")) {
          $.ceImageZoom("hideAllFlyouts", self.$flyout);
        }
      }, FLYOUT_DELAY_BEFORE_HIDE);
    }
    if (!hasActiveFlyout) {
      return;
    }
    var relativePositionX = pointerPosition.pageX - thumbnailPosition.left,
      relativePositionY = pointerPosition.pageY - thumbnailPosition.top;
    var centerDistanceX = (2 * relativePositionX) / thumbnailSize.width - 1,
      centerDistanceY = (2 * relativePositionY) / thumbnailSize.height - 1;
    relativePositionX += centerDistanceX * VIEW_BOX_SIZE;
    relativePositionX = Math.max(relativePositionX, 0);
    relativePositionX = Math.min(relativePositionX, thumbnailSize.width);
    relativePositionY += centerDistanceY * VIEW_BOX_SIZE;
    relativePositionY = Math.max(relativePositionY, 0);
    relativePositionY = Math.min(relativePositionY, thumbnailSize.height);
    var moveX = Math.ceil(relativePositionX * ratioX),
      moveY = Math.ceil(relativePositionY * ratioY);
    this.$zoom.css({ top: moveY * -1, left: moveX * -1 });
  };
  var methods = {
    translateFlyoutPositionToRtl: function translateFlyoutPositionToRtl(
      positionId
    ) {
      if (positionId === POS_TOP_CENTER || positionId === POS_BOTTOM_CENTER) {
        return positionId;
      }
      return POSITION_EDGE - positionId;
    },
    getFlyoutPosition: function getFlyoutPosition(positionId) {
      var flyoutPosition = {};
      var flyoutOuterSize = flyoutSize.width + FLYOUT_OFFSET;
      var thumbnailPositionRight = thumbnailPosition.left + thumbnailSize.width;
      if ($(window).width() - thumbnailPositionRight < flyoutOuterSize) {
        switch (positionId) {
          case POS_TOP_RIGHT_OUT:
            positionId = POS_TOP_LEFT_OUT;
            break;
          case POS_RIGHT_TOP:
            positionId = POS_LEFT_TOP;
            break;
          case POS_RIGHT_CENTER:
            positionId = POS_LEFT_CENTER;
            break;
          case POS_RIGHT_BOTTOM:
            positionId = POS_LEFT_BOTTOM;
            break;
          case POS_RIGHT_BOTTOM_OUT:
            positionId = POS_LEFT_BOTTOM_OUT;
            break;
        }
      } else if (thumbnailPosition.left < flyoutOuterSize) {
        switch (positionId) {
          case POS_LEFT_BOTTOM_OUT:
            positionId = POS_RIGHT_BOTTOM_OUT;
            break;
          case POS_LEFT_BOTTOM:
            positionId = POS_RIGHT_BOTTOM;
            break;
          case POS_LEFT_CENTER:
            positionId = POS_RIGHT_CENTER;
            break;
          case POS_LEFT_TOP:
            positionId = POS_RIGHT_TOP;
            break;
          case POS_TOP_LEFT_OUT:
            positionId = POS_TOP_RIGHT_OUT;
            break;
        }
      }
      switch (positionId) {
        case POS_TOP_LEFT:
          flyoutPosition = {
            top: thumbnailPosition.top - flyoutSize.height - FLYOUT_OFFSET,
            left: thumbnailPosition.left,
          };
          break;
        case POS_TOP_CENTER:
          flyoutPosition = {
            top: thumbnailPosition.top - flyoutSize.height - FLYOUT_OFFSET,
            left:
              thumbnailPosition.left +
              thumbnailSize.width / 2 -
              flyoutSize.width / 2,
          };
          break;
        case POS_TOP_RIGHT:
          flyoutPosition = {
            top: thumbnailPosition.top - flyoutSize.height - FLYOUT_OFFSET,
            left:
              thumbnailPosition.left + thumbnailSize.width - flyoutSize.width,
          };
          break;
        case POS_TOP_RIGHT_OUT:
          flyoutPosition = {
            top: thumbnailPosition.top - flyoutSize.height - FLYOUT_OFFSET,
            left: thumbnailPosition.left + thumbnailSize.width + FLYOUT_OFFSET,
          };
          break;
        case POS_RIGHT_TOP:
          flyoutPosition = {
            top: thumbnailPosition.top,
            left: thumbnailPosition.left + thumbnailSize.width + FLYOUT_OFFSET,
          };
          break;
        case POS_RIGHT_CENTER:
          flyoutPosition = {
            top:
              thumbnailPosition.top +
              thumbnailSize.height / 2 -
              flyoutSize.height / 2,
            left: thumbnailPosition.left + thumbnailSize.width + FLYOUT_OFFSET,
          };
          break;
        case POS_RIGHT_BOTTOM:
          flyoutPosition = {
            top:
              thumbnailPosition.top + thumbnailSize.height - flyoutSize.height,
            left: thumbnailPosition.left + thumbnailSize.width + FLYOUT_OFFSET,
          };
          break;
        case POS_RIGHT_BOTTOM_OUT:
          flyoutPosition = {
            top: thumbnailPosition.top + thumbnailSize.height + FLYOUT_OFFSET,
            left: thumbnailPosition.left + thumbnailSize.width + FLYOUT_OFFSET,
          };
          break;
        case POS_BOTTOM_RIGHT:
          flyoutPosition = {
            top: thumbnailPosition.top + thumbnailSize.height + FLYOUT_OFFSET,
            left:
              thumbnailPosition.left + thumbnailSize.width - flyoutSize.width,
          };
          break;
        case POS_BOTTOM_CENTER:
          flyoutPosition = {
            top: thumbnailPosition.top + thumbnailSize.height + FLYOUT_OFFSET,
            left:
              thumbnailPosition.left +
              thumbnailSize.width / 2 -
              flyoutSize.width / 2,
          };
          break;
        case POS_BOTTOM_LEFT:
          flyoutPosition = {
            top: thumbnailPosition.top + thumbnailSize.height + FLYOUT_OFFSET,
            left: thumbnailPosition.left,
          };
          break;
        case POS_LEFT_BOTTOM_OUT:
          flyoutPosition = {
            top: thumbnailPosition.top + thumbnailSize.height + FLYOUT_OFFSET,
            left: thumbnailPosition.left - flyoutSize.width - FLYOUT_OFFSET,
          };
          break;
        case POS_LEFT_BOTTOM:
          flyoutPosition = {
            top:
              thumbnailPosition.top + thumbnailSize.height - flyoutSize.height,
            left: thumbnailPosition.left - flyoutSize.width - FLYOUT_OFFSET,
          };
          break;
        case POS_LEFT_CENTER:
          flyoutPosition = {
            top:
              thumbnailPosition.top +
              thumbnailSize.height / 2 -
              flyoutSize.height / 2,
            left: thumbnailPosition.left - flyoutSize.width - FLYOUT_OFFSET,
          };
          break;
        case POS_LEFT_TOP:
          flyoutPosition = {
            top: thumbnailPosition.top,
            left: thumbnailPosition.left - flyoutSize.width - FLYOUT_OFFSET,
          };
          break;
        case POS_TOP_LEFT_OUT:
          flyoutPosition = {
            top: thumbnailPosition.top - flyoutSize.height - FLYOUT_OFFSET,
            left: thumbnailPosition.left - flyoutSize.width - FLYOUT_OFFSET,
          };
          break;
        default:
          flyoutPosition = { top: 0, left: 0 };
      }
      return flyoutPosition;
    },
    init: function init($previewer, position) {
      positionId = position;
      var self = methods;
      $previewer.wrap(
        '<span class="ty-image-zoom__wrapper easyzoom easyzoom--adjacent"></span>'
      );
      $(_.doc).on("mousemove mouseover", function (event) {
        pointerPosition = { pageX: event.pageX, pageY: event.pageY };
      });
      var $thumbnailWrapper = $previewer.closest(".ty-image-zoom__wrapper");
      $thumbnailWrapper.easyZoom({
        loadingNotice: "",
        errorNotice: "",
        beforeShow: function beforeShow() {
          $previewerWrapper = $previewer.closest(".cm-preview-wrapper");
          $thumbnail = $(".cm-image", $previewer);
          self.getThumbnailPosition();
          thumbnailSize = {
            width: Math.min($thumbnail.width(), $previewer.width()),
            height: Math.max($thumbnail.height(), $previewer.height()),
          };
          this.$target = $(".ty-tygh");
          self.hideAllFlyouts(this.$flyout);
          this.$flyout.addClass(
            [FLYOUT_CLASS, "hidden-tablet", "hidden-phone"].join(" ")
          );
        },
        onShow: function onShow() {
          flyoutSize = {
            width: Math.min(FLYOUT_WIDTH, this.$zoom.width()),
            height: Math.min(FLYOUT_HEIGHT, this.$zoom.height()),
          };
          var flyoutPosition = $.ceImageZoom("getFlyoutPosition", positionId);
          this.$flyout.css({
            left: flyoutPosition.left,
            top: flyoutPosition.top,
            width: flyoutSize.width,
            height: flyoutSize.height,
          });
          ratioX =
            (this.$zoom.width() - flyoutSize.width) / thumbnailSize.width;
          ratioY =
            (this.$zoom.height() - flyoutSize.height) / thumbnailSize.height;
        },
        beforeHide: function beforeHide() {
          return !self.isPointerInThumbnail();
        },
      });
    },
    getThumbnailPosition: function getThumbnailPosition() {
      thumbnailPosition = {
        left: Math.max(
          $thumbnail.offset().left,
          $previewerWrapper.offset().left
        ),
        top: Math.min($thumbnail.offset().top, $previewerWrapper.offset().top),
      };
      return thumbnailPosition;
    },
    hideAllFlyouts: function hideAllFlyouts($activeFlyout) {
      $("." + FLYOUT_CLASS)
        .removeClass(FLYOUT_VISIBLE_CLASS)
        .css({ zIndex: HIDDEN_Z_INDEX });
      if ($activeFlyout) {
        $activeFlyout
          .removeClass(FLYOUT_VISIBLE_CLASS)
          .css({ zIndex: HIDDEN_Z_INDEX });
      }
      hasActiveFlyout = false;
      if (pointerPositionChecker) {
        clearInterval(pointerPositionChecker);
        pointerPositionChecker = null;
      }
    },
    isPointerInThumbnail: function isPointerInThumbnail() {
      return (
        pointerPosition &&
        isPointBoundedByRectangle(
          pointerPosition.pageX,
          pointerPosition.pageY,
          thumbnailPosition.left,
          thumbnailPosition.top,
          thumbnailSize.width,
          thumbnailSize.height
        )
      );
    },
  };
  $.extend({
    ceImageZoom: function ceImageZoom(method) {
      if (methods[method]) {
        return methods[method].apply(
          this,
          Array.prototype.slice.call(arguments, 1)
        );
      } else {
        $.error("ty.imageZoom: method " + method + " does not exist");
      }
    },
  });
})(Tygh, Tygh.$);
(function (_, $) {
  $(document).on("click", ".cm-login-provider,.cm-link-provider", function (e) {
    var jelm = $(e.target);
    var login_provider = false;
    var link_provider = false;
    var url = "";
    var is_facebook_embedded_browser = /fbav/gi.test(
      window.navigator.userAgent
    );
    if (
      jelm.hasClass("cm-login-provider") ||
      jelm.parents(".cm-login-provider").length > 0
    ) {
      login_provider = true;
    }
    if (
      jelm.hasClass("cm-link-provider") ||
      jelm.parents(".cm-link-provider").length > 0
    ) {
      link_provider = true;
    }
    if (login_provider && !jelm.hasClass("cm-login-provider")) {
      jelm = jelm.closest(".cm-login-provider");
    } else if (link_provider && !jelm.hasClass("cm-link-provider")) {
      jelm = jelm.closest(".cm-link-provider");
    }
    var idp = jelm.data("idp");
    var provider = jelm.data("provider");
    var open_id = false;
    switch (provider) {
      case "wordpress":
      case "blogger":
      case "flickr":
      case "livejournal":
        var open_id = true;
        if (provider == "blogger") {
          var un = prompt("Please enter your blog name");
        } else {
          var un = prompt("Please enter your username");
        }
        break;
      case "openid":
        var open_id = true;
        var un = prompt("Please enter your OpenID URL");
    }
    if (!open_id) {
      if (login_provider) {
        url =
          "auth.login_provider?provider_id=" +
          idp +
          "&redirect_url=" +
          encodeURIComponent($("input[name=redirect_url]").val()) +
          "&_ts=" +
          new Date().getTime();
      } else {
        url =
          "profiles.link_provider?provider_id=" +
          idp +
          "&_ts=" +
          new Date().getTime();
      }
    } else {
      var oi = un;
      if (!un) {
        return false;
      }
      switch (provider) {
        case "wordpress":
          oi = "http://" + un + ".wordpress.com";
          break;
        case "livejournal":
          oi = "http://" + un + ".livejournal.com";
          break;
        case "blogger":
          oi = "http://" + un + ".blogspot.com";
          break;
        case "flickr":
          oi = "http://www.flickr.com/photos/" + un + "/";
          break;
      }
      if (login_provider) {
        url =
          "auth.login_provider?provider_id=" +
          idp +
          "&_ts=" +
          new Date().getTime() +
          "&openid_identifier=" +
          encodeURIComponent(oi);
      } else {
        url =
          "profiles.link_provider?provider_id=" +
          idp +
          "&_ts=" +
          new Date().getTime() +
          "&openid_identifier=" +
          encodeURIComponent(oi);
      }
    }
    if (_.embedded) {
      url += "&embedded=true";
    }
    if (is_facebook_embedded_browser) {
      window.location.href = fn_url(url);
    } else {
      window.open(
        fn_url(url),
        "hybridauth_social_sing_on",
        "location=0,status=0,scrollbars=0,width=800,height=500"
      );
    }
  });
  $(document).on("click", ".cm-unlink-provider", function (e) {
    var jelm = $(e.target);
    if (!jelm.hasClass("cm-unlink-provider")) {
      jelm = jelm.closest(".cm-unlink-provider");
    }
    if (confirm(_.tr("text_are_you_sure_to_proceed"))) {
      var idp = jelm.data("idp");
      $.ceAjax(
        "request",
        fn_url("profiles.unlink_provider?provider_id=" + idp),
        { method: "post", result_ids: "hybrid_providers" }
      );
    }
  });
  $(document).on("change", ".cm-select-provider", function (e) {
    var jelm = $(e.target),
      option = $("option:selected", jelm),
      provider = option.data("provider"),
      id = option.data("id");
    $.ceAjax(
      "request",
      fn_url("hybrid_auth.select_provider?provider=" + provider + "&id=" + id),
      {
        method: "get",
        result_ids:
          "content_keys_" +
          id +
          ",content_params_" +
          id +
          ",content_tab_callback_urls_" +
          id,
      }
    );
  });
})(Tygh, Tygh.$);
(function (_, $) {
  $.ceEvent("on", "ce.commoninit", function (context) {
    var $bCity = $('[name="user_data[b_city]"]', context);
    var $sCity = $('[name="user_data[s_city]"]', context);
    if (!$bCity.length && !$sCity.length) {
      return;
    }
    $bCity.autocomplete({
      source: function source(request, response) {
        var type = this.element.attr("name").substr(10, 1);
        getRusCities(type, request, response);
      },
    });
    $sCity.autocomplete({
      source: function source(request, response) {
        var type = this.element.attr("name").substr(10, 1);
        getRusCities(type, request, response);
      },
      open: function open() {
        $(this)
          .autocomplete("widget")
          .css(
            "z-index",
            $.ceDialog("get_last").closest(".ui-dialog").css("z-index") + 1
          );
      },
    });
    function getRusCities(type, request, response) {
      var check_country = $("[name='user_data[" + type + "_country]']").length
        ? $("[name='user_data[" + type + "_country]']").val()
        : "";
      var check_state = $("[name='user_data[" + type + "_state]']").length
        ? $("[name='user_data[" + type + "_state]']").val()
        : "";
      $.ceAjax(
        "request",
        fn_url(
          "city.autocomplete_city?q=" +
            encodeURIComponent(request.term) +
            "&check_state=" +
            check_state +
            "&check_country=" +
            check_country
        ),
        {
          callback: function callback(data) {
            response(data.autocomplete);
          },
        }
      );
    }
  });
})(Tygh, Tygh.$);
