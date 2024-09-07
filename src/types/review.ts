export interface Review {
    id: number;
    comfort: number;
    looks: number;
    reliability: number;
    comment: string;
    user: {
      id: number;
      username: string;
    };
  }