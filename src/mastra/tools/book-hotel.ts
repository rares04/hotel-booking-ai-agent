import { createTool } from '@mastra/core/tools';
import z from 'zod'
import axiosInstance from '../utils/axios';

export const preBookRoomTool = createTool({
  id: 'pre-book-room',
  description: 'Pre-book a room using the offerId',
  inputSchema: z.object({
    offerId: z.string().describe('The offer ID of the room to pre-book'),
  }),
  execute: async ({ context }) => {
    try {
      const { offerId } = context;

      // Call the LiteAPI to pre-book the room
      const response = await axiosInstance.post('/rates/prebook', {
        offerId,
        usePaymentSdk: false, // Assuming no payment SDK is used at this stage
      });

      return {
        success: true,
        prebookId: response.data.data.prebookId, // Return the prebookId for the next step
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

export const bookRoomTool = createTool({
  id: 'book-room',
  description: 'Finalize the booking using the prebookId',
  inputSchema: z.object({
    prebookId: z.string().describe('The prebook ID from the pre-booking step'),
    holder: z.object({
      firstName: z.string().describe('First name of the person booking'),
      lastName: z.string().describe('Last name of the person booking'),
      email: z.string().email().describe('Email of the person booking'),
      phone: z.string().describe('Phone number of the person booking'),
    }),
    guests: z.array(z.object({
      firstName: z.string().describe('First name of the guest'),
      lastName: z.string().describe('Last name of the guest'),
      email: z.string().email().describe('Email of the guest'),
      phone: z.string().optional().describe('Phone number of the guest'),
    })).describe('Array of guests for the booking'),
  }),
  execute: async ({ context }) => {
    try {
      const { prebookId, holder, guests } = context;

      // Call the LiteAPI to finalize the booking
      const response = await axiosInstance.post('/rates/book', {
        prebookId,
        holder,
        guests: guests.map(x => ({ ...x, occupancyNumber: 1})),
        payment: {
          method: "ACC_CREDIT_CARD"
        },
      });

      return {
        success: true,
        bookingDetails: response.data.data, // Return the booking details
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
});