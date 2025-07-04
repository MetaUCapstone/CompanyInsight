export const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;
export const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API;
export const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API;

export const METHOD_ENUM = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

export const options = (methodType, data) => {
  switch (methodType) {
    case METHOD_ENUM.GET:
      return {
        method: methodType,
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      };
    case METHOD_ENUM.POST:
    case METHOD_ENUM.PUT:
    case METHOD_ENUM.PATCH:
      return {
        method: methodType,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      };
    case METHOD_ENUM.DELETE:
      return {
        method: methodType,
        headers: {
          Accept: "application/json",
        },
      };
    default:
      return {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      };
  }
};
