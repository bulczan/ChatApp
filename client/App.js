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

    handleTyping(msg) {
        const typingMessage = msg;
        let messages = this.state.messages;
        if(messages[0].text !== typingMessage.text) {
                messages = [typingMessage, ...messages];
                this.setState({ messages: [...messages] });
        }
    }

    messageReceive(message) {
        let messages = this.state.messages;
        let restMessages = messages.filter(msg => msg.typing !== true);
        messages = [message, ...restMessages];
        this.setState({ messages });
    }

    handleWelcome(hello) {
        const welcomeMessage = hello;
        const messages = [welcomeMessage, ...this.state.messages];
        this.setState({ messages });
    }

    chatUpdate(users) {
        this.setState({ users });
    }

    handleMessageSubmit(message) {
        let messages = [...this.state.messages];
        let restMessages = messages.filter(msg => msg.typing !== true);
        messages = [message, ...restMessages];
        this.setState({ messages: [...messages] });
        socket.emit('message', message);
    }

    handleUserSubmit(name) {
        this.setState({ name });
        socket.emit('join', name);
        socket.emit('saysHello', name);
        socket.on('saysHello', (hello) => this.handleWelcome(hello));
    }

    renderLayout() {
        const { App, AppHeader, AppTitle, AppRoom, AppBody, MessageWrapper } = styles;
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
                        users={this.state.users}
                        name={this.state.name}
                    />
                    <div className={MessageWrapper}>
                        <MessageList
                            messages={this.state.messages}
                            name={this.state.name}
                        />
                        <MessageForm
                            onMessageSubmit={message => this.handleMessageSubmit(message)}
                            name={this.state.name}
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