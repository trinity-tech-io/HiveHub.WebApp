import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SnackbarProvider } from 'notistack';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import { LanguageContextProvider } from './contexts/LanguageContext';
import { UserContextProvider } from './contexts/UserContext';
import { DialogContextProvider } from './contexts/DialogContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <SnackbarProvider maxSnack={1}>
        <UserContextProvider>
          <DialogContextProvider>
            <LanguageContextProvider>
              <BrowserRouter>
                <ThemeConfig>
                  <ScrollToTop />
                  <GlobalStyles />
                  <BaseOptionChartStyle />
                  <Router />
                </ThemeConfig>
              </BrowserRouter>
            </LanguageContextProvider>
          </DialogContextProvider>
        </UserContextProvider>
      </SnackbarProvider>
    </HelmetProvider>
  );
}
