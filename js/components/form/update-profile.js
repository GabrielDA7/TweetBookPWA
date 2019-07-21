import { LitElement, css, html } from 'lit-element';
import firebase from '../data/firebase';

class UpdateProfile extends LitElement {
    constructor() {
        super();
        this.user = {};
        this.error = null;
        this.email = '';
        this.displayName = '';
        this.selectedFile = {};
    }

    static get properties() {
        return {
            user: Object,
            error: Object,
            email: String,
            displayName: String,
            selectedFile: Object
        }
    }

    updated() {
        if (!this.email)
            this.email = this.user.email;
        if (!this.displayName)
            this.displayName = this.user.displayName;

    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `
    }

    async handleSubmit(event) {
        event.preventDefault();
        let propertiesToUpdate = {};

        if (this.displayName != this.user.displayName) {
            propertiesToUpdate.displayName = this.displayName;
        }

        if (this.selectedFile.size > 0) {
            const refUpload = firebase.storage.ref(`users/${this.user.id}/profile/${this.selectedFile.name}`);
            try {
                await refUpload.put(this.selectedFile);
                const photoURL = await refUpload.getDownloadURL();
                propertiesToUpdate.photoURL = photoURL;
            } catch(e) {
                this.error = e;
            }
        }

        if (this.user.email != this.email) {
            propertiesToUpdate.email = this.email;
        }


        if (propertiesToUpdate.hasOwnProperty('displayName') || propertiesToUpdate.hasOwnProperty('photoURL')) {
            try {
                await firebase.auth.currentUser.updateProfile(propertiesToUpdate);
                const userRef = firebase.db.collection("users").doc(this.user.id);
                await userRef.update(propertiesToUpdate);
                const userUpdated = await userRef.get();
                const userUpdatedEvent = new CustomEvent('user-updated', {detail: userUpdated.data()});
                document.querySelector('tweet-app').shadowRoot.querySelector('tweet-header').dispatchEvent(userUpdatedEvent);
                document.querySelector('tweet-app').querySelector('tweet-account').dispatchEvent(userUpdatedEvent);
            } catch(e) {
                this.error = e;
            }
        }

        if (propertiesToUpdate.hasOwnProperty('email')) {
            try {
                await firebase.auth.currentUser.updateEmail(this.email);
            } catch(e) {
                this.error = e;
            }
        }

        return false;
    }

    render() {
        return html`
            <form @submit=${this.handleSubmit}>
                <label for="update-profile-username">Username</label>
                <input
                    id="update-profile-username"
                    value=${this.user.displayName}
                    @input="${e => this.displayName = e.target.value}"
                    type="text"
                />

                <label for="update-profile-email">Email</label>
                <input
                    id="update-profile-email"
                    value=${this.user.email}
                    @input="${e => this.email = e.target.value}"
                    type="text"
                />

                <label for="update-profile-avatar">Avatar</label>
                <input 
                    type="file"
                    id="update-profile-avatar"
                    accept="image/png, image/jpeg" 
                    @input="${e => this.selectedFile = e.target.files[0]}" />
                
    
                <button type="submit">
                    Update profile
                </button>

                ${this.error && html`<p>${this.error.message}</p>`}
            </form>
        `
    }
}

customElements.define('update-profile', UpdateProfile);