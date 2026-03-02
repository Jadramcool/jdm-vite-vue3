import type { App } from 'vue';
import { auth } from './modules';

const directivesList: any = {
  auth,
};

const setDirectives = {
  install(app: App<Element>) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key]);
    });
  },
};

export default setDirectives;
