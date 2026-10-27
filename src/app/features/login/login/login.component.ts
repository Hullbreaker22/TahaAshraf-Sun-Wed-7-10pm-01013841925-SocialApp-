import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  errorMesage:WritableSignal<string> = signal('')
  private readonly router  = inject(Router)
  private readonly Database = inject(AuthService)
  loginForm:FormGroup = new FormGroup ({
    email: new FormControl ('',[Validators.required, Validators.email]) ,
    password: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)])
  })

  Login(){
    if(this.loginForm.valid){
       this.Database.Login(this.loginForm.value).subscribe({
        next:(res)=>{
           localStorage.setItem('SocialKey',res.data.token)  
           console.log(res.data.user);
           
           localStorage.setItem('SocialUser',JSON.stringify(res.data.user))  
           this.router.navigate(['/feeds']);
        },
        error:(err)=>{
          console.log(err);
           this.errorMesage.set(err.error.message) 
   
        }
       })     
    }else{
      this.loginForm.markAllAsTouched()
    }
  }

 

}
