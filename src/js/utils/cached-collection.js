export function Collection(array) {
    this.array = array || [];
}

Collection.prototype.add = function (item) {
    this.array[this.array.length] = item;
};

Collection.prototype.getById = function (id) {
    var arr = this.array.filter(function(obj){
        if ('id' in obj &&
            typeof(obj.id) === 'number' &&
            !isNaN(obj.id) &&
            id !== "" &&
            id === obj.id
        ) {
            return true;
        }
    });
    return arr[0];
};

Collection.prototype.getByPropertyValue = function (prop, value) {
    var arr = this.array.filter(function(obj){
        if (obj.hasOwnProperty(prop) &&
            typeof(obj[prop]) !== 'undefined' &&
            obj[prop] !== "" &&
            obj[prop] === value
        ) {
            return true;
        }
    });
    return arr[0];
};

Collection.prototype.getFirst = function (){
    return this.array[0];
}

//this have to be a small react component
Collection.prototype.buildSelect = function(selectedId, defaultText) {
        var html = "";

        this.array.sort(function(a, b){
            return a.position - b.position;
        });

        html += "<select class='form-control'>"
        html += "<option value=''>" + defaultText + "</option>";
        this.array.forEach((item) => {
            let sel = "";
            if (selectedId && selectedId === item.id) {
                sel = " selected='selected' ";
            }
            html += "<option "+ sel +" value='"+ item.id +"'>";
            html += item.usual_name;
            html += "</option>";
        });

        html += "</select>";
        return html
}

export function CachedCollection(array) {
     this.nonPersistedArray = array || [];
}

 CachedCollection.prototype.set = function(key, value, persist = false) {
     if (persist) {
         var data = JSON.stringify(value);
         localStorage.setItem(key, data);
     } else {
         if (localStorage.getItem(key) !== null) {
             localStorage.removeItem(key);
         }
         this.nonPersistedArray[key] = value;
     }
 };

 CachedCollection.prototype.get = function(key) {
     var data = null;
     if (localStorage.getItem(key) !== null) {
         try {
            data = JSON.parse(localStorage.getItem(key));
             if (typeof(data) !== "string" &&
                 typeof(data) !== "number" &&
                     data !== null
             ) {
                 data = new Collection(data.array)
             }
         } catch (error) {
             console.log('JSON.parse failed response ', error);
             data = null;
         }
     } else if (this.nonPersistedArray[key] !== null)  {
         data = this.nonPersistedArray[key];
     }
     return data;
 };

 CachedCollection.prototype.isCached = function(key) {
        return this.get(key) !== null;
 };

