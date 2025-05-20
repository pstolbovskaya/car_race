export interface Subject {
    attach(observer: Observer): void;

    detach(observer: Observer): void;

    detachAll(): void;

    notify(): void;
}

export interface Observer {
    update(subject: Subject): void;
}