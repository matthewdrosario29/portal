/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var baseUrl = "http://116.93.120.29:8080/portal/";

function approvalOnload() {

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'forapprovallist?jsonformat=jsonp&ModuleType=true'
    });

    $('#approvalLookup').modal('show');

    selectAll();

    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            searchRec();
        }
    });

    $("#includePrompts").load("../../lookup/lookup.html");


}

function forapprovalcallback(response) {
    if (response.usage == 'getModuleType') {
        var arr = response.data;
        console.log(arr);



        for (var i = 0; i < arr.length; i++) {
            $('#approval-lookup-table').append('<tr id="rows' + (i) + '"><td>' + arr[i].TranDescription + '</td></tr>');

            $('#rows' + i).attr('TranType', arr[i].TranType);
            $('#rows' + i).attr('TranDescription', arr[i].TranDescription);
            $('#rows' + i).dblclick(function(a) {
                var TranType = $(this).attr('TranType');
                var TranDescription = $(this).attr('TranDescription');
                if (TranType && TranDescription) {
                    console.log(TranType);
                    console.log(TranDescription);
                    loadForApproval(TranType);
                    $('#Module-Name').empty();
                    $('#Module-Name').html(TranDescription);
                    $('#module-trantype').val(TranType);
                    $('#approvalLookup').modal('hide');
//                    $('#process-approve-btn').css('display', 'block');
//                    $('#process-reject-btn').css('display', 'block');

                }
            });

            $('#rows' + i).click(function(a) {
                var TranType = $(this).attr('TranType');
                var TranDescription = $(this).attr('TranDescription');
                if (TranType && TranDescription) {
                    $('#trantype').val(TranType);
                    $('#trandescription').val(TranDescription);
                }
            });
        }

        $('#approval-lookup-table tr').click(function() {
            var selected = $(this).hasClass('highlight');
            $('#approval-lookup-table tr').removeClass('highlight');
            if (!selected)
                $(this).addClass('highlight');
        });


    }
    else if (response.usage == 'getRecords') {
        var arr = response.data;
        console.log(arr);
        $('#forapproval-records').find('tbody').empty();


        for (var i = 0; i < arr.length; i++) {
            $('#forapproval-records').append('<tr class = "responsive-tr" id="rows1' + (i) + '" rownum = ' + (i) + ' style = "cursor:pointer">'
//                    +'<td style = "display:none">' + formatValue(arr[i].ApprovalType, true) + '</td>'+
                    + '<td style = "display:none">' + formatValue(arr[i].BatNbr, true) + '</td>'
                    + '<td style = "display:none">' + formatValue(arr[i].TranType, true) + '</td>'
                    + '<td style = "display:none">' + formatValue(arr[i].TranID, true) + '</td>'
                    + '<td style = "display:none">' + formatValue(arr[i].TranDate, true) + '</td>'
                    + '<td  style ="text-align: center;width:2%"><input class = "checkbox_approve" name = "Action[]" type = "checkbox" style = "width:15px;height:15px" value = "APPROVE"></td>'
                    + '<td >' + formatValue(arr[i].VendorName, true) + '</td>'
                    + '<td  style = "width:30%">' + formatValue(arr[i].Memo, true) + '</td>'
                    + '<td ><b>' + formatCurrencyList(formatValue(arr[i].DocAmount, true), true) + '</b></td>'
                    + '<td style = "display:none">' + formatValue(arr[i].DocOwner, true) + '</td>'
                    + '<td style = "display:none">' + formatValue(arr[i].SeqID, true) + '</td>'
                    + '<td style = "display:none">' + formatValue(arr[i].Module, true) + '</td>'
                    + '<td style = "display:none"><center><input class = "checkbox_approve" name = "Action[]" type = "checkbox" style = "width:15px;height:15px" value = "APPROVED"></center></td>'
                    + '<td style = "display:none"><center><input class = "checkbox_reject" name = "Action[]" type = "checkbox" style = "width:15px;height:15px" value = "REJECT"></center></td>'
                    + '<td style = "display:none"><a class = "btn btn-primary helix-btn btn-sm"><span class = "fa fa-eye-slash"></span></a></td>'
                    + '<td ><a class = "btn btn-primary helix-btn btn-sm" onclick = "addComment(this);"><span class = "fa fa-comments"></span></a></td>'
                    + '</tr>'

                    );

            $('#rows1' + i).attr('TranID', arr[i].TranID);
            $('#rows1' + i).dblclick(function(a) {
                var TranID = $(this).attr('TranID');
                if (TranID) {
//                    loadForm(BatNbr);
                }
            });

//            $('#rows1' + i).click(function(e){
//                if($(e.target).is(':checkbox')) return;
//                var $cb = $(this).find(':checkbox');
//                $cb.prop('checked', !$cb.is(':checked'));
//            });
        }



    }
}

function loadForApproval(TranType) {
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'forapprovallist?jsonformat=jsonp&trantype=' + TranType
    });
}

function reloadRecords() {
    $('#approvalLookup').modal('show');
}
var recordsArr = [];
function approveTransaction() {


    var list = ['BatNbr', 'TranType', 'TranID', 'TranDate', 'Action', 'VendorName', 'Memo', 'DocAmount', 'DocOwner', 'SeqID', 'Module'];

    var arr = [];

    $.each($('input[name="Action[]"]:checked').closest('tr'),
            function() {
                var obj = new Object();


                for (var i = 0; i < $(this).find('td').length; i++) {
                    eval('obj.' + list[i] + ' = \'' + $(($(this).find('td'))[i]).text() + '\'');
                    obj.Action = 'APPROVE';
                }

                arr.push(obj);

                console.log(arr);
            }
    );

    var data = objectifyForm($('#table-approval').serializeArray());
    //empty first arr
    data.details = arr;

    $.ajax({
        type: 'POST',
        url: baseUrl + "forapprovalservlet?operation=PROCESS_RECORD",
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


function rejectTransaction() {


    var list = ['BatNbr', 'TranType', 'TranID', 'TranDate', 'Action', 'VendorName', 'Memo', 'DocAmount', 'DocOwner', 'SeqID', 'Module'];

    var arr = [];

    $.each($('input[name="Action[]"]:checked').closest('tr'),
            function() {
                var obj = new Object();


                for (var i = 0; i < $(this).find('td').length; i++) {
                    eval('obj.' + list[i] + ' = \'' + $(($(this).find('td'))[i]).text() + '\'');
                    obj.Action = 'REJECT';
                }

                arr.push(obj);

                console.log(arr);
            }
    );

    var data = objectifyForm($('#table-approval').serializeArray());
    //empty first arr
    data.details = arr;

    $.ajax({
        type: 'POST',
        url: baseUrl + "forapprovalservlet?operation=PROCESS_RECORD",
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

function closeapprovalLookup() {
    $('#approvalLookup').modal('hide');
    $('.highlight').removeClass('highlight');
    $('#trantype').empty();
    $('#trandescription').empty();
}

function SelectLookup() {
    if ($('#trantype').val().trim() == '') {

    } else {
        var trantype = $('#trantype').val();
        var trandescription = $('#trandescription').val();
        $('#module-trantype').val(trantype);

        $('#Module-Name').empty();
        $('#Module-Name').html(trandescription);


        loadForApproval(trantype);
        $('#approvalLookup').modal('hide');
        $('.highlight').removeClass('highlight');
        $('#trantype').empty();
        $('#trandescription').empty();
    }


//    $('#process-approve-btn').css('display', 'block');
//    $('#process-reject-btn').css('display', 'block');
}
function selectAll() {
    $('.select_all').click(function(e) {
        $('.checkbox_approve').not(this).prop('checked', this.checked);
        var table = $(e.target).closest('table');
        $('td input:checkbox', table).prop('checked', this.checked);
    });
}

function addComment(tr) {

    var data = objectifyForm($('#table-approval').serializeArray());
    ;
    var newArr = [];
    var values = new Array();
    $.each($(tr).closest('td').siblings('td'),
            function() {
                values.push($(this).text());
            });

    var obj = new Object();
    obj.BatNbr = values[0];
    obj.TranType = values[1];
    obj.TranID = values[2];
    obj.TranDate = values[3];
    obj.VendorName = values[5];
    obj.DocAmount = values[7];
    obj.DocOwner = values[8];
    obj.SeqID = values[9];
    obj.Module = values[10];
    newArr.push(obj);


    var rownumval = $(tr).closest('tr').attr("rownum");
    console.log(rownumval);
    $('#messageLookup').modal('show');

    $('#Name').html("<b> - " + values[5] + " - </b>");




    $('#approvePerTran').on('click', function() {
        newArr[0].Action = 'APPROVE';
        newArr[0].Message = $('#addRemarks').val();
        data.details = newArr;
        $.ajax({
            type: 'POST',
            url: baseUrl + "forapprovalservlet?operation=PROCESS_RECORD",
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
    });
    $('#rejectPerTran').on('click', function() {
        newArr[0].Action = 'CANCELLED';
        newArr[0].Message = $('#addRemarks').val();
        data.details = newArr;
        $.ajax({
            type: 'POST',
            url: baseUrl + "forapprovalservlet?operation=PROCESS_RECORD",
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

    });
}

function closemessageLookup() {
    $('#messageLookup').modal('hide');

}

function searchRec() {
    var module_trantype = $('#module-trantype').val();
    var search = $('#Search').val();

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'forapprovallist?jsonformat=jsonp&trantype=' + module_trantype + '&value_search=' + search
    });
}


