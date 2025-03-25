import { createTool } from '@mastra/core/tools';
import z from 'zod';
import axiosInstance from '../utils/axios';
import { Rate, RoomType, HotelRateResponse, GetHotelRatesResponse } from '../types'; // Import types

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
  outputSchema: z.object({
    success: z.boolean(),
    data: z.array(z.object({
      hotelId: z.string(),
      roomTypes: z.array(z.object({
        roomTypeId: z.string(),
        offerId: z.string().describe('Offer Id used to pre boom the hotel'),
        supplier: z.string(),
        supplierId: z.number(),
        rates: z.array(z.object({
          rateId: z.string(),
          occupancyNumber: z.number(),
          name: z.string(),
          maxOccupancy: z.number(),
          adultCount: z.number(),
          childCount: z.number(),
          boardType: z.string(),
          boardName: z.string(),
          remarks: z.string(),
          priceType: z.string(),
          commission: z.array(z.object({
            amount: z.number(),
            currency: z.string(),
          })),
          retailRate: z.object({
            total: z.array(z.object({
              amount: z.number(),
              currency: z.string(),
            })),
            suggestedSellingPrice: z.array(z.object({
              amount: z.number(),
              currency: z.string(),
              source: z.string(),
            })),
            initialPrice: z.array(z.object({
              amount: z.number(),
              currency: z.string(),
            })),
            taxesAndFees: z.array(z.object({
              included: z.boolean(),
              description: z.string(),
              amount: z.number(),
              currency: z.string(),
            })).nullable(),
          }),
          cancellationPolicies: z.object({
            cancelPolicyInfos: z.array(z.object({
              cancelTime: z.string(),
              amount: z.number(),
              currency: z.string(),
              type: z.string(),
              timezone: z.string(),
            })),
            hotelRemarks: z.array(z.string()),
            refundableTag: z.string(),
          }),
        })),
        offerRetailRate: z.object({
          amount: z.number(),
          currency: z.string(),
        }),
        suggestedSellingPrice: z.object({
          amount: z.number(),
          currency: z.string(),
          source: z.string(),
        }),
        offerInitialPrice: z.object({
          amount: z.number(),
          currency: z.string(),
        }),
        priceType: z.string(),
        rateType: z.string(),
      })),
    })).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }: { context: {
    hotelIds: string[];
    occupancies: {
      adults: number;
      children?: number[];
    };
    currency: string;
    guestNationality: string;
    checkin: string;
    checkout: string;
  }}): Promise<GetHotelRatesResponse> => {
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

      if (response.data.error?.code === 2001) {
        return {
          success: false,
          error: "No availability for the selected hotels."
        };
      }

      return {
        success: true,
        data: response.data.data.map((resp: HotelRateResponse) => ({
          hotelId: resp.hotelId,
          roomTypes: resp.roomTypes.slice(0, 5).map((roomType: RoomType) => ({
            // roomTypeId: roomType.roomTypeId,
            offerId: roomType.offerId,
            // supplier: roomType.supplier,
            // supplierId: roomType.supplierId,
            rates: roomType.rates.map((rate: Rate) => ({
              // rateId: r.rateId,
              occupancyNumber: rate.occupancyNumber,
              name: rate.name,
              maxOccupancy: rate.maxOccupancy,
              adultCount: rate.adultCount,
              childCount: rate.childCount,
              boardType: rate.boardType,
              boardName: rate.boardName,
              remarks: rate.remarks,
              priceType: rate.priceType,
              commission: rate.commission,
              retailRate: rate.retailRate,
              cancellationPolicies: rate.cancellationPolicies,
            })),
            offerRetailRate: roomType.offerRetailRate,
            suggestedSellingPrice: roomType.suggestedSellingPrice,
            offerInitialPrice: roomType.offerInitialPrice,
            priceType: roomType.priceType,
            rateType: roomType.rateType
          }))
        })), // Return the list of rates
      };
    
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});