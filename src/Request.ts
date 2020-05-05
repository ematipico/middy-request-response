import Stream from 'stream';
import middy from '@middy/core';
import HandlerLambda = middy.HandlerLambda;
import { APIGatewayEventRequestContextWithAuthorizer } from 'aws-lambda';

export class Request extends Stream.Readable {
	url: string;
	rawHeaders: object;
	headers: object;
	method: string;
	connection: object;

	constructor(handler: HandlerLambda<APIGatewayEventRequestContextWithAuthorizer<string>>) {
		super();
		const { event } = handler;
		this.url = (event.path || event.path || '').replace(new RegExp('^/' + event.stage), '');

		this.method = handler.event.httpMethod;
		this.rawHeaders = {};
		this.connection = {};
		this.headers = {};
	}

	getHeader(name: string): string {
		return this.headers[name.toLowerCase()];
	}
}
