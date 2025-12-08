const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
    async getResume() {
        const response = await fetch(`${API_BASE_URL}/api/resume`);
        if (!response.ok) throw new Error('Failed to fetch resume');
        return response.json();
    },

    async uploadResume(file) {
        const formData = new FormData();
        formData.append('resume', file);
        const response = await fetch(`${API_BASE_URL}/api/resume`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
        });
        if (!response.ok) throw new Error('Failed to upload resume');
        return response.json();
    },

    async deleteResume() {
        const response = await fetch(`${API_BASE_URL}/api/resume`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete resume');
        return response.json();
    },

    getResumeUrl(path) {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    }
};
