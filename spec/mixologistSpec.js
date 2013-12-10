define(['mixologist', 'jquery', 'underscore', 'backbone'], function(Mixologist) {

  describe('#mix', function(){

    var A, B, C, ViewClass;

    beforeEach(function(){
      A = {
        aMethod: function(){

        }
      };

      B = {
        bMethod: function() {

        }
      };

      C = {
        events: {
          "command": "result"
        }
      };

      ViewClass = Backbone.View.extend({
        events: {
          "order": "result"
        }
      });
    });

    it('mixes mixin properties into View instance', function(){
      var view = new ViewClass();
      Mixologist.mix(view, A, B);

      expect(view['aMethod']).toBeDefined();
      expect(view['bMethod']).toBeDefined();
    });

    it('mixes mixin properties into the View prototype', function() {
      Mixologist.mix(ViewClass, A, B);

      expect(ViewClass.prototype['aMethod']).toBeDefined();
      expect(ViewClass.prototype['bMethod']).toBeDefined();
    });

    it('merges mixin properties that are already present', function() {
      Mixologist.mix(ViewClass, C);

      expect(_.keys(ViewClass.prototype['events']).length).toEqual(2);
      expect(ViewClass.prototype['events']['command']).toBeDefined();
      expect(ViewClass.prototype['events']['order']).toBeDefined();
    });

  });
});
