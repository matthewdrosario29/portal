function prospectOnload() {



    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'prospectlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0'
    });

    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchTran();
        }
    });

    $("#includePrompts").load("../../lookup/lookup.html");

    selectAll();

}

function prospectcallback(response) {
    if (response.success) {
        if (response.usage == 'getProspect') {
            var arr = response.data;
            var recordArr = [];
            console.log(arr);
            console.log(recordArr);
            for (var i = 0; i < arr.length; i++) {
                $('#table-prospect').append('<tr class = "responsive-tr" id="rows1' + (i) + '" rownum = ' + (i) + ' style = "color:#000;cursor:pointer;">'
                        + ' <td width="2%"><input class = "checkbox_list" type = "checkbox" style = "width:15px;height:15px;margin-left:3px !important" value= ' + formatValue(arr[i].SeqID, true) + '></td>'
                        + '<td data-title= "Name:" class = "td-app">' + formatValue(arr[i].LastName, true) + '</td>'
                        + '<td data-title= "Demo Date:" class = "td-app">' + formatValue(arr[i].InquireDate, true) + '</td>'
                        + '<td data-title= "Contact Person:" class = "td-app">' + formatValue(arr[i].LastName, true) + '</td>'
                        + '<td data-title= "Mobile:" class = "td-app">' + formatValue(arr[i].MobileNo, true) + '</td>'
                        + '<td data-title= "Line Of Business Industry:" class = "td-app"></td>'
                        + '<td data-title= "Package:" class = "td-app"></td>'
                        + '<td><a class = "btn-material inverse btn-sm" onclick = "loadForm(\'' + arr[i].SeqID + '\');">&nbsp;<span class = "fa fa-eye"></span></a></td>'

                        + '</tr>'
                        );

                $('#rows1' + i).attr('SeqID', arr[i].SeqID);
                $('#rows1' + i).dblclick(function(a) {
                    var SeqID = $(this).attr('SeqID');
                    if (SeqID) {
                        loadForm(SeqID);
                    }
                });
            }
        } else if (response.usage == 'getExactprospect') {
            var arr = response.data[0];


            $('#FirstName').val(formatValue(arr.FirstName, true));
            $('#MiddleName').val(formatValue(arr.MiddleName, true));
            $('#LastName').val(formatValue(arr.LastName, true));
            $('#Address').val(formatValue(arr.Address, true));
            $('#City').val(formatValue(arr.City, true));

            $('#ZipCode').val(formatValue(arr.ItemDesc, true));
            $('#TelNo').val(formatValue(arr.TelNo, true));
            $('#BirthDate').val(formatValue(arr.BirthDate, true));
            $('#MobileNo').val(formatValue(arr.MobileNo, true));
            $('#Gender').val(formatValue(arr.Gender, true));
            $('#EmailAddress').val(formatValue(arr.EmailAddress, true));

            $('#CivilStatus').val(formatValue(arr.CivilStatus, true));
            $('#Occupation').val(formatValue(arr.Occupation, true));
            $('#Broker').val(formatValue(arr.Broker, true));
            $('#InquireDate').val(formatValue(arr.InquireDate, true));
            $('#Agent').val(formatValue(arr.Agent, true));

            $('#ExpiryDate').val(formatValue(arr.ExpiryDate, true));
            $('#SpouseInfo').val(formatValue(arr.SpouseInfo, true));
            $('#SeqID').val(arr.SeqID);
        }
    }
}


function addRecord() {
    /*Back Module*/
    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('prospect');
    $('#ModuleID', window.parent.document).val('prospect');
    $('#ModuleName', window.parent.document).val('Prospect');

    $('#prospect-list').css('display', 'none');
    $('#prospect-form').css('display', 'block');

    $('#Module-Name').empty();
    $('#Module-Name').html('New prospect');


    $('input').removeAttr('disabled', 'disabled');
    $('textarea').removeAttr('disabled', 'disabled');
    $('select').removeAttr('disabled', 'disabled');


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



//  Default values    
    removeRecord();

    var cookies = document.cookie;
    cookies = cookies.split("; ");
    var obj1 = new Object();
    for (var i = 0; i < cookies.length; i++) {
        var cookies_tmp = cookies[i].split("=");
        eval('obj1.' + cookies_tmp[0] + ' = "' + cookies_tmp[1] + '"');

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
    var data = objectifyForm($('#prospect_form').serializeArray());
    console.log(data);
    $.ajax({
        type: 'POST',
        url: baseUrl + "prospectservlet?operation=UPDATE_RECORD",
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




function deleteRecord() {
//    alert('test');
    var data = objectifyForm($('#prospect_form').serializeArray());
    $.ajax({
        type: 'POST',
        url: baseUrl + "prospectservlet?operation=DELETE_RECORD",
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
    showReportForm(TranID, 'FormName', 'prospect');
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
        $('#prospect-form').css('display', 'none');
        $('#prospect-list').css('display', 'block');
        back();
        enabledInput();
        $('#message-info').css('display', 'none');
        $('#message-text').empty();
    });
}
function loadForm(refid) {



    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('prospect');
    $('#ModuleID', window.parent.document).val('prospect');
    $('#ModuleName', window.parent.document).val('Prospect');


    $('input').attr('disabled', 'disabled');
    $('textarea').attr('disabled', 'disabled');
    $('select').attr('disabled', 'disabled');
//    $('#total').attr('disabled', 'disabled');

    $('.float-label').css('top', '-18px');
    $('.float-label').css('font-size', '12px');

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



    $('#prospect-form').css('display', 'block');
    $('#prospect-list').css('display', 'none');

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'prospectlist?jsonformat=jsonp&exactOnly=true&prospect=' + refid
    });
    formatCurrency();
}

function closeRecord() {
    enabledInput();
    $('#prospect-form').css('display', 'none');
    $('#prospect-list').css('display', 'block');
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

function setNumberDefault() {
    $('#Qty').val(1);
    $('#UnitCost').val('0.00');
    $('#Amount').val('0.00');
}


function SearchTran() {

    $('#table-prospect').find('tbody').empty();

    var value = $('#Search').val();

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'prospectlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0&prospect=' + value
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


    var data = objectifyForm($('#prospect-form').serializeArray());
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
        url: baseUrl + "prospectservlet?operation=MULTI_DELETE",
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

function importFile(module) {
    $('#ImportWindow').modal('show');

    jQuery.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'exceltablelist?jsonformat=jsonp&field=AllowUpload&value=1'
    });

    jQuery.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'exceltablelist?jsonformat=jsonp&module=' + module
    });

    $('#UploadFile').change(function(e) {
        var file = e.target.files[0];
        if (file.type == 'application/vnd.ms-excel') {

            var form = $('#UploadForm')[0];
            var formData = new FormData(form);
            $.each(e.target.files, function(key, value) {
                formData.append(key, value);
            });
            $.ajax({
                type: 'POST',
                enctype: 'multipart/form-data',
                url: baseUrl + "uploadexcelservlet",
                data: formData,
                processData: false,
                contentType: false,
                success: function(data) {
                    var data = JSON.parse(data);
                    var arr = data.data;
                    $('#FileName').val(data.filename);
                    for (var i = 0; i < arr.length; i++) {
                        $("#Sheet").append($("<option></option>", {
                            value: arr[i].id,
                            text: arr[i].desc
                        }));
                    }
                }});
        } else {
            alert('Not a valid excel file!');
            clearFileInput(document.getElementById("UploadFile"));
        }
    });

    $('#UploadFile').change(function(e) {


        var file = e.target.files[0];
//        $('#Sheet').val() != '' && $('#Sheet').val() != null

        if (file.type == 'application/vnd.ms-excel') {

            var form = $('#UploadForm')[0];
            var formData = new FormData(form);
            $.each(e.target.files, function(key, value) {
                formData.append(key, value);
            });
            $.ajax({
                type: 'POST',
                enctype: 'multipart/form-data',
                url: baseUrl + "uploadexcelservlet",
                data: formData,
                processData: false,
                contentType: false,
                success: function(data) {
                    var data = JSON.parse(data);
                    var arr = data.data;
                    $('#FileName').val(data.filename);
                    for (var i = 0; i < arr.length; i++) {
                        $("#Sheet").append($("<option></option>", {
                            value: arr[i].id,
                            text: arr[i].desc
                        }));
                    }
                }});
        } else {
            alert('Not a valid excel file!');
            clearFileInput(document.getElementById("UploadFile"));
        }


    });

    $('#uploadFile').on('click', function(e) {
        e.preventDefault();
        var tablename = $('#UploadLocation').val();
        var filename = $('#FileName').val();
        var sheet = $('#Sheet').val();



        if (sheet != null) {
            if (tablename && filename && sheet) {
                $('.showbox-spinner').show();
                $.ajax({
                    type: 'POST',
                    enctype: 'multipart/form-data',
                    url: baseUrl + "uploadexcelservlet?action=UPLOAD&filename=" + filename + "&sheet=" + sheet + "&tablename=" + tablename,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function(data) {
                        var data = JSON.parse(data);
                        if (data.success) {

                            $('.showbox-spinner').hide();

                            $('#MsgAlert').modal('show');
                            $('#MessageAlert').empty();
                            $('#MessageAlert').html('Data uploaded!');
                            $('.progress-bar').css('display', 'none');
//                            window.location.reload();
                            clearFileInput(document.getElementById("UploadFile"));
                            $('#UploadLocation').val(null);
                            $('#FileName').val(null);
                            $('#Sheet').val(null);
                        } else {
                            alert(data.message);
                            $('.showbox-spinner').hide();
                        }
                    }});
            } else {
                alert('Please select a file first!');
            }
        } else {
            alert('required field');
        }

    });


}

function exceltablecallback(response) {


    if (response.usage == 'getModuleExact') {
        var arr = response.data;
        $("#UploadLocation").empty();
        for (var i = 0; i < arr.length; i++) {
            $("#UploadLocation").append($("<option></option>", {
                value: arr[i].TableName,
                text: arr[i].TableDesc
            }));
        }

        for (var i = 0; i < arr.length; i++) {
//            $("#UploadLocation").append($("<option></option>", {
//                value: arr[i].TableName,
//                text: arr[i].TableDesc
//            }));
            $("#downnloadTemplate").empty();
            $("#downnloadTemplate").append($("<option></option>", {
                value: arr[i].TableName,
                text: arr[i].TableDesc
            }));
        }


    }

//    else if(response.usage == 'getField'){
//        var arr = response.data;
//        $("#downnloadTemplate").append('<option disabled selected> - Select Table - </option>');
////        $("#UploadLocation").append('<option disabled selected> - Select File Location - </option>');
//        for (var i = 0; i < arr.length; i++) {
////            $("#UploadLocation").append($("<option></option>", {
////                value: arr[i].TableName,
////                text: arr[i].TableDesc
////            }));
//            $("#downnloadTemplate").append($("<option></option>", {
//                value: arr[i].TableName,
//                text: arr[i].TableDesc
//            }));
//        }
//    }

}




//function uploadFile(){
//        var tablename = $('#UploadLocation').val();
//        var filename = $('#FileName').val();
//        var sheet = $('#Sheet').val();
//
//        if (tablename && filename && sheet) {
//            $.ajax({
//                type: 'POST',
//                enctype: 'multipart/form-data',
//                url: baseUrl + "uploadexcelservlet?action=UPLOAD&filename=" + filename + "&sheet=" + sheet + "&tablename=" + tablename,
//                processData: false,
//                contentType: false,
//                cache: false,
//                success: function(data) {
//                    var data = JSON.parse(data);
//                    if (data.success) {
//
//                        var counter = 0;
//                        var myInterval = setInterval(function() {
//                            ++counter;
//                            $('.progress-bar').css('display', 'block');
//                        }, 1000);
//
//                        $('#MsgAlert').modal('show');
//                        $('#MessageAlert').empty();
//                        $('#MessageAlert').html('Data uploaded!');
//                        $('.progress-bar').css('display', 'none');
////                            window.location.reload();
//                        clearFileInput(document.getElementById("UploadFile"));
//                        $('#UploadLocation').val(null);
//                        $('#FileName').val(null);
//                        $('#Sheet').val(null);
//                    } else {
//                        alert(data.message);
//                    }
//                }});
//        } else {
//            alert('Please select a file first!');
//        }
//}
//function uploadFileOnLoad(e){
//    var file = e.target.files[0];
//        if (file.type == 'application/vnd.ms-excel') {
//
//            var form = $('#UploadForm')[0];
//            var formData = new FormData(form);
//            $.each(e.target.files, function(key, value) {
//                formData.append(key, value);
//            });
//            $.ajax({
//                type: 'POST',
//                enctype: 'multipart/form-data',
//                url: baseUrl + "uploadexcelservlet",
//                data: formData,
//                processData: false,
//                contentType: false,
//                success: function(data) {
//                    var data = JSON.parse(data);
//                    var arr = data.data;
//                    console.log(arr);
//                    $('#FileName').val(data.filename);
//                    for (var i = 0; i < arr.length; i++) {
//                        $("#Sheet").append($("<option></option>", {
//                            value: arr[i].id,
//                            text: arr[i].desc
//                        }));
//                    }
//                }});
//        } else {
//            alert('Not a valid excel file!');
//            clearFileInput(document.getElementById("UploadFile"));
//        }
//}


function DownloadTemplate() {
    var tableName = $('#downnloadTemplate').val();
    window.open(baseUrl + 'uploadexcelservlet?jsonformat=jsonp&operation=DOWNLOAD_TEMPLATE&tablename=' + tableName);
}

