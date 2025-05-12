import { BaseComponent } from "../../components/baseComponent.ts";
import { baseOptions } from "../../components/dataTypes/baseOptions.ts";
import { Observer, Subject } from "../../components/dataTypes/observer.ts";
import { ServerListener } from "../../serverDetails/serverListener.ts";
import { WinnerType } from "../../serverDetails/winnersServer.ts";

export class Winner extends BaseComponent implements Observer {
    private winnerId = new BaseComponent({tag: "td"});
    private wins  = new BaseComponent({tag: "td"});
    private time = new BaseComponent({tag: "td"});

    constructor(options: baseOptions, private winner: WinnerType) {
        super(options);

        this.winner = winner;

        this.winnerId.setTextContent(this.winner.id.toString());
        this.wins.setTextContent(this.winner.wins.toString());
        this.time.setTextContent(this.winner.time.toString());

        ServerListener.winners.attach(this);

        this.init();
        this.build();
    }   

    init() {
    }

    build() {
        this.appendChildren([this.winnerId, this.wins, this.time]);
    }
    update(subject: Subject): void {
        this.build();        
    }
}

