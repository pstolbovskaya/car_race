import { CarType } from "../serverDetails/garageServer";
import { ServerListener } from "../serverDetails/serverListener";
import { BaseComponent } from "../components/baseComponent";
import { baseOptions } from "../components/baseOptions";
import { Button } from "../components/buttonComponent";
import { carSvg } from "../media/carSvg";
import { flagSvg } from "../media/flagSvg";
import { EngineState } from "../serverDetails/engineServer";

export class Car extends BaseComponent{
    private road: BaseComponent  = new BaseComponent({tag: 'div'}); 
    private title: BaseComponent  = new BaseComponent({tag: 'p'}); 
    private svg: BaseComponent  = new BaseComponent({tag: 'div'}); 
    private finish: BaseComponent = new BaseComponent({tag: 'div'});
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
            ServerListener.engine.engineState = {
                id: car.id,
                status: 'started',
            };
            ServerListener.engine.switchEngine();            
        })

        this.engineStopBtn = new Button("B", () => {
            ServerListener.engine.engineState = {
                id: car.id,
                status: 'stopped',
            };
            ServerListener.engine.switchEngine(); 
        })

        this.init();

        //this.build();
    }

    init() {
        //this.title.setTextContent(this.carTitle);
        this.finish.setHTML(flagSvg());
        this.finish.toggleClass("flag");
    }

    build() {
        this.road.appendChildren([this.svg, this.finish]);
        this.road.toggleClass("road")
        this.title.setTextContent(this.car.name);
        const  selection = new BaseComponent({tag: "div"});
        const  engine = new BaseComponent({tag: "div"});
        selection.appendChildren([this.selectBtn, this.deleteBtn]);
        engine.appendChildren([this.engineStartBtn, this.engineStopBtn]);

        this.svg.setHTML(carSvg(this.car.color));
        this.appendChildren([this.title, selection, engine, this.road]);

        if (ServerListener.garage.state.selectedCar?.id === this.car.id) {
            this.selectBtn.setAttribute("disabled", '');
            this.deleteBtn.removeAttribute("disabled");
        } else {
            this.deleteBtn.setAttribute("disabled", '');
            this.selectBtn.removeAttribute("disabled");
        }
    }
}