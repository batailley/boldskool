import { dependencie } from './app-dependencies/template';
class App {
    constructor(options = {}) {
        this.name = options.name || 'no name';
    }
    getName() {
        //
        return "Name: " + this.name;
    }

}

window.app = new App();
