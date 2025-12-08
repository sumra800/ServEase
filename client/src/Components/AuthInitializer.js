import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getCurrentUser } from '../store/slices/authSlice';

function AuthInitializer({ children }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    // If token exists, verify it's still valid
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  return children;
}

export default AuthInitializer;

