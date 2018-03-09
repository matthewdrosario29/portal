function customerOnload(){
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=customer'
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'customerlist?jsonformat=jsonp&dolimit=true'
    });
    
    jQuery.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'exceltablelist?jsonformat=jsonp&field=AllowUpload&value=1'
    });
    
    
    
    
    $('.material-button-toggle').on("click", function() {
        $(this).toggleClass('open');
        $('.option').toggleClass('scale-on');
    });
    
    $('#Search').keyup(function(event){
       if (event.keyCode === 13){
           SearchMember();
       } 
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

function idsetupcallback(response){
    if(response.success){
        if (response.usage == 'getNextID') {
            var arr = response.data[0];
            $('#CustomerID').val(arr.NextGenID);
        }
    }
}

function exceltablecallback(response) {
    var arr = response.data;

    for (var i = 0; i < arr.length; i++) {
        $("#UploadLocation").append($("<option></option>", {
            value: arr[i].TableName,
            text: arr[i].TableDesc
        }));
    }
}



function editData(){
    $('#saveRecord').css('display','block');
    $('input').removeAttr('disabled', 'disabled');
    $('textarea').removeAttr('disabled', 'disabled');
    
}
function pmodulescallback(response){
    
    if (response.success){
        if (response.usage == 'getUserrightsModules'){
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
               $('#customerTab').append('<li class="mytab">'
                                        +'<a href="#'+arr[i].SubModule+'" data-toggle="tab"  onclick ="RemoveTab();"><span class ="glyphicon glyphicon-user"></span> '+arr[i].Form+' </a>'
                                        +'</li>');
                
               
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

function AddCustomer(){
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=customer'
    });
    
    $('#saveRecord').css('display','block');
    
    $('input').removeAttr('disabled', 'disabled');
    $('textarea').removeAttr('disabled', 'disabled');
    $('#customer-toolbar').css('display','none');
    $('input').val('');
    $('textarea').val('');
    $('select').val('');
    $('.tab-pane').removeClass('active');
    $('#customerTab').append('<li class = "AddCustomer"><a href="#add-customer" data-toggle="tab"><span class = "fa fa-user">+</span> New Customer</a></li>');
    $('.mytab').removeClass('active'); 
    $('.AddCustomer').addClass('active');
    $('#add-customer').addClass('active');
    
}

function RemoveTab(){
    $('.AddCustomer').remove();
    $('.ViewCustomer').remove();
}

function customercallback(response){
    if (response.success){
        if(response.usage == 'getAllCustomer'){
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                
                var j = i+1;
                
                $('#CustomerList').append('<tr id="rows1' + (i) + '" style = "cursor:pointer" title= "">'
                      + '<td style = "width:3%"><a href= "#" onclick = "loadForm(\''+ arr[i].CustomerID +'\');">&nbsp;<span class = "fa fa-eye" style = "color:#8bc411"></span></a></td>'
                        + '<td style = "width:2%">'+j+'</td>'
                        + '<td style = "width:20%" title = "Last Name">' + formatValue(arr[i].AccountID, true) + '</td>'
                        + '<td style = "width:20%" title = "First Name">' + formatValue(arr[i].CustomerName, true) + '</td>'
                        + '<td style = "width:20%" title = "Middle Name">' + formatValue(arr[i].LastName, true) + '</td>'
                        + '<td style = "width:25%" title = "City">' + formatValue(arr[i].FirstName, true) + '</td>'
                        + '<td style = "width:20%" title = "TelNo">' + formatValue(arr[i].MiddleName, true) + '</td>'
                        + '</tr>'
                        );
                $('#rows1' + i).attr('CustomerID', arr[i].CustomerID);
                $('#rows1' + i).dblclick(function(a) {
                    var CustomerID = $(this).attr('CustomerID');
                    if (CustomerID) {
                        loadForm(CustomerID);
                    }
                });
            }
        }
        else if (response.usage == 'getExactCustomer'){
            var arr = response.data[0];
            console.log(arr);
            $('#CustomerID').val(arr.CustomerID);
            $('#CustomerName').val(arr.CustomerName);
            $('#TelNo').val(arr.TelNo);
            $('#MemberStatus').val(arr.MemberStatus);
            $('#Email').val(arr.Email);
            $('#AccountID').val(arr.AccountID);
            $('#Password').val(arr.Password);
            $('#RegistrationDate').val(arr.RegistrationDate);
            $('#CurCode').val(arr.CurCode);
            $('#FirstName').val(arr.FirstName);
            $('#FirstName').val(arr.FirstName);
            $('#MiddleName').val(arr.MiddleName);
            $('#LastName').val(arr.LastName);
            $('#BirthDate').val(arr.BirthDate);
            $('#Nationality').val(arr.Nationality);
            $('#Address').val(arr.Address);
            $('#PostCode').val(arr.PostCode);
            $('#Country').val(arr.Country);
            $('#Gender').val(arr.Gender);
            $('#MobileNo').val(arr.MobileNo);
            $('#BankCode').val(arr.BankCode);
            $('#SwiftCode').val(arr.SwiftCode);
            $('#BranchID').val(arr.BranchID);
            $('#BankAddress').val(arr.BankAddress);
            $('#BankAccountName').val(arr.BankAccountName);
            $('#BankAccountNo').val(arr.CuBankAccountNostomerID);
            $('#FurtherInstruction').val(arr.FurtherInstruction);
            $('#EmailSub').val(arr.EmailSub);
            $('#SeqID').val(arr.SeqID);
            
            
        }
    }
}

function SearchMember(){
        $('#customer-infos').empty();
        var field = $('#filter').val();
        var value = $('#Search').val();
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'customerlist?jsonformat=jsonp&dolimit=true&customer='+value
        });
    
}


function saveRecord(){
    var data = objectifyForm($('#customer-form').serializeArray());
    console.log(data);
    $.ajax({
        type: 'POST',
        url: baseUrl + "customerservlet?operation=UPDATE_RECORD",
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data) {
            if (data.success) {
                    $('input').val('');
                    $('textarea').val('');
                    $('select').val('');
                    $('#MsgAlert').modal('show');
                } else {
                    $('#message').html(data.message);
                }
            }});
}

function deleteRecord(){
    $('#MsgAlertConfirmScreen').modal('show');
    var clicked = false;
    $('#Yes').click(function(){
        if(!clicked){
            var data = objectifyForm($('#customer-form').serializeArray());
            $.ajax({
                type: 'POST',
                url: baseUrl + "customerservlet?operation=DELETE_RECORD",
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(data) {
                    if (data.success) {
                        $('#MsgAlertConfirmScreen').modal('toggle');
                        $('#MsgAlert').modal('show');
                    } else {
                        
                    }
                }});
        }else{
        }
    });
    
    $('#No').click(function(){
        if(!clicked){
            $('#MsgAlertConfirmScreen').modal('hide');
        }else{
        }
    });
}


function loadForm(CustomerID){
     
     $('.tab-pane').removeClass('active');
     $('.mytab').removeClass('active'); 
     $('#customerTab').append('<li class = "ViewCustomer"><a href="#customer-view" data-toggle="tab">View</a></li>');
     $('.ViewCustomer').addClass('active');
     $('#add-customer').addClass('active');
     $('#customer-toolbar').css('display','block');
    try{
        
        if(CustomerID){
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'customerlist?jsonformat=jsonp&exactOnly=true&customer=' + CustomerID
            });
            
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'depositlist?jsonformat=jsonp&bycustomer=' + CustomerID
            });
        }
        
        
    }catch (ex) {
        alert(ex);
    }
}
function PrintForm(){
    var custid = $('#global-batnbr').val();
    showReportForm(custid,'FormName','customer');
}

function depositcallback(response){
    if (response.success){
        if(response.usage == "getDepositsbyCustomer"){
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                $('#dwhistory').append('<tr id="rows2' + (i) + '" style = "cursor:pointer" title= "">'
                        + '<td title = "City">' + formatValue(arr[i].TranDate, true) + '</td>'
                        + '<td title = "TelNo" style = "text-align:right">PHP ' + AddComas(arr[i].Amount, true) + '</td>'
                        + '</tr>'
                        );
            }
            
        }
    }
}

