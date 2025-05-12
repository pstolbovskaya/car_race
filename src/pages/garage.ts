import { BaseComponent } from "../components/baseComponent";
import { baseOptions } from "../components/dataTypes/baseOptions.ts";
import { Car } from "./pageElements/car.ts";
import { Observer, Subject } from "../components/dataTypes/observer.ts";
import { GarageServer } from "../serverDetails/garageServer";
import { ServerListener } from "../serverDetails/serverListener";
import {DataContainer} from "../components/dataContainer.ts";
import {Button} from "../components/buttonComponent.ts";
import {createWinner, getWinner, updateWinner} from "../api/winnersApi.ts";
import {getCar} from "../api/garageApi.ts";

export class Garage extends BaseComponent implements Observer {

    private server: GarageServer;
    private cars: Array<Car>;

    constructor(options: baseOptions) {
        
        super(options);
        
        this.server = ServerListener.garage;
        this.cars   = new Array<Car>();
        this.cars.length = 0;


        this.server.attach(this);
        this.server.getCars();
    }

    update(subject: Subject): void {
        //ServerListener.garage.detachAll();
        //this.server.attach(this);

        this.run();
    }

    run() {
        this.destroyChildren()
        this.cars.splice(0, this.cars.length);
        this.cars.length = 0;

        const createContainer = new DataContainer({tag: "div"}, "create", (name: string, color: string) => this.server.createCar(name, color));
        const updateContainer = new DataContainer({tag: "div"}, "update", (name: string, color: string) => this.server.updateCar(name, color)); //update car clbck
        const race  = new Button("race", () => {
            console.log("pressed", this.cars.map((car) => car.startEngine()));

            Promise.any(this.cars.map((car) => car.startEngine())).then(async (result) => {
                const winner = await getWinner(result);
                console.log("winner", winner, "result", result);
                if (winner.id) {
                    updateWinner(winner.id, winner.wins + 1, winner.time);
                } else {
                    createWinner(result, 1, "4");
                }
            });


        });
        const reset = new Button("reset", () => this.server.getCars());
        const generateCars = new Button("generate cars", () => this.server.generateCars());

        this.appendChildren([createContainer, updateContainer]);
        this.appendChildren([race, reset, generateCars]);

        //console.log(JSON.parse(JSON.stringify(ServerListener.engine)));
        this.server.state.cars.forEach(element => {
            const car = new Car({tag: "div"}, element);
            this.cars.push(car);
            this.append(car);
        });

        /*console.log("Engine observers: ", ServerListener.engine.getObservers());
        console.log("Gerage observers: ", ServerListener.garage.getObservers());*/

    }
}