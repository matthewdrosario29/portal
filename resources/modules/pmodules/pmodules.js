/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var baseUrl = "http://116.93.120.29:8080/portal/";

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
            var modulegroup = '';
            var count = 0;

            var str = '';

            for(var i=0; i< data.length; i++){
                if(i==0){
                    modulegroup = data[i].ModuleGroup;
                    str += '<li data-toggle="collapse" data-target="#'+data[i].ModuleGroup+'" class="collapsed" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" ><span class ="fa fa-file-o " style = "color:#000"></span>&nbsp; ' + data[i].ModuleName;
                }else{
                    if(modulegroup == data[i].ModuleGroup){
                        if(count == 0){
                            str += '<span class="arrow"></span></a></li>';
                        }
                        count++;
                        if(count == 1){
                            str += '<ul class="sub-menu collapse" id="'+data[i].ModuleGroup+'">';
                            str += '<li onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important"><span class ="fa fa-file-o " style = "color:#000"></span>&nbsp; '+data[i-1].Form+'</a></li>';
                            str += '<li onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important"><span class ="fa fa-file-o " style = "color:#000"></span>&nbsp; '+data[i].Form+'</a></li>';
                        }else{
                            str += '<li onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important"><span class ="fa fa-file-o " style = "color:#000"></span>&nbsp; '+data[i].Form+'</a></li>';
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
                        str += '<li data-toggle="collapse" data-target="#'+data[i].ModuleGroup+'" class="collapsed" ><a href="#" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><span class ="fa fa-file-o " style = "color:#000"></span>&nbsp; ' + data[i].ModuleName;
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







