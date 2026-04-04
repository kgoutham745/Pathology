import { create } from 'zustand';

const useReportStore = create((set) => ({
  reports: [],
  currentReport: null,
  isLoading: false,
  error: null,

  setReports: (reports) => set({ reports }),
  setCurrentReport: (report) => set({ currentReport: report }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  addReport: (report) =>
    set((state) => ({
      reports: [report, ...state.reports]
    })),

  updateReport: (id, updatedReport) =>
    set((state) => ({
      reports: state.reports.map((r) =>
        r._id === id ? updatedReport : r
      ),
      currentReport:
        state.currentReport?._id === id ? updatedReport : state.currentReport
    })),

  deleteReport: (id) =>
    set((state) => ({
      reports: state.reports.filter((r) => r._id !== id),
      currentReport: state.currentReport?._id === id ? null : state.currentReport
    })),

  clearError: () => set({ error: null })
}));

export default useReportStore;
