import { mergeApplicationConfig, ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { DataSignalService } from './core/services/data-signal';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: APP_INITIALIZER,
      useFactory: (ds: DataSignalService): () => Promise<void> => () => ds.prefetch(['releases', 'artists', 'styles']),
      deps: [DataSignalService],
      multi: true
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
