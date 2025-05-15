import {BaseComponent} from "../components/baseComponent.ts";
import {baseOptions} from "../components/dataTypes/baseOptions.ts";
import {Observer, Subject} from "../components/dataTypes/observer.ts";
import {ServerListener} from "../serverDetails/serverListener.ts";
import {Winner} from "../pageElements/winner.ts";
import {deleteWinner, getWinners, WinnerType} from "../api/winnersApi.ts";
import {getCar} from "../api/garageApi.ts";
import {Button} from "../components/buttonComponent.ts";
const enum SortingField {
    ID = "id",
    WINS = "wins",
    TIME = "time",
}

export class Winners extends BaseComponent implements Observer {
    private title = new BaseComponent({tag: "p", text: "Winners"});
    private winners: Array<WinnerType> = [];
    private currentPage: number = 1;
    private winnersContainer: BaseComponent = new BaseComponent({tag: "div"});
    private sortingField: "id"| "wins"|"time" = "id";
    private sortingOption: "ASC" | "DESC" = "ASC";

    constructor(options: baseOptions) {
        super(options);

        this.getWinners();
        this.run();
    }

    private switchSorting(field: SortingField): void {
        if (this.sortingField === field) {
            this.sortingOption = this.sortingOption === "ASC" ? "DESC" : "ASC";
        } else {
            this.sortingField = field;
            this.sortingOption  = "ASC"
        }
    }

    update(subject: Subject): void {
        this.getWinners();
        //this.run();
    }

    async getWinners(): void {
        this.winners = await getWinners(this.currentPage, 10, this.sortingField, this.sortingOption);
        this.updWinnersData();
    }

    run() {
        this.append(this.title);
        this.append(this.winnersContainer);
        console.log("Before pagination");
        this.append(this.paginator());
    }


    updWinnersData() {
        this.winnersContainer.destroyChildren();
        const idSort    = new Button("", () => {
            this.switchSorting(SortingField.ID);
            this.getWinners();
        });

        const winsSort    = new Button("", () => {
            this.switchSorting(SortingField.WINS);
            this.getWinners();
        });

        const timeSort    = new Button("", () => {
            this.switchSorting(SortingField.TIME);
            this.getWinners();
        });

        const getSortLabel = (field: SortingField) => {
            if (this.sortingField !== field) return "";
            return this.sortingOption === "ASC" ? " ↓" : " ↑" ;
        };

        idSort.setTextContent(getSortLabel(SortingField.ID));
        winsSort.setTextContent(getSortLabel(SortingField.WINS));
        timeSort.setTextContent(getSortLabel(SortingField.TIME));

        const winnerId = new BaseComponent({tag: "th"});
        const winnerName = new BaseComponent({tag: "th"});
        const winsName = new BaseComponent({tag: "th"});
        const timeName = new BaseComponent({tag: "th"});

        winnerId.setTextContent("Winner Id");
        winnerName.setTextContent("Winner name");
        winsName.setTextContent("Wins count");
        timeName.setTextContent("Time");

        winnerId.append(idSort);
        winsName.append(winsSort);
        timeName.append(timeSort);

        const newRow = new BaseComponent({tag: "tr"});
        newRow.appendChildren([winnerId, winnerName, winsName, timeName]);
        this.winnersContainer.append(newRow);
        const winnersLength = this.winners.length;

        this.winners.forEach((element, index) => {
            getCar(element.id)
                .then((car) => {
                    let id = index + 1;
                    if (this.sortingOption === "DESC") {
                        id = winnersLength - index;
                    }
                    const winner = new Winner({tag: "tr", }, id, element);
                    this.winnersContainer.append(winner)
                    return car;
                })
                .catch((err) => {
                    deleteWinner(element.id);
                })
        });
    }

    paginator() {

        const paginator = new BaseComponent({tag: "div", className:"paginator"});
        const curPageElement = new BaseComponent({tag: "span"});
        const prevPage =  new Button("<", () => this.onPageChange(-1));
        const nextPage =  new Button(">", () => this.onPageChange(1));
        curPageElement.setTextContent(this.currentPage.toString());

        prevPage.removeAttribute("disabled");
        nextPage.removeAttribute("disabled");

        if (this.currentPage === 1) {
            prevPage.setAttribute("disabled", "");
        }
        /*
        if (this.winners.length/10 << 1) {
            nextPage.setAttribute("disabled", "");
        }*/

        paginator.appendChildren([prevPage, curPageElement, nextPage]);

        return paginator;
    }

    onPageChange(n: number) {
        this.currentPage += n;
        this.getWinners();
    }
}