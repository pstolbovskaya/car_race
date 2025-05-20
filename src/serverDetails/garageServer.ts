import {Subject} from "../components/dataTypes/observer.ts";
import {Observer} from "../components/dataTypes/observer.ts";

export class GarageServer implements Subject {

    private observers: Observer[] = [];

    public state: State = {
        selectedCar: null,
        designPage: "Garage",
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

    public getObservers() {
        return this.observers;
    }

    public detachAll(): void {
        this.observers.splice(0, this.observers.length);
    }

    public notify(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
}

export type CarType = {
    id: number,
    color: string,
    name: string,
}

interface State {
    selectedCar: CarType | null,
    designPage: string,
}