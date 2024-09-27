import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenExpired } from '../utils/auth';

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      if (!localStorage.getItem('token')) {
        router.push('/signin');
        return;
      }

      if (isTokenExpired()) {
        // Clear the expired token from localStorage
        localStorage.removeItem('token');

        // Show an alert to the user
        window.alert('Your session has expired. Please sign in again.');

        // Redirect to the sign-in page
        router.push('/signin');
      }
    };

    // Initial check on component mount
    checkToken();

    // Check token validity every 10 seconds
    const interval = setInterval(checkToken, 10000);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, [router]);
}
