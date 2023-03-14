Msie.panel.Chart = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        layout: 'form'
        , header: false
        , border: false
        , defaults: {border: false}
        , cls: 'form-with-labels'
        , style: {'margin-top': '15px'}
        , items: [{
            html: '<div id="msie-chart-container"></div>'
        }]
        , listeners: {
            afterlayout: {
                fn: function () {
                    this.setup(config.dataset);
                }, scope: this
            }
            , single: true
        }
    });
    Msie.panel.Chart.superclass.constructor.call(this, config);
};
Ext.extend(Msie.panel.Chart, MODx.Panel, {
    setup: function (dataset) {
        /**
         * Override the reset function, we don't need to hide the tooltips and crosshairs.
         */
        /*Highcharts.Pointer.prototype.reset = function () {
            return undefined;
        };*/

        /**
         * Highlight a point by showing tooltip, setting hover state and draw crosshair
         */
        /*Highcharts.Point.prototype.highlight = function (event) {
            this.onMouseOver(); // Show the hover marker
            this.series.chart.tooltip.refresh(this); // Show the tooltip
            this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
        };*/

        this.reset();

        var colors = {
            time: '#68DBF2'
            , create: '#87B953'
            , update: '#8D3EA2'
            , error: '#F05D5E'
        }
            , container = Ext.get('msie-chart-container');

        var series = [];
        Ext.DomHelper.append(container, {tag: 'div', id: 'msie-chart-time'});
        Ext.DomHelper.append(container, {tag: 'div', id: 'msie-chart-other'});
        for (var key in dataset.data) {
            series.push({
                name: _('msimportexport.chart.serie_' + key)
                , data: dataset.data[key]
                , color: colors[key]
            });

            var self = this
                , id = key == 'time' ? 'msie-chart-time' : 'msie-chart-other'
                , chartItem = {
                chart: {
                    type: 'spline'
                    , spacingLeft: 70
                    , height: '250'
                },
                rangeSelector: {
                    enabled: false
                },
                title: {
                    text: null
                },
                xAxis: {
                    crosshair: true,
                    events: {
                        setExtremes: this.syncExtremes
                    }
                },
                plotOptions: {
                    series: {
                        point: {
                            events: {
                                mouseOver: function (e) {
                                    self.syncTooltip(this.series.chart.container, this.x, e);
                                }
                            }
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                tooltip: {
                    formatter: function () {
                        var s = '';
                        Ext.each(this.points, function (point) {
                            s += '<span style="color: ' + point.series.color + ';">' + point.series.name + '</span>' + ': <b>' + point.y + '</b><br/>';
                        });
                        return s;
                    },
                    shared: true
                },
                series: series
            };
            if (key == 'time') {
                chartItem.chart.spacingLeft = null;
                chartItem.title = {
                    text: dataset.sys.rows + 'x' + dataset.sys.totalFields + ' (' + dataset.sys.ext + ')'
                };
                chartItem.subtitle = {
                    text: _('msimportexport.chart.subtitle_timeout') + dataset.sys.timeout + '; ' + _('msimportexport.chart.subtitle_memory_limit') + dataset.sys.memoryLimit + '; ' + _('msimportexport.chart.subtitle_step_limit') + dataset.sys.chunk + '; ' + _('msimportexport.chart.subtitle_phpversion') + dataset.sys.phpversion
                };
                chartItem.legend = {
                    enabled: false
                };
                chartItem.yAxis = {
                    labels: {
                        formatter: function () {
                            var d = new Date(this.value);
                            return Highcharts.dateFormat('%H:%M:%S.', this.value) + d.getMilliseconds();
                        }
                    }
                    , title: {
                        text: null
                    }
                };
                chartItem.tooltip = {
                    formatter: function () {
                        var v = Highcharts.dateFormat('%H:%M:%S.', this.y) + new Date(this.y).getMilliseconds()
                            , s = '';
                        Ext.each(this.points, function (point) {
                            s += '<span style="color: ' + point.series.color + ';">' + point.series.name + '</span>' + ': <b>' + v + '</b><br/>';
                        });
                        return s;
                    }
                    , shared: true
                };
            }
            Highcharts.chart(id, chartItem);
            if (key == 'time')  series = [];
        }
    }
    , syncTooltip: function (container, p, e) {
        var chart,
            series,
            points = [],
            point;
        for (var i = 0; i < Highcharts.charts.length; i++) {
            chart = Highcharts.charts[i];
            if (chart) {
                if (container.id != chart.container.id) {
                    series = chart.series;
                    Highcharts.each(series, function (s) {
                        Highcharts.each(s.data, function (point) {
                            if (point.x === p && point.series.yAxis.options.index !== 1) {
                                points.push(point)
                            }
                        })
                    });
                    chart.tooltip.refresh(points);
                    point = chart.series[0].points[p];
                    chart.xAxis[0].drawCrosshair(e, point);
                }
            }
        }
    }
    ,reset: function () {
        for (var i = 0; i < Highcharts.charts.length; i++) {
            var chart = Highcharts.charts[i];
            if(chart) chart.destroy();
        }
    }
    , syncExtremes: function (e) {
        var thisChart = this.chart;
        if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
            Highcharts.each(Highcharts.charts, function (chart) {
                if (chart !== thisChart) {
                    if (chart.xAxis[0].setExtremes) { // It is null while updating
                        chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {trigger: 'syncExtremes'});
                    }
                }
            });
        }
    }

});
Ext.reg('msie-panel-chart', Msie.panel.Chart);