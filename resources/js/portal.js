var baseUrl = "http://116.93.120.29:8080/portal/";
var email;
var firstname;
var userID;
var userType;
var id;
var dbname;
var type;
var branch;

function loginOnload(){
    $('.login-btn').keyup(function(event) {
        if (event.keyCode === 13) {
            login();
        }
    });
    
}

function login() {
    
    var datas = $('#loginForm').serialize();
    var clientid = $('#clientid').val();
    console.log(datas);
    jQuery.ajax({
        type: 'POST',
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + "loginservlet?jsonformat=jsonp&action=auth&clientid=" + clientid,
        data: datas,
        success: function(response) {
            
            console.log(response);
            
//            if(response.success){
//                alert('test');
//                window.location.href = './main.html';
//            }
            
//            if (response.success) {
//                var dataList = $('#loginForm').serializeArray().reduce(function(obj, item) {
//                    obj[item.name] = item.value;
//                    return obj;
//                }, {});
//                window.location.href = 'main.html';
//            } else {
//                alert(response.message);
//                alert(response.error);
//                
//                window.reload();
//            }

        }
    });
}
function confirmLogout(){
    try {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function() {
            console.log('User signed out.');
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

function chksessionOnIndex() {
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'checksession?jsonformat=jsonp',
        xhrFields: { withCredentials: true },
        success: function(response) {
            if (response.success) {
                window.location = "./main.html";
            } else
            {
                window.location = "./login.html";
            }
        }});
}

function chksessionOnLogin() {
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "logincallback",
        crossDomain: true,
        dataType: 'jsonp',
        xhrFields: { withCredentials: true },
        url: baseUrl + "checksession?jsonformat=jsonp",
        success: function(response) {
            
        }
    });
}

function chksessionOnMain() {
 
    jQuery.ajax({
        type: 'POST',
        crossDomain: true,
        xhrFields: { withCredentials: true },
        dataType: 'jsonp',
        url: baseUrl + "checksession?jsonformat=jsonp"
    });
}

function logoutcallback(response) {
    if (response.success) {
        email = null;
        firstname = null;
        userID = null;
        userType = null;
        setCookie('JSESSIONID','');
        window.location.href = './login.html';
    }
}

function userscallback(response) {
    if (response.success) {
        if(response.usage == 'getExactUsers'){
           var arr = response.data[0];
           console.log(arr);
           $('#user').replaceWith('<span style ="font-size: 12pt;font-family: calibri;color:#000" id ="user">' + arr.FullName + " <br> " + arr.Branch +" - " +arr.BranchDesc+ ' </span>');
           $('#user-mobile').replaceWith('<span style ="font-size: 10pt;font-family: calibri;color:#000" id ="user">' + arr.FullName + " <br> " + arr.Branch +" - " +arr.BranchDesc+ ' </span>');
           //$('#Email').replaceWith('<label style = "font-size:11pt;font-family:Calibri;font-weight:100">E-mail : ' + arr.EmailAddress + '</label>'); 
           
        }
    } else {
        window.location = "./main.html";
    }
}

function companycallback(response){
    var arr = response.data[0];
//    console.log(arr);
//    console.log(arr.CompanyName);
    $('.company-name').replaceWith('&nbsp;<span class ="company-name" style ="font-family: calibri;font-size: 25px;letter-spacing: 0;font-weight: 100;color:#d4d7dd"><b>'+arr.CompanyName+'</b></span>');
    
}


function logincallback(response) {
    if(response.success){
        console.log(response);
//    alert('dito');
//    var pageLoc = getURL();// window.location.href;
//
//    var indx = pageLoc.lastIndexOf('/') + 1;
//    var curPage = pageLoc.substring(indx, pageLoc.length);

    email = response.email;
    firstname = response.FirstName;
    userID = response.UserID;
    userType = response.Usertype;
    dbname = response.dbname;
    type = response.Type;
    
    //document.cookie = "JSESSIONID="+response.sessionid+"";
    setCookie('JSESSIONID', response.sessionid);
    setCookie('Branch', response.Branch);
    setCookie('UserID', response.UserID);
    
    
    if (email == null && curPage != 'login.html') {
        window.location.href = baseUrl + "login.html"; 
    }else if(email){
        window.location.href = baseUrl + "main.html";
    }else{
        
    }
    
    }else{
//        console.log(response.message);
        $('#error-block').css('display','block');
        $('#error-message').html(response.message);
    }
    
}



function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function callback(response) {
    
    

    var pageLoc = window.location.href;

    var indx = pageLoc.lastIndexOf('/') + 1;
    var curPage = pageLoc.substring(indx, pageLoc.length);

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
//    console.log(companyid);
    
//    document.cookie=userID;

    $('input.number').keyup(function(event) {

    // skip for arrow keys
    if(event.which >= 37 && event.which <= 40){
        event.preventDefault();
    }
    
    $(this).val(function(index, value) {
            value = value.replace(/,/g,'');
            return numberWithCommas(value);
        });

  });
  
  
   $('#company-logo').replaceWith('<img id ="company-logo" src ="./resources/image/'+companyid+'.png" alt ="Company Logo" class ="img-tmp img-center" style ="width:55px;height: 40px;padding: 0;margin-top: -15px">');
   $('#company-logo-mobile').replaceWith('<img id ="company-logo" src ="./resources/image/'+companyid+'.png" alt ="Company Logo" class ="" style ="margin-top: 5px;width: 55px;height: 35px;margin-right: 10px">');
  
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'companylist?jsonformat=jsonp&exactOnly=true&company=' + companyid
    });
    
    
    if (email == null && curPage != 'login.html') {
        window.location.href = "./login.html";
    }else if(email){
        
        if(curPage == 'login.html' || curPage == 'index.html'){
            window.location.href = "./main.html";
        }else{
            
            $('#dbname').replaceWith('<strong><span style ="color: #fff;padding:0 0 0 10px;font-family: calibri;font-size:10pt" id ="dbname">' + dbname + '</span></strong>');
            var substringName = email.substring(0, 1);
            $('.initial-companyid').replaceWith('<span class ="initial-companyid">' + substringName + '<span>');
            $('#myaccount-email').replaceWith('<span style ="font-size: 10pt;font-family:calibri;margin-left:10px;color:#d4d7dd" class ="myaccount-email">(' + email + ')</span>');
            
            
           
            if (email) {

                jQuery.ajax({
                    type: 'POST',
                    jsonpCallback: "callback",
                    crossDomain: true,
                    dataType: 'jsonp',
                    url: baseUrl + 'userslist?jsonformat=jsonp&exactOnly=' + userID
                });

//               jQuery.ajax({
//                    type: 'POST',
//                    jsonpCallback: "callback",
//                    crossDomain: true,
//                    dataType: 'jsonp',
//                    url: baseUrl + 'customerlist?jsonformat=jsonp&exactOnly=' + email
//                });
//
//                jQuery.ajax({
//                    type: 'POST',
//                    jsonpCallback: "callback",
//                    crossDomain: true,
//                    dataType: 'jsonp',
//                    url: baseUrl + 'customerlist?jsonformat=jsonp&BrokerEmail=' + email
//                });
//
//                jQuery.ajax({
//                    type: 'POST',
//                    jsonpCallback: "callback",
//                    crossDomain: true,
//                    dataType: 'jsonp',
//                    url: baseUrl + 'customerlist?jsonformat=jsonp&SalesPersonEmail=' + email
//                });

                

                
//                
//                jQuery.ajax({
//                    type: 'POST',
//                    crossDomain: true,
//                    dataType: 'jsonp',
//                    url: baseUrl + 'demographicslist?jsonformat=jsonp&forcity=true'
//                });
//                
//                jQuery.ajax({
//                    type: 'POST',
//                    jsonpCallback: "callback",
//                    crossDomain: true,
//                    dataType: 'jsonp',
//                    url: baseUrl + 'udftablelist?jsonformat=jsonp&TableName=City'
//                });
                
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
                
                
            }
        }
    }
    
    
    
}



function hideshowMenu() {

//    alert('test');
    $('#sidebarCollapse').css('margin-left', '0px');
    $('#sidebar').toggleClass('active');
    if ($('#sidebar').hasClass('active')) {
    } else {
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
function closePromptRecorsFound(){
    $('#PromptRecorsFound').modal("toggle");
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

function changeLoginDisplay(test){
    var loginType = $(test).attr('loginType');
    $('#LoginType').empty();
    $('#LoginType').html(loginType);
}

function showMoreOptions(){
    $('#other-options').css('display','block');
    $('#showMoreOptions').css('display','none');
    $('#hideMoreOptions').css('display','block');
}
function hideMoreOptions(){
    $('#other-options').css('display','none');
    $('#hideMoreOptions').css('display','none');
    $('#showMoreOptions').css('display','block');
}


