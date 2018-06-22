var baseUrl = "http://localhost:8080/portal/";
var curappno;
var isOnedit = false;
function issuesOnload() {
    afterrender();
}

function issuescallback(response) {
    if (response.success) {
        if (response.usage == 'getissues') {
            var arr = response.data;
            var recordArr = [];
            console.log(arr);
            console.log(recordArr);
            for (var i = 0; i < arr.length; i++) {
                $('#table-issues').append('<tr class = "responsive-tr" id="rows1' + (i) + '" rownum = ' + (i) + ' style = "color:#000;cursor:pointer;">'
                        + ' <td width="2%"><input class = "checkbox_list" type = "checkbox" style = "width:15px;height:15px;margin-left:3px !important" value= ' + formatValue(arr[i].SeqID, true) + '></td>'
                        + '<td data-title= "Module:" class = "td-app">' + formatValue(arr[i].Module, true) + '</td>'
                        + '<td data-title= "Date:" class = "td-app">' + formatValue(arr[i].Date, true) + '</td>'
                        + '<td data-title= "AssignedTo:" class = "td-app">' + formatValue(arr[i].AssignedTo, true) + '</td>'
                        + '<td data-title= "Status:" class = "td-app">' + formatValue(arr[i].Status, true) + '</td>'
                        + '<td><a class = "btn-material inverse btn-sm" onclick = "loadForm(\'' + arr[i].SeqID + '\');">&nbsp;<span class = "fa fa-eye"></span></a></td>'

                        + '</tr>'
                        );

                $('#rows1' + i).attr('SeqID', arr[i].SeqID);
                $('#rows1' + i).attr('AppNo', arr[i].AppNo);
                $('#rows1' + i).dblclick(function(a) {
                    var SeqID = $(this).attr('SeqID');
                    var AppNo = $(this).attr('AppNo');
                    if (SeqID) {
                        loadForm(SeqID, AppNo);
                    }
                });
            }
        } else if (response.usage == 'getExactissues') {
            var arr = response.data[0];

            console.log(arr);
            $('#div-canvass').empty();
            
            $('#Module').val(formatValue(arr.Module, true));
            $('#Date').val(formatValue(arr.Date, true));
            $('#Details').val(formatValue(arr.Details, true));
            $('#AssignedTo').val(formatValue(arr.AssignedTo, true));
            $('#Status').val(formatValue(arr.Status, true));
            $('#Remarks').val(formatValue(arr.Remarks, true));
            $('#AttachedFile').val(formatValue(arr.AttachedFile, true));
            
            var files = arr.AttachedFile.split(',');
            console.log(files);
            if(files.length > 1){
                for (var i=0; i < files.length; i++){
                    $('#div-canvass').append('<div class = "col-md-2 '+files[i]+'"><img id="attachFile'+i+'" class = "photo-attach" name = "file_images" src="#" alt="" style ="width:100%;height:150px;cursor: pointer" onclick = "viewImage(this);" ><br><button class ="btn-material inverse form-control" style ="height: auto" onclick ="removeImage(\'' + files[i] + '\')"> REMOVE </button> </div>');
                    $('#attachFile'+i+'').attr('src', '../../../showimage?filename=' + files[i] + '.jpg');
                }
            }
            

            $('#SeqID').val(arr.SeqID);
        }
    }
}


function addRecord() {
    /*Back Module*/

//    isOnedit = true;

    $('.material-btn-print').hide();
    $('.material-btn-delete').hide();
    $('#forAddSection').show();
    
    $('.issues-tab').removeClass('active');
    $('.tab-form').addClass('active');
    $('.tab-submodule').removeClass('active');
    $('#tab_issues_form').addClass('active');
    $('.close-win').show();
    $('.close-win').click(function() {
        if (isOnedit) {
//            disabledInput();
        }

        $('#issues-form').hide();
        $('#issues-list').show();
        $('.close-win').hide();
    });
    $('#tbl-attachedfiles').find('tbody').empty();
    $('input.number').click(function() {
        $(this).select();
    });
    $('#mini-fab').addClass('hidden');
    $('#main').hide();
    $('#save_float').show();
    $('#SameOwner').show();
    $('#SameOwnerlbl').show();
    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('issues');
    $('#ModuleID', window.parent.document).val('issues');
    $('#ModuleName', window.parent.document).val('issues');

    $('#issues-list').css('display', 'none');
    $('#issues-form').css('display', 'block');

    $('#Module-Name').empty();
    $('#Module-Name').html('New issues');


    $('input').removeAttr('disabled', 'disabled');
    $('textarea').removeAttr('disabled', 'disabled');
    $('select').removeAttr('disabled', 'disabled');


    removeRecord();
    $('.appRequirements').empty();
    //button

    $('#btn-edit').css('display', 'none');
    $('#btn-print').css('display', 'none');
    $('#btn-add').css('display', 'none');
    $('#btn-delete').css('display', 'none');
    $('#btn-cancel').css('display', 'block');
    $('#btn-close').css('display', 'none');
    $('#btn-save').css('display', 'block');
    $('#AddRow').css('display', 'inline');


    // store
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=issues'
    });


//  Default values    
    if ($('#ScopeOfWork').val() == null || $('#ScopeOfWork').val() == '') {
        $('#app_requirements_ScopeOfWork').html('*Select Scope of Work..');
    }
    getDate();
    var test = [];
    var cookies = document.cookie;
    cookies = cookies.split("; ");
    var obj1 = new Object();
    for (var i = 0; i < cookies.length; i++) {
        var cookies_tmp = cookies[i].split("=");
        try {
            eval('obj1.' + cookies_tmp[0] + ' = "' + cookies_tmp[1] + '"');
            test.push(obj1);
        } catch (ex) {
        }
    }
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'userslist?jsonformat=jsonp&exactOnly=' + obj1.UserID
    });




    //load store
    store_inspector(obj1.UserID);
    udf_store();

    enabledInput();
    setNumberDefault();
    formatCurrency();

    $('#ScoopWorkOthers').attr('readonly', 'readonly');


}

function scopeofworkcb(cb) {
    var cb_ = $(cb).val();
    console.log(cb_);
}

function idsetupcallback(response) {
    if (response.success) {

        if (response.usage == 'getNextID') {
            var arr = response.data[0];
            $('#AppNo').val(arr.NextGenID);
        }
    }
}

function getDate() {

    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    $('#Date').val(today);


}

function saveRecord() {
    
    
    
        var images = [];
        var data = objectifyForm($('#issues_form').serializeArray());
        
        
        var pictures = $('img[name="file_images"]');
//        console.log(pictures);
        for (var i = 0; i < pictures.length; i++){
            var images_ = pictures[i].src.split(',');
            var name = 'Photo - '+i+1;
            var obj = new Object();
            obj.file_images = images_[1];
            obj.id = name;
            images.push(obj);
        }
        
//        console.log(images);
        data.images = images;
//        console.log(data);
        $.ajax({
            type: 'POST',
            url: baseUrl + "issuesservlet?operation=UPDATE_RECORD",
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
                    $('#MsgAlert').modal('show');
                    back();
                } else {
                    $('#message-info').css('display', 'block');
                    $('#message-text').html(data.message);
                }
            }});


}

function editRecord() {


//    isOnEdit = true;
    $('#btn-edit').css('display', 'none');
    $('#btn-print').css('display', 'none');
    $('#btn-save').css('display', 'block');
    $('#btn-delete').css('display', 'none');
    $('#btn-cancel').css('display', 'block');
    $('#btn-close').css('display', 'none');
    $('#btn-add').css('display', 'none');

    $('input').removeAttr('disabled');
    $('select').removeAttr('disabled');
    $('#AddRow').css('display', 'inline');


    $('#mini-fab').addClass('hidden');
    $('#main').hide();
    $('#save_float').show();

    enabledInput();
    formatCurrency();

    if ($('.number').length) {
        setNumberDefault();
    }
    $('input.number').click(function() {
        $(this).select();
    });




}


function confirmDelete() {

    $('#MsgAlertDelete').modal('show');

    $('input').removeAttr('disabled', 'disabled');
    $('textarea').removeAttr('disabled', 'disabled');
    $('select').removeAttr('disabled', 'disabled');
    $('#Confirm-No').click(function() {
        $('#MsgAlertDelete').modal('hide');
        $('input').attr('disabled', 'disabled');
        $('textarea').attr('disabled', 'disabled');
        $('select').attr('disabled', 'disabled');
    });
    $('#Confirm-Yes').click(function() {
        $('#MsgAlertDelete').modal('hide');
        deleteRecord();
    });
}




function deleteRecord() {
//    alert('test');
    var data = objectifyForm($('#issues_form').serializeArray());
    $.ajax({
        type: 'POST',
        url: baseUrl + "issuesservlet?operation=DELETE_RECORD",
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data) {
            if (data.success) {
                $('#MsgAlert').modal('show');
            } else {
                $('#message-info').css('display', 'block');
                $('#message-text').html(data.message);
            }
        }});
}
function printRecord() {
    var TranID = $('#TranID').val();
    showReportForm(TranID, 'FormName', 'issues');
}
function printAllRecord() {

}

function cancelRecord() {
    $('#MsgAlertCloseForm').modal('show');
    $('#Close-No').click(function() {
        $('#MsgAlertCloseForm').modal('hide');
    });
    $('#Close-Yes').click(function() {
        $('#MsgAlertCloseForm').modal('hide');
        $('#issues-form').css('display', 'none');
        $('#issues-list').css('display', 'block');
        back();
        enabledInput();
        $('#message-info').css('display', 'none');
        $('#message-text').empty();
    });
}
function loadForm(refid, appno) {

//    $('#canvasimg').attr('src',' ');
    
    $('#forAddSection').hide();
    $('.material-btn-print').show();
    $('.material-btn-delete').show();
    isOnedit = false;
    $('.issues-tab').removeClass('active');
    $('.tab-form').addClass('active');
    $('.tab-submodule').removeClass('active');
    $('#tab_issues_form').addClass('active');
    curappno = appno;
    $('#tbl-attachedfiles').find('tbody').empty();
    $('.close-win').show();
    $('.close-win').click(function() {
        $('input').removeAttr('disabled', 'disabled');
        $('textarea').removeAttr('disabled', 'disabled');
        $('select').removeAttr('disabled', 'disabled');
        $('#issues-form').hide();
        $('#issues-list').show();
        $('.close-win').hide();
    });
    $('#main').show();
    $('#save_float').hide();
    $('#SameOwner').hide();
    $('#SameOwnerlbl').hide();
    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('issues');
    $('#ModuleID', window.parent.document).val('issues');
    $('#ModuleName', window.parent.document).val('issues');


    $('input').attr('disabled', 'disabled');
    $('textarea').attr('disabled', 'disabled');
    $('select').attr('disabled', 'disabled');
//    $('#total').attr('disabled', 'disabled');

    $('.float-label').css('top', '-18px');
    $('.float-label').css('font-size', '12px');

    $('#Module-Name').replaceWith('<span style ="font-family: calibri;font-weight: bold;font-size: 15pt;" id ="Module-Name"> Edit transaction </span>');

    /*tab-control*/

    /*tab-control*/

    /*btn-control*/
    $('#btn-edit').css('display', 'block');
    $('#btn-print').css('display', 'block');
    $('#btn-delete').css('display', 'block');
    $('#btn-cancel').css('display', 'none');
    $('#btn-add').css('display', 'block');
    $('#btn-save').css('display', 'none');
    $('#btn-close').css('display', 'block');
    /*btn-control*/



    $('#issues-form').css('display', 'block');
    $('#issues-list').css('display', 'none');
    udf_store();

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'issueslist?jsonformat=jsonp&exactOnly=true&issues=' + refid
    });

//    activeTab(appno);
    formatCurrency();
    editRecord();

}

function closeRecord() {
    enabledInput();
    $('#issues-form').css('display', 'none');
    $('#issues-list').css('display', 'block');
}


function issuesattachfilescallback(response) {
    if (response.success) {
        if (response.usage == 'getExactissuesattachfilesperapp') {
            var arr = response.data;
//            console.log(arr);
            $('#tbl-attachedfiles').find('tbody').empty();
            for (var i = 0; i < arr.length; i++) {

                $('#tbl-attachedfiles').append('<tr class = "responsive-tr" id="rows2_' + (i) + '" style = "color:#000;cursor:pointer;">'

                        + '<td data-title= "File Name:" class = "td-app"><a href = "#" onclick = "viewFile(\'' + arr[i].SeqID + '\')">' + formatValue(arr[i].FileName, true) + '</a></td>'
                        + '<td data-title= "File Title : " class = "td-app">' + formatValue(arr[i].FileTitle, true) + '</td>'
                        + '<td data-title= "File Date : " class = "td-app">' + formatValue(arr[i].FileDate, true) + '</td>'
                        + '<td data-title= "Remarks : " class = "td-app">' + formatValue(arr[i].Remarks, true) + '</td>'
//                        + '<td><img src = "../../../showimage?filename=' + arr[i].FileName + '.jpg" style = "width: 100px;height:50px"></img></td>'

                        + '<td hidden data-title= "" class = "td-app" style = "display:none">' + formatValue(arr[i].SeqID, true) + '</td>'
                        + '</tr>'
                        );
                $('#rows2_' + i).attr('SeqID', arr[i].SeqID);
                $('#rows2_' + i).dblclick(function(a) {
                    var SeqID = $(this).attr('SeqID');
                    if (SeqID) {
                        viewFile(SeqID);
                    }
                });

            }
        } else if (response.usage == 'getExactissuesattachfiles') {
            var arr = response.data[0];
//            $('#attachFile_modal').modal('show');
//            $('#tmp').attr('src', '../../../showimage?filename=' + arr.FileName + '.jpg');
            $('#canvasimg').attr('src', '../../../showimage?filename=' + arr.FileName + '.jpg');


            $('.list-attachfiles').hide();
            $('.form-attachedfiles').show();
            $('#issuesattachfiles_SeqID').val(arr.SeqID);
            $('#issuesattachfiles_AppNo').val(arr.AppNo);
            $('#issuesattachfiles_FileName').val(arr.FileName);
            $('#issuesattachfiles_FileTitle').val(arr.FileTitle);
            $('#issuesattachfiles_FileDate').val(arr.FileDate);
            $('#issuesattachfiles_Remarks').val(arr.Remarks);


            init();
//            drawtocanvass();
        }
    }

}

var attachedseqid;
function viewFile(seqid) {


    attachedseqid = seqid;
    var can2 = $('#can')[0];
    can2.width = can2.width;
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'issuesattachfileslist?jsonformat=jsonp&exactOnly=true&issuesattachfiles_seq=' + seqid
    });





}

function changeEventListener() {

    var itemid = $('#ItemID').val();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemuomlist?jsonformat=jsonp&exactOnly=true&itemid=' + itemid
    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&exactOnly=true&item=' + itemid

    });

}

function itemuomcallback(response) {
    if (response.success) {
        if (response.usage == 'getUOM') {
            var arr = response.data;
            var rownum = response.rownum;
            $('.itemuom-select2').select2({
                width: null,
                prefwidth: 'auto',
                theme: 'classic'
            });

            for (var i = 0; i < arr.length; i++) {
                $(".itemuom-select2").empty();
                $(".itemuom-select2").append($("<option></option>", {
                    value: arr[i].Unit,
                    text: arr[i].UnitDesc
                }));
            }
        }
    }
}

function computeExtCost() {

    var total = 0;
    var qty = $('#Qty').val();
    var unitcost = $('#UnitCost').val();
    var amount = (parseFloat(qty.replace(',', '')) * parseFloat(unitcost.replace(',', '')));

    $('#Amount').val(formatCurrencyList(amount, true));

}

function setNumberDefault() {
    $('.number').val('0.00');
}


function SearchTran() {

    $('#table-issues').find('tbody').empty();

    var value = $('#Search').val();

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'issueslist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0&issues=' + value
    });



}

function selectAll() {

    $('#select_all').click(function(e) {
        $('.checkbox').not(this).prop('checked', this.checked);
        var table = $(e.target).closest('table');
        $('td input:checkbox', table).prop('checked', this.checked);
    });

    $('#select_all_grid').click(function(e) {
        $('.checkbox_grid').not(this).prop('checked', this.checked);
        var table = $(e.target).closest('table');
        $('td input:checkbox', table).prop('checked', this.checked);
    });
}

var deleteSelectedArr = [];
function multiDelete() {


    var data = objectifyForm($('#issues-form').serializeArray());
    $('.checkbox_list:checked').each(function() {
        deleteSelectedArr.push($(this).val());
    });


    var records = [];
    var obj = new Object();
    for (var i = 0; i < deleteSelectedArr.length; i++) {
        var rec = deleteSelectedArr[i];
        var obj = new Object();
        obj.SeqID = rec;
        records.push(obj);
    }
    data.data = records;

    $.ajax({
        type: 'POST',
        url: baseUrl + "issuesservlet?operation=MULTI_DELETE",
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

function confirmMultiDelete() {
    $('#MsgAlertDelete').modal('show');

    $('#Confirm-No').click(function() {
        $('#MsgAlertDelete').modal('hide');
    });
    $('#Confirm-Yes').click(function() {
        $('#MsgAlertDelete').modal('hide');
        multiDelete();
    });
}

function reloadPage() {
    window.location.reload();
}

function userscallback(response) {
    if (response.success) {
        if (response.usage == 'getExactUsers') {
            var arr = response.data[0];
            $('#Name').val(arr.FullName);
        }
    }
}

function copyOwner(chk) {
    if ($(chk).is(':checked')) {
//        $('.issues_ownerinfo').show();
        var fullName = $('#FirstName').val() + " " + $('#MiddleName').val() + " " + $('#LastName').val();
        var Address = $('#Address').val();
        $('#OwnerName').val(fullName);
        $('#OwnerAddress').val(Address);
    } else {
        $('#OwnerName').val('');
        $('#OwnerAddress').val('');
//        $('.issues_ownerinfo').hide();
    }
}

function store_inspector(userid) {

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'inspectorlist?jsonformat=jsonp&exactOnly=true&inspector=' + userid
    });

}

function inspectorcallback(response) {
    if (response.success) {
        if (response.usage == 'getExactinspector') {
            var arr = response.data[0];
            $('#InspectorName').val(arr.InspectorName);
            $('#Inspector').val(arr.Type);
            $('#InspectorAdd').val(arr.Address);
            $('#InspectorPRC').val(arr.PRCNo);
            $('#InspectorPTR').val(arr.PTRNo);
            $('#InspectorTIN').val(arr.TIN);
            $('#InspectorIssuedAt').val(arr.IssuedAt);
            $('#Region').val(arr.Region);
            $('#Province').val(arr.Province);
            $('#CityMun').val(arr.CityMun);





            $('#Region').val(arr.Region);
            $('#CityMun').val(arr.CityTownID);


        }
    }
}


function udf_store_component() {
    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'udftablelist?TableName=component',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#ScoopWorkOthers').empty();
                $('#ScoopWorkOthers').append('<option value = "" disabled selected></option>');
                for (var i = 0; i < arr.length; i++) {
                    $("#ScoopWorkOthers").append($("<option></option>", {
                        value: arr[i].ShortDesc,
                        text: arr[i].LongDesc
                    }));
                }

            }

        }
    });
}
function udf_store(forscope) {

    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'udftablelist?TableName=ConstructionOwned',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#FormOwnerShip').empty();
                $('#FormOwnerShip').append('<option value = "" disabled selected></option>');
                for (var i = 0; i < arr.length; i++) {
                    $("#FormOwnerShip").append($("<option></option>", {
                        value: arr[i].LongDesc,
                        text: arr[i].LongDesc
                    }));
                }

            }

        }
    });
    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'udftablelist?TableName=LandUsed',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#LandUse').empty();
                $('#LandUse').append('<option value = "" disabled selected></option>');
                for (var i = 0; i < arr.length; i++) {
                    $("#LandUse").append($("<option></option>", {
                        value: arr[i].LongDesc,
                        text: arr[i].LongDesc
                    }));
                }

            }

        }
    });
    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'udftablelist?TableName=AccBldg',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#AccBldStrct').empty();
                $('#AccBldStrct').append('<option value = "" disabled selected></option>');
                for (var i = 0; i < arr.length; i++) {
                    $("#AccBldStrct").append($("<option></option>", {
                        value: arr[i].LongDesc,
                        text: arr[i].LongDesc
                    }));
                }

            }

        }
    });
    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'udftablelist?TableName=OccGroup',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#OccGroup').empty();
                $('#OccGroup').append('<option value = "" disabled selected></option>');
                for (var i = 0; i < arr.length; i++) {
                    $("#OccGroup").append($("<option></option>", {
                        value: arr[i].LongDesc,
                        text: arr[i].LongDesc
                    }));
                }

            }

        }
    });
    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'udftablelist?TableName=OccChar',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#OccChar').empty();
                $('#OccChar').append('<option value = "" disabled selected></option>');
                for (var i = 0; i < arr.length; i++) {
                    $("#OccChar").append($("<option></option>", {
                        value: arr[i].LongDesc,
                        text: arr[i].LongDesc
                    }));
                }

            }

        }
    });
    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'udftablelist?TableName=OccUses',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#OccUses').empty();
                $('#OccUses').append('<option value = "" disabled selected></option>');
                for (var i = 0; i < arr.length; i++) {
                    $("#OccUses").append($("<option></option>", {
                        value: arr[i].LongDesc,
                        text: arr[i].LongDesc
                    }));
                }

            }

        }
    });
    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'udftablelist?TableName=ScopeOfWork',
        success: function(response) {
            if (response.data) {
                var arr = response.data;
                $('#ScopeOfWork').empty();
                $('#ScopeOfWork').append('<option value = "" disabled selected></option>');
                for (var i = 0; i < arr.length; i++) {
                    $("#ScopeOfWork").append($("<option></option>", {
                        value: arr[i].ShortDesc,
                        text: arr[i].LongDesc
                    }));
                }

            }

        }
    });

}

var append = 0;
var newimg;
    
function afterrender() {

    $("#main").click(function() {
        $("#mini-fab").toggleClass('hidden');
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&getAllModules=true'
    });
    
    $('[data-toggle="tooltip"]').tooltip();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'issueslist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0'
    });

    $('#issues-list').xpull({
        spinnerTimeout: '1000',
        'callback': function() {
            $('#table-issues').find('tbody').empty();
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'issueslist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0'
            });
        }
    });

    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchTran();
        }
    });
    
    $("#UploadPhoto").change(function(e) {
//        console.log($(this).val());
        append+=1;
        readURL(this);
    });
//    $("#UploadPhoto-EDIT").change(function() {
//        readURL(this);
//    });
    $("#includePrompts").load("../../lookup/lookup.html");


}

function readURL(input) {

    if (input.files) {
        var reader = new FileReader();
        console.log(reader);
        reader.onload = function(e) {
            
            var refimage = 'attachFile'+append;
            $('#div-canvass').append('<div class = "col-md-2 '+refimage+'"><img id="attachFile'+append+'" class = "photo-attach" name = "file_images" src="#" alt="" style ="width:100%;height:150px;cursor: pointer" onclick = "viewImage(this);" ><br><button class ="btn-material inverse form-control" style ="height: auto" onclick ="removeImage(\'' + refimage + '\')"> REMOVE </button> </div>');
            $('#attachFile'+append+'').attr('src', e.target.result);
            newimg = true;
//            console.log(newimg);
//            if(newimg){
//                $('#div-canvass').append('<div class = "col-md-2"><img id="attachFile'+append+'" src="#" alt="" style ="width:100%;height:250px;"></div>');
//                $('#attachFile'+append+'').attr('src', e.target.result);
//            }
            
        };
        reader.readAsDataURL(input.files[0]);
    }

}

function removeImage(element){
//    console.log($('.'+element+'').remove());
    console.log(element);
    $('.'+element+'').remove();
    $('#UploadPhoto').val('');
}

function viewImage(imagesrc){
    $('#modalViewAttach').modal('show');
//    console.log(imagesrc);
//    console.log($(imagesrc).attr('src'));
    $('#viewFileZoom').attr('src', $(imagesrc).attr('src'));
}
function PrintForm() {


    var AppNo = $('#AppNo').val();
    window.open(baseUrl + 'jasperreport?jsonformat=jsonp&parameter={"events":{"replace":true,"remove":true,"clear":true,"add":true},"hasListeners":{},"map":{},"length":2}&otherparameter={}&batnbr=' + AppNo + '&formname=issues&reportid=00000&exporttype=pdf&custom=false');

}


function change_scoopworkother() {
    $('#app_requirements_ScopeOfWork').empty();
    $('#app_requirements_ScopeOfWork').html($('#ScopeOfWork').find(":selected").text() + " " + $('#ScoopWorkOthers').find(":selected").text());
}
function store_apprequirements(scopeofwork) {
    var sow = $(scopeofwork).val();
    var n = sow.includes('OF');
    if (n) {
        udf_store_component();


    } else {
        $('#ScoopWorkOthers').empty();
        $('#ScoopWorkOthers').attr('readonly', 'readonly');

    }

    $('#app_requirements_ScopeOfWork').html($(scopeofwork).find(":selected").text());
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'issuesrequirementslist?jsonformat=jsonp&AppRequirements=true&scopeofwork=' + $(scopeofwork).val()
    });
}

function issuesrequirementscallback(response) {
    if (response.success) {
        if (response.usage == 'getissuesRequirements') {
            var arr = response.data;
            console.log(arr);
            $('.appRequirements').empty();
            for (var i = 0; i < arr.length; i++) {
                $('.appRequirements').append('<span>' + arr[i].Requirements + '</span><br>');
            }

        }
    }
}


function viewFormFees(feestype) {
    $('#issuesFees_modal').modal('show');
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'issuesfeeslist?jsonformat=jsonp&exactOnly=true&issuesfees=' + feestype
    });
}

function issuesfeescallback(response) {
    if (response.success) {
        if (response.usage == 'getExactissuesfees') {
            var arr = response.data[0];
            $('#FeesHeaderDescription').html('<li>' + arr.FeesHeaderDescription + '</li>');
        }
    }
}


//function createFolder(name) {
//    var encodedName = name; //$.URLEncode(name);
//    ajaxLoadingOn();
//    $.ajax({
//        type: 'POST',
//        url: "_DAV/MKCOL",
//        data: {
//            name: encodedName
//        },
//        dataType: "json",
//        success: function() {
//            ajaxLoadingOff();
//            window.location = encodedName + "/index.html";
//        },
//        error: function() {
//            ajaxLoadingOff();
//            alert('There was a problem creating the folder');
//        }
//    });
//}



function activeTab(submodule) {
    switch (submodule) {

        case 'attachfiles':
            $('.form-attachedfiles').hide();
            $('.list-attachfiles').show();
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'issuesattachfileslist?jsonformat=jsonp&perapp=true&issuesattachfiles=' + curappno
            });

            enabledInput();
//            backtolist();
            $('#mini-fab').addClass('hidden');
            $('#main').hide();
            $('#save_float').hide();
            break;

        case 'documentinput':
            enabledInput();
            $('#mini-fab').addClass('hidden');
            $('#main').show();
            $('#save_float').hide();
            break;
        case 'test':
            init();
            break;
        case 'applicationform':
//            disabledInput();
            $('#mini-fab').addClass('hidden');
            $('#main').show();
            $('#save_float').hide();
            break;
        case 'apprequirements':
//            disabledInput();
            $('#mini-fab').addClass('hidden');
            $('#main').show();
            $('#save_float').hide();
            break;
    }
}


var images = [
    '/test/uploads/wPaint.png'
];

function saveImg(image) {
    var _this = this;

    $.ajax({
        type: 'POST',
        url: '/test/upload.php',
        data: {image: image},
        success: function(resp) {

            // internal function for displaying status messages in the canvas
            _this._displayStatus('Image saved successfully');

            // doesn't have to be json, can be anything
            // returned from server after upload as long
            // as it contains the path to the image url
            // or a base64 encoded png, either will work
            resp = $.parseJSON(resp);

            // update images array / object or whatever
            // is being used to keep track of the images
            // can store path or base64 here (but path is better since it's much smaller)
            images.push(resp.img);

            // do something with the image
            $('#wPaint-img').attr('src', image);
        }
    });
}

function loadImgBg() {

    // internal function for displaying background images modal
    // where images is an array of images (base64 or url path)
    // NOTE: that if you can't see the bg image changing it's probably
    // becasue the foregroud image is not transparent.
    this._showFileModal('bg', images);
}

function loadImgFg() {

    // internal function for displaying foreground images modal
    // where images is an array of images (base64 or url path)
    this._showFileModal('fg', images);
}





function saveAttachedFile() {

    $('#can').hide();
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
    var base64image = $('#canvasimg').attr('src');
    var base64ImageContent = base64image.split(',');
    var data_ = objectifyForm($('#win-issuesattachmentfile').serializeArray());
    data_.Remarks = $('#issuesattachfiles_Remarks').val();
    data_.imgcanvass = base64ImageContent[1];
    data_.ImgNamecanvass = $('#issuesattachfiles_FileName').val() + 'REVISED';
    console.log(data_);
    $.ajax({
        type: 'POST',
        url: baseUrl + "issuesattachfilesservlet?operation=UPDATE_RECORD",
        dataType: 'json',
        data: JSON.stringify(data_),
        contentType: "application/json",
        success: function(data) {
            if (data.success) {
                $('#MsgAlert').modal('show');
                back();
            } else {
                $('#message-info').css('display', 'block');
                $('#message-text').html(data.message);
            }
        }});
}

function computeTotals() {

    var sum = 0;
    var filingfee = $('#FilingFee').val(), zoningfee = $('#ZoningClearanceFee').val(), brgyfee = $('#BrgyClearanceFee').val(),
            firefundfee = $('#FireFundFee').val(), archbldgfee = $('#ArchBldg').val(), structexcav = $('#StructExcav').val(), sanfee = $('#SanitaryFee').val(), plumbingfee = $('#PlumbingFee').val(),
            mechfee = $('#MechanicalFee').val(), geodeticfee = $('#GeodeticFee').val(), specialfee = $('#SpecialFee').val();
//    var elecfee = $('#ElectricFee').val();
//    var electronfee = $('#ElectronicsFee').val();
//    console.log(electronfee);
    var electrcfee = $('#ElectricFee').val();
    sum = parseFloat(filingfee.replace(',', '')) + parseFloat(zoningfee.replace(',', '')) + parseFloat(brgyfee.replace(',', '')) + parseFloat(firefundfee.replace(',', '')) + parseFloat(archbldgfee.replace(',', '')) + parseFloat(structexcav.replace(',', '')) + parseFloat(sanfee.replace(',', '')) + parseFloat(plumbingfee.replace(',', ''))
            + parseFloat(mechfee.replace(',', '')) + parseFloat(geodeticfee.replace(',', '')) + parseFloat(specialfee.replace(',', '')) + parseFloat(electrcfee.replace(',', ''));
    console.log(sum);
    $('#TotalFee').val(formatCurrencyList(sum, true));
}




var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

var x = "black",
        y = 2;

function init(imgpath) {

    canvas = document.getElementById('can');
    var img_ = document.getElementById('canvasimg');
    $(img_).show();
    $(canvas).hide();
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;


//        make_base(imgpath);
//        if(img){
//            ctx.drawImage(img,10,10);
//        }else{
//            ctx.drawImage(img_,10,10);
//        }




    canvas.addEventListener("mousemove", function(e) {
        findxy('move', e);
    }, false);
    canvas.addEventListener("mousedown", function(e) {
        findxy('down', e);
    }, false);
    canvas.addEventListener("mouseup", function(e) {
        findxy('up', e);
    }, false);
    canvas.addEventListener("mouseout", function(e) {
        findxy('out', e);
    }, false);
}

function color(obj) {
    switch (obj.id) {
        case "green":
            x = "green";
            break;
        case "blue":
            x = "blue";
            break;
        case "red":
            x = "red";
            break;
        case "yellow":
            x = "yellow";
            break;
        case "orange":
            x = "orange";
            break;
        case "black":
            x = "black";
            break;
        case "white":
            x = "white";
            break;
    }
    if (x == "white")
        y = 14;
    else
        y = 2;

}

function draw() {

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
    console.log(x);
    console.log(y);
    console.log(prevX);
    console.log(prevY);
    console.log(currX);
    console.log(currY);
    cPush();
}

function erase() {
    ctx.clearRect(0, 0, w, h);
//        var m = confirm("Want to clear");
//        if (m) {
//            ctx.clearRect(0, 0, w, h);
//            document.getElementById("canvasimg").style.display = "none";
//        }
}


function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}


//    function make_base(imagepath){
//        var canvas1 = document.getElementById('can');
//        var ctx1 = canvas1.getContext("2d");
//        
//        
//        var tmp = $('#tmp');
//        tmp.attr('src', imagepath);
//        
//        console.log(imagepath);
//        var base_image = new Image();
//        base_image.src = imagepath;
//        
//        ctx1.drawImage(tmp, 100,100);
//    }


function drawtocanvass() {

    var canvasbtn = document.getElementById('can');
    var img_btn = document.getElementById('canvasimg');

    $(canvasbtn).show();
    $(img_btn).hide();
    $('#drawtocanvass').hide();

    var ctxbtn = canvasbtn.getContext("2d");
    ctxbtn.drawImage(img_btn, 10, 10, 1000, 400);
    console.log(canvasbtn);
    console.log(img_btn);
    console.log(ctxbtn);
    console.log(ctxbtn.drawImage(img_btn, 10, 10, 1000, 400));

}


var cPushArray = new Array();
var cStep = -1;
var canvas1 = document.getElementById('can');
var canvaxctx = canvas1.getContext("2d");

function cPush() {
    cStep++;
    if (cStep < cPushArray.length) {
        cPushArray.length = cStep;
    }
    cPushArray.push(document.getElementById('can').toDataURL());
}

function cUndo() {
    console.log(cPushArray);
    if (cStep > 0) {
        cStep--;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function() {
            canvaxctx.drawImage(canvasPic, 0, 0);
        };
    }
}

function backtolist() {
    $('.form-attachedfiles').hide();
    $('.list-attachfiles').show();
//    $('#tbl-attachedfiles').find('tbody').empty();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'issuesattachfileslist?jsonformat=jsonp&perapp=true&issuesattachfiles=' + curappno
    });

}


function importFile(module) {
    $('#ImportWindow').modal('show');
    $('#Sheet').css('border', '1px solid #7e9399');

    jQuery.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'exceltablelist?jsonformat=jsonp&field=AllowUpload&value=1'
    });

    jQuery.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'exceltablelist?jsonformat=jsonp&module=' + module
    });

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

    $('#UploadFile').change(function(e) {

        
        var file = e.target.files[0];
//        $('#Sheet').val() != '' && $('#Sheet').val() != null

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



        if (sheet != null) {
            if (tablename && filename && sheet) {
                $('.showbox-spinner').show();
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

                            $('.showbox-spinner').hide();

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
        } else {
            alert('required field');
            $('#Sheet').css('border', '1px solid red');
        }

    });


}

function exceltablecallback(response) {


    if (response.usage == 'getModuleExact') {
        var arr = response.data;
        $("#UploadLocation").empty();
        for (var i = 0; i < arr.length; i++) {
            $("#UploadLocation").append($("<option></option>", {
                value: arr[i].TableName,
                text: arr[i].TableDesc
            }));
        }

        for (var i = 0; i < arr.length; i++) {
//            $("#UploadLocation").append($("<option></option>", {
//                value: arr[i].TableName,
//                text: arr[i].TableDesc
//            }));
            $("#downnloadTemplate").empty();
            $("#downnloadTemplate").append($("<option></option>", {
                value: arr[i].TableName,
                text: arr[i].TableDesc
            }));
        }


    }

//    else if(response.usage == 'getField'){
//        var arr = response.data;
//        $("#downnloadTemplate").append('<option disabled selected> - Select Table - </option>');
////        $("#UploadLocation").append('<option disabled selected> - Select File Location - </option>');
//        for (var i = 0; i < arr.length; i++) {
////            $("#UploadLocation").append($("<option></option>", {
////                value: arr[i].TableName,
////                text: arr[i].TableDesc
////            }));
//            $("#downnloadTemplate").append($("<option></option>", {
//                value: arr[i].TableName,
//                text: arr[i].TableDesc
//            }));
//        }
//    }

}

function DownloadTemplate() {
    var tableName = $('#downnloadTemplate').val();
    window.open(baseUrl + 'uploadexcelservlet?jsonformat=jsonp&operation=DOWNLOAD_TEMPLATE&tablename=' + tableName);
}





function pmodulescallback(response){
    if(response.success){
       if (response.usage == 'getAllModules') {
           var arr = response.data;
           for (var i=0; i < arr.length; i++){
               $('#Module').append('<option value = "'+arr[i].SubModule+'">'+arr[i].Form+'</option>');
           }
        } 
    }
    
}



