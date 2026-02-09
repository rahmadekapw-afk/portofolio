// Custom replacement for Supabase client to work with XAMPP/MySQL API

const API_BASE = 'http://127.0.0.1/portofolio/api'; // Changed to 127.0.0.1 for consistency

const createClient = () => {
    return {
        from: (table) => {
            return {
                select: async () => {
                    try {
                        const response = await fetch(`${API_BASE}/${table}.php?t=${Date.now()}`);
                        if (!response.ok) {
                            const text = await response.text();
                            throw new Error(`Server Error: ${response.status} - ${text.substring(0, 100)}`);
                        }
                        const data = await response.json();
                        return { data: Array.isArray(data) ? data : [], error: null };
                    } catch (error) {
                        console.error("API Fetch Error:", error);
                        return { data: [], error };
                    }
                },
                insert: async (payload) => {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
                    try {
                        const bodyData = Array.isArray(payload) ? payload[0] : payload;
                        const response = await fetch(`${API_BASE}/${table}.php`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(bodyData),
                            signal: controller.signal
                        });
                        clearTimeout(timeoutId);
                        if (!response.ok) {
                            const text = await response.text();
                            throw new Error(`Server ${response.status}: ${text.substring(0, 100)}`);
                        }
                        const result = await response.json();
                        return { data: result, error: null };
                    } catch (error) {
                        clearTimeout(timeoutId);
                        if (error.name === 'AbortError') return { data: null, error: new Error('Request timed out after 10 seconds') };
                        console.error("API Insert Error:", error);
                        return { data: null, error };
                    }
                },
                delete: () => {
                    return {
                        eq: async (column, value) => {
                            try {
                                const response = await fetch(`${API_BASE}/${table}.php?${column}=${value}`, {
                                    method: 'DELETE'
                                });
                                if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
                                return { data: true, error: null };
                            } catch (error) {
                                console.error("API Delete Error:", error);
                                return { data: null, error };
                            }
                        }
                    };
                }
            };
        },
        channel: (name) => {
            const mockChannel = {
                on: () => mockChannel,
                subscribe: () => {
                    console.warn("Realtime subscriptions are not supported in this MySQL version.");
                    return mockChannel;
                },
                unsubscribe: () => {
                    console.log("Mock unsubscribe called");
                    return Promise.resolve();
                }
            };
            return mockChannel;
        }
    };
};

export const supabase = createClient();