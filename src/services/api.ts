import axios from 'axios';

const API_URL = 'https://localhost:7155/api/BookingsApi'; 

export const getBookings = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        throw error;
    }
};