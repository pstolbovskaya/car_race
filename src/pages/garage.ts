import { BaseComponent } from "../components/baseComponent";
import { baseOptions } from "../components/dataTypes/baseOptions.ts";
import { Car } from "../pageElements/car.ts";
import { Observer, Subject } from "../components/dataTypes/observer.ts";
import {CarType, GarageServer} from "../serverDetails/garageServer";
import { ServerListener } from "../serverDetails/serverListener";
import {DataContainer} from "../components/dataContainer.ts";
import {Button} from "../components/buttonComponent.ts";
import {createWinner, getWinner, updateWinner} from "../api/winnersApi.ts";
import {createCar, updateCar} from "../api/garageApi.ts";

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
        this.run();
    }

    run() {
        this.destroyChildren()
        this.cars.splice(0, this.cars.length);
        this.cars.length = 0;

        const createContainer = new DataContainer({tag: "div"}, "create", (name: string, color: string) => createCar(name, color));
        const updateContainer = new DataContainer({tag: "div"}, "update", (name: string, color: string) => updateCar(ServerListener.garage.state.selectedCar!.id, name, color)); //update car clbck
        const race  = new Button("race", () => {
            //console.log("pressed", this.cars.map((car) => car.startEngine()));

            Promise.any(this.cars.map((car) => car.startEngine())).then(async (result: Record<any, any>) => {

                console.log(result);
                let winner;

                getWinner(result.id).then(winnerFound => {winner = winnerFound}).catch(result => result);

                console.log("winner", winner, "result", result);

                if (winner) {
                    updateWinner(result.id, winner.wins + 1, result.time);
                } else {
                    createWinner(result.id, 1, result.time);
                }

            });


        });
        const reset = new Button("reset", () => this.server.getCars());
        const generateCars = new Button("generate cars", () => this.server.generateCars());

        this.appendChildren([createContainer, updateContainer]);
        this.appendChildren([race, reset, generateCars]);

        this.server.state.cars.forEach(element => {
            const car = new Car({tag: "div"}, element);
            this.cars.push(car);
            this.append(car);
        });


    }
}