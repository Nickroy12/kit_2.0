"use server";

import { serverMutation } from "./core/server";

export interface FinalCourseFormData {
  courseName: string;
  slug?: string;
  description: string;
  image: string;
  price: number;
  discount: number | null;
  discountEnabled?: boolean;
}

export interface courseResponse extends FinalCourseFormData {
  id?: string;
  _id?: string;
  createAt?: string;
}

export const addCourse = async (newCourse: FinalCourseFormData): Promise<courseResponse> => {
  return serverMutation<courseResponse>('/app/new_course', newCourse);
};