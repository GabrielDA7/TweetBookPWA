import { LitElement, css, html } from 'lit-element';
import firebase from '../data/firebase';

class PasswordChange extends LitElement {
    constructor() {
        super();
        this.newPassword = '';
        this.confirmPassword = '';
        this.error = null;
    }

    static get properties() {
        return {
            newPassword: String,
            confirmPassword: String,
            error: Object
        }
    }

    static get styles() {

    }

    handleSubmit(event) {
        event.preventDefault();
        
        const isValid = this.newPassword != '' && this.confirmPassword != '' && this.newPassword == this.confirmPassword;
        if (!isValid)
            return this.error = { message: 'New password and password confirm must be equal and not empty' };

        firebase
            .auth
            .currentUser
            .updatePassword(this.newPassword)
            .catch(error => this.error = error);

        return false;
    };

    render() {
        return html`<form @submit=${this.handleSubmit}>

            <label for="password-change-new-password">New Password</label>
            <input id="password-change-new-password" type="password" @input="${e => this.newPassword = e.target.value}">

            <label for="password-change-confirm-password">Confirm Password</label>
            <input id="password-change-confirm-password" type="password" @input="${e => this.confirmPassword = e.target.value}">

            <button type="submit">
                Reset My Password
            </button>

            ${this.error && html`<p>${this.error.message}</p>`}
        </form>`
    }
}

customElements.define('password-change', PasswordChange);