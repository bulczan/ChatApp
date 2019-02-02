const _ = require('lodash');

class UsersService {
    constructor() {
        this.users = [];
        this.usersTyping = [];
    }

    getAllUsers() {
        return this.users;
    }

    getUserById(userId) {
        return this.users.find(user => user.id === userId);
    }

    addUser(user) {
        this.users = [user, ...this.users];
    }

    addTyping(isTyping) {
        this.usersTyping = _.uniq([isTyping, ...this.usersTyping]);
    }

    clearTyping() {
        this.usersTyping = [];
    }

    getAllTyping() {
        return this.usersTyping;
    }

    removeUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);
    }
}

module.exports = UsersService;