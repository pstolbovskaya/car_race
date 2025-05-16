import {HeaderComponent} from "./components/headerComponent";
import {MainComponent} from "./components/mainComponent"

export class Main {
    private header: HeaderComponent | null = null;
    private main: MainComponent | null = null;

    constructor() {
        this.header = null;
        this.main = null;

        this.build();
    }

    build() {

        [...document.body.children].forEach(element => {
            document.body.removeChild(element);
        });

        this.header = new HeaderComponent();
        this.main = new MainComponent();

        document.body.append(this.header.getNode());
        document.body.append(this.main.getNode());
    }
}

new Main();