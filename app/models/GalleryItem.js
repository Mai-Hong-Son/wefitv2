/**
 * @providesModule WeFit.Models.GalleryItem
 */

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { STRING } = COMMON_SCHEMAS;

const IMAGE = 'image';
const VIDEO = 'video';

/* eslint-disable dot-notation, newline-per-chained-call */

export const galleryTypes = { IMAGE, VIDEO };

export default class GalleryItem extends BaseModel {
  static dataValidator() {
    return {
      link: STRING.required(),
      thumbnail: STRING,
      type: STRING.allow([IMAGE, VIDEO]).required(),
    };
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
