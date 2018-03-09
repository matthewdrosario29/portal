/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var baseUrl = "http://localhost:8080/portal/";

function examschedOnload(){
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=examsched'
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'examschedlist?jsonformat=jsonp&dolimit=true&limitindex=0&limitcount=100'
    });
    
    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchExamSched();
        }
    });
    
    $("#includePrompts").load("../../lookup/lookup.html");
    
}

function pmodulescallback(response) {

    if (response.success) {
        if (response.usage == 'getUserrightsModules') {
            var arr = response.data;
            
            for (var i = 0; i < arr.length; i++) {
                $('#examsched-tab').append('<li class="mytab ' + arr[i].SubModule + '" style ="border-top:none">'
                        + '<a href="#' + arr[i].SubModule + '" data-toggle="tab"  onclick ="ChangeTab(\'' + arr[i].SubModule + '\');"><span class ="glyphicon glyphicon-user"></span> ' + arr[i].Form + ' </a>'
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

function examschedcallback(response){
    if (response.success){
        if(response.usage == 'getAllExamSched'){
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                var j = i + 1;
                $('#table-examsched').append('<tr id="rows1' + (i) + '" style = "cursor:pointer" title= "">'
                        + '<td style = "width:2%">' + j + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].EntryLevel, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].ExamSched, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].ExamBuilding, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].ExamRoom, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].Status, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].SeqID, true) + '</td>'
                        + '</tr>'
                        );
                $('#rows1' + i).attr('SeqID', arr[i].SeqID);
                $('#rows1' + i).dblclick(function(a) {
                    var SeqID = $(this).attr('SeqID');
                    if (SeqID) {
                        loadExamSched(SeqID);
                    }
                });
            }
        }
    }
}

function loadExamSched(){
    
}

function SearchExamSched(){
    $('#table-examsched').find('tbody').empty();
    var field = $('#filter').val();
    var value = $('#Search').val();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'examschedlist?jsonformat=jsonp&dolimit=true&limitindex=0&limitcount=100&examsched='+value
    });

}

function createSched(){
    $('#CreateSched').modal('show');
}

function saveExamSchedRecord(){
    var data = objectifyForm($('#examsched-form').serializeArray());
    console.log(data);
    $.ajax({
            type: 'POST',
            url: baseUrl + "examschedservlet?operation=UPDATE_RECORD",
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
                    $('#MsgAlert').modal('show');
                } else {
                }
            }});
}

function ChangeTab(submodule){
    $('.ViewStudent').empty();
    switch(submodule){
        case 'examsched':
            
        break;
        case 'examresults':
           $('#table-genadmission').find('tbody').empty();
           jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'genadmissionlist?jsonformat=jsonp&dolimit=true'
            });
        break;
        
    }
    
}

function genadmissioncallback(response){
    if (response.success){
        if(response.usage == 'getAllGenadmission'){
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                var j = i + 1;
                $('#table-genadmission').append('<tr id="rows10' + (i) + '" style = "cursor:pointer" title= "">'
                        + '<td style = "width:2%">' + j + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].ApplicationNo, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].LastName, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].FirstName, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].MiddleName, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].EntryLevel, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].ExamStatus, true) + '</td>'
                        );
                $('#rows10' + i).attr('ApplicationNo', arr[i].ApplicationNo);
                $('#rows10' + i).dblclick(function(a) {
                    var ApplicationNo = $(this).attr('ApplicationNo');
                    if (ApplicationNo) {
                        loadGenadmission(ApplicationNo);
                    }
                });
            }
        }
        else if (response.usage == 'getExactStudent'){
            var arr = response.data[0];
            $('#ApplicationNo').val(arr.ApplicationNo);
            $('#EntryLevel').val(arr.EntryLevel);
            $('#LastName').val(arr.LastName);
            $('#FirstName').val(arr.FirstName);
            $('#MiddleName').val(arr.MiddleName);
            $('#SAI').val(arr.SAI);
            $('#SAIInterpret').val(arr.SAIInterpret);
            $('#PGPA').val(arr.PGPA);
            $('#PGPAInterpret').val(arr.PGPAInterpret);
            $('#Math').val(arr.Math);
            $('#English').val(arr.English);
            $('#SATRC').val(arr.SATRC);
            $('#Examiner').val(arr.Examiner);
            $('#ExamResult').val(arr.ExamResult);
            $('#ExamStatus').val(arr.ExamStatus);
            $('#SeqID').val(arr.SeqID);
            
        }
    }
}
function loadGenadmission(ApplicationNo){
    $('.tab-pane').removeClass('active');
    $('.mytab').removeClass('active'); 
    $('#examsched-tab').append('<li class = "ViewStudent"><a href="#student-view" data-toggle="tab">View</a></li>');
    $('.ViewStudent').addClass('active');
    $('#student-view').addClass('active');
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'genadmissionlist?jsonformat=jsonp&exactOnly=true&genadmission='+ApplicationNo
    });
}

function saveGenadmission(){
    
    var data = objectifyForm($('#genadmission-form').serializeArray());
    console.log(data);
    $.ajax({
            type: 'POST',
            url: baseUrl + "genadmissionservlet?operation=UPDATE_RECORD",
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
                    $('#MsgAlert').modal('show');
                } else {
                }
            }});
}
