var store_reportmaintenance = new Ext.data.JsonStore({
    fields: ['reportid','reportmodule','reportparameter',
        'reporttitle','reportfilename','reporttype','visible',
        'parameterrange','parameterasofdate'],
    proxy: {
        type: 'ajax',
        api: {
            read: './reportmaintenancelist'
        },
        actionMethods : {read : 'POST'}, reader: {
            type: 'json',
            root: 'reportmaintenancelist'
        }
    }
});

var store_exportopt = new Ext.data.Store({
    fields: ['exportid', 'exportdesc'],
    data: {'items':[
        {'exportid':'xls','exportdesc':'Excel(XLS)'},
        {'exportid':'csv','exportdesc':'Excel(CSV)'},
        {'exportid':'rtf','exportdesc':'MS Word(RTF)'},
        {'exportid':'doc','exportdesc':'MS Word(DOC)'}
    ]},
    proxy: {
        type: 'memory',
        actionMethods : {read : 'POST'}, reader: {
            type: 'json',
            root: 'items'
        }
    }
});

Ext.define('Artisan.view.tools.ReportMaintenance', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.util.HashMap',
        'Ext.form.FieldSet'
    ],
    id:'reportmaintenance-win',
    title:'Report Panel',
    width:750,
    modal: true,
    layout: 'fit',
    minimizable: false,
    maximizable:false,
    height:500,
    resizable: false,
    toFrontOnShow: true,
    animCollapse:false,
    fbar: [
        {
            xtype : 'combo',
            store : store_exportopt,
            fieldLabel : 'Export As',
            labelWidth : 60,
            width : 185,
            margin : '0 5 0 0',
            id : 'reportmaintenance_exportas',
            valueField : 'exportid',
            displayField : 'exportdesc',
            queryMode : 'local'
        }   //exportas
        ,
        {
            xtype : 'button',
            text : 'Export',
            handler : function(btn){
                frm = Ext.getCmp('reportmaintenance_paramform');
                selection = Ext.getCmp('reportmaintenancegrid').getSelectionModel().getSelection();
                record = null;
                src = null;
                exporttype = Ext.getCmp('reportmaintenance_exportas').getValue();
                if(selection.length > 0){
                    record = selection[0];
                }

                if(record && exporttype){
                    var paramMap = new Ext.util.HashMap();
                    paramMap.add(frm.getForm().getFieldValues(true));
                    var rtype = record.get('reporttype');
                    if(rtype && rtype == 'RPT'){
                        src = "./creport?parameter="+Ext.encode(frm.getForm().getValues())+"&reportname="+record.data.reportFilename+"&exporttype=" + exporttype;
                    }else{
                        window.open("./reportviewer?reportid=" + record.data.reportid + "&parameter=" + Ext.encode(frm.getForm().getValues())+"&exporttype=" + exporttype);
                    }
                }else{
                    Ext.MessageBox.alert('Information','Select a report and fill up export as');
                }
            }
        }   //exportbtn
        ,
        {
            text: 'Print',
            listeners: {
                click: function(th, e, eOpts){
                    frm = Ext.getCmp('reportmaintenance_paramform');
                    selection = Ext.getCmp('reportmaintenancegrid').getSelectionModel().getSelection();
                    record = null;
                    src = null;
                    if(selection.length > 0)
                        record = selection[0];
                    //.log(record);

                    var paramMap = new Ext.util.HashMap();
                    var fieldValues = frm.getForm().getValues();
                    for(var key in fieldValues){
                        var val = fieldValues[key];
                        paramMap.add(key,!val ? '' : val);
                    }
                    var rtype = record.get('ReportType');
                    if(rtype && rtype == 'RPT'){
                        src = "./creport?parameter="+Ext.encode(paramMap.map)+"&reportname="+record.data.reportfilename+"&exporttype=pdf";
                    }else{
                        src = "./reportviewer?reportid=" + record.data.reportid + "&parameter=" + Ext.encode(paramMap.map)+"&exporttype=pdf";
                    }
                    if(record){
                            window.open(src);
                    }else{
                        Ext.MessageBox.alert('Information','Must select a report first');
                    }
                }
            }
        }
        ,
        {
            type: 'button',
            text: 'Close',
            listeners: {
                click: function(th, e, eOpts){
                    Ext.getCmp('reportmaintenance-win').close();
                }
            }
        }
    ],
    createWindow : function(moduleName, gridName){
        var thisModuleName = moduleName;
        var thisGridName = gridName;
        var reportid;
        Ext.getCmp('reportmaintenance-win').add(
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items:[
                    {
                        xtype: 'grid',
                        width: '40%',
                        hideHeaders: true,
                        title: 'List of Available Reports',
                        bodyStyle: {background: 'transparent'},
                        id: 'reportmaintenancegrid',
                        store: store_reportmaintenance,
                        selModel: {
                            pruneRemoved: false
                        },
                        multiSelect: false,
                        viewConfig: {
                            trackOver: false
                        },
                        columns: [
                            {
                                sortable: true,
                                flex: 1,
                                dataIndex: 'reporttitle'
                            }
                        ],
                        listeners: {
                            afterrender: function(dv, e){
                                store_reportmaintenance.load(
                                    { params: {
                                        moduleName : thisModuleName,
                                        gridName : thisGridName
                                    } }
                                );
                            },
                            select: function(dv, record, e){
                                reportid =  record.data.reportid;
                                var today = new Date();
                                var frm = Ext.getCmp('reportmaintenance_paramform');
                                frm.removeAll();
                                
                                var datefrom = Ext.create('Ext.form.field.Date', {
                                    name: 'datefrom',
                                    fieldLabel: 'Date From',
                                    format: 'm/d/Y',
                                    allowBlank: false,
                                    labelWidth: 75,
                                    submitFormat: 'm/d/Y',
                                    value: today,
                                    margin : '5 0 0 5',
                                    listeners : {
                                        change : function(df, nv){
                                            if(nv){
                                                frm.getForm().findField('dateto').setValue(Ext.Date.getLastDateOfMonth(nv));
                                            }
                                        }
                                    }
                                });
                                var dateto = Ext.create('Ext.form.field.Date', {
                                    name: 'dateto',
                                    fieldLabel: 'Date To',
                                    format: 'm/d/Y',
                                    allowBlank: false,
                                    labelWidth: 75,
                                    submitFormat: 'm/d/Y',
                                    margin : '5 0 0 5',
                                    value: Ext.Date.getLastDateOfMonth(today)
                                });
                                var dateasof = Ext.create('Ext.form.field.Date', {
                                    name: 'dateasof',
                                    fieldLabel: 'As of',
                                    format: 'm/d/Y',
                                    allowBlank: false,
                                    labelWidth: 75,
                                    submitFormat: 'm/d/Y',
                                    margin : '5 0 0 5',
                                    value: today
                                });
                                var strParam = record.data.reportparameter.split(",");
                                
                                var temppanel = Ext.create('Ext.form.FieldSet',{
                                    padding: '5',
                                    border: false,
                                    flex : 1
                                });

                                if (record.data.parameterrange == true) {
                                    temppanel.add(datefrom);
                                    temppanel.add(dateto);
                                }

                                if (record.data.parameterasofdate == true) {
                                    temppanel.add(dateasof);
                                }
                                
                                var otherparam = null;
                                for (var i = 0; i < strParam.length; i++) {
                                    if (strParam[i] != '') {
                                        if (strParam[i].indexOf('.') != -1) {
                                            var tbl = strParam[i].substring(0, strParam[i].indexOf('.'));
                                            var fdstr = Ext.String.trim(strParam[i].substring(strParam[i].indexOf('.') + 1));
                                            var fd, fdesc;
                                            if (fdstr.indexOf(':') != -1) {
                                                fd = fdstr.substring(0, fdstr.indexOf(':'));
                                                fdesc = fdstr.substring(fdstr.indexOf(':') + 1);
                                            } else {
                                                fd = fdstr;
                                                fdesc = fdstr;
                                            }
                                            var report_store_lookup = new Ext.data.Store({
                                                fields: ['id', 'desc'],
                                                proxy: {
                                                    type: 'ajax',
                                                    api: {
                                                        read: './reportlookupList'
                                                    },
                                                    actionMethods: {read: 'POST'}, reader: {
                                                        type: 'json',
                                                        root: 'data'
                                                    }
                                                },
                                                autoLoad: false
                                            });
                                            report_store_lookup.load({params: {tablename: tbl, fieldid: fd, fielddesc: fdesc, desc: true}});
                                            otherparam = Ext.create('Ext.form.field.ComboBox', {
                                                name: fd,
                                                allowBlank: false,
                                                store: report_store_lookup,
                                                labelWidth: 75,
                                                queryMode: 'local',
                                                valueField: 'id',
                                                displayField: 'desc',
                                                margin : '5 0 0 5',
                                                fieldLabel: fd
                                            });
                                        } else {
                                            otherparam = Ext.create('Ext.form.field.Text', {
                                                name: strParam[i],
                                                allowBlank: false,
                                                labelWidth: 80,
                                                margin : '5 0 0 10',
                                                fieldLabel: strParam[i]
                                            });
                                        }
                                        temppanel.add(otherparam);
                                    }
                                }
                                
                                frm.add(temppanel);
                                frm.doLayout();
                                Ext.getCmp('reportmaintenance_paramform').show();
                            }
                        }
                    }   //grid
                    ,
                    {
                        xtype: 'form',
                        title: 'Report Parameters',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        margin: '0',
                        bodyStyle: {
                            background: 'transparent',
                            padding: '10'
                        },
                        width: '60%',
                        id: 'reportmaintenance_paramform'
                    }   //report options
                ]
            }
        );
        Ext.getCmp('reportmaintenance-win').show();
    }
});

var reportmaintenancefr_isOnEdit = false;

Ext.define('model_reportmaintenancefr', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'CtrlID', type: 'string'}
        ,
        {name: 'ReportTitle', type: 'string'}
        ,
        {name: 'QryFileName', type: 'string'}
        ,
        {name: 'Description', type: 'string'}
        ,
        {name: 'LineType', type: 'string'}
        ,
        {name: 'FiscalPeriod', type: 'string'}
        ,
        {name: 'GroupTotal01', type: 'string'}
        ,
        {name: 'GroupTotal02', type: 'string'}
        ,
        {name: 'GroupTotal03', type: 'string'}
        ,
        {name: 'GroupTotal04', type: 'string'}
        ,
        {name: 'GroupTotal05', type: 'string'}
        ,
        {name: 'Level', type: 'int'}
        ,
        {name: 'LineSeqID', type: 'int'}
        ,
        {name: 'SeqID', type: 'int'}
    ]
});

var store_reportmaintenancefr = new Ext.data.JsonStore( {
    model: 'model_reportmaintenancefr',
    proxy: {
        type: 'ajax',
        api: {
            read: './frxrowdeflist?type=frxrowdef'
        },
        actionMethods : {reader : 'POST'},
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: false
});

var reportmaintenancefrdetails_store_reportcatalog = new Ext.data.JsonStore({
    fields: ['ReportID', 'ReportTitle'],
    proxy: {
        type: 'ajax',
        api: {
            read: './reportcataloglist'
        },
        actionMethods : {
            read : 'POST'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: false
});

Ext.define('Artisan.view.tools.ReportMaintenance.FinancialReport', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.util.HashMap',
        'Ext.form.FieldSet',
        'Ext.grid.*',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer',
        'Ext.selection.CellModel',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.state.*',
        'Ext.form.*'
    ],
    id:'reportmaintenancefr-win',
    title:'Report Panel',
    width:750,
    modal: true,
    layout: 'fit',
    minimizable: false,
    maximizable:false,
    height:500,
    resizable: false,
    toFrontOnShow: true,
    animCollapse:false,
    createWindow : function(fiscalperiod){
        var thisPeriod = fiscalperiod;
        Ext.getCmp('reportmaintenancefr-win').add(
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items:[
                    {
                        xtype: 'grid',
                        width: '65%',
                        bodyStyle: {background: 'transparent'},
                        id: 'reportmaintenancefrgrid',
                        store: store_reportmaintenancefr,
                        selModel: {
                            pruneRemoved: false
                        },
                        multiSelect: false,
                        viewConfig: {
                            trackOver: false
                        },
                        listeners:{
                            afterrender: function(dv, e){
                                store_reportmaintenancefr.load();
                                reportmaintenancefrdetails_store_reportcatalog.load({
                                    params : {
                                        field : 'FormName',
                                        value : 'FinancialReport'
                                    },
                                    callback : function(){}
                                });
                            },
                            select : function(grid, record){
                                var me = Ext.getCmp('reportmaintenancefrparam');
                                me.queryById('reportmaintenancefr_FiscalPeriod').setValue(thisPeriod);
                                me.queryById('reportmaintenancefr_CtrlID').setValue(record.data.CtrlID);
                                me.queryById('reportmaintenancefr_Description').setValue(record.data.Description);
                            }
                        },
                        columns: [
                            {
                                text : 'Ctrl ID',
                                dataIndex : 'CtrlID',
                                width: '32%'
                            },
                            {
                                text : 'Report Title',
                                dataIndex : 'ReportTitle',
                                width: '68%'
                            }
                        ],
                        selType: 'rowmodel',
                        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                                            clicksToEdit: 1,
                                            pluginId: 'rowEditing',
                                            listeners: {
                                                'beforeedit':function(e) {
                                                    return reportmaintenancefr_isOnEdit;
                                                }
                                            }
                                        })]
                    },
                    {
                        xtype: 'fieldset',
                        border: false,
                        title: 'Report Parameters',
                        layout: 'vbox',
                        margin: '10',
                        id: 'reportmaintenancefrparam',
                        bodyStyle: {
                            background: 'transparent',
                            padding: '10'
                        },
                        width: '35%',
                        items : [
                            {
                                xtype: 'combo',
                                fieldLabel: 'CtrlID',
                                allowBlank: false,
                                hidden: true,
                                dataIndex: 'CtrlID',
                                name: 'CtrlID',
                                id: 'reportmaintenancefr_CtrlID'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'FiscalPeriod',
                                allowBlank: false,
                                dataIndex: 'FiscalPeriod',
                                name: 'FiscalPeriod',
                                readOnly: true,
                                id: 'reportmaintenancefr_FiscalPeriod'
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: 'Report Format',
                                store : reportmaintenancefrdetails_store_reportcatalog,
                                valueField : 'ReportTitle',
                                displayField : 'ReportTitle',
                                allowBlank: false,
                                dataIndex: 'Description',
                                name: 'Description',
                                id: 'reportmaintenancefr_Description'
                            }
                            ,
                            {
                                xtype: 'button',
                                text: 'Print',
                                width: '100%',
                                listeners: {
                                    click: function(th, e, eOpts){
                                        fiscalperiod = Ext.getCmp('reportmaintenancefr_FiscalPeriod').getValue();
                                        ctrlid = Ext.getCmp('reportmaintenancefr_CtrlID').getValue();
                                        description = Ext.getCmp('reportmaintenancefr_Description').getValue();

                                        selection = Ext.getCmp('reportmaintenancefrgrid').getSelectionModel().getSelection();
                                        record = null;
                                        src = null;
                                        if(selection.length > 0)
                                            record = selection[0];

                                        if (fiscalperiod && ctrlid && description) {
                                            reportid = reportmaintenancefrdetails_store_reportcatalog.findRecord('ReportTitle', description).get('ReportID');
                                            param = {};
                                            param['CtrlID'] = ctrlid;
                                            param['FiscalPeriod'] = fiscalperiod;
                                            window.open("jasperreport?parameter={map:" + Ext.encode(param) + "}&formname=FinancialReport&reportid=" + reportid + "&exporttype=pdf");
                                        } else {
                                            Ext.MessageBox.alert('Information', 'Fill Up CtrlID, Fiscal Period and Description');
                                        }

                                        if(record){
                                            window.open(src);
                                        }else{
                                            Ext.MessageBox.alert('Information','Must select a report first');
                                        }
                                    }
                                }
                            },
                            {
                                xtype : 'combo',
                                store : store_exportopt,
                                fieldLabel : 'Export As',
                                margin : '10 5 0 0',
                                id : 'reportmaintenancefr_exportas',
                                valueField : 'exportid',
                                displayField : 'exportdesc',
                                queryMode : 'local'
                            }   //exportas
                            ,
                            {
                                        xtype : 'button',
                                        text : 'Export',
                                        width: '100%',
                                        margin: '10 0 0 0',
                                        handler : function(btn){
                                            fiscalperiod = Ext.getCmp('reportmaintenancefr_FiscalPeriod').getValue();
                                            ctrlid = Ext.getCmp('reportmaintenancefr_CtrlID').getValue();
                                            description = Ext.getCmp('reportmaintenancefr_Description').getValue();
                                            exporttype = Ext.getCmp('reportmaintenancefr_exportas').getValue();

                                            selection = Ext.getCmp('reportmaintenancefrgrid').getSelectionModel().getSelection();
                                            record = null;
                                            src = null;
                                            if(selection.length > 0)
                                                record = selection[0];

                                            if (fiscalperiod && ctrlid && description) {
                                                reportid = reportmaintenancefrdetails_store_reportcatalog.findRecord('ReportTitle', description).get('ReportID');
                                                param = {};
                                                param['CtrlID'] = ctrlid;
                                                param['FiscalPeriod'] = fiscalperiod;
                                                window.open("jasperreport?parameter={map:" + Ext.encode(param) + "}&formname=FinancialReport&reportid=" + reportid + "&exporttype="+exporttype);
                                            } else {
                                                Ext.MessageBox.alert('Information', 'Fill Up CtrlID, Fiscal Period and Description');
                                            }

                                            if(record){
                                                window.open(src);
                                            }else{
                                                Ext.MessageBox.alert('Information','Must select a report first');
                                            }
                                        }
                                    }   //exportbtn
                                
                        ]
                    }
                ]
            }
        );
        Ext.getCmp('reportmaintenancefr-win').show();
    }
});
