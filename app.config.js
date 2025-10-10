import 'dotenv/config';

export default {
    expo: {
        name: 'BlipBlop',
        slug: '335-mobile-app',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        newArchEnabled: true,
        splash: {
            image: './src/assets/images/icon/App_symbol_1024.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff'
        },
        ios: {
            supportsTablet: true
        },
        android: {
            package: 'com.veraguth.blipblop',
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff'
            },
            edgeToEdgeEnabled: true,
            softwareKeyboardLayoutMode: 'resize'
        },
        web: {
            favicon: './assets/favicon.png'
        },
        extra: {
            GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
            GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
            eas: {
                projectId: '33562438-0995-42f9-852b-d53ecd0122f3'
            }
        }
    }
};