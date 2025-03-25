import { createTool } from '@mastra/core/tools';
import z from 'zod'
import axiosInstance from '../utils/axios';
import { Hotel, HotelsResponse, SearchHotelsResponse } from '../types';

export const searchHotelsTool = createTool({
  id: 'search-hotels',
  description: 'Search for hotels based on a place ID',
  inputSchema: z.object({
    placeId: z.string().describe('The place ID to search for hotels'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.array(z.object({
      id: z.string().describe('Unique ID of a hotel used to retrieve rates for it'),
      name: z.string(),
      hotelDescription: z.string(),
      chain: z.string(),
      currency: z.string(),
      country: z.string(),
      city: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      address: z.string(),
      zip: z.string(),
      main_photo: z.string(),
      thumbnail: z.string(),
      stars: z.number(),
      rating: z.number(),
      reviewCount: z.number()
    })).optional(),
    error: z.string().optional()
  }),
  execute: async ({ context }): Promise<SearchHotelsResponse> => {
    try {
      const { placeId } = context;

      // Call the LiteAPI to search for hotels
      const response = await axiosInstance.get<HotelsResponse>('/data/hotels', {
        params: {
          placeId,
        },
      });

      const hotels: Hotel[] = response.data.data

      return {
        success: true,
        data: hotels.slice(0, 5) // Limit to first 5 hotels as trivial implementation
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});