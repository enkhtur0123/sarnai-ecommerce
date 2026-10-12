import { gql } from "@apollo/client";

export type Room = {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
};

export const CP_PMS_ROOMS = gql`
  query cpPmsRooms(
    $pipelineId: String!
    $startDate: Date
    $endDate: Date
    $skipStageIds: [String]
    $page: Int
    $perPage: Int
  ) {
    cpPmsRooms(
      pipelineId: $pipelineId
      startDate: $startDate
      endDate: $endDate
      skipStageIds: $skipStageIds
      page: $page
      perPage: $perPage
    ) {
      _id
      name
      description
      price
    }
  }
`;

export type CpPmsRoomsVariables = {
  pipelineId: string;
  startDate?: string;
  endDate?: string;
  skipStageIds?: string[];
  page?: number;
  perPage?: number;
};

export type CpPmsRoomsData = {
  cpPmsRooms: Room[];
};

export type RoomAvailability = {
  _id: string;
  available?: boolean;
};

export const CP_PMS_CHECK_ROOMS = gql`
  query cpPmsCheckRooms(
    $pipelineId: String!
    $startDate: Date
    $endDate: Date
    $ids: [String]
    $skipStageIds: [String]
  ) {
    cpPmsCheckRooms(
      pipelineId: $pipelineId
      startDate: $startDate
      endDate: $endDate
      ids: $ids
      skipStageIds: $skipStageIds
    ) {
      _id
      available
    }
  }
`;

export type CpPmsCheckRoomsVariables = {
  pipelineId: string;
  startDate?: string;
  endDate?: string;
  ids?: string[];
  skipStageIds?: string[];
};

export type CpPmsCheckRoomsData = {
  cpPmsCheckRooms: RoomAvailability[];
};
