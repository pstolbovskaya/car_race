import { Subject } from "./observer";
import { Observer } from "./observer";

export class WinnersServer implements Subject {
    private observers : Array<Observer> = [];

    public async createWinner(id: number, wins: number, time: number) {
        const response = await fetch('http://localhost:3000//winners/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                id: id, wins: wins, time: time ,
            }),
        })
        console.log(response.json());

        /*this.state.selectedCar = undefined;
        this.getCars();*/
    }
        
    public async updateWinner(id: number, wins: number, time: number) {
        //const id = this.state.selectedCar;

        if (id !== undefined) {
            
            const response = await fetch(`http://localhost:3000/winners/${id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify({
                    wins: wins, time: time,
                }),
            })
            
            /*this.state.selectedCar = undefined;
            this.getCars();*/
        }
            
    }

    public async getWinner(id: number) {
        /*const page = this.state.page;
        const limit = this.state.limit;*/

        const response = await fetch(`http://localhost:3000/winners/${id}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        });
/*
        this.state.cars = await response.json() as Array<any>;
        this.notify();*/
    }

    public async getWinners(page: number, limit: number, sort: 'id'|'wins'|'time', order: 'ASC'|'DESC') {
       /* const page = this.state.page;
        const limit = this.state.limit;*/
        
        const response = await fetch(`http://localhost:3000/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        });

        /*this.state.cars = await response.json() as Array<any>;
        this.notify();*/
    }

    public async deleteWinner(id: number) {
        const response = await fetch(`http://localhost:3000//winners/${id}`, {
            method: 'DELETE',
        })
        console.log(response.json());

/*        this.state.selectedCar = undefined;
        this.getCars();*/
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
