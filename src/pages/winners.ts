import { BaseComponent } from "../components/baseComponent";
import { baseOptions } from "../components/baseOptions";
import { Observer, Subject } from "../serverDetails/observer";
import { ServerListener } from "../serverDetails/serverListener";
import { Winner } from "./winner";

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

        ServerListener.winners.winPage.winners.forEach(element => {
            console.log(element);
            
            const winner = new Winner({tag: "div"}, element);
            winner.build();
            
            this.append(winner);
        });
    }

    init() {
        this.page.setTextContent("1"); //paginator?
    }
}