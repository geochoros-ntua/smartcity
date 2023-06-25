export enum MapMode {
    street = 'street',
    stats = 'stats',
    sens = 'sens'
}

export enum TileLayerNames {
    OsmLayer = 'OSM',
    GosmLayer = 'GOSM',
    cartoDarkLayer = 'CARTODARK',
    ktimaNetLayer = "KTBASEMAP",
    none = 'NONE'
}

export enum VectorLayerNames {
    seq = 'mapillary_sequences',
    img = 'mapillary_images',
    point = 'mapillary_points',
    sens='sensors'
}

export enum StatTypes {
    number = 'number',
    class = 'class'
}

export enum StatLayers{
    audit_lines = 'Γραμμές πεζοδρομίων',
    street_lines = 'Γραμμές δρόμων',
    bus_stops = 'Στάσεις Λεωφορείων'
}
