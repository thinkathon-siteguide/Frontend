import { useMutation } from '@tanstack/react-query';
import api from '../../../services/api';
import { useApp } from '../../../context/AppContext';

export const useAuth = () => {
  const { setUser } = useApp();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: any) => {
      const response = await api.post('/auth/login', { email, password });
      return response.data.data;
    },
    onSuccess: (data: any) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('thinklab_user', JSON.stringify(data.user));
      setUser(data.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async ({ name, email, password }: any) => {
      const response = await api.post('/auth/signup', { name, email, password });
      return response.data.data;
    },
    onSuccess: (data: any) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('thinklab_user', JSON.stringify(data.user));
      setUser(data.user);
    },
  });

  return {
    login: loginMutation,
    signup: signupMutation,
  };
};
