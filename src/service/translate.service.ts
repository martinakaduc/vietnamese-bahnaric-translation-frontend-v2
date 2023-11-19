import { BAHNAR_API_URL } from '../config';
import { CountTranslation, ResponseData, SavedTranslation, Translate } from '../types';
import { axios } from '../utils/custom-axios';

const translate = (text: string) => {
  return axios.post<Translate>(`${BAHNAR_API_URL}translateBahnar`, { text });
};

const save = (src: string, tgt: string) => {
  return axios.post<Translate>(`${BAHNAR_API_URL}translations`, { src, tgt });
};

const findAll = (option: {
  limit: number;
  sortBy?: keyof Translate;
  order?: 'asc' | 'desc';
  offset: number;
  isFavorite?: boolean;
}) => {
  return axios.get<ResponseData<SavedTranslation[]>>(
    `${BAHNAR_API_URL}translations?limit=${option.limit}&offset=${option.offset}&${
      option.isFavorite !== undefined && 'isFavorite=' + option.isFavorite
    }&${option.sortBy ? 'sortBy=' + option.sortBy : ''}&${
      option.order ? 'order=' + option.order : ''
    }`,
    {}
  );
};

const countAll = () => {
  return axios.post<ResponseData<CountTranslation>>(`${BAHNAR_API_URL}translations/total`, {});
};

const markFavorite = (id: string, isFavorite: boolean) => {
  return axios.patch<ResponseData<Translate>>(`${BAHNAR_API_URL}translations/${id}/favorite`, {
    isFavorite,
  });
};

const TranslateService = {
  translate,
  save,
  findAll,
  markFavorite,
  countAll,

  // findById: async (id: string) =>
  //   await client.get<ResponseData<Translate>>(`translations/${id}`),

  // markAsDeleted: async (id: string) =>
  //   await client.delete<ResponseData<Translate>>(`translations/${id}`),
};

export default TranslateService;
