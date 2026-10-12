import { gql } from "@apollo/client";

export type ItineraryDay = {
  day?: number;
  title?: string;
  description?: string;
  activities?: string[];
};

export type Itinerary = {
  _id: string;
  name?: string;
  days?: ItineraryDay[];
};

export const CP_BMS_ITINERARY_DETAIL = gql`
  query cpBmsItineraryDetail($_id: String!, $language: String) {
    cpBmsItineraryDetail(_id: $_id, language: $language) {
      _id
      name
      days {
        day
        title
        description
        activities
      }
    }
  }
`;

export type CpBmsItineraryDetailVariables = {
  _id: string;
  language?: string;
};

export type CpBmsItineraryDetailData = {
  cpBmsItineraryDetail: Itinerary | null;
};
