var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        'result': 'showResult'
    } 
 });

 var addressView = new AddressView();

 var router = new Router();

 router.on('route:showResult', function() {
     addressView.render();
 })

 Backbone.history.start();