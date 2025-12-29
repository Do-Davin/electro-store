import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const Noir = definePreset(Aura, {
    semantic: {
        primary: {
                50: '#e6eef7',
                100: '#bfd4eb',
                200: '#99bbdf',
                300: '#4d89c6',
                400: '#1f6dac',
                500: '#003465',
                600: '#002d55',
                700: '#002544',
                800: '#001d33',
                900: '#001622'
        },
        colorScheme: {
            light: {
                primary: {
                color: '{primary.950}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.900}',
                activeColor: '{primary.800}'
                },
                highlight: {
                background: '{primary.950}',
                focusBackground: '{primary.700}',
                color: '#ffffff',
                focusColor: '#ffffff'
                },
            },
            dark: {
                primary: {
                color: '{primary.50}',
                contrastColor: '{primary.950}',
                hoverColor: '{primary.100}',
                activeColor: '{primary.200}'
                },
                highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.300}',
                color: '{primary.950}',
                focusColor: '{primary.950}'
                }
            }
        }
    }
});

export default Noir;
