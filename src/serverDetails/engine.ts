import {switchEngine, drive, ENGINE_FAILED} from "../api/engineApi.ts";
import {CarType} from "./garageServer.ts";
export const enum EngineStatus {
    START = "started",
    STOP = "stopped",
    DRIVE = "drive",
}
export class Engine {
    private status: EngineStatus = EngineStatus.STOP;
    private velocity: number = 0;
    private time: number = 0;

    constructor(private car: CarType) {
        this.car = car;
    }

    getStatus = () => this.status;
    getVelocity = () => this.velocity;
    getTime = () => this.time;

    async startEngine() {
        this.status = EngineStatus.START;
        const res = await switchEngine(this.car.id, this.status);
        this.velocity = res.velocity;
        this.time = res.distance/ this.velocity;
        return res;
    }

    stopEngine () {
        this.status = EngineStatus.STOP;
        return switchEngine(this.car.id, this.status);
    }

    async startDrive() {
        this.status = EngineStatus.DRIVE;
        return await drive(this.car.id)
            .then((value) => {
                console.log(value);
                return {id: this.car.id, time: this.time};
            })
            .catch((err: Error) => {
                if (err.message === ENGINE_FAILED) {
                    this.status = EngineStatus.STOP;
                }
                throw err;
            });
    }
}
