import { BaseComponent } from "../components/baseComponent.ts";
import { baseOptions } from "../components/dataTypes/baseOptions.ts";
import { Observer, Subject } from "../components/dataTypes/observer.ts";
import { ServerListener } from "../serverDetails/serverListener.ts";
import { Winner } from "./pageElements/winner.ts";

export class Winners extends BaseComponent implements Observer{
    title   = new BaseComponent({tag: "p", text: "Winners"});
    page    = new BaseComponent({tag: "p"});
    winnerList  = new BaseComponent({tag:"table"});
    
    constructor(options: baseOptions) {
        super(options);
        
        ServerListener.winners.attach(this);
        ServerListener.winners.getWinners();
        
        this.init();

        this.run();

    }
    update(subject: Subject): void {
        this.run();    
    }

    run() {
        this.destroyChildren();
        this.init();

        ServerListener.winners.winPage.winners.forEach(element => {
            
            const winner = new Winner({tag: "tr"}, element);
            
            this.append(winner);
        });
    }

    init() {
        this.page.setTextContent("1"); //paginator?

        const winnerName = new BaseComponent({tag: "th"});
        const winsName  = new BaseComponent({tag: "th"});
        const timeName = new BaseComponent({tag: "th"});

        winnerName.setTextContent("Winner Id");
        winsName.setTextContent("Wins count");
        timeName.setTextContent("Time");

        const newRow = new BaseComponent({tag: "tr"});
        newRow.appendChildren([winnerName, winsName, timeName]);
        this.append(newRow);
    }
}