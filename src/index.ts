/* eslint-disable @typescript-eslint/no-explicit-any */

import middy from '@middy/core';
import { Context } from 'aws-lambda';
import { Request } from './Request';
import { Response } from './Response';
import MiddlewareObject = middy.MiddlewareObject;

export interface RequestResponseContext extends Context {
	response: Response;
	request: Request;
}

export type RequestResponseMiddleWare = MiddlewareObject<any, any, RequestResponseContext>;

const middleware: middy.Middleware<Context> = (): RequestResponseMiddleWare => {
	return {
		before(handler, next): void | Promise<any> {
			const response = new Response(handler);
			const request = new Request(handler);

			handler.context.response = response;
			handler.context.request = request;

			return next();
		},

		onError(handler, next): void | Promise<any> {
			return next();
		},
	};
};

export default middleware;
