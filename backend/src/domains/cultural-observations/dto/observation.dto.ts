export type CreateObservationDTO = {
  country_id: number;
  city?: string;
  observation: string;
};

export type UpdateObservationDTO = {
  city?: string;
  observation?: string;
};
