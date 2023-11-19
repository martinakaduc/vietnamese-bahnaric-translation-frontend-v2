import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import Icon from '../../components/Icon';
import UserService from '../../service/user.service';
import useBoundStore from '../../store';

const EditProfile = () => {
  const param = useParams();
  const userprofile = useBoundStore((state) => state.user);
  const getUserProfile = useBoundStore.use.getUserProfile();
  const [inputValue, setInputValue] = useState(
    param.type === 'password'
      ? ''
      : param.type === 'username'
      ? userprofile.username
      : userprofile.name
  );

  const changeProfile = () => {
    if (param.type === 'password') {
      UserService.updateProfile({ password: inputValue })
        .then(() => {
          toast.success('Đổi mật khẩu thành công');
          getUserProfile();
        })
        .catch(() => {
          toast.error('Cập nhật thất bại');
        });
    } else if (param.type === 'username') {
      UserService.updateProfile({ username: inputValue })
        .then(() => {
          toast.success('Đổi tên người dùng thành công');
          getUserProfile();
        })
        .catch(() => {
          toast.error('Cập nhật thất bại');
        });
    } else {
      UserService.updateProfile({ name: inputValue })
        .then(() => {
          toast.success('Đổi tên hiển thị thành công');
          getUserProfile();
        })
        .catch(() => {
          toast.error('Cập nhật thất bại');
        });
    }
  };

  return (
    <div className='md:hidden'>
      <ToastContainer position='top-right' />
      <div className='h-[127px]'>
        <div className='relative flex h-full w-[70vw] items-center justify-between rounded-ee-[48px] bg-[#1C45F9] px-[50px] pb-[25px] pt-[60px] sm:pl-[80px]'>
          <Link to='/?type=settings'>
            <Icon.ArrowLeft className='h-4 w-5' fill='white' />
          </Link>
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
          <h2 className='text-[16px] font-bold text-[#262664]'>
            {param.type === 'name' && 'Tên hiển thị'}
            {param.type === 'username' && 'Tên người dùng'}
            {param.type === 'password' && 'Mật khẩu'}
          </h2>
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className='mt-4 rounded-[12px] border-[1px] border-[#BDBCCC] p-4 text-[14px] text-[#15294B] sm:max-w-[400px]'
          />
          <button
            onClick={() => changeProfile()}
            className='mt-4 w-fit rounded-[8px] border-[1px] border-[#1D46F8] px-4 py-3 text-[#1D46F8]'
          >
            Lưu thay đổi
          </button>
        </div>
        <div className='h-[100px] bg-white' />
      </div>
    </div>
  );
};
export default EditProfile;
