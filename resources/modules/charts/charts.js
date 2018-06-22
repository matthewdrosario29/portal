/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var i = 0;

var tenantTurn = [];
var tenantTurnDesc = [];

var ArrearsTurn = [];
var ArrearsTurnDesc = [];

var DisburesmentPerMonth = [];
var DisburesmentPerMonthDesc = [];

var TotalARBalance = [];
var TotalARBalanceDesc = [];

var OccupancyRate = [];
var OccupancyDesc = [];

var SalesPerMonth = [];
var SalesPerMonthDesc = [];

var CostvsMgtFeesfees = [];
var CostvsMgtFeesfeesdesc = [];

var CostvsMgtFeesCost = [];
var CostvsMgtFeesCostdesc = [];

var PayablesPerMonth  = [];
var PayablesPerMonthDesc = [];


var WonVsLoss = [];
var WonVsLossdesc = [];
var Quarter = [];

var connected;


function chartsOnload() {

    $('#form-charts').xpull({
        spinnerTimeout: '1000',
        'callback': function() {
            window.location.reload();
        }
    });


    if (localStorage.getItem('connected') != 'false') {
        $('#charts-div-offline').hide();
        $('#charts-div').show();
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'chartslist?jsonformat=jsonp&charttitle=CostvsMgtFees'
        });

        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'chartslist?jsonformat=jsonp&charttitle=TenantTurnover'
        });

        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'chartslist?jsonformat=jsonp&charttitle=ArrearsPerYear'
        });

        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'chartslist?jsonformat=jsonp&charttitle=OccupancyRate'
        });

        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'chartslist?jsonformat=jsonp&charttitle=WonVsLoss'
        });
        
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'chartslist?jsonformat=jsonp&charttitle=TotalARBalance'
        });
        
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'chartslist?jsonformat=jsonp&charttitle=SalesPerMonth'
        });
        
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'chartslist?jsonformat=jsonp&charttitle=DisburesmentPerMonth'
        });
        
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'chartslist?jsonformat=jsonp&charttitle=PayablesPerMonth'
        });
        
        
        
        
        
        $('.showbox').hide();
    } else {
        $('.showbox').hide();
        $('#charts-div').hide();
    }

}
function chartscallback(response) {

    if (response.success) {
        if (response.usage == 'CostvsMgtFees') {
            var arr = response.data;

            for (var i = 0; i < arr.length; i++) {

                CostvsMgtFeesfees.push(arr[i].MgmtFees);
                CostvsMgtFeesfeesdesc.push(arr[i].CurYear);

                CostvsMgtFeesCost.push(arr[i].Cost);
                CostvsMgtFeesCostdesc.push(arr[i].CurYear);

                $('#CostvsMgtFees').append('<tr>'
                        + '<td>' + formatValue(arr[i].CurYear, true) + '</td>'
                        + '<td>' + formatValue(arr[i].MgmtFees, true) + '</td>'
                        + '<td>' + formatValue(arr[i].Cost, true) + '</td>'
                        + '</tr>'
                        );
            }
        }
        else if (response.usage == 'TenantTurnover') {
            var arr = response.data;

            for (var i = 0; i < arr.length; i++) {

                tenantTurn.push(arr[i].Units);
                tenantTurnDesc.push(arr[i].CurMonth);

            }
        }
        else if (response.usage == 'ArrearsPerYear') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                ArrearsTurn.push(arr[i].Amount);
                ArrearsTurnDesc.push(arr[i].CurMonth);
                $('.chart-key').append('<li><span></span>' + arr[i].CurMonth + '</li>');
            }
        }

        else if (response.usage == 'OccupancyRate') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                OccupancyRate.push(arr[i].OccupancyRate);
                OccupancyDesc.push(arr[i].CurMonth);

//                $('.chart-text-axis').append('<li><span><span>' + arr[i].CurMonth + '</li>');
            }
        }

        else if (response.usage == 'WonVsLoss') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                WonVsLoss.push(arr[i].Won);
                WonVsLossdesc.push(arr[i].Loss);
                Quarter.push(arr[i].Quarter);


                $('.chart-text-axis').append('<li><span><span>' + arr[i].CurMonth + '</li>');
            }
        }
        
        else if (response.usage == 'TotalARBalance') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                $('.DaysDue').append('<span>' + arr[i].Days_Due + '</span><br>');
                $('.Amount').append('<span>' + arr[i].Total_AR + '</span><br>');
                TotalARBalance.push(arr[i].Total_AR);
                TotalARBalanceDesc.push(arr[i].Days_Due);
                $('.chart-key').append('<li><span></span>' + arr[i].CurMonth + '</li>');
            }
            

        }
        
        else if (response.usage == 'SalesPerMonth') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                
                SalesPerMonth.push(arr[i].TotalAmt);
                SalesPerMonthDesc.push(arr[i].Month);
                
            }
        }
        else if (response.usage == 'DisburesmentPerMonth') {
            var arr = response.data;

            for (var i = 0; i < arr.length; i++) {

                DisburesmentPerMonth.push(arr[i].DocTotal);
                DisburesmentPerMonthDesc.push(arr[i].DisburseMonth);

                
            }
        }
        
        else if (response.usage == 'PayablesPerMonth') {
            var arr = response.data;

            for (var i = 0; i < arr.length; i++) {

                PayablesPerMonth.push(arr[i].TotalAmtCur);
                PayablesPerMonthDesc.push(arr[i].TranDate);

                
            }
        }
        //
        charts();
        $('.showbox').hide();
    }
}

function charts() {
//    $("#barchart-TenantTurnover").sparkline(tenantTurn, {
//        type: "bar",
//        height: "226",
//        barSpacing: 10,
//        barWidth: 24,
//        barHeight: 24,
//        barColor: "#8fdbda"
//    });
//    $("#pie-chart-ArrearsPerYear").sparkline(ArrearsTurn, {
//        type: "pie",
//        height: "170",
//        width: "170",
//        offset: "+50",
//        sliceColors: ["#a0eeed", "#81e970", "#f5af50", "#f46f50", "#e6df2c"]
//    });
//
//
//    $("#linechart-occupancyrate").sparkline(OccupancyRate, {
//        type: "line",
//        width: "100%",
//        height: "226",
//        lineColor: "#a5e1ff",
//        fillColor: "rgba(241, 251, 255, 0.9)",
//        lineWidth: 2,
//        spotColor: "#a5e1ff",
//        minSpotColor: "#bee3f6",
//        maxSpotColor: "#a5e1ff",
//        highlightSpotColor: "#80cff4",
//        highlightLineColor: "#cccccc",
//        spotRadius: 6,
//        chartRangeMin: 0
//
//    });




    var ctx = document.getElementById("myChartBar").getContext('2d');
    var myChartBar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: tenantTurnDesc,
            datasets: [{
                    label: 'Tenant Turnover',
                    data: tenantTurn,
                    backgroundColor: [
                        '#77C9D4',
                        '#57BC90',
                        '#015249',
                        '#A5A5AF',
                        '#355C7D'
                    ],
                    borderColor: [
                        '#77C9D4',
                        '#57BC90',
                        '#015249',
                        '#A5A5AF',
                        '#355C7D'
                    ],
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stacked: true
                        }
                    }],
                responsive: true,
                tooltips: {
                    mode: 'index',
                    intersect: true
                }
            }
        }
    });



    var ctx = document.getElementById("myChartLine").getContext('2d');
    var myChartLine = new Chart(ctx, {
        type: 'line',
        data: {
            labels: OccupancyDesc,
            datasets: [{
                    label: 'Occupancy Rate',
                    data: OccupancyRate,
                    borderColor: [
                        '#77C9D4'
                    ],
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
            },
            responsive: true
        }
    });
    
    var ctx = document.getElementById("myChartLine-SalesPerMonth").getContext('2d');
    var myChartLine = new Chart(ctx, {
        type: 'line',
        data: {
            labels: SalesPerMonthDesc,
            datasets: [{
                    label: 'Sales Per Month',
                    data: SalesPerMonth,
                    borderColor: [
                        '#77C9D4'
                    ],
                    backgroundColor: [
                        'transparent'
                    ],
                    
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
            },
            responsive: true
        }
    });
    
    


    var ctx = document.getElementById("myChartPie").getContext('2d');
    var myChartPie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ArrearsTurnDesc,
            datasets: [{
                    label: 'Arrears Per Year',
                    data: ArrearsTurn,
                    backgroundColor: [
                        '#77C9D4',
                        '#57BC90',
                        '#015249',
                        '#A5A5AF',
                        '#355C7D'
                    ],
                    borderColor: [
                        '#77C9D4',
                        '#57BC90',
                        '#015249',
                        '#A5A5AF',
                        '#355C7D'
                    ]
                }]
        },
        options: {
            responsive: true
        }
    });
    
    
    
    
    var ctx = document.getElementById("myChartPieTotalARBalanceChart").getContext('2d');
    var myChartPie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: TotalARBalanceDesc,
            datasets: [{
                    label: 'Arrears Per Year',
                    data: TotalARBalance,
                    backgroundColor: [
                        '#77C9D4',
                        '#57BC90',
                        '#015249',
                        '#A5A5AF',
                        '#355C7D',
                        '#e3db5b'
                    ],
                    borderColor: [
                        '#77C9D4',
                        '#57BC90',
                        '#015249',
                        '#A5A5AF',
                        '#355C7D',
                        '#e3db5b'
                    ]
                }]
        },
        options: {
            responsive: true
        }
    });
    
    


    var ctx = document.getElementById("myChartBar-CostvsMgtFees").getContext('2d');
    var myChartBar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: CostvsMgtFeesfeesdesc,
            datasets: [{
                    label: 'Management Fees',
                    data: CostvsMgtFeesfees,
                    backgroundColor: [
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4'
                    ],
                    borderColor: [
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4'
                    ],
                    borderWidth: 1
                },
                {
                    label: 'Cost',
                    data: CostvsMgtFeesCost,
                    backgroundColor: [
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90'
                    ],
                    borderColor: [
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90'
                    ],
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stacked: true
                        }
                    }],
                responsive: true,
                tooltips: {
                    mode: 'index',
                    intersect: true
                }
            }
        }
    });
    
    
    var ctx = document.getElementById("myChartBar-DisbursementPerMonth").getContext('2d');
    var myChartBar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: DisburesmentPerMonthDesc,
            datasets: [{
                    label: 'Disburesement Per Month',
                    data: DisburesmentPerMonth,
                    backgroundColor: [
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90'
                        
                    ],
                    borderColor: [
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90'
                    ],
                    borderWidth: 1
                }]
                
        },
        options: {
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stacked: true
                        }
                    }],
                responsive: true,
                tooltips: {
                    mode: 'index',
                    intersect: true
                }
            }
        }
    });
    
    
    
    
    var ctx = document.getElementById("myChartBar-PayablesPerMonth").getContext('2d');
    var myChartBar = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: PayablesPerMonthDesc,
            datasets: [{
                    label: 'Payables Per Month',
                    data: PayablesPerMonth,
                    backgroundColor: [
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90'
                    ],
                    borderColor: [
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90'
                    ],
                    borderWidth: 1
                }]
                
        },
        options: {
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stacked: true
                        }
                    }],
                responsive: true,
                tooltips: {
                    mode: 'index',
                    intersect: true
                }
            }
        }
    });
    
    
    
    
    
    
    
    


    var ctx = document.getElementById("myChartBar-WonVsLoss").getContext('2d');
    var myChartBar = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: Quarter,
            datasets: [{
                    label: 'Won',
                    data: WonVsLoss,
                    borderColor: [
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4'
                    ],
                    backgroundColor: [
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4',
                        '#77C9D4'
                    ],
                    fill: true,
                    borderWidth: 1
                },
                {
                    label: 'Loss',
                    data: WonVsLossdesc,
                    borderColor: [
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90'
                    ],
                    backgroundColor: [
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90',
                        '#57BC90'
                    ],
                    fill: true,
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stacked: true
                        }
                    }],
                responsive: true,
                tooltips: {
                    mode: 'index',
                    intersect: true
                }
            }
        }
    });

}


function loadApproval() {
    $("#iFrame", window.parent.document).replaceWith('<iframe class ="adjust-iframe-margin " id ="iFrame" src ="./resources/modules/approval/approval.html" height ="99%" width = "100%" style ="border:0px;max-width: 100%;min-width:100%;width:100%;min-height:87vh;margin-top:-20px"></iframe>');
}
function loadIssues() {
    $("#iFrame", window.parent.document).replaceWith('<iframe class ="adjust-iframe-margin " id ="iFrame" src ="./resources/modules/issues/issues.html" height ="99%" width = "100%" style ="border:0px;max-width: 100%;min-width:100%;width:100%;min-height:87vh;margin-top:-20px"></iframe>');
}

//
//function checkConnection() {
//
//
//    jQuery.ajax({
//        type: 'POST',
//        jsonpCallback: "callback",
//        crossDomain: true,
//        dataType: 'jsonp',
//        url: baseUrl + 'checksession?jsonformat=jsonp&checkInternet=true',
//        xhrFields: {withCredentials: true},
//        success: function(response) {
//            var hasInternet = response.Connected;
//            connected = hasInternet;
//            if (!hasInternet) {
//                $('.showbox').hide();
//            } else {
//                $('.showbox').hide();
//            }
//
//        }
//        ,
//        failure: function() {
//            $('.showbox').hide();
//            connected = false;
//        }
//    });
//}




