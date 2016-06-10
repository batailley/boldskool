export default class AdapterFactory {

    static createAdapter(adapterKey) {
        this.adapter = {};
        if (adapterKey === "one") {
            this.adapter = new oneAdapter();
        } else if (adapterKey === "two") {
            this.adapter = new twoAdapter();
        }
        return this.adapter;
    };
}

export default class AdapterInterface {
    get(key) {
        throw new Error("please implement me");
    }
    set(key, value) {
        throw new Error("please implement me");
    }
}

export default class oneAdapter extends AdapterInterface {
    get(key) {
        console.log('get one Ad');
    }
    set(key, value) {
        console.log('set one Ad', key, value);
    }
}
class twoAdapter extends AdapterInterface {

}