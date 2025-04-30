import { Subject } from "./observer";
import { Observer } from "./observer";

export class GarageServer implements Subject {
	
	private observers: Observer[] = [];
	public state : State = {
		cars: [],
		selectedCar: undefined,
		page: 1,
		limit: 7,
		designPage: "Garage",
	}

	public async createCar(name: string, color: string) {
		const response = await fetch('http://localhost:3000/garage', {
			method: 'POST',
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
			body: JSON.stringify({
				name: name.toLowerCase(), color: color.toLowerCase() ,
			}),
		})
		console.log(response.json());

		this.state.selectedCar = undefined;
		this.getCars();
	}
		
	public async updateCar(name: string, color: string) {
		const id = this.state.selectedCar;

		if (id !== undefined) {
			
			const response = await fetch(`http://localhost:3000/garage/${id}`, {
				method: 'PUT',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
				},
				body: JSON.stringify({
					name: name.toLowerCase(), color: color.toLowerCase() ,
				}),
			})
			
			this.state.selectedCar = undefined;
			this.getCars();
		}
			
	}

	public async getCars() {
		const page = this.state.page;
		const limit = this.state.limit;

		const response = await fetch(`http://localhost:3000/garage?_page=${page}&_limit=${limit}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		});

		this.state.cars = await response.json() as Array<any>;
		this.notify();
	}

	public async deleteCar(page?: number, ) {

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

type Car = {
	id: number, 
	color: string, 
	name: string,
}

interface State {
	cars: Array<Car>,
	selectedCar: number|undefined,
	page: number,
	limit: number,
	designPage: string,
}