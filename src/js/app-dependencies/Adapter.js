export default class AdapterFactory {

    static createAdaptee(adapteeKey) {
        this.adaptee = {};
        if (adapteeKey === "one") {
            this.adaptee = new oneAdaptee();
        } else if (adapteeKey === "two") {
            this.adaptee = new twoAdaptee();
        }
        return this.adaptee;
    };
}

class AdapteeInterface {
    get(key) {
        throw "please implement me";
    }
    set(key, value) {
        throw "please implement me";
    }
}

class oneAdaptee extends AdapteeInterface {
    get(key) {
        console.log('get one Ad');
    }
    set(key, value) {
        console.log('set one Ad', key, value);
    }
}
class twoAdaptee extends AdapteeInterface {

}