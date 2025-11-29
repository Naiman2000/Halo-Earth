export interface CoralSpecies {
    id?: string;
    scientificName: string;
    commonName: string;
    description: string;
    imageUrl?: string;
    conservationStatus: 'Least Concern' | 'Near Threatened' | 'Vulnerable' | 'Endangered' | 'Critically Endangered' | 'Extinct in the Wild' | 'Extinct';
}
