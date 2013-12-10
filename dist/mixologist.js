(function(global){

    // The global object
    var Mixologist = {};
    
    // The mixin cache
    Mixologist.mixins = {};
    
    var _extractMixins = function() {
      return _.chain(arguments)
        .toArray()
        .rest()
        .flatten()
        .value();
    }
    
    // Main function
    Mixologist.mix = function(klass) {
      var mixins, obj, collisions;
    
      mixins = _extractMixins.apply(this, arguments);
      obj = klass.prototype || klass;
      collisions = {};
    
      _(mixins).each(function(mixin) {
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