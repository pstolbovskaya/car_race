import { Subject } from "./observer";
import { Observer } from "./observer";

export class GarageServer implements Subject {
	
	private observers: Observer[] = [];

	public state : State = {
		cars: [],
		selectedCar: null,
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

		this.state.selectedCar = null;
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
			
			this.state.selectedCar = null;
			this.getCars();
		}
			
	}

	public async getCar() {
		const id = this.state.selectedCar?.id;

		if (id) {

			const response = await fetch(`http://localhost:3000/garage/${id}`, {
				method: 'GET',
			});
			
			//this.state.selectedCar = await response.json() as CarType;
		}

		this.notify();
		//this.getCars();
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

		this.state.cars = await response.json() as Array<CarType>;
		this.notify();
	}

	public async deleteCar() {
		const id = this.state.selectedCar?.id;

		if (id) {
			const response = await fetch(`http://localhost:3000/garage/${id}`, {
				method: 'DELETE',
			});
		
			this.state.selectedCar = null;
			this.getCars();
		}
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

	public generateCars() {
		const cars = ['Mersedes', 'Audi', 'BMW', 'KIA', 'Hyundai', 'Peugeot', 'Renault', 'Citroen', 'Volkswagen', 'Porsche', 'Ferrari',
			'BYD', 'Tesla', 'Opel', 'Dodge', 'Chevrolet', 'JMC', 'Land rover', 'Range rover', 'Lada', 'Mitsubishi', 'Toyota', 'Mazda',
			'Dongfeng', 'JAC', 'Moskvich', 'Zhiguli', 'Geely', 'Volga', 'Honda', 'Ford'
		];
		for (let i=0; i<100; i++) {
			const color = "#" + Math.floor(Math.random()*16777215).toString(16);
			const name = cars[Math.floor(Math.random() * cars.length)];

			this.createCar(name, color);
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
}