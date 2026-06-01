import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';

const getClassNames = memoizeFunction((_theme: ITheme) =>
  mergeStyleSets({
    root: {
      minHeight: 400,
    },
    illustration: {
      width: 120,
      height: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cactus: {
      fontSize: 64,
      lineHeight: 1,
    },
  })
);

export interface IEmptyStateProps {
  onAddProducts: () => void;
  buttonText?: string;
}

export const EmptyState: React.FC<IEmptyStateProps> = ({ onAddProducts, buttonText }) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      tokens={{ childrenGap: 12, padding: 64 }}
      className={classNames.root}
    >
      <div className={classNames.illustration}>
        <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
          <ellipse cx="50" cy="72" rx="40" ry="6" fill="#F3E8C8" />
          <rect x="46" y="20" width="8" height="50" rx="4" fill="#6B9E76" />
          <rect x="38" y="30" width="6" height="25" rx="3" fill="#6B9E76" />
          <rect x="56" y="25" width="6" height="20" rx="3" fill="#6B9E76" />
          <circle cx="65" cy="55" r="10" fill="#F5C842" />
          <circle cx="65" cy="55" r="7" fill="#E6B830" />
        </svg>
      </div>
      <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
        No product(s) found
      </Text>
      <Text
        variant="medium"
        styles={{ root: { color: theme.semanticColors.bodySubtext } }}
      >
        Click below to start adding the products.
      </Text>
      <PrimaryButton
        text={buttonText || "Add Products"}
        iconProps={{ iconName: 'Add' }}
        onClick={onAddProducts}
        styles={{ root: { marginTop: 8 } }}
      />
    </Stack>
  );
};
