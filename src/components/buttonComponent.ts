import {BaseComponent} from "./baseComponent";
import {baseOptions} from "./dataTypes/baseOptions.ts";

export class Button extends BaseComponent {
    constructor(text: string, clbck: (this: GlobalEventHandlers, ev: MouseEvent) => any, className?: string) {
        const options: baseOptions = {
            tag: "button",
            className: className,
            text: text,
        };

        super(options);

        this.onClick(clbck);
    }

    onClick(action: (this: GlobalEventHandlers, ev: MouseEvent) => any) {
        this.node.onclick = action;
    }

}