/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

       
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

        render: function(){
            $('#result').text('calculating...');
            this.addAddress();
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

            if(false) {
                //Example from Google Directions API
                //http://maps.googleapis.com/maps/api/directions/json?origin=Adelaide,SA&destination=Adelaide,SA&waypoints=optimize:true|Barossa+Valley,SA|Clare,SA|Connawarra,SA|McLaren+Vale,SA&key=AIzaSyDOKNVX7py5AypCbvqQTEkcPPfkXHFkOuw
                this.googleTravellingSalesman();
            }
            else {
                return this.getDistances();
            }
        },
        
        makeAjaxCall: function(url, completeCallback) {
            $.ajax({
                url: url,
                crossDoman: true,
                async: false,
                type: "GET",
                dataType: "json",
                complete: completeCallback
//                success: function(data){
//                    //console.log("\n\ndata " + data + "\n\n");
//                    //console.log("type of " + typeof(data));
//                }
            });
        },
        
        googleTravellingSalesman: function(){
            var urlBeginning = "https://maps.googleapis.com/maps/api/directions/json?origin=";
            var urlEnding = "&key=AIzaSyDOKNVX7py5AypCbvqQTEkcPPfkXHFkOuw";
            var urlRoutes = toGoTo[0].replace(/ /g,'') + "&destination=" +
                            toGoTo[0].replace(/ /g,'') + "&waypoints=optimize:true";
            
            for(var i=1; i<toGoTo.length; i++){
                urlRoutes += "|" + toGoTo[i].replace(/ /g,'');
            }
            
            var urlComplete = urlBeginning + urlRoutes + urlEnding;
            
            this.makeAjaxCall(urlComplete, function (xhr, status){
               if (typeof xhr.status == "number" &&
                ((xhr.status >= 400 && xhr.status < 600) ||
                    (xhr.status >= 200 && xhr.status < 300)
                    )) {
                    console.log("status " + xhr.status);
                    var value = xhr.responseText;
                    try {
                        //value = JSON.stringify(JSON.parse(value), null, 3);
                        //console.log("\n\nvalue " + value + "\n\n");
                        //console.log("typeof " + typeof(value));
                        var locationsArray = [];
                        value = value.replace(/{|}|},|:/g,' ');
                        value = value.replace(/"/g,' ')
                        valueArray = value.split("\n");
                        //This is adding all the cities to the array, in proper order
                        for(var i=0; i<valueArray.length; i++){
                            //console.log(valueArray[i]);
                            if(valueArray[i].indexOf('start_address') > -1){
                                locationsArray.push(valueArray[i].replace(/ /g,''));
                            }
                        }
                        //A simple printout of the cities to go to, in their order
                        for(var i=0; i<locationsArray.length; i++){
                            locationsArray[i] = locationsArray[i].replace('start_address','');
                            console.log(locationsArray[i]);
                        }
                    }
                    catch (e) {
                        console.log("\n\nerror " + e + "\n\n");
                    }
                }
            });
            
            console.log("urlComplete: " + urlComplete);
        },
        
        getDistances: function(){
            var self = this;
             var service = new google.maps.DistanceMatrixService();
             var vertex = [];
             var edge = [];
             var increments = 0;
            
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

//                                    console.log('distance ' + distance + 
//                                                  ' duration ' + duration +
//                                                  ' from ' + from +
//                                                  ' to ' + to);
                                    edge.push([from,to,parseInt(distance)]);
                                    increments = ++increments;
                                    if(vertex.indexOf(from) < 0){
                                        vertex.push(from);
                                    }
                                }
                              }
                              if(toGoTo.length*2 === increments){
                                  self.calculateRoute(vertex, edge);
                              }
                            }
                        });
                    }
                }
            }
        },
        
        calculateRoute: function(vertex, edge) {
            var graph = {};
            var dijkstra_result;
            var shortest = Number.POSITIVE_INFINITY;
            var shortest_place = "";
            var places = [];
            //Find shortest distance
            //That is new vertex[0]
            while(vertex.length > 1){
                places.push(vertex[0]);
                graph = {
                    vertex: vertex,
                    edge: edge
                };
                dijkstra_result = dijkstra(vertex[0], graph);
                for(var key in dijkstra_result){
                    if(dijkstra_result.hasOwnProperty(key)){
                        if(dijkstra_result[key] < shortest){
                            shortest_place = key;
                        }
                    };
                }
                vertex.splice(vertex.indexOf(shortest_place), 1);
                vertex[0] = shortest_place;
                shortest = Number.POSITIVE_INFINITY;
            }
            places.push(vertex[0]);

            //$('#result').text(places);
            var resultString = "";

            for(var i=1; i<places.length+1; i++){
               resultString += i + '. ' + places[i-1] + '<br>';
            }

            $('#result').html(resultString);
        }
    });

    new AddressView({el: 'body'});    

