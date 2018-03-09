function requisitioncallback(response) {

    if (response.success) {

        if (response.usage == 'getRequisition') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-header-requisition').append('<tr id="rows1' + (i) + '">'
                        + '<td style = "width:5%">&nbsp<a href= "#" onclick = "showReportForm(' + arr[i].BatNbr + ',\'FormName\',\'requisition\');"><span class = "fa fa-print" style = "color:#09365a"></span></a>&nbsp;<a href= "#" onclick = "showReqDetails(' + arr[i].BatNbr + ');"><span class = "fa fa-eye" style = "color:#8bc411"></span></a></td>'
                        + '<td title = " ">' + arr[i].TranID + '</td>'
                        + '<td title = " ">' + convertDate(arr[i].TranDate, true) + '</td>'
                        + '<td title = " ">' + formatValue(arr[i].WarehouseName) + '</td>'
//                        + '<td title = " ">' + formatValue(arr[i].DeptID) + '</td>'
                        + '<td title = " " style = "width:50%">' + formatValue(arr[i].Details, true) + '</td>'
                        + '</tr>'
                        );
                    $('#rows1' + i).attr('BatNbr', arr[i].BatNbr);
                    $('#rows1' + i).dblclick(function(a) {
                        var BatNbr = $(this).attr('BatNbr');
                        if (BatNbr) {
                            showReportForm(BatNbr, 'FormName', 'requisition');
                        }
                    });
            }
        }
        else {
        alert("error at billing");
    }
}
}

function showReqDetails(batnbr){
    $("#requistionDetails").find('tbody').empty();
    $("#requistionDetails").modal("show");
        jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'requisitionlist?jsonformat=jsonp&type=requisitiondetails&exactOnly=true&requisitiondetails_batnbr=' + batnbr
    });
}

function requisitiondetailscallback(response) {
    if (response.success) {
        if (response.usage == 'getRequisitiondetails') {
            var arr = response.data;
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-details-requisition').append('<tr id="rows1' + (i) + '">'
                        + '<td title = " " style = "word-wrap: break-word">' + arr[i].ItemDescription + '</td>'
                        + '<td title = " ">' + AddComas(formatTwodecimal(arr[i].QtyOrd), true) + '</td>'
                        + '<td title = " ">' + AddComas(formatTwodecimal(arr[i].UnitCost), true) + '</td>'
                        + '<td title = " ">' + AddComas(formatTwodecimal(arr[i].CurExtCost), true) + '</td>'
                        + '</tr>'
                
                        );
            }
        }
    }
    else {
        alert("error at pasdasd");
    }
}