
var clicks = 0;

$(function() {
    
    AddressView = Backbone.View.extend({

        events: {
            'click .addressBox':  'render',
        },

        render: function() {
            clicks++;
            if(clicks >= 3){
                $("#addressBoxList").append("<li><input class=\"addressBox\" id=\"addressBox" + clicks + "\" type=\"text\" placeholder=\"eg. City Of Saskatoon 222 3 Ave N Saskatoon, SK S7K 0J5\"> </li>");
            }
            $("#valueHolder").text(clicks);
        },
    });

    new AddressView({el: 'body'});
});
