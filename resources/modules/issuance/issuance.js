/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var baseUrl = "http://localhost:8080/portal/";


function vehicleOnload(){
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=vehicle'
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=issuance'
    });
    
    $('input.number').keyup(function(event) {

    // skip for arrow keys
    if(event.which >= 37 && event.which <= 40){
        event.preventDefault();
    }
    
    $(this).val(function(index, value) {
            value = value.replace(/,/g,'');
            return numberWithCommas(value);
        });

  });
  
  $('input.TIN').keyup(function() {

    var tf = $('#TIN');
    var val = $('#TIN').val().split("-").join("");
    if (val.length > 0 && val.length < 11) {
        val = val.match(new RegExp('.{1,3}', 'g')).join("-");
    }else if(val >= 11){
        val = val.match(new RegExp('.{10,5}', 'g')).join("-");
    }
    tf.val(val);

  });
  
  

    
    $("#includePrompts").load("../../lookup/lookup.html");
    
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function idsetupcallback(response){
    if(response.success){
        if (response.usage == 'getNextID') {
            var arr = response.data[0];
            $('#TranID').val(arr.NextGenID);
            $('#label-tranid').html(" " + arr.NextGenID);
        }
    }
}

function confirmSaveRecord(){
    $('#MsgAlertConfimation').modal('show');
}
function saveRecord(){
    var data = objectifyForm($('#issuance-vehicle').serializeArray());
    console.log(data);
    $.ajax({
        type: 'POST',
        url: baseUrl + "vehicleservlet?operation=UPDATE_RECORD",
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data) {
            if (data.success) {
                    $('#message').css('display','none');
                    $('input').val('');
                    $('textarea').val('');
                    $('select').val('');
                    $('#MsgAlert').modal('show');
                } else {
                    $('#message').css('display','block');
                    $('#message').html(data.message);
                }
            }});
}

function pmodulescallback(response){
    
    if (response.success){
        if (response.usage == 'getUserrightsModules'){
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
               $('#issuance-vehicle-tab').append('<li class="mytab" style ="border-top:none">'
                                        +'<a href="#'+arr[i].SubModule+'" data-toggle="tab"  onclick ="RemoveTab(\'' + arr[i].SubModule + '\');"> '+arr[i].Form+' </a>'
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

function RemoveTab(subModule){
    
    $('input').val('');
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=vehicle'
    });
    
    switch(subModule){
        case 'renewaltrailer':
            $('#Trailer').val('1');
            $('#Status').val('RENEW');
            $('#form-caption').html(" - Renewal");
            $('#PlateNumber-grp').css('display','block');
            $('#MVFileNoGrp').css('display','block');
            $('#EngineNo-grp').css('display','none');
        break;
        case 'trailer':
            $('#Trailer').val('1');
            $('#Status').val('NEW');
            $('#form-caption').html(" - New");
            $('#MVFileNoGrp').css('display','none');
            $('#PlateNumber-grp').css('display','none');
            $('#EngineNo-grp').css('display','none');
        break;
        case 'renewalvehicle':
            $('#Trailer').val('0');
            $('#Status').val('RENEW');
            $('#form-caption').html(" - Renewal");
            $('#MVFileNoGrp').css('display','block');
            $('#EngineNo-grp').css('display','block');
            $('#PlateNumber-grp').css('display','block');
        break;
        case 'vehicle':
            $('#Trailer').val('0');
            $('#Status').val('NEW');
            $('#form-caption').html(" - New");
            $('#MVFileNoGrp').css('display','block');
            $('#EngineNo-grp').css('display','block');
            $('#PlateNumber-grp').css('display','none');
        break;
    }
}

