var baseUrl = "http://localhost:8080/portal/";



var i = 1;
function membersOnLoad() {

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'memberslist?jsonformat=jsonp&type=MEMBERS&dolimit=true&limitindex=0&limitcount=10'
    });

    jQuery.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'demographicslist?jsonformat=jsonp&forcity=true'
    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=members'
    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=MEMBER'
    });


    $('.material-button-toggle').on("click", function() {
        $(this).toggleClass('open');
        $('.option').toggleClass('scale-on');
    });

    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchMember();
        }
    });


    $("#UploadPhoto").change(function() {
        readURL(this);
    });
    $("#UploadPhoto-EDIT").change(function() {
        readURL(this);
    });





//    $('#MemberList').scroll(function() {
//
//        var maxScrollHeight = $('#MemberList tbody').height() + $('#MemberList thead').height();
//        console.log(maxScrollHeight);
//        var scrollFromTop = $('#MemberList').scrollTop() + $('#MemberList').height();
//        console.log(scrollFromTop);
//        var limit = 20;
//        if (scrollFromTop == maxScrollHeight) {
//          jQuery.ajax({
//            type: 'POST',
//                jsonpCallback: "callback",
//                crossDomain: true,
//                dataType: 'jsonp',
//                url: baseUrl + 'memberslist?jsonformat=jsonp&type=MEMBERS&dolimit=true&limitindex=0&limitcount='+limit
//            });
//            limit=+10;
//        }
//      });




    $("#includePrompts").load("../../lookup/lookup.html");





}



function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        console.log(reader);
        reader.onload = function(e) {
            $('#imgUpload').attr('src', e.target.result);
            $('#imgUpload-EDIT').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }

}


function clearFileInput(ctrl) {
    try {
        ctrl.value = null;
    } catch (ex) {
    }
    if (ctrl.value) {
        ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
    }
}

function addRow(IsOnedit) {
    i++;
    if (IsOnedit) {
        $('#delRow').css('display', 'none');
        $('#memberDetails-EDIT').append('<tr style = "padding-bottom:15px">'
                + '<td style="width:5%"><span class = "fa fa-trash-o" onclick = "deleteRow(this)"></span></td>'
                + '<td data-title = "Name"><input type ="text" class ="form-control input-sm" Placeholder="Name" name="Name" ></td>'
                + '<td data-title = "Relationship"><input type ="text" class ="form-control input-sm" Placeholder="Relationship" name="Relationship" ></td>'
                + '<td data-title = "Address"><input type ="text" class ="form-control input-sm" Placeholder="Address" name="MemberBeneficiaryAddress" ></td>'
                + '<td data-title = "ContactNo"><input type ="text" class ="form-control input-sm" Placeholder="ContactNo" name="ContactNo" ></td>'
                + '<td><input type ="hidden" class ="form-control input-sm" Placeholder="SeqID" name="SeqID" ></td></tr>'
                );
    } else {
        $('#AddBeneficiary').append('<tr style = "padding-bottom:15px">'
                + '<td data-title = "Name"><input type ="text" class ="form-control input-sm" Placeholder="Name" name="Name" ></td>'
                + '<td data-title = "Relationship"><input type ="text" class ="form-control input-sm" Placeholder="Relationship" name="Relationship" ></td>'
                + '<td data-title = "Address"><input type ="text" class ="form-control input-sm" Placeholder="Address" name="MemberBeneficiaryAddress" ></td>'
                + '<td data-title = "ContactNo"><input type ="text" class ="form-control input-sm" Placeholder="ContactNo" name="ContactNo" ></td></tr>'
                );
    }

}

function delRow() {

    if (i <= 1) {
    } else {
        $('#memberDetails tr:last').remove();
    }
    i--;
}

function deleteRow(tr) {
    $('#MsgAlertConfirm').modal('show');
    $('#Confirm-Yes').click(function() {
        $(this).data('clicked', true);
        if ($('#Confirm-Yes').data('clicked')) {
            var index = tr;
            confirmYes(index);
            $('#MsgAlertConfirm').modal('hide');
        } else {
        }

    });
}

function confirmYes(index) {
    $(index).closest('tr').remove();
}

function confirmNo() {
    $('#MsgAlertConfirm').modal('toggle');
}


function base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}

function saveRecord() {


    var base64image = $('#imgUpload').attr('src');
//    console.log(base64image);
//    var base64ImageContent = base64image.replace(/^data:image\/(png|jpg);base64,/, "");
    var base64ImageContent = base64image.split(',');
//    console.log(base64ImageContent);

//    var blob = base64ToBlob(base64ImageContent[1], 'image/png');   

//    var form = $('#MemberShip-form')[0];
//    var formData = new FormData(form);
//    formData.append('img', blob);
//    formData.append('image', $('input[type=file]')[0].files[0]); 

//    console.log(formData);


//    
    if ($('input[name="LastName"]').val().trim() == '') {
        $('#alert-div').css('display', 'block');
        $('#msgbox').removeClass('alert-info');
        $('#msgbox').addClass('alert-danger');
        $('#message').empty();
        $('#message').html('Please Fill up a required field!');
    }
    if ($('input[name="FirstName"]').val().trim() == '') {
        $('#alert-div').css('display', 'block');
        $('#msgbox').removeClass('alert-info');
        $('#msgbox').addClass('alert-danger');
        $('#message').empty();
        $('#message').html('Please Fill up a required field!');
    }
    if ($('input[name="MiddleName"]').val().trim() == '') {
        $('#alert-div').css('display', 'block');
        $('#msgbox').removeClass('alert-info');
        $('#msgbox').addClass('alert-danger');
        $('#message').empty();
        $('#message').html('Please Fill up a required field!');
    }
    if ($('input[name="SerialNo"]').val().trim() == '') {
        $('#alert-div').css('display', 'block');
        $('#msgbox').removeClass('alert-info');
        $('#msgbox').addClass('alert-danger');
        $('#message').empty();
        $('#message').html('Please Fill up a required field!');
    }
    if ($('input[name="Age"]').val().trim() == '') {
        $('#alert-div').css('display', 'block');
        $('#msgbox').removeClass('alert-info');
        $('#msgbox').addClass('alert-danger');
        $('#message').empty();
        $('#message').html('Please Fill up a required field!');
    }
    if ($('input[name="Email"]').val().trim() == '') {
        $('#alert-div').css('display', 'block');
        $('#msgbox').removeClass('alert-info');
        $('#msgbox').addClass('alert-danger');
        $('#message').empty();
        $('#message').html('Please Fill up a required field!');
    }
    if ($('input[name="Employer"]').val().trim() == '') {
        $('#alert-div').css('display', 'block');
        $('#msgbox').removeClass('alert-info');
        $('#msgbox').addClass('alert-danger');
        $('#message').empty();
        $('#message').html('Please Fill up a required field!');
    }
    if ($('input[name="Position"]').val().trim() == '') {
        $('#alert-div').css('display', 'block');
        $('#msgbox').removeClass('alert-info');
        $('#msgbox').addClass('alert-danger');
        $('#message').empty();
        $('#message').html('Please Fill up a required field!');
    }
    if ($('input[name="MonthlyIncome"]').val().trim() == '') {
        $('#alert-div').css('display', 'block');
        $('#msgbox').removeClass('alert-info');
        $('#msgbox').addClass('alert-danger');
        $('#message').empty();
        $('#message').html('Please Fill up a required field!');
    }
//    if($('#imgUpload img[src==""]')){
//      if($('input[name="MonthlyIncome"]').val().trim() == ''){
//        $('#alert-div').css('display','block');
//        $('#msgbox').removeClass('alert-info');
//        $('#msgbox').addClass('alert-danger');
//        $('#message').empty();
//        $('#message').html('Please Fill up a required field!');
//    }  
//    }
    else {

        var rowrec = [];
        var data = objectifyForm($('#MemberShip-form').serializeArray());
        console.log(data);
        var Gender = $("input:radio[name=Gender]:checked").val();

        var CivilStatus = $("input:radio[name=CivilStatus]:checked").val();
        var HouseOwnership = $("input:radio[name=HouseOwnership]:checked").val();
        var VehicleOwnership = $("input:radio[name=VehicleOwnership]:checked").val();

//        alert(Gender);
        data.Gender = Gender;
        data.CivilStatus = CivilStatus;
        data.HouseOwnership = HouseOwnership;
        data.VehicleOwnership = VehicleOwnership;
        data.img = base64ImageContent[1];

        $("#memberDetails").find('tbody').find("tr").each(
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
        console.log(rowrec);

        console.log(JSON.stringify(data));

        $.ajax({
            type: 'POST',
            url: baseUrl + "membersservlet?operation=UPDATE_RECORD",
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
//                    $('#alert-div').css('display','block');
//                    $('#message').html('Membership Registration Successfully Submitted! Thank you');
//                    $('#msgbox').removeClass('alert-danger');
//                    $('#msgbox').addClass('alert-success');
                    $('input').val('');
                    $('textarea').val('');
                    $('select').val('');
                    $('#alert-div').css('display', 'none');
                    $('#MsgAlert').modal('show');
                } else {
                    $('#alert-div').css('display', 'block');
                    $('#message').html(data.message);
                }
            }});
    }
}
function editRecord() {


    var base64image = $('#imgUpload-EDIT').attr('src');
    console.log(base64image);
//    var base64ImageContent = base64image.replace(/^data:image\/(png|jpg);base64,/, "");
    var base64ImageContent = base64image.split(',');
//    console.log(base64ImageContent);

//    var blob = base64ToBlob(base64ImageContent[1], 'image/png');   

//    var form = $('#MemberShip-form')[0];
//    var formData = new FormData(form);
//    formData.append('img', blob);
//    formData.append('image', $('input[type=file]')[0].files[0]); 

//    console.log(formData);

    var rowrec = [];
    var data = objectifyForm($('#MemberShip-form-edit').serializeArray());
    console.log(data);
    var Gender = $("input:radio[name=Gender]:checked").val();
    var CivilStatus = $("input:radio[name=CivilStatus]:checked").val();
    var HouseOwnership = $("input:radio[name=HouseOwnership]:checked").val();
    var VehicleOwnership = $("input:radio[name=VehicleOwnership]:checked").val();

    $("input:radio[name=Gender]:checked").click(function() {
//        alert($("input:radio[name=Gender]:checked").val());
        var tmpgender = $("input:radio[name=Gender]:checked").val();
//        alert(tmpgender);
    });

    data.Gender = Gender;
    data.CivilStatus = CivilStatus;
    data.HouseOwnership = HouseOwnership;
    data.VehicleOwnership = VehicleOwnership;
    data.img = base64ImageContent[1];

    $("#memberDetails-EDIT").find('tbody').find("tr").each(
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
    console.log(rowrec);

    console.log(JSON.stringify(data));

    $.ajax({
        type: 'POST',
        url: baseUrl + "membersservlet?operation=UPDATE_RECORD",
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data) {
            if (data.success) {
                $('#alert-div-EDIT').css('display', 'hide');
                $('#MsgAlert').modal('show');
            } else {
                $('#alert-div-EDIT').css('display', 'block');
                $('#message-EDIT').html(data.message);
            }
        }});
}


function deleteRecord() {
    $('#MsgAlertConfirmScreen').modal('show');
    var clicked = false;
    $('#Yes').click(function() {
        if (!clicked) {
            var data = objectifyForm($('#MemberShip-form-edit').serializeArray());
            $.ajax({
                type: 'POST',
                url: baseUrl + "membersservlet?operation=DELETE_RECORD",
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(data) {
                    if (data.success) {
                        $('#MsgAlertConfirmScreen').modal('toggle');
                        $('#MsgAlert').modal('show');
                    } else {
                        $('#alert-div-EDIT').css('display', 'block');
                        $('#message-EDIT').html(data.message);
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




function idsetupcallback(response) {
    if (response.success) {

        if (response.usage == 'getNextMemberID') {
            var arr = response.data[0];
            $('#MemberID').val(arr.NextGenID);
        }
    }
}



/*eto akin*/


function showMemberDetails(memberid) {
    $("#memberBeneficiary").find('tbody').empty();
    $("#memberBeneficiary").modal("show");
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'memberslist?jsonformat=jsonp&type=MEMBERBENEFICIARY&exactOnly=true&memberbeneficiary=' + memberid
    });
}

function memberscallback(response) {

    if (response.success) {

        if (response.usage == 'getAllMembers') {

            var arr = response.data;
//            console.log(arr);
            for (var i = 0; i < arr.length; i++) {

                var j = i + 1;

                $('#MemberList').append('<tr id="rows1' + (i) + '" style = "cursor:pointer" title= "Double Click to view record">'
                        + '<td style = "width:3%"><a href= "#" onclick = "loadForm(\'' + arr[i].MemberID + '\');">&nbsp;<span class = "fa fa-eye" style = "color:#8bc411"></span></a></td>'
                        + '<td style = "width:2%">' + j + '</td>'
                        + '<td style = "width:20%" title = "Last Name">' + formatValue(arr[i].LastName, true) + '</td>'
                        + '<td style = "width:20%" title = "First Name">' + formatValue(arr[i].FirstName, true) + '</td>'
                        + '<td style = "width:20%" title = "Middle Name">' + formatValue(arr[i].MiddleName, true) + '</td>'
//                        + '<td title = " ">' + formatValue(arr[i].Address, true) + '</td>'
                        + '<td style = "width:25%" title = "City">' + formatValue(arr[i].City, true) + '</td>'
                        + '<td style = "width:20%" title = "TelNo">' + formatValue(arr[i].TelNo, true) + '</td>'
//                        + '<td title = " ">' + formatValue(arr[i].SeqID, true) + '</td>'
                        + '</tr>'
                        );
                $('#rows1' + i).attr('MemberID', arr[i].MemberID);
                $('#rows1' + i).dblclick(function(a) {
                    var MemberID = $(this).attr('MemberID');
                    if (MemberID) {
                        loadForm(MemberID);
                    }
                });
            }
        }
        else if (response.usage == 'getExactMembers') {
            var arr = response.data[0];

            $('#imgUpload-EDIT').attr('src', '../../../showimage?filename=' + arr.MemberID + '.jpg');
            $('#CompanyID').val(arr.CompanyID);
            $("#MemberIDView").val(arr.MemberID);
            $("#LastName").val(arr.LastName);
            $("#FirstName").val(arr.FirstName);
            $("#MiddleName").val(arr.MiddleName);
            $("#SerialNo").val(arr.SerialNo);
            $("#Address").val(arr.Address);
            $("#CityEdit").val(arr.City);
            $("#ZipCode").val(arr.ZipCode);
            $("#BirthDate").val(arr.BirthDate);
            $("#ReligionEdit").val(arr.Religion);
            $("#TelNo").val(arr.TelNo);
            $("#Age").val(arr.Age);
            $("#EmailMember").val(arr.Email);
            $("#TINNo").val(arr.TINNo);
            $("#SSSNo").val(arr.SSSNo);
            $("#GSISNo").val(arr.GSISNo);
            $("#EmploymentDate").val(arr.EmploymentDate);
            $("#Employer").val(arr.Employer);
            $("#Position").val(arr.Position);
            $("#OtherIncomeSource").val(arr.OtherIncomeSource);
            $("#MonthlyIncome").val(arr.MonthlyIncome);
            $("#BankAcct01").val(arr.BankAcct01);
            $("#BankAcct02").val(arr.BankAcct02);
            $("#BankAcct03").val(arr.BankAcct03);
            $("#BankAcct01Type").val(arr.BankAcct01Type);
            $("#BankAcct02Type").val(arr.BankAcct02Type);
            $("#BankAcct03Type").val(arr.BankAcct03Type);
            $("#LastWillCustodyName").val(arr.LastWillCustodyName);
            $("#LastWillCustodyTelNo").val(arr.LastWillCustodyTelNo);
            if (arr.LastWillCustodyName != null && arr.LastWillCustodyTelNo != null) {
                $('#CheckCustody').attr('checked', 'checked');
            } else {
            }
            $("#SeqID").val(arr.SeqID);

            for (var key in arr) {
                console.log(key);
                var inputType = $("#" + key + "").attr('type');
                $("#" + key + "[value='" + arr[key] + "']").attr('checked', 'checked');
            }
        }
    }


}
function memberbeneficiarycallback(response) {
    if (response.success) {
        if (response.usage == 'getAllMembersDetails') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                $('#tbl-details-members').append('<tr id="rows1' + (i) + '">'
                        + '<td title = " " >' + formatValue(arr[i].Name) + '</td>'
                        + '<td title = " ">' + formatValue(arr[i].Relationship) + '</td>'
                        + '<td title = " " style = "word-wrap: break-word">' + formatValue(arr[i].Address) + '</td>'
                        + '<td title = " ">' + formatValue(arr[i].ContactNo) + '</td>'
                        + '</tr>'
                        );
                $('#memberDetails-EDIT').append('<tr id="rows2' + (i) + '">'
                        + '<td style="width:5%"><span class = "fa fa-trash-o" onclick = "deleteRow(this)"></span></td>'
                        + '<td><input type ="text" class ="form-control input-sm" Placeholder="Name" name="Name" value = "' + formatValue(arr[i].Name, true) + '"></td>'
                        + '<td><input type ="text" class ="form-control input-sm" Placeholder="Relationship" name="Relationship" value = "' + formatValue(arr[i].Relationship, true) + '"></td>'
                        + '<td><input type ="text" class ="form-control input-sm" Placeholder="Address" name="MemberBeneficiaryAddress" value = "' + formatValue(arr[i].Address, true) + '"></td>'
                        + '<td><input type ="text" class ="form-control input-sm" Placeholder="ContactNo" name="ContactNo" value = "' + formatValue(arr[i].ContactNo, true) + '"></td>'
                        + '<td><input type ="hidden" class ="form-control input-sm" Placeholder="ContactNo" name="BeneficiarySeqID" value = "' + formatValue(arr[i].SeqID, true) + '"></td>'
                        + '</tr>'
                        );
            }
        }
    }
    else {
        alert("error at pasdasd");
    }
}
function closeMemberDetails() {
    $('#memberBeneficiary').modal("toggle");
}

function selectNewRecord() {
    $('.ViewMembers').remove();
    $('#Members').removeClass('active');
    $('#addMember').addClass('active');
}
function loadForm(MemberID) {
    $('.tab-pane').removeClass('active');
    $('#members-view').addClass('active');
    $('#AddBeneficiary-edit').empty();

    $('#btn-edit').css('display', 'block');
    $('#btn-print').css('display', 'block');
    $('#btn-delete').css('display', 'block');
    $('#btn-cancel').css('display', 'block');
    $('#btn-add').css('display', 'block');
    $('#btn-save').css('display', 'none');
    $('#AddRow').css('display', 'none');
    try {
        if (MemberID) {
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'memberslist?jsonformat=jsonp&type=MEMBERS&exactOnly=true&members=' + MemberID
            });
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'memberslist?jsonformat=jsonp&type=MEMBERBENEFICIARY&exactOnly=true&memberbeneficiary=' + MemberID
            });
        }

    } catch (ex) {
        alert(ex);
    }
}


function RemoveTab() {
    $('.ViewMembers').remove();

}

function enabledFields() {
    $('input').removeAttr('disabled', 'disabled');
    $('textarea').removeAttr('disabled', 'disabled');
    $('select').removeAttr('disabled', 'disabled');
}

function SearchMember() {
    $('#members-infos').empty();
    var field = $('#filter').val();
    var value = $('#Search').val();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + './memberslist?jsonformat=jsonp&type=MEMBERS&dolimit=true&limitindex=0&limitcount=100&members_field=' + field + '&members=' + value
    });

}

function PrintForm() {

    var memid = $('#MemberIDView').val();
    showReportForm(memid, 'FormName', 'member');
}


function pmodulescallback(response) {

    if (response.success) {
        if (response.usage == 'getUserrightsModules') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                $('#membersTab').append('<li class="mytab">'
                        + '<a href="#' + arr[i].SubModule + '" data-toggle="tab"  onclick ="RemoveTab();"><span class ="glyphicon glyphicon-user"></span> ' + arr[i].Form + ' </a>'
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

function getDate() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    $('#asof').html(" " + convertDate(today, true));
}

function addRecord() {


    $('#description').empty();
    $('#description').replaceWith('<span style ="font-family: calibri;font-weight: bold;font-size: 15pt;line-height: 40px;margin-top: 0px" id ="description"> Create New Member </span>');


    $('#listofmembers').css('display', 'none');
    $('#member-form').css('display', 'block');

    $('#btn-edit').css('display', 'none');
    $('#btn-print').css('display', 'none');
    $('#btn-add').css('display', 'none');
    $('#btn-delete').css('display', 'none');
    $('#btn-cancel').css('display', 'block');
    $('#btn-save').css('display', 'none');
    $('#AddRow').css('display', 'inline');
}

function cancelRecord() {
    $('#member-form').css('display', 'none');
    $('#listofmembers').css('display', 'block');
}



