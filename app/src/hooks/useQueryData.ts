import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

export const useQueryData = (
  queryKey: QueryKey,
  queryFn: QueryFunction,
  options?: Partial<UseQueryOptions>
) => {
  const { data, isPending, isFetched, refetch, isFetching, } = useQuery({
    queryKey,
    queryFn,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });
  return { data, isPending, isFetched, refetch, isFetching };
};
