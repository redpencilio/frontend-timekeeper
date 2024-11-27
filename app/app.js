import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'frontend-timekeeper/config/environment';
import 'ember-power-select/styles';
import 'frontend-timekeeper/assets/frontend-timekeeper.css';

import '@fontsource/lexend-deca/100.css';
import '@fontsource/lexend-deca/200.css';
import '@fontsource/lexend-deca/300.css';
import '@fontsource/lexend-deca/400.css';
import '@fontsource/lexend-deca/500.css';
import '@fontsource/lexend-deca/600.css';
import '@fontsource/lexend-deca/700.css';
import '@fontsource/lexend-deca/800.css';
import '@fontsource/lexend-deca/900.css';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
