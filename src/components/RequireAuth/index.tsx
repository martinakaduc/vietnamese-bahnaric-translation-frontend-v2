import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import useBoundStore from '../../store';

interface RequireAuthProps {
  children: ReactNode;
  redirectTo: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, redirectTo }) => {
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);

  return !isAuthenticated ? <Navigate to={redirectTo} /> : <>{children}</>;
};

export default RequireAuth;
