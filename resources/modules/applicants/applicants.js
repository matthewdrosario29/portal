/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var baseUrl = "http://localhost:8080/portal/";

function applicantsOnload(){
    var userID = getCookie('UserID');
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=applicants'
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'genadmissionlist?jsonformat=jsonp&dolimit=true'
    });
    
    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchGenadmission();
        }
    });
    
    $("#includePrompts").load("../../lookup/lookup.html");
}


function pmodulescallback(response) {

    if (response.success) {
        if (response.usage == 'getUserrightsModules') {
            var arr = response.data;
            
            for (var i = 0; i < arr.length; i++) {
                $('#applicant-tab').append('<li class="mytab ' + arr[i].SubModule + '" style ="border-top:none">'
                        + '<a href="#' + arr[i].SubModule + '" data-toggle="tab"  onclick ="RemoveTab(\'' + arr[i].SubModule + '\');"><span class ="glyphicon glyphicon-user"></span> ' + arr[i].Form + ' </a>'
                        + '</li>');

               if(arr.length > 1){
                   if(i == 0){
                        $('.mytab').addClass('active');
                   }
               }else{
                   if(i == 0){
                        $('.mytab').addClass('active');
                   }
               }
            }

        }
    }
}

function genadmissioncallback(response){
    if (response.success){
        if(response.usage == 'getAllGenadmission'){
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                var j = i + 1;
                var valueActive = 0;
                if (arr[i].AppActive == 'Activated'){
                    valueActive = 1;
                }else{
                    valueActive = 0;
                }
                var codex1 = "";
                if(arr[i].AppActive == 'Activated'){
                    codex1 = '<td><select type ="text" class ="form-control text-grid  input-sm " id ="AppActive' + (i) + '" name ="Active"  disabled style = "padding : 0 0 0 7px"> <option value = '+valueActive+'>'+arr[i].AppActive+'</option><option value = "1">Activate</option></select></td>';
                    
                 }else if (arr[i].AppActive == null || arr[i].AppActive == 0){
                     codex1 = '<td><select type ="text" class ="form-control text-grid select-grid  input-sm " id ="AppActive' + (i) + '" name ="Active"  disabled style = "padding : 0 0 0 7px"><option value = '+valueActive+'>'+arr[i].AppActive+'</option><option value = "1">Activate</option></select></td>';
                    }else{
                     codex1 = '<td><select type ="text" class ="form-control text-grid select-grid input-sm " id ="AppActive' + (i) + '" name ="Active"  disabled style = "padding : 0 0 0 7px"> <option value = '+valueActive+'>'+arr[i].AppActive+'</option><option value = "1">Activate</option></select></td>';

                 }
                $('#table-genadmission').append('<tr id="rows1' + (i) + '" style = "cursor:pointer" title= "">'
                        + '<td style = "width:2%">' + j + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].ApplicationNo, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].LastName, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].FirstName, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].MiddleName, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].EntryLevel, true) + '</td>'
                        + codex1
                        +'<td><input type ="hidden" class ="form-control text-grid input-sm " id ="EmailAddress' + (i) + '" name ="EmailAddress" value = "'+arr[i].EmailAddress+'" readonly></td>'
                        +'<td><input type ="hidden" class ="form-control text-grid input-sm " id ="AppNo' + (i) + '" name ="ApplicationNo" value = "'+arr[i].ApplicationNo+'" readonly></td>'
                        +'<td><input type ="hidden" class ="form-control text-grid input-sm " id ="SeqID' + (i) + '" name ="SeqID" value = "'+arr[i].OnlineAppID+'" readonly></td>'
//                      + '</tr>'
                        );
//                $('#rows1' + i).attr('PolicyNo', arr[i].PolicyNo);
//                $('#rows1' + i).dblclick(function(a) {
//                    var PolicyNo = $(this).attr('PolicyNo');
//                    if (PolicyNo) {
//                        loadForm(PolicyNo);
//                    }
//                });
            }
        }
    }
}

function SearchGenadmission() {
    $('#table-genadmission').find('tbody').empty();
    var field = $('#filter').val();
    var value = $('#Search').val();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'genadmissionlist?jsonformat=jsonp&dolimit=true&genadmission=' + value
    });

}

function activeAccount(){
    $('#saveGrid').css('display','block');
    $('#activeAccount').css('display','none');
//    $('select').removeAttr('disabled','disabled');
    $('select.select-grid').removeAttr('disabled','disabled');
}

function saveGrid(){
    var rowrec = [];
    var data = objectifyForm($('#applicants-grid').serializeArray());
    $("#table-genadmission").find('tbody').find("tr").each(
            function() {
                var obj = new Object();
                $(this).find("select").each( 
                        function() {
                            obj[$(this).attr('name')] = $(this).val();
                        }
                );
                $(this).find("input").each( 
                        function() {
                            obj[$(this).attr('name')] = $(this).val();
                        }
                );
                rowrec.push(obj);
            }
        );
        data.details = rowrec;
        console.log(rowrec);
        $.ajax({
            type: 'POST',
            url: baseUrl + "applicationaccountservlet?operation=UPDATE_GRID",
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
                    $('#message').css('display', 'none');
                    $('#MsgAlert').modal('show');
                } else {
                    $('#message').css('display', 'block');
                    $('#message').html(data.message);
                }
            }});
}