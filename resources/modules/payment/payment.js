function paymentcallback(response) {

    if (response.success) {

        if (response.usage == 'getPayment') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-header-payment').append('<tr id="rows1' + (i) + '">'
                        + '<td style = "width:5%">&nbsp<a href= "#" onclick = "showReportForm(' + arr[i].BatNbr + ',\'FormName\',\'payment\');"><span class = "fa fa-print" style = "color:#09365a"></span></a>&nbsp;<a href= "#" onclick = "showPaymentDetails(' + arr[i].BatNbr + ');"><span class = "fa fa-eye" style = "color:#8bc411"></span></a></td>'
                        + '<td title = " ">' + arr[i].VendorName + '</td>'
                        + '<td title = " ">' + arr[i].Payee + '</td>'
                        + '<td title = " " style = "width:50%">' + formatValue(arr[i].Memo, true) + '</td>'
                        + '<td title = " " style = "text-align:right">' + formatValue(arr[i].ChequeAmtCur) + '</td>'
                        + '</tr>'
                        );
                    $('#rows1' + i).attr('BatNbr', arr[i].BatNbr);
                    $('#rows1' + i).dblclick(function(a) {
                        var BatNbr = $(this).attr('BatNbr');
                        if (BatNbr) {
                            showReportForm(BatNbr, 'FormName', 'voucher');
                        }
                    });
            }
        }
        else {
        alert("error at billing");
    }
}
}

function showPaymentDetails(batnbr){
    $("#paymentDetails").find('tbody').empty();
    $("#paymentDetails").modal("show");
        jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'paymentlist?jsonformat=jsonp&type=paymentdetails&exactOnly=true&paymentdetails_batnbr=' + batnbr
    });
}

function paymentdetailscallback(response) {
    if (response.success) {
        if (response.usage == 'getPaymentdetails') {
            var arr = response.data;
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-details-paymentDetails').append('<tr id="rows1' + (i) + '">'
                        + '<td title = " " style = "word-wrap: break-word">' + arr[i].SubAcct + '</td>'
                        + '<td title = " " style = "text-align:right">' + AddComas(formatTwodecimal(arr[i].TranAmtCur), true) + '</td>'
                        + '<td title = " ">' + formatValue(arr[i].LineMemo,true) + '</td>'
                       
                        + '</tr>'
                
                        );
            }
        }
    }
    else {
        alert("error at pasdasd");
    }
}

function closepaymentDetails(){
     $("#paymentDetails").modal("toggle");
}