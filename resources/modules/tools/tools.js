var baseUrl = "http://localhost:8080/portal/";


var userid = $('#username').val();

var id;

function toolsOnLoad() {
    
    var userID = document.cookie;
    
    id = userID;
    
    
    jQuery.ajax({
                    type: 'POST',
                    jsonpCallback: "callback",
                    crossDomain: true,
                    dataType: 'jsonp',
                    url: baseUrl + 'userslist?jsonformat=jsonp&exactOnly=' + userID
                });
                
                
    jQuery.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'exceltablelist?jsonformat=jsonp&field=AllowUpload&value=1'
    });
    jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=tools'
        });
        
        
     
    

    $("#includePrompts").load("../../lookup/lookup.html");

    $('#UploadFile').change(function(e) {
        var file = e.target.files[0];
        if (file.type == 'application/vnd.ms-excel') {

            var form = $('#UploadForm')[0];
            var formData = new FormData(form);
            $.each(e.target.files, function(key, value) {
                formData.append(key, value);
            });
            $.ajax({
                type: 'POST',
                enctype: 'multipart/form-data',
                url: baseUrl + "uploadexcelservlet",
                data: formData,
                processData: false,
                contentType: false,
                success: function(data) {
                    var data = JSON.parse(data);
                    var arr = data.data;
                    $('#FileName').val(data.filename);
                    for (var i = 0; i < arr.length; i++) {
                        $("#Sheet").append($("<option></option>", {
                            value: arr[i].id,
                            text: arr[i].desc
                        }));
                    }
                }});
        } else {
            alert('Not a valid excel file!');
            clearFileInput(document.getElementById("UploadFile"));
        }
    });

    $('#uploadFile').on('click', function(e) {
        e.preventDefault();

        var tablename = $('#UploadLocation').val();
        var filename = $('#FileName').val();
        var sheet = $('#Sheet').val();

        if (tablename && filename && sheet) {
            $.ajax({
                type: 'POST',
                enctype: 'multipart/form-data',
                url: baseUrl + "uploadexcelservlet?action=UPLOAD&filename=" + filename + "&sheet=" + sheet + "&tablename=" + tablename,
                processData: false,
                contentType: false,
                cache: false,
                success: function(data) {
                    var data = JSON.parse(data);
                    if (data.success) {

                        var counter = 0;
                        var myInterval = setInterval(function() {
                            ++counter;
                            $('.progress-bar').css('display', 'block');
                        }, 1000);

                        $('#MsgAlert').modal('show');
                        $('#MessageAlert').empty();
                        $('#MessageAlert').html('Data uploaded!');
                        $('.progress-bar').css('display', 'none');
//                            window.location.reload();
                        clearFileInput(document.getElementById("UploadFile"));
                        $('#UploadLocation').val(null);
                        $('#FileName').val(null);
                        $('#Sheet').val(null);
                    } else {
                        alert(data.message);
                    }
                }});
        } else {
            alert('Please select a file first!');
        }
    });
    
    
}


function exceltablecallback(response) {
    var arr = response.data;
    $("#downnloadTemplate").append('<option disabled selected> - Select Table - </option>');
    $("#UploadLocation").append('<option disabled selected> - Select File Location - </option>');
    for (var i = 0; i < arr.length; i++) {
        $("#UploadLocation").append($("<option></option>", {
            value: arr[i].TableName,
            text: arr[i].TableDesc
        }));
        $("#downnloadTemplate").append($("<option></option>", {
            value: arr[i].TableName,
            text: arr[i].TableDesc
        }));
    }
}

var moduleArr = [];

function pmodulescallback(response) {
    if (response.success) {
        if (response.usage == 'getUserModules') {
            var arr = response.data;
            console.log(arr);
            
            
            for (var i = 0; i < arr.length; i++) {
                $('#userrights-tbl').append('<tr id="rows1' + (i) + '" style = "cursor:pointer" title= "Double Click to view record">'
                        + '<td style = "display:none"><input type = "hidden" class = "form-control input-sm"  name = "UserID" value = "' + UserID + '"></td>'
                        + '<td><input type = "text" class = "form-control input-sm"  name = "PModuleID" value = "' + arr[i].SubModule + '"></td>'
                        + '<td title = "Active"><input type ="checkbox" class="form-control input-sm" name = "ViewRec"  value = "1" style ="width:15px;height:15px"></td>'
                        + '<td><input type = "hidden" class = "form-control input-sm" name = "SeqID" value = "' + arr[i].SeqID + '"></td></td>'
                        + '</tr>'
                        );
            }
        }
        else if (response.usage == 'getUserrightsModules') {
            var arr = response.data;

            for (var i = 0; i < arr.length; i++) {
                $('#toolsTab').append('<li class="mytab">'
                        + '<a href="#' + arr[i].SubModule + '" data-toggle="tab""><span class ="fa fa-wrench"></span><span class="description"> ' + arr[i].Form + ' </span>  </a>'
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
        
        else if (response.usage == "getActiveModules"){
            
            if (response.success){
                var arr = response.data;
                for (var i = 0; i < arr.length; i++) {
                    
                    var obj = new Object();
                    obj.SubModule = (arr[i].SubModule);
                    obj.Form = (arr[i].Form);
                    moduleArr.push(obj);
                }
            }
        }
        
        else if (response.usage == 'getOtherUserModules'){
            if (response.success){
                var arr = response.data;
                console.log(arr);
                for (var i = 0; i < arr.length; i++){
                    $('#other-userrights-tbl').append('<tr id="rows1' + (i) + '" style = "cursor:pointer" title= "Double Click to view record">'
                        + '<td><input type = "text" class = "form-control input-sm"  name = "PModuleID" value = "' + arr[i].SubModule + '"></td>'
                        + '<td title = "Active"><input type ="checkbox" class="form-control input-sm" name = "ViewRec"  value = "1" style ="width:15px;height:15px"></td>'
                        + '<td><input type = "hidden" class = "form-control input-sm" name = "SeqID" value = "' + arr[i].SeqID + '"></td></td>'
                        + '</tr>'
                        );
                }
            }
            
        }



    }
}



function closeModules(){
    window.location.reload();
    $('#div-modules').modal('toggle');
}

function editAccount() {
    $('#editAccount').css('display', 'none');
    $('#saveAccount').css('display', 'block');
    $('input').removeAttr('disabled', 'disabled');
    $('input').attr('enabled', 'enabled');
}


function AddModuleAccount(){
    var isappend;
    var tmp_arr = [];
    $("#other-userrights-tbl").find('tbody').find("tr").each(
            function() {
                $(this).find("select").each(
                        function() {
                            tmp_arr.push($(this).val());
                        }
                );
                $(this).find("input").each(
                        function() {
                            tmp_arr.push($(this).val());
                        }
                );
            }
    );
        
    console.log(tmp_arr);


    //    append += '<option selected disabled>-SELECT MODULES-</option>';
    //    for(var i=0; i< moduleArr.length; i++){
    //        console.log(moduleArr[i]);
    //        var isappend = true;
    //        for( var j = 0; j<modules.length; j++){
    //            console.log(modules[j]);
    //            if(modules[j] == moduleArr[i]){
    //                isappend = false;
    //                break;
    //            }
    //        }
    //        if (isappend){
    //            if(append){
    //                append += '<option value="'+moduleArr[i]+'">'+moduleArr[i]+'</option>';
    //            }else{
    //                append = '<option value="'+moduleArr[i]+'">'+moduleArr[i]+'</option>';
    //            }
    //        }else{
    //            
    //        }
    //        
    //        
    //    }
    a: for (var i = 0; i < moduleArr.length; i++) {
        for (var j = 0; j < tmp_arr.length; j++) {
            if (tmp_arr[j] == moduleArr[i].SubModule) {
                continue a;
            }
        }

        if (isappend) {
            isappend += '<option value="' + moduleArr[i].SubModule + '">' + moduleArr[i].Form + '</option>';
        } else {
            isappend = '<option value="' + moduleArr[i].SubModule + '">' + moduleArr[i].Form + '</option>';
        }


    }

    $('#other-userrights-tbl').append('<tr>'
            + '<td style = "display:none"><input type ="hidden" class="form-control input-sm" name="UserID" value="' + userid + '"></td>'
            + '<td><select class = "form-control input-sm" name = "PModuleID" id = "SubModule">' + isappend + '</select></td>'
            + '<td><input type ="checkbox" class="form-control input-sm" name="ViewRec" value = "1" id = "ViewRec"  style ="width:15px;height:15px"></td>'
            + '<td><input type ="hidden" class="form-control input-sm" name="SeqID" ></td>'
            + '</tr>'
            );
        
    
}
function AddModule() {

    var append;
    var modules = [];
    $("#userrights-tbl").find('tbody').find("tr").each(
            function() {
                $(this).find("select").each(
                        function() {
                            modules.push($(this).val());
                            //                                obj['undefined'] = $(this).val();
                        }
                );
                $(this).find("input").each(
                        function() {
                            modules.push($(this).val());
                            //                                obj[$(this).attr('name')] = $(this).val();
                        }
                );
                //                    modules.push(obj);
            }
    );
    //        console.log(modules);


    //    append += '<option selected disabled>-SELECT MODULES-</option>';
    //    for(var i=0; i< moduleArr.length; i++){
    //        console.log(moduleArr[i]);
    //        var isappend = true;
    //        for( var j = 0; j<modules.length; j++){
    //            console.log(modules[j]);
    //            if(modules[j] == moduleArr[i]){
    //                isappend = false;
    //                break;
    //            }
    //        }
    //        if (isappend){
    //            if(append){
    //                append += '<option value="'+moduleArr[i]+'">'+moduleArr[i]+'</option>';
    //            }else{
    //                append = '<option value="'+moduleArr[i]+'">'+moduleArr[i]+'</option>';
    //            }
    //        }else{
    //            
    //        }
    //        
    //        
    //    }

    outerloop: for (var i = 0; i < moduleArr.length; i++) {
        for (var j = 0; j < modules.length; j++) {
            if (modules[j] == moduleArr[i].SubModule) {
                continue outerloop;
            }
        }

        if (append) {
            append += '<option value="' + moduleArr[i].SubModule + '">' + moduleArr[i].Form + '</option>';
        } else {
            append = '<option value="' + moduleArr[i].SubModule + '">' + moduleArr[i].Form + '</option>';
        }


    }

    $('#userrights-tbl').append('<tr>'
            + '<td style = "display:none"><input type ="hidden" class="form-control input-sm" name="UserID" value="' + id + '"></td>'
            + '<td><select class = "form-control input-sm" name = "PModuleID" id = "SubModule">' + append + '</select></td>'
            + '<td><input type ="checkbox" class="form-control input-sm" name="ViewRec" value = "1" id = "ViewRec"  style ="width:15px;height:15px"></td>'
            + '<td><input type ="hidden" class="form-control input-sm" name="SeqID" ></td>'
            + '</tr>'
            );

}

function saveUserrights(){
    
    var rowrec = [];
    
    var data = objectifyForm($('#userrights-form').serializeArray());
    $("#userrights-tbl").find('tbody').find("tr").each(
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

        console.log(JSON.stringify(data));
        
        $.ajax({
            type: 'POST',
            url: baseUrl + "puserrightsservlet?operation=UPDATE_RECORD",
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


function showModules() {
    $("#userrights-tbl").find('tbody').empty();
    
    jQuery.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&viewModules=true'
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&addModuleList=true'
    });
    $('#div-modules').modal('show');
    $('#other-modules').css('display','none');
}

function showOtherModules(){
    $('#other-userrights-tbl').find('tbody').empty();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'userslist?jsonformat=jsonp&dolimit=true&limitindex=0&limitcount=100'
    });
    
        
    $('#div-other-modules').modal('show');
}


function userscallback(response){
    if(response.success){
        if(response.usage == 'getUsers'){
            var arr = response.data;
            console.log(arr);
            $("#UserID").append('<option selected disabled>- Select User -</option>');
            for(var i = 0; i < arr.length; i++){
                 $("#UserID").append($("<option></option>",{
                        value:arr[i].UserID,
                        text:arr[i].FullName
                    }));
            }
            
            $('#UserID').change(function() {
                $('#other-userrights-tbl').find('tbody').empty();
//                $("#other-userrights").find('tbody').empty();
                var username = $('#UserID').val();
                $('#userid').val(username);
                userid = $('#userid').val();
                
                jQuery.ajax({
                    type: 'POST',
                    crossDomain: true,
                    dataType: 'jsonp',
                    url: baseUrl + 'PModuleslist?jsonformat=jsonp&otheruser='+username
                });
                
            });
            
           
        }
        
        else if (response.usage == 'getExactUsers'){
            var arr = response.data[0];
            $('#Username').val(arr.Username);
            $('#Branch').val(arr.Branch);
            $('#Active').val(arr.Active);
            $('#Email').val(arr.EmailAddress);
            $('#PasswordHint').val(arr.PasswordHint);
            $('#LastName').val(arr.LastName);
            $('#FirstName').val(arr.FirstName);
            $('#MiddleName').val(arr.MiddleName);
            $('#BirthDate').val(arr.BirthDate);
            $('#Password').val(arr.Password);
            $('#SeqID').val(arr.SeqID);
        }
    }
}

function closeOtherModules(){
    window.location.reload();
    $('#div-other-modules').modal('toggle');
}


function saveAccount(){
    
        var data = objectifyForm($('#users-form').serializeArray());
        console.log(data);
        
        $.ajax({
            type: 'POST',
            url: baseUrl + "usersservlet?operation=UPDATE_RECORD",
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
//                    $('#alert-div').css('display','block');
//                    $('#message').html('Membership Registration Successfully Submitted! Thank you');
//                    $('#msgbox').removeClass('alert-danger');
//                    $('#msgbox').addClass('alert-success');
                    $('#MsgAlert').modal('show');
                } else {
                    $('#alert-div').css('display','block');
                    $('#message').html(data.message);
                }
            }});
}

function DownloadTemplate(){
    var tableName = $('#downnloadTemplate').val();
    window.open(baseUrl+'uploadexcelservlet?jsonformat=jsonp&operation=DOWNLOAD_TEMPLATE&tablename=' + tableName);
}
























































































