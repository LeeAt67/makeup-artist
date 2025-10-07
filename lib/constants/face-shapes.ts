/**
 * 脸型类型
 */
export type FaceShape =
  | "round"
  | "square"
  | "oval"
  | "long"
  | "heart"
  | "diamond";

/**
 * 脸型识别结果
 */
export interface FaceScanResult {
  id: string;
  user_id: string;
  image_url: string;
  face_shape: FaceShape;
  confidence: number;
  is_manually_adjusted: boolean;
  created_at: string;
}

/**
 * 脸型中文名称映射
 */
export const faceShapeNames: Record<FaceShape, string> = {
  round: "圆形脸",
  square: "方形脸",
  oval: "鹅蛋脸",
  long: "长形脸",
  heart: "心形脸",
  diamond: "菱形脸",
};

/**
 * 脸型特征描述
 */
export const faceShapeDescriptions: Record<FaceShape, string> = {
  round: "面部线条圆润柔和，脸颊丰满，下颌线柔和",
  square: "额头、颧骨、下颌宽度相近，轮廓分明",
  oval: "脸型比例均衡，线条流畅，是最理想的脸型",
  long: "脸部长度明显大于宽度，额头较高",
  heart: "额头宽、下巴尖，呈倒三角形",
  diamond: "额头和下巴较窄，颧骨较宽",
};

/**
 * 脸型妆容建议
 */
export const faceShapeTips: Record<FaceShape, string[]> = {
  round: [
    "使用阴影粉修容，增加脸部立体感",
    "腮红斜向上打，拉长脸型",
    "眉毛可以画得稍微有棱角",
    "避免过于圆润的妆容",
  ],
  square: [
    "柔化下颌线条，使用修容粉",
    "眉形宜柔和，避免过于硬朗",
    "腮红横向打，柔化脸部线条",
    "唇妆可以画得圆润饱满",
  ],
  oval: [
    "基本适合所有妆容风格",
    "可以尝试各种眉形和腮红位置",
    "重点突出五官特色",
    "保持妆容平衡即可",
  ],
  long: [
    "横向修容，缩短脸型",
    "腮红横向打，增加面部宽度",
    "眉毛可以画得平直一些",
    "避免过长的眼线",
  ],
  heart: [
    "额头部分适当使用阴影",
    "下巴可以打高光增加丰盈感",
    "腮红斜向下打,柔化脸部线条",
    "眉形宜柔和自然",
  ],
  diamond: [
    "柔化颧骨，使用修容粉",
    "额头和下巴可打高光",
    "腮红位置略靠下",
    "眉形自然，不宜过细",
  ],
};
