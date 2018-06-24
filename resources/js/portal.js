var baseUrl = "http://116.93.120.29:8080/portal/";
var email;
var firstname;
var userID;
var userType;
var id;
var dbname;
var type;
var branch;


var forLocal;
var connected;

var clientid;

/*
window.setInterval(function() {

    var pageLoc = window.location.href;
    var indx = pageLoc.lastIndexOf('/') + 1;
    var curPage = pageLoc.substring(indx, pageLoc.length);

    if (curPage != 'login.html') {
        if (localStorage.getItem('connected') != 'false') {
            checkConnection(true, function() {

                //pag meron, check kung may nakasave na nacredentials
                var objArray = JSON.parse(localStorage.getItem('Access'));
                if (objArray == null) {
                    //pag walang credentials, balik sa login
                    window.location.href = './login.html';
                } else {
                    //pag meron, check kung may active session sa db
                    jQuery.ajax({
                        type: 'POST',
                        jsonpCallback: "callback",
                        crossDomain: true,
                        dataType: 'jsonp',
                        url: baseUrl + 'checksession?jsonformat=jsonp',
                        xhrFields: {withCredentials: true}
//                success: function(response) {
//                    if (response.success) {
//                        window.location = "./main.html";
//                    } else
//                    {
//                        window.location = "./login.html";
//                    }
//                }
                    });
                }

            }, function() {

                //pag walang internet, check kung may credentials na nakasave
                var objArray = JSON.parse(localStorage.getItem('Access'));
                if (objArray == null) {
                    //pag walang credentials, balik sa login
                    window.location.href = './login.html';
                } else {
                    window.location.href = './main.html';
                }
            }, true);

//            //('3');
//
//            var objArray = JSON.parse(localStorage.getItem('Access'));
//            console.log(objArray);
//            if (objArray == null) {
//                window.location.href = './login.html';
//            }
//            jQuery.ajax({
//                type: 'POST',
//                jsonpCallback: "callback",
//                crossDomain: true,
//                dataType: 'jsonp',
//                url: baseUrl + 'checksession?jsonformat=jsonp',
//                xhrFields: {withCredentials: true},
//                success: function(response) {
//                    if (response.success) {
////                window.location = "./main.html";
//                    } else
//                    {
////                window.location = "./login.html";
//                    }
//                }});
        }
    }

}, 5000);
*/

function loginOnload() {


    $('.login-btn').keyup(function(event) {
        if (event.keyCode === 13) {
            login();
        }
    });

    var cookies = document.cookie;
    cookies = cookies.split("; ");
    var obj1 = new Object();
    for (var i = 0; i < cookies.length; i++) {
        var cookies_tmp = cookies[i].split("=");
        try {
            eval('obj1.' + cookies_tmp[0] + ' = "' + cookies_tmp[1] + '"');
        } catch (e) {

        }
    }


    //set Values from cookies



    if (obj1.Email != null) {

        $('#email').val(formatValue(obj1.Email.replace('%40', '@'), true));
        $('.checkbox-remember').prop('checked', 'checked');
    }
    $('#companyid').val(formatValue(obj1.CompanyID, true));
    $('#clientid').val(formatValue(obj1.DbName, true));



}


var StorageName = 'Access';
function login(createsession) {


//    var localstore_access = [];
//    var companyid = $('#companyid').val();
//    var email = $('#email').val();
//    var password = $('#password').val();
//    var dbname = $('#clientid').val();
//    var obj = new Object();
//    obj.CompanyID = $('#companyid').val();
//    obj.Email = $('#email').val();
//    obj.Password = $('#password').val();
//    obj.ClientID = $('#clientid').val();
//    localstore_access.push(obj);






    if (createsession) {
        
        var objArray = JSON.parse(localStorage.getItem('Access'));
        var dataObj = new Object();
        dataObj.email = objArray[0].email;
        dataObj.companyid = objArray[0].CompanyID;
        dataObj.clientid = objArray[0].clientname;
        jQuery.ajax({
            type: 'POST',
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + "loginservlet?jsonformat=jsonp&action=auth&clientid=" + objArray[0].clientname + '&Key=' + objArray[0].Key,
            data: dataObj,
            success: function(response) {
                
                if(response.success){
                    
                }
                
            }
        });


    } else {
        if (localStorage.getItem('connected') != 'false') {
            var datas = $('#loginForm').serialize();
            clientid = $('#clientid').val();
            jQuery.ajax({
                type: 'POST',
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + "loginservlet?jsonformat=jsonp&action=auth&clientid=" + clientid + '&toUpdatekey=true',
                data: datas,
                success: function(response) {

                }
            });
        } else {
            $('#error-block').show();
            $('#error-message').empty();
            $('#error-message').html('Canno Reach Server. Please check your connection.');
        }
    }


}
function confirmLogout() {
    try {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function() {
        });

    } catch (e) {
        console.log(e);
    }
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + "logoutservlet?jsonformat=jsonp"
    });
}

function logout() {
    $('#MsgAlertConfirmLogout').modal('show');
}


function getlocalStorage() {

    var localStore_access_arr = [];
    var localStore_access;
    localStore_access = localStorage.getItem(StorageName);
    console.log(localStore_access);
    localStore_access = localStore_access.split("&");
    var obj_Access = new Object();
    for (var i = 0; i < localStore_access.length; i++) {
        var localStore_access_tmp = localStore_access[i].split("=");
        try {
            eval('obj_Access.' + localStore_access_tmp[0] + ' = "' + localStore_access_tmp[1] + '"');
        } catch (e) {

        }
    }
    localStore_access_arr.push(obj_Access);

//    return localStore_access_arr;
}

function chksessionOnIndex() {


    //check kung may internet
    checkConnection(true, function() {
        //pag meron, check kung may nakasave na nacredentials
        var objArray = JSON.parse(localStorage.getItem('Access'));
        if (objArray == null) {
            //pag walang credentials, balik sa login
            window.location.href = './login.html';
        } else {
            //pag meron, check kung may active session sa db
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'checksession?jsonformat=jsonp',
                xhrFields: {withCredentials: true}
//                success: function(response) {
//                    if (response.success) {
//                        window.location = "./main.html";
//                    } else
//                    {
//                        window.location = "./login.html";
//                    }
//                }
            });
        }

    }, function() {
        //pag walang internet, check kung may credentials na nakasave
        var objArray = JSON.parse(localStorage.getItem('Access'));
        if (objArray == null) {
            //pag walang credentials, balik sa login
            window.location.href = './login.html';
        } else {
            window.location.href = './main.html';
        }
    });


    var objArray = JSON.parse(localStorage.getItem('Access'));
    console.log(objArray);
    if (objArray == null) {
        window.location.href = './login.html';
    }
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'checksession?jsonformat=jsonp',
        xhrFields: {withCredentials: true},
        success: function(response) {
            if (response.success) {
//                window.location = "./main.html";
            } else
            {
//                window.location = "./login.html";
            }
        }});
}

function chksessionOnLogin() {

    checkConnection(true, function() {
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "logincallback",
            crossDomain: true,
            dataType: 'jsonp',
            xhrFields: {withCredentials: true},
            url: baseUrl + "checksession?jsonformat=jsonp&callback_function=logincallback",
            success: function(response) {

            }
        });
    }, function() {
        var objArray = JSON.parse(localStorage.getItem('Access'));
        console.log(objArray);
        if (objArray == null) {
            //pag walang credentials,  walang gagawin
        } else {
            window.location.href = './main.html';
        }
        //////('404');
    });

//    jQuery.ajax({
//        type: 'POST',
//        jsonpCallback: "logincallback",
//        crossDomain: true,
//        dataType: 'jsonp',
//        xhrFields: {withCredentials: true},
//        url: baseUrl + "checksession?jsonformat=jsonp",
//        success: function(response) {
//
//        }
//    });
}

function chksessionOnMain() {

//    console.log(generateKey());
    checkConnection(true, function() {

        //////('connected to');
        jQuery.ajax({
            type: 'POST',
            crossDomain: true,
            xhrFields: {withCredentials: true},
            dataType: 'jsonp',
            url: baseUrl + "checksession?jsonformat=jsonp"
        });
    }, function() {
        //////('not connected to');

        var data = JSON.parse(localStorage.getItem('Modules'));
        var mg = 'charts';
        var sm = 'charts';
        var md = 'Charts';
        $('.mobile-tab').append('<li class = "active" onclick ="loadHtmlForm(\'' + mg + '\',\'' + sm + '\',\'' + md + '\');" ><a href="#Home" class = "noWrapText" aria-controls="Home" role="tab" data-toggle="tab">Home</a></li>');
        for (var j = 0; j < data.length; j++) {
            $('.mobile-tab').append('<li onclick ="loadHtmlForm(\'' + data[j].ModuleGroup + '\',\'' + data[j].SubModule + '\',\'' + data[j].ModuleName + '\');"><a href="#"' + data[j].Form + ' class = "noWrapText" aria-controls=' + data[j].Form + ' role="tab" data-toggle="tab">' + data[j].Form + '</a></li>');
        }
        var modulegroup = '';
        var count = 0;

        var str = '';

        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                modulegroup = data[i].ModuleGroup;
                str += '<li data-toggle="collapse" data-target="#' + data[i].ModuleGroup + '" class="collapsed li-' + data[i].ModuleGroup + '" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" >&nbsp; ' + data[i].ModuleName;
            } else {
                if (modulegroup == data[i].ModuleGroup) {
                    if (count == 0) {
                        str += '<span class="arrow"></span></a></li>';
                    }
                    count++;
                    if (count == 1) {
                        str += '<ul class="sub-menu collapse" id="' + data[i].ModuleGroup + '">';
                        str += '<li class = "collapsed li-' + data[i].SubModule + '" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i - 1].SubModule + '\',\'' + data[i - 1].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important">&nbsp; ' + data[i - 1].Form + '</a></li>';
                        str += '<li class = "collapsed li-' + data[i].SubModule + '" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important">&nbsp; ' + data[i].Form + '</a></li>';
                    } else {
                        str += '<li class = "collapsed li-' + data[i].SubModule + '" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important">&nbsp; ' + data[i].Form + '</a></li>';
                    }
                } else {
                    //                        console.log(count);
                    if (count == 0) {
                        str += '</a></li>';
                    } else {
                        str += '</ul>';
                        count = 0;
                    }
                    modulegroup = data[i].ModuleGroup;
                    str += '<li data-toggle="collapse" data-target="#' + data[i].ModuleGroup + '" class="collapsed li-' + data[i].ModuleGroup + '" ><a href="#" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');">&nbsp; ' + data[i].ModuleName;
                }
            }
        }
        if (count == 0) {
            str += '</a></li>';
        } else {
            str += '</ul>';
        }
        $('#menu-content').append(str);

    });


}

function logoutcallback(response) {
    if (response.success) {


        email = null;
        firstname = null;
        userID = null;
        userType = null;
        setCookie('JSESSIONID', '');
        window.location.href = './login.html';

        localStorage.removeItem('Access');
        localStorage.removeItem('Modules');
        localStorage.removeItem('connected');



    }
}

function userscallback(response) {
    if (response.success) {
        if (response.usage == 'getExactUsers') {
            var arr = response.data[0];
//           console.log(arr);
            $('#user').replaceWith('<span style ="font-size: 12pt;font-family: calibri;color:#000" id ="user">' + arr.FullName + " <br> " + arr.Branch + " - " + arr.BranchDesc + ' </span>');
            $('#user-mobile').replaceWith('<span style ="font-size: 10pt;font-family: calibri;color:#000" id ="user">' + arr.FullName + " <br> " + arr.Branch + " - " + arr.BranchDesc + ' </span>');
            //$('#Email').replaceWith('<label style = "font-size:11pt;font-family:Calibri;font-weight:100">E-mail : ' + arr.EmailAddress + '</label>'); 

//           setCookie('CompanyID', arr.G01);

        }
    } else {
        window.location = "./main.html";
    }
}

function companycallback(response) {
    var arr = response.data[0];
//    console.log(arr);
//    console.log(arr.CompanyName);
    $('.company-name').replaceWith('&nbsp;<span class ="company-name" style ="font-family: calibri;font-size: 25px;letter-spacing: 0;font-weight: 100;color:#d4d7dd"><b>' + arr.CompanyName + '</b></span>');

}


function logincallback(response) {
    //////('login callback');

    //('success');

    var pageLoc = window.location.href;
    var indx = pageLoc.lastIndexOf('/') + 1;
    var curPage = pageLoc.substring(indx, pageLoc.length);
    console.log(response);
    if (response.success) {
        
//        window.location.href = baseUrl + "main.html";

        var credentials = JSON.parse(localStorage.getItem('Access'));
        
        companyid = response.companyid;
        firstname = response.FirstName;
        userID = response.UserID;
        userType = response.Usertype;
        dbname = response.dbname;
        type = response.Type;
        clientdbname = response.clientdbname;
        email = response.email;
//
//        var datas = [];
//        var obj = new Object();
//        obj.email = response.email;
//        obj.FirstName = response.FirstName;
//        obj.MiddleName = response.MiddleName;
//        obj.lastName = response.LastName;
//        obj.UserID = response.UserID;
//        obj.Usertype = response.Usertype;
//        obj.dbname = response.dbname;
//        obj.Type = response.Type;
//        obj.Branch = response.Branch;
//        obj.CompanyID = response.CompanyID;
//        obj.Key = response.Key;
//        obj.clientname = response.clientname;
//        datas.push(obj);
//
//
//        localStorage.setItem('Access', JSON.stringify(datas));
        setCookie('JSESSIONID', response.sessionid);
        setCookie('Branch', response.Branch);
        setCookie('UserID', response.UserID);
        if (email == null && curPage != 'login.html') {
            window.location.href = baseUrl + "login.html";
        }
        else if (email) {
            ('dito 1');
            if ($('.checkbox-remember').prop('checked') == true) {
                setCookie('Email', response.email);
                setCookie('DbName', response.clientdbname);
                setCookie('CompanyID', response.CompanyID);
            }
            window.location.href = baseUrl + "main.html";
        }

    } else {
        if (response.message) {
            $('#error-block').css('display', 'block');
            $('#error-message').html(response.message);
        }
    }

}



function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function callback(response) {

    //////('hello');
    var pageLoc = window.location.href;
    var indx = pageLoc.lastIndexOf('/') + 1;
    var curPage = pageLoc.substring(indx, pageLoc.length);

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


    if (response.email && response.UserID && response.email != "null" && response.UserID != "null") {
        ('if1');
        if (curPage == 'main.html') {
            ('if2');
            email = response.email;
            firstname = response.FirstName;
            middleName = response.MiddleName;
            lastName = response.LastName;
            userID = response.UserID;
            userType = response.Usertype;
            dbname = response.dbname;
            type = response.Type;
            branch = response.Branch;
            companyid = response.CompanyID;

            var datas = [];
            var obj = new Object();
            obj.email = response.email;
            obj.FirstName = response.FirstName;
            obj.MiddleName = response.MiddleName;
            obj.lastName = response.LastName;
            obj.UserID = response.UserID;
            obj.Usertype = response.Usertype;
            obj.dbname = response.dbname;
            obj.Type = response.Type;
            obj.Branch = response.Branch;
            obj.CompanyID = response.CompanyID;
            obj.Key = response.Key;
            obj.clientname = response.clientname;
            datas.push(obj);

            localStorage.setItem('Access', JSON.stringify(datas));

            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'companylist?jsonformat=jsonp&exactOnly=true&company=' + companyid
            });

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
                url: baseUrl + 'PModuleslist?jsonformat=jsonp&listModules=true'
            });
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'PModuleslist?jsonformat=jsonp&getAllModules=true'
            });

            $('#company-logo').replaceWith('<img id ="company-logo" src ="./resources/image/' + companyid + '.png" alt ="Company Logo" class ="img-tmp img-center" style ="width:55px;height: 40px;padding: 0;margin-top: -15px">');
            $('#company-logo-mobile').replaceWith('<img id ="company-logo" src ="./resources/image/' + companyid + '.png" alt ="Company Logo" class ="" style ="margin-top: 5px;width: 55px;height: 35px;margin-right: 10px">');

        } else {
            ('else2');
            window.location.href = './main.html';
        }




    } else {

        //('test');

        login(true);
        //////('walang session');
        //////(curPage);
        if (curPage == 'main.html') {
            window.location.href = './login.html';
        } else {
            window.location.href = './main.html';
        }

        //pag wala syang session pero meron access, irelogin sa server

//        var datas = $('#loginForm').serialize();
//        
//        var objArray = JSON.parse(localStorage.getItem('Access'));
//        clientid = objArray[0].clientid;
//        clientid = objArray[0].clientid;
//        clientid = objArray[0].clientid;
//        clientid = objArray[0].clientid;
//
//        clientid = $('#clientid').val();
//
//        jQuery.ajax({
//            type: 'POST',
//            crossDomain: true,
//            dataType: 'jsonp',
//            url: baseUrl + "loginservlet?jsonformat=jsonp&action=auth&clientid=" + clientid,
//            data: datas,
//            success: function(response) {
//
//            }
//        });



//        var objArray = JSON.parse(localStorage.getItem('Access'));
//        console.log(objArray);
//        if(objArray == null){
////            window.location.href = './login.html';
//        }else{
//            window.location.href = './main.html';
//            
//            email = objArray[0].email;
//
//            var data = JSON.parse(localStorage.getItem('Modules'));
//            var mg = 'charts';
//            var sm = 'charts';
//            var md = 'Charts';
//            $('.mobile-tab').append('<li class = "active" onclick ="loadHtmlForm(\'' + mg + '\',\'' + sm + '\',\'' + md + '\');" ><a href="#Home" class = "noWrapText" aria-controls="Home" role="tab" data-toggle="tab">Home</a></li>');
//            for (var j = 0; j < data.length; j++) {
//                $('.mobile-tab').append('<li onclick ="loadHtmlForm(\'' + data[j].ModuleGroup + '\',\'' + data[j].SubModule + '\',\'' + data[j].ModuleName + '\');"><a href="#"' + data[j].Form + ' class = "noWrapText" aria-controls=' + data[j].Form + ' role="tab" data-toggle="tab">' + data[j].Form + '</a></li>');
//            }
//            var modulegroup = '';
//            var count = 0;
//
//            var str = '';
//
//            for (var i = 0; i < data.length; i++) {
//                if (i == 0) {
//                    modulegroup = data[i].ModuleGroup;
//                    str += '<li data-toggle="collapse" data-target="#' + data[i].ModuleGroup + '" class="collapsed li-' + data[i].ModuleGroup + '" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" >&nbsp; ' + data[i].ModuleName;
//                } else {
//                    if (modulegroup == data[i].ModuleGroup) {
//                        if (count == 0) {
//                            str += '<span class="arrow"></span></a></li>';
//                        }
//                        count++;
//                        if (count == 1) {
//                            str += '<ul class="sub-menu collapse" id="' + data[i].ModuleGroup + '">';
//                            str += '<li class = "collapsed li-' + data[i].SubModule + '" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i - 1].SubModule + '\',\'' + data[i - 1].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important">&nbsp; ' + data[i - 1].Form + '</a></li>';
//                            str += '<li class = "collapsed li-' + data[i].SubModule + '" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important">&nbsp; ' + data[i].Form + '</a></li>';
//                        } else {
//                            str += '<li class = "collapsed li-' + data[i].SubModule + '" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');"><a href="#" style = "font-size:1.0em !important">&nbsp; ' + data[i].Form + '</a></li>';
//                        }
//                    } else {
//                        //                        console.log(count);
//                        if (count == 0) {
//                            str += '</a></li>';
//                        } else {
//                            str += '</ul>';
//                            count = 0;
//                        }
//                        modulegroup = data[i].ModuleGroup;
//                        str += '<li data-toggle="collapse" data-target="#' + data[i].ModuleGroup + '" class="collapsed li-' + data[i].ModuleGroup + '" ><a href="#" onclick ="loadHtmlForm(\'' + data[i].ModuleGroup + '\',\'' + data[i].SubModule + '\',\'' + data[i].ModuleName + '\');">&nbsp; ' + data[i].ModuleName;
//                    }
//                }
//            }
//            if (count == 0) {
//                str += '</a></li>';
//            } else {
//                str += '</ul>';
//            }
//            $('#menu-content').append(str);
//        }
    }


//    if (email == null && curPage != 'login.html') {
//        window.location.href = "./login.html";
//    } else if (email) {
//
//        if (curPage == 'login.html' || curPage == 'index.html') {
//            window.location.href = "./main.html";
//        } else {
//            
//            if (email) {
//                if (connected) {
//                    jQuery.ajax({
//                        type: 'POST',
//                        jsonpCallback: "callback",
//                        crossDomain: true,
//                        dataType: 'jsonp',
//                        url: baseUrl + 'userslist?jsonformat=jsonp&exactOnly=' + userID
//                    });
//                    jQuery.ajax({
//                        type: 'POST',
//                        jsonpCallback: "callback",
//                        crossDomain: true,
//                        dataType: 'jsonp',
//                        url: baseUrl + 'PModuleslist?jsonformat=jsonp&listModules=true'
//                    });
//                    jQuery.ajax({
//                        type: 'POST',
//                        jsonpCallback: "callback",
//                        crossDomain: true,
//                        dataType: 'jsonp',
//                        url: baseUrl + 'PModuleslist?jsonformat=jsonp&getAllModules=true'
//                    });
//                } else {
//                    jQuery.ajax({
//                        type: 'POST',
//                        jsonpCallback: "callback",
//                        crossDomain: true,
//                        dataType: 'jsonp',
//                        url: baseUrl + 'userslist?jsonformat=jsonp&exactOnly=' + userID
//                    });
//
////                    jQuery.ajax({
////                        type: 'POST',
////                        jsonpCallback: "callback",
////                        crossDomain: true,
////                        dataType: 'jsonp',
////                        url: baseUrl + 'PModuleslist?jsonformat=jsonp&listModules=true'
////                    });
////                    jQuery.ajax({
////                        type: 'POST',
////                        jsonpCallback: "callback",
////                        crossDomain: true,
////                        dataType: 'jsonp',
////                        url: baseUrl + 'PModuleslist?jsonformat=jsonp&getAllModules=true'
////                    }); 
//                }
//            }
//        }
//    } else {
//
////        window.location.href = "./login.html";
//    }
}



function hideshowMenu() {

    $('#sidebarCollapse').css('margin-left', '0px');
    $('#sidebar').toggleClass('active');
    if ($('#sidebar').hasClass('active')) {
    } else {
        $('#sidebarCollapse').css('margin-left', '0px');
        $('#sidebarCollapse').css('margin-top', '-1px');
    }
}


function hideshowMenuOnMobile() {

    $('#sidebarCollapse').css('margin-left', '0px');
    $('#sidebar').toggleClass('active');
    if ($('#sidebar').hasClass('active')) {
        $('.adjust-margin-top').css('display', 'none');
        $('.adjust-iframe-margin').css('display', 'none');
    } else {
        $('.adjust-margin-top').css('display', 'block');
        $('.adjust-iframe-margin').css('display', 'block');
        $('#sidebarCollapse').css('margin-left', '0px');
        $('#sidebarCollapse').css('margin-top', '-1px');
    }
}

//function hideBodyshowMenu() {
//    $('#sidebarCollapse').css('margin-left', '0px');
//    $('#sidebar').toggleClass('active');
//    if ($('#sidebar').hasClass('active')) {
//    } else {
//        $('#sidebarCollapse').css('margin-left', '0px');
//        $('#sidebarCollapse').css('margin-top', '-1px');
//    }
//}
function iconChange() {
    if ($('#toggle-bar').hasClass('fa-bars')) {
        $('#toggle-bar').removeClass('fa-bars');
        $('#toggle-bar').addClass('fa-times');
    } else {
        $('#toggle-bar').removeClass('fa-times');
        $('#toggle-bar').addClass('fa-bars');
    }
}
function closeLookupreport() {
    $("#reportForm").modal("toggle");
}
function closeLookupDetails() {
    $("#requistionDetails").modal("toggle");
}
function closeBillingDetails() {
    $("#billingDetails").modal("toggle");
}
function closePromptRecorsFound() {
    $('#PromptRecorsFound').modal("toggle");
}

function setCookie(name, value) {

    var data = [encodeURIComponent(name) + '=' + encodeURIComponent(value)];
    document.cookie = data.join('; ');

}

function getCookie(name, keepDuplicates) {
    var values = [];
    var cookies = document.cookie.split(/; */);
    for (var i = 0; i < cookies.length; i++) {
        var details = cookies[i].split('=');
        if (details[0] == encodeURIComponent(name)) {
            values.push(decodeURIComponent(details[1].replace(/\+/g, '%20')));
        }

    }

    return (keepDuplicates ? values : values[0]);
}

function changeLoginDisplay(test) {
    var loginType = $(test).attr('loginType');
    $('#LoginType').empty();
    $('#LoginType').html(loginType);
}
function showMoreOptions() {
    $('#other-options').css('display', 'block');
    $('#showMoreOptions').css('display', 'none');
    $('#hideMoreOptions').css('display', 'block');
}
function hideMoreOptions() {
    $('#other-options').css('display', 'none');
    $('#hideMoreOptions').css('display', 'none');
    $('#showMoreOptions').css('display', 'block');
}


//function checkInternetConnection() {
//    jQuery.ajaxSetup({async: false});
//    re = "";
//    r = Math.round(Math.random() * 10000);
//    $.get("http://116.93.120.29:8080/portal/login.html", {subins: r}, function(d) {
//        re = true;
//    }).error(function() {
//        re = false;
//    });
//    return re;
//}

function showPassword() {
    $('#Password').removeAttr('type', 'password');
    $('#Password').attr('type', 'text');
    $('#showPassword').hide();
    $('#hidePassword').show();
}

function hidePassword() {
    $('#showPassword').show();
    $('#hidePassword').hide();
    $('#Password').removeAttr('type', 'text');
    $('#Password').attr('type', 'password');

}


function openAccount() {
    $("#iFrame").replaceWith('<iframe class ="adjust-iframe-margin " id ="iFrame" src ="./resources/modules/profile/profile.html" height ="99%" width = "100%" style ="border:0px;max-width: 100%;min-width:100%;width:100%;min-height:87vh;margin-top:-20px"></iframe>');
    $('.module-name').empty();
    $('.module-name').html('Account');
}
var localStore_access_arr = [];
function getlocalStorage() {

    var localStore_access = localStorage.getItem('Access');
    console.log(localStore_access);
    localStore_access = localStore_access.split("&");
    var obj_Access = new Object();
    for (var i = 0; i < localStore_access.length; i++) {
        var localStore_access_tmp = localStore_access[i].split("=");
        try {
            eval('obj_Access.' + localStore_access_tmp[0] + ' = "' + localStore_access_tmp[1] + '"');
        } catch (e) {

        }
    }
    localStore_access_arr.push(obj_Access);
    console.log(obj_Access);
}

function monitorConnection() {
    jQuery.ajax({
        type: 'POST',
        url: baseUrl + 'checksession?checkInternet=true&baseUrl=' + baseUrl,
        success: function(response) {
            var hasInternet = response.Connected;
            if (response.Connected) {
                localStorage.setItem('connected', hasInternet);
            } else {
                localStorage.setItem('connected', false);
                $('#banner-connection').show();
                $('#banner-connection').css('background', 'red');
                $('#status-connection').html('No Internet Connection');
            }

        },
        failure: function() {
            localStorage.setItem('connected', false);
            $('#banner-connection').show();
            $('#banner-connection').css('background', 'red');
            $('#status-connection').html('No Internet Connection');
        }
    });
}

function isConnected(response) {
//    ////("is connected function");
}


function generateKey() {
    var text = "";
    var possible = "ABCDEFGHIKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
function checkConnection(option, doIfConnected, doIfNotConnected, repeating) {
    //////('test');
    jQuery.ajax({
        type: 'POST',
        dataType: 'jsonp',
        timeout: 1000,
        jsonpCallback: "isConnected",
        url: baseUrl + 'checkinternet?jsonformat=jsonp&checkInternet=true&baseUrl=' + baseUrl,
        xhrFields: {withCredentials: true},
        success: function(response) {


            var hasInternet = response.Connected;
            connected = hasInternet;
            localStorage.setItem('connected', hasInternet);

            if (!repeating) {
                $('#banner-connection').show();
                $('#banner-connection').css('background', '#84c93a');
                $('#status-connection').html('Connected');
            }

            setTimeout(function() {
                $('#banner-connection').hide();
            }, 3000);
            doIfConnected();

//                        window.location.href = './main.html';
        }
        ,
        error: function(a, b, c) {
            ////('error');
            //console.log(response);
            console.log(a);
            console.log(b);
            console.log(c);
            localStorage.setItem('connected', false);
            doIfNotConnected();
            $('#banner-connection').show();
            $('#banner-connection').css('background', 'red');
            $('#status-connection').html('No Internet Connection');
        },
        failure: function() {
            ////('failure');
            doIfNotConnected();
            $('#banner-connection').show();
            $('#banner-connection').css('background', 'red');
            $('#status-connection').html('No Internet Connection');

        }
    });



}
