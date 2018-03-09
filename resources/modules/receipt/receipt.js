var baseUrl = "http://localhost:8080/portal/";

function receiptOnload() {

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=receipt'
    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'receiptlist?jsonformat=jsonp&dolimit=true'
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=receipt'
    });
    
    $('input.number').keyup(function(event) {

        // skip for arrow keys
        if (event.which >= 37 && event.which <= 40) {
            event.preventDefault();
        }

        $(this).val(function(index, value) {
            value = value.replace(/,/g, '');
            return numberWithCommas(value);
        });

    });
    
    $('input.number').blur(function(event) {

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

    $("#includePrompts").load("../../lookup/lookup.html");

    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchReceipt();
        }
    });
    
    $('input.number').keyup(function(event) {

    // skip for arrow keys
    if(event.which >= 37 && event.which <= 40){
        event.preventDefault();
    }
    
    $(this).val(function(index, value) {
            value = value.replace(/,/g,'');
            return numberWithCommas(value);
        });

  });
  getDate();
    
    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'udftablelist?TableName=CompanyReceipt',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#CompanyReceipt').append('<option value = "" disabled selected>- Select Company -</option>');        
                for (var i = 0; i < arr.length; i++) {
                    $("#CompanyReceipt").append($("<option></option>", {
                        value: arr[i].ShortDesc,
                        text: arr[i].LongDesc
                    }));
                }

            }

        }
    });
    
    
    $('#TINNo').keyup(function(event) {
        var val = $(this).val().split("-").join("");
        if (val.length > 0 && val.length < 11) {
            val = val.match(new RegExp('.{1,3}', 'g')).join("-");
        }else if(val >= 11){
            val = val.match(new RegExp('.{10,5}', 'g')).join("-");
        }
//        console.log(val);
        $('#TINNo').val(val);
//        tf.setValue(val);
    });
    
    
}
   


function getDate(){
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(month)+"-"+(day);
    $('#TranDate').val(today);
}

function pmodulescallback(response) {

    if (response.success) {
        if (response.usage == 'getUserrightsModules') {
            var arr = response.data;

            for (var i = 0; i < arr.length; i++) {
                $('#receipt-tab').append('<li class="mytab ' + arr[i].SubModule + '" style ="border-top:none">'
                        + '<a href="#' + arr[i].SubModule + '" data-toggle="tab"  onclick ="RemoveTab(\'' + arr[i].SubModule + '\');"><span class ="fa fa-pencil-square-o"></span> ' + arr[i].Form + ' </a>'
                        + '</li>');

                if (arr.length > 1) {
                    if (i == 0) {
                        $('.mytab').addClass('active');
                    }
                } else {
                    if (i == 0) {
                        $('.mytab').addClass('active');
                    }
                }
            }
        }
    }
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


function idsetupcallback(response){
    
    if(response.success){
        if (response.usage == 'getNextID') {
            var arr = response.data[0];
            $('#TranID').val(arr.NextGenID);
        }
    }
}


function saveRecord() {

    var data = objectifyForm($('#receipt-form').serializeArray());
    console.log(data);
    $.ajax({
        type: 'POST',
        url: baseUrl + "receiptservlet?operation=UPDATE_RECORD",
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data) {
            if (data.success) {
                $('#MsgAlert').modal('show');
                $('#saveRecord').css('display', 'none');
                $('#editRecord').css('display', 'block');
                $('#PrintRecord').css('display', 'block');
                $('input').attr('disabled', 'disabled');
                $('textarea').attr('disabled', 'disabled');
                $('select').attr('disabled', 'disabled');

            } else {
                $('#message-form').css('display', 'block');
                $('#message-form').html(data.message);
            }
        }});
}


function editRecord() {

}
function deleteRecord() {

}
function loadForm(TranID) {
    $('.mytab').removeClass('active');
    
    $('#receiptlist').css('display','none');
    $('#receipt').css('display','block');
    $('.tab-pane').removeClass('active');
//    $('#receipt-tab').append('<li class = "ViewReceipt" style = "border-top:none"><a href="#policy-view" data-toggle="tab">View</a></li>');
    $('.receipt').addClass('active');
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'receiptlist?jsonformat=jsonp&exactOnly=true&receipt='+TranID
    });
}
function RemoveTab(submodule){
    $('.ViewReceipt').remove();
    switch(submodule){
        case 'receiptlist':
            $('#receiptlist').css('display','block');
            $('#receipt').css('display','none');
        break;
        case 'receipt':
            
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=receipt'
            });
            removeRecord();
            getDate();
            $('#Amount').val(0);
            $('#Discount').val(0);
            $('#VAT').val(0);
            $('#WTax').val(0);
            $('#Commission').val(0);
            $('#NetAmt').val(0);
            $('#receipt').css('display','block');
            $('#receiptlist').css('display','none');
        break;
    }
    
}
function PrintForm(PolicyNo) {
    showReportForm(PolicyNo, 'FormName', 'receipt');
}
function receiptcallback(response) {
    if (response.success) {
        if (response.usage == 'getAllReceipt') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                var j = i + 1;
                $('#table-receipt').append('<tr id="rows1' + (i) + '" style = "cursor:pointer" title= "">'
                        + '<td style = "width:2%">' + j + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].TranID, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(convertDate(arr[i].TranDate, true), true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].ReceiveFrom, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].Purpose, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].NetAmt, true) + '</td>'
                        + '<td style = "width:3%"><a href= "#" onclick = "printformOnwindow(\'' + arr[i].TranID + '\');">&nbsp;<span class = "fa fa-print" style = "color:#8bc411"></span></a></td>'
                        + '</tr>'
                        );
                $('#rows1' + i).attr('TranID', arr[i].TranID);
                $('#rows1' + i).dblclick(function(a) {
                    var TranID = $(this).attr('TranID');
                    if (TranID) {
                        loadForm(TranID);
                    }
                });
            }
        }else if (response.usage == 'getExactReceipt'){
            var arr = response.data[0];
            $('#TranID').val(arr.TranID);
            $('#TranDate').val(arr.TranDate);
            $('#Purpose').val(arr.Purpose);
            $('#ReceiveFrom').val(arr.ReceiveFrom);
            $('#CompanyReceipt').val(arr.CompanyReceipt);
            $('#BusinessStyle').val(arr.BusinessStyle);
            $('#TINNo').val(arr.TINNo);
            $('#Address').val(arr.Address);
            
            $('#Amount').val(AddComas(arr.Amount, true));
            $('#Discount').val(AddComas(arr.Discount, true));
            $('#VAT').val(AddComas(arr.VAT, true));
            $('#WTax').val(AddComas(arr.WTax, true));
            $('#Commission').val(AddComas(arr.Commission, true));
            $('#NetAmt').val(AddComas(arr.NetAmt, true));
            $('#SeqID').val(arr.SeqID);
        }
    } 
}
function SearchReceipt() {
        $('#table-receipt-info').empty();
        var field = $('#filter').val();
        var value = $('#Search').val();
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'receiptlist?jsonformat=jsonp&dolimit=true&receipt=' + value
        });

    }
    
function printformOnwindow(RefID){
    window.open(baseUrl + 'jasperreport?jsonformat=jsonp&parameter={"events":{"replace":true,"remove":true,"clear":true,"add":true},"hasListeners":{},"map":{},"length":2}&otherparameter={}&batnbr=' + RefID +'&formname=receipt&reportid=10010&exporttype=pdf&custom=false');
}

function cancel() {
    window.location.reload();
}

function computeTotal(){
    var amount = $('#Amount').val();
    var discount = $('#Discount').val();
    var VAT = $('#VAT').val();
    var WTax = $('#WTax').val();
    var Commission = $('#Commission').val();
//    var NetAmt = $('#NetAmt').val();
    
    var Total = (parseFloat(amount.replace(',', '')) + parseFloat(WTax.replace(',', '')) + parseFloat(Commission.replace(',', '')) - parseFloat(discount.replace(',', '')));
    var vatAmnt = Total * .12;
//    console.log(GrandTotal);      
    var GrandTotal = Total + vatAmnt;
    $('#VAT').val(vatAmnt);
    $('#NetAmt').val(GrandTotal);
}
    
