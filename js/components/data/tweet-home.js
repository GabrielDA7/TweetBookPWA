import { LitElement, html, css } from 'lit-element';
import routes from '../../../constantes/routes';

import firebase from './firebase';
import './tweet-store';
import '../form/add-tweet';
import '../layout/card/tweet-card';

import { getDate } from '../../libs/utils/date';

class TweetHome extends LitElement {

    constructor() {
        super();
        this.tweets = [];
        this.user = {};
    }

    static get properties() {
        return {
            tweets: Array,
            user: Object
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
                .then(doc => {this.user = {id, ...doc.data()}})
            } else {
                this.user = {};
            }
        });
    }

    onBeforeEnter(location, commands, router) {
        const userIsConnected = JSON.parse(localStorage.getItem('logged'));
        if (!userIsConnected) {
            return commands.redirect(routes.SIGNIN_ROUTE);
        }
    }

    messageAdded(e) {
        this.tweets = [...e.detail];
    }

    render() {
        return html`
            <section id="home">
                ${JSON.stringify(this.user) != "{}" ? html`<tweet-store .user="${this.user}" collection="tweets" @child-changed="${this.messageAdded}"></tweet-store>` : null }
                <header>
                    <h4>Welcome, ${this.user.displayName}</h4>
                    <add-tweet .user=${this.user}></add-tweet>
                </header>
                <main>
                    ${this.tweets.map(tweet => {
                        return html`
                        <tweet-card .user=${this.user} .tweet=${{...tweet}}></tweet-card>
					`;})}
                </main>
            </section>
        `
    }
}

customElements.define('tweet-home', TweetHome);