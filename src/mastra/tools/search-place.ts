import { createTool } from '@mastra/core/tools';
import z from 'zod'
import axiosInstance from '../utils/axios';

export const searchPlacesTool = createTool({
  id: 'search-places',
  description: 'Search for places based on a text query',
  inputSchema: z.object({
    textQuery: z.string().describe('The text query to search for places'),
  }),
  execute: async ({ context }) => {
    try {
      const { textQuery } = context;

      // Call the LiteAPI to search for places
      const response = await axiosInstance.get('/data/places', {
        params: {
          textQuery,
        },
      });

      return {
        success: true,
        places: response.data.data, // Return the list of places
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
});
  