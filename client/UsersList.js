import React from 'react';
import styles from './UsersList.css';

const UsersList = props => (
    <div className={styles.Users}>
        <div className={styles.UsersOnline}>
            {props.users.length} people online
        </div>
        <div className={styles.UserNickname}>
            {props.name}
        </div>
        <ul className={styles.UsersList}>
            {
                props.users.filter(user => user.name !== props.name).map((user) => {
                    return (
                        <li key={user.id} className={styles.UserItem}>
                            {user.name}
                        </li>
                    );
                })
            }
        </ul>
    </div>
);

export default UsersList;