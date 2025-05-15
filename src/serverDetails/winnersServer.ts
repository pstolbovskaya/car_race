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

    public detachAll(): void {
        this.observers.splice(0, this.observers.length);
    }
}
