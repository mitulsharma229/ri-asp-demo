import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { DetailsList, IColumn, SelectionMode, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link } from '@fluentui/react/lib/Link';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';

import { FlowStep } from '../../types/models';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: { padding: '16px 24px', flex: 1 },
    successBanner: {
      backgroundColor: '#DFF6DD',
      borderRadius: 4,
      padding: '10px 16px',
    },
    errorText: {
      color: '#A80000',
      fontWeight: 600,
    },
    warningLink: {
      color: theme.palette.themePrimary,
      fontWeight: 600,
      cursor: 'pointer',
    },
    filterBar: {
      padding: '8px 0',
    },
  })
);

interface IValidationItem {
  id: string;
  name: string;
  type: 'Error' | 'Warning';
  description: string;
  navigateTo: FlowStep;
}

const sampleValidationItems: IValidationItem[] = [
  { id: 'v1', name: 'Missing amendment based on Future Product added', type: 'Error', description: 'Associated amendment M1174 is required to support "Fabric Capacity Reservation - US East" in group M1174. Add and populate the amendment to proceed.', navigateTo: 'amendments' },
  { id: 'v2', name: 'Missing values in added amendment', type: 'Error', description: 'Amendment M919 has empty fields: "Discount Start Date" and "Discount End Date" in Table 1, rows 3-5. Open the amendment to populate these values.', navigateTo: 'amendments' },
  { id: 'v3', name: 'Missing region for product', type: 'Error', description: 'Product "Azure Savings Plan - Compute - 1 year" (ASP-11111) is missing a region value. Navigate to products and configure the region.', navigateTo: 'products' },
  { id: 'v4', name: 'Missing commitment for product', type: 'Warning', description: 'Products "Fabric Capacity Reservation - US Central" and "Fabric Capacity Reservation - EU North" do not have a commitment value set. Configure before generating documents.', navigateTo: 'products' },
];

export interface IErrorsWarningsViewProps {
  onNavigate?: (step: FlowStep) => void;
}

export const ErrorsWarningsView: React.FC<IErrorsWarningsViewProps> = ({ onNavigate }) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);

  const columns: IColumn[] = React.useMemo(
    () => [
      {
        key: 'name',
        name: 'Name',
        minWidth: 250,
        maxWidth: 350,
        isResizable: true,
        onRender: (item: IValidationItem) => (
          <Link onClick={() => onNavigate?.(item.navigateTo)}>{item.name}</Link>
        ),
      },
      {
        key: 'type',
        name: 'Type',
        minWidth: 80,
        maxWidth: 100,
        onRender: (item: IValidationItem) => (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
            <Icon
              iconName={item.type === 'Error' ? 'StatusErrorFull' : 'Warning'}
              styles={{ root: { color: item.type === 'Error' ? '#A80000' : '#FFB900', fontSize: 14 } }}
            />
            <Text styles={{ root: { color: item.type === 'Error' ? '#A80000' : '#835C00', fontSize: 13 } }}>
              {item.type}
            </Text>
          </Stack>
        ),
      },
      {
        key: 'description',
        name: 'Description',
        minWidth: 300,
        isResizable: true,
        onRender: (item: IValidationItem) => (
          <Text styles={{ root: { fontSize: 13 } }}>{item.description}</Text>
        ),
      },
    ],
    []
  );

  return (
    <Stack className={classNames.root} tokens={{ childrenGap: 12 }}>
      {/* Success banner */}
      <Stack horizontal verticalAlign="center" className={classNames.successBanner} tokens={{ childrenGap: 8 }}>
        <Icon iconName="SkypeCircleCheck" styles={{ root: { color: '#107C10', fontSize: 16 } }} />
        <Text styles={{ root: { fontSize: 13 } }}>
          Errors and Warnings validations are completed. The list has been updated as per the latest changes.
        </Text>
      </Stack>

      {/* Error message */}
      <Text styles={{ root: { fontSize: 13 } }}>
        Fix following <span className={classNames.errorText}>Errors</span> to generate Final or Preliminary and you may skip the <span className={classNames.warningLink}>Warnings</span>.
      </Text>

      {/* Pivot tabs */}
      <Pivot>
        <PivotItem headerText="Preliminary CPS" />
        <PivotItem headerText="Final CPS" />
        <PivotItem headerText="Preliminary Amendment" itemKey="prelimAmendment" />
        <PivotItem headerText="Final Amendment" />
      </Pivot>

      {/* Filter */}
      <Stack horizontal verticalAlign="center" className={classNames.filterBar} tokens={{ childrenGap: 8 }}>
        <Icon iconName="Filter" styles={{ root: { color: theme.palette.neutralSecondary, fontSize: 14 } }} />
        <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary } }}>Filter:</Text>
        <Text styles={{ root: { fontSize: 13 } }}>Type: <strong>All</strong></Text>
      </Stack>

      {/* Validation table */}
      <DetailsList
        items={sampleValidationItems}
        columns={columns}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        getKey={(item) => (item as IValidationItem).id}
        compact
      />
    </Stack>
  );
};
