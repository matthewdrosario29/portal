function vouchercallback(response) {

    if (response.success) {

        if (response.usage == 'getVoucher') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-header-ap').append('<tr id="rows1' + (i) + '">'
                        + '<td style = "width:5%">&nbsp<a href= "#" onclick = "showReportForm(' + arr[i].BatNbr + ',\'FormName\',\'voucher\');"><span class = "fa fa-print" style = "color:#09365a"></span></a>&nbsp;<a href= "#" onclick = "showApDetails(' + arr[i].BatNbr + ');"><span class = "fa fa-eye" style = "color:#8bc411"></span></a></td>'
                        + '<td title = " ">' + arr[i].TranID + '</td>'
                        + '<td title = " ">' + arr[i].VendorName + '</td>'
                        + '<td title = " ">' + arr[i].Payee + '</td>'
                        + '<td title = " ">' + formatValue(arr[i].InvoiceAmtCur) + '</td>'
                        + '<td title = " " style = "width:50%">' + formatValue(arr[i].Memo, true) + '</td>'
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

function showApDetails(batnbr){
    $("#apDetails").find('tbody').empty();
    $("#apDetails").modal("show");
        jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'voucherlist?jsonformat=jsonp&type=voucherdetails&exactOnly=true&voucherdetails_batnbr=' + batnbr
    });
}

function voucherdetailscallback(response) {
    if (response.success) {
        if (response.usage == 'getVoucherdetails') {
            var arr = response.data;
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-details-apDetails').append('<tr id="rows1' + (i) + '">'
                        + '<td title = " " style = "word-wrap: break-word">' + arr[i].SubAcct + '</td>'
                        + '<td title = " " style = "word-wrap: break-word">' + arr[i].Acct + '</td>'
                        + '<td title = " " style = "text-align:right">' + AddComas(formatTwodecimal(arr[i].DRAmtCur), true) + '</td>'
                        + '<td title = " " style = "text-align:right">' + AddComas(formatTwodecimal(arr[i].CrAmtCur), true) + '</td>'
                       
                        + '</tr>'
                
                        );
            }
        }
    }
    else {
        alert("error at pasdasd");
    }
}

function closeApDetails(){
     $("#apDetails").modal("toggle");
}