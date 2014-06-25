Ext.define('icc.store.idatabase.Statistic.Period', {
    extend: 'Ext.data.Store',
    fields: ["name", "value"],
    data: [{
        "name": '最近24小时',
        "value": 24*3600
    }, {
        "name": '最近48小时',
        "value": 2*24*3600
    }, {
        "name": '最近72小时',
        "value": 3*24*3600
    }, {
        "name": '最近7天',
        "value": 7*24*3600
    }, {
        "name": '最近14天',
        "value": 14*24*3600
    }, {
        "name": '最近30天',
        "value": 30*24*3600
    }, {
        "name": '最近2个月',
        "value": 60*24*3600
    }, {
        "name": '最近3个月',
        "value": 90*24*3600
    }, {
        "name": '最近6个月',
        "value": 180*24*3600
    }, {
        "name": '最近12个月',
        "value": 365*24*3600
    }, {
        "name": '最近3年',
        "value": 3*365*24*3600
    }, {
        "name": '最近5年',
        "value": 5*365*24*3600
    }, {
        "name": '最近10年',
        "value": 10*365*24*3600
    }]
});