import { useQuery as useReactQuery } from '@tanstack/react-query';

export function useQuery(queryKey, queryFn, options = {}) {
  return useReactQuery({
    queryKey,
    queryFn,
    ...options,
  });
}
