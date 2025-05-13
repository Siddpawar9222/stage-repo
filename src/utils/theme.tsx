// utils/theme.tsx
import { createTheme, ThemeOptions } from '@mui/material/styles';

const lightShadows: [
  "none", string, string, string, string, string, string, string, string, string,
  string, string, string, string, string, string, string, string, string, string,
  string, string, string, string, string
] = [
  "none",
  ...Array(24).fill("0px 2px 8px rgba(0, 0, 0, 0.15)") as [string, string, string, string, string, string, string, string, string, string,
  string, string, string, string, string, string, string, string, string, string,
  string, string, string, string]
];

const darkShadows: [
  "none", string, string, string, string, string, string, string, string, string,
  string, string, string, string, string, string, string, string, string, string,
  string, string, string, string, string
] = [
  "none",
  ...Array(24).fill("0px 2px 8px rgba(255, 255, 255, 0.15)") as [string, string, string, string, string, string, string, string, string, string,
  string, string, string, string, string, string, string, string, string, string,
  string, string, string, string]
];

declare module '@mui/material/styles' {
  interface Palette {
    customText: {
      main: string;
    };
  }

  interface PaletteOptions {
    customText?: {
      main?: string;
    };
  }
}

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Example primary color for light theme
      light: '#fff',
    },
    secondary: {
      main: '#9c27b0', // Example secondary color for light theme
    },
    background: {
      default: '#f5f5f5', // Light background
      paper: 'rgb(240, 244, 248)', // Light paper background
    },
    customText: { 
      main: '#fff',
    },
  },

  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '& .MuiListItemIcon-root': {
            color: 'black',
          },
          '&:hover': {
            backgroundColor: '#1976d2',
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
              color: 'white',
            },
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2', 
          color: 'white', 
        },
      },
    },
  },
  shadows: lightShadows,
};

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', 
      light: "#333",
    },
    secondary: {
      main: '#ce93d8', 
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Dark paper background
    },
    customText: {
      main: '#121212',
    },
  },

  components: {
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#90caf9', // Primary background for dark theme
          color: '#121212', // Dark text for dark theme
        },
      },
    },
  },

  // shadows: darkShadows,
};

export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);