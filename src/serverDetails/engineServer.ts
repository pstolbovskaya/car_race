import { Subject } from "./observer";
import { Observer } from "./observer";

export interface EngineState {
    id: number,
    status: 'started'|'stopped'|'drive',

}

export class EngineServer implements Subject {
    private observers: Observer[] = [];
	
    public engineState: EngineState = {
        id: 0,
        status: 'stopped',
    };

    public async switchEngine() {
        const params = new URLSearchParams();
        params.append("id", this.engineState.id.toString());
        params.append("status",  this.engineState.status);

        const response = await fetch(`http://localhost:3000/engine?${params}`, {        
            method: 'PATCH',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        })
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
}