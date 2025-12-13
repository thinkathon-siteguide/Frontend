import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceApi } from '../services/workspace.api';
import { toast } from 'react-hot-toast';

export const useWorkspaceSafety = (workspaceId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: safetyReports = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['workspaceSafetyReports', workspaceId],
    queryFn: () => workspaceApi.getAllSafetyReports(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2
  });

  const saveSafetyReportMutation = useMutation({
    mutationFn: (reportData: {
      riskScore: number;
      hazards: Array<{
        description: string;
        severity: 'Low' | 'Medium' | 'High';
        recommendation: string;
      }>;
      summary: string;
    }) => workspaceApi.saveSafetyReport(workspaceId!, reportData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceSafetyReports', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      toast.success('Safety report saved successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to save safety report');
    }
  });

  return {
    safetyReports,
    isLoading,
    error,
    saveSafetyReport: saveSafetyReportMutation.mutate,
    isSaving: saveSafetyReportMutation.isPending
  };
};

export const useSafetyReport = (workspaceId: string | undefined, reportId: string | undefined) => {
  const {
    data: safetyReport,
    isLoading,
    error
  } = useQuery({
    queryKey: ['safetyReport', workspaceId, reportId],
    queryFn: () => workspaceApi.getSafetyReportById(workspaceId!, reportId!),
    enabled: !!workspaceId && !!reportId,
    staleTime: 1000 * 60 * 5
  });

  return {
    safetyReport,
    isLoading,
    error
  };
};

