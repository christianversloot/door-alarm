import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { equals } from "class-validator";
import { Observable } from "rxjs";
import config from "../config";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const headers: any = request.headers;
    return equals(headers.token, config.authToken);
  }
}