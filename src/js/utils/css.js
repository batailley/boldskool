 export var Css = {
    hasClass : function(el, className) {
        return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
    },

    addClass: function(el, className) {
        if (el.classList) el.classList.add(className);
        else if (!this.hasClass(el, className)) el.className += ' ' + className;
    },

    removeClass : function(el, className) {
        if (el.classList) el.classList.remove(className);
        else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
    },
    offset: function( elem ) {
        var docElem, win, rect, doc ;

        if ( !elem ) {
            return;
        }

        rect = elem.getBoundingClientRect();

        if ( rect.width || rect.height || elem.getClientRects().length ) {
            doc = elem.ownerDocument;
            win = window;
            docElem = doc.documentElement;

            return {
                top: rect.top + win.pageYOffset - docElem.clientTop,
                left: rect.left + win.pageXOffset - docElem.clientLeft
            };
        }
    },

     /**
      * Retrieves element transformation as a matrix
      *
      * Note that this will only take translate and rotate in account,
      * also it always reports px and deg, never % or turn!
      *
      * @param selector
      * @return string matrix
      */
     cssToMatrix: function(selector) {
         var element = document.querySelector(selector),
             style = window.getComputedStyle(element);

         return style.getPropertyValue("-webkit-transform") ||
             style.getPropertyValue("-moz-transform") ||
             style.getPropertyValue("-ms-transform") ||
             style.getPropertyValue("-o-transform") ||
             style.getPropertyValue("transform");
     },

     /**
      * Transforms matrix into an object
      *
      * @param string matrix
      * @return object
      */
     matrixToTransformObj: function(matrix) {
         // this happens when there was no rotation yet in CSS
         if(matrix === 'none') {
             matrix = 'matrix(0,0,0,0,0)';
         }
         var obj = {},
             values = matrix.match(/([-+]?[\d\.]+)/g);

         obj.rotateRad = Math.atan2(
             parseFloat(values[1]),
             parseFloat(values[0])) || 0;
         obj.rotateDeg = Math.round(obj.rotateRad * (180/Math.PI));
         obj.translate = values[5] ? values[4] + 'px, ' + values[5] + 'px' : (values[4] ? values[4] + 'px' : '');

         return obj;
     }
};