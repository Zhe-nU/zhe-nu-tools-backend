import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserSession } from '@thallesp/nestjs-better-auth';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { session?: UserSession }>();

    const session = request.session;
    if (!session?.user) throw new ForbiddenException('USER_NOT_AUTHENTICATED');

    const user = session.user;

    if (user.role === 'admin' || user.role?.includes('admin')) return true;

    const userIdFromParams = request.params.userId;
    if (!userIdFromParams) return true;

    if (userIdFromParams === user.id) return true;

    throw new ForbiddenException('NOT_HAVE_PERMISSIONS');
  }
}
