define(['mixologist', 'jquery', 'underscore', 'backbone'], function(Mixologist) {

  describe('#mix', function(){

    var A, B, C, ViewClass;

    beforeEach(function(){
      Mixologist.mixins = {};

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

    it('mixes in mixins passed as strings that exist in Mixologist.mixins', function() {
      Mixologist.mixins['D'] = {
        dMethod: function() {}
      };

      Mixologist.mix(ViewClass, 'D');
      expect(ViewClass.prototype['dMethod']).toBeDefined();
    });

    it('throws an Error if a string mixin does not exist', function() {
      var error = new Error('The mixin "D" is invalid');

      expect(function(){
        Mixologist.mix(ViewClass, 'D');
      }).toThrow(error);
    });

    describe('Collisions', function() {
      it('executes mixed in conflicting functions by the order they were mixed in', function() {
        var aSpy, bSpy, vSpy;

        A = {
          initialize: function() {}
        };

        B = {
          initialize: function() {}
        };

        ViewClass = Backbone.View.extend({
          initialize: function() {}
        });

        aSpy = spyOn(A, 'initialize');
        bSpy = spyOn(B, 'initialize');
        vSpy = spyOn(ViewClass.prototype, 'initialize');

        Mixologist.mix(ViewClass, A, B);

        new ViewClass();

        expect(aSpy).toHaveBeenCalled();
        expect(bSpy).toHaveBeenCalled();
        expect(vSpy).toHaveBeenCalled();
      });

      it('returns the last non-undefined value returned from a conflicting function', function() {
        var view, pony;

        A = {
          makePony: function() {
            return 'Pony';
          }
        };

        B = {
          makePony: function() {}
        };

        ViewClass = Backbone.View.extend({
          makePony: function() {}
        });

        Mixologist.mix(ViewClass, A, B);

        view = new ViewClass();
        pony = view.makePony();

        expect(pony).toEqual('Pony');
      });
    });

  });
});
