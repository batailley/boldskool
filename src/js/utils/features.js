export var Is = {
    touchDevice : function() {
        return (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
    },
    ios : function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    ie : function() {
        return ((
            navigator.appName == 'Microsoft Internet Explorer') ||
            ((navigator.appName == 'Netscape') &&
            (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)
        ));
    }

};