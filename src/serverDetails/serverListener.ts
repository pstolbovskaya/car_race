import { GarageServer } from "./garageServer";
import {WinnersServer} from "./winnersServer.ts";

export class ServerListener {
    public static garage = new GarageServer();
    public static winners = new WinnersServer();
}