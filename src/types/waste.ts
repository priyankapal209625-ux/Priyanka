export type WasteCategoryType =
  | 'Wet Waste'
  | 'Dry Waste'
  | 'Sanitary Waste'
  | 'Special Care Waste'
  | 'Unclear';

export interface IndianLocation {
  state: string;
  city: string;
}

export interface IndianCityGuidance {
  city: string;
  localBody: string;
  guidanceNote: string;
}

export interface IndianStateGuidance {
  state: string;
  spcbName: string;
  cities: IndianCityGuidance[];
}

export interface WasteAnalysisResult {
  itemName: string;
  material: string;
  category: WasteCategoryType;
  confidence: number;
  needsClarification: boolean;
  clarificationQuestion: string;
  uncertaintyNote: string;
  recommendedHandling: string;
  disposalSteps: string[];
  reuseAndUpcycleIdeas: string[];
  environmentalImpact: string;
  requiresSpecialSafetyHandling: boolean;
  authorizedChannelRequired: boolean;
  commonMistake: string;
  localVariationNote: string;
}

export interface ScanHistoryEntry {
  id: string;
  timestamp: string;
  source: 'photo' | 'text';
  queryLabel: string;
  thumbnailUrl?: string;
  locationLabel?: string;
  result: WasteAnalysisResult;
}

export interface CategoryGuideItem {
  id: 'wet-waste' | 'dry-waste' | 'sanitary-waste' | 'special-care-waste';
  streamNumber: string;
  title: string;
  categoryType: Exclude<WasteCategoryType, 'Unclear'>;
  handlingChannel: string;
  summary: string;
  whyItMatters: string;
  imageUrl?: string;
  imageAlt?: string;
  safetyNotice?: string;
  examples: string[];
  doRules: string[];
  dontRules: string[];
}

export interface MaterialRecyclingGuide {
  id: string;
  name: string;
  shortLabel: string;
  category: Exclude<WasteCategoryType, 'Unclear'>;
  channelLabel: string;
  keyFact: string;
  keyFactSource: string;
  overview: string;
  prepSteps: string[];
  reuseIdeas: string[];
  avoidList: string[];
}

export interface PlasticResinCode {
  code: number;
  abbr: string;
  name: string;
  commonItems: string;
  recyclability: 'Commonly Recycled' | 'Depends on Local Facility' | 'Rarely Recycled';
  tip: string;
}
