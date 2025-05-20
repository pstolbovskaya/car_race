//header.append
import { ServerListener } from "../serverDetails/serverListener";
import { BaseComponent } from "./baseComponent";
import { Button } from "./buttonComponent";
import { Main } from "../main";
export class HeaderComponent extends BaseComponent{

    toWinners   = new Button("To Winners", () => {
        ServerListener.garage.state.designPage = "Winners";
        ServerListener.garage.detachAll();
        new Main();
    });
    toGarage    = new Button("To Garage", () => {
        ServerListener.garage.state.designPage = "Garage";
        ServerListener.garage.detachAll();
        new Main();
    });

    linkToGarage = new BaseComponent({tag: "a"});
    linkToWinners = new BaseComponent({tag: "a"});

    constructor() {
        super({tag: 'header'});
        this.linkToWinners.setAttribute("href", "/#winners");
        this.linkToGarage.setAttribute("href", "/#garage");
        this.linkToWinners.append(this.toWinners);
        this.linkToGarage.append(this.toGarage);
        this.appendChildren([this.linkToGarage, this.linkToWinners]);
    }
}