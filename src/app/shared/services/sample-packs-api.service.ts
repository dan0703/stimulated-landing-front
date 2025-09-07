import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { SamplePack, PaginationParams, PaginatedResponse } from '../interfaces/e-commerce.interface';

@Injectable({
  providedIn: 'root'
})
export class SamplePacksApiService {

  // Data mock completa para simular una base de datos
  private mockSamplePacks: SamplePack[] = [
    {
      id: '1',
      title: 'Dark Techno Essentials',
      artist: 'Stimulated',
      genre: 'Techno',
      price: 29.99,
      originalPrice: 39.99,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRhcmsgVGVjaG5vPC90ZXh0Pjwvc3ZnPg==',
      audioPreviewUrl: '',
      description: 'Deep and dark techno samples with industrial vibes',
      tags: ['Techno', 'Dark', 'Industrial', 'Underground'],
      bpm: 128,
      trackCount: 24,
      isNew: true,
      isFeatured: true,
      discount: 25
    },
    {
      id: '2',
      title: 'Melodic House Collection',
      artist: 'Stimulated',
      genre: 'House',
      price: 24.99,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwNjZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1lbG9kaWMgSG91c2U8L3RleHQ+PC9zdmc+',
      audioPreviewUrl: '',
      description: 'Emotional and uplifting melodic house samples',
      tags: ['House', 'Melodic', 'Progressive', 'Emotional'],
      bpm: 124,
      trackCount: 18,
      isNew: false,
      isFeatured: true
    },
    {
      id: '3',
      title: 'Ambient Textures',
      artist: 'Stimulated',
      genre: 'Ambient',
      price: 19.99,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwY2M2YSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFtYmllbnQ8L3RleHQ+PC9zdmc+',
      audioPreviewUrl: '',
      description: 'Atmospheric and cinematic ambient soundscapes',
      tags: ['Ambient', 'Cinematic', 'Atmospheric', 'Chill'],
      bpm: 90,
      trackCount: 15,
      isNew: false,
      isFeatured: false
    },
    {
      id: '4',
      title: 'Bass Heavy Drops',
      artist: 'Stimulated',
      genre: 'Bass',
      price: 34.99,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmNjk0NyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhc3MgRHJvcHM8L3RleHQ+PC9zdmc+',
      audioPreviewUrl: '',
      description: 'Massive bass drops and sub frequencies',
      tags: ['Bass', 'Dubstep', 'Heavy', 'Drops'],
      bpm: 140,
      trackCount: 30,
      isNew: true,
      isFeatured: true
    },
    // Agregando más items para simular una base de datos más grande
    {
      id: '5',
      title: 'Tropical House Vibes',
      artist: 'Stimulated',
      genre: 'House',
      price: 22.99,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmOTA0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRyb3BpY2FsPC90ZXh0Pjwvc3ZnPg==',
      audioPreviewUrl: '',
      description: 'Summer tropical house with steel drums and guitar',
      tags: ['House', 'Tropical', 'Summer', 'Chill'],
      bpm: 120,
      trackCount: 20,
      isNew: false,
      isFeatured: false
    },
    {
      id: '6',
      title: 'Industrial Techno Pack',
      artist: 'Stimulated',
      genre: 'Techno',
      price: 32.99,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzQ0NCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkluZHVzdHJpYWw8L3RleHQ+PC9zdmc+',
      audioPreviewUrl: '',
      description: 'Hard industrial techno with metal percussion',
      tags: ['Techno', 'Industrial', 'Hard', 'Metal'],
      bpm: 135,
      trackCount: 28,
      isNew: true,
      isFeatured: false
    },
    {
      id: '7',
      title: 'Chill Ambient Spaces',
      artist: 'Stimulated',
      genre: 'Ambient',
      price: 18.99,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2Y2NmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoaWxsPC90ZXh0Pjwvc3ZnPg==',
      audioPreviewUrl: '',
      description: 'Relaxing ambient textures for meditation',
      tags: ['Ambient', 'Chill', 'Meditation', 'Relaxing'],
      bpm: 75,
      trackCount: 12,
      isNew: false,
      isFeatured: false
    },
    {
      id: '8',
      title: 'Future Bass Elements',
      artist: 'Stimulated',
      genre: 'Bass',
      price: 28.99,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmMDA4OCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZ1dHVyZSBCYXNzPC90ZXh0Pjwvc3ZnPg==',
      audioPreviewUrl: '',
      description: 'Modern future bass with vocal chops and synths',
      tags: ['Bass', 'Future', 'Vocal', 'Modern'],
      bpm: 150,
      trackCount: 25,
      isNew: true,
      isFeatured: false
    }
  ];

  /**
   * Simula una llamada API para obtener sample packs con paginación
   */
  getSamplePacks(params: PaginationParams): Observable<PaginatedResponse<SamplePack>> {
    // Simular delay de red
    return of(this.simulatePaginatedResponse(params)).pipe(
      delay(300) // 300ms delay para simular latencia de red
    );
  }

  /**
   * Obtiene solo los packs destacados (featured)
   */
  getFeaturedPacks(): Observable<SamplePack[]> {
    const featured = this.mockSamplePacks.filter(pack => pack.isFeatured);
    return of(featured).pipe(delay(200));
  }

  /**
   * Simula la lógica de paginación del servidor
   */
  private simulatePaginatedResponse(params: PaginationParams): PaginatedResponse<SamplePack> {
    let filteredData = [...this.mockSamplePacks];

    // Filtrar por género si se especifica
    if (params.genre && params.genre !== 'All') {
      filteredData = filteredData.filter(pack => pack.genre === params.genre);
    }

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / params.pageSize);
    const startIndex = (params.page - 1) * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        currentPage: params.page,
        pageSize: params.pageSize,
        totalItems,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1
      }
    };
  }
}
