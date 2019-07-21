import { LitElement, html, css } from 'lit-element';
import firebase from '../data/firebase';

export class AddComment extends LitElement {
    constructor() {
        super();
        this.tweet = {};
        this.user = {};
        this.comment = '';
    }

    static get properties() {
        return {
            comment: String,
            tweet: Object,
            user: Object
        }
    }


    handleSubmit(event) {
        event.preventDefault();
        
        const newCommentData = {
            content: this.comment,
            user: this.user,
            author: this.user,
            retweet: false,
            comment: true,
            comments: [],
            parent: this.tweet,
            likes: [],
            retweets: [],
            date: new Date().getTime()
        }

        firebase.db.collection('tweets').add(newCommentData);

        this.comment = '';

        return false;
    }

    render() {
        return html`
            <form @submit=${this.handleSubmit}>
                <textarea @input=${e => this.comment = e.target.value} .value=${this.comment}></textarea>
                <button type="submit">
                    Comment
                </button>
            </form>
        `;
    }
}

customElements.define('add-comment', AddComment);