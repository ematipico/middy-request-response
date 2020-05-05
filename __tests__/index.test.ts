import middy from '@middy/core';
import responseResponse, { RequestResponseContext, RequestResponseMiddleWare } from '../src';
import { invoke } from './testUtils';

describe('The middleware', () => {
	it('should return the objects inside the context', async () => {
		const handler = middy((event, context, callback) => callback(null, context));

		const event = {
			path: '/',
		};
		handler.use(responseResponse());

		const context = await invoke(handler, event);

		expect(context.response).toBeDefined();
		expect(context.request).toBeDefined();
	});

	it('should set the correct path', async () => {
		const handler = middy((event, context, callback) => callback(null, context));

		const event = {
			path: '/',
		};
		handler.use(responseResponse());

		const context = await invoke(handler, event);

		expect(context.request.url).toEqual('/');
	});

	it('should set the status code', async () => {
		const handler = middy((event, context, callback) => callback(null, context));

		const event = {
			path: '/',
		};
		handler.use(responseResponse());

		const context = await invoke(handler, event);

		context.response.statusCode = 404;

		expect(context.response.statusCode).toEqual(404);
	});

	it('should call the callback when calling the end function', async () => {
		const handler = middy((event, context: RequestResponseContext) => {
		    jest.spyOn(context.response, 'end')
			context.response.statusCode = 200;
			context.response.end('<html></html>');
		});

		const event = {
			path: '/',
		};
		handler.use<RequestResponseMiddleWare>(responseResponse());

		const response = await invoke(handler, event);

        expect(response.end).toHaveBeenCalled();
        expect(response.toResponse.body).toEqual('<html></html>')
        expect(response.statusCode).toEqual(200)
	});
});
