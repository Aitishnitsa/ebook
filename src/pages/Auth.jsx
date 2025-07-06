import { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const Auth = ({ onAuth }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <>
      {isRegistering ? (
        <Register onAuth={onAuth} onSwitchToLogin={() => setIsRegistering(false)} />
      ) : (
        <Login onAuth={onAuth} onSwitchToRegister={() => setIsRegistering(true)} />
      )}
    </>
  );
};

export default Auth;
