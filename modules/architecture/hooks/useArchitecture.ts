import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { architectureApi } from '../services/architecture.api';
import toast from 'react-hot-toast';

export const useArchitecture = (workspaceId: string | null) => {
  const queryClient = useQueryClient();

  const architectureQuery = useQuery({
    queryKey: ['architecture', workspaceId],
    queryFn: () => architectureApi.getArchitecturePlan(workspaceId!),
    enabled: !!workspaceId,
    retry: false,
  });

  const saveArchitectureMutation = useMutation({
    mutationFn: (plan: any) =>
      architectureApi.saveArchitecturePlan(workspaceId!, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['architecture', workspaceId],
      });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Architecture plan saved successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to save architecture plan'
      );
    },
  });

  const updateArchitectureMutation = useMutation({
    mutationFn: (plan: any) =>
      architectureApi.updateArchitecturePlan(workspaceId!, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['architecture', workspaceId],
      });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Architecture plan updated successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update architecture plan'
      );
    },
  });

  const deleteArchitectureMutation = useMutation({
    mutationFn: () => architectureApi.deleteArchitecturePlan(workspaceId!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['architecture', workspaceId],
      });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Architecture plan deleted successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to delete architecture plan'
      );
    },
  });

  return {
    architecture: architectureQuery.data,
    isLoading: architectureQuery.isLoading,
    isError: architectureQuery.isError,
    error: architectureQuery.error,
    saveArchitecture: saveArchitectureMutation.mutate,
    isSaving: saveArchitectureMutation.isPending,
    updateArchitecture: updateArchitectureMutation.mutate,
    isUpdating: updateArchitectureMutation.isPending,
    deleteArchitecture: deleteArchitectureMutation.mutate,
    isDeleting: deleteArchitectureMutation.isPending,
  };
};
