/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function() {

AddressList = Backbone.Collection.extend({
    initialize: function(){
        this.bind("add", function( model ){
            alert("hey");
            view.render( model );
        })
    }
});

AddressView = Backbone.View.extend({

    tagName: 'li',

    events: {
        'click #addressBox':  'getAddress',
    },

    initialize: function() {
        alert("Initialized");
        var thisView = this;
        this.addresslist = new AddressList;
        _.bindAll(this, 'render');
        this.addresslist.bind("add", function( model ){
            thisView.render( model );
        })
    },

    getAddress: function() {
        alert("In getAddress function");
        //var address_name = $('#addressBox').val();
        var address_name = "";
        this.addresslist.add( {name: address_name} );
    },

    render: function( model ) {
        $("#addressBoxList").append("<li><input class=\"addressBox\" id=\"addressBox\" type=\"text\" placeholder=\"eg. City Of Saskatoon 222 3 Ave N Saskatoon, SK S7K 0J5\"> </li>");
        alert('rendered');
    },

});

var view = new AddressView({el: 'body'});
});
