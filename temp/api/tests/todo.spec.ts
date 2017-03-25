var should    = require('chai').should();
var supertest = require('supertest');
var api       = supertest('http://localhost:3000/api');

describe('Todo unit tests:', () => {
    it('Should create a Todo instance', (done: Function) => {
        api.post('/todos').send({
            text: 'test'
        }).expect(200, done);
    });
});
