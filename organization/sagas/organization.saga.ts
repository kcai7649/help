import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, map, catchError, EMPTY } from 'rxjs';

import { OrganizationCreatedEvent } from '../events/impl/organization-created.event';
import { OrganizationUpdatedEvent } from '../events/impl/organization-updated.event';
import { OrganizationDeletedEvent } from '../events/impl/organization-deleted.event';

import { AppLoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class OrganizationSaga {
  constructor(private readonly logger: AppLoggerService) {}

  @Saga()
  organizationCreated = (events$: Observable<any>): Observable<null> => {
    return events$.pipe(
      ofType(OrganizationCreatedEvent),
      map((event: OrganizationCreatedEvent) => {
        this.logger.log(
          `Saga triggered: Organization created with ID: ${event.organization._id}`,
          OrganizationSaga.name,
        );
        // You can return a new command if needed, or null
        return null;
      }),
      catchError((error) => {
        this.logger.error('Error in organizationCreated saga', error.stack, OrganizationSaga.name);
        return EMPTY;
      }),
    );
  };

  @Saga()
  organizationUpdated = (events$: Observable<any>): Observable<null> => {
    return events$.pipe(
      ofType(OrganizationUpdatedEvent),
      map((event: OrganizationUpdatedEvent) => {
        this.logger.log(
          `Saga triggered: Organization updated with ID: ${event.organization._id}`,
          OrganizationSaga.name,
        );
        return null;
      }),
      catchError((error) => {
        this.logger.error('Error in organizationUpdated saga', error.stack, OrganizationSaga.name);
        return EMPTY;
      }),
    );
  };

  @Saga()
  organizationDeleted = (events$: Observable<any>): Observable<null> => {
    return events$.pipe(
      ofType(OrganizationDeletedEvent),
      map((event: OrganizationDeletedEvent) => {
        this.logger.log(
          `Saga triggered: Organization deleted with ID: ${event.organization._id}`,
          OrganizationSaga.name,
        );
        return null;
      }),
      catchError((error) => {
        this.logger.error('Error in organizationDeleted saga', error.stack, OrganizationSaga.name);
        return EMPTY;
      }),
    );
  };
}