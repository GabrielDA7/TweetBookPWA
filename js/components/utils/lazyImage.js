import { LitElement, html, css } from 'lit-element';
const isIntersecting = ({ isIntersecting }) => isIntersecting;

export class LazyImage extends LitElement {
    constructor() {
        super();
        this.observerCallback = this.observerCallback.bind(this);
        this.intersecting = false;
        this.loading = false;
    }

    static get properties() {
        return {
            /**
             * Image alt-text.
             * @type {String}
             */
            alt: { type: String },

            className: { type: String },

            /**
             * Whether the element is on screen.
             * @type {Boolean}
             */
            intersecting: { type: Boolean },

            /**
             * Image URI.
             * @type {String}
             */
            src: { type: String },

            /**
             * Whether the image has loaded.
             * @type {Boolean}
             */
            loaded: {
                type: Boolean,
                reflect: true,
            },
        }
    }

    static get styles() {
        return css`
            :host {
                display:block;
            }

            .tweet-avatar {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                height: auto;
                width: 40px;
                border-radius: 20px;
                z-index: 11;
            }

            .user-avatar {
                width: 40px;
                border-radius: 10px;
                height: auto;
            }
  
            .tweet-avatar,
            #placeholder ::slotted(*) {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                height: auto;
                width: 40px;
                border-radius: 10px;
                z-index: 11;
            }
    
            #placeholder ::slotted(*),
            :host([loaded]) #image {
                opacity: 1;
            }
    
            #image,
            :host([loaded]) #placeholder ::slotted(*) {
                opacity: 0;
            }
        `
    }

    connectedCallback() {
        super.connectedCallback();
        // Remove the wrapping `<lazy-image>` element from the a11y tree.
        this.setAttribute('role', 'presentation');
        // if IntersectionObserver is available, initialize it.
        this.initIntersectionObserver();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.disconnectObserver();
    }

    /**
     * Sets the `intersecting` property when the element is on screen.
     * @param  {[IntersectionObserverEntry]} entries
     * @protected
     */
    observerCallback(entries) {
        if (entries.some(isIntersecting)) this.intersecting = true;
    }

    /**
     * Sets the `loaded` property when the image is finished loading.
     * @protected
     */
    onLoad(event) {
        this.loaded = true;
        // Dispatch an event that supports Polymer two-way binding.
        const bubbles = true;
        const composed = true;
        const detail = { value: true };
        this.dispatchEvent(new CustomEvent('loaded-changed', { bubbles, composed, detail }));
    }

    /**
     * Initializes the IntersectionObserver when the element instantiates.
     * @protected
     */
    initIntersectionObserver() {
        // if IntersectionObserver is unavailable, simply load the image.
        if (!('IntersectionObserver' in window)) return this.intersecting = true;
        // Short-circuit if observer has already initialized.
        if (this.observer) return;
        // Start loading the image 10px before it appears on screen
        const rootMargin = '10px';
        this.observer = new IntersectionObserver(this.observerCallback, { rootMargin });
        this.observer.observe(this);
    }

    /**
     * Disconnects and unloads the IntersectionObserver.
     * @protected
     */
    disconnectObserver() {
        this.observer.disconnect();
        this.observer = null;
        delete this.observer;
    }

    render() {
        return html`
            <div id="placeholder" aria-hidden="${String(!!this.intersecting)}">
                <slot name="placeholder"></slot>
            </div>

            <img id="image"
                class="${this.className}"
                aria-hidden="${String(!this.intersecting)}"
                .src="${this.intersecting ? this.src : undefined}"
                alt="${this.alt}"
                @load="${this.onLoad}"
            />
        `;
    }
}

customElements.define('lazy-image', LazyImage);