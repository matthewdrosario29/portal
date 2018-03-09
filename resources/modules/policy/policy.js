/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var baseUrl = "http://localhost:8080/portal/";
var COCNo;
var PolicyNo;
var ORNo;
var proceedtosave = false;
var userid;
function policyOnload() {

    var userID = getCookie('UserID');
    var branch = getCookie('Branch');
    
    getDate();
    
    $('#BranchID-info').val(branch);
    
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
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=policy'
    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'policylist?jsonformat=jsonp&dolimit=true'
    });

    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'udftablelist?TableName=VehicleType',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#VehicleType').append('<option value = "" disabled selected>-Select Vehicle Type-</option>');
                for (var i = 0; i < arr.length; i++) {

                    $("#VehicleTypeOption-info").append($("<option></option>", {
                        value: arr[i].ShortDesc,
                        text: arr[i].LongDesc
                    }));
                    $("#VehicleType").append($("<option></option>", {
                        value: arr[i].ShortDesc,
                        text: arr[i].LongDesc
                    }));
                }

            }

        }
    });

    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'insurancecompanylist?fordropdown=true',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#InsuranceCompany').append('<option value = "" disabled selected>-Select Insurance Company-</option>');
                for (var i = 0; i < arr.length; i++) {
                    $("#InsuranceCompany").append($("<option></option>", {
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

    $('#PlateNo2').keyup(function(event) {
        if (event.keyCode === 13) {
            loadInfo();
        }
    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=policy'
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

    $('input.number').blur(function(event) {

        $(this).val(function(index, value) {
            value = value.replace(/,/g, '');
            var parts = value.toString().split(".");
            if (parts.length == 1) {
                return numberWithCommas(value) + ".00";
            } else {
                return numberWithCommas(parseFloat(value).toFixed(2));
            }


        });
    });
    
    

    setInterval(function() {
        $('#drag-div').css('display', 'none');
    }, 2000);

    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchPolicy();
        }
    });

    $("#includePrompts").load("../../lookup/lookup.html");
}

function pmodulescallback(response) {

    if (response.success) {
        if (response.usage == 'getUserrightsModules') {
            var arr = response.data;
            var basicinfo = "policy-basicinfo";
            $('#policy-tab').append('<li class="mytab active" style ="border-top:none">'
                    + '<a href="#policy-basicinfo" onclick = "RemoveTab(\'' + basicinfo + '\')" data-toggle="tab"><span class ="glyphicon glyphicon-user"></span> General Information </a>'
                    + '</li>'
                    );
            for (var i = 0; i < arr.length; i++) {
                $('#policy-tab').append('<li class="mytab ' + arr[i].SubModule + '" style ="border-top:none">'
                        + '<a href="#' + arr[i].SubModule + '" data-toggle="tab"  onclick ="RemoveTab(\'' + arr[i].SubModule + '\');"><span class ="glyphicon glyphicon-user"></span> ' + arr[i].Form + ' </a>'
                        + '</li>');

//               if(arr.length > 1){
//                   if(i == 0){
//                        $('.mytab').addClass('active');
//                   }
//               }else{
//                   if(i == 0){
//                        $('.mytab').addClass('active');
//                   }
//               }
            }

        }
    }
}

//function idsetupcallback(response){
//    if(response.success){
//        if (response.usage == 'getNextID') {
//            var arr = response.data[0];
//            $('#PolicyNo').val(arr.NextGenID);
//            $('#PolicyNo-label').html(" " + arr.NextGenID);
//            $('#COCNo-label').html(" " + arr.NextGenID);
//            
//            $('#COCNumber').val(arr.NextGenID);
//            COCNo = arr.NextGenID;
//            policyNo = arr.NextGenID;
//            ORNo = arr.NextGenID;
//            
//        }
//    }
//}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function saveInfoRecord() {

    if ($('input[name="Name"]').val().trim() == '') {
//        $('#PromptRecorsFound').modal('show');
//        $('#modal-content').css('border-color','red');
//        $('#message-result').empty();
//        $('#message-result').html('Labels with (*) are required');
        $('#message-info').css('display','block');
        $('#message-info').html('<span> Field with (*) are required field! </span>');       

    }
    else {
        var data = objectifyForm($('#policy-form-basicinfo').serializeArray());
        console.log(data);
        $.ajax({
            type: 'POST',
            url: baseUrl + "policyservlet?operation=UPDATE_RECORD",
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
                    $('#message').css('display', 'none');
                    $('input').val('');
                    $('textarea').val('');
                    $('select').val('');
                    $('#MsgAlert').modal('show');
                } else {
                    $('#message').css('display', 'block');
                    $('#message').html(data.message);
                }
            }});
    }

}



function deleteRecord() {

    $('#MsgAlertConfirmScreen').modal('show');
    var clicked = false;
    $('#Yes').click(function() {
        if (!clicked) {
            var data = objectifyForm($('#policy-form').serializeArray());
            data.SeqID = $('#SeqID').val();
            $.ajax({
                type: 'POST',
                url: baseUrl + "policyservlet?operation=DELETE_RECORD",
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(data) {
                    if (data.success) {
                        $('input').val('');
                        $('textarea').val('');
                        $('#MsgAlertConfirmScreen').modal('toggle');
                        $('#MsgAlert').modal('show');
                    } else {
                        $('#message').css('display', 'block');
                        $('#message').html(data.message);
                    }
                }});
        } else {
        }
    });

    $('#No').click(function() {
        if (!clicked) {
            $('#MsgAlertConfirmScreen').modal('hide');
        } else {
        }
    });

}



//function closeModal(){
////    idsetupcallback();
//        $('#DeleteRecord').css('display', 'none');
//        $('#PolicyGroup-view').css('display','none');
//        $('input').val('');
//        $('textarea').val('');
//        $('#PartyLiabilityAmount').val(0);
//        $('#PartyLiabilityPremium').val(0);
//        $('#PassengerLiabilityPerPerson').val(0);
//        $('#PassengerLiabilityPerAccident').val(0);
//        $('#PassengerLiabilityPremium').val(0);
//        var vehicleType = $('#VehicleTypeOption').val();
//        $('#VehicleType').val(vehicleType);
//        $('#policy').css('display','block');
//}

function computeTotal() {
    var totalAmount = 0;
    var totalPremium = 0;
    var totalTax = 0;

    var PartyLiabilityAmount = 0;
    var PartyLiabilityPremium = 0;
    var PassengerLiabilityPerPerson = 0;
    var PassengerLiabilityPerAccident = 0;
    var PassengerLiabilityPremium = 0;
    var wtax = 0;
    var docstamp = 0;
    var VATAmount = 0;
    var TaxAmount = 0;
    var Discount = 0;

    VATAmount = $('#VATAmount').val();
    PartyLiabilityPremium = $('#PartyLiabilityPremium').val();
    PassengerLiabilityPremium = $('#PassengerLiabilityPremium').val();
    wtax = $('#WTax').val();
    Discount = $('#Discount').val();
    docstamp = $('#DocStamp').val();
    TaxAmount = $('#TaxAmount').val();


    totalTax = (parseFloat(wtax.replace(',', '')) + parseFloat(Discount.replace(',', '')));

    totalPremium = (parseFloat(PartyLiabilityPremium.replace(',', '')) + parseFloat(PassengerLiabilityPremium.replace(',', '')));

    totalAmount = (totalPremium + parseFloat(docstamp.replace(',', '')) + parseFloat(VATAmount.replace(',', '')) + parseFloat(TaxAmount.replace(',', '')));


    var GrandTotal = totalAmount - totalTax;
    console.log(GrandTotal);
    $('#PremiumAmtTotal').val(AddComas(totalPremium, true));
    $('#TotalAmount').val(AddComas(GrandTotal, true));
    $('#TotalAmount-display').val(AddComas(GrandTotal, true));

}

function RemoveTab(submodule) {
    $('input').removeAttr('disabled', 'disabled');
    $('textarea').removeAttr('disabled', 'disabled');
    $('#SaveRecord').css('display', 'block');
    $('#EditRecord').css('display', 'none');
    $('.ViewPolicy').remove();
    switch (submodule) {
        case 'policy-basicinfo':
            $('input').val('');
            $('textarea').val('');
            $('select').val('');
            $('input').removeAttr('disabled', 'disabled');
            $('textarea').removeAttr('disabled', 'disabled');
            $('select').removeAttr('disabled', 'disabled');
            $('#PartyLiabilityAmount').val(0);
            $('#PartyLiabilityPremium').val(0);
            $('#PassengerLiabilityPerPerson').val(0);
            $('#PassengerLiabilityPerAccident').val(0);
            $('#PassengerLiabilityPremium').val(0);
            $('#Discount').val(0);
            $('#WTax').val(0);
            $('#DocStamp').val(0);
            $('#TaxAmount').val(0);
            $('#VATAmount').val(0);
            $('#policyform').css('display', 'none');
            $('#policy-basicinfo').css('display', 'block');
            break;

        case 'policyform':
            $('#message-form').css('display','none');
            $('input').val('');
            $('textarea').val('');
            $('select').val('');
            $('input').removeAttr('disabled', 'disabled');
            $('textarea').removeAttr('disabled', 'disabled');
            $('select').removeAttr('disabled', 'disabled');
            $('#PartyLiabilityAmount').val(0);
            $('#PartyLiabilityPremium').val(0);
            $('#PassengerLiabilityPerPerson').val(0);
            $('#PassengerLiabilityPerAccident').val(0);
            $('#PassengerLiabilityPremium').val(0);
            $('#Discount').val(0);
            $('#WTax').val(0);
            $('#DocStamp').val(0);
            $('#TaxAmount').val(0);
            $('#VATAmount').val(0);
            $('#policyform').css('display', 'block');
            $('#policy-basicinfo').css('display', 'none');
            $('#cancelRecord').css('display', 'none');
            $('#deleteRecord').css('display', 'none');
            $('#editRecord').css('display', 'none');
            $('#saveRecord').css('display', 'block');
            var branch = getCookie('Branch');
            $('#BranchID').val(branch);
            break;
        case 'policylist':
            $('#table-policy').find('tbody').empty();
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'policylist?jsonformat=jsonp&dolimit=true'
            });
            $('#policyform').css('display', 'none');
            $('#policy-basicinfo').css('display', 'none');
            break;
        case 'dailyremittance':
            $('#policyform').css('display', 'none');
            $('#policy-basicinfo').css('display', 'none');
            $('#policylist').css('display', 'none');
            var userID = getCookie('UserID');
            $('#table-policy-cashremittance').find('tbody').empty();
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'policylist?jsonformat=jsonp&cashremittance=true&AgentID='+userID
            });
        

    }
}

function policycallback(response) {
    if (response.success) {
        if (response.usage == 'getAllPolicy') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                var j = i + 1;
                $('#table-policy').append('<tr id="rows1' + (i) + '" style = "cursor:pointer" title= "">'
                        + '<td style = "width:2%">' + j + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].Name, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].PolicyNo, true) + '</td>'
                        + '<td style = "" title = "">' + convertDate(arr[i].PolicyDate, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].ORNo, true) + '</td>'
                        + '<td style = "" title = "">' + convertDate(arr[i].DateFrom, true) + '</td>'
                        + '<td style = "" title = "">' + convertDate(arr[i].DateTo, true) + '</td>'
                        + '<td style = "" title = "">' + formatValue(arr[i].VehicleTypeDesc , true) + '</td>'
                        + '<td style = "width:3%"><a href= "#" onclick = "PrintForm(\''+ arr[i].PolicyNo +'\');">&nbsp;<span class = "fa fa-print" style = "color:#8bc411"></span></a></td>'
                        + '</tr>'
                        );
                $('#rows1' + i).attr('PolicyNo', arr[i].PolicyNo);
                $('#rows1' + i).dblclick(function(a) {
                    var PolicyNo = $(this).attr('PolicyNo');
                    if (PolicyNo) {
                        loadForm(PolicyNo);
                    }
                });
            }
        } else if (response.usage == 'getExactPolicy') {
            var arr = response.data[0];
            $('#VehicleType').val(arr.VehicleType);
            $('#InsuranceCompany').val(arr.InsuranceCompany);
            $('#Name').val(arr.Name);
            $('#Address').val(arr.Address);
            $('#BusinessType').val(arr.BusinessType);
            $('#PolicyNo').val(arr.PolicyNo);
            $('#PolicyDate').val(arr.PolicyDate);
            $('#COCNumber').val(arr.COCNumber);
            $('#ORNo').val(arr.ORNo);
            $('#DateFrom').val(arr.DateFrom);
            $('#DateTo').val(arr.DateTo);
            $('#Make').val(arr.Make);
            $('#Model').val(arr.Model);
            $('#BodyType').val(arr.BodyType);
            $('#Color').val(arr.Color);
            $('#MVFileNo').val(arr.MVFileNo);

            $('#PlateNo2').val(arr.PlateNo);
            $('#ChassisNo').val(arr.ChassisNo);
            $('#MotorNo').val(arr.MotorNo);
            $('#Capacity').val(arr.Capacity);
            $('#Weight').val(arr.Weight);
            $('#PartyLiabilityAmount').val(AddComas(arr.PartyLiabilityAmount, true));
            $('#PartyLiabilityPremium').val(AddComas(arr.PartyLiabilityPremium, true));
            $('#PassengerLiabilityPerPerson').val(AddComas(arr.PassengerLiabilityPerPerson, true));
            $('#PassengerLiabilityPerAccident').val(AddComas(arr.PassengerLiabilityPerAccident, true));
            $('#PassengerLiabilityPremium').val(AddComas(arr.PassengerLiabilityPremium, true));
            $('#VATAmount').val(AddComas(arr.VATAmount, true));
            $('#TaxAmount').val(AddComas(arr.TaxAmount, true));
            $('#TotalAmount').val(AddComas(arr.TotalAmount, true));
            $('#DocStamp').val(AddComas(arr.DocStamp, true));
            $('#SeqID').val(arr.SeqID);
            $('#CompanyID').val(arr.CompanyID);
            $('#UserStamp').val(arr.UserStamp);
            $('#TimeStamp').val(arr.TimeStamp);
            $('#InsuranceCompany').val(arr.InsuranceCompany);
            $('#EmailAddress').val(arr.Email);
            $('#ContactNo').val(arr.ContactNo);
            $('#Status').val(arr.Status);
            $('#BranchID').val(arr.BranchID);
            $('#AgentID').val(arr.AgentID);
            var PartyLiabilityPremium = 0;
            var PassengerLiabilityPremium = 0;

            PartyLiabilityPremium = $('#PartyLiabilityPremium').val();
            PassengerLiabilityPremium = $('#PassengerLiabilityPremium').val();
            var totalPremium = (parseFloat(PartyLiabilityPremium.replace(',', '')) + parseFloat(PassengerLiabilityPremium.replace(',', '')));
            $('#PremiumAmtTotal').val(AddComas(totalPremium, true));
        } else if (response.usage == 'getExactPolicyByInfo') {

            var arr = response.data[0];
            if (arr == null) {
//                $('#PromptRecorsFound').modal('show');
                $('#message-result').empty();
                $('#message-result').html('No Record Found!');
                $('input').val('');
                $('textarea').val('');
            } else {
//                $('#PromptRecorsFound').modal('show');
                $('#message-result').empty();
                $('#message-result').html('Record Found!');
                $('#VehicleType').val(arr.VehicleType);
                $('#Name').val(arr.Name);
                $('#Address').val(arr.Address);
                $('#BusinessType').val(arr.BusinessType);
                $('#PolicyNo').val(arr.PolicyNo);
                $('#PolicyDate').val(arr.PolicyDate);
                $('#COCNumber').val(arr.COCNumber);
                $('#ORNo').val(arr.ORNo);
                $('#DateFrom').val(arr.DateFrom);
                $('#DateTo').val(arr.DateTo);
                $('#Make').val(arr.Make);
                $('#Model').val(arr.Model);
                $('#BodyType').val(arr.BodyType);
                $('#Color').val(arr.Color);
                $('#MVFileNo').val(arr.MVFileNo);
                $('#PlateNo2').val(arr.PlateNo);
                $('#ChassisNo').val(arr.ChassisNo);
                $('#MotorNo').val(arr.MotorNo);
                $('#Capacity').val(arr.Capacity);
                $('#Weight').val(arr.Weight);
                $('#PartyLiabilityAmount').val(AddComas(arr.PartyLiabilityAmount, true));
                $('#PartyLiabilityPremium').val(AddComas(arr.PartyLiabilityPremium, true));
                $('#PassengerLiabilityPerPerson').val(AddComas(arr.PassengerLiabilityPerPerson, true));
                $('#PassengerLiabilityPerAccident').val(AddComas(arr.PassengerLiabilityPerAccident, true));
                $('#PassengerLiabilityPremium').val(AddComas(arr.PassengerLiabilityPremium, true));
                $('#VATAmount').val(AddComas(arr.VATAmount, true));
                $('#TaxAmount').val(AddComas(arr.TaxAmount, true));
                $('#DocStamp').val(AddComas(arr.DocStamp, true));
                $('#TotalAmount').val(AddComas(arr.TotalAmount, true));
                $('#SeqID').val(arr.SeqID);
                $('#CompanyID').val(arr.CompanyID);
                $('#UserStamp').val(arr.UserStamp);
                $('#TimeStamp').val(arr.TimeStamp);
                $('#InsuranceCompany').val(arr.InsuranceCompany);
                $('#EmailAddress').val(arr.Email);
                $('#ContactNo').val(arr.ContactNo);
                $('#Status').val(arr.Status);
                $('#BranchID').val(arr.BranchID);

                var PartyLiabilityPremium = 0;
                var PassengerLiabilityPremium = 0;

                PartyLiabilityPremium = $('#PartyLiabilityPremium').val();
                PassengerLiabilityPremium = $('#PassengerLiabilityPremium').val();
                var totalPremium = (parseFloat(PartyLiabilityPremium.replace(',', '')) + parseFloat(PassengerLiabilityPremium.replace(',', '')));
                $('#PremiumAmtTotal').val(AddComas(totalPremium, true));
            }
        }
        else if (response.usage == 'getPolicyRange') {
            var arr = response.data[0];
            if (arr == null){
                $('#PromptRecorsFound').modal('show');
                $('#message-result').empty();
                $('#message-result').html('Policy Number Out of Range!');
                proceedtosave = false;
            }else{
                
            }
        }else if (response.usage == 'getRemittance'){
            var arr = response.data[0];
            console.log(arr);
            var arr = response.data;
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                $('#table-policy-cashremittance').append('<tr id="rows2' + (i) + '" style = "cursor:pointer" title= "">'
                            +'<td><input type ="text" class ="form-control text-grid input-sm " id ="' + (i) + '" name ="ORNo" value = "'+arr[i].ORNo+'" readonly></td>'
                            +'<td><input type ="text" class ="form-control text-grid input-sm " id ="' + (i) + '" name ="Name" value = "'+arr[i].Name+'" readonly></td>'
                            +'<td><input type ="text" class ="form-control text-grid input-sm " id ="' + (i) + '" name ="PolicyNo" value = "'+arr[i].PolicyNo+'" readonly></td>'
                            +'<td><input type ="text" class ="form-control text-grid input-sm " id ="' + (i) + '" name ="TotalAmount" value = "'+arr[i].TotalAmount+'" readonly></td>'
                            +'<td><input type ="text" class ="form-control text-grid input-sm " id ="' + (i) + '" name ="" value = "" readonly></td>'
                            +'<td><input type ="text" class ="form-control text-grid input-sm " id ="' + (i) + '" name ="" value = "" readonly></td>'
                            +'<td><input type ="hidden" class ="form-control text-grid input-sm " id ="' + (i) + '" name ="SeqID_details" value = "'+arr[i].SeqID+'" readonly></td>'
                       );
//                $('#rows2' + i).attr('PolicyNo', arr[i].PolicyNo);
//                $('#rows2' + i).dblclick(function(a) {
//                    var PolicyNo = $(this).attr('PolicyNo');
//                    if (PolicyNo) {
//                        editGrid();
//                    }
//                });
//                $('.text-grid').blur(function(){
////                    alert('test');
//                    disabledGrid();
//                });
                
            }
            
        }
    }
}

function editGrid(){
    $('input').removeAttr('readonly');
    $('#editGrid').css('display','none');
    $('#saveGrid').css('display','block');
}
function editRecord() {

    $('#deleteRecord').css('display', 'none');
    $('#saveRecord').css('display', 'block');
    $('#editRecord').css('display', 'none');
    $('input').removeAttr('disabled', 'disabled');
    $('textarea').removeAttr('disabled', 'disabled');
    $('select').removeAttr('disabled', 'disabled');
}
function loadForm(policyNo) {
    $('#deleteRecord').css('display', 'block');
    $('#PolicyGroup-view').css('display', 'block');
    $('#saveRecord').css('display', 'none');
    $('#cancelRecord').css('display', 'none');
    $('#editRecord').css('display', 'block');
    $('input').attr('disabled', 'disabled');
    $('textarea').attr('disabled', 'disabled');
    $('select').attr('disabled', 'disabled');
    $('#PolicyGroup').css('display', 'none');
    $('.tab-pane').removeClass('active');
    $('.mytab').removeClass('active');
//$('#policy-tab').append('<li class = "ViewPolicy" style = "border-top:none"><a href="#policy-view" data-toggle="tab">View</a></li>');
    $('#policy').addClass('active');
    $('.policyform').addClass('active');
    $('#policyform').css('display', 'block');
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'policylist?jsonformat=jsonp&exactOnly=true&policy=' + policyNo
    });
}


function PrintForm(PolicyNo) {
    showReportForm(PolicyNo, 'FormName', 'sales');
}


function printformOnwindow(RefID) {
    window.open(baseUrl + 'jasperreport?jsonformat=jsonp&parameter={"events":{"replace":true,"remove":true,"clear":true,"add":true},"hasListeners":{},"map":{},"length":2}&otherparameter={}&batnbr=' + RefID + '&memberid=' + RefID + '&formname=sales&reportid=10005&exporttype=pdf&custom=false');
}



function SearchPolicy() {
    $('#table-policy-info').empty();
    var field = $('#filter').val();
    var value = $('#Search').val();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'policylist?jsonformat=jsonp&dolimit=true&policy=' + value
    });

}

function loadInfo() {
    var plateNo = $('#PlateNo2').val();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'policylist?jsonformat=jsonp&loadInfo=true&PlateNo=' + plateNo
    });

}

function saveRecord() {
    if ($('#Name').val().trim() == '') {
        $('#message-form').css('display', 'block');
        $('#message-form').html('<span> Field with (*) are required field! </span>');
    }
    else {
        var data = objectifyForm($('#policy-form').serializeArray());
        console.log(data);

        var VATAmount = $("#VATAmount").val();
        var TaxAmount = $("#TaxAmount").val();
        var TotalAmount = $("#TotalAmount").val();
        var WTax = $("#WTax").val();
        var Discount = $("#Discount").val();
        var DocStamp = $("#DocStamp").val();
        data.VATAmount = VATAmount;
        data.TaxAmount = TaxAmount;
        data.TotalAmount = TotalAmount;
        data.WTax = WTax;
        data.Discount = Discount;
        data.DocStamp = DocStamp;
        $.ajax({
            type: 'POST',
            url: baseUrl + "policyservlet?operation=UPDATE_RECORD",
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
                    $('#message-form').css('display','none');
                    $('#MsgAlertnotreload').modal('show');
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
}

function opemAmountDetails() {
    var displayamnt = $('#TotalAmount').val();
    $('#AmountDetails').modal('show');
    $('#TotalAmount-display').val(displayamnt);
}

function cancel() {
    window.top.location.reload();
}

function copytotal() {
    var totalamountdisplay = $('#TotalAmount-display').val();
    $('#TotalAmount').val(AddComas(totalamountdisplay, true));
}

function getInsuranceRates() {
    $('#PartyLiabilityAmount').val('');
    $('#PartyLiabilityPremium').val('');
    $('#PassengerLiabilityPerPerson').val('');
    $('#PassengerLiabilityPremium').val('');
    $('#PassengerLiabilityPerAccident').val('');
    var VehicleType = $('#VehicleType').val();
    var ICompany = $('#InsuranceCompany').val();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'insurancerateslist?jsonformat=jsonp&getVehicle=' + VehicleType + '&getICompany=' + ICompany
    });

}


function insuranceratescallback(response) {
    if (response.success) {
        if (response.usage == 'getInsuranceRates') {
            var arr = response.data[0];
            $('#PartyLiabilityAmount').val(AddComas(arr.TPLLiability, true));
            $('#PartyLiabilityPremium').val(AddComas(arr.TPLPremium, true));
            $('#PassengerLiabilityPerPerson').val(AddComas(arr.PassengerLiability, true));
            $('#PassengerLiabilityPremium').val(AddComas(arr.AccidentLiability, true));
            $('#PassengerLiabilityPerAccident').val(AddComas(arr.PassAccidentPremium, true));
            computeTotal();
        }
    }
}

function setCookie(name, value){
    var data = [encodeURIComponent(name) + '=' + encodeURIComponent(value)];
    document.cookie = data.join('; ');
}

function getCookie(name, keepDuplicates){
    var values = [];
    var cookies = document.cookie.split(/; */);
    for (var i = 0; i < cookies.length; i ++){
      var details = cookies[i].split('=');
      if (details[0] == encodeURIComponent(name)){
        values.push(decodeURIComponent(details[1].replace(/\+/g, '%20')));
      }
    }
    return (keepDuplicates ? values : values[0]);
 }

//function userscallback(response){
//    if(response.success){
//       if (response.usage == 'getExactUsers'){
//            var arr = response.data[0];
//            console.log(arr);
//            var usertype = arr.Usertype;
//            if(usertype == 'Agent'){
//                console.log(arr.UserID);
//                console.log(arr.FullName);
////                $('#AgentID').val(arr.UserID);
//                
////                $("#AgentID").append("<option value = '"+arr.UserID+"' selected>"+arr.FullName+"</option>");
//            }else{
//                
//            }
//        }
//    }
//}
//function checkPolicyRange(){
//    
//    var PolicyNo = $('#PolicyNo').val();
//    var AgentID = $('#AgentID').val();
//    var SeqID = $('#SeqID').val();
//    jQuery.ajax({
//        type: 'POST',
//        jsonpCallback: "callback",
//        crossDomain: true,
//        dataType: 'jsonp',
//        url: baseUrl + 'policylist?jsonformat=jsonp&checkpolicyrange=true&PolicyNo='+PolicyNo+'&AgentID='+AgentID
//    });
//    
//    
//    
//}
function checkPolicyNo(){
    var PolicyNo = $('#PolicyNo').val();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'policylist?jsonformat=jsonp&exactOnly=true&policy=' + PolicyNo
    });
}

function saveGrid(){
    var rowrec = [];
    var data = objectifyForm($('#cashremittance-form').serializeArray());
    $("#table-policy-cashremittance").find('tbody').find("tr").each(
            function() {
                var obj = new Object();
                $(this).find("input").each( 
                        function() {
                            obj[$(this).attr('name')] = $(this).val();
                        }
                );
                rowrec.push(obj);
            }
        );
        data.details = rowrec;
        console.log(data);
        $.ajax({
            type: 'POST',
            url: baseUrl + "policyservlet?operation=UPDATE_GRID_RECORD",
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
                    $('#message').css('display', 'none');
                    $('input').val('');
                    $('textarea').val('');  
                    $('select').val('');
                    $('#MsgAlert').modal('show');
                } else {
                    $('#message').css('display', 'block');
                    $('#message').html(data.message);
                }
            }});
}


function getDate() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
//    $('#TranDate').val(today);
//    $('#RequiredDate').val(today);
    $('#asof').html(" " + convertDate(today, true));
}


function addRecord(){
    $('#policy-list').removeClass('active');
    $('#policy-form').addClass('active');
}
