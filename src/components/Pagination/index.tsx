import { usePagination } from '../../hooks';
import Icon from '../Icon';

type Props = {
  totalCount: number;
  pageSize?: number;
  currentPage: number;
  onPageChange: (currentPage: number) => void;
};

const Pagination = ({ totalCount, pageSize = 10, currentPage, onPageChange }: Props) => {
  const pageRange = usePagination({ totalCount, pageSize: pageSize, siblingCount: 1, currentPage });
  if ((pageRange?.length || 0) <= 1) return null;

  return (
    <ul className='my-4 flex flex-row items-center justify-center lg:gap-x-4'>
      <li className='flex h-fit w-fit items-center'>
        <button
          className={`rounded-full p-2 ${currentPage === 1 ? '' : 'hover:bg-black/20'}`}
          disabled={currentPage === pageRange?.[0]}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Icon.ChevronIcon fill='#5B5B5B' className='h-4 w-auto -rotate-90 3xl:h-5' />
        </button>
      </li>

      {pageRange?.map((pageNumber, index) => {
        if (pageNumber === 'DOTS') {
          return (
            <li className='flex h-fit w-fit items-center' key={`pagination-${pageNumber}-${index}`}>
              <p className='w-5 text-[12px] 3xl:w-6 3xl:text-base'>...</p>
            </li>
          );
        }

        return (
          <li key={`pagination-${pageNumber}`} className='flex h-fit w-fit items-center'>
            <button
              className={`aspect-square rounded-full p-1 3xl:p-2 ${
                pageNumber === currentPage ? 'bg-[#1C45F9]/90' : 'hover:bg-black/20'
              }`}
              onClick={() => onPageChange(pageNumber as number)}
            >
              <p
                className={`w-5 text-[12px] 3xl:w-6 3xl:text-base ${
                  pageNumber === currentPage ? 'font-semibold text-white' : 'font-medium'
                }`}
              >
                {pageNumber}
              </p>
            </button>
          </li>
        );
      })}

      <li className='flex h-fit w-fit items-center'>
        <button
          className={`rounded-full p-1 ${
            currentPage === (pageRange?.[pageRange?.length - 1] as number)
              ? ''
              : 'hover:bg-black/20'
          }`}
          disabled={currentPage === (pageRange?.[pageRange?.length - 1] as number)}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <Icon.ChevronIcon fill='#5B5B5B' className='h-4 w-auto rotate-90 3xl:h-5' />
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
