
var connected;
var tempData;
var tempIdSetup;

var baseUrl = "http://116.93.120.29:8080/portal/";

var objArray = JSON.parse(localStorage.getItem('Access'));
var UserID = objArray[0].UserID;

function requisitionOnload() {
    
        
    tempData = localStorage.getItem('tmprequisition');
    if (localStorage.getItem('connected') != 'false') {
            if(tempData !=null){
                pushRecord(JSON.parse(tempData));
            }
            
            setTimeout(function(){
                jQuery.ajax({
                    type: 'POST',
                    jsonpCallback: "callback",
                    crossDomain: true,
                    dataType: 'jsonp',
                    url: baseUrl + 'apprequisitionlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0'
                });

                $('#Search').keyup(function(event) {
                    if (event.keyCode === 13) {
                        SearchTran();
                    }
                });
                $('.showbox').hide();
            },100);
            
        } else {
            tempData = localStorage.getItem('tmprequisition');
            tempIdSetup = localStorage.getItem('idsetup_requisition');
            requisitionLocalStorage();
            $('.showbox').hide();

        }

        $('.showbox').hide();



    $("#includePrompts").load("../../lookup/lookup.html");
}




function apprequisitioncallback(response) {
    if (response.success) {
        if (response.usage == 'getApprequisition') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {

                $('.requisition-card').append(
                        '<div class = "row divrow' + (i) + '" style = "padding:10px;border-bottom: 1px solid #dcdbdb;cursor:pointer">'
                        + '<div class ="col-xs-7"><span style = "font-style:calibri;font-size: 12pt;font-weight:bold">' + formatValue(arr[i].Name, true) + '</span></div>'
                        + '<div class ="col-xs-5">PHP' + formatValue(formatCurrencyList(arr[i].Amount, true), true) + '</div>'
                        + '<div class ="col-xs-12"><span style = "color:#8b8b8b">' + formatValue(arr[i].TranID, true) + '</span></div>'
                        + '<div class ="col-xs-12">' + formatValue(arr[i].Details, true) + '</div>'
                        + '<div class ="col-xs-12"><span class = "fa fa-ellipsis-h"></span> <span>' + formatValue(arr[i].DocStatus, true) + '</span></div>'
                        + '</div>'


                        );
                            
                
                
                $('.divrow' + i).attr('SeqID', arr[i].SeqID);
                $('.divrow' + i).click(function(a) {
                    var SeqID = $(this).attr('SeqID');
                    if (SeqID) {
                        loadForm(SeqID);
                    }
                });
//                $('#table-requisition').append('<tr class = "responsive-tr" id="rows1' + (i) + '" rownum = ' + (i) + ' style = "color:#000;cursor:pointer;">'
//                        + ' <td width="2%"><input class = "checkbox_list" type = "checkbox" style = "width:15px;height:15px;margin-left:3px !important" value= ' + formatValue(arr[i].SeqID, true) + '></td>'
//                        + '<td data-title= "Name:" class = "td-app">' + formatValue(arr[i].Name, true) + '</td>'
//                        + '<td data-title= "Amount:" class = "td-app">' + formatValue(arr[i].Amount, true) + '</td>'
//                        + '<td data-title= "Details:" class = "td-app">' + formatValue(arr[i].Details, true) + '</td>'
//                        + '<td><a class = "btn-material inverse btn-sm" onclick = "loadForm(\'' + arr[i].SeqID + '\');">&nbsp;<span class = "fa fa-eye"></span></a></td>'
//
//                        + '</tr>'
//                        );
//
//                $('#rows1' + i).attr('SeqID', arr[i].SeqID);
//                $('#rows1' + i).dblclick(function(a) {
//                    var SeqID = $(this).attr('SeqID');
//                    if (SeqID) {
//                        loadForm(SeqID);
//                    }
//                });
            }
        } else if (response.usage == 'getExactApprequisition') {
            var arr = response.data[0];


            $('#TranID').val(formatValue(arr.TranID, true));
            $('#TranDate').val(formatValue(arr.TranDate, true));
            $('#TranType').val(formatValue(arr.TranType, true));
            $('#Name').val(formatValue(arr.Name, true));
            $('#Details').val(formatValue(arr.Details, true));

            var $ItemID = $('<option selected>' + formatValue(arr.ItemID, true) + '</option>').val(formatValue(arr.ItemID, true));
            $('#ItemID').append($ItemID).trigger('change');

            $('#ItemDesc').val(formatValue(arr.ItemDesc, true));
            $('#UOM').val(formatValue(arr.UOM, true));
            $('#Qty').val(formatValue(arr.Qty, true));
            $('#UnitCost').val(formatCurrencyList(formatValue(arr.UnitCost, true), true));
            $('#Amount').val(formatCurrencyList(formatValue(arr.Amount, true), true));
            $('#RequiredDate').val(formatValue(arr.RequiredDate, true));
            $('#SeqID').val(arr.SeqID);
            $('#SeqIDRef').val(arr.SeqID);
            




            $('.name').html(arr.Name);
            $('.referenceno').html(arr.TranID);
            $('.referenceno').html(arr.TranID);
            $('.itemdesc').html(arr.ItemDesc);
            $('.requireddate').html(arr.RequiredDate);
            $('.Qty').html(arr.Qty);
            $('.UOM').html(arr.UOM);
            $('.UnitCost').html(arr.UnitCost);
            $('.details').html(arr.Details);
        }
    }
}


function addRecord() {
    /*Back Module*/
    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('requisition');
    $('#ModuleID', window.parent.document).val('requisition');
    $('#ModuleName', window.parent.document).val('Requisition');

    $('#requisition-list').css('display', 'none');
    $('#requisition-form').css('display', 'block');

    $('#Module-Name').empty();
    $('#Module-Name').html('New Requisition');


    //button

    $('#btn-edit').css('display', 'none');
    $('#btn-print').css('display', 'none');
    $('#btn-add').css('display', 'none');
    $('#btn-delete').css('display', 'none');
    $('#btn-cancel').css('display', 'block');
    $('#btn-close').css('display', 'none');
    $('#btn-save').css('display', 'block');
    $('#AddRow').css('display', 'inline');

    $('#create-btn').hide();
    $('#print-btn').hide();




    $('input.number').click(function() {
        $(this).select();
    });
    //  Default values    
    removeRecord();
    // store

    if (localStorage.getItem('connected') == 'false') {

        var requisitiono = localStorage.getItem('idsetup_requisition');
        $('#TranID').val(requisitiono);
//         $('#TranID').val(reqid);
    } else {
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=REQAPP'
        });

        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'itemlist?jsonformat=jsonp&dropdown=true'

        });
    }




//
//    var cookies = document.cookie;
//    cookies = cookies.split("; ");
//    var obj1 = new Object();
//    for (var i = 0; i < cookies.length; i++) {
//        try {
//            var cookies_tmp = cookies[i].split("=");
//            eval('obj1.' + cookies_tmp[0] + ' = "' + cookies_tmp[1] + '"');
//        } catch (e) {
//        }
//
//
//    }
//    console.log(obj1.UserID);
    if(localStorage.getItem('connected') != 'false'){
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'userslist?jsonformat=jsonp&exactOnly=' + UserID
        });
    }else{
        var FirstName = objArray[0].FirstName;
        
//        console.log(LastName);
//        var FullName = objArray[0].FirstName + " " + objArray[0].MiddleName + " " + objArray[0].LastName;

        var FullName = FirstName;
        $('#Name').val(FullName);
    }
    


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
            localStorage.setItem('idsetup_requisition', arr.NextGenID);

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



//function localStorage_requisition(datas){
//    
//}



function checkConnection() {


    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'checksession?checkInternet=true&forpushrec=true&baseUrl='+baseUrl,
        success: function(response) {
            var hasInternet = response.Connected;
            var forpushrech = response.pushrec;
            connected = hasInternet;
            if (hasInternet && forpushrech) {
                pushRecord(JSON.parse(tempData));
                localStorage.removeItem('tmprequisition');
            }
//            console.log(JSON.parse(tempData));

        },
        failure: function() {
            connected = false;
        }
    });
}


function pushRecord(datas) {

    $.ajax({
        type: 'POST',
        url: baseUrl + "apprequisitionservlet?operation=PUSH_RECORD",
        dataType: 'json',
        data: JSON.stringify(datas),
        contentType: "application/json",
        success: function(data) {
            console.log('records uploaded');
            localStorage.removeItem('tmprequisition');
        }});
}


var localStorage_data = [];
function saveRecord() {

    if (localStorage.getItem('connected') != 'false') {
        var data = objectifyForm($('#req_form').serializeArray());
        data.DocStatus = $('#DocStatus').val();
        $.ajax({
            type: 'POST',
            url: baseUrl + "apprequisitionservlet?operation=UPDATE_RECORD",
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
                    var reqid = localStorage.getItem('idsetup_requisition');
                    reqid = reqid.replace('REQ', '');
                    var prefex = 'REQ';
                    var Series = '000';
                    var seq = parseInt(reqid) + 1;
                    var referenceid = prefex + Series + seq;
                    localStorage.setItem('idsetup_requisition', referenceid);
                    $('#MsgAlert').modal('show');
                    back();
                } else {
                    $('#message-info').css('display', 'block');
                    $('#message-text').html(data.message);
                }
            }});
    } else {


        var localStore = JSON.parse(localStorage.getItem('tmprequisition'));
        if (localStore != null) {

            var key = $('#ArrayIndex2').val();
            for (var i = 0; i < localStore.length; i++) {
                var rec = localStore[i];
                console.log(key);
                console.log(rec.TranID);
                if (key == rec.TranID) {
                    localStore.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem('tmprequisition', JSON.stringify(localStore));
        }



        var datas_tmp = $('#req_form').serialize();
        console.log(datas_tmp);

        var objArray = datas_tmp.split('&');
        var obj = new Object();
        for (var i = 0; i < objArray.length; i++) {
            var objItem = objArray[i].split('=');
            try {
                if (objItem[0] == 'UnitCost') {
                    eval('obj.' + objItem[0] + ' = "' + objItem[1].replace('+', ' ').replace('+', ' ').replace('C', '').replace('%', '').replace('C', '') + '"');
                } else {
                    eval('obj.' + objItem[0] + ' = "' + objItem[1].replace('+', ' ').replace('+', ' ').replace('%', '') + '"');
                }

                obj.DocStatus = "ON HOLD";
            } catch (e) {
            }
        }

        var localStore_requisition = localStorage.getItem('tmprequisition');
        if (localStore_requisition) {
            var objArr = eval(localStore_requisition);
            objArr.push(obj);
            localStorage.setItem('tmprequisition', JSON.stringify(objArr));
        } else {
            var arr = [];
            arr.push(obj);
            localStorage.setItem('tmprequisition', JSON.stringify(arr));
        }

        if (key == null) {
            var reqid = localStorage.getItem('idsetup_requisition');
            reqid = reqid.replace('REQ', '');
            var prefex = 'REQ';
            var Series = '000';
            var seq = parseInt(reqid) + 1;
            var referenceid = prefex + Series + seq;
            localStorage.setItem('idsetup_requisition', referenceid);
        }


        $('#MsgAlert').modal('show');
        back();
    }
}

function editRecord(arr) {


    $('#Module-Name').replaceWith('<span style ="font-family: calibri;font-weight: bold;font-size: 15pt;" id ="Module-Name"> Edit transaction </span>');
    /*form-view*/
    $('#requisition-view').hide();
    $('#requisition-form').show();
    $('#requisition-list').hide();

    /*btn-control2*/

    $('.delete-options').hide();
    $('.print-options').hide();
    $('.edit-options').hide();

    /*btn-control2*/

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


    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&dropdown=true'

    });

    if (arr) {
        $('#TranID').val(formatValue(arr.TranID, true));
        $('#TranDate').val(formatValue(arr.TranDate, true));
        $('#TranType').val(formatValue(arr.TranType, true));
        $('#Name').val(formatValue(arr.Name, true));
        $('#Details').val(formatValue(arr.Details, true));
        $('#ItemDesc').val(formatValue(arr.ItemDesc, true));
        $('#UOM').val(formatValue(arr.UOM, true));
        $('#Qty').val(formatValue(arr.Qty, true));
        $('#UnitCost').val(formatValue(arr.UnitCost, true));
        $('#Amount').val(formatValue(arr.Amount, true));
        $('#RequiredDate').val(formatValue(arr.RequiredDate, true));
        $('#SeqID').val(arr.SeqID);
        $('#ArrayIndex2').val(arr.TranID);
    }



    enabledInput();
    formatCurrency();




}


function confirmDelete() {

    $('#MsgAlertDelete').modal('show');

    $('input').removeAttr('disabled', 'disabled');
    $('textarea').removeAttr('disabled', 'disabled');
    $('select').removeAttr('disabled', 'disabled');
    $('#Confirm-No').click(function() {
        $('#MsgAlertDelete').modal('hide');
        $('input').attr('disabled', 'disabled');
        $('textarea').attr('disabled', 'disabled');
        $('select').attr('disabled', 'disabled');
    });
    $('#Confirm-Yes').click(function() {
        $('#MsgAlertDelete').modal('hide');
        deleteRecord();
    });
}


function deleteRecord(forlocal) {
    
    var SeqID = $('#SeqIDRef').val();
    if (localStorage.getItem('connected') != 'false') {
        
//        var data = objectifyForm($('#requisition-form').serializeArray());
        $.ajax({
            type: 'POST',
            url: baseUrl + "apprequisitionservlet?operation=DELETE_RECORD&SeqID="+SeqID,
            dataType: 'json',
//            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
                    $('#MsgAlert').modal('show');
                } else {
                    $('#message-info').css('display', 'block');
                    $('#message-text').html(data.message);
                }
            }});
    } else {

        if (forlocal) {

            var localStore = JSON.parse(localStorage.getItem('tmprequisition'));

            var key = $('#ArrayIndex').val();
            for (var i = 0; i < localStore.length; i++) {
                var rec = localStore[i];
//                console.log(rec);
                console.log(key);
                console.log(rec.TranID);
                if (key == rec.TranID) {
                    localStore.splice(i, 1);
                    $('#MsgAlert').modal('show');
                    break;

                }
            }
            localStorage.setItem('tmprequisition', JSON.stringify(localStore));








//            var index = localStore.indexOf(1);
//            console.log(index);
//            
//            var tmprequisition = delete localStore[1];
//            
//            console.log(tmprequisition);

//            tmprequisition = localStore.splice(index,1);
//            
//            console.log(tmprequisition);
//            localStorage.setItem('tmprequisition', JSON.stringify(tmprequisition));
//            $('#MsgAlert').modal('show');
        }



    }



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
        $('#create-btn').show();
        $('#print-btn').show();

    });
}
function loadForm(refid, arr) {

    console.log(arr);
    
    


    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('requisition');
    $('#ModuleID', window.parent.document).val('requisition');
    $('#ModuleName', window.parent.document).val('Requisition');


    $('input').attr('readonly', 'readonly');
    $('textarea').attr('readonly', 'readonly');
    $('select').attr('readonly', 'readonly');
    $('#total').attr('disabled', 'disabled');



    $('#Module-Name').replaceWith('<span style ="font-family: calibri;font-weight: bold;font-size: 15pt;" id ="Module-Name"> Edit transaction </span>');

    /*tab-control*/

    /*tab-control*/

    $('#create-btn').hide();
    $('#print-btn').hide();
    /*btn-control*/
    $('#btn-edit').css('display', 'block');
    $('#btn-print').css('display', 'block');
//    $('#btn-delete').css('display', 'block');
    $('#btn-cancel').css('display', 'none');
    $('#btn-add').css('display', 'block');
    $('#btn-save').css('display', 'none');
    $('#btn-close').css('display', 'block');
    /*btn-control*/


    $('#Module-Name').replaceWith('<span style ="font-family: calibri;font-weight: bold;font-size: 15pt;" id ="Module-Name"> View transaction </span>');
    /*btn-control2*/

    if (!localStorage.getItem('connected') != 'false') {
        if (arr) {
            $('#ArrayIndex').val(arr.TranID);

            $('.edit-options').attr('onclick', '').unbind('click');
            $('.edit-options').on('click', function() {
                editRecord(arr);
            });
            


            $('.name').html(arr.Name);
            $('.referenceno').html(arr.TranID);
            $('.referenceno').html(arr.TranID);
            $('.itemdesc').html(arr.ItemDesc);
            $('.requireddate').html(arr.RequiredDate);
            $('.Qty').html(arr.Qty);
            $('.UOM').html(arr.UOM);
            $('.UnitCost').html(formatCurrencyList(arr.UnitCost,true));
            $('.details').html(arr.Details);
        }

        $('#btn-delete').hide();
        $('.print-options').show();
        $('.edit-options').show();
    } else {
        
        $('.edit-options').attr('onclick', 'editRecord();');
        
        $('#btn-delete').show();
        $('.print-options').show();
        $('.edit-options').show();
        $('#btn-remove-store').hide();
    }



    /*btn-control2*/


    $('#requisition-view').show();
    $('#requisition-form').hide();
    $('#requisition-list').css('display', 'none');


    if (localStorage.getItem('connected') != 'false') {
        $('#btn-remove-store').hide();
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'apprequisitionlist?jsonformat=jsonp&exactOnly=true&apprequisition=' + refid
        });
    } else {
//        console.log(refid);
//        console.log(arr[0].Amount);

        $('#btn-remove-store').show();


//        
////        console.log(refid);
////        console.log(arr[0].Amount);
//
//        $('#TranID').val(formatValue(arr.TranID, true));
//        $('#TranDate').val(formatValue(arr.TranDate, true));
//        $('#TranType').val(formatValue(arr.TranType, true));
//        $('#Name').val(formatValue(arr.Name, true));
//        $('#Details').val(formatValue(arr.Details, true));
//
////        var $ItemID = $('<option selected>' + formatValue(arr.ItemID, true) + '</option>').val(formatValue(arr.ItemID, true));
//////        $('#ItemID').append($ItemID).trigger('change');
//
//        $('#ItemDesc').val(formatValue(arr.ItemDesc, true));
//        $('#UOM').val(formatValue(arr.UOM, true));
//        $('#Qty').val(formatValue(arr.Qty, true));
//        $('#UnitCost').val(formatCurrencyList(formatValue(arr.UnitCost, true), true));
//        $('#Amount').val(formatCurrencyList(formatValue(arr.Amount, true), true));
//        $('#RequiredDate').val(formatValue(arr.RequiredDate, true));
//        $('#SeqID').val(arr.SeqID);
//        
//        $('#ArrayIndex').val(arr.TranID);




    }

    formatCurrency();
}

function closeRecord() {
    enabledInput();
    $('#requisition-form').css('display', 'none');
    $('#requisition-list').css('display', 'block');
}


function itemcallback(response) {
    if (response.success) {
        if (response.usage == 'getDropdownItem') {
            var arr = response.data;
//            $('.item-select2').select2({
//                width: null,
//                prefwidth: 'auto',
//                placeholder: {
//                    id: '',
//                    text: 'Select Item'
//                },
//                theme: 'classic'
//            });

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

function changeEventListener() {

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
//            $('.itemuom-select2').select2({
//                width: null,
//                prefwidth: 'auto',
//                theme: 'classic'
//            });

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

//    $('#Amount').val(formatCurrencyList(amount, true));
    $('#Amount').val(amount);

}

function setNumberDefault() {
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
        url: baseUrl + 'apprequisitionlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0&apprequisition=' + value
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
    data.data = records;

    $.ajax({
        type: 'POST',
        url: baseUrl + "apprequisitionservlet?operation=MULTI_DELETE",
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

function reloadPage() {
    window.location.reload();
}

function userscallback(response) {
    if (response.success) {
        if (response.usage == 'getExactUsers') {
            var arr = response.data[0];
            $('#Name').val(arr.FullName);
        }
    }
}

function requisitionLocalStorage() {
    var arr = JSON.parse(tempData);

    if (arr != null) {
        for (var i = 0; i < arr.length; i++) {
            $('.requisition-card').append(
                    '<div class = "row divrow' + (i) + '" style = "padding:5px;border-bottom: 1px solid #dcdbdb;cursor:pointer">'
                    + '<div class ="col-xs-7"><span style = "font-style:calibri;font-size: 12pt;font-weight:bold">' + formatValue(arr[i].Name, true) + '</span></div>'
                    + '<div class ="col-xs-5"><span>PHP' + formatValue(formatCurrencyList(arr[i].Amount, true), true)  + '</span></div>'
                    + '<div class ="col-xs-12"><span style = "color:#8b8b8b">' + formatValue(arr[i].TranID, true) + '</span></div>'
                    + '<div class ="col-xs-12"><span>' + formatValue(arr[i].Details, true) + '</span></div>'
                    + '<div class ="col-xs-12"><span class = "fa fa-ellipsis-h"></span> <span>' + formatValue(arr[i].DocStatus, true) + '</span></div>'
                    + '<div class ="col-xs-12"><span>' + i + '</span></div>'
                    + '</div>'
                    );
            $('.divrow' + i).attr('Key', i);
            $('.divrow' + i).click(function(a) {
                var Key = $(this).attr('Key');
                var arrayObj = arr[Key];
                if (Key) {

                    console.log(arrayObj);
                    loadForm(Key, arrayObj);
                }
            });



        }
    }



}


