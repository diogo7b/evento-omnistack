const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('ONG', () => {
    
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    })

    afterAll( async () => {
        await connection.destroy();
    })

    it('should be able to create a new ong', async () => {
        const res = await request(app)
        .post('/ongs')
        .send({
            name:"NAKRIN",
            email:"emaile12@email.com",
            whatsapp:"8166333390",
            city:"Timbaúba",
            uf:"PE"
        })

        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toHaveLength(8);
    })
});