export const listAllCustomers = async () => {
  const response = await fetch("http://localhost:5005/api/v1/list/customer", {
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
