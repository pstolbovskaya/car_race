import { FooterComponent } from "./components/footerComponent";
import { HeaderComponent } from "./components/headerComponent";
import { MainComponent } from "./components/mainComponent"

export class Main {
    
    static build() {
        
        [...document.body.children].forEach(element => {
            document.body.removeChild(element); 
        });

        const header: HeaderComponent = new HeaderComponent();
        const main: MainComponent = new MainComponent();
        const footer: FooterComponent = new FooterComponent();

        document.body.append(header.getNode());
        document.body.append(main.getNode());
        document.body.append(footer.getNode());
    }
}

Main.build();