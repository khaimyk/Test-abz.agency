import React, { Suspense, lazy, useEffect, useState } from 'react';
import { API_BASE } from '../../constants';
import { Preloader } from '../hooks/Preloader';

const Users = lazy(() => import('./Users'));
const CreateUser = lazy(() => import('./CreateUser'));
const PAGE = 6;
const UserSection = () => {
  const [positions, setPositions] = useState([]);
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState('');
  const [nextUrl, setNextUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

 
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, positionsRes, tokenRes] = await Promise.all([
          fetch(`${API_BASE}/users?count=${PAGE}`),
          fetch(`${API_BASE}/positions`),
          fetch(`${API_BASE}/token`),
        ]);
        const usersData = await usersRes.json();
        const positionsData = await positionsRes.json();
        const tokenData = await tokenRes.json();

        
        const sortedUsers = [...usersData.users].sort(
          (a, b) => b.registration_timestamp - a.registration_timestamp
        );

        setUsers(sortedUsers);
        setPositions(positionsData.positions);
        setToken(tokenData.token);
        setNextUrl(usersData.links.next_url || null);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

 
  const loadMoreUsers = async () => {
    if (!nextUrl) return;
    setIsLoading(true);
    try {
      const res = await fetch(nextUrl);
      const data = await res.json();
      const sorted = [...data.users].sort(
        (a, b) => b.registration_timestamp - a.registration_timestamp
      );
      setUsers(prev => [...prev, ...sorted]);
      setNextUrl(data.links.next_url || null);
    } catch (error) {
      console.error('Error loading more users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async newUser => {
    try {
    
      const res = await fetch(`${API_BASE}/users?count=${PAGE}`);
      const data = await res.json();
      const sorted = [...data.users].sort(
        (a, b) => b.registration_timestamp - a.registration_timestamp
      );

      const filtered = sorted.filter(u => u.id !== newUser.id);
      const updated = [newUser, ...filtered].slice(0, PAGE);

      setUsers(updated);
      setNextUrl(data.links.next_url || null);
    } catch (error) {
      console.error('Error refreshing users after new user added:', error);
    }
  };

  return (
    <Suspense fallback={<Preloader />}>
      <Users
        users={users}
        isLoading={isLoading}
        loadMoreUsers={loadMoreUsers}
        hasMore={Boolean(nextUrl)}
      />
      <CreateUser positions={positions} token={token} addUser={addUser} />
    </Suspense>
  );
};

export default UserSection;
