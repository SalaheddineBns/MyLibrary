import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';

const LoginPage = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    return <Redirect to='/home' />;
  }

  return (
    <div>
      <button onClick={() => loginWithRedirect()}>Log In</button>
    </div>
  );
};

export default LoginPage;