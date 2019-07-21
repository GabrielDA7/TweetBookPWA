import { LitElement } from 'lit-element';

import firebase from './firebase';

export class TweetStore extends LitElement {
    constructor() {
        super();
        this.data = [];
        this.collection = '';
        this.user = {};
    }

    static get properties() {
        return {
            data: Array,
            collection: String,
            user: Object
        }
    }

    findAndUpdateTweetComments(data, newTweet) {
        data.forEach((tweet) => {
            if(tweet.id == newTweet.parent.id) {
                tweet.comments = [newTweet, ...tweet.comments];
                return true;
            }

            if(tweet.comments.length > 0) {
                this.findAndUpdateTweetComments(tweet.comments, newTweet);
            }
        });
    }

    findAndUpdateTweetCounters(data, updatedTweet) {
        data.forEach((tweet, index) => {
            if(tweet.id == updatedTweet.id) {
                    data[index] = updatedTweet;
                return true;
            } 

            if(tweet.comments.length > 0) {
                this.findAndUpdateTweetCounters(tweet.comments, updatedTweet);
            }
        });
    }

    findAndDeleteTweet(data, tweetRemoved) {
        data.forEach((tweet, index) => {
            if(tweet.id == tweetRemoved.id) {
                data = data.splice(index, 1);
                return true;
            }

            if(tweet.comments.length > 0) {
                this.findAndDeleteTweet(tweet.comments, tweetRemoved);
            }
        }) 
    }

    addTweet(result) {
        if(!result.comment) {
            this.data = [result, ...this.data];
        } else {
            this.findAndUpdateTweetComments(this.data, result);
        } 
        this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }));
    }

    removeTweet(result) {
        this.findAndDeleteTweet(this.data, result)
        this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }));
    }

    modifyTweet(result) {
        this.findAndUpdateTweetCounters(this.data, result)
        this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }));
    }


    firstUpdated() {
        let queryTweet = firebase.db.collection(this.collection);
        let queryMainTweet = queryTweet.orderBy('date', 'asc');
        queryMainTweet.onSnapshot((ref) => {
            ref.docChanges().forEach(change => {
                const { newIndex, oldIndex, doc, type } = change;
                const id = doc.id;
                const docData = doc.data();
                const result = { id, ...docData }
                if (type == "added") {
                    if((this.user.subscriptions.includes(result.user.id) || this.user.id == result.user.id)) {
                        this.addTweet(result);
                    }
                } else if (type == "removed") {
                    this.removeTweet(result);
                } else if (type == "modified") {
                    if(this.user.subscriptions.includes(docData.user.id) || this.user.id == result.user.id) {
                        this.modifyTweet(result);
                    }
                }
            });
        });
    }
    
}

customElements.define('tweet-store', TweetStore);