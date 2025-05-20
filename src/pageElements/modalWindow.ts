import {Button} from "../components/buttonComponent.ts";
import {BaseComponent} from "../components/baseComponent.ts";

export class ModalWindow extends BaseComponent {
    private modalContent = new BaseComponent({tag: "div", className: "modal__content"});
    constructor() {

        super({tag: "div", className: "modal"});

        const closeBtn = new Button("X", () => this.closeModal(), "modal__close");
        const modalContainer = new BaseComponent({tag: "div", className: "modal__container"});

        modalContainer.append(this.modalContent);
        modalContainer.append(closeBtn);

        this.append(modalContainer);
    }

    openModal () {
        this.toggleClass("modal_visible");
    }

    closeModal () {
        this.toggleClass("modal_visible");
    }

    updateModalContent (name: string, time: number) {
        const carName = name[0].toUpperCase() + name.slice(1).toLowerCase();
        this.modalContent.setTextContent(`Car ${carName} won the race with ${time}!`);
    }
}