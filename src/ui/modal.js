export class Modal {
    constructor(id, fallbackText) {
        this.fallbackText = fallbackText;
        this.contentTemplateElement = document.getElementById(id);
        this.modalTemplateElement = document.getElementById("modal-template");
    }

    show() {
        if ("content" in document.createElement("template")) {
            const modalElements = document.importNode(
                this.modalTemplateElement.content,
                true
            );
            this.modalElement = modalElements.querySelector(".modal");
            this.backdropElement = modalElements.querySelector(".backdrop");
            const contentElement = document.importNode(
                this.contentTemplateElement.content,
                true
            );

            this.modalElement.appendChild(contentElement);
            document.body.insertAdjacentElement(
                "afterbegin",
                this.modalElement
            );
            document.body.insertAdjacentElement(
                "afterbegin",
                this.backdropElement
            );
        } else {
            alert(this.fallbackText);
        }
    }

    hide() {
        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;

            this.backdropElement.remove();
            this.backdropElement = null;
        }
    }
}
