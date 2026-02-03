import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  private readonly VALID_TOKEN =
    process.env.API_TOKEN;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || token !== this.VALID_TOKEN) {
      throw new UnauthorizedException('Invalid Bearer token');
    }

    return true;
  }
}
