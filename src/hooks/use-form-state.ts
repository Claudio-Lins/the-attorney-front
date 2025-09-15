'use client';

import { showToast } from '@/lib/toast';
import { useCallback, useState } from 'react';

export interface FormState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
}

interface UseFormStateOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export function useFormState(options: UseFormStateOptions = {}) {
  const [state, setState] = useState<FormState>({
    isLoading: false,
    isSuccess: false,
    error: null,
    validationErrors: {},
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
      error: loading ? null : prev.error,
    }));
  }, []);

  const setSuccess = useCallback((data?: any) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      isSuccess: true,
      error: null,
      validationErrors: {},
    }));

    if (options.successMessage) {
      showToast.success(options.successMessage);
    }

    options.onSuccess?.(data);

    if (options.resetOnSuccess) {
      setTimeout(() => {
        setState(prev => ({ ...prev, isSuccess: false }));
      }, 2000);
    }
  }, [options]);

  const setError = useCallback((error: string | Error) => {
    const errorMessage = error instanceof Error ? error.message : error;
    
    setState(prev => ({
      ...prev,
      isLoading: false,
      isSuccess: false,
      error: errorMessage,
      validationErrors: {},
    }));

    const displayMessage = options.errorMessage || errorMessage;
    showToast.error(displayMessage);

    options.onError?.(errorMessage);
  }, [options]);

  const setValidationErrors = useCallback((errors: Record<string, string>) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      validationErrors: errors,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isSuccess: false,
      error: null,
      validationErrors: {},
    });
  }, []);

  const submitForm = useCallback(async (
    formAction: () => Promise<any>,
    {
      loadingMessage,
      successMessage,
      errorMessage,
    }: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
    } = {}
  ) => {
    setLoading(true);
    
    let loadingToast;
    if (loadingMessage) {
      loadingToast = showToast.loading(loadingMessage);
    }

    try {
      const result = await formAction();
      
      if (loadingToast) {
        showToast.dismiss(loadingToast);
      }
      
      setSuccess(result);
      
      if (successMessage) {
        showToast.success(successMessage);
      }
      
      return result;
    } catch (error) {
      if (loadingToast) {
        showToast.dismiss(loadingToast);
      }
      
      setError(error as Error);
      
      if (errorMessage) {
        showToast.error(errorMessage);
      }
      
      throw error;
    }
  }, [setLoading, setSuccess, setError]);

  return {
    ...state,
    setLoading,
    setSuccess,
    setError,
    setValidationErrors,
    reset,
    submitForm,
  };
} 