import type { App, Directive } from 'vue';

import { auth, copy, debounce } from './modules';

const directivesList: Record<string, Directive> = {
  auth,
  copy,
  debounce,
};

const setDirectives = {
  install(app: App<Element>) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key]);
    });
  },
};

export default setDirectives;
