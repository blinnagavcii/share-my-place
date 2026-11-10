import { Modal } from "./ui/modal";
import { Map } from "./ui/map";
import {
    getCoordinatiesFromAddress,
    getAddressFromCoordinates,
} from "./utility/location";

class PlaceFinder {
    constructor() {
        const addressForm = document.querySelector("form");
        const locateUserButton = document.getElementById("locate-btn");
        this.copyLinkButton = document.getElementById("link-btn");
        this.sharedLinkInputElement = document.getElementById("share-link");

        addressForm.addEventListener("submit", this.findAddress.bind(this));
        locateUserButton.addEventListener("click", this.locateUser.bind(this));
        this.copyLinkButton.addEventListener(
            "click",
            this.sharePlaceHandler.bind(this)
        );
    }

    async findAddress(event) {
        event.preventDefault();

        const address = event.target.querySelector("input").value;
        if (!address || address.trim().length === 0) {
            alert("Invalid address!");
            return;
        }

        const modal = new Modal("loading-modal-content", "Loading location...");
        modal.show();

        try {
            const coordinates = await getCoordinatiesFromAddress(address);
            this.selectPlace(coordinates, address);
        } catch (error) {
            alert(error.message);
        }

        modal.hide();
    }

    locateUser() {
        if (!navigator.geolocation) {
            alert("Location not available. Please update your browser!");
            return;
        }

        const modal = new Modal("loading-modal-content", "Loading location...");
        modal.show();

        navigator.geolocation.getCurrentPosition(
            async (result) => {
                const coordinates = {
                    lat: result.coords.latitude,
                    lng: result.coords.longitude,
                };

                const address = await getAddressFromCoordinates(coordinates);
                modal.hide();
                this.selectPlace(coordinates, address);
            },
            (error) => {
                modal.hide();
                alert(
                    "Could not locate user. Please enter an address manually!"
                );
            }
        );
    }

    selectPlace(coordinates, address) {
        if (this.map) {
            this.map.render(coordinates);
        } else {
            this.map = new Map(coordinates);
        }

        this.copyLinkButton.disabled = false;
        this.sharedLinkInputElement.value = `${
            location.origin
        }/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${
            coordinates.lng
        }}`;
    }

    async sharePlaceHandler() {
        if (!navigator.clipboard) {
            this.sharedLinkInputElement.select();
            return;
        }

        try {
            await navigator.clipboard.writeText(
                this.sharedLinkInputElement.value
            );
            alert("Copied into clipboard!");
        } catch (error) {
            alert(error.message);
        }
    }
}

new PlaceFinder();
