import { useEffect } from 'react';
import { PageType } from '../types';
import { isProtectedPage } from '../lib/app-routing';

interface UseAuthRedirectParams {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isAuthenticated: boolean;
}

export function useAuthRedirect({
  currentPage,
  setCurrentPage,
  isAuthenticated
}: UseAuthRedirectParams) {
  
  // Redirect to home if not authenticated and trying to access protected pages
  useEffect(() => {
    if (!isAuthenticated && isProtectedPage(currentPage)) {
      setCurrentPage('home');
    }
  }, [isAuthenticated, currentPage, setCurrentPage]);
}