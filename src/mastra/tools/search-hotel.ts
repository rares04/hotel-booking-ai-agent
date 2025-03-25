import { createTool } from '@mastra/core/tools';
import z from 'zod'
import axiosInstance from '../utils/axios';

export const searchHotelsTool = createTool({
  id: 'search-hotels',
  description: 'Search for hotels based on a place ID',
  inputSchema: z.object({
    placeId: z.string().describe('The place ID to search for hotels'),
  }),
  execute: async ({ context }) => {
    try {
      const { placeId } = context;

      // Call the LiteAPI to search for hotels
      const response = await axiosInstance.get('/data/hotels', {
        params: {
          placeId,
        },
      });

      return {
        success: true,
        hotels: response.data.data.slice(0, 5).map(hotel => ({
          id: hotel.id,
          name: hotel.name,
          hotelDescription: hotel.hotelDescription,
          chain: hotel.chain,
          address: hotel.address,
          stars: hotel.stars,
          rating: hotel.rating,
          reviewCount: hotel.reviewCount,
        })) // Return the list of hotels
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
});