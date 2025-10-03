import { useLocation, useNavigate } from 'react-router-dom';

export function useAuthNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToAuth = (returnUrl?: string) => {
    const redirectPath = returnUrl || location.pathname;
    navigate('/auth/signin', {
      state: { from: redirectPath },
      replace: true,
    });
  };

  const redirectAfterAuth = () => {
    const returnUrl = location.state?.from || '/';
    navigate(returnUrl, { replace: true });
  };

  return {
    redirectToAuth,
    redirectAfterAuth,
  };
}
