import I18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import * as locales from '~/locales'

I18next
  .use(initReactI18next)
  .init({
    resources: locales,
  
    lng:         'nl',
    fallbackLng: 'en',

    compatibilityJSON: 'v3',

    returnNull:    true,
    returnObjects: true,

    interpolation: {
      escapeValue: false,
    },
  })