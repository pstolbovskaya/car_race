import { BaseComponent } from "./baseComponent";
import { baseOptions } from "./dataTypes/baseOptions.ts";

export class Input extends BaseComponent {
    constructor(className: string, clbck?: (this: GlobalEventHandlers, ev: MouseEvent) => any) {
        
        const options: baseOptions = {
            tag: "input",
            className: className,
        };

        super(options)

        if (clbck) {
            this.onClick(clbck);
        }
    }

    getValue(): string {
        return (this.getNode() as HTMLInputElement).value;
    }

    onClick(action: (this: GlobalEventHandlers, ev: MouseEvent) => any) {
        this.node.onclick = action;
    }

}