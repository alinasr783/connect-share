// useBookingManagement.js
import { useState } from 'react';
import { 
  getAdminBookingDetails, 
  updateBooking, 
  cancelBooking,
  updateBookingFinancials,
  createFinancialTransaction,
  createPayout,
  getBookingFinancials
} from '../services/apiBookings';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useBookingManagement(id) {
  const queryClient = useQueryClient();

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getAdminBookingDetails(id),
    enabled: !!id
  });

  const { data: financials } = useQuery({
    queryKey: ['booking-financials', id],
    queryFn: () => getBookingFinancials(id),
    enabled: !!id
  });

  const updateMutation = useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['booking', id]);
    }
  });

  const financialUpdateMutation = useMutation({
    mutationFn: updateBookingFinancials,
    onSuccess: () => {
      queryClient.invalidateQueries(['booking', id]);
      queryClient.invalidateQueries(['booking-financials', id]);
    }
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }) => cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['booking', id]);
    }
  });

  const transactionMutation = useMutation({
    mutationFn: createFinancialTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['booking-financials', id]);
    }
  });

  const payoutMutation = useMutation({
    mutationFn: createPayout,
    onSuccess: () => {
      queryClient.invalidateQueries(['booking-financials', id]);
    }
  });

  return {
    booking,
    financials,
    isLoading,
    error,
    updateBooking: updateMutation.mutateAsync,
    updateFinancials: financialUpdateMutation.mutateAsync,
    cancelBooking: cancelMutation.mutateAsync,
    createTransaction: transactionMutation.mutateAsync,
    createPayout: payoutMutation.mutateAsync,
    isUpdating: updateMutation.isPending || financialUpdateMutation.isPending
  };
}