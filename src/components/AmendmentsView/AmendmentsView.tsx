import * as React from 'react';
import { DetailsList, IColumn, SelectionMode, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link } from '@fluentui/react/lib/Link';
import { ActionButton, IconButton, PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { IAmendment, EMPOWERMENT_OPTIONS } from '../../types/models';

type PanelMode = 'edit' | 'preview';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: { padding: '16px 24px', flex: 1 },
    sectionHeader: {
      backgroundColor: theme.palette.neutralLighterAlt,
      padding: '10px 16px',
      fontWeight: 600,
      fontSize: 14,
    },
    digitisedBadge: {
      backgroundColor: '#DFF6DD',
      color: '#107C10',
      border: '1px solid #107C10',
      borderRadius: 2,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
    },
    scenarioSection: {
      backgroundColor: theme.palette.neutralLighterAlt,
      padding: '12px 16px',
      marginTop: 16,
    },
    editPanelBody: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden' as const,
      height: '100%',
    },
    docPreview: {
      flex: 45,
      backgroundColor: '#f3f2f1',
      overflow: 'auto' as const,
      padding: 16,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    docPreviewFull: {
      flex: 1,
      backgroundColor: '#f3f2f1',
      overflow: 'auto' as const,
      padding: 16,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    previewToolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      marginBottom: 12,
      flexShrink: 0,
    },
    docPage: {
      backgroundColor: theme.palette.white,
      padding: '32px 40px',
      flex: 1,
      boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
      overflow: 'auto' as const,
    },
    editSidebar: {
      flex: 55,
      borderLeft: `1px solid ${theme.palette.neutralLight}`,
      overflow: 'auto' as const,
      padding: '0 24px',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    readOnlyTable: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: 12,
    },
    readOnlyTh: {
      padding: '8px 8px',
      textAlign: 'left' as const,
      fontWeight: 600,
      fontSize: 11,
      color: theme.palette.neutralPrimary,
      backgroundColor: theme.palette.neutralLighterAlt,
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
    },
    readOnlyTd: {
      padding: '6px 8px',
      borderBottom: `1px solid ${theme.palette.neutralLighter}`,
      fontSize: 12,
      color: theme.palette.neutralPrimary,
    },
    fieldsLabel: {
      fontWeight: 600,
      fontSize: 14,
      color: theme.palette.neutralPrimary,
      padding: '12px 0 8px',
    },
    tableCollapseHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer',
      padding: '8px 0',
    },
    editableField: {
      padding: '8px 0',
      borderBottom: `1px solid ${theme.palette.neutralLighter}`,
    },
    addPanelBody: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden' as const,
      height: '100%',
    },
    addPanelLeft: {
      flex: 55,
      overflow: 'auto' as const,
      padding: '0 24px',
      display: 'flex',
      flexDirection: 'column' as const,
      borderRight: `1px solid ${theme.palette.neutralLight}`,
    },
    addPanelRight: {
      flex: 45,
      overflow: 'auto' as const,
      padding: '0 24px',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    searchCard: {
      border: `1px solid ${theme.palette.neutralLight}`,
      borderRadius: 4,
      padding: '12px 16px',
      marginBottom: 8,
      backgroundColor: theme.palette.white,
    },
    addedBadge: {
      backgroundColor: '#DFF6DD',
      color: '#107C10',
      border: '1px solid #107C10',
      borderRadius: 2,
      padding: '4px 12px',
      fontSize: 12,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      cursor: 'default',
    },
    addBtn: {
      border: `1px solid ${theme.palette.themePrimary}`,
      borderRadius: 2,
      padding: '4px 12px',
      fontSize: 12,
      fontWeight: 600,
      color: theme.palette.themePrimary,
      backgroundColor: 'transparent',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      selectors: { ':hover': { backgroundColor: theme.palette.themeLighter } },
    },
  })
);

export interface IAmendmentsViewProps {
  amendments: IAmendment[];
}

export const AmendmentsView: React.FC<IAmendmentsViewProps> = ({ amendments: initialAmendments }) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [amendments, setAmendments] = React.useState<IAmendment[]>(initialAmendments);
  const [editAmendment, setEditAmendment] = React.useState<IAmendment | null>(null);
  const [panelMode, setPanelMode] = React.useState<PanelMode>('edit');
  const [isTableCollapsed, setIsTableCollapsed] = React.useState(false);
  const [empowermentLevels, setEmpowermentLevels] = React.useState<Map<string, string>>(new Map());
  const [isAddPanelOpen, setIsAddPanelOpen] = React.useState(false);
  const [showAutofill, setShowAutofill] = React.useState(true);
  const [autofillApplied, setAutofillApplied] = React.useState(false);
  // Add panel search state
  const [addSearchQuery, setAddSearchQuery] = React.useState('');
  const [addSearchLang, setAddSearchLang] = React.useState('All');
  const [addHasSearched, setAddHasSearched] = React.useState(false);
  const [addedAmendments, setAddedAmendments] = React.useState<{ code: string; title: string; language: string; empowerment: string; concessionId: string }[]>([]);
  const [addEmpowermentMap, setAddEmpowermentMap] = React.useState<Map<string, string>>(new Map());
  const [isSaving, setIsSaving] = React.useState(false);
  const [autofillDone, setAutofillDone] = React.useState(false);

  const openEdit = React.useCallback((item: IAmendment) => {
    setEditAmendment(item);
    setPanelMode('edit');
    setIsTableCollapsed(false);
    // Only show autofill for manually added amendments (not Auto-added)
    setShowAutofill(item.status === 'Manual');
    setAutofillApplied(false);
    setAutofillDone(false);
  }, []);

  // Auto-dismiss success bar after 4 seconds
  React.useEffect(() => {
    if (autofillApplied) {
      const timer = setTimeout(() => setAutofillApplied(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [autofillApplied]);

  const openPreview = React.useCallback((item: IAmendment) => {
    setEditAmendment(item);
    setPanelMode('preview');
  }, []);

  const columns: IColumn[] = React.useMemo(
    () => [
      {
        key: 'drag', name: '', minWidth: 24, maxWidth: 24,
        onRender: () => <Icon iconName="GripperDotsVertical" styles={{ root: { color: theme.palette.neutralTertiary, cursor: 'grab' } }} />,
      },
      {
        key: 'code', name: 'Code', minWidth: 120, maxWidth: 160, isResizable: true,
        onRender: (item: IAmendment) => (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            <Link onClick={() => openEdit(item)}>{item.code}</Link>
            {item.isDigitised && <span className={classNames.digitisedBadge}><Icon iconName="SkypeCircleCheck" styles={{ root: { fontSize: 10 } }} />Digitised</span>}
          </Stack>
        ),
      },
      {
        key: 'title', name: 'Title', minWidth: 200, maxWidth: 300, isResizable: true,
        onRender: (item: IAmendment) => <Link onClick={() => openEdit(item)}>{item.title}</Link>,
      },
      { key: 'language', name: 'Language', fieldName: 'language', minWidth: 80, maxWidth: 100 },
      {
        key: 'concessionId', name: 'Concession ID', minWidth: 100, maxWidth: 120,
        onRender: (item: IAmendment) => (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
            <Link>{item.concessionId}</Link>
            <Icon iconName="OpenInNewWindow" styles={{ root: { fontSize: 12, color: theme.palette.themePrimary } }} />
          </Stack>
        ),
      },
      {
        key: 'empowermentLevel', name: 'Empowerment level', minWidth: 120, maxWidth: 150,
        onRender: (item: IAmendment) => (
          <Dropdown
            selectedKey={empowermentLevels.get(item.id) || item.empowermentLevel}
            options={EMPOWERMENT_OPTIONS as IDropdownOption[]}
            styles={{ dropdown: { minWidth: 100 } }}
            onChange={(_, opt) => {
              if (opt) {
                setEmpowermentLevels(prev => {
                  const next = new Map(prev);
                  next.set(item.id, opt.key as string);
                  return next;
                });
              }
            }}
            onRenderTitle={(options) => {
              const opt = options?.[0];
              if (!opt) return null;
              return (
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    backgroundColor: opt.key === 'Blue' ? '#0078d4' : opt.key === 'Green' ? '#107C10' : opt.key === 'Yellow' ? '#FFB900' : opt.key === 'Business Desk' ? '#8764B8' : '#D13438',
                  }} />
                  <span>{opt.text}</span>
                </Stack>
              );
            }}
          />
        ),
      },
      { key: 'modifiedBy', name: 'Modified by', fieldName: 'modifiedBy', minWidth: 100, maxWidth: 140 },
      { key: 'modifiedOn', name: 'Modified on', fieldName: 'modifiedOn', minWidth: 100, maxWidth: 130 },
      {
        key: 'actions', name: 'Actions', minWidth: 40, maxWidth: 40,
        onRender: (item: IAmendment) => (
          <IconButton
            iconProps={{ iconName: 'MoreVertical' }} title="Options"
            menuProps={{
              items: [
                { key: 'edit', text: 'Edit amendment', iconProps: { iconName: 'Edit' }, onClick: () => openEdit(item) },
                { key: 'preview', text: 'Preview', iconProps: { iconName: 'View' }, onClick: () => openPreview(item) },
                { key: 'delete', text: 'Delete', iconProps: { iconName: 'Delete' } },
              ],
            }}
            styles={{ root: { color: theme.palette.neutralSecondary } }}
          />
        ),
      },
    ],
    [theme, classNames, openEdit, openPreview, empowermentLevels]
  );

  const tableRows = React.useMemo(() => [
    { product: 'Fabric Capacity Reservation - Fabric Capacity - US East', commitment: '1 Year', discount: '3', region: 'US East', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2029' },
    { product: 'Fabric Capacity Reservation - Fabric Capacity - US West', commitment: '1 Year', discount: '3', region: 'US West', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2029' },
    { product: 'Fabric Capacity Reservation - Fabric Capacity - EU West', commitment: '3 Years', discount: '5', region: 'EU West', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2029' },
    { product: 'SQL Database Reserved Capacity - General Purpose - US West', commitment: '1 Year', discount: '4', region: 'US West', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2027' },
    { product: 'SQL Database Reserved Capacity - General Purpose - US East', commitment: '1 Year', discount: '4', region: 'US East', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2027' },
    { product: 'Cosmos DB Reserved Capacity - 100 RU/s - US West', commitment: '3 Years', discount: '6', region: 'US West', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2029' },
    { product: 'Cosmos DB Reserved Capacity - 100 RU/s - Asia Pacific', commitment: '3 Years', discount: '6', region: 'Asia Pacific', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2029' },
    { product: 'Azure Synapse Analytics Reserved - Compute Optimized - US West', commitment: '1 Year', discount: '5', region: 'US West', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2027' },
    { product: 'Azure Virtual Machines Reserved - D4s v5 - US West', commitment: '1 Year', discount: '3', region: 'US West', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2027' },
    { product: 'Azure Virtual Machines Reserved - E8s v5 - Australia', commitment: '3 Years', discount: '5', region: 'Australia', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2029' },
    { product: 'Azure Databricks Reserved - Premium - US West', commitment: '1 Year', discount: '4', region: 'US West', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2027' },
    { product: 'Azure Cache for Redis Reserved - Standard - US West', commitment: '1 Year', discount: '3', region: 'US West', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2027' },
    { product: 'Azure App Service Reserved - P1v3 - US East', commitment: '5 Years', discount: '8', region: 'US East', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2031' },
    { product: 'Azure Kubernetes Service Reserved - Standard - US East', commitment: '1 Year', discount: '3', region: 'US East', startDate: 'Mar 21, 2026', endDate: 'Mar 21, 2027' },
  ], []);

  const isLocalLanguageAmendment = editAmendment ? editAmendment.language !== 'English' || editAmendment.status === 'Manual' : false;
  const showTableData = !isLocalLanguageAmendment || autofillDone;

  const renderDocumentPreview = () => (
    <div className={classNames.docPage}>
      <Stack horizontal horizontalAlign="space-between" styles={{ root: { marginBottom: 16 } }}>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <div style={{ width: 20, height: 20, backgroundColor: '#0078d4', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon iconName="WindowsLogo" styles={{ root: { color: 'white', fontSize: 12 } }} />
          </div>
          <Text styles={{ root: { fontWeight: 600, fontSize: 13, color: '#0078d4' } }}>Microsoft</Text>
        </Stack>
        <Text styles={{ root: { fontSize: 11, color: theme.palette.neutralSecondary } }}>Volume Licensing</Text>
      </Stack>
      <Text styles={{ root: { fontSize: 11, color: theme.palette.neutralSecondary, marginBottom: 4 } }}>&lt;Choose Enrollment&gt;</Text>
      <Text styles={{ root: { fontWeight: 600, fontSize: 13, marginBottom: 2 } }}>
        Azure RI/ASP Reservations Discounting - Fabric Capacity Reservation
      </Text>
      <Text styles={{ root: { fontSize: 11, marginBottom: 12 } }}>Amendment ID {editAmendment?.code}</Text>
      <Text styles={{ root: { fontSize: 9, color: theme.palette.neutralSecondary, marginBottom: 12, lineHeight: '14px' } }}>
        Azure Commitment Discount is not applicable to Microsoft Azure Reserved Instances (&quot;RIs&quot;). Microsoft agrees to discount the following RIs as outlined in the table below. The discount will be a fixed percentage based on the list price at the time the Enrolled Affiliate completes the purchase in the Azure portal. The discounted price will apply for the duration of the reservation commitment. Discounts cannot be applied retroactively.
      </Text>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, marginTop: 8 }}>
        <thead>
          <tr style={{ backgroundColor: '#0078d4', color: 'white' }}>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Reserved Instance</th>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Commitment Duration</th>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Discount Percentage</th>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Region</th>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Discount Start Date</th>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Discount End Date</th>
          </tr>
        </thead>
        <tbody>
          {showTableData ? tableRows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e1dfdd' }}>
              <td style={{ padding: '2px 5px' }}>{row.product}</td>
              <td style={{ padding: '2px 5px' }}>{row.commitment}</td>
              <td style={{ padding: '2px 5px' }}>{row.discount}</td>
              <td style={{ padding: '2px 5px' }}>{row.region}</td>
              <td style={{ padding: '2px 5px' }}>{row.startDate}</td>
              <td style={{ padding: '2px 5px' }}>{row.endDate}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} style={{ padding: '20px 5px', textAlign: 'center', color: theme.palette.neutralTertiary, fontSize: 10 }}>
                No data available. Use autofill to populate this table.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Stack horizontal horizontalAlign="space-between" styles={{ root: { marginTop: 16, paddingTop: 8, borderTop: `1px solid ${theme.palette.neutralLighter}` } }}>
        <Text styles={{ root: { fontSize: 8, color: theme.palette.neutralTertiary } }}>
          Enrollment(ID)/ID(Cust(ID)) &nbsp;&nbsp; Special Pricing for Microsoft 365 {editAmendment?.code}
        </Text>
        <Text styles={{ root: { fontSize: 8, color: theme.palette.neutralTertiary } }}>Page 1 of 1</Text>
      </Stack>
    </div>
  );

  const renderPreviewToolbar = () => (
    <div className={classNames.previewToolbar}>
      <IconButton iconProps={{ iconName: 'ChevronLeft' }} title="Previous page" disabled styles={{ root: { width: 28, height: 28 } }} />
      <IconButton iconProps={{ iconName: 'ChevronRight' }} title="Next page" disabled styles={{ root: { width: 28, height: 28 } }} />
      <Text styles={{ root: { fontSize: 12, margin: '0 8px' } }}>1 / 1</Text>
      <IconButton iconProps={{ iconName: 'ZoomOut' }} title="Zoom out" styles={{ root: { width: 28, height: 28 } }} />
      <IconButton iconProps={{ iconName: 'ZoomIn' }} title="Zoom in" styles={{ root: { width: 28, height: 28 } }} />
      <Text styles={{ root: { fontSize: 12, margin: '0 4px' } }}>80%</Text>
      <IconButton iconProps={{ iconName: 'FullScreen' }} title="Full screen" styles={{ root: { width: 28, height: 28 } }} />
      <div style={{ flex: 1 }} />
      {panelMode === 'edit' && (
        <ActionButton iconProps={{ iconName: 'View' }} text="Collapse Preview" onClick={() => setPanelMode('preview')} />
      )}
      {panelMode === 'preview' && (
        <ActionButton iconProps={{ iconName: 'Edit' }} text="Show Edit Panel" onClick={() => setPanelMode('edit')} />
      )}
    </div>
  );

  const renderEditPanel = () => {
    if (!editAmendment) return null;

    const isPreviewOnly = panelMode === 'preview';
    const panelTitle = isPreviewOnly ? `Preview: ${editAmendment.code}` : 'Edit amendment';

    return (
      <Panel
        isOpen={!!editAmendment}
        onDismiss={() => setEditAmendment(null)}
        type={PanelType.custom}
        customWidth="80vw"
        headerText={panelTitle}
        styles={{
          main: { padding: 0 },
          content: { padding: 0, display: 'flex', flexDirection: 'column', flex: 1 },
          scrollableContent: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
          contentInner: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
        }}
      >
        <div className={classNames.editPanelBody}>
          {/* Document Preview Area */}
          <div className={isPreviewOnly ? classNames.docPreviewFull : classNames.docPreview}>
            {renderPreviewToolbar()}
            {renderDocumentPreview()}
          </div>

          {/* Edit Sidebar — only shown in edit mode */}
          {!isPreviewOnly && (
            <div className={classNames.editSidebar}>
              <div style={{ flex: 1, overflow: 'auto' }}>
              <Pivot styles={{ root: { borderBottom: `1px solid ${theme.palette.neutralLight}` } }}>
                <PivotItem headerText="Edit Fields and tables" itemKey="fields">
                  <Stack tokens={{ childrenGap: 8 }} styles={{ root: { paddingTop: 16 } }}>
                    {/* Number & date format */}
                    <Stack tokens={{ childrenGap: 4 }}>
                      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                        <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>
                          Number &amp; date format <span style={{ color: '#A80000' }}>*</span>
                        </Text>
                        <Icon iconName="Info" styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }} />
                      </Stack>
                      <Dropdown
                        selectedKey="en-us"
                        options={[{ key: 'en-us', text: 'English (United States)' }, { key: 'en-gb', text: 'English (United Kingdom)' }, { key: 'de-de', text: 'German (Germany)' }, { key: 'fr-fr', text: 'French (France)' }]}
                      />
                    </Stack>

                    {/* Fields / Tables sub-tabs */}
                    <Pivot styles={{ root: { marginTop: 8 } }}>
                      <PivotItem headerText="Fields" itemKey="subFields">
                        <Stack tokens={{ childrenGap: 8 }} styles={{ root: { paddingTop: 8 } }}>
                          <div className={classNames.editableField}>
                            <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary, marginBottom: 4, display: 'block' } }}>Amendment Title</Text>
                            <TextField defaultValue={editAmendment.title} styles={{ root: { width: '100%' } }} />
                          </div>
                          <div className={classNames.editableField}>
                            <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary, marginBottom: 4, display: 'block' } }}>Language</Text>
                            <Dropdown
                              selectedKey="English"
                              options={[{ key: 'English', text: 'English' }, { key: 'French', text: 'French' }, { key: 'German', text: 'German' }, { key: 'Spanish', text: 'Spanish' }]}
                            />
                          </div>
                          <div className={classNames.editableField}>
                            <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary, marginBottom: 4, display: 'block' } }}>Concession ID</Text>
                            <Text styles={{ root: { fontSize: 13, fontWeight: 600 } }}>{editAmendment.concessionId}</Text>
                          </div>
                        </Stack>
                      </PivotItem>
                      <PivotItem headerText="Tables" itemKey="subTables">
                        <Stack tokens={{ childrenGap: 8 }} styles={{ root: { paddingTop: 8 } }}>
                          {/* Auto-fill banner — only shown if autofill hasn't been done yet */}
                          {showAutofill && !autofillDone && (
                            <div style={{ backgroundColor: '#F8F2FE', border: '1px solid #E0D4F7', borderRadius: 4, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 60, height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {/* Sparkle/diamond shapes */}
                                  <path d="M8 12L10 8L12 12L10 16Z" fill="#7B5EA7"/>
                                  <path d="M46 8L47.5 4L49 8L47.5 12Z" fill="#7B5EA7"/>
                                  <path d="M4 28L5.5 25L7 28L5.5 31Z" fill="#B5A1D4"/>
                                  <path d="M50 20L51 18L52 20L51 22Z" fill="#B5A1D4"/>
                                  {/* Person body */}
                                  <circle cx="28" cy="18" r="7" fill="#FFCDB2"/>
                                  {/* Hair */}
                                  <path d="M21 16C21 11 24 8 28 8C32 8 35 11 35 16C35 14 33 12 28 12C23 12 21 14 21 16Z" fill="#3D2C1E"/>
                                  <ellipse cx="22.5" cy="17" rx="2" ry="4" fill="#3D2C1E"/>
                                  {/* Green top */}
                                  <path d="M20 28C20 24 23 22 28 22C33 22 36 24 36 28L38 42H18L20 28Z" fill="#8BC34A"/>
                                  <path d="M22 25C22 24 24 22 28 22C26 22 24 24 24 26L22 25Z" fill="#7CB342"/>
                                  {/* Arms */}
                                  <path d="M36 28L44 16" stroke="#FFCDB2" strokeWidth="3" strokeLinecap="round"/>
                                  <path d="M20 28L14 34" stroke="#FFCDB2" strokeWidth="3" strokeLinecap="round"/>
                                  {/* Hand */}
                                  <circle cx="44" cy="15" r="2.5" fill="#FFCDB2"/>
                                  {/* More sparkles */}
                                  <path d="M42 10L43 7L44 10L43 13Z" fill="#9C7FCC"/>
                                  <circle cx="10" cy="22" r="1.5" fill="#C4B0E0"/>
                                  <circle cx="48" cy="28" r="1" fill="#C4B0E0"/>
                                  {/* Legs */}
                                  <path d="M24 42L22 52" stroke="#3D5A80" strokeWidth="2.5" strokeLinecap="round"/>
                                  <path d="M32 42L34 52" stroke="#3D5A80" strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                              </div>
                              <Stack styles={{ root: { flex: 1 } }}>
                                <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Speed up your process with auto-fill!</Text>
                                <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }}>We can automatically fill in this data for you with a single click.</Text>
                              </Stack>
                              <DefaultButton text="Autofill" styles={{ root: { minWidth: 80, height: 32 } }} onClick={() => { setAutofillApplied(true); setAutofillDone(true); }} />
                            </div>
                          )}
                          {autofillApplied && (
                            <div style={{ backgroundColor: '#DFF6DD', border: '1px solid #107C10', borderRadius: 4, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Icon iconName="SkypeCircleCheck" styles={{ root: { fontSize: 16, color: '#107C10' } }} />
                              <Text styles={{ root: { fontWeight: 600, fontSize: 13, color: '#107C10' } }}>Autofill</Text>
                              <Text styles={{ root: { fontSize: 12, color: '#0B6A0B', flex: 1 } }}>Your data has been successfully added to the enabled fields. Give it a quick review and proceed.</Text>
                              <IconButton iconProps={{ iconName: 'Cancel' }} styles={{ root: { width: 24, height: 24, color: '#107C10' } }} onClick={() => setAutofillApplied(false)} />
                            </div>
                          )}

                          <div
                            className={classNames.tableCollapseHeader}
                            onClick={() => setIsTableCollapsed((prev) => !prev)}
                          >
                            <Icon iconName={isTableCollapsed ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 10 } }} />
                            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Table 1</Text>
                          </div>

                          {!isTableCollapsed && (
                            <div style={{ overflowX: 'auto' }}>
                              <table className={classNames.readOnlyTable}>
                                <thead>
                                  <tr>
                                    <th className={classNames.readOnlyTh}>Product SKU Name</th>
                                    <th className={classNames.readOnlyTh}>Commitment</th>
                                    <th className={classNames.readOnlyTh}>Discount %</th>
                                    <th className={classNames.readOnlyTh}>Region</th>
                                    <th className={classNames.readOnlyTh}>Start Date</th>
                                    <th className={classNames.readOnlyTh}>End Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {showTableData ? tableRows.map((row, i) => (
                                    <tr key={i}>
                                      <td className={classNames.readOnlyTd}>{row.product}</td>
                                      <td className={classNames.readOnlyTd}>{row.commitment}</td>
                                      <td className={classNames.readOnlyTd}>{row.discount}</td>
                                      <td className={classNames.readOnlyTd}>{row.region}</td>
                                      <td className={classNames.readOnlyTd}>{row.startDate}</td>
                                      <td className={classNames.readOnlyTd}>{row.endDate}</td>
                                    </tr>
                                  )) : (
                                    Array.from({ length: 5 }).map((_, i) => (
                                      <tr key={i}>
                                        <td className={classNames.readOnlyTd} style={{ color: theme.palette.neutralTertiaryAlt }}>Input</td>
                                        <td className={classNames.readOnlyTd} style={{ color: theme.palette.neutralTertiaryAlt }}>Select</td>
                                        <td className={classNames.readOnlyTd} style={{ color: theme.palette.neutralTertiaryAlt }}>Input</td>
                                        <td className={classNames.readOnlyTd} style={{ color: theme.palette.neutralTertiaryAlt }}>Select</td>
                                        <td className={classNames.readOnlyTd} style={{ color: theme.palette.neutralTertiaryAlt }}>Select</td>
                                        <td className={classNames.readOnlyTd} style={{ color: theme.palette.neutralTertiaryAlt }}>Select</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </Stack>
                      </PivotItem>
                    </Pivot>
                  </Stack>
                </PivotItem>

                <PivotItem headerText="Edit Content" itemKey="content">
                  <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 16 } }}>
                    <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary } }}>
                      Content editing allows you to modify the amendment text directly.
                    </Text>
                    <TextField
                      multiline rows={12}
                      defaultValue="Azure Commitment Discount is not applicable to Microsoft Azure Reserved Instances (&quot;RIs&quot;). Microsoft agrees to discount the following RIs as outlined in the table below. The discount will be a fixed percentage based on the list price at the time the Enrolled Affiliate completes the purchase in the Azure portal. The discounted price will apply for the duration of the reservation commitment. Discounts cannot be applied retroactively."
                      styles={{ root: { width: '100%' } }}
                    />
                  </Stack>
                </PivotItem>
              </Pivot>
              </div>
              <div style={{ padding: '12px 0', borderTop: `1px solid ${theme.palette.neutralLight}`, backgroundColor: theme.palette.white, flexShrink: 0 }}>
                <Stack horizontal tokens={{ childrenGap: 8 }}>
                  <PrimaryButton
                    text={isSaving ? '' : 'Save and Preview'}
                    disabled={isSaving}
                    onClick={() => {
                      setIsSaving(true);
                      setTimeout(() => {
                        setIsSaving(false);
                      }, 1200);
                    }}
                  >
                    {isSaving && <Spinner size={SpinnerSize.small} styles={{ root: { marginRight: 6 } }} />}
                    {isSaving && 'Saving...'}
                  </PrimaryButton>
                  <DefaultButton text="Close" onClick={() => setEditAmendment(null)} />
                </Stack>
              </div>
            </div>
          )}
        </div>
      </Panel>
    );
  };

  return (
    <Stack className={classNames.root} tokens={{ childrenGap: 0 }}>
      <Stack horizontal verticalAlign="center" className={classNames.sectionHeader} tokens={{ childrenGap: 8 }}>
        <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>
          Added amendments ({amendments.length})
        </Text>
        <ActionButton iconProps={{ iconName: 'Add' }} text="Add" onClick={() => setIsAddPanelOpen(true)} />
      </Stack>

      <MessageBar messageBarType={MessageBarType.info} isMultiline={false} styles={{ root: { marginTop: 8 } }}>
        Make sure the first row in the amendments list below is in the language you want for the final documents. You can rearrange the rows using the icons on the left.
      </MessageBar>

      <Text variant="small" styles={{ root: { color: theme.semanticColors.bodySubtext, padding: '8px 0 4px' } }}>
        Showing {amendments.length} amendment(s)
      </Text>

      <DetailsList
        items={amendments}
        columns={columns}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        getKey={(item) => (item as IAmendment).id}
        compact
      />

      <Stack className={classNames.scenarioSection} tokens={{ childrenGap: 12 }}>
        <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>Amendment scenario details</Text>
        <Stack horizontal tokens={{ childrenGap: 24 }}>
          <Stack tokens={{ childrenGap: 4 }} styles={{ root: { minWidth: 200 } }}>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
              <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>
                Scenario name <span style={{ color: '#A80000' }}>*</span>
              </Text>
              <Icon iconName="Edit" styles={{ root: { fontSize: 12, color: theme.palette.themePrimary, cursor: 'pointer' } }} />
              <Text styles={{ root: { fontSize: 12, color: theme.palette.themePrimary, cursor: 'pointer' } }}>Edit</Text>
            </Stack>
            <TextField defaultValue="Amendment_name" styles={{ root: { width: 200 } }} />
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Agreement type</Text>
            <Dropdown
              selectedKey="enrollment"
              options={[{ key: 'enrollment', text: 'Enrollment' }, { key: 'agreement', text: 'Agreement' }]}
              styles={{ dropdown: { minWidth: 200 } }}
            />
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Enrollment number</Text>
            <TextField placeholder="Enter" styles={{ root: { width: 200 } }} />
          </Stack>
        </Stack>
      </Stack>

      {renderEditPanel()}

      {/* Add Amendment Panel — two-column split layout */}
      <Panel
        isOpen={isAddPanelOpen}
        onDismiss={() => { setIsAddPanelOpen(false); setAddSearchQuery(''); setAddSearchLang('All'); setAddHasSearched(false); setAddedAmendments([]); setAddEmpowermentMap(new Map()); }}
        type={PanelType.custom}
        customWidth="80vw"
        headerText="Add amendments"
        styles={{
          main: { padding: 0 },
          content: { padding: 0, display: 'flex', flexDirection: 'column', flex: 1 },
          scrollableContent: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
          contentInner: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
        }}
      >
        <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary, padding: '0 24px 12px' } }}>
          Choose the language and start searching for the amendment you wish to add.
        </Text>
        <div className={classNames.addPanelBody}>
          {/* Left — Search Panel */}
          <div className={classNames.addPanelLeft}>
            <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="end" styles={{ root: { marginBottom: 12, flexShrink: 0 } }}>
              <Dropdown
                selectedKey={addSearchLang}
                options={[
                  { key: 'All', text: 'All languages' },
                  { key: 'English', text: 'English' },
                  { key: 'Japanese', text: 'Japanese' },
                  { key: 'Spanish', text: 'Spanish' },
                  { key: 'French', text: 'French' },
                  { key: 'Deutsch', text: 'Deutsch' },
                ]}
                onChange={(_, opt) => setAddSearchLang(opt?.key as string || 'All')}
                styles={{ root: { width: 160 }, dropdown: { minWidth: 0 } }}
              />
              <SearchBox
                placeholder="Search by amendment code or name"
                value={addSearchQuery}
                onChange={(_, val) => setAddSearchQuery(val || '')}
                onSearch={() => setAddHasSearched(true)}
                onClear={() => { setAddSearchQuery(''); setAddHasSearched(false); }}
                styles={{ root: { flex: 1 } }}
              />
              <PrimaryButton text="Search" onClick={() => setAddHasSearched(true)} styles={{ root: { minWidth: 80 } }} />
            </Stack>
            <Link styles={{ root: { fontSize: 12, marginBottom: 12, flexShrink: 0 } }}>
              Go to Empguide for Advanced Search <Icon iconName="OpenInNewWindow" styles={{ root: { fontSize: 10, marginLeft: 4 } }} />
            </Link>

            {!addHasSearched ? (
              <Stack horizontalAlign="center" styles={{ root: { padding: '60px 0', textAlign: 'center' } }}>
                <Icon iconName="Search" styles={{ root: { fontSize: 48, color: theme.palette.neutralTertiary, marginBottom: 12 } }} />
                <Text styles={{ root: { fontWeight: 600, fontSize: 16, marginBottom: 4 } }}>Search amendments</Text>
                <Text styles={{ root: { color: theme.palette.neutralSecondary, fontSize: 13 } }}>Enter an amendment code or name to search</Text>
              </Stack>
            ) : (() => {
              // Generate search results based on query
              const amendmentCodes = ['M919', 'M920', 'M1174', 'M(000)', 'M(111)'];
              const languages = addSearchLang === 'All' ? ['English', 'Japanese', 'Spanish', 'French', 'Deutsch'] : [addSearchLang];
              const matchingCodes = addSearchQuery.trim()
                ? amendmentCodes.filter((c) => c.toLowerCase().includes(addSearchQuery.toLowerCase()))
                : amendmentCodes;
              const searchResults = matchingCodes.flatMap((code) =>
                languages.map((lang) => ({
                  code,
                  title: `${code}: Azure Reservations Discounting - Fabric Capacity Reservation`,
                  language: lang,
                  empowerment: code === 'M1174' ? 'Business Desk' : 'Blue',
                  concessionId: code === 'M1174' ? '1980' : '3275',
                }))
              );
              return (
                <>
                  <Text styles={{ root: { fontSize: 13, fontWeight: 600, marginBottom: 8, flexShrink: 0 } }}>
                    Search results ({searchResults.length})
                  </Text>
                  <div style={{ flex: 1, overflow: 'auto' }}>
                    {searchResults.map((result, idx) => {
                      const isAdded = addedAmendments.some((a) => a.code === result.code && a.language === result.language);
                      return (
                        <div key={`${result.code}-${result.language}-${idx}`} className={classNames.searchCard}>
                          <Stack horizontal horizontalAlign="space-between" verticalAlign="start">
                            <Stack tokens={{ childrenGap: 6 }} styles={{ root: { flex: 1 } }}>
                              <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>{result.title}</Text>
                              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
                                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                                  <div style={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    backgroundColor: result.empowerment === 'Blue' ? '#0078d4' : result.empowerment === 'Business Desk' ? '#8764B8' : '#107C10',
                                  }} />
                                  <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }}>{result.empowerment}</Text>
                                </Stack>
                                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                                  <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }}>Concession ID: </Text>
                                  <Link styles={{ root: { fontSize: 12 } }}>{result.concessionId}</Link>
                                  <Icon iconName="OpenInNewWindow" styles={{ root: { fontSize: 10, color: theme.palette.themePrimary } }} />
                                </Stack>
                                <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }}>{result.language}</Text>
                              </Stack>
                              <Stack horizontal tokens={{ childrenGap: 12 }}>
                                <Link styles={{ root: { fontSize: 12 } }}>View related document <Icon iconName="OpenInNewWindow" styles={{ root: { fontSize: 9 } }} /></Link>
                                <Link styles={{ root: { fontSize: 12 } }}>View summary <Icon iconName="ChevronDown" styles={{ root: { fontSize: 9 } }} /></Link>
                              </Stack>
                            </Stack>
                            {isAdded ? (
                              <span className={classNames.addedBadge}>
                                <Icon iconName="CheckMark" styles={{ root: { fontSize: 10 } }} /> Added
                              </span>
                            ) : (
                              <button
                                className={classNames.addBtn}
                                onClick={() => {
                                  setAddedAmendments((prev) => [...prev, {
                                    code: result.code,
                                    title: result.title.replace(`${result.code}: `, ''),
                                    language: result.language,
                                    empowerment: result.empowerment,
                                    concessionId: result.concessionId,
                                  }]);
                                }}
                              >
                                + Add
                              </button>
                            )}
                          </Stack>
                        </div>
                      );
                    })}
                    {/* Custom amendment section */}
                    <div style={{ borderTop: `1px solid ${theme.palette.neutralLight}`, marginTop: 16, paddingTop: 12 }}>
                      <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary, marginBottom: 8, display: 'block' } }}>
                        Looking to customise an amendment for your requirement?
                      </Text>
                      <DefaultButton iconProps={{ iconName: 'Add' }} text="Add custom amendment" />
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Right — Added Amendments Table */}
          <div className={classNames.addPanelRight}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 14, marginBottom: 8 } }}>
              Added amendments ({addedAmendments.length})
            </Text>
            {addedAmendments.length > 0 && (
              <MessageBar messageBarType={MessageBarType.warning} isMultiline={false} styles={{ root: { marginBottom: 12 } }}>
                You might be required to fill necessary information to the added amendments prior to finalising the scenario.
              </MessageBar>
            )}
            {addedAmendments.length === 0 ? (
              <Stack horizontalAlign="center" styles={{ root: { padding: '60px 0', textAlign: 'center' } }}>
                <Icon iconName="Documentation" styles={{ root: { fontSize: 40, color: theme.palette.neutralTertiary, marginBottom: 8 } }} />
                <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary } }}>
                  No amendments added yet. Search and add amendments from the left panel.
                </Text>
              </Stack>
            ) : (
              <div style={{ flex: 1, overflow: 'auto' }}>
                <DetailsList
                  items={addedAmendments}
                  selectionMode={SelectionMode.none}
                  layoutMode={DetailsListLayoutMode.justified}
                  compact
                  columns={[
                    {
                      key: 'code', name: 'Code', minWidth: 80, maxWidth: 100,
                      onRender: (item: typeof addedAmendments[0]) => (
                        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                          <Link>{item.code}</Link>
                          <Icon iconName="OpenInNewWindow" styles={{ root: { fontSize: 10, color: theme.palette.themePrimary } }} />
                        </Stack>
                      ),
                    },
                    { key: 'title', name: 'Title', minWidth: 160, maxWidth: 240, isResizable: true, onRender: (item: typeof addedAmendments[0]) => <Text styles={{ root: { fontSize: 12 } }}>{item.title}</Text> },
                    { key: 'language', name: 'Language', minWidth: 70, maxWidth: 90, onRender: (item: typeof addedAmendments[0]) => <Text styles={{ root: { fontSize: 12 } }}>{item.language}</Text> },
                    {
                      key: 'empowermentLevel', name: 'Empowerment Level', minWidth: 130, maxWidth: 150,
                      onRender: (item: typeof addedAmendments[0], index?: number) => {
                        const key = `${item.code}-${item.language}`;
                        const currentVal = addEmpowermentMap.get(key) || item.empowerment;
                        return (
                          <Dropdown
                            selectedKey={currentVal}
                            options={EMPOWERMENT_OPTIONS as IDropdownOption[]}
                            styles={{ dropdown: { minWidth: 100 } }}
                            onChange={(_, opt) => {
                              if (opt) {
                                setAddEmpowermentMap((prev) => {
                                  const next = new Map(prev);
                                  next.set(key, opt.key as string);
                                  return next;
                                });
                              }
                            }}
                            onRenderTitle={(options) => {
                              const opt = options?.[0];
                              if (!opt) return null;
                              return (
                                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                                  <div style={{
                                    width: 10, height: 10, borderRadius: '50%',
                                    backgroundColor: opt.key === 'Blue' ? '#0078d4' : opt.key === 'Green' ? '#107C10' : opt.key === 'Yellow' ? '#FFB900' : opt.key === 'Business Desk' ? '#8764B8' : '#D13438',
                                  }} />
                                  <span>{opt.text}</span>
                                </Stack>
                              );
                            }}
                          />
                        );
                      },
                    },
                    {
                      key: 'actions', name: 'Actions', minWidth: 40, maxWidth: 40,
                      onRender: (_item: typeof addedAmendments[0], index?: number) => (
                        <IconButton
                          iconProps={{ iconName: 'Delete' }}
                          styles={{ root: { color: '#A80000' } }}
                          onClick={() => {
                            setAddedAmendments((prev) => prev.filter((_, i) => i !== index));
                          }}
                          title="Remove"
                        />
                      ),
                    },
                  ]}
                  getKey={(_, index) => String(index)}
                />
              </div>
            )}
            {/* Footer buttons */}
            <div style={{ padding: '12px 0', borderTop: `1px solid ${theme.palette.neutralLight}`, marginTop: 'auto', flexShrink: 0, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <DefaultButton text="Cancel" onClick={() => { setIsAddPanelOpen(false); setAddSearchQuery(''); setAddSearchLang('All'); setAddHasSearched(false); setAddedAmendments([]); setAddEmpowermentMap(new Map()); }} />
              <PrimaryButton text="Proceed" disabled={addedAmendments.length === 0} onClick={() => {
                // Add the amendments from the add panel to the main amendments list
                const newAmendments: IAmendment[] = addedAmendments.map((a, i) => {
                  const key = `${a.code}-${a.language}`;
                  const empLevel = addEmpowermentMap.get(key) || a.empowerment;
                  return {
                    id: `new-${Date.now()}-${i}`,
                    code: a.code,
                    title: `${a.code}: ${a.title}`,
                    language: a.language,
                    concessionId: a.concessionId,
                    empowermentLevel: empLevel,
                    modifiedBy: 'Current User',
                    modifiedOn: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
                    isDigitised: true,
                    status: 'Manual',
                  };
                });
                setAmendments((prev) => [...prev, ...newAmendments]);
                setIsAddPanelOpen(false); setAddSearchQuery(''); setAddSearchLang('All'); setAddHasSearched(false); setAddedAmendments([]); setAddEmpowermentMap(new Map());
              }} />
            </div>
          </div>
        </div>
      </Panel>
    </Stack>
  );
};
