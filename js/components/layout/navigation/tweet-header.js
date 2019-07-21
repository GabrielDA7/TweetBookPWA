import { LitElement, html, css } from 'lit-element';
import routes from '../../../../constantes/routes';
import firebase from '../../data/firebase';

export class TweetHeader extends LitElement {

    constructor() {
        super();
        this.user = {};    
    }

    static get properties() {
        return {
            user: Object
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
                background-color: #ffffff;
            }

            header {
                height: 48px;
                display: flex;
                flex-direction: row;
                border-bottom: solid #eeeeee 1px;
            }

            header > div {
                position: relative;
                width: 33%;
            }

            img {
                height: 42px;
                width: 42px;
            }

            .header-logo {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .header-links {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .header-links a {
                padding-left: 10px;
                text-decoration: none;
                color: black;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .profile-img {
                height: 26px;
                width: auto;
                padding-right: 5px;
            }
        `
    }

    firstUpdated() {
        firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                this.user = user;
                localStorage.setItem('logged', true);
            } else {
                this.user = {};
                localStorage.setItem('logged', false);
            }
        });

        this.addEventListener('user-updated', function (event) {
            this.user = {...event.detail};
        });


    }

    handleSignOut() {
        firebase.auth.signOut();
    }

    accountLink() {
        return html`
            <div class="header-links">
                <a href="${routes.PROFIL_ROUTE}">
                    <img class="profile-img lzy_img" src="${this.user.photoURL}" data-src="${this.user.photoURL}" alt="user-avatar" />
                    <span>${this.user.displayName}</span>
                </a>
                <a @click=${this.handleSignOut} href="${routes.SIGNIN_ROUTE}">
                    <span>Sign Out</span>
                </a>
            </div>
        `
    }

    authLinks() {
        return html`
            <div class="header-links">
                <a href="${routes.SIGNIN_ROUTE}">
                    <span>Sign In</span>
                </a>
                <a href="${routes.SIGNUP_ROUTE}">
                    <span>Sign Up</span>
                </a>
            </div>
        `
    }

    render() {
        const userIsConnected = JSON.parse(localStorage.getItem('logged'));
        return html`
            <header id="navigation" slot="navigation">
                <div class="header-links">
                    <a href="${routes.HOME_ROUTE}">
                       <span>Home</span>
                    </a>
                    <a href="${routes.SEARCH_ROUTE}">
                        <span>
                            Search
                        </span>
                    </a>
                </div>

                <div class="header-logo">
                    <img src="./assets/images/1f680.png" alt="Logo" />
                </div>

                ${ userIsConnected ? 
                    this.accountLink() :
                    this.authLinks()
                }
            </header>
        `
    }
}

customElements.define('tweet-header', TweetHeader);