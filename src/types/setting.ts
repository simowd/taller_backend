import { parseNumber, parseString } from '../utils/parsers';

interface Setting {
  dark_light?: number;
  audio_feedback?: number;
  animations?: number;
  high_contrast?: number;
  font_size?: number;
  font_type?: string;
}

const updateSetting = (request: any) => {
  // eslint-disable-next-line prefer-const
  let data:Setting = <any>{};
  if (request.dark_light !== undefined  && request.dark_light !== null) {
    data.dark_light = parseNumber(request.dark_light, 'dark_light');
  }
  if (request.audio_feedback !== undefined && request.audio_feedback !== null) {
    data.audio_feedback = parseNumber(request.audio_feedback, 'audio_feedback');
  }
  if (request.animations !== undefined && request.animations !== null) {
    data.animations = parseNumber(request.animations, 'animations');
  }
  if (request.high_contrast !== undefined && request.high_contrast !== null) {
    data.high_contrast = parseNumber(request.high_contrast, 'high_contrast');
  }
  if (request.font_size !== undefined && request.font_size !== null) {
    data.font_size = parseNumber(request.font_size, 'font_size');
  }
  if (request.font_type) {
    data.font_type = parseString(request.font_type, 'font_type');
  }

  console.log(data);

  return data;
};

export { updateSetting, Setting };