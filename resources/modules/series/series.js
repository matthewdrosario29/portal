/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var baseUrl = "http://localhost:8080/portal/";

function seriesOnload(){
    
    var userID = getCookie('UserID');
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'userslist?jsonformat=jsonp&exactOnly=' + userID
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=series'
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'serieslist?jsonformat=jsonp&dolimit=true'
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
    
    $("#includePrompts").load("../../lookup/lookup.html");
    
    $('#Search-series').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchReceipt();
        }
    });
    
    
    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'insurancecompanylist?fordropdown=true',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#ICompanyID-issuance').append('<option value = "" disabled selected>-Select Insurance Company-</option>');
                for (var i = 0; i < arr.length; i++) {
                    $("#ICompanyID-issuance").append($("<option></option>", {
                        value: arr[i].CompanyID,
                        text: arr[i].CompanyName
                    }));
                    $("#ICompanyID").append($("<option></option>", {
                        value: arr[i].CompanyID,
                        text: arr[i].CompanyName
                    }));
                }

            }
        }
    });
    
    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'userslist?Agent=true',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#AgentID').append('<option value = "" disabled selected>-Select Agent-</option>');
                $('#AgentID-info').append('<option value = "" disabled selected>-Select Agent-</option>');
                var found = false;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].UserID == userID) {
                        found = true;
                    }
                    $("#AgentID").append($("<option></option>", {
                        value: arr[i].UserID,
                        text: arr[i].FullName
                    }));
                    $("#AgentID-info").append($("<option></option>", {
                        value: arr[i].UserID,
                        text: arr[i].FullName
                    }));

                }
                if (found) {
                    $('#AgentID').val(userID);
                    $('#AgentID-info').val(userID);
                }
            }
        }
    });
    
    
}

function pmodulescallback(response) {

    if (response.success) {
        if (response.usage == 'getUserrightsModules') {
            var arr = response.data;

            for (var i = 0; i < arr.length; i++) {
                $('#series-tab').append('<li class="mytab ' + arr[i].SubModule + '" style ="border-top:none">'
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

function RemoveTab(submodule){

    switch(submodule){
        case 'serieslist':
            $('#table-series').find('tbody').empty();
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'serieslist?jsonformat=jsonp&dolimit=true'
            });
        break;
        case 'seriesform':
        break;
        case 'seriesissuancelist':
            $('#table-seriesissuance').find('tbody').empty();
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'seriesissuancelist?jsonformat=jsonp&dolimit=true'
            });
        break;
        case 'seriesissuanceform':
                $('#SeriesRef-issuance').empty();
                jQuery.ajax({
                    type: 'POST',
                    url: baseUrl + 'serieslist?fordropdown=true',
                    success: function(response) {
                        if (response.data) {
                            var arr = response.data;
                            for (var i = 0; i < arr.length; i++) {
                                $("#SeriesRef-issuance").append($("<option></option>", {
                                    value: arr[i].SeriesRange,
                                    text: arr[i].SeriesRange
                                }));
                            }
                        }
                    }
                });
        break;
    }
    
}

function saveSeriesRecord(){
    
    var data = objectifyForm($('#series-form').serializeArray());
    console.log(data);
    $.ajax({
        type: 'POST',
        url: baseUrl + "seriesservlet?operation=UPDATE_RECORD",
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
function editRecord(){
    
}
function deleteRecord(){
    
}
function loadSeriesForm(){
    
}
function loadSeriesIssuanceForm(){
    
}

function saveIssuanceRecord(){
    var data = objectifyForm($('#seriesissuance-form').serializeArray());
    console.log(data);
    $.ajax({
        type: 'POST',
        url: baseUrl + "seriesissuanceservlet?operation=UPDATE_RECORD",
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
function seriescallback(response){
    if(response.success){
        if(response.usage == 'getSeries'){
            var arr = response.data;
            console.log(arr);
            for (var i = 0; i < arr.length; i++){
                var j = i+1;
                $('#table-series').append('<tr id="rows1' + (i) + '" style = "cursor:pointer" title= "">'
                        + '<td style = "width:2%">'+j+'</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].ICompanyDesc, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].SeriesRef, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].StartSeries, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].EndSeries, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(convertDate(arr[i].PurchaseDate, true),true) + '</td>'
                        + '<td style = "width:3%"><a href= "#" onclick = "PrintForm(\''+ arr[i].SeqID +'\');">&nbsp;<span class = "fa fa-print" style = "color:#8bc411"></span></a></td>'
                        + '</tr>'
                        );
                $('#rows1' + i).attr('SeqID', arr[i].SeqID);
                $('#rows1' + i).dblclick(function(a) {
                    var SeqID = $(this).attr('SeqID');
                    if (SeqID) {
                        loadSeriesForm(SeqID);
                    }
                });
            }
        }
    }
}

function seriesissuancecallback(response){
    if (response.success){
        if(response.usage == 'getAllSeriesIssuance'){
            var arr = response.data;
            
            for (var i = 0; i < arr.length; i++){
                var j = i+1;
                $('#table-seriesissuance').append('<tr id="rows2' + (i) + '" style = "cursor:pointer" title= "">'
                        + '<td style = "width:2%">'+j+'</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].AgentID, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].IssuedDate, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].StartSeries, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].EndSeries, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].SoldCount, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].CancelledCount, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].AvailableCount, true) + '</td>'
                        + '<td style = "width:3%"><a href= "#" onclick = "PrintForm(\''+ arr[i].SeqID +'\');">&nbsp;<span class = "fa fa-print" style = "color:#8bc411"></span></a></td>'
                        + '</tr>'
                        );
                $('#rows2' + i).attr('SeqID', arr[i].SeqID);
                $('#rows2' + i).dblclick(function(a) {
                    var SeqID = $(this).attr('SeqID');
                    if (SeqID) {
                        loadSeriesIssuanceForm(SeqID);
                    }
                });
            }
            
        }
    }
}
function cancel() {
    window.top.location.reload();
}


