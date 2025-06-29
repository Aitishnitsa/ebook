import { useState, useCallback } from "react";
import api from "../api/axiosInstance";

/**
 * Universal API hook for GET/POST/PUT/DELETE requests.
 * @returns {object} { data, error, loading, request }
 */
const useApi = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const request = useCallback(
        async (method, url, options = {}) => {
            setLoading(true);
            setError(null);
            setData(null);
            try {
                const response = await api({
                    method,
                    url,
                    ...options,
                });
                setData(response.data);
                return response.data;
            } catch (err) {
                setError(err.response?.data?.detail || err.message || "Unknown error");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { api, data, error, loading, request };
};

export default useApi;