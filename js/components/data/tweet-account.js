import { LitElement, html, css } from 'lit-element';
import routes from '../../../constantes/routes';
import firebase from './firebase';

import '../form/password-change';
import '../form/update-profile';


export class TweetAccount extends LitElement {
    constructor() {
        super();
        this.user = {};
    }

    static get properties() {
        return {
            user: Object,
        }
    }

    firstUpdated() {
        firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                const id = user.uid;
                firebase.db
                    .collection('users')
                    .doc(user.uid)
                    .get()
                    .then(doc => { this.user = { id, ...doc.data() } })
            } else {
                this.user = {};
            }
        });

        this.addEventListener('user-updated', function (event) {
            this.user = { ...event.detail };
        });
    }

    onBeforeEnter(location, commands, router) {
        const userIsConnected = JSON.parse(localStorage.getItem('logged'));
        if (!userIsConnected) {
            return commands.redirect(routes.SIGNIN_ROUTE);
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `
    }

    render() {
        return html`
            ${JSON.stringify(this.user) != "{}" ? html`<tweet-store-account .user="${this.user}" collection="tweets" @child-changed="${this.messageAdded}"></tweet-store-account>` : null }
            <section>
                <header>
                    <h1>Account : ${this.user.displayName}</h1>
                </header>
                <main>
                    <update-profile .user=${this.user}></update-profile>
                    <password-change></password-change>
                </main>
            </section>
        `;
    }
}

customElements.define('tweet-account', TweetAccount);