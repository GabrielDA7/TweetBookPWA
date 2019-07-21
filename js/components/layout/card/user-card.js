import { LitElement, html, css } from 'lit-element';
import firebase from '../../data/firebase';
import '../../utils/lazyImage';

export class UserCard extends LitElement {
    constructor() {
        super();
        this.user = {};
        this.userConnected = {};
    }

    static get properties() {
        return {
            user: Object,
            userConnected: Object,
        }
    }


    static get styles() {
        return css`
            :host {
                display: block;
            }

            .user-card {
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }

            .user-info {
                display: flex;
                flex-direction: column;
            }

            .user-card .col {
                flex-basis: 33%;
            }
        `;
    }

    handleFollow(event) {
        const userRef = firebase.db.collection("users").doc(this.userConnected.id);

        if (!this.userConnected.subscriptions.includes(this.user.id)) {
            firebase.db.runTransaction(transaction => {
                return transaction.get(userRef).then(doc => {
                    if (!doc.exists) console.log('document not exist');
                    this.userConnected.subscriptions = [this.user.id, ...this.userConnected.subscriptions];
                    this.userConnected = {...this.userConnected};
                    transaction.update(userRef, { subscriptions: this.userConnected.subscriptions });
                });
            }).catch(function (error) {
                console.log("Transaction failed: ", error);
            });
        }
    }

    handleUnfollow(event) {
        const userRef = firebase.db.collection("users").doc(this.userConnected.id);

        if (this.userConnected.subscriptions.includes(this.user.id)) {
            firebase.db.runTransaction(transaction => {
                return transaction.get(userRef).then(doc => {
                    if (!doc.exists) console.log('document not exist');
                    this.userConnected.subscriptions = this.userConnected.subscriptions.filter(subscription => subscription !== this.user.id) 
                    this.userConnected = {...this.userConnected};
                    transaction.update(userRef, { subscriptions: this.userConnected.subscriptions });
                });
            }).catch(function (error) {
                console.log("Transaction failed: ", error);
            });
        }
    }

    render() {
        return html`
            <div class="user-card">
                <div class="col user-avatar">
                    <lazy-image className="user-avatar" src=${this.user.photoURL} alt="user-avatar" />
                </div>
                <div class="col user-info">
                    <span>${this.user.displayName}</span>
                    <span>${this.user.email}</span>
                </div>
                <div class="col">
                    ${this.userConnected.subscriptions.includes(this.user.id) ?
                        html`<button @click=${this.handleUnfollow}>Unfollow</button>`
                        :
                        html`<button @click=${this.handleFollow}>Follow</button>`
                    }
                </div>
            </div>
        `
    }
}

customElements.define('user-card', UserCard);