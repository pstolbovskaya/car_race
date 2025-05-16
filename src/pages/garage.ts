import {BaseComponent} from "../components/baseComponent";
import {baseOptions} from "../components/dataTypes/baseOptions.ts";
import {Car} from "../pageElements/car.ts";
import {Observer, Subject} from "../components/dataTypes/observer.ts";
import {GarageServer} from "../serverDetails/garageServer";
import {ServerListener} from "../serverDetails/serverListener";
import {DataContainer} from "../components/dataContainer.ts";
import {Button} from "../components/buttonComponent.ts";
import {createWinner, getWinner, updateWinner} from "../api/winnersApi.ts";
import {carsAmount, createCar, getCar, getCars, updateCar} from "../api/garageApi.ts";

const Disabled = "disabled";

export class Garage extends BaseComponent implements Observer {

    private server: GarageServer;
    private cars: Array<Car>;
    private currentPage: number = 1;
    private total: number = 0;
    private totalPages: number = 0;
    private carContainer = new BaseComponent({tag: "div"});
    private updateContainer = new DataContainer({tag: "div"}, "update", (name: string, color: string) => this.updateCar(name, color)); //update car clbck
    private modalWindow = new BaseComponent({tag: "div", className: "modal"});
    private modalContent = new BaseComponent({tag: "div", className: "modal__content"});
    private garageHeader = new BaseComponent({tag: "h2"});
    private prevPage = new Button("<", () => this.onPageChange(-1));
    private nextPage = new Button(">", () => this.onPageChange(1));

    private curPageElement = new BaseComponent({tag: "span"});

    constructor(options: baseOptions) {

        super(options);

        this.server = ServerListener.garage;
        this.cars = [];

        this.server.attach(this);
        this.run();
        this.getCars();
    }

    openModal = () => {
        this.modalWindow.toggleClass("modal_visible");
    }
    closeModal = () => {
        this.modalWindow.toggleClass("modal_visible");
    }

    async getCars() {
        this.server.state.cars = await getCars(this.currentPage, this.server.state.limit);
        if (carsAmount) {
            this.total = +carsAmount;
        }
        this.totalPages = Math.ceil(this.total / this.server.state.limit);

        this.garageHeader.setTextContent(`Garage (${this.total})`);

        this.updSegment();
    }

    updDataContainer() {
        const car = this.server.state.selectedCar;
        if (car) {
            this.updateContainer.setControls(car.name, car.color);
        }
    }

    update(subject: Subject): void {
        this.getCars();
        this.updDataContainer();
    }

    private onRaceClbck() {
        Promise.any(this.cars.map((car) => car.startEngine())).then(async (result: Record<any, any>) => {
            const localCar = await getCar(result.id);
            this.modalContent.setTextContent(`Car ${localCar.name[0].toUpperCase() + localCar.name.slice(1).toLowerCase()} won the race with ${result.time}!`);
            getWinner(result.id).then(winnerFound => {
                const winner = winnerFound;
                if (winner.id) {
                    updateWinner(result.id, winner.wins + 1, result.time);
                }
                return winner;
            }).catch(() =>
                createWinner(result.id, 1, result.time));

            this.openModal();
        });
    }

    updateCar(name: string, color: string) {
        updateCar(this.server.state.selectedCar!.id, name, color);
        this.getCars();
    }

    buildModalWindow() {
        const closeBtn = new Button("X", () => this.closeModal(), "modal__close");
        const modalContainer = new BaseComponent({tag: "div", className: "modal__container"});

        modalContainer.append(this.modalContent);
        modalContainer.append(closeBtn);

        this.modalWindow.append(modalContainer);
    }

    run() {
        this.destroyChildren();
        this.cars.length = 0;

        const createContainer = new DataContainer({tag: "div"}, "create", (name: string, color: string) => createCar(name, color));
        const race = new Button("race", () => this.onRaceClbck());
        const reset = new Button("reset", () => this.getCars());
        const generateCars = new Button("generate cars", () => {
            this.server.generateCars();
            this.getCars();
        });
        this.buildModalWindow();

        this.append(this.modalWindow);
        this.appendChildren([createContainer, this.updateContainer]);
        this.appendChildren([race, reset, generateCars]);
        this.append(this.garageHeader);
        this.append(this.carContainer);
        this.append(this.paginator());

    }

    updSegment() {
        this.carContainer.destroyChildren();

        this.server.state.cars.forEach(element => {
            const car = new Car({tag: "div"}, element);
            this.cars.push(car);
            this.carContainer.append(car);
        });
        this.updateButtonVisibility();
    }

    paginator() {

        const paginator = new BaseComponent({tag: "div", className: "paginator"});

        paginator.appendChildren([this.prevPage, this.nextPage]);

        this.curPageElement.setTextContent(this.currentPage.toString());

        this.prevPage.setAttribute(Disabled, "");

        if (this.currentPage === this.totalPages) {
            this.nextPage.setAttribute(Disabled, "");
        }

        paginator.appendChildren([this.prevPage, this.curPageElement, this.nextPage]);
        return paginator;
    }

    onPageChange(n: number) {
        this.currentPage += n;
        this.getCars();
    }

    updateButtonVisibility() {
        this.prevPage.removeAttribute(Disabled);
        this.nextPage.removeAttribute(Disabled);

        this.curPageElement.setTextContent(this.currentPage.toString());

        if (this.currentPage === 1) {
            this.prevPage.setAttribute(Disabled, "");
        }
        if (this.currentPage === this.totalPages) {
            this.nextPage.setAttribute(Disabled, "");
        }
    }
}