import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import BKLogo from '../../assets/images/BKLogo.png';
import MobileBanner from '../../assets/images/mobileBanner.png';
import Icon from '../../components/Icon';
import AuthService from '../../service/auth.service';
import useBoundStore from '../../store';

const MobileLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const setToken = useBoundStore.use.setToken();
  const login = () => {
    setLoading(true);
    AuthService.login(username, password)
      .then((res) => {
        const { payload } = res.data;
        const { token } = payload;
        setToken(token);
        toast.success('Đăng nhập thành công');
        navigate('/');
      })
      .catch(() => {
        // console.log(err);
        toast.error('Sai tên tài khoản hoặc mật khẩu');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='md:hidden'>
      <ToastContainer position='top-right' />
      <div className='relative h-[47vh] w-full sml:h-[52vh]'>
        <div className='relative z-10 flex h-[calc(100%-80px)] flex-col items-center justify-center'>
          <img src={BKLogo} alt='banner' className='h-[100px] w-[100px] md:hidden' />
          <h1 className='text-[28px] font-bold text-white'>Dịch thuật Bahnar</h1>
        </div>
        <img
          src={MobileBanner}
          alt='banner'
          className='absolute left-0 top-0 h-[100%] w-[100%] object-cover object-top'
        />
      </div>
      <div className='relative z-20 mt-[-80px] flex flex-col'>
        <Icon.Polygon className='mb-[-1px] ml-auto' />
        <div className='flex flex-col items-center rounded-ss-[52px] bg-[#F2F5FF] py-10'>
          <h2 className='text-[20px] font-bold text-[#1D46F8]'>Đăng nhập</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
            className='mt-6 flex w-full flex-col px-[12vw] sml:px-[20vw]'
          >
            <input
              type='text'
              placeholder='Tên tài khoản'
              onChange={(e) => setUsername(e.target.value)}
              required
              value={username}
              className='w-full rounded-[8px] border-[1px] border-[#BDBCCC] p-4'
            />
            <input
              type='password'
              placeholder='Mật khẩu'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-4 w-full rounded-[8px] border-[1px] border-[#BDBCCC] p-4'
            />
            <div className='mt-4 flex space-x-2'>
              <Link to='/sign-up' className='text-[15px] text-[#1D46F8]'>
                <u>Đăng ký</u>
              </Link>
              <Link to='/' className='text-[15px] text-[#0f9d58]'>
                <u>Bỏ qua</u>
              </Link>
            </div>
            <button
              type='submit'
              className='mt-6 flex h-[52px] w-[148px] items-center justify-center self-center rounded-[8px] bg-[#1D46F8] text-white'
            >
              {loading ? (
                <div className='flex h-[52px] w-[148px] items-center justify-center'>
                  <div className='h-6 w-6 animate-spin rounded-full border-l-2 border-solid border-white' />
                </div>
              ) : (
                <p className='text-white'>Đăng nhập</p>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default MobileLogin;
