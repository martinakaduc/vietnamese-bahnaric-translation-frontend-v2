import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

import Avatar from '../../assets/images/AvatarPic.png';
import CharacterIcon from '../../assets/images/characterWithCursor.png';
import Icon from '../../components/Icon';
import TranslateService from '../../service/translate.service';
import VoiceService from '../../service/voice.service';
import useBoundStore from '../../store';
import { SavedTranslation } from '../../types';
import FetchUtils from '../../utils/FetchUtils';
import BahnarSymbolModal from '../BahnarKeyboard';
import Pagination from '../Pagination';

type TranslationHistoryProps = {
  textVN: string;
  textBana: string;
  createdAt: string;
};

const HomepageMobile = () => {
  const [specicalCharacterToggle, setSpecicalCharacterToggle] = useState(false);
  const [historyFilter, setHistoryFilter] = useState(0);
  const [toggleStar, setToggleStar] = useState<boolean[]>([]);
  const [textVN, setTextVN] = useState('');
  const [textBana, setTextBana] = useState('');
  const [textCountVN, setTextCountVN] = useState(0);
  const [textCountBana, setTextCountBana] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [voiceGender, setVoiceGender] = useState('Nam');
  const [copied, setCopied] = useState(false);
  const [voiceLoading, isVoiceLoading] = useState(false);
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);
  const userprofile = useBoundStore((state) => state.user);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [translationHistory, setTranslationHistory] = useState<TranslationHistoryProps[]>([]);
  const [savedTranslationHistory, setSavedTranslationHistory] = useState<SavedTranslation[]>([]);
  const [details, setDetails] = useState({
    currentHistory: 0,
    isView: false,
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [isSaveAvailable, setIsSaveAvailable] = useState(false);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageFavorite, setPageFavorite] = useState(1);
  const [totalCount, setTotalCount] = useState({ total: 0, favorite: 0 });

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
      let xPosition = 52;
      if (window.innerWidth >= 640) {
        xPosition = 80;
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
    const currentHistory = translationHistory;
    currentHistory.unshift({
      textVN: prevTextVN,
      textBana: prevTextBana,
      createdAt: epochToDateString(),
    });
    if (currentHistory.length > 10) currentHistory.pop();
    setTranslationHistory(currentHistory);
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
          let xPosition = 52;
          if (window.innerWidth >= 640) {
            xPosition = 80;
          }
          setPopupPosition({ y: 36, x: xPosition });
        }
      });
  };

  const pronounceBana = () => {
    isVoiceLoading(true);
    const gender = voiceGender === 'Nam' ? 'male' : 'female';
    const text = details.isView
      ? historyFilter === 0
        ? translationHistory[details.currentHistory].textBana
        : savedTranslationHistory[details.currentHistory].tgt
      : textBana;
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
        isVoiceLoading(false);
      })
      .catch((err) => {
        console.log(JSON.stringify(err.response));
        isVoiceLoading(false);
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

  useEffect(() => {
    if (copied) setTimeout(() => setCopied(false), 1500);
  }, [copied]);

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
    <div className='md:hidden' onClick={() => handleBlur()}>
      <ToastContainer position='top-right' />
      <div className='h-[127px]'>
        <div className='relative flex h-full w-[70vw] items-center justify-between rounded-ee-[48px] bg-[#1C45F9] px-[50px] pb-[25px] pt-[60px] sm:pl-[80px]'>
          {details.isView ? (
            <Icon.ArrowLeft
              className='h-4 w-5'
              fill='white'
              onClick={() => setDetails({ ...details, isView: false })}
            />
          ) : (
            <img src={Avatar} alt='Avatar' className='h-[42px] w-[42px] rounded-full' />
          )}
          <h1 className='text-[16px] font-bold text-[#FFFFFF]'>Dịch băn bản</h1>
          <div className='absolute bottom-[19px] right-[-30px] rounded-[20px] border-[2px] border-[#E1E4F2] bg-white px-[19px] py-[18px]'>
            <img src={CharacterIcon} alt='Character Icon' />
          </div>
        </div>
      </div>
      <div className='mt-[-1px] flex flex-col'>
        <div className='h-[52px] w-[77px] bg-[#1C45F9]'>
          <div className='h-[53px] w-[78px] rounded-ss-[80px] bg-[#F2F5ff]' />
        </div>
        <audio ref={audioRef} className='hidden' controls autoPlay>
          <source src='' type='audio/mpeg' />
        </audio>
        <div className='mt-[-16px] flex items-center justify-between px-[52px] sm:px-[80px]'>
          <h2 className='text-[16px] font-bold text-[#262664]'>Tiếng Việt</h2>
          {textCountVN > 0 && !details.isView && (
            <Icon.CloseIcon
              onClick={() => {
                setTextVN('');
                setTextCountVN(0);
                setTextBana('');
                setTextCountBana(0);
              }}
              className='h-5 w-5 cursor-pointer'
              fill='#45457C'
            />
          )}
        </div>
        <div className='mt-4 px-[52px] sm:px-[80px]'>
          <textarea
            onChange={(e) => {
              setTextCountVN(e.target.value.length);
              setTextVN(e.target.value);
            }}
            value={
              details.isView
                ? historyFilter === 0
                  ? translationHistory[details.currentHistory]?.textVN || ''
                  : savedTranslationHistory[details.currentHistory]?.src || ''
                : textVN
            }
            spellCheck='false'
            maxLength={500}
            style={{ resize: 'none' }}
            disabled={details.isView}
            className='show-scrollbar h-[120px] w-[100%] overflow-y-auto bg-[#f2f5ff] text-[12px] text-[#262664] focus:border-none focus:shadow-none focus:outline-none'
          />
        </div>
        {!details.isView ? (
          <div className='z-[2] mt-5 flex items-center justify-between px-[52px] sm:px-[80px]'>
            <p className='text-[10px] text-[#262664]'>{textCountVN}</p>
            <button
              onClick={() => performTranslation()}
              className='rounded-[20px] bg-[#5876F9] px-3 py-1 text-white'
            >
              Dịch
            </button>
          </div>
        ) : (
          <div className='mt-5 h-8' />
        )}
        <div className='mt-[-32px] h-[52px] w-[77px] self-end bg-[#ffffff]'>
          <div className='h-[53px] w-[78px] rounded-ee-[80px] bg-[#F2F5ff]' />
        </div>
      </div>
      <div className='flex flex-col bg-white'>
        <div className='h-[52px] w-[77px] bg-[#f2f5ff]'>
          <div className='h-[53px] w-[78px] rounded-ss-[80px] bg-[#ffffff]' />
        </div>
        <div className='mt-[-16px] flex items-center justify-between px-[52px] sm:px-[80px]'>
          <h2 className='text-[16px] font-bold text-[#262664]'>Ba-na</h2>
          <div className='flex items-center space-x-3'>
            {!details.isView && (
              <button
                onClick={() => setSpecicalCharacterToggle(!specicalCharacterToggle)}
                className='flex items-center space-x-3 rounded-[8px] border-[1px] border-[#1C45F9] px-2 py-1'
              >
                <p className='text-[16px] font-bold text-[#1C45F9]'>Ĕ</p>
                <p className='min-w-[21px] text-[12px] font-medium text-[#262664]'>
                  <u>{specicalCharacterToggle ? 'ON' : 'OFF'}</u>
                </p>
              </button>
            )}
            <button
              className='copy-anchor cursor-pointer'
              onClick={() => {
                const copyText = details.isView
                  ? historyFilter === 0
                    ? translationHistory[details.currentHistory]?.textBana || ''
                    : savedTranslationHistory[details.currentHistory]?.tgt || ''
                  : textBana;
                navigator.clipboard.writeText(copyText);
                setCopied(true);
              }}
              data-tooltip-content={copied ? 'Đã copy' : 'Copy bản dịch'}
            >
              <Icon.CopyIcon className='h-5 w-6' fill={copied ? '#1C45F9' : '#5F5F90'} />
              <Tooltip anchorSelect='.copy-anchor' />
            </button>
          </div>
        </div>
        <div
          className='relative mt-4 h-[120px] px-[52px] sm:px-[80px]'
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className='flex h-[120px] items-center justify-center'>
              <div className='h-10 w-10 animate-spin rounded-full border-l-2 border-solid border-[#1C45F9]' />
            </div>
          ) : (
            <textarea
              onChange={(e) => {
                handlePopupPositionChange();
                setTextCountBana(e.target.value.length);
                setTextBana(e.target.value);
              }}
              value={
                details.isView
                  ? historyFilter === 0
                    ? translationHistory[details.currentHistory]?.textBana || ''
                    : savedTranslationHistory[details.currentHistory]?.tgt || ''
                  : textBana
              }
              spellCheck='false'
              maxLength={500}
              onFocus={handleFocus}
              ref={textareaRef}
              style={{ resize: 'none' }}
              disabled={details.isView}
              className='show-scrollbar max-h-[120px] w-[100%] overflow-y-auto bg-white text-[12px] text-[#262664] focus:border-none focus:shadow-none focus:outline-none'
            />
          )}
          {isPopupVisible && specicalCharacterToggle && textBana !== '' && (
            <BahnarSymbolModal
              inputCharacter={handleInputSymbol}
              leftposition={popupPosition.x}
              topposition={popupPosition.y}
            />
          )}
        </div>
        <div className='z-[2] mt-5 flex items-center justify-between px-[52px] sm:px-[80px]'>
          <p className='text-[10px] text-[#262664]'>
            {details.isView
              ? historyFilter !== 0
                ? savedTranslationHistory[details.currentHistory].tgt.length
                : translationHistory[details.currentHistory]?.textBana.length || 0
              : textCountBana}
          </p>
          <div className='relative flex space-x-2 text-left'>
            {isSaveAvailable && !saveLoading && !details.isView && isAuthenticated && (
              <button
                onClick={() => saveTranslation()}
                className='flex items-center rounded-[8px] bg-[#5876F9] px-2 py-1 text-white'
              >
                <Icon.DownloadIcon fill='white' className='h-4 w-4' />
                <p className='text-[12px] text-white'>Lưu</p>
              </button>
            )}
            {isSaveAvailable && saveLoading && (
              <button className='flex items-center rounded-[8px] bg-[#1C45F9] px-2 py-1 text-[12px] text-white hover:bg-[#1C45F9]/[.8]'>
                <div className='flex h-full w-[35.5px] items-center justify-center'>
                  <div className='h-4 w-4 animate-spin rounded-full border-l-2 border-solid border-white' />
                </div>
              </button>
            )}
            <button className='flex items-center justify-center rounded-[8px] border-[1px] border-[#5F5F90] bg-white px-2 py-2 text-[10px] text-[#262664] focus:border-[#1C45F9]'>
              {voiceLoading ? (
                <div className='flex h-full w-[47px] items-center justify-center'>
                  <div className='h-3 w-3 animate-spin rounded-full border-l-2 border-solid border-[#1C45F9]' />
                </div>
              ) : (
                <div className='flex items-center' onClick={() => pronounceBana()}>
                  <Icon.VoiceIcon className='mr-1 h-[11px] w-[7px]' fill='#262664' />
                  <div className='mr-2 w-5'>{voiceGender}</div>
                </div>
              )}
              <div className='flex items-center' onClick={toggleDropdown}>
                <div className='h-[13px] w-[0.5px] bg-[#5F5F90]' />
                <Icon.ArrowDown className='ml-2' fill='#262664' />
              </div>
            </button>

            {isOpen && (
              <div className='absolute right-0 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5'>
                <div className='py-1'>
                  <div
                    onClick={() => {
                      toggleDropdown();
                      setVoiceGender('Nam');
                    }}
                    className='block px-2 py-1 text-[12px] hover:bg-gray-100 hover:text-gray-900'
                  >
                    Nam
                  </div>
                  <div
                    onClick={() => {
                      toggleDropdown();
                      setVoiceGender('Nữ');
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
        {!details.isView && (
          <div className='mt-5 px-[52px] sm:px-[80px]'>
            <div className='h-[2px] bg-[#CCCCCC]' />
          </div>
        )}
        {!details.isView && (
          <div className={`flex ${isAuthenticated ? 'self-center' : 'px-[52px] sm:px-[80px]'}`}>
            <button
              className={`flex w-[100px] justify-center py-[12px] text-[12px] ${
                historyFilter === 0
                  ? 'border-b-[2px] border-b-[#1C45F9] text-[#1C45F9]'
                  : 'text-[#262664]'
              }`}
              onClick={() => {
                setHistoryFilter(0);
              }}
            >
              Gần đây
            </button>
            {isAuthenticated && (
              <button
                className={`flex w-[100px] justify-center py-[12px] text-[12px] ${
                  historyFilter === 1
                    ? 'border-b-[2px] border-b-[#1C45F9] text-[#1C45F9]'
                    : 'text-[#262664]'
                }`}
                onClick={() => {
                  setHistoryFilter(1);
                  fetchTranslationHistory(1);
                }}
              >
                Yêu thích
              </button>
            )}
            {isAuthenticated && (
              <button
                className={`flex w-[100px] justify-center py-[12px] text-[12px] ${
                  historyFilter === 2
                    ? 'border-b-[2px] border-b-[#1C45F9] text-[#1C45F9]'
                    : 'text-[#262664]'
                }`}
                onClick={() => {
                  setHistoryFilter(2);
                  fetchTranslationHistory(2);
                }}
              >
                Đã lưu
              </button>
            )}
          </div>
        )}
        {!details.isView && (
          <div className='px-[52px] sm:px-[80px]'>
            <div className='h-[2px] w-full bg-[#F9F9F9]' />
          </div>
        )}
        {!details.isView && (
          <div className='flex flex-col px-[52px] sm:px-[80px]'>
            {!translationLoading &&
              historyFilter === 0 &&
              translationHistory.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between py-3'
                  onClick={() => {
                    setDetails({ currentHistory: index, isView: true });
                  }}
                >
                  <div className='flex w-full flex-col space-y-[10px] text-[12px] text-[#262664]'>
                    <p className='max-h-[36px] overflow-hidden overflow-ellipsis'>{item.textVN}</p>
                    <p className='max-h-[36px] overflow-hidden overflow-ellipsis text-[#BDBCCC]'>
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
                  className='flex items-center justify-between py-3'
                  onClick={() => {
                    setDetails({ currentHistory: index, isView: true });
                  }}
                >
                  <div className='flex w-[77%] flex-col space-y-[10px] text-[12px] text-[#262664]'>
                    <p className='max-h-[36px] overflow-hidden overflow-ellipsis'>{item.src}</p>
                    <p className='max-h-[36px] overflow-hidden overflow-ellipsis text-[#BDBCCC]'>
                      {item.tgt}
                    </p>
                  </div>
                  {isAuthenticated && (
                    <Icon.StarIcon
                      fill={toggleStar[index] ? '#FCD612' : 'transparent'}
                      stroke={!toggleStar[index] ? '#262664' : 'none'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar[index] = !toggleStar[index];
                        setToggleStar([...toggleStar]);
                        markAsFavorite(item._id, item.isFavorite ? !item.isFavorite : true);
                      }}
                      className='cursor-pointer'
                    />
                  )}
                </div>
              ))}
            {((translationHistory.length === 0 && historyFilter === 0) ||
              (savedTranslationHistory.length === 0 && historyFilter !== 0)) &&
              !translationLoading && (
                <div className='flex flex-col items-center space-y-5 px-[52px] py-5 sm:px-[80px]'>
                  <Icon.EmptyIcon className='mx-auto h-[100px] w-[100px]' />
                  <p className='text-center text-[12px] font-medium'>Hiện chưa có bản dịch nào</p>
                </div>
              )}
            {translationLoading && (
              <div className='flex flex-col items-center space-y-5 px-[52px] py-5 sm:px-[80px]'>
                <Icon.TranslationLoading className='mx-auto h-[100px] w-[100px]' />
                <p className='text-center text-[12px] font-medium'>Đang tải...</p>
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
        )}
        {details.isView && (
          <div className='my-5 w-full px-[52px] sm:px-[80px]'>
            <div className='flex justify-between rounded-[8px] border-[1px] border-[#BDBCCC] px-4 py-2'>
              <p className='text-[10px]'>Tạo lúc</p>
              <p className='text-[10px]'>
                {historyFilter === 0
                  ? translationHistory[details.currentHistory]?.createdAt || ''
                  : epochToDateString(savedTranslationHistory[details.currentHistory]?.createdAt) ||
                    ''}
              </p>
            </div>
          </div>
        )}
        <div className='h-[80px] bg-white' />
      </div>
    </div>
  );
};
export default HomepageMobile;
