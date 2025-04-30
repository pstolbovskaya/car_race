import { BaseComponent } from "../components/baseComponent";
import { baseOptions } from "../components/baseOptions";
import { Car } from "../components/car";
import { Observer, Subject } from "../serverDetails/observer";
import { GarageServer } from "../serverDetails/garageServer";
import { ServerListener } from "../serverDetails/serverListener";

export class Garage extends BaseComponent implements Observer {

    private server: GarageServer;

    constructor(options: baseOptions) {
        
        super(options);
        
        this.server = ServerListener.garage;

        this.server.attach(this);
        this.server.getCars();

        this.run();
    }

    update(subject: Subject): void {
        this.run();
    }

    run() {
        this.destroyChildren();

        this.server.state.cars.forEach(element => {
            const car = new Car({tag: "div"}, element.id);
            car.setTitle(element.name);
            car.setColor(element.color);
            car.build();
            
            this.append(car); 
        });
        
    }
}