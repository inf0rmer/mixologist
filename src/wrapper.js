(function(global){

    //= ./mixologist.js

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
