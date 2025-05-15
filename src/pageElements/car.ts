import {CarType} from "../serverDetails/garageServer.ts";
import {ServerListener} from "../serverDetails/serverListener.ts";
import {BaseComponent} from "../components/baseComponent.ts";
import {baseOptions} from "../components/dataTypes/baseOptions.ts";
import {Button} from "../components/buttonComponent.ts";
import {carSvg} from "../media/carSvg.ts";
import {flagSvg} from "../media/flagSvg.ts";
import {Engine, EngineStatus} from "../serverDetails/engine.ts";
import {deleteCar} from "../api/garageApi.ts";

export class Car extends BaseComponent {
    private road: BaseComponent = new BaseComponent({tag: 'div'});
    private title: BaseComponent = new BaseComponent({tag: 'p'});
    private svg: BaseComponent = new BaseComponent({tag: 'div'});
    private finish: BaseComponent = new BaseComponent({tag: 'div'});
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
            ServerListener.garage.notify();
        });

        this.deleteBtn = new Button("Delete", async () => {
            await deleteCar(car.id);
            ServerListener.garage.notify();
        });


        this.engineStartBtn = new Button("A", () => this.startEngine());
        this.engineStopBtn = new Button("B", () => this.resetCar());

        this.build();
        this.init();
    }

    startEngine()  {
        return this.engine.startEngine().then(() => {
            this.drive();
            return this.engine.startDrive();
        });
    }

    resetCar ()  {
        this.engine.stopEngine();
        const carSvg = this.svg.getNode();
        carSvg.style.transform = `translateX(0px)`;
        this.engineStartBtn.removeAttribute("disabled");
        this.engineStopBtn.setAttribute("disabled", "");
    }

    init() {
        this.engineStopBtn.setAttribute("disabled", '');
        this.engineStartBtn.removeAttribute("disabled");

        this.finish.setHTML(flagSvg());
        this.finish.toggleClass("flag");
    }

    build() {
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
        const road = window.innerWidth - 150;
        const animationTime = 1000*road/stepSize;

        let start: number;

        function step(timestamp: number) {
            if (start === undefined) {
                start = timestamp;
            }

            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / animationTime, 1);
            const shift =  road * progress;

            if (progress < 1 && carObj.engine.getStatus() !== EngineStatus.STOP) {
                car.style.transform = `translateX(${shift}px)`;
                requestAnimationFrame(step);
            } else {
                carObj.engine.stopEngine();

            }

        }

        requestAnimationFrame(step);

        if (carObj.engine.getStatus() !== EngineStatus.STOP) {
            this.engineStopBtn.removeAttribute("disabled");
            this.engineStartBtn.setAttribute("disabled", '');
        }
    }
}