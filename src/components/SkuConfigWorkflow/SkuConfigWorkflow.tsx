import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { PrimaryButton, DefaultButton, ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { DetailsList, IColumn, SelectionMode, IGroup, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption, DropdownMenuItemType } from '@fluentui/react/lib/Dropdown';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link } from '@fluentui/react/lib/Link';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { Calendar } from '@fluentui/react/lib/Calendar';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface ISku {
  id: string;
  skuType: string;
  region: string;
  commitment: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
}

interface IProduct {
  id: string;
  name: string;
  tenants: string;
  regions: string;
  commitment: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  amendmentCode: string;
  isConfigured: boolean;
  skus: ISku[];
  selectedSkuIds: Set<string>;
}

// --- Date options (matching product grid behavior) ---
const START_DATE_OPTIONS: IDropdownOption[] = [
  { key: 'At order acceptance', text: 'At order acceptance' },
  { key: 'divider', text: '-', itemType: DropdownMenuItemType.Divider },
  { key: 'On specific date', text: 'On specific date' },
];

const END_DATE_DURATION_OPTIONS: IDropdownOption[] = [
  { key: '3 months', text: '3 months' },
  { key: '6 months', text: '6 months' },
  { key: '9 months', text: '9 months' },
  { key: '1 year', text: '1 year' },
  { key: '18 months', text: '18 months' },
  { key: '2 years', text: '2 years' },
  { key: '3 years', text: '3 years' },
  { key: '5 years', text: '5 years' },
  { key: 'divider', text: '-', itemType: DropdownMenuItemType.Divider },
  { key: 'On specific date', text: 'On specific date' },
];

// --- Sample Data (from Figma) ---
const buildSkusForProduct = (regions: string[], commitment: string, discount: number, startDate: string, endDate: string): ISku[] => {
  const skuTypes = ['D64ads_v5', 'D32ads_v5', 'D16ads_v5'];
  const skus: ISku[] = [];
  regions.forEach((region) => {
    skuTypes.forEach((skuType) => {
      skus.push({
        id: `${skuType}-${region}-${commitment}`.replace(/\s/g, ''),
        skuType, region, commitment,
        discountPercent: discount, startDate, endDate,
      });
    });
  });
  return skus;
};

const INITIAL_PRODUCTS: IProduct[] = [
  {
    id: 'p1', name: 'Virtual Machines Dadsv5 Series', tenants: 'Tenant A, Tenant B, Tenant C, Tenant D +2',
    regions: 'US North, US West, US Central, Japan +2', commitment: '1 year', discountPercent: 2,
    startDate: 'May 21, 2026', endDate: 'May 21, 2027', amendmentCode: 'M919', isConfigured: true,
    skus: buildSkusForProduct(['US North', 'US West', 'US Central', 'Japan'], '1 year', 2, 'May 21, 2026', 'May 21, 2027'),
    selectedSkuIds: new Set(),
  },
  {
    id: 'p2', name: 'Virtual Machines Dadsv5 Series', tenants: 'Tenant A, Tenant B, Tenant C, Tenant D +2',
    regions: 'US South, US East, US Central, Japan +3', commitment: '3 years', discountPercent: 4,
    startDate: 'At order acceptance', endDate: 'May 21, 2029', amendmentCode: 'M919', isConfigured: true,
    skus: buildSkusForProduct(['US South', 'US East', 'US Central', 'Japan'], '3 years', 4, 'At order acceptance', 'May 21, 2029'),
    selectedSkuIds: new Set(),
  },
  {
    id: 'p3', name: 'Virtual Machines Dadsv5 Series', tenants: 'Tenant A, Tenant B +2',
    regions: '', commitment: '', discountPercent: 0, startDate: '', endDate: '',
    amendmentCode: 'M919', isConfigured: false, skus: [], selectedSkuIds: new Set(),
  },
  {
    id: 'p4', name: 'Virtual Machines Dadsv5 Series', tenants: 'Tenant A, Tenant B +2',
    regions: '', commitment: '', discountPercent: 0, startDate: '', endDate: '',
    amendmentCode: 'M919', isConfigured: false, skus: [], selectedSkuIds: new Set(),
  },
  {
    id: 'p5', name: 'Azure App Service Isolated Plan', tenants: 'Tenant A, ... +2',
    regions: '', commitment: '', discountPercent: 0, startDate: '', endDate: '',
    amendmentCode: 'M920', isConfigured: false, skus: [], selectedSkuIds: new Set(),
  },
  {
    id: 'p6', name: 'Azure App Service Isolated Plan - Linux', tenants: 'Tenant A, ... +2',
    regions: '', commitment: '', discountPercent: 0, startDate: '', endDate: '',
    amendmentCode: 'M920', isConfigured: false, skus: [], selectedSkuIds: new Set(),
  },
  {
    id: 'p7', name: 'Azure App Service Isolated v2 Plan', tenants: 'Tenant A, ... +2',
    regions: '', commitment: '', discountPercent: 0, startDate: '', endDate: '',
    amendmentCode: 'M920', isConfigured: false, skus: [], selectedSkuIds: new Set(),
  },
  {
    id: 'p8', name: 'Azure App Service Premium v3 Plan - Linux', tenants: 'Tenant A, ... +2',
    regions: '', commitment: '', discountPercent: 0, startDate: '', endDate: '',
    amendmentCode: 'M920', isConfigured: false, skus: [], selectedSkuIds: new Set(),
  },
];

// --- Styles ---
const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
    },
    navHeader: {
      backgroundColor: '#323130',
      height: 48,
      paddingLeft: 12,
      paddingRight: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0,
    },
    navText: {
      color: 'white',
      fontWeight: 600,
      fontSize: 14,
    },
    breadcrumb: {
      padding: '6px 24px',
      fontSize: 12,
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
      color: theme.palette.neutralSecondary,
      flexShrink: 0,
    },
    pageTitle: {
      padding: '10px 24px 0',
      flexShrink: 0,
    },
    body: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden',
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      minWidth: 0,
    },
    tabBar: {
      padding: '10px 24px 0',
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
      flexShrink: 0,
    },
    toolbar: {
      padding: '6px 24px',
      flexShrink: 0,
    },
    gridWrapper: {
      flex: 1,
      overflow: 'auto',
      padding: '0 8px',
    },
    statusBar: {
      padding: '6px 24px',
      fontSize: 12,
      color: theme.palette.neutralSecondary,
      borderTop: `1px solid ${theme.palette.neutralLight}`,
      flexShrink: 0,
    },
    footer: {
      padding: '10px 24px',
      borderTop: `1px solid ${theme.palette.neutralLight}`,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      flexShrink: 0,
    },
    detailsPanel: {
      borderLeft: `1px solid ${theme.palette.neutralLight}`,
      width: 320,
      flexShrink: 0,
      overflowY: 'auto' as const,
      backgroundColor: theme.palette.white,
    },
    detailsHeader: {
      padding: '14px 16px',
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
    },
    detailsBody: {
      padding: '10px 16px',
    },
    detailsSection: {
      marginBottom: 14,
    },
    detailsSectionTitle: {
      fontWeight: 600,
      fontSize: 13,
      marginBottom: 6,
    },
    detailsField: {
      marginBottom: 6,
    },
    detailsFieldLabel: {
      fontSize: 11,
      color: theme.palette.neutralSecondary,
      marginBottom: 1,
    },
    detailsFieldValue: {
      fontSize: 12,
      fontWeight: 600,
      wordBreak: 'break-word' as const,
    },
    skuItem: {
      fontSize: 11,
      lineHeight: '18px',
      padding: '6px 0',
      borderBottom: `1px solid ${theme.palette.neutralLighterAlt}`,
      wordBreak: 'break-word' as const,
      overflow: 'hidden',
    },
    editSkusLink: {
      fontSize: 11,
      cursor: 'pointer',
      display: 'block',
      marginTop: 2,
    },
    warningIcon: {
      color: '#FFB900',
      fontSize: 14,
      marginLeft: 4,
    },
    groupHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 0 8px 12px',
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
      backgroundColor: theme.palette.neutralLighterAlt,
    },
    panelDescription: {
      fontSize: 13,
      lineHeight: '20px',
      color: theme.palette.neutralSecondary,
      marginBottom: 8,
    },
    panelToolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 0',
      marginBottom: 4,
    },
    panelGrid: {
      overflow: 'auto',
      flex: 1,
    },
  })
);

const dropdownStyles = { root: { width: 140 }, dropdown: { minWidth: 0, borderColor: '#c8c6c4' }, dropdownItem: { fontSize: 12 }, dropdownItemSelected: { fontSize: 12 }, title: { fontSize: 12, height: 28, lineHeight: '26px', padding: '0 28px 0 8px', borderColor: '#c8c6c4' }, caretDownWrapper: { height: 28, lineHeight: '28px' } };

// --- Component ---
export const SkuConfigWorkflow: React.FC = () => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const navigate = useNavigate();

  const [products, setProducts] = React.useState<IProduct[]>(INITIAL_PRODUCTS);
  const [editingProductId, setEditingProductId] = React.useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>('p1');
  const [skuChecked, setSkuChecked] = React.useState<Set<string>>(new Set());
  const [skuEdits, setSkuEdits] = React.useState<Map<string, Partial<ISku>>>(new Map());
  const [initialEdits, setInitialEdits] = React.useState<Map<string, Partial<ISku>>>(new Map());
  const [showTooltipFor, setShowTooltipFor] = React.useState<string | null>(null);
  const [startDateCalendarOpen, setStartDateCalendarOpen] = React.useState<string | null>(null);
  const [endDateCalendarOpen, setEndDateCalendarOpen] = React.useState<string | null>(null);
  const startDateRefs = React.useRef<Map<string, HTMLElement>>(new Map());
  const endDateRefs = React.useRef<Map<string, HTMLElement>>(new Map());

  const editingProduct = products.find((p) => p.id === editingProductId);
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const hasEdits = React.useMemo(() => {
    if (!editingProduct) return false;
    for (const sku of editingProduct.skus) {
      const edit = skuEdits.get(sku.id);
      const initial = initialEdits.get(sku.id);
      if (!edit || !initial) continue;
      if (edit.discountPercent !== initial.discountPercent || edit.startDate !== initial.startDate || edit.endDate !== initial.endDate) return true;
    }
    return false;
  }, [editingProduct, skuEdits, initialEdits]);

  const handleOpenEditSkus = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.isConfigured) return;
    setEditingProductId(productId);
    setSkuChecked(new Set(product.selectedSkuIds));
    const edits = new Map<string, Partial<ISku>>();
    product.skus.forEach((sku) => {
      edits.set(sku.id, { discountPercent: sku.discountPercent, startDate: sku.startDate, endDate: sku.endDate });
    });
    setSkuEdits(edits);
    setInitialEdits(new Map(edits));
  };

  const handleApply = () => {
    if (!editingProductId) return;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== editingProductId) return p;
        const updatedSkus = p.skus.map((sku) => {
          const edit = skuEdits.get(sku.id);
          if (!edit) return sku;
          return { ...sku, ...edit };
        });
        return { ...p, skus: updatedSkus, selectedSkuIds: new Set(skuChecked) };
      })
    );
    setShowTooltipFor(editingProductId);
    setEditingProductId(null);
  };

  const handleResetToDefault = () => {
    if (!editingProduct) return;
    const edits = new Map<string, Partial<ISku>>();
    editingProduct.skus.forEach((sku) => {
      edits.set(sku.id, { discountPercent: editingProduct.discountPercent, startDate: editingProduct.startDate, endDate: editingProduct.endDate });
    });
    setSkuEdits(edits);
  };

  const handleSkuEdit = (skuId: string, field: keyof ISku, value: string | number) => {
    setSkuEdits((prev) => {
      const next = new Map(prev);
      const existing = next.get(skuId) || {};
      next.set(skuId, { ...existing, [field]: value });
      return next;
    });
  };

  // --- Grid columns ---
  const gridColumns: IColumn[] = [
    {
      key: 'name', name: 'Product description', minWidth: 200, maxWidth: 280, isResizable: true,
      onRender: (item: IProduct) => (
        <Stack tokens={{ childrenGap: 0 }} styles={{ root: { padding: '4px 0' } }}>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 0 }}>
            <Text styles={{ root: { fontSize: 12, fontWeight: 500 } }}>{item.name}</Text>
            {item.selectedSkuIds.size > 0 && showTooltipFor === item.id && (
              <TooltipHost content="Some SKU values differ from those set for the parent product.">
                <Icon iconName="Warning" className={classNames.warningIcon} />
              </TooltipHost>
            )}
          </Stack>
          <Link
            className={classNames.editSkusLink}
            disabled={!item.isConfigured}
            onClick={() => handleOpenEditSkus(item.id)}
            styles={{ root: { color: item.isConfigured ? theme.palette.themePrimary : theme.palette.neutralTertiary, fontSize: 11 } }}
          >
            Edit SKUs
          </Link>
        </Stack>
      ),
    },
    { key: 'tenants', name: 'Tenant(s)', minWidth: 140, maxWidth: 200, isResizable: true, onRender: (item: IProduct) => <Text styles={{ root: { fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}>{item.tenants || '—'}</Text> },
    { key: 'regions', name: 'Region', minWidth: 140, maxWidth: 200, isResizable: true, onRender: (item: IProduct) => <Text styles={{ root: { fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}>{item.regions || <span style={{ color: theme.palette.neutralTertiary }}>&lt;Select&gt;</span>}</Text> },
    { key: 'commitment', name: 'Commitment Duration', minWidth: 110, maxWidth: 140, isResizable: true, onRender: (item: IProduct) => <Text styles={{ root: { fontSize: 12 } }}>{item.commitment || <span style={{ color: theme.palette.neutralTertiary }}>&lt;Select&gt;</span>}</Text> },
    { key: 'discount', name: 'Discount (%)', minWidth: 70, maxWidth: 90, isResizable: true, onRender: (item: IProduct) => <Text styles={{ root: { fontSize: 12 } }}>{item.discountPercent}%</Text> },
    { key: 'startDate', name: 'Start date', minWidth: 110, maxWidth: 140, isResizable: true, onRender: (item: IProduct) => <Text styles={{ root: { fontSize: 12 } }}>{item.startDate || <span style={{ color: theme.palette.neutralTertiary }}>&lt;Select&gt;</span>}</Text> },
    { key: 'endDate', name: 'End date', minWidth: 110, maxWidth: 140, isResizable: true, onRender: (item: IProduct) => <Text styles={{ root: { fontSize: 12 } }}>{item.endDate || <span style={{ color: theme.palette.neutralTertiary }}>&lt;Select&gt;</span>}</Text> },
  ];

  const groups: IGroup[] = React.useMemo(() => {
    const m919 = products.filter((p) => p.amendmentCode === 'M919');
    const m920 = products.filter((p) => p.amendmentCode === 'M920');
    return [
      { key: 'M919', name: 'M919', startIndex: 0, count: m919.length, isCollapsed: false },
      { key: 'M920', name: 'M920', startIndex: m919.length, count: m920.length, isCollapsed: false },
    ];
  }, [products]);

  // --- SKU Panel: ordered data by region ---
  const skusByRegion: Map<string, ISku[]> = React.useMemo(() => {
    if (!editingProduct) return new Map();
    const regionMap = new Map<string, ISku[]>();
    editingProduct.skus.forEach((sku) => {
      if (!regionMap.has(sku.region)) regionMap.set(sku.region, []);
      regionMap.get(sku.region)!.push(sku);
    });
    return regionMap;
  }, [editingProduct]);

  // --- Details pane ---
  const renderDetailsPane = () => {
    if (!selectedProduct) return null;
    const configuredSkus = selectedProduct.skus.filter((s) => selectedProduct.selectedSkuIds.has(s.id));

    return (
      <div className={classNames.detailsPanel}>
        <div className={classNames.detailsHeader}>
          <Text styles={{ root: { fontWeight: 600, fontSize: 12, color: theme.palette.neutralSecondary } }}>AAA-10782</Text>
          <Text styles={{ root: { fontSize: 13, fontWeight: 700, display: 'block', marginTop: 2 } }}>{selectedProduct.name}</Text>
        </div>
        <div className={classNames.detailsBody}>
          <div className={classNames.detailsSection}>
            <div className={classNames.detailsSectionTitle}>Product information</div>
            <div className={classNames.detailsField}>
              <div className={classNames.detailsFieldLabel}>Product Family name</div>
              <div className={classNames.detailsFieldValue}>Virtual Machines</div>
            </div>
            <div className={classNames.detailsField}>
              <div className={classNames.detailsFieldLabel}>Division Name</div>
              <div className={classNames.detailsFieldValue}>O365 Core - Non M365</div>
            </div>
            <div className={classNames.detailsField}>
              <div className={classNames.detailsFieldLabel}>Product Type</div>
              <div className={classNames.detailsFieldValue}>MSU</div>
            </div>
          </div>

          {!selectedProduct.isConfigured && (
            <div className={classNames.detailsSection}>
              <MessageBar messageBarType={MessageBarType.info} styles={{ root: { fontSize: 12 } }}>
                Please add region and commitment values to the product to proceed with configuring the SKUs
              </MessageBar>
            </div>
          )}

          {configuredSkus.length > 0 && (
            <div className={classNames.detailsSection}>
              <div className={classNames.detailsSectionTitle}>Configured SKUs</div>
              {configuredSkus.map((sku) => (
                <div key={sku.id} className={classNames.skuItem}>
                  <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 2 }}>{sku.skuType}, {sku.region}, {sku.commitment}</div>
                  <div style={{ fontSize: 11, color: theme.palette.neutralSecondary }}>{sku.discountPercent}% discount, Starts {sku.startDate} until {sku.endDate}</div>
                </div>
              ))}
            </div>
          )}

          <div className={classNames.detailsSection}>
            <div className={classNames.detailsSectionTitle}>Scenario Configuration</div>
            <div className={classNames.detailsField}>
              <div className={classNames.detailsFieldLabel}>Offering</div>
              <div className={classNames.detailsFieldValue}>CUS</div>
            </div>
            <div className={classNames.detailsField}>
              <div className={classNames.detailsFieldLabel}>Profile</div>
              <div className={classNames.detailsFieldValue}>Enterprise</div>
            </div>
            <div className={classNames.detailsField}>
              <div className={classNames.detailsFieldLabel}>List Price (Before discount)</div>
              <div className={classNames.detailsFieldValue}>Year 1: 24.5 / Year 2: 22.5 / Year 3: 18.5</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classNames.root}>
      {/* Nav Header */}
      <Stack horizontal verticalAlign="center" className={classNames.navHeader}>
        <IconButton iconProps={{ iconName: 'GlobalNavButton' }} ariaLabel="Menu" styles={{ root: { color: 'white' }, rootHovered: { backgroundColor: 'rgba(255,255,255,0.15)' }, icon: { color: 'white' } }} />
        <Text className={classNames.navText}>Microsoft Volume Licensing Central</Text>
        <Stack.Item grow={1}><span /></Stack.Item>
        <DefaultButton text="Back to Prototype" onClick={() => navigate('/')} styles={{ root: { color: 'white', borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'transparent', height: 32, fontSize: 12 }, rootHovered: { color: 'white', backgroundColor: 'rgba(255,255,255,0.15)' } }} />
      </Stack>

      {/* Breadcrumb */}
      <div className={classNames.breadcrumb}>
        Home &gt; Deal Management &gt; P&amp;G FY21 Renewal EA
      </div>

      {/* Page Title */}
      <div className={classNames.pageTitle}>
        <Text styles={{ root: { fontSize: 15, fontWeight: 700 } }}>ParleG Basic: P1103281.001 | Future Products</Text>
      </div>

      {/* Tab Bar */}
      <div className={classNames.tabBar}>
        <Stack horizontal tokens={{ childrenGap: 24 }}>
          <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary, paddingBottom: 8 } }}>Future Products</Text>
          <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary, paddingBottom: 8 } }}>Optional Future Products</Text>
          <Text styles={{ root: { fontSize: 13, fontWeight: 600, borderBottom: `2px solid ${theme.palette.themePrimary}`, paddingBottom: 8 } }}>RI/ASP Future Products</Text>
        </Stack>
      </div>

      {/* Message Bar */}
      <div style={{ padding: '6px 24px' }}>
        <MessageBar messageBarType={MessageBarType.info} styles={{ root: { fontSize: 12 } }}>
          Make sure you have populated all the required configuration fields and selected the SKUs for each product before proceeding.
        </MessageBar>
      </div>

      {/* Toolbar */}
      <Stack horizontal verticalAlign="center" className={classNames.toolbar} tokens={{ childrenGap: 4 }}>
        <ActionButton iconProps={{ iconName: 'Add' }} text="Add RI/ASP Products" disabled styles={{ root: { fontSize: 12 } }} />
        <ActionButton iconProps={{ iconName: 'Edit' }} text="Edit" disabled styles={{ root: { fontSize: 12 } }} />
        <ActionButton iconProps={{ iconName: 'BulkUpload' }} text="Bulk Edit" disabled styles={{ root: { fontSize: 12 } }} />
        <ActionButton iconProps={{ iconName: 'Copy' }} text="Duplicate" disabled styles={{ root: { fontSize: 12 } }} />
        <ActionButton iconProps={{ iconName: 'Delete' }} text="Delete" disabled styles={{ root: { fontSize: 12 } }} />
        <Stack.Item grow={1}><span /></Stack.Item>
        <ActionButton iconProps={{ iconName: 'ColumnOptions' }} text="Columns" styles={{ root: { fontSize: 12 } }} />
        <ActionButton iconProps={{ iconName: 'Filter' }} text="Filter" styles={{ root: { fontSize: 12 } }} />
        <SearchBox placeholder="Search" styles={{ root: { width: 160 } }} />
      </Stack>

      {/* Body: Grid + Details Panel */}
      <div className={classNames.body}>
        <div className={classNames.mainContent}>
          <div className={classNames.gridWrapper}>
            <DetailsList
              items={products}
              columns={gridColumns}
              groups={groups}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
              compact
              onActiveItemChanged={(item) => setSelectedProductId((item as IProduct)?.id || null)}
              styles={{
                root: { fontSize: 12 },
                headerWrapper: { position: 'sticky', top: 0, zIndex: 10, backgroundColor: theme.palette.white },
              }}
              groupProps={{
                onRenderHeader: (props) => {
                  if (!props || !props.group) return null;
                  return (
                    <div className={classNames.groupHeader}>
                      <Icon iconName={props.group.isCollapsed ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 12, cursor: 'pointer', marginRight: 8 } }} onClick={() => props.onToggleCollapse?.(props.group!)} />
                      <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>{props.group.name}</Text>
                    </div>
                  );
                },
              }}
            />
          </div>
          <div className={classNames.statusBar}>
            Showing {products.length} of {products.length} items | Grouped by Amendment Code
          </div>
        </div>
        {renderDetailsPane()}
      </div>

      {/* Footer */}
      <div className={classNames.footer}>
        <DefaultButton text="Cancel" />
        <PrimaryButton text="Next" />
      </div>

      {/* Edit SKUs Panel */}
      <Panel
        isOpen={!!editingProductId}
        onDismiss={() => setEditingProductId(null)}
        type={PanelType.custom}
        customWidth="900px"
        headerText={editingProduct ? `Edit SKUs | ${editingProduct.name}` : ''}
        closeButtonAriaLabel="Close"
        isFooterAtBottom
        styles={{
          content: { paddingTop: 16 },
          header: { paddingBottom: 0 },
          scrollableContent: { display: 'flex', flexDirection: 'column', height: '100%' },
        }}
        onRenderFooterContent={() => (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton text="Apply" onClick={handleApply} />
            <DefaultButton text="Cancel" onClick={() => setEditingProductId(null)} />
          </Stack>
        )}
      >
        <Stack tokens={{ childrenGap: 10 }}>
          <Text className={classNames.panelDescription}>
            Select the SKUs that you want to configure as a part of the product. Once you are done with selecting and editing the SKUs (if required), click on apply.
          </Text>

          <MessageBar messageBarType={MessageBarType.info} styles={{ root: { fontSize: 12 } }}>
            By default, SKU discount, start date, and end date are inherited from the parent product. You can override these values by entering new ones in the respective fields.
          </MessageBar>

          {/* Panel Toolbar: No Filter button, Reset disabled when no edits */}
          <div className={classNames.panelToolbar}>
            <ActionButton
              iconProps={{ iconName: 'Refresh' }}
              text="Reset to default"
              disabled={!hasEdits}
              onClick={handleResetToDefault}
              styles={{ root: { fontSize: 12 } }}
            />
            <Stack.Item grow={1}><span /></Stack.Item>
            <SearchBox placeholder="Search" styles={{ root: { width: 300 } }} />
          </div>

          {/* SKU Grid - Custom table for pixel-perfect alignment */}
          <div className={classNames.panelGrid}>
            {/* Column Header Row */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${theme.palette.neutralLight}` }}>
              <div style={{ width: 36, flexShrink: 0, paddingLeft: 4 }}>
                <Checkbox
                  checked={editingProduct ? editingProduct.skus.length > 0 && editingProduct.skus.every((s) => skuChecked.has(s.id)) : false}
                  indeterminate={editingProduct ? !(editingProduct.skus.length > 0 && editingProduct.skus.every((s) => skuChecked.has(s.id))) && editingProduct.skus.some((s) => skuChecked.has(s.id)) : false}
                  onChange={() => {
                    if (!editingProduct) return;
                    const allChecked = editingProduct.skus.every((s) => skuChecked.has(s.id));
                    setSkuChecked((prev) => {
                      const next = new Set(prev);
                      if (allChecked) editingProduct.skus.forEach((s) => next.delete(s.id));
                      else editingProduct.skus.forEach((s) => next.add(s.id));
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

            {/* Groups and Rows */}
            {Array.from(skusByRegion.entries()).map(([region, skus]) => {
              const allChecked = skus.every((s) => skuChecked.has(s.id));
              const someChecked = !allChecked && skus.some((s) => skuChecked.has(s.id));
              return (
                <div key={region}>
                  {/* Group Header */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${theme.palette.neutralLight}`, backgroundColor: theme.palette.white }}>
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

                  {/* SKU Rows */}
                  {skus.map((sku) => (
                    <div key={sku.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${theme.palette.neutralLighterAlt}` }}>
                      <div style={{ width: 36, flexShrink: 0, paddingLeft: 4 }}>
                        <Checkbox
                          checked={skuChecked.has(sku.id)}
                          onChange={() => {
                            setSkuChecked((prev) => {
                              const next = new Set(prev);
                              if (next.has(sku.id)) next.delete(sku.id);
                              else next.add(sku.id);
                              return next;
                            });
                          }}
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
                      <div style={{ width: 160, flexShrink: 0, paddingLeft: 12 }} ref={(el) => { if (el) startDateRefs.current.set(sku.id, el); }}>
                        <Dropdown
                          selectedKey={((skuEdits.get(sku.id)?.startDate ?? sku.startDate) as string) === 'At order acceptance' ? 'At order acceptance' : 'On specific date'}
                          options={START_DATE_OPTIONS}
                          onChange={(_, opt) => {
                            if (opt?.key === 'At order acceptance') handleSkuEdit(sku.id, 'startDate', 'At order acceptance');
                            else if (opt?.key === 'On specific date') setStartDateCalendarOpen(sku.id);
                          }}
                          onRenderTitle={() => <span style={{ fontSize: 12 }}>{(skuEdits.get(sku.id)?.startDate ?? sku.startDate) as string || 'Select'}</span>}
                          styles={dropdownStyles}
                        />
                        {startDateCalendarOpen === sku.id && startDateRefs.current.get(sku.id) && (
                          <Callout target={startDateRefs.current.get(sku.id)} onDismiss={() => setStartDateCalendarOpen(null)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false}>
                            <Calendar onSelectDate={(date) => { if (date) { handleSkuEdit(sku.id, 'startDate', date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })); setStartDateCalendarOpen(null); } }} />
                          </Callout>
                        )}
                      </div>
                      <div style={{ width: 160, flexShrink: 0, paddingLeft: 12 }} ref={(el) => { if (el) endDateRefs.current.set(sku.id, el); }}>
                        <Dropdown
                          selectedKey={(() => { const v = (skuEdits.get(sku.id)?.endDate ?? sku.endDate) as string; return END_DATE_DURATION_OPTIONS.some((o) => o.key === v && o.itemType !== DropdownMenuItemType.Divider) ? v : 'On specific date'; })()}
                          options={END_DATE_DURATION_OPTIONS}
                          onChange={(_, opt) => {
                            if (!opt) return;
                            if (opt.key === 'On specific date') setEndDateCalendarOpen(sku.id);
                            else handleSkuEdit(sku.id, 'endDate', opt.key as string);
                          }}
                          onRenderTitle={() => <span style={{ fontSize: 12 }}>{(skuEdits.get(sku.id)?.endDate ?? sku.endDate) as string || 'Select'}</span>}
                          styles={dropdownStyles}
                        />
                        {endDateCalendarOpen === sku.id && endDateRefs.current.get(sku.id) && (
                          <Callout target={endDateRefs.current.get(sku.id)} onDismiss={() => setEndDateCalendarOpen(null)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false}>
                            <Calendar onSelectDate={(date) => { if (date) { handleSkuEdit(sku.id, 'endDate', date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })); setEndDateCalendarOpen(null); } }} />
                          </Callout>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Stack>
      </Panel>
    </div>
  );
};
