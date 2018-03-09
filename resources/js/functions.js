
function objectifyForm(formArray) {//serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
//        console.log(formArray[i]['name']);
//        console.log(formArray[i]['value']);
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
//    console.log(returnArray);
    return returnArray;
}

function formatDate(){
    var d = new Date(),
    month = '' +(d.getMonth()+1),
    day  = '' + d.getDate(),
    year = '' + d.getYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    
    return [year, month, day].join('-');
}
function AddComas(amount) {
    amount += '';
    x = amount.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function formatTwodecimal(formatamount){
    var formatted_amount = parseFloat(Math.round(formatamount * 100) / 100).toFixed(2);
    return formatted_amount;
}

function convertDate(date) {
    var today = new Date(date);
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = mm + '/' + dd + '/' + yyyy;
    return today;
}
function unformatValue(val, isText) {
    var dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    if (isText) {
        if (typeof val == 'undefined') {
            return '';
        } else {
            return val;
        }
    } else if (val && val.match(dateReg)) {
        return moment(val).format('MM/DD/YYYY');
    } else if (typeof val == 'number' || !isNaN(parseFloat(val))) {
        return val.replace(',', '0');
    } else if (typeof val == 'undefined') {
        return '';
    } else if (typeof val == 'boolean') {
        return val == '1';
    } else if (typeof val == 'string') {
        if (!val || val == null || val.toLowerCase() == 'null') {
            return '';
        } else {
            return val;
        }
    }
}

function formatValue(val, isText) {
    var dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    if (isText) {
        if (typeof val == 'undefined') {
            return '';
        } else {
            return val;
        }
    } else if (val && val.match(dateReg)) {
        return moment(val).format('MM/DD/YYYY');
    } else if (typeof val == 'number' || !isNaN(parseFloat(val))) {
        return parseFloat(val * 1).toFixed(2).replace(/./g, function(c, i, a) {
            return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        });
    } else if (typeof val == 'undefined') {
        return '';
    } else if (typeof val == 'boolean') {
        return val == '1';
    } else if (typeof val == 'string') {
        if (!val || val == null || val.toLowerCase() == 'null') {
            return '';
        } else {
            return val;
        }
    }
}
function changeActive() {
    $('#acc').removeClass('active');
    $('.check').addClass('active');
}
function SignupForm(){
    $('#register').css('display','block');
    $('#login').css('display','none');
}
function register(){
  
    var data_reg = objectifyForm($('#registerForm').serializeArray());
    var UserID = $('#EmailAddress').val();
    data_reg.UserID = UserID;
    data_reg.Username = UserID;
    data_reg.RegDate = today;
    console.log(data_reg);
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
//            dataType: 'jsonp',
            url: baseUrl + "usersservlet?&operation=UPDATE_RECORD",
            dataType: 'json',
            data: JSON.stringify(data_reg), 
            contentType: "application/json",
            success: function(response){
                if(response.success){
                    alert('Congrats!');
                    console.log(data_reg);
                    window.location.reload();
                }else{
                    alert('stop');
                }
                
            }    
        });
}

function printReport(ReferenceID, reportid, formname, exportType) {
    var RefID = ReferenceID;
    window.open(baseUrl + 'jasperreport?jsonformat=jsonp&parameter={"events":{"replace":true,"remove":true,"clear":true,"add":true},"hasListeners":{},"map":{},"length":2}&otherparameter={}&batnbr=' + RefID + '&memberid='+RefID+'&formname='+formname+'&reportid='+reportid+'&exporttype='+exportType+'&custom=false');
}
function showReportForm(batnbr, field, value){
    
    console.log(batnbr);
    console.log(field);
    console.log(value);
    $('#available-reports').empty();
    $('#global-batnbr').val(batnbr);
    $("#reportForm").modal("show");
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'reportcataloglist?jsonformat=jsonp&field='+field+'&value='+value
    });
}
function reportcatalogcallback(response) {
    var batnbr = $('#global-batnbr').val();
    var xpot = 'pdf';
    $('#exportType').change(function() {
        xpot = $('#exportType').val();
        $('#exportType').val(xpot);
        if (response.success) {
            if (response.usage == 'getReports') {
                var arr = response.data;
                console.log(arr);
                $('#available-reports').empty();
                for (var i = 0; i < arr.length; i++) {
                    $('#available-reports').append('<button class = "btn btn-primary helix-btn form-control" style = "margin: 3px 0 3px 0"onclick="printReport(' + batnbr + ',\'' + arr[i].ReportID + '\',\'' + arr[i].FormName + '\',\'' + xpot + '\')">' + arr[i].ReportTitle + '</button>');
                 }
            }
        }
    });
    if (response.success) {
        if (response.usage == 'getReports') {
            var arr = response.data;
//            console.log(arr);
            
            for (var i = 0; i < arr.length; i++) {

                $('#available-reports').append('<button class = "btn btn-default helix-btn btn-sm form-control btn-reportname" id = "tmp_button" style = "margin: 3px 0 3px 0;height:25px;font-size:8pt;padding:0;background: -webkit-radial-gradient(40% 30%, circle farthest-side, #9aabb0, #7e9399),#7e9399;border-color:transaparent;color:#rgb(149,197,56)" onclick="printReport(\'' + batnbr + '\',\'' + arr[i].ReportID + '\',\'' + arr[i].FormName + '\',\'' + xpot + '\')">' + arr[i].ReportTitle + '</button>');
                $('#panel-reports').append('<input type = "hidden" class = "checkbox form-control"  style = "width:10px;height:10px" id = "checkbox'+arr[i].ReportID+'"><button class = "btn btn-default helix-btn btn-sm form-control btn-reportname" id = "btnreport'+arr[i].ReportID+'" style = "margin: 3px 0 3px 0;height:25px;font-size:8pt;padding:0;background: -webkit-radial-gradient(40% 30%, circle farthest-side, #9aabb0, #7e9399),#7e9399;border-color:transaparent;color:#rgb(149,197,56)" onclick="checkReport(\'' + arr[i].ReportID + '\',\'' + arr[i].ReportParameter + '\')">' + arr[i].ReportTitle + '</button>');
                
//                $('#panel-reports').append('<input type = "checkbox" class = "form-control" style = "width:15px;height:15px"><button class = "btn btn-primary helix-btn btn-sm form-control" style = "margin: 3px 0 3px 0;height:25px;font-size:8pt;padding:0" onclick="printPanelReport(\'' + arr[i].ReportID + '\',\'' + arr[i].FormName + '\',)">' + arr[i].ReportTitle + '</button>');
                
            }
        }
    }
}



function checkReport(reportid, ReportParams) {
    
    $(".btn-reportname").css('font-size', '8pt');
    $(".btn-reportname").css('color', '#fff');

    $("#" + "btnreport" + reportid).attr('selected', true);
    $("#" + "btnreport" + reportid).css({
        'font-size': '11pt',
        'color': '#8bc411 !important'
    });
    $('#reportparams').empty();
    $('#global-reportid').val(reportid);
    if (ReportParams != null) {
        var splitted = ReportParams.split(',');
        for (var i = 0; i < splitted.length; i++) {
            
            if (splitted[i].indexOf('.') != -1){
                
                var tbl = splitted[i].substring(0, splitted[i].indexOf('.'));
                var fdstr = $.trim(splitted[i].substring(splitted[i].indexOf('.') + 1));
                var fd, fdesc;
                if (fdstr.indexOf(':') != -1) {
                    fd = fdstr.substring(0, fdstr.indexOf(':'));
                    fdesc = fdstr.substring(fdstr.indexOf(':') + 1);
                } else {
                    fd = fdstr;
                    fdesc = fdstr;
                };
                jQuery.ajax({
                    type: 'POST',
                    jsonpCallback: "callback",
                    crossDomain: true,
                    dataType: 'jsonp',
                    url: baseUrl + 'reportlookuplist?jsonformat=jsonp&tablename='+tbl+'&fieldid='+fd+'&fielddesc='+fdesc
                });
            } 
            if (splitted[i] == 'undefined' || splitted.length > 2) {
                        $('#reportparams').html('<label>Date From</label><input type = "date" class = "input-sm form-control" id = "datefrom" >'
                                         + '<label>Date To</label><input type = "date" class = "datepicker input-sm form-control" id = "dateto">');
            } else if (splitted.length == 1) {
                        $('#reportparams').html('<label>Date From</label><input type = "date" class = "input-sm form-control" id = "datefrom" >'
                                         + '<label>Date To</label><input type = "date" class = "datepicker input-sm form-control" id = "dateto">');
                if(splitted[i] == 'year-month'){
                    $('#reportparams').append('<label>' + splitted[i] + '</label>'
                        + '<input type = "text" id = "year-month" class = "form-control input-sm">'
                      );
                }else{
                    if (splitted[i].indexOf('.') != -1){
                        
                            var tbl = splitted[i].substring(0, splitted[i].indexOf('.'));
                            var fdstr = $.trim(splitted[i].substring(splitted[i].indexOf('.') + 1));
                            var fd, fdesc;
                            if (fdstr.indexOf(':') != -1) {
                                fd = fdstr.substring(0, fdstr.indexOf(':'));
                                fdesc = fdstr.substring(fdstr.indexOf(':') + 1);
                            } else {
                                fd = fdstr;
                                fdesc = fdstr;
                            }
                    }
                    $('#reportparams').append('<label>' + fd + '</label>'
                        +'<select class= "form-control input-sm" id = "dropdown">'
                        +'<option value = ""></option>'
                        +'</select>');
                }
            } else {
                if(splitted[i] == 'year-month'){
                    $('#reportparams').append('<label>' + splitted[i] + '</label>'
                        + '<input type = "text" id = "year-month" class = "form-control input-sm">'
                      );
                }else{
                    
                    if (splitted[i].indexOf('.') != -1){
                        
                            var tbl = splitted[i].substring(0, splitted[i].indexOf('.'));
                            var fdstr = $.trim(splitted[i].substring(splitted[i].indexOf('.') + 1));
                            var fd, fdesc;
                            if (fdstr.indexOf(':') != -1) {
                                fd = fdstr.substring(0, fdstr.indexOf(':'));
                                fdesc = fdstr.substring(fdstr.indexOf(':') + 1);
                            } else {
                                fd = fdstr;
                                fdesc = fdstr;
                            }
                    }
                    $('#reportparams').append('<label>' + fd + '</label>'
                        +'<select class= "form-control input-sm" id = "dropdown">'
                        +'<option value = ""></option>'
                        +'</select>');
                } 
            }

        }

    }

}
function reportlistcallback(response){
    if (response.usage == 'getReportlookup') {
            var arr = response.data[0];
            console.log(arr);
            var option = '';
            $.each(response.data, function(i, item) {
                $("#dropdown").append($("<option></option>", {
                    value: item.id,
                    text: item.desc
                }));
            });
        }
}
function printPanelReport() {
    var formname = $('#global-moduleid').val();
    var datefrom = $('#datefrom').val();
    var dateto = $('#dateto').val();
    var reportid = $('#global-reportid').val();
    var yearmonth = $('#year-month').val();
    var dropdown = $('#dropdown').val();
    var ReportType = $('#ReportType').val();
    if ($('#global-reportid').val() == ''){
        
    }else{
        if (ReportType == 'Crystal'){
            window.open(baseUrl + 'creport?parameter={"datefrom":"12/13/2017","dateto":"12/31/2017"}&reportname=reg_ap_helix_01.rpt&exporttype=pdf&custom=false');
        }else{
            window.open(baseUrl + 'jasperreport?jsonformat=jsonp&parameter={"events":{"replace":true,"remove":true,"clear":true,"add":true},"hasListeners":{},"map":{},"length":2}&otherparameter={}&formname=' + formname + '&reportid=' + reportid + '&exporttype=pdf&custom=false&datefrom=' + datefrom + '&dateto=' + dateto + '&branchid='+dropdown+'&custid='+id+'&year-month='+yearmonth);
        }
        
    }
}
function viewReportPanel(field, value) {
    $('#global-moduleid').val(value);
    $('#panel-reports').empty();
    $("#ReportPanel").modal("show");
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'reportcataloglist?jsonformat=jsonp&field=' + field + '&value=' + value
    });
}
function closeReportPanel() {
    $('#reportparams').empty();
    $("#ReportPanel").modal("toggle");
}


function openUploadExcel(){
    $('#UploadExcelForm').modal('show');
}

 // Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'PHP',
  currencyDisplay: 'code',
  minimumFractionDigits: 2
});

function closeNoReloadMsgbox(){
    $('#MsgAlertConfirmLogout').modal('hide');
}

function closeMsgbox(){
    $('#MsgAlert').modal('toggle');
    window.location.reload();
}
function closeMsgAlertnotreload(){
    $('#MsgAlertnotreload').modal('toggle');
//    window.location.reload();
}
function loadHtmlForm(id, submodule, ModuleName ){
    
    try{
          $('.pmodules').removeClass('active');
          $('#'+id).addClass('active');
          $("#iFrame").replaceWith('<iframe class ="adjust-iframe-margin" id ="iFrame" src ="./resources/modules/' + id + '/' + submodule + '.html" height ="99%" width = "100%" style ="border:0px;max-width: 100%;min-width:100%;width:100%;min-height:87vh;margin-top:-20px"></iframe>');
          hideshowMenu();
          $('.module-name').empty();
          $('.module-name').html(ModuleName);
    }catch(ex){
        alert('asdad');
    }
   
}

/*ctpl function*/

function showLoginForm(){
    $('#LoginForm').modal('show');
}

function close(){
    alert('test');
    $('#LoginForm').modal('toggle');
}


function setCookie(name, value){
    var data = [encodeURIComponent(name) + '=' + encodeURIComponent(value)];
    document.cookie = data.join('; ');
}

function getCookie(name, keepDuplicates){
    var values = [];
    var cookies = document.cookie.split(/; */);
    for (var i = 0; i < cookies.length; i ++){
      var details = cookies[i].split('=');
      if (details[0] == encodeURIComponent(name)){
        values.push(decodeURIComponent(details[1].replace(/\+/g, '%20')));
      }
    }
    return (keepDuplicates ? values : values[0]);
 }
 
 function removeRecord(){
    $('input').val('');
    $('select').val('');
    $('textarea').val('');
 }
 function disabledInput(){
     $('input').attr('disabled', 'disabled');
     $('select').attr('disabled', 'disabled');
     $('textarea').attr('disabled', 'disabled');
     $('input').attr('readonly', 'readonly');
     $('select').attr('readonly', 'readonly');
     $('textarea').attr('readonly', 'readonly');
 }
 function enabledInput(){
     $('input').removeAttr('disabled', 'disabled');
     $('select').removeAttr('disabled', 'disabled');
     $('textarea').removeAttr('disabled', 'disabled');
     $('input').removeAttr('readonly', 'readonly');
     $('select').removeAttr('readonly', 'readonly');
     $('textarea').removeAttr('readonly', 'readonly');
 }
 
 
function formatCurrency() {
    
    
     $('input.number').blur(function(event) {
        if (event.which >= 37 && event.which <= 40 && event.which < 48 || event.which > 57) {
            event.preventDefault();
        }
        $(this).val(function(index, value) {

            value = value.replace(/,/g, '');
            var parts = value.toString().split(".");
            if (parts.length == 1) {
                return numberWithCommas(value) + ".00";
            } else {
                return numberWithCommas(parseFloat(value).toFixed(2));
            }
        });
    });
    
    $('input.amount').keyup(function(event) {
        // skip for arrow keys
        if (event.which >= 37 && event.which <= 40 && event.which < 48 || event.which > 57) {
            event.preventDefault();
        }

        $(this).val(function(index, value) {
            value = value.replace(/,/g, '');
            return numberWithCommas(value);
        });

    });
    
   

    $('input.amount').blur(function(event) {
        if (event.which >= 37 && event.which <= 40 && event.which < 48 || event.which > 57) {
            event.preventDefault();
        }
        $(this).val(function(index, value) {

            value = value.replace(/,/g, '');
            var parts = value.toString().split(".");
            if (parts.length == 1) {
                return numberWithCommas(value) + ".00";
            } else {
                return numberWithCommas(parseFloat(value).toFixed(2));
            }
        });
    });

    $('input.amount').focus(function(event) {
        if (event.which >= 37 && event.which <= 40 && event.which < 48 || event.which > 57) {
            event.preventDefault();
        }
        $(this).val(function(index, value) {

            value = value.replace(/,/g, '');
            var parts = value.toString().split(".");
            if (parts.length == 1) {
                return numberWithCommas(value) + ".00";
            } else {
                return numberWithCommas(parseFloat(value).toFixed(2));
            }
        });
    });

}



function preventChar(){
    $('input.number').keydown(function(e){
        if (e.shiftKey || e.ctrlKey || e.altKey) { // if shift, ctrl or alt keys held down
                e.preventDefault();         // Prevent character input
            } else {
                var n = e.keyCode;
                if (!((n == 8)              // backspace
                        || (n == 46)                // delete
                        || (n >= 35 && n <= 40)     // arrow keys/home/end
                        || (n >= 48 && n <= 57)     // numbers on keyboard
                        || (n >= 96 && n <= 105)
                        || (n >= 9 && n <= 9)
                        || (n >= 16 && n <= 17))   // number on keypad
                        ) {
                    e.preventDefault();
                    // alert("in if");
                    // Prevent character input
                }
            }
    });
    
    
}


function formatCurrencyList(value) {
    var val = Math.round(Number(value) *100) / 100;
    var parts = val.toFixed(2).split(".");
    var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    
    return num;
}
