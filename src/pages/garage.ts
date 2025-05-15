import { BaseComponent } from "../components/baseComponent";
import { baseOptions } from "../components/dataTypes/baseOptions.ts";
import { Car } from "../pageElements/car.ts";
import { Observer, Subject } from "../components/dataTypes/observer.ts";
import { GarageServer} from "../serverDetails/garageServer";
import { ServerListener } from "../serverDetails/serverListener";
import {DataContainer} from "../components/dataContainer.ts";
import {Button} from "../components/buttonComponent.ts";
import {createWinner, getWinner, updateWinner} from "../api/winnersApi.ts";
import {createCar, getCars, updateCar} from "../api/garageApi.ts";

export class Garage extends BaseComponent implements Observer {

    private server: GarageServer;
    private cars: Array<Car>;
    private currentPage: number = 1;

    private carContainer = new BaseComponent({tag: "div"});

    constructor(options: baseOptions) {
        
        super(options);
        
        this.server = ServerListener.garage;
        this.cars   = [];

        this.server.attach(this);
        this.run();
        this.getCars();
    }

    async getCars() {
        this.server.state.cars = await getCars(this.currentPage, this.server.state.limit);
        this.updSegment();
    }

    update(subject: Subject): void {
        this.getCars();
    }

    private onRaceClbck() {
        Promise.any(this.cars.map((car) => car.startEngine())).then(async (result: Record<any, any>) => {
            getWinner(result.id).then(winnerFound => {
                const winner = winnerFound;

                if (winner.id) {
                    updateWinner(result.id, winner.wins + 1, result.time);
                }
                return winner;
            }).catch(() =>
                createWinner(result.id, 1, result.time));
        });
    }

    run() {
        console.log("Running Garage");
        this.destroyChildren()
        this.cars.length = 0;

        const createContainer = new DataContainer({tag: "div"}, "create", (name: string, color: string) => createCar(name, color));
        const updateContainer = new DataContainer({tag: "div"}, "update", (name: string, color: string) => updateCar(this.server.state.selectedCar!.id, name, color)); //update car clbck
        const race  = new Button("race", () => this.onRaceClbck());
        const reset = new Button("reset", () => this.run());
        const generateCars = new Button("generate cars", () => this.server.generateCars());

        this.appendChildren([createContainer, updateContainer]);
        this.appendChildren([race, reset, generateCars]);

        this.append(this.carContainer);

        this.append(this.paginator());

        //this.updSegment();
        //
        // this.paginator();

    }

    updSegment() {
        this.carContainer.destroyChildren();

        this.server.state.cars.forEach(element => {
            const car = new Car({tag: "div"}, element);
            this.cars.push(car);
            this.carContainer.append(car);
        });
    }

    paginator() {

        const paginator = new BaseComponent({tag: "div", className:"paginator"});
        const curPageElement = new BaseComponent({tag: "span"});
        const prevPage =  new Button("<", () => this.onPageChange(-1));
        const nextPage =  new Button(">", () => this.onPageChange(1));
        paginator.appendChildren([prevPage, nextPage]);

        curPageElement.setTextContent(this.currentPage.toString());

        prevPage.removeAttribute("disabled");
        nextPage.removeAttribute("disabled");

        if (this.currentPage === 1) {
            prevPage.setAttribute("disabled", "");
        }
/*
        if (this.cars.length/ServerListener.garage.state.limit < 1) {
            nextPage.setAttribute("disabled", "");
        }*/

        paginator.appendChildren([prevPage, curPageElement, nextPage]);
        return paginator;
    }

    onPageChange(n: number) {
        this.currentPage += n;
        this.getCars( );
    }
}