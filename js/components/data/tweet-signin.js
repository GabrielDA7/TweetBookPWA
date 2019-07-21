import { LitElement, html, css } from 'lit-element';

import firebase from './firebase';
import routes from '../../../constantes/routes';

export class TweetSignIn extends LitElement {
    constructor() {
        super();
        this.email = '';
        this.password = '';
        this.error = null;
    }

    static get styles() {
        return css`
        :host {
            display: block;
        }
        `
    }

    static get properties() {
        return {
            email: String,
            password: String,
            error: Object
        }
    }

    handlePost(e) {
        e.preventDefault();
        if (!this.email | !this.password) return this.error = { message: 'Email or password are empty' };
        firebase.auth.signInWithEmailAndPassword(this.email, this.password)
            .then(() => location.replace(routes.HOME_ROUTE))
            .catch(error => this.error = error);
        return false;
    }

    render() {
        return html`
            <h2>Sign In</h2>
            <form @submit="${this.handlePost}">

                <label for="signin-email">Email</label>
                <input id="signin-email" type="text" @input="${e => this.email = e.target.value}">

                <label for="signin-password">Password</label>
                <input id="signin-password" type="password" @input="${e => this.password = e.target.value}">

                <button type="submit">Sign in</button>
                ${this.error ? html`<p>${this.error.message}</p>` : null}
            </form>
        `;
    }
}

customElements.define('tweet-signin', TweetSignIn)