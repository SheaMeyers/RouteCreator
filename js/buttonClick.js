/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function() {
    
    var address1;
    var address2;
    var address3;
     
    Address = Backbone.Model.extend({
        defaults: {
            address: "Not specified",
        },
        initialize: function(){
            console.log("address made");
        }
    });

    Addresses = Backbone.Collection.extend({
        model: Address
    });

     AddressView = Backbone.View.extend({

        events: {
            'click #routeButton':  'addAddress',
        },

        addAddress: function() {
            //console.log("Click recieved!!");
            address1 = $('#addressBox1').val();
            address2 = $('#addressBox2').val();
            address3 = $('#addressBox3').val();
        },

    });

    new AddressView({el: 'body'});

    var allAddresses = new Addresses([ address1, address2, address3]);
    console.log( allAddresses.models );
});
