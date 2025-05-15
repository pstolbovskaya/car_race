import {ServerListener} from "../serverDetails/serverListener.ts";

export class Paginator {
    private all = 0;
    private limit = 0;
    private page = 0;

    switchPage(n: number) {
        this.page += n;
    }

    constructor() {


        switch (ServerListener.garage.state.designPage) {
            case "Garage":
                this.all = ServerListener.garage.state.cars.length;
                this.limit = ServerListener.garage.state.limit;
                this.page = ServerListener.garage.state.page;

                break;
            case "Winner":
                this.all = ServerListener.winners.winPage.winners.length;
                this.limit = ServerListener.winners.winPage.limit;
                this.page = ServerListener.winners.winPage.page;

                break;
            default:

                break;

        }
    }

    getPage() {
        return this.page;
    }

    noname() {
        switch (ServerListener.garage.state.designPage) {
            case "Garage":
                ServerListener.garage.state.limit = this.limit;
                ServerListener.garage.state.page = this.page;
                break;
            case "Winner":
                ServerListener.winners.winPage.limit = this.limit;
                ServerListener.winners.winPage.page = this.page;
                break;
            default:
                break;
        }
    }

    canBeSwitched(direction: "right" | "left") {
        switch (direction) {
            case "left":
                return this.page > 1;

            case "right":
                const totalPages = Math.ceil(this.all / this.limit);
                return this.page < totalPages;

            default:
                return false;
        }
    }
}