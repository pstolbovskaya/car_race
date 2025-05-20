import {BaseComponent} from "./baseComponent";
import {baseOptions} from "./dataTypes/baseOptions.ts";

export class Input extends BaseComponent {
    constructor(className: string, clbck?: (this: GlobalEventHandlers, ev: Event) => any) {

        const options: baseOptions = {
            tag: "input",
            className: className,
        };

        super(options)

        if (clbck) {
            this.onInput(clbck);
        }
    }

    getValue(): string {
        return (this.getNode() as HTMLInputElement).value;
    }

    setValue(value: string) {
        (this.getNode() as HTMLInputElement).value = value;
    }

    onInput(action: (this: GlobalEventHandlers, ev: Event) => any) {
        this.node.oninput = action;
    }

}