const supertest = require('supertest');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const app = require('../app');

const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('abc123', 10);
    const user = User({ username: 'hasan', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await api.get('/api/users');

    const newUser = {
      username: 'hasan123456',
      name: 'Hasan Md',
      password: 'salasana',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await api.get('/api/users');
    console.log(usersAtEnd.body);
    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length + 1);

    const usernames = usersAtEnd.body.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
});
