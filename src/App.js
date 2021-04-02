import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { SnackbarProvider} from 'notistack';

const App = () => {
  const routing = useRoutes(routes);

  return (
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <SnackbarProvider anchorOrigin={{ horizontal: "right", vertical: "bottom" }} maxSnack={5}>
            {routing}
          </SnackbarProvider>
        </ThemeProvider>
  );
};
export default App;
