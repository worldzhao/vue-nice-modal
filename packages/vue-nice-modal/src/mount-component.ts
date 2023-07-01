import type { Component } from 'vue-demi';
import { createApp } from 'vue-demi';

export function mountComponent(RootComponent: Component) {
  const app = createApp(RootComponent);
  const root = document.createElement('div');
  const container = document.createElement('div');
  root.className = 'vue-nice-modal-root';
  root.appendChild(container);

  document.body.appendChild(root);

  return {
    instance: app.mount(container),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    },
  };
}
