import {BaseComponent} from "../components/baseComponent";
import {baseOptions} from "../components/dataTypes/baseOptions.ts";
import {Car} from "../pageElements/car.ts";
import {Observer} from "../components/dataTypes/observer.ts";
import {CarType, GarageServer} from "../serverDetails/garageServer";
import {ServerListener} from "../serverDetails/serverListener";
import {DataContainer} from "../components/dataContainer.ts";
import {Button} from "../components/buttonComponent.ts";
import {createWinner, getWinner, updateWinner} from "../api/winnersApi.ts";
import {createCar, getCar, getCars, updateCar} from "../api/garageApi.ts";
import {ModalWindow} from "../pageElements/modalWindow.ts";
import {Paginator} from "../pageElements/paginator.ts";
import {generateCarsCreate} from "../serverDetails/utils.ts";


export class Garage extends BaseComponent implements Observer {

    private server: GarageServer = ServerListener.garage;
    private cars: Array<Car>;
    private carsOnPage: Array<CarType>;
    private currentPage: number = 1;
    private total: number = 0;
    private totalPages: number = 0;
    private carContainer = new BaseComponent({tag: "div"});
    private updateContainer = new DataContainer({tag: "div"}, "update", (name: string, color: string) => this.updateCar(name, color));
    private modalWindow = new ModalWindow();
    private garageHeader = new BaseComponent({tag: "h2"});
    private paginator: Paginator | undefined = undefined;

    constructor(options: baseOptions) {

        super(options);

        this.server = ServerListener.garage;
        this.carsOnPage = [];
        this.cars = [];

        this.server.attach(this);
        this.run();
        this.getCars(this.currentPage);
    }


    async getCars(page: number) {
        const {carsAmount, cars}= await getCars(page, 7);

        this.carsOnPage = cars;

        if (carsAmount) {
            this.totalPages = carsAmount/7;
        }

        if (carsAmount) {
            this.total = +carsAmount;
        }
        this.totalPages = Math.ceil(this.total / 7);

        this.garageHeader.setTextContent(`Garage (${this.total})`);

        this.updSegment();
    }

    updDataContainer() {
        const car = this.server.state.selectedCar;
        if (car) {
            this.updateContainer.setControls(car.name, car.color);
        }
    }

    update(): void {
        this.getCars(this.currentPage);
        this.updDataContainer();
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.update()
    }

    private onRaceClbck() {
        Promise.any(this.cars.map((car) => car.startEngine())).then(async (result: Record<any, any>) => {
            const localCar = await getCar(result.id);
            this.modalWindow.updateModalContent(localCar.name, result.time);
            getWinner(result.id).then(winnerFound => {
                const winner = winnerFound;
                if (winner.id) {
                    updateWinner(result.id, winner.wins + 1, result.time);
                }
                return winner;
            }).catch(() =>
                createWinner(result.id, 1, result.time));

            this.modalWindow.openModal();
        });
    }

    updateCar(name: string, color: string) {
        updateCar(this.server.state.selectedCar!.id, name, color);
        this.getCars(this.currentPage);
    }


    run() {
        this.destroyChildren();
        this.cars.length = 0;

        const createContainer = new DataContainer({tag: "div"}, "create", (name: string, color: string) => createCar(name, color));
        const race = new Button("race", () => this.onRaceClbck());
        const reset = new Button("reset", () => this.getCars(this.currentPage));
        const generateCars = new Button("generate cars", () => {
            generateCarsCreate();
            this.getCars(this.currentPage);
        });

        this.paginator = new Paginator(this.onPageChange.bind(this));
        this.append(this.modalWindow);
        this.appendChildren([createContainer, this.updateContainer]);
        this.appendChildren([race, reset, generateCars]);
        this.append(this.garageHeader);
        this.append(this.carContainer);
        this.append(this.paginator);

    }

    updSegment() {
        this.carContainer.destroyChildren();

        this.carsOnPage.forEach(element => {
            const car = new Car({tag: "div"}, element);
            this.cars.push(car);
            this.carContainer.append(car);
        });

        this.paginator?.updatePaginator(this.totalPages);
    }
}