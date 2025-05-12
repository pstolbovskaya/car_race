import {CarType} from "../../serverDetails/garageServer.ts";
import {ServerListener} from "../../serverDetails/serverListener.ts";
import {BaseComponent} from "../../components/baseComponent.ts";
import {baseOptions} from "../../components/dataTypes/baseOptions.ts";
import {Button} from "../../components/buttonComponent.ts";
import {carSvg} from "../../media/carSvg.ts";
import {flagSvg} from "../../media/flagSvg.ts";
import {Observer, Subject} from "../../components/dataTypes/observer.ts";
import {Engine} from "../../serverDetails/engine.ts";

export class Car extends BaseComponent implements Observer {
    private road: BaseComponent// = new BaseComponent({tag: 'div'});
    private title: BaseComponent// = new BaseComponent({tag: 'p'});
    private svg: BaseComponent// = new BaseComponent({tag: 'div'});
    private finish: BaseComponent// = new BaseComponent({tag: 'div'});
    private selectBtn: Button;
    private deleteBtn: Button;
    private engineStartBtn: Button;
    private engineStopBtn: Button;
    private engine: Engine;

    constructor(options: baseOptions, private car: CarType) {
        super(options);

        this.car = car;
        this.engine = new Engine(car);

        this.selectBtn = new Button("Select", () => {
            ServerListener.garage.state.selectedCar = car;
            ServerListener.garage.getCar();
        });

        this.deleteBtn = new Button("Delete", () =>
            ServerListener.garage.deleteCar());

        this.engineStartBtn = new Button("A", () => this.startEngine());
        this.engineStopBtn = new Button("B", () => this.resetCar());

        this.build();
        this.init();
    }

    startEngine ()  {
        this.engine.startEngine().then((result) => {
            this.drive();
            this.engine.startDrive();

            return result;
        });
    }

    resetCar  ()  {
        this.engine.stopEngine();
        const carSvg = this.svg.getNode();
        carSvg.style.transform = `translateX(0px)`;
    }

    init() {
        this.engineStopBtn.setAttribute("disabled", '');
        this.engineStartBtn.removeAttribute("disabled");

        this.finish.setHTML(flagSvg());
        this.finish.toggleClass("flag");
    }

    build() {
        this.road = new BaseComponent({tag: 'div'});
        this.title = new BaseComponent({tag: 'p'});
        this.svg = new BaseComponent({tag: 'div'});
        this.finish = new BaseComponent({tag: 'div'});

        this.svg.setHTML(carSvg(this.car.color));
        this.road.appendChildren([this.svg, this.finish]);
        this.road.toggleClass("road")
        this.title.setTextContent(this.car.name);
        const selection = new BaseComponent({tag: "div"});
        const engine = new BaseComponent({tag: "div"});
        selection.appendChildren([this.selectBtn, this.deleteBtn]);
        engine.appendChildren([this.engineStartBtn, this.engineStopBtn]);
        this.appendChildren([this.title, selection, engine, this.road]);

        if (ServerListener.garage.state.selectedCar?.id === this.car.id) {
            this.selectBtn.setAttribute("disabled", '');
            this.deleteBtn.removeAttribute("disabled");
        } else {
            this.deleteBtn.setAttribute("disabled", '');
            this.selectBtn.removeAttribute("disabled");
        }
    }

    drive() {
        const car = this.svg.getNode();
        const stepSize = this.engine.getVelocity();
        const carObj    = this;
        let road = window.innerWidth - 150;
        let start: number;
        console.log(stepSize);

        function step(timestamp: number) {
            if (start === undefined) {
                start = timestamp;
            }

            const elapsed = timestamp - start;
            const shift = Math.min(0.01 * stepSize * elapsed, +road);

            if (shift >= +road) {
                carObj.engine.stopEngine();
                return;
            }

            if (shift < +road && carObj.engine.getStatus() !== "stopped") {
                car.style.transform = `translateX(${shift}px)`;
                //console.log(shift)
                //ServerListener.engine.drive(carId.toString());
                requestAnimationFrame(step);
            }

        }

        requestAnimationFrame(step);

        this.engineStopBtn.setAttribute("disabled", '');
        this.engineStartBtn.removeAttribute("disabled");
    }
}