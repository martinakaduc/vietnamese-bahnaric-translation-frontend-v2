import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import Avatar from '../../assets/images/AvatarPic.png';
import UserService from '../../service/user.service';
import useBoundStore from '../../store';
import Icon from '../Icon';

const SettingsDesktop = () => {
  const [region, setRegion] = useState('binhdinh');
  const [editMode, setEditMode] = useState(false);
  const userprofile = useBoundStore((state) => state.user);
  const [name, setName] = useState(userprofile?.name || '');
  const [username, setUsername] = useState(userprofile?.username || '');
  // const [password, setPassword] = useState(userprofile?.password || '');
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);
  const [loading, setLoading] = useState(false);
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

  const quitEdit = () => {
    setName(userprofile?.name || '');
    setUsername(userprofile?.username || '');
    // setPassword(userprofile?.password || '');
    setEditMode(false);
  };

  const editProfile = () => {
    setLoading(true);
    UserService.updateProfile({ name, username })
      .then(() => {
        toast.success('Cập nhật thành công');
      })
      .catch(() => {
        toast.error('Cập nhật thất bại');
      })
      .finally(() => {
        setLoading(false);
        setEditMode(false);
      });
  };

  return (
    <div className='mt-[60px] flex w-full justify-center space-x-8 lg:space-x-10 xl:space-x-[48px] 2xl:space-x-[60px] 3xl:space-x-[80px]'>
      <ToastContainer position='top-right' />
      <div className='flex flex-col'>
        {isAuthenticated && (
          <img
            src={Avatar}
            alt='Avatar'
            className='mb-8 h-[120px] w-[120px] self-center rounded-full border-[1px] border-[#262664]/[.1] lg:h-[140px] lg:w-[140px] 2xl:h-[180px] 2xl:w-[180px] 3xl:h-[200px] 3xl:w-[200px]'
          />
        )}
        <h2 className='text-[20px] font-bold text-[#262664] xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px]'>
          Phương ngữ
        </h2>
        <div className='mt-4 w-[240px] rounded-[12px] border-[1px] border-[#262664]/[.5] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] lg:w-[280px] xl:w-[300px] 3xl:w-[330px]'>
          <div
            onClick={() => changeRegion('binhdinh')}
            className={`flex cursor-pointer items-center justify-between rounded-t-[12px] px-4 py-3 hover:bg-[#1C45F9]/[.1] ${
              region === 'binhdinh' && 'bg-[#1C45F9]/[.1]'
            }`}
          >
            <p className='text-[#15294B] 2xl:text-[18px] 3xl:text-[20px]'>Bình Định</p>
            {region === 'binhdinh' && <Icon.CheckIcon />}
          </div>
          <div
            onClick={() => changeRegion('gialai')}
            className={`flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-[#1C45F9]/[.1] ${
              region === 'gialai' && 'bg-[#1C45F9]/[.1]'
            }`}
          >
            <p className='text-[#15294B] 2xl:text-[18px] 3xl:text-[20px]'>Gia Lai</p>
            {region === 'gialai' && <Icon.CheckIcon />}
          </div>
          <div
            onClick={() => changeRegion('kontum')}
            className={`flex cursor-pointer items-center justify-between rounded-b-[12px] px-4 py-3 hover:bg-[#1C45F9]/[.1] ${
              region === 'kontum' && 'bg-[#1C45F9]/[.1]'
            }`}
          >
            <p className='text-[#15294B] 2xl:text-[18px] 3xl:text-[20px]'>Kon Tum</p>
            {region === 'kontum' && <Icon.CheckIcon />}
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => logOut()}
            className='mt-8 flex items-center self-start rounded-full border-[1px] border-[#FF0000] px-4 py-2 hover:bg-[#FF0000]/[.1]'
          >
            <p className='text-[#FF0000] 2xl:text-[18px] 3xl:text-[20px]'>Đăng xuất</p>
            <Icon.LogOut className='ml-2' />
          </button>
        )}
      </div>
      <div className='flex w-[320px] flex-col lg:w-[400px] xl:w-[420px] 2xl:w-[480px] 3xl:w-[600px]'>
        <h2 className='text-[20px] font-bold text-[#262664] xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px]'>
          Thông tin cá nhân
        </h2>
        {isAuthenticated ? (
          <form className='mt-5 flex flex-col'>
            <h2 className='font-semibold 2xl:text-[18px] 3xl:text-[20px]'>Tên hiển thị</h2>
            <div className='mt-2 flex w-full'>
              <div className='flex w-[52px] items-center justify-center rounded-l-[12px] border-[1px] border-[#BDBCCC]'>
                <Icon.NameIcon />
              </div>
              <input
                type='text'
                disabled={!editMode}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-r-[12px] border-[1px] border-[#BDBCCC] ${
                  editMode ? 'bg-white' : 'bg-[#f2f5ff]'
                } px-4 py-3 text-[#262664] 2xl:text-[18px] 3xl:text-[20px]`}
                placeholder='test'
              />
            </div>
            <h2 className='mt-4 font-semibold 2xl:text-[18px] 3xl:text-[20px]'>Tên người dùng</h2>
            <div className='mt-2 flex w-full'>
              <div className='flex w-[52px] items-center justify-center rounded-l-[12px] border-[1px] border-[#BDBCCC]'>
                <Icon.NameIcon />
              </div>
              <input
                type='text'
                disabled={!editMode}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full rounded-r-[12px] border-[1px] border-[#BDBCCC] ${
                  editMode ? 'bg-white' : 'bg-[#f2f5ff]'
                } px-4 py-3 text-[#262664] 2xl:text-[18px] 3xl:text-[20px]`}
                placeholder='test'
              />
            </div>
            <h2 className='mt-4 font-semibold 2xl:text-[18px] 3xl:text-[20px]'>Mật khẩu</h2>
            <div className='mt-2 flex w-full'>
              <div className='flex w-[52px] items-center justify-center rounded-l-[12px] border-[1px] border-[#BDBCCC]'>
                <Icon.LockIcon />
              </div>
              <input
                type='password'
                disabled
                placeholder='******'
                // onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-r-[12px] border-[1px] border-[#BDBCCC] bg-[#f2f5ff]
                 px-4 py-3 text-[#262664] 2xl:text-[18px] 3xl:text-[20px]`}
              />
            </div>
            {editMode ? (
              <div className='flex space-x-3'>
                {loading ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editProfile();
                    }}
                    className='mt-6 flex w-[94.5px] items-center justify-center rounded-[8px] border-[1px] border-[#0F9d58] px-4 py-2 text-[#0F9d58] hover:bg-[#0F9D58] hover:text-white 2xl:w-[102px] 2xl:text-[18px] 3xl:w-[110px] 3xl:text-[20px]'
                  >
                    <div className='h-5 w-5 animate-spin rounded-full border-l-2 border-solid border-[#0f9d58]' />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editProfile();
                    }}
                    className='mt-6 w-fit rounded-[8px] border-[1px] border-[#0F9d58] px-4 py-2 text-[#0F9d58] hover:bg-[#0F9D58] hover:text-white 2xl:text-[18px] 3xl:text-[20px]'
                  >
                    Cập nhật
                  </button>
                )}
                <button
                  onClick={() => quitEdit()}
                  className='mt-6 w-fit rounded-[8px] border-[1px] border-[#1D46F8] px-4 py-2 text-[#1D46F8] hover:bg-[#1D46F8] hover:text-white 2xl:text-[18px] 3xl:text-[20px]'
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className='mt-6 w-fit rounded-[8px] border-[1px] border-[#1D46F8] px-4 py-2 text-[#1D46F8] hover:bg-[#1D46F8] hover:text-white 2xl:text-[18px] 3xl:text-[20px]'
              >
                Chỉnh sửa
              </button>
            )}
          </form>
        ) : (
          <>
            <p className='mt-4 2xl:text-[18px] 3xl:text-[20px]'>
              Bạn chưa đăng nhập! Hãy đăng nhập để có thể sao lưu các bản dịch và chỉnh sửa thông
              tin cá nhân.
            </p>
            <Link
              to='/log-in'
              className='mt-6 w-fit rounded-[8px] border-[1px] border-[#1D46F8] px-4 py-2 text-[#1D46F8] hover:bg-[#1D46F8] hover:text-white 2xl:text-[18px] 3xl:text-[20px]'
            >
              Đăng nhập
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsDesktop;
