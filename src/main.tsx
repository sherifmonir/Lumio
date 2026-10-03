import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'    
import App from './App'
import AuthProvider from './context/AuthContect'
import QueryProvider from './lib/react-query/QueryProvider'
import ThemeProvider from './context/ThemeContext'


ReactDOM.createRoot(document.getElementById('root')!).render(
<BrowserRouter>
    <QueryProvider>
        <AuthProvider>
            <ThemeProvider>
            <App />
            </ThemeProvider>
        </AuthProvider>
    </QueryProvider>
</BrowserRouter>
)