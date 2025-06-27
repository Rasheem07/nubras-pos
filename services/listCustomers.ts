export const listAllCustomers = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/list/customer`, {
     credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch customers list");
  }
  return json;
};
