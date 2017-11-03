const expect = require('expect');

const { Users } = require('./users'); 

describe('Users', () => {
var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node'
    }, {
      id: '2',
      name: 'Jen',
      room: 'Test'
    }, {
      id: '3',
      name: 'John',
      room: 'Node'
    }];
  });

  it('should add new user', () => {
    var users = new Users();
    var user = { 
      id: '123',
      name: 'Mike',
      room: 'Test Room'
    };
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    var userId = '1'
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    var userId = '4'
    var userList = users.removeUser(userId);

    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var userId = '1';
    var user = users.getUser('1');

    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    var userId = 1;
    var user = users.getUser(userId);

    expect(user).toNotExist();
  });

  it('should return name for Node', () => {
    var userList = users.getUserList('Node');

    expect(userList).toEqual(['Mike', 'John']);
  });

  it('should return name for Test', () => {
    var userList = users.getUserList('Test');

    expect(userList).toEqual(['Jen']);
  });
});