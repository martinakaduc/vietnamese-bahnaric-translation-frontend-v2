import DesktopSignup from '../components/Signup/DesktopSignup';
import MobileSignup from '../components/Signup/MobileSignup';

const Signup = () => {
  return (
    <div className='h-[100vh] overflow-y-auto bg-[#F2f5ff] md:bg-white'>
      <MobileSignup />
      <DesktopSignup />
    </div>
  );
};
export default Signup;
