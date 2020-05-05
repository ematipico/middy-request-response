import Stream from 'stream';
import middy from '@middy/core';
import HandlerLambda = middy.HandlerLambda;
import { APIGatewayEventRequestContextWithAuthorizer } from 'aws-lambda';

interface MultiValueHeaders {
	[x: string]: string[] | string;
}

interface Headers {
	[x: string]: string;
}

interface ToResponse {
	body: Buffer | string;
	isBase64Encoded: boolean;
	statusCode: number;
	multiValueHeaders: MultiValueHeaders;
}

export class Response extends Stream {
	toResponse: ToResponse;
	headers: Headers;
	handler: HandlerLambda;
	base64Support: boolean;
	statusCode: number;

	constructor(handler: HandlerLambda<APIGatewayEventRequestContextWithAuthorizer<string>>) {
		super();
		this.base64Support = process.env.BINARY_SUPPORT === 'yes';
		this.toResponse = {
			body: Buffer.from(''),
			isBase64Encoded: this.base64Support,
			statusCode: 200,
			multiValueHeaders: {},
		};
		this.headers = {};
		this.handler = handler;
	}

	writeHead(status: number, headers?: Headers): this {
		this.toResponse.statusCode = status;
		if (headers) this.headers = Object.assign(this.headers, headers);

		return this;
	}

	write(chunk: string | Buffer): void {
		this.toResponse.body = Buffer.concat([
			this.toResponse.body as Buffer,
			Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
		]);
	}

	setHeader(name: string, value: string): void {
		this.headers[name] = value;
	}

	removeHeader(name: string): void {
		delete this.headers[name];
	}

	getHeader(name: string): string {
		return this.headers[name.toLowerCase()];
	}

	getHeaders(): Headers {
		return this.headers;
	}

	end(text): void {
		if (text) this.write(text);
		this.toResponse.body = Buffer.from(this.toResponse.body).toString(this.base64Support ? 'base64' : undefined);
		this.toResponse.multiValueHeaders = this.headers;
		this.writeHead(this.toResponse.statusCode);
		this.fixApiGatewayMultipleHeaders();
		this.handler.callback(null, this);
	}

	private fixApiGatewayMultipleHeaders(): void {
		for (const key of Object.keys(this.toResponse.multiValueHeaders)) {
			if (!Array.isArray(this.toResponse.multiValueHeaders[key])) {
				this.toResponse.multiValueHeaders[key] = [this.toResponse.multiValueHeaders[key] as string];
			}
		}
	}
}

Object.defineProperty(Response, 'statusCode', {
	get() {
		return this.toResponse.statusCode;
	},
	set(statusCode) {
		this.toResponse.statusCode = statusCode;
	},
});
