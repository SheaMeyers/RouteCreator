var addresses = [];
var toGoTo = [];
var allAddresses;
var clicks = 0;

$(function() {
    
    AddressBoxView = Backbone.View.extend({

        events: {
            'click .addressBox':  'render',
        },

        render: function() {
            clicks++;
            if(clicks >= 3){
                $("#addressBoxList").append("<li><input class=\"addressBox\" id=\"addressBox" + (clicks+1) + "\" type=\"text\" placeholder=\"eg. City Of Saskatoon 222 3 Ave N Saskatoon, SK S7K 0J5\"> </li>");
            }
        },
    });

    new AddressBoxView({el: 'body'});
});

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

        if(true) {
            return this.getDistances();
        }
        else {
            this.googleTravellingSalesman();
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
        });
    },

    buildLocationsArray: function (xhr, status){
        if (xhr.status === 200) {
             console.log("status " + xhr.status);
             var value = xhr.responseText;
             try {
                 var locationsArray = [];
                 value = value.replace(/{|}|},|:/g,' ');
                 value = value.replace(/"/g,' ')
                 valueArray = value.split("\n");
                 //This is adding all the cities to the array, in proper order
                 for(var i=0; i<valueArray.length; i++){
                     if(valueArray[i].indexOf('start_address') > -1){
                         locationsArray.push(valueArray[i].replace(/ /g,''));
                     }
                 }
                 //A simple printout of the cities to go to, in their order
                 for(var i=0; i<locationsArray.length; i++){
                     locationsArray[i] = locationsArray[i].replace('start_address','');
                 }
             }
             catch (e) {
                 console.log("\n\nerror " + e + "\n\n");
             }
         }
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

        this.makeAjaxCall(urlComplete, this.buildLocationsArray());

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
                    }, function (response, status) {
                        if (status == google.maps.DistanceMatrixStatus.OK) {
                          var origins = response.originAddresses;
                          var destinations = response.destinationAddresses;

                          for (var i = 0; i < origins.length; i++) {
                            var results = response.rows[i].elements;
                            for (var j = 0; j < results.length; j++) {
                                var element = results[j];
                                var distance = element.distance.text;
                                var from = origins[i];
                                var to = destinations[j];

                                edge.push([from,to,parseInt(distance)]);
                                increments = ++increments;
                                if(vertex.indexOf(from) < 0){
                                    vertex.push(from);
                                }
                            }
                          }
                          if(toGoTo.length*(toGoTo.length-1) === increments){
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
        //Move the first element of the array, your starting position
        //   to the end of the array, since it'll be your end location
        places.push(places.shift());

        var resultString = "";

        for(var i=1; i<places.length+1; i++){
           resultString += i + '. ' + places[i-1] + '<br>';
           console.log('resultString ' + resultString);
           console.log('places ' + places[i-1]);
        }

        $('#result').html(resultString);
    }
});

new AddressView({el: 'body'});    
