import { createTool } from '@mastra/core/tools';
import z from 'zod'
import axiosInstance from '../utils/axios';
import { Place, PlacesResponse, SearchPlacesResponse } from '../types';

export const searchPlacesTool = createTool({
  id: 'search-places',
  description: 'Search for places based on a text query',
  inputSchema: z.object({
    textQuery: z.string().describe('The text query to search for places'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.array(z.object({
      placeId: z.string().describe('Unique ID of a place that can be used to retrieve hotels around it'),
      displayName: z.string()
    })).optional(),
    error: z.string().optional()
  }),
  execute: async ({ context }): Promise<SearchPlacesResponse> => {
    try {
      const { textQuery } = context;

      // Call the LiteAPI to search for places
      const response = await axiosInstance.get<PlacesResponse>('/data/places', {
        params: {
          textQuery,
        },
      });
      
      const places: Place[] = response.data.data;

      return {
        success: true,
        data: places,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});