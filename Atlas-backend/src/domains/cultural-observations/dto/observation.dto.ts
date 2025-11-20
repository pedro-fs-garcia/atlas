export type CreateObservationDTO = {
  country_id: number;
  city_id?: number;
  observation: string;
};

export type UpdateObservationDTO = {
  city_id?: number;
  observation?: string;
};
