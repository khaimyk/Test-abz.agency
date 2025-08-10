import React, { useEffect, useState } from 'react';
import './Users.scss';
import { Tooltip } from '../hooks/Tooltip';
import DEFAULT_AVATAR from '../../assets/photo-cover.svg';
import { Preloader } from '../hooks/Preloader';
import { API_BASE } from '../../constants';
import { getUniqueKey } from '../hooks/UniqueKey';
export const Users = ({ users, setUsers, setPositions, setToken }) => {
  const [nextUrl, setNextUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const PAGE = 6;

  const loadUsers = async url => {
    try {
      setIsLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      const sorted = [...data.users].sort(
        (a, b) => b.registration_timestamp - a.registration_timestamp
      );
      setUsers(prev => [...prev, ...sorted]);
      setNextUrl(data.links.next_url);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (users.length === 0) {
      setIsLoading(true);
      Promise.all([
        loadUsers(`${API_BASE}/users?count=${PAGE}`),
        fetch(`${API_BASE}/positions`).then(res => res.json()),
        fetch(`${API_BASE}/token`).then(res => res.json()),
      ])
        .then(([_, positionsData, tokenData]) => {
          setPositions(positionsData.positions);
          setToken(tokenData.token);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, []);

  const handleShowMore = () => {
    if (nextUrl) loadUsers(nextUrl);
  };

  return (
    <section id="users" className="users">
      <div className="users__container">
        <h1 className="users__title">Working with GET request</h1>
        {isLoading && users.length === 0 ? (
          <Preloader />
        ) : (
          <>
            <ul className="users__cards-container">
              {users.filter(Boolean).map(user => (
                <li key={getUniqueKey(user)} className="users__card">
                  <img
                    src={user?.photo || DEFAULT_AVATAR}
                    alt={user?.name}
                    className="users__card__img"
                    onError={e => {
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                  <div className="users__card__name">
                    <Tooltip text={user?.name} />
                  </div>

                  <div className="users__card__info">
                    <span>{user?.position}</span>
                    <Tooltip text={user?.email} />
                    <span>{user?.phone}</span>
                  </div>
                </li>
              ))}
            </ul>

            {nextUrl && (
              <button
                onClick={handleShowMore}
                className="users__button"
                disabled={!nextUrl || isLoading}
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
