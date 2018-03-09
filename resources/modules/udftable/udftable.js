/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function udftablecallback(response){
    if (response.success){
        if (response.usage == 'getudfTable')
            {
                var arr = response.data;
                for (var i = 0; i < arr.length; i++) {
                    
//                    $("#CityEdit").append($("<option></option>",{
//                        value:arr[i].ShortDesc,
//                        text:arr[i].LongDesc
//                    }));
//                    
//                    $('#City').append($("<option></option>",{
//                        value:arr[i].ShortDesc,
//                        text:arr[i].LongDesc
//                    }));
                }
            }
    }
}

function demographicscallback(response){
    if (response.success){
        if(response.usage == 'getCity'){
            var arr = response.data;
//            console.log(arr);
             $("#City").append('<option disabled selected>--Select City--</option>');
            for(var i = 0; i < arr.length; i++){
              
               $("#City").append($("<option></option>",{
                        value:arr[i].City,
                        text:arr[i].City
                    })); 
                    
              $("#CityEdit").append($("<option></option>",{
                        value:arr[i].City,
                        text:arr[i].City
                    })); 
            }
        }
    }
}