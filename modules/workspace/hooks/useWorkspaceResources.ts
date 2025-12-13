import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceApi } from '../services/workspace.api';
import { toast } from 'react-hot-toast';

export const useWorkspaceResources = (workspaceId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: resources = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['workspaceResources', workspaceId],
    queryFn: () => workspaceApi.getAllResources(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2
  });

  const addResourceMutation = useMutation({
    mutationFn: (resourceData: {
      name: string;
      quantity: number;
      unit: string;
      threshold: number;
    }) => workspaceApi.addResource(workspaceId!, resourceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceResources', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      toast.success('Resource added successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add resource');
    }
  });

  const updateResourceMutation = useMutation({
    mutationFn: ({
      resourceId,
      data
    }: {
      resourceId: string;
      data: { name?: string; quantity?: number; unit?: string; threshold?: number };
    }) => workspaceApi.updateResource(workspaceId!, resourceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceResources', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      toast.success('Resource updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update resource');
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ resourceId, quantity }: { resourceId: string; quantity: number }) =>
      workspaceApi.updateResourceQuantity(workspaceId!, resourceId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceResources', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update quantity');
    }
  });

  const deleteResourceMutation = useMutation({
    mutationFn: (resourceId: string) => workspaceApi.deleteResource(workspaceId!, resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceResources', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      toast.success('Resource deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete resource');
    }
  });

  const bulkReplaceResourcesMutation = useMutation({
    mutationFn: (resources: Array<{ name: string; quantity: number; unit: string; threshold: number }>) =>
      workspaceApi.bulkReplaceResources(workspaceId!, resources),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceResources', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      toast.success('Resources updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update resources');
    }
  });

  return {
    resources,
    isLoading,
    error,
    addResource: addResourceMutation.mutate,
    updateResource: (resourceId: string, data: any) =>
      updateResourceMutation.mutate({ resourceId, data }),
    updateQuantity: (resourceId: string, quantity: number) =>
      updateQuantityMutation.mutate({ resourceId, quantity }),
    deleteResource: deleteResourceMutation.mutate,
    bulkReplaceResources: bulkReplaceResourcesMutation.mutate,
    isAdding: addResourceMutation.isPending,
    isUpdating: updateResourceMutation.isPending || updateQuantityMutation.isPending,
    isDeleting: deleteResourceMutation.isPending
  };
};

