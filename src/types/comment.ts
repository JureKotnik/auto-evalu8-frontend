export interface Comment {
    id: string;
    content: string;
    user: {
      id: string;
      username: string;
      // Add any other user fields you need
    };
    carId: string; // If you want to link back to the car
  }