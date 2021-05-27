import request from 'supertest';
import {app} from '../../app'



it('returns a 201 on successful signin',async ()=>{
    return request(app)
    .post('/api/users/signin')
    .send({
        email:"test@test.com",
        password:"password"
    })
    .expect(400);
});

it('fails when an incorrect password is given',async ()=>{

    await request(app)
    .post('/api/users/signup')
    .send({
        email:"test@test.com",
        password:"password"
    })
    .expect(201);

    return request(app)
    .post('/api/users/signin')
    .send({
        email:"test@test.com",
        password:"saddzgs"
    })
    .expect(400);
});


it('it response with cookie when given valid credentials',async ()=>{

    await request(app)
    .post('/api/users/signup')
    .send({
        email:"test@test.com",
        password:"password"
    })
    .expect(201);

    const response = await request(app)
    .post('/api/users/signin')
    .send({
        email:"test@test.com",
        password:"password"
    })
    .expect(200);

    expect(response.get(("Set-Cookie"))).toBeDefined();

});
