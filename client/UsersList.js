import React from 'react';
import styles from './UsersList.css';

const {Users, UsersOnline, UsersList, UserItem} = styles;

const UsersList = props => (
    <div className={Users}>
        <div className={UsersOnline}>
            {props.user.length} people online
        </div>
        <ul className={UsersList}>
            {
                props.users.map((user) => {
                    return (
                        <li key={user.id} className={UserItem}>
                            {user.name}
                        </li>
                    );
                })
            }
        </ul>
    </div>
);

export default UsersList;