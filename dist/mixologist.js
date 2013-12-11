(function(global){

    // The global object
    var Mixologist = {},
      _extractMixins,
      _handleCollision;
    
    // The mixin cache
    Mixologist.mixins = {};
    
    _extractMixins = function() {
      return _.chain(arguments)
        .toArray()
        .rest()
        .value();
    }
    
    _handleCollision = function(fns, name) {
      this[name] = function() {
        var self = this,
          args = arguments,
          returnable;
    
        _(fns).each(function(value) {
          var returned = _.isFunction(value) ? value.apply(self, args) : value;
          returnable = _.isUndefined(returned) ? returnable : returned;
        });
    
        return returnable;
      }
    }
    
    // Main mixing function
    Mixologist.mix = function(obj) {
      var mixins, obj, collisions;
    
      mixins = _extractMixins.apply(this, arguments);
      obj = obj.prototype || obj;
      collisions = {};
    
      _(mixins).each(function(mixin, index) {
    
        if (_.isString(mixin)) {
          mixin = Mixologist.mixins[mixin];
    
          if (!mixin) {
            throw new Error('The mixin "' + mixins[index] + '" is invalid')
          }
        }
    
        _(mixin).each(function(value, key) {
          if (_.isFunction(value)) {
            if (obj[key]) {
              collisions[key] = collisions[key] || [obj[key]];
              collisions[key].push(value);
            }
    
            obj[key] = value;
          } else {
            obj[key] = _.extend({}, value, obj[key] || {});
          }
        });
      });
    
      // Handle collisions
      _(collisions).each(_handleCollision, obj);
    }

    //exports to multiple environments
    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return Mixologist; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = Mixologist;
    } else { //browser
        //use string because of Google closure compiler ADVANCED_MODE
        /*jslint sub:true */
        global['Mixologist'] = Mixologist;
    }

}(this));