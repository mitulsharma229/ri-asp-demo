export interface ICatalogProduct {
  id: string;
  productDetails: string;
  productFamily: string;
  productList: string;
  pricingUnit: string;
  priceLevel: string;
  listPriceNetUSD: number;
  partNumber: string;
  amendmentCode: string;
  offering: string;
  status: 'Valid' | 'Invalid';
  invalidReason?: string;
  meterName?: string;
  meterId?: string;
}

export interface IAddedProduct {
  id: string;
  productDetails: string;
  productFamily: string;
  amendmentCode: string;
  regions: string[];
  commitment: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  priceNetUSD: number;
  basePriceNetUSD: number;
  partNumber: string;
  offering: string;
  regionApplicable: boolean;
  groupName: string;
  tenants: string[];
}

export interface IAmendment {
  id: string;
  code: string;
  title: string;
  language: string;
  concessionId: string;
  empowermentLevel: string;
  modifiedBy: string;
  modifiedOn: string;
  isDigitised: boolean;
  status: 'Auto-added' | 'Manual';
  linkedProducts: string[];
}

export interface IGeneratedDocument {
  id: string;
  fileName: string;
  type: 'CPS' | 'Amendment';
  language: string;
  generatedBy: string;
  generatedOn: string;
}

export interface ISupportingDocument {
  id: string;
  fileName: string;
  uploadedBy: string;
  uploadedOn: string;
}

export type FlowStep = 'products' | 'amendments' | 'errorsWarnings' | 'generate' | 'documents';

export type PivotTab = 'futureProducts' | 'optionalFutureProducts' | 'riaspFutureProducts';

export interface IRegionGroup {
  key: string;
  text: string;
  children: { key: string; text: string }[];
}

export const REGION_GROUPS: IRegionGroup[] = [
  {
    key: 'us', text: 'United States',
    children: [
      { key: 'US North', text: 'US North' },
      { key: 'US South', text: 'US South' },
      { key: 'US East', text: 'US East' },
      { key: 'US West', text: 'US West' },
      { key: 'US Central', text: 'US Central' },
    ],
  },
  {
    key: 'eu', text: 'Europe',
    children: [
      { key: 'EU West', text: 'EU West' },
      { key: 'EU North', text: 'EU North' },
      { key: 'UK South', text: 'UK South' },
      { key: 'Germany West Central', text: 'Germany West Central' },
      { key: 'France Central', text: 'France Central' },
    ],
  },
  {
    key: 'apac', text: 'Asia Pacific',
    children: [
      { key: 'Japan', text: 'Japan' },
      { key: 'China', text: 'China' },
      { key: 'India', text: 'India' },
      { key: 'Singapore', text: 'Singapore' },
      { key: 'Australia', text: 'Australia' },
    ],
  },
  {
    key: 'other', text: 'Other',
    children: [
      { key: 'Brazil', text: 'Brazil' },
      { key: 'Canada', text: 'Canada' },
      { key: 'South Africa', text: 'South Africa' },
      { key: 'UAE', text: 'UAE' },
    ],
  },
];

export const REGION_OPTIONS = [
  { key: '', text: 'Select' },
  ...REGION_GROUPS.flatMap((g) => g.children),
];

export const COMMITMENT_OPTIONS = [
  { key: '', text: 'Select' },
  { key: '1 Year', text: '1 Year' },
  { key: '3 Years', text: '3 Years' },
];

export const EMPOWERMENT_OPTIONS = [
  { key: 'Blue', text: 'Blue' },
  { key: 'Green', text: 'Green' },
  { key: 'Yellow', text: 'Yellow' },
  { key: 'Red', text: 'Red' },
  { key: 'Business Desk', text: 'Business Desk' },
];

export const PROFILE_OPTIONS = [
  { key: 'enterprise', text: 'Enterprise' },
  { key: 'government', text: 'Government' },
  { key: 'academic', text: 'Academic' },
  { key: 'isv', text: 'ISV' },
  { key: 'non-profit', text: 'Non-Profit' },
  { key: 'csp', text: 'CSP' },
  { key: 'healthcare', text: 'Healthcare' },
  { key: 'education', text: 'Education' },
];

export const TENANT_OPTIONS = [
  { key: 'tenant-a', text: 'Tenant A' },
  { key: 'tenant-b', text: 'Tenant B' },
  { key: 'tenant-c', text: 'Tenant C' },
  { key: 'tenant-d', text: 'Tenant D' },
  { key: 'tenant-e', text: 'Tenant E' },
  { key: 'tenant-f', text: 'Tenant F' },
];

export const START_DATE_OPTIONS = [
  { key: 'at-order-acceptance', text: 'At order acceptance' },
  { key: 'on-specific-date', text: 'On specific date' },
];

export const END_DATE_OPTIONS = [
  { key: 'duration', text: 'Duration' },
  { key: 'on-specific-date', text: 'On specific date' },
];

export const DURATION_OPTIONS = [
  { key: '3-months', text: '3 months' },
  { key: '6-months', text: '6 months' },
  { key: '9-months', text: '9 months' },
  { key: '10-months', text: '10 months' },
  { key: '11-months', text: '11 months' },
  { key: '1-year', text: '1 year' },
  { key: '18-months', text: '18 months' },
  { key: '2-years', text: '2 years' },
  { key: '3-years', text: '3 years' },
  { key: '5-years', text: '5 years' },
];

export const AMENDMENT_CODE_OPTIONS = [
  { key: 'M(000)', text: 'M(000)' },
  { key: 'M(111)', text: 'M(111)' },
  { key: 'M919', text: 'M919' },
  { key: 'M920', text: 'M920' },
  { key: 'M1174', text: 'M1174' },
];
