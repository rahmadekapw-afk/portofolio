// Custom replacement for Supabase client to work with XAMPP/MySQL API

const API_BASE = 'http://localhost/portofolio/api'; // Adjust if your folder name is different

const createClient = () => {
    return {
        from: (table) => {
            return {
                select: async (columns) => {
                    // We ignore 'columns' and always return * from our simple API
                    try {
                        const response = await fetch(`${API_BASE}/${table}.php`);
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        const data = await response.json();
                        return { data, error: null };
                    } catch (error) {
                        console.error("API Fetch Error:", error);
                        return { data: null, error };
                    }
                },
                insert: async (payload) => {
                    try {
                        // Handle array wrapper if present
                        const bodyData = Array.isArray(payload) ? payload[0] : payload;

                        const response = await fetch(`${API_BASE}/${table}.php`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(bodyData)
                        });
                        const result = await response.json();
                        if (result.error) throw new Error(result.error);
                        return { data: result, error: null }; // Mocking success response
                    } catch (error) {
                        console.error("API Insert Error:", error);
                        return { data: null, error };
                    }
                }
            };
        },
        // Mock realtime channel to prevent crashes (functionality won't work)
        // Mock realtime channel to prevent crashes
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