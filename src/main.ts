import {FooterComponent} from "./components/footerComponent";
import {HeaderComponent} from "./components/headerComponent";
import {MainComponent} from "./components/mainComponent"

export class Main {
    private header : HeaderComponent | null = null;
    private main: MainComponent | null = null;
    private footer: FooterComponent | null = null;

    constructor() {
        this.header = null;
        this.main = null;
        this.footer = null;

        this.build();
    }

    build() {

        [...document.body.children].forEach(element => {
            document.body.removeChild(element);
        });

         this.header = new HeaderComponent();
         this.main  = new MainComponent();
         this.footer  = new FooterComponent();

        document.body.append(this.header.getNode());
        document.body.append(this.main.getNode());
        document.body.append(this.footer.getNode());
    }
}

new Main();