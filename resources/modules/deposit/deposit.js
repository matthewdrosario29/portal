/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



function depositOnload(){
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=deposit'
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'depositlist?jsonformat=jsonp&dolimit=true&limitindex=0&limitcount=100'
    });
    
    $("#includePrompts").load("../../lookup/lookup.html");
    
    $('.material-button-toggle').on("click", function() {
        $(this).toggleClass('open');
        $('.option').toggleClass('scale-on');
    });
    
    $('#SearchFrom').keyup(function(event){
       if (event.keyCode === 13){
           SearchMember();
       } 
    });
    $('#SearchTo').keyup(function(event){
       if (event.keyCode === 13){
           SearchMember();
       } 
    });
    
     var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        
        if(dd<10){
            dd = '0'+dd;
        }
        if(mm<10){
            mm = '0'+mm;
        }
        today = yyyy + '-' + mm + '-' + dd;
        document.getElementById('dateToday').value = today;
       
}

function pmodulescallback(response){
    
    if (response.success){
        if (response.usage == 'getUserrightsModules'){
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
               $('#depositTab').append('<li class="mytab">'
                                        +'<a href="#'+arr[i].SubModule+'" data-toggle="tab"  onclick ="RemoveTab();"><span class ="fa fa-credit-card"></span> '+arr[i].Form+' </a>'
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

function depositcallback(response){
    if(response.success){
        if(response.usage== 'getAllDeposit'){
            var arr = response.data;
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                
                var j = i+1;
                
                $('#depositList').append('<tr id="rows1' + (i) + '" style = "cursor:pointer" title= "">'
                      + '<td style = "width:3%"><a href= "#" onclick = "loadForm(\''+ arr[i].TranID +'\');">&nbsp;<span class = "fa fa-eye" style = "color:#8bc411"></span></a></td>'
                        + '<td style = "width:2%">'+j+'</td>'
                        + '<td style = "width:20%" title = "Customer Name">' + formatValue(arr[i].CustomerID, true) + '</td>'
                        + '<td style = "width:20%" title = "TranID">' + formatValue(arr[i].TranID, true) + '</td>'
                        + '<td style = "width:20%" title = "TranDate">' + formatValue(arr[i].TranDate, true) + '</td>'
                        + '<td style = "width:20%" title = "AccountOpeningDate">' + formatValue(arr[i].AccountOpeningDate, true) + '</td>'
                        + '<td style = "width:25%" title = "DepositType">' + formatValue(arr[i].DepositType, true) + '</td>'
                        + '<td style = "width:25%" title = "Amount">' + formatValue(arr[i].Amount, true) + '</td>'
                        + '</tr>'
                        );
                $('#rows1' + i).attr('TranID', arr[i].TranID);
                $('#rows1' + i).dblclick(function(a) {
                    var TranID = $(this).attr('TranID');
                    if (TranID) {
                        loadForm(TranID);
                    }
                });
            }
            
        }
        else if (response.usage=='getExactDeposit'){
            var arr = response.data[0];
            $('#global-batnbr').val(arr.TranID);
            $('#SeqID').val(arr.SeqID);
            $('#TranID').val(arr.TranID);
            $('#TranDate').val(arr.TranDate);
            $('#CustomerID').val(arr.CustomerID);
            $('#Amount').val(arr.Amount);
            $('#DepositType').val(arr.DepositType);
            $('#Remarks').val(arr.Remarks);
            
            for(var key in arr){
                console.log(key);
                var inputType = $("#" + key + "").attr('type');
                $("#" + key + "[value='"+arr[key]+"']").attr('checked', 'checked');
            }
        }
    }
}

function loadForm(TranID){
    $('.tab-pane').removeClass('active');
     $('.mytab').removeClass('active'); 
     $('#depositTab').append('<li class = "ViewDeposit"><a href="#deposit-view" data-toggle="tab">View</a></li>');
     $('.ViewDeposit').addClass('active');
     $('#add-deposit').addClass('active');
     
     try{
        
        if(TranID){
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'depositlist?jsonformat=jsonp&exactOnly=true&deposit=' + TranID
            });
//            jQuery.ajax({
//                type: 'POST',
//                jsonpCallback: "callback",
//                crossDomain: true,
//                dataType: 'jsonp',
//                url: baseUrl + 'memberslist?jsonformat=jsonp&type=MEMBERBENEFICIARY&exactOnly=true&memberbeneficiary=' + MemberID
//            });
        }
        
        
    }catch (ex) {
        alert(ex);
    }
}
function RemoveTab(){
    $('.AddDeposit').remove();
    $('.ViewDeposit').remove();
    
}

function DepositAmount(){
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=deposit'
    });
    $('input').val('');
    $('textarea').val('');
    $('select').val('');
    $('.tab-pane').removeClass('active');
    $('#depositTab').append('<li class = "AddDeposit"><a href="#add-deposit" data-toggle="tab"><span class = "fa fa-credit-card"></span> Deposit Amount</a></li>');
    $('.mytab').removeClass('active'); 
    $('.AddDeposit').addClass('active');
    $('#add-deposit').addClass('active');
    
}

function saveRecord(){
    var data = objectifyForm($('#deposit-form').serializeArray());
    var DepositType = $("input:radio[name=DepositType]:checked").val();
    data.DepositType = DepositType;
    
    console.log(data);
    $.ajax({
        type: 'POST',
        url: baseUrl + "depositservlet?operation=UPDATE_RECORD",
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



function idsetupcallback(response){
    if(response.success){
        if (response.usage == 'getNextID') {
            var arr = response.data[0];
            $('#TranID').val(arr.NextGenID);
        }
    }
}

function SearchMember(){
        $('#deposit-infos').empty();
        var valuefrom = $('#SearchFrom').val();
        var valueto = $('#SearchTo').val();
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'depositlist?jsonformat=jsonp&dolimit=true&limitindex=0&limitcount=100&depositFrom='+valuefrom+'&depositTo='+valueto
        });
    
}

function PrintForm(){
    
    var tranid = $('#global-batnbr').val();
    showReportForm(tranid,'FormName','deposit');
}

function showCustomer(){
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'customerlist?jsonformat=jsonp&dolimit=true'
    });
    $('#customer-lookup').modal('show');
}

function customercallback(response){
    if (response.success){
        if(response.usage == 'getAllCustomer'){
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                var j = i+1;
                $('#customer-table-lookup').append('<tr id="rows2' + (i) + '" style = "cursor:pointer" title= "">'
                        + '<td style = "width:2%">'+j+'</td>'
                        + '<td style = "width:25%" title = "City">' + formatValue(arr[i].CustomerID, true) + '</td>'
                        + '<td style = "width:20%" title = "TelNo">' + formatValue(arr[i].CustomerName, true) + '</td>'
                        + '</tr>'
                        );
                $('#rows2' + i).attr('CustomerID', arr[i].CustomerID);
                $('#rows2' + i).dblclick(function(a) {
                    var CustomerID = $(this).attr('CustomerID');
                    if (CustomerID) {
                        $('#customer-lookup').modal('toggle');
                        $('#CustomerID').val(CustomerID);
                    }
                });
            }
        }
    }
}


