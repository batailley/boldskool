export var Obj = {
    extend: function(obj, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    },
    mixin: function(origObject, destObject, methods) {
        for(var i = 0; i < methods.length; i ++){
            if( typeof destObject === 'function' ){
                destObject.prototype[methods[i]]	= origObject[methods[i]];
            }else{
                destObject[methods[i]] = origObject[methods[i]];
            }
        }
        return destObject;
    },
    buildDataFromElement: function(elem){
        var data = {};
        [].forEach.call(elem.attributes, function(attr) {
            if (/^data-/.test(attr.name)) {
                var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
                data[camelCaseName] = attr.value;
            }
        });
        return data;
    }
};