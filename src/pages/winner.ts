import { BaseComponent } from "../components/baseComponent";
import { baseOptions } from "../components/baseOptions";
import { Observer, Subject } from "../serverDetails/observer";
import { ServerListener } from "../serverDetails/serverListener";
import { WinnerType } from "../serverDetails/winnersServer";

export class Winner extends BaseComponent implements Observer {
    private title: BaseComponent  = new BaseComponent({tag: 'div'}); 
    private numberOfWins: BaseComponent  = new BaseComponent({tag: 'div'}); 
    private time: BaseComponent = new BaseComponent({tag: 'div'});

    constructor(options: baseOptions, private winner: WinnerType) {
        super(options);
        
        this.winner = winner;

        ServerListener.winners.attach(this);
        this.init();

        //this.build();
    }   

    init() {
        this.title.setTextContent(this.winner.id.toString());
        this.numberOfWins.setTextContent(this.winner.winCount.toString());
        this.time.setTextContent(this.winner.winCount.toString());
    }

    build() {
        this.appendChildren([this.title, this.numberOfWins, this.time]);
    }
    update(subject: Subject): void {
        this.build();        
    }
}

