import { LitElement, html, css } from 'lit-element';
import routes from '../../../constantes/routes';
import firebase from '../data/firebase';

import '../form/search-user';
import '../layout/card/user-card';

class TweetSearch extends LitElement {
    constructor() {
        super();
        this.searchResult = [];
        this.user = {};
    }

    static get properties() {
        return {
            searchResult: Array,
            user: Object
        }
    }

    static get styles() {
        return css`
        `;
    }

    firstUpdated() {
        firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                const id = user.uid;
                firebase.db
                .collection('users')
                .doc(user.uid)
                .get()
                .then(doc => {this.user = {id, ...doc.data()}})
            } else {
                this.user = {};
            }
        });
    }

    onBeforeEnter(locatsion, commands, router) {
        const userIsConnected = JSON.parse(localStorage.getItem('logged'));
        if (!userIsConnected) {
            return commands.redirect(routes.SIGNIN_ROUTE);
        }
    }

    render() {
        return html`
            <header>
                <h1>Search</h1>
                <search-user @search-result=${event => this.searchResult = event.detail}></search-user>
            </header>
            <main>
                ${this.searchResult.map(user => {
                    return this.user.id != user.id ?
                    html`<user-card .userConnected=${this.user} .user=${user}></user-card>`
                    : null
                })}
            </main>
        `
    }
}

customElements.define('tweet-search', TweetSearch);