import React from 'react';
import { useAuth } from '@/layouts/Root';
import { useSelector } from 'react-redux';
import Button from '@/components/atoms/Button';

const LogoutButton = () => {
  const { logout } = useAuth();
  const { isAuthenticated, user } = useSelector(state => state.user);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      icon="LogOut"
      onClick={logout}
      className="text-red-600 border-red-200 hover:bg-red-50"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;