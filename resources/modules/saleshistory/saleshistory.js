
var baseUrl = "http://localhost:8080/portal/";



var i= 1;
var id;
function salesOnload(){
    
    var userID = document.cookie;
    id = userID;
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'Saleslist?jsonformat=jsonp&dolimit=true'
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=saleshistory'
    });
    
    $('#Search').keyup(function(event){
       if (event.keyCode === 13){
           SearchSales();
       } 
    });
    
    charts();
    $("#includePrompts").load("../../lookup/lookup.html");
}

function pmodulescallback(response) {

    if (response.success) {
        if (response.usage == 'getUserrightsModules') {
            var arr = response.data;
            
            for (var i = 0; i < arr.length; i++) {
                $('#saleshistory-tab').append('<li class="mytab ' + arr[i].SubModule + '" style ="border-top:none">'
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

function SearchSales(){
        $('#sales-infos').empty();
        var field = $('#filter').val();
        var value = $('#Search').val();
//        alert(id);
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'Saleslist?jsonformat=jsonp&exactOnly=true&salesperpeson='+id+'&valuefield='+value
        });
}

function Salescallback(response){
    if (response.success){
        if (response.usage == "getSales"){
            var arr = response.data;
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                $('#table-saleshistory').append('<tr id="rows1' + (i) + '" style = "cursor:pointer" title= "">'
                            +'<td><input type ="text" class ="form-control text-grid input-sm " id ="COCNumber' + (i) + '" name ="COCNumber" value = "'+arr[i].COCNumber+'" readonly></td>'
                            +'<td><input type ="date" class ="form-control text-grid input-sm " id ="TranDate' + (i) + '" name ="TranDate" value = "'+arr[i].TranDate+'" readonly></td>'
                            +'<td><input type ="text" class ="form-control text-grid input-sm " id ="PlateNo' + (i) + '" name ="PlateNo" value = "'+arr[i].PlateNo+'" readonly></td>'
                            +'<td><input type ="text" class ="form-control text-grid input-sm " id ="ChassisNo' + (i) + '" name ="ChassisNo" value = "'+arr[i].ChassisNo+'" readonly></td>'
                            +'<td><input type ="text" class ="form-control text-grid input-sm " id ="AssueredName' + (i) + '" name ="AssueredName" value = "'+arr[i].AssueredName+'" readonly></td>'
                            +'<td><input type ="date" class ="form-control text-grid input-sm " id ="InceptionExpiry' + (i) + '" name ="InceptionExpiry" value = "'+arr[i].InceptionExpiry+'" readonly></td>'
                            +'<td><input type ="hidden" class ="form-control text-grid input-sm " id ="SeqID' + (i) + '" name ="SeqID" value = "'+arr[i].SeqID+'" readonly></td>'
                       );
                $('#rows1' + i).attr('COCNumber', arr[i].COCNumber);
                $('#rows1' + i).dblclick(function(a) {
                    var COCNumber = $(this).attr('COCNumber');
                    if (COCNumber) {
                        editGrid();
                    }
                });
                $('.text-grid').blur(function(){
//                    alert('test');
                    disabledGrid();
                });
                
            }
        }
    }
}

function disabledGrid(){
//    alert('test');
    $('input').attr('readonly', 'readonly');
}

function PrintForm(tranid){
    $('#global-batnbr').val(tranid);
    showReportForm(tranid,'FormName','sales');
}

function printformOnwindow(RefID){
    window.open(baseUrl + 'jasperreport?jsonformat=jsonp&parameter={"events":{"replace":true,"remove":true,"clear":true,"add":true},"hasListeners":{},"map":{},"length":2}&otherparameter={}&batnbr=' + RefID + '&memberid='+RefID+'&formname=sales&reportid=10004&exporttype=pdf&custom=false');
}
function editGrid(){
    $('input').removeAttr('readonly');
    $('#editGrid').css('display','none');
    $('#saveGrid').css('display','block');
}

function saveGrid(){
    var rowrec = [];
    var data = objectifyForm($('#saleshistory-form').serializeArray());
    $("#table-saleshistory").find('tbody').find("tr").each(
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
        $.ajax({
            type: 'POST',
            url: baseUrl + "Salesservlet?operation=UPDATE_RECORD",
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



function charts(){
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'Saleslist?jsonformat=jsonp&forchart=CostvsMgtFees'
    });
    
    $("#linechart-sales").sparkline(
            [
                160, 240, 120, 200, 180, 350, 230, 200, 280, 380, 400, 360, 300, 220, 200, 150, 40, 70, 180, 110, 200, 160, 200, 220
            ], {
      type: "line",
      width: "100%",
      height: "226",
      lineColor: "#a5e1ff",
      fillColor: "rgba(241, 251, 255, 0.9)",
      lineWidth: 2,
      spotColor: "#a5e1ff",
      minSpotColor: "#bee3f6",
      maxSpotColor: "#a5e1ff",
      highlightSpotColor: "#80cff4",
      highlightLineColor: "#cccccc",
      spotRadius: 6,
      chartRangeMin: 0
    });
    
    $("#barchart-sales").sparkline([220, 240, 260, 280, 320 , 360 , 420 , 520 , 550], {
      type: "bar",
      height: "226",
      barSpacing: 8,
      barWidth: 18,
      barColor: "#8fdbda"
    });
    
    $("#pie-chart-sales").sparkline([2, 8, 6, 10], {
      type: "pie",
      height: "220",
      width: "220",
      offset: "+90",
      sliceColors: ["#a0eeed", "#81e970", "#f5af50", "#f46f50"]
    });
    
    
    
    $(".pie-chart-percent-sales").easyPieChart({
      size: 200,
      lineWidth: 12,
      lineCap: "square",
      barColor: "#fab43b",
      animate: 800,
      scaleColor: false
    });
    
    
    
//    $('#barchart-8').append('<span>&nbsp;220&nbsp;240&nbsp;260&nbsp;280&nbsp;320&nbsp;240&nbsp;240&nbsp;240&nbsp;240</span>');
    
    
}