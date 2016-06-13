import { template } from './app-dependencies/template';
import { adapterFactory } from './patterns/Adapter';

export default class App {
    constructor(options = {}) {
        this.name = options.name || 'no name';
        template();
        this.adapter = adapterFactory('one');
    }

    init() {
        this.getName();
        this.adapter.set('key', 'example');
    }

    getName() {
        return "The App Name is: " + this.name;
    }
}

window.app = new App({
    name: "the demo app"
});

window.app.init();
