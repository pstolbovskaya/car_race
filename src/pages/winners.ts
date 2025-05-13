import {BaseComponent} from "../components/baseComponent.ts";
import {baseOptions} from "../components/dataTypes/baseOptions.ts";
import {Observer, Subject} from "../components/dataTypes/observer.ts";
import {ServerListener} from "../serverDetails/serverListener.ts";
import {Winner} from "../pageElements/winner.ts";
import {getWinners, WinnerType} from "../api/winnersApi.ts";

export class Winners extends BaseComponent implements Observer {
    private title = new BaseComponent({tag: "p", text: "Winners"});
    private page = new BaseComponent({tag: "p"});
    private winners: Array<WinnerType> = [];

    constructor(options: baseOptions) {
        super(options);

        /*ServerListener.winners.detachAll();
        ServerListener.winners.attach(this);*/
        getWinners(1, 10).then((res) => {
            this.winners = res;
            if (this.winners.length > 0) {

                this.init();
                this.run();
            }
        });

    }

    update(subject: Subject): void {
        this.append(this.title);
        this.run();
    }

    run() {
        this.destroyChildren();
        this.init();
        console.log(this.winners)
        this.winners.forEach((element, index) => {
            const winner = new Winner({tag: "tr"}, index+1, element);
            this.append(winner);
        });
    }

    init() {
        this.page.setTextContent("1"); //paginator?

        const winnerId = new BaseComponent({tag: "th"});
        const winnerName = new BaseComponent({tag: "th"});
        const winsName = new BaseComponent({tag: "th"});
        const timeName = new BaseComponent({tag: "th"});

        winnerId.setTextContent("Winner Id");
        winnerName.setTextContent("Winner name");
        winsName.setTextContent("Wins count");
        timeName.setTextContent("Time");

        const newRow = new BaseComponent({tag: "tr"});
        newRow.appendChildren([winnerId, winnerName, winsName, timeName]);
        this.append(newRow);
    }
}