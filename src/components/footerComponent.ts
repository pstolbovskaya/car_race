//header.append
import { Observer, Subject } from "./dataTypes/observer.ts";
import { ServerListener } from "../serverDetails/serverListener";
import { BaseComponent } from "./baseComponent";
import { Button } from "./buttonComponent";

export class FooterComponent extends BaseComponent implements Observer {
    prevPageBtn = new Button("<", () => {
        ServerListener.garage.state.page -= 1;
        ServerListener.garage.getCars();
    });

    nextPageBtn = new Button(">", () => {
        ServerListener.garage.state.page += 1;
        ServerListener.garage.getCars();
    });
        
    curPage   = new BaseComponent({tag: "span"});

    constructor() {
        super({tag: 'footer'});

        ServerListener.garage.attach(this);

        this.run();
        
    }

    run() {
        //console.log((ServerListener.server.state.page <= 1).toString());
        const totalPages = Math.ceil(ServerListener.garage.state.cars.length / ServerListener.garage.state.limit);

        this.prevPageBtn.removeAttribute("disabled");
        this.nextPageBtn.removeAttribute("disabled");


        if (ServerListener.garage.state.page <= 1) {
            this.prevPageBtn.setAttribute("disabled", "");
        }
        if (ServerListener.garage.state.cars.length < ServerListener.garage.state.limit) {
            this.nextPageBtn.setAttribute("disabled", "");
        }

        this.curPage.setTextContent(ServerListener.garage.state.page.toString());
        this.appendChildren([this.prevPageBtn, this.curPage, this.nextPageBtn]);
    }

    update(subject: Subject): void {
        this.run();
    }
}