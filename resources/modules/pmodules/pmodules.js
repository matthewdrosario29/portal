/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var baseUrl = "http://localhost:8080/portal/";

var moduleArr = [];
function pmodulescallback(response) {
    if (response.success) {

        if (response.usage == 'getListModules') {
            var arr = response.data;

//            for (var i = 0; i < arr.length; i++) {
//                $('#navbar-modules').append('<li class="pmodules" id = "' + arr[i].ModuleGroup + '"><a href = "#" style = "font-size:1.2em" onclick ="loadHtmlForm(\'' + arr[i].ModuleGroup + '\',\'' + arr[i].ModuleName + '\');">&nbsp;' + arr[i].ModuleName + ' </a>'
//                        + '</li>');
//                if(arr.length > 1){
//                   if(i == 0){
//                        $('.pmodules').addClass('active');
//                   }
//               }else{
//                   if(i == 0){
//                        $('.pmodules').addClass('active');
//                   }
//               }
//
//            }
        }

        else if (response.usage == 'getUserrightsModules') {
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
                $('#membersTab').append('<li class="mytab">'
                        + '<a href="#' + arr[i].SubModule + '" data-toggle="tab"  onclick ="RemoveTab();"><span class ="glyphicon glyphicon-user"></span></a></li>');
            }
        }

        else if (response.usage == 'getAllModules') {
            
            var data = response.data;
            localStorage.setItem('Modules', JSON.stringify(data));
            var mg = 'charts';
            var sm = 'charts';
            var md = 'Charts';
//            $('#menu-content').append('<li data-toggle="collapse" data-target="#charts" class="collapsed li-charts" onclick="loadHtmlForm("charts","charts","Charts");"><a href="#">&nbsp; Home</a></li>');
//            $('.mobile-tab').append('<li class = "active" onclick ="loadHtmlForm(\'' + mg + '\',\'' + sm + '\',\'' + md + '\');" ><a href="#Home" class = "noWrapText" aria-controls="Home" role="tab" data-toggle="tab">Home</a></li>');
//            for(var j=0;j < data.length; j++){
//                $('.mobile-tab').append('<li onclick ="loadHtmlForm(\'' + data[j].ModuleGroup + '\',\'' + data[j].SubModule + '\',\'' + data[j].ModuleName + '\');"><a href="#"'+ data[j].Form + ' class = "noWrapText" aria-controls='+ data[j].Form + ' role="tab" data-toggle="tab">'+ data[j].Form + '</a></li>');
//            }          
            var modulegroup = '';
            var count = 0;

            var str = '';

            for(var i=0; i< data.length; i++){
                if(i==0){
                    modulegroup = data[i].ModuleGroup;
                    str += '<li data-toggle="collapse" data-target="#'+data[i].ModuleGroup+'" class="collapsed li-'+data[i].ModuleGroup+'" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" >&nbsp; ' + data[i].ModuleName;
                }else{
                    if(modulegroup == data[i].ModuleGroup){
                        if(count == 0){
                            str += '<span class="arrow"></span></a></li>';
                        }
                        count++;
                        if(count == 1){
                            str += '<ul class="sub-menu collapse" id="'+data[i].ModuleGroup+'">';
                            str += '<li class = "collapsed li-'+data[i].SubModule+'" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i-1].SubModule + '\',\'' + data[i-1].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important">&nbsp; '+data[i-1].Form+'</a></li>';
                            str += '<li class = "collapsed li-'+data[i].SubModule+'" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important">&nbsp; '+data[i].Form+'</a></li>';
                        }else{
                            str += '<li class = "collapsed li-'+data[i].SubModule+'" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important">&nbsp; '+data[i].Form+'</a></li>';
                        }
                    }else{
//                        console.log(count);
                        if(count == 0){
                            str += '</a></li>';
                        }else{
                            str += '</ul>';
                            count = 0;
                        }
                        modulegroup = data[i].ModuleGroup;
                        str += '<li data-toggle="collapse" data-target="#'+data[i].ModuleGroup+'" class="collapsed li-'+data[i].ModuleGroup+'" ><a href="#" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');">&nbsp; ' + data[i].ModuleName;
                    }
                }
            }
            if(count == 0){
                str += '</a></li>';
            }else{
                str += '</ul>';
            }
            $('#menu-content').append(str);

            
        }
    }
}







