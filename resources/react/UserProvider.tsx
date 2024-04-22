// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getUser } from './utils';
import { Backdrop, CircularProgress } from '@mui/material';
import { tokens } from "./theme";
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const colors = tokens('dark');
  const fetchUserData = async () => {
    try {
      const response = await getUser();
      setUserData(response); // Ustawienie danych użytkownika w stanie
    } catch (error) {
      console.error('Wystąpił błąd podczas pobierania danych użytkownika:', error);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (loading == false){
        setUserData(userData)
        console.log(userData)
    }
  }, [userData]);

  if (loading) {
    <Backdrop
    sx={{ color: colors.blueAccent[50], zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={loading} // Widoczność Backdrop jest sterowana przez flagę ładowania
>
    <CircularProgress color="inherit" />
</Backdrop>
  }

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};
