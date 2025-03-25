// Type definitions for hotel booking and related entities
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export type SearchPlacesResponse = SuccessResponse<Place[]> | ErrorResponse;
export type SearchHotelsResponse = SuccessResponse<Hotel[]> | ErrorResponse;
export type GetHotelRatesResponse = SuccessResponse<HotelRateResponse[]> | ErrorResponse;
export type PrebookRoomResponse = SuccessResponse<string> | ErrorResponse;
export type BookRoomResponse = SuccessResponse<Booking> | ErrorResponse;

export interface Place {
  placeId: string;
  displayName: string;
  error: string;
}

export interface Hotel {
  id: string;
  name: string;
  hotelDescription: string;
  chain: string;
  currency: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  address: string;
  zip: string;
  main_photo: string;
  thumbnail: string;
  stars: number;
  rating: number;
  reviewCount: number;
}

export interface Rate {
  rateId: string;
  occupancyNumber: number;
  name: string;
  maxOccupancy: number;
  adultCount: number;
  childCount: number;
  boardType: string;
  boardName: string;
  remarks: string;
  priceType: string;
  commission: Array<{ amount: number; currency: string }>;
  retailRate: {
    total: Array<{ amount: number; currency: string }>;
    suggestedSellingPrice: Array<{ amount: number; currency: string; source: string }>;
    initialPrice: Array<{ amount: number; currency: string }>;
    taxesAndFees: Array<{ included: boolean; description: string; amount: number; currency: string }> | null;
  };
  cancellationPolicies: {
    cancelPolicyInfos: Array<{
      cancelTime: string;
      amount: number;
      currency: string;
      type: string;
      timezone: string;
    }>;
    hotelRemarks: string[];
    refundableTag: string;
  };
}

export interface RoomType {
  roomTypeId: string;
  offerId: string;
  supplier: string;
  supplierId: number;
  rates: Rate[];
  offerRetailRate: { amount: number; currency: string };
  suggestedSellingPrice: { amount: number; currency: string; source: string };
  offerInitialPrice: { amount: number; currency: string };
  priceType: string;
  rateType: string;
}

export interface Prebook {
  prebookId: string;
  offerId: string;
  hotelId: string;
  currency: string;
}

export interface Booking {
  bookingId: string;
  clientReference: string;
  supplierBookingId: string;
  supplierBookingName: string;
  supplier: string;
  supplierId: number;
  status: string;
  hotelConfirmationCode: string;
  checkin: string;
  checkout: string;
  hotel: {
    hotelId: string;
    name: string;
  };
  bookedRooms: Array<{
    roomType: {
      name: string;
    };
    boardType: string;
    boardName: string;
    adults: number;
    children: number;
    rate: {
      retailRate: {
        total: {
          amount: number;
          currency: string;
        };
      };
    };
    firstName: string;
    lastName: string;
  }>;
  holder: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  cancellationPolicies: {
    cancelPolicyInfos: Array<{
      cancelTime: string;
      amount: number;
      type: string;
      timezone: string;
      currency: string;
    }>;
    hotelRemarks: string | null;
    refundableTag: string;
  };
  specialRemarks: string;
  optionalFees: string;
  mandatoryFees: string;
  knowBeforeYouGo: string;
  price: number;
  commission: number;
  currency: string;
  remarks: string;
  guestId: number;
  
}

export interface HotelsResponse {
  data: Hotel[];
}

export interface PlacesResponse {
  data: Place[];
}

export interface HotelRateResponse {
  hotelId: string;
  roomTypes: RoomType[];
}

export interface PrebookHotelResponse {
  data: Prebook;
}

export interface BookingResponse {
  data: Booking
}
