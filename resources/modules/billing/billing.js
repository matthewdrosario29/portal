

function billingOnload(){
    
    
}
function billingcallback(response) {
   

    if (response.success) {
        
        try {
            
            if (response.usage == 'getbalance') {
            var arr = response.data[0];
            $('#outStandingBal').replaceWith('<p">PHP ' + AddComas(arr.Balance, true) + '</p>');
        } else if (response.usage == 'getcurrentbalance') {
            var arr = response.data[0];
            $('#currentBal').replaceWith('<p">PHP ' + AddComas(arr.Balance, true) + '</p>');
        } else if (response.usage == 'getprevbalance') {
            var arr = response.data[0];
            $('#prevBal').replaceWith('<p">PHP ' + AddComas(arr.Balance, true) + '</p>');
        } else if (response.usage == 'getbilling') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-header-bills').append('<tr id="rows123' + (i) + '">'
                        + '<td >&nbsp<a href= "#" onclick = "showReportForm(' + arr[i].BatNbr + ',\'FormName\',\'billing\');"><span class = "fa fa-print" style = "color:#09365a"></span></a>&nbsp;<a href= "#" onclick = "showBillingDetails(' + arr[i].BatNbr + ');"><span class = "fa fa-eye" style = "color:#8bc411"></span></a></td>'
                        + '<td title = "Double Click to print SOA">' + arr[i].TranID + '</td>'
                        + '<td title = "Double Click to print SOA">' + convertDate(arr[i].TranDate, true) + '</td>'
                        + '<td title = "Double Click to print SOA" >' + arr[i].Memo + '</td>'
                        + '<td title = "Double Click to print SOA" style ="text-align:right">PHP ' + AddComas(arr[i].DocTotalCur, true) + '</td>'
                        + '</tr>'
                        );
                $('#rows123' + i).attr('BatNbr', arr[i].BatNbr);
                $('#rows123' + i).dblclick(function(a) {
                    var BatNbr = $(this).attr('BatNbr');
                    if (BatNbr) {
                        showReportForm(BatNbr, 'FormName', 'billing');
                    }
                });
            }
        } else if (response.usage == 'getbillingperiod') {
            var arr = response.data[0];
            var option = '';
            $('#bill-period').append('<option selected disabled>-- SELECT BILLING PERIOD --</option>');
            $.each(response.data, function(i, item) {
                $("#bill-period").append($("<option></option>", {
                    value: item.BillingPeriod,
                    text: item.BillingPeriod
                }));
            });

            $('#bill-period').change(function() {

                var period = $('#bill-period').val();
                $('#tmp_period').val(period);

                jQuery.ajax({
                    type: 'POST',
                    jsonpCallback: "callback",
                    crossDomain: true,
                    dataType: 'jsonp',
                    url: baseUrl + 'billinglist?jsonformat=jsonp&ForBillHistory=true&custid=' + id + '&period=' + period

                });
            });
        }
            
        } catch(ex){
            
        }
        

    } else {
        alert("error at billing");
    }
}

function showBillingDetails(batnbr){
    
    $("#billingDetails").find('tbody').empty();
    $("#billingDetails").modal("show");
        jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'billinglist?jsonformat=jsonp&type=billingdetails&exactOnly=true&billing_batnbr=' + batnbr
    });
}

function billingdetailscallback(response) {
    if (response.success) {
        if (response.usage == 'getBillingdetails') {
            var arr = response.data;
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-details-billing').append('<tr id="rows1' + (i) + '">'
                        + '<td title = " " style = "word-wrap: break-word">' + arr[i].ChargeID + '</td>'
                        + '<td title = " ">' + arr[i].BillingSection + '</td>'
                        + '<td title = " ">' + arr[i].LineMemo + '</td>'
                        + '<td title = " ">' + AddComas(formatTwodecimal(arr[i].DocTotalCur), true) + '</td>'
                        + '</tr>'
                        );
                }
        }
    }
    else {
        alert("error at pasdasd");
    }
}


    