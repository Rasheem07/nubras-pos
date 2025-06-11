export const listAllProducts = async () => {
  const response = await fetch(
    "http://3.29.240.212/api/v1/products/list/products",
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch product catalog!");
  }
  return json;
};
