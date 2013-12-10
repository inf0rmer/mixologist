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

// Main mixing function
Mixologist.mix = function(klass) {
  var mixins, obj, collisions;

  mixins = _extractMixins.apply(this, arguments);
  obj = klass.prototype || klass;
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
  _(collisions).each(function(fns, name) {
    obj[name] = function() {
      var self = this,
        args = arguments,
        returnable;

      _(fns).each(function(value) {
        var returned = _.isFunction(value) ? value.apply(self, args) : value;
        returnable = _.isUndefined(returned) ? returnable : returned;
      });

      return returnable;
    }
  });
}
