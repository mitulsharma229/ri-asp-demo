import * as React from 'react';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { Stack } from '@fluentui/react/lib/Stack';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';

import { NavHeader } from '../components/NavHeader/NavHeader';
import { BreadcrumbBar } from '../components/BreadcrumbBar/BreadcrumbBar';
import { EmptyState } from '../components/EmptyState/EmptyState';

import { ScenarioNav } from '../components/ScenarioNav/ScenarioNav';
import { ProductSearchPanel } from '../components/ProductSearchPanel/ProductSearchPanel';
import { ProductGrid, IBulkEditValues } from '../components/ProductGrid/ProductGrid';
import { AmendmentsView } from '../components/AmendmentsView/AmendmentsView';
import { ErrorsWarningsView } from '../components/ErrorsWarningsView/ErrorsWarningsView';
import { GenerateDocuments } from '../components/GenerateDocuments/GenerateDocuments';
import { DocumentsPage } from '../components/DocumentsPage/DocumentsPage';
import { Footer } from '../components/Footer/Footer';

import { sampleCatalogProducts, sampleAmendments, sampleGeneratedDocuments, sampleSupportingDocuments } from '../data/sampleData';
import { IAddedProduct, ICatalogProduct, FlowStep, PivotTab } from '../types/models';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      backgroundColor: theme.semanticColors.bodyBackground,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const,
    },
    body: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden' as const,
    },
    mainArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const,
    },
    pageContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const,
    },
    pivotContainer: {
      padding: '0 16px',
      flexShrink: 0,
    },
    commandBarArea: {
      padding: '0 16px',
      flexShrink: 0,
    },
    scenarioHeader: {
      padding: '8px 24px',
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
      backgroundColor: theme.palette.white,
    },
    scenarioContent: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden' as const,
    },
    infoBar: {
      display: 'flex',
      gap: 24,
      padding: '8px 24px',
      backgroundColor: theme.palette.white,
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
      fontSize: 12,
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 2,
    },
    infoLabel: {
      color: theme.palette.neutralSecondary,
      fontSize: 11,
    },
    infoValue: {
      fontSize: 12,
      fontWeight: 600,
    },
  })
);

const SKU_TYPES = ['D64ads_v5', 'D32ads_v5', 'D16ads_v5'];

const generateSkus = (productId: string, regions: string[], commitment: string) =>
  regions.flatMap((region) =>
    SKU_TYPES.map((skuType) => ({
      id: `${productId}-${skuType}-${region}-${commitment}`.replace(/\s/g, ''),
      skuType,
      region,
      commitment,
      discountPercent: 0,
      startDate: 'Mar 21, 2026',
      endDate: 'Mar 21, 2029',
    }))
  );

const convertCatalogToAdded = (catalog: ICatalogProduct): IAddedProduct => {
  const regionFromDetails = catalog.productDetails.match(/- ([A-Z][a-z]+ ?[A-Za-z]*)$/)?.[1] || '';
  const basePrice = catalog.listPriceNetUSD || 500.00;
  const tenants = (catalog.amendmentCode === 'M919' || catalog.amendmentCode === 'M(111)')
    ? ['tenant-a', 'tenant-b', 'tenant-c']
    : ['tenant-a', 'tenant-b'];
  const regions = regionFromDetails ? [regionFromDetails] : ['US West'];
  const commitment = '3 Years';
  const skus = generateSkus(catalog.id, regions, commitment);
  return {
    id: catalog.id,
    productDetails: catalog.productDetails,
    productFamily: catalog.productFamily,
    amendmentCode: catalog.amendmentCode,
    regions,
    commitment,
    discountPercent: 0,
    startDate: 'Mar 21, 2026',
    endDate: 'Mar 21, 2029',
    basePriceNetUSD: basePrice,
    priceNetUSD: basePrice,
    partNumber: catalog.partNumber,
    offering: catalog.offering,
    regionApplicable: !!regionFromDetails,
    groupName: catalog.amendmentCode,
    tenants,
    skus,
  };
};

export const FutureProductsPage: React.FC = () => {
  const theme = useTheme();
  const classNames = getClassNames(theme);

  const [activeTab, setActiveTab] = React.useState<PivotTab>('riaspFutureProducts');
  const [flowStep, setFlowStep] = React.useState<FlowStep>('products');
  const [products, setProducts] = React.useState<IAddedProduct[]>([]);
  const [availableTenants, setAvailableTenants] = React.useState<string[]>([]);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [showConfigWarning, setShowConfigWarning] = React.useState(false);
  const [isGridEditing, setIsGridEditing] = React.useState(false);

  const handleAddProducts = React.useCallback(() => {
    setIsSearchPanelOpen(true);
  }, []);

  const handleConfirmSelection = React.useCallback((selectedProducts: ICatalogProduct[], selectedTenants: string[]) => {
    const newProducts = selectedProducts.map((p) => ({ ...convertCatalogToAdded(p), tenants: selectedTenants }));
    setAvailableTenants((prev) => {
      const merged = new Set([...prev, ...selectedTenants]);
      return Array.from(merged);
    });
    setProducts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const unique = newProducts.filter((p) => !existingIds.has(p.id));
      return [...prev, ...unique];
    });
    setIsSearchPanelOpen(false);
    setSuccessMessage(`${selectedProducts.length} products added successfully!`);
    setHasUnsavedChanges(true);
    setShowConfigWarning(true);
    setTimeout(() => setSuccessMessage(''), 5000);
  }, []);

  const handleUpdateProduct = React.useCallback((id: string, field: keyof IAddedProduct, value: unknown) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };
        if (field === 'regions' || field === 'commitment') {
          updated.skus = generateSkus(p.id, updated.regions, updated.commitment);
          updated.selectedSkuIds = undefined;
        }
        return updated;
      })
    );
    setHasUnsavedChanges(true);
  }, []);

  const handleDeleteProducts = React.useCallback((ids: string[]) => {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    setHasUnsavedChanges(true);
  }, []);

  const handleDuplicateProducts = React.useCallback((ids: string[]) => {
    let firstName = '';
    setProducts((prev) => {
      const result: IAddedProduct[] = [];
      prev.forEach((p) => {
        result.push(p);
        if (ids.includes(p.id)) {
          if (!firstName) firstName = p.productDetails;
          const newId = `${p.id}-dup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          result.push({
            ...p,
            id: newId,
            skus: undefined,
            selectedSkuIds: undefined,
            discountPercent: 0,
            priceNetUSD: p.basePriceNetUSD,
            regions: [],
            commitment: '',
            startDate: '',
            endDate: '',
          });
        }
      });
      return result;
    });
    setHasUnsavedChanges(true);
    const label = ids.length === 1 ? `"${firstName}"` : `${ids.length} products`;
    setSuccessMessage(`${label} duplicated successfully!`);
    setTimeout(() => setSuccessMessage(''), 5000);
  }, []);

  const handleBulkEditApply = React.useCallback((ids: string[], values: IBulkEditValues) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (!ids.includes(p.id)) return p;
        const updated = { ...p };
        if (values.regions && values.regions.length > 0) updated.regions = values.regions;
        if (values.commitment) updated.commitment = values.commitment;
        if (values.discountPercent !== undefined) {
          updated.discountPercent = values.discountPercent;
          updated.priceNetUSD = updated.basePriceNetUSD * (1 - values.discountPercent / 100);
        }
        if (values.startDatePreset === 'At order acceptance') {
          updated.startDate = 'At order acceptance';
        } else if (values.startDate) {
          updated.startDate = values.startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        }
        if (values.endDateDuration) {
          // Compute end date from duration based on the product's start date
          const startStr = values.startDatePreset === 'At order acceptance' ? 'At order acceptance'
            : values.startDate ? values.startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            : updated.startDate;
          const start = startStr === 'At order acceptance' ? new Date() : new Date(startStr);
          if (!isNaN(start.getTime())) {
            const end = new Date(start);
            const d = values.endDateDuration;
            if (d === '3 months') end.setMonth(end.getMonth() + 3);
            else if (d === '6 months') end.setMonth(end.getMonth() + 6);
            else if (d === '9 months') end.setMonth(end.getMonth() + 9);
            else if (d === '10 months') end.setMonth(end.getMonth() + 10);
            else if (d === '11 months') end.setMonth(end.getMonth() + 11);
            else if (d === '1 year') end.setFullYear(end.getFullYear() + 1);
            else if (d === '18 months') end.setMonth(end.getMonth() + 18);
            else if (d === '2 years') end.setFullYear(end.getFullYear() + 2);
            else if (d === '3 years') end.setFullYear(end.getFullYear() + 3);
            else if (d === '5 years') end.setFullYear(end.getFullYear() + 5);
            updated.endDate = end.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
          }
        } else if (values.endDate) {
          updated.endDate = values.endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        }
        if (values.regions || values.commitment) {
          updated.skus = generateSkus(p.id, updated.regions, updated.commitment);
          updated.selectedSkuIds = undefined;
        }
        return updated;
      })
    );
    setHasUnsavedChanges(true);
    setSuccessMessage('Changes saved successfully!');
    setTimeout(() => setSuccessMessage(''), 5000);
  }, []);

  const handleSave = React.useCallback(() => {
    setHasUnsavedChanges(false);
    setSuccessMessage('Changes saved successfully!');
    setTimeout(() => setSuccessMessage(''), 5000);
  }, []);

  const handleNext = React.useCallback(() => {
    const steps: FlowStep[] = ['products', 'amendments', 'errorsWarnings', 'generate', 'documents'];
    const idx = steps.indexOf(flowStep);
    if (idx < steps.length - 1) {
      setFlowStep(steps[idx + 1]);
    }
  }, [flowStep]);

  const handlePrev = React.useCallback(() => {
    const steps: FlowStep[] = ['products', 'amendments', 'errorsWarnings', 'generate', 'documents'];
    const idx = steps.indexOf(flowStep);
    if (idx > 0) {
      setFlowStep(steps[idx - 1]);
    }
  }, [flowStep]);

  const renderProductsView = () => {
    if (products.length === 0) {
      return <EmptyState onAddProducts={handleAddProducts} buttonText="Add RI/ASP Future Products" />;
    }

    return (
      <Stack tokens={{ childrenGap: 8 }} styles={{ root: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}>
        {successMessage && (
          <MessageBar
            messageBarType={MessageBarType.success}
            onDismiss={() => setSuccessMessage('')}
            dismissButtonAriaLabel="Close"
            styles={{ root: { margin: '0 16px', flexShrink: 0 } }}
          >
            {successMessage}
          </MessageBar>
        )}
        {showConfigWarning && (
          <MessageBar
            messageBarType={MessageBarType.info}
            onDismiss={() => setShowConfigWarning(false)}
            dismissButtonAriaLabel="Close"
            styles={{ root: { margin: '0 16px', flexShrink: 0 } }}
          >
            Make sure you have populated all the required configuration fields before proceeding.
          </MessageBar>
        )}
        <ProductGrid
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProducts={handleDeleteProducts}
          onDuplicateProducts={handleDuplicateProducts}
          onBulkEditApply={handleBulkEditApply}
          onSave={handleSave}
          onAddProducts={handleAddProducts}
          hasUnsavedChanges={hasUnsavedChanges}
          availableTenants={availableTenants}
          onEditModeChange={setIsGridEditing}
        />
      </Stack>
    );
  };

  const renderScenarioContent = () => {
    switch (flowStep) {
      case 'amendments':
        return <AmendmentsView amendments={sampleAmendments} />;
      case 'errorsWarnings':
        return <ErrorsWarningsView onNavigate={setFlowStep} />;
      case 'generate':
        return (
          <GenerateDocuments
            onComplete={() => setFlowStep('documents')}
            hasErrors={true}
            onGoToErrors={() => setFlowStep('errorsWarnings')}
          />
        );
      case 'documents':
        return (
          <DocumentsPage
            generatedDocuments={sampleGeneratedDocuments}
            supportingDocuments={sampleSupportingDocuments}
            onGoToProposal={() => setSuccessMessage('Redirecting to proposal...')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack className={classNames.root}>
      <NavHeader />
      <BreadcrumbBar
        quoteName="ParleG Basic"
        quoteId="P1103281.001"
        currentPage="Future Products"
      />

      <div className={classNames.body}>
        <ScenarioNav activeStep={flowStep} onStepChange={setFlowStep} />

        <div className={classNames.mainArea}>
          {flowStep === 'products' ? (
            /* Products tab view */
            <div className={classNames.pageContent}>
              <div className={classNames.pivotContainer}>
                <Pivot
                  selectedKey={activeTab}
                  onLinkClick={(item) => {
                    if (item?.props.itemKey) {
                      setActiveTab(item.props.itemKey as PivotTab);
                    }
                  }}
                >
                  <PivotItem headerText="Future Products" itemKey="futureProducts" />
                  <PivotItem headerText="Optional Future Products" itemKey="optionalFutureProducts" />
                  <PivotItem headerText="RI/ASP Future Products" itemKey="riaspFutureProducts" />
                </Pivot>
              </div>

              {activeTab === 'futureProducts' && (
                <EmptyState onAddProducts={() => setActiveTab('riaspFutureProducts')} />
              )}

              {activeTab === 'optionalFutureProducts' && (
                <EmptyState onAddProducts={() => setActiveTab('riaspFutureProducts')} />
              )}

              {activeTab === 'riaspFutureProducts' && renderProductsView()}
            </div>
          ) : (
            /* Scenario detail view */
            <Stack styles={{ root: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}>
              {/* Scenario info bar */}
              <div className={classNames.infoBar}>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Status</span>
                  <span className={classNames.infoValue}>In progress</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Scenario ID</span>
                  <span className={classNames.infoValue}>AMD7838217.001</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Opportunity</span>
                  <span className={classNames.infoValue}>7-W0DDM6SK</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Program</span>
                  <span className={classNames.infoValue}>Enterprise</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Customer</span>
                  <span className={classNames.infoValue}>Starbucks Corporation India...</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Customer country</span>
                  <span className={classNames.infoValue}>United States</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Pricing country</span>
                  <span className={classNames.infoValue}>United States</span>
                </div>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }}>
                {renderScenarioContent()}
              </div>
            </Stack>
          )}
        </div>
      </div>

      <Footer
        onNext={handleNext}
        onCancel={() => {
          if (flowStep !== 'products') {
            setFlowStep('products');
          }
        }}
        onPrev={flowStep !== 'products' ? handlePrev : undefined}
        showPrev={flowStep !== 'products'}
        nextLabel={flowStep === 'generate' ? 'Generate final documents & Send for approval' : 'Next'}
        nextDisabled={products.length === 0 || isGridEditing}
      />

      <ProductSearchPanel
        isOpen={isSearchPanelOpen}
        onDismiss={() => setIsSearchPanelOpen(false)}
        catalogProducts={sampleCatalogProducts}
        onConfirmSelection={handleConfirmSelection}
      />
    </Stack>
  );
};
