import { createTool } from '@mastra/core/tools';
import z from 'zod'
import axiosInstance from '../utils/axios';

export const getHotelRatesTool = createTool({
  id: 'get-hotel-rates',
  description: 'Get rates for selected hotels',
  inputSchema: z.object({
    hotelIds: z.array(z.string()).describe('Array of hotel IDs to get rates for'),
    occupancies: z.object({
      adults: z.number().describe('Number of adults in each selected room'),
      children: z.array(z.number()).optional().describe('Array of the ages of children of each selected room'),
    }).describe('An array of objects specifying the number of guests per room. Required.'),
    currency: z.string().default('USD').describe('Currency for the rates'),
    guestNationality: z.string().default('US').describe('Nationality of the guest'),
    checkin: z.string().describe('Check-in date in YYYY-MM-DD format'),
    checkout: z.string().describe('Check-out date in YYYY-MM-DD format'),
  }),
  execute: async ({ context }) => {
    try {
      const { hotelIds, occupancies, currency, guestNationality, checkin, checkout } = context;

      const payload = {
        hotelIds,
        occupancies: [occupancies],
        currency,
        guestNationality,
        checkin,
        checkout
      };

      // Call the LiteAPI to get hotel rates
      const response = await axiosInstance.post('/hotels/rates', payload);

      return {
        success: true,
        rates: response.data.data.map(rate => ({
          hotelId: rate.hotelId,
          roomTypes: rate.roomTypes.map(roomType => ({
            offerId: roomType.offerId,
            rates: roomType.rates.slice(0, 5).map(r => ({
              rateId: r.rateId,
              occupancyNumber: r.occupancyNumber,
              name: r.name,
              maxOccupancy: r.maxOccupancy,
              adultCount: r.adultCount,
              childCount: r.childCount
            })),
            offerRetailRate: roomType.offerRetailRate
          }))
        })), // Return the list of rates
      };
    
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
});