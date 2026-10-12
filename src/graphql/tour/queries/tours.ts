import { gql } from "@apollo/client";

export type Tour = {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
  itineraryId?: string;
};

export type TourGroup = {
  groupCode?: string;
  tours?: Pick<Tour, "_id" | "name" | "startDate" | "price">[];
};

export const CP_BMS_TOURS = gql`
  query cpBmsTours(
    $branchId: String
    $categoryIds: [String]
    $name: String
    $status: String
    $tags: [String]
    $startDate1: Date
    $startDate2: Date
    $endDate1: Date
    $endDate2: Date
    $language: String
    $limit: Int
    $cursor: String
  ) {
    cpBmsTours(
      branchId: $branchId
      categoryIds: $categoryIds
      name: $name
      status: $status
      tags: $tags
      startDate1: $startDate1
      startDate2: $startDate2
      endDate1: $endDate1
      endDate2: $endDate2
      language: $language
      limit: $limit
      cursor: $cursor
    ) {
      _id
      name
      description
      price
      startDate
      endDate
      categoryIds
    }
  }
`;

export type CpBmsToursVariables = {
  branchId?: string;
  categoryIds?: string[];
  name?: string;
  status?: string;
  tags?: string[];
  startDate1?: string;
  startDate2?: string;
  endDate1?: string;
  endDate2?: string;
  language?: string;
  limit?: number;
  cursor?: string;
};

export type CpBmsToursData = {
  cpBmsTours: Tour[];
};

export const CP_BMS_TOUR_DETAIL = gql`
  query cpBmsTourDetail($_id: String!, $branchId: String, $language: String) {
    cpBmsTourDetail(_id: $_id, branchId: $branchId, language: $language) {
      _id
      name
      description
      price
      startDate
      endDate
      categoryIds
      itineraryId
    }
  }
`;

export type CpBmsTourDetailVariables = {
  _id: string;
  branchId?: string;
  language?: string;
};

export type CpBmsTourDetailData = {
  cpBmsTourDetail: Tour | null;
};

export const CP_BM_TOURS_GROUP = gql`
  query cpBmToursGroup(
    $branchId: String
    $categoryIds: [String]
    $startDate1: Date
    $startDate2: Date
    $language: String
    $limit: Int
  ) {
    cpBmToursGroup(
      branchId: $branchId
      categoryIds: $categoryIds
      startDate1: $startDate1
      startDate2: $startDate2
      language: $language
      limit: $limit
    ) {
      groupCode
      tours {
        _id
        name
        startDate
        price
      }
    }
  }
`;

export type CpBmToursGroupVariables = {
  branchId?: string;
  categoryIds?: string[];
  startDate1?: string;
  startDate2?: string;
  language?: string;
  limit?: number;
};

export type CpBmToursGroupData = {
  cpBmToursGroup: TourGroup[];
};

export const CP_BM_TOURS_GROUP_DETAIL = gql`
  query cpBmToursGroupDetail($groupCode: String, $status: String, $language: String) {
    cpBmToursGroupDetail(groupCode: $groupCode, status: $status, language: $language) {
      groupCode
      tours {
        _id
        name
        startDate
        endDate
        price
      }
    }
  }
`;

export type CpBmToursGroupDetailVariables = {
  groupCode?: string;
  status?: string;
  language?: string;
};

export type CpBmToursGroupDetailData = {
  cpBmToursGroupDetail: TourGroup | null;
};
