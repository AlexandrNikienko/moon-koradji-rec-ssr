import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// The server runtime passes a BootstrapContext to the exported bootstrap function.
// This context contains the platform ref needed to bootstrap the Angular application.
const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;
