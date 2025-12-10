import { detectLocaleByNavigator } from '@/utils/locale';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RootRedirect: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const target = detectLocaleByNavigator();
    navigate(`/${target}/`, { replace: true });
  }, [navigate]);
  return null;
};

export default RootRedirect;
