import React, { useState } from 'react';
import { Users } from './Users';
import { API_BASE } from '../../constants';
import { CreateUser } from './CreateUser';

const UserSection = () => {
  const [positions, setPositions] = useState([]);
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState('');

  const PAGE = 6;

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
    } catch (error) {
      console.error('Error refreshing users after new user added:', error);
    }
  };

  return (
    <>
      <Users users={users} setUsers={setUsers} setPositions={setPositions} setToken={setToken} />
      <CreateUser positions={positions} token={token} addUser={addUser} />
    </>
  );
};

export default UserSection;
