import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeaderComponent } from '../../components/public-header/public-header.component';
import { PublicFooterComponent } from '../../components/public-footer/public-footer.component';

@Component({
  selector: 'public-layout',
  templateUrl: 'public-layout.html',
  styleUrls: ['public-layout.scss'],
  standalone: true,
  imports: [RouterOutlet, PublicHeaderComponent, PublicFooterComponent]
})
export class PublicLayout {

}
