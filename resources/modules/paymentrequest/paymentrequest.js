function paymentrequestcallback(response) {

    if (response.success) {

        if (response.usage == 'getPaymentrequest') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-header-rfp').append('<tr id="rows1' + (i) + '">'
                        + '<td style = "width:5%">&nbsp<a href= "#" onclick = "showReportForm(' + arr[i].BatNbr + ',\'FormName\',\'paymentrequest\');"><span class = "fa fa-print" style = "color:#09365a"></span></a>&nbsp;<a href= "#" onclick = "showRfpDetails(' + arr[i].BatNbr + ');"><span class = "fa fa-eye" style = "color:#8bc411"></span></a></td>'
                        + '<td title = " ">' + arr[i].VendorName + '</td>'
                        + '<td title = " ">' + arr[i].Payee + '</td>'
                        + '<td title = " ">' + formatValue(arr[i].CurAmount) + '</td>'
                        + '<td title = " " style = "width:50%">' + formatValue(arr[i].Memo, true) + '</td>'
                        + '</tr>'
                        );
                    $('#rows1' + i).attr('BatNbr', arr[i].BatNbr);
                    $('#rows1' + i).dblclick(function(a) {
                        var BatNbr = $(this).attr('BatNbr');
                        if (BatNbr) {
                            showReportForm(BatNbr, 'FormName', 'paymentrequest');
                        }
                    });
            }
        }
        else {
        alert("error at billing");
    }
}
}

function showRfpDetails(batnbr){
    $("#rfpDetails").find('tbody').empty();
    $("#rfpDetails").modal("show");
        jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'paymentrequestlist?jsonformat=jsonp&type=paymentrequestdetails&exactOnly=true&paymentrequestdetails_batnbr=' + batnbr
    });
}

function paymentrequestdetailscallback(response) {
    if (response.success) {
        if (response.usage == 'getPaymentrequestDetails') {
            var arr = response.data;
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-details-rfpDetails').append('<tr id="rows1' + (i) + '">'
                        + '<td title = " " style = "word-wrap: break-word">' + arr[i].TranID + '</td>'
                        + '<td title = " ">' + AddComas(formatTwodecimal(arr[i].AmountCur), true) + '</td>'
                        + '<td title = " " style = "word-wrap: break-word">' + formatValue(arr[i].LineMemo) + '</td>'
                        + '</tr>'
                
                        );
            }
        }
    }
    else {
        alert("error at pasdasd");
    }
}

function closeRfpDetails(){
     $("#rfpDetails").modal("toggle");
}