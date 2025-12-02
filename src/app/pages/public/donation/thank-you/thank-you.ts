import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  imports: [CommonModule, RouterModule],
  templateUrl: './thank-you.html',
  styleUrl: './thank-you.scss',
})
export class ThankYou implements OnInit {
  referenceNumber: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Get reference number from query params
    this.route.queryParams.subscribe(params => {
      this.referenceNumber = params['ref'] || '';
    });
  }
}
