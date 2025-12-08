const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = {
    async getProjects() {
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
    },

    async getProject(id) {
        const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        return response.json();
    },

    async createProject(projectData) {
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) throw new Error('Failed to create project');
        return response.json();
    },

    async updateProject(id, projectData) {
        const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) throw new Error('Failed to update project');
        return response.json();
    },

    async deleteProject(id) {
        const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete project');
        return response.json();
    },

    async uploadProjectImages(projectId, files, altTexts = []) {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        formData.append('altTexts', JSON.stringify(altTexts));

        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/images`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Failed to upload images');
        return response.json();
    },

    async deleteImage(imageId) {
        const response = await fetch(`${API_BASE_URL}/api/images/${imageId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete image');
        return response.json();
    },

    getImageUrl(path) {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    }
};
