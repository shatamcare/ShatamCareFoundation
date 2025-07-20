import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardPage from '@/components/admin/DashboardPage';
import EventsPage from '@/components/admin/EventsPage';
import ProgramsPage from '@/pages/ProgramsPage';
import ContactsPage from '@/components/admin/ContactsPage';
import MediaPage from '@/components/admin/MediaPage';
import ContentPage from '@/components/admin/ContentPage';
import SettingsPage from '@/components/admin/SettingsPage';

const AdminPage = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'events':
        return <EventsPage />;
      case 'programs':
        return <ProgramsPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'media':
        return <MediaPage />;
      case 'content':
        return <ContentPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </AdminLayout>
  );
};

export default AdminPage;
