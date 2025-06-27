export const listAllProducts = async (type?: "ready-made" | "custom") => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/list/products${
      type && `?type=${type}`
    }`,
    {
       credentials: "include",
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
