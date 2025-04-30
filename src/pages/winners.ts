import { BaseComponent } from "../components/baseComponent";
import { baseOptions } from "../components/baseOptions";

export class Winners extends BaseComponent{
    title   = new BaseComponent({tag: "p", text: "Winners"});
    page    = new BaseComponent({tag: "p"});
    winnerList  = new BaseComponent({tag:"table"});

    constructor(options: baseOptions) {
        super(options);

        this.init();
        
        this.appendChildren([this.title, this.page, this.winnerList]);
    }

    init() {
        this.page.setTextContent("1"); //paginator?
    }
}