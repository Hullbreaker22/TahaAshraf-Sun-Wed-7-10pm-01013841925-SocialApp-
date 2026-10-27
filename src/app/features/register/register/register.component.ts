import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  isLoading:WritableSignal<boolean> = signal(false)
  errorMesage:WritableSignal<string> = signal('')
   private errorTimer: any = null;
  private  Database = inject(AuthService)
  private readonly routers = inject(Router)
  Registerform:FormGroup  = new FormGroup ({
    name: new FormControl (null,[Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Z][a-z]{2,}(?:\s[A-Z][a-z]{2,}){0,3}$/),]),

    username: new FormControl (null,[Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern(/^[a-z0-9_]{3,15}$/),]),

    email: new FormControl (null ,[Validators.required, Validators.email]),
    dateOfBirth: new FormControl (null,  [Validators.required]),
    gender: new FormControl (null,[Validators.required, Validators.pattern(/^(?:male|female)$/)]),
    password: new FormControl (null, [Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)]),
    rePassword: new FormControl(null, [
        Validators.required
    ])
  },{validators: this.confirmPass});


  confirmPass(theForm:AbstractControl){
    return theForm.get('password')?.value === theForm.get('rePassword')?.value ? null : {missmatch:true}
  }
  register():void{
    if(this.Registerform.valid){
      this.isLoading.set(true)
     this.Database.register(this.Registerform.value).pipe(
      finalize(() => {
        this.isLoading.set(false);
      })
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.routers.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
        this.errorMesage.set(err.error.message)
        if (this.errorTimer) {
         clearTimeout(this.errorTimer);
        }
        this.errorTimer = setTimeout(() => {
          this.errorMesage.set(''); 
        }, 4000);
      }
    });

  } else {
    this.Registerform.markAllAsTouched();
  }
    
  }
  
}
