import {BaseComponent} from "../components/baseComponent.ts";
import {baseOptions} from "../components/dataTypes/baseOptions.ts";
import {Observer, Subject} from "../components/dataTypes/observer.ts";
import {Winner} from "../pageElements/winner.ts";
import {deleteWinner, getWinners, totalWinners, WinnerType} from "../api/winnersApi.ts";
import {getCar} from "../api/garageApi.ts";
import {Button} from "../components/buttonComponent.ts";

const Disabled = "disabled";

const enum SortingField {
    ID = "id",
    WINS = "wins",
    TIME = "time",
}

const enum SortingType {
    ASC = "ASC",
    DESC = "DESC",
}

export class Winners extends BaseComponent implements Observer {
    private title = new BaseComponent({tag: "h2"});
    private winners: Array<WinnerType> = [];
    private currentPage: number = 1;
    private winnersContainer: BaseComponent = new BaseComponent({tag: "div"});
    private sortingField: SortingField = SortingField.ID;
    private sortingOption: SortingType = SortingType.ASC;
    private totalWinners: number = 0;
    private prevPage = new Button("<", () => this.onPageChange(-1));
    private nextPage = new Button(">", () => this.onPageChange(1));
    private limit = 10;
    private totalPages = 0;
    private curPageElement = new BaseComponent({tag: "span"});

    constructor(options: baseOptions) {
        super(options);

        this.getWinners();
        this.run();
    }

    private switchSorting(field: SortingField): void {
        if (this.sortingField === field) {
            this.sortingOption = this.sortingOption === SortingType.ASC ? SortingType.DESC : SortingType.ASC;
        } else {
            this.sortingField = field;
            this.sortingOption = SortingType.ASC
        }
    }

    update(subject: Subject): void {
        this.getWinners();
    }

    async getWinners(): void {
        this.winners = await getWinners(this.currentPage, this.limit, this.sortingField, this.sortingOption);

        if (totalWinners) {
            this.totalWinners = +totalWinners;
            this.totalPages = Math.ceil(this.totalWinners / this.limit);
        }
        this.title.setTextContent(`Winners(${this.totalWinners})`);
        this.updWinnersData();
        this.updateButtonVisibility();
    }

    run() {
        this.append(this.title);
        this.append(this.winnersContainer);
        this.append(this.paginator());
    }


    updWinnersData() {
        this.winnersContainer.destroyChildren();
        const idSort = new Button("", () => {
            this.switchSorting(SortingField.ID);
            this.getWinners();
        }, "table-header-button");

        const winsSort = new Button("", () => {
            this.switchSorting(SortingField.WINS);
            this.getWinners();
        }, "table-header-button");

        const timeSort = new Button("", () => {
            this.switchSorting(SortingField.TIME);
            this.getWinners();
        }, "table-header-button");

        const getSortLabel = (field: SortingField) => {
            if (this.sortingField !== field) return "";
            return this.sortingOption === SortingType.ASC ? " ↓" : " ↑";
        };

        idSort.setTextContent("Winner Id" + getSortLabel(SortingField.ID));
        winsSort.setTextContent("Wins count" + getSortLabel(SortingField.WINS));
        timeSort.setTextContent("Time" + getSortLabel(SortingField.TIME));

        const winnerId = new BaseComponent({tag: "th"});
        const winnerName = new BaseComponent({tag: "th"});
        const winsName = new BaseComponent({tag: "th"});
        const timeName = new BaseComponent({tag: "th"});

        winnerName.setTextContent("Winner name");

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
                    if (this.sortingOption === SortingType.DESC) {
                        id = winnersLength - index;
                    }
                    const winner = new Winner({tag: "tr",}, id, element);
                    this.winnersContainer.append(winner)
                    return car;
                })
                .catch((err) => {
                    deleteWinner(element.id);
                })
        });
    }

    paginator() {

        const paginator = new BaseComponent({tag: "div", className: "paginator"});
        this.curPageElement.setTextContent(this.currentPage.toString());

        paginator.appendChildren([this.prevPage, this.curPageElement, this.nextPage]);

        this.prevPage.setAttribute(Disabled, "");

        if (this.currentPage === Math.ceil(this.totalWinners / this.limit)) {
            this.nextPage.setAttribute(Disabled, "");
        }

        return paginator;
    }

    onPageChange(n: number) {
        this.currentPage += n;
        this.getWinners();
    }

    updateButtonVisibility() {
        this.prevPage.removeAttribute(Disabled);
        this.nextPage.removeAttribute(Disabled);

        this.curPageElement.setTextContent(this.currentPage.toString());

        if (this.currentPage === 1) {
            this.prevPage.setAttribute(Disabled, "");
        }
        if (this.currentPage === this.totalPages) {
            this.nextPage.setAttribute(Disabled, "");
        }
    }
}