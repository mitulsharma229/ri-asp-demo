import * as React from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  CheckboxVisibility,
  DetailsListLayoutMode,
  IGroup,
  CollapseAllVisibility,
} from '@fluentui/react/lib/DetailsList';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { PrimaryButton, DefaultButton, ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { Dropdown, IDropdownOption, DropdownMenuItemType } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { Calendar } from '@fluentui/react/lib/Calendar';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { Icon } from '@fluentui/react/lib/Icon';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { IAddedProduct, ISku, REGION_GROUPS, COMMITMENT_OPTIONS, TENANT_OPTIONS } from '../../types/models';
import { Link } from '@fluentui/react/lib/Link';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';

type GridMode = 'default' | 'selected' | 'editing';

const PAGE_SIZE = 15;

const START_DATE_OPTIONS: IDropdownOption[] = [
  { key: 'At order acceptance', text: 'At order acceptance' },
  { key: 'divider', text: '-', itemType: DropdownMenuItemType.Divider },
  { key: 'custom', text: 'On specific date' },
];

const DURATION_KEYS = new Set([
  '3 months', '6 months', '9 months', '10 months', '11 months',
  '1 year', '18 months', '2 years', '3 years', '5 years',
]);

const computeEndDateFromDuration = (startDateStr: string, duration: string): string => {
  const start = startDateStr === 'At order acceptance' ? new Date() : new Date(startDateStr);
  if (isNaN(start.getTime())) return duration;
  const end = new Date(start);
  switch (duration) {
    case '3 months': end.setMonth(end.getMonth() + 3); break;
    case '6 months': end.setMonth(end.getMonth() + 6); break;
    case '9 months': end.setMonth(end.getMonth() + 9); break;
    case '10 months': end.setMonth(end.getMonth() + 10); break;
    case '11 months': end.setMonth(end.getMonth() + 11); break;
    case '1 year': end.setFullYear(end.getFullYear() + 1); break;
    case '18 months': end.setMonth(end.getMonth() + 18); break;
    case '2 years': end.setFullYear(end.getFullYear() + 2); break;
    case '3 years': end.setFullYear(end.getFullYear() + 3); break;
    case '5 years': end.setFullYear(end.getFullYear() + 5); break;
    default: return duration;
  }
  return end.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const ALL_DURATION_OPTIONS: { key: string; text: string }[] = [
  { key: '3 months', text: '3 months' },
  { key: '6 months', text: '6 months' },
  { key: '9 months', text: '9 months' },
  { key: '10 months', text: '10 months' },
  { key: '11 months', text: '11 months' },
  { key: '1 year', text: '1 year' },
  { key: '18 months', text: '18 months' },
  { key: '2 years', text: '2 years' },
  { key: '3 years', text: '3 years' },
  { key: '5 years', text: '5 years' },
];

const parseDurationMonths = (key: string): number => {
  switch (key) {
    case '3 months': return 3;
    case '6 months': return 6;
    case '9 months': return 9;
    case '10 months': return 10;
    case '11 months': return 11;
    case '1 year': return 12;
    case '18 months': return 18;
    case '2 years': return 24;
    case '3 years': return 36;
    case '5 years': return 60;
    default: return 999;
  }
};


const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      padding: '0 16px',
      flexShrink: 0,
    },
    toolbar: {
      padding: '4px 0',
    },
    gridAndDetailsWrapper: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden' as const,
    },
    gridArea: {
      flex: 1,
      overflowY: 'hidden' as const,
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    tableWrapper: {
      flex: 1,
      overflowY: 'auto' as const,
      position: 'relative' as const,
    },
    paginationBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 12,
      padding: '8px 16px',
      borderTop: `1px solid ${theme.palette.neutralLight}`,
      backgroundColor: theme.palette.white,
      flexShrink: 0,
    },
    detailsPanel: {
      borderLeft: `1px solid ${theme.palette.neutralLight}`,
      width: 380,
      flexShrink: 0,
      backgroundColor: theme.palette.white,
      overflowY: 'auto' as const,
      padding: 0,
    },
    detailsPanelHeader: {
      padding: '20px 24px 0',
    },
    detailsPanelBody: {
      padding: '0 24px 24px',
    },
    detailsSectionHeader: {
      fontWeight: 600,
      fontSize: 14,
      padding: '16px 0 8px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      color: theme.palette.neutralPrimary,
    },
    detailsFieldGroup: {
      padding: '8px 0',
    },
    detailsFieldLabel: {
      fontWeight: 400,
      fontSize: 12,
      color: theme.palette.neutralSecondary,
      marginBottom: 2,
    },
    detailsFieldValue: {
      fontWeight: 600,
      fontSize: 13,
      color: theme.palette.neutralPrimary,
    },
    emptyDetails: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 24,
      textAlign: 'center' as const,
      color: theme.palette.neutralSecondary,
    },
    summaryTab: {
      fontWeight: 600,
      fontSize: 13,
      borderBottom: `2px solid ${theme.palette.themePrimary}`,
      paddingBottom: 8,
      marginTop: 12,
    },
    filterChip: {
      backgroundColor: theme.palette.neutralLighter,
      borderRadius: 4,
      padding: '4px 10px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      cursor: 'pointer',
      border: `1px solid ${theme.palette.neutralLight}`,
      selectors: { ':hover': { backgroundColor: theme.palette.neutralLight } },
    },
    rowErrorBar: {
      backgroundColor: '#FFF4CE',
      borderLeft: '3px solid #FFB900',
      padding: '4px 12px',
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    rowErrorBarCritical: {
      backgroundColor: '#FDE7E9',
      borderLeft: '3px solid #A80000',
      padding: '4px 12px',
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
  })
);

// Collapsible grouped multi-select for regions
const RegionMultiSelect: React.FC<{
  selectedKeys: string[];
  onChange: (keys: string[]) => void;
  placeholder?: string;
}> = ({ selectedKeys, onChange, placeholder = 'Select region(s)' }) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set(REGION_GROUPS.map(g => g.key)));
  const [tempSelected, setTempSelected] = React.useState<string[]>([]);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setTempSelected([...selectedKeys]);
    setIsOpen(true);
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  };

  const toggleItem = (key: string) => {
    setTempSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleGroupAll = (group: typeof REGION_GROUPS[0]) => {
    const allKeys = group.children.map((c) => c.key);
    const allSelected = allKeys.every((k) => tempSelected.includes(k));
    if (allSelected) {
      setTempSelected((prev) => prev.filter((k) => !allKeys.includes(k)));
    } else {
      setTempSelected((prev) => [...new Set([...prev, ...allKeys])]);
    }
  };

  const displayText = selectedKeys.length > 0
    ? selectedKeys.length === 1
      ? REGION_GROUPS.flatMap((g) => g.children).find((c) => c.key === selectedKeys[0])?.text || selectedKeys[0]
      : `${selectedKeys.length} regions selected`
    : placeholder;

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleOpen}
        className="ms-Dropdown"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: `1px solid ${theme.palette.neutralSecondaryAlt}`, borderRadius: 2,
          padding: '0 28px 0 8px', cursor: 'pointer', height: 32, boxSizing: 'border-box', width: '100%',
          backgroundColor: theme.palette.white, position: 'relative',
        }}
      >
        <span style={{ fontSize: 14, color: selectedKeys.length > 0 ? theme.palette.neutralPrimary : theme.palette.neutralSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayText}
        </span>
        <Icon iconName="ChevronDown" styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary, position: 'absolute', right: 8, top: 9 } }} />
      </div>
      {isOpen && triggerRef.current && (
        <Callout
          target={triggerRef.current}
          onDismiss={() => setIsOpen(false)}
          directionalHint={DirectionalHint.bottomLeftEdge}
          isBeakVisible={false}
          layerProps={{ eventBubblingEnabled: true }}
          styles={{ root: { zIndex: 1000002 } }}
        >
          <div style={{ width: 320, maxHeight: 360, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
              {/* Select all row */}
              {(() => {
                const allKeys = REGION_GROUPS.flatMap((g) => g.children.map((c) => c.key));
                const allSelected = allKeys.every((k) => tempSelected.includes(k));
                const someSelected = !allSelected && allKeys.some((k) => tempSelected.includes(k));
                return (
                  <div style={{ padding: '4px 8px' }}>
                    <Checkbox
                      label="(Select all)"
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={() => {
                        if (allSelected) setTempSelected([]);
                        else setTempSelected(allKeys);
                      }}
                      styles={{ label: { fontWeight: 600, fontSize: 13 } }}
                    />
                  </div>
                );
              })()}
              {REGION_GROUPS.map((group) => {
                const allKeys = group.children.map((c) => c.key);
                const allSelected = allKeys.every((k) => tempSelected.includes(k));
                const someSelected = !allSelected && allKeys.some((k) => tempSelected.includes(k));
                const expanded = expandedGroups.has(group.key);
                return (
                  <div key={group.key}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', cursor: 'pointer', backgroundColor: theme.palette.neutralLighterAlt }}>
                      <Icon
                        iconName={expanded ? 'ChevronDown' : 'ChevronRight'}
                        styles={{ root: { fontSize: 10, marginRight: 6, color: theme.palette.neutralSecondary } }}
                        onClick={() => toggleGroup(group.key)}
                      />
                      <Checkbox
                        label={group.text}
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={() => toggleGroupAll(group)}
                        styles={{ root: { flex: 1 }, label: { fontWeight: 600, fontSize: 13 } }}
                      />
                    </div>
                    {expanded && group.children.map((child) => (
                      <div key={child.key} style={{ padding: '3px 12px 3px 32px' }}>
                        <Checkbox
                          label={child.text}
                          checked={tempSelected.includes(child.key)}
                          onChange={() => toggleItem(child.key)}
                          styles={{ label: { fontSize: 13 } }}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '8px 12px', borderTop: `1px solid ${theme.palette.neutralLight}` }}>
              <DefaultButton text="Cancel" onClick={() => setIsOpen(false)} styles={{ root: { minWidth: 60, height: 28 } }} />
              <PrimaryButton text="Apply" onClick={() => { onChange(tempSelected); setIsOpen(false); }} styles={{ root: { minWidth: 60, height: 28 } }} />
            </div>
          </div>
        </Callout>
      )}
    </>
  );
};

export interface IBulkEditValues {
  regions?: string[];
  commitment?: string;
  discountPercent?: number;
  startDate?: Date;
  endDate?: Date;
  startDatePreset?: string;
  endDateDuration?: string;
}

export interface IProductGridProps {
  products: IAddedProduct[];
  onUpdateProduct: (id: string, field: keyof IAddedProduct, value: unknown) => void;
  onDeleteProducts: (ids: string[]) => void;
  onDuplicateProducts?: (ids: string[]) => void;
  onBulkEditApply: (ids: string[], values: IBulkEditValues) => void;
  onSave: () => void;
  onAddProducts: () => void;
  hasUnsavedChanges: boolean;
  availableTenants?: string[];
  onEditModeChange?: (isEditing: boolean) => void;
}

export const ProductGrid: React.FC<IProductGridProps> = ({
  products,
  onUpdateProduct,
  onDeleteProducts,
  onDuplicateProducts,
  onBulkEditApply,
  onSave,
  onAddProducts,
  availableTenants = [],
  onEditModeChange,
}) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [checkedIds, setCheckedIds] = React.useState<Set<string>>(new Set());
  const [mode, setMode] = React.useState<GridMode>('default');
  React.useEffect(() => { onEditModeChange?.(mode === 'editing'); }, [mode, onEditModeChange]);
  const [deleteDialogHidden, setDeleteDialogHidden] = React.useState(true);
  const [isBulkEditOpen, setIsBulkEditOpen] = React.useState(false);
  const [bulkEditValues, setBulkEditValues] = React.useState<IBulkEditValues>({});
  const [isColumnsCalloutOpen, setIsColumnsCalloutOpen] = React.useState(false);
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<string>>(new Set(['productFamily', 'productType', 'partNumber', 'status']));
  const [currentPage, setCurrentPage] = React.useState(0);
  const [showDetailsPanel, setShowDetailsPanel] = React.useState(false);
  const [localEdits, setLocalEdits] = React.useState<Map<string, Partial<IAddedProduct>>>(new Map());
  // Track which items have custom date pickers open
  const [customStartDate, setCustomStartDate] = React.useState<Set<string>>(new Set());
  const [customEndDate, setCustomEndDate] = React.useState<Set<string>>(new Set());
  const [bulkStartCustom, setBulkStartCustom] = React.useState(false);
  const [bulkEndCustom, setBulkEndCustom] = React.useState(false);
  // Refs for calendar callout positioning
  const startDateRefs = React.useRef<Map<string, HTMLElement>>(new Map());
  const endDateRefs = React.useRef<Map<string, HTMLElement>>(new Map());
  const bulkStartDateRef = React.useRef<HTMLDivElement>(null);
  const bulkEndDateRef = React.useRef<HTMLDivElement>(null);

  // Filter states
  const [commitmentFilterVal, setCommitmentFilterVal] = React.useState('All');
  const [regionFilterVals, setRegionFilterVals] = React.useState<string[]>([]);
  const [tenantFilterVals, setTenantFilterVals] = React.useState<string[]>([]);
  const [productTypeFilter, setProductTypeFilter] = React.useState('RI and ASP');
  const [productFamilyFilter, setProductFamilyFilter] = React.useState<string[]>(['All']);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = React.useState(false);
  const [activeFilterChip, setActiveFilterChip] = React.useState<string | null>(null);
  // Track which filter chips are visible (applied from the panel)
  const [appliedFilterChips, setAppliedFilterChips] = React.useState<Set<string>>(new Set());
  // Pending filter values (used inside filter panel before Apply)
  const [pendingProductType, setPendingProductType] = React.useState('RI and ASP');
  const [pendingProductFamily, setPendingProductFamily] = React.useState<string[]>(['All']);
  const [pendingCommitment, setPendingCommitment] = React.useState('All');
  const [pendingRegions, setPendingRegions] = React.useState<string[]>([]);
  const [pendingTenants, setPendingTenants] = React.useState<string[]>([]);

  const productTypeChipRef = React.useRef<HTMLSpanElement>(null);
  const productFamilyChipRef = React.useRef<HTMLSpanElement>(null);
  const commitmentChipRef = React.useRef<HTMLSpanElement>(null);
  const regionChipRef = React.useRef<HTMLSpanElement>(null);
  const tenantChipRef = React.useRef<HTMLSpanElement>(null);

  // Collapsed sections in details panel
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(new Set());

  const columnsBtnRef = React.useRef<HTMLDivElement>(null);
  const filterBtnRef = React.useRef<HTMLDivElement>(null);

  // Edit SKUs state
  const [editSkuProductId, setEditSkuProductId] = React.useState<string | null>(null);
  const [skuChecked, setSkuChecked] = React.useState<Set<string>>(new Set());
  const [skuEdits, setSkuEdits] = React.useState<Map<string, Partial<ISku>>>(new Map());
  const [skuInitialEdits, setSkuInitialEdits] = React.useState<Map<string, Partial<ISku>>>(new Map());
  const [skuStartDateCalendarOpen, setSkuStartDateCalendarOpen] = React.useState<string | null>(null);
  const [skuEndDateCalendarOpen, setSkuEndDateCalendarOpen] = React.useState<string | null>(null);
  const skuStartDateRefs = React.useRef<Map<string, HTMLElement>>(new Map());
  const skuEndDateRefs = React.useRef<Map<string, HTMLElement>>(new Map());
  // Bulk edit within Edit SKUs panel
  const [skuBulkEditOpen, setSkuBulkEditOpen] = React.useState(false);
  const [skuBulkDiscount, setSkuBulkDiscount] = React.useState('');
  const [skuBulkStartDate, setSkuBulkStartDate] = React.useState('');
  const [skuBulkEndDate, setSkuBulkEndDate] = React.useState('');
  const [skuBulkSuccessMsg, setSkuBulkSuccessMsg] = React.useState(false);
  const [skuBulkStartCalOpen, setSkuBulkStartCalOpen] = React.useState(false);
  const [skuBulkEndCalOpen, setSkuBulkEndCalOpen] = React.useState(false);
  const skuBulkBtnRef = React.useRef<HTMLDivElement>(null);
  const skuBulkStartDateRef = React.useRef<HTMLDivElement>(null);
  const skuBulkEndDateRef = React.useRef<HTMLDivElement>(null);
  const [skuSearchQuery, setSkuSearchQuery] = React.useState('');

  // SKU reset warning state
  const [skuResetWarningOpen, setSkuResetWarningOpen] = React.useState(false);
  const [skuResetProductIds, setSkuResetProductIds] = React.useState<string[]>([]);
  const [pendingEditsOnWarning, setPendingEditsOnWarning] = React.useState<Map<string, Partial<IAddedProduct>>>(new Map());
  const [pendingBulkEditOnWarning, setPendingBulkEditOnWarning] = React.useState<{ ids: string[]; values: IBulkEditValues } | null>(null);

  const editSkuProduct = products.find((p) => p.id === editSkuProductId);

  const skuDropdownStyles = { root: { width: 140 }, dropdown: { minWidth: 0, borderColor: '#c8c6c4' }, dropdownItem: { fontSize: 12 }, dropdownItemSelected: { fontSize: 12 }, title: { fontSize: 12, height: 28, lineHeight: '26px', padding: '0 28px 0 8px', borderColor: '#c8c6c4' }, caretDownWrapper: { height: 28, lineHeight: '28px' } };

  const SKU_START_DATE_OPTIONS: IDropdownOption[] = [
    { key: 'At order acceptance', text: 'At order acceptance' },
    { key: 'divider', text: '-', itemType: DropdownMenuItemType.Divider },
    { key: 'On specific date', text: 'On specific date' },
  ];
  const skuEndDateOptions: IDropdownOption[] = React.useMemo(() => {
    const commitment = editSkuProduct?.commitment || '';
    const filtered = ALL_DURATION_OPTIONS.filter((d) => {
      if (!commitment) return true;
      const months = parseDurationMonths(d.key);
      if (commitment === '1 Year') return months <= 12;
      if (commitment === '3 Years') return months <= 36;
      return true;
    });
    return [
      { key: 'header', text: 'Duration', itemType: DropdownMenuItemType.Header },
      ...filtered.map((d) => ({ key: d.key, text: d.text })),
      { key: 'divider', text: '-', itemType: DropdownMenuItemType.Divider },
      { key: 'On specific date', text: 'On specific date' },
    ];
  }, [editSkuProduct?.commitment]);

  const skusByRegion: Map<string, ISku[]> = React.useMemo(() => {
    if (!editSkuProduct || !editSkuProduct.skus) return new Map();
    const q = skuSearchQuery.trim().toLowerCase();
    const regionMap = new Map<string, ISku[]>();
    editSkuProduct.skus.forEach((sku) => {
      if (q && !`${sku.skuType} ${sku.region} ${sku.commitment}`.toLowerCase().includes(q)) return;
      if (!regionMap.has(sku.region)) regionMap.set(sku.region, []);
      regionMap.get(sku.region)!.push(sku);
    });
    return regionMap;
  }, [editSkuProduct, skuSearchQuery]);

  const skuHasEdits = React.useMemo(() => {
    if (!editSkuProduct || !editSkuProduct.skus) return false;
    for (const sku of editSkuProduct.skus) {
      const edit = skuEdits.get(sku.id);
      const initial = skuInitialEdits.get(sku.id);
      if (!edit || !initial) continue;
      if (edit.discountPercent !== initial.discountPercent || edit.startDate !== initial.startDate || edit.endDate !== initial.endDate) return true;
    }
    return false;
  }, [editSkuProduct, skuEdits, skuInitialEdits]);

  const handleOpenEditSkus = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.skus || product.skus.length === 0) return;
    setEditSkuProductId(productId);
    setCheckedIds(new Set([productId]));
    setSkuChecked(new Set(product.selectedSkuIds || []));
    const edits = new Map<string, Partial<ISku>>();
    product.skus.forEach((sku) => {
      edits.set(sku.id, {
        discountPercent: sku.discountPercent !== 0 ? sku.discountPercent : product.discountPercent,
        startDate: sku.startDate !== 'Mar 21, 2026' ? sku.startDate : product.startDate,
        endDate: sku.endDate !== 'Mar 21, 2029' ? sku.endDate : product.endDate,
      });
    });
    setSkuEdits(edits);
    setSkuInitialEdits(new Map(edits));
  };

  const handleSkuApply = () => {
    if (!editSkuProductId || !editSkuProduct) return;
    const updatedSkus = (editSkuProduct.skus || []).map((sku) => {
      const edit = skuEdits.get(sku.id);
      if (!edit) return sku;
      return { ...sku, ...edit };
    });
    onUpdateProduct(editSkuProductId, 'skus', updatedSkus);
    onUpdateProduct(editSkuProductId, 'selectedSkuIds', Array.from(skuChecked));
    setEditSkuProductId(null);
  };

  const handleSkuResetToDefault = () => {
    if (!editSkuProduct) return;
    const edits = new Map<string, Partial<ISku>>();
    (editSkuProduct.skus || []).forEach((sku) => {
      edits.set(sku.id, { discountPercent: editSkuProduct.discountPercent, startDate: editSkuProduct.startDate, endDate: editSkuProduct.endDate });
    });
    setSkuEdits(edits);
    setSkuChecked(new Set());
  };

  const handleSkuEdit = (skuId: string, field: keyof ISku, value: string | number) => {
    setSkuEdits((prev) => {
      const next = new Map(prev);
      const existing = next.get(skuId) || {};
      next.set(skuId, { ...existing, [field]: value });
      return next;
    });
  };

  const handleSkuBulkEditApply = () => {
    skuChecked.forEach((skuId) => {
      if (skuBulkDiscount !== '') {
        const n = parseFloat(skuBulkDiscount);
        if (!isNaN(n) && n >= 0 && n <= 100) handleSkuEdit(skuId, 'discountPercent', n);
      }
      if (skuBulkStartDate !== '' && skuBulkStartDate !== 'On specific date') {
        handleSkuEdit(skuId, 'startDate', skuBulkStartDate);
      }
      if (skuBulkEndDate !== '' && skuBulkEndDate !== 'On specific date') {
        if (DURATION_KEYS.has(skuBulkEndDate)) {
          const sku = editSkuProduct?.skus?.find((s) => s.id === skuId);
          const effectiveStart = skuBulkStartDate && skuBulkStartDate !== 'On specific date'
            ? skuBulkStartDate
            : (skuEdits.get(skuId)?.startDate ?? sku?.startDate ?? '') as string;
          const computed = computeEndDateFromDuration(effectiveStart, skuBulkEndDate);
          handleSkuEdit(skuId, 'endDate', computed);
        } else {
          handleSkuEdit(skuId, 'endDate', skuBulkEndDate);
        }
      }
    });
    setSkuBulkEditOpen(false);
    setSkuBulkDiscount('');
    setSkuBulkStartDate('');
    setSkuBulkEndDate('');
    setSkuBulkSuccessMsg(true);
    setTimeout(() => setSkuBulkSuccessMsg(false), 4000);
  };

  const hasChecked = checkedIds.size > 0;

  const toggleCheck = React.useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const selectedDetailItem = React.useMemo(() => {
    if (checkedIds.size === 0) return null;
    const firstId = Array.from(checkedIds)[0];
    return products.find((p) => p.id === firstId) || null;
  }, [checkedIds, products]);

  const displayProducts = React.useMemo(() => {
    if (mode !== 'editing' || localEdits.size === 0) return products;
    return products.map((p) => {
      const edits = localEdits.get(p.id);
      if (!edits) return p;
      const merged = { ...p, ...edits };
      if (edits.discountPercent !== undefined) {
        merged.priceNetUSD = merged.basePriceNetUSD * (1 - merged.discountPercent / 100);
      }
      return merged;
    });
  }, [products, localEdits, mode]);

  const filteredProducts = React.useMemo(() => {
    let result = displayProducts;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.productDetails.toLowerCase().includes(q) ||
          p.amendmentCode.toLowerCase().includes(q) ||
          p.partNumber.toLowerCase().includes(q)
      );
    }
    if (commitmentFilterVal !== 'All') {
      result = result.filter((p) => p.commitment === commitmentFilterVal);
    }
    if (regionFilterVals.length > 0) {
      result = result.filter((p) => (p.regions || []).some((r) => regionFilterVals.includes(r)));
    }
    if (tenantFilterVals.length > 0) {
      result = result.filter((p) => (p.tenants || []).some((t) => tenantFilterVals.includes(t)));
    }
    return result;
  }, [displayProducts, searchQuery, commitmentFilterVal, regionFilterVals, tenantFilterVals]);

  const toggleSelectAll = React.useCallback(() => {
    setCheckedIds((prev) => {
      if (prev.size === filteredProducts.length) return new Set();
      return new Set(filteredProducts.map((p) => p.id));
    });
  }, [filteredProducts]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pageStart = currentPage * PAGE_SIZE;
  const pagedProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE);

  React.useEffect(() => { setCurrentPage(0); }, [searchQuery, commitmentFilterVal, regionFilterVals, tenantFilterVals]);

  const { sortedItems, groups } = React.useMemo(() => {
    const groupMap = new Map<string, IAddedProduct[]>();
    for (const p of pagedProducts) {
      const gName = p.amendmentCode || 'Other';
      if (!groupMap.has(gName)) groupMap.set(gName, []);
      groupMap.get(gName)!.push(p);
    }
    const sorted: IAddedProduct[] = [];
    const grps: IGroup[] = [];
    let startIdx = 0;
    for (const [name, items] of groupMap) {
      grps.push({ key: name, name, startIndex: startIdx, count: items.length, isCollapsed: false });
      sorted.push(...items);
      startIdx += items.length;
    }
    return { sortedItems: sorted, groups: grps };
  }, [pagedProducts]);

  const handleLocalEdit = React.useCallback((id: string, field: keyof IAddedProduct, value: unknown) => {
    setLocalEdits((prev) => {
      const next = new Map(prev);
      const existing = next.get(id) || {};
      next.set(id, { ...existing, [field]: value });
      return next;
    });
  }, []);

  const handleEnterEditMode = React.useCallback(() => {
    if (checkedIds.size > 0) {
      setLocalEdits(new Map());
      setCustomStartDate(new Set());
      setCustomEndDate(new Set());
      setMode('editing');
    }
  }, [checkedIds.size]);

  const handleDiscardChanges = React.useCallback(() => {
    setLocalEdits(new Map());
    setCustomStartDate(new Set());
    setCustomEndDate(new Set());
    setMode('default');
    setCheckedIds(new Set());
  }, []);

  const detectSkuResets = (edits: Map<string, Partial<IAddedProduct>>): { hasResets: boolean; productIds: string[] } => {
    const resetProducts: string[] = [];
    edits.forEach((edits, productId) => {
      const product = products.find((p) => p.id === productId);
      if (!product || !product.selectedSkuIds || product.selectedSkuIds.length === 0) return;

      const regionsEdited = edits.regions !== undefined;
      const commitmentEdited = edits.commitment !== undefined;

      if (!regionsEdited && !commitmentEdited) return;

      const newRegions = regionsEdited ? (edits.regions as string[]) : product.regions;
      const newCommitment = commitmentEdited ? (edits.commitment as string) : product.commitment;

      const regionsChanged = regionsEdited && JSON.stringify(newRegions) !== JSON.stringify(product.regions);
      const commitmentChanged = commitmentEdited && newCommitment !== product.commitment;

      if (regionsChanged || commitmentChanged) {
        resetProducts.push(productId);
      }
    });
    return { hasResets: resetProducts.length > 0, productIds: resetProducts };
  };

  const handleSaveAndExit = React.useCallback(() => {
    const { hasResets, productIds } = detectSkuResets(localEdits);
    if (hasResets) {
      setSkuResetWarningOpen(true);
      setSkuResetProductIds(productIds);
      setPendingEditsOnWarning(new Map(localEdits));
      return;
    }

    localEdits.forEach((edits, id) => {
      Object.entries(edits).forEach(([field, value]) => {
        onUpdateProduct(id, field as keyof IAddedProduct, value);
      });
    });
    // Compute prices from discount
    localEdits.forEach((edits, id) => {
      if (edits.discountPercent !== undefined) {
        const product = products.find((p) => p.id === id);
        if (product) {
          const newPrice = product.basePriceNetUSD * (1 - (edits.discountPercent as number) / 100);
          onUpdateProduct(id, 'priceNetUSD', newPrice);
        }
      }
    });
    // Resolve duration-based end dates to actual dates
    localEdits.forEach((edits, id) => {
      if (edits.endDate && DURATION_KEYS.has(edits.endDate as string)) {
        const product = products.find((p) => p.id === id);
        if (product) {
          const startDate = (edits.startDate as string) || product.startDate;
          const resolved = computeEndDateFromDuration(startDate, edits.endDate as string);
          onUpdateProduct(id, 'endDate', resolved);
        }
      }
    });
    onSave();
    setLocalEdits(new Map());
    setCustomStartDate(new Set());
    setCustomEndDate(new Set());
    setMode('default');
    setCheckedIds(new Set());
  }, [localEdits, onUpdateProduct, onSave, products]);

  const handleDelete = React.useCallback(() => {
    onDeleteProducts(Array.from(checkedIds));
    setDeleteDialogHidden(true);
    setCheckedIds(new Set());
    setLocalEdits(new Map());
    setMode('default');
  }, [checkedIds, onDeleteProducts]);

  const handleBulkEditApply = React.useCallback(() => {
    // Check for SKU resets from regions or commitment changes
    if ((bulkEditValues.regions || bulkEditValues.commitment)) {
      const affectedProducts = Array.from(checkedIds).filter((id) => {
        const product = products.find((p) => p.id === id);
        return product && product.selectedSkuIds && product.selectedSkuIds.length > 0;
      });
      if (affectedProducts.length > 0) {
        setSkuResetWarningOpen(true);
        setSkuResetProductIds(affectedProducts);
        setPendingBulkEditOnWarning({ ids: Array.from(checkedIds), values: bulkEditValues });
        return;
      }
    }
    onBulkEditApply(Array.from(checkedIds), bulkEditValues);
    setIsBulkEditOpen(false);
    setBulkEditValues({});
    setCheckedIds(new Set());
    setMode('default');
  }, [checkedIds, bulkEditValues, onBulkEditApply, products]);

  const handleSkuResetContinue = React.useCallback(() => {
    setSkuResetWarningOpen(false);
    if (pendingBulkEditOnWarning) {
      // Handle bulk edit
      onBulkEditApply(pendingBulkEditOnWarning.ids, pendingBulkEditOnWarning.values);
      setIsBulkEditOpen(false);
      setBulkEditValues({});
      setCheckedIds(new Set());
      setMode('default');
      setPendingBulkEditOnWarning(null);
    } else {
      // Handle inline edit
      pendingEditsOnWarning.forEach((edits, id) => {
        Object.entries(edits).forEach(([field, value]) => {
          onUpdateProduct(id, field as keyof IAddedProduct, value);
        });
      });
      // Compute prices from discount
      pendingEditsOnWarning.forEach((edits, id) => {
        if (edits.discountPercent !== undefined) {
          const product = products.find((p) => p.id === id);
          if (product) {
            const newPrice = product.basePriceNetUSD * (1 - (edits.discountPercent as number) / 100);
            onUpdateProduct(id, 'priceNetUSD', newPrice);
          }
        }
      });
      // Resolve duration-based end dates to actual dates
      pendingEditsOnWarning.forEach((edits, id) => {
        if (edits.endDate && DURATION_KEYS.has(edits.endDate as string)) {
          const product = products.find((p) => p.id === id);
          if (product) {
            const startDate = (edits.startDate as string) || product.startDate;
            const resolved = computeEndDateFromDuration(startDate, edits.endDate as string);
            onUpdateProduct(id, 'endDate', resolved);
          }
        }
      });
      onSave();
      setLocalEdits(new Map());
      setCustomStartDate(new Set());
      setCustomEndDate(new Set());
      setMode('default');
      setCheckedIds(new Set());
    }
    setPendingEditsOnWarning(new Map());
    setSkuResetProductIds([]);
  }, [pendingEditsOnWarning, pendingBulkEditOnWarning, onUpdateProduct, onBulkEditApply, onSave, products]);

  const handleSkuResetCancel = React.useCallback(() => {
    setSkuResetWarningOpen(false);
    if (pendingBulkEditOnWarning) {
      // For bulk edit, just close the dialog and clear the pending values
      setPendingBulkEditOnWarning(null);
    } else {
      // For inline edit, revert only the SKU-affecting edits (regions and commitment)
      setLocalEdits((prev) => {
        const next = new Map(prev);
        skuResetProductIds.forEach((productId) => {
          const edits = next.get(productId);
          if (edits) {
            const reverted = { ...edits };
            delete reverted.regions;
            delete reverted.commitment;
            if (Object.keys(reverted).length === 0) {
              next.delete(productId);
            } else {
              next.set(productId, reverted);
            }
          }
        });
        return next;
      });
    }
    setPendingEditsOnWarning(new Map());
    setSkuResetProductIds([]);
  }, [skuResetProductIds, pendingBulkEditOnWarning]);

  const calcPriceNet = (item: IAddedProduct): number => {
    return item.basePriceNetUSD * (1 - item.discountPercent / 100);
  };

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section); else next.add(section);
      return next;
    });
  };

  const cellStyle: React.CSSProperties = { minHeight: 36, display: 'flex', alignItems: 'center' };
  const editDropdownStyles = { root: { width: '100%' }, dropdown: { minWidth: 0, height: 32 } };
  const editTextFieldStyles = { root: { width: '100%' }, fieldGroup: { height: 32 } };

  const columns: IColumn[] = React.useMemo(() => {
    const allChecked = filteredProducts.length > 0 && filteredProducts.every((p) => checkedIds.has(p.id));
    return [
      {
        key: 'checkbox', name: '', minWidth: 32, maxWidth: 32,
        onRenderHeader: () => <Checkbox checked={allChecked} onChange={toggleSelectAll} styles={{ root: { paddingLeft: 0 } }} />,
        onRender: (item: IAddedProduct) => <Checkbox checked={checkedIds.has(item.id)} onChange={() => toggleCheck(item.id)} styles={{ root: { paddingLeft: 0 } }} />,
      },
      {
        key: 'productDetails', name: 'Product description', minWidth: 260, maxWidth: 340, isResizable: true,
        onRender: (item: IAddedProduct) => {
          const skuDiffers = item.selectedSkuIds && item.selectedSkuIds.length > 0 && item.skus && item.skus.some((sku) =>
            sku.discountPercent !== item.discountPercent || sku.startDate !== item.startDate || sku.endDate !== item.endDate
          );
          return (
            <div style={cellStyle}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Text styles={{ root: { fontSize: 13, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '18px' } }}>{item.productDetails}</Text>
                  {skuDiffers && (
                    <TooltipHost content="Some SKU values differ from those set for the parent product." calloutProps={{ gapSpace: 4 }}>
                      <Icon iconName="Warning" styles={{ root: { fontSize: 14, color: '#d83b01', flexShrink: 0 } }} />
                    </TooltipHost>
                  )}
                </div>
                <Link
                  onClick={() => handleOpenEditSkus(item.id)}
                  disabled={!item.skus || item.skus.length === 0}
                  styles={{ root: { fontSize: 11, color: item.skus && item.skus.length > 0 ? theme.palette.themePrimary : theme.palette.neutralTertiary } }}
                >
                  Edit SKUs
                </Link>
              </div>
            </div>
          );
        },
      },
      {
        key: 'tenants', name: 'Tenant(s)', minWidth: 170, maxWidth: 220, isResizable: true,
        onRender: (item: IAddedProduct) => {
          const names = (item.tenants || []).map((key) => {
            const opt = TENANT_OPTIONS.find((t) => t.key === key);
            return opt?.text || key;
          });
          if (names.length === 0) {
            return <div style={cellStyle}><Text styles={{ root: { fontSize: 12, color: theme.palette.neutralTertiary } }}>—</Text></div>;
          }
          const maxShow = 2;
          const shown = names.slice(0, maxShow);
          const extra = names.length - maxShow;
          return (
            <div style={{ ...cellStyle, overflow: 'hidden', width: '100%' }}>
              <span style={{ fontSize: 12, lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {shown.join(', ')}
                {extra > 0 && (
                  <>
                    {', '}
                    <TooltipHost content={<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{names.map((n, i) => <span key={i}>{n}</span>)}</div>} calloutProps={{ gapSpace: 4, directionalHint: DirectionalHint.bottomCenter }}>
                      <span style={{ color: theme.palette.themePrimary, fontWeight: 600, cursor: 'pointer' }}>+{extra}</span>
                    </TooltipHost>
                  </>
                )}
              </span>
            </div>
          );
        },
      },
      {
        key: 'regions', name: 'Region', minWidth: 160, maxWidth: 200, isResizable: true,
        onRender: (item: IAddedProduct) => {
          if (mode === 'editing' && checkedIds.has(item.id)) {
            return (
              <div style={cellStyle}>
                <RegionMultiSelect
                  selectedKeys={item.regions || []}
                  onChange={(keys) => handleLocalEdit(item.id, 'regions', keys)}
                  placeholder="Select"
                />
              </div>
            );
          }
          const regions = item.regions || [];
          if (regions.length === 0) {
            return <div style={cellStyle}><Text styles={{ root: { fontSize: 12, color: theme.palette.neutralTertiary } }}>—</Text></div>;
          }
          const maxShow = 2;
          const shown = regions.slice(0, maxShow);
          const extra = regions.length - maxShow;
          return (
            <div style={{ ...cellStyle, overflow: 'hidden', width: '100%' }}>
              <span style={{ fontSize: 12, lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {shown.join(', ')}
                {extra > 0 && (
                  <>
                    {', '}
                    <TooltipHost content={<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{regions.map((r, i) => <span key={i}>{r}</span>)}</div>} calloutProps={{ gapSpace: 4, directionalHint: DirectionalHint.bottomCenter }}>
                      <span style={{ color: theme.palette.themePrimary, fontWeight: 600, cursor: 'pointer' }}>+{extra}</span>
                    </TooltipHost>
                  </>
                )}
              </span>
            </div>
          );
        },
      },
      {
        key: 'commitment', name: 'Commitment Duration', minWidth: 140, maxWidth: 180, isResizable: true,
        onRender: (item: IAddedProduct) => {
          if (mode === 'editing' && checkedIds.has(item.id)) {
            return (
              <div style={cellStyle}>
                <Dropdown
                  selectedKey={item.commitment || ''}
                  options={COMMITMENT_OPTIONS.filter((o) => o.key !== '').map((o) => ({ key: o.key, text: o.text }))}
                  placeholder="Select"
                  onChange={(_, opt) => handleLocalEdit(item.id, 'commitment', opt?.key || '')}
                  styles={editDropdownStyles}
                />
              </div>
            );
          }
          return <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>{item.commitment || ''}</Text></div>;
        },
      },
      {
        key: 'discountPercent', name: 'Discount (%)', minWidth: 100, maxWidth: 120, isResizable: true,
        onRender: (item: IAddedProduct) => {
          if (mode === 'editing' && checkedIds.has(item.id)) {
            return <div style={cellStyle}><TextField value={String(item.discountPercent)} onChange={(_, val) => { const num = parseFloat(val || '0'); if (!isNaN(num) && num >= 0 && num <= 100) handleLocalEdit(item.id, 'discountPercent', num); }} placeholder="Discount %" styles={editTextFieldStyles} /></div>;
          }
          return <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>{item.discountPercent}%</Text></div>;
        },
      },
      {
        key: 'startDate', name: 'Start date', minWidth: 130, maxWidth: 160, isResizable: true,
        onRender: (item: IAddedProduct) => {
          if (mode === 'editing' && checkedIds.has(item.id)) {
            const showPicker = customStartDate.has(item.id);
            const currentValue = item.startDate;
            const options: IDropdownOption[] = [
              { key: 'At order acceptance', text: 'At order acceptance' },
              { key: 'divider', text: '-', itemType: DropdownMenuItemType.Divider },
              { key: 'On specific date', text: 'On specific date' },
            ];

            const selectedKey = currentValue === 'At order acceptance' ? 'At order acceptance' : 'On specific date';

            return (
              <div style={{ padding: '2px 0' }} ref={(el) => { if (el) startDateRefs.current.set(item.id, el); }}>
                <Dropdown
                  selectedKey={selectedKey}
                  options={options}
                  onChange={(_, opt) => {
                    if (opt?.key === 'On specific date') {
                      setCustomStartDate(prev => { const n = new Set(prev); n.add(item.id); return n; });
                    } else {
                      setCustomStartDate(prev => { const n = new Set(prev); n.delete(item.id); return n; });
                      handleLocalEdit(item.id, 'startDate', opt?.key as string || '');
                    }
                  }}
                  onRenderTitle={() => {
                    if (currentValue === 'At order acceptance') return <span>At order acceptance</span>;
                    if (currentValue && currentValue !== 'On specific date' && currentValue !== '') {
                      return <span>{currentValue}</span>;
                    }
                    return <span style={{ color: '#666' }}>Select start date</span>;
                  }}
                  styles={editDropdownStyles}
                />
                {showPicker && startDateRefs.current.get(item.id) && (
                  <Callout
                    target={startDateRefs.current.get(item.id)}
                    onDismiss={() => setCustomStartDate(prev => { const n = new Set(prev); n.delete(item.id); return n; })}
                    directionalHint={DirectionalHint.bottomLeftEdge}
                    isBeakVisible={false}
                    styles={{ root: { zIndex: 1000002 } }}
                  >
                    <Calendar
                      value={currentValue && currentValue !== 'At order acceptance' && currentValue !== 'On specific date' ? new Date(currentValue) : undefined}
                      onSelectDate={(date) => {
                        if (date) {
                          const formatted = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                          handleLocalEdit(item.id, 'startDate', formatted);
                          setCustomStartDate(prev => { const n = new Set(prev); n.delete(item.id); return n; });
                        }
                      }}
                      showGoToToday
                    />
                  </Callout>
                )}
              </div>
            );
          }
          return <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>{item.startDate}</Text></div>;
        },
      },
      {
        key: 'endDate', name: 'End date', minWidth: 130, maxWidth: 160, isResizable: true,
        onRender: (item: IAddedProduct) => {
          if (mode === 'editing' && checkedIds.has(item.id)) {
            const showPicker = customEndDate.has(item.id);
            const currentValue = item.endDate;

            const filteredDurations = ALL_DURATION_OPTIONS.filter((d) => {
              if (!item.commitment) return true;
              const months = parseDurationMonths(d.key);
              if (item.commitment === '1 Year') return months <= 12;
              if (item.commitment === '3 Years') return months <= 36;
              return true;
            });

            const endDateOpts: IDropdownOption[] = [
              { key: 'header', text: 'Duration', itemType: DropdownMenuItemType.Header },
              ...filteredDurations,
              { key: 'divider', text: '-', itemType: DropdownMenuItemType.Divider },
              { key: 'custom', text: 'On specific date' },
            ];

            return (
              <div style={{ padding: '2px 0' }} ref={(el) => { if (el) endDateRefs.current.set(item.id, el); }}>
                <Dropdown
                  selectedKey={DURATION_KEYS.has(currentValue) ? currentValue : 'custom'}
                  options={endDateOpts}
                  onChange={(_, opt) => {
                    if (opt?.key === 'custom') {
                      setCustomEndDate(prev => { const n = new Set(prev); n.add(item.id); return n; });
                    } else if (opt && DURATION_KEYS.has(opt.key as string)) {
                      const startDate = item.startDate || 'At order acceptance';
                      const computed = computeEndDateFromDuration(startDate, opt.key as string);
                      handleLocalEdit(item.id, 'endDate', computed);
                      setCustomEndDate(prev => { const n = new Set(prev); n.delete(item.id); return n; });
                    }
                  }}
                  onRenderTitle={() => {
                    if (DURATION_KEYS.has(currentValue)) return <span>{currentValue}</span>;
                    if (currentValue && currentValue !== 'On specific date' && currentValue !== '') {
                      return <span>{currentValue}</span>;
                    }
                    return <span style={{ color: '#666' }}>Select end date</span>;
                  }}
                  styles={editDropdownStyles}
                />
                {showPicker && endDateRefs.current.get(item.id) && (
                  <Callout
                    target={endDateRefs.current.get(item.id)}
                    onDismiss={() => setCustomEndDate(prev => { const n = new Set(prev); n.delete(item.id); return n; })}
                    directionalHint={DirectionalHint.bottomLeftEdge}
                    isBeakVisible={false}
                    styles={{ root: { zIndex: 1000002 } }}
                  >
                    <Calendar
                      value={currentValue && !DURATION_KEYS.has(currentValue) && currentValue !== 'On specific date' ? new Date(currentValue) : undefined}
                      onSelectDate={(date) => {
                        if (date) {
                          const formatted = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                          handleLocalEdit(item.id, 'endDate', formatted);
                          setCustomEndDate(prev => { const n = new Set(prev); n.delete(item.id); return n; });
                        }
                      }}
                      showGoToToday
                    />
                  </Callout>
                )}
              </div>
            );
          }
          return <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>{item.endDate}</Text></div>;
        },
      },
      {
        key: 'productFamily', name: 'Product Family', minWidth: 140, maxWidth: 180, isResizable: true,
        onRender: (item: IAddedProduct) => (
          <div style={cellStyle}><Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary } }}>{item.productFamily || 'N/A'}</Text></div>
        ),
      },
      {
        key: 'productType', name: 'Product Type', minWidth: 120, maxWidth: 160, isResizable: true,
        onRender: () => (
          <div style={cellStyle}><Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary } }}>MSU</Text></div>
        ),
      },
      {
        key: 'partNumber', name: 'Part Number', minWidth: 120, maxWidth: 160, isResizable: true,
        onRender: (item: IAddedProduct) => (
          <div style={cellStyle}><Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary } }}>{item.partNumber || 'N/A'}</Text></div>
        ),
      },
      {
        key: 'status', name: 'Status', minWidth: 100, maxWidth: 130, isResizable: true,
        onRender: () => (
          <div style={cellStyle}><Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary } }}>Active</Text></div>
        ),
      },
    ];
  }, [checkedIds, filteredProducts, mode, handleLocalEdit, toggleCheck, toggleSelectAll, customStartDate, customEndDate, availableTenants]);

  const visibleColumns = React.useMemo(
    () => columns.filter((c) => c.key === 'checkbox' || !hiddenColumns.has(c.key)),
    [columns, hiddenColumns]
  );

  const allColumnKeys = ['productDetails', 'productFamily', 'tenants', 'regions', 'commitment', 'discountPercent', 'startDate', 'endDate', 'productType', 'partNumber', 'status'];
  const columnLabels: Record<string, string> = {
    productDetails: 'Product description', productFamily: 'Product Family', tenants: 'Tenant(s)', regions: 'Region(s)',
    commitment: 'Commitment Duration', discountPercent: 'Discount (%)', startDate: 'Start date',
    endDate: 'End date', productType: 'Product Type', partNumber: 'Part Number', status: 'Status',
  };

  const hasActiveFilter = appliedFilterChips.size > 0;
  const extraColumns = ['productFamily', 'productType', 'partNumber', 'status'];
  const hasExtraColumnsVisible = extraColumns.some((k) => !hiddenColumns.has(k));

  const openFilterPanel = React.useCallback(() => {
    setPendingProductType(productTypeFilter);
    setPendingProductFamily([...productFamilyFilter]);
    setPendingCommitment(commitmentFilterVal);
    setPendingRegions([...regionFilterVals]);
    setPendingTenants([...tenantFilterVals]);
    setIsFilterPanelOpen(true);
  }, [productTypeFilter, productFamilyFilter, commitmentFilterVal, regionFilterVals, tenantFilterVals]);

  const applyFilters = React.useCallback(() => {
    setProductTypeFilter(pendingProductType);
    setProductFamilyFilter(pendingProductFamily);
    setCommitmentFilterVal(pendingCommitment);
    setRegionFilterVals(pendingRegions);
    setTenantFilterVals(pendingTenants);
    // Create chips for any non-default filters
    const chips = new Set<string>();
    if (pendingProductType !== 'RI and ASP') chips.add('productType');
    if (!pendingProductFamily.includes('All')) chips.add('productFamily');
    if (pendingCommitment !== 'All') chips.add('commitment');
    if (pendingRegions.length > 0) chips.add('region');
    if (pendingTenants.length > 0) chips.add('tenant');
    setAppliedFilterChips(chips);
    setIsFilterPanelOpen(false);
  }, [pendingProductType, pendingProductFamily, pendingCommitment, pendingRegions, pendingTenants]);

  const removeFilterChip = React.useCallback((chipKey: string) => {
    setAppliedFilterChips((prev) => { const next = new Set(prev); next.delete(chipKey); return next; });
    switch (chipKey) {
      case 'productType': setProductTypeFilter('RI and ASP'); break;
      case 'productFamily': setProductFamilyFilter(['All']); break;
      case 'commitment': setCommitmentFilterVal('All'); break;
      case 'region': setRegionFilterVals([]); break;
      case 'tenant': setTenantFilterVals([]); break;
    }
  }, []);

  const renderToolbar = () => {
    if (mode === 'editing') {
      return (
        <Stack horizontal verticalAlign="center" className={classNames.toolbar} tokens={{ childrenGap: 8 }}>
          <PrimaryButton iconProps={{ iconName: 'Save' }} text="Save" onClick={handleSaveAndExit} />
          <ActionButton iconProps={{ iconName: 'Cancel' }} text="Discard changes" onClick={handleDiscardChanges} />
          <ActionButton iconProps={{ iconName: 'Delete' }} text="Delete" onClick={() => setDeleteDialogHidden(false)} />
          <Stack.Item grow={1}><span /></Stack.Item>
          <SearchBox placeholder="Search" onChange={(_, val) => setSearchQuery(val || '')} onClear={() => setSearchQuery('')} styles={{ root: { width: 200 } }} />
          <div ref={columnsBtnRef}>
            <ActionButton iconProps={{ iconName: 'ColumnOptions' }} text="Columns" onClick={() => setIsColumnsCalloutOpen(true)} />
          </div>
          <div ref={filterBtnRef}>
            <ActionButton iconProps={{ iconName: 'Filter' }} text="Filter" onClick={openFilterPanel} />
          </div>
        </Stack>
      );
    }
    return (
      <Stack horizontal verticalAlign="center" className={classNames.toolbar} tokens={{ childrenGap: 4 }}>
        <ActionButton iconProps={{ iconName: 'Add' }} text="Add RI/ASP Products" onClick={onAddProducts} />
        <ActionButton iconProps={{ iconName: 'Edit' }} text="Edit" disabled={!hasChecked} onClick={handleEnterEditMode} />
        <ActionButton iconProps={{ iconName: 'BulkUpload' }} text="Bulk Edit" disabled={checkedIds.size < 2} onClick={() => setIsBulkEditOpen(true)} />
        <ActionButton iconProps={{ iconName: 'Copy' }} text="Duplicate" disabled={!hasChecked} onClick={() => onDuplicateProducts?.(Array.from(checkedIds))} />
        <ActionButton iconProps={{ iconName: 'Delete' }} text="Delete" disabled={!hasChecked} onClick={() => setDeleteDialogHidden(false)} />
        <Stack.Item grow={1}><span /></Stack.Item>
        <SearchBox placeholder="Search" onChange={(_, val) => setSearchQuery(val || '')} onClear={() => setSearchQuery('')} styles={{ root: { width: 200 } }} />
        <div ref={columnsBtnRef}>
          <ActionButton iconProps={{ iconName: 'ColumnOptions' }} text="Columns" onClick={() => setIsColumnsCalloutOpen(true)} />
        </div>
        <div ref={filterBtnRef}>
          <ActionButton iconProps={{ iconName: 'Filter' }} text="Filter" onClick={openFilterPanel} />
        </div>
      </Stack>
    );
  };

  const renderDetailField = (label: string, value: string) => (
    <div className={classNames.detailsFieldGroup}>
      <div className={classNames.detailsFieldLabel}>{label}</div>
      <div className={classNames.detailsFieldValue}>{value}</div>
    </div>
  );

  const renderDetailsPane = () => {
    if (!showDetailsPanel) return null;

    if (!selectedDetailItem) {
      return (
        <div className={classNames.detailsPanel}>
          <div className={classNames.emptyDetails}>
            <Stack tokens={{ childrenGap: 8 }} horizontalAlign="center">
              <Icon iconName="Info" styles={{ root: { fontSize: 32, color: theme.palette.neutralTertiary } }} />
              <Text styles={{ root: { color: theme.palette.neutralSecondary, fontSize: 13 } }}>
                Please select a product to view its details
              </Text>
            </Stack>
          </div>
        </div>
      );
    }

    return (
      <div className={classNames.detailsPanel} style={{ display: 'flex', flexDirection: 'column' }}>
        <div className={classNames.detailsPanelHeader}>
          <Text styles={{ root: { fontWeight: 700, fontSize: 16, display: 'block' } }}>
            {selectedDetailItem.partNumber}
          </Text>
          <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary, display: 'block', marginTop: 4 } }}>
            {selectedDetailItem.productDetails}
          </Text>
        </div>

        <div className={classNames.detailsPanelBody} style={{ flex: 1, overflowY: 'auto' }}>
          {/* Product Information */}
          <div className={classNames.detailsSectionHeader} onClick={() => toggleSection('productInfo')}>
            <Icon iconName={collapsedSections.has('productInfo') ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 12 } }} />
            <span>Product information</span>
          </div>
          {!collapsedSections.has('productInfo') && (
            <>
              {renderDetailField('Product Family name', selectedDetailItem.productFamily || 'O365 E3')}
              {renderDetailField('Division Name', 'O365 Core - Non M365')}
              {renderDetailField('Product Type', 'MSU')}
              {renderDetailField('Lead Status', '-')}
              {renderDetailField('Price Level', 'A')}
            </>
          )}

          {/* Scenario Configuration */}
          <div className={classNames.detailsSectionHeader} onClick={() => toggleSection('scenarioConfig')}>
            <Icon iconName={collapsedSections.has('scenarioConfig') ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 12 } }} />
            <span>Scenario Configuration</span>
          </div>
          {!collapsedSections.has('scenarioConfig') && (
            <>
              {renderDetailField('Offering', selectedDetailItem.offering || 'CUS')}
              {renderDetailField('Profile', 'Enterprise')}
            </>
          )}

          {/* Configured SKUs */}
          <div className={classNames.detailsSectionHeader} onClick={() => toggleSection('configuredSkus')}>
            <Icon iconName={collapsedSections.has('configuredSkus') ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 12 } }} />
            <span>Configured SKUs</span>
          </div>
          {!collapsedSections.has('configuredSkus') && (
            <div style={{ padding: '4px 12px' }}>
              {selectedDetailItem.selectedSkuIds && selectedDetailItem.selectedSkuIds.length > 0 && selectedDetailItem.skus ? (
                selectedDetailItem.skus
                  .filter((sku) => selectedDetailItem.selectedSkuIds!.includes(sku.id))
                  .map((sku) => (
                    <div key={sku.id} style={{ padding: '4px 0', borderBottom: `1px solid ${theme.palette.neutralLighter}` }}>
                      <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralPrimary } }}>
                        {sku.skuType}, {sku.region}, {sku.commitment}
                      </Text>
                      <Text styles={{ root: { fontSize: 11, color: theme.palette.neutralSecondary, display: 'block' } }}>
                        {sku.discountPercent}% discount, Starts {sku.startDate} until {sku.endDate}
                      </Text>
                    </div>
                  ))
              ) : (
                <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary, fontStyle: 'italic' } }}>
                  Please add region and commitment values to the product to proceed with configuring the SKUs
                </Text>
              )}
            </div>
          )}

          {/* NET Information */}
          <div className={classNames.detailsSectionHeader} onClick={() => toggleSection('netInfo')}>
            <Icon iconName={collapsedSections.has('netInfo') ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 12 } }} />
            <span>NET Information</span>
          </div>
          {!collapsedSections.has('netInfo') && (
            <>
              <div className={classNames.detailsFieldGroup}>
                <div className={classNames.detailsFieldLabel}>List Price (Before discount)</div>
                <div className={classNames.detailsFieldValue}>
                  Year 1: {selectedDetailItem.basePriceNetUSD.toFixed(1)} / Year 2: {(selectedDetailItem.basePriceNetUSD * 0.92).toFixed(1)} / Year 3: {(selectedDetailItem.basePriceNetUSD * 0.75).toFixed(1)}
                </div>
              </div>
              {renderDetailField('Discount', `${selectedDetailItem.discountPercent}%`)}
              {renderDetailField('Net Price (USD)', `$${calcPriceNet(selectedDetailItem).toFixed(2)}`)}
            </>
          )}

          {/* ERP Information */}
          <div className={classNames.detailsSectionHeader} onClick={() => toggleSection('erpInfo')}>
            <Icon iconName={collapsedSections.has('erpInfo') ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 12 } }} />
            <span>ERP Information</span>
          </div>
          {!collapsedSections.has('erpInfo') && (
            <>
              {renderDetailField('ERP Status', 'Active')}
              {renderDetailField('ERP ID', 'ERP-' + selectedDetailItem.id.slice(-4))}
            </>
          )}
        </div>

        <div style={{ padding: '12px 24px', borderTop: `1px solid ${theme.palette.neutralLight}`, backgroundColor: theme.palette.white, flexShrink: 0 }}>
          <DefaultButton text="Close" onClick={() => setShowDetailsPanel(false)} styles={{ root: { minWidth: 80 } }} />
        </div>
      </div>
    );
  };

  return (
    <Stack tokens={{ childrenGap: 0 }} styles={{ root: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}>
      {/* Sticky toolbar area */}
      <Stack className={classNames.root} tokens={{ childrenGap: 4 }}>
        {renderToolbar()}

        {/* Filter chips - only shown after applying from filter panel */}
        {hasActiveFilter && (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} styles={{ root: { padding: '4px 0' } }}>
            <Icon iconName="Filter" styles={{ root: { color: theme.palette.neutralSecondary, fontSize: 14 } }} />
            <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary } }}>Filter:</Text>
            {appliedFilterChips.has('productType') && (
              <span ref={productTypeChipRef} className={classNames.filterChip} onClick={() => setActiveFilterChip(activeFilterChip === 'productType' ? null : 'productType')}>
                Product type: <strong>{productTypeFilter}</strong>
                <Icon iconName="ChevronDown" styles={{ root: { fontSize: 10, color: theme.palette.neutralSecondary } }} />
                <Icon iconName="Cancel" styles={{ root: { fontSize: 10, color: theme.palette.neutralSecondary, marginLeft: 4, cursor: 'pointer' } }} onClick={(e) => { e.stopPropagation(); removeFilterChip('productType'); }} />
              </span>
            )}
            {appliedFilterChips.has('productFamily') && (
              <span ref={productFamilyChipRef} className={classNames.filterChip} onClick={() => setActiveFilterChip(activeFilterChip === 'productFamily' ? null : 'productFamily')}>
                Product Family: <strong>{productFamilyFilter.includes('All') ? 'All' : productFamilyFilter.join(', ')}</strong>
                <Icon iconName="ChevronDown" styles={{ root: { fontSize: 10, color: theme.palette.neutralSecondary } }} />
                <Icon iconName="Cancel" styles={{ root: { fontSize: 10, color: theme.palette.neutralSecondary, marginLeft: 4, cursor: 'pointer' } }} onClick={(e) => { e.stopPropagation(); removeFilterChip('productFamily'); }} />
              </span>
            )}
            {appliedFilterChips.has('commitment') && (
              <span ref={commitmentChipRef} className={classNames.filterChip} onClick={() => setActiveFilterChip(activeFilterChip === 'commitment' ? null : 'commitment')}>
                Commitment Duration: <strong>{commitmentFilterVal}</strong>
                <Icon iconName="ChevronDown" styles={{ root: { fontSize: 10, color: theme.palette.neutralSecondary } }} />
                <Icon iconName="Cancel" styles={{ root: { fontSize: 10, color: theme.palette.neutralSecondary, marginLeft: 4, cursor: 'pointer' } }} onClick={(e) => { e.stopPropagation(); removeFilterChip('commitment'); }} />
              </span>
            )}
            {appliedFilterChips.has('region') && (
              <span ref={regionChipRef} className={classNames.filterChip} onClick={() => setActiveFilterChip(activeFilterChip === 'region' ? null : 'region')}>
                Region(s): <strong>{regionFilterVals.length === 0 ? 'All' : regionFilterVals.join(', ')}</strong>
                <Icon iconName="ChevronDown" styles={{ root: { fontSize: 10, color: theme.palette.neutralSecondary } }} />
                <Icon iconName="Cancel" styles={{ root: { fontSize: 10, color: theme.palette.neutralSecondary, marginLeft: 4, cursor: 'pointer' } }} onClick={(e) => { e.stopPropagation(); removeFilterChip('region'); }} />
              </span>
            )}
            {appliedFilterChips.has('tenant') && (
              <span ref={tenantChipRef} className={classNames.filterChip} onClick={() => setActiveFilterChip(activeFilterChip === 'tenant' ? null : 'tenant')}>
                Tenant(s): <strong>{tenantFilterVals.length === 0 ? 'All' : tenantFilterVals.map((k) => TENANT_OPTIONS.find((t) => t.key === k)?.text || k).join(', ')}</strong>
                <Icon iconName="ChevronDown" styles={{ root: { fontSize: 10, color: theme.palette.neutralSecondary } }} />
                <Icon iconName="Cancel" styles={{ root: { fontSize: 10, color: theme.palette.neutralSecondary, marginLeft: 4, cursor: 'pointer' } }} onClick={(e) => { e.stopPropagation(); removeFilterChip('tenant'); }} />
              </span>
            )}
          </Stack>
        )}

        {/* Filter chip callouts */}
        {activeFilterChip === 'productType' && productTypeChipRef.current && (
          <Callout target={productTypeChipRef.current} onDismiss={() => setActiveFilterChip(null)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false}>
            <Stack tokens={{ childrenGap: 4 }} styles={{ root: { padding: 8, width: 200 } }}>
              {['RI and ASP', 'RI', 'ASP'].map((val) => (
                <Checkbox
                  key={val}
                  label={val === 'RI and ASP' ? 'All (RI and ASP)' : val === 'RI' ? 'Reserved Instances (RI)' : 'Azure Savings Plan (ASP)'}
                  checked={productTypeFilter === val}
                  onChange={() => { setProductTypeFilter(val); setActiveFilterChip(null); }}
                  styles={{ root: { padding: '4px 0' } }}
                />
              ))}
            </Stack>
          </Callout>
        )}
        {activeFilterChip === 'productFamily' && productFamilyChipRef.current && (
          <Callout target={productFamilyChipRef.current} onDismiss={() => setActiveFilterChip(null)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false}>
            <Stack tokens={{ childrenGap: 4 }} styles={{ root: { padding: 8, width: 240 } }}>
              {['All', 'System Center Endpoint Protection', 'Azure Compute', 'Azure Database', 'Azure Storage'].map((val) => (
                <Checkbox
                  key={val}
                  label={val === 'All' ? '(Select all)' : val}
                  checked={val === 'All' ? productFamilyFilter.includes('All') : productFamilyFilter.includes(val)}
                  onChange={() => {
                    if (val === 'All') { setProductFamilyFilter(['All']); }
                    else {
                      setProductFamilyFilter((prev) => {
                        const filtered = prev.filter((f) => f !== 'All');
                        if (filtered.includes(val)) {
                          const next = filtered.filter((f) => f !== val);
                          return next.length === 0 ? ['All'] : next;
                        }
                        return [...filtered, val];
                      });
                    }
                  }}
                  styles={{ root: { padding: '4px 0' } }}
                />
              ))}
            </Stack>
          </Callout>
        )}
        {activeFilterChip === 'commitment' && commitmentChipRef.current && (
          <Callout target={commitmentChipRef.current} onDismiss={() => setActiveFilterChip(null)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false}>
            <Stack tokens={{ childrenGap: 4 }} styles={{ root: { padding: 8, width: 160 } }}>
              {['All', '1 Year', '3 Year'].map((val) => (
                <Checkbox
                  key={val}
                  label={val === 'All' ? '(Select all)' : val}
                  checked={commitmentFilterVal === val}
                  onChange={() => { setCommitmentFilterVal(val); setActiveFilterChip(null); }}
                  styles={{ root: { padding: '4px 0' } }}
                />
              ))}
            </Stack>
          </Callout>
        )}
        {activeFilterChip === 'region' && regionChipRef.current && (
          <Callout target={regionChipRef.current} onDismiss={() => setActiveFilterChip(null)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false}>
            {(() => {
              const allRegionKeys = REGION_GROUPS.flatMap((g) => g.children.map((c) => c.key));
              const allSelected = allRegionKeys.every((k) => regionFilterVals.includes(k));
              return (
                <div style={{ width: 320, maxHeight: 360, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
                    <div style={{ padding: '4px 8px' }}>
                      <Checkbox
                        label="(Select all)"
                        checked={regionFilterVals.length === 0 || allSelected}
                        onChange={() => { setRegionFilterVals([]); }}
                        styles={{ label: { fontWeight: 600, fontSize: 13 } }}
                      />
                    </div>
                    {REGION_GROUPS.map((group) => {
                      const groupKeys = group.children.map((c) => c.key);
                      const groupAllSelected = groupKeys.every((k) => regionFilterVals.includes(k));
                      const groupSomeSelected = !groupAllSelected && groupKeys.some((k) => regionFilterVals.includes(k));
                      return (
                        <div key={group.key}>
                          <div style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', backgroundColor: theme.palette.neutralLighterAlt }}>
                            <Icon
                              iconName="ChevronDown"
                              styles={{ root: { fontSize: 10, marginRight: 6, color: theme.palette.neutralSecondary } }}
                            />
                            <Checkbox
                              label={group.text}
                              checked={groupAllSelected}
                              indeterminate={groupSomeSelected}
                              onChange={() => {
                                if (groupAllSelected) {
                                  setRegionFilterVals((prev) => prev.filter((k) => !groupKeys.includes(k)));
                                } else {
                                  setRegionFilterVals((prev) => [...new Set([...prev, ...groupKeys])]);
                                }
                              }}
                              styles={{ root: { flex: 1 }, label: { fontWeight: 600, fontSize: 13 } }}
                            />
                          </div>
                          {group.children.map((child) => (
                            <div key={child.key} style={{ padding: '3px 12px 3px 32px' }}>
                              <Checkbox
                                label={child.text}
                                checked={regionFilterVals.includes(child.key)}
                                onChange={() => {
                                  setRegionFilterVals((prev) => prev.includes(child.key) ? prev.filter((r) => r !== child.key) : [...prev, child.key]);
                                }}
                                styles={{ label: { fontSize: 13 } }}
                              />
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '8px 12px', borderTop: `1px solid ${theme.palette.neutralLight}` }}>
                    <DefaultButton text="Clear" onClick={() => { setRegionFilterVals([]); setActiveFilterChip(null); }} styles={{ root: { minWidth: 60, height: 28 } }} />
                    <PrimaryButton text="Done" onClick={() => setActiveFilterChip(null)} styles={{ root: { minWidth: 60, height: 28 } }} />
                  </div>
                </div>
              );
            })()}
          </Callout>
        )}
        {activeFilterChip === 'tenant' && tenantChipRef.current && (
          <Callout target={tenantChipRef.current} onDismiss={() => setActiveFilterChip(null)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false}>
            <Stack tokens={{ childrenGap: 4 }} styles={{ root: { padding: 8, width: 220, maxHeight: 320, overflowY: 'auto' } }}>
              <SearchBox placeholder="Search tenants" styles={{ root: { marginBottom: 4 } }} />
              <Checkbox
                label="(Select all)"
                checked={tenantFilterVals.length === 0}
                onChange={() => { setTenantFilterVals([]); }}
                styles={{ root: { padding: '4px 0' } }}
              />
              {availableTenants.map((key) => {
                const opt = TENANT_OPTIONS.find((t) => t.key === key);
                const label = opt?.text || key;
                return (
                  <Checkbox
                    key={key}
                    label={label}
                    checked={tenantFilterVals.includes(key)}
                    onChange={() => {
                      setTenantFilterVals((prev) => prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]);
                    }}
                    styles={{ root: { padding: '4px 0' } }}
                  />
                );
              })}
            </Stack>
          </Callout>
        )}
        {/* Filter Panel - right overlay */}
        <Panel
          isOpen={isFilterPanelOpen}
          onDismiss={() => setIsFilterPanelOpen(false)}
          type={PanelType.smallFixedFar}
          headerText="Filters"
          isFooterAtBottom
          onRenderFooterContent={() => (
            <Stack horizontal tokens={{ childrenGap: 8 }}>
              <PrimaryButton text="Apply" onClick={applyFilters} styles={{ root: { minWidth: 60 } }} />
              <DefaultButton text="Clear all" onClick={() => { setCommitmentFilterVal('All'); setRegionFilterVals([]); setTenantFilterVals([]); setProductTypeFilter('RI and ASP'); setProductFamilyFilter(['All']); setAppliedFilterChips(new Set()); setIsFilterPanelOpen(false); }} styles={{ root: { minWidth: 60 } }} />
            </Stack>
          )}
        >
          <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 8 } }}>
            <Stack tokens={{ childrenGap: 4 }}>
              <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Product Type</Text>
              <ChoiceGroup
                selectedKey={pendingProductType}
                options={[
                  { key: 'RI', text: 'Reserved Instances (RI)' },
                  { key: 'ASP', text: 'Azure Savings Plan (ASP)' },
                  { key: 'RI and ASP', text: 'RI and ASP' },
                ]}
                onChange={(_, opt) => { if (opt) setPendingProductType(opt.key); }}
              />
            </Stack>
            <Stack tokens={{ childrenGap: 4 }}>
              <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Product Family</Text>
              <Checkbox
                label="(Select all)"
                checked={pendingProductFamily.includes('All')}
                onChange={(_, checked) => {
                  setPendingProductFamily(checked ? ['All'] : []);
                }}
                styles={{ label: { fontWeight: 600 } }}
              />
              {['System Center Endpoint Protection', 'Azure Compute', 'Azure Database', 'Azure Storage'].map((fam) => (
                <Checkbox
                  key={fam}
                  label={fam}
                  checked={pendingProductFamily.includes(fam) || pendingProductFamily.includes('All')}
                  onChange={(_, checked) => {
                    setPendingProductFamily((prev) => {
                      if (checked) return prev.filter(f => f !== 'All').concat(fam);
                      const next = prev.filter((f) => f !== fam && f !== 'All');
                      return next.length === 0 ? ['All'] : next;
                    });
                  }}
                />
              ))}
            </Stack>
            <Stack tokens={{ childrenGap: 4 }}>
              <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Commitment Duration</Text>
              <ChoiceGroup
                selectedKey={pendingCommitment}
                options={[
                  { key: 'All', text: '(Select all)' },
                  { key: '1 Year', text: '1 Year' },
                  { key: '3 Years', text: '3 Year' },
                ]}
                onChange={(_, opt) => { if (opt) setPendingCommitment(opt.key); }}
              />
            </Stack>
            <Stack tokens={{ childrenGap: 4 }}>
              <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Region(s)</Text>
              <RegionMultiSelect
                selectedKeys={pendingRegions}
                onChange={(keys) => setPendingRegions(keys)}
                placeholder="All regions"
              />
            </Stack>
            <Stack tokens={{ childrenGap: 4 }}>
              <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Tenant(s)</Text>
              <Dropdown
                selectedKeys={pendingTenants}
                multiSelect
                options={[
                  { key: '__select_all__', text: '(Select all)' },
                  ...availableTenants.map((k) => ({ key: k, text: TENANT_OPTIONS.find((t) => t.key === k)?.text || k })),
                ]}
                onChange={(_, opt) => {
                  if (!opt) return;
                  if (opt.key === '__select_all__') {
                    setPendingTenants(opt.selected ? [...availableTenants] : []);
                  } else {
                    setPendingTenants((prev) =>
                      opt.selected ? [...prev, opt.key as string] : prev.filter((k) => k !== opt.key)
                    );
                  }
                }}
                placeholder="All tenants"
              />
            </Stack>
          </Stack>
        </Panel>

        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Text variant="small" styles={{ root: { color: theme.semanticColors.bodySubtext, padding: '4px 0' } }}>
            {mode === 'editing'
              ? `Editing ${checkedIds.size} of ${filteredProducts.length} items | Grouped by Amendment Code`
              : `Showing ${Math.min(pageStart + PAGE_SIZE, filteredProducts.length)} of ${filteredProducts.length} items | Grouped by Amendment Code`}
          </Text>
          <IconButton
            iconProps={{ iconName: 'Info' }}
            title="View product details"
            onClick={() => setShowDetailsPanel((prev) => !prev)}
            styles={{
              root: {
                color: showDetailsPanel ? theme.palette.themePrimary : theme.palette.neutralSecondary,
              },
            }}
          />
        </Stack>
      </Stack>

      {/* Grid + Details pane — this is the scrollable area */}
      <div className={classNames.gridAndDetailsWrapper}>
        <div className={classNames.gridArea}>
          <style>{`
            .grid-align-fix [role="columnheader"][data-is-focusable="false"]:empty {
              display: none !important;
            }
          `}</style>
          <div className={`${classNames.tableWrapper} grid-align-fix`} style={{ overflowX: hasExtraColumnsVisible ? 'auto' : 'hidden' }}>
            <DetailsList
              items={sortedItems}
              columns={visibleColumns}
              groups={groups}
              indentWidth={0}
              selectionMode={SelectionMode.none}
              checkboxVisibility={CheckboxVisibility.hidden}
              layoutMode={hasExtraColumnsVisible ? DetailsListLayoutMode.fixedColumns : DetailsListLayoutMode.justified}
              getKey={(item) => (item as IAddedProduct).id}
              onRenderRow={(props, defaultRender) => {
                if (!props || !defaultRender) return null;
                return defaultRender({ ...props, styles: { root: { minHeight: 36 }, cell: { minHeight: 36, alignSelf: 'center', overflow: 'hidden' } } });
              }}
              styles={{
                root: { overflow: 'hidden', minWidth: hasExtraColumnsVisible ? 1400 : undefined },
                headerWrapper: {
                  position: 'sticky',
                  top: 0,
                  zIndex: 100,
                  backgroundColor: theme.palette.white,
                },
              }}
              onRenderDetailsHeader={(headerProps, defaultRender) => {
                if (!headerProps || !defaultRender) return null;
                return defaultRender({ ...headerProps, styles: { root: { paddingTop: 0 } } });
              }}
              groupProps={{
                showEmptyGroups: true,
                collapseAllVisibility: CollapseAllVisibility.hidden,
                onRenderHeader: (props) => {
                  if (!props || !props.group) return null;
                  const group = props.group;
                  const groupItems = sortedItems.slice(group.startIndex, group.startIndex + group.count);
                  const allChecked = groupItems.length > 0 && groupItems.every((p) => checkedIds.has(p.id));
                  const someChecked = !allChecked && groupItems.some((p) => checkedIds.has(p.id));
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '6px 0', paddingLeft: 8, borderBottom: `1px solid ${theme.palette.neutralLight}`, backgroundColor: theme.palette.neutralLighterAlt }}>
                      <Checkbox
                        checked={allChecked}
                        indeterminate={someChecked}
                        onChange={() => {
                          setCheckedIds((prev) => {
                            const next = new Set(prev);
                            if (allChecked) {
                              groupItems.forEach((p) => next.delete(p.id));
                            } else {
                              groupItems.forEach((p) => next.add(p.id));
                            }
                            return next;
                          });
                        }}
                        styles={{ root: { marginLeft: 0 } }}
                      />
                      <Icon iconName={group.isCollapsed ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 12, cursor: 'pointer', marginLeft: 8, marginRight: 8 } }} onClick={() => props.onToggleCollapse?.(group)} />
                      <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>{group.name}</Text>
                    </div>
                  );
                },
              }}
            />
          </div>
          {/* Pagination — inside grid area so it moves with the grid */}
          <div className={classNames.paginationBar}>
            <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }}>
              Page {currentPage + 1} of {totalPages}
            </Text>
            <Stack horizontal tokens={{ childrenGap: 4 }}>
              <DefaultButton text="Previous" disabled={currentPage === 0} onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} styles={{ root: { minWidth: 80 } }} />
              <DefaultButton text="Next" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))} styles={{ root: { minWidth: 80 } }} />
            </Stack>
          </div>
        </div>
        {renderDetailsPane()}
      </div>

      {/* Bulk Edit Panel */}
      <Panel
        isOpen={isBulkEditOpen}
        onDismiss={() => { setIsBulkEditOpen(false); setBulkEditValues({}); setBulkStartCustom(false); setBulkEndCustom(false); }}
        type={PanelType.smallFixedFar}
        headerText="Bulk edit values"
        isFooterAtBottom
        onRenderFooterContent={() => (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton text="Apply" onClick={handleBulkEditApply} />
            <DefaultButton text="Reset" onClick={() => setBulkEditValues({})} />
          </Stack>
        )}
      >
        <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 8 } }}>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Region</Text>
            <RegionMultiSelect
              selectedKeys={bulkEditValues.regions || []}
              onChange={(keys) => setBulkEditValues((v) => ({ ...v, regions: keys }))}
              placeholder="Select region"
            />
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Commitment</Text>
            <ChoiceGroup
              selectedKey={bulkEditValues.commitment || ''}
              options={[
                { key: '1 Year', text: '1 year' } as IChoiceGroupOption,
                { key: '3 Years', text: '3 years' } as IChoiceGroupOption,
              ]}
              onChange={(_, opt) => setBulkEditValues((v) => ({ ...v, commitment: opt?.key as string }))}
            />
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Discount %</Text>
            <TextField placeholder="Enter value in %" value={bulkEditValues.discountPercent !== undefined ? String(bulkEditValues.discountPercent) : ''} onChange={(_, val) => { const num = parseFloat(val || ''); setBulkEditValues((v) => ({ ...v, discountPercent: isNaN(num) ? undefined : num })); }} />
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Start Date</Text>
            <div ref={bulkStartDateRef}>
              <Dropdown
                placeholder="Select date"
                selectedKey={bulkStartCustom ? 'custom' : (bulkEditValues.startDate ? 'custom' : ((bulkEditValues as Record<string, unknown>).startDatePreset as string || ''))}
                options={START_DATE_OPTIONS}
                onChange={(_, opt) => {
                  if (opt?.key === 'custom') {
                    setBulkStartCustom(true);
                    setBulkEditValues((v) => ({ ...v, startDate: undefined, startDatePreset: undefined }));
                  } else {
                    setBulkStartCustom(false);
                    setBulkEditValues((v) => ({ ...v, startDate: undefined, startDatePreset: opt?.key as string } as IBulkEditValues));
                  }
                }}
                onRenderTitle={() => {
                  if (bulkEditValues.startDate) {
                    return <span>{bulkEditValues.startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>;
                  }
                  const preset = (bulkEditValues as Record<string, unknown>).startDatePreset as string;
                  if (preset === 'At order acceptance') return <span>At order acceptance</span>;
                  if (bulkStartCustom) return <span>On specific date</span>;
                  return <span style={{ color: '#666' }}>Select date</span>;
                }}
              />
            </div>
            {bulkStartCustom && bulkStartDateRef.current && (
              <Callout
                target={bulkStartDateRef.current}
                onDismiss={() => setBulkStartCustom(false)}
                directionalHint={DirectionalHint.bottomLeftEdge}
                isBeakVisible={false}
                styles={{ root: { zIndex: 1000002 } }}
              >
                <Calendar
                  value={bulkEditValues.startDate}
                  onSelectDate={(date) => { setBulkEditValues((v) => ({ ...v, startDate: date || undefined })); setBulkStartCustom(false); }}
                  showGoToToday
                />
              </Callout>
            )}
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>End Date</Text>
            <div ref={bulkEndDateRef}>
              {(() => {
                const commitment = bulkEditValues.commitment;
                const filteredDurations = ALL_DURATION_OPTIONS.filter((d) => {
                  if (!commitment) return true;
                  const months = parseDurationMonths(d.key);
                  if (commitment === '1 Year') return months <= 12;
                  if (commitment === '3 Years') return months <= 36;
                  return true;
                });
                const endDateOpts: IDropdownOption[] = [
                  { key: 'header', text: 'Duration', itemType: DropdownMenuItemType.Header },
                  ...filteredDurations,
                  { key: 'divider', text: '-', itemType: DropdownMenuItemType.Divider },
                  { key: 'custom', text: 'On specific date' },
                ];
                return (
                  <Dropdown
                    placeholder="Select date"
                    selectedKey={bulkEndCustom ? 'custom' : (bulkEditValues.endDate ? 'custom' : ((bulkEditValues as Record<string, unknown>).endDateDuration as string || ''))}
                    options={endDateOpts}
                    onChange={(_, opt) => {
                      if (opt?.key === 'custom') {
                        setBulkEndCustom(true);
                        setBulkEditValues((v) => ({ ...v, endDate: undefined, endDateDuration: undefined }));
                      } else if (opt && DURATION_KEYS.has(opt.key as string)) {
                        setBulkEndCustom(false);
                        setBulkEditValues((v) => ({ ...v, endDate: undefined, endDateDuration: opt.key as string } as IBulkEditValues));
                      }
                    }}
                    onRenderTitle={() => {
                      if (bulkEditValues.endDate) {
                        return <span>{bulkEditValues.endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>;
                      }
                      if ((bulkEditValues as Record<string, unknown>).endDateDuration) {
                        return <span>{(bulkEditValues as Record<string, unknown>).endDateDuration as string}</span>;
                      }
                      if (bulkEndCustom) return <span>On specific date</span>;
                      return <span style={{ color: '#666' }}>Select date</span>;
                    }}
                  />
                );
              })()}
            </div>
            {bulkEndCustom && bulkEndDateRef.current && (
              <Callout
                target={bulkEndDateRef.current}
                onDismiss={() => setBulkEndCustom(false)}
                directionalHint={DirectionalHint.bottomLeftEdge}
                isBeakVisible={false}
                styles={{ root: { zIndex: 1000002 } }}
              >
                <Calendar
                  value={bulkEditValues.endDate}
                  onSelectDate={(date) => { setBulkEditValues((v) => ({ ...v, endDate: date || undefined, endDateDuration: undefined })); setBulkEndCustom(false); }}
                  showGoToToday
                  maxDate={(() => {
                    const commitment = bulkEditValues.commitment;
                    if (!commitment) return undefined;
                    const startDate = bulkEditValues.startDate || ((bulkEditValues as Record<string, unknown>).startDatePreset === 'At order acceptance' ? new Date() : undefined);
                    if (!startDate) return undefined;
                    const max = new Date(startDate);
                    if (commitment === '1 Year') max.setFullYear(max.getFullYear() + 1);
                    else if (commitment === '3 Years') max.setFullYear(max.getFullYear() + 3);
                    return max;
                  })()}
                />
              </Callout>
            )}
          </Stack>
        </Stack>
      </Panel>

      {/* Delete dialog */}
      <Dialog hidden={deleteDialogHidden} onDismiss={() => setDeleteDialogHidden(true)} dialogContentProps={{ type: DialogType.normal, title: 'Delete Products', subText: `Are you sure you want to delete ${checkedIds.size} selected product(s)?` }}>
        <DialogFooter>
          <PrimaryButton text="Delete" onClick={handleDelete} />
          <DefaultButton text="Cancel" onClick={() => setDeleteDialogHidden(true)} />
        </DialogFooter>
      </Dialog>

      {/* SKU Reset Warning Dialog */}
      <Dialog
        hidden={!skuResetWarningOpen}
        onDismiss={handleSkuResetCancel}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'SKU configuration will be reset',
          subText: skuResetProductIds.length > 0
            ? `Changing the region or commitment duration will remove all selected SKUs for ${products.find(p => p.id === skuResetProductIds[0])?.productDetails || 'this product'}. You'll need to configure the SKUs again.`
            : 'SKU configuration will be reset.',
        }}
      >
        <DialogFooter>
          <PrimaryButton text="Continue" onClick={handleSkuResetContinue} />
          <DefaultButton text="Cancel" onClick={handleSkuResetCancel} />
        </DialogFooter>
      </Dialog>

      {/* Edit SKUs Panel */}
      <Panel
        isOpen={!!editSkuProductId}
        onDismiss={() => setEditSkuProductId(null)}
        type={PanelType.custom}
        customWidth="900px"
        headerText={editSkuProduct ? `Edit SKUs | ${editSkuProduct.productDetails}` : ''}
        closeButtonAriaLabel="Close"
        isFooterAtBottom
        styles={{
          content: { paddingTop: 16 },
          header: { paddingBottom: 0 },
          scrollableContent: { display: 'flex', flexDirection: 'column', height: '100%' },
        }}
        onRenderFooterContent={() => (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton text="Save" onClick={handleSkuApply} />
            <DefaultButton text="Cancel" onClick={() => setEditSkuProductId(null)} />
          </Stack>
        )}
      >
        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { height: '100%', display: 'flex', flexDirection: 'column' } }}>
          <Text styles={{ root: { fontSize: 13, lineHeight: '20px', color: theme.palette.neutralSecondary, marginBottom: 8 } }}>
            Select the SKUs that you want to configure as a part of the product. Once you are done with selecting and editing the SKUs (if required), click on apply.
          </Text>

          {skuBulkSuccessMsg && (
            <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSkuBulkSuccessMsg(false)} dismissButtonAriaLabel="Close">
              Bulk changes saved successfully!
            </MessageBar>
          )}

          <MessageBar messageBarType={MessageBarType.info} styles={{ root: { fontSize: 12 } }}>
            By default, SKU discount, start date, and end date are inherited from the parent product. You can override these values by entering new ones in the respective fields.
          </MessageBar>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', marginBottom: 4 }}>
            <div ref={skuBulkBtnRef}>
              <ActionButton
                iconProps={{ iconName: 'Edit' }}
                text="Bulk edit"
                disabled={skuChecked.size === 0}
                onClick={() => setSkuBulkEditOpen((prev) => !prev)}
                styles={{
                  root: {
                    fontSize: 12,
                    backgroundColor: skuBulkEditOpen ? theme.palette.neutralLight : undefined,
                    color: skuBulkEditOpen ? theme.palette.themePrimary : undefined,
                  },
                }}
              />
            </div>
            <ActionButton
              iconProps={{ iconName: 'Refresh' }}
              text="Reset to default"
              disabled={!skuHasEdits}
              onClick={handleSkuResetToDefault}
              styles={{ root: { fontSize: 12 } }}
            />
            <Stack.Item grow={1}><span /></Stack.Item>
            <SearchBox
              placeholder="Search"
              value={skuSearchQuery}
              onChange={(_, val) => setSkuSearchQuery(val || '')}
              onClear={() => setSkuSearchQuery('')}
              styles={{ root: { width: 300 } }}
            />
          </div>

          {/* SKU Grid + floating bulk edit overlay */}
          <div style={{ position: 'relative', flex: 1, overflow: 'visible', display: 'flex', flexDirection: 'column' }}>
            {/* Bulk edit popup — absolutely positioned over the grid, inside Panel DOM */}
            {skuBulkEditOpen && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 100,
                background: theme.palette.white,
                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                border: `1px solid ${theme.palette.neutralLight}`,
                borderRadius: 2,
                padding: 16,
                width: 320,
                overflow: 'visible',
              }}>
                <Stack tokens={{ childrenGap: 12 }}>
                  <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>Edit the values for selected SKUs</Text>
                  <TextField
                    label="Discount %"
                    placeholder="Enter value in %"
                    value={skuBulkDiscount}
                    onChange={(_, val) => setSkuBulkDiscount(val || '')}
                    type="number"
                    styles={{ fieldGroup: { height: 32 }, field: { fontSize: 12 } }}
                  />
                  <div ref={skuBulkStartDateRef} style={{ position: 'relative' }}>
                    <Dropdown
                      label="Start date"
                      placeholder="Select date"
                      selectedKey={skuBulkStartDate === 'At order acceptance' ? 'At order acceptance' : skuBulkStartDate ? 'On specific date' : undefined}
                      options={SKU_START_DATE_OPTIONS}
                      onChange={(_, opt) => {
                        if (!opt) return;
                        if (opt.key === 'On specific date') { setSkuBulkStartCalOpen(true); }
                        else { setSkuBulkStartDate(opt.key as string); setSkuBulkStartCalOpen(false); }
                      }}
                      onRenderTitle={() => <span style={{ fontSize: 12 }}>{skuBulkStartDate || 'Select date'}</span>}
                      styles={{ dropdown: { fontSize: 12 } }}
                    />
                    {skuBulkStartCalOpen && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 200, background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', border: `1px solid ${theme.palette.neutralLight}`, borderRadius: 2 }}>
                        <Calendar onSelectDate={(date) => { if (date) { setSkuBulkStartDate(date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })); setSkuBulkStartCalOpen(false); } }} />
                      </div>
                    )}
                  </div>
                  <div ref={skuBulkEndDateRef} style={{ position: 'relative' }}>
                    <Dropdown
                      label="End date"
                      placeholder="Select date"
                      selectedKey={skuBulkEndDate && DURATION_KEYS.has(skuBulkEndDate) ? skuBulkEndDate : skuBulkEndDate ? 'On specific date' : undefined}
                      options={skuEndDateOptions}
                      onChange={(_, opt) => {
                        if (!opt) return;
                        if (opt.key === 'On specific date') { setSkuBulkEndCalOpen(true); }
                        else { setSkuBulkEndDate(opt.key as string); setSkuBulkEndCalOpen(false); }
                      }}
                      onRenderTitle={() => <span style={{ fontSize: 12 }}>{skuBulkEndDate || 'Select date'}</span>}
                      styles={{ dropdown: { fontSize: 12 } }}
                    />
                    {skuBulkEndCalOpen && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 200, background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', border: `1px solid ${theme.palette.neutralLight}`, borderRadius: 2 }}>
                        <Calendar onSelectDate={(date) => { if (date) { setSkuBulkEndDate(date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })); setSkuBulkEndCalOpen(false); } }} />
                      </div>
                    )}
                  </div>
                  <Text styles={{ root: { fontSize: 11, color: theme.palette.neutralSecondary, fontStyle: 'italic' } }}>
                    The input values apply only to the selected row item(s). If you do not wish to add a value in a field in bulk, you can skip it.
                  </Text>
                  <Stack horizontal tokens={{ childrenGap: 8 }}>
                    <PrimaryButton text="Apply" onClick={handleSkuBulkEditApply} styles={{ root: { minWidth: 70 } }} />
                    <DefaultButton text="Cancel" onClick={() => setSkuBulkEditOpen(false)} styles={{ root: { minWidth: 70 } }} />
                  </Stack>
                </Stack>
              </div>
            )}

            {/* SKU Grid scrollable area */}
            <div style={{ overflow: 'auto', flex: 1 }}>
            {/* Column Header Row */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${theme.palette.neutralLight}` }}>
              <div style={{ width: 36, flexShrink: 0, paddingLeft: 4 }}>
                <Checkbox
                  checked={editSkuProduct ? (editSkuProduct.skus || []).length > 0 && (editSkuProduct.skus || []).every((s) => skuChecked.has(s.id)) : false}
                  indeterminate={editSkuProduct ? !((editSkuProduct.skus || []).every((s) => skuChecked.has(s.id))) && (editSkuProduct.skus || []).some((s) => skuChecked.has(s.id)) : false}
                  onChange={() => {
                    if (!editSkuProduct || !editSkuProduct.skus) return;
                    const allChecked = editSkuProduct.skus.every((s) => skuChecked.has(s.id));
                    setSkuChecked((prev) => {
                      const next = new Set(prev);
                      if (allChecked) editSkuProduct.skus!.forEach((s) => next.delete(s.id));
                      else editSkuProduct.skus!.forEach((s) => next.add(s.id));
                      return next;
                    });
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 600, paddingLeft: 8 }}>Product description</div>
              <div style={{ width: 120, flexShrink: 0, fontSize: 12, fontWeight: 600, paddingLeft: 8 }}>Discount %</div>
              <div style={{ width: 160, flexShrink: 0, fontSize: 12, fontWeight: 600, paddingLeft: 12 }}>Start Date</div>
              <div style={{ width: 160, flexShrink: 0, fontSize: 12, fontWeight: 600, paddingLeft: 12 }}>End Date</div>
            </div>

            {Array.from(skusByRegion.entries()).map(([region, skus]) => {
              const allChecked = skus.every((s) => skuChecked.has(s.id));
              const someChecked = !allChecked && skus.some((s) => skuChecked.has(s.id));
              return (
                <div key={region}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${theme.palette.neutralLight}` }}>
                    <div style={{ width: 36, flexShrink: 0, paddingLeft: 4 }}>
                      <Checkbox
                        checked={allChecked}
                        indeterminate={someChecked}
                        onChange={() => {
                          setSkuChecked((prev) => {
                            const next = new Set(prev);
                            if (allChecked) skus.forEach((s) => next.delete(s.id));
                            else skus.forEach((s) => next.add(s.id));
                            return next;
                          });
                        }}
                      />
                    </div>
                    <Icon iconName="ChevronDown" styles={{ root: { fontSize: 12, marginRight: 8 } }} />
                    <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>{region}</Text>
                  </div>
                  {skus.map((sku) => (
                    <div key={sku.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${theme.palette.neutralLighterAlt}` }}>
                      <div style={{ width: 36, flexShrink: 0, paddingLeft: 4 }}>
                        <Checkbox
                          checked={skuChecked.has(sku.id)}
                          onChange={() => { setSkuChecked((prev) => { const next = new Set(prev); if (next.has(sku.id)) next.delete(sku.id); else next.add(sku.id); return next; }); }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 12, paddingLeft: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sku.skuType}, {sku.region}, {sku.commitment}
                      </div>
                      <div style={{ width: 120, flexShrink: 0, paddingLeft: 8 }}>
                        <TextField
                          value={String(skuEdits.get(sku.id)?.discountPercent ?? sku.discountPercent)}
                          onChange={(_, val) => { const n = parseFloat(val || '0'); if (!isNaN(n) && n >= 0 && n <= 100) handleSkuEdit(sku.id, 'discountPercent', n); }}
                          styles={{ root: { width: 80 }, fieldGroup: { height: 28, borderColor: theme.palette.neutralTertiaryAlt }, field: { fontSize: 12 } }}
                          type="number"
                        />
                      </div>
                      <div style={{ width: 160, flexShrink: 0, paddingLeft: 12 }} ref={(el) => { if (el) skuStartDateRefs.current.set(sku.id, el); }}>
                        <Dropdown
                          selectedKey={((skuEdits.get(sku.id)?.startDate ?? sku.startDate) as string) === 'At order acceptance' ? 'At order acceptance' : 'On specific date'}
                          options={SKU_START_DATE_OPTIONS}
                          onChange={(_, opt) => {
                            if (opt?.key === 'At order acceptance') handleSkuEdit(sku.id, 'startDate', 'At order acceptance');
                            else if (opt?.key === 'On specific date') setSkuStartDateCalendarOpen(sku.id);
                          }}
                          onRenderTitle={() => <span style={{ fontSize: 12 }}>{(skuEdits.get(sku.id)?.startDate ?? sku.startDate) as string || 'Select'}</span>}
                          styles={skuDropdownStyles}
                        />
                        {skuStartDateCalendarOpen === sku.id && skuStartDateRefs.current.get(sku.id) && (
                          <Callout target={skuStartDateRefs.current.get(sku.id)} onDismiss={() => setSkuStartDateCalendarOpen(null)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false} styles={{ root: { zIndex: 1000002 } }}>
                            <Calendar onSelectDate={(date) => { if (date) { handleSkuEdit(sku.id, 'startDate', date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })); setSkuStartDateCalendarOpen(null); } }} />
                          </Callout>
                        )}
                      </div>
                      <div style={{ width: 160, flexShrink: 0, paddingLeft: 12 }} ref={(el) => { if (el) skuEndDateRefs.current.set(sku.id, el); }}>
                        <Dropdown
                          selectedKey={(() => { const v = (skuEdits.get(sku.id)?.endDate ?? sku.endDate) as string; return DURATION_KEYS.has(v) ? v : skuEndDateOptions.some((o) => o.key === v && o.itemType !== DropdownMenuItemType.Divider && o.itemType !== DropdownMenuItemType.Header) ? v : 'On specific date'; })()}
                          options={skuEndDateOptions}
                          onChange={(_, opt) => {
                            if (!opt) return;
                            if (opt.key === 'On specific date') setSkuEndDateCalendarOpen(sku.id);
                            else if (DURATION_KEYS.has(opt.key as string)) {
                              const skuStart = (skuEdits.get(sku.id)?.startDate ?? sku.startDate) as string;
                              const computed = computeEndDateFromDuration(skuStart, opt.key as string);
                              handleSkuEdit(sku.id, 'endDate', computed);
                            }
                          }}
                          onRenderTitle={() => <span style={{ fontSize: 12 }}>{(skuEdits.get(sku.id)?.endDate ?? sku.endDate) as string || 'Select'}</span>}
                          styles={skuDropdownStyles}
                        />
                        {skuEndDateCalendarOpen === sku.id && skuEndDateRefs.current.get(sku.id) && (
                          <Callout target={skuEndDateRefs.current.get(sku.id)} onDismiss={() => setSkuEndDateCalendarOpen(null)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false} styles={{ root: { zIndex: 1000002 } }}>
                            <Calendar onSelectDate={(date) => { if (date) { handleSkuEdit(sku.id, 'endDate', date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })); setSkuEndDateCalendarOpen(null); } }} />
                          </Callout>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          </div>
        </Stack>
      </Panel>

      {/* Columns Callout */}
      {isColumnsCalloutOpen && columnsBtnRef.current && (
        <Callout target={columnsBtnRef.current} onDismiss={() => setIsColumnsCalloutOpen(false)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false}>
          <Stack tokens={{ childrenGap: 8 }} styles={{ root: { padding: 16, width: 220 } }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>Show/Hide Columns</Text>
            <Checkbox
              label="Select all"
              checked={allColumnKeys.every((k) => !hiddenColumns.has(k))}
              indeterminate={allColumnKeys.some((k) => hiddenColumns.has(k)) && allColumnKeys.some((k) => !hiddenColumns.has(k))}
              onChange={(_, checked) => { setHiddenColumns(checked ? new Set() : new Set(allColumnKeys.filter((k) => k !== 'productDetails'))); }}
              styles={{ label: { fontWeight: 600 } }}
            />
            {allColumnKeys.map((colKey) => (
              <Checkbox key={colKey} label={columnLabels[colKey]} checked={!hiddenColumns.has(colKey)} disabled={colKey === 'productDetails'} onChange={(_, checked) => { setHiddenColumns((prev) => { const next = new Set(prev); if (checked) next.delete(colKey); else next.add(colKey); return next; }); }} />
            ))}
          </Stack>
        </Callout>
      )}
    </Stack>
  );
};
