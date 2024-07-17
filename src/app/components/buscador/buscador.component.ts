import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { NasaApiResponse } from 'src/app/models/nasa-api-response';
import { NasaImagesService } from 'src/app/services/nasa-images.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html'
})
export class BuscadorComponent implements OnInit {

  searchTerm: string = '';
  filterImages: boolean = true;
  filterVideos: boolean = true;
  filterAudios: boolean = true;
  searchType: string = 'popular';

  popular: Data[] = [];
  recent: Data[] = [];
  originalData: Data[] = [];
  results: Data[] = [];
  displayedResults: Data[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  isLoading: boolean = false;

  constructor(private nasaService: NasaImagesService) {}

  ngOnInit(): void {
    this.loadData('popular');
  }

  loadData(type: string): void {
    this.isLoading = true;
    const serviceCall = type === 'popular' ? this.nasaService.getPopular() : this.nasaService.getRecent();
    serviceCall.subscribe((data: NasaApiResponse) => {
      this.originalData = data.collection.items;
      if (type === 'popular') {
        this.popular = this.originalData;
      } else {
        this.recent = this.originalData;
      }
      this.results = this.originalData;
      this.displayedResults = this.results.slice(0, this.itemsPerPage);
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  onSearchByType(): void {
    this.searchTerm = '';
    if (this.searchType === 'popular') {
      if (this.popular.length === 0) {
        this.loadData('popular');
      } else {
        this.updateResults(this.popular);
      }
    } else {
      if (this.recent.length === 0) {
        this.loadData('recent');
      } else {
        this.updateResults(this.recent);
      }
    }
  }

  onSearch(): void {
    if (!this.searchTerm) {
      return;
    }

    const mediaTypes = this.getMediaTypes();
    if (mediaTypes.length === 0) {
      return;
    }

    this.isLoading = true;
    this.nasaService.search(this.searchTerm, mediaTypes).subscribe((response: NasaApiResponse) => {
      this.updateResults(response.collection.items);
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  loadMore(): void {
    const nextPage = this.currentPage + 1;
    const startIndex = (nextPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedResults = this.displayedResults.concat(this.results.slice(startIndex, endIndex));
    this.currentPage = nextPage;
  }

  setDataToLocal = ( mediaType : string, info? : any ) => {
    if(mediaType === 'image'){
      localStorage.setItem('mediaImage', info);
    } else if(mediaType === 'audio'){
      localStorage.setItem('collectionAudio', info);
    }
  }

  private updateResults(data: Data[]): void {
    this.results = data;
    this.displayedResults = this.results.slice(0, this.itemsPerPage);
  }

  private getMediaTypes(): string[] {
    const mediaTypes = [];
    if (this.filterImages) mediaTypes.push('image');
    if (this.filterVideos) mediaTypes.push('video');
    if (this.filterAudios) mediaTypes.push('audio');
    return mediaTypes;
  }
}
