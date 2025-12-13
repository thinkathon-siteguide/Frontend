import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceApi, CreateWorkspaceData, UpdateWorkspaceData } from '../services/workspace.api';
import { toast } from 'react-hot-toast';

export const useWorkspaces = () => {
  const queryClient = useQueryClient();

  const {
    data: workspaces = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['workspaces'],
    queryFn: workspaceApi.getAllWorkspaces,
    staleTime: 1000 * 60 * 5
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: workspaceApi.createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create workspace');
    }
  });

  const updateWorkspaceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkspaceData }) =>
      workspaceApi.updateWorkspace(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update workspace');
    }
  });

  const deleteWorkspaceMutation = useMutation({
    mutationFn: workspaceApi.deleteWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete workspace');
    }
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) =>
      workspaceApi.updateProgress(id, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update progress');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: workspaceApi.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace status updated!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to toggle status');
    }
  });

  return {
    workspaces,
    isLoading,
    error,
    createWorkspace: createWorkspaceMutation.mutate,
    updateWorkspace: (id: string, data: UpdateWorkspaceData) =>
      updateWorkspaceMutation.mutate({ id, data }),
    deleteWorkspace: deleteWorkspaceMutation.mutate,
    updateProgress: (id: string, progress: number) =>
      updateProgressMutation.mutate({ id, progress }),
    toggleStatus: toggleStatusMutation.mutate,
    isCreating: createWorkspaceMutation.isPending,
    isUpdating: updateWorkspaceMutation.isPending,
    isDeleting: deleteWorkspaceMutation.isPending
  };
};

export const useWorkspace = (id: string | undefined) => {
  const {
    data: workspace,
    isLoading,
    error
  } = useQuery({
    queryKey: ['workspace', id],
    queryFn: () => workspaceApi.getWorkspaceById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  });

  return {
    workspace,
    isLoading,
    error
  };
};

