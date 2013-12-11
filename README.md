# Mixologist

[![Build Status](https://travis-ci.org/inf0rmer/mixologist.png?branch=master)](https://travis-ci.org/inf0rmer/mixologist)

A simple mixin manager, designed to operate with Backbone but framework agnostic enough to be used with other stuff. The only dependency is [Underscore](http://underscorejs.org/).

## How does it work?
The main ```Mixologist.mix``` function accepts any number of arguments. The first argument is the object that your mixins will be composed into, and the rest are your mixins.

Use it like so:

```javascript
var myMixin = {
  someMethod: function() {
    //...
  }
}
var myOtherMixin = {
  someOtherMethod: function() {
    //...
  }
}
var myView = Backbone.View.extend()

Mixologist.mix(myView, myMixin, myOtherMixin)
```

## Referencing mixins by name
You may also pass strings to the ```mix``` function in lieu of traditional mixin objects. Mixologist expects that these mixins already be registered in it's ```mixins``` property. If the mixin is not found, Mixologist will complain by throwing an exception.

```javascript
Mixologist.mixins['myMixin'] = {
  someMethod: function() {
    //...
  }
}

Mixologist.mix(myView, 'myMixin')
```

## Handling collisions
What about when mixins implement methods or objects with similar names? Common examples include ```initialize``` functions and ```events``` hashes.

For hashes, Mixologist will automatically merge all conflicting objects into a single object.
For functions, a wrapper function will be created that executes all the conflicting functions (with the context and arguments of the objects the mixins are composed onto) in the order they were mixed in.

### Object hashes
```javascript
var myMixin = {
  events: {
    "click .pony": "makePony"
  }
}

var myView = Backbone.View.extend({
  events: {
    "click .ponyFactory": "makePonyBlueprint"
  }
})

Mixologist.mix(myView, myMixin)

/*
myView.prototype.events
-> {
  "click .ponyFactory": "makePonyBlueprint",
  "click .pony": "makePony"
}
*/

```

### Functions
```javascript
var myMixin = {
  makePony: function(){
    console.log("mixin makePony was called!");
  }
}

var myView = Backbone.View.extend({
  makePony: function(){
    console.log("original makePony was called!");
  }
})

Mixologist.mix(myView, myMixin)

/*
view = new myView

view.makePony()
-> console.log("original makePony was called!");
console.log("mixin makePony was called!");
*/

```
