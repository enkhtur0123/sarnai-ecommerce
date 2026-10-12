import { gql } from "@apollo/client";

export type TourCategory = {
  _id: string;
  name?: string;
  parentId?: string;
};

export const CP_BMS_TOUR_CATEGORIES = gql`
  query cpBmsTourCategories(
    $parentId: String
    $name: String
    $branchId: String
    $language: String
  ) {
    cpBmsTourCategories(
      parentId: $parentId
      name: $name
      branchId: $branchId
      language: $language
    ) {
      _id
      name
      parentId
    }
  }
`;

export type CpBmsTourCategoriesVariables = {
  parentId?: string;
  name?: string;
  branchId?: string;
  language?: string;
};

export type CpBmsTourCategoriesData = {
  cpBmsTourCategories: TourCategory[];
};
