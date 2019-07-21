import { LitElement, css, html } from 'lit-element';

import firebase from '../data/firebase';


class AddTweet extends LitElement {
    constructor() {
        super();
        this.tweet = '';
        this.user = {};
    }

    static get properties() {
        return {
            user: Object,
            tweet: String
        };
    }

    static get styles() {
        return css`

        `;
    }
    

    handleSubmit(event) {
        event.preventDefault();

        firebase.db.collection('tweets').add({
            content: this.tweet,
            user: this.user,
            author: this.user,
            retweet: false,
            comments: [],
            comment: false,
            parent: {},
            likes: [],
            retweets: [],
            date: new Date().getTime()
        }); 

        this.tweet = '';

        return false;
    }

    render() {
        return html`
            <form @submit=${this.handleSubmit}>
                <textarea @input=${e => this.tweet = e.target.value } .value=${this.tweet}></textarea>
                <button type="submit">
                    Tweet
                </button>
            </form>
        `;
    }
}

customElements.define('add-tweet', AddTweet);