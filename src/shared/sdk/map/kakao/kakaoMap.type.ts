export interface Coordinate {
    lat: number;
    lng: number;
}

export interface MapViewProps extends Coordinate {
    onCenterChange?: (coordinate: Coordinate) => void;
}
export interface MapHandle {
    moveTo: (lat: number, lng: number) => void;
}
