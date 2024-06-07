import '../styles/globals.css';
import type { AppProps } from 'next/app';
import MainLayout from '../components/MainLayout';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </DndProvider>
  );
}

export default MyApp;
