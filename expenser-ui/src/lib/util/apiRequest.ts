const apiRequest = async (
  url: string,
  method: string,
  body?: Record<string, unknown>,
): Promise<Response> => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return response;
};

export { apiRequest };
