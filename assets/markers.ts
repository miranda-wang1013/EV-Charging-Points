// marker.ts

export interface Marker {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
    name: string;
  }
  
  const evChargingPoints: Marker[] = [
    {
      latitude: 1.3521,
      longitude: 103.8198,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      name: "Orchard Road",
    },
    {
      latitude: 1.3139,
      longitude: 103.8594,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      name: "Marina Bay Sands",
    },
    {
      latitude: 1.3556,
      longitude: 103.9876,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      name: "Changi Airport",
    },
    {
      latitude: 1.3401,
      longitude: 103.7043,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      name: "Jurong East",
    },
    {
      latitude: 1.2903,
      longitude: 103.8558,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      name: "Singapore Flyer",
    },
  ];
  
  export default evChargingPoints;
  