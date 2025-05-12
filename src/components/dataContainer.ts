import { BaseComponent } from "./baseComponent";
import { Button } from "./buttonComponent";
import { Input } from "./inputComponent";
import { baseOptions } from "./dataTypes/baseOptions.ts";

export class DataContainer extends BaseComponent {
    private input: Input;
    private color: Input;
    private btn: Button;

    constructor(options: baseOptions, btnText: string, clbck: (name: string, color: string, id?: string) => void) {    
        options.tag = "div";

        super(options); 

        this.input   = new Input("");
        this.color   = new Input("");

        this.btn     = new Button(btnText, () => clbck(this.input.getValue(), this.color.getValue()));

        this.init();
        
        this.appendChildren([this.input, this.color, this.btn]);
    }

    init() {
        this.color.setAttribute("type", "color");
    }
}