import { createDiscreteApi } from 'naive-ui'

export const { message } = createDiscreteApi(['message'], {
  messageProviderProps: {
    themeOverrides: {
      color: '#f7b7b0',
      padding: '16px 20px',
      fontSize: '16px'
    },
  },
})
