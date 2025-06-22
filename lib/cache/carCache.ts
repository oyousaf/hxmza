type Trim = {
  id: number;
  trim: string;
  bodyType: string;
};

export const trimCache = new Map<number, Trim[]>();
export const specCache = new Map<number, any>();
