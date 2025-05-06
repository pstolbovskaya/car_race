import { Subject } from "./observer";
import { Observer } from "./observer";
import { ServerListener } from "./serverListener";

export interface EngineState {
    id: number,
    status: 'started'|'stopped'|'drive',
    velocity?: number,
    distance?: number,
}

type Result = {
    "velocity": number,
    "distance": number,
};

export class EngineServer implements Subject {
    private observers: Observer[] = [];
	
    public engineState: EngineState = {
        id: 0,
        status: 'stopped',
        velocity: 0,
        distance: 0,
    };

    public async switchEngine(id?: number) {
        const idParam = id? id.toString() : this.engineState.id.toString();
        const params = new URLSearchParams();
        params.append("id", idParam);
        params.append("status",  this.engineState.status);

        let result: Result;

        const response = await fetch(`http://localhost:3000/engine?${params}`, {        
            method: 'PATCH',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        })
        
        result = await response.json() as Result;

        if (this.engineState.status === "started") {

          if (result.velocity > 0) {
            this.engineState.distance = result.distance;
            this.engineState.velocity = result.velocity;
            
            this.drive(idParam);
            this.notify();
        }
        

        }
    }

    public async drive(idParam: string) {
        
        const params = new URLSearchParams();
        params.append("id", idParam);
        params.append("status",  "drive");
        let response;
        
        this.engineState.status = "started";
        
        response = await fetch(`http://localhost:3000/engine?${params}`, {        
            method: 'PATCH',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        }).catch(() => this.engineState.status = "stopped")
        
    }

	public attach(observer: Observer): void {
		if (!this.observers.includes(observer)) {
			this.observers.push(observer);
		}
	}

	public detach(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex !== -1) {
    		this.observers.splice(observerIndex, 1);
        }
    }

	public notify(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    public async startRace() {
        if (ServerListener.garage.state.cars) {

/*            Promise.allSettled(ServerListener.garage.state.cars.map((car) => this.switchEngine(car.id)))
            .then(results => { // (*)
                results.forEach((result, num) => {
                    if (result.status == "fulfilled") {
                        alert(`${urls[num]}: ${result.value.status}`);
                    }
                    if (result.status == "rejected") {
                        alert(`${urls[num]}: ${result.reason}`);
                    }
                });
            }*/
        }
    }
}