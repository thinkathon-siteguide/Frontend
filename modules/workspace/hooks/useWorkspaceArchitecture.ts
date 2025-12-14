import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceApi } from '../services/workspace.api';
import { toast } from 'react-hot-toast';

export const useWorkspaceArchitecture = (workspaceId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: architecturePlan,
    isLoading,
    error
  } = useQuery({
    queryKey: ['workspaceArchitecture', workspaceId],
    queryFn: () => workspaceApi.getArchitecturePlan(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5
  });

  const saveArchitecturePlanMutation = useMutation({
    mutationFn: (planData: {
      sections: Array<{ title: string; description: string }>;
      materials: Array<{ name: string; quantity: string; specification: string }>;
      stages: Array<{ phase: string; duration: string; tasks: string[] }>;
      summary: string;
    }) => workspaceApi.saveArchitecturePlan(workspaceId!, planData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceArchitecture', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      toast.success('Architecture plan saved successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to save architecture plan');
    }
  });

  return {
    architecturePlan,
    isLoading,
    error,
    saveArchitecturePlan: saveArchitecturePlanMutation.mutate,
    isSaving: saveArchitecturePlanMutation.isPending
  };
};

