import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import HomepageDesktop from '../components/Homepage/HomepageDesktop';
import HomepageMobile from '../components/Homepage/HomepageMobile';
import Icon from '../components/Icon';
import SettingsMobile from '../components/Settings/SettingsMobile';

const Homepage = () => {
  const [searchParams] = useSearchParams();
  const [isSetting, setIsSetting] = useState(searchParams.get('type') ? true : false);

  return (
    <div
      className={`relative h-[100vh] overflow-y-auto ${
        !isSetting ? 'bg-[#F2f5ff]' : 'bg-white'
      } md:bg-white`}
    >
      <div className='fixed bottom-8 left-[50%] z-10 m-auto ml-[-175px] w-[350px] md:hidden'>
        <div className='flex h-[48px] rounded-full bg-white shadow-[0_0_25px_0_rgba(0,0,0,0.1)]'>
          <button
            onClick={() => setIsSetting(false)}
            className={`flex w-[50%] items-center justify-center rounded-full ${
              !isSetting ? 'bg-[#1C45F9]' : 'bg-white'
            }`}
          >
            <Icon.HomeIcon className='h-6 w-6' fill={!isSetting ? 'white' : '#262664'} />
            {!isSetting && (
              <p className='ml-[14px] text-[12px] font-medium text-white'>Trang chủ</p>
            )}
          </button>
          <button
            onClick={() => setIsSetting(true)}
            className={`flex w-[50%] items-center justify-center rounded-full ${
              isSetting ? 'bg-[#1C45F9]' : 'bg-white'
            }`}
          >
            <Icon.GearIcon className='h-6 w-6' fill={isSetting ? 'white' : '#262664'} />
            {isSetting && <p className='ml-[14px] text-[12px] font-medium text-white'>Cài đặt</p>}
          </button>
        </div>
      </div>
      {!isSetting ? (
        <div>
          <HomepageMobile />
          <HomepageDesktop />
        </div>
      ) : (
        <SettingsMobile />
      )}
    </div>
  );
};
export default Homepage;
