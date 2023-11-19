import axios from 'axios';

import { VOICE_API_KEY, VOICE_API_URL, BAHNAR_API_URL } from '../config';

type VNVoiceResult = {
  error: number;
  async: string;
  request_id: string;
  message: string;
};

type BahnarResults = {
  payload: string;
}; // stringified JSON with the following structure
// {
//   "urls": ["audio"],
// }

const VoiceService = {
  getVNVoice: async (text: string) => {
    return axios.post<VNVoiceResult>(`${VOICE_API_URL}hmi/tts/v5`, text, {
      headers: {
        api_key: VOICE_API_KEY,
      },
    });
  },

  getBahnarVoice: async (text: string, gender: string, region: string) => {
    return axios.post<BahnarResults>(`${BAHNAR_API_URL}translateBahnar/voice`, {
      text,
      gender,
      region,
    });
  },
};

export default VoiceService;
