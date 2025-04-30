import { EngineServer } from "./engineServer";
import { GarageServer } from "./garageServer";
import { WinnersServer } from "./winnersServer";

export class ServerListener{
    public static garage = new GarageServer();
    public static winners = new WinnersServer();
    public static engine = new EngineServer();
}