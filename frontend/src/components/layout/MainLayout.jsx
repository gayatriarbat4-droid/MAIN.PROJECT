import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />
      <main className="flex-1 w-full pt-20 bg-surface">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
