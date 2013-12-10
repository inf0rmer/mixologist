(function() {
  var exports = {},
    define;

  if (window.define && window.define.amd) {
    define = window.define;
  }
  else {
    exports = window;
    define = function(name, dependencies, fn) {
      var deps = []

      for (var i = 0; i < dependencies.length; i++) {
        deps.push(window[dependencies[i]]);
      }

      var module = fn.apply(undefined, deps);
      if (!window[name]) window[name] = module;
    }

  }

  define('mixologist', ['backbone'], function(Backbone) {
    //= ./mixologist.js
  });
}());
