/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function salesordercallback(response) {

    if (response.success) {
        if (response.usage == 'getMySO') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-header-so').append('<tr id="rows1' + (i) + '">'
                        + '<td style = "width:5%">&nbsp<a href= "#" onclick = "showReportForm(' + arr[i].BatNbr + ',\'FormName\',\'salesorder\');"><span class = "fa fa-print" style = "color:#09365a"></span></a>&nbsp;<a href= "#" onclick = "showPoDetails(' + arr[i].BatNbr + ');">&nbsp;<span class = "fa fa-eye" style = "color:#8bc411"></span></a></td>'
                        + '<td title = " ">' + arr[i].TranID + '</td>'
                        + '<td title = " ">' + convertDate(arr[i].TranDate, true) + '</td>'
                        + '<td title = " ">' + arr[i].CustID + '</td>'
                        + '<td title = " " style = "text-align:right">' + AddComas(formatTwodecimal(arr[i].TotalAmtCur), true) + '</td>'
                        + '</tr>'
                        );
                $('#rows1' + i).attr('BatNbr', arr[i].BatNbr);
                $('#rows1' + i).dblclick(function(a) {
                    var BatNbr = $(this).attr('BatNbr');
                    if (BatNbr) {
                        showReportForm(BatNbr, 'FormName', 'salesorder');
                    }
                });
            }
        }
    } else {
        alert("error at billing");
    }
}

