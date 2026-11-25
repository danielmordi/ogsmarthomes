import {createRoot} from 'react-dom/client';
import { AppRouter } from './router.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<AppRouter />);
