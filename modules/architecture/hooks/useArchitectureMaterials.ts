import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { architectureApi } from '../services/architecture.api';
import toast from 'react-hot-toast';

export const useArchitectureMaterials = (workspaceId: string | null) => {
  const queryClient = useQueryClient();

  const materialsQuery = useQuery({
    queryKey: ['architecture-materials', workspaceId],
    queryFn: () => architectureApi.getArchitectureMaterials(workspaceId!),
    enabled: !!workspaceId,
    retry: false,
  });

  const addMaterialMutation = useMutation({
    mutationFn: (material: {
      name: string;
      quantity: string;
      specification: string;
    }) => architectureApi.addArchitectureMaterial(workspaceId!, material),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['architecture-materials', workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ['architecture', workspaceId],
      });
      toast.success('Material added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add material');
    },
  });

  return {
    materials: materialsQuery.data,
    isLoading: materialsQuery.isLoading,
    isError: materialsQuery.isError,
    error: materialsQuery.error,
    addMaterial: addMaterialMutation.mutate,
    isAdding: addMaterialMutation.isPending,
  };
};
