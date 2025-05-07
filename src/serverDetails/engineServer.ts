import { Subject } from "./observer";
import { Observer } from "./observer";
import { ServerListener } from "./serverListener";

export interface EngineState {
    //id: number,
    status: 'started'|'stopped'|'drive',
    velocity?: number,
    distance?: number,
}

type Result = {
    "velocity": number,
    "distance": number,
};


type RaceResult = {
    id: number,
    time: number,
};

export class EngineServer implements Subject {
    private observers: Observer[] = [];
	
    public engineState: Map<number, EngineState> = new Map();

    public async switchEngine(id: number, status: "started"|"stopped") {
        this.engineState.set(id, {status});
        
        const params = new URLSearchParams();
        params.append("id", id.toString());
        params.append("status",  this.engineState.get(id)?.status.toString()!);

        let result: Result;

        const response = await fetch(`http://localhost:3000/engine?${params}`, {        
            method: 'PATCH',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        })
        
        result = await response.json() as Result;

        let velocity = result.velocity;
        const distance = result.distance;
        let res = {} as Promise<RaceResult>; 

        if (velocity > 0) {

            this.engineState.set(id, {status, velocity, distance});

            res = this.drive(id);
            this.notify();
        } 
        return res;
    }

    public async drive(idParam: number) : Promise<RaceResult> {
        
        const params = new URLSearchParams();
        params.append("id", idParam.toString());
        params.append("status",  "drive");
        let response;
        
        response = await fetch(`http://localhost:3000/engine?${params}`, {        
            method: 'PATCH',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        })

        if (response.status === 500){
            this.engineState.set(idParam, {status: "stopped", velocity: 1, distance: this.engineState.get(idParam)?.distance});            
        }

        console.log(this.engineState.get(idParam))
        const velocity = response.status === 500 ? 1 : this.engineState.get(idParam)?.velocity?? 1;
        const distance = this.engineState.get(idParam)?.distance || Math.max();

        const resultObj : RaceResult = {
            id: idParam,
            time: distance/velocity,
        }

        console.log(distance, velocity)

        return resultObj;
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
            
            const fetchStartPromises = ServerListener.garage.state.cars.map((car) =>  {
                const fetchStart = this.switchEngine(car.id, "started");
                /*                    const params = new URLSearchParams();
                    params.append("id", car.id.toString());
                    params.append("status",  "started");

                    const fetchStart = fetch(`http://localhost:3000/engine?${params}`, {        
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json;charset=UTF-8',
                        },
                    })
                    */
                   console.log(fetchStart)
                    return fetchStart;
                });    
                
            
            Promise.all(fetchStartPromises).then((value) => {
                value.sort((prev, next) => prev.time - next.time);
                ServerListener.winners.createWinner(value[0]?.id || 0, 1, value[0]?.time || 0);
                });
        }
            /*
        Promise.allSettled(ServerListener.garage.state.cars.map((car) => this.switchEngine(car.id)))
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
