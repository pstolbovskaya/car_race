import { ServerListener } from "../serverDetails/serverListener";
import { BaseComponent } from "./baseComponent";
import { baseOptions } from "./baseOptions";
import { Button } from "./buttonComponent";
import { carSvg } from "./carSvg";
import { flagSvg } from "./flagSvg";

export class Car extends BaseComponent{
    private id = 0;

    private carColor: string = '';
    private carTitle: string = '';
    private road: BaseComponent  = new BaseComponent({tag: 'div'}); 
    private title: BaseComponent  = new BaseComponent({tag: 'p'}); 
    private svg: BaseComponent  = new BaseComponent({tag: 'div'}); 
    private finish: BaseComponent = new BaseComponent({tag: 'div'});
    private selectBtn: Button;

    constructor(options: baseOptions, id: number) {
        super(options);
        
        this.id = id;
        this.selectBtn = new Button("Select", () => 
            ServerListener.garage.state.selectedCar = this.id);
        this.init();

        //this.build();
    }
    
    setTitle(title: string) {
        this.carTitle = title;
    }

    init() {
        //this.title.setTextContent(this.carTitle);
        this.finish.setHTML(flagSvg());
        this.finish.toggleClass("flag");
    }

    setColor(input: string){
        this.carColor = input;
    }

    build() {
        this.road.appendChildren([this.svg, this.finish]);
        this.road.toggleClass("road")
        this.title.setTextContent(this.carTitle);
        this.svg.setHTML(carSvg(this.carColor));
        this.appendChildren([this.title, this.selectBtn, this.road]);
    }
}