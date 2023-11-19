import { Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Loading from './components/Loading';
import RequireAuth from './components/RequireAuth';
import EditProfile from './components/Settings/EditProfile';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import 'react-toastify/dist/ReactToastify.css';
import useBoundStore from './store';

const App = () => {
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);
  const getuserProfile = useBoundStore.use.getUserProfile();

  useEffect(() => {
    if (isAuthenticated || localStorage.getItem('token')) {
      setLoading(true);
      getuserProfile().finally(() => {
        setTimeout(() => setLoading(false), 1000);
      });
    }
  }, [isAuthenticated, getuserProfile]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/log-in' element={<Login />} />
          <Route path='/sign-up' element={<Signup />} />
          <Route
            path='/edit-profile/:type'
            element={
              <RequireAuth redirectTo='/'>
                <EditProfile />
              </RequireAuth>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
