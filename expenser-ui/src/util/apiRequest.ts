const apiRequest = async (
  url: string,
  method: string,
  body?: Record<string, unknown>,
): Promise<void> => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`Failed to ${method.toLowerCase()} transaction`);
  }
};

export { apiRequest };