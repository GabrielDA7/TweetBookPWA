import { LitElement, html, css } from 'lit-element';

import firebase from './firebase';
import routes from '../../../constantes/routes';

export class TweetSignUp extends LitElement {
    constructor() {
        super();
        this.email = '';
        this.displayName = '';
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
            displayName: String,
            error: Object
        }
    }

    handlePost(e) {
        e.preventDefault();
        if (!this.email || !this.password || !this.displayName) return this.error = { message: 'Email, password or username are empty' };
        firebase.auth.createUserWithEmailAndPassword(this.email, this.password)
            .then(async authUser => {
                const displayName = this.displayName
                const photoURL = await firebase.storage.ref().child('users/default/profile/defaultProfile.png').getDownloadURL();
                await authUser.user.updateProfile({ displayName, photoURL });
                return authUser.user;
            })
            .then(user => {
                const { uid, displayName, photoURL, email } = user;
                return firebase.db.doc(`users/${uid}`).set({ displayName, photoURL, email, followers: [], subscriptions: [] })
            }).then(() => location.replace(routes.HOME_ROUTE))
            .catch(error => this.error = error);
    }

    render() {
        return html`
            <h1>Create User</h1>
            <form @submit="${this.handlePost}">
                <label for="signup-email">Email</label>
                <input id="signup-email" type="text" @input="${e => this.email = e.target.value}">

                <label for="signup-username">Username</label>
                <input id="signup-username" type="text" @input="${e => this.displayName = e.target.value}">

                <label for="signup-password">Password</label>
                <input id="signup-password" type="password" @input="${e => this.password = e.target.value}">
                <button type="submit">Sign up</button>
                ${this.error ? html`<p>${this.error.message}</p>` : null}
            </form>
        `
    }
}

customElements.define('tweet-signup', TweetSignUp);