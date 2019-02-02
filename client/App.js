import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import io from 'socket.io-client';
import styles from './App.css';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UsersList from './UsersList';
import UserForm from './UserForm';

const socket = io('/');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {users: [], messages: [], text: '', name: ''};
    }

    componentDidMount() {
        socket.on('message', message => this.messageReceive(message));
        socket.on('update', ({users}) => this.chatUpdate(users));
    }

    handleTyping(typingMessage) {
        let {messages, name} = this.state;
        const users = typingMessage.usersTyping.filter(user => user !== name);
        const usersTyping = users.join(' & ');
        if (users.length === 1) {
            typingMessage.text = `${usersTyping} is typing...`;
        } else if (users.length > 1) {
            typingMessage.text = `${usersTyping} are typing...`;
        }
        messages = [typingMessage, ...messages.filter(msg => !msg.typing)];
        this.setState({ messages: [...messages] });
    }

    messageReceive(message) {
        let {messages} = this.state;
        messages = [message, ...messages.filter(msg => !msg.typing)];
        this.setState({ messages });
    }

    handleWelcome(welcomeMessage) {
        const messages = [welcomeMessage, ...this.state.messages];
        this.setState({ messages });
    }

    chatUpdate(users) {
        this.setState({ users });
    }

    handleMessageSubmit(message) {
        let {messages} = this.state;
        messages = [message, ...messages.filter(msg => !msg.typing)];
        this.setState({ messages: [...messages] });
        socket.emit('message', message);
    }

    handleUserSubmit(name) {
        socket.emit('join', name);
        socket.emit('saysHello', name);
        socket.on('saysHello', hello => this.handleWelcome(hello));
        this.setState({ name });
    }

    renderLayout() {
        const { App, AppHeader, AppTitle, AppRoom, AppBody, MessageWrapper } = styles;
        const { users, name, messages } = this.state;
        return (
            <div className={App}>
                <div className={AppHeader}>
                    <div className={AppTitle}>
                        ChatApp
                    </div>
                    <div className={AppRoom}>
                        App room
                    </div>
                </div>
                <div className={AppBody}>
                    <UsersList
                        users={users}
                        name={name}
                    />
                    <div className={MessageWrapper}>
                        <MessageList
                            messages={messages}
                            name={name}
                        />
                        <MessageForm
                            onMessageSubmit={message => this.handleMessageSubmit(message)}
                            name={name}
                            handleTyping={msg => this.handleTyping(msg)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderUserForm() {
        return (<UserForm onUserSubmit={name => this.handleUserSubmit(name)} />)
    }

    render() {
        return ( this.state.name !== '' ? this.renderLayout() : this.renderUserForm() );
    }
};

export default hot(module)(App);