import React from 'react';
import './Users.scss';
import { Tooltip } from '../hooks/Tooltip';
import DEFAULT_AVATAR from '../../assets/photo-cover.svg';
import { Preloader } from '../hooks/Preloader';
import { getUniqueKey } from '../hooks/UniqueKey';

export const Users = ({ users, isLoading, loadMoreUsers, hasMore }) => {
  return (
    <section id="users" className="users">
      <div className="users__container">
        <h1 className="users__title">Working with GET request</h1>
        {isLoading && users.length === 0 ? (
          <Preloader />
        ) : (
          <>
            <ul className="users__cards-container">
              {users.map(user => (
                <li key={getUniqueKey(user)} className="users__card">
                  <img
                    src={user.photo || DEFAULT_AVATAR}
                    alt={user.name}
                    className="users__card__img"
                    onError={e => {
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                  <div className="users__card__name">
                    <Tooltip text={user.name} />
                  </div>

                  <div className="users__card__info">
                    <span>{user.position}</span>
                    <Tooltip text={user.email} />
                    <span>{user.phone}</span>
                  </div>
                </li>
              ))}
            </ul>

            {hasMore && (
              <button
                onClick={loadMoreUsers}
                className="users__button"
                disabled={!hasMore || isLoading}
              >
                {isLoading ? 'Loading...' : 'Show more'}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
};
