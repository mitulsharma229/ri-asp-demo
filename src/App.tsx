import { ThemeProvider, createTheme } from '@fluentui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FutureProductsPage } from './pages/FutureProductsPage';
import { SkuConfigWorkflow } from './components/SkuConfigWorkflow/SkuConfigWorkflow';

const appTheme = createTheme({
  palette: {
    themePrimary: '#0078d4',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    themeLight: '#c7e0f4',
    themeLighter: '#deecf9',
    themeLighterAlt: '#eff6fc',
  },
});

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <BrowserRouter basename="/ri-asp-prototype">
        <Routes>
          <Route path="/" element={<FutureProductsPage />} />
          <Route path="/sku-config" element={<SkuConfigWorkflow />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
