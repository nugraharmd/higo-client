// summary
export interface GenderStat {
  _id: string;
  count: number;
}

export interface DataEntry {
  number: number;
  nameOfLocation: string;
  date: string;
  loginHour: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  noTelp: string;
  brandDevice: string;
  digitalInterest: string;
  locationType: string;
}

export interface SummaryResponse {
  genderStats: GenderStat[];
  data: {
    total: number;
    data: DataEntry[];
  };
}
