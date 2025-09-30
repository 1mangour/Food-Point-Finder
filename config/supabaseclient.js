const supabaseUrl = "https://mzvwxsdykclubxxdqqtn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16dnd4c2R5a2NsdWJ4eGRxcXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDQ1NzksImV4cCI6MjA3MjU4MDU3OX0.W7qea2cNJwJgZWBqQllwNl6azBX0WSaxkDnftPY6ivA";

const supabaseInstance = supabase.createClient(supabaseUrl, supabaseKey);

window.supabaseConfig = {
    supabase: supabaseInstance,
    AuthHelpers: {
        async signUp(email, password, options) {
            return await supabaseInstance.auth.signUp({ email, password, options });
        },
        async signIn(email, password) {
            return await supabaseInstance.auth.signInWithPassword({ email, password });
        },
        async signOut() {
            await supabaseInstance.auth.signOut();
            window.location.href = '/index.html';
        },
        async getCurrentUser() {
            const { data } = await supabaseInstance.auth.getUser();
            return data.user;
        },
        async isAuthenticated() {
            const user = await this.getCurrentUser();
            return !!user;
        },
        async requireAuth() {
            const isAuthenticated = await this.isAuthenticated();
            if (!isAuthenticated) {
                window.location.href = '/pages/login.html';
            }
            return isAuthenticated;
        }
    },
    DatabaseHelpers: {
        async uploadImage(file) {
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error } = await supabaseInstance.storage
                .from('restaurant-images')
                .upload(fileName, file);

            if (error) {
                return { error };
            }

            const { data: { publicUrl } } = supabaseInstance.storage
                .from('restaurant-images')
                .getPublicUrl(fileName);

            return { data: publicUrl, error: null };
        },
        async insertRestaurant(restaurantData) {
            return await supabaseInstance.from('restaurants').insert([restaurantData]);
        },
        async getAllRestaurants() {
            return await supabaseInstance.from('restaurants').select('*');
        }
    },
    UIHelpers: {
        showError(message, containerId = 'error-message') {
            const container = document.getElementById(containerId);
            if (container) {
                container.textContent = message;
                container.style.display = message ? 'block' : 'none';
            }
        },
        showSuccess(message, containerId = 'success-message') {
            const container = document.getElementById(containerId);
            if (container) {
                container.textContent = message;
                container.style.display = message ? 'block' : 'none';
            }
        }
    }
};