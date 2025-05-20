import {BaseComponent} from "../components/baseComponent.ts";
import {Button} from "../components/buttonComponent.ts";

const DISABLED = "disabled";

export class Paginator extends BaseComponent {
    private prevPage = new Button("<", () => this.onPageChange(-1));
    private nextPage = new Button(">", () => this.onPageChange(1));
    private curPage = 1;
    private curPageElement = new BaseComponent({tag: "span"});
    private updRecords;

    constructor(clbck: (n: number) => void) {
        super({tag: "div", className: "paginator"});
        this.updRecords = clbck;
        this.appendChildren([this.prevPage, this.nextPage]);

        this.curPageElement.setTextContent(this.currentPage.toString());

        this.prevPage.setAttribute(DISABLED, "");

        this.appendChildren([this.prevPage, this.curPageElement, this.nextPage]);

    }

    currentPage() {
        return this.curPage;
    }

    onPageChange(n: number) {
        this.curPage += n;
        this.updRecords(this.curPage);
    }

    updatePaginator(total: number) {
        this.prevPage.removeAttribute(DISABLED);
        this.nextPage.removeAttribute(DISABLED);

        this.curPageElement.setTextContent(this.currentPage().toString());

        if (this.curPage === 1) {
            this.prevPage.setAttribute(DISABLED, "");
        }
        if (this.curPage === total) {
            this.nextPage.setAttribute(DISABLED, "");
        }
    }
}