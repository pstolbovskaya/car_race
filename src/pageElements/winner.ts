import { BaseComponent } from "../components/baseComponent.ts";
import { baseOptions } from "../components/dataTypes/baseOptions.ts";
import { Observer, Subject } from "../components/dataTypes/observer.ts";
import { ServerListener } from "../serverDetails/serverListener.ts";
import {deleteWinner, WinnerType} from "../api/winnersApi.ts";
import {getCar} from "../api/garageApi.ts";
import {CarType} from "../serverDetails/garageServer.ts";

export class Winner extends BaseComponent implements Observer {
    private winnerId = new BaseComponent({tag: "td"});
    private carName = new BaseComponent({tag: "td"});
    private wins  = new BaseComponent({tag: "td"});
    private time = new BaseComponent({tag: "td"});
    private car: CarType;

    constructor(options: baseOptions, id: number, private winner: WinnerType) {
        super(options);

        this.winner = winner;


        //ServerListener.winners.attach(this);

        this.init();
        this.build();

        this.winnerId.setTextContent(id.toString());
        this.wins.setTextContent(this.winner.wins.toString());
        this.time.setTextContent(this.winner.time.toString());
    }
    async initCar() {
        this.car = await getCar(this.winner.id);
        this.carName.setTextContent(this.car.name.toString());
    }
    init() {
        this.initCar();
    }

    build() {
        this.appendChildren([this.winnerId, this.carName, this.wins, this.time]);
    }
    update(subject: Subject): void {
        this.build();        
    }
}

