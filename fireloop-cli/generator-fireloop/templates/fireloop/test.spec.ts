var should    = require('chai').should();
var supertest = require('supertest');
var api       = supertest('http://localhost:3000/api');

describe('<%= modelName %> unit tests:', () => {
    it('Should create a <%= modelName %> instance', (done: Function) => {
        api.post('/<%= config.plural %>').send({<%- propertyBuilder(config) %>}).expect(200, done);
    });
});
