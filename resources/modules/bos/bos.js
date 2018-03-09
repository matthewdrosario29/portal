
var inc = 1;
var deleteSelectedArr = [];
var baseUrl = "http://localhost:8080/portal/";
var tbls;
var limitIndex;
var limitCount;
var module;
var gridnumberer;
function bosOnload() {
    limitIndex = 10;
    tbls = $('#table-bos').bootstrapTable({
    });

    $('#table-bos').on('dbl-click-row.bs.table', function(e, row, $element) {
        loadForm(row.BatNbr);
    });

    $('#table-bos').on('click-row.bs.table', function(e, row, $element) {
        $('.default').removeClass('default');
        $($element).addClass('default');

//        $($element).css('background','');
//        $($element).css('background','red');
    });


    $('#LoadMore').on('click', function() {
        limitCount = limitIndex + 10;
        console.log(limitIndex);
        console.log(limitCount);
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'boslist?jsonformat=jsonp&type=bos&dolimit=true&limitindex=' + limitIndex + '&limitcount=' + limitCount
        });

        limitIndex = limitCount;
    });


    var userID = document.cookie;
    id = userID;
    $("[name=table-bos_length]").addClass('input-sm');



//    var onloadlimitcount = $("[name=table-bos_length]").val();
//    
//    
//    console.log(onloadlimitcount);
//    limitcount = onloadlimitcount;
//
//    $("[name=table-bos_length]").on('change', function() {
//        var change = $("[name=table-bos_length]").val();
//    });
//    console.log(limitcount);

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'boslist?jsonformat=jsonp&type=bos&dolimit=true&limitindex=0&limitcount=10'
    });

//    jQuery.ajax({
//        type: 'POST',
//        jsonpCallback: "callback",
//        crossDomain: true,
//        dataType: 'jsonp',
//        url: baseUrl + 'boslist?jsonformat=jsonp&type=bos&dolimit=true&limitindex=0&limitcount=' + limitcount
//    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=bos'
    });



    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchTran();
        }
    });
    
    showDeleteBtn();
    formatCurrency();
    getDate();
    computeExtCost();
    selectAll();

    $("#includePrompts").load("../../lookup/lookup.html");




}
function saveGrid() {

    if ($('#TranDate').val().trim() == '') {
        $('#message-form').css('display', 'block');
        $('#message-form').html('<span> Field with (*) are required field! </span>');
    }
    else {
        var rowrec = [];
        var data = objectifyForm($('#bos-form').serializeArray());
        data.DocTotal = $('#total').val();
        $("#table-bosdetails").find('tbody').find("tr").each(
                function() {
                    var obj = new Object();
                    $(this).find("input").each(
                            function() {
                                obj[$(this).attr('name')] = $(this).val();
                            }

                    );
                    $(this).find("select").each(
                            function() {
                                obj[$(this).attr('name')] = $(this).val();
                                //                                obj['undefined'] = $(this).val();
                            }
                    );
                    rowrec.push(obj);
                }
        );
        data.details = rowrec;

        $.ajax({
            type: 'POST',
            url: baseUrl + "bosservlet?operation=UPDATE_RECORD",
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

}


function closealert() {
    $('#message-info').css('display', 'none');
}
function itemcallback(response) {
    if (response.success) {
        if (response.usage == 'getExact') {
            var arr = response.data[0];
            var rownum = response.rownum;


            $(".ItemDesc" + rownum).val(arr.ItemDescription);
            $(".ItemID" + rownum).append('<option selected>' + arr.ItemID + '</option>');

//            $(".ItemID" + rownum).append($("<option></option>", {
//                value: arr.ItemID,
//                text: arr.ItemID
//            }));
        }
        else if (response.usage == 'getUOM') {
            var arr = response.data;
            var rownum = response.rownum;

            for (var i = 0; i < arr.length; i++) {
                $(".select2-class-uom" + rownum).empty();
                $(".select2-class-uom" + rownum).append($("<option></option>", {
                    value: arr[i].UOM_Buy,
                    text: arr[i].UOM_Buy
                }));
            }
        }
        else if (response.usage == 'getDropdownItem') {
            var arr = response.data;
            var isonedit = response.isonedit;
            $('.select2-class').select2({
                width: null,
//                allowClear: true,
                prefwidth: 'auto',
                placeholder: {
                    id: '',
                    text: 'Select Item'
                },
                minimumInputLength: 1

            });
            $('.select2-class').last().css('display', 'block');
            if (isonedit) {
                for (var i = 0; i < arr.length; i++) {
                    $('.select2-class').append('<option value=' + arr[i].ItemID + '>' + arr[i].ItemID + '</option>');
                }
            } else {
                for (var i = 0; i < arr.length; i++) {
                    $('.select2-class').last().append('<option value=' + arr[i].ItemID + '>' + arr[i].ItemID + '</option>');
                }
            }
        }
        else if (response.usage == 'getItem') {
            var arr = response.data;
            var rownum = response.rownum;
            $('#Search-item').keyup(function(event) {
                if (event.keyCode === 13) {
                    searchItemLookup();
                }
            });
            
            

            $('#item-lookup').find('tbody').empty();
            for (var i = 0; i < arr.length; i++) {

                var j = i + 1;

                $('#item-lookup').append('<tr id="rows2' + (i) + '" style = "cursor:pointer" title= "Double Click to view record">'
                        + '<td style = "" title = "ItemID">' + formatValue(arr[i].ItemID, true) + '</td>'
                        + '<td style = "" title = "ItemDescription">' + formatValue(arr[i].ItemDescription, true) + '</td>'
                        + '</tr>'
                        );
                $('#rows2' + i).attr('ItemID', arr[i].ItemID);
                $('#rows2' + i).dblclick(function(a) {
                    var ItemID = $(this).attr('ItemID');
                    if (ItemID) {
                        $('#Search-item').val('');
                        loadItem(ItemID, rownum);
                        $('#itemLookup').modal('hide');
                        
                        /*try focus in to next input*/
                        
                        
                        
                        
                        /*mag add ng row kapag last row ang ginalaw nya*/
                        var idval = $('#table-bosdetails tr:last').attr('rownum');
                        var maxlevel = idval.replace(/[^0-9\.]+/g, "");
                        if (gridnumberer == maxlevel) {
                            addRow();
                        }
                        /*icocompute nya*/
                        computeExtCost();

                    }
                });
            }



        }
    }
}
function loadItem(item, rownum) {
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&exactOnly=true&item=' + item + '&rownum=' + rownum

    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemuomlist?jsonformat=jsonp&exactOnly=true&itemid=' + item + '&rownum=' + rownum

    });
}
function addRow() {


//    console.log($('#select2-search'));
//    
//    $('#select2-search').keyup(function (){
//        alert('test');
//    });

    inc = inc + 1;

    $('#table-bosdetails').find('a').css('pointer-events', 'all');

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&dropdown=true'
    });


    $('#table-bosdetails').find('tbody').append('<tr rownum = ' + inc + ' style = "padding-bottom:15px">'
            + '<td><input class = "checkbox_grid" name="checkbox_grid" type = "checkbox" style = "width:15px;height:15px;" ></td>'
//            + '<td><a onclick = "deleteRow(this);" style="width:1%"><i class = "fa fa-trash-o" style ="color:#6b6b6b;font-size:13pt;margin-top:5px"></i></a></td>'
            + '<td data-title = "Item" style ="width:25%"><select  class ="select2-class form-control input-sm ItemID' + inc + ' ItemID_seq" name="ItemID" onchange ="changeEventListener(this);" id ="ItemID"><option selected value = "">-Select Item-</option></select></td>'
            + '<td data-title = "ItemDesc" style ="width:30%"><input type="text"  class ="form-control input-sm text-grid ItemDesc' + inc + ' ItemDesc_seq" Placeholder = "Press F2 for options.." name="ItemDesc"  id ="ItemDesc"></td>'

            + '<td data-title = "UOM" style ="width:10%"><select  class ="select2-uom form-control text-grid UOM' + inc + '"  id ="UOM" name="Unit" ><option value="" selected></option></select></td>'
            + '<td data-title = "QTY Cost" style ="width:10%"><input type ="text" class ="form-control  text-field input-sm number text-grid QtyReq" id ="QtyReq" name="QtyReq" onblur="computeExtCost();" value=1 style ="text-align: center"></td>'
            + '<td data-title = "U/COST Cost" style ="text-align: right"><input type ="text" class ="form-control text-field text-grid input-sm amount UnitCost" id ="UnitCost" name="UnitCost" onchange="computeExtCost();" onfocus = "selectText(this);" value=0 style ="text-align: right"></td>'
            + '<td data-title = "EXT AMOUNT" style ="text-align: right"><input type ="text" class ="form-control text-field text-grid input-sm amount ExtCost " id ="ExtCost" name="ExtCost" value=0  style ="text-align: right" readonly></td>'
            + '<td><input type ="hidden" class ="form-control  input-sm" name="SeqID_details" style ="text-align: right"></td>'
            + '</tr>'
            );




    showDeleteBtn();
    formatCurrency();
    preventChar();
}

function deleteRow(tr) {
    $(tr).closest('tr').remove();
    computeExtCost();
}

function boscallback(response) {

    if (response.success) {
        if (response.usage == 'getAllBos') {
            var arr = response.data;
            var action = response.action;
            console.log(action);
            
            if (arr.length > 10 || arr.length == 0) {
                $('#LoadMore').css('display', 'none');
            }
            else {

                var data1 = [];

                for (var i = 0; i < arr.length; i++) {

                    var obj = new Object();
                    obj.Checkbox = '<input class = "checkbox_list" type = "checkbox" style = "width:15px;height:15px;margin-left:3px !important" value= ' + formatValue(arr[i].TranID, true) + '>';
                    obj.View = '<a href= "#" onclick = "loadForm(\'' + arr[i].BatNbr + '\');">&nbsp;<span class = "fa fa-eye" style = "color:#8bc411"></span></a>';
                    obj.BatNbr = formatValue(arr[i].BatNbr, true);
                    obj.TranID = formatValue(arr[i].TranID, true);
                    obj.TranType = formatValue(arr[i].TranType, true);
                    obj.TranDate = convertDate(formatValue(arr[i].TranDate, true), true);
                    obj.RequiredDate = convertDate(formatValue(arr[i].RequiredDate, true), true);
                    data1.push(obj);

                }
                $('#table-bos').bootstrapTable("append", data1);
            }
        }
        else if (response.usage == 'isappend') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {

                $('#table-bos').append('<tr id="rows2' + (i) + '" style = "cursor:pointer" title= "Double Click to view record">'
                        + '<td style ="text-align: center;width:2%"><center><input class = "checkbox_list" type = "checkbox" style = "width:15px;height:15px" value= ' + formatValue(arr[i].TranID, true) + '></center></td>'
                        + '<td style = "width:3%"><a href= "#" onclick = "loadForm(\'' + arr[i].BatNbr + '\');">&nbsp;<span class = "fa fa-eye" style = "color:#8bc411"></span></a></td>'
                        + '<td style = "width:20%" title = "TranID">' + formatValue(arr[i].TranID, true) + '</td>'
                        + '<td style = "width:20%" title = "TranDate">' + convertDate(formatValue(arr[i].TranDate, true), true) + '</td>'
                        + '<td style = "width:20%" title = "RequiredDate">' + convertDate(formatValue(arr[i].RequiredDate, true), true) + '</td>'
                        + '</tr>'

                        );
                $('#rows2' + i).attr('BatNbr', arr[i].BatNbr);
                $('#rows2' + i).dblclick(function(a) {
                    var BatNbr = $(this).attr('BatNbr');
                    if (BatNbr) {
                        loadForm(BatNbr);
                    }
                });
            }
        }

        else if (response.usage == 'getExactBos') {
            var arr = response.data[0];
            $('#TranID').val(arr.TranID);
            $('#TranDate').val(arr.TranDate);
            $('#BatNbr').val(arr.BatNbr);
            $('#RequiredDate').val(arr.RequiredDate);
            $('#TranType').val(arr.TranType);
            $('#total').val(formatCurrencyList(formatValue(arr.DocTotal, true), true));
            $('#Memo').val(arr.Memo, true);
//            $('#PriceClass').val(arr.PriceClassDesc, true);

            var $TranType = $('<option selected>' + arr.PriceClassDesc + '</option>').val(arr.PriceClassDesc);
            $('#PriceClass').append($TranType).trigger('change');
//            $('#PriceClass').append('<option value='+arr.PriceClassDesc+' selected>'+arr.PriceClassDesc+'</option>');


            $('#SeqID').val(arr.SeqID);
        }
    }

}




function bosdetailscallback(response) {
    if (response.success) {
        if (response.usage == 'getAllBosDetails') {
            var arr = response.data;
//            $('.select2-class').select2({
//                width: null,
//                prefwidth: 'auto',
//                minimumInputLength: 1
//            });
            for (var i = 0; i < arr.length; i++) {
                var itemid = arr[i].ItemID;
                console.log(arr[i].Unit);
                var test = i + inc;

                $('#table-bosdetails').append('<tr rownum = ' + test + ' style = "padding-bottom:15px">'
                        + '<td><input class = "checkbox_grid" name="checkbox_grid" type = "checkbox" style = "width:15px;height:15px;" disabled></td>'
//                        + '<td><a onclick = "deleteRow(this);" style="width:1%"><i class = "fa fa-trash-o" style ="color:#6b6b6b;font-size:13pt;margin-top:5px"></i></a></td>'
                        + '<td data-title = "ItemID" style ="width:25%"><select data-live-search="true" class ="form-control text-grid input-sm select2-class ItemID' + test + ' ItemID_seq" name="ItemID" module = "item" id = "ItemID" onchange ="changeEventListener(this);" disabled><option value = "' + itemid + '" selected>' + itemid + '</option></select></td>'
//                        + '<td data-title = "ItemDesc" style ="width:30%"><select data-live-search="true" class ="form-control text-grid input-sm select2-class ItemDesc' + test + ' ItemDesc_seq" name="ItemDesc" id = "ItemDesc" onchange ="changeEventListener(this);" disabled><option value = "' + arr[i].ItemDescription + '" selected>' + arr[i].ItemDescription + '</option></select></td>'
                        + '<td data-title = "ItemDesc" style ="width:30%"><input type= "text"  class ="form-control text-grid input-sm  ItemDesc' + test + ' ItemDesc_seq" name="ItemDesc" id = "ItemDesc"  value = "' + arr[i].ItemDescription + '" disabled></td>'
                        + '<td style ="width:10%"><select  class ="select2-uom form-control text-grid text-grid input-sm UOM' + test + ' "  id ="UOM" name="Unit" disabled><option value = "' + arr[i].Unit + '">' + arr[i].Unit + '</option></select></td>'
                        + '<td data-title = "Qty" style ="width:10%"><input type ="text" class ="form-control text-grid input-sm number QtyReq" id = "QtyReq" onblur="computeExtCost();"  name="QtyReq" id = "QtyReq" style ="text-align: center" value = "' + formatCurrencyList(arr[i].QtyReq) + '" disabled></td>'

                        + '<td style ="text-align: right"><input type ="text" class ="form-control  input-sm amount text-grid UnitCost" id = "UnitCost"  name="UnitCost" onchange="computeExtCost();"  onfocus = "selectText(this);" style ="text-align: right" value = "' + formatCurrencyList(arr[i].UnitCost, true) + '" disabled></td>'
                        + '<td data-title = "ExtCost"><input type ="text" class ="form-control input-sm amount text-grid ExtCost" name="ExtCost" id ="ExtCost" onchange="computeExtCost();" style ="text-align: right" value = "' + formatCurrencyList(formatValue(arr[i].ExtCost, true), true) + '" disabled></td>'
                        + '<td data-title = "SeqID"><input type ="hidden" class ="form-control input-sm text-grid" name="SeqID_details" style ="text-align: right" value = "' + arr[i].SeqID + '"></td>'
//                        + '<td><a onclick = "deleteRow(this);" style = "pointer-events:none"><i class = "fa fa-trash-o" style ="color:#6b6b6b;font-size:13pt;margin-top:5px"></i></a></td></tr>'
                        );

            }
            inc = test;
            formatCurrency();

        }
    }
}

function loadForm(tranid) {

    $('input').attr('readonly', 'readonly');
    $('textarea').attr('readonly', 'readonly');
    $('#total').attr('disabled', 'disabled');




    $('#description').replaceWith('<span style ="font-family: calibri;font-weight: bold;font-size: 15pt;line-height: 40px;margin-top: 0px" id ="description"> Edit transaction </span>');

    /*tab-control*/
    $('.tab-pane').removeClass('active');
    $('.mytab').removeClass('active');
    $('#bos').addClass('active');
    /*tab-control*/

    /*btn-control*/
    $('#btn-edit').css('display', 'block');
    $('#btn-print').css('display', 'block');
    $('#btn-delete').css('display', 'block');
    $('#btn-cancel').css('display', 'none');
    $('#btn-add').css('display', 'block');
    $('#btn-save').css('display', 'none');
    $('#btn-close').css('display', 'block');

    $('#AddRow').css('display', 'none');
    /*btn-control*/


    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&dolimit=true&limitindex=0&limitcount=50'
    });


    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&dropdown=true'
    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'udftablelist?jsonformat=jsonp&TableName=priceclass'

    });



    $('#bos-tab').append('<li class = "ViewMembers"><a href="#members-view" data-toggle="tab">View</a></li>');
    $('.ViewMembers').addClass('active');
    $('#members-view').addClass('active');
    $('#table-bosdetails').find('tbody').empty();

    $('#bosdetails').css('display', 'none');
    $('#bos').css('display', 'block');

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'boslist?jsonformat=jsonp&type=bos&exactOnly=true&bos=' + tranid
    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'boslist?jsonformat=jsonp&type=bosdetails&exactOnly=true&bosdetails=' + tranid
    });

    formatCurrency();

}


function RemoveTab(submodule) {
    $('.ViewMembers').remove();
    $('#bosdetails').css('display', 'block');
    $('#bos').css('display', 'none');

}


function getDate() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    $('#TranDate').val(today);
    $('#RequiredDate').val(today);
    $('#asof').html(" " + convertDate(today, true));


}

function closeitemLookup() {
    $('#itemLookup').modal('hide');
}


function addRecord() {


    removeRecord();
    getDate();
    enabledInput();
    inc = 1;
    $('#table-bosdetails').find('a').css('pointer-events', 'all');



    $(document).on('click', '#select2-ItemID-container', function() {
        module = 'item';
        var rownumber = $(this).closest('tr').attr('rownum');
        gridnumberer = rownumber;

    });
    $(document).on('click', '#select2-PriceClass-container', function() {
        module = 'priceclass';
    });

   
    $('#table-bosdetails').on('focus', '.ItemDesc_seq', function() {
        module = 'item';
        var rownumber = $(this).closest('tr').attr('rownum');
        gridnumberer = rownumber;

    });
    
    /*for itemdescription*/
    $('#table-bosdetails').on('keyup', '.ItemDesc_seq', function(event) {
         if (event.keyCode === 113) {
            if (module == 'item') {
                jQuery.ajax({
                    type: 'POST',
                    jsonpCallback: "callback",
                    crossDomain: true,
                    dataType: 'jsonp',
                    url: baseUrl + 'itemlist?jsonformat=jsonp&dolimit=true&limitindex=0&limitcount=50&rownum=' + gridnumberer
                });

                $('#itemLookup').modal('show');
                var row_index = $(this).parent().index;
                $(this).closest('tr').next().find('td:eq('+row_index+')').focus();
            } else {

            }
        }

    });
    
    /*for itemdID*/
    $(document).on('keyup', '#select2-search', function(e) {
        if (e.keyCode === 113) {
            $('.select2-class').select2('close');
            if (module == 'item') {
                jQuery.ajax({
                    type: 'POST',
                    jsonpCallback: "callback",
                    crossDomain: true,
                    dataType: 'jsonp',
                    url: baseUrl + 'itemlist?jsonformat=jsonp&dolimit=true&limitindex=0&limitcount=50&rownum=' + gridnumberer
                });
                $('#itemLookup').modal('show');
            } else {

            }
        }
    });

    $('#total').attr('readonly', 'readonly');
    $('#message-info').css('display', 'none');

    
    $('#description').empty();
    $('#description').replaceWith('<span style ="font-family: calibri;font-weight: bold;font-size: 15pt;line-height: 40px;margin-top: 0px" id ="description"> New transaction </span>');


    $('.tabpane').removeClass('active');
    $('#bosdetails').css('display', 'none');
    $('#bos').css('display', 'block');

    $('#btn-edit').css('display', 'none');
    $('#btn-print').css('display', 'none');
    $('#btn-add').css('display', 'none');
    $('#btn-delete').css('display', 'none');
    $('#btn-cancel').css('display', 'block');
    $('#btn-close').css('display', 'none');
    $('#btn-save').css('display', 'block');
    $('#AddRow').css('display', 'inline');




    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=BOS'
    });


    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&dolimit=true&limitindex=0&limitcount=50'
    });

    $('#TranType').val('STR');

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&dropdown=true'

    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'udftablelist?jsonformat=jsonp&TableName=priceclass'

    });




//    $('#table-bosdetails').unbind('click');
//    $('#table-bosdetails').on('click', 'tr:last .QtyReq', function(){
//        addRow();
//    });
    $('#table-bosdetails').off('change');
    $('#table-bosdetails').off('focus');
    $('#table-bosdetails').on('change', 'tr:last .ItemID_seq', function() {
        addRow();
        formatCurrency();
    });

    $('#table-bosdetails').on('change', 'tr:last .ItemDesc_seq', function() {
        addRow();
        formatCurrency();
    });
    $('#table-bosdetails').on('focus', 'tr:last .ItemDesc_seq', function() {
        
        if ($('.ItemDesc_seq').last().val().trim() != '') {
            addRow();
            formatCurrency();
        } else {
        }

    });







    $('#table-bosdetails').find('tbody').empty();
    $('#table-bosdetails').append('<tr rownum = ' + inc + ' style = "padding-bottom:15px">'
            + '<td><input class = "checkbox_grid" name="checkbox_grid" type = "checkbox" style = "width:15px;height:15px;" ></td>'
//            + '<td></td>'
            + '<td data-title = "Item" style ="width:25%"><select  class ="select2-class form-control input-sm ItemID' + inc + ' ItemID_seq" name="ItemID" onchange ="changeEventListener(this);" module = "item" id ="ItemID"><option selected value = "">-Select Item-</option></select></td>'
//            + '<td data-title = "ItemDesc" style ="width:30%"><select  class ="select2-class form-control input-sm ItemDesc' + inc + ' ItemDesc_seq" name="ItemDesc" onchange ="changeEventListener(this);" id ="ItemDesc"><option selected value = "">-Select Item-</option></select></td>'
            + '<td data-title = "ItemDesc" style ="width:30%"><input type = "text" class ="form-control text-grid input-sm ItemDesc' + inc + ' ItemDesc_seq" Placeholder = "Press F2 for options.." name="ItemDesc"  id ="ItemDesc"></td>'

            + '<td data-title = "UOM" style ="width:10%"><select  class ="select2-uom form-control text-grid UOM' + inc + '"  id ="UOM" name="Unit" ><option value="" selected></option></select></td>'
            + '<td data-title = "QTY Cost" style ="width:10%"><input type ="text" class ="form-control  text-field input-sm number text-grid QtyReq" id ="QtyReq" name="QtyReq" onblur="computeExtCost();" value=1 style ="text-align: center"></td>'
            + '<td data-title = "U/COST Cost" style ="text-align: right"><input type ="text" class ="form-control text-field text-grid input-sm amount UnitCost" id ="UnitCost" name="UnitCost" onchange="computeExtCost();" onfocus = "selectText(this);" value=0 style ="text-align: right"></td>'
            + '<td data-title = "EXT AMOUNT" style ="text-align: right"><input type ="text" class ="form-control text-field text-grid input-sm amount ExtCost " id ="ExtCost" name="ExtCost" value=0  style ="text-align: right" readonly></td>'
            + '<td><input type ="hidden" class ="form-control  input-sm" name="SeqID_details" style ="text-align: right"></td>'
            + '</tr>');

//    $('.checkbox_grid').on('change', function(e) {
//        if ($('.checkbox_grid').has('checked')) {
//            $('#remove-btn').css('display', 'block');
//        } else {
//            $('#remove-btn').css('display', 'none');
//        }
//    });
//    input[name=checkbox_grid]:checked
    
    


    showDeleteBtn();
    formatCurrency();
    preventChar();
    selectAll();










}


function computeExtCost() {

    var sum = 0;
    $('#table-bosdetails > tbody > tr').each(function() {
        var qty = $(this).find('.QtyReq').val();
        var unitcost = $(this).find('.UnitCost').val();
        var amount = (parseFloat(qty.replace(',', '')) * parseFloat(unitcost.replace(',', '')));
        sum += amount;
        $(this).find('.ExtCost').val(formatCurrencyList(amount, true));

    });

    $('#total').val(formatCurrencyList(sum, true));


}


function idsetupcallback(response) {
    if (response.success) {

        if (response.usage == 'getNextID') {
            var arr = response.data[0];
            $('#TranID').val(arr.NextGenID);
            $('#BatNbr').val(arr.NextGenID);
        }
    }
}


function PrintForm() {

    var batnbr = $('#BatNbr').val();
    showReportForm(batnbr, 'FormName', 'bosform');
}

function editRecord() {
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





    $('#table-bosdetails').find('input,button,select,textarea').removeAttr('disabled');
    $('#table-bosdetails').find('a').css('pointer-events', 'all');



    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&dropdown=true&isonedit=true'
    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'udftablelist?jsonformat=jsonp&TableName=priceclass'

    });

    addRow();

    $('#table-bosdetails').off('change');
    $('#table-bosdetails').off('focus');
    $('#table-bosdetails').on('change', 'tr:last .ItemID_seq', function() {
        addRow();
        formatCurrency();
    });

    $('#table-bosdetails').on('change', 'tr:last .ItemDesc_seq', function() {
        addRow();
        formatCurrency();
    });
    $('#table-bosdetails').on('focus', 'tr:last .ItemDesc_seq', function() {
        
        if ($('.ItemDesc_seq').last().val().trim() != '') {
            addRow();
            formatCurrency();
        } else {
        }

    });
    
    $('#table-bosdetails').on('focus', '.ItemDesc_seq', function() {
        module = 'item';
        var rownumber = $(this).closest('tr').attr('rownum');
        gridnumberer = rownumber;

    });
    
    /*for itemdescription*/
    $('#table-bosdetails').on('keyup', '.ItemDesc_seq', function(event) {
         if (event.keyCode === 113) {
            if (module == 'item') {
                jQuery.ajax({
                    type: 'POST',
                    jsonpCallback: "callback",
                    crossDomain: true,
                    dataType: 'jsonp',
                    url: baseUrl + 'itemlist?jsonformat=jsonp&dolimit=true&limitindex=0&limitcount=50&rownum=' + gridnumberer
                });

                $('#itemLookup').modal('show');
            } else {

            }
        }

    });

    $(document).on('keyup', '#select2-search', function(e) {

        if (e.keyCode === 113) {
            if (module == 'item') {

                jQuery.ajax({
                    type: 'POST',
                    jsonpCallback: "callback",
                    crossDomain: true,
                    dataType: 'jsonp',
                    url: baseUrl + 'itemlist?jsonformat=jsonp&dolimit=true&limitindex=0&limitcount=50&rownum=' + inc
                });

                $('#itemLookup').modal('show');




            } else {
                alert('none');
            }
        }
    });

    $(document).on('click', '#select2-ItemID-container', function() {
        module = 'item';

    });
    $(document).on('click', '#select2-PriceClass-container', function() {
        module = 'priceclass';
    });



    
    enabledInput();
    $('#total').attr('readonly','readonly');
    formatCurrency();
    preventChar();


}

function cancel() {
    inc = 1;

    $('.ViewMembers').remove();
    $('#bos').css('display', 'none');
    $('#bosdetails').css('display', 'block');
    enabledInput();
}

function SearchTran() {
    var field = $('#filter').val();
    var value = $('#Search').val();

    if (value.trim() == '') {
        $('#LoadMore').css('display', 'block');

    } else {
        $('#LoadMore').css('display', 'none');
    }
    $('#table-bos').bootstrapTable('removeAll');
    limitIndex = 10;



    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + './boslist?jsonformat=jsonp&type=bos&dolimit=true&limitindex=0&limitcount=10&bos=' + value
    });



}

function itemuomcallback(response) {
    if (response.success) {
        if (response.usage == 'getUOM') {
            var arr = response.data;
            var rownum = response.rownum;
            $('.select2-uom').select2({
                width: null,
                prefwidth: 'auto'
            });

            for (var i = 0; i < arr.length; i++) {
                $(".UOM" + rownum).empty();
                $(".UOM" + rownum).append($("<option></option>", {
                    value: arr[i].Unit,
                    text: arr[i].UnitDesc
                }));
            }
        }
    }
}



function changeEventListener(item) {
    
    var index = $('.select2-search__field ').index(item) + 1;
    $('.select2-search__field ').eq(index).focus();
    
    
    var itemid = $(item).val();
    var rownumval = $(item).closest('tr').attr("rownum");
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemuomlist?jsonformat=jsonp&exactOnly=true&itemid=' + itemid + '&rownum=' + rownumval

    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&exactOnly=true&item=' + itemid + '&rownum=' + rownumval

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




/*Confirm msgbox*/

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
function multiDelete() {


    
    
    

    
    var data = objectifyForm($('#table-bos-form').serializeArray());
    $('.checkbox_list:checked').each(function() {
        deleteSelectedArr.push($(this).val());
    });
    
    
    var records = [];
    var obj = new Object();
    for (var i = 0; i < deleteSelectedArr.length; i++) {
        var rec = deleteSelectedArr[i];
        var obj = new Object();
        obj.TranID = rec;
        records.push(obj);
    }
    data.details = records;
    
    $.ajax({
        type: 'POST',
        url: baseUrl + "bosservlet?operation=MULTI_DELETE",
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

function confirmDelete() {
    $('#MsgAlertDelete').modal('show');
    $('#Confirm-No').click(function() {
        $('#MsgAlertDelete').modal('hide');
    });
    $('#Confirm-Yes').click(function() {
        $('#MsgAlertDelete').modal('hide');
        deleteRecord();
    });
}
function deleteRecord() {


    var data = objectifyForm($('#bos-form').serializeArray());
    console.log(data);

    $.ajax({
        type: 'POST',
        url: baseUrl + "bosservlet?operation=DELETE_RECORD",
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


function cancelRecord() {



    $('#MsgAlertCloseForm').modal('show');

    $('#Close-No').click(function() {
        $('#MsgAlertCloseForm').modal('hide');
    });
    $('#Close-Yes').click(function() {
        $('#MsgAlertCloseForm').modal('hide');
        $('#bos').css('display', 'none');
        $('#bosdetails').css('display', 'block');
        enabledInput();
        $('#message-info').css('display', 'none');
        $('#message-text').empty();
    });
    $("[name=table-bos_length]").val(10);




}
function closeRecord() {

    enabledInput();

    $('#bos').css('display', 'none');
    $('#bosdetails').css('display', 'block');

    $("[name=table-bos_length]").val(10);


}

function exportData() {
    window.open(baseUrl + 'jasperreport?jsonformat=jsonp&parameter={"events":{"replace":true,"remove":true,"clear":true,"add":true},"hasListeners":{},"map":{},"length":2}&otherparameter={}&formname=bosgrid&reportid=RPT0000205&exporttype=csv&custom=false&datefrom=2018-02-01&dateto=2018-02-26');
//    window.open('./jasperreport?jsonformat=jsonp&parameter={"events":{"replace":true,"remove":true,"clear":true,"add":true},"hasListeners":{},"map":{},"length":2}&otherparameter={}&formname=bosgrid&reportid=RPT0000205&exporttype=csv&custom=false&datefrom=2018-02-01&dateto=2018-02-26');
}



function pasteFromExcel() {

    $('input').bind('paste', function(e) {
        var $start = $(this);
        var source;

        //check for access to clipboard from window or event
        if (window.clipboardData !== undefined) {
            source = window.clipboardData;
        } else {
            source = e.originalEvent.clipboardData;
        }
        var data = source.getData("Text");
        if (data.length > 0) {
            if (data.indexOf("\t") > -1) {
                var columns = data.split("\n");
                $.each(columns, function() {
                    var values = this.split("\t");
                    $.each(values, function() {
                        $start.val(this);
                        if ($start.closest('td').next('td').find('input,textarea')[0] != undefined || $start.closest('td').next('td').find('textarea')[0] != undefined) {
                            $start = $start.closest('td').next('td').find('input,textarea');
                        }
                        else
                        {
                            return false;
                        }
                    });
                    $start = $start.closest('td').parent().next('tr').children('td:first').find('input,textarea');
                });
                e.preventDefault();
            }
        }
    });































    (function($) {

        $.fn.enableCellNavigation = function() {

            var arrow = {
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                enter: 13
            };

            // select all on focus
            this.find('input,select').keydown(function(e) {
                // shortcut for key other than arrow keys
                if ($.inArray(e.which, [arrow.left, arrow.up, arrow.right, arrow.down, arrow.enter]) < 0) {
                    return;
                }

                var input = e.target;
                var td = $(e.target).closest('td');
                var moveTo = null;

                switch (e.which) {

                    case arrow.left:
                        {
                            if (typeof input.selectionStart == 'undefined') {
                                moveTo = td.prev('td:has(input,select)');
                            } else if (input.selectionStart == 0) {
                                moveTo = td.prev('td:has(input,select)');
                            }
                            break;
                        }
                    case arrow.right:
                        {
                            if (typeof input.selectionStart == 'undefined') {
                                moveTo = td.next('td:has(input,select)');
                            } else if (input.selectionEnd == input.value.length) {
                                moveTo = td.next('td:has(input,select)');
                            }
                            break;
                        }
                    case arrow.enter:
                        {

                            var tr = td.closest('tr');
                            var pos = td[0].cellIndex;

                            var moveToRow = null;
                            if (e.which == arrow.down) {
                                moveToRow = tr.next('tr');
                            } else if (e.which == arrow.up) {
                                moveToRow = tr.prev('tr');
                            }

                            if (moveToRow.length) {
                                moveTo = $(moveToRow[0].cells[pos]);
                            }

                            break;
                        }

                    case arrow.up:
                    case arrow.down:
                        {

                            var tr = td.closest('tr');
                            var pos = td[0].cellIndex;

                            var moveToRow = null;
                            if (e.which == arrow.down) {
                                moveToRow = tr.next('tr');
                            } else if (e.which == arrow.up) {
                                moveToRow = tr.prev('tr');
                            }

                            if (moveToRow.length) {
                                moveTo = $(moveToRow[0].cells[pos]);
                            }

                            break;
                        }

                }

                if (moveTo && moveTo.length) {

                    e.preventDefault();

                    moveTo.find('input,select').each(function(i, input) {
                        input.focus();
                        input.select();
                    });

                }

            });

        };

    })(jQuery);
    $(function() {
        $('table').enableCellNavigation();
    });




}
//function Sort(filterfield){
//    
//    limitIndex = 0;
//    limitCount = 10;
//    $('#LoadMore').removeAttr('disabled');
//    $('#table-bos').find('tbody').empty();
//    var orderby = $('#orderby').val();
//    
//    if(orderby == 'ASC'){
//        jQuery.ajax({
//            type: 'POST',
//            jsonpCallback: "callback",
//            crossDomain: true,
//            dataType: 'jsonp',
//            url: baseUrl + 'boslist?jsonformat=jsonp&type=bos&dolimit=true&limitindex=0&limitcount=10&filter_field='+filterfield+'&orderby=ASC'
//        });
//        $('#orderby').val('DESC');
//    }else{
//            jQuery.ajax({
//            type: 'POST',
//            jsonpCallback: "callback",
//            crossDomain: true,
//            dataType: 'jsonp',
//            url: baseUrl + 'boslist?jsonformat=jsonp&type=bos&dolimit=true&limitindex=0&limitcount=10&filter_field='+filterfield+'&orderby=DESC'
//        });
//        $('#orderby').val('ASC');
//    }
//    
//}

function udftablecallback(response) {
    if (response.success) {
        if (response.usage == 'getudfTable') {
            var arr = response.data;

            $('.select2-udf').select2({
                width: null,
                prefwidth: 'auto',
                theme: 'classic',
                placeholder: {
                    id: '',
                    text: 'Select Price Class'
                }
            });

//            $('.select2-udf').append('<option selected disabled> -Select Price Class- </option>');
            $('.select2-udf').css('display', 'block');
            for (var i = 0; i < arr.length; i++) {
                $('.select2-udf').append('<option value=' + arr[i].ShortDesc + '>' + arr[i].LongDesc + '</option>');
            }
        }
    }
}


function searchItemLookup(Item) {
    var Item = $('#Search-item').val();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + './itemlist?jsonformat=jsonp&type=bos&dolimit=true&limitindex=0&limitcount=100&item=' + Item + '&rownum=' + inc
    });
}

function removeSelectedGrid() {
    $('#MsgAlertDeleteRow').modal('show');
    $('#ConfirmRow-Yes').click(function (){
        $('#table-bosdetails tr').has('input[name=checkbox_grid]:checked').remove();
        computeExtCost();
        $('#MsgAlertDeleteRow').modal('hide');
        $('#remove-btn').attr('disabled','disabled');
        afterDeletrow();
    });
    $('#ConfirmRow-No').click(function (){
        $('#MsgAlertDeleteRow').modal('hide');
        
    });
    
}

function afterDeletrow(){
    var tbody = $('#table-bosdetails tbody');
    if(tbody.children().length == 0){
        
        addRow();
        $('#total').val('0.00');
    }
}

function showDeleteBtn(){
    var checkboxes_grid = $('.checkbox_grid'),
        deletebtn_grid = $('#remove-btn');
        checkboxes_grid.click(function (){
            deletebtn_grid.attr('disabled', !checkboxes_grid.is(':checked'));
        });
    var checkboxes_list = $('.checkbox_list'),
        deletebtn_list = $('#confirmMultiDelete');
        checkboxes_list.click(function (){
            deletebtn_list.attr('disabled', !checkboxes_list.is(':checked'));
        });
}