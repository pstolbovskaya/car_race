import { Subject } from "./observer";
import { Observer } from "./observer";

export type WinnerType = {
	id: number,  
    wins: number,
    time: number,
}


interface State {
    winners: Array<WinnerType>,
    page: number,
    limit: number,
}

export class WinnersServer implements Subject {
    private observers : Array<Observer> = [];

    public winPage : State = {
        winners: [],
        page: 1,
        limit: 10,
    }
    
    public async createWinner(id: number, wins: number, time: number) {
        const response = await fetch('http://localhost:3000/winners/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                id: id, wins: wins, time: time,
            }),
        })
    }
        
    public async updateWinner(id: number, wins: number, time: number) {

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
        }
    }

    public async getWinner(id: number) {
        const response = await fetch(`http://localhost:3000/winners/${id}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        });
    }

    public async getWinners(page?: number, limit?: number, sort?: 'id'|'wins'|'time', order?: 'ASC'|'DESC') {
        const response = await fetch(`http://localhost:3000/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        });

        this.winPage.winners = await response.json() as Array<WinnerType>;
        this.notify();
    }

    public async deleteWinner(id: number) {
        const response = await fetch(`http://localhost:3000//winners/${id}`, {
            method: 'DELETE',
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
