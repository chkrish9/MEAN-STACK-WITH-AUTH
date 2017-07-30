import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.css']
})
export class PassportComponent implements OnInit {

  constructor(
    private authService:AuthService,
    private route: ActivatedRoute,
    private router:Router,
  ) { 
    this.route.params.subscribe((token: any) => {
      if (token) {
         this.authService.storeUserData(token.token, token.user);
         this.router.navigate(['home']);
      }
    });
  }

  ngOnInit() {
  }

}
