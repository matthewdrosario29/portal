/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function bankdetailsOnload(){
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'PModuleslist?jsonformat=jsonp&forUserrights=true&ModuleGroup=bankdetails'
    });
    
    $("#includePrompts").load("../../lookup/lookup.html");
    
}


function pmodulescallback(response){
    
    if (response.success){
        if (response.usage == 'getUserrightsModules'){
            var arr = response.data;
            for (var i = 0; i < arr.length; i++) {
               $('#bankdetailsTab').append('<li class="mytab">'
                                        +'<a href="#'+arr[i].SubModule+'" data-toggle="tab"  onclick ="RemoveTab();"><span class ="fa fa-money"></span> '+arr[i].Form+' </a>'
                                        +'</li>');
                
               
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

