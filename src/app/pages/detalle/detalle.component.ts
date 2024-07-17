import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NasaImagesService } from 'src/app/services/nasa-images.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit {
  type = 'video';
  id = '';
  isLoading = true;

  title = '';
  description = '';
  center = '';
  keywords: string[] = [];
  photographer = '';
  secondaryCreator = '';
  urlVideo = '';
  urlImage = '';
  urlAudio = '';

  private readonly VIDEO_URL_PREFIX = 'https://images-assets.nasa.gov/video/';

  constructor(
    private nasaService: NasaImagesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type') || 'image';
      this.id = params.get('id') || '';
      this.getNasaDetail();
    });
  }

  getNasaDetail(): void {
    this.nasaService.getNasaDetail(this.id, this.type).subscribe(
      (data: any) => {
        this.description = data['AVAIL:Description'];
        this.title = data['AVAIL:Title'];
        this.center = data['AVAIL:Center'];
        this.keywords = data['AVAIL:Keywords'];
        this.photographer = data['AVAIL:Photographer'];
        this.secondaryCreator = data['AVAIL:SecondaryCreator'];

        this.urlVideo = `${this.VIDEO_URL_PREFIX}${this.id}/${this.id}~orig.mp4`;

        if (this.type === 'image') {
          this.urlImage = localStorage.getItem('mediaImage')?.toString() || '';
        } else if (this.type === 'audio') {
          this.nasaService.getNasaAudioDetail(this.id, this.type).subscribe(
            (audioData: any) => {
              this.urlAudio = audioData[0];
            },
            error => console.error('Error fetching audio data:', error)
          );
        }

        this.isLoading = false;
      },
      error => {
        console.error('Error fetching NASA detail:', error);
        this.isLoading = false;
      }
    );
  }
}
