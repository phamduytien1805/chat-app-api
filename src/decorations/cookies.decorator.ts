import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (cookieKeys: string | string[], context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const cookies = {};

    if (!cookieKeys || cookieKeys.length === 0) {
      // if no cookie keys provided, return all cookies
      return request.cookies;
    }
    if (typeof cookieKeys === 'string') {
      cookieKeys = [cookieKeys]; // convert to an array
    }
    cookieKeys.forEach((key) => {
      cookies[key] = request.cookies[key];
    });

    return cookies;
  },
);
