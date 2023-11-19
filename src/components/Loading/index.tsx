import { LottieOptions, useLottie } from 'lottie-react';
import { CSSProperties } from 'react';

const Loading = () => {
  const style: CSSProperties = {
    height: 'auto',
    width: '20vw',
    aspectRatio: 1,
  };
  const options: LottieOptions<'svg'> = {
    animationData: require('../../assets/animations/Loading.json'),
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, style);

  return (
    <div
      className='fixed z-[10000000] flex h-[100vh] w-[100vw] items-center
      justify-center bg-white'
    >
      {View}
    </div>
  );
};

export default Loading;
