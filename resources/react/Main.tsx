import React from 'react';
import Layout from "./Layout/Layout";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { UserProvider } from './UserProvider';
function Main() {
  return (
    <div>
        <UserProvider>
            <Layout />
        </UserProvider>
    </div>
  );
}

export default Main;
