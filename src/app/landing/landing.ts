import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
landingForm!: FormGroup;
year = new Date().getFullYear();

constructor(
  private fb: FormBuilder,
  private router: Router
){
  this.landingForm=this.fb.group({
email: ['', [Validators.required, Validators.email]]
  });
}

  login(){
      this.router.navigate(['/login']);

  }

  getStarted(){
    this.router.navigate(['/signup'],{
queryParams: {email: this.landingForm.value.email}  //queryparams: we will take the email from url and pass the value

  });
  }

  reasons = [
    {
        title:'Enjoy on your TV',
        text: 'Match on smart TV, playstation',
        icon: 'tx'


    },

      {
        title:'Enjoy on your TV',
        text: 'Match on smart TV, playstation',
        icon: 'tx'


    },
      {
        title:'Enjoy on your TV',
        text: 'Match on smart TV, playstation',
        icon: 'tx'


    },
      {
        title:'Enjoy on your TV',
        text: 'Match on smart TV, playstation',
        icon: 'tx'


    }

  ]

  faqs =[
    {
question: '',
answer:''

    },

    {
question: '',
answer:''

    },
    {
question: '',
answer:''

    },
    {
question: '',
answer:''

    },
    {
question: '',
answer:''

    },
    {
question: '',
answer:''

    }

  ]

}
