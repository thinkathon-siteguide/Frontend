import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { architectureApi } from '../services/architecture.api';
import toast from 'react-hot-toast';

export const useArchitectureSections = (workspaceId: string | null) => {
  const queryClient = useQueryClient();

  const sectionsQuery = useQuery({
    queryKey: ['architecture-sections', workspaceId],
    queryFn: () => architectureApi.getArchitectureSections(workspaceId!),
    enabled: !!workspaceId,
    retry: false,
  });

  const addSectionMutation = useMutation({
    mutationFn: (section: { title: string; description: string }) =>
      architectureApi.addArchitectureSection(workspaceId!, section),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['architecture-sections', workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ['architecture', workspaceId],
      });
      toast.success('Section added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add section');
    },
  });

  return {
    sections: sectionsQuery.data,
    isLoading: sectionsQuery.isLoading,
    isError: sectionsQuery.isError,
    error: sectionsQuery.error,
    addSection: addSectionMutation.mutate,
    isAdding: addSectionMutation.isPending,
  };
};
