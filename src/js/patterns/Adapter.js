export function adapterFactory (adapterKey) {
    let adapter = {};
    if (adapterKey === "one") {
        adapter = new oneAdapter();
    } else if (adapterKey === "two") {
        adapter = new twoAdapter();
    }
    return adapter;
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
    constructor(...args) {
        super(...args);
    }

    get(key) {
        console.info('get one from adapter', key);
    }
    set(key, value) {
        console.info('set one to adapter', key, value);
    }
}
class twoAdapter extends AdapterInterface {
    constructor(...args) {
        super(...args);
    }
}