/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var i = 0;

var tenantTurn = [];
var tenantTurnDesc = [];

var ArrearsTurn = [];
var ArrearsTurnDesc = [];

var OccupancyRate = [];
var OccupancyDesc = [];

var CostvsMgtFeesfees = [];
var CostvsMgtFeesfeesdesc = [];

var CostvsMgtFeesCost = [];
var CostvsMgtFeesCostdesc = [];

var WonVsLoss = [];
var WonVsLossdesc = [];
var Quarter = [];




function chartsOnload(){
   
    
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
    
    
  
    
}
function chartscallback(response) {
    
    if (response.success){
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
                $('.chart-key').append('<li><span></span>'+arr[i].CurMonth+'</li>');
            } 
        }
        
        else if (response.usage == 'OccupancyRate') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                OccupancyRate.push(arr[i].OccupancyRate);
                OccupancyDesc.push(arr[i].CurMonth);
                
                $('.chart-text-axis').append('<li><span><span>'+arr[i].CurMonth+'</li>');
            } 
        }
        
        else if (response.usage == 'WonVsLoss') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                WonVsLoss.push(arr[i].Won);
                WonVsLossdesc.push(arr[i].Loss);
                Quarter.push(arr[i].Quarter);
                
                
                $('.chart-text-axis').append('<li><span><span>'+arr[i].CurMonth+'</li>');
            } 
        }
        charts();
    }
}

function charts(){
    $("#barchart-TenantTurnover").sparkline(tenantTurn, {
      type: "bar",
      height: "226",
      barSpacing: 10,
      barWidth: 24,
      barHeight: 24,
      barColor: "#8fdbda"
    });
    $("#pie-chart-ArrearsPerYear").sparkline(ArrearsTurn, {
      type: "pie",
      height: "170",
      width: "170",
      offset: "+50",
      sliceColors: ["#a0eeed", "#81e970", "#f5af50", "#f46f50", "#e6df2c"]
    });
    
    
    $("#linechart-occupancyrate").sparkline(OccupancyRate, {
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
    
    
    
          
var ctx = document.getElementById("myChartBar").getContext('2d');
var myChartBar = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: tenantTurnDesc,
        datasets: [{
            label: 'Tenant Turnover',
            data: tenantTurn,
            backgroundColor: [
                '#F8B195',
                '#F67280',
                '#C06C84',
                '#6C5B7B',
                '#355C7D'
            ],
            borderColor: [
                '#F8B195',
                '#F67280',
                '#C06C84',
                '#6C5B7B',
                '#355C7D'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
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
                '#F8B195'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
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
                '#F8B195',
                '#F67280',
                '#C06C84',
                '#6C5B7B',
                '#355C7D',
                '#99B898'
            ],
            borderColor: [
                '#F8B195',
                '#F67280',
                '#C06C84',
                '#6C5B7B',
                '#355C7D',
                '#99B898'
            ]
        }]
    },
    options: {
            responsive : true
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
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195'
            ],
            borderColor: [
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195'
            ],
            borderWidth: 1
        },
        {
            label: 'Cost',
            data: CostvsMgtFeesCost,
            backgroundColor: [
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280'
            ],
            borderColor: [
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280'
            ],
            borderWidth: 1 
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
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
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195'
            ],
            backgroundColor: [
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195',
                '#F8B195'
            ],
            fill: true,
            borderWidth: 1
        },
        {
            label: 'Loss',
            data: WonVsLossdesc,
            borderColor: [
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280'
            ],
            backgroundColor: [
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280',
                '#F67280'
            ],
            fill : true,
            borderWidth: 1 
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
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



