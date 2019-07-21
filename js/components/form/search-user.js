import { LitElement, css, html } from 'lit-element';

import firebase from '../data/firebase';

export class SearchUser extends LitElement {
    constructor() {
        super();
        this.search = '';
        this.data = [];
    }

    handleSearch(event) {
        this.search = event.target.value;
        let searchResult = [];
        firebase.db.collection('users').orderBy('displayName').startAt(this.search).endAt(this.search + '\uf8ff')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    const id = doc.id;
                    const result = {id, ...doc.data()};
                    searchResult = [...searchResult, result];
                });
                this.data = searchResult;
                this.dispatchEvent(new CustomEvent('search-result', { detail: this.data }));
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

    }

    render() {
        return html`
            <input id="search-user-input" type="text" @input=${this.handleSearch}>
        `;
    }
}

customElements.define('search-user', SearchUser);