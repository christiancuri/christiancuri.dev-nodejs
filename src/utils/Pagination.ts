type Props = {
  skip?: string | number;
  limit?: string | number;
};
export function parsePagination({
  skip,
  limit,
}: Props): {
  skip: number;
  limit: number;
} {
  return {
    skip: skip && limit ? Number(skip) * Number(limit) : 0,
    limit: Number(limit || 25),
  };
}
