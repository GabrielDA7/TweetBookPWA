import { LitElement, css, html } from 'lit-element';
import firebase from '../../data/firebase';
import { getDate } from '../../../libs/utils/date';
import '../../form/add-comment';
import '../../utils/lazyImage';

export class TweetCard extends LitElement {
    constructor() {
        super();
        this.tweet = {};
        this.user = {};
    }

    static get properties() {
        return {
            tweet: Object,
            user: Object
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .tweet-main {
                display: flex;
            }

            .avatar-container {
                position: relative;
                width: 60px;
                padding-left: 10px;
                padding-right: 10px;
            }

            .comment-bar {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 5px;
                background-color: grey;
                height: 100%;
                z-index: 10;
            }

            .tweet-comments {
                display: none;
                padding-left: 15px;
                border-bottom : 1px solid black;
            }
        `;
    }

    handleComments(event) {
        event.preventDefault();

        const commentsSection = this.shadowRoot.querySelector('.tweet-comments');

        if (commentsSection.style.display === "none") {
            commentsSection.style.display = "block";
        } else {
            commentsSection.style.display = "none";
        }

        return false;
    }

    handleLike(event) {
        event.preventDefault();

        const tweetRef = firebase.db.collection("tweets").doc(this.tweet.id);
        if (!this.tweet.likes.includes(this.user.id)) {
            firebase.db.runTransaction(transaction => {
                return transaction.get(tweetRef).then(doc => {
                    if (!doc.exists) return console.log('document not exist');
                    transaction.update(tweetRef, { likes: [this.user.id, ...this.tweet.likes] });
                });
            }).catch(function (error) {
                console.log("Transaction failed: ", error);
            });
        }
    }

    handleRetweet(event) {
        event.preventDefault();

        const tweetRef = firebase.db.collection("tweets").doc(this.tweet.id);

        if (!this.tweet.retweets.includes(this.user.id)) {
            firebase.db.runTransaction(transaction => {
                return transaction.get(tweetRef).then(doc => {
                    if (!doc.exists) return console.log('document not exist');
                    transaction.update(tweetRef, { retweets: [this.user.id, ...this.tweet.retweets] });

                    const tweet = doc.data();
                    tweet.user = this.user;
                    tweet.retweet = true;
                    tweet.parent = {};

                    const newTweetRef = firebase.db.collection("tweets").doc();
                    transaction.set(newTweetRef, tweet);
                });
            }).catch(function (error) {
                console.log("Transaction failed: ", error);
            });
        }
    }

    deleteTweetComments(data) {
        data.forEach(tweet => {
            if(tweet.comments.length > 0) {
                this.deleteTweetComments(tweet.comments);
            } else {
                const tweetRef = firebase.db.collection('tweets').doc(tweet.id);
                tweetRef.delete();
            }
        });
    }

    handleDelete(event) {
        event.preventDefault();
        if(this.tweet.comments.length > 0) {
            this.deleteTweetComments(this.tweet.comments);
        } 
        
        const tweetRef = firebase.db.collection('tweets').doc(this.tweet.id);
        tweetRef.delete();
    }

    render() {
        return html`
            <div class="tweet-card">
                ${this.tweet.retweet ? html`<div class="retweet">${this.tweet.user.id == this.user.id ? html`You` : html`${this.tweet.user.displayName}`} have retweeted</div>` : null}
                <div class="tweet-main">
                    <div class="avatar-container">
                        <lazy-image className="tweet-avatar" src="${this.tweet.author.photoURL}" alt="user avatar">
                        ${this.tweet.comment ? html`
                        <div class="comment-bar"></div>
                        ` : null}
                    </div>
                
                    <div class="tweet-content">
                        <div class="tweet-header">
                            <span>${this.tweet.author.displayName}</span>
                            <span>${this.tweet.author.email}</span>
                            <span>${getDate(this.tweet.date)}</span>
                            ${this.tweet.user.id == this.user.id ? html`<a @click=${this.handleDelete} class="delete-comment">x</a>` : null}
                        </div>
                        <div class="tweet-content">
                            <p>${this.tweet.content}</p>
                        </div>
                        <div class="tweet-counters">
                            <a @click=${this.handleComments} class="comments-count">
                                c <span>${this.tweet.comments.length}</span>
                            </a>
                            <a @click=${this.handleLike} class="likes-count">
                                l <span>${this.tweet.likes.length}</span>
                            </a>
                            <a @click=${this.handleRetweet} class="retweets-count">
                                r <span>${this.tweet.retweets.length}</span>
                            </a>
                        </div>
                    </div>
                </div>
                <section class="tweet-comments">
                    <main>
                    ${this.tweet.comments.map(comment => {
                        return html`<tweet-card .user=${this.user} .tweet=${{...comment}}></tweet-card>`
                    })}
                    </main>
                    <footer>
                        <add-comment .user=${this.user} .tweet=${this.tweet}></add-comment>
                    </footer>
                </section>
            </div>
        `;
    }
}

customElements.define('tweet-card', TweetCard);