const { helper } = require('../utils/helper_test');
const supertest = require('supertest');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const app = require('../app');

const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const password = 'test';
    const passwordHash = await bcrypt.hash(password, 10);
    const user = User({
      name: 'test1',
      username: 'test123',
      passwordHash,
    });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.userinDb();

    const newUser = {
      name: 'test2',
      username: 'test1234',
      password: 'test0123',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.userinDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const UserAtStart = await helper.userinDb();

    const newUser = {
      name: 'test2',
      username: 'test123',
      password: 'test0123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const userAtEnd = await helper.userinDb();
    expect(userAtEnd).toEqual(UserAtStart);
  });
});
