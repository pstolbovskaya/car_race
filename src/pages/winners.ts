import { BaseComponent } from "../components/baseComponent";
import { baseOptions } from "../components/baseOptions";
import { Observer, Subject } from "../serverDetails/observer";
import { ServerListener } from "../serverDetails/serverListener";

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

        /*this.server.state.cars.forEach(element => {
            const car = new Car({tag: "div"}, element);
            car.build();
            
            this.append(car); 

            this.appendChildren([this.title, this.page, this.winnerList]); //noit from car

        });*/ //TODO: must show winners from server
        
    }
    init() {
        this.page.setTextContent("1"); //paginator?
    }
}