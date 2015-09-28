/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function() {
        
    var addresses = [];
    var toGoTo = [];
    var allAddresses;
     
    var AddressModel = Backbone.Model.extend({
        defaults: {
            address: '',
        },
        initialize: function(){}
    });

    var AddressCollection = Backbone.Collection.extend({
        model: AddressModel
    });

    var AddressView = Backbone.View.extend({

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
            
            allAddresses = new AddressCollection(addresses);
              
            allAddresses.each(function(currentAddressModel) {
               var getval = currentAddressModel.get('address');
               toGoTo.push(getval)
            });

            this.getDistances();
        },
        
        getDistances: function(){
             var service = new google.maps.DistanceMatrixService();
            
            for(var i=0; i<toGoTo.length; i++){
                for(var j=0; j<toGoTo.length; j++){
                    if(i !== j) {
                        
                        service.getDistanceMatrix(
                        {
                            origins: [toGoTo[i]],
                            destinations: [toGoTo[j]],
                            travelMode: google.maps.DirectionsTravelMode.DRIVING
                        }, function callback(response, status) {
                            if (status == google.maps.DistanceMatrixStatus.OK) {
                              var origins = response.originAddresses;
                              var destinations = response.destinationAddresses;

                              for (var i = 0; i < origins.length; i++) {
                                var results = response.rows[i].elements;
                                for (var j = 0; j < results.length; j++) {
                                  var element = results[j];
                                  var distance = element.distance.text;
                                  var duration = element.duration.text;
                                  var from = origins[i];
                                  var to = destinations[j];

                                  //Use parseInt(distance.substring(0, distance.length-3))
                                  //   to get distance into an integer
                                  //Just need distance.substring(0, distance.length-3)
                                  
                                  //Example from Google Directions API
                                  //https://maps.googleapis.com/maps/api/directions/json?origin=48+Pirrama+Rd,+Pyrmont,+NSW,+Australia&destination=122+Flinders+St,+Darlinghurst,+NSW,+Australia&sensor=false&key=AIzaSyDOKNVX7py5AypCbvqQTEkcPPfkXHFkOuw

                                  console.log('distance ' + distance + 
                                                ' duration ' + duration +
                                                ' from ' + from +
                                                ' to ' + to);
                                }
                              }
                            }
                          });
                    }
                }
            }
        },
        
        
    });

    new AddressView({el: 'body'});    
});
