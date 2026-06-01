import { ICatalogProduct, IAmendment, IGeneratedDocument, ISupportingDocument } from '../types/models';

export const sampleCatalogProducts: ICatalogProduct[] = [
  // AAA-10782: Fabric Capacity Reservation products (multiple for search results)
  { id: 'p1', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-001' },
  { id: 'p2', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-002' },
  { id: 'p3', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-003' },
  { id: 'p4', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-004' },
  { id: 'p5', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-005' },
  { id: 'p6', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-006' },
  { id: 'p7', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-007' },
  { id: 'p8', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-008' },
  { id: 'p9', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M1174', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-009' },
  { id: 'p10', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M1174', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-010' },
  // Additional search-only rows to fill 300 items illusion
  { id: 'p11', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-011' },
  { id: 'p12', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-012' },
  { id: 'p13', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-013' },
  { id: 'p14', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-014' },
  { id: 'p15', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M1174', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-015' },
  { id: 'p16', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M1174', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-016' },
  { id: 'p17', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-017' },
  { id: 'p18', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid', meterName: 'Fabric Capacity', meterId: 'FC-018' },
  { id: 'p19', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M919', offering: 'Enterprise', status: 'Invalid', invalidReason: 'Product is not eligible for the current enrollment type', meterName: 'Fabric Capacity', meterId: 'FC-019' },
  { id: 'p20', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'AAA-10782', amendmentCode: 'M920', offering: 'Enterprise', status: 'Invalid', invalidReason: 'Product region not supported for this agreement', meterName: 'Fabric Capacity', meterId: 'FC-020' },
  // ASP-11111: Azure Savings Plan products
  { id: 'asp1', productDetails: 'Azure Savings Plan, Compute, Savings Plan, 1 year', productFamily: 'Azure Compute', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'ASP-11111', amendmentCode: 'M(111)', offering: 'Enterprise', status: 'Valid', meterName: 'Savings Plan Compute', meterId: 'ASP-C1Y' },
  { id: 'asp2', productDetails: 'Azure Savings Plan, Compute, Savings Plan, 3 years', productFamily: 'Azure Compute', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'ASP-11111', amendmentCode: 'M(000)', offering: 'Enterprise', status: 'Valid', meterName: 'Savings Plan Compute', meterId: 'ASP-C3Y' },
  { id: 'asp3', productDetails: 'Azure Savings Plan, Database, Savings Plan, 1 year', productFamily: 'Azure Database', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'ASP-11111', amendmentCode: 'M(000)', offering: 'Enterprise', status: 'Valid', meterName: 'Savings Plan Database', meterId: 'ASP-D1Y' },
  { id: 'asp4', productDetails: 'Azure Savings Plan, Database, Savings Plan, 3 years', productFamily: 'Azure Database', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 200.00, partNumber: 'ASP-11111', amendmentCode: 'M(000)', offering: 'Enterprise', status: 'Valid', meterName: 'Savings Plan Database', meterId: 'ASP-D3Y' },
  // Azure App Service products (from Figma "Added products" list)
  { id: 'aas1', productDetails: 'Azure App Service Isolated Plan', productFamily: 'Azure Compute', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 350.00, partNumber: 'BBB-20100', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid', meterName: 'App Service', meterId: 'AAS-001' },
  { id: 'aas2', productDetails: 'Azure App Service Isolated Plan - Linux', productFamily: 'Azure Compute', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 320.00, partNumber: 'BBB-20101', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid', meterName: 'App Service', meterId: 'AAS-002' },
  { id: 'aas3', productDetails: 'Azure App Service Isolated v2 Plan', productFamily: 'Azure Compute', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 400.00, partNumber: 'BBB-20102', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid', meterName: 'App Service', meterId: 'AAS-003' },
  { id: 'aas4', productDetails: 'Azure App Service Premium v3 Plan - Linux', productFamily: 'Azure Compute', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 280.00, partNumber: 'BBB-20103', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid', meterName: 'App Service', meterId: 'AAS-004' },
];

export const sampleAmendments: IAmendment[] = [
  {
    id: 'amd1',
    code: 'M919',
    title: 'M919: Azure Reservations Discounting - F...',
    language: 'English',
    concessionId: '3275',
    empowermentLevel: 'Blue',
    modifiedBy: 'Anand Hinge',
    modifiedOn: '12 Sep 2022',
    isDigitised: true,
    status: 'Auto-added',
    linkedProducts: ['p1', 'p2', 'p3', 'p4', 'p11', 'p12', 'p17', 'p19'],
  },
  {
    id: 'amd2',
    code: 'M920',
    title: 'M920: Azure Reservations Discounting - F...',
    language: 'English',
    concessionId: '3275',
    empowermentLevel: 'Blue',
    modifiedBy: 'Anand Hinge',
    modifiedOn: '12 Sep 2022',
    isDigitised: true,
    status: 'Auto-added',
    linkedProducts: ['p5', 'p6', 'p7', 'p8', 'p13', 'p14', 'p18', 'p20'],
  },
  {
    id: 'amd3',
    code: 'M1174',
    title: 'M1174: Azure Reservations Discounting - F...',
    language: 'English',
    concessionId: '3275',
    empowermentLevel: 'Business Desk',
    modifiedBy: 'Anand Hinge',
    modifiedOn: '12 Sep 2022',
    isDigitised: true,
    status: 'Auto-added',
    linkedProducts: ['p9', 'p10', 'p15', 'p16'],
  },
];

export const sampleGeneratedDocuments: IGeneratedDocument[] = [
  { id: 'doc1', fileName: 'English CPS Gov1_Hansin Expressway Company_FinalCPS_20190702_en-US_CPS_...', type: 'CPS', language: 'English', generatedBy: 'Sangram Maharana', generatedOn: 'Nov 14, 2023 12:10 AM' },
];

export const sampleSupportingDocuments: ISupportingDocument[] = [
  { id: 'sdoc1', fileName: 'Business reports FY19.xlsx', uploadedBy: 'Sangram Maharana', uploadedOn: 'Nov 14, 2023 12:10 AM' },
];
