import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import App from "./App";

class AppMicroUI extends HTMLElement {
	[x: string]: any;
	connectedCallback() {
		this.mount();
	}

	disconnectedCallback() {
		this.unmount();
		this.observer.disconnect();
	}

	attributeChangedCallback() {
		this.unmount();
		this.mount();
	}

	mount() {
		render(<App />, this);
	}

	unmount() {
		unmountComponentAtNode(this);
	}
}

customElements.define("app-micro-ui", AppMicroUI);
