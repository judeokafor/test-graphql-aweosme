import supertest from 'supertest';

import app from '../src';

describe('Service', () => {
	describe('GET / ', () => {
		it('should start successfully', async () => {
			await supertest(app).get('/test').expect(200);
		});
	});
});
