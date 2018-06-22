var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
//today = mm + '/' + dd + '/' + yyyy;
today = yyyy + '-' + mm + '-' + dd;




function requisitionOnload() {


    
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'requisitionlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0'
    });
    
    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchTran();
        }
    });
    
    $('#requisition-list').xpull({
         spinnerTimeout: '1000',
        'callback': function () {
            $('#table-requisition').find('tbody').empty();
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'requisitionlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0'
            });
        }
    });
    
    $("#includePrompts").load("../../lookup/lookup.html");
    
    selectAll();
    $('.search').css('text-align','left');
    
    
    $('.mobile-nav-header', window.parent.document).css('display', 'block');
    $('.footer-nav', window.parent.document).css('display', 'block');

}

function requisitioncallback(response) {
    if (response.success) {
        if (response.usage == 'getrequisition') {
            var arr = response.data;
            var recordArr = [];
            console.log(arr);
            console.log(recordArr);
            for (var i = 0; i < arr.length; i++) {
                $('#table-requisition').append('<tr class = "responsive-tr" id="rows1' + (i) + '" rownum = ' + (i) + ' style = "color:#000;cursor:pointer;">'
                        +' <td width="2%"><input class = "checkbox_list" type = "checkbox" style = "width:15px;height:15px;margin-left:3px !important" value= ' + formatValue(arr[i].SeqID, true) + '></td>'
                        + '<td data-title= "Name:" class = "td-app">' + formatValue(arr[i].RequestedBy, true) + '</td>'
                        + '<td data-title= "Amount:" class = "td-app">' + formatValue(arr[i].DocTotal, true) + '</td>'
                        + '<td data-title= "Details:" class = "td-app">' + formatValue(arr[i].Details, true) + '</td>'
                        + '<td><a class = "btn-material inverse btn-sm" onclick = "loadForm(\'' + arr[i].BatNbr + '\');">&nbsp;<span class = "fa fa-eye"></span></a></td>'

                        + '</tr>'
                        );

                $('#rows1' + i).attr('BatNbr', arr[i].BatNbr);
                $('#rows1' + i).dblclick(function(a) {
                    var BatNbr = $(this).attr('BatNbr');
                    if (BatNbr) {
                        loadForm(BatNbr);
                    }
                });
            }
        } else if (response.usage == 'getExactApprequisition') {
            var arr = response.data[0];
            
            
            $('#TranID').val(formatValue(arr.TranID, true));
            $('#TranDate').val(formatValue(arr.TranDate, true));
            $('#TranType').val(formatValue(arr.TranType, true));
            $('#Name').val(formatValue(arr.RequestedBy, true));
            $('#Details').val(formatValue(arr.Details, true));
            $('#BatNbr').val(formatValue(arr.BatNbr, true));
            
            
            
            var $ItemID = $('<option selected>' + formatValue(arr.ItemID, true) + '</option>').val(formatValue(arr.ItemID, true));
            $('#ItemID').append($ItemID).trigger('change');
            
            
            
            
            var $project = $('<option selected>' + formatValue(arr.ProjectID, true) + '</option>').val(formatValue(arr.ProjectID, true));
            $('.select2-project').append($project).trigger('change');
            
            $('#ItemDesc').val(formatValue(arr.ItemDesc, true));
            $('#UOM').val(formatValue(arr.UOM, true));
            $('#Qty').val(formatValue(arr.Qty, true));
            $('#UnitCost').val(formatCurrencyList(formatValue(arr.UnitCost, true),true));
            $('#Amount').val(formatCurrencyList(formatValue(arr.Amount, true),true));
            $('#RequiredDate').val(formatValue(arr.RequiredDate, true));
            $('#SeqID').val(arr.SeqID);
        }
    }
}


function addRecord() {
    /*Back Module*/
    
    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('apprequisition');
    $('#ModuleID', window.parent.document).val('apprequisition');
    $('#ModuleName', window.parent.document).val('Requisition');
    $('.mobile-nav-header', window.parent.document).css('display', 'none');
    $('.footer-nav', window.parent.document).css('display', 'none');
    
    
    $('.div-module-caption').css('display','none');
    $('#forEdit').css('display','none');
    

    $('#requisition-list').css('display', 'none');
    $('#requisition-form').css('display', 'block');

    $('#Module-Name').empty();
    $('#Module-Name').html('New Requisition');

    $('.reqform-tool').hide();
    
    $('.mobile-closesave').css('height','60px');

    //button

    $('#btn-edit').css('display', 'none');
    $('#btn-print').css('display', 'none');
    $('#btn-add').css('display', 'none');
    $('#btn-delete').css('display', 'none');
    $('#btn-cancel').css('display', 'block');
    $('#btn-close').css('display', 'none');
    $('#btn-save').css('display', 'block');
    $('#AddRow').css('display', 'inline');


    // store
//    jQuery.ajax({
//        type: 'POST',
//        jsonpCallback: "callback",
//        crossDomain: true,
//        dataType: 'jsonp',
//        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=REQAPP'
//    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&dropdown=true'

    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'trantypelist?jsonformat=jsonp&mobile=true&date='+today+'&module2=requisition'
    });
    
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'projectlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0'
    });



//  Default values    
    removeRecord();
    
    
    $('#DocStatus').val('DRAFT');
    var cookies = document.cookie;
    cookies = cookies.split("; ");
    var obj1 = new Object();
    for (var i = 0; i < cookies.length; i++){
        var cookies_tmp = cookies[i].split("=");
        eval('obj1.' + cookies_tmp[0] + ' = "'+cookies_tmp[1]+'"');
        
    }
    console.log(obj1.UserID);
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'userslist?jsonformat=jsonp&exactOnly=' + obj1.UserID
    });
    
    
    getDate();
    enabledInput();
    setNumberDefault();
    formatCurrency();



}

function idsetupcallback(response) {
    if (response.success) {

        if (response.usage == 'getNextID') {
            var arr = response.data[0];
            $('#TranID').val(arr.NextGenID);
        }
    }
}

function getDate() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    $('#TranDate').val(today);
    $('#RequiredDate').val(today);
}

function saveRecord() {
    var data = objectifyForm($('#req_form').serializeArray());
    console.log(data);
    $.ajax({
        type: 'POST',
        url: baseUrl + "requisitionservlet?operation=UPDATE_RECORD",
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data) {
            if (data.success) {
                $('#MsgAlert').modal('show');
                back();
            } else {
                $('#message-info').css('display', 'block');
                $('#message-text').html(data.message);
            }
        }});
}

function editRecord() {
    
    $('#btn-edit').css('display', 'none');
    $('#btn-print').css('display', 'none');
    $('#btn-save').css('display', 'block');
    $('#btn-delete').css('display', 'none');
    $('#btn-cancel').css('display', 'block');
    $('#btn-close').css('display', 'none');
    $('#btn-add').css('display', 'none');

    $('input').removeAttr('disabled');
    $('select').removeAttr('disabled');
    $('#AddRow').css('display', 'inline');
    $('.reqform-tool').hide();
    $('#forEdit').css('display','none');
    $('#forAdd').css('display','block');
    
    $('.footer-nav', window.parent.document).css('display', 'none');
    $('.form-control-material').css('text-align','left');
    $('.number').css('text-align','right');
    $('.mobile-closesave').css('height','60px');
    
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&dropdown=true'

    });
    
    

    enabledInput();
    formatCurrency();
    
    


}


function deleteRecord() {
    var data = objectifyForm($('#requisition-form').serializeArray());
    $.ajax({
        type: 'POST',
        url: baseUrl + "requisitionservlet?operation=DELETE_RECORD",
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data) {
            if (data.success) {
                $('#MsgAlert').modal('show');
            } else {
                $('#message-info').css('display', 'block');
                $('#message-text').html(data.message);
            }
        }});
}
function printRecord() {
    var TranID = $('#TranID').val();
    showReportForm(TranID, 'FormName', 'apprequisition');
}
function printAllRecord() {

}



function cancelRecord() {
    $('#MsgAlertCloseForm').modal('show');
    $('#Close-No').click(function() {
        $('#MsgAlertCloseForm').modal('hide');
    });
    $('#Close-Yes').click(function() {
        $('#MsgAlertCloseForm').modal('hide');
        $('#requisition-form').css('display', 'none');
        $('#requisition-list').css('display', 'block');
        back();
        enabledInput();
        $('#message-info').css('display', 'none');
        $('#message-text').empty();
        $('.mobile-nav-header', window.parent.document).css('display', 'block');
        $('.footer-nav', window.parent.document).css('display', 'block');
        $('.div-module-caption').css('display','block');
        
    });
    
}
function loadForm(refid) {


    
    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('apprequisition');
    $('#ModuleID', window.parent.document).val('apprequisition');
    $('#ModuleName', window.parent.document).val('Requisition');
//    $('.mobile-closesave').hide();
    $('.mobile-nav-header', window.parent.document).css('display', 'none');
    
    $('.form-control-material').css('text-align','right');
    
    $('.div-module-caption').css('display','none');
    $('#forEdit').css('display','block');
    
    $('.mobile-closesave').css('height','50px');
    
    
    $('input').attr('readonly', 'readonly');
    $('textarea').attr('readonly', 'readonly');
    $('select').attr('readonly', 'readonly');
    $('select').attr('disabled', 'disabled');
    $('#total').attr('disabled', 'disabled');
    
    $('.reqform-tool').show();

    $('#Module-Name').replaceWith('<span style ="font-family: calibri;font-weight: bold;font-size: 15pt;" id ="Module-Name"> Edit transaction </span>');

    /*tab-control*/

    /*tab-control*/

    /*btn-control*/
    $('#btn-edit').css('display', 'block');
    $('#btn-print').css('display', 'block');
    $('#btn-delete').css('display', 'block');
    $('#btn-cancel').css('display', 'none');
    $('#btn-add').css('display', 'block');
    $('#btn-save').css('display', 'none');
    $('#btn-close').css('display', 'block');
    /*btn-control*/



    $('#requisition-form').css('display', 'block');
    $('#requisition-list').css('display', 'none');

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'requisitionlist?jsonformat=jsonp&exactOnly=true&requisition=' + refid
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'projectlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0'
    });
    
    formatCurrency();
}

function closeRecord() {
    enabledInput();
    $('.reqform-tool').hide();
    $('#requisition-form').css('display', 'none');
    $('#requisition-list').css('display', 'block');
    $('.mobile-nav-header', window.parent.document).css('display', 'block');
    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'block');
    $('#sidebarCollapseBack', window.parent.document).css('display', 'none');
    $('.search').css('text-align','left');
    
}


function itemcallback(response) {
    if (response.success) {
        if (response.usage == 'getDropdownItem') {
            var arr = response.data;
            $('.item-select2').select2({
                width: null,
                prefwidth: 'auto',
                placeholder: {
                    id: '',
                    text: 'Select Item'
                },
                theme: 'classic'
            });
            
            for (var i = 0; i < arr.length; i++) {
                $('.item-select2').append('<option value=' + arr[i].ItemID + '>' + arr[i].ItemID + '</option>');
            }
        }
        else if (response.usage == 'getExact') {
            var arr = response.data[0];
            var rownum = response.rownum;


            $("#ItemDesc").val(arr.ItemDescription);

        }
    }

}

function changeEventListener(){
    
    var itemid = $('#ItemID').val();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemuomlist?jsonformat=jsonp&exactOnly=true&itemid=' + itemid
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&exactOnly=true&item=' + itemid

    });
    
}

function itemuomcallback(response) {
    if (response.success) {
        if (response.usage == 'getUOM') {
            var arr = response.data;
            var rownum = response.rownum;
            $('.itemuom-select2').select2({
                width: null,
                prefwidth: 'auto',
                theme: 'classic'
            });

            for (var i = 0; i < arr.length; i++) {
                $(".itemuom-select2").empty();
                $(".itemuom-select2").append($("<option></option>", {
                    value: arr[i].Unit,
                    text: arr[i].UnitDesc
                }));
            }
        }
    }
}

function computeExtCost() {

    var total = 0;
    var qty = $('#Qty').val();
    var unitcost = $('#UnitCost').val();
    var amount = (parseFloat(qty.replace(',', '')) * parseFloat(unitcost.replace(',', '')));
    
    $('#Amount').val(formatCurrencyList(amount, true));

}

function setNumberDefault(){
    $('#Qty').val(1);
    $('#UnitCost').val('0.00');
    $('#Amount').val('0.00');
}


function SearchTran() {
    
    $('#table-requisition').find('tbody').empty();
    
    var value = $('#Search').val();

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'requisitionlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0&requisition=' + value
    });



}

function selectAll() {
    
    $('#select_all').click(function(e) {
        $('.checkbox').not(this).prop('checked', this.checked);
        var table = $(e.target).closest('table');
        $('td input:checkbox', table).prop('checked', this.checked);
    });

    $('#select_all_grid').click(function(e) {
        $('.checkbox_grid').not(this).prop('checked', this.checked);
        var table = $(e.target).closest('table');
        $('td input:checkbox', table).prop('checked', this.checked);
    });
}

var deleteSelectedArr = [];
function multiDelete() {

    
    var data = objectifyForm($('#requisition-form').serializeArray());
    $('.checkbox_list:checked').each(function() {
        deleteSelectedArr.push($(this).val());
    });
    
    
    var records = [];
    var obj = new Object();
    for (var i = 0; i < deleteSelectedArr.length; i++) {
        var rec = deleteSelectedArr[i];
        var obj = new Object();
        obj.SeqID = rec;
        records.push(obj);
    }
    
    console.log(records);
    data.data = records;
    
    $.ajax({
        type: 'POST',
        url: baseUrl + "requisitionservlet?operation=MULTI_DELETE",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(data) {
            if (data.success) {
                $('#MsgAlert').modal('show');
            } else {
                alert('You failed');
            }
        }});
}

function confirmMultiDelete() {
    $('#MsgAlertDelete').modal('show');
    $('#Confirm-No').click(function() {
        $('#MsgAlertDelete').modal('hide');
    });
    $('#Confirm-Yes').click(function() {
        $('#MsgAlertDelete').modal('hide');
        multiDelete();
    });
}

function reloadPage(){
    window.location.reload();
}

function userscallback(response) {
    if (response.success) {
        if(response.usage == 'getExactUsers'){
           var arr = response.data[0];
           $('#Name').val(arr.FullName);
           $('#RequestedBy').val(arr.UserID);
           $('#Branch').val(arr.Branch);
           
        }
    }
}

function trantypecallback(response){
   
    if(response.usage == 'getTranType'){
        var arr = response.data[0];
        $('#TranID').val(arr.NextRefNbr);
        $('#TranType').val(arr.JournalType);
        
    }
}


function projectcallback(response){
    if(response.success){
        if(response.usage== 'getProject'){
            var arr = response.data;
            
            $('.select2-project').select2({
                width: null,
                prefwidth: 'max',
                placeholder: {
                    id: '', 
                    text: 'Select Project'
                },
                theme: 'classic'
            });
            
            $(".select2-project").append('<option value = ""></option>');
            for (var i = 0; i < arr.length; i++) {
                $(".select2-project").append($("<option></option>", {
                    value: arr[i].ProjectID,
                    text: arr[i].ProjectTitle
                }));
            }
            
            
            
        }
    }
}


function confirmDelete() {
    $('#MsgAlertDelete').modal('show');
    $('#Confirm-No').click(function() {
        $('#MsgAlertDelete').modal('hide');
    });
    $('#Confirm-Yes').click(function() {
        $('#MsgAlertDelete').modal('hide');
        deleteRecord();
    });
}

function PrintForm() {
    
    
    var batnbr = $('#BatNbr').val();
    window.open(baseUrl+'jasperreport?jsonformat=jsonp&parameter={"events":{"replace":true,"remove":true,"clear":true,"add":true},"hasListeners":{},"map":{},"length":2}&otherparameter={}&batnbr='+batnbr+'&formname=requisition&reportid=RPT000060&exporttype=pdf&custom=false');
//    showReportForm(batnbr, 'FormName', 'requisition');
}

function showSearchbar(){
    $('.search-bar').css('display','block');
}