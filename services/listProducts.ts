export const listAllProducts = async () => {
  const response = await fetch(
    "https://api.alnubras.co/api/v1/products/list/products",
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
