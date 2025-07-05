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
                let errorMessage = "Unknown error";

                if (err.response?.data?.detail) {
                    const detail = err.response.data.detail;
                    if (typeof detail === 'string') {
                        errorMessage = detail;
                    } else if (Array.isArray(detail) && detail.length > 0) {
                        errorMessage = detail.map(error => error.msg || error.message || 'Validation error').join(', ');
                    } else if (typeof detail === 'object') {
                        errorMessage = detail.msg || detail.message || 'Validation error';
                    }
                } else if (err.message) {
                    errorMessage = err.message;
                }

                setError(errorMessage);
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