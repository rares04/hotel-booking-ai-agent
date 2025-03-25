import { createTool } from '@mastra/core/tools';
import z from 'zod';
import axiosInstance from '../utils/axios';
import { Booking, BookingResponse, BookRoomResponse, PrebookHotelResponse, PrebookRoomResponse } from '../types'

export const preBookRoomTool = createTool({
  id: 'pre-book-room',
  description: 'Pre-book a room using the offerId',
  inputSchema: z.object({
    offerId: z.string().describe('The offer ID of the room to pre-book'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.string().optional().describe('PrebookId used to complete the booking'),
    error: z.string().optional()
  }),
  execute: async ({ context }): Promise<PrebookRoomResponse> => {
    try {
      const { offerId } = context;

      // Call the LiteAPI to pre-book the room
      const response = await axiosInstance.post<PrebookHotelResponse>('/rates/prebook', {
        offerId,
        usePaymentSdk: false, // Assuming no payment SDK is used at this stage
      });

      const prebookId: string = response.data.data.prebookId

      return {
        success: true,
        data: prebookId, // Return the prebookId for the next step
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
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
  outputSchema: z.object({
    success: z.boolean(),
    data: z.object({ // Change this to an object to match the Booking structure
      bookingId: z.string(),
      clientReference: z.string(),
      supplierBookingId: z.string(),
      supplierBookingName: z.string(),
      supplier: z.string(),
      supplierId: z.number(),
      status: z.string(),
      hotelConfirmationCode: z.string(),
      checkin: z.string(),
      checkout: z.string(),
      hotel: z.object({
        hotelId: z.string(),
        name: z.string(),
      }),
      bookedRooms: z.array(z.object({
        roomType: z.object({
          name: z.string(),
        }),
        boardType: z.string(),
        boardName: z.string(),
        adults: z.number(),
        children: z.number(),
        rate: z.object({
          retailRate: z.object({
            total: z.object({
              amount: z.number(),
              currency: z.string(),
            }),
          }),
        }),
        firstName: z.string(),
        lastName: z.string(),
      })),
      holder: z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        phone: z.string(),
      }),
      createdAt: z.string(),
      cancellationPolicies: z.object({
        cancelPolicyInfos: z.array(z.object({
          cancelTime: z.string(),
          amount: z.number(),
          type: z.string(),
          timezone: z.string(),
          currency: z.string(),
        })),
        hotelRemarks: z.string().nullable(),
        refundableTag: z.string(),
      }),
      specialRemarks: z.string(),
      optionalFees: z.string(),
      mandatoryFees: z.string(),
      knowBeforeYouGo: z.string(),
      price: z.number(),
      commission: z.number(),
      currency: z.string(),
      remarks: z.string(),
      guestId: z.number(),
    }).optional(),
    error: z.string().optional()
  }),
  execute: async ({ context }): Promise<BookRoomResponse> => {
    try {
      const { prebookId, holder, guests } = context;

      // Call the LiteAPI to finalize the booking
      const response = await axiosInstance.post<BookingResponse>('/rates/book', {
        prebookId,
        holder,
        guests: guests.map(x => ({ ...x, occupancyNumber: 1 })),
        payment: {
          method: "ACC_CREDIT_CARD"
        },
      });

      const booking: Booking = response.data.data

      return {
        success: true,
        data: booking, // Return the booking details
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});