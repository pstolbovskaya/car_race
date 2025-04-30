import { baseOptions } from "./baseOptions";

export class BaseComponent {
    protected children: Array<BaseComponent> = [];
    protected node: HTMLElement;

    constructor(component: baseOptions, ...children : Array<BaseComponent>) {
        const node = document.createElement(component.tag);
        component.className? node.className = component.className : "";
        component.text? node.textContent    = component.text : "";
        this.node = node;
    
        if (children) {
          this.appendChildren(children);
        }
    }


    append(child: BaseComponent) {
        this.children.push(child);
        this.node.append(child.getNode())
    }

    appendChildren(children: Array<BaseComponent>) {
        children.forEach((child: BaseComponent) => this.append(child));
    }

    getNode() : HTMLElement {
        return this.node;
    }

    getChildren() : Array<BaseComponent> {
        return this.children;
    }

    setTextContent(textContent: string) {
        this.node.textContent = textContent;
    }
    
    setAttribute(attribute: string, value: string) {
        this.node.setAttribute(attribute, value);
    }

    removeAttribute(attribute: string) {
        this.node.removeAttribute(attribute);
    }

    toggleClass(className: string) {
        this.node.classList.toggle(className);
    }

    addEventListener(event: string, listener: () => any, options:boolean|AddEventListenerOptions) {
        this.node.addEventListener(event, listener, options);
    }

    setHTML(html: string) {
        this.node.innerHTML = html;
    }
    
    removeEventListener(event: string, listener: () => any, options:boolean|AddEventListenerOptions) {
        this.node.removeEventListener(event, listener, options);
    }

    destroyChildren() {
        this.children.forEach((child) => child.destroy());
        this.children.length = 0;
    }
    
    destroy() {
        this.destroyChildren();
        this.node.remove();
    }
}