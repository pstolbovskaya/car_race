import {CarType} from "../serverDetails/garageServer";
import {ServerListener} from "../serverDetails/serverListener";
import {BaseComponent} from "../components/baseComponent";
import {baseOptions} from "../components/baseOptions";
import {Button} from "../components/buttonComponent";
import {carSvg} from "../media/carSvg";
import {flagSvg} from "../media/flagSvg";
import {Observer, Subject} from "../serverDetails/observer";

export class Car extends BaseComponent implements Observer {
    private road: BaseComponent// = new BaseComponent({tag: 'div'});
    private title: BaseComponent// = new BaseComponent({tag: 'p'});
    private svg: BaseComponent// = new BaseComponent({tag: 'div'});
    private finish: BaseComponent// = new BaseComponent({tag: 'div'});
    private selectBtn: Button;
    private deleteBtn: Button;
    private engineStartBtn: Button;
    private engineStopBtn: Button;

    constructor(options: baseOptions, private car: CarType) {
        super(options);

        this.car = car;
        this.selectBtn = new Button("Select", () => {
            ServerListener.garage.state.selectedCar = car;
            ServerListener.garage.getCar();
        });

        this.deleteBtn = new Button("Delete", () =>
            ServerListener.garage.deleteCar());

        this.engineStartBtn = new Button("A", () => {
            //ServerListener.engine.engineState.set(this.car.id, {"started"})
            ServerListener.engine.switchEngine(this.car.id, "started");
        })

        this.engineStopBtn = new Button("B", () => {
            /*ServerListener.engine.engineState = {
                id: car.id,
                status: 'stopped',
            };*/
            ServerListener.engine.switchEngine(this.car.id, "stopped");
        })

        ServerListener.engine.attach(this);

        this.build();
        this.init();

        //this.build();
    }

    init() {

        this.engineStopBtn.setAttribute("disabled", '');
        this.engineStartBtn.removeAttribute("disabled");

        this.finish.setHTML(flagSvg());
        this.finish.toggleClass("flag");
    }

    update(subject: Subject): void {
        this.listenEngine();
    }

    build() {
        console.log("Building...");
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

    listenEngine() {
        if (ServerListener.engine.engineState.get(this.car.id)?.status === "started") {
            this.drive();
        }
    }

    drive() {
        const stepSize = (ServerListener.engine.engineState.get(this.car.id)?.velocity ?? 0);
        const car = this.svg.getNode();
        //let road        = (ServerListener.engine.engineState.get(this.car.id)?.distance?? 0) * 0.002;
        const carId = this.car.id;
        let road = window.innerWidth - 150;

        if (!car) {
            console.log("Car element not found");
        }

        console.log(car)
        ServerListener.engine.engineState.set(this.car.id, {status: "drive", velocity: stepSize, distance: road * 500});

        let start: number;

        function step(timestamp: number) {
            if (start === undefined) {
                start = timestamp;
            }
            const elapsed = timestamp - start;
            // Math.min() is used here to make sure the element stops at exactly 200px
            const shift = Math.min(0.01 * stepSize * elapsed, +road);
            car.style.transform = `translateX(${shift}px)`;

            if (shift < +road && ServerListener.engine.engineState.get(carId)?.status !== "stopped") {
                //ServerListener.engine.drive(carId.toString());
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);

        this.engineStopBtn.setAttribute("disabled", '');
        this.engineStartBtn.removeAttribute("disabled");
    }
}