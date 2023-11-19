import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

import Avatar from '../../assets/images/AvatarPic.png';
import BanaLogo from '../../assets/images/BanaLogo.png';
import CharacterIcon from '../../assets/images/characterWithCursor.png';
import Icon from '../../components/Icon';
import TranslateService from '../../service/translate.service';
import VoiceService from '../../service/voice.service';
import useBoundStore from '../../store';
import { SavedTranslation } from '../../types';
import FetchUtils from '../../utils/FetchUtils';
import BahnarSymbolModal from '../BahnarKeyboard';
import Pagination from '../Pagination';
import SettingsDesktop from '../Settings/SettingsDesktop';

type TranslationHistoryProps = {
  textVN: string;
  textBana: string;
  createdAt: string;
};

const HomepageDesktop = () => {
  const [specicalCharacterToggle, setSpecicalCharacterToggle] = useState(false);
  const [historyFilter, setHistoryFilter] = useState(0);
  const [toggleStar, setToggleStar] = useState<boolean[]>([]);
  const [textVN, setTextVN] = useState('');
  const [textBana, setTextBana] = useState('');
  const [textCountVN, setTextCountVN] = useState(0);
  const [textCountBana, setTextCountBana] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState({ main: false, sub: false });
  const [voiceGender, setVoiceGender] = useState({ main: 'Nam', sub: 'Nam' });
  const [copied, setCopied] = useState(false);
  const [copiedSub, setCopiedSub] = useState(false);
  const [voiceLoading, isVoiceLoading] = useState({ main: false, sub: false });
  const [saveLoading, setSaveLoading] = useState(false);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const [translatinHistory, setTranslatinHistory] = useState<TranslationHistoryProps[]>([]);
  const [savedTranslationHistory, setSavedTranslationHistory] = useState<SavedTranslation[]>([]);
  const [activeHistory, setActiveHistory] = useState(0);
  const [isSaveAvailable, setIsSaveAvailable] = useState(false);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageFavorite, setPageFavorite] = useState(1);
  const [totalCount, setTotalCount] = useState({ total: 0, favorite: 0 });

  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);
  const userprofile = useBoundStore((state) => state.user);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 24, y: 40 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const getTotalTranslation = () => {
    TranslateService.countAll()
      .then((res) => {
        const { total, favorite } = res.data.payload;
        setTotalCount({ total, favorite });
      })
      .catch((err) => {
        console.log(JSON.stringify(err.response));
      });
  };

  useEffect(() => {
    getTotalTranslation();
  }, []);

  useEffect(() => {
    adjustInputSize();
  }, [textBana]);

  useEffect(() => {
    if (textBana === '') setIsSaveAvailable(false);
  }, [textBana]);

  const adjustInputSize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handlePopupPositionChange = () => {
    if (textareaRef.current) {
      let xPosition = 20;
      if (window.innerWidth >= 1536) {
        xPosition = 24;
      }
      let clientHeight;
      setTimeout(() => {
        if (textareaRef.current) {
          clientHeight = textareaRef.current.clientHeight;
          setPopupPosition({ y: clientHeight, x: xPosition });
        }
      }, 0);
    }
  };

  const handleFocus = () => {
    setPopupVisible(true);
  };

  const handleBlur = () => {
    setPopupVisible(false);
  };

  const epochToDateString = (epochTime?: number) => {
    const date = epochTime ? new Date(epochTime) : new Date();

    const day = date.getDate().toString().padStart(2, '0');
    const weekDayNum = date.getDay();
    const weekDay = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ bảy'][
      weekDayNum
    ];
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hour = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hour}:${minutes}, ${weekDay}, ${day}/${month}/${year}`;
  };

  const pushToHistory = (prevTextVN: string, prevTextBana: string) => {
    const currentHistory = translatinHistory;
    currentHistory.unshift({
      textVN: prevTextVN,
      textBana: prevTextBana,
      createdAt: epochToDateString(),
    });
    if (currentHistory.length > 10) currentHistory.pop();
    setTranslatinHistory(currentHistory);
  };

  const performTranslation = () => {
    setLoading(true);
    const text = textVN;
    TranslateService.translate(text)
      .then((res) => {
        setIsSaveAvailable(true);
        setTextBana(res?.data?.payload?.tgt || '');
        setTextCountBana(res?.data?.payload?.tgt.length || 0);
        pushToHistory(text, res?.data?.payload?.tgt || '');
      })
      .catch((err) => {
        console.log(JSON.stringify(err.response));
      })
      .finally(() => {
        setLoading(false);
        if (!isPopupVisible) {
          const xPosition = window.innerWidth >= 1536 ? 24 : 20;
          let yPosition = 64;
          if (window.innerWidth >= 1872) {
            yPosition = 80;
          } else if (window.innerWidth >= 1536) {
            yPosition = 74;
          } else if (window.innerWidth >= 1280) {
            yPosition = 70;
          }
          setPopupPosition({ x: xPosition, y: yPosition });
        }
      });
  };

  const pronounceBana = (text: string, isHistory: boolean) => {
    let gender;
    if (isHistory) {
      isVoiceLoading({ ...voiceLoading, sub: true });
      gender = voiceGender.sub === 'Nam' ? 'male' : 'female';
    } else {
      isVoiceLoading({ ...voiceLoading, main: true });
      gender = voiceGender.main === 'Nam' ? 'male' : 'female';
    }
    let region = 'binhdinh';
    if (isAuthenticated) {
      region = userprofile?.settings?.region || 'binhdinh';
    } else {
      region = localStorage.getItem('region') || 'binhdinh';
    }
    VoiceService.getBahnarVoice(text, gender, region)
      .then(async (res) => {
        const urls = JSON.parse(res.data.payload).urls;

        // Fetch until the audio is available
        for (let url of urls) {
          await FetchUtils.polling(() => axios.get(url), {
            interval: 2000,
            maxCount: 5,
            onError: () => {
              console.log("Can't fetch audio at ", url);
            },
          });
          if (audioRef.current) audioRef.current.src = url;
        }
        isVoiceLoading({ main: false, sub: false });
      })
      .catch((err) => {
        console.log(JSON.stringify(err.response));
        isVoiceLoading({ main: false, sub: false });
      });
  };

  const handleInputSymbol = (char: string) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const currentValue = textareaRef.current.value;
      const newValue =
        currentValue.substring(0, cursorPosition) + char + currentValue.substring(cursorPosition);
      setTextBana(newValue);

      textareaRef.current.selectionStart = cursorPosition + 1;
      textareaRef.current.selectionEnd = cursorPosition + 1;
      textareaRef.current.focus();
    }
  };

  const saveTranslation = () => {
    setSaveLoading(true);
    const src = textVN;
    const tgt = textBana;
    TranslateService.save(src, tgt)
      .then(() => {
        toast.success('Lưu thành công');
        getTotalTranslation();
      })
      .catch((err) => {
        console.log(JSON.stringify(err.response));
        toast.error('Lưu thất bại');
      })
      .finally(() => setSaveLoading(false));
  };

  useEffect(() => {
    if (copied) setTimeout(() => setCopied(false), 1500);
  }, [copied]);

  useEffect(() => {
    if (copiedSub) setTimeout(() => setCopiedSub(false), 1500);
  }, [copiedSub]);

  const fetchTranslationHistory = (optionNumber: number) => {
    setTranslationLoading(true);
    const option =
      optionNumber === 2
        ? {
            limit: 10,
            offset: totalCount.total > 10 ? totalCount.total - 10 : 0,
          }
        : {
            limit: 10,
            offset: totalCount.favorite > 10 ? totalCount.favorite - 10 : 0,
            isFavorite: true,
          };
    TranslateService.findAll(option)
      .then((res) => {
        const result = res?.data?.payload.reverse();
        setSavedTranslationHistory(result);
        setToggleStar(result.map((element) => (element.isFavorite ? element.isFavorite : false)));
      })
      .catch((err) => {
        console.log(JSON.stringify(err.response));
      })
      .finally(() => setTranslationLoading(false));
  };

  const markAsFavorite = (id: string, isFavorite: boolean) => {
    TranslateService.markFavorite(id, isFavorite)
      .then(() => {})
      .catch((err) => {
        console.log(JSON.stringify(err.response));
      });
  };

  useEffect(() => {
    let offset = totalCount.total > 10 ? totalCount.total - 10 : 0,
      limit = 10;
    if (totalCount.total > 10 * pageTotal) {
      offset = totalCount.total - 10 * pageTotal;
    } else {
      limit = totalCount.total - 10 * (pageTotal - 1);
      offset = 0;
    }
    setTranslationLoading(true);
    const option = {
      limit: limit,
      offset: offset,
    };
    TranslateService.findAll(option)
      .then((res) => {
        const result = res?.data?.payload.reverse();
        setSavedTranslationHistory(result);
        setToggleStar(result.map((element) => (element.isFavorite ? element.isFavorite : false)));
      })
      .catch((err) => {
        console.log(JSON.stringify(err.response));
      })
      .finally(() => setTranslationLoading(false));
  }, [pageTotal, totalCount.total]);

  useEffect(() => {
    let offset = totalCount.favorite > 10 ? totalCount.favorite - 10 : 0,
      limit = 10;
    if (totalCount.favorite > 10 * pageFavorite) {
      offset = totalCount.favorite - 10 * pageFavorite;
    } else {
      limit = totalCount.favorite - 10 * (pageFavorite - 1);
      offset = 0;
    }
    setTranslationLoading(true);
    const option = {
      limit: limit,
      offset: offset,
      isFavorite: true,
    };
    TranslateService.findAll(option)
      .then((res) => {
        const result = res?.data?.payload.reverse();
        setSavedTranslationHistory(result);
        setToggleStar(result.map((element) => (element.isFavorite ? element.isFavorite : false)));
      })
      .catch((err) => {
        console.log(JSON.stringify(err.response));
      })
      .finally(() => setTranslationLoading(false));
  }, [pageFavorite, totalCount.favorite]);

  return (
    <div className='hidden md:block' onClick={() => handleBlur()}>
      <ToastContainer position='top-right' />
      <div className='flex h-[80px] justify-between 3xl:h-[100px]'>
        <div className='relative flex h-full w-[60vw] items-center rounded-ee-[48px] bg-[#1C45F9] px-[48px] py-5 lg:px-[60px] xl:px-[80px] 2xl:px-[100px] 3xl:px-[120px]'>
          <img
            src={BanaLogo}
            alt='Avatar'
            className='mr-3 h-[40px] w-[40px] rounded-full 2xl:h-[48px] 2xl:w-[48px] 3xl:h-[60px] 3xl:w-[60px]'
          />
          <h1 className='text-[20px] font-bold text-[#FFFFFF] 2xl:text-[22px] 3xl:text-[24px]'>
            Dịch thuật Bahnar
          </h1>
        </div>
        {!isSetting && (
          <div className='flex items-center'>
            {!isAuthenticated ? (
              <Link
                to='/log-in'
                className='mr-[48px] h-fit rounded-full border-[1px] border-[#1C45F9]/[.2667] px-4 py-2 text-[14px] text-[#1C45F9] hover:bg-[#1C45F9] hover:text-white lg:mr-[60px] lg:text-base xl:mr-[80px] 2xl:mr-[100px] 2xl:px-6 2xl:py-3 2xl:text-[18px] 3xl:mr-[120px] 3xl:px-8 3xl:py-4 3xl:text-[20px]'
              >
                Đăng nhập
              </Link>
            ) : (
              <div className='mr-[48px] flex h-fit items-center rounded-full border-[1px] border-[#262664]/[.2667] p-1 px-1 text-[14px] text-[#1C45F9] shadow-[0px_0px_25px_0px_rgba(0,0,0,0.1)] lg:mr-[60px] lg:text-base xl:mr-[80px] 2xl:mr-[100px] 2xl:text-[18px] 3xl:mr-[120px] 3xl:text-[20px]'>
                <img
                  src={Avatar}
                  alt='Avatar'
                  className='mr-3 h-7 w-7 rounded-full border-[1px] border-[#262664]/[.5] xl:h-8 xl:w-8 2xl:h-[40px] 2xl:w-[40px]'
                />
                <p className='mr-7 max-w-[72px] truncate'>{userprofile?.username}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className='flex w-full flex-col'>
        <audio ref={audioRef} className='hidden' controls autoPlay>
          <source src='' type='audio/mpeg' />
        </audio>
        <div className='h-[68px] w-[77px] bg-[#1C45F9]'>
          <div className='h-[69px] w-[78px] rounded-ss-[60px] bg-white' />
        </div>
        <div className='m-auto mt-[-40px] flex h-[48px] w-[280px] rounded-full bg-white shadow-[0_0_25px_0_rgba(0,0,0,0.1)]'>
          <button
            onClick={() => {
              setIsSetting(false);
              setHistoryFilter(0);
            }}
            className={`flex w-[50%] items-center justify-center rounded-full ${
              isSetting ? 'bg-white' : 'bg-[#1C45F9]'
            }`}
          >
            <Icon.HomeIcon className='h-6 w-6' fill={isSetting ? '#262664' : 'white'} />
            <p
              className={`ml-2 text-[16px] font-medium ${
                isSetting ? 'text-[@#262664]' : 'text-white'
              } 3xl:text-[18px]`}
            >
              Trang chủ
            </p>
          </button>
          <button
            onClick={() => {
              setIsSetting(true);
              setHistoryFilter(0);
            }}
            className={`flex w-[50%] items-center justify-center rounded-full ${
              isSetting ? 'bg-[#1C45F9]' : 'bg-white'
            }`}
          >
            <Icon.GearIcon className='h-6 w-6' fill={!isSetting ? '#262664' : 'white'} />
            <p
              className={`${
                isSetting ? 'text-white' : 'text-[#262664]'
              } ml-2 text-[16px] font-medium 3xl:text-[18px]`}
            >
              Cài đặt
            </p>
          </button>
        </div>
      </div>
      {isSetting ? (
        <>
          <SettingsDesktop />
          <div className='h-[60px]' />
        </>
      ) : (
        <>
          <div className='ml-[48px] mt-10 flex w-fit items-center rounded-[10px] border-[1px] border-[#E1E4F2] bg-[#F2F5FF] pr-5 lg:ml-[60px] xl:ml-[80px] 2xl:ml-[100px] 3xl:ml-[120px]'>
            <div className='w-fit rounded-[10px] border-[2px] border-[#E1E4F2] bg-white p-2 2xl:p-3'>
              <img src={CharacterIcon} className='h-4 w-4 2xl:h-5 2xl:w-5' alt='Character Icon' />
            </div>
            <div className='ml-3 text-[16px] font-semibold text-[#1C45F9] 2xl:text-[18px] 3xl:text-[20px]'>
              Dịch văn bản
            </div>
          </div>
          <div className='mt-10 flex flex-col' onClick={(e) => e.stopPropagation()}>
            <div className='mx-[48px] rounded-[20px] border-[1px] border-[#262664] lg:mx-[60px] xl:mx-[80px] 2xl:mx-[100px] 3xl:mx-[120px]'>
              <div className='relative flex items-center justify-center py-3 3xl:py-4'>
                <p className='mr-7 w-[138px] text-end text-[18px] font-semibold text-[#262664] xl:w-[153px] xl:text-[20px] 3xl:w-[184px] 3xl:text-[24px]'>
                  Tiếng Việt
                </p>
                <Icon.ArrowRight className='h-4 w-4' fill='#1C45F9' />
                <Icon.ArrowRight className='ml-[-8px] h-4 w-4' fill='#1C45F9' />
                <p className='ml-7 w-[138px] text-start text-[18px] font-semibold text-[#262664] xl:w-[153px] xl:text-[20px] 3xl:w-[184px] 3xl:text-[24px]'>
                  Ba-na
                </p>
                <div className='absolute right-3 flex items-center space-x-2 3xl:space-x-4'>
                  <button
                    onClick={() => setSpecicalCharacterToggle(!specicalCharacterToggle)}
                    className='flex items-center space-x-3 rounded-[8px] border-[1px] border-[#1C45F9] px-2 py-[2px]'
                  >
                    <p className='text-[16px] font-bold text-[#1C45F9] 2xl:text-[18px] 3xl:text-[20px]'>
                      Ĕ
                    </p>
                    <p className='min-w-[21px] text-[12px] font-medium text-[#262664] xl:text-[14px] 2xl:min-w-[28px] 2xl:text-[16px] 3xl:text-[18px]'>
                      <u>{specicalCharacterToggle ? 'ON' : 'OFF'}</u>
                    </p>
                  </button>
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(textBana);
                      setCopied(true);
                    }}
                    className='copy-anchor cursor-pointer'
                    data-tooltip-content={copied ? 'Đã copy' : 'Copy bản dịch'}
                  >
                    <Icon.CopyIcon
                      className='h-5 w-6 cursor-pointer xl:h-8 xl:w-6'
                      fill={copied ? '#1C45F9' : '#5F5F90'}
                    />
                    <Tooltip anchorSelect='.copy-anchor' />
                  </div>
                </div>
              </div>
              <div className='flex h-[240px] border-t-[1px] border-t-[#CCCCCC] xl:h-[280px] 3xl:h-[320px]'>
                <div className='relative flex w-[50%] flex-col justify-between border-r-[1px] border-r-[#CCCCCC]'>
                  <textarea
                    onChange={(e) => {
                      setTextCountVN(e.target.value.length);
                      setTextVN(e.target.value);
                    }}
                    value={textVN}
                    spellCheck='false'
                    maxLength={1000}
                    style={{ resize: 'none' }}
                    className='show-scrollbar h-full w-[100%] overflow-y-auto rounded-es-[20px] pl-5 pr-6 pt-4 text-[16px] text-[#262664] focus:border-none focus:shadow-none focus:outline-none xl:text-[18px] 2xl:pl-6 2xl:pr-8 2xl:pt-5 3xl:pr-9 3xl:text-[20px]'
                  />
                  {textCountVN > 0 && (
                    <Icon.CloseIcon
                      onClick={() => {
                        setTextVN('');
                        setTextCountVN(0);
                        setTextBana('');
                        setTextCountBana(0);
                      }}
                      className='absolute right-2 top-2 h-5 w-5 cursor-pointer 2xl:h-6 2xl:w-6'
                      fill='#45457C'
                    />
                  )}
                  <div className='flex justify-between px-5 py-3 2xl:px-6 3xl:py-4'>
                    <p className='self-end text-[12px] font-bold text-[#262664] lg:text-[14px] 2xl:text-[16px] 3xl:text-[18px]'>
                      {textCountVN}
                    </p>
                    <button
                      onClick={() => performTranslation()}
                      className='flex items-center rounded-[8px] bg-[#1C45F9] px-3 py-1 text-[12px] text-white hover:bg-[#1C45F9]/[.8] 2xl:text-[14px] 3xl:text-[18px]'
                    >
                      Dịch
                    </button>
                  </div>
                </div>
                <div
                  className='relative flex w-[50%] flex-col justify-between'
                  onClick={(e) => e.stopPropagation()}
                >
                  {loading ? (
                    <div className='flex h-full items-center justify-center'>
                      <div className='h-10 w-10 animate-spin rounded-full border-l-2 border-solid border-[#1C45F9]' />
                    </div>
                  ) : (
                    <textarea
                      onChange={(e) => {
                        handlePopupPositionChange();
                        setTextCountBana(e.target.value.length);
                        setTextBana(e.target.value);
                      }}
                      value={textBana}
                      spellCheck='false'
                      style={{ resize: 'none' }}
                      maxLength={1000}
                      onFocus={handleFocus}
                      ref={textareaRef}
                      className=' show-scrollbar max-h-[240px] w-[100%] overflow-y-auto rounded-ee-[20px] px-5 pt-4 text-[16px] text-[#262664] focus:border-none focus:shadow-none focus:outline-none xl:max-h-[280px] xl:text-[18px] 2xl:px-6 2xl:pt-5 3xl:max-h-[320px] 3xl:text-[20px]'
                    />
                  )}
                  {isPopupVisible && specicalCharacterToggle && textBana !== '' && (
                    <BahnarSymbolModal
                      inputCharacter={handleInputSymbol}
                      leftposition={popupPosition.x}
                      topposition={popupPosition.y}
                    />
                  )}
                  <div className='flex justify-between px-5 py-3 2xl:px-6 3xl:py-4'>
                    <p className='self-end text-[12px] font-bold text-[#262664] lg:text-[14px] 2xl:text-[16px] 3xl:text-[18px]'>
                      {textCountBana}
                    </p>
                    <div className='relative flex space-x-2 text-left'>
                      {isSaveAvailable && !saveLoading && isAuthenticated && (
                        <button
                          onClick={() => saveTranslation()}
                          className='flex items-center rounded-[8px] bg-[#1C45F9] px-2 py-1 text-[12px] text-white hover:bg-[#1C45F9]/[.8]'
                        >
                          <Icon.DownloadIcon fill='white' className='h-4 w-4 2xl:h-5 2xl:w-5' />
                          <p className='text-[12px] text-white 2xl:text-[14px] 3xl:text-[18px]'>
                            Lưu
                          </p>
                        </button>
                      )}
                      {isSaveAvailable && saveLoading && (
                        <button className='flex items-center rounded-[8px] bg-[#1C45F9] px-2 py-1 text-[12px] text-white hover:bg-[#1C45F9]/[.8]'>
                          <div className='flex h-full w-[35.5px] items-center justify-center 2xl:w-[42.7px] 3xl:w-[49.24px]'>
                            <div className='h-6 w-6 animate-spin rounded-full border-l-2 border-solid border-white' />
                          </div>
                        </button>
                      )}
                      <button className='flex items-center justify-center rounded-[8px] border-[1px] border-[#5F5F90] bg-white p-1 focus:border-[#1C45F9]'>
                        {voiceLoading.main ? (
                          <div className='flex h-full w-[31px] items-center justify-center lg:w-[38px] 2xl:w-[42px] 3xl:w-[52px]'>
                            <div className='h-2 w-2 animate-spin rounded-full border-l-2 border-solid border-[#1C45F9]' />
                          </div>
                        ) : (
                          <div
                            className='flex items-center'
                            onClick={() => pronounceBana(textBana, false)}
                          >
                            <Icon.VoiceIcon
                              className='mr-1 h-[11px] w-[7px] lg:h-[14px] lg:w-[10px] 2xl:h-[16px] 3xl:h-[18px] 3xl:w-3'
                              fill='#262664'
                            />
                            <div className='w-5 text-[10px] text-[#262664] lg:w-6 lg:text-[12px] 2xl:w-7 2xl:text-[14px] 3xl:w-9 3xl:text-[18px]'>
                              {voiceGender.main}
                            </div>
                          </div>
                        )}
                        <div
                          className='flex items-center'
                          onClick={() => setIsOpen({ ...isOpen, main: !isOpen.main })}
                        >
                          <div className='ml-2 h-[13px] w-[0.5px] bg-[#5F5F90] lg:h-[18px] 2xl:h-[22px] 3xl:h-[28px]' />
                          <Icon.ArrowDown className='ml-2 xl:h-2 xl:w-3' fill='#262664' />
                        </div>
                      </button>

                      {isOpen.main && (
                        <div className='absolute right-0 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5'>
                          <div className='py-1'>
                            <div
                              onClick={() => {
                                setIsOpen({ ...isOpen, main: !isOpen.main });
                                setVoiceGender({ ...voiceGender, main: 'Nam' });
                              }}
                              className='block px-2 py-1 text-[12px] hover:bg-gray-100 hover:text-gray-900'
                            >
                              Nam
                            </div>
                            <div
                              onClick={() => {
                                setIsOpen({ ...isOpen, main: !isOpen.main });
                                setVoiceGender({ ...voiceGender, main: 'Nữ' });
                              }}
                              className='block px-2 py-1 text-[12px] hover:bg-gray-100 hover:text-gray-900'
                              role='menuitem'
                            >
                              Nữ
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='h-[40px] w-[77px] self-end bg-[#F2F5ff]'>
              <div className='h-[41px] w-[78px] rounded-ee-[80px] bg-[#FFFFFF]' />
            </div>
          </div>
          <div className='bg-[#F2F5FF] pb-[60px]'>
            <div className='h-[68px] w-[77px] bg-white'>
              <div className='h-[69px] w-[78px] rounded-ss-[60px] bg-[#F2F5FF]' />
            </div>
            <div className='mt-[-32px] flex px-[48px] lg:px-[60px] xl:px-[80px] 2xl:px-[100px] 3xl:px-[120px]'>
              <div className='w-[36%] lg:w-[50%] 2xl:w-[60%] 3xl:w-[68%]'>
                <div className='flex flex-col bg-[#F2F5FF]'>
                  <div className='flex'>
                    <button
                      className={`flex w-[100px] justify-center py-2 text-[14px] font-medium xl:text-[16px] 3xl:text-[18px] ${
                        historyFilter === 0
                          ? 'border-b-[2px] border-b-[#1C45F9] text-[#1C45F9]'
                          : 'text-[#262664]'
                      }`}
                      onClick={() => {
                        setHistoryFilter(0);
                        setActiveHistory(0);
                      }}
                    >
                      Gần đây
                    </button>
                    {isAuthenticated && (
                      <button
                        className={`flex w-[100px] justify-center py-2 text-[14px] font-medium xl:text-[16px] 3xl:text-[18px] ${
                          historyFilter === 1
                            ? 'border-b-[2px] border-b-[#1C45F9] text-[#1C45F9]'
                            : 'text-[#262664]'
                        }`}
                        onClick={() => {
                          setHistoryFilter(1);
                          fetchTranslationHistory(1);
                          setActiveHistory(0);
                        }}
                      >
                        Yêu thích
                      </button>
                    )}
                    {isAuthenticated && (
                      <button
                        className={`flex w-[100px] justify-center py-2 text-[14px] font-medium xl:text-[16px] 3xl:text-[18px] ${
                          historyFilter === 2
                            ? 'border-b-[2px] border-b-[#1C45F9] text-[#1C45F9]'
                            : 'text-[#262664]'
                        }`}
                        onClick={() => {
                          setHistoryFilter(2);
                          fetchTranslationHistory(2);
                          setActiveHistory(0);
                        }}
                      >
                        Đã lưu
                      </button>
                    )}
                  </div>
                  <div className='show-scrollbar mt-5 flex max-h-[287px] flex-col overflow-y-auto rounded-[20px] border-[1px] border-[#262664] bg-white lg:max-h-[370px] xl:max-h-[376px] 2xl:max-h-[379px] 3xl:max-h-[402px]'>
                    {!translationLoading &&
                      historyFilter === 0 &&
                      translatinHistory.map((item, index) => (
                        <div
                          key={index}
                          className={`flex justify-between ${
                            activeHistory === index ? 'bg-[#1C45F9]/[.1]' : ''
                          } bg-origin-padding px-3 py-3 3xl:px-5 3xl:py-4`}
                        >
                          <div
                            onClick={() => setActiveHistory(index)}
                            className='flex w-full cursor-pointer flex-col space-y-[10px] text-[12px] text-[#262664] xl:w-[88%] xl:text-[14px] 3xl:text-[16px]'
                          >
                            <p className='max-h-[36px] overflow-hidden overflow-ellipsis xl:max-h-[44px] 3xl:max-h-[52px]'>
                              {item.textVN}
                            </p>
                            <p
                              className={`max-h-[36px] overflow-hidden overflow-ellipsis ${
                                activeHistory === index ? 'text-[#666666]' : 'text-[#BDBCCC]'
                              } xl:max-h-[44px] 3xl:max-h-[52px]`}
                            >
                              {item.textBana}
                            </p>
                          </div>
                        </div>
                      ))}
                    {!translationLoading &&
                      historyFilter !== 0 &&
                      savedTranslationHistory.map((item, index) => (
                        <div
                          key={index}
                          className={`flex justify-between ${
                            activeHistory === index ? 'bg-[#1C45F9]/[.1]' : ''
                          } bg-origin-padding px-3 py-3 3xl:px-5 3xl:py-4`}
                        >
                          <div
                            onClick={() => setActiveHistory(index)}
                            className='flex w-[77%] cursor-pointer flex-col space-y-[10px] text-[12px] text-[#262664] xl:w-[88%] xl:text-[14px] 3xl:text-[16px]'
                          >
                            <p className='max-h-[36px] overflow-hidden overflow-ellipsis xl:max-h-[44px] 3xl:max-h-[52px]'>
                              {item.src}
                            </p>
                            <p
                              className={`max-h-[36px] overflow-hidden overflow-ellipsis ${
                                activeHistory === index ? 'text-[#666666]' : 'text-[#BDBCCC]'
                              } xl:max-h-[44px] 3xl:max-h-[52px]`}
                            >
                              {item.tgt}
                            </p>
                          </div>
                          <Icon.StarIcon
                            fill={toggleStar[index] ? '#FCD612' : 'transparent'}
                            stroke={!toggleStar[index] ? '#262664' : 'none'}
                            onClick={() => {
                              toggleStar[index] = !toggleStar[index];
                              setToggleStar([...toggleStar]);
                              markAsFavorite(item._id, item.isFavorite ? !item.isFavorite : true);
                            }}
                            className='cursor-pointer'
                          />
                        </div>
                      ))}
                    {((translatinHistory.length === 0 && historyFilter === 0) ||
                      (savedTranslationHistory.length === 0 && historyFilter !== 0)) &&
                      !translationLoading && (
                        <div className='flex flex-col items-center space-y-5 px-3 py-5 3xl:px-5 3xl:py-4'>
                          <Icon.EmptyIcon className='mx-auto h-[100px] w-[100px] xl:h-[120px] xl:w-[120px] 2xl:h-[140px] 2xl:w-[124px]' />
                          <p className='text-center text-[12px] font-medium xl:text-[14px] 2xl:text-base'>
                            Hiện chưa có bản dịch nào
                          </p>
                        </div>
                      )}
                    {translationLoading && (
                      <div className='flex flex-col items-center space-y-5 px-3 py-5 3xl:px-5 3xl:py-4'>
                        <Icon.TranslationLoading className='mx-auto h-[100px] w-[100px] xl:h-[120px] xl:w-[120px] 2xl:h-[140px] 2xl:w-[124px]' />
                        <p className='text-center text-[12px] font-medium xl:text-[14px] 2xl:text-base'>
                          Đang tải...
                        </p>
                      </div>
                    )}
                    {historyFilter === 2 && isAuthenticated && (
                      <Pagination
                        currentPage={pageTotal}
                        totalCount={totalCount.total}
                        pageSize={10}
                        onPageChange={setPageTotal}
                      />
                    )}
                    {historyFilter === 1 && isAuthenticated && (
                      <Pagination
                        currentPage={pageFavorite}
                        totalCount={totalCount.favorite}
                        pageSize={10}
                        onPageChange={setPageFavorite}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className='ml-5 w-full xl:ml-7 2xl:ml-10 3xl:ml-[60px]'>
                <div className='flex w-fit items-center rounded-[10px] border-[1px] border-[#E1E4F2] bg-[#FFFFFF] pr-3'>
                  <div className='w-fit rounded-[10px] border-[2px] border-[#E1E4F2] bg-white p-2 3xl:p-3'>
                    <img
                      src={CharacterIcon}
                      className='h-3 w-3 xl:h-4 xl:w-4 3xl:h-[18px] 3xl:w-[18px]'
                      alt='Character Icon'
                    />
                  </div>
                  <div className='ml-2 text-[14px] font-semibold text-[#1C45F9] xl:text-[16px] 3xl:text-[20px]'>
                    Chi tiết
                  </div>
                </div>
                <div className='mt-[23px] flex flex-col rounded-[20px] border-[1px] border-[#262664] bg-white 3xl:mt-[18px]'>
                  <div className='border-b-[1px] border-b-[#CCCCCC]'>
                    <h3 className='pl-3 pt-3 text-[14px] font-bold xl:text-[16px] 2xl:pl-4 3xl:pl-5 3xl:text-[20px]'>
                      Tiếng Việt
                    </h3>
                    <p className='mt-2 h-[80px] overflow-y-auto px-3 pb-3 text-[12px] lg:h-[120px] lg:text-[14px] xl:text-[14px] 2xl:px-4 3xl:px-5 3xl:text-[16px]'>
                      {historyFilter === 0
                        ? translatinHistory[activeHistory]?.textVN || ''
                        : savedTranslationHistory[activeHistory]?.src || ''}
                    </p>
                  </div>
                  <div>
                    <div className='flex items-center  justify-between px-3 pt-3 2xl:px-4 3xl:px-5'>
                      <h3 className='text-[14px] font-bold xl:text-[16px] 3xl:text-[20px]'>Bana</h3>
                      <div
                        onClick={() => {
                          navigator.clipboard.writeText(
                            historyFilter === 0
                              ? translatinHistory[activeHistory]?.textBana || ''
                              : savedTranslationHistory[activeHistory]?.tgt || ''
                          );
                          setCopiedSub(true);
                        }}
                        className='copy-anchor-sub cursor-pointer'
                        data-tooltip-content={copiedSub ? 'Đã copy' : 'Copy bản dịch'}
                      >
                        <Icon.CopyIcon
                          className='h-4 w-4 cursor-pointer xl:h-5 xl:w-5 3xl:h-6 3xl:w-6'
                          fill={copiedSub ? '#1C45F9' : '#5F5F90'}
                        />
                        <Tooltip anchorSelect='.copy-anchor-sub' />
                      </div>
                    </div>
                    <p className='mt-2 h-[80px] overflow-y-auto px-3 pb-3 text-[12px] lg:h-[120px] lg:text-[14px] xl:text-[14px] 2xl:px-4 3xl:px-5 3xl:text-[16px]'>
                      {historyFilter === 0
                        ? translatinHistory[activeHistory]?.textBana || ''
                        : savedTranslationHistory[activeHistory]?.tgt || ''}
                    </p>
                  </div>
                  <div className='flex items-center justify-between border-t-[1px] border-t-[#262664] px-3 py-2 3xl:px-5 3xl:py-3'>
                    <p className='text-[12px] lg:text-[14px] 3xl:text-base'>
                      Tạo lúc:{' '}
                      {historyFilter === 0
                        ? translatinHistory[activeHistory]?.createdAt || ''
                        : epochToDateString(savedTranslationHistory[activeHistory]?.createdAt) ||
                          ''}{' '}
                    </p>
                    <div className='relative inline-block text-left'>
                      <button className='flex items-center justify-center rounded-[8px] border-[1px] border-[#5F5F90] bg-white p-1 focus:border-[#1C45F9]'>
                        {voiceLoading.sub ? (
                          <div className='flex h-full w-[31px] items-center justify-center lg:w-[38px] 2xl:w-[42px] 3xl:w-[52px]'>
                            <div className='h-2 w-2 animate-spin rounded-full border-l-2 border-solid border-[#1C45F9]' />
                          </div>
                        ) : (
                          <div
                            className='flex items-center'
                            onClick={() =>
                              pronounceBana(
                                historyFilter === 0
                                  ? translatinHistory[activeHistory]?.textBana || ''
                                  : savedTranslationHistory[activeHistory]?.tgt || '',
                                true
                              )
                            }
                          >
                            <Icon.VoiceIcon
                              className='mr-1 h-[11px] w-[7px] lg:h-[14px] lg:w-[10px] 2xl:h-[16px] 3xl:h-[18px] 3xl:w-3'
                              fill='#262664'
                            />
                            <div className='w-5 text-[10px] text-[#262664] lg:w-6 lg:text-[12px] 2xl:w-7 2xl:text-[14px] 3xl:w-9 3xl:text-[16px]'>
                              {voiceGender.sub}
                            </div>
                          </div>
                        )}
                        <div
                          className='flex items-center'
                          onClick={() => setIsOpen({ ...isOpen, sub: !isOpen.sub })}
                        >
                          <div className='ml-2 h-[13px] w-[0.5px] bg-[#5F5F90] lg:h-[18px] 2xl:h-[22px] 3xl:h-[28px]' />
                          <Icon.ArrowDown className='ml-2 xl:h-2 xl:w-3' fill='#262664' />
                        </div>
                      </button>

                      {isOpen.sub && (
                        <div className='absolute right-0 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5'>
                          <div className='py-1'>
                            <div
                              onClick={() => {
                                setIsOpen({ ...isOpen, sub: !isOpen.sub });
                                setVoiceGender({ ...voiceGender, sub: 'Nam' });
                              }}
                              className='block px-2 py-1 text-[12px] hover:bg-gray-100 hover:text-gray-900'
                            >
                              Nam
                            </div>
                            <div
                              onClick={() => {
                                setIsOpen({ ...isOpen, sub: !isOpen.sub });
                                setVoiceGender({ ...voiceGender, sub: 'Nữ' });
                              }}
                              className='block px-2 py-1 text-[12px] hover:bg-gray-100 hover:text-gray-900'
                              role='menuitem'
                            >
                              Nữ
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default HomepageDesktop;
