import { BaseComponent } from "../components/baseComponent";
import { baseOptions } from "../components/baseOptions";
import { Button } from "../components/buttonComponent";
import { DataContainer } from "../components/dataContainer";
import { GarageServer } from "../serverDetails/garageServer";
import { ServerListener } from "../serverDetails/serverListener";

export class DataManipulation extends BaseComponent {
    
    private server: GarageServer;

    constructor(options: baseOptions) {     
        super(options); 
        
        this.server = ServerListener.garage;

        const createContainer = new DataContainer(options, "create", (name: string, color: string) => this.server.createCar(name, color));
        const updateContainer = new DataContainer(options, "update", (name: string, color: string) => this.server.updateCar(name, color)); //update car clbck
        const race  = new Button("race", ()=>null);
        const reset = new Button("reset", ()=>null);
        const generateCars = new Button("generate cars", () => null);
        
        this.appendChildren([createContainer, updateContainer]);
        this.appendChildren([race, reset, generateCars]);
    }
}
