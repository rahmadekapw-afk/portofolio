// Custom replacement for Supabase client to work with XAMPP/MySQL API

const API_BASE = 'http://localhost/portofolio/api'; // Adjust if your folder name is different

const createClient = () => {
    return {
        from: (table) => {
            return {
                select: async () => {
                    try {
                        const response = await fetch(`${API_BASE}/${table}.php`);
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
                    try {
                        const bodyData = Array.isArray(payload) ? payload[0] : payload;
                        const response = await fetch(`${API_BASE}/${table}.php`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(bodyData)
                        });
                        if (!response.ok) {
                            const text = await response.text();
                            throw new Error(`Insert Error: ${response.status} - ${text.substring(0, 100)}`);
                        }
                        const result = await response.json();
                        return { data: result, error: null };
                    } catch (error) {
                        console.error("API Insert Error:", error);
                        return { data: null, error };
                    }
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