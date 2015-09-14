/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function() {
    
    AddressView = Backbone.View.extend({

        events: {
            'click #addressBox':  'render',
        },

        render: function( model ) {
            $("#addressBoxList").append("<li><input class=\"addressBox\" id=\"addressBox\" type=\"text\" placeholder=\"eg. City Of Saskatoon 222 3 Ave N Saskatoon, SK S7K 0J5\"> </li>");
        },

    });

    new AddressView({el: 'body'});
});
