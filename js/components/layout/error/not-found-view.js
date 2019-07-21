import { LitElement, html, css } from 'lit-element';

export class NotFoundView extends LitElement {
    static get styles() {
        return css`
            :host {
                color: red;
                display: block;
                height: 100%;
            }

            h4 {
                text-align: center;
            }
        `;
    }

    render() {
        return html`
            <div>
                <h4>404 - NOT FOUND</h4> 
            </div>
        `
    }
}

customElements.define('not-found-view', NotFoundView);