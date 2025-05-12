import { Garage } from "../pages/garage";
import { Winners } from "../pages/winners.ts";
import { ServerListener } from "../serverDetails/serverListener";
import { BaseComponent } from "./baseComponent";

export class MainComponent extends BaseComponent{

    //dataBlock = new DataManipulation({tag: "div"});
    
    constructor() {
        super({tag: 'main'});
        let blockAppend: BaseComponent | null = null;

        ServerListener.garage.detachAll();
        ServerListener.winners.detachAll();

        switch (ServerListener.garage.state.designPage) {
            case "Winners":
                ServerListener.winners.detachAll();
                blockAppend = new Winners({tag: "table"});  
                break;
            case "Garage":
                ServerListener.garage.detachAll();
                blockAppend = new Garage({tag: "div"});
                break;
            default:
                blockAppend = new BaseComponent({tag: "div"});
                break;
        }

        //this.append(this.dataBlock);
        this.append(blockAppend);

        //console.log(this)
    }
}