'use client';

import { useState } from 'react';

interface UseMutationOptions<TData> {
  onSuccess?: (data: TData) => void;
  onError?: (error: string) => void;
}

interface UseMutationResult<TVariables, TData> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  loading: boolean;
  error: string | null;
}

export function useMutation<TVariables = void, TData = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData> = {}
): UseMutationResult<TVariables, TData> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(variables);
      options.onSuccess?.(result);
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al procesar la solicitud';
      setError(msg);
      options.onError?.(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
