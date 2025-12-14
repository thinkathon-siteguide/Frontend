import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { architectureApi } from '../services/architecture.api';
import toast from 'react-hot-toast';

export const useArchitectureStages = (workspaceId: string | null) => {
  const queryClient = useQueryClient();

  const stagesQuery = useQuery({
    queryKey: ['architecture-stages', workspaceId],
    queryFn: () => architectureApi.getArchitectureStages(workspaceId!),
    enabled: !!workspaceId,
    retry: false,
  });

  const addStageMutation = useMutation({
    mutationFn: (stage: { phase: string; duration: string; tasks: string[] }) =>
      architectureApi.addArchitectureStage(workspaceId!, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['architecture-stages', workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ['architecture', workspaceId],
      });
      toast.success('Stage added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add stage');
    },
  });

  return {
    stages: stagesQuery.data,
    isLoading: stagesQuery.isLoading,
    isError: stagesQuery.isError,
    error: stagesQuery.error,
    addStage: addStageMutation.mutate,
    isAdding: addStageMutation.isPending,
  };
};
