

function showPoDetails(batnbr){
    $("#procurementDetails").find('tbody').empty();
    $("#procurementDetails").modal("show");
        jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'procurementlist?jsonformat=jsonp&type=procurementdetails&poDetails=true&BatNbrPO=' + batnbr
    });
}

function procurementdetailscallback(response) {
    if (response.success) {
        if (response.usage == 'getProcurementdetails') {
            var arr = response.data;
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-details-procurement').append('<tr id="rows1' + (i) + '">'
                        + '<td title = " " style = "word-wrap: break-word">' + arr[i].ItemID + '</td>'
                        + '<td title = " ">' + arr[i].ItemDescription + '</td>'
                        + '<td title = " ">' + arr[i].QtyOrd + '</td>'
                        + '<td title = " ">' + AddComas(formatTwodecimal(arr[i].UnitCostCur), true) + '</td>'
                        + '<td title = " ">' + AddComas(formatTwodecimal(arr[i].ExtCostCur), true) + '</td>'
                        + '</tr>'
                        );
            }
        }
    }
    else {
        alert("error at pasdasd");
    }
}

function procurementcallback(response) {

    if (response.success) {
        if (response.usage == 'getMyPO') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                var amount = arr[i].DocTotalCur;
                var formatted = parseFloat(Math.round(amount * 100) / 100).toFixed(2);
                $('#tbl-header-po').append('<tr id="rows1' + (i) + '">'
                        + '<td style = "width:5%"><a href= "#" onclick = "showReportForm(' + arr[i].BatNbr + ',\'FormName\',\'procurement\');"><span class = "fa fa-print" style = "color:#09365a"></span></a>&nbsp;<a href= "#" onclick = "showPoDetails(' + arr[i].BatNbr + ');">&nbsp;<span class = "fa fa-eye" style = "color:#8bc411"></span></a></td>'
                        + '<td title = "">' + formatValue(arr[i].POType) + '</td>'
                        + '<td title = "">' + arr[i].TranID + '</td>'
                        + '<td title = "">' + convertDate(arr[i].TranDate, true) + '</td>'
                        + '<td title = "">' + arr[i].VendorName + '</td>'
                        + '<td title = "" style = "text-align:right">PHP ' + AddComas(formatted, true) + '</td>'
                        + '</tr>'
                        );
                $('#rows1' + i).attr('BatNbr', arr[i].BatNbr);
                $('#rows1' + i).dblclick(function(a) {
                    var BatNbr = $(this).attr('BatNbr');
                    if (BatNbr) {
                        showReportForm(BatNbr, 'FormName', 'procurement');
                    }
                });
            }
        }
    } else {
        alert("error at billing");
    }
}