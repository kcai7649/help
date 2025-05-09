import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, map, catchError, EMPTY } from 'rxjs';

import { RoleCreatedEvent } from '../events/impl/role-created.event';
import { RoleUpdatedEvent } from '../events/impl/role-updated.event';
import { RoleDeletedEvent } from '../events/impl/role-deleted.event';

import { AppLoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class RoleSaga {
  constructor(private readonly logger: AppLoggerService) {}

  @Saga()
  roleCreated = (events$: Observable<any>): Observable<null> => {
    return events$.pipe(
      ofType(RoleCreatedEvent),
      map((event: RoleCreatedEvent) => {
        this.logger.log(
          `Saga triggered: Role created with ID: ${event.role._id}`,
          RoleSaga.name,
        );
        // You can return a new command if needed, or null
        return null;
      }),
      catchError((error) => {
        this.logger.error('Error in roleCreated saga', error.stack, RoleSaga.name);
        return EMPTY;
      }),
    );
  };

  @Saga()
  roleUpdated = (events$: Observable<any>): Observable<null> => {
    return events$.pipe(
      ofType(RoleUpdatedEvent),
      map((event: RoleUpdatedEvent) => {
        this.logger.log(
          `Saga triggered: Role updated with ID: ${event.role._id}`,
          RoleSaga.name,
        );
        return null;
      }),
      catchError((error) => {
        this.logger.error('Error in roleUpdated saga', error.stack, RoleSaga.name);
        return EMPTY;
      }),
    );
  };

  @Saga()
  roleDeleted = (events$: Observable<any>): Observable<null> => {
    return events$.pipe(
      ofType(RoleDeletedEvent),
      map((event: RoleDeletedEvent) => {
        this.logger.log(
          `Saga triggered: Role deleted with ID: ${event.role._id}`,
          RoleSaga.name,
        );
        return null;
      }),
      catchError((error) => {
        this.logger.error('Error in roleDeleted saga', error.stack, RoleSaga.name);
        return EMPTY;
      }),
    );
  };
}
