import { DataManipulation } from "../pages/dataManipulation";
import { Garage } from "../pages/garage";
import { Winners } from "../pages/winners";
import { ServerListener } from "../serverDetails/serverListener";
import { BaseComponent } from "./baseComponent";

export class MainComponent extends BaseComponent{

    dataBlock = new DataManipulation({tag: "div"});
    garage = new Garage({tag: "div"});
    winners = new Winners({tag: "table"});
    
    constructor() {
        super({tag: 'main'});
        let blockAppend: BaseComponent;

        switch (ServerListener.garage.state.designPage) {
            case "Winners":
                blockAppend = new Winners({tag: "table"});  
                break;
            case "Garage":
                blockAppend = new Garage({tag: "div"});
                break;
            default:
                blockAppend = new BaseComponent({tag: "div"});
                break;
        }

        this.append(this.dataBlock);
        this.append(blockAppend);
    }
}