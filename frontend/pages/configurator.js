import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import the configurator to avoid SSR issues with Three.js
const ShelfConfigurator = dynamic(
  () => import('../components/ShelfConfigurator'),
  { ssr: false }
);

export default function Configurator() {
  return (
    <>
      <Head>
        <title>3D Configurator - ModularSpace</title>
      </Head>

      <div className="border-y-2 border-line bg-background py-12">
        <ShelfConfigurator />
      </div>
    </>
  );
}
