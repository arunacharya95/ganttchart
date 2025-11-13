import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GanttReact',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@mui/material',
        '@mui/material/styles',
        '@mui/material/Button',
        '@mui/material/Dialog',
        '@mui/material/DialogTitle',
        '@mui/material/DialogContent',
        '@mui/material/DialogActions',
        '@mui/material/TextField',
        '@mui/material/Select',
        '@mui/material/MenuItem',
        '@mui/material/FormControl',
        '@mui/material/InputLabel',
        '@emotion/react',
        '@emotion/styled',
        'date-fns'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        }
      }
    }
  }
})
