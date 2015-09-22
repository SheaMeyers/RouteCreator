/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function() {
        
    var addresses = [];
     
    var AddressModel = Backbone.Model.extend({
        defaults: {
            address: '',
        },
        initialize: function(){}
    });

    var AddressCollection = Backbone.Collection.extend({
        model: AddressModel
    });

     AddressView = Backbone.View.extend({

        events: {
            'click #routeButton':  'addAddress',
        },

        addAddress: function() {
            var clicks = $("#valueHolder").text();
            
            if(clicks < 3){clicks = 3};
            
            for(var i=1; i<=clicks; i++)
            {
                var val = '#addressBox' + i;
                var currentAddress = $(val).val();
                var currentAddressModel = new AddressModel({address: currentAddress});
                addresses.push(currentAddressModel);
            }
            
            var allAddresses = new AddressCollection(addresses);
              
              //Below loops through all models in the collection and gets 
              //   it's address
//            allAddresses.each(function(currentAddressModel) {
//               var getval = currentAddressModel.get('address');
//               console.log('getval ' + getval);
//            });
        },
    });

    new AddressView({el: 'body'});    
});
