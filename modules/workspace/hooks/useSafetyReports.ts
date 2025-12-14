import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceApi } from '../services/workspace.api';
import { toast } from 'react-hot-toast';

export const useSafetyReports = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['safety-reports', workspaceId],
    queryFn: () => workspaceApi.getAllSafetyReports(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSafetyReportById = (workspaceId: string | null, reportId: string | null) => {
  return useQuery({
    queryKey: ['safety-report', workspaceId, reportId],
    queryFn: () => workspaceApi.getSafetyReportById(workspaceId!, reportId!),
    enabled: !!workspaceId && !!reportId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSaveSafetyReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      reportData,
    }: {
      workspaceId: string;
      reportData: {
        riskScore: number;
        hazards: Array<{
          description: string;
          severity: 'Low' | 'Medium' | 'High';
          recommendation: string;
        }>;
        summary: string;
      };
    }) => workspaceApi.saveSafetyReport(workspaceId, reportData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['safety-reports', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
      toast.success('Safety report saved successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to save safety report');
    },
  });
};

