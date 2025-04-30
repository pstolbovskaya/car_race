//header.append
import { ServerListener } from "../serverDetails/serverListener";
import { BaseComponent } from "./baseComponent";
import { Button } from "./buttonComponent";

export class HeaderComponent extends BaseComponent{

    toWinners   = new Button("To Winners", () => ServerListener.garage.state.designPage = "Winners");
    toGarage    = new Button("To Garage", () => ServerListener.garage.state.designPage = "Garage");

    constructor() {
        super({tag: 'header'});

        this.appendChildren([this.toGarage, this.toWinners]);
    }
}