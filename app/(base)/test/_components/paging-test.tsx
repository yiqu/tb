export default function PagingTest() {
  const getPAgeArray = (totalPages: number, page: number, boundaryCount: number = 1, siblingCount: number = 0): number[] => {
    let pageV: number = page < 1 || page > totalPages ? 1 : page;
    const totalItemsFromParams = boundaryCount * 2 + 1 * siblingCount + 1 + 2;
    console.log('page items total size: ', totalItemsFromParams);
    if (totalPages <= totalItemsFromParams) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    return [];
  };

  const ex1 = getPAgeArray(17, 6, 2, 0);

  console.log(ex1);

  return <div>Pagination { JSON.stringify(ex1) }</div>;
}
