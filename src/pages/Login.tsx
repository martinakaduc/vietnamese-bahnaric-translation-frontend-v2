import DesktopLogin from '../components/Login/DesktopLogin';
import MobileLogin from '../components/Login/MobileLogin';

const Login = () => {
  return (
    <div className='h-[100vh] overflow-y-auto bg-[#F2f5ff] md:bg-white'>
      <MobileLogin />
      <DesktopLogin />
    </div>
  );
};
export default Login;
