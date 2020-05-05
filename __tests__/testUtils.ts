import { promisify } from 'util';

export function invoke(handler, event = {}, context = {}) {
	return promisify(handler)(event, context);
}

