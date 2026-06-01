import * as React from 'react';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { DetailsList, IColumn, SelectionMode, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { PrimaryButton, DefaultButton, ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link } from '@fluentui/react/lib/Link';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { ICatalogProduct, TENANT_OPTIONS } from '../../types/models';

type WizardStep = 'search' | 'review' | 'configure';
type SubView = 'main' | 'addedProducts';

const SEARCH_PAGE_SIZE = 10;
const REVIEW_PAGE_SIZE = 10;

const PRODUCT_TYPE_FILTER_OPTIONS: IDropdownOption[] = [
  { key: 'All', text: 'All' },
  { key: 'RI', text: 'Reserved Instances (RI)' },
  { key: 'ASP', text: 'Azure Savings Plan (ASP)' },
  { key: 'RI and ASP', text: 'RI and ASP' },
];
const PRODUCT_FAMILY_FILTER_OPTIONS: IDropdownOption[] = [
  { key: 'All', text: 'All' },
  { key: 'System Center Endpoint Protection', text: 'System Center Endpoint Protection' },
  { key: 'Azure Compute', text: 'Azure Compute' },
  { key: 'Azure Database', text: 'Azure Database' },
  { key: 'Azure Storage', text: 'Azure Storage' },
  { key: 'Azure Networking', text: 'Azure Networking' },
];
const REGION_FILTER_OPTIONS: IDropdownOption[] = [
  { key: 'All', text: 'All' },
  { key: 'US North', text: 'US North' },
  { key: 'US South', text: 'US South' },
  { key: 'US East', text: 'US East' },
  { key: 'US West', text: 'US West' },
  { key: 'US Central', text: 'US Central' },
  { key: 'EU West', text: 'EU West' },
  { key: 'EU North', text: 'EU North' },
  { key: 'Japan', text: 'Japan' },
  { key: 'India', text: 'India' },
  { key: 'Australia', text: 'Australia' },
];
const METER_FILTER_OPTIONS: IDropdownOption[] = [
  { key: 'All', text: 'All' },
  { key: 'vCPU', text: 'vCPU' },
  { key: 'GB', text: 'GB' },
  { key: 'RU', text: 'RU' },
];

const AMENDMENT_DROPDOWN_OPTIONS: IDropdownOption[] = [
  { key: 'M919', text: 'M919' },
  { key: 'M920', text: 'M920' },
  { key: 'M1174', text: 'M1174' },
  { key: 'M(000)', text: 'M(000)' },
  { key: 'M(111)', text: 'M(111)' },
];

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    stepperBar: {
      padding: '8px 0',
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
    },
    stepCircleActive: {
      width: 20, height: 20, borderRadius: '50%', backgroundColor: theme.palette.themePrimary,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    stepCircleComplete: {
      width: 20, height: 20, borderRadius: '50%', backgroundColor: '#107C10',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    stepCircleInactive: {
      width: 20, height: 20, borderRadius: '50%', backgroundColor: theme.palette.neutralLight,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    stepLabel: { fontSize: 13, fontWeight: 600 },
    stepLabelInactive: { fontSize: 13, color: theme.palette.neutralTertiary },
    chevron: { color: theme.palette.neutralTertiary, fontSize: 12, padding: '0 8px' },
    addedProductsBadge: { fontSize: 13, color: theme.palette.neutralSecondary, cursor: 'pointer' },
    emptyState: { padding: '80px 0', textAlign: 'center' as const },
    filterChip: {
      backgroundColor: theme.palette.neutralLighter, borderRadius: 4, padding: '4px 10px',
      display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer',
      border: `1px solid ${theme.palette.neutralLight}`,
      selectors: { ':hover': { backgroundColor: theme.palette.neutralLight } },
    },
    chipClose: { cursor: 'pointer', color: theme.palette.neutralSecondary, fontSize: 10 },
    partNumber: { fontWeight: 600, fontSize: 13 },
    productDesc: { fontSize: 12, color: theme.palette.neutralSecondary },
    paginationBar: {
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12,
      padding: '4px 0', borderTop: `1px solid ${theme.palette.neutralLight}`,
    },
    selectedPill: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      backgroundColor: theme.palette.neutralLighterAlt,
      border: `1px solid ${theme.palette.neutralTertiaryAlt}`,
      borderRadius: 2, padding: '4px 8px',
      fontSize: 12, color: theme.palette.neutralPrimary,
    },
    pillClose: {
      cursor: 'pointer', fontSize: 8, color: theme.palette.neutralSecondary,
      marginLeft: 2,
      selectors: { ':hover': { color: theme.palette.neutralPrimary } },
    },
    searchableDropdownTrigger: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      border: `1px solid ${theme.palette.neutralTertiary}`, borderRadius: 2,
      padding: '6px 8px', cursor: 'pointer', minHeight: 32,
      backgroundColor: theme.palette.white,
      selectors: { ':hover': { borderColor: theme.palette.neutralPrimary } },
    },
    searchableDropdownCallout: {
      width: 280, maxHeight: 360, display: 'flex', flexDirection: 'column' as const,
    },
    searchableDropdownList: {
      flex: 1, overflowY: 'auto' as const, padding: '4px 0',
    },
    searchableDropdownFooter: {
      borderTop: `1px solid ${theme.palette.neutralLight}`,
      padding: 8, display: 'flex', gap: 8, justifyContent: 'flex-end',
    },
  })
);

export interface IProductSearchPanelProps {
  isOpen: boolean;
  onDismiss: () => void;
  catalogProducts: ICatalogProduct[];
  onConfirmSelection: (selectedProducts: ICatalogProduct[], selectedTenants: string[]) => void;
}

// Searchable multi-select dropdown with Apply
const SearchableMultiSelect: React.FC<{
  label: string;
  required?: boolean;
  options: { key: string; text: string }[];
  selectedKeys: string[];
  onApply: (keys: string[]) => void;
  classNames: ReturnType<typeof getClassNames>;
  theme: ITheme;
}> = ({ label, required, options, selectedKeys, onApply, classNames, theme }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [tempSelected, setTempSelected] = React.useState<string[]>([]);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setTempSelected([...selectedKeys]);
    setSearch('');
    setIsOpen(true);
  };

  const filteredOptions = search.trim()
    ? options.filter((o) => o.text.toLowerCase().includes(search.toLowerCase()))
    : options;

  const toggleItem = (key: string) => {
    setTempSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <Stack tokens={{ childrenGap: 4 }}>
      <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>
        {label} {required && <span style={{ color: '#A80000' }}>*</span>}
      </Text>
      <div ref={triggerRef} className={classNames.searchableDropdownTrigger} onClick={handleOpen}>
        <Text styles={{ root: { fontSize: 13, color: selectedKeys.length > 0 ? theme.palette.neutralPrimary : theme.palette.neutralTertiary } }}>
          {selectedKeys.length > 0 ? `${selectedKeys.length} selected` : 'Select option(s)'}
        </Text>
        <Icon iconName="ChevronDown" styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }} />
      </div>
      {isOpen && triggerRef.current && (
        <Callout
          target={triggerRef.current}
          onDismiss={() => setIsOpen(false)}
          directionalHint={DirectionalHint.bottomLeftEdge}
          isBeakVisible={false}
          styles={{ root: { zIndex: 1000001 } }}
        >
          <div className={classNames.searchableDropdownCallout}>
            <div style={{ padding: 8 }}>
              <SearchBox
                placeholder="Search..."
                value={search}
                onChange={(_, val) => setSearch(val || '')}
                onClear={() => setSearch('')}
                styles={{ root: { width: '100%' } }}
              />
            </div>
            <div className={classNames.searchableDropdownList}>
              {filteredOptions.map((opt) => (
                <div key={opt.key} style={{ padding: '4px 12px' }}>
                  <Checkbox
                    label={opt.text}
                    checked={tempSelected.includes(opt.key)}
                    onChange={() => toggleItem(opt.key)}
                  />
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <Text styles={{ root: { padding: '8px 12px', fontSize: 12, color: theme.palette.neutralSecondary } }}>No results found</Text>
              )}
            </div>
            <div className={classNames.searchableDropdownFooter}>
              <DefaultButton text="Cancel" onClick={() => setIsOpen(false)} styles={{ root: { minWidth: 60, height: 28 } }} />
              <PrimaryButton text="Apply" onClick={() => { onApply(tempSelected); setIsOpen(false); }} styles={{ root: { minWidth: 60, height: 28 } }} />
            </div>
          </div>
        </Callout>
      )}
      {selectedKeys.length > 0 && (
        <Stack horizontal wrap tokens={{ childrenGap: 4 }} styles={{ root: { marginTop: 4 } }}>
          {selectedKeys.map((key) => {
            const label = options.find((o) => o.key === key)?.text || key;
            return (
              <span key={key} className={classNames.selectedPill}>
                {label}
                <Icon iconName="Cancel" className={classNames.pillClose} onClick={() => onApply(selectedKeys.filter((k) => k !== key))} />
              </span>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export const ProductSearchPanel: React.FC<IProductSearchPanelProps> = ({
  isOpen, onDismiss, catalogProducts, onConfirmSelection,
}) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [currentStep, setCurrentStep] = React.useState<WizardStep>('search');
  const [subView, setSubView] = React.useState<SubView>('main');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [hasSearched, setHasSearched] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [selectedTenants, setSelectedTenants] = React.useState<string[]>([]);
  const [searchInputValue, setSearchInputValue] = React.useState('');
  const [addedProductsSearch, setAddedProductsSearch] = React.useState('');
  const [productAmendmentMap, setProductAmendmentMap] = React.useState<Map<string, string>>(new Map());
  const [searchPage, setSearchPage] = React.useState(0);
  const [reviewPage, setReviewPage] = React.useState(0);

  // Filter pill states
  const [commitmentFilter, setCommitmentFilter] = React.useState('All');
  const [regionFilter, setRegionFilter] = React.useState('All');
  const [meterNameFilter, setMeterNameFilter] = React.useState('All');
  const [meterIdFilter, setMeterIdFilter] = React.useState('All');
  const [activeFilterPill, setActiveFilterPill] = React.useState<string | null>(null);

  // Refs for filter pill callouts
  const commitmentPillRef = React.useRef<HTMLSpanElement>(null);
  const regionPillRef = React.useRef<HTMLSpanElement>(null);
  const meterNamePillRef = React.useRef<HTMLSpanElement>(null);
  const meterIdPillRef = React.useRef<HTMLSpanElement>(null);

  // Search step filter refs
  const searchCommitmentPillRef = React.useRef<HTMLSpanElement>(null);
  const searchRegionPillRef = React.useRef<HTMLSpanElement>(null);
  const searchMeterNamePillRef = React.useRef<HTMLSpanElement>(null);
  const searchMeterIdPillRef = React.useRef<HTMLSpanElement>(null);

  // Search step filter states
  const [searchCommitmentFilter, setSearchCommitmentFilter] = React.useState('All');
  const [searchRegionFilter, setSearchRegionFilter] = React.useState('All');
  const [searchMeterNameFilter, setSearchMeterNameFilter] = React.useState('All');
  const [searchMeterIdFilter, setSearchMeterIdFilter] = React.useState('All');
  const [activeSearchFilterPill, setActiveSearchFilterPill] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep('search');
      setSubView('main');
      setSearchQuery('');
      setSearchInputValue('');
      setHasSearched(false);
      setSelectedIds(new Set());
      setSelectedTenants([]);
      setAddedProductsSearch('');
      setProductAmendmentMap(new Map());
      setSearchPage(0);
      setReviewPage(0);
      setCommitmentFilter('All');
      setRegionFilter('All');
      setMeterNameFilter('All');
      setMeterIdFilter('All');
      setActiveFilterPill(null);
      setSearchCommitmentFilter('All');
      setSearchRegionFilter('All');
      setSearchMeterNameFilter('All');
      setSearchMeterIdFilter('All');
      setActiveSearchFilterPill(null);
    }
  }, [isOpen]);

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    let results = catalogProducts.filter((p) => {
      return (
        p.productDetails.toLowerCase().includes(q) ||
        p.productFamily.toLowerCase().includes(q) ||
        p.partNumber.toLowerCase().includes(q) ||
        p.amendmentCode.toLowerCase().includes(q)
      );
    });

    // Apply search step filters
    if (searchRegionFilter !== 'All') {
      results = results.filter((p) =>
        p.productDetails.toLowerCase().includes(searchRegionFilter.toLowerCase())
      );
    }
    if (searchMeterNameFilter !== 'All') {
      results = results.filter((p) =>
        p.pricingUnit.toLowerCase().includes(searchMeterNameFilter.toLowerCase())
      );
    }

    return results;
  }, [catalogProducts, searchQuery, searchRegionFilter, searchMeterNameFilter]);

  // Paginated search results
  const searchTotalPages = Math.max(1, Math.ceil(filteredProducts.length / SEARCH_PAGE_SIZE));
  const pagedSearchResults = filteredProducts.slice(
    searchPage * SEARCH_PAGE_SIZE,
    (searchPage + 1) * SEARCH_PAGE_SIZE
  );

  React.useEffect(() => { setSearchPage(0); }, [searchQuery, searchRegionFilter, searchMeterNameFilter]);

  const selectedProducts = React.useMemo(
    () => catalogProducts.filter((p) => selectedIds.has(p.id)),
    [catalogProducts, selectedIds]
  );

  const filteredReviewProducts = React.useMemo(() => {
    let results = selectedProducts;
    if (regionFilter !== 'All') {
      results = results.filter((p) =>
        p.productDetails.toLowerCase().includes(regionFilter.toLowerCase())
      );
    }
    if (meterNameFilter !== 'All') {
      results = results.filter((p) =>
        p.pricingUnit.toLowerCase().includes(meterNameFilter.toLowerCase())
      );
    }
    return results;
  }, [selectedProducts, regionFilter, meterNameFilter]);

  // Review pagination
  const reviewTotalPages = Math.max(1, Math.ceil(filteredReviewProducts.length / REVIEW_PAGE_SIZE));
  const pagedReviewProducts = filteredReviewProducts.slice(
    reviewPage * REVIEW_PAGE_SIZE,
    (reviewPage + 1) * REVIEW_PAGE_SIZE
  );

  React.useEffect(() => { setReviewPage(0); }, [regionFilter, meterNameFilter, commitmentFilter]);

  const validSelected = selectedProducts.filter((p) => p.status === 'Valid');

  const toggleSelection = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = React.useCallback((items: ICatalogProduct[]) => {
    setSelectedIds((prev) => {
      const allSelected = items.every((p) => prev.has(p.id));
      const next = new Set(prev);
      if (allSelected) items.forEach((p) => next.delete(p.id));
      else items.forEach((p) => next.add(p.id));
      return next;
    });
  }, []);

  const handleSearch = React.useCallback((val: string) => {
    setSearchInputValue(val);
  }, []);

  const handleSearchSubmit = React.useCallback((val: string) => {
    if (val.trim()) {
      setSearchQuery(val);
      setHasSearched(true);
    }
  }, []);

  const removeFromAdded = React.useCallback((id: string) => {
    setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    setProductAmendmentMap((prev) => { const next = new Map(prev); next.delete(id); return next; });
  }, []);

  const handleSetAmendmentCode = React.useCallback((productId: string, code: string) => {
    setProductAmendmentMap((prev) => {
      const next = new Map(prev);
      next.set(productId, code);
      return next;
    });
  }, []);

  const isAmendmentSearch = React.useMemo(() => {
    return /^M\d{3,4}$/i.test(searchQuery.trim()) || /^M\(\d{3}\)$/i.test(searchQuery.trim());
  }, [searchQuery]);

  const getDefaultAmendmentForProduct = (product: ICatalogProduct): string => {
    if (isAmendmentSearch && searchQuery.trim()) return searchQuery.trim().toUpperCase();
    if (product.amendmentCode) return product.amendmentCode;
    return 'M919';
  };

  const makeSearchColumns = (items: ICatalogProduct[]): IColumn[] => {
    const allChecked = items.length > 0 && items.every((p) => selectedIds.has(p.id));
    return [
      {
        key: 'checkbox', name: '', minWidth: 32, maxWidth: 32,
        onRenderHeader: () => <Checkbox checked={allChecked} onChange={() => toggleSelectAll(items)} styles={{ root: { marginLeft: 4 } }} />,
        onRender: (item: ICatalogProduct) => <Checkbox checked={selectedIds.has(item.id)} onChange={() => toggleSelection(item.id)} />,
      },
      {
        key: 'productDetails', name: 'Product details', minWidth: 220, maxWidth: 320, isResizable: true,
        onRender: (item: ICatalogProduct) => (
          <Stack tokens={{ childrenGap: 2 }} styles={{ root: { whiteSpace: 'normal', wordBreak: 'break-word' } }}>
            <Text className={classNames.partNumber}>{item.partNumber}</Text>
            <Text className={classNames.productDesc}>{item.productDetails}</Text>
          </Stack>
        ),
      },
      { key: 'productFamily', name: 'Product family', fieldName: 'productFamily', minWidth: 120, maxWidth: 160, isResizable: true },
      {
        key: 'amendment', name: 'Amendment', minWidth: 120, maxWidth: 140, isResizable: true,
        onRender: (item: ICatalogProduct) => {
          const currentVal = productAmendmentMap.get(item.id) || getDefaultAmendmentForProduct(item);
          return (
            <Dropdown
              selectedKey={currentVal}
              options={AMENDMENT_DROPDOWN_OPTIONS}
              onChange={(_, opt) => {
                if (opt) handleSetAmendmentCode(item.id, opt.key as string);
              }}
              styles={{ root: { width: '100%' }, dropdown: { minWidth: 0 } }}
            />
          );
        },
      },
      { key: 'productList', name: 'Product list', fieldName: 'productList', minWidth: 120, maxWidth: 160, isResizable: true },
      { key: 'offering', name: 'Offering', fieldName: 'offering', minWidth: 70, maxWidth: 90 },
    ];
  };

  const reviewColumns: IColumn[] = [
    {
      key: 'productDetails', name: 'Product Details', minWidth: 200, maxWidth: 300, isResizable: true,
      onRender: (item: ICatalogProduct) => (
        <Stack tokens={{ childrenGap: 2 }}>
          <Text className={classNames.partNumber}>{item.partNumber}</Text>
          <Text className={classNames.productDesc}>{item.productDetails}</Text>
        </Stack>
      ),
    },
    { key: 'productFamily', name: 'Product family', fieldName: 'productFamily', minWidth: 130, maxWidth: 180, isResizable: true },
    { key: 'pricingUnit', name: 'Pricing Unit', fieldName: 'pricingUnit', minWidth: 80, maxWidth: 100 },
    { key: 'listPriceNetUSD', name: 'List Price (USD)', minWidth: 100, maxWidth: 130, onRender: (item: ICatalogProduct) => <Text>$ {item.listPriceNetUSD.toFixed(0)}</Text> },
  ];

  const addedProductsColumns: IColumn[] = [
    { key: 'productDetails', name: 'Product details', fieldName: 'productDetails', minWidth: 200, maxWidth: 280, isResizable: true },
    { key: 'partNumber', name: 'Part number', fieldName: 'partNumber', minWidth: 90, maxWidth: 110 },
    {
      key: 'amendmentCode', name: 'Amendment Code', minWidth: 110, maxWidth: 130,
      onRender: (item: ICatalogProduct) => (
        <Text>{productAmendmentMap.get(item.id) || item.amendmentCode}</Text>
      ),
    },
    { key: 'productFamily', name: 'Product family', fieldName: 'productFamily', minWidth: 130, maxWidth: 180 },
    { key: 'productList', name: 'Product list', fieldName: 'productList', minWidth: 130, maxWidth: 160 },
    { key: 'offering', name: 'Offering', fieldName: 'offering', minWidth: 80, maxWidth: 100 },
    {
      key: 'delete', name: '', minWidth: 32, maxWidth: 32,
      onRender: (item: ICatalogProduct) => (
        <IconButton iconProps={{ iconName: 'Delete' }} styles={{ root: { color: '#A80000' } }} onClick={() => removeFromAdded(item.id)} title="Remove" />
      ),
    },
  ];

  const renderStepper = () => {
    const steps: { key: WizardStep; label: string }[] = [
      { key: 'search', label: 'Search and add' },
      { key: 'review', label: 'Review prices' },
      { key: 'configure', label: 'Configure' },
    ];
    const stepOrder: WizardStep[] = ['search', 'review', 'configure'];
    const currentIdx = stepOrder.indexOf(currentStep);

    return (
      <Stack horizontal verticalAlign="center" className={classNames.stepperBar}>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }} grow>
          {steps.map((step, i) => {
            const isComplete = i < currentIdx;
            const isActive = i === currentIdx;
            const circleClass = isComplete ? classNames.stepCircleComplete : isActive ? classNames.stepCircleActive : classNames.stepCircleInactive;
            const labelClass = isActive || isComplete ? classNames.stepLabel : classNames.stepLabelInactive;
            return (
              <React.Fragment key={step.key}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                  <div className={circleClass}>
                    {isComplete ? <Icon iconName="CheckMark" styles={{ root: { color: 'white', fontSize: 10 } }} />
                      : <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: isActive ? 'white' : theme.palette.neutralTertiary }} />}
                  </div>
                  <Text className={labelClass} styles={{ root: { cursor: isComplete ? 'pointer' : 'default' } }}
                    onClick={() => { if (isComplete) { setCurrentStep(step.key); setSubView('main'); } }}>
                    {step.label}
                  </Text>
                </Stack>
                {i < steps.length - 1 && <Icon iconName="ChevronRight" className={classNames.chevron} />}
              </React.Fragment>
            );
          })}
        </Stack>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}
          onClick={() => { if (selectedIds.size > 0) setSubView('addedProducts'); }}
          styles={{ root: { cursor: selectedIds.size > 0 ? 'pointer' : 'default' } }}>
          <Icon iconName="CheckMark" styles={{ root: { color: theme.palette.neutralSecondary, fontSize: 12 } }} />
          <Text className={classNames.addedProductsBadge}>
            Added Products&nbsp;<strong>{currentStep === 'review' || currentStep === 'configure' ? validSelected.length : selectedIds.size}</strong>
          </Text>
        </Stack>
      </Stack>
    );
  };

  const renderAddedProductsView = () => {
    const filtered = addedProductsSearch.trim()
      ? selectedProducts.filter((p) => {
          const q = addedProductsSearch.toLowerCase();
          return p.productDetails.toLowerCase().includes(q) || p.partNumber.toLowerCase().includes(q) || p.productFamily.toLowerCase().includes(q);
        })
      : selectedProducts;

    return (
      <Stack tokens={{ childrenGap: 12 }} styles={{ root: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' } }}>
        <Link onClick={() => setSubView('main')} styles={{ root: { fontSize: 13, flexShrink: 0 } }}>
          <Icon iconName="ChevronLeft" styles={{ root: { fontSize: 10, marginRight: 4 } }} />Back
        </Link>
        <SearchBox
          placeholder="Search in added products by part number, product description, product family or group"
          value={addedProductsSearch}
          onChange={(_, val) => setAddedProductsSearch(val || '')}
          onClear={() => setAddedProductsSearch('')}
          styles={{ root: { width: '100%' } }}
        />
        <Stack horizontal verticalAlign="center">
          <ActionButton iconProps={{ iconName: 'Delete' }} text="Delete all" onClick={() => { setSelectedIds(new Set()); setProductAmendmentMap(new Map()); }} />
        </Stack>
        <Text styles={{ root: { fontSize: 13, flexShrink: 0 } }}>Showing <strong>{filtered.length}</strong> products</Text>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <DetailsList
            items={filtered}
            columns={addedProductsColumns}
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
            compact
            getKey={(item) => (item as ICatalogProduct).id}
          />
        </div>
      </Stack>
    );
  };

  const renderFilterPillCallout = (
    pillKey: string,
    targetRef: React.RefObject<HTMLSpanElement>,
    options: IDropdownOption[],
    currentValue: string,
    onChange: (val: string) => void,
    activeKey: string | null,
    setActiveKey: (val: string | null) => void,
  ) => {
    if (activeKey !== pillKey || !targetRef.current) return null;
    return (
      <Callout
        target={targetRef.current}
        onDismiss={() => setActiveKey(null)}
        directionalHint={DirectionalHint.bottomLeftEdge}
        isBeakVisible={false}
      >
        <Stack tokens={{ childrenGap: 4 }} styles={{ root: { padding: 8, width: 160 } }}>
          {options.map((opt) => (
            <ActionButton
              key={opt.key}
              text={opt.text}
              styles={{
                root: {
                  fontWeight: currentValue === opt.key ? 600 : 400,
                  backgroundColor: currentValue === opt.key ? theme.palette.themeLighter : 'transparent',
                },
              }}
              onClick={() => { onChange(opt.key as string); setActiveKey(null); }}
            />
          ))}
        </Stack>
      </Callout>
    );
  };

  const renderFilterBar = (
    prefix: string,
    commitRef: React.RefObject<HTMLSpanElement>,
    regionRef: React.RefObject<HTMLSpanElement>,
    meterNameRef: React.RefObject<HTMLSpanElement>,
    meterIdRef: React.RefObject<HTMLSpanElement>,
    cFilter: string, rFilter: string, mnFilter: string, miFilter: string,
    setCFilter: (v: string) => void, setRFilter: (v: string) => void,
    setMnFilter: (v: string) => void, setMiFilter: (v: string) => void,
    activeKey: string | null, setActiveKey: (v: string | null) => void,
  ) => (
    <>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <Icon iconName="Filter" styles={{ root: { color: theme.palette.neutralSecondary } }} />
        <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary } }}>Filter:</Text>
        <span ref={commitRef} className={classNames.filterChip} onClick={() => setActiveKey(`${prefix}_commitment`)}>
          Product Type: <strong>{cFilter}</strong>
          <Icon iconName="ChevronDown" className={classNames.chipClose} />
        </span>
        <span ref={regionRef} className={classNames.filterChip} onClick={() => setActiveKey(`${prefix}_region`)}>
          Product Family: <strong>{rFilter}</strong>
          <Icon iconName="ChevronDown" className={classNames.chipClose} />
        </span>
        <span ref={meterNameRef} className={classNames.filterChip} onClick={() => setActiveKey(`${prefix}_meterName`)}>
          Meter Name: <strong>{mnFilter}</strong>
          <Icon iconName="ChevronDown" className={classNames.chipClose} />
        </span>
        <span ref={meterIdRef} className={classNames.filterChip} onClick={() => setActiveKey(`${prefix}_meterId`)}>
          Meter ID: <strong>{miFilter}</strong>
          <Icon iconName="ChevronDown" className={classNames.chipClose} />
        </span>
      </Stack>
      {renderFilterPillCallout(`${prefix}_commitment`, commitRef, PRODUCT_TYPE_FILTER_OPTIONS, cFilter, setCFilter, activeKey, setActiveKey)}
      {renderFilterPillCallout(`${prefix}_region`, regionRef, PRODUCT_FAMILY_FILTER_OPTIONS, rFilter, setRFilter, activeKey, setActiveKey)}
      {renderFilterPillCallout(`${prefix}_meterName`, meterNameRef, METER_FILTER_OPTIONS, mnFilter, setMnFilter, activeKey, setActiveKey)}
      {renderFilterPillCallout(`${prefix}_meterId`, meterIdRef, METER_FILTER_OPTIONS, miFilter, setMiFilter, activeKey, setActiveKey)}
    </>
  );

  const renderSearchStep = () => (
    <Stack tokens={{ childrenGap: 8 }} styles={{ root: { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' } }}>
      <SearchBox
        placeholder="Search by amendment code, product name, or part number"
        value={searchInputValue}
        onChange={(_, val) => handleSearch(val || '')}
        onSearch={(val) => handleSearchSubmit(val || '')}
        onClear={() => { setSearchInputValue(''); setSearchQuery(''); setHasSearched(false); }}
        styles={{ root: { flexShrink: 0 } }}
      />

      {!hasSearched || !searchQuery.trim() ? (
        <Stack horizontalAlign="center" className={classNames.emptyState}>
          <Icon iconName="Search" styles={{ root: { fontSize: 64, color: theme.palette.neutralTertiary, marginBottom: 16 } }} />
          <Text variant="large" styles={{ root: { fontWeight: 600, marginBottom: 8 } }}>Search Products</Text>
          <Text styles={{ root: { color: theme.palette.neutralSecondary } }}>Search by part number, product description,</Text>
          <Text styles={{ root: { color: theme.palette.neutralSecondary } }}>product family, or business division</Text>
        </Stack>
      ) : (
        <Stack tokens={{ childrenGap: 8 }} styles={{ root: { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' } }}>
          {/* Filter bar on search step */}
          <div style={{ flexShrink: 0 }}>
            {renderFilterBar(
              'search',
              searchCommitmentPillRef, searchRegionPillRef, searchMeterNamePillRef, searchMeterIdPillRef,
              searchCommitmentFilter, searchRegionFilter, searchMeterNameFilter, searchMeterIdFilter,
              setSearchCommitmentFilter, setSearchRegionFilter, setSearchMeterNameFilter, setSearchMeterIdFilter,
              activeSearchFilterPill, setActiveSearchFilterPill,
            )}
          </div>

          <Text variant="small" styles={{ root: { color: theme.semanticColors.bodySubtext, flexShrink: 0 } }}>
            Showing {Math.min((searchPage + 1) * SEARCH_PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length} results
          </Text>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <DetailsList items={pagedSearchResults} columns={makeSearchColumns(pagedSearchResults)} selectionMode={SelectionMode.none} layoutMode={DetailsListLayoutMode.justified} compact getKey={(item) => (item as ICatalogProduct).id} />
          </div>
          {filteredProducts.length > SEARCH_PAGE_SIZE && (
            <div className={classNames.paginationBar} style={{ flexShrink: 0 }}>
              <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }}>
                Page {searchPage + 1} of {searchTotalPages}
              </Text>
              <Stack horizontal tokens={{ childrenGap: 4 }}>
                <DefaultButton text="Previous" disabled={searchPage === 0} onClick={() => setSearchPage((p) => p - 1)} styles={{ root: { minWidth: 70 } }} />
                <DefaultButton text="Next" disabled={searchPage >= searchTotalPages - 1} onClick={() => setSearchPage((p) => p + 1)} styles={{ root: { minWidth: 70 } }} />
              </Stack>
            </div>
          )}
        </Stack>
      )}
    </Stack>
  );

  const renderReviewStep = () => (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' } }}>
      <Link onClick={() => { setCurrentStep('search'); setSubView('main'); }} styles={{ root: { fontSize: 13, flexShrink: 0 } }}>
        <Icon iconName="ChevronLeft" styles={{ root: { fontSize: 10, marginRight: 4 } }} />Back
      </Link>
      <SearchBox placeholder="Search in review prices by part number, product description, product family or group" styles={{ root: { width: '100%', flexShrink: 0 } }} />

      {renderFilterBar(
        'review',
        commitmentPillRef, regionPillRef, meterNamePillRef, meterIdPillRef,
        commitmentFilter, regionFilter, meterNameFilter, meterIdFilter,
        setCommitmentFilter, setRegionFilter, setMeterNameFilter, setMeterIdFilter,
        activeFilterPill, setActiveFilterPill,
      )}

      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text styles={{ root: { fontSize: 13 } }}>Showing {filteredReviewProducts.length} items to configure</Text>
        <ActionButton iconProps={{ iconName: 'ColumnOptions' }} text="Columns" />
      </Stack>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <DetailsList
          items={pagedReviewProducts}
          columns={reviewColumns}
          selectionMode={SelectionMode.none}
          layoutMode={DetailsListLayoutMode.justified}
          compact
          getKey={(item) => (item as ICatalogProduct).id}
        />
      </div>

      {/* Review pagination */}
      {filteredReviewProducts.length > REVIEW_PAGE_SIZE && (
        <div className={classNames.paginationBar} style={{ flexShrink: 0 }}>
          <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }}>
            Page {reviewPage + 1} of {reviewTotalPages}
          </Text>
          <Stack horizontal tokens={{ childrenGap: 4 }}>
            <DefaultButton text="Previous" disabled={reviewPage === 0} onClick={() => setReviewPage((p) => p - 1)} styles={{ root: { minWidth: 70 } }} />
            <DefaultButton text="Next" disabled={reviewPage >= reviewTotalPages - 1} onClick={() => setReviewPage((p) => p + 1)} styles={{ root: { minWidth: 70 } }} />
          </Stack>
        </div>
      )}
    </Stack>
  );

  const renderConfigureStep = () => (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { flex: 1 } }}>
      <Link onClick={() => { setCurrentStep('review'); setSubView('main'); }} styles={{ root: { fontSize: 13 } }}>
        <Icon iconName="ChevronLeft" styles={{ root: { fontSize: 10, marginRight: 4 } }} />Back
      </Link>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <Text styles={{ root: { fontSize: 14 } }}><strong>{validSelected.length}</strong> product(s) selected</Text>
        <Icon iconName="Info" styles={{ root: { color: theme.palette.themePrimary, fontSize: 14 } }} />
      </Stack>
      <MessageBar messageBarType={MessageBarType.warning} isMultiline={false}>
        Please ensure that products are allocated to the tenants with the same Cloud scope. Difference in Cloud scope of tenant and allocated product will block CPS generation.
      </MessageBar>
      <Stack horizontal tokens={{ childrenGap: 24 }}>
        <Stack tokens={{ childrenGap: 4 }} styles={{ root: { width: 280 } }}>
          <SearchableMultiSelect
            label="Select Tenant(s)"
            required
            options={TENANT_OPTIONS}
            selectedKeys={selectedTenants}
            onApply={setSelectedTenants}
            classNames={classNames}
            theme={theme}
          />
        </Stack>
      </Stack>
    </Stack>
  );

  const handleConfirm = React.useCallback(() => {
    const toAdd = (validSelected.length > 0 ? validSelected : selectedProducts.filter(p => p.status === 'Valid'))
      .map((p) => {
        const mappedCode = productAmendmentMap.get(p.id);
        return mappedCode ? { ...p, amendmentCode: mappedCode } : p;
      });
    onConfirmSelection(toAdd, selectedTenants);
  }, [validSelected, selectedProducts, onConfirmSelection, productAmendmentMap, selectedTenants]);

  const onRenderFooterContent = React.useCallback(
    () => (
      <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { padding: '8px 0' } }}>
        {currentStep === 'search' && (
          <>
            <PrimaryButton text="Proceed to Review prices" disabled={selectedIds.size === 0} onClick={() => { setCurrentStep('review'); setSubView('main'); }} />
            <DefaultButton text="Cancel" onClick={onDismiss} />
          </>
        )}
        {currentStep === 'review' && (
          <>
            <PrimaryButton text="Proceed to Configure" onClick={() => { setCurrentStep('configure'); setSubView('main'); }} />
            <DefaultButton text="Cancel" onClick={onDismiss} />
          </>
        )}
        {currentStep === 'configure' && (
          <>
            <PrimaryButton text="Add products" disabled={selectedTenants.length === 0} onClick={handleConfirm} />
            <DefaultButton text="Cancel" onClick={onDismiss} />
          </>
        )}
      </Stack>
    ),
    [currentStep, selectedIds.size, selectedTenants.length, onDismiss, handleConfirm]
  );

  const renderMainContent = () => {
    if (subView === 'addedProducts') return renderAddedProductsView();
    if (currentStep === 'search') return renderSearchStep();
    if (currentStep === 'review') return renderReviewStep();
    return renderConfigureStep();
  };

  const panelHeader = subView === 'addedProducts' ? 'Added products' : 'Add RI/ASP Future Products';
  const showStepper = subView === 'main';

  return (
    <Panel
      isOpen={isOpen} onDismiss={onDismiss} type={PanelType.large}
      headerText={panelHeader}
      isFooterAtBottom onRenderFooterContent={subView === 'main' ? onRenderFooterContent : undefined}
      styles={{
        main: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
        },
        commands: { flexShrink: 0 },
        contentInner: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        },
        scrollableContent: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        },
        header: { flexShrink: 0 },
        content: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          padding: '0 24px',
        },
        footer: {
          flexShrink: 0,
          borderTop: `1px solid ${theme.palette.neutralLight}`,
          backgroundColor: theme.palette.white,
          padding: '0 24px',
          zIndex: 10,
        },
        footerInner: { flexShrink: 0 },
      }}
    >
      <Stack tokens={{ childrenGap: 0 }} styles={{ root: { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' } }}>
        {showStepper && renderStepper()}
        <Stack styles={{ root: { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden', paddingTop: 8 } }}>
          {renderMainContent()}
        </Stack>
      </Stack>
    </Panel>
  );
};
