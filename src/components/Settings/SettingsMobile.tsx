import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../assets/images/AvatarPic.png';
import Icon from '../../components/Icon';
import UserService from '../../service/user.service';
import useBoundStore from '../../store';

const SettingsMobile = () => {
  const [region, setRegion] = useState('binhdinh');
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);
  const userprofile = useBoundStore((state) => state.user);
  const getuserProfile = useBoundStore.use.getUserProfile();
  const logOut = useBoundStore.use.logOut();

  useEffect(() => {
    if (!isAuthenticated && localStorage.getItem('region')) {
      setRegion(localStorage.getItem('region') as string);
    } else {
      setRegion(userprofile?.settings?.region || 'binhdinh');
    }
  }, [isAuthenticated, userprofile]);

  const changeRegion = (newRegion: string) => {
    if (!isAuthenticated) {
      localStorage.setItem('region', newRegion);
      setRegion(newRegion);
    } else {
      UserService.updateProfile({ settings: { region: newRegion } })
        .then(() => {
          getuserProfile();
          setRegion(newRegion);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const logOutAccount = () => {
    logOut();
  };

  return (
    <div className='md:hidden'>
      <div className='h-[127px]'>
        <div className='relative flex h-full w-[70vw] items-center justify-between rounded-ee-[48px] bg-[#1C45F9] px-[50px] pb-[25px] pt-[60px] sm:pl-[80px]'>
          {/* <Icon.HomeIcon className='h-7 w-7' fill='white' /> */}
          <h1 className='text-[16px] font-bold text-[#FFFFFF]'>Cài đặt</h1>
          <div className='absolute bottom-[19px] right-[-30px] rounded-[20px] border-[2px] border-[#E1E4F2] bg-white px-[19px] py-[18px]'>
            <Icon.GearIcon fill='black' />
          </div>
        </div>
      </div>
      <div className='mt-[-1px] flex flex-col'>
        <div className='h-[52px] w-[77px] bg-[#1C45F9]'>
          <div className='h-[53px] w-[78px] rounded-ss-[80px] bg-[white]' />
        </div>
        <div className='mt-[-16px] flex flex-col px-[52px] sm:px-[80px]'>
          {isAuthenticated && (
            <img
              src={Avatar}
              alt='Avatar'
              className='mb-7 h-[100px] w-[100px] self-center rounded-full border-[1px] border-[#262664]/[.5] sm:self-start'
            />
          )}
          <h2 className='text-[16px] font-bold text-[#262664]'>Thông tin cá nhân</h2>
          {isAuthenticated ? (
            <div className='mt-4 flex flex-col space-y-3 sm:max-w-[400px]'>
              <Link
                to='/edit-profile/name'
                className='flex items-center justify-between rounded-[12px] border-[1px] border-[#BDBCCC] px-4 py-3'
              >
                <div className='flex items-center space-x-3'>
                  <Icon.NameIcon />
                  <p>Tên hiển thị</p>
                </div>
                <div className='flex items-center space-x-3'>
                  <p className='text-[14px] text-[#15294B]/[.5]'>
                    {userprofile?.name || 'Chưa cập nhật'}
                  </p>
                  <Icon.ArrowRight className='h-3 w-2' fill='#15294B' />
                </div>
              </Link>
              <Link
                to='/edit-profile/username'
                className='flex items-center justify-between rounded-[12px] border-[1px] border-[#BDBCCC] px-4 py-3'
              >
                <div className='flex items-center space-x-3'>
                  <Icon.NameIcon />
                  <p>Tên người dùng</p>
                </div>
                <div className='flex items-center space-x-3'>
                  <p className='text-[14px] text-[#15294B]/[.5]'>
                    {userprofile?.username || 'Chưa cập nhật'}
                  </p>
                  <Icon.ArrowRight className='h-3 w-2' fill='#15294B' />
                </div>
              </Link>
              <div
                // to='/edit-profile/password'
                className='flex items-center justify-between rounded-[12px] border-[1px] border-[#BDBCCC] px-4 py-3'
              >
                <div className='flex items-center space-x-3'>
                  <Icon.LockIcon />
                  <p>Mật khẩu</p>
                </div>
                <div className='flex items-center space-x-3'>
                  <p className='mr-5 text-[14px] text-[#15294B]/[.5]'>********</p>
                  {/* <Icon.ArrowRight className='h-3 w-2' fill='#15294B' /> */}
                </div>
              </div>
            </div>
          ) : (
            <div className='mt-4 flex flex-col'>
              <p className='text-[12px]'>
                Bạn chưa đăng nhập! Hãy đăng nhập để có thể sao lưu các bản dịch và chỉnh sửa thông
                tin cá nhân.
              </p>
              <Link
                to='/log-in'
                className='mt-6 w-fit rounded-[8px] border-[1px] border-[#1D46F8] px-4 py-2 text-[#1D46F8]'
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
        <div className='mt-8 flex flex-col px-[52px] sm:px-[80px]'>
          <h2 className='text-[16px] font-bold text-[#262664]'>Phương ngữ</h2>
          <div className='mt-4 max-w-[300px] rounded-[12px] border-[1px] border-[#262664]/[.5] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]'>
            <div
              onClick={() => changeRegion('binhdinh')}
              className={`flex items-center justify-between rounded-t-[12px] p-4 ${
                region === 'binhdinh' && 'bg-[#1C45F9]/[.1]'
              }`}
            >
              <p className='text-[14px] text-[#15294B]'>Bình Định</p>
              {region === 'binhdinh' && <Icon.CheckIcon />}
            </div>
            <div
              onClick={() => changeRegion('gialai')}
              className={`flex items-center justify-between p-4 ${
                region === 'gialai' && 'bg-[#1C45F9]/[.1]'
              }`}
            >
              <p className='text-[14px] text-[#15294B]'>Gia Lai</p>
              {region === 'gialai' && <Icon.CheckIcon />}
            </div>
            <div
              onClick={() => changeRegion('kontum')}
              className={`flex items-center justify-between rounded-b-[12px] p-4 ${
                region === 'kontum' && 'bg-[#1C45F9]/[.1]'
              }`}
            >
              <p className='text-[14px] text-[#15294B]'>Kon Tum</p>
              {region === 'kontum' && <Icon.CheckIcon />}
            </div>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => logOutAccount()}
            className='ml-[52px] mt-8 flex items-center self-start rounded-[12px] border-[1px] border-[#FF0000] p-2 sm:ml-[80px]'
          >
            <p className='text-[#FF0000]'>Đăng xuất</p>
            <Icon.LogOut className='ml-2' />
          </button>
        )}
        <div className='h-[100px] bg-white' />
      </div>
    </div>
  );
};
export default SettingsMobile;
