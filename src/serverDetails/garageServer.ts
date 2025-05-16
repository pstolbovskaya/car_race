import {Subject} from "../components/dataTypes/observer.ts";
import {Observer} from "../components/dataTypes/observer.ts";
import {createCar} from "../api/garageApi.ts";

export class GarageServer implements Subject {

    private observers: Observer[] = [];

    public state: State = {
        cars: [],
        selectedCar: null,
        page: 1,
        limit: 7,
        designPage: "Garage",
        amount: 0,
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

    public generateCars() {
        const cars = ['Mersedes', 'Audi', 'BMW', 'KIA', 'Hyundai', 'Peugeot', 'Renault', 'Citroen', 'Volkswagen', 'Porsche', 'Ferrari',
            'BYD', 'Tesla', 'Opel', 'Dodge', 'Chevrolet', 'JMC', 'Land rover', 'Range rover', 'Lada', 'Mitsubishi', 'Toyota', 'Mazda',
            'Dongfeng', 'JAC', 'Moskvich', 'Zhiguli', 'Geely', 'Volga', 'Honda', 'Ford'
        ];
        for (let i = 0; i < 100; i++) {
            const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
            const name = cars[Math.floor(Math.random() * cars.length)];

            createCar(name, color);
        }
    }
}

export type CarType = {
    id: number,
    color: string,
    name: string,
}

interface State {
    cars: Array<CarType>,
    selectedCar: CarType | null,
    page: number,
    limit: number,
    designPage: string,
    amount: number,
}