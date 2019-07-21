import { LitElement, html, css } from 'lit-element';

import './layout/navigation/tweet-header';
import './layout/error/not-found-view';
import './data/tweet-search';
import './data/tweet-signin';
import './data/tweet-signup';
import './data/tweet-account';
import './data/tweet-home';

export default class TweetApp extends LitElement {
    constructor() {
        super();
    }
    
    static get properties() {
        return {
            unresolved: {
                type: Boolean,
                reflect: true
            },
        }
    }


    static get styles() {
        return css`
        :host {
            display: block;
            height: 100%;
        }
        * {
            box-sizing: border-box;
        }`
    }

    firstUpdated() {
        this.unresolved = false;
    }

    render() {
        return html`
            <section id="app">
                <tweet-header></tweet-header>
                <slot name="outlet"></slot>
            </section>
        `
    }
}

customElements.define('tweet-app', TweetApp);